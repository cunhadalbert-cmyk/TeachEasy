import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const standard = await readFile(new URL('../api/_lib/activity-standard.js', import.meta.url), 'utf8');
const generator = await readFile(new URL('../api/generate-activity.js', import.meta.url), 'utf8');
const word = await readFile(new URL('../word-export.js', import.meta.url), 'utf8');
const bnccUi = await readFile(new URL('../bncc-answer-key.js', import.meta.url), 'utf8');

test('gerador usa o padrão mestre oficial', () => {
  assert.match(generator, /TEACHEASY_ACTIVITY_STANDARD/);
  assert.match(standard, /Papel A4, retrato/);
  assert.match(standard, /Escola, Nome, Turma, Data e Prof/);
  assert.match(standard, /Word deve permanecer realmente editável/);
  assert.match(standard, /PDF deve preservar a mesma composição visual do Word/);
});

test('padrão exige quantidade exata e ilustração pedagógica proporcional', () => {
  assert.match(standard, /Respeitar exatamente a quantidade de questões solicitada/);
  assert.match(standard, /ilustração deve ser real, pedagógica/);
  assert.match(generator, /Faça exatamente \$\{questions\} questões/);
  assert.match(generator, /margens adequadas para diagramação A4 ao lado do texto/);
});

test('cabeçalho oficial inclui Prof. no Word e nas prévias', () => {
  assert.match(word, /Prof\.: __________________________/);
  assert.match(bnccUi, /Prof\.: __________________________/);
  assert.match(bnccUi, /Prof\.: ____________________/);
});

test('texto introdutório e ilustração são preparados para composição equilibrada', () => {
  assert.match(bnccUi, /data\.teacheasySummary/);
  assert.match(bnccUi, /figure\.style\.float = 'right'/);
  assert.match(bnccUi, /questions\.style\.clear = 'both'/);
});

test('BNCC continua fora da atividade e opcional apenas no gabarito', () => {
  assert.match(standard, /NÃO deve aparecer na atividade\/prova\/questões do aluno/);
  assert.match(standard, /só pode ser exibida no gabarito se o professor escolher/);
  assert.match(generator, /não deve ser incorporada ao texto nem aos enunciados da atividade do aluno/);
});
