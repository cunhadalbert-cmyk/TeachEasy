// Revisão BNCC de História e Geografia validada automaticamente.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'data', 'atividades', 'ensino-medio');
const grades = [1, 2, 3];
const terms = [1, 2, 3, 4];
const subjects = [['lingua-portuguesa.json', 'Língua Portuguesa'], ['matematica.json', 'Matemática'], ['ciencias.json', 'Ciências'], ['historia.json', 'História'], ['geografia.json', 'Geografia'], ['ingles.json', 'Inglês']];
const officialPortugueseCodes = new Set(['EM13LP01', 'EM13LP02', 'EM13LP03', 'EM13LP04', 'EM13LP05', 'EM13LP06', 'EM13LP07', 'EM13LP08', 'EM13LP12', 'EM13LP15']);
const officialMathCodes = new Set(['EM13MAT101', 'EM13MAT102', 'EM13MAT103', 'EM13MAT104', 'EM13MAT105', 'EM13MAT201', 'EM13MAT202', 'EM13MAT203', 'EM13MAT301', 'EM13MAT302']);
const officialHistoryCodes = new Set(['EM13CHS101', 'EM13CHS102', 'EM13CHS103', 'EM13CHS105', 'EM13CHS106', 'EM13CHS201', 'EM13CHS202', 'EM13CHS203', 'EM13CHS204', 'EM13CHS603']);
const officialGeographyCodes = new Set(['EM13CHS101', 'EM13CHS106', 'EM13CHS201', 'EM13CHS202', 'EM13CHS203', 'EM13CHS204', 'EM13CHS205', 'EM13CHS206', 'EM13CHS301', 'EM13CHS306']);

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

test('Português e Matemática usam habilidades existentes da BNCC', () => {
  for (const grade of grades) for (const term of terms) {
    for (const [filename, validCodes] of [['lingua-portuguesa.json', officialPortugueseCodes], ['matematica.json', officialMathCodes]]) {
      const collection = JSON.parse(fs.readFileSync(path.join(base, `${grade}-serie`, `${term}-bimestre`, filename), 'utf8'));
      for (const activity of collection.atividades) {
        const skill = activity.bncc[0];
        assert.equal(validCodes.has(skill.codigo), true, `Código BNCC inválido: ${skill.codigo}`);
        assert.ok(skill.descricaoResumida.length > 60);
        assert.match(activity.objetivo, new RegExp(skill.codigo));
      }
    }
  }
});

test('História e Geografia usam habilidades existentes da BNCC', () => {
  for (const grade of grades) for (const term of terms) {
    for (const [filename, validCodes] of [['historia.json', officialHistoryCodes], ['geografia.json', officialGeographyCodes]]) {
      const collection = JSON.parse(fs.readFileSync(path.join(base, `${grade}-serie`, `${term}-bimestre`, filename), 'utf8'));
      for (const activity of collection.atividades) {
        const skill = activity.bncc[0];
        assert.equal(validCodes.has(skill.codigo), true, `Código BNCC inválido: ${skill.codigo}`);
        assert.ok(skill.descricaoResumida.length > 70);
        assert.match(activity.objetivo, new RegExp(skill.codigo));
      }
    }
  }
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

test('História e Geografia possuem conteúdo aprofundado e BNCC conferida', () => {
  const validSkills = new Set([
    'EM13CHS101', 'EM13CHS102', 'EM13CHS103', 'EM13CHS104', 'EM13CHS105', 'EM13CHS106',
    'EM13CHS201', 'EM13CHS202', 'EM13CHS203', 'EM13CHS204', 'EM13CHS205', 'EM13CHS206',
    'EM13CHS301', 'EM13CHS302', 'EM13CHS303', 'EM13CHS304', 'EM13CHS305', 'EM13CHS306',
    'EM13CHS401', 'EM13CHS402', 'EM13CHS403', 'EM13CHS404',
    'EM13CHS501', 'EM13CHS502', 'EM13CHS503', 'EM13CHS504',
    'EM13CHS601', 'EM13CHS602', 'EM13CHS603', 'EM13CHS604', 'EM13CHS605', 'EM13CHS606'
  ]);

  let total = 0;
  for (const grade of grades) for (const term of terms) {
    for (const [filename, subject] of [['historia.json', 'História'], ['geografia.json', 'Geografia']]) {
      const fullPath = path.join(base, `${grade}-serie`, `${term}-bimestre`, filename);
      const collection = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      assert.equal(collection.disciplina, subject);
      assert.equal(collection.bnccConferida, true);
      assert.match(collection.referenciaBncc, /BNCC.*EM13CHS.*MEC/);

      for (const activity of collection.atividades) {
        assert.equal(activity.bnccConferida, true);
        assert.equal(validSkills.has(activity.bncc[0].codigo), true,
          `${activity.id} usa habilidade inexistente: ${activity.bncc[0].codigo}`);
        assert.equal(activity.questoes.length, 6);
        assert.equal(activity.gabarito.length, 6);
        assert.equal(activity.questoes.some(item =>
          /Explique o conceito central|Identifique duas evidências importantes|Aplique o conhecimento/.test(item.enunciado)
        ), false, `${activity.id} ainda possui pergunta genérica`);
        assert.equal(activity.gabarito.some(item =>
          /Resposta autoral coerente|Resposta fundamentada na habilidade/.test(item.resposta)
        ), false, `${activity.id} ainda possui gabarito genérico`);
      }
      total += collection.atividades.length;
    }
  }
  assert.equal(total, 1200);
});

test('Ciências e Inglês possuem conteúdo aprofundado e BNCC conferida', () => {
  const validScience = /^EM13CNT(10[1-7]|20[1-9]|30[1-9]|310)$/;
  const validLanguages = /^EM13LGG(10[1-5]|20[1-4]|30[1-5]|40[1-3]|60[1-4]|70[1-4])$/;
  let total = 0;
  for (const grade of grades) for (const term of terms) {
    for (const [filename, subject] of [['ciencias.json', 'Ciências'], ['ingles.json', 'Inglês']]) {
      const collection = JSON.parse(fs.readFileSync(path.join(base, `${grade}-serie`, `${term}-bimestre`, filename), 'utf8'));
      assert.equal(collection.bnccConferida, true);
      assert.match(collection.referenciaBncc, /BNCC.*EM13(CNT|LGG).*MEC/);
      for (const activity of collection.atividades) {
        const code = activity.bncc[0].codigo;
        assert.equal(activity.bnccConferida, true);
        assert.equal(subject === 'Ciências' ? validScience.test(code) : validLanguages.test(code), true,
          `${activity.id} usa habilidade inexistente: ${code}`);
        assert.equal(activity.questoes.some(item =>
          /Explique o conceito central|Identifique duas evidências importantes|Apply the language in a real-life situation/.test(item.enunciado)
        ), false, `${activity.id} ainda possui pergunta genérica`);
        assert.equal(activity.gabarito.some(item =>
          /Resposta autoral coerente|Resposta fundamentada na habilidade/.test(item.resposta)
        ), false, `${activity.id} ainda possui gabarito genérico`);
      }
      total += collection.atividades.length;
    }
  }
  assert.equal(total, 1200);
});
