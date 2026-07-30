(() => {
  'use strict';

  if (!document.querySelector('link[data-teacheasy-styles="home-responsive"], link[href="home-responsive.css"]')) {
    const responsiveStylesheet = document.createElement('link');
    responsiveStylesheet.rel = 'stylesheet';
    responsiveStylesheet.href = 'home-responsive.css';
    responsiveStylesheet.dataset.teacheasyStyles = 'home-responsive';
    document.head.appendChild(responsiveStylesheet);
  }

  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.carousel-dots button')];
  const carousel = document.querySelector('.carousel');
  let currentSlide = 0;
  let carouselTimer;
  let touchStartX = 0;
  let touchStartY = 0;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      const active = position === currentSlide;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, position) => {
      const active = position === currentSlide;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function stopCarousel() {
    window.clearTimeout(carouselTimer);
  }

  function restartCarousel() {
    stopCarousel();
    if (!slides.length || reduceMotion || document.hidden) return;
    carouselTimer = window.setTimeout(() => {
      showSlide(currentSlide + 1);
      restartCarousel();
    }, currentSlide === 0 ? 10000 : 6000);
  }

  function changeSlide(direction) {
    showSlide(currentSlide + direction);
    restartCarousel();
  }

  if (carousel && slides.length) {
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-roledescription', 'carrossel');
    carousel.setAttribute('aria-label', 'Destaques do TeachEasy');

    dots.forEach(dot => dot.addEventListener('click', event => {
      event.stopPropagation();
      showSlide(Number(dot.dataset.slide));
      restartCarousel();
    }));

    carousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        changeSlide(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        changeSlide(1);
      }
    });
    carousel.setAttribute('tabindex', '0');

    carousel.addEventListener('touchstart', event => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      stopCarousel();
    }, { passive: true });

    carousel.addEventListener('touchend', event => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
        changeSlide(deltaX > 0 ? -1 : 1);
      } else {
        restartCarousel();
      }
    }, { passive: true });

    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', restartCarousel);
    carousel.addEventListener('focusin', stopCarousel);
    carousel.addEventListener('focusout', restartCarousel);
    document.addEventListener('visibilitychange', restartCarousel);

    showSlide(0);
    restartCarousel();
  }

  const demoDetails = {
    'coloring-demo': ['🎨', 'Desenhos para colorir', 'Escolha uma categoria ou deixe o TeachEasy sugerir um tema.'],
    'games-demo': ['🎲', 'Jogos pedagógicos', 'Veja materiais lúdicos que podem ser impressos e usados com a turma.']
  };
  const demoCards = [...document.querySelectorAll('.initial-service-card[data-service]')];
  const demoDialog = document.querySelector('#service-dialog');
  const demoContainer = demoDialog?.querySelector('.service-dialog-columns');

  function coloringDemo() {
    if (!demoContainer) return;
    const categories = ['Animais', 'Alfabeto', 'Números', 'Natureza', 'Profissões', 'Datas comemorativas'];
    demoContainer.innerHTML = `<div class="demo-showcase"><div class="demo-category-grid">${categories.map(category => `<button class="demo-category" type="button">${category}</button>`).join('')}</div><button class="demo-surprise" type="button">✨ Surpreenda-me</button><p class="demo-surprise-result" aria-live="polite"></p></div>`;
    const buttons = [...demoContainer.querySelectorAll('.demo-category')];
    const select = button => {
      buttons.forEach(item => item.classList.toggle('active', item === button));
      const result = demoContainer.querySelector('.demo-surprise-result');
      if (result) result.textContent = `Categoria escolhida: ${button.textContent}`;
    };
    buttons.forEach(button => button.addEventListener('click', () => select(button)));
    demoContainer.querySelector('.demo-surprise')?.addEventListener('click', () => {
      if (!buttons.length) return;
      select(buttons[Math.floor(Math.random() * buttons.length)]);
    });
  }

  function gamesDemo() {
    if (!demoContainer) return;
    const games = ['🔎 Caça-palavras', '✏️ Cruzadinhas', '🧠 Jogo da memória', '🎟️ Bingo educativo', '🖼️ Associação de imagens', '✂️ Recorte e montagem'];
    demoContainer.innerHTML = `<div class="demo-showcase"><div class="demo-game-grid">${games.map(game => `<div class="demo-game">${game}</div>`).join('')}</div></div>`;
  }

  function openDemo(key) {
    if (!demoDialog || !demoContainer || !demoDetails[key]) return;
    const [icon, title, description] = demoDetails[key];
    const iconNode = demoDialog.querySelector('.service-dialog-icon');
    const titleNode = demoDialog.querySelector('#service-dialog-title');
    const descriptionNode = demoDialog.querySelector('.service-dialog-description');
    if (iconNode) iconNode.textContent = icon;
    if (titleNode) titleNode.textContent = title;
    if (descriptionNode) descriptionNode.textContent = description;
    if (key === 'coloring-demo') coloringDemo();
    else gamesDemo();
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

  demoDialog?.querySelector('.service-dialog-close')?.addEventListener('click', () => demoDialog.close());
  demoDialog?.addEventListener('click', event => {
    if (event.target === demoDialog) demoDialog.close();
  });
})();
