(() => {
  const printArea = document.querySelector('#print-area');
  const button = document.querySelector('#print-material');
  if (!printArea || !button) return;

  function normalizedImageKey(image) {
    const raw = image.currentSrc || image.src || image.getAttribute('src') || '';
    if (!raw) return '';
    try {
      const url = new URL(raw, window.location.href);
      return `${url.origin}${url.pathname}`.toLocaleLowerCase('pt-BR');
    } catch {
      return raw.split(/[?#]/)[0].toLocaleLowerCase('pt-BR');
    }
  }

  function markDuplicateImages() {
    printArea.querySelectorAll('.pdf-duplicate-image').forEach(image => {
      image.classList.remove('pdf-duplicate-image');
    });

    printArea.querySelectorAll('.source-block').forEach(block => {
      const seen = new Set();
      block.querySelectorAll('.source-support img, .question-image').forEach(image => {
        const key = normalizedImageKey(image);
        if (!key) return;
        if (seen.has(key)) {
          image.classList.add('pdf-duplicate-image');
          return;
        }
        seen.add(key);
      });
    });
  }

  function clearPdfState() {
    document.body.classList.remove('pdf-printing', 'pdf-stack-images');
    printArea.querySelectorAll('.pdf-duplicate-image').forEach(image => {
      image.classList.remove('pdf-duplicate-image');
    });
  }

  async function waitForImage(image) {
    if (image.complete && image.naturalWidth > 0) {
      try {
        if (image.decode) await image.decode();
      } catch {
        // A imagem já está utilizável mesmo quando decode() falha em alguns navegadores.
      }
      return;
    }

    await new Promise(resolve => {
      const finish = () => resolve();
      image.addEventListener('load', finish, { once: true });
      image.addEventListener('error', finish, { once: true });
      setTimeout(finish, 3000);
    });
  }

  function visibleImages() {
    return [...printArea.querySelectorAll('img:not(.pdf-duplicate-image)')]
      .filter(image => {
        const style = getComputedStyle(image);
        const rect = image.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
      });
  }

  function rectsOverlap(a, b) {
    const horizontal = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const vertical = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return horizontal > 2 && vertical > 2;
  }

  function hasImageOverlap() {
    const images = visibleImages();
    const rects = images.map(image => ({ image, rect: image.getBoundingClientRect() }));

    for (let i = 0; i < rects.length; i += 1) {
      for (let j = i + 1; j < rects.length; j += 1) {
        if (rectsOverlap(rects[i].rect, rects[j].rect)) return true;
      }
    }
    return false;
  }

  async function settleLayout() {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  async function preparePdf() {
    document.body.classList.add('pdf-printing');
    markDuplicateImages();

    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // Mantém a impressão disponível mesmo se uma fonte externa falhar.
      }
    }

    const images = [...printArea.querySelectorAll('img:not(.pdf-duplicate-image)')];
    await Promise.all(images.map(waitForImage));
    await settleLayout();

    if (hasImageOverlap()) {
      document.body.classList.add('pdf-stack-images');
      await settleLayout();
    }

    if (hasImageOverlap()) {
      throw new Error('O PDF ainda apresentou colisão entre imagens. Tente novamente após recarregar a página.');
    }
  }

  document.addEventListener('click', async event => {
    const clicked = event.target.closest('#print-material');
    if (!clicked) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const originalText = clicked.textContent;
    clicked.disabled = true;
    clicked.textContent = 'Preparando PDF...';

    try {
      await preparePdf();
      window.print();
    } catch (error) {
      console.error(error);
      window.alert(error?.message || 'Não foi possível preparar o PDF agora.');
    } finally {
      clearPdfState();
      clicked.disabled = false;
      clicked.textContent = originalText;
    }
  }, true);

  window.addEventListener('afterprint', clearPdfState);
})();
