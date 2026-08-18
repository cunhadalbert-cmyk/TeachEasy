import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'tests', 'library.test.mjs');
const source = fs.readFileSync(file, 'utf8');
const migratedMarkers = [
  "Coleção canônica de Ciências V2 possui 50 atividades",
  "Ciências do 4º ano totaliza 50 atividades e 400 questões em um arquivo V2",
  "Arquivos canônicos de Matemática e Língua Portuguesa V2 totalizam 100 atividades e 800 questões",
  "Matemática possui 50 atividades V2, 400 questões",
  "Língua Portuguesa possui 50 atividades V2, 400 questões"
];

if (migratedMarkers.every(marker => source.includes(marker))) {
  console.log('Contratos de library.test.mjs já estão no padrão V2; nenhuma alteração necessária.');
} else {
  await import('./update-term1-3-v2-test-contracts.mjs');
}
