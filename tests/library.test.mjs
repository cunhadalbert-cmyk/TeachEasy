import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { Window } from 'happy-dom';

async function createLibraryPage() {
  const [html, script, scienceCollection, mathCollection, portugueseCollection] = await Promise.all([
    readFile(new URL('../biblioteca.html', import.meta.url), 'utf8'),
    readFile(new URL('../biblioteca.js', import.meta.url), 'utf8'),
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json', import.meta.url), 'utf8'),
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica.json', import.meta.url), 'utf8'),
    readFile(new URL('../data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json', import.meta.url), 'utf8')
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
  window.__fetchCalls = [];
  window.fetch = async path => {
    window.__fetchCalls.push(path);
    const collections = {
      'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json': scienceCollection,
      'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica.json': mathCollection,
      'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json': portugueseCollection
    };
    return {
      ok: Boolean(collections[path]),
      json: async () => JSON.parse(collections[path])
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

test('Criar com a IA é uma função real e distinta das três experiências existentes', async () => {
  const window = await createHomeAiPage();
  const launcher = window.document.querySelector('#ai-content-launcher');
  const dialog = window.document.querySelector('#ai-content-dialog');
  assert.match(launcher.closest('.ai-content-feature').textContent, /Criar com a IA/);
  assert.match(launcher.textContent, /Fazer solicitação/);
  assert.equal(window.document.querySelectorAll('#ai-content-launcher').length, 1);
  assert.doesNotMatch(launcher.closest('.ai-content-feature').textContent, /Biblioteca de Atividades|Criar atividade por foto|Veja a IA criando/);

  launcher.click();
  assert.equal(dialog.open, true);
  const form = window.document.querySelector('#ai-content-form');
  assert.equal(form.elements.materialType.options.length, 9);
  assert.ok(form.elements.request.required);
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

  const preview = window.document.querySelector('#ai-content-preview');
  assert.equal(preview.hidden, false);
  assert.equal(preview.querySelectorAll('.generated-questions li').length, 3);
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
  assert.match(preview.querySelector('.figure-production-review').textContent, /Figura pendente de produção/);
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

test('Lote de Matemática e Língua Portuguesa preserva 15 atividades e 90 questões', async () => {
  const files = [
    ['matematica.json', '4ano-3bimestre-matematica', 'Matemática', 8, 48],
    ['lingua-portuguesa.json', '4ano-3bimestre-lingua-portuguesa', 'Língua Portuguesa', 7, 42]
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

  assert.equal(allIds.length, 15);
  assert.equal(new Set(allIds).size, 15);
  assert.equal(totalQuestions, 90);
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
  assert.equal(mathCards.length, 3);
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
  assert.equal(studentPages[1].querySelector('.student-fields'), null);
  assert.equal(studentPages[1].querySelector('h1, h2, h3'), null);
  assert.doesNotMatch(studentPages[1].textContent, /continuação/i);
  assert.equal(studentPages[1].querySelector('.collection-question-list').getAttribute('start'), '4');
  assert.ok(preview.querySelector('.collection-answer-key'));

  const css = await readFile(new URL('../biblioteca.css', import.meta.url), 'utf8');
  assert.match(css, /\.collection-instruction,\s*\.support-text\s*\{[^}]*font-size:\s*11\.5pt/s);
  assert.match(css, /\.collection-question-list > li > p\s*\{[^}]*font-size:\s*12\.5pt;[^}]*line-height:\s*1\.3/s);
  assert.match(css, /\.collection-question-list > li\s*\{[^}]*break-inside:\s*avoid;[^}]*page-break-inside:\s*avoid;/s);
  await window.happyDOM.close();
});
