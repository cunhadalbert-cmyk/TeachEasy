import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const branchFiles = {
  portuguese: [
    'ensino-medio-pedagogical-overrides.js',
    'ensino-medio-pedagogical-overrides-06-10.js',
    'ensino-medio-pedagogical-overrides-11-15.js',
    'ensino-medio-pedagogical-overrides-16-20.js',
    'ensino-medio-pedagogical-overrides-21-25.js',
    'ensino-medio-pedagogical-overrides-26-30.js',
    'ensino-medio-pedagogical-overrides-31-50.js'
  ],
  math: ['ensino-medio-matematica-pedagogical-overrides.js','ensino-medio-matematica-pedagogical-wording.js'],
  history: ['ensino-medio-historia-pedagogical-core.js','ensino-medio-historia-pedagogical-01.js','ensino-medio-historia-pedagogical-02.js','ensino-medio-historia-pedagogical-03.js','ensino-medio-historia-pedagogical-04.js','ensino-medio-historia-pedagogical-05.js'],
  geography: ['ensino-medio-geografia-pedagogical-core.js','ensino-medio-geografia-pedagogical-01.js','ensino-medio-geografia-pedagogical-02.js','ensino-medio-geografia-pedagogical-03.js','ensino-medio-geografia-pedagogical-04.js','ensino-medio-geografia-pedagogical-05.js']
};

async function source(path) { return readFile(new URL(path, root), 'utf8'); }
async function json(path) { return JSON.parse(await source(path)); }

async function buildContext() {
  const context = { console };
  vm.createContext(context);
  for (const path of [...branchFiles.portuguese, ...branchFiles.math, ...branchFiles.history, ...branchFiles.geography, 'ensino-medio-coerencia-total.js', 'ensino-medio-coerencia-final.js']) {
    vm.runInContext(await source(path), context, { filename:path });
  }
  return context;
}

function plain(value) { return JSON.parse(JSON.stringify(value)); }
function codes(activity) { return JSON.stringify(activity.bncc || []); }

async function approvedBaselines(context) {
  const specs = {
    'lingua-portuguesa':['TeachEasyHighSchoolPedagogicalOverrides','lingua-portuguesa.json'],
    matematica:['TeachEasyHighSchoolMathPedagogicalOverrides','matematica.json'],
    historia:['TeachEasyHighSchoolHistoryPedagogicalOverrides','historia.json'],
    geografia:['TeachEasyHighSchoolGeographyPedagogicalOverrides','geografia.json']
  };
  const result = {};
  for (const [discipline,[globalName,file]] of Object.entries(specs)) {
    const raw = await json(`data/atividades/ensino-medio/1-serie/1-bimestre/${file}`);
    result[discipline] = plain(context[globalName].apply(raw));
    assert.equal(result[discipline].atividades.length,50,discipline);
  }
  return result;
}

const disciplines = ['lingua-portuguesa','matematica','ciencias','historia','geografia'];
const remainingPaths = [];
for (let series=1; series<=3; series+=1) {
  for (let bimester=1; bimester<=4; bimester+=1) {
    if (series===1 && bimester===1) continue;
    for (const discipline of disciplines) remainingPaths.push({series,bimester,discipline,path:`data/atividades/ensino-medio/${series}-serie/${bimester}-bimestre/${discipline}.json`});
  }
}

test('as quatro disciplinas equivalentes reutilizam exatamente o conteúdo pedagógico já aprovado por posição', async () => {
  const context = await buildContext();
  const coherent = context.TeachEasyHighSchoolCoherentRemaining;
  const baselines = await approvedBaselines(context);
  let checked = 0;

  for (const item of remainingPaths.filter(item => item.discipline !== 'ciencias')) {
    const original = await json(item.path);
    const originalIds = original.atividades.map(a=>a.id);
    const originalBncc = original.atividades.map(codes);
    const patched = plain(coherent.applyFromBaseline(original, baselines[item.discipline]));
    assert.equal(patched.statusBimestre,'revisao-pedagogica-coerente-concluida',item.path);
    assert.equal(patched.atividades.length,50,item.path);
    assert.equal(new Set(patched.atividades.map(a=>a.titulo)).size,50,item.path);

    patched.atividades.forEach((activity,index) => {
      const approved = baselines[item.discipline].atividades[index];
      assert.equal(activity.id,originalIds[index],`${item.path} id ${index+1}`);
      assert.equal(codes(activity),originalBncc[index],`${item.path} BNCC ${index+1}`);
      assert.deepEqual(activity.textoApoio,approved.textoApoio,`${item.path} texto ${index+1}`);
      assert.deepEqual(activity.questoes,approved.questoes,`${item.path} questões ${index+1}`);
      assert.deepEqual(activity.gabarito,approved.gabarito,`${item.path} gabarito ${index+1}`);
      assert.equal(activity.questoes.length,8,activity.id);
      assert.equal(activity.gabarito.length,8,activity.id);
      assert.equal(activity.coerencia.fonte,'atividade-aprovada-equivalente',activity.id);
      assert.equal(activity.coerencia.textoQuestoesGabaritoVinculados,true,activity.id);
      assert.doesNotMatch(activity.objetivo,/EM13[A-Z0-9]+/,activity.id);
      assert.doesNotMatch(activity.textoApoio.conteudo,/EM13[A-Z0-9]+/,activity.id);
      activity.questoes.forEach(q=>assert.doesNotMatch(q.enunciado,/EM13[A-Z0-9]+/,`${activity.id} q${q.numero}`));
    });
    checked += patched.atividades.length;
  }
  assert.equal(checked,2200);
});

test('Ciências cobre as 26 habilidades canônicas com texto, questões e gabarito ligados às evidências da própria atividade', async () => {
  const context = await buildContext();
  const coherent = context.TeachEasyHighSchoolCoherentRemaining;
  const seenCodes = new Set();
  let checked = 0;

  for (const item of remainingPaths.filter(item => item.discipline === 'ciencias')) {
    const original = await json(item.path);
    const originalIds = original.atividades.map(a=>a.id);
    const originalBncc = original.atividades.map(codes);
    const patched = plain(coherent.applyScience(original));
    assert.equal(patched.statusBimestre,'revisao-pedagogica-coerente-concluida',item.path);
    assert.equal(patched.atividades.length,50,item.path);
    assert.equal(new Set(patched.atividades.map(a=>a.titulo)).size,50,`${item.path}: títulos duplicados`);

    patched.atividades.forEach((activity,index) => {
      const code = activity.bncc?.[0]?.codigo;
      seenCodes.add(code);
      assert.equal(activity.id,originalIds[index],`${item.path} id ${index+1}`);
      assert.equal(codes(activity),originalBncc[index],`${item.path} BNCC ${index+1}`);
      assert.equal(activity.questoes.length,8,activity.id);
      assert.equal(activity.gabarito.length,8,activity.id);
      assert.equal(activity.coerencia.codigoBncc,code,activity.id);
      assert.equal(activity.coerencia.temaCanonico,activity.tema,activity.id);
      assert.equal(activity.coerencia.textoQuestoesGabaritoVinculados,true,activity.id);
      assert.ok(activity.textoApoio.conteudo.length >= 500,`${activity.id}: texto curto`);
      assert.doesNotMatch(activity.objetivo,/EM13[A-Z0-9]+/,activity.id);
      assert.doesNotMatch(activity.textoApoio.conteudo,/EM13[A-Z0-9]+/,activity.id);

      for (const evidence of activity.coerencia.evidencias) {
        assert.ok(activity.textoApoio.conteudo.includes(String(evidence)),`${activity.id}: evidência ausente no texto: ${evidence}`);
      }

      activity.questoes.forEach((question,qIndex) => {
        assert.equal(question.numero,qIndex+1,activity.id);
        assert.ok(question.enunciado.length >= 45,`${activity.id} q${question.numero}`);
        assert.equal(question.figuraId,null,`${activity.id} q${question.numero}`);
        assert.doesNotMatch(question.enunciado,/EM13[A-Z0-9]+/,`${activity.id} q${question.numero}`);
      });
      activity.gabarito.forEach((answer,aIndex) => {
        assert.equal(answer.numero,aIndex+1,activity.id);
        assert.ok(answer.resposta.length >= 2,`${activity.id} g${answer.numero}`);
        assert.ok(answer.justificativa.length >= 20,`${activity.id} justificativa ${answer.numero}`);
        assert.doesNotMatch(answer.resposta,/NaN|undefined|null/i,activity.id);
      });

      const q1 = activity.questoes[0];
      const g1 = activity.gabarito[0].resposta.replace(/^A\)\s*/, '');
      assert.equal(q1.tipo,'multipla-escolha',activity.id);
      assert.equal(q1.alternativas.length,4,activity.id);
      assert.equal(q1.alternativas[0],g1,`${activity.id}: resposta da múltipla escolha não corresponde à alternativa correta`);
      assert.equal(activity.questoes[1].tipo,'verdadeiro-falso',activity.id);
      assert.deepEqual(activity.questoes[1].alternativas,['Verdadeiro','Falso'],activity.id);
      checked += 1;
    });
  }

  assert.equal(checked,550);
  assert.deepEqual([...seenCodes].sort(),plain(coherent.scienceProfileCodes),'perfil de Ciências não cobre exatamente os códigos usados nas 11 coleções restantes');
  assert.equal(seenCodes.size,26);
});

test('a revisão total cobre exatamente as 55 coleções e 2750 atividades restantes', async () => {
  const context = await buildContext();
  const coherent = context.TeachEasyHighSchoolCoherentRemaining;
  assert.equal(remainingPaths.length,55);
  assert.equal(coherent.expectedCollections,55);
  assert.equal(coherent.expectedActivities,2750);
  let total=0;
  for (const item of remainingPaths) {
    const collection = await json(item.path);
    assert.equal(coherent.matches(collection),true,item.path);
    total += collection.atividades.length;
  }
  assert.equal(total,2750);
});

test('o carregador usa somente a nova camada coerente para as coleções restantes', async () => {
  const fetchSource = await source('ensino-medio-pedagogical-fetch.js');
  assert.match(fetchSource,/ensino-medio-coerencia-total\.js/);
  assert.match(fetchSource,/ensino-medio-coerencia-final\.js/);
  assert.match(fetchSource,/TeachEasyHighSchoolCoherentRemaining/);
  assert.match(fetchSource,/approvedBaseline/);
  assert.doesNotMatch(fetchSource,/ensino-medio-restante-pedagogical-overrides\.js/);
  assert.doesNotMatch(fetchSource,/ensino-medio-restante-pedagogical-wording\.js/);
});
