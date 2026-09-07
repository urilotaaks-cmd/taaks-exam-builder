import React, { useState } from 'react';
import { Download, Printer, Copy, Check, CheckCircle2, AlertTriangle, Edit3, Save, Sparkles, Layers, BookOpen, FileDown, Building2 } from 'lucide-react';
import { ExamEvaluation, ExerciseItem, QuestionItem, AcademicHeaderInfo } from '../types';
import { exportStudentExamDocx, copyFormattedText } from '../utils/docxExport';
import { exportStudentExamPdf } from '../utils/pdfExport';
import { ExamAcademicHeader } from './ExamAcademicHeader';
import { ExamHeaderModal } from './ExamHeaderModal';

interface StudentViewTabProps {
  exam: ExamEvaluation;
  onUpdateExam: (updated: ExamEvaluation) => void;
  onGenerateVariant: () => void;
  onExportSuccess?: () => void;
  isGeneratingVariant: boolean;
}

export const StudentViewTab: React.FC<StudentViewTabProps> = ({
  exam,
  onUpdateExam,
  onGenerateVariant,
  onExportSuccess,
  isGeneratingVariant,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [editedExam, setEditedExam] = useState<ExamEvaluation>(exam);

  // Sync if exam changes
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
    const text = copyFormattedText(exam, 'student');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportStudentExamDocx(exam);
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
      exportStudentExamPdf(exam);
      onExportSuccess?.();
    } catch (e) {
      console.error('Erreur export PDF:', e);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEdits = () => {
    // Recalculate totals
    let calculatedTotal = 0;
    const updatedExercises = editedExam.exercises.map((ex) => {
      let exTotal = 0;
      ex.questions.forEach((q) => {
        exTotal += Number(q.points) || 0;
      });
      calculatedTotal += exTotal;
      return {
        ...ex,
        totalPoints: exTotal,
      };
    });

    const finalized: ExamEvaluation = {
      ...editedExam,
      exercises: updatedExercises,
      calculatedTotalPoints: calculatedTotal,
      isBaremeValid: Math.abs(calculatedTotal - editedExam.targetTotalPoints) < 0.01,
      updatedAt: new Date().toISOString(),
    };

    onUpdateExam(finalized);
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
          <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
            Document 1
          </span>
          <h2 className="text-sm font-bold text-slate-900">Sujet — Version Élève (Prêt à l'emploi)</h2>
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
              <span>Enregistrer modifications</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Éditer le texte</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copier</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>

          <button
            id="btn-export-student-pdf"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Exportation...' : 'Exporter en PDF'}</span>
          </button>

          <button
            id="btn-export-student-word"
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter Word (.docx)</span>
          </button>
        </div>
      </div>

      {/* Barème sanity badge */}
      <div className="no-print">
        {exam.isBaremeValid ? (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Contrôle arithmétique : Somme totale conforme ({exam.calculatedTotalPoints} / {exam.targetTotalPoints} points).</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
              Barème Strict Validé
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 font-medium">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Écart de barème détecté : Total des questions = {exam.calculatedTotalPoints} pts (cible demandée : {exam.targetTotalPoints} pts).</span>
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-[11px] text-amber-800 font-bold underline hover:text-amber-950"
            >
              Ajuster les points
            </button>
          </div>
        )}
      </div>

      {/* PRINTABLE / REAL EXAM SHEET CONTAINER (A4 Style) */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-0 space-y-6 text-slate-900 font-sans">
        {/* Academic Header (Customizable) */}
        <ExamAcademicHeader
          header={exam.academicHeader}
          targetTotalPoints={exam.targetTotalPoints}
          onEditHeader={() => setIsHeaderModalOpen(true)}
          isTeacherVersion={false}
        />

        {/* Exercises */}
        <div className="space-y-8 pt-2">
          {(isEditing ? editedExam.exercises : exam.exercises).map((exercise, exIdx) => (
            <div key={exercise.id} className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-teal-800 pb-1">
                <h3 className="text-base font-bold text-slate-900">
                  Exercice {exercise.number} : {exercise.title}
                </h3>
                <span className="text-xs font-bold text-teal-800 px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                  {exercise.totalPoints} points
                </span>
              </div>

              {/* Context / Scenario */}
              {exercise.contextOrIntro && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 italic leading-relaxed whitespace-pre-line">
                  {exercise.contextOrIntro}
                </div>
              )}

              {/* Questions */}
              <div className="space-y-4 pl-1">
                {exercise.questions.map((question, qIdx) => (
                  <div key={question.id} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-3 text-xs leading-relaxed">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="font-bold text-slate-900 shrink-0">{question.number}</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={question.text}
                            onChange={(e) => handleQuestionChange(exIdx, qIdx, 'text', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-slate-50 border border-slate-300 text-xs"
                          />
                        ) : (
                          <span className="text-slate-800">{question.text}</span>
                        )}
                      </div>

                      {isEditing ? (
                        <input
                          type="number"
                          step={0.25}
                          value={question.points}
                          onChange={(e) => handleQuestionChange(exIdx, qIdx, 'points', Number(e.target.value) || 0)}
                          className="w-16 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-300 text-xs text-right font-bold text-teal-800"
                        />
                      ) : (
                        <span className="font-bold text-slate-600 shrink-0 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                          [{question.points} pt{question.points > 1 ? 's' : ''}]
                        </span>
                      )}
                    </div>

                    {/* Dotted lines for student answer */}
                    <div className="pt-1 pb-2">
                      <div className="border-b border-dotted border-slate-200 h-4"></div>
                      <div className="border-b border-dotted border-slate-200 h-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Quick Action */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200">
        <div className="text-xs text-slate-600">
          Besoin d'un Sujet B pour éviter la triche ou d'une variante avec mêmes critères ?
        </div>
        <button
          id="btn-quick-variant-bottom"
          onClick={onGenerateVariant}
          disabled={isGeneratingVariant}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGeneratingVariant ? 'Génération de la variante...' : 'Générer Sujet B (Variante)'}</span>
        </button>
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
