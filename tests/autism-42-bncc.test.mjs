import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const autismSource = await readFile(new URL('../autism-activities.js', import.meta.url), 'utf8');
const libraryHtml = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');

test('Categoria Autismo preserva 8 atividades existentes e adiciona exatamente 42 novas', () => {
  const ids = [...autismSource.matchAll(/\['(AUT\d{3})'/g)].map(match => match[1]);
  assert.equal(ids.length, 42);
  assert.equal(new Set(ids).size, 42);
  assert.deepEqual(ids, Array.from({ length: 42 }, (_, index) => `AUT${String(index + 1).padStart(3, '0')}`));
  assert.match(autismSource, /const existingAutismActivities = stages\.flatMap/);
  assert.match(autismSource, /\.slice\(0, 2\)/);
  assert.match(autismSource, /const autismCatalog = \[\.\.\.existingAutismActivities, \.\.\.autismActivities\]/);
  assert.match(autismSource, /50 atividades adaptadas prontas para usar/);
  assert.match(autismSource, /8 atividades já existentes mais 42 novas/);
});

test('As 42 novas atividades de autismo possuem indicação BNCC', () => {
  const rows = autismSource.split('\n').filter(line => line.trim().startsWith("['AUT"));
  assert.equal(rows.length, 42);
  rows.forEach(row => {
    assert.match(row, /'(EI\d{2}[A-Z]{2}\d{2}|EF\d{2}[A-Z]{2}\d{2}|EM13[A-Z]{2,3}\d{2,3})'/);
  });
});

test('Biblioteca carrega o módulo das atividades após biblioteca.js', () => {
  const baseIndex = libraryHtml.indexOf('biblioteca.js?v=');
  const autismIndex = libraryHtml.indexOf('autism-activities.js?v=');
  const fixesIndex = libraryHtml.indexOf('biblioteca-fixes.js?v=');
  assert.ok(baseIndex >= 0);
  assert.ok(autismIndex > baseIndex);
  assert.ok(fixesIndex > autismIndex);
});

test('Categoria Autismo oferece BNCC e paginação de 5 atividades por página', () => {
  assert.match(autismSource, /name="bnccOnly"/);
  assert.match(autismSource, /const autismPageSize = 5/);
  assert.match(autismSource, /id="autism-previous-page"/);
  assert.match(autismSource, /id="autism-next-page"/);
  assert.match(autismSource, /Página \$\{autismPage\} de \$\{pageCount\}/);
  assert.match(autismSource, /autismCatalog\.slice/);
  assert.match(autismSource, /hasAdapted: true/);
  assert.match(autismSource, /hasFigures: true/);
  assert.match(autismSource, /hasAnswerKey: true/);
});
