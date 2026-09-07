import React, { useState, useMemo } from 'react';
import {
  FolderArchive,
  Search,
  Filter,
  Layers,
  BookOpen,
  Calendar,
  GraduationCap,
  Download,
  FileText,
  CheckCircle,
  Eye,
  Trash2,
  PlusCircle,
  Hash,
  Award,
  Clock,
  ChevronRight,
  FolderOpen,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  FileDown,
  LayoutGrid,
  List,
  FolderTree
} from 'lucide-react';
import { ExamEvaluation } from '../types';
import { exportStudentExamDocx, exportTeacherCorrectionDocx } from '../utils/docxExport';
import { exportStudentExamPdf, exportTeacherCorrectionPdf } from '../utils/pdfExport';

interface ExamLibraryTabProps {
  savedExams: ExamEvaluation[];
  onLoadExam: (exam: ExamEvaluation) => void;
  onDeleteExam: (id: string) => void;
  onNewExam: () => void;
  currentExamId?: string;
}

type ViewMode = 'cards' | 'grouped' | 'table';

export const ExamLibraryTab: React.FC<ExamLibraryTabProps> = ({
  savedExams,
  onLoadExam,
  onDeleteExam,
  onNewExam,
  currentExamId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSequence, setSelectedSequence] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grouped');
  const [exportingId, setExportingId] = useState<string | null>(null);

  // Extract distinct filters
  const grades = useMemo(() => {
    const set = new Set<string>();
    savedExams.forEach((e) => {
      if (e.parameters?.gradeLevel) set.add(e.parameters.gradeLevel);
      else if (e.academicHeader?.gradeAndSubject) {
        const parts = e.academicHeader.gradeAndSubject.split('—');
        if (parts[0]) set.add(parts[0].trim());
      }
    });
    return Array.from(set).sort();
  }, [savedExams]);

  const subjects = useMemo(() => {
    const set = new Set<string>();
    savedExams.forEach((e) => {
      if (e.parameters?.subject) set.add(e.parameters.subject);
    });
    return Array.from(set).sort();
  }, [savedExams]);

  const sequences = useMemo(() => {
    const set = new Set<string>();
    savedExams.forEach((e) => {
      const seq = e.parameters?.evaluationDate || e.academicHeader?.date;
      if (seq) set.add(seq);
    });
    return Array.from(set).sort();
  }, [savedExams]);

  const years = useMemo(() => {
    const set = new Set<string>();
    savedExams.forEach((e) => {
      const yr = e.parameters?.schoolYear || e.academicHeader?.academicYear;
      if (yr) set.add(yr);
    });
    return Array.from(set).sort();
  }, [savedExams]);

  // Filtered exams
  const filteredExams = useMemo(() => {
    return savedExams.filter((exam) => {
      const grade = exam.parameters?.gradeLevel || '';
      const subject = exam.parameters?.subject || '';
      const seq = exam.parameters?.evaluationDate || exam.academicHeader?.date || '';
      const yr = exam.parameters?.schoolYear || exam.academicHeader?.academicYear || '';
      const title = exam.title || exam.academicHeader?.examTitle || '';
      const chapter = exam.parameters?.chapterTheme || '';

      const matchGrade = selectedGrade === 'all' || grade === selectedGrade;
      const matchSubject = selectedSubject === 'all' || subject === selectedSubject;
      const matchSeq = selectedSequence === 'all' || seq === selectedSequence;
      const matchYear = selectedYear === 'all' || yr === selectedYear;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        title.toLowerCase().includes(q) ||
        chapter.toLowerCase().includes(q) ||
        subject.toLowerCase().includes(q) ||
        grade.toLowerCase().includes(q) ||
        seq.toLowerCase().includes(q) ||
        yr.toLowerCase().includes(q);

      return matchGrade && matchSubject && matchSeq && matchYear && matchSearch;
    });
  }, [savedExams, selectedGrade, selectedSubject, selectedSequence, selectedYear, searchQuery]);

  // Grouped by Year -> Grade -> Subject -> Sequence
  const groupedExams = useMemo(() => {
    const map = new Map<string, Map<string, Map<string, ExamEvaluation[]>>>();

    filteredExams.forEach((exam) => {
      const yr = exam.parameters?.schoolYear || exam.academicHeader?.academicYear || 'Année Non Spécifiée';
      const gr = exam.parameters?.gradeLevel || 'Niveau Non Spécifié';
      const sb = exam.parameters?.subject || 'Matière Non Spécifiée';

      if (!map.has(yr)) map.set(yr, new Map());
      const yearMap = map.get(yr)!;

      if (!yearMap.has(gr)) yearMap.set(gr, new Map());
      const gradeMap = yearMap.get(gr)!;

      if (!gradeMap.has(sb)) gradeMap.set(sb, []);
      gradeMap.get(sb)!.push(exam);
    });

    return map;
  }, [filteredExams]);

  const handleExportDocx = async (exam: ExamEvaluation, isTeacher = false) => {
    setExportingId(exam.id);
    try {
      if (isTeacher) {
        await exportTeacherCorrectionDocx(exam);
      } else {
        await exportStudentExamDocx(exam);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExportingId(null);
    }
  };

  const handleExportPdf = (exam: ExamEvaluation, isTeacher = false) => {
    if (isTeacher) {
      exportTeacherCorrectionPdf(exam);
    } else {
      exportStudentExamPdf(exam);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-teal-600 text-white shadow-xs shrink-0">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
                  Base d'épreuves & Archives
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {savedExams.length} épreuve(s) enregistrée(s)
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Bibliothèque des Épreuves Générées</h2>
              <p className="text-xs text-slate-600">
                Vos épreuves archivées et classées par niveau, par matière, par numéro d'évaluation et par année scolaire.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grouped')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'grouped'
                    ? 'bg-white text-teal-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vue arborescente par Année & Niveau"
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dossiers</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-teal-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vue en fiches / grille"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grille</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-teal-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vue tabulaire compacte"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tableau</span>
              </button>
            </div>

            <button
              id="btn-create-new-exam-library"
              onClick={onNewExam}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Concevoir une nouvelle épreuve</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Rechercher par chapitre, titre, mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Active Filters Summary */}
          <div className="flex items-center gap-2 text-xs text-slate-500 w-full lg:w-auto justify-end">
            <span className="font-semibold text-slate-700">{filteredExams.length}</span> épreuve(s) trouvée(s)
            {(selectedGrade !== 'all' || selectedSubject !== 'all' || selectedSequence !== 'all' || selectedYear !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedGrade('all');
                  setSelectedSubject('all');
                  setSelectedSequence('all');
                  setSelectedYear('all');
                  setSearchQuery('');
                }}
                className="text-[11px] text-teal-600 hover:underline font-semibold ml-2"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>

        {/* 4 Classification Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* 1. Filter: Année Scolaire */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
              <span>Année Scolaire</span>
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
            >
              <option value="all">Toutes les années ({years.length})</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* 2. Filter: Niveau / Classe */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>Classe / Niveau</span>
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
            >
              <option value="all">Toutes les classes ({grades.length})</option>
              {grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* 3. Filter: Matière */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>Matière / Discipline</span>
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
            >
              <option value="all">Toutes les matières ({subjects.length})</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 4. Filter: Numéro / Évaluation */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>Numéro / Période</span>
            </label>
            <select
              value={selectedSequence}
              onChange={(e) => setSelectedSequence(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
            >
              <option value="all">Toutes les périodes ({sequences.length})</option>
              {sequences.map((sq) => (
                <option key={sq} value={sq}>{sq}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Grouped View / Cards View / Table View */}
      {filteredExams.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-800 mb-1">Aucune épreuve correspondante</h3>
            <p className="text-xs text-slate-500">
              {savedExams.length === 0
                ? "Vous n'avez pas encore généré d'épreuve enregistrée dans la base. Créez votre première épreuve pour l'archiver ici."
                : 'Aucune épreuve ne correspond aux filtres sélectionnés. Essayez de modifier vos critères de recherche.'}
            </p>
          </div>
          <button
            onClick={onNewExam}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Créer une épreuve</span>
          </button>
        </div>
      ) : viewMode === 'grouped' ? (
        /* VUE GROUPÉE PAR ANNÉE -> CLASSE -> MATIÈRE */
        <div className="space-y-8">
          {Array.from(groupedExams.entries()).map(([yearName, gradeMap]) => (
            <div key={yearName} className="space-y-4">
              {/* Year Folder Header */}
              <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xs">
                <GraduationCap className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold tracking-wide uppercase">
                  Année Scolaire : {yearName}
                </h3>
              </div>

              {/* Grades in this Year */}
              <div className="space-y-6 pl-2 sm:pl-4 border-l-2 border-slate-200">
                {Array.from(gradeMap.entries()).map(([gradeName, subjectMap]) => (
                  <div key={gradeName} className="space-y-3">
                    {/* Grade Header */}
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200">
                      <Layers className="w-4 h-4 text-teal-600" />
                      <span>Classe / Niveau : {gradeName}</span>
                    </div>

                    {/* Subjects in this Grade */}
                    <div className="space-y-4 pl-3 sm:pl-5">
                      {Array.from(subjectMap.entries()).map(([subjectName, examsList]) => (
                        <div key={subjectName} className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-teal-900 bg-teal-50 px-3 py-1.5 rounded-lg w-fit border border-teal-200">
                            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                            <span>{subjectName} ({examsList.length} épreuve{examsList.length > 1 ? 's' : ''})</span>
                          </div>

                          {/* Grid of Exams for this Subject */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {examsList.map((exam) => (
                              <ExamCard
                                key={exam.id}
                                exam={exam}
                                isCurrent={exam.id === currentExamId}
                                isExporting={exportingId === exam.id}
                                onLoadExam={() => onLoadExam(exam)}
                                onDeleteExam={() => onDeleteExam(exam.id)}
                                onExportDocx={(isTeacher) => handleExportDocx(exam, isTeacher)}
                                onExportPdf={(isTeacher) => handleExportPdf(exam, isTeacher)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'cards' ? (
        /* VUE GRILLE DE CARTES */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              isCurrent={exam.id === currentExamId}
              isExporting={exportingId === exam.id}
              onLoadExam={() => onLoadExam(exam)}
              onDeleteExam={() => onDeleteExam(exam.id)}
              onExportDocx={(isTeacher) => handleExportDocx(exam, isTeacher)}
              onExportPdf={(isTeacher) => handleExportPdf(exam, isTeacher)}
            />
          ))}
        </div>
      ) : (
        /* VUE TABLEAU COMPACT */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Année & Période</th>
                  <th className="px-4 py-3">Classe & Matière</th>
                  <th className="px-4 py-3">Chapitre / Thème</th>
                  <th className="px-4 py-3 text-center">Coeff.</th>
                  <th className="px-4 py-3 text-center">Points</th>
                  <th className="px-4 py-3 text-center">Durée</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExams.map((exam) => {
                  const yr = exam.parameters?.schoolYear || exam.academicHeader?.academicYear || '2025-2026';
                  const seq = exam.parameters?.evaluationDate || exam.academicHeader?.date || 'Séquence';
                  const gr = exam.parameters?.gradeLevel || 'Niveau';
                  const sb = exam.parameters?.subject || 'Matière';
                  const coeff = exam.parameters?.coefficient || 1;
                  const isCurrent = exam.id === currentExamId;

                  return (
                    <tr key={exam.id} className={`hover:bg-slate-50 transition-colors ${isCurrent ? 'bg-teal-50/40' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{seq}</div>
                        <div className="text-[10px] text-slate-500">{yr}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-teal-900">{sb}</div>
                        <div className="text-[11px] text-slate-600">{gr}</div>
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">
                        <span className="font-medium text-slate-800" title={exam.parameters?.chapterTheme || exam.title}>
                          {exam.parameters?.chapterTheme || exam.title}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          {coeff}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700">
                        {exam.calculatedTotalPoints || exam.targetTotalPoints || 20} pts
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">
                        {exam.parameters?.duration || '2h'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onLoadExam(exam)}
                            className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-1 transition-colors"
                            title="Ouvrir dans l'espace de travail"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Ouvrir</span>
                          </button>
                          <button
                            onClick={() => handleExportDocx(exam, false)}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200"
                            title="Exporter Sujet Word"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleExportPdf(exam, false)}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 border border-slate-200"
                            title="Exporter Sujet PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteExam(exam.id)}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-800 text-slate-400 border border-slate-200"
                            title="Supprimer de la base"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

interface ExamCardProps {
  exam: ExamEvaluation;
  isCurrent: boolean;
  isExporting: boolean;
  onLoadExam: () => void;
  onDeleteExam: () => void;
  onExportDocx: (isTeacher: boolean) => void;
  onExportPdf: (isTeacher: boolean) => void;
}

const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  isCurrent,
  isExporting,
  onLoadExam,
  onDeleteExam,
  onExportDocx,
  onExportPdf,
}) => {
  const yr = exam.parameters?.schoolYear || exam.academicHeader?.academicYear || '2025 - 2026';
  const seq = exam.parameters?.evaluationDate || exam.academicHeader?.date || 'Évaluation Séquentielle';
  const gr = exam.parameters?.gradeLevel || 'Niveau';
  const sb = exam.parameters?.subject || 'Matière';
  const coeff = exam.parameters?.coefficient || 1;
  const pts = exam.calculatedTotalPoints || exam.targetTotalPoints || 20;
  const chapter = exam.parameters?.chapterTheme || exam.title;
  const exCount = exam.exercises?.length || 2;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs relative ${
        isCurrent
          ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {isCurrent && (
        <div className="absolute -top-2.5 right-4 bg-teal-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
          Active dans l'éditeur
        </div>
      )}

      {/* Card Header */}
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 text-[10px] font-extrabold">
            {gr}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-semibold">
            {yr}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
            Coeff. {coeff}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 text-[10px] font-bold">
            {pts} pts
          </span>
        </div>

        {/* Evaluation Number / Sequence */}
        <div className="text-xs font-bold text-emerald-800 mb-1 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>{seq}</span>
        </div>

        {/* Subject & Chapter Title */}
        <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1.5">
          {sb}
        </h4>
        <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-3 leading-relaxed">
          {chapter}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl mb-4 border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{exam.parameters?.duration || '2 heures'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{exCount} exercice(s) / APC</span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        {/* Main Open Button */}
        <button
          type="button"
          onClick={onLoadExam}
          className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{isCurrent ? "Consulter le Sujet Élève" : "Ouvrir & Consulter dans l'éditeur"}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-auto" />
        </button>

        {/* Quick Export & Delete Toolbar */}
        <div className="flex items-center justify-between gap-1 text-xs">
          <div className="flex items-center gap-1">
            {/* Word Export Menu */}
            <button
              type="button"
              disabled={isExporting}
              onClick={() => onExportDocx(false)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[10px] font-semibold border border-slate-200 transition-colors"
              title="Télécharger Sujet en Word (.docx)"
            >
              Word
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => onExportPdf(false)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-[10px] font-semibold border border-slate-200 transition-colors"
              title="Télécharger Sujet en PDF"
            >
              PDF Sujet
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => onExportPdf(true)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[10px] font-semibold border border-slate-200 transition-colors"
              title="Télécharger Corrigé en PDF"
            >
              PDF Corrigé
            </button>
          </div>

          <button
            type="button"
            onClick={onDeleteExam}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
            title="Supprimer cette épreuve de la base"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
