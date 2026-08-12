import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const standard = await readFile(new URL('../biblioteca-final-standard.js', import.meta.url), 'utf8');

test('Biblioteca usa somente o padrão final único depois das coleções', () => {
  assert.match(html, /biblioteca-final-standard\.js\?v=20260811-figura-geral-v5/);
  assert.doesNotMatch(html, /biblioteca-standard\.js/);
  assert.doesNotMatch(html, /biblioteca-export-hardfix\.js/);
  assert.ok(html.indexOf('biblioteca-final-standard.js') > html.indexOf('biblioteca-fixes.js'));
});

test('atividade do aluno recebe o cabeçalho completo do modelo aprovado', () => {
  assert.match(standard, /Escola:/);
  assert.match(standard, /Nome:/);
  assert.match(standard, /Turma:/);
  assert.match(standard, /Data:/);
  assert.match(standard, /Prof\.:/);
  assert.match(standard, /te-final-header/);
});

test('título subtítulo e duas colunas seguem o padrão visual TeachEasy', () => {
  assert.match(standard, /ATIVIDADE DE \$\{escapeHtml\(subject\.toUpperCase\(\)\)\}/);
  assert.match(standard, /te-final-title/);
  assert.match(standard, /te-final-subtitle/);
  assert.match(standard, /te-final-content/);
  assert.match(standard, /grid-template-columns:1fr 1fr/);
  assert.match(standard, /#245b9b/i);
  assert.match(standard, /#2e7d32/i);
});

test('questões são reconstruídas em uma única folha com até oito itens', () => {
  assert.match(standard, /slice\(0, 8\)/);
  assert.match(standard, /te-final-questions/);
  assert.match(standard, /te-final-qnum/);
  assert.match(standard, /te-final-line/);
});

test('BNCC é removida da atividade e permanece opcional somente no gabarito', () => {
  assert.match(standard, /stripBncc/);
  assert.match(standard, /Foco BNCC:/);
  assert.match(standard, /name="teFinalBncc"/);
  assert.match(standard, /te-final-bncc/);
  assert.match(standard, /teFinalAnswer/);
});

test('Biblioteca gera Word DOCX real e não usa application msword', () => {
  assert.match(standard, /Baixar Word editável \(\.docx\)/);
  assert.match(standard, /Packer\.toBlob/);
  assert.match(standard, /\.docx`/);
  assert.doesNotMatch(standard, /application\/msword/);
  assert.doesNotMatch(standard, /\.doc`;/);
});

test('Word e impressão usam A4 com margens pequenas e borda verde', () => {
  assert.match(standard, /size:\{width:11906,height:16838\}/);
  assert.match(standard, /margin:\{top:300,right:420,bottom:420,left:420/);
  assert.match(standard, /DASHED/);
  assert.match(standard, /4CAF50/);
  assert.match(standard, /245B9B/);
});

test('atividade sempre possui ilustração visual, usando a existente ou fallback pedagógico', () => {
  assert.match(standard, /img\.activity-figure, \.collection-student-page img\.question-figure/);
  assert.match(standard, /existingImage \|\| svgDataUrl\(fallbackSvg\(subject\)\)/);
  assert.match(standard, /te-final-visual/);
  assert.match(standard, /object-fit:contain/);
});
