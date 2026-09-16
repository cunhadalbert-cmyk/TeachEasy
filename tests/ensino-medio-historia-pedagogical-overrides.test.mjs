import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const files = [
  'ensino-medio-historia-pedagogical-core.js',
  'ensino-medio-historia-pedagogical-01.js',
  'ensino-medio-historia-pedagogical-02.js',
  'ensino-medio-historia-pedagogical-03.js',
  'ensino-medio-historia-pedagogical-04.js',
  'ensino-medio-historia-pedagogical-05.js'
];
const sources = await Promise.all(files.map(file => readFile(new URL(file, root), 'utf8')));
const canonical = JSON.parse(await readFile(new URL('data/atividades/ensino-medio/1-serie/1-bimestre/historia.json', root), 'utf8'));
const fetchSource = await readFile(new URL('ensino-medio-pedagogical-fetch.js', root), 'utf8');

function loadPatcher() {
  const context = {};
  vm.createContext(context);
  for (const source of sources) vm.runInContext(source, context);
  return context.TeachEasyHighSchoolHistoryPedagogicalOverrides;
}

const expectedCycle = ['EM13CHS101','EM13CHS102','EM13CHS103','EM13CHS105','EM13CHS106','EM13CHS201','EM13CHS202','EM13CHS203','EM13CHS204','EM13CHS603'];

test('História revisa exatamente as 50 atividades canônicas da 1ª série 1º bimestre', () => {
  const patcher = loadPatcher();
  const ids = Array.from(patcher.reviewedIds);
  assert.equal(patcher.collection, canonical.colecao);
  assert.equal(ids.length, 50);
  assert.equal(new Set(ids).size, 50);
  const canonicalIds = new Set(canonical.atividades.map(activity => activity.id));
  for (const id of ids) assert.ok(canonicalIds.has(id), `ID de História ausente no JSON canônico: ${id}`);
  assert.equal(ids[0], 'em-1s-b1-historia-01-mapa-conceitual-tempo-e-fontes');
  assert.equal(ids[10], 'em-1s-b1-historia-11-mapa-conceitual-sociedade-e-cultura');
  assert.equal(ids[20], 'em-1s-b1-historia-21-mapa-conceitual-politica-e-cidadania');
  assert.equal(ids[30], 'em-1s-b1-historia-31-mapa-conceitual-trabalho-e-economia');
  assert.equal(ids[40], 'em-1s-b1-historia-41-mapa-conceitual-mundo-contemporaneo');
  assert.equal(ids[49], 'em-1s-b1-historia-50-sintese-autoral-mundo-contemporaneo');
});

test('as 50 atividades de História têm duas fontes, oito questões, gabarito e BNCC preservada', () => {
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
    assert.ok(activity.textoApoio?.conteudo?.length > 300, activity.id);
    assert.match(activity.textoApoio.conteudo, /Fonte A/);
    assert.match(activity.textoApoio.conteudo, /Fonte B/);
    assert.doesNotMatch(activity.textoApoio.conteudo, /A análise histórica parte de fontes, temporalidades/i, activity.id);
    assert.deepEqual(activity.bncc.map(item => item.codigo), originalCodes[index], activity.id);

    activity.questoes.forEach((question, questionIndex) => {
      assert.equal(question.numero, questionIndex + 1, `${activity.id} questão ${questionIndex + 1}`);
      assert.ok(question.enunciado.length >= 25, `${activity.id} questão ${question.numero}`);
      assert.equal(activity.gabarito[questionIndex].numero, questionIndex + 1, activity.id);
      assert.ok(activity.gabarito[questionIndex].resposta.trim().length >= 5, activity.id);
      assert.doesNotMatch(activity.gabarito[questionIndex].resposta, /A resposta deve situar|As duas fontes devem ser pertinentes/i, activity.id);
      if (question.tipo === 'multipla-escolha') assert.equal(question.alternativas.length, 4, activity.id);
      if (question.tipo === 'verdadeiro-falso') assert.deepEqual(Array.from(question.alternativas), ['Verdadeiro','Falso'], activity.id);
    });
  });
});

test('o ciclo BNCC de História permanece idêntico ao JSON canônico nos cinco blocos', () => {
  for (let block = 0; block < 5; block += 1) {
    const canonicalCodes = canonical.atividades.slice(block * 10, block * 10 + 10).map(activity => activity.bncc[0].codigo);
    assert.deepEqual(canonicalCodes, expectedCycle, `ciclo canônico do bloco ${block + 1}`);
  }

  const patcher = loadPatcher();
  const collection = structuredClone(canonical);
  patcher.apply(collection);
  for (let block = 0; block < 5; block += 1) {
    const codes = collection.atividades.slice(block * 10, block * 10 + 10).map(activity => activity.bncc[0].codigo);
    assert.deepEqual(codes, expectedCycle, `ciclo revisado do bloco ${block + 1}`);
  }
});

test('História usa oito formatos de questão e mantém conteúdo coerente com os cinco blocos', () => {
  const patcher = loadPatcher();
  const collection = structuredClone(canonical);
  patcher.apply(collection);
  const types = new Set(collection.atividades.flatMap(activity => activity.questoes.map(question => question.tipo)));
  for (const type of ['multipla-escolha','verdadeiro-falso','completar','associacao','analise','resolucao','interpretacao','producao']) {
    assert.ok(types.has(type), `tipo ausente: ${type}`);
  }
  assert.match(collection.atividades[0].textoApoio.conteudo, /inscrição pública|objetos domésticos/i);
  assert.match(collection.atividades[11].textoApoio.conteudo, /estágios universais|trajetórias históricas/i);
  assert.match(collection.atividades[23].textoApoio.conteudo, /civilização.*barbárie|bárbaro/i);
  assert.match(collection.atividades[36].textoApoio.conteudo, /ferrovia|transporte/i);
  assert.match(collection.atividades[42].textoApoio.conteudo, /descolonização|autodeterminação/i);
  assert.match(collection.atividades[49].textoApoio.conteudo, /direitos.*pós-guerra|dignidade/i);
});

test('adaptador do Ensino Médio carrega História sob demanda sem retirar as disciplinas já revisadas', () => {
  assert.match(fetchSource, /TeachEasyHighSchoolPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolMathPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolSciencePedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolHistoryPedagogicalOverrides/);
  assert.match(fetchSource, /ensureHistoryPatcher/);
  assert.match(fetchSource, /1-serie\/1-bimestre\/historia\.json/);
  assert.match(fetchSource, /ensino-medio-historia-pedagogical-core\.js/);
  assert.match(fetchSource, /ensino-medio-historia-pedagogical-05\.js/);
});
