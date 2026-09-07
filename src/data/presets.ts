import { ReferenceDocument, ExamParameters, ExerciseBreakdownConfig } from '../types';

export const SAMPLE_REFERENCE_DOCUMENTS: ReferenceDocument[] = [
  {
    id: 'ref-minesec-math-3e',
    title: 'MINESEC APC 3ème — Mathématiques (Propriété de Thalès & Équations)',
    type: 'cours',
    dateAdded: '2025-09-15',
    content: `RÉPUBLIQUE DU CAMEROUN - MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES (MINESEC)
PROGRAMME OFFICIEL D'ÉTUDES DE MATHÉMATIQUES — CLASSE DE 3ÈME (APC / BEPC)

DOMAINE 1 : TRAVAUX NUMÉRIQUES
1. Racines carrées et calculs avec radicaux dans R.
2. Équations et inéquations du premier degré dans R.
3. Systèmes de deux équations du premier degré à deux inconnues (résolution par substitution et combinaison linéaire).
4. Fonctions affines et linéaires : définition, coefficient directeur, représentation graphique et modélisation.

DOMAINE 2 : TRAVAUX GÉOMÉTRIQUES
1. Propriété de Thalès dans le triangle et sa réciproque.
2. Trigonométrie dans le triangle rectangle (sinus, cosinus, tangente).
3. Vecteurs et repérage cartésien orthonormé (calcul de coordonnées et de distances).

CADRE ÉVALUATIF APC :
- Partie A : Évaluation des Ressources (10 points : savoirs fondamentaux, calculs et théorèmes).
- Partie B : Évaluation des Compétences (10 points : Situation de vie courante camerounaise — Devis d'un menuisier/maçon, calcul de surfaces et répartition budgétaire, découpée en 3 tâches indépendantes).`
  },
  {
    id: 'ref-minesec-pct-4e',
    title: 'MINESEC 4ème — Physique-Chimie-Technologie (Combustions & Énergie Électrique)',
    type: 'pedagogique',
    dateAdded: '2025-10-01',
    content: `MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES (MINESEC) — CAMEROUN
PROGRAMME DE PHYSIQUE, CHIMIE ET TECHNOLOGIE (PCT) — CLASSE DE 4ÈME

CHIMIE :
- Molécules et atomes, symboles chimiques usuels (C, H, O, N, Fe, Cu, Al).
- Combustion du carbone et du méthane : réactifs, produits (CO2, H2O), notion d'oxydation et équation-bilan.
- Dangers du monoxyde de carbone (CO) et mesures de prévention dans les cuisines et habitations.

PHYSIQUE :
- Poids et masse d'un corps : relation P = m x g (g = 9,8 N/kg ou 10 N/kg).
- Énergie électrique : Tension (U en Volts), intensité (I en Ampères), loi d'Ohm (U = R x I) et mesure au multimètre.
- Puissance et sécurité domestique : rôle des disjoncteurs et fusibles.`
  },
  {
    id: 'ref-minesec-tle-c-physique',
    title: 'MINESEC Terminale C & D — Physique (Mécanique de Newton & Champ de Pesanteur)',
    type: 'cours',
    dateAdded: '2025-10-20',
    content: `MINESEC — ENSEIGNEMENT SECONDAIRE GÉNÉRAL (BACCALAURÉAT SÉRIES C & D)
PROGRAMME OFFICIEL DE PHYSIQUE — CLASSE DE TERMINALE C / D

MODULE : MÉCANIQUE NEWTONIENNE ET MOUVEMENT DANS UN CHAMP UNIFORME
1. Cinématique du point matériel :
   - Vecteurs position r(t), vitesse v(t) = dr/dt et accélération a(t) = dv/dt en repère cartésien et repère de Frenet.
2. Lois du mouvement de Newton :
   - 1ère loi (principe d'inertie), 2ème loi (Somme F = m.a) et 3ème loi (actions réciproques).
3. Mouvement d'un projectile dans le champ de pesanteur uniforme :
   - Équations horaires du mouvement, équation cartésienne de la trajectoire (parabole).
   - Portée du tir, flèche (sommet de la trajectoire), vitesse au point d'impact.
4. Critères d'évaluation :
   - Évaluation des ressources : QCM, définitions, démonstrations des équations horaires et calculs théoriques.
   - Évaluation des compétences : Problème concret de tir sportif, largage humanitaire ou sécurisation d'une trajectoire routière.`
  },
  {
    id: 'ref-minesec-informatique-ti',
    title: 'MINESEC Terminale TI — Algorithmique & Bases de Données SQL',
    type: 'pedagogique',
    dateAdded: '2025-11-10',
    content: `MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES (MINESEC) — DIRECTION DE L'ENSEIGNEMENT SECONDAIRE GÉNÉRAL
PROGRAMME DE TECHNOLOGIES DE L'INFORMATION (SÉRIE TI) — BACCALAURÉAT

PARTIE 1 : ALGORITHMIQUE ET PROGRAMMATION (10 points)
- Structures de données : Tableaux à 1 et 2 dimensions, chaînes de caractères, listes chaînées.
- Programmation en langage C ou Python : Fonctions, passage de paramètres par valeur et par adresse.
- Algorithmes de tri (sélection, bulle, insertion) et complexité algorithmique.

PARTIE 2 : SYSTÈMES D'INFORMATION ET BASES DE DONNÉES (10 points)
- Modèle Conceptuel de Données (MCD) : Entités, associations, cardinalités, clé primaire.
- Modèle Logique de Données (MLD / Schéma relationnel) : Clés étrangères et intégrité référentielle.
- Langage SQL : Requêtes SELECT avec WHERE, GROUP BY, HAVING, ORDER BY, jointures internes (INNER JOIN), requêtes de mise à jour (INSERT, UPDATE, DELETE).`
  }
];

export const computeDefaultExerciseBreakdown = (count: number, totalPts: number): ExerciseBreakdownConfig[] => {
  const safeCount = Math.max(1, Math.min(10, count || 2));
  const safeTotal = totalPts > 0 ? totalPts : 20;

  if (safeCount === 1) {
    return [
      {
        exerciseNumber: 1,
        title: 'Évaluation Globale / Exercice Unique',
        points: safeTotal,
        focusType: 'ressources',
      },
    ];
  }

  if (safeCount === 2) {
    const half = Math.floor(safeTotal / 2);
    const rest = safeTotal - half;
    return [
      {
        exerciseNumber: 1,
        title: 'Partie A : Évaluation des Ressources (Savoirs & Savoir-faire)',
        points: half,
        focusType: 'ressources',
      },
      {
        exerciseNumber: 2,
        title: 'Partie B : Évaluation des Compétences (Situation-Problème)',
        points: rest,
        focusType: 'competences',
      },
    ];
  }

  if (safeCount === 3) {
    // Standard 3 exercises: Ex 1 (5/6 pts), Ex 2 (5/6 pts), Ex 3 (8/9 pts Problem)
    const p1 = Math.round(safeTotal * 0.25 * 2) / 2; // e.g. 5 or 6
    const p2 = Math.round(safeTotal * 0.35 * 2) / 2; // e.g. 7
    const p3 = safeTotal - p1 - p2; // e.g. 8
    return [
      {
        exerciseNumber: 1,
        title: 'Exercice 1 : Restitution organisée des connaissances / QCM',
        points: p1,
        focusType: 'cours',
      },
      {
        exerciseNumber: 2,
        title: 'Exercice 2 : Application directe & Raisonnement scientifique',
        points: p2,
        focusType: 'ressources',
      },
      {
        exerciseNumber: 3,
        title: 'Exercice 3 : Situation-Problème / Tâche complexe contextualisée',
        points: p3,
        focusType: 'competences',
      },
    ];
  }

  if (safeCount === 4) {
    const base = Math.floor((safeTotal / 4) * 2) / 2;
    const remainder = safeTotal - base * 3;
    return [
      { exerciseNumber: 1, title: 'Exercice 1 : Maîtrise des connaissances fondamentales', points: base, focusType: 'cours' },
      { exerciseNumber: 2, title: 'Exercice 2 : Application et résolution d\'exercices types', points: base, focusType: 'ressources' },
      { exerciseNumber: 3, title: 'Exercice 3 : Analyse de documents et modélisation', points: base, focusType: 'ressources' },
      { exerciseNumber: 4, title: 'Exercice 4 : Situation d\'intégration / Problème', points: remainder, focusType: 'competences' },
    ];
  }

  // Generic distribution for >= 5 exercises
  const basePoint = Math.floor((safeTotal / safeCount) * 2) / 2;
  const items: ExerciseBreakdownConfig[] = [];
  let currentSum = 0;
  for (let i = 1; i <= safeCount; i++) {
    const isLast = i === safeCount;
    const pts = isLast ? Number((safeTotal - currentSum).toFixed(2)) : basePoint;
    currentSum += pts;
    items.push({
      exerciseNumber: i,
      title: isLast ? `Exercice ${i} : Situation problème & Compétences` : `Exercice ${i} : Savoirs & Exercice pratique`,
      points: pts,
      focusType: isLast ? 'competences' : 'ressources',
    });
  }
  return items;
};

export const MINESEC_REGION_PRESETS = [
  {
    name: 'Centre (Yaoundé)',
    region: 'Délégation Régionale du Centre',
    department: 'Délégation Départementale du Mfoundi',
    school: 'Lycée Général de Yaoundé',
  },
  {
    name: 'Littoral (Douala)',
    region: 'Délégation Régionale du Littoral',
    department: 'Délégation Départementale du Wouri',
    school: 'Lycée Joss de Douala',
  },
  {
    name: 'Ouest (Bafoussam)',
    region: 'Délégation Régionale de l\'Ouest',
    department: 'Délégation Départementale de la Mifi',
    school: 'Lycée Bilingue de Bafoussam',
  },
  {
    name: 'Nord-Ouest (Bamenda)',
    region: 'Regional Delegation of the North-West',
    department: 'Mezam Divisional Delegation',
    school: 'Government High School Bamenda',
  },
  {
    name: 'Sud (Ebolowa)',
    region: 'Délégation Régionale du Sud',
    department: 'Délégation Départementale de la Mvila',
    school: 'Lycée Classique d\'Ebolowa',
  },
  {
    name: 'Adamaoua (Ngaoundéré)',
    region: 'Délégation Régionale de l\'Adamaoua',
    department: 'Délégation Départementale de la Vina',
    school: 'Lycée Classique de Ngaoundéré',
  },
];

export const EXAM_HEADER_SESSION_PRESETS = [
  'ÉVALUATION SOMMATIVE N° 1',
  'ÉVALUATION SOMMATIVE N° 2',
  'ÉVALUATION SOMMATIVE N° 3 (Fin 1er Trimestre)',
  'ÉVALUATION SOMMATIVE N° 4',
  'ÉVALUATION SOMMATIVE N° 5 (Fin 2e Trimestre)',
  'ÉVALUATION HARMONISÉE DE DÉPARTEMENT',
  'BACCALAURÉAT BLANC / PROBATOIRE BLANC',
  'BEPC BLANC',
  'ÉPREUVE ZÉRO OFFICIELLE',
];

export const EXAM_HEADER_INSTRUCTION_PRESETS = [
  "L'épreuve comporte deux parties indépendantes sur deux pages numérotées de 1/2 à 2/2.",
  "Calculatrice scientifique non programmable autorisée.",
  "L'usage de la calculatrice et de tout document est strictement interdit.",
  "La clarté, la propreté de la copie et la rigueur du raisonnement seront prises en compte à hauteur de 1 point.",
  "Toutes les étapes de calcul doivent être justifiées et les résultats encadrés.",
];

export const CAMEROON_REGIONS_CONFIG = [
  {
    regionName: 'Centre (Yaoundé)',
    regionalDelegation: 'Délégation Régionale du Centre',
    departmentalDelegation: 'Délégation Départementale du Mfoundi',
    schoolExample: 'Lycée Général Leclerc de Yaoundé',
  },
  {
    regionName: 'Littoral (Douala)',
    regionalDelegation: 'Délégation Régionale du Littoral',
    departmentalDelegation: 'Délégation Départementale du Wouri',
    schoolExample: 'Lycée Joss de Douala',
  },
  {
    regionName: 'Ouest (Bafoussam)',
    regionalDelegation: "Délégation Régionale de l'Ouest",
    departmentalDelegation: 'Délégation Départementale de la Mifi',
    schoolExample: 'Lycée Bilingue de Bafoussam',
  },
  {
    regionName: 'Nord-Ouest (Bamenda)',
    regionalDelegation: 'Regional Delegation of Secondary Education for North-West',
    departmentalDelegation: 'Mezam Divisional Delegation',
    schoolExample: 'Government Bilingual High School (GBHS) Bamenda',
  },
  {
    regionName: 'Sud (Ebolowa)',
    regionalDelegation: 'Délégation Régionale du Sud',
    departmentalDelegation: 'Délégation Départementale de la Mvila',
    schoolExample: "Lycée Classique et Moderne d'Ebolowa",
  },
  {
    regionName: 'Adamaoua (Ngaoundéré)',
    regionalDelegation: "Délégation Régionale de l'Adamaoua",
    departmentalDelegation: 'Délégation Départementale de la Vina',
    schoolExample: 'Lycée Classique de Ngaoundéré',
  },
];

export const DEFAULT_PARAMETERS: ExamParameters = {
  subject: '',
  gradeLevel: '3ème (Prépa BEPC)',
  chapterTheme: '',
  evaluationType: 'devoir_surveille',
  duration: '2 heures',
  totalPoints: 20,
  exerciseCount: 2,
  exerciseBreakdown: computeDefaultExerciseBreakdown(2, 20),
  difficulty: 'progressif',
  competencies: '',
  priorityConcepts: '',
  questionTypes: ['Évaluation des Ressources (10 pts)', 'Évaluation des Compétences / Agir compétent (10 pts)'],
  
  // Paramètres d'en-tête
  schoolName: 'Lycée Général de Yaoundé',
  teacherName: 'M. le Professeur',
  schoolYear: '2025 - 2026',
  evaluationDate: 'Évaluation Séquentielle n°3',
  coefficient: 3,
  specialInstructions: 'Calculatrice autorisée. Rédiger avec clarté, soigner les justifications et encadrer les résultats finaux.',
  
  // Personnalisation avancée de l'en-tête
  headerStyle: 'officiel_minesec',
  countryHeaderFr: 'RÉPUBLIQUE DU CAMEROUN\nPaix - Travail - Patrie',
  countryHeaderEn: 'REPUBLIC OF CAMEROON\nPeace - Work - Fatherland',
  ministryHeaderFr: 'MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES',
  ministryHeaderEn: 'MINISTRY OF SECONDARY EDUCATION',
  regionalDelegation: 'Délégation Régionale du Centre',
  departmentalDelegation: 'Délégation Départementale du Mfoundi',
  departmentOrSubject: 'Département de Mathématiques',
  examSessionTitle: 'ÉVALUATION SOMMATIVE N° 3',
  showStudentCartouche: true,
  showTableNumber: true,
  showCompetencyAppreciation: true,
  showParentSignature: true,
};

export const getFreshExamParameters = (existing?: Partial<ExamParameters>): ExamParameters => {
  const count = existing?.exerciseCount || 2;
  const total = existing?.totalPoints || 20;
  return {
    subject: '',
    gradeLevel: existing?.gradeLevel || '3ème (Prépa BEPC)',
    chapterTheme: '',
    evaluationType: 'devoir_surveille',
    duration: '2 heures',
    totalPoints: total,
    exerciseCount: count,
    exerciseBreakdown: computeDefaultExerciseBreakdown(count, total),
    difficulty: 'progressif',
    competencies: '',
    priorityConcepts: '',
    questionTypes: ['Évaluation des Ressources (10 pts)', 'Évaluation des Compétences (10 pts)'],
    
    // Paramètres d'en-tête
    schoolName: existing?.schoolName || 'Lycée Général de Yaoundé',
    teacherName: existing?.teacherName || 'M. le Professeur',
    schoolYear: existing?.schoolYear || '2025 - 2026',
    evaluationDate: existing?.evaluationDate || 'Évaluation Séquentielle',
    coefficient: existing?.coefficient || 2,
    specialInstructions: existing?.specialInstructions || 'Calculatrice autorisée. Rédiger avec clarté et justifier rigoureusement chaque étape.',
    
    // Personnalisation avancée de l'en-tête
    headerStyle: existing?.headerStyle || 'officiel_minesec',
    countryHeaderFr: existing?.countryHeaderFr || 'RÉPUBLIQUE DU CAMEROUN\nPaix - Travail - Patrie',
    countryHeaderEn: existing?.countryHeaderEn || 'REPUBLIC OF CAMEROON\nPeace - Work - Fatherland',
    ministryHeaderFr: existing?.ministryHeaderFr || 'MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES',
    ministryHeaderEn: existing?.ministryHeaderEn || 'MINISTRY OF SECONDARY EDUCATION',
    regionalDelegation: existing?.regionalDelegation || 'Délégation Régionale du Centre',
    departmentalDelegation: existing?.departmentalDelegation || 'Délégation Départementale du Mfoundi',
    departmentOrSubject: existing?.departmentOrSubject || 'Département Scientifique',
    examSessionTitle: existing?.examSessionTitle || 'ÉVALUATION SOMMATIVE',
    showStudentCartouche: existing?.showStudentCartouche ?? true,
    showTableNumber: existing?.showTableNumber ?? true,
    showCompetencyAppreciation: existing?.showCompetencyAppreciation ?? true,
    showParentSignature: existing?.showParentSignature ?? true,
  };
};

export const QUICK_COMMANDS_META = [
  { cmd: '/nouveau_sujet', label: 'Nouveau Sujet MINESEC', desc: 'Concevoir une épreuve complète conforme APC' },
  { cmd: '/variante', label: 'Créer Sujet B / Variante', desc: 'Mêmes compétences et barème, situations contextualisées modifiées' },
  { cmd: '/corrige', label: 'Affiner le Corrigé APC', desc: 'Détailler les critères et barèmes partiels pas-à-pas' },
  { cmd: '/simplifier', label: 'Simplifier le niveau', desc: 'Guider davantage les questions et sous-tâches' },
  { cmd: '/approfondir', label: 'Augmenter la difficulté', desc: 'Tâches complexes et situations ouvertes' },
  { cmd: '/adapter', label: 'Adapter pour autre classe', desc: 'Transposer pour 6e, 5e, 4e, 3e, 2nde, 1ère ou Tle' },
  { cmd: '/bareme', label: 'Recalculer le Barème', desc: 'Vérifier la somme exacte (20 pts) et la pondération' },
  { cmd: '/controle', label: 'Audit Qualité MINESEC', desc: 'Contrôle conformité APC, technique & documentaire' },
  { cmd: '/word', label: 'Export Microsoft Word', desc: 'Générer les documents .DOCX prêts à imprimer' },
];
