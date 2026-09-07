import React from 'react';
import { Search, CheckCircle, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, BookOpen, Layers, Check } from 'lucide-react';
import { ExamParameters } from '../types';

interface AnalysisTabProps {
  analysis: any | null;
  parameters: ExamParameters;
  onGenerate: () => void;
  isLoading: boolean;
  onAnalyzeAgain: () => void;
}

export const AnalysisTab: React.FC<AnalysisTabProps> = ({
  analysis,
  parameters,
  onGenerate,
  isLoading,
  onAnalyzeAgain,
}) => {
  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Aucun diagnostic préalable généré</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Le diagnostic analyse vos documents de référence pour extraire les compétences exigibles, isoler les notions hors-programme et proposer une structure de barème optimale.
        </p>
        <button
          onClick={onAnalyzeAgain}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-all"
        >
          {isLoading ? 'Analyse en cours...' : 'Lancer l\'analyse pédagogique'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
                Étape 3 sur 7
              </span>
              <span className="text-xs text-slate-500">Diagnostic Pédagogique & Validation</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Analyse Pré-Génération</h2>
            <p className="text-xs text-slate-600">
              Vérification des notions exigibles, exclusions hors-programme et structure cible.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAnalyzeAgain}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Réanalyser
            </button>
            <button
              id="btn-generate-from-analysis"
              onClick={onGenerate}
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Conception en cours...</span>
                </>
              ) : (
                <>
                  <span>Générer Sujet & Corrigé</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Missing info warning if any */}
      {analysis.missingInfoQuestions && analysis.missingInfoQuestions.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Précisions recommandées pour une pertinence maximale :</span>
          </div>
          <ul className="list-disc list-inside text-xs text-amber-900 space-y-1 pl-1">
            {analysis.missingInfoQuestions.map((q: string, idx: number) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Concepts vs Excluded Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Included Concepts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Notions Retenues & Exigibles
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {analysis.keyConcepts?.length || 0} notions
            </span>
          </div>
          <ul className="space-y-1.5">
            {analysis.keyConcepts?.map((c: string, idx: number) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50/70 p-2 rounded-lg">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Excluded Concepts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                ✕
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Notions à Exclure (Hors Programme)
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              Anti-Hallucination
            </span>
          </div>
          <ul className="space-y-1.5">
            {analysis.excludedConcepts && analysis.excludedConcepts.length > 0 ? (
              analysis.excludedConcepts.map((c: string, idx: number) => (
                <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400 italic p-3 text-center">
                Aucune notion exclue explicitement identifiée.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Proposed Structure & Progression */}
      {analysis.proposedStructure && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>Architecture Pédagogique Recommandée</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium">Nombre d'exercices :</span>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {analysis.proposedStructure.exerciseCount} Exercices
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium">Distribution des points :</span>
              <div className="text-sm font-bold text-teal-700 mt-1">
                {analysis.proposedStructure.pointsDistribution}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-medium">Barème global :</span>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {parameters.totalPoints} points
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-teal-900">Progression : </span>
            {analysis.proposedStructure.progressionSummary}
          </div>
        </div>
      )}

      {/* Pedagogical Advice */}
      {analysis.pedagogicalAdvice && (
        <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-2xl p-5 border border-slate-200">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Conseils Pédagogiques & Recommandations de Style</span>
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            {analysis.pedagogicalAdvice}
          </p>
        </div>
      )}

      {/* Footer CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Conception en cours...</span>
            </>
          ) : (
            <>
              <span>Valider l'analyse et Générer l'Évaluation</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
