import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeightRule,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType
} from 'docx';
import { assertPedagogicalActivityV2 } from './pedagogical-standard-v2.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = path.join(root, 'data', 'atividades', 'fundamental-anos-iniciais', '4-ano');
const outputRoot = path.join(root, 'exports', 'word', '4-ano', 'geografia');
const terms = [1, 2, 3, 4];

function clean(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function slugify(value = '') {
  return clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70);
}

function run(text, options = {}) {
  return new TextRun({
    text: clean(text),
    font: 'Arial',
    size: options.size ?? 22,
    bold: options.bold ?? false,
    color: options.color ?? '141414'
  });
}

function paragraph(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment,
    pageBreakBefore: options.pageBreakBefore ?? false,
    spacing: {
      before: options.before ?? 0,
      after: options.after ?? 35,
      line: options.line ?? 230
    },
    children: [run(text, options)]
  });
}

function headerTable() {
  const border = { style: BorderStyle.SINGLE, size: 6, color: '000000' };
  const allBorders = { top: border, bottom: border, left: border, right: border };
  const cell = (text, width, margins = { top: 15, left: 65, bottom: 10, right: 65 }) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins,
    borders: allBorders,
    children: [paragraph(text, { bold: true, size: 22, after: 0 })]
  });

  return new Table({
    width: { size: 10225, type: WidthType.DXA },
    columnWidths: [3816, 3024, 3385],
    rows: [
      new TableRow({
        height: { value: 418, rule: HeightRule.EXACT },
        children: [new TableCell({
          columnSpan: 3,
          width: { size: 10225, type: WidthType.DXA },
          margins: { top: 15, left: 65, bottom: 10, right: 65 },
          borders: allBorders,
          children: [paragraph('Escola: ____________________________________________________________', { bold: true, size: 22, after: 0 })]
        })]
      }),
      new TableRow({
        height: { value: 418, rule: HeightRule.EXACT },
        children: [new TableCell({
          columnSpan: 3,
          width: { size: 10225, type: WidthType.DXA },
          margins: { top: 15, left: 65, bottom: 10, right: 65 },
          borders: allBorders,
          children: [paragraph('Nome: _____________________________________________________________', { bold: true, size: 22, after: 0 })]
        })]
      }),
      new TableRow({
        height: { value: 435, rule: HeightRule.EXACT },
        children: [
          cell('Turma: ______________', 3816),
          cell('Data: ____/____/______', 3024),
          cell('Prof.:__________', 3385)
        ]
      })
    ]
  });
}

function supportTable(activity) {
  const border = { style: BorderStyle.SINGLE, size: 6, color: '000000' };
  const allBorders = { top: border, bottom: border, left: border, right: border };
  const leftChildren = [
    paragraph(activity.textoApoio.titulo, { bold: true, size: 24, after: 35 }),
    paragraph(activity.textoApoio.conteudo, { size: 24, line: 230, after: 0 })
  ];
  const illustrationText = clean(activity.ilustracao?.descricao) || 'Ilustração pedagógica da atividade.';
  const rightChildren = [
    paragraph('ILUSTRAÇÃO', { bold: true, size: 22, alignment: AlignmentType.CENTER, after: 60 }),
    paragraph(illustrationText, { size: 18, alignment: AlignmentType.CENTER, line: 210, after: 0 })
  ];

  return new Table({
    width: { size: 10512, type: WidthType.DXA },
    columnWidths: [4968, 5544],
    rows: [new TableRow({
      height: { value: 5458, rule: HeightRule.EXACT },
      children: [
        new TableCell({
          width: { size: 4968, type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          borders: allBorders,
          margins: { top: 85, left: 105, bottom: 65, right: 105 },
          children: leftChildren
        }),
        new TableCell({
          width: { size: 5544, type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          borders: allBorders,
          margins: { top: 30, left: 50, bottom: 30, right: 35 },
          children: rightChildren
        })
      ]
    })]
  });
}

function questionBlocks(activity) {
  const output = [];
  for (const question of activity.questoes) {
    output.push(new Paragraph({
      spacing: { before: 10, after: 18, line: 230 },
      children: [
        run(`${question.numero} - `, { size: 22 }),
        run(question.enunciado, { size: 22 })
      ]
    }));

    const alternatives = Array.isArray(question.alternativas) ? question.alternativas : [];
    if (alternatives.length) {
      alternatives.forEach((alternative, index) => {
        output.push(paragraph(`${String.fromCharCode(97 + index)}) ${alternative}`, { size: 22, after: 12 }));
      });
    } else {
      const lineCount = question.espacoResposta === 'grande' ? 2 : 1;
      for (let index = 0; index < lineCount; index += 1) {
        output.push(paragraph('________________________________________________________________________________________', { size: 14, color: '666666', after: 12 }));
      }
    }
  }
  return output;
}

function answerKey(activity, collection) {
  const skill = activity.bncc[0];
  const identification = `Revisão · ${collection.etapa || 'Ensino Fundamental I'} · ${collection.ano || '4º ano'} · ${collection.bimestre || ''}º bimestre · Geografia`;
  const output = [
    paragraph('GABARITO', { bold: true, size: 30, color: '1F497D', alignment: AlignmentType.CENTER, pageBreakBefore: true, after: 35 }),
    paragraph(activity.titulo, { bold: true, size: 26, alignment: AlignmentType.CENTER, after: 25 }),
    paragraph(identification, { size: 18, color: '666666', alignment: AlignmentType.CENTER, after: 50 })
  ];

  for (const item of activity.gabarito) {
    output.push(paragraph(`${item.numero}. ${item.resposta}`, { size: 22, after: 30 }));
  }

  output.push(paragraph(`BNCC: ${skill.codigo} — ${skill.habilidadeOficial}`, { bold: true, size: 20, before: 50, after: 20 }));
  output.push(paragraph(`Verbo central: ${skill.verbo}`, { size: 20, after: 20 }));
  output.push(paragraph(`Objetivo da ilustração: ${activity.ilustracao.objetivoPedagogico}`, { size: 20, after: 20 }));
  return output;
}

async function createDocument(activity, collection) {
  const children = [
    headerTable(),
    paragraph('ATIVIDADE DE GEOGRAFIA', { bold: true, size: 30, color: '1F497D', alignment: AlignmentType.CENTER, before: 35, after: 30 }),
    paragraph(activity.titulo, { bold: true, size: 26, alignment: AlignmentType.CENTER, after: 55 }),
    supportTable(activity),
    paragraph(activity.instrucaoGeral || 'Responda às questões de acordo com o texto.', { bold: true, size: 26, color: '1F497D', alignment: AlignmentType.CENTER, before: 45, after: 45 }),
    ...questionBlocks(activity),
    ...answerKey(activity, collection)
  ];

  const document = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 22, color: '141414' },
          paragraph: { spacing: { line: 230, after: 35 } }
        }
      }
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11909, height: 16834 },
          margin: { top: 34, right: 391, bottom: 0, left: 391, header: 142, footer: 142 }
        }
      },
      children
    }]
  });

  return Packer.toBuffer(document);
}

async function main() {
  let generated = 0;
  let skipped = 0;

  for (const term of terms) {
    const jsonPath = path.join(dataRoot, `${term}-bimestre`, 'geografia.json');
    if (!fs.existsSync(jsonPath)) {
      console.warn(`[IGNORADO] ${term}º bimestre: geografia.json não encontrado.`);
      continue;
    }

    const collection = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const destination = path.join(outputRoot, `${term}-bimestre`);
    fs.mkdirSync(destination, { recursive: true });

    for (const activity of collection.atividades || []) {
      if (activity.padraoPedagogico !== 'teacheasy-v2') {
        skipped += 1;
        continue;
      }

      try {
        assertPedagogicalActivityV2(activity, collection);
      } catch (error) {
        console.error(`[ERRO] ${activity.id}\n${error.message}`);
        process.exitCode = 1;
        continue;
      }

      const code = clean(activity.bncc?.[0]?.codigo || 'bncc');
      const filename = `${String(activity.sequenciaNumero || activity.numero || generated + 1).padStart(2, '0')}-${code.toLowerCase()}-${slugify(activity.titulo)}.docx`;
      const buffer = await createDocument(activity, collection);
      fs.writeFileSync(path.join(destination, filename), buffer);
      generated += 1;
      console.log(`[OK] ${term}º bimestre -> ${filename}`);
    }
  }

  console.log(`\nGeografia Word concluído. Gerados: ${generated}. Legados ignorados: ${skipped}.`);
  if (generated === 0) {
    console.log('Nenhuma atividade V2 foi encontrada ainda. Isso é esperado até começarmos a reconstrução de Geografia.');
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
