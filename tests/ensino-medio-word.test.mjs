import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const script = await readFile(new URL('../scripts/generate-ensino-medio-word.ps1', import.meta.url), 'utf8');

test('exportador Word do Ensino Médio cobre 3 séries, 4 bimestres e 5 disciplinas', () => {
  assert.match(script, /@\(1,2,3\)/);
  assert.match(script, /@\(1,2,3,4\)/);
  for (const subject of ['lingua-portuguesa', 'matematica', 'ciencias', 'historia', 'geografia']) {
    assert.match(script, new RegExp(`'${subject}'`));
  }
  assert.match(script, /atividades\.Count -ne 50/);
});

test('exportador Word do Ensino Médio mantém estrutura pedagógica V2', () => {
  assert.match(script, /schemaVersion -ne '2\.0'/);
  assert.match(script, /questoes\.Count -ne 8/);
  assert.match(script, /gabarito\.Count -ne 8/);
  assert.match(script, /InsertBreak\(7\)/);
  assert.match(script, /'GABARITO'/);
  assert.match(script, /CentimetersToPoints\(1\)/);
});

test('exportador Word do Ensino Médio usa imagem aprovada do manifesto em modo cover', () => {
  assert.match(script, /word-illustration-fit\.ps1/);
  assert.match(script, /Get-TeachEasyIllustrationFromManifest/);
  assert.match(script, /Add-TeachEasyIllustrationToCell/);
  assert.match(script, /WidthCm 8\.6/);
  assert.match(script, /HeightCm 5\.2/);
});
