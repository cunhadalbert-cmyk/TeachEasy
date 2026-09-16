import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const overrideSource = await readFile(new URL('../ensino-medio-pedagogical-overrides.js', import.meta.url), 'utf8');
const overrideSource0610 = await readFile(new URL('../ensino-medio-pedagogical-overrides-06-10.js', import.meta.url), 'utf8');
const overrideSource1115 = await readFile(new URL('../ensino-medio-pedagogical-overrides-11-15.js', import.meta.url), 'utf8');
const fetchSource = await readFile(new URL('../ensino-medio-pedagogical-fetch.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');

function loadOverrides() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(overrideSource, context);
  vm.runInContext(overrideSource0610, context);
  vm.runInContext(overrideSource1115, context);
  return context.TeachEasyHighSchoolPedagogicalOverrides;
}

test('Ensino Médio revisa quinze atividades de Português com contexto concreto', () => {
  const patcher = loadOverrides();
  assert.equal(patcher.collection, 'em-1serie-1bimestre-lingua-portuguesa-v2');
  assert.equal(patcher.reviewedIds.length, 15);
  assert.ok(patcher.reviewedIds.includes('em-1s-b1-lingua-portuguesa-06-debate-leitura-critica'));
  assert.ok(patcher.reviewedIds.includes('em-1s-b1-lingua-portuguesa-10-sintese-autoral-leitura-critica'));
  assert.ok(patcher.reviewedIds.includes('em-1s-b1-lingua-portuguesa-11-mapa-conceitual-literatura'));
  assert.ok(patcher.reviewedIds.includes('em-1s-b1-lingua-portuguesa-15-leitura-critica-literatura'));

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
    assert.deepEqual(Array.from(activity.bncc).map(item => item.codigo), ['EM13LPXX'], activity.id);
  }
});

test('lote ampliado usa formatos variados com gabarito verificável', () => {
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
  assert.ok(types.has('associacao'));
  assert.ok(types.has('analise'));
  assert.ok(types.has('revisao'));

  for (const activity of collection.atividades) {
    activity.questoes.forEach((question, index) => {
      assert.equal(question.numero, index + 1);
      assert.ok(question.enunciado.length >= 20);
      assert.equal(activity.gabarito[index].numero, index + 1);
      assert.ok(activity.gabarito[index].resposta.trim().length >= 1);
      if (question.tipo === 'multipla-escolha') assert.equal(question.alternativas.length, 4);
      if (question.tipo === 'verdadeiro-falso') assert.deepEqual(Array.from(question.alternativas), ['Verdadeiro', 'Falso']);
    });
  }
});

test('atividades 6 a 10 cobrem habilidades distintas sem texto genérico', () => {
  const patcher = loadOverrides();
  const ids = patcher.reviewedIds.slice(5, 10);
  const collection = {
    colecao: patcher.collection,
    atividades: ids.map(id => ({
      id,
      bncc: [{ codigo: 'PRESERVAR' }],
      revisao: {},
      ilustracao: {}
    }))
  };
  patcher.apply(collection);

  const titles = collection.atividades.map(activity => activity.titulo);
  assert.equal(new Set(titles).size, 5);
  assert.match(collection.atividades[0].textoApoio.conteudo, /quadra voltou a respirar/i);
  assert.match(collection.atividades[1].textoApoio.conteudo, /Certamente|Talvez/);
  assert.match(collection.atividades[2].textoApoio.conteudo, /Feira de Ciências/);
  assert.match(collection.atividades[3].textoApoio.conteudo, /FONTE A/);
  assert.match(collection.atividades[4].textoApoio.conteudo, /Mostra de Ciências/);
});

test('atividades 11 a 15 trabalham literatura com habilidades EM13LP01 a EM13LP05', () => {
  const patcher = loadOverrides();
  const ids = patcher.reviewedIds.slice(10, 15);
  const expectedCodes = ['EM13LP01', 'EM13LP02', 'EM13LP03', 'EM13LP04', 'EM13LP05'];
  const collection = {
    colecao: patcher.collection,
    atividades: ids.map((id, index) => ({
      id,
      bncc: [{ codigo: expectedCodes[index] }],
      revisao: {},
      ilustracao: {}
    }))
  };
  patcher.apply(collection);

  assert.equal(new Set(collection.atividades.map(activity => activity.titulo)).size, 5);
  assert.match(collection.atividades[0].textoApoio.conteudo, /MICROCONTO|O BANCO/);
  assert.match(collection.atividades[1].textoApoio.conteudo, /antiga sala 7/i);
  assert.match(collection.atividades[2].textoApoio.conteudo, /RELATÓRIO DO LOBO/);
  assert.match(collection.atividades[3].textoApoio.conteudo, /JANELA ACESA/);
  assert.match(collection.atividades[4].textoApoio.conteudo, /clássicos|contemporâneas/i);
  assert.deepEqual(collection.atividades.map(activity => activity.bncc[0].codigo), expectedCodes);
});

test('Biblioteca aplica os três lotes antes do adaptador de fetch e de biblioteca.js', () => {
  const overrideIndex = html.indexOf('ensino-medio-pedagogical-overrides.js');
  const override0610Index = html.indexOf('ensino-medio-pedagogical-overrides-06-10.js');
  const override1115Index = html.indexOf('ensino-medio-pedagogical-overrides-11-15.js');
  const fetchIndex = html.indexOf('ensino-medio-pedagogical-fetch.js');
  const libraryIndex = html.indexOf('biblioteca.js');
  assert.ok(overrideIndex >= 0);
  assert.ok(override0610Index > overrideIndex);
  assert.ok(override1115Index > override0610Index);
  assert.ok(fetchIndex > override1115Index);
  assert.ok(libraryIndex > fetchIndex);
  assert.match(fetchSource, /response\.clone\(\)\.json\(\)/);
  assert.match(fetchSource, /patcher\.apply\(collection\)/);
  assert.match(fetchSource, /data\/atividades\/ensino-medio\//);
});
