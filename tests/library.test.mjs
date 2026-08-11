import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { Window } from 'happy-dom';

async function createLibraryPage({ missingAsset = '', url = 'https://teacheasy.test/biblioteca.html' } = {}) {
  const [html, script, scienceCollection, mathCollection, portugueseCollection] = await Promise.all([
    readFile(new URL('../biblioteca.html', import.meta.url), 'utf8'),
    readFile(new URL('../biblioteca.js', import.meta.url), 'utf8'),
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json', import.meta.url), 'utf8'),
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica.json', import.meta.url), 'utf8'),
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json', import.meta.url), 'utf8')
  ]);
  const window = new Window({ url });
  window.document.write(html);
  window.document.close();

  window.HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function close() {
    this.open = false;
  };
  window.__fetchCalls = [];
  window.__assetFetchCalls = [];
  window.__downloadBlob = null;
  window.URL.createObjectURL = blob => {
    window.__downloadBlob = blob;
    return 'blob:teacheasy-test';
  };
  window.URL.revokeObjectURL = () => {};
  window.HTMLAnchorElement.prototype.click = function click() {};
  window.fetch = async path => {
    const collections = {
      'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json': scienceCollection,
      'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica.json': mathCollection,
      'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json': portugueseCollection
    };
    if (collections[path]) window.__fetchCalls.push(path);
    else window.__assetFetchCalls.push(path);
    return {
      ok: Boolean(collections[path]) || (path.startsWith('assets/atividades/') && path !== missingAsset),
      json: async () => JSON.parse(collections[path]),
      blob: async () => new window.Blob(['imagem'], { type: 'image/png' })
    };
  };

  window.eval(script);
  return window;
}

async function createHomePhotoPage() {
  const [html, script] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../photo-activity.js', import.meta.url), 'utf8')
  ]);
  const window = new Window({ url: 'https://teacheasy.test/index.html' });
  window.document.write(html);
  window.document.close();
  window.HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function close() {
    this.open = false;
  };
  window.FileReader = class FileReaderMock {
    readAsDataURL() {
      this.result = 'data:image/png;base64,aW1hZ2Vt';
      queueMicrotask(() => this.onload?.());
    }
  };
  window.fetch = async () => ({ ok: true, json: async () => ({ activity: { title: 'Atividade por foto', summary: 'Atividade original gerada da imagem.', questions: [{ prompt: 'Questão 1' }, { prompt: 'Questão 2' }, { prompt: 'Questão 3' }], answerKey: 'Gabarito orientativo.' } }) });
  window.eval(script);
  return window;
}

async function createInteractiveHomePage() {
  const [html, script] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../script.js', import.meta.url), 'utf8')
  ]);
  const window = new Window({ url: 'https://teacheasy.test/index.html' });
  window.document.write(html);
  window.document.close();
  window.HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function close() {
    this.open = false;
  };
  window.fetch = async () => ({ ok: true, json: async () => ({ activity: { title: 'Ciclo da água', questions: [{ prompt: 'Questão 1' }, { prompt: 'Questão 2' }, { prompt: 'Questão 3' }], answerKey: 'Gabarito orientativo.' } }) });
  window.eval(script);
  return window;
}

async function createHomeAiPage() {
  const [html, script] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../ai-content.js', import.meta.url), 'utf8')
  ]);
  const window = new Window({ url: 'https://teacheasy.test/index.html' });
  window.document.write(html);
  window.document.close();
  window.HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  window.HTMLDialogElement.prototype.close = function close() {
    this.open = false;
  };
  window.fetch = async () => ({ ok: true, json: async () => ({ activity: { title: 'Ciclo da água', illustrationDataUrl: 'data:image/png;base64,aW1hZ2Vt', questions: [{ prompt: 'Questão 1' }, { prompt: 'Questão 2' }, { prompt: 'Questão 3' }], answerKey: 'Gabarito orientativo.' } }) });
  window.eval(script);
  return window;
}

function clickChoice(window, text) {
  const choice = [...window.document.querySelectorAll('.library-choice-card')]
    .find(card => card.textContent.includes(text));
  assert.ok(choice, `Cartão "${text}" não encontrado`);
  choice.click();
}

function openActivities(window, stage, grade, term = '1º bimestre') {
  clickChoice(window, stage);
  clickChoice(window, grade);
  clickChoice(window, term);
}

function attachReferenceImage(window) {
  const input = window.document.querySelector('#photo-reference');
  const file = new window.File(['imagem demonstrativa'], 'referencia.png', { type: 'image/png' });
  Object.defineProperty(input, 'files', { configurable: true, value: [file] });
}

test('Biblioteca começa com a categoria de autismo separada das quatro etapas', async () => {
  const window = await createLibraryPage();
  assert.equal(window.document.querySelectorAll('.library-choice-card').length, 5);
  assert.equal(window.document.querySelector('#library-step-title').textContent, 'Escolha uma categoria ou etapa');
  assert.equal(window.document.querySelectorAll('.choice-symbol').length, 0);
  assert.deepEqual(
    [...window.document.querySelectorAll('.library-choice-card')].map(card => card.dataset.theme),
    ['autismo', 'infantil', 'iniciais', 'finais', 'medio']
  );
  assert.match(window.document.querySelector('[data-theme="autismo"]').textContent, /Autismo e inclusão|apoio visual/i);
  assert.equal(window.document.querySelector('.library-filters').hidden, true);
  assert.equal(window.document.querySelector('.library-pagination').hidden, true);
  assert.equal(window.document.querySelector('.library-back').hidden, true);
  assert.equal(window.document.querySelector('#activity-grid').hidden, true);
  assert.equal(window.document.querySelectorAll('.activity-library-card').length, 0);
  assert.equal(window.document.querySelector('.library-goal-card'), null);
  assert.equal(window.document.querySelector('#photo-activity-launcher'), null);
  assert.match(window.document.body.textContent, /10.740 atividades educacionais/);
  await window.happyDOM.close();
});

test('Destaque da Biblioteca fica na página inicial junto aos quatro serviços', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const window = new Window({ url: 'https://teacheasy.test/index.html' });
  window.document.write(html);
  window.document.close();

  const section = window.document.querySelector('#solucoes');
  const heading = section.querySelector('.initial-services-heading');
  const highlight = section.querySelector('.home-library-highlight');
  const coloringButton = section.querySelector('.home-coloring-highlight');
  assert.equal(highlight.getAttribute('href'), 'biblioteca.html');
  assert.match(highlight.textContent, /Biblioteca de Atividades/);
  assert.match(highlight.textContent, /Encontre atividades prontas por etapa, ano e bimestre/);
  assert.equal(highlight.querySelectorAll('.home-library-illustration').length, 1);
  assert.equal(highlight.querySelector('.home-library-arrow'), null);
  const autismCategory = section.querySelector('.home-autism-highlight');
  assert.ok(autismCategory);
  assert.equal(autismCategory.getAttribute('href'), 'biblioteca.html?categoria=autismo');
  assert.match(autismCategory.textContent, /Atividades para autismo|CATEGORIA INCLUSIVA/);
  assert.ok(Boolean(highlight.compareDocumentPosition(autismCategory) & window.Node.DOCUMENT_POSITION_FOLLOWING));
  assert.ok(Boolean(heading.compareDocumentPosition(highlight) & window.Node.DOCUMENT_POSITION_FOLLOWING));
  assert.ok(coloringButton);
  assert.equal(coloringButton.tagName, 'BUTTON');
  assert.equal(window.document.querySelectorAll('.home-library-highlight').length, 1);
  assert.equal(window.document.querySelectorAll('a[href="biblioteca.html"]').length, 1);
  await window.happyDOM.close();
});

test('Atalhos da página inicial abrem as experiências aprovadas', async () => {
  const window = await createInteractiveHomePage();
  const coloringButton = window.document.querySelector('.home-coloring-highlight');
  assert.ok(coloringButton);
  assert.equal(coloringButton.tagName, 'BUTTON');
  assert.equal(coloringButton.getAttribute('type'), 'button');
  assert.equal(window.document.querySelectorAll('.initial-service-card').length, 0);
  assert.equal(window.document.querySelectorAll('.service-number').length, 0);
  assert.match(coloringButton.textContent, /Desenhos para colorir/);

  // Biblioteca, Jogos Pedagógicos e criação com IA usam acessos próprios.
  assert.equal(window.document.querySelectorAll('.home-library-highlight').length, 1);
  const gamesLink = window.document.querySelector('.home-games-highlight');
  assert.ok(gamesLink);
  assert.equal(gamesLink.getAttribute('href'), 'public/jogos-pedagogicos/jogos.html');
  assert.equal(window.document.querySelectorAll('[data-service="games-demo"]').length, 0);
  assert.equal(window.document.querySelectorAll('#ai-content-launcher').length, 1);

  const dialog = window.document.querySelector('#service-dialog');
  coloringButton.click();
  assert.equal(dialog.open, true);
  assert.equal(dialog.querySelectorAll('.demo-category').length, 7);
  assert.match(dialog.textContent, /Surpreenda-me/);
  await window.happyDOM.close();
});

test('Criar com a IA é uma função real e distinta das três experiências existentes', async () => {
  const window = await createHomeAiPage();
  const launcher = window.document.querySelector('#ai-content-launcher');
  const dialog = window.document.querySelector('#ai-content-dialog');
  assert.match(launcher.closest('.ai-content-feature').textContent, /Criar com a IA/);
  assert.match(launcher.textContent, /Fazer solicitação/);
  assert.equal(window.document.querySelectorAll('#ai-content-launcher').length, 1);
  assert.doesNotMatch(launcher.closest('.ai-content-feature').textContent, /Biblioteca de Atividades|Veja a IA criando/);

  launcher.click();
  assert.equal(dialog.open, true);
  const form = window.document.querySelector('#ai-content-form');
  assert.equal(form.elements.materialType.options.length, 9);
  assert.equal(form.elements.request.required, false);
  ['materialType', 'stage', 'grade', 'subject', 'topic'].forEach(name => assert.equal(form.elements[name].required, false));
  assert.match(form.elements.request.placeholder, /ciclo da água/);
  assert.equal(form.elements.notes, undefined);
  assert.equal(form.elements.school, undefined);
  assert.equal(form.elements.teacher, undefined);
  assert.equal(form.elements.student, undefined);
  assert.equal(form.elements.classroom, undefined);
  assert.equal(form.elements.date, undefined);
  assert.doesNotMatch(form.textContent, /Conte para a IA o que você precisa|Observações adicionais|Cabeçalho escolar opcional/);
  const headerFile = form.elements.schoolHeader;
  assert.equal(headerFile.getAttribute('accept'), '.png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf');
  assert.match(form.querySelector('.ai-school-header-upload').textContent, /Cabeçalho da escola|Selecionar cabeçalho|Remover arquivo/);
  assert.equal(form.querySelector('#ai-header-file-preview').hidden, true);
  assert.equal(form.querySelector('#ai-use-school-header').checked, true);

  form.elements.request.value = 'Crie uma atividade de Ciências sobre o ciclo da água.';
  form.elements.materialType.value = 'Atividade';
  form.elements.stage.value = 'Ensino Fundamental — Anos Iniciais';
  form.elements.grade.value = '4º ano';
  form.elements.subject.value = 'Ciências';
  form.elements.topic.value = 'Ciclo da água';
  form.elements.questionCount.value = '3';
  form.elements.figures.checked = true;
  form.elements.answerKey.checked = true;
  form.elements.adapted.checked = true;
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise(resolve => setTimeout(resolve, 0));

  const preview = window.document.querySelector('#ai-content-preview');
  assert.equal(preview.hidden, false);
  assert.equal(preview.querySelectorAll('.generated-questions li').length, 3);
  assert.equal(preview.querySelectorAll('.generated-standard-header').length, 1);
  assert.equal(preview.querySelectorAll('.generated-figure img').length, 1);
  assert.equal(preview.querySelectorAll('.generated-answer-key-page').length, 1);
  assert.match(preview.textContent, /Gabarito|Versão adaptada para inclusão/);
  assert.match(preview.textContent, /Editar conteúdo|Pedir alteração à IA|Gerar novamente|Baixar em PDF|Baixar em Word/);
  assert.doesNotMatch(window.document.querySelector('#ai-preview-document').textContent, /TeachEasy|propaganda|marca d’água/i);
  await window.happyDOM.close();
});

test('Banner Criar com a IA segue o padrão vinho e mantém botão amarelo acessível', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.ai-content-feature\s*\{[^}]*min-height:\s*210px[^}]*border-radius:\s*34px[^}]*linear-gradient\(90deg,\s*#4a0715 0%,\s*#7a1730 48%,\s*#a34058 100%\)/s);
  assert.match(css, /\.ai-content-launcher\s*\{[^}]*linear-gradient\(135deg,\s*#ffd75a 0%,\s*#f4b928 100%\)[^}]*color:\s*#4a0715/s);
  assert.match(css, /\.ai-content-launcher:focus-visible\s*\{[^}]*outline:/s);
});

test('Topo, rodapé e banners usam gradientes vinho com contraste claro', async () => {
  const [css, photoCss] = await Promise.all([
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
    readFile(new URL('../photo-activity.css', import.meta.url), 'utf8')
  ]);
  assert.match(css, /body:not\(\.library-page\) \.site-header\s*\{[^}]*linear-gradient\(180deg,\s*#3b0714 0%,\s*#5b1022 50%,\s*#7d2639 100%\)/s);
  assert.match(css, /body:not\(\.library-page\) \.footer\s*\{[^}]*linear-gradient\(180deg,\s*#3b0714 0%,\s*#5b1022 50%,\s*#7d2639 100%\)/s);
  assert.match(css, /\.home-library-highlight\s*\{[^}]*linear-gradient\(90deg,\s*#4a0715 0%,\s*#7a1730 48%,\s*#a34058 100%\)/s);
  assert.match(photoCss, /\.photo-activity-launcher\s*\{[^}]*linear-gradient\(90deg,\s*#4a0715 0%,\s*#7a1730 48%,\s*#a34058 100%\)/s);
});

test('HTML final não contém IDs duplicados, links vazios ou textos substituídos', async () => {
  for (const file of ['index.html', 'biblioteca.html']) {
    const html = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${file} contém IDs duplicados`);
    assert.doesNotMatch(html, /href="#"/);
    assert.doesNotMatch(html, /\uFFFD|Educa\?\?|navega\?\?/i);
  }

  const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(home, /COMECE PELO QUE VOCÊ MAIS PRECISA/);
  assert.match(home, /Recursos e categorias para facilitar a sua rotina/);
  assert.match(home, /Mais tempo para o que realmente importa: você\./);
  assert.doesNotMatch(home, /FEITO PARA PROFESSORES|Conheça a plataforma|NOSSOS SERVIÇOS|Tudo o que você precisa, em um só lugar/);
});

test('HTML, JavaScript e JSON permanecem em UTF-8 sem textos corrompidos', async () => {
  const collectJsonFiles = async directory => {
    const files = [];
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const entryUrl = new URL(entry.name, directory);
      if (entry.isDirectory()) {
        files.push(...await collectJsonFiles(new URL(`${entry.name}/`, directory)));
      } else if (entry.name.endsWith('.json')) {
        files.push(entryUrl);
      }
    }

    return files;
  };

  const sourceFiles = [
    'index.html',
    'biblioteca.html',
    'script.js',
    'biblioteca.js',
    'biblioteca-fixes.js',
    'photo-activity.js',
    'ai-content.js',
    'package.json'
  ].map(file => new URL(`../${file}`, import.meta.url));
  sourceFiles.push(new URL('./library.test.mjs', import.meta.url));
  sourceFiles.push(...await collectJsonFiles(new URL('../data/', import.meta.url)));

  const windows1252Continuation = '\u0080-\u00BF\u0192\u02C6\u02DC\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u2013\u2014\u2018\u2019\u201A\u201C\u201D\u201E\u2020\u2021\u2022\u2026\u2030\u2039\u203A\u20AC\u2122';
  const mojibake = new RegExp(`(?:\\u00C2|\\u00C3|\\u00E2|\\u00F0)[${windows1252Continuation}]|\\uFFFD`, 'u');

  for (const file of sourceFiles) {
    const bytes = await readFile(file);
    assert.notDeepEqual([...bytes.subarray(0, 3)], [0xEF, 0xBB, 0xBF], `${file.pathname} contém BOM`);
    assert.doesNotMatch(bytes.toString('utf8'), mojibake, `${file.pathname} contém texto corrompido`);
  }

  for (const file of ['index.html', 'biblioteca.html']) {
    const html = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(html, /^<!DOCTYPE html>[\s\S]*?<head>\s*<meta charset="UTF-8">/);
  }
});

test('Links da Biblioteca e responsividade principal permanecem definidos', async () => {
  const [html, css, photoCss, libraryCss] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
    readFile(new URL('../photo-activity.css', import.meta.url), 'utf8'),
    readFile(new URL('../biblioteca.css', import.meta.url), 'utf8')
  ]);
  assert.equal((html.match(/href="biblioteca\.html"/g) || []).length, 1);
  assert.match(css, /@media \(max-width:\s*980px\)/);
  assert.match(css, /@media \(max-width:\s*680px\)/);
  assert.match(photoCss, /@media \(max-width:\s*680px\)/);
  assert.match(libraryCss, /@media \(max-width:\s*680px\)/);
});

test('Assets restantes possuem referência no projeto', async () => {
  const assetNames = (await readdir(new URL('../assets/', import.meta.url)))
    .filter(asset => asset !== 'photo-activity-illustration.png');
  const sources = await Promise.all(
    ['index.html', 'biblioteca.html', 'styles.css', 'biblioteca.css', 'photo-activity.css', 'script.js']
      .map(file => readFile(new URL(`../${file}`, import.meta.url), 'utf8'))
  );
  const combined = sources.join('\n');
  assetNames.forEach(asset => assert.match(combined, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))));
});

test('Seção sobre mostra o fluxo da IA até a Biblioteca e preserva o texto', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const window = new Window({ url: 'https://teacheasy.test/index.html' });
  window.document.write(html);
  window.document.close();

  const section = window.document.querySelector('#sobre');
  const workflow = section.querySelector('.teacheasy-workflow');
  assert.equal(workflow.querySelector('img').getAttribute('src'), 'assets/fluxo-teacheasy.png');
  assert.equal(workflow.querySelector('figcaption'), null);
  assert.doesNotMatch(workflow.textContent, /A IA cria|O professor revisa|A Biblioteca organiza/);
  const copy = section.querySelector('.split-copy');
  assert.match(copy.textContent, /Mais tempo para o que realmente importa: você/);
  assert.doesNotMatch(copy.textContent, /FEITO PARA PROFESSORES|Conheça a plataforma/);
  assert.match(copy.textContent, /O TeachEasy usa inteligência artificial para ajudar professores/);
  assert.equal(copy.querySelectorAll('.check-list li').length, 4);
  assert.equal(section.querySelector('.teacher-placeholder'), null);
  await window.happyDOM.close();
});

test('Foto da professora usa movimento lateral suave e acessível', async () => {
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.teacheasy-workflow img\s*\{[^}]*width:\s*110%[^}]*animation:\s*teacherImagePan 12s ease-in-out -3s infinite alternate/s);
  assert.match(css, /@keyframes teacherImagePan\s*\{[^}]*translateX\(-7%\)[\s\S]*translateX\(-2%\)/s);
  assert.match(css, /\.teacheasy-workflow:hover img\s*\{[^}]*animation-play-state:\s*paused/s);
  assert.match(css, /@media \(max-width:\s*768px\)[\s\S]*\.teacheasy-workflow img\s*\{[^}]*width:\s*105%[^}]*animation-duration:\s*18s/s);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.teacheasy-workflow img\s*\{[^}]*width:\s*100%[^}]*animation:\s*none !important/s);
});

test('Página inicial não exibe a seção antiga de serviços', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const window = new Window({ url: 'https://teacheasy.test/index.html' });
  window.document.write(html);
  window.document.close();

  assert.equal(window.document.querySelector('#recursos'), null);
  assert.equal(window.document.querySelectorAll('.service-grid .service-card').length, 0);
  assert.doesNotMatch(window.document.body.textContent, /NOSSOS SERVIÇOS|Tudo o que você precisa, em um só lugar/);
  assert.ok(window.document.querySelector('#sobre').nextElementSibling.classList.contains('stats'));
  await window.happyDOM.close();
});

test('Cabeçalho da Biblioteca participa do fluxo da página', async () => {
  const css = await readFile(new URL('../biblioteca.css', import.meta.url), 'utf8');
  assert.match(css, /\.library-header\s*\{[^}]*position:\s*relative/s);
  assert.match(css, /\.library-page \[hidden\]\s*\{[^}]*display:\s*none !important/s);
});

test('Hero usa destaques inline e não exibe chips em bloco separado', async () => {
  const window = await createLibraryPage();
  const description = window.document.querySelector('.library-hero-description');
  assert.match(description.textContent, /atividade ideal com/);
  assert.equal(description.querySelectorAll('.library-hero-highlights > span').length, 4);
  assert.equal(window.document.querySelector('.library-hero-tags'), null);
  assert.match(description.textContent, /BNCC\s*\|\s*Gabaritos\s*\|\s*Figuras\s*\|\s*Inclusão/);
  await window.happyDOM.close();
});

test('Seção de etapas usa fundo branco, sombras e rodapé vinho', async () => {
  const css = await readFile(new URL('../biblioteca.css', import.meta.url), 'utf8');
  assert.match(css, /\.library-page\s*\{[^}]*background:\s*#fff/s);
  assert.match(css, /\.library-content\s*\{[^}]*background:\s*#fff/s);
  assert.match(css, /\.library-choice-card\s*\{[^}]*0 14px 30px rgba\(0, 0, 0, \.18\)/s);
  assert.match(css, /\.library-choice-card strong\s*\{[^}]*text-shadow:\s*0 2px 6px rgba\(0, 0, 0, \.18\)/s);
  assert.match(css, /\.library-footer\s*\{[^}]*linear-gradient\(/s);
});

test('Criar com foto fica como opção menor dentro de Criar com a IA', async () => {
  const window = await createHomePhotoPage();
  const dialog = window.document.querySelector('#photo-activity-dialog');
  const option = window.document.querySelector('#ai-photo-option');
  assert.equal(dialog.open, false);
  assert.ok(option);
  assert.match(option.textContent, /Criar com foto/);
  assert.equal(window.document.querySelector('#photo-activity-launcher'), null);
  await window.happyDOM.close();
});

test('Criação por foto exige uma imagem JPG ou PNG', async () => {
  const window = await createHomePhotoPage();
  const form = window.document.querySelector('#photo-activity-form');
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(window.document.querySelector('#photo-generated-preview').hidden, true);
  assert.equal(window.document.querySelector('#photo-form-error').hidden, false);
  assert.match(window.document.querySelector('#photo-form-error').textContent, /JPG, JPEG ou PNG/);
  await window.happyDOM.close();
});

test('Imagem gera prévia com cabeçalho padrão e gabarito separado', async () => {
  const window = await createHomePhotoPage();
  const form = window.document.querySelector('#photo-activity-form');
  attachReferenceImage(window);
  form.elements.grade.value = '3º ano';
  form.elements.questionCount.value = '3';
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise(resolve => setTimeout(resolve, 0));

  const preview = window.document.querySelector('#photo-generated-preview');
  const schoolHeader = window.document.querySelector('#school-header');
  assert.equal(preview.hidden, false);
  assert.equal(preview.querySelectorAll('.photo-question-list li').length, 3);
  assert.match(preview.textContent, /Atividade original gerada da imagem/);
  assert.equal(schoolHeader.hidden, false);
  assert.match(schoolHeader.textContent, /ESCOLA:|Nome:|Turma:|Data:/);
  assert.equal(preview.querySelectorAll('.photo-generated-figure img').length, 1);
  assert.equal(preview.querySelectorAll('.photo-answer-key-page').length, 1);
  await window.happyDOM.close();
});

test('Navegação progressiva abre ano, bimestre e só então os filtros', async () => {
  const window = await createLibraryPage();
  clickChoice(window, 'Anos Iniciais');
  assert.equal(window.document.querySelectorAll('.library-choice-card').length, 5);
  assert.equal(window.document.querySelector('.library-filters').hidden, true);
  assert.equal(window.document.querySelector('.library-back').hidden, false);
  clickChoice(window, '5º ano');
  assert.equal(window.document.querySelectorAll('.library-choice-card').length, 4);
  assert.equal(window.document.querySelector('.library-filters').hidden, true);
  clickChoice(window, '1º bimestre');
  assert.equal(window.document.querySelector('.library-filters').hidden, false);
  assert.ok(window.document.querySelectorAll('.activity-library-card').length <= 5);
  assert.equal(window.document.querySelector('.library-pagination').hidden, true);
  await window.happyDOM.close();
});

test('Categoria de autismo abre somente as atividades adaptadas dentro do card', async () => {
  const window = await createLibraryPage({ url: 'https://teacheasy.test/biblioteca.html?categoria=autismo' });
  assert.equal(window.document.querySelector('#autism-category-banner').hidden, false);
  assert.match(window.document.querySelector('#autism-category-title').textContent, /Atividades adaptadas para autismo/);
  assert.match(window.document.querySelector('#library-breadcrumb').textContent, /Autismo e inclusão/);
  assert.equal(window.document.querySelectorAll('.library-choice-card').length, 0);
  assert.equal(window.document.querySelector('.library-choice-grid').hidden, true);
  assert.equal(window.document.querySelector('.library-toolbar').hidden, true);
  assert.equal(window.document.querySelector('[name="adapted"]').checked, true);
  assert.equal(window.document.querySelector('[name="adapted"]').disabled, true);
  const featuredSection = window.document.querySelector('#autism-featured-section');
  assert.equal(featuredSection.hidden, false);
  assert.equal(featuredSection.closest('#autism-category-banner'), window.document.querySelector('#autism-category-banner'));
  assert.equal(featuredSection.querySelectorAll('.autism-featured-card').length, 8);
  assert.deepEqual(
    [...new Set([...featuredSection.querySelectorAll('.autism-featured-card')]
      .map(card => card.dataset.featuredStage))],
    ['Educação Infantil', 'Ensino Fundamental I', 'Ensino Fundamental II', 'Ensino Médio']
  );
  featuredSection.querySelector('.preview-button').click();
  assert.match(window.document.querySelector('#activity-preview').textContent, /Versão adaptada para autismo e inclusão/);
  window.document.querySelector('.preview-close').click();
  await window.happyDOM.close();
});

test('Cartão de autismo abre e fecha sem misturar as etapas escolares', async () => {
  const window = await createLibraryPage();
  clickChoice(window, 'Autismo e inclusão');
  assert.equal(window.document.querySelector('#autism-category-banner').hidden, false);
  assert.equal(window.document.querySelectorAll('.library-choice-card').length, 0);
  assert.equal(window.document.querySelector('#autism-featured-section').hidden, false);
  assert.equal(window.document.querySelector('.library-toolbar').hidden, true);
  assert.equal(window.document.querySelector('.library-back').hidden, false);
  window.document.querySelector('.library-back').click();
  assert.equal(window.document.querySelector('#autism-category-banner').hidden, true);
  assert.equal(window.document.querySelectorAll('.library-choice-card').length, 5);
  assert.equal(window.document.querySelector('.library-toolbar').hidden, false);
  await window.happyDOM.close();
});

test('Inicialização complementar preserva a navegação e não abre atividades antes da escolha', async () => {
  const fixesScript = await readFile(new URL('../biblioteca-fixes.js', import.meta.url), 'utf8');
  assert.match(fixesScript, /renderNavigation\(\);\s*\}\)\(\);\s*$/);
  assert.doesNotMatch(fixesScript, /renderActivities\(\);\s*\}\)\(\);\s*$/);
});

test('Página inicial e Biblioteca versionam os arquivos da categoria de autismo', async () => {
  const [home, library] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../biblioteca.html', import.meta.url), 'utf8')
  ]);
  assert.match(home, /styles\.css\?v=20260808-material-v3/);
  assert.match(library, /styles\.css\?v=20260807-autismo-v3/);
  assert.match(library, /biblioteca\.css\?v=20260807-autismo-v4/);
  assert.match(library, /biblioteca\.js\?v=20260807-autismo-v4/);
  assert.match(library, /biblioteca-fixes\.js\?v=20260807-autismo-v3/);
});

test('Visualização contém atividade, gabarito separado e versão adaptada', async () => {
  const window = await createLibraryPage();
  openActivities(window, 'Educação Infantil', 'Maternal');
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
  openActivities(window, 'Educação Infantil', 'Maternal');
  window.document.querySelector('.favorite-text-button').click();
  window.document.querySelector('.add-button').click();

  assert.equal(window.document.querySelector('.favorite-button').getAttribute('aria-pressed'), 'true');
  assert.equal(window.document.querySelector('.add-button').getAttribute('aria-pressed'), 'true');
  assert.equal(window.document.querySelector('#selection-count').textContent, '1');
  await window.happyDOM.close();
});

test('Autismo e inclusão aparecem em todas as etapas', async () => {
  for (const [stage, grade] of [
    ['Educação Infantil', 'Maternal'],
    ['Anos Iniciais', '1º ano'],
    ['Anos Finais', '6º ano'],
    ['Ensino Médio', '1ª série']
  ]) {
    const window = await createLibraryPage();
    openActivities(window, stage, grade);
    const card = window.document.querySelector('.activity-library-card');
    assert.ok(card);
    assert.match(card.textContent, /Versão adaptada/);
    await window.happyDOM.close();
  }
});

test('Coleção de Ciências possui schema válido, cinco atividades e referências consistentes', async () => {
  const raw = await readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json', import.meta.url), 'utf8');
  const collection = JSON.parse(raw);
  assert.equal(collection.schemaVersion, '1.0');
  assert.equal(collection.colecao, '4ano-3bimestre-ciencias');
  assert.equal(collection.idioma, 'pt-BR');
  assert.equal(collection.atividades.length, 5);
  assert.equal(new Set(collection.atividades.map(activity => activity.id)).size, 5);

  collection.atividades.forEach(activity => {
    assert.ok(['facil', 'intermediaria', 'desafiadora'].includes(activity.dificuldade));
    assert.equal(activity.questoes.length, 6);
    assert.equal(activity.gabarito.length, 6);
    assert.ok(activity.instrucaoGeral);
    assert.ok(activity.textoApoio.titulo);
    assert.ok(activity.textoApoio.conteudo);
    const figureIds = new Set(activity.figuras.map(figure => figure.id));
    activity.questoes.forEach(question => {
      if (question.figuraId) assert.ok(figureIds.has(question.figuraId));
    });
  });

  const healthActivity = collection.atividades.find(activity => activity.id === 'efi-4ano-b3-cie-microrganismos-saude-b');
  const answerSix = healthActivity.gabarito.find(answer => answer.numero === 6);
  assert.match(answerSix.resposta, /lavar as mãos antes do lanche.*transmissão pelas mãos/s);
  assert.match(answerSix.resposta, /gotículas no ar/);
  assert.match(answerSix.resposta, /água ou alimentos contaminados/);
  assert.doesNotMatch(answerSix.resposta, /compartilhar copo|compartilhamento de copos/i);
});

test('Ciências do 4º ano totaliza 30 atividades e 180 questões', async () => {
  const [baseRaw, extraRaw] = await Promise.all([
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json', import.meta.url), 'utf8'),
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias-extra.json', import.meta.url), 'utf8')
  ]);
  const base = JSON.parse(baseRaw);
  const extra = JSON.parse(extraRaw);
  const activities = [...base.atividades, ...extra.atividades];
  const ids = activities.map(activity => activity.id);

  assert.equal(base.atividades.length, 5);
  assert.equal(extra.atividades.length, 25);
  assert.equal(activities.length, 30);
  assert.equal(new Set(ids).size, 30);
  assert.equal(activities.reduce((total, activity) => total + activity.questoes.length, 0), 180);
  assert.equal(activities.reduce((total, activity) => total + activity.gabarito.length, 0), 180);
});

test('Ciências é carregada somente após etapa, ano, bimestre e disciplina', async () => {
  const window = await createLibraryPage();
  openActivities(window, 'Anos Iniciais', '4º ano', '3º bimestre');
  assert.equal(window.__fetchCalls.length, 0);

  const subject = window.document.querySelector('#library-filters select[name="subject"]');
  subject.value = 'Ciências';
  subject.dispatchEvent(new window.Event('input', { bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.deepEqual(window.__fetchCalls, ['data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json']);
  const cards = [...window.document.querySelectorAll('.activity-library-card')];
  assert.equal(cards.length, 5);
  assert.ok(cards.every(card => /Fácil|Intermediária|Desafiadora/.test(card.textContent)));

  cards[0].querySelector('.preview-button').click();
  const preview = window.document.querySelector('#activity-preview');
  assert.equal(preview.querySelectorAll('.collection-question-list > li').length, 6);
  assert.ok(preview.querySelector('.support-text h2').textContent);
  assert.equal(preview.querySelector('.figure-production-review'), null);
  const figure = preview.querySelector('.question-figure');
  assert.ok(figure);
  assert.equal(figure.getAttribute('src'), 'assets/atividades/ciencias/figura-01.png');
  assert.doesNotMatch(preview.querySelector('.collection-student-page').textContent, /Figura pendente de produção|Sequência de quatro desenhos/);
  assert.ok(preview.querySelector('.collection-answer-key'));
  await window.happyDOM.close();
});

test('Impressão da coleção usa A4 e gabarito separado sem marca promocional', async () => {
  const css = await readFile(new URL('../biblioteca.css', import.meta.url), 'utf8');
  assert.match(css, /@page\s*\{[^}]*size:\s*A4 portrait;[^}]*margin:\s*15mm/s);
  assert.match(css, /\.collection-student-page,[\s\S]*font-family:\s*Arial,\s*sans-serif;[\s\S]*font-size:\s*12pt;[\s\S]*line-height:\s*1\.3/s);
  assert.match(css, /\.collection-student-page h1\s*\{[^}]*font-size:\s*18pt/s);
  assert.match(css, /\.question-alternatives\s*\{[^}]*font-size:\s*12pt/s);
  assert.match(css, /\.collection-answer-key\s*\{[^}]*break-before:\s*page;[^}]*font-size:\s*11pt/s);
  const script = await readFile(new URL('../biblioteca.js', import.meta.url), 'utf8');
  assert.doesNotMatch(script.match(/function openCollectionPreview[\s\S]*?function resetFilters/)[0], /worksheet-brand|logotipo|marca-d’água|publicidade|rodapé promocional/i);
});

test('Lote de Matemática e Língua Portuguesa preserva 60 atividades e 360 questões', async () => {
  const files = [
    ['matematica.json', '4ano-3bimestre-matematica', 'Matemática', 20, 120],
    ['matematica-extra.json', '4ano-3bimestre-matematica-extra', 'Matemática', 10, 60],
    ['lingua-portuguesa.json', '4ano-3bimestre-lingua-portuguesa', 'Língua Portuguesa', 20, 120],
    ['lingua-portuguesa-extra.json', '4ano-3bimestre-lingua-portuguesa-extra', 'Língua Portuguesa', 10, 60]
  ];
  const allIds = [];
  let totalQuestions = 0;

  for (const [filename, collectionId, subject, activityCount, questionCount] of files) {
    const raw = await readFile(new URL(`../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/${filename}`, import.meta.url), 'utf8');
    assert.doesNotMatch(raw, /\uFFFD/);
    const collection = JSON.parse(raw);
    assert.equal(collection.schemaVersion, '1.0');
    assert.equal(collection.colecao, collectionId);
    assert.equal(collection.idioma, 'pt-BR');
    assert.equal(collection.disciplina, subject);
    assert.equal(collection.atividades.length, activityCount);
    assert.equal(collection.atividades.reduce((total, activity) => total + activity.questoes.length, 0), questionCount);

    collection.atividades.forEach(activity => {
      allIds.push(activity.id);
      totalQuestions += activity.questoes.length;
      assert.equal(activity.quantidadeQuestoes, 6);
      assert.equal(activity.questoes.length, 6);
      assert.equal(activity.gabarito.length, 6);
      assert.deepEqual(activity.questoes.map(question => question.numero), [1, 2, 3, 4, 5, 6]);
      assert.deepEqual(activity.gabarito.map(answer => answer.numero), [1, 2, 3, 4, 5, 6]);
      const figureIds = new Set(activity.figuras.map(figure => figure.id));
      activity.questoes.forEach(question => {
        if (question.figuraId) assert.ok(figureIds.has(question.figuraId));
      });
    });
  }

  assert.equal(allIds.length, 60);
  assert.equal(new Set(allIds).size, 60);
  assert.equal(totalQuestions, 360);
});

test('Matemática possui 30 atividades autorais, 180 questões e figuras válidas', async () => {
  const [raw, extraRaw] = await Promise.all([
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica.json', import.meta.url), 'utf8'),
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica-extra.json', import.meta.url), 'utf8')
  ]);
  assert.doesNotMatch(raw, /\uFFFD/);
  assert.doesNotMatch(extraRaw, /\uFFFD/);
  const collection = JSON.parse(raw);
  const extraCollection = JSON.parse(extraRaw);
  const activities = [...collection.atividades, ...extraCollection.atividades];
  const ids = activities.map(activity => activity.id);
  const titles = activities.map(activity => activity.titulo.trim().toLocaleLowerCase('pt-BR'));
  const normalizedPrompts = activities.flatMap(activity =>
    activity.questoes.map(question =>
      question.enunciado.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR')
    )
  );

  assert.equal(activities.length, 30);
  assert.equal(activities.reduce((total, activity) => total + activity.questoes.length, 0), 180);
  assert.equal(new Set(ids).size, 30);
  assert.equal(new Set(titles).size, 30);
  assert.equal(new Set(normalizedPrompts).size, 180);

  for (const activity of activities) {
    assert.equal(activity.quantidadeQuestoes, 6);
    assert.equal(activity.questoes.length, 6);
    assert.equal(activity.gabarito.length, 6);
    assert.ok(activity.objetivo.trim());
    assert.ok(activity.instrucaoGeral.trim());
    assert.ok(['facil', 'intermediaria', 'desafiadora'].includes(activity.dificuldade));
    assert.ok(activity.bncc.length > 0);
    assert.deepEqual(activity.questoes.map(question => question.numero), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(activity.gabarito.map(answer => answer.numero), [1, 2, 3, 4, 5, 6]);

    const figureIds = new Set(activity.figuras.map(figure => figure.id));
    assert.equal(figureIds.size, activity.figuras.length);
    for (const figure of activity.figuras) {
      assert.ok(figure.id);
      assert.match(figure.arquivo, /^assets\/atividades\/matematica\/[^/]+\.svg$/);
      assert.ok(figure.descricao);
      assert.ok(figure.funcaoPedagogica);
      assert.ok(figure.posicaoSugerida);
      assert.ok(figure.textoAlternativo);
      assert.equal(figure.compativelPretoBranco, true);
      const image = await readFile(new URL(`../${figure.arquivo}`, import.meta.url), 'utf8');
      assert.match(image, /^<svg[\s>]/);
      assert.ok(image.length > 500);
    }

    for (const question of activity.questoes) {
      assert.ok(question.espacoResposta);
      if (question.figuraId) assert.ok(figureIds.has(question.figuraId));
    }
  }

  const libraryScript = await readFile(new URL('../biblioteca.js', import.meta.url), 'utf8');
  const fixesScript = await readFile(new URL('../biblioteca-fixes.js', import.meta.url), 'utf8');
  assert.match(libraryScript, /'Matemática':\s*\{[\s\S]*?count:\s*20,/);
  assert.match(fixesScript, /EXPECTED_MATH_ACTIVITIES\s*=\s*30/);
  assert.match(fixesScript, /collectionRegistry\['Matemática'\]\.extraPath\s*=\s*'data\/atividades\/fundamental-anos-iniciais\/4-ano\/3-bimestre\/matematica-extra\.json'/);
});

test('Língua Portuguesa possui 30 atividades autorais, 180 questões e figuras válidas', async () => {
  const [raw, extraRaw] = await Promise.all([
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json', import.meta.url), 'utf8'),
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa-extra.json', import.meta.url), 'utf8')
  ]);

  assert.doesNotMatch(raw, /\uFFFD/);
  assert.doesNotMatch(extraRaw, /\uFFFD/);

  const collection = JSON.parse(raw);
  const extraCollection = JSON.parse(extraRaw);
  const activities = [
    ...collection.atividades,
    ...extraCollection.atividades
  ];
  const normalize = value => value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR');
  const ids = activities.map(activity => activity.id);
  const titles = activities.map(activity => normalize(activity.titulo));
  const prompts = activities.flatMap(activity => activity.questoes.map(question => normalize(question.enunciado)));
  const supportTexts = activities
    .filter(activity => activity.textoApoio)
    .map(activity => normalize(activity.textoApoio.conteudo));

  assert.equal(activities.length, 30);
  assert.equal(activities.reduce((total, activity) => total + activity.questoes.length, 0), 180);
  assert.equal(activities.reduce((total, activity) => total + activity.gabarito.length, 0), 180);
  assert.equal(new Set(ids).size, 30);
  assert.equal(new Set(titles).size, 30);
  assert.equal(new Set(prompts).size, 180);
  assert.equal(new Set(supportTexts).size, supportTexts.length);

  const preservedIds = [
    'efi-4ano-b3-lp-noticia-a',
    'efi-4ano-b3-lp-noticia-b',
    'efi-4ano-b3-lp-noticia-c',
    'efi-4ano-b3-lp-divulgacao-cientifica-a',
    'efi-4ano-b3-lp-pesquisa-registro-b',
    'efi-4ano-b3-lp-texto-literario-b',
    'efi-4ano-b3-lp-narrativa-c'
  ];
  preservedIds.forEach(id => assert.ok(ids.includes(id), `atividade original ausente: ${id}`));
  const newIds = ids.filter(id => !preservedIds.includes(id));
  assert.equal(newIds.length, 23);

  for (const activity of activities) {
    assert.equal(activity.quantidadeQuestoes, 6);
    assert.equal(activity.questoes.length, 6);
    assert.equal(activity.gabarito.length, 6);
    assert.ok(activity.objetivo.trim());
    assert.ok(activity.instrucaoGeral.trim());
    assert.ok(['facil', 'intermediaria', 'desafiadora'].includes(activity.dificuldade));
    assert.ok(activity.bncc.length > 0);
    activity.bncc.forEach(skill => {
      assert.match(skill.codigo, /^EF(04|15|35)LP\d{2}$/);
      assert.ok(skill.descricaoResumida.trim());
    });
    assert.deepEqual(activity.questoes.map(question => question.numero), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(activity.gabarito.map(answer => answer.numero), [1, 2, 3, 4, 5, 6]);
    assert.equal(activity.possuiFiguras, activity.figuras.length > 0);

    const figureIds = new Set(activity.figuras.map(figure => figure.id));
    assert.equal(figureIds.size, activity.figuras.length);
    for (const figure of activity.figuras) {
      assert.ok(figure.id);
      assert.match(figure.arquivo, /^assets\/atividades\/lingua-portuguesa\/[^/]+\.(svg|png)$/);
      assert.ok(figure.descricao);
      assert.ok(figure.funcaoPedagogica);
      assert.ok(figure.posicaoSugerida);
      assert.ok(figure.textoAlternativo);
      assert.equal(figure.compativelPretoBranco, true);
      const image = await readFile(new URL(`../${figure.arquivo}`, import.meta.url));
      if (figure.arquivo.endsWith('.svg')) {
        assert.match(image.toString('utf8'), /^<svg[\s>]/);
        assert.ok(image.length > 500);
      } else {
        assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
        assert.ok(image.length > 100_000);
      }
    }

    for (const question of activity.questoes) {
      assert.ok(question.espacoResposta);
      if (question.figuraId) assert.ok(figureIds.has(question.figuraId));
    }

    for (const answer of activity.gabarito) {
      assert.ok(answer.resposta.trim());
      assert.ok(answer.justificativa.trim());
      // Nas atividades acrescentadas neste lote, toda resposta aberta precisa
      // trazer critério de correção explícito, e não apenas "resposta pessoal".
      if (newIds.includes(activity.id) && /resposta (pessoal|autoral)/i.test(answer.resposta)) {
        assert.match(answer.justificativa, /Critério de correção/i);
      }
    }
  }

  const libraryScript = await readFile(new URL('../biblioteca.js', import.meta.url), 'utf8');
  const fixesScript = await readFile(new URL('../biblioteca-fixes.js', import.meta.url), 'utf8');
  assert.match(libraryScript, /'Língua Portuguesa':\s*\{[\s\S]*?count:\s*20,/);
  assert.match(fixesScript, /EXPECTED_PORTUGUESE_ACTIVITIES\s*=\s*30/);
  assert.match(fixesScript, /EXPECTED_MATH_ACTIVITIES\s*=\s*30/);
});

test('Matemática e Língua Portuguesa carregam somente com a disciplina correspondente', async () => {
  const window = await createLibraryPage();
  openActivities(window, 'Anos Iniciais', '4º ano', '3º bimestre');
  const subject = window.document.querySelector('#library-filters select[name="subject"]');

  subject.value = 'Matemática';
  subject.dispatchEvent(new window.Event('input', { bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.deepEqual(window.__fetchCalls, ['data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica.json']);
  assert.equal(window.document.querySelectorAll('.activity-library-card').length, 5);
  assert.equal(window.document.querySelector('#library-pagination').hidden, false);

  window.document.querySelector('#next-page').click();
  const mathCards = [...window.document.querySelectorAll('.activity-library-card')];
  assert.equal(mathCards.length, 5);
  const moneyCard = mathCards.find(card => card.textContent.includes('Compras, preços e troco'));
  moneyCard.querySelector('.preview-button').click();
  assert.match(window.document.querySelector('.collection-student-page').textContent, /R\$ 18,50|R\$ 50,00/);
  window.document.querySelector('#activity-preview').close();

  subject.value = 'Língua Portuguesa';
  subject.dispatchEvent(new window.Event('input', { bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.deepEqual(window.__fetchCalls, [
    'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica.json',
    'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json'
  ]);
  assert.equal(window.document.querySelectorAll('.activity-library-card').length, 5);
  window.document.querySelector('.activity-library-card .preview-button').click();
  assert.ok(window.document.querySelector('.collection-student-page .support-text'));
  assert.equal(window.document.querySelectorAll('.collection-question-list > li').length, 6);
  assert.ok(window.document.querySelector('.collection-answer-key'));
  await window.happyDOM.close();
});

test('Coleções integradas do 1º, 3º e 4º ano estão completas', async () => {
  const files = [
    ['4-ano', 'historia.json', '4ano-3bimestre-historia', '4º ano', 'História'],
    ['4-ano', 'geografia.json', '4ano-3bimestre-geografia', '4º ano', 'Geografia'],
    ['3-ano', 'lingua-portuguesa.json', '3ano-3bimestre-lingua-portuguesa', '3º ano', 'Língua Portuguesa'],
    ['3-ano', 'matematica.json', '3ano-3bimestre-matematica', '3º ano', 'Matemática'],
    ['3-ano', 'historia.json', '3ano-3bimestre-historia', '3º ano', 'História'],
    ['3-ano', 'ciencias.json', '3ano-3bimestre-ciencias', '3º ano', 'Ciências'],
    ['3-ano', 'geografia.json', '3ano-3bimestre-geografia', '3º ano', 'Geografia'],
    ['1-ano', 'lingua-portuguesa.json', '1ano-3bimestre-lingua-portuguesa', '1º ano', 'Língua Portuguesa'],
    ['1-ano', 'matematica.json', '1ano-3bimestre-matematica', '1º ano', 'Matemática'],
    ['1-ano', 'historia.json', '1ano-3bimestre-historia', '1º ano', 'História'],
    ['1-ano', 'ciencias.json', '1ano-3bimestre-ciencias', '1º ano', 'Ciências'],
    ['1-ano', 'geografia.json', '1ano-3bimestre-geografia', '1º ano', 'Geografia']
  ];
  const allIds = [];

  for (const [gradePath, filename, collectionId, grade, subject] of files) {
    const raw = await readFile(new URL(
      `../data/atividades/fundamental-anos-iniciais/${gradePath}/3-bimestre/${filename}`,
      import.meta.url
    ), 'utf8');
    assert.doesNotMatch(raw, /\uFFFD/);
    assert.match(raw, /\n$/);
    const collection = JSON.parse(raw);
    assert.equal(collection.schemaVersion, '1.0');
    assert.equal(collection.colecao, collectionId);
    assert.equal(collection.ano, grade);
    assert.equal(collection.bimestre, 3);
    assert.equal(collection.disciplina, subject);
    assert.equal(collection.atividades.length, 30);
    assert.equal(collection.atividades.reduce((total, activity) => total + activity.questoes.length, 0), 180);
    assert.equal(collection.atividades.reduce((total, activity) => total + activity.gabarito.length, 0), 180);

    for (const activity of collection.atividades) {
      allIds.push(activity.id);
      assert.equal(activity.quantidadeQuestoes, 6);
      assert.equal(activity.questoes.length, 6);
      assert.equal(activity.gabarito.length, 6);
      assert.ok(activity.objetivo.trim());
      assert.ok(activity.bncc.length > 0);
      assert.equal(activity.possuiGabarito, true);
      assert.deepEqual(activity.questoes.map(question => question.numero), [1, 2, 3, 4, 5, 6]);
      assert.deepEqual(activity.gabarito.map(answer => answer.numero), [1, 2, 3, 4, 5, 6]);
    }
  }

  assert.equal(allIds.length, 360);
  assert.equal(new Set(allIds).size, 360);

  const fixesScript = await readFile(new URL('../biblioteca-fixes.js', import.meta.url), 'utf8');
  files.forEach(([gradePath, filename, collectionId]) => {
    assert.match(fixesScript, new RegExp(
      `data/atividades/fundamental-anos-iniciais/${gradePath}/3-bimestre/${filename.replace('.', '\\.')}`
    ));
    assert.match(fixesScript, new RegExp(collectionId));
  });
});

test('Coleções mantêm responsividade e quebra de página de impressão', async () => {
  const css = await readFile(new URL('../biblioteca.css', import.meta.url), 'utf8');
  assert.match(css, /@media \(max-width:\s*680px\)[\s\S]*\.activity-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /\.worksheet-page\s*\{[\s\S]*page-break-after:\s*always/s);
  assert.match(css, /\.collection-answer-key\s*\{[^}]*break-before:\s*page/s);
});

test('Prévia e impressão usam folhas brancas sem efeito de cartão', async () => {
  const css = await readFile(new URL('../biblioteca.css', import.meta.url), 'utf8');
  assert.match(css, /\.activity-preview\s*\{[^}]*background:\s*#fff;[^}]*box-shadow:\s*none;/s);
  assert.match(css, /\.worksheet-page\s*\{[^}]*border:\s*0;[^}]*border-radius:\s*0;[^}]*background:\s*#fff;[^}]*box-shadow:\s*none;/s);
  assert.match(css, /\.answer-key-page\s*\{[^}]*border:\s*0;[^}]*background:\s*#fff;[^}]*box-shadow:\s*none;[^}]*border-radius:\s*0;/s);
  assert.match(css, /@media print\s*\{[\s\S]*html,\s*body\s*\{[^}]*background:\s*#fff !important;/s);
  assert.match(css, /@media print\s*\{[\s\S]*\.worksheet-page,\s*\.activity-print-page,\s*\.answer-key-page\s*\{[^}]*width:\s*210mm;[^}]*border:\s*none !important;[^}]*border-radius:\s*0 !important;[^}]*background:\s*#fff !important;[^}]*box-shadow:\s*none !important;/s);
});

test('Atividade de seis questões ocupa duas folhas e mantém gabarito separado', async () => {
  const window = await createLibraryPage();
  openActivities(window, 'Anos Iniciais', '4º ano', '3º bimestre');
  const subject = window.document.querySelector('#library-filters select[name="subject"]');
  subject.value = 'Ciências';
  subject.dispatchEvent(new window.Event('input', { bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 0));
  window.document.querySelector('.activity-library-card .preview-button').click();

  const preview = window.document.querySelector('#activity-preview');
  const studentPages = [...preview.querySelectorAll('.collection-student-page')];
  assert.equal(studentPages.length, 2);
  assert.equal(studentPages[0].querySelectorAll('.collection-question-list > li').length, 3);
  assert.equal(studentPages[1].querySelectorAll('.collection-question-list > li').length, 3);
  assert.ok(studentPages[0].querySelector('.support-text'));
  assert.equal(studentPages[1].querySelector('.support-text'), null);
  assert.equal(studentPages[0].querySelectorAll('.student-fields').length, 1);
  assert.match(studentPages[0].querySelector('.student-fields').textContent, /Nome: _+.*Turma: _+.*Data: _+/s);
  assert.equal(studentPages[1].querySelector('.student-fields'), null);
  assert.equal(studentPages[1].querySelector('h1, h2, h3'), null);
  assert.doesNotMatch(studentPages[1].textContent, /continuação/i);
  assert.equal(studentPages[1].querySelector('.collection-question-list').getAttribute('start'), '4');
  assert.ok(preview.querySelector('.collection-answer-key'));
  assert.match(preview.querySelector('.collection-export-actions').textContent, /Baixar PDF.*Baixar Word/s);

  const css = await readFile(new URL('../biblioteca.css', import.meta.url), 'utf8');
  assert.match(css, /\.collection-student-page \.student-fields\s*\{[^}]*margin:\s*0 0 10mm/s);
  assert.match(css, /\.collection-instruction,\s*\.support-text\s*\{[^}]*font-size:\s*11\.5pt/s);
  assert.match(css, /\.collection-question-list > li > p\s*\{[^}]*font-size:\s*12\.5pt;[^}]*line-height:\s*1\.3/s);
  assert.match(css, /\.collection-question-list > li\s*\{[^}]*break-inside:\s*avoid;[^}]*page-break-inside:\s*avoid;/s);
  const script = await readFile(new URL('../biblioteca.js', import.meta.url), 'utf8');
  assert.match(script, /function downloadCollectionWord[\s\S]*application\/msword/s);
  assert.match(script, /function downloadCollectionWord[\s\S]*page-break-after:\s*always;[\s\S]*page-break-before:\s*always;/s);
  await window.happyDOM.close();
});

test('Toda figura obrigatória possui arquivo e aparece junto da questão', async () => {
  const raw = await readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json', import.meta.url), 'utf8');
  const collection = JSON.parse(raw);
  const expected = new Map([
    ['efi-4ano-b3-cie-decomposicao-a', [3, 'figura-01']],
    ['efi-4ano-b3-cie-decomposicao-b', [3, 'figura-02']],
    ['efi-4ano-b3-cie-decomposicao-c', [5, 'figura-03']],
    ['efi-4ano-b3-cie-microrganismos-saude-a', [3, 'figura-04']],
    ['efi-4ano-b3-cie-microrganismos-saude-b', [5, 'figura-05']]
  ]);
  for (const activity of collection.atividades) {
    const [questionNumber, figureId] = expected.get(activity.id);
    const question = activity.questoes.find(item => item.numero === questionNumber);
    const figure = activity.figuras.find(item => item.id === figureId);
    assert.equal(question.figuraId, figureId);
    assert.ok(figure.arquivo.endsWith(`${figureId}.png`));
    const image = await readFile(new URL(`../${figure.arquivo}`, import.meta.url));
    assert.ok(image.length > 1000);
    assert.deepEqual([...image.subarray(1, 4)], [80, 78, 71]);
  }

  const window = await createLibraryPage();
  openActivities(window, 'Anos Iniciais', '4º ano', '3º bimestre');
  const subject = window.document.querySelector('#library-filters select[name="subject"]');
  subject.value = 'Ciências';
  subject.dispatchEvent(new window.Event('input', { bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 0));
  window.document.querySelector('.activity-library-card .preview-button').click();
  const questionWithFigure = window.document.querySelector('.question-figure').closest('.collection-question-list > li');
  assert.ok(questionWithFigure);
  assert.match(questionWithFigure.textContent, /Observe a figura/);
  const children = [...questionWithFigure.children];
  assert.ok(children.indexOf(questionWithFigure.querySelector('p')) < children.indexOf(questionWithFigure.querySelector('.question-figure')));
  assert.ok(children.indexOf(questionWithFigure.querySelector('.question-figure')) < children.indexOf(questionWithFigure.querySelector('.question-alternatives')));
  assert.match(await readFile(new URL('../biblioteca.css', import.meta.url), 'utf8'), /\.question-figure\s*\{[^}]*max-width:[^;]*160mm\);[^}]*object-fit:\s*contain;[^}]*page-break-inside:\s*avoid/s);

  window.document.querySelector('.preview-word').click();
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.ok(window.__downloadBlob);
  const word = await window.__downloadBlob.text();
  assert.match(word, /<img[^>]+class="question-figure"[^>]+src="data:image\/png;base64,/);
  assert.match(word, /\.question-figure\s*\{[^}]*page-break-inside:\s*avoid/);
  assert.match(word, /page-break-after:\s*always/);

  const css = await readFile(new URL('../biblioteca.css', import.meta.url), 'utf8');
  const printRules = css.match(/@media print\s*\{[\s\S]*\}\s*$/)[0];
  assert.match(printRules, /\.question-figure\s*\{[^}]*max-width:\s*160mm;[^}]*max-height:\s*40mm/s);
  assert.doesNotMatch(printRules, /\.question-figure\s*\{[^}]*display:\s*none/s);
  await window.happyDOM.close();
});

test('Coleção não é liberada quando uma figura obrigatória está ausente', async () => {
  const window = await createLibraryPage({ missingAsset: 'assets/atividades/ciencias/figura-01.png' });
  openActivities(window, 'Anos Iniciais', '4º ano', '3º bimestre');
  const subject = window.document.querySelector('#library-filters select[name="subject"]');
  subject.value = 'Ciências';
  subject.dispatchEvent(new window.Event('input', { bubbles: true }));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.match(window.document.querySelector('#library-toast').textContent, /depende da figura figura-01.*arquivo visual ainda não foi produzido/);
  assert.equal(window.document.querySelector('[data-activity-id="efi-4ano-b3-cie-decomposicao-a"]'), null);
  await window.happyDOM.close();
});
