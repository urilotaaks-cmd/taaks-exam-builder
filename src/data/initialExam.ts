import { ExamEvaluation } from '../types';
import { DEFAULT_PARAMETERS } from './presets';

export const INITIAL_SEEDED_EXAM: ExamEvaluation = {
  id: 'exam-seed-01',
  version: 'A',
  title: 'Devoir Surveillé n°1 — Bases de Données & Requêtes SQL',
  parameters: DEFAULT_PARAMETERS,
  academicHeader: {
    schoolName: "Lycée d'Excellence AI TAAK",
    academicYear: '2025 - 2026',
    examTitle: 'DEVOIR SURVEILLÉ N°1 — BASES DE DONNÉES & SQL',
    gradeAndSubject: 'Terminale NSI — Numérique et Sciences Informatiques',
    duration: '2 heures',
    coefficient: 'Coeff. 2',
    date: 'Octobre 2025',
    instructions: [
      "L'usage de la calculatrice et de tout document est strictement interdit.",
      "La clarté, la rigueur et l'indentation des requêtes SQL seront valorisées.",
      "Toutes les réponses doivent être rédigées sur le sujet."
    ]
  },
  analysis: {
    evaluatedConcepts: [
      "Modèle relationnel et contraintes d'intégrité (clés primaires, clés étrangères)",
      "Requêtes d'interrogation SQL avec SELECT, WHERE, JOIN ... ON",
      "Fonctions d'agrégation COUNT, SUM, AVG avec GROUP BY",
      "Requêtes de mise à jour INSERT, UPDATE, DELETE"
    ],
    excludedConcepts: [
      "Indexation B-Tree avancée",
      "Triggers et procédures stockées",
      "Transactions ACID et verrouillage"
    ],
    skillsBreakdown: "Modéliser un schéma relationnel, interroger une base avec jointure, identifier les violations d'intégrité.",
    progressionRationale: "Exercice 1 : Restitution et analyse de schéma (5 pts) -> Exercice 2 : Requêtes SQL d'interrogation et agrégation (9 pts) -> Exercice 3 : Mises à jour et intégrité référentielle (6 pts)."
  },
  calculatedTotalPoints: 20,
  targetTotalPoints: 20,
  isBaremeValid: true,
  exercises: [
    {
      id: 'ex-1',
      number: 1,
      title: 'Analyse du Schéma Relationnel & Contraintes d\'Intégrité',
      totalPoints: 5,
      contextOrIntro: `Une médiathèque municipale gère son fonds documentaire à l'aide d'une base de données relationnelle composée des trois relations suivantes :

- Livre (id_livre INT, titre VARCHAR, auteur VARCHAR, annee_publication INT, id_categorie INT)
- Categorie (id_categorie INT, libelle VARCHAR)
- Emprunt (id_emprunt INT, id_livre INT, nom_abonne VARCHAR, date_emprunt DATE, rendu BOOLEAN)

Les clés primaires sont soulignées et les clés étrangères sont précédées d'un dièse (#).`,
      questions: [
        {
          id: 'q-1-1',
          number: '1.a',
          text: 'Définir la notion de clé primaire et préciser son rôle fondamental dans la relation Livre.',
          points: 1.5,
          taxonomy: 'connaissance',
          expectedAnswer: 'Une clé primaire est un attribut (ou ensemble d\'attributs) permettant d\'identifier de manière unique chaque enregistrement (uplet) d\'une relation. Dans la relation Livre, id_livre garantit qu\'aucun livre n\'a le même identifiant et interdit les doublons.',
          solutionMethod: 'Citer l\'unicité et la non-nullité, puis appliquer au cas de id_livre.',
          partialCreditCriteria: '1.5 pt : Définition d\'unicité complète + application à Livre. 0.75 pt : Définition partielle sans mention de l\'unicité stricte.',
          explanation: 'Attention à bien vérifier que l\'élève mentionne l\'identification unique.'
        },
        {
          id: 'q-1-2',
          number: '1.b',
          text: 'Identifier les clés étrangères présentes dans ce schéma et préciser la contrainte d\'intégrité associée.',
          points: 2,
          taxonomy: 'comprehension',
          expectedAnswer: 'Les clés étrangères sont : 1) id_categorie dans Livre (qui référence Categorie.id_categorie) ; 2) id_livre dans Emprunt (qui référence Livre.id_livre). La contrainte associée est l\'intégrité référentielle : toute valeur d\'une clé étrangère doit exister dans la table référencée.',
          solutionMethod: 'Lister les deux clés étrangères et formuler la règle d\'intégrité référentielle.',
          partialCreditCriteria: '1 pt pour l\'identification des deux clés (0.5 pt chacune) + 1 pt pour la définition exacte de l\'intégrité référentielle.',
          explanation: 'Vérifier la mention explicite de la table cible pour chaque clé étrangère.'
        },
        {
          id: 'q-1-3',
          number: '1.c',
          text: 'Peut-on supprimer une catégorie de la table Categorie si des livres y sont associés ? Justifier.',
          points: 1.5,
          taxonomy: 'analyse',
          expectedAnswer: 'Non, car cela violerait la contrainte d\'intégrité référentielle. Les livres associés se retrouveraient avec une clé étrangère id_categorie orpheline pointant vers un enregistrement inexistant.',
          solutionMethod: 'Expliquer le blocage par violation de clé étrangère (ou suppression en cascade si configurée).',
          partialCreditCriteria: '1.5 pt : Réponse négative bien justifiée par l\'intégrité référentielle. 0.75 pt : Réponse négative sans explication précise du mécanisme.',
          explanation: 'L\'élève doit mentionner l\'intégrité référentielle ou les références orphelines.'
        }
      ]
    },
    {
      id: 'ex-2',
      number: 2,
      title: 'Interrogation de la Base de Données en SQL',
      totalPoints: 9,
      contextOrIntro: 'On souhaite extraire différentes statistiques et listes pour les bibliothécaires. Rédiger les requêtes SQL standards demandées.',
      questions: [
        {
          id: 'q-2-1',
          number: '2.a',
          text: 'Écrire une requête SQL affichant le titre et l\'auteur de tous les livres publiés après 2015, triés par ordre alphabétique de titre.',
          points: 2,
          taxonomy: 'application',
          expectedAnswer: `SELECT titre, auteur\nFROM Livre\nWHERE annee_publication > 2015\nORDER BY titre ASC;`,
          solutionMethod: 'Utilisation de SELECT, WHERE avec condition stricte >, et ORDER BY titre.',
          partialCreditCriteria: '2 pts : Requête exacte. 1 pt : Oubli du tri ou condition erronée (>= au lieu de >). 0.5 pt : Syntaxe de base correcte mais erreurs de clauses.',
          explanation: 'Sensible à la clause WHERE et au tri ORDER BY.'
        },
        {
          id: 'q-2-2',
          number: '2.b',
          text: 'Écrire une requête SQL avec jointure affichant le titre du livre et le libellé de sa catégorie pour tous les livres.',
          points: 2.5,
          taxonomy: 'application',
          expectedAnswer: `SELECT Livre.titre, Categorie.libelle\nFROM Livre\nJOIN Categorie ON Livre.id_categorie = Categorie.id_categorie;`,
          solutionMethod: 'Jointure interne INNER JOIN / JOIN avec prédicat d\'égalité sur la clé étrangère.',
          partialCreditCriteria: '2.5 pts : Requête avec jointure exacte. 1.5 pt : Jointure avec clause WHERE implicite sans JOIN explicite. 1 pt : Erreur sur le prédicat ON.',
          explanation: 'Valoriser l\'utilisation moderne de la syntaxe JOIN ... ON.'
        },
        {
          id: 'q-2-3',
          number: '2.c',
          text: 'Écrire une requête SQL affichant le nom de chaque abonné et le nombre total d\'emprunts qu\'il a réalisés.',
          points: 2.5,
          taxonomy: 'application',
          expectedAnswer: `SELECT nom_abonne, COUNT(id_emprunt) AS nb_emprunts\nFROM Emprunt\nGROUP BY nom_abonne;`,
          solutionMethod: 'Agrégation COUNT() associée à un regroupement GROUP BY sur nom_abonne.',
          partialCreditCriteria: '2.5 pts : Requête complète avec COUNT et GROUP BY. 1.25 pt : Oubli de GROUP BY ou mauvaise fonction d\'agrégation.',
          explanation: 'Vérifier impérativement la présence de la clause GROUP BY.'
        },
        {
          id: 'q-2-4',
          number: '2.d',
          text: 'Écrire une requête SQL listant les titres des livres actuellement non rendus (rendu = FALSE).',
          points: 2,
          taxonomy: 'application',
          expectedAnswer: `SELECT Livre.titre\nFROM Livre\nJOIN Emprunt ON Livre.id_livre = Emprunt.id_livre\nWHERE Emprunt.rendu = FALSE;`,
          solutionMethod: 'Jointure entre Livre et Emprunt filtrée par la condition rendu = FALSE.',
          partialCreditCriteria: '2 pts : Requête exacte. 1 pt : Jointure correcte mais erreur de filtre booléen.',
          explanation: 'Accepter rendu = 0 ou rendu = FALSE.'
        }
      ]
    },
    {
      id: 'ex-3',
      number: 3,
      title: 'Mises à Jour & Résolution de Problème',
      totalPoints: 6,
      contextOrIntro: 'L\'équipe de la médiathèque procède à l\'intégration de nouvelles acquisitions et à la mise à jour des statuts d\'emprunt.',
      questions: [
        {
          id: 'q-3-1',
          number: '3.a',
          text: 'Écrire la requête SQL permettant d\'insérer un nouveau livre intitulé "Les Misérables" de Victor Hugo, publié en 1862, avec l\'identifiant 450 et la catégorie 12.',
          points: 2,
          taxonomy: 'application',
          expectedAnswer: `INSERT INTO Livre (id_livre, titre, auteur, annee_publication, id_categorie)\nVALUES (450, 'Les Misérables', 'Victor Hugo', 1862, 12);`,
          solutionMethod: 'Clause INSERT INTO avec spécification des colonnes et de la clause VALUES.',
          partialCreditCriteria: '2 pts : Syntaxe complète avec guillemets sur les chaînes. 1 pt : Syntaxe générale correcte avec omission des noms de colonnes.',
          explanation: 'Attention aux apostrophes autour des chaînes de caractères.'
        },
        {
          id: 'q-3-2',
          number: '3.b',
          text: 'Écrire la requête SQL permettant de marquer comme rendu (rendu = TRUE) l\'emprunt ayant l\'identifiant 1024.',
          points: 2,
          taxonomy: 'application',
          expectedAnswer: `UPDATE Emprunt\nSET rendu = TRUE\nWHERE id_emprunt = 1024;`,
          solutionMethod: 'Clause UPDATE avec SET et filtre précis WHERE sur la clé primaire.',
          partialCreditCriteria: '2 pts : Requête exacte avec WHERE. 0.5 pt : Requête sans clause WHERE (pénalité grave car met à jour toute la table).',
          explanation: 'L\'absence de clause WHERE est une faute majeure en base de données.'
        },
        {
          id: 'q-3-3',
          number: '3.c',
          text: 'Un bibliothécaire tente d\'exécuter la commande : DELETE FROM Livre WHERE id_livre = 450; alors qu\'un enregistrement dans Emprunt fait référence à ce livre. Quel sera le résultat et pourquoi ?',
          points: 2,
          taxonomy: 'raisonnement',
          expectedAnswer: 'Le SGBD rejettera l\'instruction et renverra une erreur de violation de clé étrangère (contrainte d\'intégrité référentielle), car la table Emprunt contient un uplet pointant vers id_livre = 450. Pour supprimer ce livre, il faudrait d\'abord supprimer ou archiver les emprunts correspondants.',
          solutionMethod: 'Analyse d\'erreur de contrainte SGBD et solution corrective.',
          partialCreditCriteria: '2 pts : Explication complète du blocage SGBD + intégrité référentielle. 1 pt : Mention du refus sans explication de la contrainte.',
          explanation: 'Tester la compréhension des mécanismes de sécurité relationnelle.'
        }
      ]
    }
  ],
  qualityCheck: {
    pedagogicalScore: 98,
    technicalScore: 100,
    rubricScore: 100,
    documentaryScore: 96,
    presentationScore: 98,
    overallScore: 98,
    checklist: [
      { category: 'pedagogique', item: 'Niveau d\'exigence conforme au programme NSI Terminale', status: 'pass', comment: 'Progression équilibrée' },
      { category: 'pedagogique', item: 'Aucune notion hors-programme (triggers, indexation exclus)', status: 'pass' },
      { category: 'technique', item: 'Syntaxe SQL rigoureusement exacte sur toutes les requêtes', status: 'pass' },
      { category: 'bareme', item: 'Somme arithmétique strictement égale à 20 points (5 + 9 + 6 = 20)', status: 'pass' },
      { category: 'bareme', item: 'Pondération explicite sur chaque sous-question', status: 'pass' },
      { category: 'documentaire', item: 'Conformité avec les documents de référence fournis', status: 'pass' },
      { category: 'presentation', item: 'Séparation étanche entre Sujet Élève et Corrigé Enseignant', status: 'pass' }
    ],
    strengths: [
      "Barème mathématiquement rigoureux totalisant exactement 20 points.",
      "Critères de notation partiels ultra-précis pour chaque question.",
      "Progression taxonomique naturelle de l'analyse conceptuelle à la manipulation SQL."
    ],
    recommendations: [
      "Possibilité de générer une variante (Sujet B) pour les classes dédoublées.",
      "Prêt pour exportation Microsoft Word (.docx) immédiate."
    ]
  },
  createdAt: '2025-10-15T08:00:00.000Z',
  updatedAt: '2025-10-15T08:00:00.000Z'
};
