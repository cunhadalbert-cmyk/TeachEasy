import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'library-catalog.js'), 'utf8');
const context = { globalThis: {} };
vm.runInNewContext(source, context);
const catalog = context.globalThis.TeachEasyLibraryCatalog;

test('catálogo único contém as 180 combinações oficiais do 1º ao 9º ano', () => {
  assert.equal(catalog.entries.length, 180);
  assert.equal(new Set(catalog.entries.map(entry => entry.collection)).size, 180);
  assert.deepEqual(
    Object.keys(catalog.subjects).sort(),
    ['Ciências', 'Geografia', 'História', 'Língua Portuguesa', 'Matemática'].sort()
  );
});

test('cada combinação aponta para um único JSON canônico com BNCC e gabarito', () => {
  for (const entry of catalog.entries) {
    const fullPath = path.join(root, entry.path);
    assert.equal(fs.existsSync(fullPath), true, `arquivo ausente: ${entry.path}`);
    const collection = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    assert.equal(collection.disciplina, entry.subject, entry.path);
    assert.equal(collection.bimestre, entry.term, entry.path);
    assert.equal(collection.atividades.length, entry.count, entry.path);
    for (const activity of collection.atividades) {
      assert.ok(Array.isArray(activity.bncc) && activity.bncc.length > 0, `${activity.id}: BNCC ausente`);
      assert.ok(Array.isArray(activity.questoes) && activity.questoes.length > 0, `${activity.id}: questões ausentes`);
      assert.equal(activity.gabarito.length, activity.questoes.length, `${activity.id}: gabarito incompleto`);
    }
  }
});

test('Biblioteca não oferece Inglês, Arte ou outras disciplinas fora do escopo', () => {
  const html = fs.readFileSync(path.join(root, 'biblioteca.html'), 'utf8');
  const library = fs.readFileSync(path.join(root, 'biblioteca.js'), 'utf8');
  assert.match(html, /library-catalog\.js/);
  assert.match(library, /const finalYearsSubjects = TeachEasyLibraryCatalog\.subjects/);
  assert.doesNotMatch(library.match(/const activitySeeds = \[[\s\S]*?\n\];/)[0], /Inglês|Arte|Educação Física/);
});
