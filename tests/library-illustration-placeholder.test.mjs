import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = path.resolve(process.cwd());
const contextFile = fs.readFileSync(path.join(root, 'library-illustration-context.js'), 'utf8');

test('Geografia antiga recebe descrição de ilustração quando não há metadado V2', () => {
  assert.match(contextFile, /function fallbackDescription\(activity, collection\)/);
  assert.match(contextFile, /subject === 'Geografia'/);
  assert.match(contextFile, /Cena pedagógica sobre/);
});

test('prévia mostra solicitação na caixa vazia da ilustração', () => {
  assert.match(contextFile, /te-illustration-request-placeholder/);
  assert.match(contextFile, /ILUSTRAÇÃO:/);
  assert.match(contextFile, /applyIllustrationPlaceholder/);
  assert.match(contextFile, /visual\.querySelector\('img'\)/);
});

test('solicitação preserva regra oficial de personagens ativos', () => {
  assert.match(contextFile, /PARTICIPANTES ATIVOS/);
  assert.match(contextFile, /interagindo de forma natural/);
  assert.match(contextFile, /nunca substitua, esconda ou descaracterize elementos essenciais/);
});
