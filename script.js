(() => {
  'use strict';

  const style = document.createElement('style');
  style.id = 'teacheasy-professional-responsive-fixes';
  style.textContent = `
    html { overflow-x: hidden; }
    body { overflow-x: hidden; text-rendering: optimizeLegibility; }
    img, svg, video, canvas { max-width: 100%; }
    button, a, input, select, textarea { -webkit-tap-highlight-color: transparent; }
    :focus-visible { outline: 3px solid #7a2e3a; outline-offset: 3px; }

    body:not(.library-page) .site-header {
      box-shadow: 0 4px 20px rgba(47,71,54,.08);
    }
    body:not(.library-page) .header-inner {
      min-height: 76px;
    }
    body:not(.library-page) .brand strong {
      font-size: clamp(26px,3vw,34px);
    }

    body:not(.library-page) .hero {
      padding: 0;
      background: #fff;
    }
    body:not(.library-page) .hero > .container,
    body:not(.library-page) .hero-grid {
      width: 100%;
      max-width: none;
      margin: 0;
    }
    body:not(.library-page) .hero-grid {
      display: block;
    }
    body:not(.library-page) .hero-copy {
      display: none;
    }
    body:not(.library-page) .carousel {
      width: 100%;
      min-height: 0;
      height: clamp(360px, 52vw, 680px);
      border-radius: 0;
      box-shadow: none;
      background: #34493a;
      cursor: default;
      touch-action: pan-y;
      isolation: isolate;
    }
    body:not(.library-page) .slide {
      background-size: cover;
      background-position: center;
      transform: scale(1.015);
    }
    body:not(.library-page) .slide.active {
      transform: scale(1);
    }
    body:not(.library-page) .slide::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.12));
      pointer-events: none;
    }
    body:not(.library-page) .slide-overlay,
    body:not(.library-page) .slide-feature-rotator,
    body:not(.library-page) .carousel-chips {
      display: none !important;
    }

    /* Keep every intended carousel message visible while old controls stay hidden. */
    body:not(.library-page) .slide:first-child .slide-overlay-teacher,
    body:not(.library-page) .slide:first-child .slide-feature-rotator,
    body:not(.library-page) .slide:nth-child(2) .slide-overlay-content,
    body:not(.library-page) .slide:nth-child(3) .slide-overlay-evaluation,
    body:not(.library-page) .slide:nth-child(4) .slide-overlay-time {
      display: block !important;
    }
    body:not(.library-page) .carousel-arrow {
      top: 50%;
      width: clamp(44px,5vw,58px);
      height: clamp(44px,5vw,58px);
      display: grid;
      place-items: center;
      padding: 0 0 4px;
      background: rgba(255,255,255,.94);
      color: #7a2e3a;
      border: 1px solid rgba(255,255,255,.8);
      box-shadow: 0 8px 24px rgba(0,0,0,.18);
    }
    body:not(.library-page) .prev { left: clamp(10px,2vw,28px); }
    body:not(.library-page) .next { right: clamp(10px,2vw,28px); }
    body:not(.library-page) .carousel-dots {
      left: 50%;
      bottom: 18px;
      z-index: 8;
      padding: 9px 12px;
      border-radius: 999px;
      background: rgba(30,38,31,.46);
      backdrop-filter: blur(8px);
    }
    body:not(.library-page) .carousel-dots button {
      width: 11px;
      height: 11px;
      padding: 0;
      background: rgba(255,255,255,.58);
      border: 1px solid rgba(255,255,255,.82);
      transition: width .2s ease, background .2s ease;
    }
    body:not(.library-page) .carousel-dots button.active {
      width: 28px;
      border-radius: 999px;
      background: #fff;
    }

    body:not(.library-page) .section-heading {
      max-width: 820px;
      margin-inline: auto;
    }
    body:not(.library-page) .section-heading h2 {
      font-size: clamp(32px,4vw,48px);
    }
    body:not(.library-page) .home-library-highlight,
    body:not(.library-page) .photo-activity-launcher,
    body:not(.library-page) .ai-content-feature,
    body:not(.library-page) .feature-card,
    body:not(.library-page) .service-card {
      box-shadow: 0 14px 34px rgba(47,71,54,.10);
    }
    body:not(.library-page) .feature-card,
    body:not(.library-page) .service-card {
      height: 100%;
    }
    body:not(.library-page) dialog {
      max-width: min(920px, calc(100% - 24px));
      max-height: calc(100dvh - 24px);
    }

    @media (max-width: 980px) {
      body:not(.library-page) .carousel {
        height: clamp(360px, 70vw, 560px);
      }
      body:not(.library-page) .cards-grid,
      body:not(.library-page) .service-grid {
        grid-template-columns: repeat(2, minmax(0,1fr));
      }
    }

    @media (max-width: 680px) {
      body:not(.library-page) .header-inner {
        min-height: 68px;
      }
      body:not(.library-page) .brand {
        min-width: 0;
      }
      body:not(.library-page) .brand strong {
        font-size: 25px;
      }
      body:not(.library-page) .brand span {
        font-size: 12px;
        line-height: 1.2;
      }
      body:not(.library-page) .carousel {
        height: min(78vw, 440px);
        min-height: 280px;
      }
      body:not(.library-page) .slide:nth-child(1) { background-position: 58% center; }
      body:not(.library-page) .slide:nth-child(2) { background-position: center; }
      body:not(.library-page) .slide:nth-child(3) { background-position: 55% center; }
      body:not(.library-page) .slide:nth-child(4) { background-position: center; }
      body:not(.library-page) .carousel-arrow {
        width: 42px;
        height: 42px;
        font-size: 30px;
      }
      body:not(.library-page) .carousel-dots {
        bottom: 12px;
      }
      body:not(.library-page) .section {
        padding: 44px 0;
      }
      body:not(.library-page) .cards-grid,
      body:not(.library-page) .service-grid,
      body:not(.library-page) .stats-grid {
        grid-template-columns: 1fr;
      }
      body:not(.library-page) .btn,
      body:not(.library-page) button:not(.carousel-dots button):not(.carousel-arrow) {
        max-width: 100%;
      }
      body:not(.library-page) .home-library-highlight {
        grid-template-columns: 72px minmax(0,1fr);
        padding: 18px 16px;
      }
      body:not(.library-page) .home-library-copy,
      body:not(.library-page) .photo-launcher-copy {
        min-width: 0;
      }
    }

    @media (max-width: 420px) {
      body:not(.library-page) .carousel {
        height: 300px;
      }
      body:not(.library-page) .carousel-arrow {
        width: 38px;
        height: 38px;
        font-size: 28px;
      }
      body:not(.library-page) .prev { left: 8px; }
      body:not(.library-page) .next { right: 8px; }
      body:not(.library-page) .container {
        width: min(100% - 20px,1240px);
      }
      body:not(.library-page) .home-library-highlight {
        grid-template-columns: 58px minmax(0,1fr);
        gap: 10px;
        border-radius: 22px;
      }
      body:not(.library-page) .home-library-highlight strong {
        font-size: 22px;
      }
      body:not(.library-page) .home-library-copy > span {
        font-size: 14px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        scroll-behavior: auto !important;
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
      }
    }
  `;
  document.head.appendChild(style);

  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.carousel-dots button')];
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
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

    prev?.addEventListener('click', event => {
      event.stopPropagation();
      changeSlide(-1);
    });
    next?.addEventListener('click', event => {
      event.stopPropagation();
      changeSlide(1);
    });
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
    'library-demo': ['🗂️', 'Visualizar atividades da biblioteca', 'Passe pelos exemplos e veja como as atividades ficam organizadas antes de escolher.'],
    'coloring-demo': ['🎨', 'Desenhos para colorir', 'Escolha uma categoria ou deixe o TeachEasy sugerir um tema.'],
    'games-demo': ['🎲', 'Jogos pedagógicos', 'Veja materiais lúdicos que podem ser impressos e usados com a turma.'],
    'ai-demo': ['✨', 'Veja a IA criando', 'Acompanhe o pedido se transformando em uma atividade pronta para revisão.']
  };
  const demoCards = [...document.querySelectorAll('.initial-service-card[data-service]')];
  const demoDialog = document.querySelector('#service-dialog');
  const demoContainer = demoDialog?.querySelector('.service-dialog-columns');

  function libraryDemo() {
    if (!demoContainer) return;
    const examples = [
      ['Educação Infantil · Natureza', 'Descobrindo as cores das plantas', 'Atividade visual com observação, pintura e versão adaptada.'],
      ['3º ano · Matemática · 2º bimestre', 'Problemas de adição e subtração', 'Situações do cotidiano com espaço para cálculo e gabarito.'],
      ['7º ano · Ciências · 3º bimestre', 'Ecossistemas brasileiros', 'Leitura curta, figuras de apoio e questões de compreensão.'],
      ['Ensino Médio · Língua Portuguesa', 'Interpretação e argumentação', 'Texto de apoio, questões discursivas e critérios de resposta.']
    ];
    demoContainer.innerHTML = `<div class="demo-showcase"><div class="demo-carousel"><button class="demo-carousel-button demo-previous" type="button" aria-label="Atividade anterior">‹</button><div class="demo-slide" aria-live="polite"></div><button class="demo-carousel-button demo-next" type="button" aria-label="Próxima atividade">›</button></div><div class="demo-dots" aria-hidden="true"></div></div>`;
    let index = 0;
    const render = nextIndex => {
      index = (nextIndex + examples.length) % examples.length;
      const [label, title, text] = examples[index];
      demoContainer.querySelector('.demo-slide').innerHTML = `<small>${label}</small><strong>${title}</strong><p>${text}</p>`;
      demoContainer.querySelector('.demo-dots').innerHTML = examples.map((_, position) => `<span class="${position === index ? 'active' : ''}"></span>`).join('');
    };
    demoContainer.querySelector('.demo-previous')?.addEventListener('click', () => render(index - 1));
    demoContainer.querySelector('.demo-next')?.addEventListener('click', () => render(index + 1));
    render(0);
  }

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
    demoContainer.querySelector('.demo-surprise')?.addEventListener('click', () => select(buttons[Math.floor(Math.random() * buttons.length)]));
  }

  function gamesDemo() {
    if (!demoContainer) return;
    const games = ['🔎 Caça-palavras', '✏️ Cruzadinhas', '🧠 Jogo da memória', '🎟️ Bingo educativo', '🖼️ Associação de imagens', '✂️ Recorte e montagem'];
    demoContainer.innerHTML = `<div class="demo-showcase"><div class="demo-game-grid">${games.map(game => `<div class="demo-game">${game}</div>`).join('')}</div></div>`;
  }

  function aiDemo() {
    if (!demoContainer) return;
    const steps = [['1', 'Professor informa o pedido', 'Ano, tema e objetivo'], ['2', 'A IA gera', 'Conteúdo criado em tempo real'], ['3', 'A prévia é montada', 'Questões, figuras e gabarito'], ['4', 'Pronta para revisar', 'Professor confere e adapta']];
    demoContainer.innerHTML = `<div class="demo-showcase"><div class="ai-demo-flow">${steps.map(([number, title, text]) => `<div class="ai-demo-step"><b>${number}</b><strong>${title}</strong><span>${text}</span></div>`).join('')}</div></div>`;
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

  demoDialog?.querySelector('.service-dialog-close')?.addEventListener('click', () => demoDialog.close());
  demoDialog?.addEventListener('click', event => {
    if (event.target === demoDialog) demoDialog.close();
  });
})();
