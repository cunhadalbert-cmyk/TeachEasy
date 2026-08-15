(() => {
  const MAX_FONT_PT = 12;
  const MIN_FONT_PT = 8;
  const STEP_PT = 0.5;

  function installFixStyles() {
    if (document.querySelector('#te-layout-overflow-fix-style')) return;
    const style = document.createElement('style');
    style.id = 'te-layout-overflow-fix-style';
    style.textContent = `
      .te-final-content{min-width:0;min-height:0;align-items:stretch}
      .te-final-text{min-width:0;min-height:0;max-height:100%;overflow:visible}
      .te-final-text h3{font-size:inherit!important;line-height:1.15!important}
      .te-final-text p{font-size:inherit!important;line-height:inherit!important}
      .te-final-instruction,.te-final-questions{position:relative;z-index:1;background:#fff}
      @media(max-width:760px){
        .te-final-content{height:9.6cm!important;min-height:9.6cm!important;grid-template-columns:47fr 53fr!important}
      }
    `;
    document.head.appendChild(style);
  }

  function fits(textEl) {
    return textEl.scrollHeight <= textEl.clientHeight + 1 && textEl.scrollWidth <= textEl.clientWidth + 1;
  }

  function applyFontSize(textEl, size) {
    textEl.style.fontSize = `${size}pt`;
    textEl.style.lineHeight = '1.15';
  }

  function fitText(shell) {
    const textEl = shell.querySelector('.te-final-text');
    if (!textEl || !textEl.isConnected || textEl.clientHeight <= 0) return;

    let size = MAX_FONT_PT;
    applyFontSize(textEl, size);

    while (!fits(textEl) && size > MIN_FONT_PT) {
      size = Math.max(MIN_FONT_PT, size - STEP_PT);
      applyFontSize(textEl, size);
    }

    if (shell._teFinalData) shell._teFinalData.bodyFontSize = size;
    shell.dataset.teResolvedBodyFontSize = String(size);

    // Segurança: a instrução só pode começar após o quadro principal.
    const content = shell.querySelector('.te-final-content');
    const instruction = shell.querySelector('.te-final-instruction');
    if (content && instruction) {
      instruction.style.clear = 'both';
      instruction.style.marginTop = '2mm';
    }
  }

  function fitAll() {
    installFixStyles();
    document.querySelectorAll('#preview-content .collection-preview-shell').forEach(shell => {
      if (!shell.querySelector('.te-final-text')) return;
      requestAnimationFrame(() => fitText(shell));
    });
  }

  const root = document.querySelector('#preview-content');
  if (root) {
    new MutationObserver(fitAll).observe(root, { childList: true, subtree: true });
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(fitAll);
      resizeObserver.observe(root);
    }
  }

  window.addEventListener('resize', fitAll, { passive: true });
  window.addEventListener('beforeprint', fitAll);
  fitAll();
})();
