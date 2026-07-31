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
  modalStyle.textContent = `.coloring-library-demo{width:min(1080px,100%)}.coloring-demo-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:18px 0}.coloring-demo-toolbar .demo-surprise-result{margin:0;font-weight:800}.coloring-demo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;max-height:58vh;overflow-y:auto;padding:4px}.coloring-demo-card{overflow:hidden;border:1px solid rgba(74,7,21,.14);border-radius:18px;background:#fff;box-shadow:0 8px 22px rgba(74,7,21,.08)}.coloring-preview-button{display:grid;width:100%;padding:0;border:0;background:#fff;color:#35121c;cursor:pointer;text-align:left}.coloring-preview-button img{width:100%;aspect-ratio:4/3;padding:12px;object-fit:contain;background:#fff;box-sizing:border-box}.coloring-preview-button strong,.coloring-preview-button span{padding-inline:14px}.coloring-preview-button strong{padding-top:12px;font-size:1rem}.coloring-preview-button span{padding-top:4px;padding-bottom:12px;color:#76525d;font-size:.9rem}.coloring-card-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 12px 12px}.coloring-card-actions button,.coloring-card-actions a,.coloring-pagination button{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:6px 10px;border:0;border-radius:10px;background:#6d1027;color:#fff;font:inherit;font-weight:800;text-decoration:none;cursor:pointer}.coloring-pagination{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:18px}.coloring-pagination span{min-width:110px;text-align:center;font-weight:800}.coloring-pagination button:disabled{opacity:.4;cursor:not-allowed}.coloring-loading,.coloring-error{grid-column:1/-1;padding:32px 18px;text-align:center;font-weight:800}.coloring-error{color:#8b1d35}@media(max-width:820px){.coloring-demo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.coloring-demo-toolbar{align-items:stretch;flex-direction:column}.coloring-demo-grid{grid-template-columns:1fr}.coloring-card-actions{grid-template-columns:1fr}}`;  document.head.appendChild(modalStyle);

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
    'coloring-demo': ['🎨', 'Desenhos para colorir', '247 desenhos organizados por categoria para visualizar, baixar e imprimir.'],
    'games-demo': ['🎲', 'Jogos pedagógicos', 'Veja materiais lúdicos que podem ser impressos e usados com a turma.']
  };
  const demoCards = [...document.querySelectorAll('.initial-service-card[data-service]')];
  const demoDialog = document.querySelector('#service-dialog');
  const demoContainer = demoDialog?.querySelector('.service-dialog-columns');

  const drawingCategories = [
    { label: 'Animais', slug: 'animais' },
    { label: 'Natureza', slug: 'natureza' },
    { label: 'Matemática', slug: 'matematica' },
    { label: 'Datas comemorativas', slug: 'datas-comemorativas' },
    { label: 'Veículos', slug: 'veiculos' },
    { label: 'Heróis', slug: 'herois' }
  ];
  const drawingCache = new Map();

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  async function loadDrawingCategory(slug) {
    if (drawingCache.has(slug)) return drawingCache.get(slug);
    const response = await fetch(`assets/desenhos/${slug}/index.json`, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Não foi possível carregar a categoria ${slug}.`);
    const items = (await response.json()).map(item => ({
      ...item,
      arquivo: `assets/desenhos/${slug}/${item.arquivo}`
    }));
    drawingCache.set(slug, items);
    return items;
  }

  async function loadDrawings(category) {
    if (category === 'Todos') {
      const categoryLists = await Promise.all(drawingCategories.map(item => loadDrawingCategory(item.slug)));
      return categoryLists.flat();
    }
    const selected = drawingCategories.find(item => item.label === category);
    return selected ? loadDrawingCategory(selected.slug) : [];
  }

  function printDrawing(item) {
    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) return;
    const absoluteImageUrl = new URL(item.arquivo, window.location.href).href;
    printWindow.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(item.titulo)}</title><style>@page{size:A4;margin:12mm}html,body{margin:0;width:100%;height:100%}body{display:grid;place-items:center;background:#fff}img{display:block;max-width:190mm;max-height:270mm;width:100%;height:100%;object-fit:contain}</style></head><body><img src="${absoluteImageUrl}" alt="${escapeHtml(item.titulo)}"><script>window.onload=()=>setTimeout(()=>window.print(),400)<\/script></body></html>`);
    printWindow.document.close();
  }

  function coloringDemo() {
    if (!demoContainer) return;
    const categories = ['Todos', ...drawingCategories.map(item => item.label)];
    demoContainer.innerHTML = `<div class="demo-showcase coloring-library-demo"><div class="demo-category-grid">${categories.map(category => `<button class="demo-category" type="button" data-category="${category}">${category}</button>`).join('')}</div><div class="coloring-demo-toolbar"><button class="demo-surprise" type="button">✨ Surpreenda-me</button><p class="demo-surprise-result" aria-live="polite"></p></div><div class="coloring-demo-grid" aria-live="polite"></div><div class="coloring-pagination"><button class="coloring-page-prev" type="button">Anterior</button><span class="coloring-page-status"></span><button class="coloring-page-next" type="button">Próxima</button></div></div>`;

    const categoryButtons = [...demoContainer.querySelectorAll('.demo-category')];
    const grid = demoContainer.querySelector('.coloring-demo-grid');
    const result = demoContainer.querySelector('.demo-surprise-result');
    const previousButton = demoContainer.querySelector('.coloring-page-prev');
    const nextButton = demoContainer.querySelector('.coloring-page-next');
    const pageStatus = demoContainer.querySelector('.coloring-page-status');
    const pageSize = 12;
    let activeCategory = 'Todos';
    let visibleDrawings = [];
    let currentPage = 1;
    let requestId = 0;

    const renderPage = () => {
      const pageCount = Math.max(1, Math.ceil(visibleDrawings.length / pageSize));
      currentPage = Math.min(Math.max(currentPage, 1), pageCount);
      const start = (currentPage - 1) * pageSize;
      const pageItems = visibleDrawings.slice(start, start + pageSize);
      result.textContent = `${visibleDrawings.length} desenho${visibleDrawings.length === 1 ? '' : 's'} disponível${visibleDrawings.length === 1 ? '' : 'is'}.`;
      pageStatus.textContent = `Página ${currentPage} de ${pageCount}`;
      previousButton.disabled = currentPage <= 1;
      nextButton.disabled = currentPage >= pageCount;
      grid.innerHTML = pageItems.map((item, index) => {
        const drawingIndex = start + index;
        return `<article class="coloring-demo-card"><button class="coloring-preview-button" type="button" data-print-index="${drawingIndex}"><img src="${item.arquivo}" alt="Desenho para colorir: ${escapeHtml(item.titulo)}" loading="lazy" decoding="async"><strong>${escapeHtml(item.titulo)}</strong><span>${escapeHtml(item.categoria)}</span></button><div class="coloring-card-actions"><button type="button" data-print-index="${drawingIndex}">Imprimir A4</button><a href="${item.arquivo}" download="${item.id}.webp">Baixar imagem</a></div></article>`;
      }).join('');
    };

    const selectCategory = async category => {
      activeCategory = category;
      currentPage = 1;
      const currentRequest = ++requestId;
      categoryButtons.forEach(button => button.classList.toggle('active', button.dataset.category === category));
      result.textContent = 'Carregando desenhos...';
      pageStatus.textContent = '';
      previousButton.disabled = true;
      nextButton.disabled = true;
      grid.innerHTML = '<p class="coloring-loading">Carregando desenhos...</p>';
      try {
        const items = await loadDrawings(category);
        if (currentRequest !== requestId) return;
        visibleDrawings = items;
        renderPage();
      } catch (error) {
        if (currentRequest !== requestId) return;
        visibleDrawings = [];
        result.textContent = 'Não foi possível carregar esta categoria.';
        grid.innerHTML = `<p class="coloring-error">${escapeHtml(error.message)}</p>`;
      }
    };

    categoryButtons.forEach(button => button.addEventListener('click', () => selectCategory(button.dataset.category)));
    previousButton.addEventListener('click', () => { currentPage -= 1; renderPage(); });
    nextButton.addEventListener('click', () => { currentPage += 1; renderPage(); });
    grid.addEventListener('click', event => {
      const trigger = event.target.closest('[data-print-index]');
      if (!trigger) return;
      const item = visibleDrawings[Number(trigger.dataset.printIndex)];
      if (item) printDrawing(item);
    });
    demoContainer.querySelector('.demo-surprise').addEventListener('click', async () => {
      result.textContent = 'Escolhendo um desenho...';
      try {
        const allDrawings = await loadDrawings('Todos');
        const item = allDrawings[Math.floor(Math.random() * allDrawings.length)];
        result.textContent = `Sugestão: ${item.titulo}`;
        printDrawing(item);
      } catch (error) {
        result.textContent = 'Não foi possível escolher um desenho agora.';
      }
    });
    selectCategory(activeCategory);
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
