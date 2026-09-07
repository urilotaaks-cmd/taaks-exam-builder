import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Sparkles,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Clock,
  Award,
  Layers,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  FileText,
  Brain,
  Edit3,
  ListOrdered,
  Calendar,
  GraduationCap,
  Building2,
  User,
  RotateCcw,
  Hash,
  Trash2,
  Plus,
  Minus,
  Scale,
  Wand2,
  TrendingUp,
  AlertTriangle,
  School,
  CheckSquare,
  ShieldCheck,
  Eye,
  EyeOff,
  Upload,
} from 'lucide-react';
import { ExamParameters, EvaluationType, DifficultyLevel, ExerciseBreakdownConfig, HeaderStyle, AcademicHeaderInfo } from '../types';
import {
  CURRICULUM_DATABASE,
  MINESEC_GRADE_LEVELS,
  MINESEC_STANDARD_DURATIONS,
  getChapterSuggestions,
  getCurriculumBySubject,
} from '../data/curriculumData';
import { computeDefaultExerciseBreakdown, CAMEROON_REGIONS_CONFIG } from '../data/presets';
import { SCHOOL_LOGO_PRESETS, processUploadedLogoFile } from '../utils/logoPresets';
import { ExamAcademicHeader } from './ExamAcademicHeader';

interface ParametersTabProps {
  parameters: ExamParameters;
  onChangeParameters: (params: ExamParameters) => void;
  onAnalyze: () => void;
  onGenerate: () => void;
  onResetParameters?: () => void;
  onClearDocuments?: () => void;
  isLoading: boolean;
  docCount: number;
}

export const ParametersTab: React.FC<ParametersTabProps> = ({
  parameters,
  onChangeParameters,
  onAnalyze,
  onGenerate,
  onResetParameters,
  onClearDocuments,
  isLoading,
  docCount,
}) => {
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [isCustomGrade, setIsCustomGrade] = useState(false);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [isCustomChapter, setIsCustomChapter] = useState(false);
  const [showLiveHeaderPreview, setShowLiveHeaderPreview] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Synchronized header preview info
  const currentHeaderPreviewInfo: AcademicHeaderInfo = {
    headerStyle: parameters.headerStyle || 'officiel_minesec',
    schoolName: parameters.schoolName || 'Lycée Général de Yaoundé',
    academicYear: parameters.schoolYear || '2025 - 2026',
    examTitle: parameters.examSessionTitle || parameters.evaluationDate || 'ÉVALUATION SOMMATIVE',
    gradeAndSubject: `${parameters.gradeLevel || '3ème'} — ${parameters.subject || 'Discipline'}`,
    duration: parameters.duration || '2 heures',
    coefficient: `Coeff. ${parameters.coefficient || 2}`,
    date: parameters.evaluationDate || 'Évaluation Séquentielle',
    teacherName: parameters.teacherName || 'M. le Professeur',
    examinerName: parameters.teacherName,
    instructions: parameters.specialInstructions ? [parameters.specialInstructions] : [],
    countryHeaderFr: parameters.countryHeaderFr,
    countryHeaderEn: parameters.countryHeaderEn,
    ministryHeaderFr: parameters.ministryHeaderFr,
    ministryHeaderEn: parameters.ministryHeaderEn,
    regionalDelegation: parameters.regionalDelegation,
    departmentalDelegation: parameters.departmentalDelegation,
    departmentOrSubject: parameters.departmentOrSubject,
    sessionTitle: parameters.examSessionTitle,
    showStudentCartouche: parameters.showStudentCartouche ?? true,
    showTableNumber: parameters.showTableNumber ?? true,
    showCompetencyAppreciation: parameters.showCompetencyAppreciation ?? true,
    showParentSignature: parameters.showParentSignature ?? true,
    schoolLogo: parameters.schoolLogo,
    schoolLogoPosition: parameters.schoolLogoPosition,
    schoolLogoSize: parameters.schoolLogoSize,
    showSchoolLogo: parameters.showSchoolLogo,
  };

  const handleLogoUpload = async (file: File) => {
    try {
      setIsUploadingLogo(true);
      setLogoUploadError(null);
      const dataUrl = await processUploadedLogoFile(file);
      onChangeParameters({
        ...parameters,
        schoolLogo: dataUrl,
        showSchoolLogo: true,
      });
    } catch (err: any) {
      setLogoUploadError(err.message || "Impossible de charger le logo.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Ensure exerciseBreakdown is always synchronized
  useEffect(() => {
    const totalPts = parameters.totalPoints || 20;
    const count = parameters.exerciseCount || 2;
    if (!parameters.exerciseBreakdown || parameters.exerciseBreakdown.length !== count) {
      onChangeParameters({
        ...parameters,
        exerciseBreakdown: computeDefaultExerciseBreakdown(count, totalPts),
      });
    }
  }, [parameters.exerciseCount, parameters.totalPoints]);

  // Detect whether current values are custom on mount / change
  useEffect(() => {
    const knownSubject = CURRICULUM_DATABASE.some((c) => c.name === parameters.subject);
    if (parameters.subject && !knownSubject) {
      setIsCustomSubject(true);
    } else {
      setIsCustomSubject(false);
    }

    const allLevels = MINESEC_GRADE_LEVELS.flatMap((c) => c.levels);
    const knownGrade = allLevels.includes(parameters.gradeLevel);
    if (parameters.gradeLevel && !knownGrade) {
      setIsCustomGrade(true);
    } else {
      setIsCustomGrade(false);
    }

    const knownDuration = MINESEC_STANDARD_DURATIONS.some((d) => d.value === parameters.duration);
    if (parameters.duration && !knownDuration) {
      setIsCustomDuration(true);
    } else {
      setIsCustomDuration(false);
    }
  }, [parameters.subject, parameters.gradeLevel, parameters.duration]);

  const updateField = (field: keyof ExamParameters, value: any) => {
    onChangeParameters({
      ...parameters,
      [field]: value,
    });
  };

  const handleTotalPointsChange = (newTotal: number) => {
    const safeTotal = Math.max(1, newTotal);
    const count = parameters.exerciseCount || 2;
    onChangeParameters({
      ...parameters,
      totalPoints: safeTotal,
      exerciseBreakdown: computeDefaultExerciseBreakdown(count, safeTotal),
    });
  };

  const handleExerciseCountChange = (newCount: number) => {
    const safeCount = Math.max(1, Math.min(10, newCount));
    const totalPts = parameters.totalPoints || 20;
    onChangeParameters({
      ...parameters,
      exerciseCount: safeCount,
      exerciseBreakdown: computeDefaultExerciseBreakdown(safeCount, totalPts),
    });
  };

  const handleExercisePointChange = (index: number, newPts: number) => {
    const current = parameters.exerciseBreakdown || computeDefaultExerciseBreakdown(parameters.exerciseCount || 2, parameters.totalPoints || 20);
    const updated = [...current];
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        points: Math.max(0.25, Math.round(newPts * 4) / 4),
      };
      onChangeParameters({
        ...parameters,
        exerciseBreakdown: updated,
      });
    }
  };

  const handleExerciseTitleChange = (index: number, newTitle: string) => {
    const current = parameters.exerciseBreakdown || computeDefaultExerciseBreakdown(parameters.exerciseCount || 2, parameters.totalPoints || 20);
    const updated = [...current];
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        title: newTitle,
      };
      onChangeParameters({
        ...parameters,
        exerciseBreakdown: updated,
      });
    }
  };

  const handleApplyPresetDistribution = (presetType: 'balanced' | 'apc' | 'progressive') => {
    const count = parameters.exerciseCount || 2;
    const total = parameters.totalPoints || 20;

    if (presetType === 'balanced') {
      const base = Number((total / count).toFixed(2));
      const items: ExerciseBreakdownConfig[] = [];
      let acc = 0;
      for (let i = 0; i < count; i++) {
        const isLast = i === count - 1;
        const pts = isLast ? Number((total - acc).toFixed(2)) : base;
        acc += pts;
        items.push({
          exerciseNumber: i + 1,
          title: `Exercice ${i + 1}`,
          points: pts,
          focusType: 'ressources',
        });
      }
      onChangeParameters({ ...parameters, exerciseBreakdown: items });
      return;
    }

    if (presetType === 'apc') {
      onChangeParameters({ ...parameters, exerciseBreakdown: computeDefaultExerciseBreakdown(count, total) });
      return;
    }

    if (presetType === 'progressive') {
      const weights = Array.from({ length: count }, (_, i) => i + 1);
      const sumWeights = weights.reduce((a, b) => a + b, 0);
      let acc = 0;
      const items: ExerciseBreakdownConfig[] = weights.map((w, idx) => {
        const isLast = idx === count - 1;
        const pts = isLast 
          ? Number((total - acc).toFixed(2))
          : Math.round((total * (w / sumWeights)) * 2) / 2;
        acc += pts;
        return {
          exerciseNumber: idx + 1,
          title: idx === count - 1 ? `Exercice ${idx + 1} : Tâche Complexe & Compétences` : `Exercice ${idx + 1} : Application Progressive`,
          points: Math.max(0.5, pts),
          focusType: idx === count - 1 ? 'competences' : 'ressources',
        };
      });
      onChangeParameters({ ...parameters, exerciseBreakdown: items });
      return;
    }
  };

  const handleAutoRebalance = () => {
    const current = parameters.exerciseBreakdown || computeDefaultExerciseBreakdown(parameters.exerciseCount || 2, parameters.totalPoints || 20);
    const targetTotal = parameters.totalPoints || 20;
    const currentSum = current.reduce((acc, item) => acc + (Number(item.points) || 0), 0);
    
    if (currentSum === 0) {
      onChangeParameters({
        ...parameters,
        exerciseBreakdown: computeDefaultExerciseBreakdown(parameters.exerciseCount || 2, targetTotal),
      });
      return;
    }

    const ratio = targetTotal / currentSum;
    let acc = 0;
    const rebalanced = current.map((item, idx) => {
      const isLast = idx === current.length - 1;
      const pts = isLast 
        ? Number((targetTotal - acc).toFixed(2))
        : Math.round((item.points * ratio) * 2) / 2;
      acc += pts;
      return {
        ...item,
        points: Math.max(0.25, pts),
      };
    });

    onChangeParameters({
      ...parameters,
      exerciseBreakdown: rebalanced,
    });
  };

  const handleSubjectSelect = (selectedSubject: string) => {
    if (selectedSubject === '__CUSTOM__') {
      setIsCustomSubject(true);
      return;
    }
    setIsCustomSubject(false);
    
    const curriculum = getCurriculumBySubject(selectedSubject);
    const newParams: Partial<ExamParameters> = { subject: selectedSubject };
    
    if (curriculum?.defaultDuration && !parameters.duration) {
      newParams.duration = curriculum.defaultDuration;
    }

    const suggestions = getChapterSuggestions(selectedSubject, parameters.gradeLevel);
    if (suggestions.length > 0) {
      newParams.chapterTheme = suggestions[0];
      setIsCustomChapter(false);
    }

    onChangeParameters({
      ...parameters,
      ...newParams,
    });
  };

  const handleGradeSelect = (selectedGrade: string) => {
    if (selectedGrade === '__CUSTOM__') {
      setIsCustomGrade(true);
      return;
    }
    setIsCustomGrade(false);

    const suggestions = getChapterSuggestions(parameters.subject, selectedGrade);
    const newParams: Partial<ExamParameters> = { gradeLevel: selectedGrade };
    if (suggestions.length > 0) {
      newParams.chapterTheme = suggestions[0];
      setIsCustomChapter(false);
    }

    onChangeParameters({
      ...parameters,
      ...newParams,
    });
  };

  const handleDurationSelect = (selectedDuration: string) => {
    if (selectedDuration === '__CUSTOM__') {
      setIsCustomDuration(true);
      return;
    }
    setIsCustomDuration(false);
    updateField('duration', selectedDuration);
  };

  const handleChapterSelect = (selectedChapter: string) => {
    if (selectedChapter === '__CUSTOM__') {
      setIsCustomChapter(true);
      updateField('chapterTheme', '');
      return;
    }
    setIsCustomChapter(false);
    updateField('chapterTheme', selectedChapter);
  };

  const chapterSuggestions = getChapterSuggestions(parameters.subject, parameters.gradeLevel);

  const evaluationTypes: { id: EvaluationType; label: string; desc: string }[] = [
    { id: 'devoir_surveille', label: 'Évaluation Séquentielle / DS', desc: 'Évaluation sommative officielle conforme APC' },
    { id: 'examen_blanc', label: 'Examen Blanc (BEPC / Probatoire / Bac)', desc: 'Épreuve complète en conditions réelles d\'examen' },
    { id: 'controle', label: 'Contrôle Continu / Fin de module', desc: 'Vérification intermédiaire des savoirs et compétences' },
    { id: 'interrogation', label: 'Interrogation Écrite (15-30 min)', desc: 'Vérification rapide des prérequis et formules' },
    { id: 'sujet_type_examen', label: 'Sujet Type Examen', desc: 'Format standardisé d\'épreuve d\'examen national' },
    { id: 'exercice_application', label: 'Exercices d\'application', desc: 'Mise en pratique directe guidée' },
  ];

  const difficultyLevels: { id: DifficultyLevel; label: string; desc: string }[] = [
    { id: 'progressif', label: 'Progressif (APC MINESEC)', desc: 'Ressources (10 pts) -> Agir compétent (10 pts)' },
    { id: 'standard', label: 'Standard', desc: 'Conforme aux exigences moyennes de la classe' },
    { id: 'facile', label: 'Guidé / Soutien', desc: 'Questions très découpées et repères méthodologiques' },
    { id: 'renforce', label: 'Approfondissement', desc: 'Situations-problèmes ouvertes et plus exigeantes' },
  ];

  const datePresets = [
    'Évaluation Séquentielle n°1',
    'Évaluation Séquentielle n°2',
    'Évaluation Séquentielle n°3',
    'Évaluation Séquentielle n°4',
    'Évaluation Séquentielle n°5',
    'Évaluation Séquentielle n°6',
    'Épreuve d\'Harmonisation Trimestrielle',
    'Examen Blanc Régional'
  ];

  const yearPresets = ['2025 - 2026', '2026 - 2027', '2024 - 2025'];
  const coeffPresets = [1, 2, 3, 4, 5, 6, 7];
  const pointPresets = [10, 20, 30, 40, 60, 100];
  const exerciseCountPresets = [
    { count: 1, label: '1 Exercice', desc: 'Quiz / Épreuve courte' },
    { count: 2, label: '2 Exercices', desc: 'Format APC Classique' },
    { count: 3, label: '3 Exercices', desc: 'Format Examen / Brevet' },
    { count: 4, label: '4 Exercices', desc: 'Épreuve multi-modules' },
    { count: 5, label: '5 Exercices', desc: 'Série complète' },
    { count: 6, label: '6 Exercices', desc: 'Banque d\'exercices' },
  ];

  // Group subjects by category
  const categories = Array.from(new Set(CURRICULUM_DATABASE.map((c) => c.category)));

  // Compute live breakdown sum
  const activeBreakdown = parameters.exerciseBreakdown || computeDefaultExerciseBreakdown(parameters.exerciseCount || 2, parameters.totalPoints || 20);
  const currentTotalSum = activeBreakdown.reduce((sum, item) => sum + (Number(item.points) || 0), 0);
  const targetTotal = parameters.totalPoints || 20;
  const isSumBalanced = Math.abs(currentTotalSum - targetTotal) < 0.01;
  const diffPoints = Number((targetTotal - currentTotalSum).toFixed(2));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Parameters Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
                Étape 2 sur 7
              </span>
              <span className="text-xs text-slate-500">Cadrage Pédagogique & Spécifications MINESEC</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Paramètres de l'Évaluation</h2>
            <p className="text-xs text-slate-600">
              Configurez la matière, le niveau, le chapitre, le nombre d'exercices et le barème automatique de votre épreuve.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onResetParameters && (
              <button
                type="button"
                id="btn-reset-params"
                onClick={onResetParameters}
                title="Effacer et réinitialiser tous les champs"
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser</span>
              </button>
            )}
            <button
              id="btn-run-analysis"
              onClick={onAnalyze}
              disabled={isLoading || !parameters.subject || !parameters.chapterTheme}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Diagnostic Préalable</span>
            </button>
            <button
              id="btn-run-generate"
              onClick={onGenerate}
              disabled={isLoading || !parameters.subject || !parameters.chapterTheme}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Conception en cours...</span>
                </>
              ) : (
                <>
                  <span>Générer l'Évaluation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1 : Paramètres Pédagogiques Fondamentaux */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-600"></div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              1. Cadrage Académique & Thématique
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Matière, Niveau, Durée et Chapitre</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Matière / Discipline Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>Matière / Discipline <span className="text-rose-500">*</span></span>
              </label>
              {isCustomSubject && (
                <button
                  type="button"
                  onClick={() => setIsCustomSubject(false)}
                  className="text-[10px] text-teal-600 hover:underline font-semibold"
                >
                  Revenir à la liste
                </button>
              )}
            </div>

            {!isCustomSubject ? (
              <div className="relative">
                <select
                  value={CURRICULUM_DATABASE.some(c => c.name === parameters.subject) ? parameters.subject : (parameters.subject ? '__CUSTOM__' : '')}
                  onChange={(e) => handleSubjectSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-8 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled>-- Choisir une matière MINESEC --</option>
                  {categories.map((cat) => (
                    <optgroup key={cat} label={cat}>
                      {CURRICULUM_DATABASE.filter((c) => c.category === cat).map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="__CUSTOM__">➕ Autre matière (Saisie libre)...</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            ) : (
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Saisissez le nom de la matière..."
                  value={parameters.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-teal-500 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                  autoFocus
                />
                <span className="text-[10px] text-slate-500">Matière personnalisée</span>
              </div>
            )}
          </div>

          {/* 2. Classe / Niveau Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>Classe / Série MINESEC <span className="text-rose-500">*</span></span>
              </label>
              {isCustomGrade && (
                <button
                  type="button"
                  onClick={() => setIsCustomGrade(false)}
                  className="text-[10px] text-teal-600 hover:underline font-semibold"
                >
                  Revenir à la liste
                </button>
              )}
            </div>

            {!isCustomGrade ? (
              <div className="relative">
                <select
                  value={MINESEC_GRADE_LEVELS.flatMap(c => c.levels).includes(parameters.gradeLevel) ? parameters.gradeLevel : '__CUSTOM__'}
                  onChange={(e) => handleGradeSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-8 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled>-- Choisir une classe / série --</option>
                  {MINESEC_GRADE_LEVELS.map((cycleGroup) => (
                    <optgroup key={cycleGroup.cycle} label={cycleGroup.cycle}>
                      {cycleGroup.levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="__CUSTOM__">➕ Autre niveau (Saisie libre)...</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            ) : (
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="ex: 3ème, Seconde C, Terminale A4..."
                  value={parameters.gradeLevel}
                  onChange={(e) => updateField('gradeLevel', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-teal-500 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                  autoFocus
                />
                <span className="text-[10px] text-slate-500">Niveau personnalisé</span>
              </div>
            )}
          </div>

          {/* 3. Durée de l'épreuve */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>Durée de l'épreuve <span className="text-rose-500">*</span></span>
              </label>
              {isCustomDuration && (
                <button
                  type="button"
                  onClick={() => setIsCustomDuration(false)}
                  className="text-[10px] text-teal-600 hover:underline font-semibold"
                >
                  Revenir aux durées standards
                </button>
              )}
            </div>

            {!isCustomDuration ? (
              <div className="relative">
                <select
                  value={MINESEC_STANDARD_DURATIONS.some(d => d.value === parameters.duration) ? parameters.duration : '__CUSTOM__'}
                  onChange={(e) => handleDurationSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-8 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer"
                >
                  {MINESEC_STANDARD_DURATIONS.map((dur) => (
                    <option key={dur.value} value={dur.value}>
                      {dur.label}
                    </option>
                  ))}
                  <option value="__CUSTOM__">➕ Autre durée personnalisée...</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            ) : (
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="ex: 1 heure 15 minutes"
                  value={parameters.duration}
                  onChange={(e) => updateField('duration', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-teal-500 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                  autoFocus
                />
                <span className="text-[10px] text-slate-500">Durée personnalisée</span>
              </div>
            )}
          </div>
        </div>

        {/* Chapitre / Notions prioritaires */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Chapitre & Notions ciblées <span className="text-rose-500">*</span></span>
            </label>
            {isCustomChapter ? (
              <button
                type="button"
                onClick={() => setIsCustomChapter(false)}
                className="text-[10px] text-teal-600 hover:underline font-semibold"
              >
                Choisir dans le programme suggéré
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCustomChapter(true)}
                className="text-[10px] text-teal-600 hover:underline font-semibold"
              >
                Saisie libre d'un autre thème
              </button>
            )}
          </div>

          {!isCustomChapter && chapterSuggestions.length > 0 ? (
            <div className="space-y-2">
              <div className="relative">
                <select
                  value={parameters.chapterTheme}
                  onChange={(e) => handleChapterSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-8 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="" disabled>-- Sélectionnez le chapitre à évaluer --</option>
                  {chapterSuggestions.map((chap) => (
                    <option key={chap} value={chap}>
                      {chap}
                    </option>
                  ))}
                  <option value="__CUSTOM__">➕ Saisir un autre chapitre personnalisé...</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>

              {/* Quick suggestion pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase self-center mr-1">Raccourcis :</span>
                {chapterSuggestions.slice(0, 4).map((chap) => (
                  <button
                    key={chap}
                    type="button"
                    onClick={() => updateField('chapterTheme', chap)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                      parameters.chapterTheme === chap
                        ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {chap}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <input
                type="text"
                placeholder="ex: Propriété de Thalès, Équations différentielles, Révolution industrielle, etc."
                value={parameters.chapterTheme}
                onChange={(e) => updateField('chapterTheme', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-teal-500 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                required
              />
              <p className="text-[10px] text-slate-500">
                Indiquez le titre ou les notions clés du chapitre que vous souhaitez cibler pour cette épreuve.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2 : Cadre Institutionnel, En-Tête Officiel & Cartouche APC */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              2. Cadre Institutionnel, En-Tête Officiel & Cartouche APC
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLiveHeaderPreview(!showLiveHeaderPreview)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              {showLiveHeaderPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showLiveHeaderPreview ? "Masquer l'aperçu" : "Aperçu en direct"}</span>
            </button>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
              100% Conforme MINESEC
            </span>
          </div>
        </div>

        {/* Choix du Style de Mise en Page de l'En-tête */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-emerald-600" />
              <span>Style de mise en page de l'en-tête officiel</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              Format d'impression & export Word/PDF
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'officiel_minesec' as HeaderStyle,
                title: 'Officiel MINESEC',
                tag: 'Recommandé Cameroun',
                desc: 'Bilingue officiel avec armoiries, délégations, cartouche APC et visa parent',
                badge: 'MINESEC APC',
              },
              {
                id: 'academique_standard' as HeaderStyle,
                title: 'Académique Standard',
                tag: 'Classique',
                desc: 'Établissement, discipline, barème et boîte de note compacte',
                badge: 'Standard',
              },
              {
                id: 'cartouche_complet' as HeaderStyle,
                title: 'Cartouche Complet',
                tag: 'Évaluation formative',
                desc: 'Cartouche élève étendu avec grille APC (NA/ECA/A/E)',
                badge: 'Formative',
              },
              {
                id: 'epure' as HeaderStyle,
                title: 'Épuré & Moderne',
                tag: 'Minimaliste',
                desc: 'En-tête allégé, parfait pour fiches d’exercices ou devoirs courts',
                badge: 'Rapide',
              },
            ].map((st) => {
              const isSelected = (parameters.headerStyle || 'officiel_minesec') === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => updateField('headerStyle', st.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">{st.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {st.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{st.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Préréglages Régionaux Cameroun (MINESEC) */}
        <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Préréglages Régionaux MINESEC (1 clic pour pré-remplir les délégations)</span>
            </span>
            <span className="text-[10px] text-slate-500">Sélectionnez votre région</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CAMEROON_REGIONS_CONFIG.map((reg) => (
              <button
                key={reg.regionName}
                type="button"
                onClick={() => {
                  onChangeParameters({
                    ...parameters,
                    regionalDelegation: reg.regionalDelegation,
                    departmentalDelegation: reg.departmentalDelegation,
                    schoolName: reg.schoolExample,
                  });
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/60 font-medium transition-colors shadow-2xs"
              >
                📍 {reg.regionName}
              </button>
            ))}
          </div>
        </div>

        {/* Session d'évaluation & Intitulé */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2.5">
          <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Intitulé de la session d'évaluation</span>
            </span>
            <span className="text-[11px] text-slate-500 font-normal">Ex: ÉVALUATION SOMMATIVE N° 3</span>
          </label>
          <input
            type="text"
            value={parameters.examSessionTitle || ''}
            placeholder="ex: ÉVALUATION SOMMATIVE DU 2ÈME TRIMESTRE"
            onChange={(e) => updateField('examSessionTitle', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none uppercase"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              'Évaluation N° 1',
              'Évaluation N° 2',
              'Évaluation N° 3',
              'Évaluation N° 4',
              'Évaluation N° 5',
              'Évaluation N° 6',
              'Baccalauréat Blanc',
              'BEPC Blanc',
              'Probatoire Blanc',
            ].map((titlePreset) => (
              <button
                key={titlePreset}
                type="button"
                onClick={() => updateField('examSessionTitle', titlePreset.toUpperCase())}
                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-colors ${
                  parameters.examSessionTitle === titlePreset.toUpperCase()
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {titlePreset}
              </button>
            ))}
          </div>
        </div>

        {/* Grille 3 colonnes : Coefficient, Date & Année scolaire */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Coefficient */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-600" />
              <span>Coefficient de la matière <span className="text-rose-500">*</span></span>
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                min={1}
                max={15}
                value={parameters.coefficient || 1}
                onChange={(e) => updateField('coefficient', Math.max(1, Number(e.target.value) || 1))}
                className="w-20 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none text-center"
              />
              <span className="text-xs text-slate-500 font-medium">Coeff. {parameters.coefficient || 1}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {coeffPresets.map((coeff) => (
                <button
                  key={coeff}
                  type="button"
                  onClick={() => updateField('coefficient', coeff)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors ${
                    (parameters.coefficient || 1) === coeff
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {coeff}
                </button>
              ))}
            </div>
          </div>

          {/* Date de l'évaluation */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Date ou Période d'évaluation <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              placeholder="ex: Évaluation Séquentielle n°3"
              value={parameters.evaluationDate || ''}
              onChange={(e) => updateField('evaluationDate', e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none mb-1.5"
            />
            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) updateField('evaluationDate', e.target.value);
                }}
                value=""
                className="w-full px-2 py-1 pr-6 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-600 font-medium cursor-pointer"
              >
                <option value="">-- Période type --</option>
                {datePresets.map((dp) => (
                  <option key={dp} value={dp}>{dp}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* Année scolaire */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Année scolaire <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="text"
              placeholder="ex: 2025 - 2026"
              value={parameters.schoolYear || ''}
              onChange={(e) => updateField('schoolYear', e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none mb-1.5"
            />
            <div className="flex gap-1.5">
              {yearPresets.map((yp) => (
                <button
                  key={yp}
                  type="button"
                  onClick={() => updateField('schoolYear', yp)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-colors ${
                    parameters.schoolYear === yp
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {yp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Détails Établissement, Enseignant & Délégations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Nom de l'établissement scolaire</span>
            </label>
            <input
              type="text"
              placeholder="ex: Lycée Général Leclerc de Yaoundé"
              value={parameters.schoolName || ''}
              onChange={(e) => updateField('schoolName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Nom de l'enseignant ou examinateur</span>
            </label>
            <input
              type="text"
              placeholder="ex: M. le Professeur"
              value={parameters.teacherName || ''}
              onChange={(e) => updateField('teacherName', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Délégation Régionale (MINESEC)</span>
            </label>
            <input
              type="text"
              placeholder="ex: Délégation Régionale du Centre"
              value={parameters.regionalDelegation || ''}
              onChange={(e) => updateField('regionalDelegation', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Délégation Départementale (MINESEC)</span>
            </label>
            <input
              type="text"
              placeholder="ex: Délégation Départementale du Mfoundi"
              value={parameters.departmentalDelegation || ''}
              onChange={(e) => updateField('departmentalDelegation', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Logo de l'établissement scolaire */}
        <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Logo & Sceau officiel de l'Établissement</span>
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Personnalisez le logo de l'en-tête (import direct ou emblèmes officiels camerounais prêts à l'emploi).
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={parameters.showSchoolLogo ?? true}
                onChange={(e) => updateField('showSchoolLogo', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Afficher le logo</span>
            </label>
          </div>

          {/* Logo sélectionné ou sélecteur rapide */}
          {parameters.schoolLogo ? (
            <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 p-1 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                  <img
                    src={parameters.schoolLogo}
                    alt="Logo sélectionné"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Logo configuré avec succès</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Position : {parameters.schoolLogoPosition === 'left' ? 'Gauche' : parameters.schoolLogoPosition === 'right' ? 'Droite' : 'Centre'} | Taille : {parameters.schoolLogoSize === 'small' ? 'Compact' : parameters.schoolLogoSize === 'large' ? 'Grand' : 'Standard'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs rounded-lg border border-emerald-300 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 font-semibold"
                >
                  Remplacer
                </button>
                <button
                  type="button"
                  onClick={() => onChangeParameters({ ...parameters, schoolLogo: undefined })}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Retirer le logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}

          {/* Emblèmes prêts à l'emploi (1 clic) */}
          <div>
            <span className="text-[11px] font-bold text-slate-700 block mb-2">
              Emblèmes officiels camerounais prêts à l'emploi :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SCHOOL_LOGO_PRESETS.map((preset) => {
                const isSelected = parameters.schoolLogo === preset.dataUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onChangeParameters({
                        ...parameters,
                        schoolLogo: preset.dataUrl,
                        showSchoolLogo: true,
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 p-0.5 bg-slate-50 rounded-md shrink-0 flex items-center justify-center">
                      <img src={preset.dataUrl} alt={preset.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {preset.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Import personnalisé */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleLogoUpload(e.target.files[0]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isUploadingLogo ? 'Traitement de l’image...' : 'Importer une image depuis votre appareil (PNG, JPG, SVG)'}</span>
            </button>
            {logoUploadError && (
              <p className="text-xs text-rose-600 font-semibold mt-1">{logoUploadError}</p>
            )}
          </div>

          {/* Options de positionnement et taille */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Position sur l'en-tête :</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'left', label: 'Gauche' },
                  { id: 'center', label: 'Centre' },
                  { id: 'right', label: 'Droite' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => updateField('schoolLogoPosition', pos.id)}
                    className={`py-1 text-xs font-semibold rounded-lg border transition-all ${
                      (parameters.schoolLogoPosition || 'center') === pos.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">Taille d'affichage :</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'small', label: 'Compact' },
                  { id: 'medium', label: 'Standard' },
                  { id: 'large', label: 'Grand' },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => updateField('schoolLogoSize', sz.id)}
                    className={`py-1 text-xs font-semibold rounded-lg border transition-all ${
                      (parameters.schoolLogoSize || 'medium') === sz.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Options APC & Cartouche d'Identification Élève */}
        <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Éléments du Cartouche Élève & Approche Par Compétences (APC)</span>
            </span>
            <span className="text-[10px] text-slate-500">Affichage sur le sujet élève</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={parameters.showStudentCartouche ?? true}
                onChange={(e) => updateField('showStudentCartouche', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">Cartouche d'identification</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={parameters.showTableNumber ?? true}
                onChange={(e) => updateField('showTableNumber', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">N° de Table / Matricule</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={parameters.showCompetencyAppreciation ?? true}
                onChange={(e) => updateField('showCompetencyAppreciation', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">Grille APC (NA, ECA, A, E)</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={parameters.showParentSignature ?? true}
                onChange={(e) => updateField('showParentSignature', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">Visa / Signature du parent</span>
            </label>
          </div>
        </div>

        {/* Consignes particulières pour l'épreuve */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Consignes et directives particulières de l'épreuve</span>
            </span>
            <span className="text-[10px] text-slate-500">Imprimées dans l'encadré des consignes</span>
          </label>
          <textarea
            rows={2}
            value={parameters.specialInstructions || ''}
            onChange={(e) => updateField('specialInstructions', e.target.value)}
            placeholder="ex: Calculatrice scientifique autorisée. Rédiger avec clarté, soigner les justifications géométriques et encadrer les résultats."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Aperçu Interactif de l'En-tête (Collapsible) */}
        {showLiveHeaderPreview && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Aperçu en temps réel de votre en-tête d'évaluation</span>
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                Rendu visuel exact du document final
              </span>
            </div>
            <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200">
              <ExamAcademicHeader
                header={currentHeaderPreviewInfo}
                targetTotalPoints={parameters.totalPoints || 20}
                readOnly
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3 : Nombre d'Exercices, Barème Automatique & Structure */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-600"></div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              3. Nombre d'Exercices & Configuration du Barème Automatique
            </h3>
          </div>
          <span className="text-[11px] text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full font-bold">
            Total {parameters.totalPoints || 20} pts ({parameters.exerciseCount || 2} exercices)
          </span>
        </div>

        {/* 1. Barème total et Nombre d'exercices principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Barème Total */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-600" />
                <span>Barème total de l'évaluation <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-xs font-extrabold text-teal-700 bg-teal-100/70 px-2.5 py-0.5 rounded-md">
                {parameters.totalPoints || 20} Points
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={200}
                value={parameters.totalPoints || 20}
                onChange={(e) => handleTotalPointsChange(Number(e.target.value) || 20)}
                className="w-28 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900 text-center focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <span className="text-xs text-slate-500 font-medium">pts au total</span>
            </div>

            {/* Quick point presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Raccourcis :</span>
              {pointPresets.map((pt) => (
                <button
                  key={pt}
                  type="button"
                  onClick={() => handleTotalPointsChange(pt)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                    (parameters.totalPoints || 20) === pt
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pt} pts
                </button>
              ))}
            </div>
          </div>

          {/* Nombre d'exercices */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Nombre d'exercices à proposer <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-xs font-extrabold text-teal-700 bg-teal-100/70 px-2.5 py-0.5 rounded-md">
                {parameters.exerciseCount || 2} {((parameters.exerciseCount || 2) > 1) ? 'Exercices' : 'Exercice'}
              </span>
            </div>

            {/* Stepper + input */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleExerciseCountChange((parameters.exerciseCount || 2) - 1)}
                disabled={(parameters.exerciseCount || 2) <= 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                title="Diminuer le nombre d'exercices"
              >
                <Minus className="w-4 h-4" />
              </button>

              <input
                type="number"
                min={1}
                max={10}
                value={parameters.exerciseCount || 2}
                onChange={(e) => handleExerciseCountChange(Number(e.target.value) || 2)}
                className="w-20 px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900 text-center focus:ring-2 focus:ring-teal-500 outline-none"
              />

              <button
                type="button"
                onClick={() => handleExerciseCountChange((parameters.exerciseCount || 2) + 1)}
                disabled={(parameters.exerciseCount || 2) >= 10}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                title="Augmenter le nombre d'exercices"
              >
                <Plus className="w-4 h-4" />
              </button>

              <span className="text-xs text-slate-500 font-medium">partie(s)</span>
            </div>

            {/* Quick Exercise Count Selector Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {exerciseCountPresets.map((item) => {
                const isSelected = (parameters.exerciseCount || 2) === item.count;
                return (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => handleExerciseCountChange(item.count)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Répartition Automatique & Personnalisée des Points par Exercice */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Détail du Barème Automatique par Exercice ({parameters.exerciseCount || 2} parties)
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ajustez les points ou les intitulés de chaque exercice. L'IA respectera scrupuleusement cette répartition.
              </p>
            </div>

            {/* Presets de répartition */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Profils :</span>
              <button
                type="button"
                onClick={() => handleApplyPresetDistribution('apc')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1"
                title="Format APC Officiel MINESEC (50% Ressources / 50% Compétences)"
              >
                <GraduationCap className="w-3 h-3 text-teal-600" />
                <span>Format APC</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetDistribution('balanced')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1"
                title="Diviser les points de manière égale"
              >
                <Scale className="w-3 h-3 text-teal-600" />
                <span>Équilibré</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPresetDistribution('progressive')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1"
                title="Progression croissante de la difficulté et des points"
              >
                <TrendingUp className="w-3 h-3 text-teal-600" />
                <span>Progressif</span>
              </button>
            </div>
          </div>

          {/* Exercises list configuration cards */}
          <div className="space-y-2.5">
            {activeBreakdown.map((item, idx) => {
              const pts = Number(item.points) || 0;
              const percent = targetTotal > 0 ? Math.round((pts / targetTotal) * 100) : 0;
              return (
                <div
                  key={idx}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleExerciseTitleChange(idx, e.target.value)}
                        placeholder={`Titre ou objectif de l'Exercice ${idx + 1}`}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Points controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleExercisePointChange(idx, pts - 0.5)}
                        disabled={pts <= 0.5}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 text-xs font-bold"
                        title="- 0.5 point"
                      >
                        -0.5
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExercisePointChange(idx, pts - 1)}
                        disabled={pts <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 text-xs font-bold"
                        title="- 1 point"
                      >
                        -1
                      </button>

                      <div className="flex items-center gap-1 px-2">
                        <input
                          type="number"
                          step={0.5}
                          min={0.25}
                          max={targetTotal}
                          value={pts}
                          onChange={(e) => handleExercisePointChange(idx, Number(e.target.value) || 1)}
                          className="w-16 px-2 py-1 rounded-lg bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 text-center focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                        <span className="text-xs font-bold text-teal-900">pts</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleExercisePointChange(idx, pts + 0.5)}
                        disabled={pts >= targetTotal}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 text-xs font-bold"
                        title="+ 0.5 point"
                      >
                        +0.5
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExercisePointChange(idx, pts + 1)}
                        disabled={pts >= targetTotal}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 text-xs font-bold"
                        title="+ 1 point"
                      >
                        +1
                      </button>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 w-12 text-right">
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Validation & Balance footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Somme des exercices :</span>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                isSumBalanced 
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                {isSumBalanced ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentTotalSum} / {targetTotal} pts (Parfaitement équilibré)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {currentTotalSum} / {targetTotal} pts ({diffPoints > 0 ? `+${diffPoints} pt(s) à attribuer` : `${diffPoints} pt(s) en trop`})
                    </span>
                  </>
                )}
              </span>
            </div>

            {!isSumBalanced && (
              <button
                type="button"
                onClick={handleAutoRebalance}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                title="Ajuster automatiquement les points pour atteindre très exactement le barème total"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Ajuster automatiquement sur {targetTotal} pts</span>
              </button>
            )}
          </div>
        </div>

        {/* Type d'évaluation */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Type d'évaluation souhaité
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {evaluationTypes.map((type) => {
              const isSelected = parameters.evaluationType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => updateField('evaluationType', type.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-500'
                      : 'bg-slate-50/50 hover:bg-slate-100/50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-teal-900' : 'text-slate-900'}`}>
                      {type.label}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{type.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Niveau de difficulté */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Progression & Niveau de difficulté
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {difficultyLevels.map((diff) => {
              const isSelected = parameters.difficulty === diff.id;
              return (
                <button
                  type="button"
                  key={diff.id}
                  onClick={() => updateField('difficulty', diff.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-500'
                      : 'bg-slate-50/50 hover:bg-slate-100/50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 mb-0.5">{diff.label}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-2 leading-tight">{diff.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Consignes & Compétences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Compétences à cibler en priorité (Optionnel)
            </label>
            <textarea
              rows={2}
              placeholder="ex: Résolution de situation-problème de vie courante, calcul de rendement..."
              value={parameters.competencies || ''}
              onChange={(e) => updateField('competencies', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Consignes spécifiques pour les élèves
            </label>
            <textarea
              rows={2}
              placeholder="ex: Calculatrice autorisée, Rédiger avec clarté, soigner les schémas..."
              value={parameters.specialInstructions || ''}
              onChange={(e) => updateField('specialInstructions', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Launch Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white">
        <div className="text-xs text-slate-300">
          <div className="font-semibold text-white">
            {parameters.subject ? `${parameters.subject} (${parameters.gradeLevel || 'Classe'})` : 'Prêt à concevoir votre épreuve'}
          </div>
          <div className="text-[11px] opacity-80">
            {parameters.chapterTheme ? `Chapitre : ${parameters.chapterTheme} • Coeff ${parameters.coefficient || 1} • ${parameters.exerciseCount || 2} exercices (${parameters.totalPoints || 20} pts)` : 'Renseignez la matière et le chapitre pour lancer la conception.'}
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onAnalyze}
            disabled={isLoading || !parameters.subject || !parameters.chapterTheme}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors border border-slate-700"
          >
            Diagnostic Préalable
          </button>
          <button
            onClick={onGenerate}
            disabled={isLoading || !parameters.subject || !parameters.chapterTheme}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Conception en cours...</span>
              </>
            ) : (
              <>
                <span>Concevoir l'Évaluation & Corrigé</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
