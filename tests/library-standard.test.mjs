import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const standard = await readFile(new URL('../biblioteca-final-standard.js', import.meta.url), 'utf8');
const overflowFix = await readFile(new URL('../library-layout-overflow-fix.js', import.meta.url), 'utf8');
const fixes = await readFile(new URL('../biblioteca-fixes.js', import.meta.url), 'utf8');

test('Biblioteca usa somente o padrão final único depois das coleções', () => {
  assert.match(html, /biblioteca-final-standard\.js\?v=20260815-layout-mestre-v2/);
  assert.match(html, /library-layout-overflow-fix\.js\?v=20260817-fit-image-v2/);
  assert.ok(html.indexOf('library-layout-overflow-fix.js') > html.indexOf('biblioteca-final-standard.js'));
  assert.doesNotMatch(html, /biblioteca-standard\.js/);
  assert.doesNotMatch(html, /biblioteca-export-hardfix\.js/);
  assert.ok(html.indexOf('biblioteca-final-standard.js') > html.indexOf('biblioteca-fixes.js'));
});

test('prévia oficial entrega oito questões ao layout final sem corte legado em seis', () => {
  assert.doesNotMatch(html, /library-eight-question-preview\.js/);
  assert.ok(html.indexOf('biblioteca-fixes.js') > html.indexOf('biblioteca.js'));
  assert.ok(html.indexOf('biblioteca-fixes.js') < html.indexOf('biblioteca-final-standard.js'));
  assert.match(fixes, /activity\.questions\.slice\(0, 8\)/);
  assert.match(fixes, /questions\.slice\(0, 4\)/);
  assert.match(fixes, /questions\.slice\(4, 8\)/);
  assert.match(fixes, /start="5"/);
  assert.doesNotMatch(fixes.match(/openCollectionPreview = function openCollectionPreviewEightQuestions[\s\S]*?renderNavigation\(\);/s)?.[0] || '', /slice\(3, 6\)/);
});

test('padrão oficial centraliza medidas, cores e tipografia', () => {
  assert.match(standard, /const ACTIVITY_LAYOUT/);
  assert.match(standard, /format: 'A4'/);
  assert.match(standard, /marginMm: 6\.9/);
  assert.match(standard, /primary: '#1F497D'/);
  assert.match(standard, /family: 'Arial'/);
  assert.match(standard, /title: 15/);
  assert.match(standard, /subtitle: 13/);
  assert.match(standard, /bodyDefault: 12/);
  assert.match(standard, /bodyMin: 8/);
  assert.match(standard, /bodyStep: 0\.5/);
  assert.match(standard, /widthCm: 18\.54/);
  assert.match(standard, /heightCm: 9\.63/);
  assert.match(standard, /textRatio: 0\.4725/);
  assert.match(standard, /imageRatio: 0\.5275/);
});

test('atividade do aluno recebe o cabeçalho completo do modelo aprovado', () => {
  assert.match(standard, /ESCOLA:/);
  assert.match(standard, /Nome:/);
  assert.match(standard, /Turma:/);
  assert.match(standard, /Data:/);
  assert.match(standard, /Prof\.:/);
  assert.match(standard, /te-final-header/);
});

test('título, subtítulo e duas colunas seguem a referência visual', () => {
  assert.match(standard, /ATIVIDADE DE \$\{escapeHtml\(subject\.toUpperCase\(\)\)\}/);
  assert.match(standard, /te-final-title/);
  assert.match(standard, /te-final-subtitle/);
  assert.match(standard, /grid-template-columns:47\.25fr 52\.75fr/);
  assert.match(standard, /width:18\.54cm/);
  assert.match(standard, /height:9\.63cm/);
  assert.match(standard, /#1F497D/i);
});

test('texto principal reduz de 12 até 8 pt em passos de 0,5 dentro da célula', () => {
  assert.match(standard, /function resolveActivityLayout/);
  assert.match(standard, /contentFits/);
  assert.match(standard, /scrollHeight <= textEl\.clientHeight/);
  assert.match(standard, /bodyDefault/);
  assert.match(standard, /bodyMin/);
  assert.match(standard, /bodyStep/);
  assert.match(standard, /\.te-final-text\{[^}]*overflow:hidden/);
  assert.match(overflowFix, /ResizeObserver/);
});

test('correção do preview limita a célula de texto e recalcula o encaixe real', () => {
  assert.match(overflowFix, /\.te-final-text\s*\{[\s\S]*?max-height:\s*100%/);
  assert.match(overflowFix, /overflow:\s*hidden/);
  assert.match(overflowFix, /MAX_FONT_PT = 12/);
  assert.match(overflowFix, /MIN_FONT_PT = 8/);
  assert.match(overflowFix, /STEP_PT = 0\.25/);
  assert.match(overflowFix, /scrollHeight <= textEl\.clientHeight/);
  assert.match(overflowFix, /ResizeObserver/);
  assert.match(overflowFix, /requestAnimationFrame\(\(\) => \{/);
  assert.match(overflowFix, /fitText\(shell\)/);
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

test('Word DOCX usa o mesmo tamanho resolvido e mantém texto e imagem em tabela', () => {
  assert.match(standard, /Baixar Word editável \(\.docx\)/);
  assert.match(standard, /Packer\.toBlob/);
  assert.match(standard, /d\.bodyFontSize\*2/);
  assert.match(standard, /new docx\.Table/);
  assert.match(standard, /size:47\.25,type:docx\.WidthType\.PERCENTAGE/);
  assert.match(standard, /size:52\.75,type:docx\.WidthType\.PERCENTAGE/);
  assert.match(standard, /new docx\.ImageRun/);
  assert.doesNotMatch(standard, /application\/msword/);
});

test('Word e impressão usam A4 no padrão do layout mestre', () => {
  assert.match(standard, /size:\{width:11909,height:16834\}/);
  assert.match(standard, /margin:\{top:34,right:391,bottom:0,left:391,header:142,footer:142\}/);
  assert.match(standard, /width:210mm/);
  assert.match(standard, /min-height:297mm/);
  assert.match(standard, /6\.9mm/);
});

test('ilustração existente preenche o quadro proporcionalmente sem deformação', () => {
  assert.match(standard, /img\.activity-figure, \.collection-student-page img\.question-figure/);
  assert.match(standard, /te-final-visual/);
  assert.match(overflowFix, /\.te-final-visual img/);
  assert.match(overflowFix, /width:\s*100%\s*!important/);
  assert.match(overflowFix, /height:\s*100%\s*!important/);
  assert.match(overflowFix, /object-fit:\s*cover\s*!important/);
  assert.match(overflowFix, /object-position:\s*center center\s*!important/);
});
