import React, { useState, useEffect } from 'react';
import { AppHeader } from './components/AppHeader';
import { WorkflowNavigation } from './components/WorkflowNavigation';
import { ReferenceDocsTab } from './components/ReferenceDocsTab';
import { ParametersTab } from './components/ParametersTab';
import { AnalysisTab } from './components/AnalysisTab';
import { StudentViewTab } from './components/StudentViewTab';
import { TeacherViewTab } from './components/TeacherViewTab';
import { QualityControlTab } from './components/QualityControlTab';
import { VariantsAndCommandsTab } from './components/VariantsAndCommandsTab';
import { ExamLibraryTab } from './components/ExamLibraryTab';
import { ExamEvaluation, ExamParameters, ReferenceDocument, QuickCommandType } from './types';
import { SAMPLE_REFERENCE_DOCUMENTS, DEFAULT_PARAMETERS, getFreshExamParameters } from './data/presets';
import { INITIAL_SEEDED_EXAM } from './data/initialExam';
import { AlertCircle, Sparkles, CheckCircle2, X, FolderArchive, PlusCircle, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'taaks_saved_exams_v1';

export default function App() {
  // Load saved library from localStorage or seed
  const [savedExams, setSavedExams] = useState<ExamEvaluation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Erreur lecture localStorage:', e);
    }
    return [INITIAL_SEEDED_EXAM];
  });

  // State: Workspace is clean by default; the previous exam is stored in the library
  const [documents, setDocuments] = useState<ReferenceDocument[]>([]);
  const [parameters, setParameters] = useState<ExamParameters>(getFreshExamParameters);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [currentExam, setCurrentExam] = useState<ExamEvaluation | null>(null);
  const [examVersions, setExamVersions] = useState<ExamEvaluation[]>([]);
  const [activeTab, setActiveTab] = useState<string>('parameters');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync savedExams with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedExams));
    } catch (e) {
      console.error('Erreur sauvegarde localStorage:', e);
    }
  }, [savedExams]);

  // Helper to upsert an exam in the library
  const upsertExamInLibrary = (exam: ExamEvaluation) => {
    setSavedExams((prev) => {
      const filtered = prev.filter((e) => e.id !== exam.id);
      return [exam, ...filtered];
    });
  };

  // Handlers for Reference Docs
  const handleAddDocument = (doc: ReferenceDocument) => {
    setDocuments((prev) => [...prev, doc]);
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearDocuments = () => {
    setDocuments([]);
  };

  const handleLoadPreset = (preset: ReferenceDocument) => {
    if (!documents.some((d) => d.id === preset.id)) {
      setDocuments((prev) => [...prev, preset]);
    }
  };

  // Reset & Archive Active Workspace
  const handleResetParameters = () => {
    if (currentExam) {
      upsertExamInLibrary(currentExam);
    }
    setCurrentExam(null);
    setAnalysisResult(null);
    setParameters((prev) => getFreshExamParameters(prev));
    setDocuments([]);
    setExamVersions([]);
    setSuccessToast("Épreuve précédente archivée dans la Base d'épreuves. L'espace de travail est réinitialisé et vierge.");
    setTimeout(() => setSuccessToast(null), 5000);
  };

  // Auto-reset parameters after export (while keeping exam in library)
  const handleExportSuccess = () => {
    if (currentExam) {
      upsertExamInLibrary(currentExam);
    }
    setParameters((prev) => getFreshExamParameters(prev));
    setDocuments([]);
    setAnalysisResult(null);
    setSuccessToast("Épreuve exportée et archivée dans la Base d'épreuves ! Paramètres réinitialisés pour votre prochaine conception.");
    setTimeout(() => setSuccessToast(null), 6000);
  };

  // Load Exam from Library
  const handleLoadExamFromLibrary = (exam: ExamEvaluation) => {
    setCurrentExam(exam);
    if (exam.parameters) {
      setParameters(exam.parameters);
    }
    if (exam.analysis) {
      setAnalysisResult(exam.analysis);
    }
    setExamVersions([exam]);
    setActiveTab('student');
    setSuccessToast(`Épreuve « ${exam.parameters?.chapterTheme || exam.title} » chargée dans l'espace de travail.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Delete Exam from Library
  const handleDeleteExamFromLibrary = (id: string) => {
    setSavedExams((prev) => prev.filter((e) => e.id !== id));
    if (currentExam?.id === id) {
      setCurrentExam(null);
      setAnalysisResult(null);
    }
    setSuccessToast("Épreuve supprimée de la base d'épreuves.");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // 1. Analyze Documents
  const handleAnalyze = async () => {
    setIsLoading(true);
    setLoadingMessage('Analyse pédagogique des documents et vérification des compétences...');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/exam/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameters, documents }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de l\'analyse');
      }

      setAnalysisResult(data.analysis);
      setActiveTab('analysis');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Impossible de contacter le service d\'analyse');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 2. Generate Complete Exam + Barème + Corrigé
  const handleGenerate = async () => {
    setIsLoading(true);
    setLoadingMessage(`Conception du sujet pour ${parameters.gradeLevel} en ${parameters.subject} (${parameters.chapterTheme})...`);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameters, documents }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la génération de l\'évaluation');
      }

      const newExam: ExamEvaluation = data.evaluation;
      setCurrentExam(newExam);
      setExamVersions((prev) => [newExam, ...prev]);
      upsertExamInLibrary(newExam);
      setActiveTab('student');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Échec de la génération de l\'évaluation');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 3. Generate Variant (Sujet B)
  const handleGenerateVariant = async (note?: string) => {
    if (!currentExam) return;
    setIsLoading(true);
    setLoadingMessage('Création du Sujet B : renouvellement des données avec barème identique...');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/exam/variante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalEvaluation: currentExam, variantNote: note }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la génération de la variante');
      }

      const variantExam: ExamEvaluation = data.evaluation;
      setCurrentExam(variantExam);
      setExamVersions((prev) => [...prev, variantExam]);
      upsertExamInLibrary(variantExam);
      setActiveTab('student');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Échec de la génération de la variante');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 4. Quick Commands
  const handleExecuteCommand = async (command: QuickCommandType, extraPrompt?: string) => {
    if (!currentExam) return;

    if (command === '/controle') {
      handleRunQualityAudit();
      return;
    }

    if (command === '/nouveau_sujet') {
      handleResetParameters();
      setActiveTab('parameters');
      return;
    }

    setIsLoading(true);
    setLoadingMessage(`Exécution de la commande ${command} en cours...`);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/exam/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluation: currentExam,
          command,
          extraPrompt,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de l\'exécution de la commande');
      }

      const updatedExam: ExamEvaluation = data.evaluation;
      setCurrentExam(updatedExam);
      setExamVersions((prev) => [updatedExam, ...prev.filter((e) => e.id !== updatedExam.id)]);
      upsertExamInLibrary(updatedExam);
      setActiveTab('student');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Échec de la commande');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 5. Quality Control Audit
  const handleRunQualityAudit = async () => {
    if (!currentExam) return;
    setIsLoading(true);
    setLoadingMessage('Audit Qualité 5D : Pédagogique, Technique, Barème, Références & Présentation...');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/exam/quality-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evaluation: currentExam, documents }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du contrôle qualité');
      }

      const updatedExam: ExamEvaluation = {
        ...currentExam,
        qualityCheck: data.qualityCheck,
      };

      setCurrentExam(updatedExam);
      setExamVersions((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
      upsertExamInLibrary(updatedExam);
      setActiveTab('quality');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Échec de l\'audit qualité');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleNewExam = () => {
    handleResetParameters();
    setActiveTab('parameters');
  };

  const handleUpdateCurrentExam = (updated: ExamEvaluation) => {
    setCurrentExam(updated);
    upsertExamInLibrary(updated);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <AppHeader
        exam={currentExam}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNewExam={handleNewExam}
        onExportSuccess={handleExportSuccess}
      />

      {/* Stepper Workflow Navigation with Base d'épreuves Tab */}
      <div className="no-print">
        <WorkflowNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          hasExam={!!currentExam}
          hasAnalysis={!!analysisResult}
          hasQualityCheck={!!currentExam?.qualityCheck}
          savedExamsCount={savedExams.length}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Success Toast */}
        {successToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded-lg text-rose-600 hover:bg-rose-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Loading Overlay / Progress Indicator */}
        {isLoading && (
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-md flex items-center gap-4">
            <div className="w-6 h-6 border-3 border-teal-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
            <div>
              <div className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                Conception Pédagogique IA en cours (Gemini)
              </div>
              <div className="text-sm font-medium text-white">{loadingMessage}</div>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'library' && (
          <ExamLibraryTab
            savedExams={savedExams}
            onLoadExam={handleLoadExamFromLibrary}
            onDeleteExam={handleDeleteExamFromLibrary}
            onNewExam={handleNewExam}
            currentExamId={currentExam?.id}
          />
        )}

        {activeTab === 'references' && (
          <ReferenceDocsTab
            documents={documents}
            onAddDocument={handleAddDocument}
            onRemoveDocument={handleRemoveDocument}
            onLoadPreset={handleLoadPreset}
            onProceedToParams={() => setActiveTab('parameters')}
          />
        )}

        {activeTab === 'parameters' && (
          <ParametersTab
            parameters={parameters}
            onChangeParameters={setParameters}
            onResetParameters={handleResetParameters}
            onClearDocuments={handleClearDocuments}
            onAnalyze={handleAnalyze}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            docCount={documents.length}
          />
        )}

        {activeTab === 'analysis' && (
          <AnalysisTab
            analysis={analysisResult}
            parameters={parameters}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            onAnalyzeAgain={handleAnalyze}
          />
        )}

        {activeTab === 'student' && (
          currentExam ? (
            <StudentViewTab
              exam={currentExam}
              onUpdateExam={handleUpdateCurrentExam}
              onGenerateVariant={() => handleGenerateVariant()}
              onExportSuccess={handleExportSuccess}
              isGeneratingVariant={isLoading}
            />
          ) : (
            <EmptyWorkspacePrompt onNewExam={handleNewExam} onOpenLibrary={() => setActiveTab('library')} />
          )
        )}

        {activeTab === 'teacher' && (
          currentExam ? (
            <TeacherViewTab
              exam={currentExam}
              onUpdateExam={handleUpdateCurrentExam}
              onExportSuccess={handleExportSuccess}
            />
          ) : (
            <EmptyWorkspacePrompt onNewExam={handleNewExam} onOpenLibrary={() => setActiveTab('library')} />
          )
        )}

        {activeTab === 'quality' && (
          currentExam ? (
            <QualityControlTab
              exam={currentExam}
              onRunAudit={handleRunQualityAudit}
              isLoading={isLoading}
            />
          ) : (
            <EmptyWorkspacePrompt onNewExam={handleNewExam} onOpenLibrary={() => setActiveTab('library')} />
          )
        )}

        {activeTab === 'commands' && (
          currentExam ? (
            <VariantsAndCommandsTab
              currentExam={currentExam}
              examVersions={examVersions}
              onSelectVersion={setCurrentExam}
              onExecuteCommand={handleExecuteCommand}
              onGenerateVariant={handleGenerateVariant}
              isLoading={isLoading}
            />
          ) : (
            <EmptyWorkspacePrompt onNewExam={handleNewExam} onOpenLibrary={() => setActiveTab('library')} />
          )
        )}
      </main>

      {/* Footer (hidden in print) */}
      <footer className="no-print border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">TAAK'S EXAM BUILDER</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">AI TAAK'S INCUBATOR</span>
          </div>
          <div>
            L'enseignant conserve la validation pédagogique finale et le contrôle absolu de ses évaluations.
          </div>
        </div>
      </footer>
    </div>
  );
}

interface EmptyWorkspacePromptProps {
  onNewExam: () => void;
  onOpenLibrary: () => void;
}

const EmptyWorkspacePrompt: React.FC<EmptyWorkspacePromptProps> = ({ onNewExam, onOpenLibrary }) => {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs max-w-2xl mx-auto space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-2xs">
        <FolderArchive className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Aucune épreuve active dans l'espace de travail
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          L'épreuve précédente a été réinitialisée et archivée dans votre base d'épreuves. Vous pouvez concevoir un nouveau sujet ou consulter vos épreuves archivées.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onNewExam}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Concevoir une nouvelle épreuve</span>
        </button>
        <button
          onClick={onOpenLibrary}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-200"
        >
          <FolderArchive className="w-4 h-4 text-slate-600" />
          <span>Ouvrir la Base d'épreuves</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

