import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import { ExamEvaluation } from '../types';
import { dataUrlToUint8Array } from './logoPresets';

// Helper for clean borders
const thinBorder = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: "CCCCCC",
};

const cellBorders = {
  top: thinBorder,
  bottom: thinBorder,
  left: thinBorder,
  right: thinBorder,
};

async function createDocxHeader(exam: ExamEvaluation, isTeacher: boolean = false) {
  const elements: any[] = [];
  const header = exam.academicHeader;
  const style = header.headerStyle || 'officiel_minesec';
  const showLogo = (header.showSchoolLogo ?? true) && !!header.schoolLogo;

  let logoBytes: Uint8Array | null = null;
  if (showLogo && header.schoolLogo) {
    logoBytes = await dataUrlToUint8Array(header.schoolLogo);
  }

  const logoDimension = header.schoolLogoSize === 'small' ? 45 : header.schoolLogoSize === 'large' ? 70 : 55;
  const logoPosition = header.schoolLogoPosition || 'center';

  if (style === 'officiel_minesec') {
    // Official Cameroon bilingual table (with center logo if enabled)
    const hasCenterLogo = showLogo && !!logoBytes && logoPosition === 'center';
    
    const frenchSideChildren: any[] = [];
    if (showLogo && logoBytes && logoPosition === 'left') {
      frenchSideChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new ImageRun({ data: logoBytes, transformation: { width: logoDimension, height: logoDimension }, type: 'png' } as any)],
        })
      );
    }
    frenchSideChildren.push(
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.republicFr || "RÉPUBLIQUE DU CAMEROUN", bold: true, size: 16, font: "Calibri" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.mottoFr || "Paix – Travail – Patrie", italics: true, size: 14, font: "Calibri" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "----------------", size: 12, font: "Calibri" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.ministryHeaderFr || "MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES", bold: true, size: 15, font: "Calibri" })] }),
      ...(header.regionalDelegationFr ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.regionalDelegationFr, size: 14, font: "Calibri" })] })] : []),
      ...(header.departmentalDelegationFr ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.departmentalDelegationFr, size: 14, font: "Calibri" })] })] : []),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.schoolName || "Établissement Scolaire", bold: true, size: 16, font: "Calibri" })] }),
      ...(header.departmentDiscipline ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Département : ${header.departmentDiscipline}`, italics: true, size: 14, font: "Calibri" })] })] : [])
    );

    const englishSideChildren: any[] = [];
    if (showLogo && logoBytes && logoPosition === 'right') {
      englishSideChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new ImageRun({ data: logoBytes, transformation: { width: logoDimension, height: logoDimension }, type: 'png' } as any)],
        })
      );
    }
    englishSideChildren.push(
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.republicEn || "REPUBLIC OF CAMEROON", bold: true, size: 16, font: "Calibri" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.mottoEn || "Peace – Work – Fatherland", italics: true, size: 14, font: "Calibri" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "----------------", size: 12, font: "Calibri" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.ministryHeaderEn || "MINISTRY OF SECONDARY EDUCATION", bold: true, size: 15, font: "Calibri" })] }),
      ...(header.regionalDelegationEn ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.regionalDelegationEn, size: 14, font: "Calibri" })] })] : []),
      ...(header.departmentalDelegationEn ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.departmentalDelegationEn, size: 14, font: "Calibri" })] })] : []),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: header.schoolName || "School", bold: true, size: 16, font: "Calibri" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Academic Year: ${header.academicYear}`, size: 14, font: "Calibri" })] })
    );

    const tableCells = hasCenterLogo
      ? [
          new TableCell({
            width: { size: 42, type: WidthType.PERCENTAGE },
            children: frenchSideChildren,
          }),
          new TableCell({
            width: { size: 16, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100 },
                children: [
                  new ImageRun({
                    data: logoBytes!,
                    transformation: { width: logoDimension, height: logoDimension },
                    type: 'png',
                  } as any),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 42, type: WidthType.PERCENTAGE },
            children: englishSideChildren,
          }),
        ]
      : [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: frenchSideChildren,
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: englishSideChildren,
          }),
        ];

    elements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        rows: [
          new TableRow({
            children: tableCells,
          }),
        ],
      })
    );

    // Session Title Box
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 100 },
        children: [
          new TextRun({
            text: isTeacher 
              ? `${(header.sessionTitle || header.examTitle || exam.title).toUpperCase()} — CORRIGÉ OFFICIEL`
              : (header.sessionTitle || header.examTitle || exam.title).toUpperCase(),
            bold: true,
            size: 26,
            color: isTeacher ? "B91C1C" : "1E293B",
            font: "Calibri",
          }),
        ],
      })
    );

    // Metadata Strip Table
    elements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: cellBorders,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ text: `ÉPREUVE : `, bold: true, size: 19, font: "Calibri" }),
                      new TextRun({ text: `${header.gradeAndSubject}    |    `, size: 19, font: "Calibri" }),
                      new TextRun({ text: `DURÉE : `, bold: true, size: 19, font: "Calibri" }),
                      new TextRun({ text: `${header.duration}    |    `, size: 19, font: "Calibri" }),
                      new TextRun({ text: `COEFF : `, bold: true, size: 19, font: "Calibri" }),
                      new TextRun({ text: `${header.coefficient || "1"}    |    `, size: 19, font: "Calibri" }),
                      new TextRun({ text: `BARÈME : `, bold: true, size: 19, font: "Calibri" }),
                      new TextRun({ text: `${exam.targetTotalPoints} pts    |    `, size: 19, font: "Calibri" }),
                      new TextRun({ text: `DATE : `, bold: true, size: 19, font: "Calibri" }),
                      new TextRun({ text: `${header.date || ""}`, size: 19, font: "Calibri" }),
                      ...(header.examinerName ? [
                        new TextRun({ text: `    |    EXAMINATEUR : `, bold: true, size: 19, font: "Calibri" }),
                        new TextRun({ text: `${header.examinerName}`, size: 19, font: "Calibri" }),
                      ] : []),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    // Student Cartouche Table (if enabled and student version)
    if (!isTeacher && header.showStudentCartouche !== false) {
      elements.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 65, type: WidthType.PERCENTAGE },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Nom et Prénom de l'élève : ............................................................................", size: 18, font: "Calibri" }),
                      ],
                    }),
                    ...(header.showStudentIdOrTableNumber !== false ? [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Classe : ................................   N° de Table / Matricule : ................................", size: 18, font: "Calibri" }),
                        ],
                      }),
                    ] : []),
                  ],
                }),
                new TableCell({
                  width: { size: 35, type: WidthType.PERCENTAGE },
                  borders: cellBorders,
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({ text: `NOTE : ......... / ${exam.targetTotalPoints} pts`, bold: true, size: 22, color: "0D9488", font: "Calibri" }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            ...(header.showAPCAppreciation !== false || header.showParentSignature !== false ? [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 65, type: WidthType.PERCENTAGE },
                    borders: cellBorders,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Appréciation du niveau de compétence (APC) :", bold: true, size: 16, font: "Calibri" }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "[  ] Non Acquis (NA)   [  ] En Cours (ECA)   [  ] Acquis (A)   [  ] Expert (E)", size: 16, font: "Calibri" }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    borders: cellBorders,
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: "Visa du Parent / Tuteur :\n................................................", size: 16, font: "Calibri" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ] : []),
          ],
        })
      );
    }
  } else {
    // Standard or Cartouche or Épuré
    elements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 65, type: WidthType.PERCENTAGE },
                borders: cellBorders,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: header.schoolName || "Établissement Scolaire", bold: true, size: 24, font: "Calibri" }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: `Année scolaire : ${header.academicYear}    |    ${header.gradeAndSubject}`, size: 20, font: "Calibri" }),
                    ],
                  }),
                  ...(header.examinerName ? [
                    new Paragraph({
                      children: [
                        new TextRun({ text: `Examinateur : ${header.examinerName}`, italics: true, size: 18, font: "Calibri" }),
                      ],
                    }),
                  ] : []),
                ],
              }),
              new TableCell({
                width: { size: 35, type: WidthType.PERCENTAGE },
                borders: cellBorders,
                children: isTeacher ? [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({ text: "CORRIGÉ OFFICIEL", bold: true, size: 22, color: "B91C1C", font: "Calibri" }),
                      new TextRun({ text: `\nTotal : ${exam.targetTotalPoints} pts`, bold: true, size: 20, font: "Calibri" }),
                    ],
                  }),
                ] : [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "NOM : ............................................", size: 18, font: "Calibri" }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "CLASSE / TABLE : ..........................", size: 18, font: "Calibri" }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: `NOTE : ......... / ${exam.targetTotalPoints} pts`, bold: true, size: 20, color: "0D9488", font: "Calibri" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 180, after: 140 },
        children: [
          new TextRun({
            text: isTeacher 
              ? `${(header.examTitle || exam.title).toUpperCase()} — CORRIGÉ`
              : (header.examTitle || exam.title).toUpperCase(),
            bold: true,
            size: 28,
            color: isTeacher ? "B91C1C" : "1E293B",
            font: "Calibri",
          }),
        ],
      })
    );

    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({ text: `Durée : ${header.duration}    |    `, bold: true, size: 20, font: "Calibri" }),
          new TextRun({ text: `Barème total : ${exam.targetTotalPoints} points    |    `, bold: true, size: 20, font: "Calibri" }),
          new TextRun({ text: `${header.coefficient || "Coeff. 1"}    |    Date : ${header.date}`, size: 20, font: "Calibri" }),
        ],
      })
    );
  }

  // Instructions
  if (header.instructions && header.instructions.length > 0) {
    elements.push(
      new Paragraph({
        spacing: { before: 150, after: 80 },
        children: [
          new TextRun({ text: "Consignes de travail :", bold: true, underline: {}, size: 20, font: "Calibri" }),
        ],
      })
    );
    header.instructions.forEach((ins) => {
      elements.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: ins, size: 18, font: "Calibri", italics: true })],
        })
      );
    });
  }

  elements.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  return elements;
}

export async function exportStudentExamDocx(exam: ExamEvaluation) {
  const children: any[] = [];

  // Add customized academic header
  children.push(...await createDocxHeader(exam, false));

  // Exercises
  exam.exercises.forEach((ex) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
        children: [
          new TextRun({
            text: `Exercice ${ex.number} : ${ex.title} (${ex.totalPoints} points)`,
            bold: true,
            size: 26,
            color: "0F766E",
            font: "Calibri",
          }),
        ],
      })
    );

    if (ex.contextOrIntro) {
      children.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({
              text: ex.contextOrIntro,
              italics: true,
              size: 21,
              font: "Calibri",
              color: "334155",
            }),
          ],
        })
      );
    }

    ex.questions.forEach((q) => {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 80 },
          children: [
            new TextRun({ text: `${q.number} `, bold: true, size: 21, font: "Calibri" }),
            new TextRun({ text: q.text, size: 21, font: "Calibri" }),
            new TextRun({ text: `  [${q.points} pt${q.points > 1 ? 's' : ''}]`, bold: true, color: "64748B", size: 19, font: "Calibri" }),
          ],
        })
      );

      // Space for student answering
      children.push(
        new Paragraph({
          spacing: { after: 150 },
          children: [
            new TextRun({
              text: "....................................................................................................................................................................................................................",
              color: "CBD5E1",
              size: 16,
            }),
          ],
        })
      );
    });
  });

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = (exam.academicHeader.examTitle || "Evaluation").replace(/[^a-zA-Z0-9-_]/g, "_");
  saveAs(blob, `${cleanTitle}_SUJET_ELEVE.docx`);
}

export async function exportTeacherCorrectionDocx(exam: ExamEvaluation) {
  const children: any[] = [];

  // Add customized academic header for teacher
  children.push(...await createDocxHeader(exam, true));

  // Analysis / Pedagogical Summary
  if (exam.analysis) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text: "Repères Pédagogiques & Compétences Visées :", bold: true, size: 22, font: "Calibri" })],
      })
    );
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: `Notions évaluées : ${exam.analysis.evaluatedConcepts?.join(', ') || 'N/A'}\n`, size: 19, font: "Calibri" }),
          new TextRun({ text: `Compétences : ${exam.analysis.skillsBreakdown || ''}`, size: 19, font: "Calibri", italics: true }),
        ],
      })
    );
  }

  // Exercises with detailed correction
  exam.exercises.forEach((ex) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
        children: [
          new TextRun({
            text: `Exercice ${ex.number} : ${ex.title} (Barème : ${ex.totalPoints} pts)`,
            bold: true,
            size: 24,
            color: "0F766E",
            font: "Calibri",
          }),
        ],
      })
    );

    ex.questions.forEach((q) => {
      // Question Title + Points
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({ text: `Question ${q.number} : `, bold: true, size: 21, font: "Calibri" }),
            new TextRun({ text: q.text, size: 21, font: "Calibri" }),
            new TextRun({ text: `  [Total : ${q.points} pt${q.points > 1 ? 's' : ''}]`, bold: true, color: "0D9488", size: 20, font: "Calibri" }),
          ],
        })
      );

      // Expected Answer
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 60 },
          indent: { left: 400 },
          children: [
            new TextRun({ text: "• Réponse attendue : ", bold: true, color: "15803D", size: 20, font: "Calibri" }),
            new TextRun({ text: q.expectedAnswer, size: 20, font: "Calibri" }),
          ],
        })
      );

      // Solution Method
      if (q.solutionMethod) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 60 },
            indent: { left: 400 },
            children: [
              new TextRun({ text: "• Méthode / Démarche : ", bold: true, color: "0284C7", size: 20, font: "Calibri" }),
              new TextRun({ text: q.solutionMethod, size: 20, font: "Calibri", italics: true }),
            ],
          })
        );
      }

      // Partial Credit Rubric
      if (q.partialCreditCriteria) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 120 },
            indent: { left: 400 },
            children: [
              new TextRun({ text: "• Barème & Points partiels : ", bold: true, color: "B45309", size: 20, font: "Calibri" }),
              new TextRun({ text: q.partialCreditCriteria, size: 20, font: "Calibri" }),
            ],
          })
        );
      }
    });
  });

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = (exam.academicHeader.examTitle || "Evaluation").replace(/[^a-zA-Z0-9-_]/g, "_");
  saveAs(blob, `${cleanTitle}_CORRIGE_ENSEIGNANT.docx`);
}

export function copyFormattedText(exam: ExamEvaluation, mode: 'student' | 'teacher' | 'both'): string {
  let text = "";

  if (mode === 'student' || mode === 'both') {
    text += `=========================================================\n`;
    text += `${exam.academicHeader.schoolName} — Année ${exam.academicHeader.academicYear}\n`;
    text += `${exam.academicHeader.examTitle.toUpperCase()}\n`;
    text += `Classe & Matière : ${exam.academicHeader.gradeAndSubject}\n`;
    text += `Durée : ${exam.academicHeader.duration} | Barème : ${exam.targetTotalPoints} points\n`;
    text += `=========================================================\n\n`;

    if (exam.academicHeader.instructions?.length) {
      text += `Consignes :\n`;
      exam.academicHeader.instructions.forEach(ins => text += `- ${ins}\n`);
      text += `\n`;
    }

    exam.exercises.forEach(ex => {
      text += `--- EXERCICE ${ex.number} : ${ex.title} (${ex.totalPoints} points) ---\n`;
      if (ex.contextOrIntro) text += `${ex.contextOrIntro}\n\n`;
      ex.questions.forEach(q => {
        text += `${q.number} ${q.text}  [${q.points} pt${q.points > 1 ? 's' : ''}]\n\n`;
      });
      text += `\n`;
    });
  }

  if (mode === 'both') {
    text += `\n\n=========================================================\n`;
    text += `               CORRIGÉ & GRILLE DE NOTATION               \n`;
    text += `=========================================================\n\n`;
  }

  if (mode === 'teacher' || mode === 'both') {
    if (mode === 'teacher') {
      text += `CORRIGÉ OFFICIEL : ${exam.academicHeader.examTitle} (${exam.targetTotalPoints} pts)\n\n`;
    }
    exam.exercises.forEach(ex => {
      text += `### Exercice ${ex.number} : ${ex.title} (${ex.totalPoints} pts)\n`;
      ex.questions.forEach(q => {
        text += `\nQuestion ${q.number} [${q.points} pt${q.points > 1 ? 's' : ''}] : ${q.text}\n`;
        text += `-> Réponse attendue : ${q.expectedAnswer}\n`;
        if (q.solutionMethod) text += `-> Démarche : ${q.solutionMethod}\n`;
        if (q.partialCreditCriteria) text += `-> Barème partiel : ${q.partialCreditCriteria}\n`;
      });
      text += `\n---------------------------------------------------------\n`;
    });
  }

  return text;
}
