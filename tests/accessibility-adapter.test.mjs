import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const js = await readFile(new URL('../library-accessibility-adapter.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../library-accessibility-adapter.css', import.meta.url), 'utf8');

test('Biblioteca apresenta acessibilidade como adaptação da atividade curricular', () => {
  assert.match(html, /Atividades adaptadas e recursos de acessibilidade/);
  assert.match(html, /O conteúdo curricular permanece o mesmo/);
  assert.match(html, /Acessibilidade e adaptação/);
  assert.doesNotMatch(html, /Atividades adaptadas para autismo/);
});

test('cada card pode abrir o painel Adaptar atividade', () => {
  assert.match(js, /accessibility-adapt-button/);
  assert.match(js, /button\.textContent = 'Adaptar atividade'/);
  assert.match(js, /openAdapter\(activity\)/);
  assert.match(js, /renderCardWithAccessibility/);
});

test('adaptação preserva conteúdo, gabarito e BNCC e não usa serviço de IA', () => {
  assert.match(js, /Conteúdo, numeração, gabarito e BNCC preservados/);
  assert.match(js, /A adaptação muda a forma de acesso à atividade, não reduz o objetivo pedagógico/);
  assert.doesNotMatch(js, /activity\.questions\s*=/);
  assert.doesNotMatch(js, /activity\.answers\s*=/);
  assert.doesNotMatch(js, /activity\.bncc\s*=/);
  assert.doesNotMatch(js, /openai|anthropic|gemini|\/api\/generate|\/api\/ai/i);
});

test('painel oferece recursos de apresentação, organização e resposta', () => {
  for (const option of [
    'visualSupport', 'steps', 'largeText', 'spacious',
    'alternativeResponse', 'reducedStimuli', 'checklist', 'flexibleTime'
  ]) {
    assert.match(js, new RegExp(option));
  }
  assert.match(js, /Formas alternativas de resposta/);
  assert.match(js, /Checklist visual/);
  assert.match(js, /Tempo flexível/);
});

test('estilos de acessibilidade não escondem imagens pedagógicas', () => {
  assert.match(css, /accessibility-low-stimulus/);
  assert.match(css, /accessibility-visual-support/);
  assert.doesNotMatch(css, /img\s*\{[^}]*display:\s*none/is);
});

test('biblioteca carrega o adaptador após os scripts pedagógicos atuais', () => {
  const semanticScript = html.indexOf('ensino-medio-semantic-coherence');
  const accessibilityScript = html.indexOf('library-accessibility-adapter.js');
  assert.ok(accessibilityScript > 0);
  if (semanticScript >= 0) assert.ok(accessibilityScript > semanticScript);
});
