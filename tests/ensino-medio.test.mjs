import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'data', 'atividades', 'ensino-medio');
const grades = [1, 2, 3];
const terms = [1, 2, 3, 4];
const subjects = [
  ['lingua-portuguesa.json', 'Língua Portuguesa', /^EM13LP\d{2}$/],
  ['matematica.json', 'Matemática', /^EM13MAT\d{3}$/],
  ['ciencias.json', 'Ciências', /^EM13CNT\d{3}$/],
  ['historia.json', 'História', /^EM13CHS\d{3}$/],
  ['geografia.json', 'Geografia', /^EM13CHS\d{3}$/]
];

function readCollection(grade, term, filename) {
  const fullPath = path.join(base, `${grade}-serie`, `${term}-bimestre`, filename);
  assert.equal(fs.existsSync(fullPath), true, `${fullPath} deve existir`);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function validateActivity(activity, validCode, seenIds) {
  assert.equal(seenIds.has(activity.id), false, `ID duplicado: ${activity.id}`);
  seenIds.add(activity.id);

  assert.equal(activity.padraoPedagogico, 'teacheasy-v2');
  assert.equal(activity.quantidadeQuestoes, 8);
  assert.equal(activity.questoes.length, 8);
  assert.equal(activity.gabarito.length, 8);
  assert.deepEqual(activity.questoes.map(item => item.numero), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(activity.gabarito.map(item => item.numero), [1, 2, 3, 4, 5, 6, 7, 8]);

  assert.equal(Array.isArray(activity.bncc), true);
  assert.ok(activity.bncc.length > 0);
  const skill = activity.bncc[0];
  assert.match(skill.codigo, validCode, `${activity.id} usa código incompatível: ${skill.codigo}`);
  assert.ok(skill.habilidadeOficial.length > 30, `${activity.id} sem habilidade oficial completa`);
  assert.ok(skill.verbo.length > 2, `${activity.id} sem verbo da habilidade`);
  assert.match(skill.fonte, /basenacionalcomum.*BNCC_EI_EF_110518_versaofinal_site\.pdf/);
  assert.match(activity.objetivo, new RegExp(skill.codigo));
  assert.equal(activity.bnccConferida, true);

  assert.ok(activity.textoApoio?.conteudo?.length > 160, `${activity.id} possui texto de apoio insuficiente`);
  assert.ok(activity.ilustracao?.descricao?.length > 60, `${activity.id} sem descrição de ilustração`);
  assert.ok(activity.ilustracao?.objetivoPedagogico?.length > 40, `${activity.id} sem objetivo visual`);
  assert.equal(activity.revisao?.bnccConferida, true);
  assert.equal(activity.revisao?.validacaoAutomatica, true);

  for (const question of activity.questoes) {
    assert.equal(/\bEM13(?:LP\d{2}|MAT\d{3}|CNT\d{3}|CHS\d{3})\b/.test(question.enunciado), false,
      `${activity.id} expõe código BNCC ao aluno`);
    assert.equal(question.enunciado.includes('..'), false, `${activity.id} possui pontuação duplicada em questão`);
  }
  for (const answer of activity.gabarito) {
    assert.ok(answer.resposta.length > 20, `${activity.id} possui resposta curta demais`);
    assert.equal(answer.resposta.includes('..'), false, `${activity.id} possui pontuação duplicada no gabarito`);
  }
}

test('Ensino Médio V2 possui 3.000 atividades em 60 coleções de cinco disciplinas', () => {
  const seenIds = new Set();
  let collections = 0;
  let activities = 0;
  let questions = 0;
  let answers = 0;

  for (const grade of grades) for (const term of terms) for (const [filename, subject, validCode] of subjects) {
    const collection = readCollection(grade, term, filename);
    assert.equal(collection.schemaVersion, '2.0');
    assert.equal(collection.padraoPedagogico, 'teacheasy-v2');
    assert.equal(collection.etapa, 'Ensino Médio');
    assert.equal(collection.ano, `${grade}ª série`);
    assert.equal(collection.bimestre, term);
    assert.equal(collection.disciplina, subject);
    assert.equal(collection.quantidadeAtividades, 50);
    assert.equal(collection.atividades.length, 50);

    for (const activity of collection.atividades) {
      validateActivity(activity, validCode, seenIds);
      activities += 1;
      questions += activity.questoes.length;
      answers += activity.gabarito.length;
    }
    collections += 1;
  }

  assert.equal(collections, 60);
  assert.equal(activities, 3000);
  assert.equal(questions, 24000);
  assert.equal(answers, 24000);
  assert.equal(seenIds.size, 3000);
});

test('cada série e bimestre possui exatamente 250 atividades V2', () => {
  for (const grade of grades) for (const term of terms) {
    let total = 0;
    for (const [filename] of subjects) {
      const collection = readCollection(grade, term, filename);
      total += collection.atividades.length;
    }
    assert.equal(total, 250, `${grade}ª série / ${term}º bimestre deve ter 250 atividades nas cinco disciplinas`);
  }
});

test('habilidades oficiais e escrita não carregam resíduos da extração do PDF', () => {
  for (const grade of grades) for (const term of terms) for (const [filename, , validCode] of subjects) {
    const collection = readCollection(grade, term, filename);
    for (const activity of collection.atividades) {
      const skill = activity.bncc[0];
      assert.match(skill.codigo, validCode);
      assert.equal(/^\)|\d+\s*\($/.test(skill.habilidadeOficial), false,
        `${activity.id} possui resíduo na habilidade oficial`);
      assert.equal(activity.tema.includes(`— ${grade}ª série`), false,
        `${activity.id} possui série/bimestre artificial no tema`);
      assert.equal(activity.objetivo.includes('..'), false);
      assert.equal(activity.textoApoio.conteudo.includes('..'), false);
    }
  }
});

test('as cinco disciplinas seguem o fluxo V2 com ilustração e revisão automática', () => {
  for (const grade of grades) for (const term of terms) for (const [filename] of subjects) {
    const collection = readCollection(grade, term, filename);
    for (const activity of collection.atividades) {
      assert.equal(activity.padraoPedagogico, 'teacheasy-v2');
      assert.equal(activity.possuiGabarito, true);
      assert.equal(activity.questoes.length, 8);
      assert.equal(activity.gabarito.length, 8);
      assert.equal(activity.ilustracao.status, 'producao-visual-pendente');
      assert.equal(activity.revisao.status, 'revisao-pedagogica-humana-pendente');
      assert.equal(activity.revisao.validacaoAutomatica, true);
    }
  }
});
