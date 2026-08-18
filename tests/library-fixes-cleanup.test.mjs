import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../biblioteca-fixes.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const catalog = await readFile(new URL('../library-catalog.js', import.meta.url), 'utf8');

test('biblioteca-fixes consome o catálogo único sem caminhos extras', () => {
  assert.match(source, /TeachEasyLibraryCatalog\.subjects/);
  assert.doesNotMatch(source, /function loadCollection|ensureSelectedCollection\s*=/);
  assert.doesNotMatch(source, /extraPath|specialExtraPath|collectionRegistry\[/);
  assert.match(catalog, /Array\.from\(\{ length: 9 \}/);
});

test('filtro de disciplina usa seletor CSS válido e HTML carrega a versão enxuta', () => {
  assert.match(source, /querySelector\('option\[value=""\]'\)/);
  assert.doesNotMatch(source, /querySelector\('option\[value="\]'\)/);
  assert.match(html, /biblioteca-fixes\.js\?v=20260807-autismo-v3&cleanup=20260818-v3/);
});

test('configuração usa somente o catálogo canônico', () => {
  assert.match(catalog, /length: 9/);
  assert.match(catalog, /\[1, 2, 3, 4\]/);
  assert.match(source, /SUBJECT_DEFINITIONS = TeachEasyLibraryCatalog\.subjects/);
  assert.doesNotMatch(source, /TERM3_CANONICAL_PATHS/);
  assert.doesNotMatch(source, /subjectsForPeriod/);
  assert.doesNotMatch(source, /const collectionConfigs = \[/);
});
