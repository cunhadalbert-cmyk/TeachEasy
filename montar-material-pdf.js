(() => {
  const HTML2CANVAS_CDN = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
  const JSPDF_CDN = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js';
  const printArea = document.querySelector('#print-area');
  const button = document.querySelector('#print-material');
  if (!printArea || !button) return;

  let librariesPromise = null;

  function loadScript(src, ready) {
    if (ready()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(script => script.src === src);
      if (existing) {
        existing.addEventListener('load', () => ready() ? resolve() : reject(new Error('Biblioteca de PDF não ficou disponível.')), { once: true });
        existing.addEventListener('error', () => reject(new Error('Não foi possível carregar a biblioteca de PDF.')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => ready() ? resolve() : reject(new Error('Biblioteca de PDF não ficou disponível.'));
      script.onerror = () => reject(new Error('Não foi possível carregar a biblioteca de PDF.'));
      document.head.appendChild(script);
    });
  }

  function ensurePdfLibraries() {
    if (window.html2canvas && window.jspdf?.jsPDF) return Promise.resolve();
    if (librariesPromise) return librariesPromise;

    librariesPromise = (async () => {
      await loadScript(HTML2CANVAS_CDN, () => Boolean(window.html2canvas));
      await loadScript(JSPDF_CDN, () => Boolean(window.jspdf?.jsPDF));
    })();

    return librariesPromise;
  }

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

  function markDuplicateImages(root = printArea) {
    root.querySelectorAll('.pdf-duplicate-image').forEach(image => {
      image.classList.remove('pdf-duplicate-image');
    });

    root.querySelectorAll('.source-block').forEach(block => {
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

  function addExplicitListNumbers(root) {
    const lists = [
      ['.final-questions > li', 'pdf-explicit-question-number'],
      ['.answer-key-list > li', 'pdf-explicit-answer-number']
    ];

    lists.forEach(([selector, className]) => {
      [...root.querySelectorAll(selector)].forEach((item, index) => {
        const explicitValue = Number(item.getAttribute('value'));
        const numberValue = Number.isFinite(explicitValue) && explicitValue > 0
          ? explicitValue
          : index + 1;

        item.style.listStyle = 'none';
        item.style.position = 'relative';
        item.style.paddingLeft = '22px';

        const number = document.createElement('span');
        number.className = className;
        number.textContent = `${numberValue}.`;
        number.setAttribute('aria-hidden', 'true');
        Object.assign(number.style, {
          position: 'absolute',
          left: '0',
          top: '0',
          fontFamily: 'Arial, sans-serif',
          fontSize: 'inherit',
          fontWeight: '700',
          lineHeight: 'inherit',
          color: '#111'
        });
        item.prepend(number);
      });
    });
  }

  async function waitForImage(image) {
    if (image.complete && image.naturalWidth > 0) {
      try {
        if (image.decode) await image.decode();
      } catch {
        // A imagem já pode ser usada mesmo se decode() falhar.
      }
      return;
    }

    await new Promise(resolve => {
      const finish = () => resolve();
      image.addEventListener('load', finish, { once: true });
      image.addEventListener('error', finish, { once: true });
      setTimeout(finish, 3500);
    });
  }

  async function waitForAssets(root) {
    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        // Continua com Arial/fonte disponível no navegador.
      }
    }

    const images = [...root.querySelectorAll('img:not(.pdf-duplicate-image)')];
    await Promise.all(images.map(waitForImage));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  function createCaptureStage(page) {
    const stage = document.createElement('div');
    stage.className = 'pdf-capture-stage';

    const clone = page.cloneNode(true);
    clone.classList.add('pdf-capture-page');
    clone.querySelectorAll('.pdf-duplicate-image').forEach(image => image.remove());
    addExplicitListNumbers(clone);

    stage.appendChild(clone);
    document.body.appendChild(stage);
    return { stage, clone };
  }

  async function renderPageToCanvas(page) {
    const { stage, clone } = createCaptureStage(page);
    try {
      await waitForAssets(clone);
      const canvas = await window.html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 5000,
        removeContainer: true
      });

      if (!canvas.width || !canvas.height) {
        throw new Error('A página do PDF não pôde ser renderizada corretamente.');
      }
      return canvas;
    } finally {
      stage.remove();
    }
  }

  function addCanvasAsA4Page(pdf, canvas, pageIndex) {
    if (pageIndex > 0) pdf.addPage('a4', 'portrait');

    const pageWidth = 210;
    const pageHeight = 297;
    const outerInset = 5;
    const contentInset = 7;
    const maxWidth = pageWidth - (contentInset * 2);
    const maxHeight = pageHeight - (contentInset * 2);
    const sourceRatio = canvas.height / canvas.width;

    let width = maxWidth;
    let height = width * sourceRatio;
    if (height > maxHeight) {
      height = maxHeight;
      width = height / sourceRatio;
    }

    const x = (pageWidth - width) / 2;
    const y = contentInset;
    const image = canvas.toDataURL('image/jpeg', 0.97);

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.25);
    pdf.rect(outerInset, outerInset, pageWidth - (outerInset * 2), pageHeight - (outerInset * 2));
    pdf.addImage(image, 'JPEG', x, y, width, height, undefined, 'FAST');
  }

  function clearPdfState() {
    document.body.classList.remove('pdf-printing');
    document.querySelectorAll('.pdf-capture-stage').forEach(stage => stage.remove());
    printArea.querySelectorAll('.pdf-duplicate-image').forEach(image => {
      image.classList.remove('pdf-duplicate-image');
    });
  }

  async function downloadPdf() {
    const studentPage = printArea.querySelector('.student-page');
    const answerPage = printArea.querySelector('.answer-key-page');
    if (!studentPage || !answerPage) {
      throw new Error('Monte pelo menos uma questão antes de baixar o PDF.');
    }

    document.body.classList.add('pdf-printing');
    markDuplicateImages();
    await waitForAssets(printArea);
    await ensurePdfLibraries();

    const pages = [studentPage, answerPage];
    const canvases = [];
    for (const page of pages) {
      canvases.push(await renderPageToCanvas(page));
    }

    if (canvases.length !== 2) {
      throw new Error('O PDF deve conter exatamente duas páginas: atividade e gabarito.');
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      putOnlyUsedFonts: true
    });

    canvases.forEach((canvas, index) => addCanvasAsA4Page(pdf, canvas, index));

    if (pdf.getNumberOfPages() !== 2) {
      throw new Error('A validação do PDF encontrou quantidade incorreta de páginas.');
    }

    pdf.save('teacheasy-material.pdf');
  }

  button.textContent = 'Baixar PDF';

  document.addEventListener('click', async event => {
    const clicked = event.target.closest('#print-material');
    if (!clicked) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const originalText = clicked.textContent;
    clicked.disabled = true;
    clicked.textContent = 'Preparando PDF...';

    try {
      await downloadPdf();
    } catch (error) {
      console.error(error);
      window.alert(error?.message || 'Não foi possível gerar o PDF agora.');
    } finally {
      clearPdfState();
      clicked.disabled = false;
      clicked.textContent = originalText;
    }
  }, true);
})();
