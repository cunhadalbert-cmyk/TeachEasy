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
    'coloring-demo': ['🎨', 'Desenhos para colorir', 'Escolha uma categoria e abra o desenho para imprimir.'],
    'games-demo': ['🎲', 'Jogos pedagógicos', 'Veja materiais lúdicos que podem ser impressos e usados com a turma.']
  };
  const demoCards = [...document.querySelectorAll('.initial-service-card[data-service]')];
  const demoDialog = document.querySelector('#service-dialog');
  const demoContainer = demoDialog?.querySelector('.service-dialog-columns');

  const coloringCategories = [
    { label: 'Animais', folder: 'animais', prefix: 'animais', total: 64 },
    { label: 'Números', folder: 'numeros', prefix: 'numeros', total: 30 },
    { label: 'Natureza', folder: 'natureza', prefix: 'natureza', total: 20 },
    { label: 'Datas comemorativas', folder: 'datas-comemorativas', prefix: 'datas-comemorativas', total: 41 },
    { label: 'Heróis', folder: 'herois', prefix: 'herois', total: 32 },
    { label: 'Veículos', folder: 'veiculos', prefix: 'veiculos', total: 60 }
  ];

  function ensureColoringStyles() {
    if (document.querySelector('#teacheasy-coloring-gallery-styles')) return;
    const style = document.createElement('style');
    style.id = 'teacheasy-coloring-gallery-styles';
    style.textContent = `
      .demo-coloring-shell{display:grid;gap:18px;width:100%}
      .demo-category-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
      .demo-category{min-height:72px;padding:12px;border:1px solid #d7ddd8;border-radius:16px;background:#fff;color:#294432;font:700 17px/1.2 "DM Sans",sans-serif;cursor:pointer}
      .demo-category.active{background:#7a2e3a;color:#fff;border-color:#7a2e3a}
      .demo-gallery-title{margin:0;color:#294432;font-size:22px}
      .demo-drawing-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
      .demo-drawing-card{display:block;padding:8px;border:1px solid #dfe4df;border-radius:14px;background:#fff;text-decoration:none;box-shadow:0 6px 18px rgba(47,71,54,.08)}
      .demo-drawing-card img{display:block;width:100%;aspect-ratio:3/4;object-fit:contain;background:#fff;border-radius:9px}
      .demo-drawing-card span{display:block;padding:8px 4px 2px;color:#294432;font-size:13px;text-align:center}
      .demo-gallery-more{justify-self:center;padding:11px 18px;border:0;border-radius:999px;background:#7a2e3a;color:#fff;font-weight:700;cursor:pointer}
      @media(max-width:680px){.demo-category-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.demo-drawing-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.demo-category{font-size:15px;min-height:62px}}
    `;
    document.head.appendChild(style);
  }

  function drawingPath(category, index) {
    return `assets/desenhos/${category.folder}/${category.prefix}-${String(index).padStart(3, '0')}.png`;
  }

  function renderDrawingGallery(category, visibleCount = 12) {
    const shell = demoContainer?.querySelector('.demo-coloring-shell');
    if (!shell) return;
    const gallery = shell.querySelector('.demo-gallery');
    if (!gallery) return;

    const count = Math.min(visibleCount, category.total);
    const cards = Array.from({ length: count }, (_, position) => {
      const index = position + 1;
      const src = drawingPath(category, index);
      return `<a class="demo-drawing-card" href="${src}" target="_blank" rel="noopener" aria-label="Abrir desenho ${index} de ${category.label}"><img src="${src}" alt="Desenho para colorir — ${category.label} ${index}" loading="lazy" decoding="async"><span>Desenho ${index}</span></a>`;
    }).join('');

    gallery.innerHTML = `<h3 class="demo-gallery-title">${category.label} — ${category.total} desenhos</h3><div class="demo-drawing-grid">${cards}</div>${count < category.total ? '<button class="demo-gallery-more" type="button">Mostrar mais</button>' : ''}`;
    gallery.querySelector('.demo-gallery-more')?.addEventListener('click', () => renderDrawingGallery(category, count + 12));
  }

  function coloringDemo() {
    if (!demoContainer) return;
    ensureColoringStyles();
    demoContainer.innerHTML = `<div class="demo-coloring-shell"><div class="demo-category-grid">${coloringCategories.map((category, index) => `<button class="demo-category${index === 0 ? ' active' : ''}" type="button" data-category="${category.folder}">${category.label}</button>`).join('')}</div><section class="demo-gallery" aria-live="polite"></section></div>`;
    const buttons = [...demoContainer.querySelectorAll('.demo-category')];
    const select = button => {
      buttons.forEach(item => item.classList.toggle('active', item === button));
      const category = coloringCategories.find(item => item.folder === button.dataset.category);
      if (category) renderDrawingGallery(category);
    };
    buttons.forEach(button => button.addEventListener('click', () => select(button)));
    if (buttons[0]) select(buttons[0]);
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
