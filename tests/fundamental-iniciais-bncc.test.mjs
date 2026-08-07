import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'data', 'atividades', 'fundamental-anos-iniciais');
const grades = [1, 2, 3, 4, 5];
const terms = [1, 2, 3, 4];
const subjects = [
  ['lingua-portuguesa.json', 'Língua Portuguesa'],
  ['matematica.json', 'Matemática'],
  ['ciencias.json', 'Ciências'],
  ['historia.json', 'História'],
  ['geografia.json', 'Geografia']
];
const validCode = /^EF(?:0[1-5]|15|35)(LP|MA|CI|HI|GE)\d{2}$/;
const genericQuestion = /Explique a ideia central|Identifique duas informações importantes|Compare dois exemplos|Relacione .+ a uma situação atual|Produza uma conclusão justificada/;
const genericAnswer = /Resposta esperada coerente|Resposta autoral coerente|considerando o comando da questão/;
const splitCollections = new Set(['lingua-portuguesa.json', 'matematica.json', 'ciencias.json']);

test('Anos Iniciais possuem 3.000 atividades BNCC conferidas em 100 coleções', () => {
  const ids = new Set();
  let collections = 0;
  let total = 0;

  for (const grade of grades) for (const term of terms) {
    for (const [filename, subject] of subjects) {
      const directory = path.join(base, `${grade}-ano`, `${term}-bimestre`);
      const fullPath = path.join(directory, filename);
      assert.equal(fs.existsSync(fullPath), true, `${fullPath} deve existir`);
      const parts = [JSON.parse(fs.readFileSync(fullPath, 'utf8'))];

      if (grade === 4 && term === 3 && splitCollections.has(filename)) {
        const extraPath = path.join(directory, filename.replace('.json', '-extra.json'));
        assert.equal(fs.existsSync(extraPath), true, `${extraPath} deve existir`);
        parts.push(JSON.parse(fs.readFileSync(extraPath, 'utf8')));
      }

      const activities = parts.flatMap(collection => {
        assert.equal(collection.disciplina, subject);
        assert.equal(collection.bnccConferida, true);
        assert.match(collection.referenciaBncc, /BNCC.*Anos Iniciais.*MEC/);
        return collection.atividades;
      });

      assert.equal(activities.length, 30, `${grade}º ano, ${term}º bimestre, ${subject}`);
      for (const activity of activities) {
        assert.equal(ids.has(activity.id), false, `ID duplicado: ${activity.id}`);
        ids.add(activity.id);
        assert.equal(activity.bnccConferida, true);
        assert.equal(activity.questoes.length, 6);
        assert.equal(activity.gabarito.length, 6);

        const skill = activity.bncc[0];
        assert.match(skill.codigo, validCode);
        assert.ok(skill.descricaoResumida.length > 60);
        assert.match(activity.objetivo, new RegExp(skill.codigo));
        assert.equal(activity.questoes.some(item => genericQuestion.test(item.enunciado)), false);
        assert.equal(activity.gabarito.some(item => genericAnswer.test(item.resposta)), false);
      }

      collections += 1;
      total += activities.length;
    }
  }

  assert.equal(collections, 100);
  assert.equal(total, 3000);
  assert.equal(ids.size, 3000);
});

test('Anos Iniciais exibem somente as cinco disciplinas principais', () => {
  const source = fs.readFileSync(path.join(root, 'biblioteca-fixes.js'), 'utf8');
  assert.match(source, /Língua Portuguesa/);
  assert.match(source, /Matemática/);
  assert.match(source, /Ciências/);
  assert.match(source, /História/);
  assert.match(source, /Geografia/);
  assert.doesNotMatch(source, /initialYearsSubjects[\s\S]{0,500}(Arte|Educação Física|Ensino Religioso|Inglês)/);
});
