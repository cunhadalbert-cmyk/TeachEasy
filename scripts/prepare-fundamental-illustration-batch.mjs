#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const subjects = [
  ['lingua-portuguesa.json', 'Língua Portuguesa'],
  ['matematica.json', 'Matemática'],
  ['ciencias.json', 'Ciências'],
  ['historia.json', 'História'],
  ['geografia.json', 'Geografia']
];
const args = Object.fromEntries(process.argv.slice(2).filter(v => v.startsWith('--')).map(v => {
  const [key, ...rest] = v.slice(2).split('=');
  return [key, rest.join('=') || 'true'];
}));
const limit = Math.max(1, Math.min(10, Number(args.limit || 10)));
const offset = Math.max(0, Number(args.offset || 0));
const onlyYear = args.year ? Number(args.year) : 0;
const onlyTerm = args.term ? Number(args.term) : 0;
const onlySubject = args.subject ? String(args.subject).toLowerCase() : '';
const output = args.output ? path.resolve(args.output) : '';
const normalize = value => String(value ?? '').replace(/\s+/g, ' ').trim();

function stage(year) {
  return year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
}

function subjectMatches(filename, name) {
  if (!onlySubject) return true;
  const probes = [filename.replace('.json', ''), name].map(value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
  const wanted = onlySubject.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return probes.some(value => value === wanted || value.includes(wanted));
}

const pending = [];
for (let year = 1; year <= 9; year += 1) {
  if (onlyYear && year !== onlyYear) continue;
  for (let term = 1; term <= 4; term += 1) {
    if (onlyTerm && term !== onlyTerm) continue;
    for (const [filename, subject] of subjects) {
      if (!subjectMatches(filename, subject)) continue;
      const file = path.join(root, 'data', 'atividades', stage(year), `${year}-ano`, `${term}-bimestre`, filename);
      const collection = JSON.parse(fs.readFileSync(file, 'utf8'));
      for (const activity of collection.atividades || []) {
        const status = normalize(activity.ilustracao?.status).toLowerCase();
        if (/pronta|aprovada|concluida|concluída/.test(status)) continue;
        const description = normalize(activity.ilustracao?.descricao);
        const objective = normalize(activity.ilustracao?.objetivoPedagogico);
        const support = normalize(activity.textoApoio?.conteudo);
        pending.push({
          id: activity.id,
          titulo: activity.titulo,
          disciplina: collection.disciplina,
          ano: collection.ano,
          bimestre: collection.bimestre,
          texto: [description, objective, support].filter(Boolean).join(' Contexto pedagógico: '),
          origem: path.relative(root, file).replaceAll('\\', '/')
        });
      }
    }
  }
}

const selected = pending.slice(offset, offset + limit);
const report = {
  totalPendentesNoFiltro: pending.length,
  offset,
  limit,
  retornadas: selected.length,
  proximoOffset: offset + selected.length < pending.length ? offset + selected.length : null,
  items: selected
};

if (output) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(selected.map(({ id, titulo, disciplina, texto }) => ({ id, titulo, disciplina, texto })), null, 2)}\n`, 'utf8');
}
console.log(JSON.stringify(report, null, 2));
