import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validatePedagogicalActivityV2 } from '../scripts/pedagogical-standard-v2.mjs';

const file = new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json', import.meta.url);
const collection = JSON.parse(fs.readFileSync(file, 'utf8'));
const SOURCE = 'https://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf';
const forbiddenSupport = [
  /No 4º ano, o estudante deve selecionar informações/i,
  /No 3º bimestre, a proposta retoma conhecimentos/i,
  /Textos circulam em situações reais de comunicação/i,
  /O estudo de .+ permite relacionar informações/i,
  /Em “.+”, as questões retomam esse contexto/i
];
const forbiddenAnswers = [
  /Deve reconhecer um limite, cuidado, erro possível ou ponto de vista/i,
  /Deve produzir uma síntese autoral coerente com/i,
  /Critério de correção alinhado à habilidade/i
];

test('Português 4º ano 3º bimestre segue o padrão editorial V3', () => {
  assert.equal(collection.schemaVersion, '2.0');
  assert.match(collection.colecao, /^4ano-3bimestre-lingua-portuguesa-v3-/);
  assert.equal(collection.padraoPedagogico, 'teacheasy-v2');
  assert.equal(collection.atividades.length, 50);

  const ids = new Set();
  const titles = new Set();
  const prompts = new Set();
  let questions = 0;
  let answers = 0;

  collection.atividades.forEach((activity, index) => {
    const n = index + 1;
    assert.equal(activity.sequencia, `Atividade ${n}`, `sequência incorreta na atividade ${n}`);
    assert.equal(/^Aprofundamento\b/i.test(activity.titulo), false, `título genérico na atividade ${n}`);
    assert.equal(ids.has(activity.id), false, `ID repetido: ${activity.id}`);
    ids.add(activity.id);
    const titleKey = activity.titulo.toLocaleLowerCase('pt-BR');
    assert.equal(titles.has(titleKey), false, `título repetido: ${activity.titulo}`);
    titles.add(titleKey);

    assert.equal(activity.questoes.length, 8, `${activity.id}: questões`);
    assert.equal(activity.gabarito.length, 8, `${activity.id}: gabarito`);
    assert.deepEqual(activity.questoes.map(q => q.numero), [1,2,3,4,5,6,7,8]);
    assert.deepEqual(activity.gabarito.map(g => g.numero), [1,2,3,4,5,6,7,8]);
    questions += 8;
    answers += 8;

    for (const question of activity.questoes) {
      const key = question.enunciado.toLocaleLowerCase('pt-BR');
      assert.equal(prompts.has(key), false, `questão repetida: ${question.enunciado}`);
      prompts.add(key);
      assert.equal(/\bEF(?:0[1-9]|15|35)[A-Z]{2}\d{2}\b/.test(question.enunciado), false, `BNCC exposta ao aluno: ${activity.id}`);
    }

    assert.ok(Array.isArray(activity.bncc) && activity.bncc.length >= 1, `${activity.id}: BNCC ausente`);
    activity.bncc.forEach(skill => {
      assert.match(skill.codigo, /^EF(?:0[1-9]|15|35)[A-Z]{2}\d{2}$/);
      assert.ok(skill.habilidadeOficial.length >= 30, `${activity.id}: habilidade BNCC curta`);
      assert.equal(skill.fonte, SOURCE, `${activity.id}: fonte BNCC`);
      assert.doesNotMatch(skill.habilidadeOficial, /desenvolver conhecimentos e práticas relacionados/i);
    });

    assert.equal(activity.gabaritoCabecalho?.exibirBncc, true, `${activity.id}: BNCC não habilitada no gabarito`);
    assert.equal(activity.gabaritoCabecalho?.usarCampoDaAtividade, 'bncc');
    assert.equal(activity.revisao?.status, 'revisao-pedagogica-humana-pendente');
    assert.equal(activity.revisao?.bnccConferida, true);
    assert.equal(activity.revisao?.conteudoConferido, true);
    assert.equal(activity.revisao?.questoesConferidas, true);
    assert.equal(activity.revisao?.gabaritoConferido, true);
    assert.equal(activity.revisao?.ilustracaoConferida, false);
    assert.equal(activity.revisao?.validacaoAutomatica, true);

    const support = activity.textoApoio?.conteudo || '';
    forbiddenSupport.forEach(pattern => assert.doesNotMatch(support, pattern, `${activity.id}: texto de apoio genérico`));
    assert.equal((support.match(/No 4º ano/g) || []).length, 0, `${activity.id}: boilerplate do ano`);
    activity.gabarito.forEach(item => forbiddenAnswers.forEach(pattern => assert.doesNotMatch(item.resposta, pattern, `${activity.id}: gabarito genérico`)));

    const result = validatePedagogicalActivityV2(activity, collection);
    assert.equal(result.valid, true, result.errors.join('\n'));
  });

  assert.equal(ids.size, 50);
  assert.equal(titles.size, 50);
  assert.equal(prompts.size, 400);
  assert.equal(questions, 400);
  assert.equal(answers, 400);
});
