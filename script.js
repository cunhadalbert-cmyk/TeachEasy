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
  clearInterval(timer);
  timer = setInterval(() => showSlide(current + 1), 5500);
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

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

showSlide(0);
restartTimer();
