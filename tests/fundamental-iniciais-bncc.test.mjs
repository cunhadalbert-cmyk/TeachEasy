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

test('Anos Iniciais possuem 3.000 atividades BNCC conferidas em 100 coleções', () => {
  const ids = new Set();
  let files = 0;
  let total = 0;

  for (const grade of grades) for (const term of terms) {
    for (const [filename, subject] of subjects) {
      const fullPath = path.join(base, `${grade}-ano`, `${term}-bimestre`, filename);
      assert.equal(fs.existsSync(fullPath), true, `${fullPath} deve existir`);
      const collection = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

      assert.equal(collection.etapa, 'Ensino Fundamental — Anos Iniciais');
      assert.equal(collection.ano, `${grade}º ano`);
      assert.equal(collection.bimestre, term);
      assert.equal(collection.disciplina, subject);
      assert.equal(collection.quantidadeAtividades, 30);
      assert.equal(collection.atividades.length, 30);
      assert.equal(collection.bnccConferida, true);
      assert.match(collection.referenciaBncc, /BNCC.*Anos Iniciais.*MEC/);

      for (const activity of collection.atividades) {
        assert.equal(ids.has(activity.id), false, `ID duplicado: ${activity.id}`);
        ids.add(activity.id);
        assert.equal(activity.bnccConferida, true);
        assert.equal(activity.questoes.length, 6);
        assert.equal(activity.gabarito.length, 6);
        assert.equal(activity.possuiGabarito, true);
        assert.equal(activity.possuiVersaoAdaptada, true);

        const skill = activity.bncc[0];
        assert.match(skill.codigo, validCode);
        assert.ok(skill.descricaoResumida.length > 80);
        assert.match(activity.objetivo, new RegExp(skill.codigo));
        assert.ok(activity.textoApoio.conteudo.length > 180);
        assert.equal(activity.questoes.some(item => genericQuestion.test(item.enunciado)), false);
        assert.equal(activity.gabarito.some(item => genericAnswer.test(item.resposta)), false);
      }

      files += 1;
      total += collection.atividades.length;
    }
  }

  assert.equal(files, 100);
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
