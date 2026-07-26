const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.carousel-dots button')];
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const carousel = document.querySelector('.carousel');
let currentSlide = 0;
let carouselTimer;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, position) => slide.classList.toggle('active', position === currentSlide));
  dots.forEach((dot, position) => dot.classList.toggle('active', position === currentSlide));
}

function restartCarousel() {
  clearTimeout(carouselTimer);
  carouselTimer = setTimeout(() => {
    showSlide(currentSlide + 1);
    restartCarousel();
  }, currentSlide === 0 ? 13000 : 5500);
}

function changeSlide(direction) {
  showSlide(currentSlide + direction);
  restartCarousel();
}

prev.addEventListener('click', () => changeSlide(-1));
next.addEventListener('click', () => changeSlide(1));
dots.forEach(dot => dot.addEventListener('click', () => {
  showSlide(Number(dot.dataset.slide));
  restartCarousel();
}));

carousel.setAttribute('tabindex', '0');
carousel.setAttribute('role', 'button');
carousel.setAttribute('aria-label', 'Avançar para o próximo destaque');
carousel.addEventListener('click', event => {
  if (!event.target.closest('.carousel-dots button')) changeSlide(1);
});
carousel.addEventListener('keydown', event => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  changeSlide(1);
});

showSlide(0);
restartCarousel();

const demoDetails = {
  'library-demo': ['🗂️', 'Visualizar atividades da biblioteca', 'Passe pelos exemplos e veja como as atividades ficam organizadas antes de escolher.'],
  'coloring-demo': ['🎨', 'Desenhos para colorir', 'Escolha uma categoria ou deixe o TeachEasy sugerir um tema.'],
  'games-demo': ['🎲', 'Jogos pedagógicos', 'Veja materiais lúdicos que podem ser impressos e usados com a turma.'],
  'ai-demo': ['✨', 'Veja a IA criando', 'Acompanhe o pedido se transformando em uma atividade pronta para revisão.']
};
const demoCards = [...document.querySelectorAll('.initial-service-card[data-service]')];
const demoDialog = document.querySelector('#service-dialog');
const demoContainer = demoDialog.querySelector('.service-dialog-columns');

function libraryDemo() {
  const examples = [
    ['Educação Infantil · Natureza', 'Descobrindo as cores das plantas', 'Atividade visual com observação, pintura e versão adaptada.'],
    ['3º ano · Matemática · 2º bimestre', 'Problemas de adição e subtração', 'Situações do cotidiano com espaço para cálculo e gabarito.'],
    ['7º ano · Ciências · 3º bimestre', 'Ecossistemas brasileiros', 'Leitura curta, figuras de apoio e questões de compreensão.'],
    ['Ensino Médio · Língua Portuguesa', 'Interpretação e argumentação', 'Texto de apoio, questões discursivas e critérios de resposta.']
  ];
  demoContainer.innerHTML = `
    <div class="demo-showcase">
      <div class="demo-carousel">
        <button class="demo-carousel-button demo-previous" type="button" aria-label="Atividade anterior">‹</button>
        <div class="demo-slide" aria-live="polite"></div>
        <button class="demo-carousel-button demo-next" type="button" aria-label="Próxima atividade">›</button>
      </div>
      <div class="demo-dots" aria-hidden="true"></div>
    </div>`;
  let index = 0;
  const render = nextIndex => {
    index = (nextIndex + examples.length) % examples.length;
    const [label, title, text] = examples[index];
    demoContainer.querySelector('.demo-slide').innerHTML = `<small>${label}</small><strong>${title}</strong><p>${text}</p>`;
    demoContainer.querySelector('.demo-dots').innerHTML = examples.map((_, position) => `<span class="${position === index ? 'active' : ''}"></span>`).join('');
  };
  demoContainer.querySelector('.demo-previous').addEventListener('click', () => render(index - 1));
  demoContainer.querySelector('.demo-next').addEventListener('click', () => render(index + 1));
  render(0);
}

function coloringDemo() {
  const categories = ['Animais', 'Alfabeto', 'Números', 'Natureza', 'Profissões', 'Datas comemorativas'];
  demoContainer.innerHTML = `
    <div class="demo-showcase">
      <div class="demo-category-grid">${categories.map(category => `<button class="demo-category" type="button">${category}</button>`).join('')}</div>
      <button class="demo-surprise" type="button">✨ Surpreenda-me</button>
      <p class="demo-surprise-result" aria-live="polite"></p>
    </div>`;
  const buttons = [...demoContainer.querySelectorAll('.demo-category')];
  const select = button => {
    buttons.forEach(item => item.classList.toggle('active', item === button));
    demoContainer.querySelector('.demo-surprise-result').textContent = `Categoria escolhida: ${button.textContent}`;
  };
  buttons.forEach(button => button.addEventListener('click', () => select(button)));
  demoContainer.querySelector('.demo-surprise').addEventListener('click', () => select(buttons[Math.floor(Math.random() * buttons.length)]));
}

function gamesDemo() {
  const games = ['🔎 Caça-palavras', '✏️ Cruzadinhas', '🧠 Jogo da memória', '🎟️ Bingo educativo', '🖼️ Associação de imagens', '✂️ Recorte e montagem'];
  demoContainer.innerHTML = `<div class="demo-showcase"><div class="demo-game-grid">${games.map(game => `<div class="demo-game">${game}</div>`).join('')}</div></div>`;
}

function aiDemo() {
  const steps = [
    ['1', 'Professor informa o pedido', 'Ano, tema e objetivo'],
    ['2', 'A IA gera', 'Conteúdo criado em tempo real'],
    ['3', 'A prévia é montada', 'Questões, figuras e gabarito'],
    ['4', 'Pronta para revisar', 'Professor confere e adapta']
  ];
  demoContainer.innerHTML = `<div class="demo-showcase"><div class="ai-demo-flow">${steps.map(([number, title, text]) => `
    <div class="ai-demo-step"><b>${number}</b><strong>${title}</strong><span>${text}</span></div>`).join('')}</div></div>`;
}

function openDemo(key) {
  const [icon, title, description] = demoDetails[key];
  demoDialog.querySelector('.service-dialog-icon').textContent = icon;
  demoDialog.querySelector('#service-dialog-title').textContent = title;
  demoDialog.querySelector('.service-dialog-description').textContent = description;
  if (key === 'library-demo') libraryDemo();
  else if (key === 'coloring-demo') coloringDemo();
  else if (key === 'games-demo') gamesDemo();
  else aiDemo();
  demoDialog.showModal();
}

demoCards.forEach(card => {
  card.addEventListener('click', () => openDemo(card.dataset.service));
  card.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openDemo(card.dataset.service);
  });
});
demoDialog.querySelector('.service-dialog-close').addEventListener('click', () => demoDialog.close());
demoDialog.addEventListener('click', event => {
  if (event.target === demoDialog) demoDialog.close();
});
