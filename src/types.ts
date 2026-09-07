export type EvaluationType = 
  | 'interrogation'
  | 'exercice_application'
  | 'devoir_surveille'
  | 'controle'
  | 'examen_blanc'
  | 'sujet_type_examen'
  | 'serie_exercices';

export type DifficultyLevel = 'facile' | 'standard' | 'progressif' | 'renforce' | 'differencie';

export type QuestionTaxonomy = 'connaissance' | 'comprehension' | 'application' | 'analyse' | 'raisonnement';

export interface ReferenceDocument {
  id: string;
  title: string;
  type: 'pedagogique' | 'cours' | 'ancien_sujet' | 'modele_presentation' | 'autre';
  content: string;
  fileName?: string;
  dateAdded: string;
}

export type HeaderStyle = 'officiel_minesec' | 'academique_standard' | 'cartouche_complet' | 'epure';

export interface ExerciseBreakdownConfig {
  exerciseNumber: number;
  title: string;
  points: number;
  focusType?: 'ressources' | 'competences' | 'cours' | 'probleme' | 'autre';
}

export interface ExamParameters {
  subject: string; // Matière (ex: Mathématiques, NSI, Physique-Chimie, Français, etc.)
  gradeLevel: string; // Classe / Niveau (ex: 3ème, Seconde, 1ère Spé, Terminale, BTS, etc.)
  chapterTheme: string; // Chapitre / Thème
  evaluationType: EvaluationType;
  duration: string; // ex: 30 min, 1h, 2h, 4h
  totalPoints: number; // ex: 20
  exerciseCount: number; // ex: 3
  exerciseBreakdown?: ExerciseBreakdownConfig[]; // Répartition spécifique des points par exercice
  difficulty: DifficultyLevel;
  
  // Paramètres optionnels & En-tête de l'épreuve
  competencies?: string;
  priorityConcepts?: string;
  questionTypes?: string[];
  approxPages?: number;
  schoolName?: string;
  teacherName?: string;
  schoolYear?: string;
  evaluationDate?: string;
  coefficient?: number;
  specialInstructions?: string; // ex: Calculatrice autorisée, Dictionnaire interdit

  // Personnalisation avancée de l'en-tête
  headerStyle?: HeaderStyle;
  countryHeaderFr?: string;
  countryHeaderEn?: string;
  ministryHeaderFr?: string;
  ministryHeaderEn?: string;
  regionalDelegation?: string;
  departmentalDelegation?: string;
  departmentOrSubject?: string;
  examSessionTitle?: string;
  showStudentCartouche?: boolean;
  showTableNumber?: boolean;
  showCompetencyAppreciation?: boolean;
  showParentSignature?: boolean;
  customInstructions?: string[];

  // Personnalisation du logo de l'établissement
  schoolLogo?: string; // Data URL (base64) ou URL image
  schoolLogoPosition?: 'center' | 'left' | 'right';
  schoolLogoSize?: 'small' | 'medium' | 'large';
  showSchoolLogo?: boolean;
}

export interface QuestionItem {
  id: string;
  number: string; // "1.", "2.a", "2.b"
  text: string;
  points: number;
  taxonomy?: QuestionTaxonomy;
  expectedAnswer: string;
  solutionMethod?: string;
  partialCreditCriteria?: string; // Critères d'attribution des points partiels
  explanation?: string;
}

export interface ExerciseItem {
  id: string;
  number: number;
  title: string;
  contextOrIntro?: string;
  totalPoints: number;
  questions: QuestionItem[];
}

export interface QualityCheckResult {
  pedagogicalScore: number; // 0-100
  technicalScore: number; // 0-100
  rubricScore: number; // 0-100
  documentaryScore: number; // 0-100
  presentationScore: number; // 0-100
  overallScore: number; // 0-100
  
  checklist: {
    category: 'pedagogique' | 'technique' | 'bareme' | 'documentaire' | 'presentation';
    item: string;
    status: 'pass' | 'warning' | 'fail';
    comment?: string;
  }[];
  
  strengths: string[];
  recommendations: string[];
}

export interface AcademicHeaderInfo {
  schoolName: string;
  academicYear: string;
  examTitle: string;
  gradeAndSubject: string;
  duration: string;
  coefficient?: string;
  date: string;
  instructions: string[];

  // Champs de personnalisation avancée
  headerStyle?: HeaderStyle;
  countryHeaderFr?: string;
  countryHeaderEn?: string;
  ministryHeaderFr?: string;
  ministryHeaderEn?: string;
  regionalDelegation?: string;
  departmentalDelegation?: string;
  departmentOrSubject?: string;
  teacherName?: string;
  examinerName?: string;
  showStudentCartouche?: boolean;
  showTableNumber?: boolean;
  showCompetencyAppreciation?: boolean;
  showParentSignature?: boolean;

  // Propriétés détaillées et bilingues (MINESEC officiel)
  republicFr?: string;
  republicEn?: string;
  mottoFr?: string;
  mottoEn?: string;
  regionalDelegationFr?: string;
  regionalDelegationEn?: string;
  departmentalDelegationFr?: string;
  departmentalDelegationEn?: string;
  departmentDiscipline?: string;
  sessionTitle?: string;
  showStudentIdOrTableNumber?: boolean;
  showAPCAppreciation?: boolean;

  // Personnalisation du logo de l'établissement
  schoolLogo?: string; // Data URL (base64) ou URL image
  schoolLogoPosition?: 'center' | 'left' | 'right';
  schoolLogoSize?: 'small' | 'medium' | 'large';
  showSchoolLogo?: boolean;
}

export interface ExamEvaluation {
  id: string;
  version: 'A' | 'B' | 'C' | 'adapted';
  title: string;
  parameters: ExamParameters;
  academicHeader: AcademicHeaderInfo;
  analysis: {
    evaluatedConcepts: string[];
    excludedConcepts: string[];
    skillsBreakdown: string;
    progressionRationale: string;
  };
  exercises: ExerciseItem[];
  calculatedTotalPoints: number;
  targetTotalPoints: number;
  isBaremeValid: boolean;
  qualityCheck?: QualityCheckResult;
  createdAt: string;
  updatedAt: string;
}

export type QuickCommandType = 
  | '/nouveau_sujet'
  | '/corrige'
  | '/variante'
  | '/adapter'
  | '/simplifier'
  | '/approfondir'
  | '/analyser'
  | '/ameliorer'
  | '/bareme'
  | '/mise_en_page'
  | '/word'
  | '/controle';
