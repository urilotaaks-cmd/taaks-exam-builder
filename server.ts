import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy/Shared Gemini client initialization
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined. Please set it in AI Studio Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Robust generation helper with model fallback and exponential backoff retry for 503 / 429 errors
const FALLBACK_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.1-pro-preview"
];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanJson(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

async function generateWithFallbackAndRetry(
  ai: GoogleGenAI,
  params: {
    contents: string;
    config?: any;
  }
): Promise<string> {
  let lastError: any = null;

  for (const model of FALLBACK_MODELS) {
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        const text = response.text;
        if (text) {
          return text;
        }
        throw new Error("Réponse vide reçue du modèle.");
      } catch (err: any) {
        lastError = err;
        const errMessage = err?.message || JSON.stringify(err);
        const isNotFound =
          err?.status === 404 ||
          errMessage.includes("404") ||
          errMessage.includes("NOT_FOUND") ||
          errMessage.includes("no longer available");

        if (isNotFound) {
          console.warn(`[Gemini] Model ${model} is not found / deprecated, switching to next model.`);
          break; // Skip retrying this model
        }

        const isTransient =
          err?.status === 503 ||
          err?.status === 429 ||
          errMessage.includes("503") ||
          errMessage.includes("429") ||
          errMessage.includes("high demand") ||
          errMessage.includes("UNAVAILABLE") ||
          errMessage.includes("RESOURCE_EXHAUSTED") ||
          errMessage.includes("Quota exceeded") ||
          errMessage.includes("FetchError") ||
          errMessage.includes("ECONNRESET");

        console.warn(`[Gemini Attempt ${attempt}/${maxRetries}] Model ${model} returned:`, errMessage);

        if (isTransient && attempt < maxRetries) {
          const waitTime = 1000 * attempt + Math.random() * 500;
          await sleep(waitTime);
        } else {
          break;
        }
      }
    }
  }

  // Generate a clear, friendly error description if quota or transient error occurred
  const lastMsg = lastError?.message || JSON.stringify(lastError);
  if (lastMsg.includes("429") || lastMsg.includes("RESOURCE_EXHAUSTED") || lastMsg.includes("Quota exceeded")) {
    throw new Error("La limite de requêtes (quota Gemini) a été temporairement atteinte. Veuillez patienter environ 30 à 60 secondes avant de relancer.");
  }
  if (lastMsg.includes("503") || lastMsg.includes("high demand") || lastMsg.includes("UNAVAILABLE")) {
    throw new Error("Le service d'IA connaît une forte demande temporaire. Veuillez patienter quelques instants et réessayer.");
  }

  throw lastError || new Error("Échec de communication avec le service d'IA.");
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "TAAK'S EXAM BUILDER", time: new Date().toISOString() });
});

// SYSTEM INSTRUCTION FOR TAAK'S EXAM BUILDER
const SYSTEM_INSTRUCTION = `Tu es TAAK'S EXAM BUILDER, assistant IA expert en ingénierie pédagogique et conception d'évaluations scolaires pour l'enseignement secondaire général, parfaitement aligné sur les programmes officiels et référentiels du Ministère des Enseignements Secondaires du Cameroun (MINESEC : https://www.minesec.gov.cm) et l'Approche Par Compétences avec entrée par les situations de vie (APC).

Ta mission : transformer la conception d'évaluations en un processus rigoureux, équitable et prêt à l'emploi :
DOCUMENTS DE RÉFÉRENCE + PARAMÈTRES -> ANALYSE PÉDAGOGIQUE -> ÉPREUVE CONFORME APC + BARÈME STRICT + CORRIGÉ DÉTAILLÉ -> CONTRÔLE QUALITÉ 5D -> EXPORT WORD / PDF.

RÈGLES PÉDAGOGIQUES ET CONFORMITÉ MINESEC CAMEROUN :
1. COUVERTURE COMPLÈTE DE TOUTES LES CLASSES ET MATIÈRES :
   - Premier Cycle : 6ème (Observation), 5ème (Observation), 4ème (Orientation), 3ème (Préparation BEPC).
   - Second Cycle : Seconde (A, C, SES, TI), Première (A, ABI, C, D, TI, SES - Probatoire), Terminale (A4, ABI, C, D, TI, SES - Baccalauréat).
   - Matières : Mathématiques, Physique-Chimie-Technologie (PCT), SVTEEHB (Sciences de la Vie et de la Terre, Éducation à l'Environnement, Hygiène et Biotechnologie), Informatique & TIC/TI, Français/Lettres, Histoire-Géographie-ECM (Éducation à la Citoyenneté et à la Morale), Philosophie, Anglais/Bilingual Training, SES/Économie, Espagnol/Allemand (LV2).

2. STRUCTURE DE L'ÉPREUVE EN CONTEXTE APC (APPROCHE PAR COMPÉTENCES) :
   L'épreuve est généralement structurée en deux parties complémentaires :
   - PARTIE 1 : ÉVALUATION DES RESSOURCES (généralement 10 à 12 points) :
     Vérification de l'acquisition des savoirs, définitions, formules, calculs fondamentaux, questions d'application directe, QCM ou petits exercices méthodologiques indépendants.
   - PARTIE 2 : ÉVALUATION DES COMPÉTENCES / AGIR COMPÉTENT (généralement 8 à 10 points) :
     Mise en situation de vie réelle contextualisée (ex: aménagement territorial au Cameroun, gestion de budget, santé/hygiène, électricité domestique, problématique économique ou sociétale). Structurée en 2 à 3 tâches indépendantes et progressives résolvant la situation-problème.

3. RESPECT STRICT DES RÉFÉRENCES :
   - Mode avec documents : S'appuyer strictement sur les cours, notations et fiches fournis. Aucune notion hors programme.
   - Mode sans documents : Mobiliser les programmes et exigences officielles du MINESEC Cameroun pour le niveau et la matière demandés.

4. BARÈME ARITHMÉTIQUEMENT STRICT :
   - La somme arithmétique de toutes les questions et sous-questions DOIT être rigoureusement égale au total demandé (ex: 20 points).

5. SÉPARATION TOTALE DU SUJET ET DU CORRIGÉ :
   - SUJET ÉLÈVE : Zéro réponse, énoncés limpides, contextes réalistes, barème explicite par question entre crochets.
   - CORRIGÉ ENSEIGNANT : Réponses modèles complètes étape par étape, démarches de calcul, critères d'attribution des points partiels (pour distinguer démarche partielle vs résultat final exact).`;

// Schema for structured exam output
const EXAM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Titre complet de l'évaluation (ex: Devoir Surveillé n°1 - Bases de Données)" },
    academicHeader: {
      type: Type.OBJECT,
      properties: {
        schoolName: { type: Type.STRING },
        academicYear: { type: Type.STRING },
        examTitle: { type: Type.STRING },
        gradeAndSubject: { type: Type.STRING },
        duration: { type: Type.STRING },
        coefficient: { type: Type.STRING },
        date: { type: Type.STRING },
        instructions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Consignes générales (ex: Calculatrice autorisée, Clarté de la rédaction)"
        }
      },
      required: ["schoolName", "academicYear", "examTitle", "gradeAndSubject", "duration", "date", "instructions"]
    },
    analysis: {
      type: Type.OBJECT,
      properties: {
        evaluatedConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
        excludedConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
        skillsBreakdown: { type: Type.STRING },
        progressionRationale: { type: Type.STRING }
      },
      required: ["evaluatedConcepts", "excludedConcepts", "skillsBreakdown", "progressionRationale"]
    },
    exercises: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          number: { type: Type.INTEGER },
          title: { type: Type.STRING },
          contextOrIntro: { type: Type.STRING, description: "Énoncé contextuel, situation problème, tableau ou document d'introduction" },
          totalPoints: { type: Type.NUMBER, description: "Total des points pour cet exercice" },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                number: { type: Type.STRING, description: "Numérotation (ex: '1.', '2.a', '2.b')" },
                text: { type: Type.STRING, description: "Énoncé précis de la question" },
                points: { type: Type.NUMBER, description: "Barème précis alloué à cette question" },
                taxonomy: { 
                  type: Type.STRING, 
                  description: "connaissance | comprehension | application | analyse | raisonnement" 
                },
                expectedAnswer: { type: Type.STRING, description: "Réponse attendue complète et rigoureuse" },
                solutionMethod: { type: Type.STRING, description: "Démarche ou méthode de résolution étape par étape" },
                partialCreditCriteria: { type: Type.STRING, description: "Règle d'attribution des points partiels vs complets" },
                explanation: { type: Type.STRING, description: "Commentaire ou piège fréquent à surveiller" }
              },
              required: ["number", "text", "points", "expectedAnswer", "partialCreditCriteria"]
            }
          }
        },
        required: ["number", "title", "totalPoints", "questions"]
      }
    }
  },
  required: ["title", "academicHeader", "analysis", "exercises"]
};

// 0. AUTO-EXTRACTION OF THE 7 ESSENTIAL CRITERIA FROM DOCUMENTS
app.post("/api/exam/extract-params", async (req, res) => {
  try {
    const { documents, currentParameters } = req.body;
    const ai = getGeminiClient();

    if (!documents || documents.length === 0) {
      return res.json({
        success: true,
        extracted: currentParameters || {},
        missingFields: ["subject", "gradeLevel", "chapterTheme"],
        foundInDocs: [],
        message: "Aucun document fourni. Renseignez les 7 critères essentiels."
      });
    }

    const prompt = `Tu es l'assistant pédagogique TAAK'S EXAM BUILDER.
Analyse les documents de référence fournis pour extraire automatiquement les 7 critères essentiels d'évaluation :
1. Matière (subject)
2. Classe / niveau (gradeLevel)
3. Chapitre ou thème précis (chapterTheme)
4. Type d'évaluation recommandé (evaluationType : 'devoir_surveille' | 'controle' | 'interrogation' | 'exercice_application' | 'examen_blanc' | 'sujet_type_examen' | 'serie_exercices')
5. Durée estimée (duration)
6. Barème total cible (totalPoints: number)
7. Difficulté (difficulty : 'progressif' | 'standard' | 'facile' | 'renforce' | 'differencie')

RÈGLE : Ne demande JAMAIS à l'enseignant des informations déjà présentes dans les documents. Détecte ce qui est certain et isole les champs indispensables manquants.

DOCUMENTS :
${documents.map((d: any, i: number) => `[Doc ${i + 1} - ${d.title}]:\n${d.content}`).join("\n\n")}

Fournis un JSON avec cette structure exacte :
{
  "extracted": {
    "subject": "string ou vide",
    "gradeLevel": "string ou vide",
    "chapterTheme": "string ou vide",
    "evaluationType": "devoir_surveille",
    "duration": "2h",
    "totalPoints": 20,
    "difficulty": "progressif",
    "schoolName": "string ou vide"
  },
  "foundInDocs": ["Matière détectée: ...", "Niveau détecté: ...", "Chapitre détecté: ..."],
  "missingFields": ["subject", "gradeLevel", "chapterTheme"],
  "summary": "Résumé concis des éléments identifiés."
}`;

    const text = await generateWithFallbackAndRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(cleanJson(text));
    res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error("Error in /api/exam/extract-params:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur d'extraction" });
  }
});

// 1. ANALYZE DOCUMENTS & PARAMETERS
app.post("/api/exam/analyze", async (req, res) => {
  try {
    const { parameters, documents } = req.body;
    const ai = getGeminiClient();

    const prompt = `Effectue une analyse pédagogique préalable avant conception d'évaluation selon le cahier des charges TAAK'S EXAM BUILDER.
Paramètres demandés :
${JSON.stringify(parameters, null, 2)}

Documents de référence fournis :
${documents && documents.length > 0 
  ? documents.map((d: any) => `=== [${d.type.toUpperCase()}] ${d.title} ===\n${d.content}`).join("\n\n") 
  : "Aucun document spécifique fourni - Se baser sur les programmes scolaires officiels correspondants."}

Analyse spécifiquement :
1. Notions prioritaires et compétences visées
2. Notions à exclure impérativement (hors programme/non étudiées)
3. Structure recommandée (nombre d'exercices, équilibre barème pour ${parameters.totalPoints || 20} points)
4. Diagnostic : Vérifie si des informations essentielles manquent et formule des questions ciblées le cas échéant.
5. Recommandations de style et typologie de questions adaptée au niveau ${parameters.gradeLevel || 'spécifié'}.`;

    const text = await generateWithFallbackAndRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            canProceed: { type: Type.BOOLEAN, description: "True si les informations sont suffisantes" },
            missingInfoQuestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Questions ciblées si des informations indispensables manquent" 
            },
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            excludedConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            proposedStructure: {
              type: Type.OBJECT,
              properties: {
                exerciseCount: { type: Type.INTEGER },
                pointsDistribution: { type: Type.STRING },
                progressionSummary: { type: Type.STRING }
              },
              required: ["exerciseCount", "pointsDistribution", "progressionSummary"]
            },
            pedagogicalAdvice: { type: Type.STRING }
          },
          required: ["canProceed", "missingInfoQuestions", "keyConcepts", "excludedConcepts", "proposedStructure", "pedagogicalAdvice"]
        }
      }
    });

    const parsed = JSON.parse(cleanJson(text));
    res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error("Error in /api/exam/analyze:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur lors de l'analyse" });
  }
});

// 2. GENERATE COMPLETE EXAM + BARÈME + CORRIGÉ
app.post("/api/exam/generate", async (req, res) => {
  try {
    const { parameters, documents } = req.body;
    const ai = getGeminiClient();

    const targetPoints = Number(parameters.totalPoints) || 20;
    const hasDocs = documents && documents.length > 0;

    const prompt = `Génère une évaluation scolaire complète, son barème strict et son corrigé détaillé conformément au rôle de TAAK'S EXAM BUILDER (AI TAAK'S INCUBATOR).

PARAMÈTRES IMPÉRATIFS SAISIS PAR L'ENSEIGNANT (PRIORITÉ ABSOLUE SUR TOUT AUTRE DOCUMENT) :
- Matière / Discipline : ${parameters.subject}
- Classe / Niveau : ${parameters.gradeLevel}
- Chapitre / Thème précis : ${parameters.chapterTheme}
- Coefficient officiel : ${parameters.coefficient || 1}
- Date / Période de l'évaluation : ${parameters.evaluationDate || 'Évaluation Séquentielle'}
- Année scolaire : ${parameters.schoolYear || '2025 - 2026'}
- Nom de l'établissement : ${parameters.schoolName || 'Établissement Scolaire'}
- Type d'évaluation : ${parameters.evaluationType}
- Durée de l'épreuve : ${parameters.duration}
- TOTAL DES POINTS : EXACTEMENT ${targetPoints} POINTS (La somme arithmétique de TOUS les points de TOUTES les questions DOIT être rigoureusement égale à ${targetPoints})
- Nombre d'exercices / parties : ${parameters.exerciseCount || (parameters.exerciseBreakdown ? parameters.exerciseBreakdown.length : 2)}
${parameters.exerciseBreakdown && parameters.exerciseBreakdown.length > 0 ? `- STRUCTURE ET BARÈME STRICT PAR EXERCICE DÉFINI PAR L'ENSEIGNANT (TU DOIS CRÉER EXACTEMENT CE NOMBRE D'EXERCICES ET CE TOTAL DE POINTS PAR EXERCICE) :
${parameters.exerciseBreakdown.map((eb: any, i: number) => `  * Exercice ${i + 1} : "${eb.title || `Exercice ${i + 1}`}" -> EXACTEMENT ${eb.points} points`).join('\n')}` : ''}
- Niveau de difficulté : ${parameters.difficulty}
- Compétences prioritaires : ${parameters.competencies || 'Conformes aux exigences officielles du niveau'}
- Consignes spécifiques : ${parameters.specialInstructions || 'Rédaction soignée et démarche justifiée'}

MODE DE CONCEPTION :
${hasDocs ? `[MODE 1 : CONFORMITÉ DOCUMENTAIRE AVEC PRIORITÉ ABSOLUE AUX PARAMÈTRES]
Des documents de référence ont été fournis par l'enseignant.
ATTENTION CRITIQUE : Tu DOIS impérativement et sans exception générer l'épreuve sur la matière "${parameters.subject}", la classe "${parameters.gradeLevel}" et le chapitre "${parameters.chapterTheme}".
1. Si les documents fournis portent sur ce domaine, inspire-toi strictement de leurs exercices, définitions et démarches.
2. Si les documents portent sur une autre discipline ou un ancien sujet, utilise-les comme modèle de structure pédagogique APC mais traite EXCLUSIVEMENT le thème demandé "${parameters.subject} - ${parameters.chapterTheme} (${parameters.gradeLevel})".

DOCUMENTS DE RÉFÉRENCE FOURNIS :
${documents.map((d: any, idx: number) => `=== [DOC ${idx + 1} - ${d.type.toUpperCase()}] ${d.title} ===\n${d.content}`).join("\n\n")}` : `[MODE 2 : CONCEPTION EXPERTE IA BASÉE SUR LES PROGRAMMES SCOLAIRES OFFICIELS DU MINESEC]
Aucun document spécifique n'a été fourni par l'enseignant.
En tant qu'IA d'excellence en ingénierie pédagogique :
1. Mobilise l'intégralité du programme scolaire officiel correspondant à la matière "${parameters.subject}" et à la classe "${parameters.gradeLevel}".
2. Cible précisément le chapitre "${parameters.chapterTheme}" avec des situations concrètes, des énoncés stimulants et une rigueur méthodologique irréprochable.
3. Respecte scrupuleusement la durée (${parameters.duration}) et le barème total (${targetPoints} points).`}

EXIGENCES PÉDAGOGIQUES MAJEURES :
1. SUJET ÉLÈVE : Énoncés clairs, précis, aucune ambiguïté, documents/tableaux/contextes riches. Présentation soignée prête à distribuer.
2. BARÈME STRICT : Chaque question et sous-question a un barème explicite entre crochets (ex: [2 pts], [0,5 pt]). La somme de tous les points de toutes les questions DOIT FAIRE TRÈS EXACTEMENT ${targetPoints}.
3. CORRIGÉ ENSEIGNANT DÉTAILLÉ : Réponse modèle pas-à-pas, méthode employée, critères d'attribution des points partiels détaillant ce qui rapporte x points vs y points pour chaque question.`;

    const text = await generateWithFallbackAndRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: EXAM_SCHEMA
      }
    });

    const parsed = JSON.parse(cleanJson(text));

    // Arithmetic validation of total points
    let calculatedTotal = 0;
    const formattedExercises = (parsed.exercises || []).map((ex: any, exIdx: number) => {
      let exTotal = 0;
      const formattedQuestions = (ex.questions || []).map((q: any, qIdx: number) => {
        const pts = Number(q.points) || 1;
        exTotal += pts;
        return {
          id: `q-${exIdx + 1}-${qIdx + 1}`,
          number: q.number || `${qIdx + 1}.`,
          text: q.text,
          points: pts,
          taxonomy: q.taxonomy || "application",
          expectedAnswer: q.expectedAnswer,
          solutionMethod: q.solutionMethod || "",
          partialCreditCriteria: q.partialCreditCriteria || "",
          explanation: q.explanation || ""
        };
      });
      calculatedTotal += exTotal;
      return {
        id: `ex-${exIdx + 1}`,
        number: ex.number || exIdx + 1,
        title: ex.title,
        contextOrIntro: ex.contextOrIntro || "",
        totalPoints: exTotal,
        questions: formattedQuestions
      };
    });

    const finalAcademicHeader = {
      schoolName: parameters.schoolName || parsed.academicHeader?.schoolName || "Lycée Général de Yaoundé",
      academicYear: parameters.schoolYear || parsed.academicHeader?.academicYear || "2025 - 2026",
      examTitle: parameters.examSessionTitle || parsed.title || parsed.academicHeader?.examTitle || `${parameters.subject} - ${parameters.chapterTheme}`,
      gradeAndSubject: `${parameters.gradeLevel} — ${parameters.subject}`,
      duration: parameters.duration || parsed.academicHeader?.duration || "2 heures",
      coefficient: parameters.coefficient ? `Coeff. ${parameters.coefficient}` : (parsed.academicHeader?.coefficient || "Coeff. 1"),
      date: parameters.evaluationDate || parsed.academicHeader?.date || "Date de l'évaluation",
      instructions: (parsed.academicHeader?.instructions && parsed.academicHeader.instructions.length > 0)
        ? parsed.academicHeader.instructions
        : [
            parameters.specialInstructions || "L'usage de la calculatrice est soumis aux consignes officielles.",
            "La qualité de la rédaction, la clarté et la précision des démarches seront prises en compte."
          ],
      headerStyle: parameters.headerStyle || "officiel_minesec",
      countryHeaderFr: parameters.countryHeaderFr || "RÉPUBLIQUE DU CAMEROUN\nPaix - Travail - Patrie",
      countryHeaderEn: parameters.countryHeaderEn || "REPUBLIC OF CAMEROON\nPeace - Work - Fatherland",
      ministryHeaderFr: parameters.ministryHeaderFr || "MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES",
      ministryHeaderEn: parameters.ministryHeaderEn || "MINISTRY OF SECONDARY EDUCATION",
      regionalDelegation: parameters.regionalDelegation || "Délégation Régionale du Centre",
      departmentalDelegation: parameters.departmentalDelegation || "Délégation Départementale du Mfoundi",
      departmentOrSubject: parameters.departmentOrSubject || (parameters.subject ? `Département de ${parameters.subject}` : "Département Pédagogique"),
      teacherName: parameters.teacherName || "M. le Professeur",
      showStudentCartouche: parameters.showStudentCartouche ?? true,
      showTableNumber: parameters.showTableNumber ?? true,
      showCompetencyAppreciation: parameters.showCompetencyAppreciation ?? true,
      showParentSignature: parameters.showParentSignature ?? true,
      schoolLogo: parameters.schoolLogo,
      schoolLogoPosition: parameters.schoolLogoPosition || "center",
      schoolLogoSize: parameters.schoolLogoSize || "medium",
      showSchoolLogo: parameters.showSchoolLogo ?? true,
    };

    const evaluation = {
      id: `exam-${Date.now()}`,
      version: "A" as const,
      title: parsed.title || `${parameters.subject} - ${parameters.chapterTheme}`,
      parameters,
      academicHeader: finalAcademicHeader,
      analysis: parsed.analysis || {
        evaluatedConcepts: [parameters.chapterTheme],
        excludedConcepts: [],
        skillsBreakdown: "Évaluation standardisée des compétences du chapitre.",
        progressionRationale: "Progression de la restitution des savoirs vers la résolution de problème."
      },
      exercises: formattedExercises,
      calculatedTotalPoints: calculatedTotal,
      targetTotalPoints: targetPoints,
      isBaremeValid: Math.abs(calculatedTotal - targetPoints) < 0.01,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({ success: true, evaluation });
  } catch (error: any) {
    console.error("Error in /api/exam/generate:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur lors de la génération de l'évaluation" });
  }
});

// 3. GENERATE ALTERNATE VARIANT (Sujet B)
app.post("/api/exam/variante", async (req, res) => {
  try {
    const { originalEvaluation, variantNote } = req.body;
    const ai = getGeminiClient();

    const prompt = `Génère une VARIANTE STRICTEMENT ÉQUIVALENTE (Sujet B) de l'évaluation suivante selon la règle 10 du cahier des charges TAAK'S EXAM BUILDER.

RÈGLE DES VARIANTES :
- MÊMES objectifs pédagogiques
- MÊME niveau d'exigence et difficulté
- MÊME barème total (${originalEvaluation.targetTotalPoints} points) et même répartition par question
- MÊME structure générale
- MAIS MODIFIER : les données numériques, les contextes de mise en situation, les exemples concrets, les formulations et valeurs pour éviter la triche tout en garantissant une équité parfaite.

Sujet d'origine (Sujet A) :
${JSON.stringify(originalEvaluation, null, 2)}

Note spécifique de l'enseignant : ${variantNote || "Créer une variante B avec des données et contextes renouvelés."}`;

    const text = await generateWithFallbackAndRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: EXAM_SCHEMA
      }
    });

    const parsed = JSON.parse(cleanJson(text));

    let calculatedTotal = 0;
    const formattedExercises = (parsed.exercises || []).map((ex: any, exIdx: number) => {
      let exTotal = 0;
      const formattedQuestions = (ex.questions || []).map((q: any, qIdx: number) => {
        const pts = Number(q.points) || 1;
        exTotal += pts;
        return {
          id: `q-b-${exIdx + 1}-${qIdx + 1}`,
          number: q.number || `${qIdx + 1}.`,
          text: q.text,
          points: pts,
          taxonomy: q.taxonomy || "application",
          expectedAnswer: q.expectedAnswer,
          solutionMethod: q.solutionMethod || "",
          partialCreditCriteria: q.partialCreditCriteria || "",
          explanation: q.explanation || ""
        };
      });
      calculatedTotal += exTotal;
      return {
        id: `ex-b-${exIdx + 1}`,
        number: ex.number || exIdx + 1,
        title: ex.title,
        contextOrIntro: ex.contextOrIntro || "",
        totalPoints: exTotal,
        questions: formattedQuestions
      };
    });

    const variantEvaluation = {
      ...originalEvaluation,
      id: `exam-variant-${Date.now()}`,
      version: "B" as const,
      title: `${originalEvaluation.title} (Sujet B - Variante)`,
      academicHeader: {
        ...originalEvaluation.academicHeader,
        examTitle: `${originalEvaluation.academicHeader.examTitle} — SUJET B`
      },
      exercises: formattedExercises,
      calculatedTotalPoints: calculatedTotal,
      targetTotalPoints: originalEvaluation.targetTotalPoints,
      isBaremeValid: Math.abs(calculatedTotal - originalEvaluation.targetTotalPoints) < 0.01,
      updatedAt: new Date().toISOString()
    };

    res.json({ success: true, evaluation: variantEvaluation });
  } catch (error: any) {
    console.error("Error in /api/exam/variante:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur lors de la génération de la variante" });
  }
});

// 4. QUICK COMMAND EXECUTION (/simplifier, /approfondir, /adapter, /ameliorer, /bareme, /corrige)
app.post("/api/exam/command", async (req, res) => {
  try {
    const { evaluation, command, extraPrompt } = req.body;
    const ai = getGeminiClient();

    let instructionDetails = "";
    switch (command) {
      case "/simplifier":
        instructionDetails = "SIMPLIFICATION : Rendre le sujet plus accessible sans perdre la rigueur. Découper les questions complexes en sous-questions guidées, ajouter des aides méthodologiques ou indices légers, simplifier les données numériques tout en conservant le barème total.";
        break;
      case "/approfondir":
        instructionDetails = "APPROFONDISSEMENT : Augmenter l'exigence intellectuelle. Proposer des questions plus ouvertes, des situations non guidées, des problèmes de synthèse ou d'analyse critique pour élèves avancés, tout en conservant le barème total.";
        break;
      case "/adapter":
        instructionDetails = `ADAPTATION : Adapter le sujet au niveau ou public précisé dans les instructions (${extraPrompt || 'niveau différencié'}), en ajustant le vocabulaire, la vitesse de travail attendue et la complexité des énoncés.`;
        break;
      case "/ameliorer":
        instructionDetails = "AMÉLIORATION CONTINUE : Supprimer toute ambiguïté rédactionnelle, clarifier les verbes de consigne (ex: 'Calculer', 'Justifier', 'Démontrer', 'Déduire'), rendre la mise en page et les contextes impeccables.";
        break;
      case "/bareme":
        instructionDetails = `RÉAJUSTEMENT DU BARÈME : Recalculer et redistribuer rigoureusement les points pour que la somme totale soit TRÈS EXACTEMENT de ${evaluation.targetTotalPoints} points. Pondérer équitablement selon la difficulté et le temps nécessaire pour chaque question.`;
        break;
      case "/corrige":
        instructionDetails = "ENRICHISSEMENT DU CORRIGÉ : Détailler au maximum chaque réponse pour l'enseignant, avec les étapes de calcul, les critères de notation partiels (ce qui vaut 0.25, 0.5, 1 pt), et les erreurs classiques d'élèves à anticiper.";
        break;
      default:
        instructionDetails = `APPLICATION DE LA DEMANDE : ${extraPrompt || 'Optimiser le sujet selon les standards TAAK\'S EXAM BUILDER.'}`;
    }

    const prompt = `Tu dois modifier et actualiser l'évaluation ci-dessous en exécutant la commande rapide : ${command}.
Instruction de modification :
${instructionDetails}
${extraPrompt ? `Instructions complémentaires : ${extraPrompt}` : ''}

Évaluation actuelle :
${JSON.stringify(evaluation, null, 2)}`;

    const text = await generateWithFallbackAndRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: EXAM_SCHEMA
      }
    });

    const parsed = JSON.parse(cleanJson(text));

    let calculatedTotal = 0;
    const formattedExercises = (parsed.exercises || []).map((ex: any, exIdx: number) => {
      let exTotal = 0;
      const formattedQuestions = (ex.questions || []).map((q: any, qIdx: number) => {
        const pts = Number(q.points) || 1;
        exTotal += pts;
        return {
          id: `q-cmd-${exIdx + 1}-${qIdx + 1}`,
          number: q.number || `${qIdx + 1}.`,
          text: q.text,
          points: pts,
          taxonomy: q.taxonomy || "application",
          expectedAnswer: q.expectedAnswer,
          solutionMethod: q.solutionMethod || "",
          partialCreditCriteria: q.partialCreditCriteria || "",
          explanation: q.explanation || ""
        };
      });
      calculatedTotal += exTotal;
      return {
        id: `ex-cmd-${exIdx + 1}`,
        number: ex.number || exIdx + 1,
        title: ex.title,
        contextOrIntro: ex.contextOrIntro || "",
        totalPoints: exTotal,
        questions: formattedQuestions
      };
    });

    const updatedEvaluation = {
      ...evaluation,
      title: parsed.title || evaluation.title,
      academicHeader: parsed.academicHeader || evaluation.academicHeader,
      analysis: parsed.analysis || evaluation.analysis,
      exercises: formattedExercises,
      calculatedTotalPoints: calculatedTotal,
      isBaremeValid: Math.abs(calculatedTotal - evaluation.targetTotalPoints) < 0.01,
      updatedAt: new Date().toISOString()
    };

    res.json({ success: true, evaluation: updatedEvaluation });
  } catch (error: any) {
    console.error("Error in /api/exam/command:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur lors de l'exécution de la commande" });
  }
});

// 5. QUALITY CONTROL AUDIT (CONTRÔLE QUALITÉ 5D)
app.post("/api/exam/quality-check", async (req, res) => {
  try {
    const { evaluation, documents } = req.body;
    const ai = getGeminiClient();

    const prompt = `Effectue un CONTRÔLE QUALITÉ 5D COMPLET et rigoureux sur l'évaluation scolaire suivante selon la règle 14 de TAAK'S EXAM BUILDER.

LES 5 DIMENSIONS D'AUDIT :
1. Vérification Pédagogique (Niveau adapté, notions étudiées, objectifs respectés, difficulté cohérente, questions compréhensibles sans ambiguïté).
2. Vérification Technique (Calculs exacts, données mathématiques/scientifiques/textuelles cohérentes, réponses modèles vérifiées, aucune contradiction).
3. Vérification du Barème (Total exact = ${evaluation.targetTotalPoints}, chaque question correctement pondérée, corrigé rigoureusement conforme au barème).
4. Vérification Documentaire (Respect strict des documents fournis, aucune notion inventée hors-programme).
5. Vérification de Présentation (Structure claire, numérotation sans faille, sujet et corrigé parfaitement séparés).

ÉVALUATION À AUDITER :
${JSON.stringify(evaluation, null, 2)}

DOCUMENTS DE RÉFÉRENCE :
${documents && documents.length > 0 
  ? documents.map((d: any) => `=== [${d.type.toUpperCase()}] ${d.title} ===\n${d.content}`).join("\n\n") 
  : "Programme officiel standard."}

Retourne un audit détaillé avec note sur 100 pour chaque dimension, score global, liste des points de contrôle avec statut ('pass' | 'warning' | 'fail'), points forts et recommandations concrètes.`;

    const text = await generateWithFallbackAndRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pedagogicalScore: { type: Type.NUMBER },
            technicalScore: { type: Type.NUMBER },
            rubricScore: { type: Type.NUMBER },
            documentaryScore: { type: Type.NUMBER },
            presentationScore: { type: Type.NUMBER },
            overallScore: { type: Type.NUMBER },
            checklist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "pedagogique | technique | bareme | documentaire | presentation" },
                  item: { type: Type.STRING },
                  status: { type: Type.STRING, description: "pass | warning | fail" },
                  comment: { type: Type.STRING }
                },
                required: ["category", "item", "status"]
              }
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["pedagogicalScore", "technicalScore", "rubricScore", "documentaryScore", "presentationScore", "overallScore", "checklist", "strengths", "recommendations"]
        }
      }
    });

    const qualityCheck = JSON.parse(cleanJson(text));
    res.json({ success: true, qualityCheck });
  } catch (error: any) {
    console.error("Error in /api/exam/quality-check:", error);
    res.status(500).json({ success: false, error: error.message || "Erreur lors du contrôle qualité" });
  }
});

// Vite middleware setup (development vs production)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TAAK'S EXAM BUILDER server running on port ${PORT}`);
  });
}

export default app;
