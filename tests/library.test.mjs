import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
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

test('Biblioteca começa com quatro etapas e controles auxiliares ocultos', async () => {
  const window = await createLibraryPage();
  assert.equal(window.document.querySelectorAll('.library-choice-card').length, 4);
  assert.equal(window.document.querySelector('#library-step-title').textContent, 'Escolha uma etapa');
  assert.equal(window.document.querySelectorAll('.choice-symbol').length, 0);
  assert.deepEqual(
    [...window.document.querySelectorAll('.library-choice-card')].map(card => card.dataset.theme),
    ['infantil', 'iniciais', 'finais', 'medio']
  );
  assert.equal(window.document.querySelector('.library-filters').hidden, true);
  assert.equal(window.document.querySelector('.library-pagination').hidden, true);
  assert.equal(window.document.querySelector('.library-back').hidden, true);
  assert.equal(window.document.querySelector('.activity-grid').hidden, true);
  assert.equal(window.document.querySelectorAll('.activity-library-card').length, 0);
  assert.equal(window.document.querySelector('.library-goal-card'), null);
  assert.equal(window.document.querySelector('#photo-activity-launcher'), null);
  assert.match(window.document.body.textContent, /1.712 atividades-base/);
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
  const photoHighlight = section.querySelector('.photo-activity-feature');
  const services = section.querySelector('.initial-services-grid');
  assert.equal(highlight.getAttribute('href'), 'biblioteca.html');
  assert.match(highlight.textContent, /Biblioteca de Atividades/);
  assert.match(highlight.textContent, /Encontre atividades prontas por etapa, ano e bimestre/);
  assert.equal(highlight.querySelectorAll('.home-library-illustration').length, 1);
  assert.equal(highlight.querySelector('.home-library-arrow'), null);
  assert.ok(Boolean(heading.compareDocumentPosition(highlight) & window.Node.DOCUMENT_POSITION_FOLLOWING));
  assert.ok(Boolean(highlight.compareDocumentPosition(photoHighlight) & window.Node.DOCUMENT_POSITION_FOLLOWING));
  assert.ok(Boolean(photoHighlight.compareDocumentPosition(services) & window.Node.DOCUMENT_POSITION_FOLLOWING));
  assert.equal(window.document.querySelectorAll('.home-library-highlight').length, 1);
  assert.equal(window.document.querySelectorAll('a[href="biblioteca.html"]').length, 1);
  await window.happyDOM.close();
});

test('Quatro atalhos abrem demonstrações distintas e úteis', async () => {
  const window = await createInteractiveHomePage();
  const cards = [...window.document.querySelectorAll('.initial-service-card')];
  assert.equal(cards.length, 4);
  assert.equal(window.document.querySelectorAll('.service-number').length, 0);
  assert.deepEqual(
    cards.map(card => card.querySelector('h3').textContent),
    ['Visualizar atividades da biblioteca', 'Desenhos para colorir', 'Jogos pedagógicos', 'Veja a IA criando']
  );

  cards[0].click();
  const dialog = window.document.querySelector('#service-dialog');
  assert.equal(dialog.open, true);
  const firstActivity = dialog.querySelector('.demo-slide strong').textContent;
  dialog.querySelector('.demo-next').click();
  assert.notEqual(dialog.querySelector('.demo-slide strong').textContent, firstActivity);
  dialog.close();

  cards[1].click();
  assert.equal(dialog.querySelectorAll('.demo-category').length, 6);
  assert.match(dialog.textContent, /Surpreenda-me/);
  dialog.close();

  cards[2].click();
  assert.equal(dialog.querySelectorAll('.demo-game').length, 6);
  assert.match(dialog.textContent, /Caça-palavras|Jogo da memória/);
  dialog.close();

  cards[3].click();
  assert.equal(dialog.querySelectorAll('.ai-demo-step').length, 4);
  assert.match(dialog.textContent, /Professor informa o pedido|Pronta para revisar/);
  await window.happyDOM.close();
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
  assert.match(home, /Cinco serviços para facilitar a sua rotina/);
  assert.match(home, /Mais tempo para o que realmente importa: você\./);
  assert.doesNotMatch(home, /FEITO PARA PROFESSORES|Conheça a plataforma|NOSSOS SERVIÇOS|Tudo o que você precisa, em um só lugar/);
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
  const assetNames = await readdir(new URL('../assets/', import.meta.url));
  const sources = await Promise.all(
    ['index.html', 'biblioteca.html', 'styles.css', 'biblioteca.css', 'photo-activity.css']
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

test('Formulário por foto fica na página inicial e abre pelo banner', async () => {
  const window = await createHomePhotoPage();
  const dialog = window.document.querySelector('#photo-activity-dialog');
  const preview = window.document.querySelector('#photo-generated-preview');
  const launcher = window.document.querySelector('#photo-activity-launcher');
  assert.equal(dialog.open, false);
  assert.equal(preview.hidden, true);
  assert.match(launcher.textContent, /Criar atividade por foto/);
  assert.match(launcher.textContent, /NOVIDADE!/);
  assert.match(launcher.textContent, /Envie uma foto do conteúdo e a IA gera uma atividade personalizada para você/);
  assert.equal(launcher.querySelector('.photo-launcher-arrow'), null);
  assert.equal(launcher.querySelectorAll('.photo-launcher-illustration').length, 1);
  assert.equal(window.document.querySelector('.photo-feature-badges'), null);
  assert.doesNotMatch(window.document.body.textContent, /Rápido e prático|Atividades originais|Com gabarito e versão adaptada/);

  launcher.click();
  assert.equal(dialog.open, true);
  await window.happyDOM.close();
});

test('Botão por foto usa o bloco horizontal amplo aprovado', async () => {
  const css = await readFile(new URL('../photo-activity.css', import.meta.url), 'utf8');
  assert.match(css, /\.photo-activity-launcher\s*\{[^}]*width:\s*100%/s);
  assert.match(css, /\.photo-activity-launcher\s*\{[^}]*min-height:\s*210px/s);
  assert.match(css, /\.photo-activity-launcher\s*\{[^}]*linear-gradient\(90deg/s);
});

test('Criação por foto exige uma imagem JPG ou PNG', async () => {
  const window = await createHomePhotoPage();
  const form = window.document.querySelector('#photo-activity-form');
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  assert.equal(window.document.querySelector('#photo-generated-preview').hidden, true);
  assert.equal(window.document.querySelector('#photo-form-error').hidden, false);
  assert.match(window.document.querySelector('#photo-form-error').textContent, /JPG, JPEG ou PNG/);
  await window.happyDOM.close();
});

test('Imagem gera prévia e cabeçalho da escola permanece opcional', async () => {
  const window = await createHomePhotoPage();
  const form = window.document.querySelector('#photo-activity-form');
  attachReferenceImage(window);
  form.elements.grade.value = '3º ano';
  form.elements.questionCount.value = '3';
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));

  const preview = window.document.querySelector('#photo-generated-preview');
  const schoolHeader = window.document.querySelector('#school-header');
  assert.equal(preview.hidden, false);
  assert.equal(preview.querySelectorAll('.photo-question-list li').length, 3);
  assert.match(preview.textContent, /não são uma simples cópia/);
  assert.equal(schoolHeader.hidden, true);

  const headerToggle = window.document.querySelector('#school-header-toggle');
  headerToggle.checked = true;
  headerToggle.dispatchEvent(new window.Event('change', { bubbles: true }));
  assert.equal(schoolHeader.hidden, false);
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
