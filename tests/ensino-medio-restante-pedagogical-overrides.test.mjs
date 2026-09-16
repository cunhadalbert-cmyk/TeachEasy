import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const sources = await Promise.all([
  'ensino-medio-restante-pedagogical-overrides.js',
  'ensino-medio-restante-pedagogical-wording.js'
].map(file => readFile(new URL(file, root), 'utf8')));
const fetchSource = await readFile(new URL('ensino-medio-pedagogical-fetch.js', root), 'utf8');

function loadPatcher() {
  const context = {};
  vm.createContext(context);
  for (const source of sources) vm.runInContext(source, context);
  return context.TeachEasyHighSchoolRemainingPedagogicalOverrides;
}

const disciplines = ['lingua-portuguesa','matematica','ciencias','historia','geografia'];
const paths = [];
for (let series = 1; series <= 3; series += 1) {
  for (let bimester = 1; bimester <= 4; bimester += 1) {
    if (series === 1 && bimester === 1) continue;
    for (const discipline of disciplines) {
      paths.push(`data/atividades/ensino-medio/${series}-serie/${bimester}-bimestre/${discipline}.json`);
    }
  }
}

test('inventário restante contém exatamente 55 coleções e 2750 atividades canônicas', async () => {
  assert.equal(paths.length, 55);
  let total = 0;
  for (const path of paths) {
    const collection = JSON.parse(await readFile(new URL(path, root), 'utf8'));
    assert.equal(collection.quantidadeAtividades, 50, path);
    assert.equal(collection.atividades.length, 50, path);
    total += collection.atividades.length;
  }
  assert.equal(total, 2750);
});

test('patcher revisa todas as 55 coleções sem alterar IDs ou BNCC', async () => {
  const patcher = loadPatcher();
  let total = 0;
  const firstSupportsByDiscipline = new Map(disciplines.map(item => [item, new Set()]));

  for (const path of paths) {
    const original = JSON.parse(await readFile(new URL(path, root), 'utf8'));
    const collection = structuredClone(original);
    assert.equal(patcher.matches(collection), true, path);

    const originalIds = original.atividades.map(activity => activity.id);
    const originalBncc = original.atividades.map(activity => JSON.stringify(activity.bncc));
    patcher.apply(collection);

    assert.equal(collection.statusBimestre, 'revisao-pedagogica-concluida', path);
    assert.equal(collection.atividades.length, 50, path);
    assert.equal(new Set(collection.atividades.map(activity => activity.titulo)).size, 50, path);

    collection.atividades.forEach((activity, index) => {
      assert.equal(activity.id, originalIds[index], `${path} ID ${index + 1}`);
      assert.equal(JSON.stringify(activity.bncc), originalBncc[index], `${path} BNCC ${index + 1}`);
      assert.equal(activity.quantidadeQuestoes, 8, activity.id);
      assert.equal(activity.questoes.length, 8, activity.id);
      assert.equal(activity.gabarito.length, 8, activity.id);
      assert.equal(activity.possuiGabarito, true, activity.id);
      assert.equal(activity.possuiVersaoAdaptada, true, activity.id);
      assert.equal(activity.possuiFiguras, false, activity.id);
      assert.equal(activity.figuras.length, 0, activity.id);
      assert.equal(activity.ilustracao.status, 'nao-necessaria', activity.id);
      assert.equal(activity.revisao.status, 'aprovada-pedagogicamente', activity.id);
      assert.equal(activity.revisao.bnccConferida, true, activity.id);
      assert.equal(activity.revisao.conteudoConferido, true, activity.id);
      assert.equal(activity.revisao.questoesConferidas, true, activity.id);
      assert.equal(activity.revisao.gabaritoConferido, true, activity.id);
      assert.ok(activity.textoApoio?.conteudo?.length >= 280, activity.id);
      assert.doesNotMatch(activity.titulo, /EM13[A-Z]/, activity.id);
      assert.doesNotMatch(activity.objetivo, /EM13[A-Z]/, activity.id);
      assert.doesNotMatch(activity.textoApoio.conteudo, /EM13[A-Z]/, activity.id);
      assert.doesNotMatch(activity.textoApoio.conteudo, /A situação geográfica envolve|Uma situação-problema reúne dados|Em uma situação de comunicação da escola e da comunidade|A análise histórica parte de fontes/i, activity.id);

      activity.questoes.forEach((question, questionIndex) => {
        assert.equal(question.numero, questionIndex + 1, activity.id);
        assert.ok(question.enunciado.length >= 35, `${activity.id} q${question.numero}`);
        assert.equal(question.figuraId, null, `${activity.id} q${question.numero}`);
        if (question.tipo === 'multipla-escolha') assert.equal(question.alternativas.length, 4, `${activity.id} q${question.numero}`);
        if (question.tipo === 'verdadeiro-falso') assert.equal(JSON.stringify(question.alternativas), JSON.stringify(['Verdadeiro','Falso']), `${activity.id} q${question.numero}`);
      });

      activity.gabarito.forEach((answer, answerIndex) => {
        assert.equal(answer.numero, answerIndex + 1, activity.id);
        assert.ok(answer.resposta.trim().length >= 1, `${activity.id} g${answer.numero}`);
        assert.doesNotMatch(answer.resposta, /NaN|undefined|null/i, `${activity.id} g${answer.numero}`);
      });
    });

    const discipline = path.split('/').at(-1).replace('.json','');
    firstSupportsByDiscipline.get(discipline).add(collection.atividades[0].textoApoio.conteudo);
    total += collection.atividades.length;
  }

  assert.equal(total, 2750);
  for (const [discipline, supports] of firstSupportsByDiscipline) {
    assert.equal(supports.size, 11, `${discipline}: cada série/bimestre restante deve ter contexto próprio`);
  }
});

test('formatos e conteúdos disciplinares permanecem reconhecíveis nas 2750 atividades', async () => {
  const patcher = loadPatcher();
  const expectedTokens = {
    'lingua-portuguesa': /gênero|público|linguagem|texto-base/i,
    matematica: /calcule|modelo|unidade|amostra|função|área|taxa/i,
    ciencias: /investiga|condição A|condição B|evidência|variável/i,
    historia: /Fonte A|Fonte B|históric|autoria|contexto/i,
    geografia: /território|escala|recorte A|recorte B|espacial/i
  };

  for (const path of paths) {
    const collection = JSON.parse(await readFile(new URL(path, root), 'utf8'));
    patcher.apply(collection);
    const discipline = path.split('/').at(-1).replace('.json','');
    const joined = collection.atividades.map(activity => `${activity.textoApoio.conteudo} ${activity.questoes.map(q => q.enunciado).join(' ')}`).join('\n');
    assert.match(joined, expectedTokens[discipline], path);

    const types = new Set(collection.atividades.flatMap(activity => activity.questoes.map(question => question.tipo)));
    for (const type of ['multipla-escolha','verdadeiro-falso','completar','associacao','analise','interpretacao','producao']) {
      assert.ok(types.has(type), `${path}: tipo ausente ${type}`);
    }
  }
});

test('as cinco coleções já concluídas da 1ª série/1º bimestre ficam fora do patcher restante', async () => {
  const patcher = loadPatcher();
  for (const discipline of disciplines) {
    const path = `data/atividades/ensino-medio/1-serie/1-bimestre/${discipline}.json`;
    const collection = JSON.parse(await readFile(new URL(path, root), 'utf8'));
    assert.equal(patcher.matches(collection), false, path);
  }
  assert.equal(patcher.expectedCollections, 55);
  assert.equal(patcher.expectedActivities, 2750);
  assert.equal(patcher.matches({ colecao: 'em-2serie-1bimestre-ingles-v2' }), false);
});

test('adaptador carrega a revisão restante sob demanda sem retirar os patchers já aprovados', () => {
  assert.match(fetchSource, /TeachEasyHighSchoolPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolMathPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolSciencePedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolHistoryPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolGeographyPedagogicalOverrides/);
  assert.match(fetchSource, /TeachEasyHighSchoolRemainingPedagogicalOverrides/);
  assert.match(fetchSource, /ensino-medio-restante-pedagogical-overrides\.js/);
  assert.match(fetchSource, /ensino-medio-restante-pedagogical-wording\.js/);
  assert.match(fetchSource, /ensureRemainingPatcher/);
});
