import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { validatePedagogicalActivityV2 } from '../scripts/pedagogical-standard-v2.mjs';

test('Matemática do 4º bimestre possui 50 atividades V2 do 1º ao 9º ano', () => {
  const globalIds = new Set();
  let questions = 0;
  let answers = 0;
  for (let year = 1; year <= 9; year += 1) {
    const segment = year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
    const file = new URL(`../data/atividades/${segment}/${year}-ano/4-bimestre/matematica.json`, import.meta.url);
    const collection = JSON.parse(fs.readFileSync(file, 'utf8'));
    const titles = new Set();
    const prompts = new Set();
    assert.equal(collection.schemaVersion, '2.0');
    assert.equal(collection.padraoPedagogico, 'teacheasy-v2');
    assert.equal(collection.atividades.length, 50);
    for (const activity of collection.atividades) {
      assert.equal(globalIds.has(activity.id), false, `ID repetido: ${activity.id}`);
      globalIds.add(activity.id);
      titles.add(activity.titulo.toLocaleLowerCase('pt-BR'));
      activity.questoes.forEach(question => prompts.add(question.enunciado.toLocaleLowerCase('pt-BR')));
      assert.equal(activity.questoes.length, 8);
      assert.equal(activity.gabarito.length, 8);
      assert.equal(validatePedagogicalActivityV2(activity, collection).valid, true);
      assert.equal(activity.revisao.status, 'revisao-pedagogica-humana-pendente');
      questions += activity.questoes.length;
      answers += activity.gabarito.length;
    }
    assert.equal(titles.size, 50);
    assert.equal(prompts.size, 400);
  }
  assert.equal(globalIds.size, 450);
  assert.equal(questions, 3600);
  assert.equal(answers, 3600);
});
