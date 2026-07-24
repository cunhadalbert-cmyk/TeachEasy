const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.carousel-dots button')];
const chips = [...document.querySelectorAll('.carousel-chips button')];
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const carousel = document.querySelector('.carousel');

let current = 0;
let timer;

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
}

function restartTimer() {
  clearTimeout(timer);
  const delay = current === 0 ? 13000 : 5500;
  timer = setTimeout(() => {
    showSlide(current + 1);
    restartTimer();
  }, delay);
}

prev.addEventListener('click', () => {
  showSlide(current - 1);
  restartTimer();
});

next.addEventListener('click', () => {
  showSlide(current + 1);
  restartTimer();
});

dots.forEach(dot => dot.addEventListener('click', () => {
  showSlide(Number(dot.dataset.slide));
  restartTimer();
}));

carousel.setAttribute('tabindex', '0');
carousel.setAttribute('role', 'button');
carousel.setAttribute('aria-label', 'Avançar para o próximo destaque');

carousel.addEventListener('click', event => {
  if (event.target.closest('.carousel-dots button')) return;
  showSlide(current + 1);
  restartTimer();
});

carousel.addEventListener('keydown', event => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  showSlide(current + 1);
  restartTimer();
});

chips.forEach(chip => chip.addEventListener('click', () => {
  showSlide(Number(chip.dataset.slide));
  restartTimer();
}));

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

showSlide(0);
restartTimer();


const serviceDetails = {
  planning: {
    icon: '🗓', title: 'Planejamento de aula',
    description: 'Uma estrutura completa para orientar a aula do início à avaliação, adaptada à série, à disciplina e ao tema.',
    includes: ['Objetivos de aprendizagem', 'Habilidades e conhecimentos prévios', 'Recursos e metodologia', 'Desenvolvimento passo a passo', 'Avaliação e adaptações'],
    inputs: ['Ano ou série', 'Disciplina e tema', 'Quantidade e duração das aulas', 'Objetivo principal', 'Necessidades específicas da turma']
  },
  activity: {
    icon: '✏️', title: 'Atividade com gabarito',
    description: 'Exercícios adequados ao nível da turma, organizados para imprimir, editar e aplicar com facilidade.',
    includes: ['Texto de apoio quando necessário', 'Questões objetivas e discursivas', 'Nível de dificuldade ajustável', 'Espaço para respostas', 'Gabarito completo'],
    inputs: ['Ano ou série', 'Disciplina e tema', 'Quantidade de questões', 'Tipo de atividade', 'Nível de dificuldade']
  },
  assessment: {
    icon: '✅', title: 'Avaliação com gabarito',
    description: 'Uma avaliação clara e personalizável, com critérios de correção e questões alinhadas ao conteúdo trabalhado.',
    includes: ['Cabeçalho e orientações', 'Questões objetivas', 'Questões discursivas', 'Critérios de correção', 'Gabarito organizado'],
    inputs: ['Ano ou série', 'Disciplina e conteúdos', 'Quantidade de questões', 'Tipos de questão', 'Nível de dificuldade']
  },
  sequence: {
    icon: '📚', title: 'Sequência didática',
    description: 'Um conjunto de aulas conectadas, com progressão pedagógica e atividades que aprofundam o tema por etapas.',
    includes: ['Objetivo geral e objetivos por etapa', 'Organização das aulas', 'Atividades progressivas', 'Recursos e intervenções', 'Avaliação final'],
    inputs: ['Ano ou série', 'Disciplina e tema', 'Quantidade de aulas', 'Duração de cada encontro', 'Resultado esperado']
  }
};

const serviceCards = [...document.querySelectorAll('[data-service]')];
const serviceDialog = document.querySelector('#service-dialog');
const serviceDialogClose = document.querySelector('.service-dialog-close');

function fillList(container, items) {
  container.innerHTML = items.map(item => '<li>' + item + '</li>').join('');
}

function openServiceDetails(serviceKey) {
  const service = serviceDetails[serviceKey];
  if (!service || !serviceDialog) return;
  serviceDialog.querySelector('.service-dialog-icon').textContent = service.icon;
  serviceDialog.querySelector('#service-dialog-title').textContent = service.title;
  serviceDialog.querySelector('.service-dialog-description').textContent = service.description;
  fillList(serviceDialog.querySelector('.service-dialog-includes'), service.includes);
  fillList(serviceDialog.querySelector('.service-dialog-inputs'), service.inputs);
  serviceDialog.showModal();
}

serviceCards.forEach(card => {
  card.addEventListener('click', () => openServiceDetails(card.dataset.service));
  card.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openServiceDetails(card.dataset.service);
  });
});

serviceDialogClose?.addEventListener('click', () => serviceDialog.close());
serviceDialog?.addEventListener('click', event => {
  if (event.target === serviceDialog) serviceDialog.close();
});
