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

test('mapeia equivalência temática e BNCC das coleções do Ensino Médio', async () => {
  const summary = {};
  const nonScienceCodeMismatches = [];
  const nonScienceThemeMismatches = [];
  const scienceSkillMap = new Map();
  const scienceThemes = new Set();

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

          if (discipline === 'ciencias') {
            const item = activity.bncc?.[0];
            if (item?.codigo) scienceSkillMap.set(item.codigo, item.habilidadeOficial || '');
            scienceThemes.add(activity.tema || '');
            return;
          }

          if (currentCodes !== baselineCodes[index]) {
            nonScienceCodeMismatches.push({ discipline, series, bimester, position:index+1, baseline:baselineCodes[index], current:currentCodes });
          }
          if (currentTheme !== baselineThemes[index]) {
            nonScienceThemeMismatches.push({ discipline, series, bimester, position:index+1, baseline:baselineThemes[index], current:currentTheme });
          }
        });
      }
    }
    summary[discipline] = { uniqueCodes: uniqueCodes.size, uniqueThemes: uniqueThemes.size };
  }

  console.log('COERENCIA_AUDIT_SUMMARY', JSON.stringify(summary));
  console.log('CIENCIAS_SKILL_MAP', JSON.stringify(Object.fromEntries([...scienceSkillMap.entries()].sort())));
  console.log('CIENCIAS_THEMES', JSON.stringify([...scienceThemes].sort()));
  console.log('NON_SCIENCE_CODE_MISMATCHES', JSON.stringify(nonScienceCodeMismatches));
  console.log('NON_SCIENCE_THEME_MISMATCHES', JSON.stringify(nonScienceThemeMismatches));

  assert.equal(nonScienceCodeMismatches.length, 0, `Há ${nonScienceCodeMismatches.length} divergências BNCC fora de Ciências`);
  assert.equal(nonScienceThemeMismatches.length, 0, `Há ${nonScienceThemeMismatches.length} divergências temáticas fora de Ciências`);
  assert.equal(scienceSkillMap.size, 26, 'Ciências deve mapear exatamente 26 habilidades oficiais distintas');
  assert.equal(scienceThemes.size, 20, 'Ciências deve mapear exatamente 20 combinações temáticas distintas');
});
