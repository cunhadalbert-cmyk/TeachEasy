import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const baseSource = await readFile(new URL('ensino-medio-restante-pedagogical-overrides.js', root), 'utf8');
const wordingSource = await readFile(new URL('ensino-medio-restante-pedagogical-wording.js', root), 'utf8');
const semanticSource = await readFile(new URL('ensino-medio-semantic-coherence.js', root), 'utf8');
const fetchSource = await readFile(new URL('ensino-medio-pedagogical-fetch.js', root), 'utf8');

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

const STOP = new Set('a o as os de da do das dos e em para por com sem que se um uma uns umas ao aos à às como sobre entre sua seu suas seus este esta esse essa isso isto ser estar foi são pela pelo pelas pelos ou também mais menos muito pouco cada partir meio forma situações analisar análise relacionar relação desenvolver habilidade atividade estudante estudantes'.split(/\s+/));

function normalize(text) {
  return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function significantWords(text) {
  return [...new Set(normalize(text).replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(word => word.length >= 5 && !STOP.has(word) && !/^em13/.test(word)))];
}

function loadPatchers() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(baseSource, context);
  vm.runInContext(wordingSource, context);
  vm.runInContext(semanticSource, context);
  return {
    base: context.TeachEasyHighSchoolRemainingPedagogicalOverrides,
    semantic: context.TeachEasyHighSchoolSemanticCoherence
  };
}

function applyAll(collection) {
  const { base, semantic } = loadPatchers();
  const patched = base.apply(structuredClone(collection));
  return semantic.apply(patched);
}

test('coerência semântica cobre exatamente as 55 coleções e 2750 atividades restantes', async () => {
  assert.equal(paths.length, 55);
  let total = 0;
  for (const path of paths) {
    const original = JSON.parse(await readFile(new URL(path, root), 'utf8'));
    const patched = applyAll(original);
    assert.equal(patched.coerenciaSemantica?.status, 'aprovada', path);
    assert.equal(patched.coerenciaSemantica?.quantidadeAtividades, 50, path);
    assert.equal(patched.atividades.length, 50, path);
    total += patched.atividades.length;
  }
  assert.equal(total, 2750);
});

test('cada atividade ancora tema e habilidade no texto, nas oito questões e no gabarito', async () => {
  let checked = 0;

  for (const path of paths) {
    const original = JSON.parse(await readFile(new URL(path, root), 'utf8'));
    const patched = applyAll(original);

    patched.atividades.forEach((activity, index) => {
      const sourceActivity = original.atividades[index];
      const theme = String(sourceActivity.tema || '').replace(/\.$/, '').trim();
      const skill = String(sourceActivity.bncc?.[0]?.habilidadeOficial || '').trim();
      const themeWords = significantWords(theme);
      const skillWords = significantWords(skill);
      const support = normalize(activity.textoApoio?.conteudo);

      assert.equal(activity.id, sourceActivity.id, `${path} ID ${index + 1}`);
      assert.equal(JSON.stringify(activity.bncc), JSON.stringify(sourceActivity.bncc), `${path} BNCC ${index + 1}`);
      assert.equal(activity.coerenciaSemantica?.status, 'aprovada', activity.id);
      assert.equal(activity.revisao?.coerenciaTextoQuestoes, true, activity.id);
      assert.equal(activity.revisao?.coerenciaQuestoesGabarito, true, activity.id);
      assert.equal(activity.revisao?.habilidadeAlinhadaAoConteudo, true, activity.id);

      const themeHits = themeWords.filter(word => support.includes(word));
      const skillHits = skillWords.filter(word => support.includes(word));
      assert.ok(themeWords.length === 0 || themeHits.length >= Math.min(2, themeWords.length), `${activity.id}: texto sem tema`);
      assert.ok(skillWords.length === 0 || skillHits.length >= Math.min(2, skillWords.length), `${activity.id}: texto sem habilidade`);
      assert.equal(activity.questoes.length, 8, activity.id);
      assert.equal(activity.gabarito.length, 8, activity.id);

      activity.questoes.forEach((question, qIndex) => {
        const qtext = normalize(question.enunciado);
        const semanticWords = [...themeWords, ...skillWords];
        const anchored = semanticWords.some(word => qtext.includes(word)) || qtext.includes(normalize(theme).slice(0, 22));
        assert.equal(anchored, true, `${activity.id} q${qIndex + 1}: pergunta sem foco temático`);
        assert.doesNotMatch(question.enunciado, /EM13[A-Z0-9]+/, `${activity.id} q${qIndex + 1}: código BNCC na frente`);
      });

      activity.gabarito.forEach((answer, aIndex) => {
        const justification = normalize(answer.justificativa);
        const anchorWords = activity.coerenciaSemantica?.palavrasChave || [];
        assert.ok(anchorWords.length === 0 || anchorWords.some(word => justification.includes(normalize(word))), `${activity.id} g${aIndex + 1}: justificativa sem evidência temática`);
        assert.doesNotMatch(answer.resposta, /NaN|undefined|null/i, `${activity.id} g${aIndex + 1}`);
      });

      checked += 1;
    });
  }

  assert.equal(checked, 2750);
});

test('perguntas e gabaritos permanecem coerentes com os formatos concretos de cada disciplina', async () => {
  const required = {
    'lingua-portuguesa': /texto-base|gênero|público|linguagem|circulação/i,
    matematica: /dados|modelo|calcule|resultado|unidade|taxa|função|amostra/i,
    ciencias: /investigação|variáveis|evidências|condição|fenômeno|procedimento/i,
    historia: /fonte|evidência|autoria|contexto|perspectiva|históric/i,
    geografia: /território|escala|espacial|recorte|fluxos|redes|localização/i
  };

  for (const path of paths) {
    const original = JSON.parse(await readFile(new URL(path, root), 'utf8'));
    const patched = applyAll(original);
    const discipline = path.split('/').at(-1).replace('.json', '');
    const joined = patched.atividades.map(activity => `${activity.textoApoio.conteudo} ${activity.questoes.map(q => q.enunciado).join(' ')} ${activity.gabarito.map(g => `${g.resposta} ${g.justificativa}`).join(' ')}`).join('\n');
    assert.match(joined, required[discipline], path);
  }
});

test('as 250 atividades já aprovadas do 1º bimestre continuam fora desta camada', async () => {
  const { semantic } = loadPatchers();
  for (const discipline of disciplines) {
    const path = `data/atividades/ensino-medio/1-serie/1-bimestre/${discipline}.json`;
    const collection = JSON.parse(await readFile(new URL(path, root), 'utf8'));
    assert.equal(semantic.matches(collection), false, path);
  }
  assert.equal(semantic.expectedCollections, 55);
  assert.equal(semantic.expectedActivities, 2750);
});

test('carregador aplica a coerência semântica depois da revisão pedagógica restante', () => {
  assert.match(fetchSource, /ensino-medio-restante-pedagogical-overrides\.js/);
  assert.match(fetchSource, /ensino-medio-restante-pedagogical-wording\.js/);
  assert.match(fetchSource, /ensino-medio-semantic-coherence\.js/);
  assert.match(fetchSource, /TeachEasyHighSchoolSemanticCoherence/);
  assert.match(fetchSource, /semantic\.apply\(patched\)/);
});
