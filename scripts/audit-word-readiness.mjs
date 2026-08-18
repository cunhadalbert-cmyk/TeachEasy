#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const subjects = ['lingua-portuguesa.json', 'matematica.json', 'ciencias.json', 'historia.json', 'geografia.json'];
const normalize = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const mojibake = /(Ã[§£©ª³¡­µº‰“]|Â[°ª]|â(?:€™|€œ|€|€“|€”)|�)/;
const blockers = [];
const warnings = [];
let collections = 0;
let activities = 0;

function stage(year) {
  return year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
}

for (let year = 1; year <= 9; year += 1) {
  for (let term = 1; term <= 4; term += 1) {
    for (const filename of subjects) {
      const file = path.join(root, 'data', 'atividades', stage(year), `${year}-ano`, `${term}-bimestre`, filename);
      const rel = path.relative(root, file).replaceAll('\\', '/');
      const collection = JSON.parse(fs.readFileSync(file, 'utf8'));
      collections += 1;
      const layout = collection.layout || {};
      if (layout.formato !== 'A4') blockers.push({ file: rel, problem: `formato Word esperado A4; encontrado ${layout.formato || 'ausente'}` });
      if (Number(layout.margensCm) !== 1) blockers.push({ file: rel, problem: `margem esperada 1 cm; encontrado ${layout.margensCm ?? 'ausente'}` });
      if (!/preta/i.test(normalize(layout.moldura))) blockers.push({ file: rel, problem: 'moldura preta não declarada no layout' });
      if (!/separado/i.test(normalize(layout.gabarito))) blockers.push({ file: rel, problem: 'gabarito separado não declarado no layout' });

      for (const activity of collection.atividades || []) {
        activities += 1;
        const id = activity.id || '(sem id)';
        if ((activity.questoes || []).length !== 8 || (activity.gabarito || []).length !== 8) blockers.push({ file: rel, id, problem: 'exportação exige 8 questões e 8 respostas' });
        const title = normalize(activity.titulo);
        const supportTitle = normalize(activity.textoApoio?.titulo);
        const support = normalize(activity.textoApoio?.conteudo);
        const instruction = normalize(activity.instrucaoGeral);
        const strings = [title, supportTitle, support, instruction, ...(activity.questoes || []).map(q => normalize(q.enunciado)), ...(activity.gabarito || []).map(a => normalize(a.resposta))];
        if (strings.some(value => mojibake.test(value))) blockers.push({ file: rel, id, problem: 'texto corrompido/encoding incompatível com Word' });
        if (!title || !support || !instruction) blockers.push({ file: rel, id, problem: 'título, texto de apoio ou instrução ausente' });
        if (support.length > 1400) warnings.push({ file: rel, id, problem: `texto de apoio longo (${support.length} caracteres); conferir encaixe em uma folha` });
        const questionChars = (activity.questoes || []).reduce((sum, q) => sum + normalize(q.enunciado).length + (q.alternativas || []).reduce((a, b) => a + normalize(b).length, 0), 0);
        if (questionChars > 1800) warnings.push({ file: rel, id, problem: `bloco de questões longo (${questionChars} caracteres); conferir encaixe em uma folha` });
      }
    }
  }
}

const report = { collections, activities, blockers: blockers.length, warnings: warnings.length, blockerItems: blockers, warningItems: warnings };
console.log(JSON.stringify({ collections, activities, blockers: blockers.length, warnings: warnings.length }, null, 2));
const output = process.argv.find(arg => arg.startsWith('--output='))?.slice('--output='.length);
if (output) {
  const target = path.resolve(output);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}
if (blockers.length) {
  console.error(JSON.stringify(blockers.slice(0, 50), null, 2));
  process.exitCode = 1;
}
