import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'data', 'atividades', 'ensino-medio');
const grades = [1, 2, 3];
const terms = [1, 2, 3, 4];
const subjects = [['lingua-portuguesa.json', 'Língua Portuguesa'], ['matematica.json', 'Matemática'], ['ciencias.json', 'Ciências'], ['historia.json', 'História'], ['geografia.json', 'Geografia'], ['ingles.json', 'Inglês']];

test('Ensino Médio possui 3.600 atividades em 72 coleções completas', () => {
  const ids = new Set(); let files = 0; let total = 0;
  for (const grade of grades) for (const term of terms) for (const [filename, subject] of subjects) {
    const fullPath = path.join(base, `${grade}-serie`, `${term}-bimestre`, filename);
    assert.equal(fs.existsSync(fullPath), true, `${fullPath} deve existir`);
    const collection = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    assert.equal(collection.etapa, 'Ensino Médio');
    assert.equal(collection.ano, `${grade}ª série`);
    assert.equal(collection.bimestre, term);
    assert.equal(collection.disciplina, subject);
    assert.equal(collection.quantidadeAtividades, 50);
    assert.equal(collection.atividades.length, 50);
    for (const activity of collection.atividades) {
      assert.equal(ids.has(activity.id), false, `ID duplicado: ${activity.id}`); ids.add(activity.id);
      assert.equal(activity.questoes.length, 6); assert.equal(activity.gabarito.length, 6);
      assert.equal(activity.possuiVersaoAdaptada, true); assert.match(activity.bncc[0].codigo, /^EM13/);
    }
    files += 1; total += collection.atividades.length;
  }
  assert.equal(files, 72); assert.equal(total, 3600);
});

test('Biblioteca carrega apenas as seis disciplinas do Ensino Médio', () => {
  const source = fs.readFileSync(path.join(root, 'biblioteca.js'), 'utf8');
  const fixes = fs.readFileSync(path.join(root, 'biblioteca-fixes.js'), 'utf8');
  assert.match(source, /const highSchoolSubjects =/);
  assert.match(source, /data\/atividades\/ensino-medio\/\$\{grade\}-serie/);
  assert.match(source, /navigation\.stage === 'Ensino Médio'[\s\S]*Object\.keys\(highSchoolSubjects\)/);
  assert.match(source, /count: 3600/);
  assert.match(fixes, /const isHighSchool = navigation\.stage === 'Ensino Médio'/);
  assert.match(fixes, /isHighSchool[\s\S]*Object\.keys\(highSchoolSubjects\)/);
});
