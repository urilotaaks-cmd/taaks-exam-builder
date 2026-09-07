import React from 'react';
import { AcademicHeaderInfo, HeaderStyle } from '../types';
import { Edit3, School, FileText, CheckSquare, ShieldCheck, Sparkles } from 'lucide-react';

interface ExamAcademicHeaderProps {
  header: AcademicHeaderInfo;
  targetTotalPoints: number;
  onEditHeader?: () => void;
  isTeacherVersion?: boolean;
  readOnly?: boolean;
}

export const ExamAcademicHeader: React.FC<ExamAcademicHeaderProps> = ({
  header,
  targetTotalPoints,
  onEditHeader,
  isTeacherVersion = false,
  readOnly = false,
}) => {
  const style: HeaderStyle = header.headerStyle || 'officiel_minesec';

  // Fallbacks
  const schoolName = header.schoolName || "Lycée Général de Yaoundé";
  const academicYear = header.academicYear || "2025 - 2026";
  const examTitle = header.examTitle || "ÉVALUATION SOMMATIVE";
  const gradeAndSubject = header.gradeAndSubject || "Classe & Matière";
  const duration = header.duration || "2 heures";
  const coefficient = header.coefficient || "Coeff. 2";
  const date = header.date || "Date de l'épreuve";
  const teacherName = header.teacherName || "M. le Professeur";
  const instructions = header.instructions || [];
  
  const countryHeaderFr = header.countryHeaderFr || "RÉPUBLIQUE DU CAMEROUN\nPaix - Travail - Patrie";
  const countryHeaderEn = header.countryHeaderEn || "REPUBLIC OF CAMEROON\nPeace - Work - Fatherland";
  const ministryHeaderFr = header.ministryHeaderFr || "MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES";
  const ministryHeaderEn = header.ministryHeaderEn || "MINISTRY OF SECONDARY EDUCATION";
  const regionalDelegation = header.regionalDelegation || "Délégation Régionale du Centre";
  const departmentalDelegation = header.departmentalDelegation || "Délégation Départementale du Mfoundi";
  const departmentOrSubject = header.departmentOrSubject || "Département Scientifique";

  const showStudentCartouche = header.showStudentCartouche ?? true;
  const showTableNumber = header.showTableNumber ?? true;
  const showCompetencyAppreciation = header.showCompetencyAppreciation ?? true;
  const showParentSignature = header.showParentSignature ?? true;

  // Logo de l'établissement
  const hasLogo = !!header.schoolLogo && (header.showSchoolLogo ?? true);
  const logoPosition = header.schoolLogoPosition || 'center';
  const logoSize = header.schoolLogoSize || 'medium';

  const logoDimensionClasses = {
    small: 'w-10 h-10 max-h-10 sm:w-12 sm:h-12',
    medium: 'w-14 h-14 max-h-14 sm:w-16 sm:h-16',
    large: 'w-20 h-20 max-h-20 sm:w-22 sm:h-22',
  }[logoSize];

  return (
    <div className="relative group border border-slate-300 rounded-xl p-4 sm:p-5 bg-white space-y-4 text-slate-900 font-sans print:border-slate-400">
      {/* Edit Header Quick Button (Hover on Desktop, visible in screen mode, hidden in print) */}
      {!readOnly && onEditHeader && (
        <div className="no-print absolute top-3 right-3 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={onEditHeader}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-semibold shadow-2xs transition-all hover:scale-105"
            title="Personnaliser les textes, logos et le cartouche de cet en-tête"
          >
            <Edit3 className="w-3.5 h-3.5 text-teal-600" />
            <span>Personnaliser l'en-tête {hasLogo ? '& Logo' : ''}</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. STYLE OFFICIEL MINESEC BILINGUE (Format National Cameroun)             */}
      {/* ========================================================================= */}
      {style === 'officiel_minesec' && (
        <div className="space-y-4">
          {/* Top Administrative Header (Bilingual dual columns + Optional Center/Left/Right Logo) */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] leading-tight text-center border-b border-slate-300 pb-3 gap-2 sm:gap-4">
            {/* Left side: French text (with optional left logo) */}
            <div className="flex-1 space-y-0.5 pr-1 sm:pr-2">
              {hasLogo && logoPosition === 'left' && (
                <div className="flex justify-center pb-1">
                  <img
                    src={header.schoolLogo}
                    alt="Logo établissement"
                    className={`${logoDimensionClasses} object-contain`}
                  />
                </div>
              )}
              <div className="font-extrabold uppercase text-slate-900 whitespace-pre-line">
                {countryHeaderFr}
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-700">
                {ministryHeaderFr}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-600">
                {regionalDelegation}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-600">
                {departmentalDelegation}
              </div>
              <div className="text-[10px] sm:text-[11px] font-extrabold text-slate-900 uppercase pt-0.5">
                {schoolName}
              </div>
              <div className="text-[9px] sm:text-[10px] italic font-medium text-slate-700">
                {departmentOrSubject}
              </div>
            </div>

            {/* Center: Official Armorial / School Logo (Format national traditionnel) */}
            {hasLogo && logoPosition === 'center' && (
              <div className="flex flex-col items-center justify-center px-1 sm:px-3 shrink-0 border-x border-slate-200">
                <img
                  src={header.schoolLogo}
                  alt="Logo ou Armoiries établissement"
                  className={`${logoDimensionClasses} object-contain drop-shadow-xs transition-transform hover:scale-105`}
                />
              </div>
            )}

            {/* Right side: English text (with optional right logo) */}
            <div className="flex-1 space-y-0.5 pl-1 sm:pl-2">
              {hasLogo && logoPosition === 'right' && (
                <div className="flex justify-center pb-1">
                  <img
                    src={header.schoolLogo}
                    alt="Logo établissement"
                    className={`${logoDimensionClasses} object-contain`}
                  />
                </div>
              )}
              <div className="font-extrabold uppercase text-slate-900 whitespace-pre-line">
                {countryHeaderEn}
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-700">
                {ministryHeaderEn}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-600">
                {regionalDelegation.replace('Délégation Régionale du', 'Regional Delegation of').replace('Délégation Régionale de l\'', 'Regional Delegation of ')}
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-600">
                {departmentalDelegation.replace('Délégation Départementale du', 'Divisional Delegation of').replace('Délégation Départementale de la', 'Divisional Delegation of ')}
              </div>
              <div className="text-[10px] sm:text-[11px] font-extrabold text-slate-900 uppercase pt-0.5">
                {schoolName}
              </div>
              <div className="text-[9px] sm:text-[10px] italic font-medium text-slate-700">
                Academic Year : {academicYear}
              </div>
            </div>
          </div>

          {/* Session Banner Box */}
          <div className="border-2 border-slate-900 py-2 px-3 text-center bg-slate-50/50 rounded-lg">
            <h1 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900">
              {examTitle}
            </h1>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">
              Année scolaire : <span className="font-bold text-slate-900">{academicYear}</span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs border border-slate-300 rounded-lg p-2.5 bg-white">
            <div>
              <span className="font-bold text-slate-700">Classe / Série : </span>
              <span className="font-semibold text-slate-900">{gradeAndSubject.split('—')[0]?.trim() || gradeAndSubject}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">Épreuve : </span>
              <span className="font-semibold text-slate-900">{gradeAndSubject.split('—')[1]?.trim() || gradeAndSubject}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">Durée : </span>
              <span className="font-semibold text-slate-900">{duration}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">Coefficient : </span>
              <span className="font-semibold text-slate-900">{coefficient}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">Date : </span>
              <span className="font-semibold text-slate-900">{date}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">Examinateur : </span>
              <span className="font-semibold text-slate-900">{teacherName}</span>
            </div>
          </div>

          {/* Cartouche Élève MINESEC (Format APC Officiel) */}
          {showStudentCartouche && !isTeacherVersion && (
            <div className="border border-slate-400 rounded-lg p-3 space-y-2 bg-slate-50/30 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <div className="sm:col-span-8 text-slate-800 font-medium">
                  <span className="font-bold">Nom et Prénom de l'élève :</span> ..........................................................................................
                </div>
                {showTableNumber && (
                  <div className="sm:col-span-4 text-slate-800 font-medium">
                    <span className="font-bold">N° de Table :</span> ........................
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1 border-t border-slate-200">
                <div className="sm:col-span-4 flex items-center gap-1 font-bold text-teal-900 text-sm">
                  <span>NOTE :</span>
                  <span className="border-b-2 border-dotted border-teal-800 px-3">...........</span>
                  <span>/ {targetTotalPoints}</span>
                </div>

                {showCompetencyAppreciation && (
                  <div className="sm:col-span-8 text-[11px] text-slate-700 flex flex-wrap items-center gap-2">
                    <span className="font-bold">Appréciation APC :</span>
                    <span className="px-1.5 py-0.5 rounded border border-slate-300 bg-white font-mono text-[10px]">
                      [ ] Non Acquis
                    </span>
                    <span className="px-1.5 py-0.5 rounded border border-slate-300 bg-white font-mono text-[10px]">
                      [ ] En Cours
                    </span>
                    <span className="px-1.5 py-0.5 rounded border border-slate-300 bg-white font-mono text-[10px]">
                      [ ] Acquis
                    </span>
                    <span className="px-1.5 py-0.5 rounded border border-slate-300 bg-white font-mono text-[10px]">
                      [ ] Expert
                    </span>
                  </div>
                )}
              </div>

              {showParentSignature && (
                <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-200 text-[11px] text-slate-600">
                  <div>Visa du Professeur : ........................................</div>
                  <div className="text-right">Visa / Signature du Parent : ........................................</div>
                </div>
              )}
            </div>
          )}

          {/* If teacher version, display official correction badge */}
          {isTeacherVersion && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-center text-xs font-bold text-rose-800 uppercase tracking-wide">
              Guide Officiel de Correction & Barème Détaillé — Document Enseignant
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STYLE ACADÉMIQUE STANDARD (Format classique Lycée / Collège)          */}
      {/* ========================================================================= */}
      {style === 'academique_standard' && (
        <div className="space-y-3">
          <div className="border border-slate-400 rounded-xl overflow-hidden grid grid-cols-12 text-xs">
            <div className="col-span-7 sm:col-span-8 p-3.5 border-r border-slate-300 space-y-1 bg-slate-50/60">
              <div className="flex items-center gap-3">
                {hasLogo && (
                  <img
                    src={header.schoolLogo}
                    alt="Logo établissement"
                    className={`${logoDimensionClasses} object-contain shrink-0`}
                  />
                )}
                <div>
                  <div className="font-bold text-sm tracking-tight text-slate-900 uppercase">
                    {schoolName}
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Année scolaire : <span className="font-medium text-slate-800">{academicYear}</span>
                  </div>
                </div>
              </div>
              <div className="text-slate-800 font-bold text-xs pt-0.5">
                {gradeAndSubject}
              </div>
              <div className="text-[11px] text-slate-500 italic">
                {departmentOrSubject} • Examinateur : {teacherName}
              </div>
            </div>

            <div className="col-span-5 sm:col-span-4 p-3.5 space-y-1.5 bg-white">
              {showStudentCartouche && !isTeacherVersion ? (
                <>
                  <div className="text-[11px] text-slate-700 border-b border-dotted border-slate-300 pb-1">
                    NOM : ....................................
                  </div>
                  <div className="text-[11px] text-slate-700 border-b border-dotted border-slate-300 pb-1">
                    PRÉNOM : ...............................
                  </div>
                  {showTableNumber && (
                    <div className="text-[10px] text-slate-600 border-b border-dotted border-slate-300 pb-0.5">
                      N° TABLE : .............................
                    </div>
                  )}
                  <div className="text-xs font-bold text-teal-800 pt-0.5">
                    NOTE : ......... / {targetTotalPoints}
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-2">
                  <span className="text-xs font-bold text-rose-800 uppercase">Corrigé Officiel</span>
                  <span className="text-[10px] text-slate-500">Barème : {targetTotalPoints} points</span>
                </div>
              )}
            </div>
          </div>

          {/* Center Title */}
          <div className="text-center space-y-1 pt-1">
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
              {examTitle}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600">
              <span>Durée : {duration}</span>
              <span>•</span>
              <span className="text-teal-800 font-bold">Barème : {targetTotalPoints} pts</span>
              <span>•</span>
              <span>{coefficient}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STYLE CARTOUCHE COMPLET & ÉVALUATION APC                               */}
      {/* ========================================================================= */}
      {style === 'cartouche_complet' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-300 pb-3 gap-2">
            <div className="flex items-center gap-3">
              {hasLogo && (
                <img
                  src={header.schoolLogo}
                  alt="Logo établissement"
                  className={`${logoDimensionClasses} object-contain shrink-0`}
                />
              )}
              <div>
                <div className="text-sm font-extrabold uppercase text-slate-900">{schoolName}</div>
                <div className="text-xs text-slate-600">{departmentOrSubject} • Année : {academicYear}</div>
              </div>
            </div>
            <div className="text-left sm:text-right text-xs">
              <div className="font-bold text-slate-800">{gradeAndSubject}</div>
              <div className="text-slate-500">{date} • Durée : {duration} • {coefficient}</div>
            </div>
          </div>

          <div className="text-center py-1">
            <h1 className="text-xl font-black uppercase text-slate-900 tracking-wide">{examTitle}</h1>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">Enseignant / Examinateur : {teacherName}</p>
          </div>

          {showStudentCartouche && !isTeacherVersion && (
            <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/70 space-y-2.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="font-medium text-slate-800">
                  <span className="font-bold">Nom de l'élève :</span> .................................
                </div>
                <div className="font-medium text-slate-800">
                  <span className="font-bold">Prénom :</span> .................................
                </div>
                {showTableNumber && (
                  <div className="font-medium text-slate-800">
                    <span className="font-bold">Matricule / N° Table :</span> .................
                  </div>
                )}
              </div>

              {showCompetencyAppreciation && (
                <div className="border-t border-slate-200 pt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Niveau de compétence :</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                      [ ] Non Acquis (&lt; 10)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                      [ ] En Cours (10 - 13)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                      [ ] Acquis (14 - 17)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                      [ ] Expert (18 - 20)
                    </span>
                  </div>
                  <div className="font-bold text-teal-800 text-sm">
                    NOTE : ........ / {targetTotalPoints}
                  </div>
                </div>
              )}

              {showParentSignature && (
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Appréciation de l'enseignant : ................................................................</span>
                  <span>Signature du Parent : ....................................</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. STYLE ÉPURÉ & MINIMALISTE                                              */}
      {/* ========================================================================= */}
      {style === 'epure' && (
        <div className="space-y-2 pb-1 border-b border-slate-300">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              {hasLogo && (
                <img
                  src={header.schoolLogo}
                  alt="Logo établissement"
                  className="w-8 h-8 max-h-8 object-contain shrink-0"
                />
              )}
              <span className="font-bold text-slate-800 uppercase">{schoolName}</span>
            </div>
            <span>{academicYear}</span>
          </div>
          <div className="text-center">
            <h1 className="text-lg font-black uppercase text-slate-900">{examTitle}</h1>
            <div className="text-xs text-slate-700 font-semibold mt-0.5">
              {gradeAndSubject} • {duration} • Barème : {targetTotalPoints} pts • {coefficient}
            </div>
          </div>
          {showStudentCartouche && !isTeacherVersion && (
            <div className="flex items-center justify-between text-xs pt-1 font-medium text-slate-800">
              <span>Nom : ..............................................................</span>
              <span>Prénom : .........................................</span>
              <span>Note : ........ / {targetTotalPoints}</span>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* INSTRUCTIONS / CONSIGNES COMMUNES (Si renseignées)                       */}
      {/* ========================================================================= */}
      {instructions && instructions.length > 0 && (
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
            <span>Consignes pour le candidat :</span>
          </div>
          <ul className="list-disc list-inside text-slate-600 space-y-0.5 italic text-[11px]">
            {instructions.map((ins, i) => (
              <li key={i}>{ins}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
