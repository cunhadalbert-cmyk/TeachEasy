import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const bibliotecaSource = await readFile(new URL('../biblioteca.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../biblioteca.html', import.meta.url), 'utf8');
const scienceRaw = await readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/4-bimestre/ciencias.json', import.meta.url), 'utf8');
const science = JSON.parse(scienceRaw);

function loadValidator() {
  const start = bibliotecaSource.indexOf('const V2_COLLECTION_COUNTS =');
  const end = bibliotecaSource.indexOf('\nasync function validateCollectionAssets', start);
  assert.ok(start >= 0 && end > start, 'validador consolidado não encontrado em biblioteca.js');

  const source = `${bibliotecaSource.slice(start, end)}\nthis.validateCollection = validateCollection;`;
  const context = {};
  vm.runInNewContext(source, context);
  return context.validateCollection;
}

const scienceConfig = {
  collection: '4ano-4bimestre-ciencias',
  count: 50,
  grade: '4º ano',
  term: 4
};

test('Ciências 4º ano 4º bimestre V2 é aceita com 50 atividades e 8 questões', () => {
  const validateCollection = loadValidator();
  assert.equal(science.schemaVersion, '2.0');
  assert.equal(science.colecao, '4ano-4bimestre-ciencias-v2');
  assert.equal(science.atividades.length, 50);
  assert.ok(science.atividades.every(activity => activity.questoes.length === 8));
  assert.ok(science.atividades.every(activity => activity.gabarito.length === 8));
  assert.doesNotThrow(() => validateCollection(science, scienceConfig));
});

test('validação V2 continua estrita para contagem, padrão e quantidade de questões', () => {
  const validateCollection = loadValidator();

  const wrongCount = structuredClone(science);
  wrongCount.atividades = wrongCount.atividades.slice(0, 49);
  assert.throws(() => validateCollection(wrongCount, scienceConfig), /Estrutura da coleção/);

  const wrongQuestions = structuredClone(science);
  wrongQuestions.atividades[0].questoes = wrongQuestions.atividades[0].questoes.slice(0, 7);
  assert.throws(() => validateCollection(wrongQuestions, scienceConfig), /Atividades, questões ou IDs/);

  const wrongStandard = structuredClone(science);
  wrongStandard.padraoPedagogico = 'outro-padrao';
  assert.throws(() => validateCollection(wrongStandard, scienceConfig), /Estrutura da coleção/);
});

test('schema 1.0 continua exigindo ID exato e seis questões', () => {
  const validateCollection = loadValidator();
  const legacy = {
    schemaVersion: '1.0',
    colecao: 'teste-legado',
    idioma: 'pt-BR',
    disciplina: 'Teste',
    atividades: [{
      id: 'legado-01',
      questoes: Array.from({ length: 6 }, (_, index) => ({ numero: index + 1, figuraId: null })),
      gabarito: Array.from({ length: 6 }, (_, index) => ({ numero: index + 1 })),
      figuras: []
    }]
  };
  const config = { collection: 'teste-legado', count: 1 };
  assert.doesNotThrow(() => validateCollection(legacy, config));

  legacy.atividades[0].questoes.pop();
  assert.throws(() => validateCollection(legacy, config), /Atividades, questões ou IDs/);
});

test('Biblioteca não depende mais de override separado para validar V2', () => {
  assert.match(bibliotecaSource, /const expectedQuestions = isV2 \? 8 : 6;/);
  assert.doesNotMatch(bibliotecaSource, /activity\.questoes\.length !== 6 \|\| activity\.gabarito\.length !== 6/);
  assert.doesNotMatch(html, /library-collection-validation\.js/);
  assert.match(html, /library-catalog\.js\?v=20260818-catalogo-unico-v1/);
  assert.match(html, /biblioteca\.js\?v=20260818-catalogo-unico-v1/);
});
