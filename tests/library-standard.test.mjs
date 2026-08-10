import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const standard = await readFile(new URL('../biblioteca-standard.js', import.meta.url), 'utf8');

test('Biblioteca carrega o padrão mestre depois das coleções', () => {
  assert.match(html, /biblioteca-standard\.js\?v=20260810-padrao-mestre/);
  assert.ok(html.indexOf('biblioteca-standard.js') > html.indexOf('biblioteca-fixes.js'));
});

test('todas as folhas da Biblioteca recebem cabeçalho TeachEasy completo', () => {
  assert.match(standard, /Escola:/);
  assert.match(standard, /Nome:/);
  assert.match(standard, /Turma:/);
  assert.match(standard, /Data:/);
  assert.match(standard, /Prof\.:/);
  assert.match(standard, /worksheet-page/);
});

test('BNCC fica fora da atividade e opcional somente no gabarito', () => {
  assert.match(standard, /preview-bncc\{display:none!important\}/);
  assert.match(standard, /name="libraryBncc"/);
  assert.match(standard, /te-library-bncc-answer/);
  assert.match(standard, /answer-key-page/);
});

test('Biblioteca oferece PDF e Word editável no padrão mestre', () => {
  assert.match(standard, /Baixar PDF \/ Imprimir/);
  assert.match(standard, /Baixar Word editável/);
  assert.match(standard, /atividade-teacheasy\.docx/);
  assert.match(standard, /Packer\.toBlob/);
  assert.match(standard, /size:\{width:11906,height:16838\}/);
});

test('imagens e questões preservam proporção e quebra segura', () => {
  assert.match(standard, /max-width:48%/);
  assert.match(standard, /object-fit:contain/);
  assert.match(standard, /page-break-inside:avoid/);
});
