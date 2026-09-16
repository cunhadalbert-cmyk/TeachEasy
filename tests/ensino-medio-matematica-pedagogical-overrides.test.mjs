import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const moduleSource = await readFile(new URL('../ensino-medio-matematica-pedagogical-overrides.js', import.meta.url), 'utf8');
const fetchSource = await readFile(new URL('../ensino-medio-pedagogical-fetch.js', import.meta.url), 'utf8');
const canonical = JSON.parse(await readFile(new URL('../data/atividades/ensino-medio/1-serie/1-bimestre/matematica.json', import.meta.url), 'utf8'));

function loadPatcher() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(moduleSource, context);
  return context.TeachEasyHighSchoolMathPedagogicalOverrides;
}

const expectedCycle = [
  'EM13MAT101', 'EM13MAT102', 'EM13MAT103', 'EM13MAT104', 'EM13MAT105',
  'EM13MAT201', 'EM13MAT202', 'EM13MAT203', 'EM13MAT301', 'EM13MAT302'
];

test('Matemática revisa exatamente as 50 atividades canônicas da 1ª série 1º bimestre', () => {
  const patcher = loadPatcher();
  assert.equal(patcher.collection, canonical.colecao);
  assert.equal(patcher.reviewedIds.length, 50);
  assert.equal(new Set(Array.from(patcher.reviewedIds)).size, 50);

  const canonicalIds = new Set(canonical.atividades.map(activity => activity.id));
  for (const id of patcher.reviewedIds) {
    assert.ok(canonicalIds.has(id), `ID de override ausente no JSON canônico: ${id}`);
  }

  assert.equal(patcher.reviewedIds[0], 'em-1s-b1-matematica-01-mapa-conceitual-numeros-e-algebra');
  assert.equal(patcher.reviewedIds[9], 'em-1s-b1-matematica-10-sintese-autoral-numeros-e-algebra');
  assert.equal(patcher.reviewedIds[10], 'em-1s-b1-matematica-11-mapa-conceitual-funcoes');
  assert.equal(patcher.reviewedIds[20], 'em-1s-b1-matematica-21-mapa-conceitual-geometria');
  assert.equal(patcher.reviewedIds[30], 'em-1s-b1-matematica-31-mapa-conceitual-estatistica');
  assert.equal(patcher.reviewedIds[40], 'em-1s-b1-matematica-41-mapa-conceitual-modelagem');
  assert.equal(patcher.reviewedIds[49], 'em-1s-b1-matematica-50-sintese-autoral-modelagem');
});

test('as 50 atividades têm conteúdo concreto, oito questões, gabarito e BNCC original preservada', () => {
  const patcher = loadPatcher();
  const collection = structuredClone(canonical);
  const originalCodes = collection.atividades.map(activity => activity.bncc.map(item => item.codigo));

  patcher.apply(collection);

  assert.equal(collection.atividades.length, 50);
  assert.equal(new Set(collection.atividades.map(activity => activity.titulo)).size, 50);

  collection.atividades.forEach((activity, index) => {
    assert.equal(activity.questoes.length, 8, activity.id);
    assert.equal(activity.gabarito.length, 8, activity.id);
    assert.equal(activity.quantidadeQuestoes, 8, activity.id);
    assert.equal(activity.possuiGabarito, true, activity.id);
    assert.equal(activity.revisao.status, 'aprovada-pedagogicamente', activity.id);
    assert.equal(activity.revisao.bnccConferida, true, activity.id);
    assert.equal(activity.revisao.conteudoConferido, true, activity.id);
    assert.equal(activity.revisao.questoesConferidas, true, activity.id);
    assert.equal(activity.revisao.gabaritoConferido, true, activity.id);
    assert.equal(activity.ilustracao.status, 'nao-necessaria', activity.id);
    assert.ok(activity.textoApoio?.conteudo?.length > 200, activity.id);
    assert.doesNotMatch(activity.textoApoio.conteudo, /Uma situação-problema reúne dados, relações entre grandezas/i, activity.id);
    assert.deepEqual(activity.bncc.map(item => item.codigo), originalCodes[index], activity.id);

    activity.questoes.forEach((question, questionIndex) => {
      assert.equal(question.numero, questionIndex + 1, `${activity.id} questão ${questionIndex + 1}`);
      assert.ok(question.enunciado.length >= 20, `${activity.id} questão ${question.numero}`);
      assert.equal(activity.gabarito[questionIndex].numero, questionIndex + 1, activity.id);
      assert.ok(activity.gabarito[questionIndex].resposta.trim().length >= 2, activity.id);
      assert.doesNotMatch(activity.gabarito[questionIndex].resposta, /A resposta deve listar corretamente|procedimentos matematicamente válidos que conduzam/i, activity.id);
      if (question.tipo === 'multipla-escolha') assert.equal(question.alternativas.length, 4, activity.id);
      if (question.tipo === 'verdadeiro-falso') assert.deepEqual(Array.from(question.alternativas), ['Verdadeiro', 'Falso'], activity.id);
    });
  });
});

test('ciclo de habilidades matemáticas permanece idêntico ao JSON canônico em todos os cinco blocos', () => {
  const patcher = loadPatcher();
  const collection = structuredClone(canonical);
  patcher.apply(collection);

  for (let block = 0; block < 5; block += 1) {
    const codes = collection.atividades
      .slice(block * 10, block * 10 + 10)
      .map(activity => activity.bncc[0].codigo);
    assert.deepEqual(codes, expectedCycle, `bloco ${block + 1}`);
  }
});

test('questões usam formatos variados e cálculos-chave têm respostas determinadas', () => {
  const patcher = loadPatcher();
  const collection = structuredClone(canonical);
  patcher.apply(collection);

  const types = new Set(collection.atividades.flatMap(activity => activity.questoes.map(question => question.tipo)));
  for (const type of ['multipla-escolha', 'verdadeiro-falso', 'completar', 'resolucao', 'analise', 'associacao', 'interpretacao', 'modelagem']) {
    assert.ok(types.has(type), `tipo ausente: ${type}`);
  }

  assert.match(collection.atividades[0].gabarito[0].resposta, /18 kWh\/h/);
  assert.match(collection.atividades[0].gabarito[3].resposta, /276 kWh/);
  assert.match(collection.atividades[1].gabarito[0].resposta, /60%/);
  assert.match(collection.atividades[2].gabarito[3].resposta, /819,2 s/);
  assert.match(collection.atividades[8].gabarito[1].resposta, /80 inteiras/);
  assert.match(collection.atividades[19].gabarito[5].resposta, /x = -1 e x = 7/);
  assert.match(collection.atividades[39].gabarito[5].resposta, /x = 2 e x = 6/);
  assert.match(collection.atividades[49].gabarito[7].resposta, /7,5x \+ 80/);
});

test('adaptador do Ensino Médio mantém Português e carrega Matemática sob demanda antes de aplicar o patch', () => {
  assert.match(fetchSource, /TeachEasyHighSchoolPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolMathPedagogicalOverrides/);
  assert.match(fetchSource, /ensino-medio-matematica-pedagogical-overrides\.js/);
  assert.match(fetchSource, /await ensureMathPatcher\(url\)/);
  assert.match(fetchSource, /patcher\.apply\(collection\)/);
});
