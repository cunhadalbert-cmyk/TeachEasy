import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const rule = await readFile(new URL('../bncc-answer-key.js', import.meta.url), 'utf8');
const loader = await readFile(new URL('../jogos-inline.js', import.meta.url), 'utf8');
const aiContent = await readFile(new URL('../ai-content.js', import.meta.url), 'utf8');
const api = await readFile(new URL('../api/generate-activity.js', import.meta.url), 'utf8');

test('BNCC continua sendo solicitada internamente em toda geração', () => {
  assert.match(rule, /generationPayload\.bncc = true/);
  assert.match(rule, /internalBncc\.checked = true/);
  assert.match(api, /bncc \(texto curto ou string vazia\)/);
});

test('professor escolhe se a BNCC aparece somente no gabarito', () => {
  assert.match(rule, /name="bnccInAnswerKey" type="checkbox" checked/);
  assert.match(rule, /Incluir BNCC no gabarito/);
  assert.match(rule, /generated-answer-key-page/);
  assert.match(rule, /photo-answer-key-page/);
  assert.match(rule, /generatedBncc\.remove\(\)/);
});

test('BNCC não permanece no corpo da atividade do aluno', () => {
  assert.match(aiContent, /class="generated-bncc"/);
  assert.match(rule, /root\.querySelector\('\.generated-bncc'\)/);
  assert.match(rule, /generatedBncc\.remove\(\)/);
  assert.match(rule, /data-bncc-answer-key/);
});

test('regra é carregada junto do exportador Word', () => {
  assert.match(loader, /bncc-answer-key\.js\?v=20260810-bncc-gabarito/);
  assert.match(loader, /carregarRegraBnccGabarito/);
});
