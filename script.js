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

    .pedagogical-games-demo{width:min(1080px,100%)}
    .pedagogical-games-intro{margin:0 auto 18px;max-width:760px;text-align:center;color:#31566f;font-weight:700;line-height:1.5}
    .pedagogical-games-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
    .pedagogical-game-card{display:grid;gap:12px;padding:18px;border:2px solid #bfe6ff;border-radius:22px;background:#fff;box-shadow:0 10px 24px rgba(29,91,140,.12)}
    .pedagogical-game-card header{display:flex;align-items:center;gap:12px}
    .pedagogical-game-icon{display:grid;place-items:center;width:52px;height:52px;border-radius:16px;background:#e7f6ff;font-size:2rem}
    .pedagogical-game-card h3{margin:0;color:#075aa8;font-size:clamp(1.15rem,2vw,1.45rem)}
    .pedagogical-game-card p{margin:0;color:#4a6072;line-height:1.45}
    .pedagogical-game-card ul{display:grid;gap:7px;margin:0;padding:0;list-style:none;color:#3c5365;font-weight:700}
    .pedagogical-game-card li{display:flex;gap:8px;align-items:flex-start}
    .pedagogical-game-card li::before{content:'✓';color:#0876cf;font-weight:900}
    .pedagogical-game-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
    .pedagogical-game-actions button{min-height:42px;padding:9px 14px;border:0;border-radius:12px;background:#0876cf;color:#fff;font:inherit;font-weight:900;cursor:pointer}
    .pedagogical-game-actions button.secondary{background:#6d1027}
    .pedagogical-game-preview{margin-top:6px;padding:14px;border-radius:16px;background:#f2f9ff;color:#25465c;line-height:1.5}
    .pedagogical-game-preview strong{display:block;margin-bottom:6px;color:#075aa8}
    .pedagogical-game-preview ol{margin:8px 0 0;padding-left:22px}
    .pedagogical-game-preview li{display:list-item;font-weight:600}
    .pedagogical-game-preview li::before{content:none}

    @media(max-width:820px){
      .coloring-demo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .pedagogical-games-grid{grid-template-columns:1fr}
    }
    @media(max-width:560px){
      .coloring-demo-toolbar{align-items:stretch;flex-direction:column}
      .coloring-demo-grid{grid-template-columns:1fr}
      .coloring-card-actions{grid-template-columns:1fr}
      .pedagogical-game-card{padding:15px}
      .pedagogical-game-actions{flex-direction:column}
      .pedagogical-game-actions button{width:100%}
    }
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
    'games-demo': ['🎲', 'Jogos pedagógicos', 'Caça-palavras, cruzadinhas, bingo educativo, associação de imagens, recorte e montagem.']
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
    return String(value).replace(/[&<>'\"]/g, character => ({
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

  const pedagogicalGames = [
    {
      icon: '🔎',
      title: 'Caça-palavras',
      description: 'Atividade para encontrar palavras escondidas e reforçar vocabulário por tema.',
      uses: ['Português: sílabas, substantivos e verbos', 'Ciências: animais, plantas e corpo humano', 'História e Geografia: datas, lugares e conceitos'],
      preview: 'Tema: Animais',
      steps: ['Encontre: GATO, SAPO, LEÃO, PEIXE e AVE.', 'Circule cada palavra encontrada.', 'Escolha uma palavra e escreva uma frase.']
    },
    {
      icon: '✏️',
      title: 'Cruzadinhas',
      description: 'Jogo de perguntas e respostas para completar palavras nos espaços da cruzadinha.',
      uses: ['Trabalha leitura e interpretação', 'Ajuda na escrita correta das palavras', 'Pode ser usado como revisão antes da prova'],
      preview: 'Tema: Meio ambiente',
      steps: ['1 horizontal: lugar com muitas árvores.', '2 vertical: líquido essencial para a vida.', '3 horizontal: cuidar e não jogar lixo.']
    },
    {
      icon: '🎯',
      title: 'Bingo educativo',
      description: 'Cartelas pedagógicas para revisar conteúdos de forma lúdica em sala de aula.',
      uses: ['Bingo de números e operações', 'Bingo de letras, sílabas e palavras', 'Bingo de figuras, animais e profissões'],
      preview: 'Tema: Matemática',
      steps: ['O professor sorteia uma conta.', 'O aluno marca o resultado na cartela.', 'Vence quem completar linha, coluna ou cartela cheia.']
    },
    {
      icon: '🧩',
      title: 'Associação de imagens',
      description: 'Atividade para ligar imagem, palavra, conceito ou resposta correta.',
      uses: ['Imagem + palavra', 'Figura + som inicial', 'Objeto + função', 'Animal + habitat'],
      preview: 'Tema: Profissões',
      steps: ['Ligue o bombeiro ao caminhão de bombeiros.', 'Ligue a professora ao quadro.', 'Ligue o médico ao estetoscópio.']
    },
    {
      icon: '✂️',
      title: 'Recorte e montagem',
      description: 'Material para imprimir, recortar, ordenar, colar e montar com apoio visual.',
      uses: ['Sequência de histórias', 'Ciclo da água e ciclo de vida', 'Formas geométricas e partes do corpo'],
      preview: 'Tema: Sequência lógica',
      steps: ['Recorte as figuras.', 'Organize na ordem correta.', 'Cole no caderno e explique o que aconteceu.']
    }
  ];

  function printGame(game) {
    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) return;
    const useItems = game.uses.map(item => `<li>${escapeHtml(item)}</li>`).join('');
    const stepItems = game.steps.map(item => `<li>${escapeHtml(item)}</li>`).join('');
    printWindow.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(game.title)}</title><style>@page{size:A4;margin:14mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#263847}.sheet{border:2px solid #9dd2ff;border-radius:18px;padding:20px;min-height:250mm}.brand{font-size:22px;font-weight:900;color:#075aa8}.subtitle{color:#6d1027;font-weight:800;margin:4px 0 24px}h1{font-size:30px;margin:0 0 12px;color:#075aa8}.icon{font-size:42px}.box{border:1px solid #bfe6ff;border-radius:14px;padding:14px;margin:14px 0;background:#f6fbff}li{margin:8px 0;font-size:17px}.footer{margin-top:24px;font-weight:800;color:#6d1027}</style></head><body><main class="sheet"><div class="brand">TeachEasy</div><div class="subtitle">O caminho mais rápido do professor.</div><div class="icon">${game.icon}</div><h1>${escapeHtml(game.title)}</h1><p>${escapeHtml(game.description)}</p><section class="box"><strong>Como usar em sala:</strong><ul>${useItems}</ul></section><section class="box"><strong>Modelo rápido:</strong><p>${escapeHtml(game.preview)}</p><ol>${stepItems}</ol></section><p class="footer">Professor(a): ____________________ Turma: ______ Data: ____/____/______</p></main><script>window.onload=()=>setTimeout(()=>window.print(),350)<\/script></body></html>`);
    printWindow.document.close();
  }

  function gamesDemo() {
    if (!demoContainer) return;
    demoContainer.innerHTML = `<div class="demo-showcase pedagogical-games-demo"><p class="pedagogical-games-intro">Escolha um dos cinco jogos pedagógicos aprovados. Cada card mantém o padrão do TeachEasy e traz uma ideia pronta para o professor imprimir ou adaptar.</p><div class="pedagogical-games-grid">${pedagogicalGames.map((game, index) => `<article class="pedagogical-game-card"><header><span class="pedagogical-game-icon" aria-hidden="true">${game.icon}</span><h3>${escapeHtml(game.title)}</h3></header><p>${escapeHtml(game.description)}</p><ul>${game.uses.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul><div class="pedagogical-game-preview"><strong>${escapeHtml(game.preview)}</strong><ol>${game.steps.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol></div><div class="pedagogical-game-actions"><button type="button" data-game-print="${index}">Imprimir modelo</button><button class="secondary" type="button" data-game-copy="${index}">Copiar ideia</button></div></article>`).join('')}</div></div>`;

    demoContainer.querySelectorAll('[data-game-print]').forEach(button => {
      button.addEventListener('click', () => printGame(pedagogicalGames[Number(button.dataset.gamePrint)]));
    });
    demoContainer.querySelectorAll('[data-game-copy]').forEach(button => {
      button.addEventListener('click', async () => {
        const game = pedagogicalGames[Number(button.dataset.gameCopy)];
        const text = `${game.title}\n${game.description}\n\n${game.preview}\n${game.steps.join('\n')}`;
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = 'Copiado!';
          window.setTimeout(() => { button.textContent = 'Copiar ideia'; }, 1400);
        } catch {
          button.textContent = 'Não copiou';
          window.setTimeout(() => { button.textContent = 'Copiar ideia'; }, 1400);
        }
      });
    });
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
