import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const files = [
  '../ensino-medio-pedagogical-overrides.js',
  '../ensino-medio-pedagogical-overrides-06-10.js',
  '../ensino-medio-pedagogical-overrides-11-15.js',
  '../ensino-medio-pedagogical-overrides-16-20.js',
  '../ensino-medio-pedagogical-overrides-21-25.js',
  '../ensino-medio-pedagogical-overrides-26-30.js',
  '../ensino-medio-pedagogical-overrides-31-50.js'
];
const sources = await Promise.all(files.map(file => readFile(new URL(file, import.meta.url), 'utf8')));
const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const canonical = JSON.parse(await readFile(new URL('../data/atividades/ensino-medio/1-serie/1-bimestre/lingua-portuguesa.json', import.meta.url), 'utf8'));

function loadOverrides() {
  const context = {};
  vm.createContext(context);
  for (const source of sources) vm.runInContext(source, context);
  return context.TeachEasyHighSchoolPedagogicalOverrides;
}

test('fechamento pedagógico cobre exatamente as 50 atividades canônicas de Português', () => {
  const patcher = loadOverrides();
  assert.equal(patcher.collection, canonical.colecao);
  assert.equal(patcher.reviewedIds.length, 50);
  assert.equal(new Set(patcher.reviewedIds).size, 50);

  const canonicalIds = new Set(canonical.atividades.map(activity => activity.id));
  for (const id of patcher.reviewedIds) assert.ok(canonicalIds.has(id), `ID revisado inexistente no JSON canônico: ${id}`);
  for (const activity of canonical.atividades) assert.ok(patcher.reviewedIds.includes(activity.id), `Atividade canônica sem revisão: ${activity.id}`);
});

test('as 50 atividades preservam BNCC e entregam oito questões e gabaritos coerentes', () => {
  const patcher = loadOverrides();
  const originalCodes = new Map(canonical.atividades.map(activity => [activity.id, activity.bncc.map(item => item.codigo)]));
  const collection = structuredClone(canonical);
  patcher.apply(collection);

  for (const activity of collection.atividades) {
    assert.equal(activity.questoes.length, 8, activity.id);
    assert.equal(activity.gabarito.length, 8, activity.id);
    assert.equal(activity.revisao.status, 'aprovada-pedagogicamente', activity.id);
    assert.equal(activity.revisao.conteudoConferido, true, activity.id);
    assert.equal(activity.revisao.questoesConferidas, true, activity.id);
    assert.equal(activity.revisao.gabaritoConferido, true, activity.id);
    assert.equal(activity.ilustracao.status, 'nao-necessaria', activity.id);
    assert.ok(activity.textoApoio?.conteudo?.length > 150, activity.id);
    assert.doesNotMatch(activity.textoApoio.conteudo, /Em uma situação de comunicação da escola e da comunidade/i, activity.id);
    assert.deepEqual(activity.bncc.map(item => item.codigo), originalCodes.get(activity.id), activity.id);

    const types = new Set(activity.questoes.map(question => question.tipo));
    assert.ok(types.has('multipla-escolha'), `${activity.id} sem múltipla escolha`);
    assert.ok(types.has('producao') || types.has('revisao'), `${activity.id} sem produção/revisão`);
    activity.questoes.forEach((question, index) => {
      assert.equal(question.numero, index + 1, activity.id);
      assert.ok(question.enunciado.length >= 20, `${activity.id} questão ${question.numero}`);
      assert.equal(activity.gabarito[index].numero, index + 1, activity.id);
      assert.ok(activity.gabarito[index].resposta.trim().length > 0, activity.id);
      if (question.tipo === 'multipla-escolha') assert.equal(question.alternativas.length, 4, `${activity.id} questão ${question.numero}`);
      if (question.tipo === 'verdadeiro-falso') assert.deepEqual(Array.from(question.alternativas), ['Verdadeiro', 'Falso'], `${activity.id} questão ${question.numero}`);
    });
  }
});

test('atividades 31 a 50 seguem a sequência BNCC original e possuem contextos concretos distintos', () => {
  const patcher = loadOverrides();
  const collection = structuredClone(canonical);
  patcher.apply(collection);
  const lastTwenty = collection.atividades.slice(30, 50);
  const cycle = ['EM13LP01','EM13LP02','EM13LP03','EM13LP04','EM13LP05','EM13LP06','EM13LP07','EM13LP08','EM13LP12','EM13LP15'];

  lastTwenty.forEach((activity, index) => assert.equal(activity.bncc[0].codigo, cycle[index % 10], activity.id));
  assert.equal(new Set(lastTwenty.map(activity => activity.titulo)).size, 20);
  assert.match(lastTwenty[0].textoApoio.conteudo, /AVISO NO MURAL|GRUPO DOS REPRESENTANTES/);
  assert.match(lastTwenty[4].textoApoio.conteudo, /POSIÇÃO A|POSIÇÃO B/);
  assert.match(lastTwenty[9].textoApoio.conteudo, /LISTA DE REVISÃO|VERSÃO REVISADA/);
  assert.match(lastTwenty[10].textoApoio.conteudo, /CONSELHO ESCOLAR|POSTAGEM DO GRÊMIO/);
  assert.match(lastTwenty[14].textoApoio.conteudo, /CONTRA-ARGUMENTO|RESPOSTA/);
  assert.match(lastTwenty[19].textoApoio.conteudo, /PROPOSTA FINAL|DOSSIÊ|LISTA DE REVISÃO/);
});

test('Biblioteca carrega a revisão 31 a 50 depois do lote 26 a 30 e antes do adaptador de fetch', () => {
  const oldIndex = html.indexOf('ensino-medio-pedagogical-overrides-26-30.js');
  const finalIndex = html.indexOf('ensino-medio-pedagogical-overrides-31-50.js');
  const fetchIndex = html.indexOf('ensino-medio-pedagogical-fetch.js');
  assert.ok(oldIndex >= 0);
  assert.ok(finalIndex > oldIndex);
  assert.ok(fetchIndex > finalIndex);
});
