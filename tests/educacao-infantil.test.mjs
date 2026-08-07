import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  ['educacao-infantil.json', 'Educação Infantil — Crianças bem pequenas'],
  ['pre-i.json', 'Pré I'],
  ['pre-ii.json', 'Pré II']
];

test('Educação Infantil, Pré I e Pré II possuem dez atividades válidas cada', () => {
  let total = 0;

  for (const [file, expectedCollection] of files) {
    const fullPath = path.join(root, 'data', 'educacao-infantil', file);
    assert.equal(fs.existsSync(fullPath), true, `${file} deve existir`);

    const collection = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    assert.equal(collection.schemaVersion, 1);
    assert.equal(collection.etapa, 'Educação Infantil');
    assert.equal(collection.colecao, expectedCollection);
    assert.equal(collection.quantidadeAtividades, 10);
    assert.equal(collection.atividades.length, 10);

    const ids = new Set();
    for (const activity of collection.atividades) {
      assert.ok(activity.id);
      assert.equal(ids.has(activity.id), false, `ID duplicado: ${activity.id}`);
      ids.add(activity.id);

      for (const field of [
        'titulo', 'faixaEtaria', 'campoExperiencia', 'objetivoPedagogico',
        'ilustracao', 'materiais', 'passoAPasso', 'adaptacaoAutismo',
        'registroPortfolio', 'imprimivel', 'bncc'
      ]) {
        assert.notEqual(activity[field], undefined, `${activity.id} sem ${field}`);
      }

      assert.ok(Array.isArray(activity.materiais) && activity.materiais.length > 0);
      assert.ok(Array.isArray(activity.passoAPasso) && activity.passoAPasso.length > 0);
      assert.ok(Array.isArray(activity.bncc) && activity.bncc.length > 0);

      const expectedAgePrefix = file === 'educacao-infantil.json' ? 'EI02' : 'EI03';
      for (const skill of activity.bncc) {
        assert.match(skill.codigo, /^EI0[23](EO|CG|TS|EF|ET)\d{2}$/);
        assert.equal(skill.codigo.startsWith(expectedAgePrefix), true,
          `${activity.id} usa código incompatível com a faixa etária: ${skill.codigo}`);
      }
    }

    total += collection.atividades.length;
  }

  assert.equal(total, 30);
});

test('A Biblioteca carrega e exibe as coleções de Educação Infantil', () => {
  const source = fs.readFileSync(path.join(root, 'biblioteca.js'), 'utf8');

  assert.match(source, /earlyChildhoodRegistry/);
  assert.match(source, /file: 'educacao-infantil'/);
  assert.match(source, /file: 'pre-i'/);
  assert.match(source, /file: 'pre-ii'/);
  assert.match(source, /path: \`data\\/educacao-infantil\\/\\\$\\{base\\.file\\}\\\$\\{suffix\\}\\.json\`/);
  assert.match(source, /ensureEarlyChildhoodCollection/);
  assert.match(source, /openEarlyChildhoodPreview/);
});

test('O workflow obrigatório da main permanece configurado', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'validate.yml'), 'utf8');

  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /name: HTML, JavaScript and functional tests/);
  assert.match(workflow, /npm run validate/);
});

test('A Biblioteca preserva e exibe os códigos BNCC da Educação Infantil', () => {
  const source = fs.readFileSync(path.join(root, 'biblioteca.js'), 'utf8');
  assert.match(source, /bncc: activity\.bncc\.map\(item => item\.codigo\)\.join\(', '\)/);
  assert.doesNotMatch(source, /bncc: ''[\s\S]{0,300}earlyChildhoodActivity: true/);
});

test('Educação Infantil possui 300 atividades nos quatro bimestres com BNCC compatível', () => {
  const stems = [
    ['educacao-infantil', 'EI02'],
    ['pre-i', 'EI03'],
    ['pre-ii', 'EI03']
  ];
  const ids = new Set();
  let total = 0;

  for (const [stem, prefix] of stems) for (let term = 1; term <= 4; term += 1) {
    const filename = term === 1 ? `${stem}.json` : `${stem}-${term}b.json`;
    const collection = JSON.parse(fs.readFileSync(
      path.join(root, 'data', 'educacao-infantil', filename), 'utf8'
    ));
    const expected = term === 1 ? 10 : 30;
    assert.equal(collection.quantidadeAtividades, expected);
    assert.equal(collection.atividades.length, expected);

    for (const activity of collection.atividades) {
      const globalId = `${stem}-${term}-${activity.id}`;
      assert.equal(ids.has(globalId), false, `ID duplicado: ${globalId}`);
      ids.add(globalId);
      assert.ok(Array.isArray(activity.bncc) && activity.bncc.length > 0);
      for (const skill of activity.bncc) {
        assert.match(skill.codigo, /^EI0[23](EO|CG|TS|EF|ET)\d{2}$/);
        assert.equal(skill.codigo.startsWith(prefix), true);
      }
    }
    total += collection.atividades.length;
  }

  assert.equal(total, 300);
  assert.equal(ids.size, 300);
});

test('Biblioteca libera os quatro bimestres da Educação Infantil', () => {
  const source = fs.readFileSync(path.join(root, 'biblioteca.js'), 'utf8');
  assert.match(source, /const suffix = navigation\.term === '1' \? '' :/);
  assert.match(source, /expectedCount = navigation\.term === '1' \? 10 : 30/);
  assert.match(source, /term: Number\(navigation\.term\)/);
  assert.match(source, /count: 300/);
  assert.match(source, /bncc: activity\.bncc\.map\(item => item\.codigo\)\.join/);
});
