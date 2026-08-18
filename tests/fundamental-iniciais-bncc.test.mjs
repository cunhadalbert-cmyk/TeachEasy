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
test('Anos Iniciais mantêm 100 coleções em arquivos canônicos únicos', () => {
  const ids = new Set();
  let collections = 0;
  let total = 0;
  let migratedV2 = 0;

  for (const grade of grades) for (const term of terms) {
    for (const [filename, subject] of subjects) {
      const directory = path.join(base, `${grade}-ano`, `${term}-bimestre`);
      const fullPath = path.join(directory, filename);
      assert.equal(fs.existsSync(fullPath), true, `${fullPath} deve existir`);
      const parts = [JSON.parse(fs.readFileSync(fullPath, 'utf8'))];

      const collectionIsV2 = parts.length === 1 && parts[0].padraoPedagogico === 'teacheasy-v2';
      const activities = parts.flatMap(collection => {
        assert.equal(collection.disciplina, subject);
        assert.equal(collection.bnccConferida, true);
        assert.match(collection.referenciaBncc, /BNCC.*Anos Iniciais.*MEC/);
        return collection.atividades;
      });

      const expectedActivities = collectionIsV2
        ? (term === 4 && subject === 'Língua Portuguesa' ? 50 : 20)
        : 30;
      const expectedQuestions = collectionIsV2 ? 8 : 6;
      assert.equal(activities.length, expectedActivities, `${grade}º ano, ${term}º bimestre, ${subject}`);
      if (collectionIsV2) migratedV2 += 1;

      for (const activity of activities) {
        assert.equal(ids.has(activity.id), false, `ID duplicado: ${activity.id}`);
        ids.add(activity.id);
        assert.equal(activity.bnccConferida, true);
        assert.equal(activity.questoes.length, expectedQuestions);
        assert.equal(activity.gabarito.length, expectedQuestions);

        const skill = activity.bncc[0];
        assert.match(skill.codigo, validCode);
        assert.ok((skill.descricaoResumida || skill.habilidadeOficial).length > (collectionIsV2 ? 39 : 60));
        if (!collectionIsV2) assert.match(activity.objetivo, new RegExp(skill.codigo));
        assert.equal(activity.questoes.some(item => genericQuestion.test(item.enunciado)), false, `${activity.id} ainda possui pergunta genérica`);
        assert.equal(activity.gabarito.some(item => genericAnswer.test(item.resposta)), false, `${activity.id} ainda possui gabarito genérico`);
      }

      collections += 1;
      total += activities.length;
    }
  }

  assert.equal(collections, 100);
  assert.equal(total, 3080);
  assert.equal(total, ids.size);
  assert.ok(migratedV2 >= 1, 'Ao menos uma coleção dos Anos Iniciais deve estar migrada para o padrão V2');
});

test('Anos Iniciais exibem somente as cinco disciplinas principais', () => {
  const source = fs.readFileSync(path.join(root, 'library-catalog.js'), 'utf8');
  assert.match(source, /Língua Portuguesa/);
  assert.match(source, /Matemática/);
  assert.match(source, /Ciências/);
  assert.match(source, /História/);
  assert.match(source, /Geografia/);
  assert.doesNotMatch(source, /initialYearsSubjects[\s\S]{0,500}(Arte|Educação Física|Ensino Religioso|Inglês)/);
});
