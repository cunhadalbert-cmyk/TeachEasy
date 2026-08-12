(() => {
  'use strict';

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const clean = (value = '') => String(value).replace(/\s+/g, ' ').trim();
  const generationCache = new Map();

  function currentStudentImage(shell) {
    return shell?.querySelector('.te-final-student .te-final-visual img') || null;
  }

  function imageSource(image) {
    return String(image?.currentSrc || image?.src || image?.getAttribute?.('src') || '').trim();
  }

  function validFinalImage(image) {
    const src = imageSource(image);
    return Boolean(src) && !/^data:image\/svg\+xml/i.test(src);
  }

  function activityData(shell) {
    const student = shell?.querySelector('.te-final-student');
    const title = clean(student?.querySelector('.te-final-title')?.textContent || 'ATIVIDADE ESCOLAR');
    const subject = title.replace(/^ATIVIDADE DE\s+/i, '') || 'Atividade Escolar';
    const topic = clean(student?.querySelector('.te-final-subtitle')?.textContent || 'conteúdo escolar');
    const support = clean(student?.querySelector('.te-final-text')?.textContent || '');
    const questions = [...(student?.querySelectorAll('.te-final-qhead') || [])]
      .slice(0, 4)
      .map(node => clean(node.textContent))
      .join(' ');
    return {
      subject,
      topic,
      context: clean(`${support} ${questions}`).slice(0, 700)
    };
  }

  function cacheKey(data) {
    return `${data.subject}|${data.topic}|${data.context}`.toLowerCase().slice(0, 900);
  }

  async function generateFinalImage(shell) {
    let image = currentStudentImage(shell);
    if (validFinalImage(image)) return image;

    const visual = shell?.querySelector('.te-final-student .te-final-visual');
    if (!visual) throw new Error('Não encontrei o espaço da ilustração.');

    const data = activityData(shell);
    const key = cacheKey(data);
    let dataUrl = generationCache.get(key) || '';

    if (!dataUrl) {
      const response = await fetch('/api/generate-library-illustration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const payload = await response.json();
      if (!response.ok || !payload.illustrationDataUrl) {
        throw new Error(payload.error || 'Não foi possível gerar a ilustração.');
      }
      dataUrl = payload.illustrationDataUrl;
      generationCache.set(key, dataUrl);
    }

    if (!image) {
      image = document.createElement('img');
      visual.appendChild(image);
    }
    image.src = dataUrl;
    image.alt = `Ilustração pedagógica gerada para ${data.topic}`;
    image.dataset.teAiIllustration = 'true';
    image.style.display = '';

    if (shell._teFinalData) shell._teFinalData.visual = dataUrl;
    return image;
  }

  async function waitForFinalImage(shell, timeoutMs = 60000) {
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
      try { await image.decode(); } catch { /* imagem carregada já é suficiente */ }
    }

    const src = imageSource(image);
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

    try {
      if (!validFinalImage(currentStudentImage(shell))) {
        button.textContent = 'Gerando imagem...';
        await generateFinalImage(shell);
      }

      button.textContent = 'Preparando arquivo...';
      await waitForFinalImage(shell);
      button.dataset.teExportImageReady = 'true';
      button.disabled = false;
      button.textContent = originalText;
      button.click();
    } catch (error) {
      console.error('teacheasy-export-image-sync', error);
      button.disabled = false;
      button.textContent = originalText;
      window.alert(error.message || 'Não foi possível preparar a imagem antes do download.');
    }
  }, true);
})();