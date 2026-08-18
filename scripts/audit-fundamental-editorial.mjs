#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { validatePedagogicalActivityV2 } from './pedagogical-standard-v2.mjs';

const root = process.cwd();
const subjects = [
  ['lingua-portuguesa.json', 'Língua Portuguesa', 'LP'],
  ['matematica.json', 'Matemática', 'MA'],
  ['ciencias.json', 'Ciências', 'CI'],
  ['historia.json', 'História', 'HI'],
  ['geografia.json', 'Geografia', 'GE']
];
const mojibake = /(Ã[§£©ª³¡­µº‰“]|Â[°ª]|â(?:€™|€œ|€|€“|€”)|�)/;
const normalize = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const normalizedKey = value => normalize(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function stage(year) {
  return year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
}

function scanStrings(value, location = '$', findings = []) {
  if (typeof value === 'string') {
    if (mojibake.test(value)) findings.push(location);
    return findings;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanStrings(item, `${location}[${index}]`, findings));
    return findings;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => scanStrings(item, `${location}.${key}`, findings));
  }
  return findings;
}

function codeMatchesSubject(code, suffix) {
  return new RegExp(`^EF(?:0[1-9]|15|35)${suffix}\\d{2}$`).test(code);
}

const blocking = [];
const warnings = [];
const stats = {
  collections: 0,
  activities: 0,
  questions: 0,
  answers: 0,
  humanReviewPending: 0,
  humanReviewDone: 0,
  visualPending: 0,
  visualReady: 0,
  mojibakeOccurrences: 0
};

for (let year = 1; year <= 9; year += 1) {
  for (let term = 1; term <= 4; term += 1) {
    for (const [filename, subject, suffix] of subjects) {
      const file = path.join(root, 'data', 'atividades', stage(year), `${year}-ano`, `${term}-bimestre`, filename);
      const rel = path.relative(root, file);
      if (!fs.existsSync(file)) {
        blocking.push({ file: rel, problem: 'arquivo canônico ausente' });
        continue;
      }
      let collection;
      try {
        collection = JSON.parse(fs.readFileSync(file, 'utf8'));
      } catch (error) {
        blocking.push({ file: rel, problem: `JSON inválido: ${error.message}` });
        continue;
      }
      stats.collections += 1;
      if (collection.schemaVersion !== '2.0' || collection.padraoPedagogico !== 'teacheasy-v2') {
        blocking.push({ file: rel, problem: 'coleção fora do padrão V2' });
      }
      if (collection.disciplina !== subject) blocking.push({ file: rel, problem: `disciplina divergente: ${collection.disciplina}` });
      if (!Array.isArray(collection.atividades) || collection.atividades.length !== 50) {
        blocking.push({ file: rel, problem: `quantidade de atividades diferente de 50: ${collection.atividades?.length ?? 0}` });
        continue;
      }
      const collectionMojibake = scanStrings(collection);
      stats.mojibakeOccurrences += collectionMojibake.length;
      for (const location of collectionMojibake) blocking.push({ file: rel, problem: `texto possivelmente corrompido em ${location}` });

      const ids = new Set();
      const titles = new Set();
      const prompts = new Set();
      for (const activity of collection.atividades) {
        stats.activities += 1;
        const id = normalize(activity.id);
        if (!id || ids.has(id)) blocking.push({ file: rel, id, problem: 'ID ausente ou duplicado na coleção' });
        ids.add(id);
        const titleKey = normalizedKey(activity.titulo);
        if (!titleKey || titles.has(titleKey)) blocking.push({ file: rel, id, problem: 'título ausente ou duplicado na coleção' });
        titles.add(titleKey);

        const validation = validatePedagogicalActivityV2(activity, collection);
        if (!validation.valid) {
          for (const problem of validation.errors) blocking.push({ file: rel, id, problem });
        }
        if ((activity.questoes || []).length !== 8 || (activity.gabarito || []).length !== 8) {
          blocking.push({ file: rel, id, problem: 'atividade não possui 8 questões e 8 respostas' });
        }
        stats.questions += activity.questoes?.length || 0;
        stats.answers += activity.gabarito?.length || 0;

        for (const question of activity.questoes || []) {
          const key = normalizedKey(question.enunciado);
          if (prompts.has(key)) blocking.push({ file: rel, id, problem: `questão repetida exatamente: ${question.numero}` });
          prompts.add(key);
          if (/\bEF(?:0[1-9]|15|35)[A-Z]{2}\d{2}\b/.test(question.enunciado || '')) {
            blocking.push({ file: rel, id, problem: `código BNCC exposto ao aluno na questão ${question.numero}` });
          }
        }

        const skills = Array.isArray(activity.bncc) ? activity.bncc : [];
        if (!skills.length) blocking.push({ file: rel, id, problem: 'atividade sem habilidade BNCC' });
        for (const skill of skills) {
          const code = normalize(skill.codigo);
          if (!codeMatchesSubject(code, suffix)) blocking.push({ file: rel, id, problem: `código BNCC incompatível com ${subject}: ${code}` });
          if (normalize(skill.habilidadeOficial).length < 20) blocking.push({ file: rel, id, problem: `habilidade oficial insuficiente: ${code}` });
        }

        const humanStatus = normalize(activity.revisao?.status || collection.revisaoPedagogicaHumana).toLowerCase();
        if (humanStatus === 'revisada' || humanStatus === 'concluida' || humanStatus === 'concluída') stats.humanReviewDone += 1;
        else stats.humanReviewPending += 1;

        const visualStatus = normalize(activity.ilustracao?.status).toLowerCase();
        if (/pronta|aprovada|concluida|concluída/.test(visualStatus)) stats.visualReady += 1;
        else stats.visualPending += 1;

        const supportTitle = normalizedKey(activity.textoApoio?.titulo);
        if (supportTitle === titleKey) warnings.push({ file: rel, id, problem: 'título do texto de apoio repete exatamente o título da atividade' });
      }
    }
  }
}

const expected = { collections: 180, activities: 9000, questions: 72000, answers: 72000 };
for (const [key, value] of Object.entries(expected)) {
  if (stats[key] !== value) blocking.push({ file: '(global)', problem: `${key}: esperado ${value}, encontrado ${stats[key]}` });
}

const report = {
  generatedAt: new Date().toISOString(),
  expected,
  stats,
  blockingCount: blocking.length,
  warningCount: warnings.length,
  blocking,
  warnings
};

const output = process.argv.find(arg => arg.startsWith('--output='))?.slice('--output='.length);
if (output) {
  const target = path.resolve(output);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}
console.log(JSON.stringify({ expected, stats, blockingCount: blocking.length, warningCount: warnings.length }, null, 2));
if (blocking.length) {
  console.error(JSON.stringify(blocking.slice(0, 50), null, 2));
  process.exitCode = 1;
}
