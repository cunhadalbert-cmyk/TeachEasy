import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { Window } from 'happy-dom';

async function createLibraryPage() {
  const [html, script] = await Promise.all([
    readFile(new URL('../biblioteca.html', import.meta.url), 'utf8'),
    readFile(new URL('../biblioteca.js', import.meta.url), 'utf8')
  ]);
  const window = new Window({ url: 'https://teacheasy.test/biblioteca.html' });
  window.document.write(html);
  window.document.close();

  window.HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function close() {
    this.open = false;
  };

  window.eval(script);
  return window;
}

test('Biblioteca carrega as atividades e o indicador da meta', async () => {
  const window = await createLibraryPage();
  assert.equal(window.document.querySelectorAll('.activity-library-card').length, 26);
  assert.equal(window.document.querySelector('#result-count').textContent, '26');
  assert.equal(window.document.querySelector('.goal-progress').value, 85);
  await window.happyDOM.close();
});

test('Filtros combinados reduzem a lista para a atividade de frações', async () => {
  const window = await createLibraryPage();
  const stage = window.document.querySelector('[name="stage"]');
  const query = window.document.querySelector('[name="query"]');

  stage.value = 'Ensino Fundamental I';
  stage.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.equal(window.document.querySelectorAll('.activity-library-card').length, 12);

  query.value = 'frações';
  query.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.equal(window.document.querySelectorAll('.activity-library-card').length, 1);
  assert.match(window.document.querySelector('.activity-library-card h3').textContent, /Frações/);
  await window.happyDOM.close();
});

test('Visualização contém atividade, gabarito separado e versão adaptada', async () => {
  const window = await createLibraryPage();
  const previewButton = window.document.querySelector('.preview-button');
  previewButton.click();

  const dialog = window.document.querySelector('#activity-preview');
  assert.equal(dialog.open, true);
  assert.match(dialog.textContent, /Gabarito — folha separada/);
  assert.match(dialog.textContent, /Versão adaptada para autismo e inclusão/);
  assert.ok(dialog.querySelectorAll('.worksheet-page').length >= 3);
  await window.happyDOM.close();
});

test('Favoritar e adicionar atualizam o estado da interface', async () => {
  const window = await createLibraryPage();
  window.document.querySelector('.favorite-text-button').click();
  window.document.querySelector('.add-button').click();

  assert.equal(window.document.querySelector('.favorite-button').getAttribute('aria-pressed'), 'true');
  assert.equal(window.document.querySelector('.add-button').getAttribute('aria-pressed'), 'true');
  assert.equal(window.document.querySelector('#selection-count').textContent, '1');
  await window.happyDOM.close();
});
