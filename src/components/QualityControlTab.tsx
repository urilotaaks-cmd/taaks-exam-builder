import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Sparkles, Check, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { ExamEvaluation, QualityCheckResult } from '../types';

interface QualityControlTabProps {
  exam: ExamEvaluation;
  onRunAudit: () => void;
  isLoading: boolean;
}

export const QualityControlTab: React.FC<QualityControlTabProps> = ({ exam, onRunAudit, isLoading }) => {
  const qc = exam.qualityCheck;

  const categoriesMeta: Record<string, { label: string; desc: string }> = {
    pedagogique: { label: 'Pédagogique', desc: 'Niveau, notions étudiées & progression' },
    technique: { label: 'Technique', desc: 'Calculs exacts, données cohérentes & rigueur' },
    bareme: { label: 'Barème & Notation', desc: 'Arithmétique stricte & pondération' },
    documentaire: { label: 'Conformité Références', desc: 'Zéro notion inventée hors-programme' },
    presentation: { label: 'Présentation & Structure', desc: 'Numérotation, en-tête & séparation élève/corrigé' },
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
                Étape 6 sur 7
              </span>
              <span className="text-xs text-slate-500">Audit Qualité 5 Dimensions (Règle 14)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Contrôle Qualité Avant Livraison</h2>
            <p className="text-xs text-slate-600">
              Vérification automatique de la rigueur pédagogique, technique, documentaire et du barème.
            </p>
          </div>

          <button
            id="btn-trigger-quality-audit"
            onClick={onRunAudit}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Audit en cours...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{qc ? 'Réexécuter l\'Audit' : 'Lancer le Contrôle Qualité'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!qc ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Audit Qualité non encore réalisé</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Cliquez sur le bouton ci-dessus pour lancer la vérification complète en 5 dimensions (pédagogique, calculs techniques, exactitude du barème, conformité documentaire et mise en page).
          </p>
          <button
            onClick={onRunAudit}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs"
          >
            Lancer l'audit qualité
          </button>
        </div>
      ) : (
        <>
          {/* Overall Quality Index & 5 Dimension Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Overall Score Box */}
            <div className="lg:col-span-2 bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-teal-300 mb-1">
                  Indice de Qualité Global
                </div>
                <div className="text-4xl font-black tracking-tight text-white flex items-baseline gap-1">
                  <span>{qc.overallScore}</span>
                  <span className="text-lg font-normal text-teal-300">/ 100</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {qc.overallScore >= 90
                    ? 'Excellence pédagogique : l\'évaluation respecte rigoureusement l\'ensemble des critères TAAK\'S EXAM BUILDER.'
                    : qc.overallScore >= 75
                    ? 'Bonne conformité : quelques ajustements mineurs recommandés.'
                    : 'Ajustements nécessaires sur le barème ou les formulations.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/60 mt-4 text-[11px] text-teal-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Audité avec Gemini 3.7 Flash</span>
              </div>
            </div>

            {/* 5 Dimension Cards */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Pédagogique', score: qc.pedagogicalScore, desc: 'Adéquation niveau & notions' },
                { title: 'Technique', score: qc.technicalScore, desc: 'Calculs & rigueur scientifique' },
                { title: 'Barème & Total', score: qc.rubricScore, desc: 'Arithmétique exacte & équilibre' },
                { title: 'Conformité Documents', score: qc.documentaryScore, desc: 'Respect strict des sources' },
                { title: 'Présentation & Clarté', score: qc.presentationScore, desc: 'Structure & séparation élève/corrigé' },
              ].map((dim, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 border border-slate-200 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{dim.title}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        dim.score >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : dim.score >= 70
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {dim.score} / 100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        dim.score >= 90 ? 'bg-emerald-500' : dim.score >= 70 ? 'bg-teal-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] text-slate-500">{dim.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Verification Checklist */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Grille de Contrôle Qualité Détaillée</span>
            </h3>

            <div className="space-y-2">
              {qc.checklist?.map((item, idx) => {
                const isPass = item.status === 'pass';
                const isWarning = item.status === 'warning';
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                      isPass
                        ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-950'
                        : isWarning
                        ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                        : 'bg-rose-50/50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isPass ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold">{item.item}</div>
                        {item.comment && (
                          <div className="text-[11px] text-slate-600 mt-0.5 italic">{item.comment}</div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700 shrink-0">
                      {categoriesMeta[item.category]?.label || item.category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Points Forts Pédagogiques</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {qc.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 bg-emerald-50/40 p-2 rounded-lg">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Pistes d'Optimisation Enseignant</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {qc.recommendations?.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 bg-teal-50/40 p-2 rounded-lg">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
