import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const standard = await readFile(new URL('../biblioteca-standard.js', import.meta.url), 'utf8');

test('Biblioteca carrega a versão atual do padrão mestre depois das coleções', () => {
  assert.match(html, /biblioteca-standard\.js\?v=20260810-padrao-real-v3/);
  assert.match(html, /biblioteca-export-hardfix\.js\?v=20260810-sem-exportador-antigo/);
  assert.ok(html.indexOf('biblioteca-standard.js') > html.indexOf('biblioteca-fixes.js'));
  assert.ok(html.indexOf('biblioteca-export-hardfix.js') > html.indexOf('biblioteca-standard.js'));
});

test('atividade do aluno recebe o cabeçalho completo do modelo aprovado', () => {
  assert.match(standard, /Escola:/);
  assert.match(standard, /Nome:/);
  assert.match(standard, /Turma:/);
  assert.match(standard, /Data:/);
  assert.match(standard, /Prof\.:/);
  assert.match(standard, /te-library-standard-header/);
});

test('título e subtítulo seguem a identidade visual do modelo TeachEasy', () => {
  assert.match(standard, /ATIVIDADE DE \$\{escapeHtml\(subject\.toUpperCase\(\)\)\}/);
  assert.match(standard, /te-activity-title/);
  assert.match(standard, /te-activity-subtitle/);
  assert.match(standard, /#245b9b/i);
});

test('questões usam numeração visual e atividade tenta ocupar uma folha', () => {
  assert.match(standard, /❶/);
  assert.match(standard, /CIRCLED/);
  assert.match(standard, /mergeCollectionStudentPages/);
  assert.match(standard, /destination\.children\.length \+ source\.children\.length <= 8/);
});

test('BNCC é removida inclusive do texto de apoio do aluno', () => {
  assert.match(standard, /sanitizeBnccFromStudent/);
  assert.match(standard, /Foco BNCC:/);
  assert.match(standard, /preview-bncc/);
  assert.match(standard, /name="libraryBncc"/);
  assert.match(standard, /te-library-bncc-answer/);
});

test('Biblioteca intercepta exportador antigo e gera Word DOCX real', () => {
  assert.match(standard, /Baixar Word editável \(\.docx\)/);
  assert.match(standard, /Packer\.toBlob/);
  assert.match(standard, /\.docx`/);
  assert.match(standard, /event\.stopImmediatePropagation\(\)/);
  assert.match(standard, /headerTable/);
});

test('Word e impressão usam A4 com margens pequenas e identidade azul verde', () => {
  assert.match(standard, /size:\{width:11906,height:16838\}/);
  assert.match(standard, /margin:\{top:255,right:340,bottom:340,left:340/);
  assert.match(standard, /DASHED/);
  assert.match(standard, /4D8B63/);
  assert.match(standard, /245B9B/);
});

test('imagens e questões preservam proporção e quebra segura', () => {
  assert.match(standard, /max-width:48%/);
  assert.match(standard, /object-fit:contain/);
  assert.match(standard, /page-break-inside:avoid/);
});
