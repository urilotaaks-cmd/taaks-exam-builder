import React from 'react';
import { BookOpen, Sliders, Search, FileText, CheckCircle, ShieldCheck, Zap, Sparkles, FolderArchive } from 'lucide-react';

interface WorkflowNavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  hasExam: boolean;
  hasAnalysis: boolean;
  hasQualityCheck: boolean;
  savedExamsCount?: number;
}

export const WorkflowNavigation: React.FC<WorkflowNavigationProps> = ({
  activeTab,
  onSelectTab,
  hasExam,
  hasAnalysis,
  hasQualityCheck,
  savedExamsCount = 0,
}) => {
  const steps = [
    {
      id: 'library',
      label: "Base d'épreuves",
      sublabel: `${savedExamsCount} épreuve${savedExamsCount > 1 ? 's' : ''} classée${savedExamsCount > 1 ? 's' : ''}`,
      icon: FolderArchive,
      ready: true,
      highlight: true,
    },
    {
      id: 'references',
      label: '1. Références',
      sublabel: 'Programmes & Cours',
      icon: BookOpen,
      ready: true,
    },
    {
      id: 'parameters',
      label: '2. Paramètres',
      sublabel: 'Matière, Durée, Points',
      icon: Sliders,
      ready: true,
    },
    {
      id: 'analysis',
      label: '3. Diagnostic',
      sublabel: 'Analyse pédagogique',
      icon: Search,
      ready: hasAnalysis || hasExam,
    },
    {
      id: 'student',
      label: '4. Sujet Élève',
      sublabel: 'Énoncés & Barème',
      icon: FileText,
      ready: hasExam,
    },
    {
      id: 'teacher',
      label: '5. Corrigé',
      sublabel: 'Méthodes & Barème partiel',
      icon: CheckCircle,
      ready: hasExam,
    },
    {
      id: 'quality',
      label: '6. Contrôle Qualité',
      sublabel: 'Audit 5 dimensions',
      icon: ShieldCheck,
      ready: hasExam,
    },
    {
      id: 'commands',
      label: '7. Variantes & Actions',
      sublabel: 'Sujet B, /simplifier...',
      icon: Zap,
      ready: hasExam,
    },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto py-2.5 scrollbar-none gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeTab === step.id;

            return (
              <button
                key={step.id}
                id={`tab-btn-${step.id}`}
                onClick={() => onSelectTab(step.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-teal-50 border-teal-200 text-teal-900 shadow-xs'
                    : step.highlight && savedExamsCount > 0
                    ? 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200/70 text-emerald-900'
                    : 'bg-white hover:bg-slate-50 border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold relative ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : step.highlight && savedExamsCount > 0
                      ? 'bg-emerald-600 text-white'
                      : step.ready
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {step.highlight && savedExamsCount > 0 && !isActive && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="text-left">
                  <div className={`text-xs font-semibold leading-tight ${isActive ? 'text-teal-950' : 'text-slate-700'}`}>
                    {step.label}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">{step.sublabel}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
