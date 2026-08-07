import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'data', 'atividades', 'fundamental-anos-finais');
const grades = [6, 7, 8, 9];
const terms = [1, 2, 3, 4];
const subjects = [
  ['lingua-portuguesa.json', 'Língua Portuguesa'],
  ['matematica.json', 'Matemática'],
  ['ciencias.json', 'Ciências'],
  ['historia.json', 'História'],
  ['geografia.json', 'Geografia'],
  ['ingles.json', 'Inglês']
];

test('Anos Finais possuem 3.840 atividades em 96 coleções completas', () => {
  const globalIds = new Set();
  const byGrade = new Map();
  const bySubject = new Map();
  let files = 0;
  let total = 0;

  for (const grade of grades) {
    for (const term of terms) {
      for (const [filename, subject] of subjects) {
        const fullPath = path.join(base, `${grade}-ano`, `${term}-bimestre`, filename);
        assert.equal(fs.existsSync(fullPath), true, `${fullPath} deve existir`);
        const collection = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

        assert.equal(collection.schemaVersion, '1.0');
        assert.equal(collection.etapa, 'Ensino Fundamental — Anos Finais');
        assert.equal(collection.ano, `${grade}º ano`);
        assert.equal(collection.bimestre, term);
        assert.equal(collection.disciplina, subject);
        assert.equal(collection.quantidadeAtividades, 40);
        assert.equal(collection.atividades.length, 40);

        for (const activity of collection.atividades) {
          assert.equal(globalIds.has(activity.id), false, `ID duplicado: ${activity.id}`);
          globalIds.add(activity.id);
          assert.equal(activity.quantidadeQuestoes, 6);
          assert.equal(activity.questoes.length, 6);
          assert.equal(activity.gabarito.length, 6);
          assert.equal(activity.possuiGabarito, true);
          assert.equal(activity.possuiVersaoAdaptada, true);
          assert.ok(activity.bncc[0].codigo.startsWith(`EF${String(grade).padStart(2, '0')}`));
        }

        files += 1;
        total += collection.atividades.length;
        byGrade.set(grade, (byGrade.get(grade) || 0) + 40);
        bySubject.set(subject, (bySubject.get(subject) || 0) + 40);
      }
    }
  }

  assert.equal(files, 96);
  assert.equal(total, 3840);
  grades.forEach(grade => assert.equal(byGrade.get(grade), 960));
  subjects.forEach(([, subject]) => assert.equal(bySubject.get(subject), 640));
});

test('Biblioteca carrega uma coleção de Anos Finais por seleção', () => {
  const source = fs.readFileSync(path.join(root, 'biblioteca.js'), 'utf8');
  const fixes = fs.readFileSync(path.join(root, 'biblioteca-fixes.js'), 'utf8');
  assert.match(source, /finalYearsSubjects/);
  assert.match(source, /navigation\.stage === 'Ensino Fundamental II'/);
  assert.match(source, /fundamental-anos-finais\/\$\{grade\}-ano/);
  assert.match(source, /function syncSubjectOptions\(\)/);
  assert.match(source, /navigation\.stage === 'Ensino Fundamental II'/);
  assert.match(source, /Object\.keys\(finalYearsSubjects\)/);
  assert.match(source, /select\.replaceChildren\(defaultOption, \.\.\.options\)/);
  assert.match(source, /count: 40/);
  assert.match(source, /count: 3840/);
  assert.match(fixes, /const isFinalYears = navigation\.stage === 'Ensino Fundamental II'/);
  assert.match(fixes, /\['6º ano', '7º ano', '8º ano', '9º ano'\]/);
  assert.match(fixes, /isFinalYears[\s\S]*Object\.keys\(finalYearsSubjects\)/);
});

test('Anos Finais possuem conteúdo aprofundado e BNCC conferida', () => {
  const genericQuestion = /Explique a ideia central|Identifique duas informações importantes|Compare dois exemplos|Relacione .+ a uma situação atual|Produza uma conclusão justificada/;
  const genericAnswer = /Resposta esperada coerente|Resposta autoral coerente|considerando o comando da questão/;
  let total = 0;

  for (const grade of grades) for (const term of terms) {
    for (const [filename, subject] of subjects) {
      const collection = JSON.parse(fs.readFileSync(
        path.join(base, `${grade}-ano`, `${term}-bimestre`, filename), 'utf8'
      ));
      assert.equal(collection.bnccConferida, true);
      assert.match(collection.referenciaBncc, /BNCC.*Anos Finais.*MEC/);

      for (const activity of collection.atividades) {
        const skill = activity.bncc[0];
        assert.equal(activity.bnccConferida, true);
        assert.match(skill.codigo, new RegExp(`^EF${String(grade).padStart(2, '0')}(LP|MA|CI|HI|GE|LI)\\d{2}$`));
        assert.ok(skill.descricaoResumida.length > 90);
        assert.match(activity.objetivo, new RegExp(skill.codigo));
        assert.ok(activity.textoApoio.conteudo.length > 180);
        assert.equal(activity.questoes.some(item => genericQuestion.test(item.enunciado)), false,
          `${activity.id} ainda possui pergunta genérica`);
        assert.equal(activity.gabarito.some(item => genericAnswer.test(item.resposta)), false,
          `${activity.id} ainda possui gabarito genérico`);
      }
      total += collection.atividades.length;
    }
  }

  assert.equal(total, 3840);
});
