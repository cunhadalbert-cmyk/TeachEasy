import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { Window } from 'happy-dom';

const script = await readFile(new URL('../library-visual-brief-content-first.js', import.meta.url), 'utf8');
const collection = JSON.parse(await readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json', import.meta.url), 'utf8'));
const windows = new Set();

test.afterEach(() => {
  windows.forEach(window => window.close());
  windows.clear();
});

function normalize(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function createPage() {
  const window = new Window({ url: 'https://teacheasy.test/biblioteca.html' });
  window.TeLibraryTitleImages = { normalizeTitle: normalize };
  window.document.body.innerHTML = '<div id="te-illustration-batch-toolbar"><button data-prepare>Preparar lote de 10</button><span data-status></span></div>';
  window.eval(script);
  windows.add(window);
  return window;
}

function activityItem(title) {
  const activity = collection.atividades.find(item => item.titulo === title);
  assert.ok(activity, `Atividade não encontrada: ${title}`);
  return {
    normalizedTitle: normalize(activity.titulo),
    topic: activity.titulo,
    subject: collection.disciplina,
    stage: collection.etapa,
    grade: collection.ano,
    term: collection.bimestre,
    supportText: activity.textoApoio.conteudo,
    statement: activity.instrucaoGeral,
    questions: activity.questoes.map(question => question.enunciado)
  };
}

function compositionCategory(brief) {
  return brief.match(/Composição: ([^—.]+?)(?: —|\.)/)?.[1]?.trim() || '';
}

const targetTitles = [
  'Palavras que evitam repetição',
  'Escrever e revisar um parágrafo claro',
  'Aprofundamento 31: Notícia',
  'Aprofundamento 32: Notícia',
  'Aprofundamento 33: Notícia'
];

test('Aprofundamentos 31, 32 e 33 usam cenas, personagens, focos e composições distintos', () => {
  const page = createPage();
  const prepared = page.TeLibraryContentFirstVisualBrief.preparedActivities(targetTitles.slice(2).map(activityItem));
  const [news31, news32, news33] = prepared;

  assert.equal(new Set(Array.from(prepared, item => item.visualBrief)).size, 3);
  assert.deepEqual(Array.from(prepared, item => compositionCategory(item.visualBrief)), [
    'vista superior parcial', 'vista frontal', 'composição em grupo'
  ]);
  assert.match(news31.visualBrief, /o que aconteceu, quem participou, onde ocorreu e quando/);
  assert.match(news31.visualBrief, /um estudante/i);
  assert.match(news32.visualBrief, /dupla organizando as partes de uma notícia em cartões/i);
  assert.match(news32.visualBrief, /dois estudantes/i);
  assert.match(news33.visualBrief, /pequeno grupo planejando uma notícia escolar/i);
  assert.match(news33.visualBrief, /três estudantes/i);
});

test('cachorro e horta preservam o supportText, mas não compartilham composição nem foco', () => {
  const page = createPage();
  const prepared = page.TeLibraryContentFirstVisualBrief.preparedActivities(targetTitles.slice(0, 2).map(activityItem));
  const [dog, garden] = prepared;

  assert.notEqual(compositionCategory(dog.visualBrief), compositionCategory(garden.visualBrief));
  assert.match(dog.visualBrief, /cachorro em primeiro plano/i);
  assert.match(dog.visualBrief, /crianças/i);
  assert.match(dog.visualBrief, /casinha/i);
  assert.match(dog.visualBrief, /Primeira versão, escrita por Lucas/);
  assert.match(garden.visualBrief, /caderno e a ação de revisar/i);
  assert.match(garden.visualBrief, /horta pequena como referência secundária/i);
  assert.match(garden.visualBrief, /Rascunho de Pedro/);
});

test('deduplicação limita cada categoria de composição a no máximo duas ocorrências', () => {
  const page = createPage();
  const base = activityItem('Aprofundamento 31: Notícia');
  const items = Array.from({ length: 10 }, (_, index) => ({
    ...base,
    topic: `Notícia escolar variada ${index + 1}`,
    normalizedTitle: `noticia-escolar-variada-${index + 1}`,
    supportText: `Situação concreta ${index + 1}: estudantes investigam um acontecimento escolar diferente e selecionam evidências específicas.`
  }));
  const prepared = page.TeLibraryContentFirstVisualBrief.preparedActivities(items);
  const counts = new Map();
  prepared.forEach(item => {
    const category = compositionCategory(item.visualBrief);
    counts.set(category, (counts.get(category) || 0) + 1);
  });

  assert.ok([...counts.values()].every(count => count <= 2));
  assert.equal(new Set(Array.from(prepared, item => item.visualBrief)).size, 10);
});

test('regenerar o lote substitui assinaturas e visualBriefs antigos somente para suas atividades', () => {
  const page = createPage();
  const items = targetTitles.slice(2).map(activityItem);
  const collectionKey = [items[0].stage, items[0].grade, items[0].term, items[0].subject].map(normalize).join('|');
  const staleKey = `${collectionKey}::${items[0].normalizedTitle}`;
  const untouchedKey = `${collectionKey}::atividade-fora-do-lote`;
  page.localStorage.setItem('te-illustration-visual-signatures-v1', JSON.stringify({
    [staleKey]: { visualBrief: 'BRIEF ANTIGO REPETIDO', signature: 'antiga' },
    [untouchedKey]: { visualBrief: 'MANTER', signature: 'fora-do-lote' }
  }));

  const prepared = page.TeLibraryContentFirstVisualBrief.preparedActivities(items);
  const signatures = JSON.parse(page.localStorage.getItem('te-illustration-visual-signatures-v1'));

  assert.doesNotMatch(prepared[0].visualBrief, /BRIEF ANTIGO/);
  assert.notEqual(signatures[staleKey].signature, 'antiga');
  assert.equal(signatures[untouchedKey].signature, 'fora-do-lote');
});
