import React, { useState, useRef } from 'react';
import { AcademicHeaderInfo, HeaderStyle } from '../types';
import {
  MINESEC_REGION_PRESETS,
  EXAM_HEADER_SESSION_PRESETS,
  EXAM_HEADER_INSTRUCTION_PRESETS,
} from '../data/presets';
import { SCHOOL_LOGO_PRESETS, processUploadedLogoFile } from '../utils/logoPresets';
import { ExamAcademicHeader } from './ExamAcademicHeader';
import {
  X,
  Check,
  Building2,
  Calendar,
  GraduationCap,
  FileText,
  User,
  Sliders,
  Sparkles,
  MapPin,
  Clock,
  Hash,
  Layers,
  Plus,
  Trash2,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface ExamHeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: AcademicHeaderInfo;
  targetTotalPoints: number;
  onSave: (updatedHeader: AcademicHeaderInfo) => void;
}

export const ExamHeaderModal: React.FC<ExamHeaderModalProps> = ({
  isOpen,
  onClose,
  header,
  targetTotalPoints,
  onSave,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<AcademicHeaderInfo>({
    ...header,
    headerStyle: header.headerStyle || 'officiel_minesec',
    schoolName: header.schoolName || 'Lycée Général de Yaoundé',
    academicYear: header.academicYear || '2025 - 2026',
    examTitle: header.examTitle || 'ÉVALUATION SOMMATIVE',
    gradeAndSubject: header.gradeAndSubject || 'Classe & Matière',
    duration: header.duration || '2 heures',
    coefficient: header.coefficient || 'Coeff. 2',
    date: header.date || "Date de l'épreuve",
    teacherName: header.teacherName || 'M. le Professeur',
    countryHeaderFr: header.countryHeaderFr || 'RÉPUBLIQUE DU CAMEROUN\nPaix - Travail - Patrie',
    countryHeaderEn: header.countryHeaderEn || 'REPUBLIC OF CAMEROON\nPeace - Work - Fatherland',
    ministryHeaderFr: header.ministryHeaderFr || 'MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES',
    ministryHeaderEn: header.ministryHeaderEn || 'MINISTRY OF SECONDARY EDUCATION',
    regionalDelegation: header.regionalDelegation || 'Délégation Régionale du Centre',
    departmentalDelegation: header.departmentalDelegation || 'Délégation Départementale du Mfoundi',
    departmentOrSubject: header.departmentOrSubject || 'Département Scientifique',
    showStudentCartouche: header.showStudentCartouche ?? true,
    showTableNumber: header.showTableNumber ?? true,
    showCompetencyAppreciation: header.showCompetencyAppreciation ?? true,
    showParentSignature: header.showParentSignature ?? true,
    
    // Logo de l'établissement
    schoolLogo: header.schoolLogo,
    schoolLogoPosition: header.schoolLogoPosition || 'center',
    schoolLogoSize: header.schoolLogoSize || 'medium',
    showSchoolLogo: header.showSchoolLogo ?? true,

    instructions: header.instructions && header.instructions.length > 0 ? [...header.instructions] : [
      "Calculatrice scientifique non programmable autorisée.",
      "La clarté, la rigueur et le soin apportés à la copie seront pris en compte."
    ],
  });

  const [newInstructionText, setNewInstructionText] = useState('');
  const [activeTab, setActiveTab] = useState<'style' | 'logo' | 'admin' | 'exam' | 'cartouche' | 'instructions'>('style');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const [isDragOverLogo, setIsDragOverLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof AcademicHeaderInfo, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoFileUpload = async (file: File) => {
    try {
      setIsUploadingLogo(true);
      setLogoUploadError(null);
      const dataUrl = await processUploadedLogoFile(file);
      setForm((prev) => ({
        ...prev,
        schoolLogo: dataUrl,
        showSchoolLogo: true,
      }));
    } catch (err: any) {
      console.error(err);
      setLogoUploadError(err.message || "Erreur lors du traitement de l'image du logo");
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSelectLogoPreset = (presetDataUrl: string) => {
    setLogoUploadError(null);
    setForm((prev) => ({
      ...prev,
      schoolLogo: presetDataUrl,
      showSchoolLogo: true,
    }));
  };

  const handleRemoveLogo = () => {
    setForm((prev) => ({
      ...prev,
      schoolLogo: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyRegionPreset = (preset: typeof MINESEC_REGION_PRESETS[0]) => {
    setForm((prev) => ({
      ...prev,
      regionalDelegation: preset.region,
      departmentalDelegation: preset.department,
      schoolName: preset.school,
    }));
  };

  const handleApplySessionPreset = (session: string) => {
    setForm((prev) => ({
      ...prev,
      examTitle: session,
      date: session.includes('Trimestre') ? session : prev.date,
    }));
  };

  const handleAddInstruction = (textToAdd?: string) => {
    const text = textToAdd || newInstructionText.trim();
    if (!text) return;
    if (!form.instructions.includes(text)) {
      setForm((prev) => ({
        ...prev,
        instructions: [...prev.instructions, text],
      }));
    }
    if (!textToAdd) setNewInstructionText('');
  };

  const handleRemoveInstruction = (index: number) => {
    setForm((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const styleOptions: { style: HeaderStyle; label: string; desc: string; icon: string }[] = [
    {
      style: 'officiel_minesec',
      label: 'Officiel MINESEC Bilingue',
      desc: 'Format national officiel avec République, Délégation régionale & départementale, session et cartouche APC.',
      icon: '🏛️',
    },
    {
      style: 'academique_standard',
      label: 'Académique Standard',
      desc: 'Format traditionnel lycée/collège avec tableau établissement à gauche et identification élève à droite.',
      icon: '🎓',
    },
    {
      style: 'cartouche_complet',
      label: 'Cartouche Complet & APC',
      desc: 'Intègre une grille d\'appréciation des compétences APC (NA, ECA, A, E) et le visa du parent.',
      icon: '📋',
    },
    {
      style: 'epure',
      label: 'Épuré & Minimaliste',
      desc: 'Format compact et allégé, idéal pour interrogations courtes, devoirs rapides ou fiches de TD.',
      icon: '📄',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-2xs font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Personnaliser l'en-tête de l'épreuve
              </h2>
              <p className="text-xs text-slate-500">
                Modifiez les textes officiels, le style, les délégations, la session et le cartouche élève
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('style')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'style'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🎨 Style d'en-tête</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logo')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'logo'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏫 Logo Établissement {form.schoolLogo ? '✓' : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'admin'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏛️ Établissement & Ministère</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exam')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'exam'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📝 Session & Métadonnées</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cartouche')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'cartouche'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>👤 Cartouche Élève & APC</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'instructions'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>⚖️ Consignes ({form.instructions.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: STYLE SELECTION */}
          {activeTab === 'style' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sélectionnez le style de présentation de l'en-tête</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  L'en-tête sera formaté selon le modèle choisi sur l'écran et lors des exports Word (.docx) et PDF.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {styleOptions.map((opt) => {
                  const isSelected = form.headerStyle === opt.style;
                  return (
                    <button
                      key={opt.style}
                      type="button"
                      onClick={() => updateField('headerStyle', opt.style)}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{opt.icon}</span>
                          <span className={`text-xs font-bold ${isSelected ? 'text-teal-950' : 'text-slate-900'}`}>
                            {opt.label}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Raccourcis Régionaux */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>Remplissage automatique par région camerounaise :</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MINESEC_REGION_PRESETS.map((rp) => (
                    <button
                      key={rp.name}
                      type="button"
                      onClick={() => handleApplyRegionPreset(rp)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all hover:border-teal-300"
                    >
                      📍 {rp.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: LOGO DE L'ÉTABLISSEMENT */}
          {activeTab === 'logo' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span>Personnalisation du logo de l'établissement</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ajoutez le blason ou sceau officiel pour authentifier les sujets d'examen (recommandé au Cameroun).
                  </p>
                </div>

                {/* Switch afficher le logo */}
                <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.showSchoolLogo ?? true}
                    onChange={(e) => updateField('showSchoolLogo', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span>Afficher le logo</span>
                </label>
              </div>

              {/* Aperçu actuel & gestion du logo */}
              {form.schoolLogo ? (
                <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-xl border-2 border-teal-500/30 p-2 flex items-center justify-center shadow-xs shrink-0">
                      <img
                        src={form.schoolLogo}
                        alt="Logo actif"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-900">Logo actif configuré</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-teal-600" />
                          Prêt pour impression & export
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-700">
                        Ce logo apparaîtra sur l'en-tête à l'écran, dans le sujet PDF et dans le fichier Word .docx.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white border border-teal-300 hover:bg-teal-50 text-teal-800 text-xs font-semibold shadow-2xs flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-teal-600" />
                      <span>Remplacer</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <span>
                    Aucun logo n'est actuellement sélectionné. Vous pouvez importer le fichier image de votre établissement ci-dessous ou choisir l'un des emblèmes officiels prêts à l'emploi.
                  </span>
                </div>
              )}

              {/* Zone d'import de fichier image */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Importer votre propre fichier de logo (ordinateur ou mobile)
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOverLogo(true);
                  }}
                  onDragLeave={() => setIsDragOverLogo(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOverLogo(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleLogoFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragOverLogo
                      ? 'border-teal-500 bg-teal-50/80 scale-[1.01]'
                      : 'border-slate-300 hover:border-teal-400 bg-slate-50/50 hover:bg-teal-50/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleLogoFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="w-12 h-12 rounded-2xl bg-teal-100/70 text-teal-700 flex items-center justify-center shadow-xs">
                    {isUploadingLogo ? (
                      <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {isUploadingLogo
                        ? "Optimisation et traitement de l'image en cours..."
                        : "Glissez-déposez le logo de votre établissement ici ou cliquez pour parcourir"}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Formats recommandés : PNG (fond transparent), JPG, SVG ou WebP (redimensionnement automatique).
                    </p>
                  </div>
                </div>

                {logoUploadError && (
                  <div className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    {logoUploadError}
                  </div>
                )}
              </div>

              {/* Emblèmes et armoiries officiels prêts à l'emploi */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ou choisissez un emblème académique prêt à l'emploi (1 clic) :</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SCHOOL_LOGO_PRESETS.map((preset) => {
                    const isCurrent = form.schoolLogo === preset.dataUrl;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectLogoPreset(preset.dataUrl)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center text-center gap-2 ${
                          isCurrent
                            ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-16 h-16 p-1 bg-slate-50 rounded-lg flex items-center justify-center">
                          <img
                            src={preset.dataUrl}
                            alt={preset.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <div className={`text-xs font-bold ${isCurrent ? 'text-teal-900' : 'text-slate-900'}`}>
                            {preset.name}
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                            {preset.description}
                          </p>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full mt-auto">
                            Sélectionné
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Réglages de position et de taille */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                {/* Position du logo */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Positionnement sur l'en-tête
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'left', label: 'Gauche' },
                      { id: 'center', label: 'Centre' },
                      { id: 'right', label: 'Droite' },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => updateField('schoolLogoPosition', pos.id)}
                        className={`py-2 px-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                          (form.schoolLogoPosition || 'center') === pos.id
                            ? 'border-teal-600 bg-teal-600 text-white shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Au Cameroun, la position centrale entre les blocs bilingues français/anglais est la norme officielle.
                  </p>
                </div>

                {/* Taille du logo */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    Taille d'affichage
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'small', label: 'Compact', desc: '40 px' },
                      { id: 'medium', label: 'Standard', desc: '56 px' },
                      { id: 'large', label: 'Grand', desc: '72 px' },
                    ].map((sz) => (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => updateField('schoolLogoSize', sz.id)}
                        className={`py-1.5 px-2 rounded-xl border text-center transition-all ${
                          (form.schoolLogoSize || 'medium') === sz.id
                            ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20 font-bold'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold">{sz.label}</div>
                        <div className="text-[9px] text-slate-400">{sz.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMINISTRATIVE (MINISTRY & SCHOOL) */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* School Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nom officiel de l'Établissement scolaire
                  </label>
                  <input
                    type="text"
                    value={form.schoolName || ''}
                    onChange={(e) => updateField('schoolName', e.target.value)}
                    placeholder="ex: Lycée Général de Yaoundé / Lycée Joss de Douala"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Regional Delegation */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Délégation Régionale (MINESEC)
                  </label>
                  <input
                    type="text"
                    value={form.regionalDelegation || ''}
                    onChange={(e) => updateField('regionalDelegation', e.target.value)}
                    placeholder="ex: Délégation Régionale du Centre"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Departmental Delegation */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Délégation Départementale
                  </label>
                  <input
                    type="text"
                    value={form.departmentalDelegation || ''}
                    onChange={(e) => updateField('departmentalDelegation', e.target.value)}
                    placeholder="ex: Délégation Départementale du Mfoundi"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Department or Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Département Pédagogique ou Discipline
                  </label>
                  <input
                    type="text"
                    value={form.departmentOrSubject || ''}
                    onChange={(e) => updateField('departmentOrSubject', e.target.value)}
                    placeholder="ex: Département de Mathématiques / Département d'Informatique"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Examiner name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nom de l'enseignant ou examinateur
                  </label>
                  <input
                    type="text"
                    value={form.teacherName || ''}
                    onChange={(e) => updateField('teacherName', e.target.value)}
                    placeholder="ex: M. le Professeur"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              {/* Advanced country headers toggle */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-700">En-tête national & Devise (Bilingue) :</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Version Française</span>
                    <input
                      type="text"
                      value={form.countryHeaderFr?.replace('\n', ' - ') || ''}
                      onChange={(e) => updateField('countryHeaderFr', e.target.value.replace(' - ', '\n'))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Version Anglaise</span>
                    <input
                      type="text"
                      value={form.countryHeaderEn?.replace('\n', ' - ') || ''}
                      onChange={(e) => updateField('countryHeaderEn', e.target.value.replace(' - ', '\n'))}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXAM SESSION & METADATA */}
          {activeTab === 'exam' && (
            <div className="space-y-4">
              {/* Exam Title */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Titre de l'épreuve / Session officielle
                </label>
                <input
                  type="text"
                  value={form.examTitle || ''}
                  onChange={(e) => updateField('examTitle', e.target.value)}
                  placeholder="ex: ÉVALUATION SOMMATIVE N° 3"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                />

                {/* Session presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase self-center mr-1">Raccourcis :</span>
                  {EXAM_HEADER_SESSION_PRESETS.slice(0, 6).map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => handleApplySessionPreset(sp)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 font-semibold"
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Grade and Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Classe & Matière
                  </label>
                  <input
                    type="text"
                    value={form.gradeAndSubject || ''}
                    onChange={(e) => updateField('gradeAndSubject', e.target.value)}
                    placeholder="ex: 3ème — Mathématiques"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Année scolaire
                  </label>
                  <input
                    type="text"
                    value={form.academicYear || ''}
                    onChange={(e) => updateField('academicYear', e.target.value)}
                    placeholder="ex: 2025 - 2026"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Date de l'évaluation
                  </label>
                  <input
                    type="text"
                    value={form.date || ''}
                    onChange={(e) => updateField('date', e.target.value)}
                    placeholder="ex: Novembre 2025"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Durée
                  </label>
                  <input
                    type="text"
                    value={form.duration || ''}
                    onChange={(e) => updateField('duration', e.target.value)}
                    placeholder="ex: 2 heures"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Coefficient */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Coefficient
                  </label>
                  <input
                    type="text"
                    value={form.coefficient || ''}
                    onChange={(e) => updateField('coefficient', e.target.value)}
                    placeholder="ex: Coeff. 3"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CARTOUCHE ÉLÈVE & APC */}
          {activeTab === 'cartouche' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cartouche d'identification & Évaluation des Compétences</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choisissez les éléments à afficher dans l'encadré destiné à l'élève et au correcteur.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showStudentCartouche ?? true}
                    onChange={(e) => updateField('showStudentCartouche', e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Afficher le cartouche d'identification élève</div>
                    <div className="text-[11px] text-slate-500">Comprend les champs Nom, Prénom et la case de notation /20.</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showTableNumber ?? true}
                    onChange={(e) => updateField('showTableNumber', e.target.checked)}
                    disabled={!form.showStudentCartouche}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Inclure le N° de Table / Matricule de l'élève</div>
                    <div className="text-[11px] text-slate-500">Indispensable lors des devoirs surveillés et examens blancs.</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showCompetencyAppreciation ?? true}
                    onChange={(e) => updateField('showCompetencyAppreciation', e.target.checked)}
                    disabled={!form.showStudentCartouche}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Grille officielle d'appréciation APC (Non Acquis, En cours, Acquis, Expert)</div>
                    <div className="text-[11px] text-slate-500">Conforme aux exigences du bulletin MINESEC et de l'approche par compétences.</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showParentSignature ?? true}
                    onChange={(e) => updateField('showParentSignature', e.target.checked)}
                    disabled={!form.showStudentCartouche}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 disabled:opacity-50"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Ligne de visa du professeur et signature du parent / tuteur</div>
                    <div className="text-[11px] text-slate-500">Permet le retour signé des copies par les familles.</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: CONSIGNES */}
          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Consignes officielles de l'épreuve</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ces instructions figureront dans l'encadré en haut de l'épreuve distribuée aux élèves.
                </p>
              </div>

              {/* Add instruction */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInstructionText}
                  onChange={(e) => setNewInstructionText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInstruction();
                    }
                  }}
                  placeholder="Ajouter une consigne personnalisée..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddInstruction()}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Consignes types fréquentes :</span>
                <div className="flex flex-wrap gap-1.5">
                  {EXAM_HEADER_INSTRUCTION_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddInstruction(p)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 font-medium text-left"
                    >
                      + {p.substring(0, 48)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions list */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                {form.instructions.map((ins, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  >
                    <span className="text-slate-800 italic">• {ins}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Supprimer cette consigne"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIVE PREVIEW BOX */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Aperçu en direct sur la copie de l'élève :</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Style : {form.headerStyle}
              </span>
            </div>

            <div className="bg-slate-50/50 p-2 sm:p-4 rounded-xl border border-dashed border-slate-300 pointer-events-none scale-95 origin-top">
              <ExamAcademicHeader
                header={form}
                targetTotalPoints={targetTotalPoints}
                readOnly={true}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Appliquer et enregistrer l'en-tête</span>
          </button>
        </div>
      </div>
    </div>
  );
};
