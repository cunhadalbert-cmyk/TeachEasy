import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const js = await readFile(new URL('../library-accessibility-adapter.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../library-accessibility-adapter.css', import.meta.url), 'utf8');

test('Biblioteca carrega o adaptador e apresenta acessibilidade sem remover a categoria de autismo', () => {
  assert.match(html, /library-accessibility-adapter\.css/);
  assert.match(html, /library-accessibility-adapter\.js/);
  assert.match(html, />Acessibilidade</);
  assert.match(html, /Acessibilidade e adaptação/);
  assert.match(html, /Atividades adaptadas para autismo/);
});

test('cada card pode receber o botão Adaptar atividade', () => {
  assert.match(js, /accessibility-adapt-button/);
  assert.match(js, /button\.textContent = 'Adaptar atividade'/);
  assert.match(js, /openAdapter\(activity\)/);
  assert.match(js, /renderCardWithAccessibility/);
});

test('adaptação é somente de apresentação e não altera dados pedagógicos da atividade', () => {
  assert.match(js, /Conteúdo, numeração, gabarito e BNCC preservados/);
  assert.match(js, /não reduz nem substitui o objetivo pedagógico/);

  for (const field of ['questions', 'answers', 'bncc', 'topic', 'description', 'hasFigures']) {
    assert.doesNotMatch(js, new RegExp(`activity\\.${field}\\s*=`));
  }

  assert.doesNotMatch(js, /openai|anthropic|gemini|\/api\/generate|\/api\/ai/i);
});

test('painel oferece recursos de apresentação organização e resposta', () => {
  for (const option of [
    'visualSupport', 'steps', 'largeText', 'spacious',
    'alternativeResponse', 'reducedStimuli', 'checklist', 'flexibleTime'
  ]) {
    assert.match(js, new RegExp(option));
  }

  assert.match(js, /Formas alternativas de resposta/);
  assert.match(js, /Checklist visual/);
  assert.match(js, /Tempo flexível/);
  assert.match(js, /sessionStorage/);
});

test('estilos preservam imagens pedagógicas e funcionam na impressão', () => {
  assert.match(css, /accessibility-low-stimulus/);
  assert.match(css, /accessibility-visual-support/);
  assert.match(css, /@media print/);
  assert.doesNotMatch(css, /img\s*\{[^}]*display:\s*none/is);
});
