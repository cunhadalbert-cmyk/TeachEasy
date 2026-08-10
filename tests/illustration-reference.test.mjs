import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const illustration = await readFile(new URL('../illustration-reference-standard.js', import.meta.url), 'utf8');
const jogos = await readFile(new URL('../jogos-inline.js', import.meta.url), 'utf8');

test('Biblioteca carrega o padrão de ilustração aprovado depois do renderizador final', () => {
  assert.match(html, /illustration-reference-standard\.js\?v=20260810-referencia-aprovada/);
  assert.ok(html.indexOf('illustration-reference-standard.js') > html.indexOf('biblioteca-final-standard.js'));
});

test('fallback deixa de ser ícone abstrato e vira cena pedagógica contextual', () => {
  assert.match(illustration, /sceneSvg\(subject, topic\)/);
  assert.match(illustration, /ESCOLA/);
  assert.match(illustration, /matem\|número/);
  assert.match(illustration, /generated-illustration-image/);
  assert.match(illustration, /Ilustração pedagógica colorida/);
});

test('padrão visual aprovado também é carregado na criação por IA e foto', () => {
  assert.match(jogos, /carregarPadraoIlustracao/);
  assert.match(jogos, /illustration-reference-standard\.js\?v=20260810-referencia-aprovada/);
  assert.match(jogos, /carregarExportadorWord/);
  assert.match(jogos, /carregarRegraBnccGabarito/);
});

test('BNCC não permanece na folha do aluno', () => {
  assert.match(illustration, /moveBnccToAnswerKey/);
  assert.match(illustration, /studentBncc\.remove\(\)/);
  assert.match(illustration, /generated-answer-key-page/);
});
