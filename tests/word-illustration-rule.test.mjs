import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const geography = fs.readFileSync(path.join(root, 'scripts', 'generate-geography-word.ps1'), 'utf8');
const history = fs.readFileSync(path.join(root, 'scripts', 'generate-history-word.ps1'), 'utf8');
const science = fs.readFileSync(path.join(root, 'scripts', 'generate-science-word.ps1'), 'utf8');

test('Word do 4º ano inclui regra oficial de personagens ativos na solicitação de ilustração', () => {
  assert.match(geography, /function Get-IllustrationText/);
  assert.match(geography, /REGRA TEACHEASY/);
  assert.match(geography, /PARTICIPANTES ATIVOS/);
  assert.match(geography, /preserve integralmente a cena e seus elementos essenciais/i);
  assert.match(geography, /Nao os deixe apenas posados ou colados no cenario/i);
  assert.match(geography, /nunca substitua, esconda ou descaracterize elementos essenciais/i);
  assert.match(geography, /o elenco TeachEasy nao deve representar esses povos ou personagens historicos/i);
  assert.match(geography, /Get-IllustrationText \$activity/);
});

test('História e Ciências herdam a mesma regra do gerador-base de Geografia', () => {
  assert.match(history, /generate-geography-word\.ps1/);
  assert.match(science, /generate-geography-word\.ps1/);
  assert.match(history, /\$source = \$source\.Replace\('\(Clean-Text \$activity\.ilustracao\.descricao\)'/);
});
