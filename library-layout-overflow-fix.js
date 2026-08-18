(() => {
  'use strict';

  const MAX_FONT_PT = 12;
  const MIN_FONT_PT = 8;
  const STEP_PT = 0.25;

  let fitScheduled = false;

  function installFixStyles() {
    if (document.querySelector('#te-layout-overflow-fix-style')) return;

    const style = document.createElement('style');
    style.id = 'te-layout-overflow-fix-style';
    style.textContent = `
      .te-final-content {
        min-width: 0 !important;
        min-height: 0 !important;
        max-width: 100%;
        box-sizing: border-box;
        align-items: stretch;
      }

      .te-final-content > * {
        min-width: 0;
        box-sizing: border-box;
      }

      .te-final-text {
        min-width: 0 !important;
        min-height: 0 !important;
        max-width: 100% !important;
        max-height: 100% !important;
        box-sizing: border-box;
        overflow: hidden !important;
        white-space: normal !important;
        overflow-wrap: break-word !important;
        word-wrap: break-word !important;
        word-break: normal !important;
        hyphens: auto;
      }

      .te-final-text h1,
      .te-final-text h2,
      .te-final-text h3,
      .te-final-text h4 {
        max-width: 100%;
        box-sizing: border-box;
        overflow-wrap: break-word;
        word-break: normal;
        line-height: 1.2 !important;
        margin-top: 0 !important;
        margin-bottom: 1.5mm !important;
      }

      .te-final-text h3 {
        font-size: inherit !important;
      }

      .te-final-text p {
        max-width: 100%;
        box-sizing: border-box;
        font-size: inherit !important;
        line-height: 1.2 !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
        margin-top: 0 !important;
        margin-bottom: 1.5mm !important;
      }

      .te-final-text p:last-child {
        margin-bottom: 0 !important;
      }

      .te-final-text ul,
      .te-final-text ol {
        max-width: 100%;
        box-sizing: border-box;
        margin-top: 1mm;
        margin-bottom: 1.5mm;
        padding-left: 5mm;
      }

      .te-final-text li {
        line-height: 1.2;
        overflow-wrap: break-word;
      }

      .te-final-visual {
        min-width: 0 !important;
        min-height: 0 !important;
        width: 100%;
        height: 100%;
        padding: 0 !important;
        overflow: hidden !important;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .te-final-visual img {
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        max-height: none !important;
        object-fit: cover !important;
        object-position: center center !important;
        display: block;
      }

      .te-final-instruction {
        position: relative !important;
        display: block;
        clear: none !important;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        margin-top: 2mm !important;
        overflow-wrap: break-word;
      }

      .te-final-questions {
        position: relative !important;
        display: block;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        overflow-wrap: break-word;
      }

      .collection-preview-shell.te-text-overflow .te-final-text {
        overflow: hidden !important;
      }

      @media (max-width: 760px) {
        .te-final-content {
          height: auto !important;
          min-height: 9.6cm !important;
          grid-template-columns: minmax(0, 47fr) minmax(0, 53fr) !important;
        }

        .te-final-text {
          height: auto;
          max-height: none !important;
        }

        .te-final-visual {
          min-height: 9.6cm !important;
        }
      }

      @media print {
        .te-final-content,
        .te-final-text,
        .te-final-instruction,
        .te-final-questions {
          box-sizing: border-box !important;
        }

        .te-final-text {
          overflow: hidden !important;
        }

        .te-final-instruction {
          margin-top: 2mm !important;
        }

        .te-final-visual img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center center !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function fits(textEl) {
    if (!textEl) return true;

    const heightFits = textEl.scrollHeight <= textEl.clientHeight + 1;
    const widthFits = textEl.scrollWidth <= textEl.clientWidth + 1;

    return heightFits && widthFits;
  }

  function applyFontSize(textEl, size) {
    if (!textEl) return;

    textEl.style.fontSize = `${size}pt`;
    textEl.style.lineHeight = '1.2';
  }

  function resetFitState(shell, textEl) {
    shell.classList.remove('te-text-overflow');
    delete shell.dataset.teTextOverflow;

    textEl.style.removeProperty('font-size');
    textEl.style.removeProperty('line-height');
  }

  function fitText(shell) {
    if (!shell || !shell.isConnected) return;

    const textEl = shell.querySelector('.te-final-text');
    if (!textEl || !textEl.isConnected) return;

    if (textEl.clientWidth <= 0 || textEl.clientHeight <= 0) return;

    resetFitState(shell, textEl);

    let size = MAX_FONT_PT;
    applyFontSize(textEl, size);

    while (!fits(textEl) && size > MIN_FONT_PT) {
      size = Math.max(MIN_FONT_PT, size - STEP_PT);
      applyFontSize(textEl, size);
    }

    const overflow = !fits(textEl);

    shell.classList.toggle('te-text-overflow', overflow);
    shell.dataset.teResolvedBodyFontSize = String(size);
    shell.dataset.teTextOverflow = overflow ? 'true' : 'false';

    if (shell._teFinalData) {
      shell._teFinalData.bodyFontSize = size;
    }

    const instruction = shell.querySelector('.te-final-instruction');
    if (instruction) {
      instruction.style.position = 'relative';
      instruction.style.clear = 'none';
      instruction.style.marginTop = '2mm';
    }
  }

  function runFitAll() {
    installFixStyles();

    document
      .querySelectorAll('#preview-content .collection-preview-shell')
      .forEach(shell => {
        if (shell.querySelector('.te-final-text')) {
          fitText(shell);
        }
      });
  }

  function fitAll() {
    if (fitScheduled) return;

    fitScheduled = true;

    requestAnimationFrame(() => {
      fitScheduled = false;
      runFitAll();
    });
  }

  function installObservers() {
    const root = document.querySelector('#preview-content');
    if (!root) return;

    const mutationObserver = new MutationObserver(fitAll);
    mutationObserver.observe(root, {
      childList: true,
      subtree: true
    });

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(fitAll);
      resizeObserver.observe(root);

      root.querySelectorAll('.collection-preview-shell').forEach(shell => {
        resizeObserver.observe(shell);
      });
    }

    root.addEventListener(
      'load',
      event => {
        if (event.target instanceof HTMLImageElement) {
          fitAll();
        }
      },
      true
    );
  }

  function waitForFonts() {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(fitAll).catch(fitAll);
    }
  }

  window.addEventListener('beforeprint', runFitAll);
  window.addEventListener('resize', fitAll, { passive: true });

  installFixStyles();
  installObservers();
  waitForFonts();
  fitAll();

  window.teachEasyFitActivityText = fitAll;
})();
