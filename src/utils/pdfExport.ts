import { jsPDF } from 'jspdf';
import { ExamEvaluation } from '../types';

function tryRenderSchoolLogoInPdf(
  doc: jsPDF,
  logoDataUrl: string,
  x: number,
  y: number,
  size: number
) {
  try {
    if (logoDataUrl && logoDataUrl.startsWith('data:image/')) {
      const format = logoDataUrl.includes('png')
        ? 'PNG'
        : logoDataUrl.includes('jpeg') || logoDataUrl.includes('jpg')
        ? 'JPEG'
        : 'PNG';
      doc.addImage(logoDataUrl, format, x, y, size, size);
    }
  } catch (err) {
    // If the image cannot be rasterized directly by jsPDF (e.g. raw SVG without canvas conversion), proceed gracefully
    console.warn('PDF export school logo notice:', err);
  }
}

function renderPdfHeader(
  doc: jsPDF,
  exam: ExamEvaluation,
  isTeacher: boolean,
  pageWidth: number,
  margin: number,
  contentWidth: number,
  startY: number
): number {
  let y = startY;
  const header = exam.academicHeader;
  const style = header.headerStyle || 'officiel_minesec';
  const showLogo = (header.showSchoolLogo ?? true) && !!header.schoolLogo;
  const logoSizeMm = header.schoolLogoSize === 'small' ? 13 : header.schoolLogoSize === 'large' ? 21 : 16;
  const logoPos = header.schoolLogoPosition || 'center';

  if (style === 'officiel_minesec') {
    // 1. Dual column administrative header (with center/left/right logo)
    const colWidth = contentWidth / 2 - 4;
    const leftX = margin;
    const rightX = margin + contentWidth / 2 + 4;
    const leftCenter = leftX + colWidth / 2;
    const rightCenter = rightX + colWidth / 2;

    if (showLogo && header.schoolLogo) {
      if (logoPos === 'center') {
        tryRenderSchoolLogoInPdf(doc, header.schoolLogo, (pageWidth - logoSizeMm) / 2, y, logoSizeMm);
      } else if (logoPos === 'left') {
        tryRenderSchoolLogoInPdf(doc, header.schoolLogo, margin + 2, y, logoSizeMm);
      } else if (logoPos === 'right') {
        tryRenderSchoolLogoInPdf(doc, header.schoolLogo, pageWidth - margin - logoSizeMm - 2, y, logoSizeMm);
      }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(header.republicFr || 'RÉPUBLIQUE DU CAMEROUN', leftCenter, y, { align: 'center' });
    doc.text(header.republicEn || 'REPUBLIC OF CAMEROON', rightCenter, y, { align: 'center' });

    y += 3.2;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(header.mottoFr || 'Paix – Travail – Patrie', leftCenter, y, { align: 'center' });
    doc.text(header.mottoEn || 'Peace – Work – Fatherland', rightCenter, y, { align: 'center' });

    y += 3.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(header.ministryHeaderFr || 'MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES', leftCenter, y, { align: 'center' });
    doc.text(header.ministryHeaderEn || 'MINISTRY OF SECONDARY EDUCATION', rightCenter, y, { align: 'center' });

    if (header.regionalDelegationFr || header.regionalDelegationEn) {
      y += 3.2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      if (header.regionalDelegationFr) doc.text(header.regionalDelegationFr, leftCenter, y, { align: 'center' });
      if (header.regionalDelegationEn) doc.text(header.regionalDelegationEn, rightCenter, y, { align: 'center' });
    }

    if (header.departmentalDelegationFr || header.departmentalDelegationEn) {
      y += 3;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      if (header.departmentalDelegationFr) doc.text(header.departmentalDelegationFr, leftCenter, y, { align: 'center' });
      if (header.departmentalDelegationEn) doc.text(header.departmentalDelegationEn, rightCenter, y, { align: 'center' });
    }

    y += 3.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(header.schoolName || 'ÉTABLISSEMENT SCOLAIRE', leftCenter, y, { align: 'center' });
    doc.text(`Année / Year : ${header.academicYear}`, rightCenter, y, { align: 'center' });

    if (header.departmentDiscipline) {
      y += 3;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(6.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Département : ${header.departmentDiscipline}`, leftCenter, y, { align: 'center' });
    }

    y += 4;
    // Horizontal separator
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    // 2. Session Banner
    const sessionText = (header.sessionTitle || header.examTitle || exam.title || 'ÉVALUATION').toUpperCase();
    doc.setFillColor(isTeacher ? 254 : 248, isTeacher ? 242 : 250, isTeacher ? 242 : 252);
    doc.setDrawColor(isTeacher ? 239 : 203, isTeacher ? 68 : 213, isTeacher ? 68 : 225);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(isTeacher ? 185 : 15, isTeacher ? 28 : 23, isTeacher ? 28 : 42);
    doc.text(
      isTeacher ? `${sessionText} — CORRIGÉ OFFICIEL` : sessionText,
      pageWidth / 2,
      y + 5.5,
      { align: 'center' }
    );
    y += 10;

    // 3. Metadata Strip Box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 6.5, 1, 1, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const metaParts = [
      `Épreuve : ${header.gradeAndSubject}`,
      `Durée : ${header.duration}`,
      `Coeff. : ${header.coefficient || 1}`,
      `Barème : ${exam.targetTotalPoints} pts`,
      header.date ? `Date : ${header.date}` : '',
      header.examinerName ? `Examinateur : ${header.examinerName}` : '',
    ].filter(Boolean);
    doc.text(metaParts.join('   |   '), pageWidth / 2, y + 4.5, { align: 'center' });
    y += 8.5;

    // 4. Student Cartouche (if not teacher and showStudentCartouche !== false)
    if (!isTeacher && header.showStudentCartouche !== false) {
      const cartoucheH = (header.showAPCAppreciation !== false || header.showParentSignature !== false) ? 17 : 11;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(180, 190, 200);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin, y, contentWidth, cartoucheH, 1.5, 1.5, 'FD');

      // Divider inside cartouche
      const noteDividerX = margin + contentWidth * 0.68;
      doc.line(noteDividerX, y, noteDividerX, y + (header.showAPCAppreciation !== false ? 11 : cartoucheH));

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text('Nom et Prénom de l\'élève : ........................................................................', margin + 3, y + 4.5);
      if (header.showStudentIdOrTableNumber !== false) {
        doc.text('Classe : ...........................     N° Table / Matricule : ...........................', margin + 3, y + 9);
      }

      // Note box
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 118, 110);
      doc.text(`NOTE : ......... / ${exam.targetTotalPoints}`, noteDividerX + 3, y + 6.5);

      // APC / Signature row
      if (header.showAPCAppreciation !== false || header.showParentSignature !== false) {
        doc.line(margin, y + 11, pageWidth - margin, y + 11);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        if (header.showAPCAppreciation !== false) {
          doc.text('Compétence APC :  [  ] Non Acquis (NA)   [  ] En Cours (ECA)   [  ] Acquis (A)   [  ] Expert (E)', margin + 3, y + 15);
        }
        if (header.showParentSignature !== false) {
          doc.text('Visa Parent : ...................................', pageWidth - margin - 50, y + 15);
        }
      }

      y += cartoucheH + 3.5;
    }
  } else {
    // Standard / Cartouche / Épuré style
    const boxHeight = 24;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(180, 190, 200);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(20, 30, 45);
    doc.text(header.schoolName || 'Établissement Scolaire', margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(70, 80, 95);
    doc.text(`Année scolaire : ${header.academicYear || '2025 - 2026'}   |   ${header.gradeAndSubject}`, margin + 4, y + 13);
    if (header.examinerName) {
      doc.text(`Examinateur : ${header.examinerName}`, margin + 4, y + 19);
    }

    const dividerX = margin + contentWidth * 0.65;
    doc.line(dividerX, y, dividerX, y + boxHeight);

    if (isTeacher) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(185, 28, 28);
      doc.text('CORRIGÉ OFFICIEL', dividerX + 4, y + 10);
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Total : ${exam.targetTotalPoints} points`, dividerX + 4, y + 16);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('NOM : ..............................................', dividerX + 3, y + 6.5);
      doc.text('CLASSE / TABLE : .............................', dividerX + 3, y + 12.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 118, 110);
      doc.text(`NOTE : ......... / ${exam.targetTotalPoints}`, dividerX + 3, y + 19.5);
    }

    y += boxHeight + 6;

    // Exam Main Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    const examTitle = (header.examTitle || exam.title || 'ÉVALUATION').toUpperCase();
    doc.text(isTeacher ? `${examTitle} — CORRIGÉ` : examTitle, pageWidth / 2, y, { align: 'center' });
    y += 5.5;

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const metaText = `Durée : ${header.duration}   |   Barème : ${exam.targetTotalPoints} pts   |   ${header.coefficient || 'Coeff. 1'}   |   ${header.date || ''}`;
    doc.text(metaText, pageWidth / 2, y, { align: 'center' });
    y += 7;
  }

  // Instructions Box
  if (header.instructions && header.instructions.length > 0) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    const instLines = header.instructions.map((ins) => `• ${ins}`);
    const renderedInst = doc.splitTextToSize(instLines.join('\n'), contentWidth - 8);
    const instBoxHeight = renderedInst.length * 4 + 7;

    doc.roundedRect(margin, y, contentWidth, instBoxHeight, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('Consignes :', margin + 3, y + 4.5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(renderedInst, margin + 3, y + 8.5);
    y += instBoxHeight + 5;
  }

  return y;
}

export function exportStudentExamPdf(exam: ExamEvaluation) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawRunningHeader('Sujet Élève');
    }
  };

  const drawRunningHeader = (tag: string) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 130, 140);
    doc.text(`${exam.academicHeader.schoolName || 'Établissement'} • ${exam.academicHeader.gradeAndSubject} • ${tag}`, margin, y);
    doc.text(`Barème : ${exam.targetTotalPoints} pts`, pageWidth - margin, y, { align: 'right' });
    y += 4;
    doc.setDrawColor(220, 225, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  // Render customized academic header
  y = renderPdfHeader(doc, exam, false, pageWidth, margin, contentWidth, y);

  // 3. Exercises
  exam.exercises.forEach((exercise) => {
    checkPageBreak(25);

    // Exercise Header Bar
    doc.setFillColor(15, 118, 110);
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`Exercice ${exercise.number} : ${exercise.title}`, margin + 3, y + 5);
    doc.text(`${exercise.totalPoints} points`, pageWidth - margin - 3, y + 5, { align: 'right' });
    y += 10;

    // Context / Intro
    if (exercise.contextOrIntro) {
      checkPageBreak(15);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const splitIntro = doc.splitTextToSize(exercise.contextOrIntro, contentWidth - 6);
      const introHeight = splitIntro.length * 4.2 + 4;
      
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, introHeight, 1.5, 1.5, 'FD');
      doc.text(splitIntro, margin + 3, y + 4.5);
      y += introHeight + 4;
    }

    // Questions
    exercise.questions.forEach((q) => {
      checkPageBreak(20);

      // Question line
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      const qNumText = `${q.number} `;
      const qNumWidth = doc.getTextWidth(qNumText);
      doc.text(qNumText, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const pointsText = ` [${q.points} pt${q.points > 1 ? 's' : ''}]`;
      const pointsWidth = doc.getTextWidth(pointsText);
      const availableTextWidth = contentWidth - qNumWidth - pointsWidth - 2;

      const splitText = doc.splitTextToSize(q.text, availableTextWidth);
      doc.text(splitText, margin + qNumWidth, y);

      // Points tag
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(pointsText, pageWidth - margin, y, { align: 'right' });

      y += splitText.length * 4.5 + 2;

      // Student dotted answer writing lines
      checkPageBreak(12);
      doc.setDrawColor(210, 220, 230);
      doc.setLineWidth(0.2);
      doc.setLineDashPattern([1, 1.5], 0);
      doc.line(margin + 5, y + 4, pageWidth - margin, y + 4);
      doc.line(margin + 5, y + 9, pageWidth - margin, y + 9);
      doc.setLineDashPattern([], 0); // reset
      y += 13;
    });

    y += 4;
  });

  // Add page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(140, 150, 165);
    doc.text(`Page ${i} / ${totalPages}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
  }

  const cleanTitle = (exam.academicHeader.examTitle || 'Evaluation').replace(/[^a-zA-Z0-9-_]/g, '_');
  doc.save(`${cleanTitle}_SUJET_ELEVE.pdf`);
}

export function exportTeacherCorrectionPdf(exam: ExamEvaluation) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawRunningHeader('Corrigé & Barème');
    }
  };

  const drawRunningHeader = (tag: string) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(185, 28, 28);
    doc.text(`DOCUMENT ENSEIGNANT • ${exam.academicHeader.gradeAndSubject} • ${tag}`, margin, y);
    doc.text(`Total : ${exam.targetTotalPoints} pts`, pageWidth - margin, y, { align: 'right' });
    y += 4;
    doc.setDrawColor(254, 202, 202);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  // Render customized academic header (Teacher version)
  y = renderPdfHeader(doc, exam, true, pageWidth, margin, contentWidth, y);

  // Pedagogical Guidance Box
  if (exam.analysis) {
    checkPageBreak(25);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Repères Pédagogiques & Compétences :', margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const conceptsText = `Notions évaluées : ${exam.analysis.evaluatedConcepts?.join(', ') || 'N/A'}`;
    const splitConcepts = doc.splitTextToSize(conceptsText, contentWidth - 8);
    doc.text(splitConcepts, margin + 4, y + 10.5);

    const skillsText = `Compétences : ${exam.analysis.skillsBreakdown || 'Standard'}`;
    const splitSkills = doc.splitTextToSize(skillsText, contentWidth - 8);
    doc.text(splitSkills, margin + 4, y + 15.5);

    y += 25;
  }

  // Exercises
  exam.exercises.forEach((exercise) => {
    checkPageBreak(25);

    // Exercise Bar
    doc.setFillColor(15, 118, 110);
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`Exercice ${exercise.number} : ${exercise.title}`, margin + 3, y + 5);
    doc.text(`Barème : ${exercise.totalPoints} pts`, pageWidth - margin - 3, y + 5, { align: 'right' });
    y += 10;

    exercise.questions.forEach((q) => {
      checkPageBreak(30);

      // Question prompt
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      const qNum = `${q.number} `;
      const qNumWidth = doc.getTextWidth(qNum);
      doc.text(qNum, margin, y);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      const ptsLabel = ` [${q.points} pt${q.points > 1 ? 's' : ''}]`;
      const ptsWidth = doc.getTextWidth(ptsLabel);
      const qTextLines = doc.splitTextToSize(q.text, contentWidth - qNumWidth - ptsWidth - 2);
      doc.text(qTextLines, margin + qNumWidth, y);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 118, 110);
      doc.text(ptsLabel, pageWidth - margin, y, { align: 'right' });

      y += qTextLines.length * 4.5 + 2;

      // 1. Expected Answer (Green Box)
      const ansLines = doc.splitTextToSize(`Réponse attendue :\n${q.expectedAnswer}`, contentWidth - 8);
      const ansBoxHeight = ansLines.length * 4.2 + 5;
      checkPageBreak(ansBoxHeight + 5);

      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(margin + 2, y, contentWidth - 4, ansBoxHeight, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(22, 101, 52);
      doc.text('Réponse attendue :', margin + 5, y + 4.5);

      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(20, 83, 45);
      const splitCleanAns = doc.splitTextToSize(q.expectedAnswer, contentWidth - 12);
      doc.text(splitCleanAns, margin + 5, y + 9);

      y += ansBoxHeight + 2.5;

      // 2. Solution Method (Sky Box)
      if (q.solutionMethod) {
        const methodLines = doc.splitTextToSize(q.solutionMethod, contentWidth - 12);
        const methodBoxHeight = methodLines.length * 4 + 7;
        checkPageBreak(methodBoxHeight + 5);

        doc.setFillColor(240, 249, 255);
        doc.setDrawColor(186, 230, 253);
        doc.roundedRect(margin + 2, y, contentWidth - 4, methodBoxHeight, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(3, 105, 161);
        doc.text('Méthode / Démarche :', margin + 5, y + 4.5);

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(14, 116, 144);
        doc.text(methodLines, margin + 5, y + 8.5);

        y += methodBoxHeight + 2.5;
      }

      // 3. Partial Credit Criteria (Amber Box)
      if (q.partialCreditCriteria) {
        const rubricLines = doc.splitTextToSize(q.partialCreditCriteria, contentWidth - 12);
        const rubricBoxHeight = rubricLines.length * 4 + 7;
        checkPageBreak(rubricBoxHeight + 5);

        doc.setFillColor(254, 252, 232);
        doc.setDrawColor(254, 240, 138);
        doc.roundedRect(margin + 2, y, contentWidth - 4, rubricBoxHeight, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(161, 98, 7);
        doc.text('Barème partiel & Critères :', margin + 5, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(133, 77, 14);
        doc.text(rubricLines, margin + 5, y + 8.5);

        y += rubricBoxHeight + 3.5;
      }

      y += 2;
    });

    y += 4;
  });

  // Add page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(185, 28, 28);
    doc.text(`Page ${i} / ${totalPages}`, pageWidth / 2, pageHeight - 6, { align: 'center' });
  }

  const cleanTitle = (exam.academicHeader.examTitle || 'Evaluation').replace(/[^a-zA-Z0-9-_]/g, '_');
  doc.save(`${cleanTitle}_CORRIGE_ENSEIGNANT.pdf`);
}
