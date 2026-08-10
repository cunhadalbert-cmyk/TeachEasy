(() => {
  'use strict';

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function currentStudentImage(shell) {
    return shell?.querySelector('.te-final-student .te-final-visual img') || null;
  }

  function validFinalImage(image) {
    if (!image) return false;
    const src = String(image.currentSrc || image.src || image.getAttribute('src') || '').trim();
    return Boolean(src) && !/^data:image\/svg\+xml/i.test(src);
  }

  async function waitForFinalImage(shell, timeoutMs = 45000) {
    const started = Date.now();
    let image = currentStudentImage(shell);

    while (!validFinalImage(image)) {
      if (Date.now() - started >= timeoutMs) {
        throw new Error('A ilustração ainda não terminou de ser gerada.');
      }
      await sleep(180);
      image = currentStudentImage(shell);
    }

    if (!image.complete) {
      await Promise.race([
        new Promise((resolve, reject) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', () => reject(new Error('A ilustração não pôde ser carregada.')), { once: true });
        }),
        sleep(15000).then(() => { throw new Error('Tempo excedido ao carregar a ilustração.'); })
      ]);
    }

    if (typeof image.decode === 'function') {
      try { await image.decode(); } catch { /* load completo já é suficiente */ }
    }

    const src = String(image.currentSrc || image.src || '').trim();
    if (!src) throw new Error('A ilustração final está vazia.');

    if (shell._teFinalData) shell._teFinalData.visual = src;
    return image;
  }

  document.addEventListener('click', async event => {
    const button = event.target.closest('.te-final-word, .te-final-pdf');
    if (!button) return;

    if (button.dataset.teExportImageReady === 'true') {
      delete button.dataset.teExportImageReady;
      return;
    }

    const shell = button.closest('.collection-preview-shell');
    if (!shell) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Preparando imagem...';

    try {
      await waitForFinalImage(shell);
      button.dataset.teExportImageReady = 'true';
      button.disabled = false;
      button.textContent = originalText;
      button.click();
    } catch (error) {
      console.error('teacheasy-export-image-sync', error);
      button.disabled = false;
      button.textContent = originalText;
      window.alert('A ilustração ainda está sendo preparada. Aguarde alguns segundos e tente baixar novamente.');
    }
  }, true);
})();
