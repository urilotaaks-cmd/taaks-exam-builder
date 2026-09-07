import React, { useState } from 'react';
import { Zap, Sparkles, Copy, Layers, CheckCircle2, ArrowRight, CornerDownLeft, RefreshCw, BookOpen, Download } from 'lucide-react';
import { ExamEvaluation, QuickCommandType } from '../types';
import { QUICK_COMMANDS_META } from '../data/presets';
import { exportStudentExamDocx, exportTeacherCorrectionDocx } from '../utils/docxExport';

interface VariantsAndCommandsTabProps {
  currentExam: ExamEvaluation;
  examVersions: ExamEvaluation[];
  onSelectVersion: (version: ExamEvaluation) => void;
  onExecuteCommand: (command: QuickCommandType, extraPrompt?: string) => void;
  onGenerateVariant: (note?: string) => void;
  isLoading: boolean;
}

export const VariantsAndCommandsTab: React.FC<VariantsAndCommandsTabProps> = ({
  currentExam,
  examVersions,
  onSelectVersion,
  onExecuteCommand,
  onGenerateVariant,
  isLoading,
}) => {
  const [customCommand, setCustomCommand] = useState('');
  const [variantNote, setVariantNote] = useState('');
  const [selectedCmd, setSelectedCmd] = useState<QuickCommandType>('/variante');
  const [extraPrompt, setExtraPrompt] = useState('');

  const handleRunCommand = (cmd: QuickCommandType) => {
    if (cmd === '/variante') {
      onGenerateVariant(extraPrompt || variantNote);
    } else if (cmd === '/word') {
      exportStudentExamDocx(currentExam);
      exportTeacherCorrectionDocx(currentExam);
    } else {
      onExecuteCommand(cmd, extraPrompt);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommand.trim()) return;

    if (customCommand.startsWith('/')) {
      const parts = customCommand.split(' ');
      const cmd = parts[0] as QuickCommandType;
      const prompt = parts.slice(1).join(' ');
      handleRunCommand(cmd);
    } else {
      onExecuteCommand('/ameliorer', customCommand);
    }
    setCustomCommand('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
                Étape 7 sur 7
              </span>
              <span className="text-xs text-slate-500">Commandes Rapides & Gestion des Variantes</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Console Pédagogique & Variantes</h2>
            <p className="text-xs text-slate-600">
              Pilotez l'évolution de vos sujets par commandes courtes (/variante, /simplifier, /approfondir, /bareme...).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Versions actives :</span>
            <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold text-xs border border-teal-200">
              {examVersions.length} Sujet(s)
            </span>
          </div>
        </div>
      </div>

      {/* Version Selector (Sujet A vs Sujet B / Variante) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-600" />
          <span>Versions & Variantes Disponibles</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {examVersions.map((ver) => {
            const isSelected = ver.id === currentExam.id;
            return (
              <button
                key={ver.id}
                onClick={() => onSelectVersion(ver)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-500 shadow-2xs'
                    : 'bg-slate-50/60 hover:bg-slate-100/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                    Sujet {ver.version}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Actif
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{ver.title}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {ver.exercises.length} exercices • {ver.targetTotalPoints} pts • {ver.academicHeader.duration}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Commands Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-600" />
            <span>Commandes Rapides (Section 16)</span>
          </h3>
          <span className="text-xs text-slate-500">Cliquez pour appliquer immédiatement</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {QUICK_COMMANDS_META.map((item) => (
            <button
              key={item.cmd}
              onClick={() => handleRunCommand(item.cmd as QuickCommandType)}
              disabled={isLoading}
              className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-teal-700 group-hover:text-teal-900">
                  {item.cmd}
                </span>
                <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />
              </div>
              <div className="text-xs font-semibold text-slate-900">{item.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Command Terminal */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-mono text-slate-400 ml-2">taaks-exam-builder-cli v2.4</span>
          </div>
          <span className="text-[11px] font-mono text-teal-400">AI TAAK'S INCUBATOR</span>
        </div>

        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div className="text-xs text-slate-300">
            Saisissez une commande courte ou une consigne d'ajustement :
          </div>
          <div className="flex items-center gap-2 bg-slate-950 rounded-xl p-2 border border-slate-700">
            <span className="text-teal-400 font-mono text-sm pl-2">❯</span>
            <input
              type="text"
              placeholder="ex: /simplifier les questions de l'exercice 2 OU /adapter pour des élèves de 1ère..."
              value={customCommand}
              onChange={(e) => setCustomCommand(e.target.value)}
              className="w-full bg-transparent text-xs font-mono text-white placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !customCommand.trim()}
              className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shrink-0"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CornerDownLeft className="w-3.5 h-3.5" />}
              <span>Exécuter</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 font-mono">
            <span className="text-slate-500">Raccourcis :</span>
            <button type="button" onClick={() => setCustomCommand('/variante')} className="hover:text-teal-300 underline">
              /variante
            </button>
            <button type="button" onClick={() => setCustomCommand('/simplifier')} className="hover:text-teal-300 underline">
              /simplifier
            </button>
            <button type="button" onClick={() => setCustomCommand('/approfondir')} className="hover:text-teal-300 underline">
              /approfondir
            </button>
            <button type="button" onClick={() => setCustomCommand('/bareme')} className="hover:text-teal-300 underline">
              /bareme
            </button>
            <button type="button" onClick={() => setCustomCommand('/corrige')} className="hover:text-teal-300 underline">
              /corrige
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
