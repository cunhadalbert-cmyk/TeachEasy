(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .coloring-library-demo{width:min(1080px,100%)}
    .coloring-demo-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:18px 0}
    .coloring-demo-toolbar .demo-surprise-result{margin:0;font-weight:800}
    .coloring-demo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;max-height:58vh;overflow-y:auto;padding:4px}
    .coloring-demo-card{overflow:hidden;border:1px solid rgba(74,7,21,.14);border-radius:18px;background:#fff;box-shadow:0 8px 22px rgba(74,7,21,.08)}
    .coloring-preview-button{display:grid;width:100%;padding:0;border:0;background:#fff;color:#35121c;cursor:pointer;text-align:left}
    .coloring-preview-button img{width:100%;aspect-ratio:4/3;padding:12px;object-fit:contain;background:#fff;box-sizing:border-box}
    .coloring-preview-button strong,.coloring-preview-button span{padding-inline:14px}
    .coloring-preview-button strong{padding-top:12px;font-size:1rem}
    .coloring-preview-button span{padding-top:4px;padding-bottom:12px;color:#76525d;font-size:.9rem}
    .coloring-card-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 12px 12px}
    .coloring-card-actions button,.coloring-card-actions a,.coloring-pagination button{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:6px 10px;border:0;border-radius:10px;background:#6d1027;color:#fff;font:inherit;font-weight:800;text-decoration:none;cursor:pointer}
    .coloring-pagination{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:18px}
    .coloring-pagination span{min-width:110px;text-align:center;font-weight:800}
    .coloring-pagination button:disabled{opacity:.4;cursor:not-allowed}
    .coloring-loading,.coloring-error{grid-column:1/-1;padding:32px 18px;text-align:center;font-weight:800}
    .coloring-error{color:#8b1d35}

    .memory-demo{width:min(1080px,100%)}
    .memory-tabs{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:18px}
    .memory-tab{border:2px solid #9dd2ff;border-radius:999px;background:#fff;color:#075aa8;padding:10px 16px;font:inherit;font-weight:800;cursor:pointer}
    .memory-tab.active{background:#0876cf;color:#fff;border-color:#0876cf}
    .memory-status{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 16px;font-weight:800;color:#17496f}
    .memory-reset{border:0;border-radius:12px;background:#ff7a00;color:#fff;padding:10px 16px;font:inherit;font-weight:800;cursor:pointer}
    .memory-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
    .memory-card{position:relative;aspect-ratio:1/1;border:0;border-radius:20px;background:transparent;cursor:pointer;perspective:900px;padding:0}
    .memory-card-inner{position:absolute;inset:0;transition:transform .38s;transform-style:preserve-3d}
    .memory-card.flipped .memory-card-inner,.memory-card.matched .memory-card-inner{transform:rotateY(180deg)}
    .memory-face{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:20px;backface-visibility:hidden;box-shadow:0 8px 20px rgba(29,91,140,.15)}
    .memory-back{background:linear-gradient(145deg,#0876cf,#35a4ef);color:#fff;border:4px solid #bfe6ff;font-size:clamp(2rem,5vw,4rem)}
    .memory-front{transform:rotateY(180deg);background:#fff;border:4px solid #bfe6ff;flex-direction:column;padding:10px;text-align:center}
    .memory-emoji{font-size:clamp(2.4rem,6vw,4.8rem);line-height:1}
    .memory-label{margin-top:8px;color:#17496f;font-weight:900;font-size:clamp(.78rem,1.6vw,1rem)}
    .memory-card.matched .memory-front{outline:4px solid #64c96b;outline-offset:-4px}
    .memory-title{text-align:center;margin:0 0 16px;color:#075aa8;font-size:clamp(1.35rem,3vw,2rem)}

    @media(max-width:820px){
      .coloring-demo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .memory-board{grid-template-columns:repeat(3,minmax(0,1fr))}
    }
    @media(max-width:560px){
      .coloring-demo-toolbar{align-items:stretch;flex-direction:column}
      .coloring-demo-grid{grid-template-columns:1fr}
      .coloring-card-actions{grid-template-columns:1fr}
      .memory-board{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .memory-status{align-items:stretch;flex-direction:column;text-align:center}
    }
    @media(prefers-reduced-motion:reduce){.memory-card-inner{transition:none}}
  `;
  document.head.appendChild(style);

  const slides = [...document.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.carousel-dots button')];
  const carousel = document.querySelector('.carousel');
  const prevArrow = document.querySelector('.carousel-arrow.prev');
  const nextArrow = document.querySelector('.carousel-arrow.next');
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
    [[prevArrow, -1], [nextArrow, 1]].forEach(([arrow, direction]) => {
      if (!arrow) return;
      arrow.addEventListener('click', event => {
        event.stopPropagation();
        changeSlide(direction);
      });
    });
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
    'games-demo': ['🧠', 'Jogos da memória', 'Escolha um tema e encontre todos os pares.']
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
    const items = (await response.json()).map(item => ({ ...item, arquivo: `assets/desenhos/${slug}/${item.arquivo}` }));
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
    printWindow.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(item.titulo)}</title><style>@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;width:210mm;height:297mm;background:#fff}body{padding:12mm;display:flex;align-items:center;justify-content:center;overflow:hidden}.print-sheet{width:186mm;height:273mm;padding:8mm;border:.45mm solid #222;display:flex;align-items:center;justify-content:center;background:#fff;overflow:hidden}.print-sheet img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain}</style></head><body><div class="print-sheet"><img src="${absoluteImageUrl}" alt="${escapeHtml(item.titulo)}"></div><script>window.onload=()=>setTimeout(()=>window.print(),400)<\/script></body></html>`);
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
      currentPage = 1;
      const currentRequest = ++requestId;
      categoryButtons.forEach(button => button.classList.toggle('active', button.dataset.category === category));
      result.textContent = 'Carregando desenhos...';
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
      } catch {
        result.textContent = 'Não foi possível escolher um desenho agora.';
      }
    });
    selectCategory('Todos');
  }

  const memoryThemes = {
    Animais: [['🐶','Pingo'],['🐱','Gato'],['🐰','Coelho'],['🦁','Leão'],['🐘','Elefante'],['🐦','Pássaro']],
    Matemática: [['1️⃣','Número 1'],['2️⃣','Número 2'],['3️⃣','Número 3'],['➕','Adição'],['➖','Subtração'],['✖️','Multiplicação']],
    Natureza: [['☀️','Sol'],['🌈','Arco-íris'],['🌳','Árvore'],['🌸','Flor'],['☁️','Nuvem'],['🦋','Borboleta']],
    Veículos: [['🚗','Carro'],['🚌','Ônibus'],['🚲','Bicicleta'],['✈️','Avião'],['🚢','Navio'],['🚂','Trem']],
    Profissões: [['👩‍🏫','Professora'],['🧑‍⚕️','Médico'],['🧑‍🚒','Bombeiro'],['👮‍♀️','Policial'],['👩‍🍳','Cozinheira'],['🧑‍🌾','Agricultor']]
  };

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function gamesDemo() {
    if (!demoContainer) return;
    demoContainer.innerHTML = `<div class="demo-showcase memory-demo"><h3 class="memory-title">TeachEasy — Jogo da Memória</h3><div class="memory-tabs">${Object.keys(memoryThemes).map((theme, index) => `<button class="memory-tab${index === 0 ? ' active' : ''}" type="button" data-theme="${theme}">${theme}</button>`).join('')}</div><div class="memory-status"><span class="memory-counter" aria-live="polite"></span><button class="memory-reset" type="button">🔄 Embaralhar novamente</button></div><div class="memory-board" aria-label="Tabuleiro do jogo da memória"></div></div>`;

    const board = demoContainer.querySelector('.memory-board');
    const counter = demoContainer.querySelector('.memory-counter');
    const resetButton = demoContainer.querySelector('.memory-reset');
    const tabs = [...demoContainer.querySelectorAll('.memory-tab')];
    let activeTheme = 'Animais';
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matches = 0;

    const updateCounter = () => {
      counter.textContent = `Jogadas: ${moves} • Pares encontrados: ${matches} de 6`;
    };

    const resetTurn = () => {
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    };

    const flipCard = card => {
      if (lockBoard || card === firstCard || card.classList.contains('matched')) return;
      card.classList.add('flipped');
      if (!firstCard) {
        firstCard = card;
        return;
      }
      secondCard = card;
      lockBoard = true;
      moves += 1;
      const isMatch = firstCard.dataset.pair === secondCard.dataset.pair;
      if (isMatch) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matches += 1;
        updateCounter();
        resetTurn();
        if (matches === 6) counter.textContent = `🎉 Parabéns! Você encontrou todos os pares em ${moves} jogadas.`;
      } else {
        updateCounter();
        window.setTimeout(() => {
          firstCard?.classList.remove('flipped');
          secondCard?.classList.remove('flipped');
          resetTurn();
        }, 850);
      }
    };

    const renderBoard = () => {
      moves = 0;
      matches = 0;
      resetTurn();
      const cards = shuffle(memoryThemes[activeTheme].flatMap(([emoji, label], pair) => [
        { emoji, label, pair }, { emoji, label, pair }
      ]));
      board.innerHTML = cards.map((card, index) => `<button class="memory-card" type="button" data-pair="${card.pair}" aria-label="Carta ${index + 1}"><span class="memory-card-inner"><span class="memory-face memory-back">?</span><span class="memory-face memory-front"><span class="memory-emoji">${card.emoji}</span><span class="memory-label">${card.label}</span></span></span></button>`).join('');
      updateCounter();
    };

    board.addEventListener('click', event => {
      const card = event.target.closest('.memory-card');
      if (card) flipCard(card);
    });
    resetButton.addEventListener('click', renderBoard);
    tabs.forEach(tab => tab.addEventListener('click', () => {
      activeTheme = tab.dataset.theme;
      tabs.forEach(item => item.classList.toggle('active', item === tab));
      renderBoard();
    }));
    renderBoard();
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
    if (key === 'coloring-demo') coloringDemo(); else gamesDemo();
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
