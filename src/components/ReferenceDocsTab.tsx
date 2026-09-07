import React, { useState } from 'react';
import { Plus, Trash2, BookOpen, FileCheck, FileCode, Award, ShieldAlert, Sparkles, Upload, FileText, Check } from 'lucide-react';
import { ReferenceDocument } from '../types';
import { SAMPLE_REFERENCE_DOCUMENTS } from '../data/presets';

interface ReferenceDocsTabProps {
  documents: ReferenceDocument[];
  onAddDocument: (doc: ReferenceDocument) => void;
  onRemoveDocument: (id: string) => void;
  onLoadPreset: (preset: ReferenceDocument) => void;
  onProceedToParams: () => void;
}

export const ReferenceDocsTab: React.FC<ReferenceDocsTabProps> = ({
  documents,
  onAddDocument,
  onRemoveDocument,
  onLoadPreset,
  onProceedToParams,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ReferenceDocument['type']>('cours');
  const [newContent, setNewContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const doc: ReferenceDocument = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      content: newContent.trim(),
      dateAdded: new Date().toISOString().split('T')[0],
    };

    onAddDocument(doc);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setNewTitle(file.name.replace(/\.[^/.]+$/, ""));
      setNewContent(content);
      setIsAdding(true);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner: Règle Fondamentale & Priorité des Sources */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold uppercase tracking-wider">
                Étape 1 sur 7
              </span>
              <span className="text-xs text-slate-300">Documents de Référence & Pédagogie</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Fournissez vos référentiels, cours ou anciens sujets
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              TAAK'S EXAM BUILDER s'appuie rigoureusement sur vos documents pour calibrer le vocabulaire, le niveau d'exigence et éviter toute question portant sur des notions non étudiées.
            </p>
          </div>
          <button
            id="btn-proceed-params-top"
            onClick={onProceedToParams}
            className="self-start md:self-center px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs shadow-md transition-colors whitespace-nowrap"
          >
            Configurer l'évaluation →
          </button>
        </div>

        {/* Priority of sources bar */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700">
            <div className="font-bold text-teal-300">1. Consignes</div>
            <div className="text-[11px] text-slate-400">Enseignant explicite</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700">
            <div className="font-bold text-teal-300">2. Programme</div>
            <div className="text-[11px] text-slate-400">Référentiel officiel</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700">
            <div className="font-bold text-teal-300">3. Cours</div>
            <div className="text-[11px] text-slate-400">Notions dispensées</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700">
            <div className="font-bold text-teal-300">4. Compléments</div>
            <div className="text-[11px] text-slate-400">Fiches & exercices</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700">
            <div className="font-bold text-teal-300">5. Anciens Sujets</div>
            <div className="text-[11px] text-slate-400">Modèles de structure</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700">
            <div className="font-bold text-teal-300">6. Connaissances</div>
            <div className="text-[11px] text-slate-400">Générales & Socle</div>
          </div>
        </div>
      </div>

      {/* Preset Library Buttons for Fast Testing */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-600" />
            <span>Exemples de programmes & cours pré-chargés</span>
          </h3>
          <span className="text-xs text-slate-500">Cliquez pour importer instantanément</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_REFERENCE_DOCUMENTS.map((preset) => {
            const isAlreadyLoaded = documents.some((d) => d.title === preset.title);
            return (
              <div
                key={preset.id}
                className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isAlreadyLoaded
                    ? 'bg-teal-50/60 border-teal-200'
                    : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {preset.type === 'pedagogique' ? 'Programme' : preset.type === 'cours' ? 'Cours' : 'Ancien Sujet'}
                    </span>
                    {isAlreadyLoaded && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-teal-700">
                        <Check className="w-3 h-3" /> Actif
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2">{preset.title}</h4>
                </div>
                <button
                  onClick={() => onLoadPreset(preset)}
                  disabled={isAlreadyLoaded}
                  className={`mt-3 w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                    isAlreadyLoaded
                      ? 'bg-teal-100 text-teal-800 cursor-default'
                      : 'bg-white hover:bg-teal-600 hover:text-white text-slate-700 border border-slate-200 shadow-2xs'
                  }`}
                >
                  {isAlreadyLoaded ? 'Document chargé' : '+ Utiliser cette référence'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Documents List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-teal-600" />
              <span>Documents actifs dans l'espace de travail ({documents.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ces documents serviront de base inaltérable pour l'analyse et la création du sujet.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Importer fichier texte</span>
              <input type="file" accept=".txt,.md,.json" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              id="btn-add-doc-modal"
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Fermer le formulaire' : 'Ajouter un document'}</span>
            </button>
          </div>
        </div>

        {/* Add document form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Nouveau document de référence</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Titre du document</label>
                <input
                  type="text"
                  placeholder="ex: Chapitre 3 - Algèbre linéaire & Matrices"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Type de document</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="pedagogique">Programme officiel / Référentiel</option>
                  <option value="cours">Fiche de cours / Chapitre</option>
                  <option value="ancien_sujet">Ancien sujet / Examen blanc</option>
                  <option value="modele_presentation">Modèle Word / En-tête</option>
                  <option value="autre">Autre ressource</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Contenu textuel (notions, formules, barèmes, compétences, consignes...)
              </label>
              <textarea
                rows={5}
                placeholder="Collez ici le cours, le programme officiel ou le texte de l'ancien sujet..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-teal-500 outline-none leading-relaxed"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-2xs"
              >
                Enregistrer la référence
              </button>
            </div>
          </form>
        )}

        {/* List of current documents */}
        {documents.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-300 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-700">Aucun document de référence chargé</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Vous pouvez charger l'un des exemples ci-dessus ou coller vos propres documents de cours. Même sans document, le générateur utilisera les programmes académiques standards.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                      {doc.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 font-mono bg-white/70 p-2 rounded border border-slate-100 mt-1">
                    {doc.content}
                  </p>
                  <div className="text-[10px] text-slate-400">
                    Ajouté le {doc.dateAdded} • {doc.content.length} caractères • ~{Math.round(doc.content.split(/\s+/).length)} mots
                  </div>
                </div>
                <button
                  onClick={() => onRemoveDocument(doc.id)}
                  className="self-end sm:self-start p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Supprimer ce document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldAlert className="w-4 h-4 text-teal-600" />
          <span>Règle n°4 : Interdiction absolue d'inventer des notions non étudiées.</span>
        </div>
        <button
          id="btn-proceed-params-bottom"
          onClick={onProceedToParams}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5"
        >
          <span>Étape 2 : Paramétrer l'évaluation</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
