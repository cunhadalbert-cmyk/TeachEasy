import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const aiContent = await readFile(new URL('../ai-content.js', import.meta.url), 'utf8');
const api = await readFile(new URL('../api/generate-activity.js', import.meta.url), 'utf8');

test('oferece ilustração colorida ou preto e branco', () => {
  assert.match(aiContent, /name="illustrationStyle"/);
  assert.match(aiContent, /value="color"/);
  assert.match(aiContent, /value="bw"/);
  assert.match(api, /input\.illustrationStyle === 'bw'/);
});

test('preserva a proporção da ilustração no preview e nos documentos', () => {
  assert.match(aiContent, /object-fit:contain!important/);
  assert.match(aiContent, /width:auto!important/);
  assert.match(aiContent, /height:auto!important/);
  assert.match(aiContent, /generated-illustration-image/);
});

test('destaca instrução ao lado de Criar com foto', () => {
  assert.match(aiContent, /ai-photo-guidance/);
  assert.match(aiContent, /Como usar:/);
  assert.match(aiContent, /fotografe ou envie uma atividade de referência/);
});

test('oferece BNCC como opção sem permitir códigos inventados', () => {
  assert.match(aiContent, /name="bncc" type="checkbox"/);
  assert.match(aiContent, /name="bnccMode"/);
  assert.match(api, /Alinhe o material à BNCC/);
  assert.match(api, /nunca invente código/);
  assert.match(api, /bncc: input\.bncc \? safeText/);
});

test('mantém a chave OpenAI somente no servidor', () => {
  assert.doesNotMatch(aiContent, /OPENAI_API_KEY/);
  assert.match(api, /process\.env\.OPENAI_API_KEY/);
});
