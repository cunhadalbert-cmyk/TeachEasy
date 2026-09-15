(() => {
  const printArea = document.querySelector('#print-area');
  const button = document.querySelector('#print-material');
  if (!printArea || !button) return;

  function markDuplicateImages() {
    printArea.querySelectorAll('.pdf-duplicate-image').forEach(image => {
      image.classList.remove('pdf-duplicate-image');
    });

    printArea.querySelectorAll('.source-block').forEach(block => {
      const seen = new Set();
      block.querySelectorAll('.source-support img, .question-image').forEach(image => {
        const key = image.currentSrc || image.src || image.getAttribute('src') || '';
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
    document.body.classList.remove('pdf-printing');
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

    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
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
    } finally {
      clearPdfState();
      clicked.disabled = false;
      clicked.textContent = originalText;
    }
  }, true);

  window.addEventListener('afterprint', clearPdfState);
})();
