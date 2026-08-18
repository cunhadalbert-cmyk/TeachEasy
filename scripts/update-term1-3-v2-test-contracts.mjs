import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'tests', 'library.test.mjs');
let source = fs.readFileSync(file, 'utf8');

function replaceExact(from, to, label) {
  if (!source.includes(from)) throw new Error(`Trecho não encontrado para ${label}`);
  source = source.replace(from, to);
}

replaceExact(
`test('Coleção canônica de Ciências possui 50 atividades e referências consistentes', async () => {
  const raw = await readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json', import.meta.url), 'utf8');
  const collection = JSON.parse(raw);
  assert.equal(collection.schemaVersion, '1.0');
  assert.equal(collection.colecao, '4ano-3bimestre-ciencias');`,
`test('Coleção canônica de Ciências V2 possui 50 atividades e referências consistentes', async () => {
  const raw = await readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json', import.meta.url), 'utf8');
  const collection = JSON.parse(raw);
  assert.equal(collection.schemaVersion, '2.0');
  assert.equal(collection.colecao, '4ano-3bimestre-ciencias-v2');`,
'Ciências schema V2');

replaceExact(
`    assert.equal(activity.questoes.length, 6);
    assert.equal(activity.gabarito.length, 6);`,
`    assert.equal(activity.questoes.length, 8);
    assert.equal(activity.gabarito.length, 8);`,
'Ciências quantidade por atividade');

replaceExact(
`test('Ciências do 4º ano totaliza 50 atividades e 300 questões em um arquivo', async () => {`,
`test('Ciências do 4º ano totaliza 50 atividades e 400 questões em um arquivo V2', async () => {`,
'Ciências título total');
replaceExact(
`  assert.equal(activities.reduce((total, activity) => total + activity.questoes.length, 0), 300);
  assert.equal(activities.reduce((total, activity) => total + activity.gabarito.length, 0), 300);`,
`  assert.equal(activities.reduce((total, activity) => total + activity.questoes.length, 0), 400);
  assert.equal(activities.reduce((total, activity) => total + activity.gabarito.length, 0), 400);`,
'Ciências totais V2');

replaceExact(
`test('Arquivos canônicos de Matemática e Língua Portuguesa totalizam 100 atividades e 600 questões', async () => {
  const files = [
    ['matematica.json', '4ano-3bimestre-matematica', 'Matemática', 50, 300],
    ['lingua-portuguesa.json', '4ano-3bimestre-lingua-portuguesa', 'Língua Portuguesa', 50, 300]
  ];`,
`test('Arquivos canônicos de Matemática e Língua Portuguesa V2 totalizam 100 atividades e 800 questões', async () => {
  const files = [
    ['matematica.json', '4ano-3bimestre-matematica-v2', 'Matemática', 50, 400],
    ['lingua-portuguesa.json', '4ano-3bimestre-lingua-portuguesa-v2', 'Língua Portuguesa', 50, 400]
  ];`,
'Matemática/Português cabeçalho V2');

replaceExact(
`    assert.equal(collection.schemaVersion, '1.0');`,
`    assert.equal(collection.schemaVersion, '2.0');`,
'Matemática/Português schema V2');
replaceExact(
`      assert.equal(activity.quantidadeQuestoes, 6);
      assert.equal(activity.questoes.length, 6);
      assert.equal(activity.gabarito.length, 6);
      assert.deepEqual(activity.questoes.map(question => question.numero), [1, 2, 3, 4, 5, 6]);
      assert.deepEqual(activity.gabarito.map(answer => answer.numero), [1, 2, 3, 4, 5, 6]);`,
`      assert.equal(activity.quantidadeQuestoes, 8);
      assert.equal(activity.questoes.length, 8);
      assert.equal(activity.gabarito.length, 8);
      assert.deepEqual(activity.questoes.map(question => question.numero), [1, 2, 3, 4, 5, 6, 7, 8]);
      assert.deepEqual(activity.gabarito.map(answer => answer.numero), [1, 2, 3, 4, 5, 6, 7, 8]);`,
'Matemática/Português estrutura V2');
replaceExact(`  assert.equal(totalQuestions, 600);`, `  assert.equal(totalQuestions, 800);`, 'Matemática/Português total de questões');

replaceExact(
`test('Matemática possui 50 atividades, 300 questões e figuras válidas', async () => {`,
`test('Matemática possui 50 atividades V2, 400 questões e figuras válidas', async () => {`,
'Matemática título V2');
replaceExact(
`  assert.equal(activities.reduce((total, activity) => total + activity.questoes.length, 0), 300);`,
`  assert.equal(activities.reduce((total, activity) => total + activity.questoes.length, 0), 400);`,
'Matemática total V2');
replaceExact(`  assert.equal(new Set(normalizedPrompts).size, 300);`, `  assert.equal(new Set(normalizedPrompts).size, 400);`, 'Matemática prompts únicos');
replaceExact(
`    assert.equal(activity.quantidadeQuestoes, 6);
    assert.equal(activity.questoes.length, 6);
    assert.equal(activity.gabarito.length, 6);`,
`    assert.equal(activity.quantidadeQuestoes, 8);
    assert.equal(activity.questoes.length, 8);
    assert.equal(activity.gabarito.length, 8);`,
'Matemática estrutura V2');
replaceExact(
`    assert.deepEqual(activity.questoes.map(question => question.numero), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(activity.gabarito.map(answer => answer.numero), [1, 2, 3, 4, 5, 6]);`,
`    assert.deepEqual(activity.questoes.map(question => question.numero), [1, 2, 3, 4, 5, 6, 7, 8]);
    assert.deepEqual(activity.gabarito.map(answer => answer.numero), [1, 2, 3, 4, 5, 6, 7, 8]);`,
'Matemática numeração V2');

replaceExact(
`test('Língua Portuguesa possui 50 atividades, 300 questões e figuras válidas', async () => {`,
`test('Língua Portuguesa possui 50 atividades V2, 400 questões e figuras válidas', async () => {`,
'Português título V2');
replaceExact(
`  assert.equal(activities.reduce((total, activity) => total + activity.questoes.length, 0), 300);
  assert.equal(activities.reduce((total, activity) => total + activity.gabarito.length, 0), 300);`,
`  assert.equal(activities.reduce((total, activity) => total + activity.questoes.length, 0), 400);
  assert.equal(activities.reduce((total, activity) => total + activity.gabarito.length, 0), 400);`,
'Português totais V2');
replaceExact(`  assert.equal(new Set(prompts).size, 300);`, `  assert.equal(new Set(prompts).size, 400);`, 'Português prompts únicos');
replaceExact(
`    assert.equal(activity.quantidadeQuestoes, 6);
    assert.equal(activity.questoes.length, 6);
    assert.equal(activity.gabarito.length, 6);`,
`    assert.equal(activity.quantidadeQuestoes, 8);
    assert.equal(activity.questoes.length, 8);
    assert.equal(activity.gabarito.length, 8);`,
'Português estrutura V2');
replaceExact(
`    assert.deepEqual(activity.questoes.map(question => question.numero), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(activity.gabarito.map(answer => answer.numero), [1, 2, 3, 4, 5, 6]);`,
`    assert.deepEqual(activity.questoes.map(question => question.numero), [1, 2, 3, 4, 5, 6, 7, 8]);
    assert.deepEqual(activity.gabarito.map(answer => answer.numero), [1, 2, 3, 4, 5, 6, 7, 8]);`,
'Português numeração V2');

fs.writeFileSync(file, source, 'utf8');
console.log('Contratos legados de library.test.mjs atualizados para V2 sem remover validações de conteúdo ou figuras.');
