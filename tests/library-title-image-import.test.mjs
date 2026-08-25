import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { Window } from 'happy-dom';

const source = await readFile(new URL('../library-export-image-sync.js', import.meta.url), 'utf8');
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
          createObjectStore(storeName) {
            stores.set(storeName, new Map());
          },
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

function shellMarkup(title, withButtons = false) {
  return `
    <div class="collection-preview-shell">
      <section class="te-final-student">
        <h1 class="te-final-title">ATIVIDADE DE LÍNGUA PORTUGUESA</h1>
        <h2 class="te-final-subtitle">${title}</h2>
        <div class="te-final-visual"></div>
      </section>
      ${withButtons ? '<button class="te-final-word">Word</button><button class="te-final-pdf">PDF</button>' : ''}
    </div>`;
}

function createPage(database, markup = '') {
  const window = new Window({ url: 'https://teacheasy.test/biblioteca.html' });
  window.indexedDB = database;
  window.alert = () => {};
  window.document.body.innerHTML = `<div id="preview-content">${markup}</div>`;
  window.eval(source);
  openPages.add(window);
  return window;
}

const activities = [
  { topic: 'Informação ou opinião?', normalizedTitle: 'informacao-ou-opiniao' },
  { topic: 'Produzindo uma notícia escolar', normalizedTitle: 'produzindo-uma-noticia-escolar' },
  { topic: 'Descobrindo informações científicas', normalizedTitle: 'descobrindo-informacoes-cientificas' }
];

test('normaliza título e vincula três arquivos em ordem aleatória somente pelo nome', () => {
  const window = createPage(fakeIndexedDB());
  const api = window.TeLibraryTitleImages;
  const files = [
    new window.File(['ciencia'], 'descobrindo-informacoes-cientificas.png', { type: 'image/png' }),
    new window.File(['noticia'], 'PRODUZINDO UMA NOTÍCIA ESCOLAR.jpg', { type: 'image/jpeg' }),
    new window.File(['opiniao'], 'informacao-ou-opiniao.webp', { type: 'image/webp' })
  ];

  assert.equal(api.normalizeTitle('Informação ou opinião?'), 'informacao-ou-opiniao');
  const result = api.matchFiles(files, activities);
  assert.deepEqual([...result.missingTitles], []);
  assert.deepEqual(
    Array.from(result.pairs, pair => [pair.activity.topic, pair.file.name]),
    [
      ['Informação ou opinião?', 'informacao-ou-opiniao.webp'],
      ['Produzindo uma notícia escolar', 'PRODUZINDO UMA NOTÍCIA ESCOLAR.jpg'],
      ['Descobrindo informações científicas', 'descobrindo-informacoes-cientificas.png']
    ]
  );

  const rejected = api.matchFiles(
    [new window.File(['errada'], '01-atividade-antiga.png', { type: 'image/png' })],
    [activities[0]]
  );
  assert.equal(rejected.pairs.length, 0);
  assert.deepEqual([...rejected.missingTitles], ['Informação ou opinião?']);
});

test('importação múltipla persiste por título e restaura as imagens após recarregar', async () => {
  const database = fakeIndexedDB();
  const markup = activities.map(item => shellMarkup(item.topic)).join('');
  const firstPage = createPage(database, markup);
  const files = [
    new firstPage.File(['imagem-c'], 'descobrindo-informacoes-cientificas.png', { type: 'image/png' }),
    new firstPage.File(['imagem-a'], 'informacao-ou-opiniao.png', { type: 'image/png' }),
    new firstPage.File(['imagem-b'], 'produzindo-uma-noticia-escolar.png', { type: 'image/png' })
  ];

  const result = await firstPage.TeLibraryTitleImages.importFiles(files, activities);
  assert.equal(result.linkedCount, 3);
  assert.equal(result.total, 3);
  assert.match(firstPage.document.querySelectorAll('.te-final-visual img')[0].src, /aW1hZ2VtLWE=/);
  assert.match(firstPage.document.querySelectorAll('.te-final-visual img')[1].src, /aW1hZ2VtLWI=/);
  assert.match(firstPage.document.querySelectorAll('.te-final-visual img')[2].src, /aW1hZ2VtLWM=/);

  const reloadedPage = createPage(database, shellMarkup('Informação ou opinião?'));
  const reloadedShell = reloadedPage.document.querySelector('.collection-preview-shell');
  await reloadedPage.TeLibraryTitleImages.restoreImage(reloadedShell);
  assert.match(reloadedShell.querySelector('.te-final-visual img').src, /aW1hZ2VtLWE=/);
  assert.equal(
    reloadedShell.querySelector('.te-final-visual img').dataset.teIllustrationTitle,
    'informacao-ou-opiniao'
  );
});

test('interface usa um único botão, input múltiplo e informa exatamente títulos ausentes', async () => {
  const window = createPage(fakeIndexedDB(), shellMarkup('Informação ou opinião?'));
  const api = window.TeLibraryTitleImages;
  window.localStorage.setItem(api.SELECTION_KEY, JSON.stringify([activities[0]]));
  let picker;
  window.HTMLInputElement.prototype.click = function click() { picker = this; };
  api.openImportPicker();
  await api.refresh();

  const buttons = [...window.document.querySelectorAll('#te-illustration-batch-toolbar button')];
  assert.equal(buttons.length, 1);
  assert.equal(buttons[0].textContent, 'Importar imagens');
  assert.equal(picker.multiple, true);

  const report = api.matchFiles([], activities);
  assert.match(api.importMessage({ ...report, linkedCount: 0, total: 3 }), /Informação ou opinião\?.*Produzindo uma notícia escolar.*Descobrindo informações científicas/s);
});

test('Word e PDF reutilizam automaticamente a imagem persistida sem abrir seletor', async () => {
  const database = fakeIndexedDB();
  const firstPage = createPage(database, shellMarkup('Informação ou opinião?'));
  const file = new firstPage.File(['word-pdf'], 'informacao-ou-opiniao.png', { type: 'image/png' });
  await firstPage.TeLibraryTitleImages.importFiles([file], [activities[0]]);

  const page = createPage(database, shellMarkup('Informação ou opinião?', true));
  const shell = page.document.querySelector('.collection-preview-shell');
  shell._teFinalData = { visual: '' };
  let pickerOpened = false;
  page.HTMLInputElement.prototype.click = () => { pickerOpened = true; };
  let wordExports = 0;
  let pdfExports = 0;
  shell.querySelector('.te-final-word').addEventListener('click', () => { wordExports += 1; });
  shell.querySelector('.te-final-pdf').addEventListener('click', () => { pdfExports += 1; });

  shell.querySelector('.te-final-word').click();
  await new Promise(resolve => setTimeout(resolve, 0));
  shell.querySelector('.te-final-pdf').click();
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.equal(wordExports, 1);
  assert.equal(pdfExports, 1);
  assert.equal(pickerOpened, false);
  assert.match(shell._teFinalData.visual, /d29yZC1wZGY=/);
});

test('persistência nova não consulta banco, store ou chave antigos', () => {
  const window = createPage(fakeIndexedDB());
  const api = window.TeLibraryTitleImages;
  assert.equal(api.DB_NAME, 'TeachEasyIllustrationsByNormalizedTitleV1');
  assert.equal(api.STORE_NAME, 'imagesByNormalizedTitleV1');
  assert.equal(api.SELECTION_KEY, 'te-illustration-title-batch-selection-v1');
  assert.doesNotMatch(source, /TeachEasyIllustrationStore|te-illustration-batch-selection-v6|activityId|illustrationId/);
});
