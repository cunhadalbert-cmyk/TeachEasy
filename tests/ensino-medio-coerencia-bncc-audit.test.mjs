import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const disciplines = ['lingua-portuguesa','matematica','ciencias','historia','geografia'];

async function load(series, bimester, discipline) {
  return JSON.parse(await readFile(new URL(`data/atividades/ensino-medio/${series}-serie/${bimester}-bimestre/${discipline}.json`, root), 'utf8'));
}

function codes(activity) {
  return (activity.bncc || []).map(item => item.codigo).join('|');
}

function norm(text) {
  return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
}

test('mapeia equivalência temática e BNCC entre as 60 coleções canônicas do Ensino Médio', async () => {
  const summary = {};
  const codeMismatches = [];
  const themeMismatches = [];

  for (const discipline of disciplines) {
    const baseline = await load(1, 1, discipline);
    const baselineCodes = baseline.atividades.map(codes);
    const baselineThemes = baseline.atividades.map(activity => norm(activity.tema));
    const uniqueCodes = new Set();
    const uniqueThemes = new Set();

    for (let series = 1; series <= 3; series += 1) {
      for (let bimester = 1; bimester <= 4; bimester += 1) {
        const collection = await load(series, bimester, discipline);
        assert.equal(collection.atividades.length, 50, `${series}s ${bimester}b ${discipline}`);
        collection.atividades.forEach((activity, index) => {
          const currentCodes = codes(activity);
          const currentTheme = norm(activity.tema);
          uniqueCodes.add(currentCodes);
          uniqueThemes.add(currentTheme);
          if (currentCodes !== baselineCodes[index]) {
            codeMismatches.push({ discipline, series, bimester, position:index+1, baseline:baselineCodes[index], current:currentCodes });
          }
          if (currentTheme !== baselineThemes[index]) {
            themeMismatches.push({ discipline, series, bimester, position:index+1, baseline:baselineThemes[index], current:currentTheme });
          }
        });
      }
    }
    summary[discipline] = { uniqueCodes: uniqueCodes.size, uniqueThemes: uniqueThemes.size };
  }

  console.log('COERENCIA_AUDIT_SUMMARY', JSON.stringify(summary));
  console.log('COERENCIA_AUDIT_CODE_MISMATCHES', JSON.stringify(codeMismatches.slice(0, 80)));
  console.log('COERENCIA_AUDIT_THEME_MISMATCHES', JSON.stringify(themeMismatches.slice(0, 80)));

  assert.equal(codeMismatches.length, 0, `Há ${codeMismatches.length} divergências de sequência BNCC em relação às coleções-base`);
  assert.equal(themeMismatches.length, 0, `Há ${themeMismatches.length} divergências temáticas em relação às coleções-base`);
});
