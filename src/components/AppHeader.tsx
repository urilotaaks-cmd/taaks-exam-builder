import React from 'react';
import { Sparkles, FileText, CheckCircle2, AlertTriangle, Printer, Download, Plus, Copy, Check, FileDown, FolderArchive } from 'lucide-react';
import { ExamEvaluation } from '../types';
import { exportStudentExamDocx, exportTeacherCorrectionDocx, copyFormattedText } from '../utils/docxExport';
import { exportStudentExamPdf, exportTeacherCorrectionPdf } from '../utils/pdfExport';

interface AppHeaderProps {
  exam: ExamEvaluation | null;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onNewExam: () => void;
  onExportSuccess?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ exam, activeTab, onSelectTab, onNewExam, onExportSuccess }) => {
  const [copied, setCopied] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleCopy = (mode: 'student' | 'teacher' | 'both') => {
    if (!exam) return;
    const text = copyFormattedText(exam, mode);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportStudentPdf = () => {
    if (!exam) return;
    exportStudentExamPdf(exam);
    onExportSuccess?.();
  };

  const handleExportTeacherPdf = () => {
    if (!exam) return;
    exportTeacherCorrectionPdf(exam);
    onExportSuccess?.();
  };

  const handleExportStudentWord = async () => {
    if (!exam) return;
    setIsExporting(true);
    try {
      await exportStudentExamDocx(exam);
      onExportSuccess?.();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportTeacherWord = async () => {
    if (!exam) return;
    setIsExporting(true);
    try {
      await exportTeacherCorrectionDocx(exam);
      onExportSuccess?.();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              T
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-lg">TAAK'S EXAM BUILDER</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AI TAAK'S INCUBATOR
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Conception, barème strict, corrigé & contrôle qualité pour enseignants
              </p>
            </div>
          </div>

          {/* Quick status & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="btn-header-library"
              onClick={() => onSelectTab('library')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                activeTab === 'library'
                  ? 'bg-teal-50 border-teal-300 text-teal-900 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
              title="Consulter la base des épreuves générées"
            >
              <FolderArchive className="w-3.5 h-3.5 text-teal-600" />
              <span>Base d'épreuves</span>
            </button>

            {exam && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700">Barème :</span>
                {exam.isBaremeValid ? (
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {exam.calculatedTotalPoints} / {exam.targetTotalPoints} pts (Exact)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-700 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {exam.calculatedTotalPoints} / {exam.targetTotalPoints} pts (Écart détecté)
                  </span>
                )}
                <span className="text-slate-300">|</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[11px]">
                  Version {exam.version}
                </span>
              </div>
            )}

            {exam && (
              <div className="relative group">
                <button
                  id="btn-export-dropdown"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter</span>
                </button>
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 hidden group-hover:block z-50">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Format PDF (Prêt à imprimer)
                  </div>
                  <button
                    onClick={handleExportStudentPdf}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-teal-50 text-xs text-slate-800 font-medium flex items-center justify-between"
                  >
                    <span>📄 Sujet (PDF Élève)</span>
                    <span className="text-[10px] text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded font-bold">.pdf</span>
                  </button>
                  <button
                    onClick={handleExportTeacherPdf}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-50 text-xs text-slate-800 font-medium flex items-center justify-between mt-0.5"
                  >
                    <span>🎯 Corrigé (PDF Enseignant)</span>
                    <span className="text-[10px] text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded font-bold">.pdf</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Format Word (.docx modifiable)
                  </div>
                  <button
                    onClick={handleExportStudentWord}
                    disabled={isExporting}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-teal-50 text-xs text-slate-800 font-medium flex items-center justify-between"
                  >
                    <span>📄 Sujet (Word Élève)</span>
                    <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-medium">.docx</span>
                  </button>
                  <button
                    onClick={handleExportTeacherWord}
                    disabled={isExporting}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-rose-50 text-xs text-slate-800 font-medium flex items-center justify-between mt-0.5"
                  >
                    <span>🎯 Corrigé (Word Enseignant)</span>
                    <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-medium">.docx</span>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => handleCopy('both')}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-xs text-slate-600 flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copier texte complet</span>
                  </button>
                </div>
              </div>
            )}

            <button
              id="btn-new-exam-header"
              onClick={onNewExam}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Sujet</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
