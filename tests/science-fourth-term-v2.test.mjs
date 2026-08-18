import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const officialBncc = 'https://cdn.mec.gov.br/basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf';

function read(year) {
  const stage = year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
  return JSON.parse(fs.readFileSync(path.join(root, 'data', 'atividades', stage, year + '-ano', '4-bimestre', 'ciencias.json'), 'utf8'));
}

test('Ciências do 4º bimestre possui 50 atividades V2 por ano e 450 no total', () => {
  const ids = new Set();
  const titles = new Set();
  const prompts = new Set();
  let activityCount = 0;
  let questionCount = 0;
  let answerCount = 0;

  for (let year = 1; year <= 9; year++) {
    const collection = read(year);
    assert.equal(collection.quantidadeAtividades, 50);
    assert.equal(collection.atividades.length, 50);
    assert.equal(collection.colecao, year + 'ano-4bimestre-ciencias-v2');
    assert.equal(collection.padraoPedagogico, 'teacheasy-v2');
    assert.equal(collection.referenciaBnccUrl, officialBncc);
    assert.equal(collection.revisaoPedagogicaHumana, 'pendente');
    assert.equal(collection.producaoVisual, 'pendente');
    assert.deepEqual(collection.layout, { formato: 'A4', margensCm: 1, moldura: 'preta', gabarito: 'separado' });

    for (const activity of collection.atividades) {
      activityCount++;
      assert.equal(activity.padraoPedagogico, 'teacheasy-v2');
      assert.equal(activity.questoes.length, 8);
      assert.equal(activity.gabarito.length, 8);
      questionCount += 8;
      answerCount += 8;
      assert.ok(activity.textoApoio.conteudo.trim().length > 80, activity.id + ' precisa de texto de apoio real');
      assert.equal(activity.ilustracao.status, 'producao-visual-pendente');
      assert.ok(activity.ilustracao.descricao.length > 30);
      assert.equal(activity.revisao.pedagogicaHumanaConcluida, false);
      assert.match(activity.bncc[0].codigo, new RegExp('^EF0?' + year + 'CI\\d{2}$'));
      assert.ok(!ids.has(activity.id), 'ID duplicado: ' + activity.id);
      ids.add(activity.id);
      assert.ok(!titles.has(activity.titulo), 'Título duplicado: ' + activity.titulo);
      titles.add(activity.titulo);
      for (const question of activity.questoes) {
        assert.ok(!/EF\d{2}CI\d{2}/.test(question.enunciado));
        assert.ok(!prompts.has(question.enunciado), 'Enunciado duplicado: ' + question.enunciado);
        prompts.add(question.enunciado);
      }
    }
  }

  assert.equal(activityCount, 450);
  assert.equal(questionCount, 3600);
  assert.equal(answerCount, 3600);
  assert.equal(ids.size, 450);
  assert.equal(titles.size, 450);
  assert.equal(prompts.size, 3600);
});

test('catálogo aponta 50 atividades de Ciências no 4º bimestre sem fonte paralela', () => {
  const code = fs.readFileSync(path.join(root, 'library-catalog.js'), 'utf8');
  const context = {};
  vm.createContext(context);
  vm.runInContext(code, context);
  const entries = context.TeachEasyLibraryCatalog.entries.filter(entry => entry.subject === 'Ciências' && entry.term === 4);
  assert.equal(entries.length, 9);
  for (const entry of entries) {
    assert.equal(entry.count, 50);
    assert.ok(entry.path.endsWith('/4-bimestre/ciencias.json'));
  }
});
