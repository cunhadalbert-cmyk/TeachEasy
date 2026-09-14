(() => {
  const printArea = document.querySelector('#print-area');
  const livePreview = document.querySelector('#live-preview');

  if (!printArea || !livePreview) return;

  let resizeTimer = null;

  function emptyMarkup() {
    return `
      <div class="live-preview-empty">
        <strong>Sua folha aparecerá aqui.</strong>
        <span>Marque uma questão para começar a montar.</span>
      </div>
    `;
  }

  function fitPage() {
    const stage = livePreview.querySelector('.live-preview-stage');
    const page = livePreview.querySelector('.live-preview-page');
    if (!stage || !page) return;

    page.style.transform = 'none';
    stage.style.width = '';
    stage.style.height = '';

    const availableWidth = Math.max(220, livePreview.clientWidth - 20);
    const pageWidth = page.offsetWidth || 794;
    const pageHeight = page.scrollHeight || page.offsetHeight || 1123;
    const scale = Math.min(1, availableWidth / pageWidth);

    page.style.transform = `scale(${scale})`;
    stage.style.width = `${Math.ceil(pageWidth * scale)}px`;
    stage.style.height = `${Math.ceil(pageHeight * scale)}px`;
  }

  function syncLivePreview() {
    const studentPage = printArea.querySelector('.student-page');
    if (!studentPage) {
      livePreview.innerHTML = emptyMarkup();
      return;
    }

    const stage = document.createElement('div');
    stage.className = 'live-preview-stage';

    const clone = studentPage.cloneNode(true);
    clone.classList.add('live-preview-page');
    clone.setAttribute('aria-label', 'Prévia ao vivo do material em montagem');

    stage.append(clone);
    livePreview.replaceChildren(stage);
    requestAnimationFrame(fitPage);
  }

  const observer = new MutationObserver(syncLivePreview);
  observer.observe(printArea, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitPage, 80);
  });

  syncLivePreview();
})();
