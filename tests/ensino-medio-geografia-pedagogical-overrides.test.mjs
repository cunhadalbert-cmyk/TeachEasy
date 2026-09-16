import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const moduleFiles = [
  'ensino-medio-geografia-pedagogical-core.js',
  'ensino-medio-geografia-pedagogical-01.js',
  'ensino-medio-geografia-pedagogical-02.js',
  'ensino-medio-geografia-pedagogical-03.js',
  'ensino-medio-geografia-pedagogical-04.js',
  'ensino-medio-geografia-pedagogical-05.js'
];
const sources = await Promise.all(moduleFiles.map(file => readFile(new URL(file, root), 'utf8')));
const canonical = JSON.parse(await readFile(new URL('data/atividades/ensino-medio/1-serie/1-bimestre/geografia.json', root), 'utf8'));
const fetchSource = await readFile(new URL('ensino-medio-pedagogical-fetch.js', root), 'utf8');

function loadPatcher() {
  const context = {};
  vm.createContext(context);
  for (const source of sources) vm.runInContext(source, context);
  return context.TeachEasyHighSchoolGeographyPedagogicalOverrides;
}

function patchedCollection() {
  const collection = structuredClone(canonical);
  loadPatcher().apply(collection);
  return collection;
}

test('Geografia revisa exatamente as 50 atividades canônicas da 1ª série 1º bimestre', () => {
  const patcher = loadPatcher();
  assert.equal(patcher.collection, canonical.colecao);
  assert.equal(patcher.reviewedIds.length, 50);
  assert.equal(new Set(Array.from(patcher.reviewedIds)).size, 50);
  const canonicalIds = new Set(canonical.atividades.map(activity => activity.id));
  for (const id of patcher.reviewedIds) assert.ok(canonicalIds.has(id), `ID de Geografia ausente no JSON canônico: ${id}`);
  assert.equal(patcher.reviewedIds[0], 'em-1s-b1-geografia-01-mapa-conceitual-territorio');
  assert.equal(patcher.reviewedIds[10], 'em-1s-b1-geografia-11-mapa-conceitual-populacao');
  assert.equal(patcher.reviewedIds[20], 'em-1s-b1-geografia-21-mapa-conceitual-ambiente');
  assert.equal(patcher.reviewedIds[30], 'em-1s-b1-geografia-31-mapa-conceitual-economia-global');
  assert.equal(patcher.reviewedIds[40], 'em-1s-b1-geografia-41-mapa-conceitual-geopolitica');
  assert.equal(patcher.reviewedIds[49], 'em-1s-b1-geografia-50-sintese-autoral-geopolitica');
});

test('as 50 atividades têm oito questões, gabarito verificável e BNCC preservada', () => {
  const collection = patchedCollection();
  const originalCodes = canonical.atividades.map(activity => activity.bncc.map(item => item.codigo));
  assert.equal(collection.atividades.length, 50);
  assert.equal(new Set(collection.atividades.map(activity => activity.titulo)).size, 50);

  collection.atividades.forEach((activity, index) => {
    assert.equal(activity.questoes.length, 8, activity.id);
    assert.equal(activity.gabarito.length, 8, activity.id);
    assert.equal(activity.quantidadeQuestoes, 8, activity.id);
    assert.equal(activity.possuiGabarito, true, activity.id);
    assert.deepEqual(activity.bncc.map(item => item.codigo), originalCodes[index], activity.id);
    assert.equal(activity.revisao.status, 'aprovada-pedagogicamente', activity.id);
    assert.equal(activity.revisao.bnccConferida, true, activity.id);
    assert.equal(activity.revisao.conteudoConferido, true, activity.id);
    assert.equal(activity.revisao.questoesConferidas, true, activity.id);
    assert.equal(activity.revisao.gabaritoConferido, true, activity.id);
    assert.equal(activity.ilustracao.status, 'nao-necessaria', activity.id);
    assert.ok(activity.textoApoio?.conteudo?.length > 300, activity.id);
    assert.doesNotMatch(activity.textoApoio.conteudo, /A situação geográfica envolve território, paisagem, redes, fluxos/i, activity.id);

    activity.questoes.forEach((question, questionIndex) => {
      assert.equal(question.numero, questionIndex + 1, activity.id);
      assert.ok(question.enunciado.length >= 35, `${activity.id} questão ${question.numero}`);
      assert.equal(activity.gabarito[questionIndex].numero, questionIndex + 1, activity.id);
      assert.ok(activity.gabarito[questionIndex].resposta.trim().length >= 3, activity.id);
      if (question.tipo === 'multipla-escolha') assert.equal(question.alternativas.length, 4, activity.id);
      if (question.tipo === 'verdadeiro-falso') assert.deepEqual(Array.from(question.alternativas), ['Verdadeiro', 'Falso'], activity.id);
    });
  });
});

test('ciclo BNCC de Geografia permanece idêntico ao JSON canônico nos cinco blocos', () => {
  const expectedCycle = ['EM13CHS101','EM13CHS106','EM13CHS201','EM13CHS202','EM13CHS203','EM13CHS204','EM13CHS205','EM13CHS206','EM13CHS301','EM13CHS306'];
  for (let block = 0; block < 5; block += 1) {
    const canonicalCodes = canonical.atividades.slice(block * 10, block * 10 + 10).map(activity => activity.bncc[0].codigo);
    assert.deepEqual(canonicalCodes, expectedCycle, `ciclo canônico do bloco ${block + 1}`);
  }
  const collection = patchedCollection();
  for (let block = 0; block < 5; block += 1) {
    const codes = collection.atividades.slice(block * 10, block * 10 + 10).map(activity => activity.bncc[0].codigo);
    assert.deepEqual(codes, expectedCycle, `bloco revisado ${block + 1}`);
  }
});

test('Geografia usa formatos variados, dados quantitativos e conteúdo espacial concreto', () => {
  const collection = patchedCollection();
  const types = new Set(collection.atividades.flatMap(activity => activity.questoes.map(question => question.tipo)));
  for (const type of ['multipla-escolha','verdadeiro-falso','completar','resolucao','associacao','analise','interpretacao','producao']) assert.ok(types.has(type), `tipo ausente: ${type}`);

  assert.match(collection.atividades[0].textoApoio.conteudo, /cadastro fundiário|uso coletivo/i);
  assert.match(collection.atividades[10].textoApoio.conteudo, /censo|matrículas/i);
  assert.match(collection.atividades[20].textoApoio.conteudo, /satélite|vistorias de campo/i);
  assert.match(collection.atividades[30].textoApoio.conteudo, /exportações|portuários/i);
  assert.match(collection.atividades[40].textoApoio.conteudo, /atlas|disputada/i);
  assert.match(collection.atividades[49].textoApoio.conteudo, /minerais críticos|reciclagem/i);

  assert.match(collection.atividades[0].gabarito[3].resposta, /24 mil hectares/);
  assert.match(collection.atividades[11].gabarito[3].resposta, /11 % da população/);
  assert.match(collection.atividades[22].gabarito[3].resposta, /290 mg\/L de sedimentos/);
  assert.match(collection.atividades[33].gabarito[3].resposta, /47 pedidos\/hora/);
  assert.match(collection.atividades[49].gabarito[3].resposta, /32 % de dependência externa/);
});

test('adaptador carrega Geografia sob demanda sem retirar as disciplinas já revisadas', () => {
  assert.match(fetchSource, /TeachEasyHighSchoolPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolMathPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolSciencePedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolHistoryPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolGeographyPedagogicalOverrides/);
  assert.match(fetchSource, /ensureGeographyPatcher/);
  assert.match(fetchSource, /1-serie\/1-bimestre\/geografia\.json/);
  assert.match(fetchSource, /ensino-medio-geografia-pedagogical-core\.js/);
  assert.match(fetchSource, /ensino-medio-geografia-pedagogical-05\.js/);
});
