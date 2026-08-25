import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { Window } from 'happy-dom';

const source = await readFile(new URL('../library-export-image-sync.js', import.meta.url), 'utf8');
const require = createRequire(import.meta.url);
const JSZip = require('../vendor/jszip.min.js');
const openPages = new Set();

test.afterEach(() => {
  for (const page of openPages) page.close();
  openPages.clear();
});

function fakeIndexedDB() {
  const databases = new Map();
  return {
    open(name) {
      const request = {};
      queueMicrotask(() => {
        const isNew = !databases.has(name);
        if (isNew) databases.set(name, new Map());
        const stores = databases.get(name);
        const database = {
          objectStoreNames: { contains: storeName => stores.has(storeName) },
          createObjectStore(storeName) { stores.set(storeName, new Map()); },
          transaction(storeName) {
            const records = stores.get(storeName);
            const transaction = {
              objectStore() {
                return {
                  put(record) {
                    queueMicrotask(() => {
                      records.set(record.normalizedTitle, structuredClone(record));
                      transaction.oncomplete?.();
                    });
                  },
                  get(key) {
                    const getRequest = {};
                    queueMicrotask(() => {
                      getRequest.result = records.get(key);
                      getRequest.onsuccess?.();
                    });
                    return getRequest;
                  }
                };
              }
            };
            return transaction;
          },
          close() {}
        };
        request.result = database;
        if (isNew) request.onupgradeneeded?.();
        request.onsuccess?.();
      });
      return request;
    }
  };
}

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function shellMarkup(title, { buttons = false, image = '' } = {}) {
  return `
    <div class="collection-preview-shell">
      <section class="te-final-student">
        <h1 class="te-final-title">ATIVIDADE DE LÍNGUA PORTUGUESA</h1>
        <h2 class="te-final-subtitle">${title}</h2>
        <div class="te-final-visual">${image ? `<img src="${image}" alt="Imagem estática">` : ''}</div>
      </section>
      ${buttons ? '<button class="te-final-word">Word</button><button class="te-final-pdf">PDF</button>' : ''}
    </div>`;
}

function createPage(database, markup = '') {
  const window = new Window({ url: 'https://teacheasy.test/biblioteca.html' });
  window.indexedDB = database;
  window.alert = () => {};
  window.document.body.innerHTML = `<div id="preview-content">${markup}</div>`;
  window.JSZip = JSZip;
  window.eval(source);
  openPages.add(window);
  return window;
}

async function createZip(window, entries, name = 'TeachEasy_Lote.zip') {
  const archive = new JSZip();
  for (const entry of entries) {
    if (entry.dir) archive.folder(entry.name);
    else archive.file(entry.name, entry.content || `imagem:${entry.name}`);
  }
  const bytes = await archive.generateAsync({ type: 'uint8array' });
  return new window.File([bytes], name, { type: 'application/zip' });
}

const activities = [
  'Informação ou opinião?',
  'Produzindo uma notícia escolar',
  'Descobrindo informações científicas'
].map(topic => ({ topic, normalizedTitle: normalize(topic) }));

const tenActivities = [
  ...activities.map(item => item.topic),
  'Água e transformação',
  'Números e operações',
  'O bairro onde vivemos',
  'Animais brasileiros',
  'Leitura de gráficos',
  'Memórias da comunidade',
  'Formas geométricas'
].map(topic => ({ topic, normalizedTitle: normalize(topic) }));

function batchCandidate(topic, overrides = {}) {
  return {
    stage: 'Ensino Fundamental I',
    grade: '4º ano',
    term: 3,
    subject: 'Língua Portuguesa',
    topic,
    hasStaticImage: false,
    ...overrides
  };
}

test('um clique na primeira atividade monta automaticamente um lote de até 10', async () => {
  const page = createPage(fakeIndexedDB(), shellMarkup('Atividade 1'));
  const candidates = Array.from({ length: 12 }, (_, index) => batchCandidate(`Atividade ${index + 1}`));
  page.TeLibraryIllustrationBatchContext = { start: candidates[0], activities: candidates };
  await page.TeLibraryTitleImages.refresh();

  const checkbox = page.document.querySelector('.te-batch-selector input');
  checkbox.checked = true;
  checkbox.dispatchEvent(new page.Event('change'));
  await new Promise(resolve => setTimeout(resolve, 0));

  const selected = page.teGetIllustrationBatchSelection();
  assert.equal(selected.length, 10);
  assert.deepEqual(Array.from(selected, item => item.topic), candidates.slice(0, 10).map(item => item.topic));
  assert.equal(page.document.querySelector('#te-illustration-batch-toolbar [data-count]').textContent, '10/10 selecionadas');
});

test('lote automático pula atividades com imagem estática ou já persistida', async () => {
  const page = createPage(fakeIndexedDB());
  const candidates = Array.from({ length: 12 }, (_, index) => batchCandidate(`Atividade ${index + 1}`));
  candidates[2].hasStaticImage = true;
  const batch = await page.TeLibraryTitleImages.buildAutomaticBatch(
    candidates[0],
    candidates,
    async normalizedTitle => normalizedTitle === 'atividade-5'
  );

  assert.equal(batch.length, 10);
  assert.doesNotMatch(batch.map(item => item.topic).join('|'), /Atividade 3|Atividade 5/);
  assert.equal(batch.at(-1).topic, 'Atividade 12');
});

test('lote automático não ultrapassa ano, disciplina ou bimestre da coleção inicial', async () => {
  const page = createPage(fakeIndexedDB());
  for (const boundary of [
    { grade: '5º ano' },
    { subject: 'Matemática' },
    { term: 4 }
  ]) {
    const candidates = [
      batchCandidate('Atividade 1'),
      batchCandidate('Atividade 2'),
      batchCandidate('Outra coleção', boundary),
      batchCandidate('Retorno indevido')
    ];
    const batch = await page.TeLibraryTitleImages.buildAutomaticBatch(candidates[0], candidates, async () => '');
    assert.deepEqual(Array.from(batch, item => item.topic), ['Atividade 1', 'Atividade 2']);
  }
});

test('lote automático seleciona somente as atividades disponíveis quando restam menos de 10', async () => {
  const page = createPage(fakeIndexedDB());
  const candidates = Array.from({ length: 7 }, (_, index) => batchCandidate(`Atividade ${index + 1}`));
  candidates[4].hasStaticImage = true;
  const batch = await page.TeLibraryTitleImages.buildAutomaticBatch(candidates[3], candidates, async () => '');

  assert.deepEqual(Array.from(batch, item => item.topic), ['Atividade 4', 'Atividade 6', 'Atividade 7']);
});

test('ZIP com 3 imagens em ordem aleatória vincula exclusivamente pelo título normalizado', async () => {
  const page = createPage(fakeIndexedDB(), activities.map(item => shellMarkup(item.topic)).join(''));
  const zip = await createZip(page, [activities[2], activities[0], activities[1]].map(item => ({ name: `${item.normalizedTitle}.png` })));
  const result = await page.TeLibraryTitleImages.importZip(zip, activities);

  assert.equal(result.linkedCount, 3);
  assert.deepEqual([...result.missingTitles], []);
  assert.deepEqual(
    [...page.document.querySelectorAll('.te-final-visual img')].map(image => image.dataset.teIllustrationTitle),
    activities.map(item => item.normalizedTitle)
  );
});

test('ZIP com 10 imagens fora de ordem vincula as dez atividades corretas', async () => {
  const order = [9, 2, 7, 0, 5, 1, 8, 4, 6, 3];
  const page = createPage(fakeIndexedDB(), tenActivities.map(item => shellMarkup(item.topic)).join(''));
  const zip = await createZip(page, order.map(index => ({ name: `${tenActivities[index].normalizedTitle}.webp` })));
  const result = await page.TeLibraryTitleImages.importZip(zip, tenActivities);

  assert.equal(result.linkedCount, 10);
  assert.equal(result.total, 10);
  assert.equal(page.document.querySelectorAll('.te-final-visual img').length, 10);
});

test('nomes com acentos, espaços e pontuação são normalizados antes da comparação', async () => {
  const page = createPage(fakeIndexedDB(), shellMarkup('Informação ou opinião?'));
  const zip = await createZip(page, [{ name: 'INFORMAÇÃO OU OPINIÃO?.JPG' }]);
  const result = await page.TeLibraryTitleImages.importZip(zip, [activities[0]]);

  assert.equal(page.TeLibraryTitleImages.normalizeTitle('Informação ou opinião?'), 'informacao-ou-opiniao');
  assert.equal(result.linkedCount, 1);
});

test('arquivo extra sem atividade correspondente é informado e nunca reaproveitado por ordem', async () => {
  const page = createPage(fakeIndexedDB(), shellMarkup('Informação ou opinião?'));
  const zip = await createZip(page, [
    { name: 'xadrez.png' },
    { name: 'informacao-ou-opiniao.png' }
  ]);
  const result = await page.TeLibraryTitleImages.importZip(zip, [activities[0]]);

  assert.equal(result.linkedCount, 1);
  assert.deepEqual([...result.unmatchedFiles], ['xadrez.png']);
  assert.equal(page.document.querySelector('.te-final-visual img').dataset.teIllustrationTitle, 'informacao-ou-opiniao');
});

test('pasta interna é percorrida e pastas, ocultos, __MACOSX e outros tipos são ignorados', async () => {
  const page = createPage(fakeIndexedDB());
  const zip = await createZip(page, [
    { name: 'lote/subpasta', dir: true },
    { name: 'lote/subpasta/informacao-ou-opiniao.jpeg' },
    { name: '__MACOSX/._informacao-ou-opiniao.png' },
    { name: 'lote/.oculta.webp' },
    { name: 'lote/leia-me.txt' }
  ]);
  const files = await page.TeLibraryTitleImages.extractZipImages(zip);

  assert.deepEqual(Array.from(files, file => file.name), ['informacao-ou-opiniao.jpeg']);
});

test('resultado parcial lista exatamente as atividades não encontradas', async () => {
  const page = createPage(fakeIndexedDB());
  const zip = await createZip(page, [
    { name: 'informacao-ou-opiniao.png' },
    { name: 'produzindo-uma-noticia-escolar.png' }
  ]);
  const result = await page.TeLibraryTitleImages.importZip(zip, activities);
  const message = page.TeLibraryTitleImages.importMessage(result);

  assert.match(message, /^2\/3 imagens vinculadas\. Não encontradas:\n\n- Descobrindo informações científicas$/);
});

test('imagem importada do ZIP permanece no IndexedDB após F5', async () => {
  const database = fakeIndexedDB();
  const firstPage = createPage(database, shellMarkup('Informação ou opinião?'));
  const zip = await createZip(firstPage, [{ name: 'informacao-ou-opiniao.png', content: 'persistida' }]);
  await firstPage.TeLibraryTitleImages.importZip(zip, [activities[0]]);

  const reloadedPage = createPage(database, shellMarkup('Informação ou opinião?'));
  const shell = reloadedPage.document.querySelector('.collection-preview-shell');
  assert.equal(await reloadedPage.TeLibraryTitleImages.restoreImage(shell), true);
  assert.equal(shell.querySelector('img').dataset.teIllustrationTitle, 'informacao-ou-opiniao');
});

async function pageWithPersistedImageAndExports() {
  const database = fakeIndexedDB();
  const firstPage = createPage(database, shellMarkup('Informação ou opinião?'));
  const zip = await createZip(firstPage, [{ name: 'informacao-ou-opiniao.png', content: 'word-pdf' }]);
  await firstPage.TeLibraryTitleImages.importZip(zip, [activities[0]]);
  const page = createPage(database, shellMarkup('Informação ou opinião?', { buttons: true }));
  const shell = page.document.querySelector('.collection-preview-shell');
  shell._teFinalData = { visual: '' };
  return { page, shell };
}

test('Word reutiliza automaticamente a imagem persistida sem abrir seletor', async () => {
  const { page, shell } = await pageWithPersistedImageAndExports();
  let pickerOpened = false;
  let exports = 0;
  page.HTMLInputElement.prototype.click = () => { pickerOpened = true; };
  shell.querySelector('.te-final-word').addEventListener('click', () => { exports += 1; });
  shell.querySelector('.te-final-word').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.equal(exports, 1);
  assert.equal(pickerOpened, false);
  assert.match(shell._teFinalData.visual, /^data:image\/png;base64,/);
});

test('PDF reutiliza automaticamente a imagem persistida sem abrir seletor', async () => {
  const { page, shell } = await pageWithPersistedImageAndExports();
  let pickerOpened = false;
  let exports = 0;
  page.HTMLInputElement.prototype.click = () => { pickerOpened = true; };
  shell.querySelector('.te-final-pdf').addEventListener('click', () => { exports += 1; });
  shell.querySelector('.te-final-pdf').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.equal(exports, 1);
  assert.equal(pickerOpened, false);
  assert.match(shell._teFinalData.visual, /^data:image\/png;base64,/);
});

test('interface oferece um único seletor de um arquivo ZIP', async () => {
  const page = createPage(fakeIndexedDB(), shellMarkup('Informação ou opinião?'));
  const api = page.TeLibraryTitleImages;
  page.localStorage.setItem(api.SELECTION_KEY, JSON.stringify([activities[0]]));
  let picker;
  page.HTMLInputElement.prototype.click = function click() { picker = this; };
  api.openZipPicker();
  await api.refresh();

  const buttons = [...page.document.querySelectorAll('#te-illustration-batch-toolbar button')];
  assert.equal(buttons.length, 1);
  assert.equal(buttons[0].textContent, 'Importar ZIP de imagens');
  assert.equal(picker.multiple, false);
  assert.match(picker.accept, /\.zip/);
});

test('nome antigo, numeração e aproximação não substituem imagem estática correta', async () => {
  const page = createPage(fakeIndexedDB(), shellMarkup('Informação ou opinião?', { image: 'static-correct.png' }));
  const zip = await createZip(page, [
    { name: '01-informacao-ou-opiniao.png' },
    { name: 'informacao-opiniao.png' },
    { name: 'te-id-antigo.png' }
  ]);
  const result = await page.TeLibraryTitleImages.importZip(zip, [activities[0]]);

  assert.equal(result.linkedCount, 0);
  assert.deepEqual([...result.missingTitles], ['Informação ou opinião?']);
  assert.match(page.document.querySelector('.te-final-visual img').src, /static-correct\.png$/);
});

test('persistência continua usando somente banco, store e chave por título', () => {
  const page = createPage(fakeIndexedDB());
  const api = page.TeLibraryTitleImages;
  assert.equal(api.DB_NAME, 'TeachEasyIllustrationsByNormalizedTitleV1');
  assert.equal(api.STORE_NAME, 'imagesByNormalizedTitleV1');
  assert.equal(api.SELECTION_KEY, 'te-illustration-title-batch-selection-v1');
  assert.doesNotMatch(source, /TeachEasyIllustrationStore|activityId|illustrationId/);
});
