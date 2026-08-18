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
  ['geografia.json', 'Geografia']
];

test('Anos Finais possuem 4.000 atividades nas 80 coleções oficiais', () => {
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

        const isV2 = collection.schemaVersion === '2.0';
        assert.ok(['1.0', '2.0'].includes(collection.schemaVersion));
        assert.equal(collection.etapa, 'Ensino Fundamental — Anos Finais');
        assert.equal(collection.ano, `${grade}º ano`);
        assert.equal(collection.bimestre, term);
        assert.equal(collection.disciplina, subject);
        const expectedActivities = 50;
        const expectedQuestions = isV2 ? 8 : 6;
        assert.equal(collection.quantidadeAtividades, expectedActivities);
        assert.equal(collection.atividades.length, expectedActivities);

        for (const activity of collection.atividades) {
          assert.equal(globalIds.has(activity.id), false, `ID duplicado: ${activity.id}`);
          globalIds.add(activity.id);
          assert.equal(activity.quantidadeQuestoes, expectedQuestions);
          assert.equal(activity.questoes.length, expectedQuestions);
          assert.equal(activity.gabarito.length, expectedQuestions);
          assert.equal(activity.possuiGabarito, true);
          if (isV2) assert.equal(typeof activity.possuiVersaoAdaptada, 'boolean');
          else assert.equal(activity.possuiVersaoAdaptada, true);
          assert.ok(activity.bncc[0].codigo.startsWith(`EF${String(grade).padStart(2, '0')}`));
        }

        files += 1;
        total += collection.atividades.length;
        byGrade.set(grade, (byGrade.get(grade) || 0) + expectedActivities);
        bySubject.set(subject, (bySubject.get(subject) || 0) + expectedActivities);
      }
    }
  }

  assert.equal(files, 80);
  assert.equal(total, 4000);
  grades.forEach(grade => assert.equal(byGrade.get(grade), 1000));
  subjects.forEach(([, subject]) => assert.equal(bySubject.get(subject), 800));
});

test('Biblioteca carrega uma coleção de Anos Finais por seleção', () => {
  const source = fs.readFileSync(path.join(root, 'biblioteca.js'), 'utf8');
  const fixes = fs.readFileSync(path.join(root, 'biblioteca-fixes.js'), 'utf8');
  assert.match(source, /finalYearsSubjects/);
  assert.match(source, /navigation\.stage === 'Ensino Fundamental II'/);
  assert.match(source, /TeachEasyLibraryCatalog\.entry\(grade, term, subject\)/);
  assert.match(source, /function syncSubjectOptions\(\)/);
  assert.match(source, /navigation\.stage === 'Ensino Fundamental II'/);
  assert.match(source, /Object\.keys\(finalYearsSubjects\)/);
  assert.match(source, /select\.replaceChildren\(defaultOption, \.\.\.options\)/);
  assert.match(source, /const finalYearsSubjects = TeachEasyLibraryCatalog\.subjects/);
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
        assert.ok((skill.descricaoResumida || skill.habilidadeOficial).length > (collection.schemaVersion === '2.0' ? 19 : 90));
        if (collection.schemaVersion === '2.0') assert.ok(activity.objetivo.length > 60);
        else assert.match(activity.objetivo, new RegExp(skill.codigo));
        assert.ok(activity.textoApoio.conteudo.length > 180);
        assert.equal(activity.questoes.some(item => genericQuestion.test(item.enunciado)), false,
          `${activity.id} ainda possui pergunta genérica`);
        assert.equal(activity.gabarito.some(item => genericAnswer.test(item.resposta)), false,
          `${activity.id} ainda possui gabarito genérico`);
      }
      total += collection.atividades.length;
    }
  }

  assert.equal(total, 4000);
});
