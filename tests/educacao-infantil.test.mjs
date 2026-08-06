import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const grades = [
  ['educacao-infantil', 'Educação Infantil — Crianças bem pequenas'],
  ['pre-i', 'Pré I'],
  ['pre-ii', 'Pré II']
];
const files = grades.flatMap(([file, collection]) => [1, 2, 3, 4].map(term => [
  term === 1 ? `${file}.json` : `${file}-${term}b.json`,
  term === 1 ? collection : `${collection} — ${term}º bimestre`,
  term
]));

test('Os quatro bimestres de Maternal, Pré I e Pré II possuem dez atividades válidas cada', () => {
  let total = 0;

  const allIds = new Set();
  for (const [file, expectedCollection, term] of files) {
    const fullPath = path.join(root, 'data', 'educacao-infantil', file);
    assert.equal(fs.existsSync(fullPath), true, `${file} deve existir`);

    const collection = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    assert.equal(collection.schemaVersion, 1);
    assert.equal(collection.etapa, 'Educação Infantil');
    assert.equal(collection.colecao, expectedCollection);
    if (term > 1) assert.equal(collection.bimestre, term);
    assert.equal(collection.quantidadeAtividades, 10);
    assert.equal(collection.atividades.length, 10);

    const ids = new Set();
    for (const activity of collection.atividades) {
      assert.ok(activity.id);
      assert.equal(ids.has(activity.id), false, `ID duplicado: ${activity.id}`);
      assert.equal(allIds.has(activity.id), false, `ID repetido entre bimestres: ${activity.id}`);
      ids.add(activity.id);
      allIds.add(activity.id);

      for (const field of [
        'titulo', 'faixaEtaria', 'campoExperiencia', 'objetivoPedagogico',
        'ilustracao', 'materiais', 'passoAPasso', 'adaptacaoAutismo',
        'registroPortfolio', 'imprimivel'
      ]) {
        assert.notEqual(activity[field], undefined, `${activity.id} sem ${field}`);
      }

      assert.ok(Array.isArray(activity.materiais) && activity.materiais.length > 0);
      assert.ok(Array.isArray(activity.passoAPasso) && activity.passoAPasso.length > 0);
    }

    total += collection.atividades.length;
  }

  assert.equal(total, 120);
});

test('A Biblioteca carrega e exibe as coleções de Educação Infantil', () => {
  const source = fs.readFileSync(path.join(root, 'biblioteca.js'), 'utf8');

  assert.match(source, /earlyChildhoodRegistry/);
  assert.match(source, /file: 'educacao-infantil'/);
  assert.match(source, /file: 'pre-i'/);
  assert.match(source, /file: 'pre-ii'/);
  assert.match(source, /data\/educacao-infantil\/\$\{base\.file\}/);
  assert.match(source, /base\.file.*suffix/);
  assert.match(source, /activity\.ilustracao\.simbolo/);
  assert.match(source, /ensureEarlyChildhoodCollection/);
  assert.match(source, /openEarlyChildhoodPreview/);
});

test('Os novos bimestres usam ilustrações variadas e os cinco campos de experiência', () => {
  for (const [file, , term] of files.filter(([, , term]) => term > 1)) {
    const collection = JSON.parse(fs.readFileSync(path.join(root, 'data', 'educacao-infantil', file), 'utf8'));
    const symbols = new Set(collection.atividades.map(activity => activity.ilustracao.simbolo));
    const fields = new Set(collection.atividades.map(activity => activity.campoExperiencia));

    assert.equal(symbols.size, 10, `${file} deve ter uma ilustração diferente por atividade`);
    assert.equal(fields.size, 5, `${file} deve contemplar os cinco campos de experiência`);
    for (const activity of collection.atividades) {
      assert.match(activity.ilustracao.padraoVisual, /traço infantil arredondado/);
      assert.ok(activity.ilustracao.descricao.length > 30);
    }
  }
});

test('O workflow obrigatório da main permanece configurado', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'validate.yml'), 'utf8');

  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /name: HTML, JavaScript and functional tests/);
  assert.match(workflow, /npm run validate/);
});
