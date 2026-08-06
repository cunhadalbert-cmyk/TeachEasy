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
        'registroPortfolio', 'imprimivel'
      ]) {
        assert.notEqual(activity[field], undefined, `${activity.id} sem ${field}`);
      }

      assert.ok(Array.isArray(activity.materiais) && activity.materiais.length > 0);
      assert.ok(Array.isArray(activity.passoAPasso) && activity.passoAPasso.length > 0);
    }

    total += collection.atividades.length;
  }

  assert.equal(total, 30);
});

test('A Biblioteca carrega e exibe as coleções de Educação Infantil', () => {
  const source = fs.readFileSync(path.join(root, 'biblioteca.js'), 'utf8');

  assert.match(source, /earlyChildhoodRegistry/);
  assert.match(source, /data\/educacao-infantil\/educacao-infantil\.json/);
  assert.match(source, /data\/educacao-infantil\/pre-i\.json/);
  assert.match(source, /data\/educacao-infantil\/pre-ii\.json/);
  assert.match(source, /ensureEarlyChildhoodCollection/);
  assert.match(source, /openEarlyChildhoodPreview/);
});
