#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { validatePedagogicalActivityV2 } from './pedagogical-standard-v2.mjs';

const input = process.argv[2];
if (!input) {
  console.error('Uso: npm run validate:atividade -- caminho/do/arquivo.json');
  process.exit(2);
}

const file = path.resolve(input);
if (!fs.existsSync(file)) {
  console.error(`Arquivo não encontrado: ${file}`);
  process.exit(2);
}

const raw = fs.readFileSync(file, 'utf8');
const errors = [];

if (raw.charCodeAt(0) === 0xFEFF) {
  errors.push('arquivo está em UTF-8 com BOM; salve em UTF-8 sem BOM');
}

let collection;
try {
  collection = JSON.parse(raw.replace(/^\uFEFF/, ''));
} catch (error) {
  console.error(`JSON inválido: ${error.message}`);
  process.exit(1);
}

const normalize = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const normalizedKey = value => normalize(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

if (collection.schemaVersion !== '2.0') errors.push(`schemaVersion deve ser 2.0; encontrado: ${collection.schemaVersion}`);
if (collection.padraoPedagogico !== 'teacheasy-v2') errors.push(`padraoPedagogico deve ser teacheasy-v2; encontrado: ${collection.padraoPedagogico}`);
if (!Array.isArray(collection.atividades)) errors.push('campo atividades ausente ou inválido');

const activities = Array.isArray(collection.atividades) ? collection.atividades : [];
if (activities.length !== 50) errors.push(`coleção deve possuir 50 atividades; encontrado: ${activities.length}`);

const ids = new Set();
const titles = new Set();
const prompts = new Set();
let questions = 0;
let answers = 0;

for (const activity of activities) {
  const id = normalize(activity.id) || '(sem id)';
  if (ids.has(id)) errors.push(`${id}: ID duplicado`);
  ids.add(id);

  const title = normalizedKey(activity.titulo);
  if (!title) errors.push(`${id}: título ausente`);
  else if (titles.has(title)) errors.push(`${id}: título duplicado`);
  titles.add(title);

  const validation = validatePedagogicalActivityV2(activity, collection);
  for (const error of validation.errors) errors.push(error);

  const qs = Array.isArray(activity.questoes) ? activity.questoes : [];
  const gs = Array.isArray(activity.gabarito) ? activity.gabarito : [];
  questions += qs.length;
  answers += gs.length;

  if (qs.length !== 8) errors.push(`${id}: deve possuir exatamente 8 questões`);
  if (gs.length !== 8) errors.push(`${id}: deve possuir exatamente 8 respostas`);

  for (const question of qs) {
    const key = normalizedKey(question.enunciado);
    if (prompts.has(key)) errors.push(`${id}: questão repetida exatamente: ${question.numero}`);
    prompts.add(key);
    if (/\bEF(?:0[1-9]|15|35)[A-Z]{2}\d{2}\b/.test(question.enunciado || '')) {
      errors.push(`${id}: código BNCC exposto ao aluno na questão ${question.numero}`);
    }
  }
}

if (questions !== 400) errors.push(`total de questões deve ser 400; encontrado: ${questions}`);
if (answers !== 400) errors.push(`total de respostas deve ser 400; encontrado: ${answers}`);

if (errors.length) {
  console.error(`VALIDAÇÃO RÁPIDA FALHOU: ${errors.length} problema(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`OK | ${path.relative(process.cwd(), file)} | 50 atividades | 400 questões | 400 gabaritos`);
