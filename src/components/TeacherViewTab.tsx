import React, { useState } from 'react';
import { Download, Printer, Copy, Check, CheckCircle, Award, BookOpen, AlertCircle, Edit3, Save, Sparkles, HelpCircle, FileDown, Building2 } from 'lucide-react';
import { ExamEvaluation, QuestionItem, AcademicHeaderInfo } from '../types';
import { exportTeacherCorrectionDocx, copyFormattedText } from '../utils/docxExport';
import { exportTeacherCorrectionPdf } from '../utils/pdfExport';
import { ExamAcademicHeader } from './ExamAcademicHeader';
import { ExamHeaderModal } from './ExamHeaderModal';

interface TeacherViewTabProps {
  exam: ExamEvaluation;
  onUpdateExam: (updated: ExamEvaluation) => void;
  onExportSuccess?: () => void;
}

export const TeacherViewTab: React.FC<TeacherViewTabProps> = ({ exam, onUpdateExam, onExportSuccess }) => {
  const [copied, setCopied] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [editedExam, setEditedExam] = useState<ExamEvaluation>(exam);

  React.useEffect(() => {
    setEditedExam(exam);
  }, [exam]);

  const handleSaveHeader = (updatedHeader: AcademicHeaderInfo) => {
    const updatedExam: ExamEvaluation = {
      ...exam,
      academicHeader: updatedHeader,
      updatedAt: new Date().toISOString(),
    };
    onUpdateExam(updatedExam);
  };

  const handleCopy = () => {
    const text = copyFormattedText(exam, 'teacher');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportTeacherCorrectionDocx(exam);
      onExportSuccess?.();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    try {
      exportTeacherCorrectionPdf(exam);
      onExportSuccess?.();
    } catch (e) {
      console.error('Erreur export PDF corrigé:', e);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEdits = () => {
    onUpdateExam({
      ...editedExam,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleQuestionChange = (exIdx: number, qIdx: number, field: keyof QuestionItem, value: any) => {
    const nextExercises = [...editedExam.exercises];
    const targetEx = { ...nextExercises[exIdx] };
    const nextQuestions = [...targetEx.questions];
    nextQuestions[qIdx] = {
      ...nextQuestions[qIdx],
      [field]: value,
    };
    targetEx.questions = nextQuestions;
    nextExercises[exIdx] = targetEx;

    setEditedExam({
      ...editedExam,
      exercises: nextExercises,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="no-print bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold uppercase tracking-wider">
            Document 2
          </span>
          <h2 className="text-sm font-bold text-slate-900">
            Corrigé Officiel & Barème Détaillé (Version Enseignant)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton Personnaliser l'en-tête */}
          <button
            onClick={() => setIsHeaderModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-all shadow-2xs"
            title="Modifier l'en-tête, le style (MINESEC, cartouche APC), la session et les délégations"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Personnaliser l'en-tête</span>
          </button>

          {isEditing ? (
            <button
              onClick={handleSaveEdits}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer le corrigé</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ajuster critères</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copier corrigé</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>

          <button
            id="btn-export-teacher-pdf"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Exportation...' : 'Exporter en PDF'}</span>
          </button>

          <button
            id="btn-export-teacher-word"
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter Corrigé (.docx)</span>
          </button>
        </div>
      </div>

      {/* Pedagogical Competencies Summary Box */}
      {exam.analysis && (
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Repères Pédagogiques pour la Correction</span>
            </h3>
            <span className="text-[11px] text-teal-800 font-bold bg-teal-100 px-2 py-0.5 rounded">
              Barème Total : {exam.targetTotalPoints} pts
            </span>
          </div>
          <div className="text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">Notions évaluées : </span>
            {exam.analysis.evaluatedConcepts?.join(', ') || 'N/A'}
          </div>
          <div className="text-slate-600 italic">
            <span className="font-semibold text-slate-800 not-italic">Compétences : </span>
            {exam.analysis.skillsBreakdown}
          </div>
        </div>
      )}

      {/* CORRECTION SHEET CONTAINER */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-0 space-y-6 text-slate-900 font-sans">
        {/* Academic Header (Customizable) */}
        <ExamAcademicHeader
          header={exam.academicHeader}
          targetTotalPoints={exam.targetTotalPoints}
          onEditHeader={() => setIsHeaderModalOpen(true)}
          isTeacherVersion={true}
        />

        {/* Exercises Correction */}
        <div className="space-y-8">
          {(isEditing ? editedExam.exercises : exam.exercises).map((exercise, exIdx) => (
            <div key={exercise.id} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-300 pb-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  Exercice {exercise.number} : {exercise.title}
                </h3>
                <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  Barème : {exercise.totalPoints} points
                </span>
              </div>

              {/* Questions Details */}
              <div className="space-y-5">
                {exercise.questions.map((question, qIdx) => (
                  <div
                    key={question.id}
                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2.5"
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">{question.number}</span>
                        <span className="font-semibold text-slate-800">{question.text}</span>
                      </div>
                      <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded text-[11px] shrink-0">
                        {question.points} pt{question.points > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Taxonomy badge if present */}
                    {question.taxonomy && (
                      <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                        Compétence : <span className="text-slate-700">{question.taxonomy}</span>
                      </div>
                    )}

                    {/* Expected Answer */}
                    <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Réponse attendue :</span>
                      </div>
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={question.expectedAnswer}
                          onChange={(e) => handleQuestionChange(exIdx, qIdx, 'expectedAnswer', e.target.value)}
                          className="w-full p-2 rounded bg-white border border-slate-300 text-xs font-mono"
                        />
                      ) : (
                        <p className="text-slate-800 whitespace-pre-line leading-relaxed font-mono text-[11.5px]">
                          {question.expectedAnswer}
                        </p>
                      )}
                    </div>

                    {/* Solution Method */}
                    {(question.solutionMethod || isEditing) && (
                      <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-200 text-xs space-y-1">
                        <div className="font-bold text-sky-900">Méthode / Démarche étape par étape :</div>
                        {isEditing ? (
                          <textarea
                            rows={2}
                            value={question.solutionMethod || ''}
                            onChange={(e) => handleQuestionChange(exIdx, qIdx, 'solutionMethod', e.target.value)}
                            className="w-full p-2 rounded bg-white border border-slate-300 text-xs"
                          />
                        ) : (
                          <p className="text-slate-700 leading-relaxed italic">{question.solutionMethod}</p>
                        )}
                      </div>
                    )}

                    {/* Partial Credit Criteria */}
                    {(question.partialCreditCriteria || isEditing) && (
                      <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                        <div className="font-bold text-amber-900 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          <span>Barème partiel & Critères d'attribution :</span>
                        </div>
                        {isEditing ? (
                          <textarea
                            rows={2}
                            value={question.partialCreditCriteria || ''}
                            onChange={(e) => handleQuestionChange(exIdx, qIdx, 'partialCreditCriteria', e.target.value)}
                            className="w-full p-2 rounded bg-white border border-slate-300 text-xs"
                          />
                        ) : (
                          <p className="text-slate-800 leading-relaxed">{question.partialCreditCriteria}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Header Customization Modal */}
      <ExamHeaderModal
        isOpen={isHeaderModalOpen}
        onClose={() => setIsHeaderModalOpen(false)}
        header={exam.academicHeader}
        targetTotalPoints={exam.targetTotalPoints}
        onSave={handleSaveHeader}
      />
    </div>
  );
};
