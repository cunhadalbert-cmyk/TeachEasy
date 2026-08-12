import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const geography = await readFile(new URL('../library-geography-reading.js', import.meta.url), 'utf8');

test('Biblioteca carrega o padrão de leitura de Geografia antes das correções de coleções', () => {
  assert.match(html, /library-geography-reading\.js\?v=20260812-geografia-leitura-v1/);
  assert.ok(html.indexOf('library-geography-reading.js') < html.indexOf('biblioteca-fixes.js'));
});

test('Geografia usa texto explicativo e seis questões fundamentadas no texto', () => {
  assert.match(geography, /explanatoryText/);
  assert.match(geography, /questionsFor/);
  assert.match(geography, /answerKeyFor/);
  assert.match(geography, /Leia o texto explicativo com atenção/);
  assert.match(geography, /Segundo o texto/);
  assert.match(geography, /informações do texto/);
  assert.match(geography, /quantidadeQuestoes: 6/);
});

test('Geografia diferencia a linguagem por etapa escolar', () => {
  assert.match(geography, /iniciais-1-2/);
  assert.match(geography, /iniciais-3-5/);
  assert.match(geography, /finais/);
  assert.match(geography, /medio/);
  assert.match(geography, /território, redes, fluxos/);
  assert.match(geography, /relações de poder/);
});

test('Geografia preserva a habilidade BNCC original da atividade', () => {
  assert.match(geography, /bnccData\(activity\)/);
  assert.match(geography, /item\?\.codigo/);
  assert.match(geography, /item\?\.descricaoResumida/);
  assert.doesNotMatch(geography, /EF\d{2}GE\d{2}/);
  assert.doesNotMatch(geography, /EM13CHS\d{3}/);
});
