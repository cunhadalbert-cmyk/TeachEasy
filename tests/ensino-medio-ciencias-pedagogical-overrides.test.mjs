import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const sources = await Promise.all([
  'ensino-medio-ciencias-pedagogical-core-base.js',
  'ensino-medio-ciencias-pedagogical-builders-01.js',
  'ensino-medio-ciencias-pedagogical-builders-02.js',
  'ensino-medio-ciencias-pedagogical-builders-03.js',
  'ensino-medio-ciencias-pedagogical-builders-04.js',
  'ensino-medio-ciencias-pedagogical-01.js',
  'ensino-medio-ciencias-pedagogical-02.js',
  'ensino-medio-ciencias-pedagogical-03.js',
  'ensino-medio-ciencias-pedagogical-04.js',
  'ensino-medio-ciencias-pedagogical-05.js'
].map(file => readFile(new URL(file, root), 'utf8')));
const canonical = JSON.parse(await readFile(new URL('data/atividades/ensino-medio/1-serie/1-bimestre/ciencias.json', root), 'utf8'));
const fetchSource = await readFile(new URL('ensino-medio-pedagogical-fetch.js', root), 'utf8');

function loadPatcher() {
  const context = {};
  vm.createContext(context);
  for (const source of sources) vm.runInContext(source, context);
  return context.TeachEasyHighSchoolSciencePedagogicalOverrides;
}

test('Ciências revisa exatamente as 50 atividades canônicas da 1ª série 1º bimestre', () => {
  const patcher = loadPatcher();
  assert.equal(patcher.collection, canonical.colecao);
  assert.equal(patcher.reviewedIds.length, 50);
  assert.equal(new Set(Array.from(patcher.reviewedIds)).size, 50);

  const canonicalIds = new Set(canonical.atividades.map(activity => activity.id));
  for (const id of patcher.reviewedIds) {
    assert.ok(canonicalIds.has(id), `ID científico ausente no JSON canônico: ${id}`);
  }

  assert.equal(patcher.reviewedIds[0], 'em-1s-b1-ciencias-01-mapa-conceitual-materia-e-energia');
  assert.equal(patcher.reviewedIds[9], 'em-1s-b1-ciencias-10-sintese-autoral-materia-e-energia');
  assert.equal(patcher.reviewedIds[10], 'em-1s-b1-ciencias-11-mapa-conceitual-vida-e-evolucao');
  assert.equal(patcher.reviewedIds[20], 'em-1s-b1-ciencias-21-mapa-conceitual-terra-e-universo');
  assert.equal(patcher.reviewedIds[30], 'em-1s-b1-ciencias-31-mapa-conceitual-tecnologia');
  assert.equal(patcher.reviewedIds[40], 'em-1s-b1-ciencias-41-mapa-conceitual-investigacao-cientifica');
  assert.equal(patcher.reviewedIds[49], 'em-1s-b1-ciencias-50-sintese-autoral-investigacao-cientifica');
});

test('as 50 atividades de Ciências têm contexto concreto, oito questões, gabarito e BNCC preservada', () => {
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
    assert.doesNotMatch(activity.textoApoio.conteudo, /O estudo articula conservação, transformações/i, activity.id);
    assert.deepEqual(activity.bncc.map(item => item.codigo), originalCodes[index], activity.id);

    activity.questoes.forEach((question, questionIndex) => {
      assert.equal(question.numero, questionIndex + 1, `${activity.id} questão ${questionIndex + 1}`);
      assert.ok(question.enunciado.length >= 20, `${activity.id} questão ${question.numero}`);
      assert.equal(activity.gabarito[questionIndex].numero, questionIndex + 1, activity.id);
      assert.ok(activity.gabarito[questionIndex].resposta.trim().length >= 2, activity.id);
      assert.doesNotMatch(activity.gabarito[questionIndex].resposta, /A resposta deve caracterizar corretamente|Espera-se identificação coerente de variável/i, activity.id);
      if (question.tipo === 'multipla-escolha') assert.equal(question.alternativas.length, 4, activity.id);
      if (question.tipo === 'verdadeiro-falso') assert.deepEqual(Array.from(question.alternativas), ['Verdadeiro', 'Falso'], activity.id);
    });
  });
});

test('ciclo BNCC de Ciências permanece idêntico ao JSON canônico nos cinco blocos', () => {
  const expectedCycle = ['EM13CNT103','EM13CNT104','EM13CNT105','EM13CNT106','EM13CNT107','EM13CNT101','EM13CNT102','EM13CNT103','EM13CNT104','EM13CNT105'];
  const canonicalCycle = canonical.atividades.slice(0, 10).map(activity => activity.bncc[0].codigo);
  assert.deepEqual(canonicalCycle, expectedCycle);

  const patcher = loadPatcher();
  const collection = structuredClone(canonical);
  patcher.apply(collection);
  for (let block = 0; block < 5; block += 1) {
    const codes = collection.atividades.slice(block * 10, block * 10 + 10).map(activity => activity.bncc[0].codigo);
    assert.deepEqual(codes, expectedCycle, `bloco científico ${block + 1}`);
  }
});

test('Ciências usa formatos variados e resultados quantitativos verificáveis', () => {
  const patcher = loadPatcher();
  const collection = structuredClone(canonical);
  patcher.apply(collection);

  const types = new Set(collection.atividades.flatMap(activity => activity.questoes.map(question => question.tipo)));
  for (const type of ['multipla-escolha','verdadeiro-falso','completar','resolucao','analise','associacao','interpretacao','producao']) {
    assert.ok(types.has(type), `tipo ausente: ${type}`);
  }

  assert.match(collection.atividades[0].gabarito[0].resposta, /4,8 unidades de exposição/);
  assert.match(collection.atividades[3].gabarito[1].resposta, /129,6 kWh\/dia/);
  assert.match(collection.atividades[3].gabarito[2].resposta, /50,4 kWh\/dia/);
  assert.match(collection.atividades[4].gabarito[0].resposta, /63,5 W/);
  assert.match(collection.atividades[5].gabarito[2].resposta, /75%/);
  assert.match(collection.atividades[6].gabarito[2].resposta, /0,4 °C\/min/);
  assert.match(collection.atividades[49].gabarito[1].resposta, /7 unidades por período/);
  assert.match(collection.atividades[49].gabarito[5].resposta, /3 unidades por período/);
});

test('adaptador do Ensino Médio carrega Ciências sob demanda sem retirar Português e Matemática', () => {
  assert.match(fetchSource, /TeachEasyHighSchoolPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolMathPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolSciencePedagogicalOverrides/);
  assert.match(fetchSource, /ensureSciencePatcher/);
  assert.match(fetchSource, /1-serie\/1-bimestre\/ciencias\.json/);
  assert.match(fetchSource, /ensino-medio-ciencias-pedagogical-core-base\.js/);
  assert.match(fetchSource, /ensino-medio-ciencias-pedagogical-05\.js/);
});
