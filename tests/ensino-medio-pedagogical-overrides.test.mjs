import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const overrideSource = await readFile(new URL('../ensino-medio-pedagogical-overrides.js', import.meta.url), 'utf8');
const fetchSource = await readFile(new URL('../ensino-medio-pedagogical-fetch.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');

function loadOverrides() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(overrideSource, context);
  return context.TeachEasyHighSchoolPedagogicalOverrides;
}

test('primeiro lote do Ensino Médio revisa cinco atividades de Português com contexto concreto', () => {
  const patcher = loadOverrides();
  assert.equal(patcher.collection, 'em-1serie-1bimestre-lingua-portuguesa-v2');
  assert.equal(patcher.reviewedIds.length, 5);

  const collection = {
    colecao: patcher.collection,
    atividades: patcher.reviewedIds.map(id => ({
      id,
      bncc: [{ codigo: 'EM13LPXX' }],
      revisao: { conteudoConferido: false },
      ilustracao: { status: 'producao-visual-pendente' },
      questoes: [],
      gabarito: []
    }))
  };

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
  }
});

test('lote usa formatos variados com gabarito verificável', () => {
  const patcher = loadOverrides();
  const collection = {
    colecao: patcher.collection,
    atividades: patcher.reviewedIds.map(id => ({
      id,
      bncc: [{ codigo: 'EM13LPXX' }],
      revisao: {},
      ilustracao: {}
    }))
  };

  patcher.apply(collection);
  const types = new Set(collection.atividades.flatMap(activity => activity.questoes.map(question => question.tipo)));
  assert.ok(types.has('multipla-escolha'));
  assert.ok(types.has('verdadeiro-falso'));
  assert.ok(types.has('completar'));
  assert.ok(types.has('discursiva'));
  assert.ok(types.has('producao'));

  for (const activity of collection.atividades) {
    activity.questoes.forEach((question, index) => {
      assert.equal(question.numero, index + 1);
      assert.ok(question.enunciado.length >= 20);
      assert.equal(activity.gabarito[index].numero, index + 1);
      assert.ok(activity.gabarito[index].resposta.length >= 3);
      if (question.tipo === 'multipla-escolha') assert.equal(question.alternativas.length, 4);
      if (question.tipo === 'verdadeiro-falso') assert.deepEqual(Array.from(question.alternativas), ['Verdadeiro', 'Falso']);
    });
  }
});

test('Biblioteca aplica o lote antes de carregar biblioteca.js', () => {
  const overrideIndex = html.indexOf('ensino-medio-pedagogical-overrides.js');
  const fetchIndex = html.indexOf('ensino-medio-pedagogical-fetch.js');
  const libraryIndex = html.indexOf('biblioteca.js');
  assert.ok(overrideIndex >= 0);
  assert.ok(fetchIndex > overrideIndex);
  assert.ok(libraryIndex > fetchIndex);
  assert.match(fetchSource, /response\.clone\(\)\.json\(\)/);
  assert.match(fetchSource, /patcher\.apply\(collection\)/);
  assert.match(fetchSource, /data\/atividades\/ensino-medio\//);
});
