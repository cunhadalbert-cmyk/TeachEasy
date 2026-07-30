(() => {
  'use strict';

  if (!document.querySelector('link[data-teacheasy-styles="home-responsive"], link[href="home-responsive.css"]')) {
    const responsiveStylesheet = document.createElement('link');
    responsiveStylesheet.rel = 'stylesheet';
    responsiveStylesheet.href = 'home-responsive.css';
    responsiveStylesheet.dataset.teacheasyStyles = 'home-responsive';
    document.head.appendChild(responsiveStylesheet);
  }

  const modalStyle = document.createElement('style');
  modalStyle.textContent = `.coloring-library-demo{width:min(1040px,100%)}.coloring-demo-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:18px 0}.coloring-demo-toolbar .demo-surprise-result{margin:0;font-weight:800}.coloring-demo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;max-height:58vh;overflow-y:auto;padding:4px}.coloring-demo-card{overflow:hidden;border:1px solid rgba(74,7,21,.14);border-radius:18px;background:#fff;box-shadow:0 8px 22px rgba(74,7,21,.08)}.coloring-preview-button{display:grid;width:100%;padding:0;border:0;background:#fff;color:#35121c;cursor:pointer;text-align:left}.coloring-preview-button img{width:100%;aspect-ratio:4/3;padding:12px;object-fit:contain;background:#fff;box-sizing:border-box}.coloring-preview-button strong,.coloring-preview-button span{padding-inline:14px}.coloring-preview-button strong{padding-top:12px;font-size:1rem}.coloring-preview-button span{padding-top:4px;padding-bottom:12px;color:#76525d;font-size:.9rem}.coloring-card-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 12px 12px}.coloring-card-actions button,.coloring-card-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:6px 10px;border:0;border-radius:10px;background:#6d1027;color:#fff;font:inherit;font-weight:800;text-decoration:none;cursor:pointer}@media(max-width:820px){.coloring-demo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.coloring-demo-toolbar{align-items:stretch;flex-direction:column}.coloring-demo-grid{grid-template-columns:1fr}}`;
  document.head.appendChild(modalStyle);

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

  function stopCarousel() { window.clearTimeout(carouselTimer); }
  function restartCarousel() {
    stopCarousel();
    if (!slides.length || reduceMotion || document.hidden) return;
    carouselTimer = window.setTimeout(() => {
      showSlide(currentSlide + 1);
      restartCarousel();
    }, currentSlide === 0 ? 10000 : 6000);
  }
  function changeSlide(direction) { showSlide(currentSlide + direction); restartCarousel(); }

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
      if (event.key === 'ArrowLeft') { event.preventDefault(); changeSlide(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); changeSlide(1); }
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
      if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) changeSlide(deltaX > 0 ? -1 : 1);
      else restartCarousel();
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
    'coloring-demo': ['🎨', 'Desenhos para colorir', '10 desenhos reais para visualizar, baixar e imprimir.'],
    'games-demo': ['🎲', 'Jogos pedagógicos', 'Veja materiais lúdicos que podem ser impressos e usados com a turma.']
  };
  const demoCards = [...document.querySelectorAll('.initial-service-card[data-service]')];
  const demoDialog = document.querySelector('#service-dialog');
  const demoContainer = demoDialog?.querySelector('.service-dialog-columns');

  const drawings = [
    { titulo: 'Husky', categoria: 'Animais', arquivo: 'https://openclipart.org/download/187790' },
    { titulo: 'Rena', categoria: 'Animais', arquivo: 'https://openclipart.org/download/187782' },
    { titulo: 'Polvo bebê', categoria: 'Animais', arquivo: 'https://openclipart.org/download/245072' },
    { titulo: 'Panda patinando', categoria: 'Animais', arquivo: 'https://openclipart.org/download/187797' },
    { titulo: 'Flor abstrata', categoria: 'Natureza', arquivo: 'https://openclipart.org/download/333649' },
    { titulo: 'Flor de lírio', categoria: 'Natureza', arquivo: 'https://openclipart.org/download/333586' },
    { titulo: 'Folhas de outono', categoria: 'Natureza', arquivo: 'https://openclipart.org/download/187784' },
    { titulo: 'Motorhomes', categoria: 'Veículos', arquivo: 'https://openclipart.org/download/273678' },
    { titulo: 'Presente', categoria: 'Datas comemorativas', arquivo: 'https://openclipart.org/download/187786' },
    { titulo: 'Dia do Pi', categoria: 'Matemática', arquivo: 'https://openclipart.org/download/227858' }
  ];

  function printDrawing(item) {
    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) return;
    printWindow.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${item.titulo}</title><style>@page{size:A4;margin:12mm}html,body{margin:0;width:100%;height:100%}body{display:grid;place-items:center}img{width:100%;height:100%;object-fit:contain}</style></head><body><img src="${item.arquivo}" alt="${item.titulo}"><script>window.onload=()=>setTimeout(()=>window.print(),400)<\/script></body></html>`);
    printWindow.document.close();
  }

  function coloringDemo() {
    if (!demoContainer) return;
    const categories = ['Todos', 'Animais', 'Natureza', 'Matemática', 'Datas comemorativas', 'Veículos'];
    demoContainer.innerHTML = `<div class="demo-showcase coloring-library-demo"><div class="demo-category-grid">${categories.map(category => `<button class="demo-category" type="button">${category}</button>`).join('')}</div><div class="coloring-demo-toolbar"><button class="demo-surprise" type="button">✨ Surpreenda-me</button><p class="demo-surprise-result" aria-live="polite"></p></div><div class="coloring-demo-grid" aria-live="polite"></div></div>`;

    const categoryButtons = [...demoContainer.querySelectorAll('.demo-category')];
    const grid = demoContainer.querySelector('.coloring-demo-grid');
    const result = demoContainer.querySelector('.demo-surprise-result');

    const render = category => {
      const visible = category === 'Todos' ? drawings : drawings.filter(item => item.categoria === category);
      categoryButtons.forEach(button => button.classList.toggle('active', button.textContent === category));
      result.textContent = `${visible.length} desenho${visible.length === 1 ? '' : 's'} disponível${visible.length === 1 ? '' : 'is'}.`;
      grid.innerHTML = visible.map((item, index) => `<article class="coloring-demo-card"><button class="coloring-preview-button" type="button" data-print-index="${index}"><img src="${item.arquivo}" alt="Desenho para colorir: ${item.titulo}" loading="lazy"><strong>${item.titulo}</strong><span>${item.categoria}</span></button><div class="coloring-card-actions"><button type="button" data-print-index="${index}">Imprimir A4</button><a href="${item.arquivo}" download="${item.titulo}.svg">Baixar SVG</a></div></article>`).join('');
      [...grid.querySelectorAll('[data-print-index]')].forEach(button => {
        button.addEventListener('click', () => printDrawing(visible[Number(button.dataset.printIndex)]));
      });
    };

    categoryButtons.forEach(button => button.addEventListener('click', () => render(button.textContent)));
    demoContainer.querySelector('.demo-surprise').addEventListener('click', () => {
      const item = drawings[Math.floor(Math.random() * drawings.length)];
      result.textContent = `Sugestão: ${item.titulo}`;
      printDrawing(item);
    });
    render('Todos');
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
  demoDialog?.addEventListener('click', event => { if (event.target === demoDialog) demoDialog.close(); });
})();