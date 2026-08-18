#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const subjects = ['lingua-portuguesa.json', 'matematica.json', 'ciencias.json', 'historia.json', 'geografia.json'];
const targetLayout = {
  formato: 'A4',
  margensCm: 1,
  moldura: 'preta',
  gabarito: 'separado'
};
let collections = 0;
let changed = 0;

function stage(year) {
  return year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
}

for (let year = 1; year <= 9; year += 1) {
  for (let term = 1; term <= 4; term += 1) {
    for (const filename of subjects) {
      const file = path.join(root, 'data', 'atividades', stage(year), `${year}-ano`, `${term}-bimestre`, filename);
      const collection = JSON.parse(fs.readFileSync(file, 'utf8'));
      collections += 1;
      if (collection.schemaVersion !== '2.0' || collection.padraoPedagogico !== 'teacheasy-v2') {
        throw new Error(`Coleção fora do V2: ${file}`);
      }
      const current = collection.layout || {};
      const needsChange = current.formato !== 'A4'
        || Number(current.margensCm) !== 1
        || !/preta/i.test(String(current.moldura || ''))
        || !/separado/i.test(String(current.gabarito || ''));
      if (!needsChange) continue;
      collection.layout = { ...current, ...targetLayout };
      fs.writeFileSync(file, `${JSON.stringify(collection, null, 2)}\n`, 'utf8');
      changed += 1;
    }
  }
}

console.log(JSON.stringify({ collections, changed, layout: targetLayout }, null, 2));
