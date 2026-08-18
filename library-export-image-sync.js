(() => {
  'use strict';

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const clean = (value = '') => String(value).replace(/\s+/g, ' ').trim();
  const generationCache = new Map();
  const DB_NAME = 'TeachEasyLibrary';
  const DB_VERSION = 1;
  const STORE_NAME = 'illustrations';
  const ILLUSTRATION_CACHE_VERSION = 'official-cast-v4-20260817-no-duplicates';

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
    return `${ILLUSTRATION_CACHE_VERSION}|${data.subject}|${data.topic}|${data.context}`.toLowerCase().slice(0, 940);
  }

  function openDatabase() {
    if (!('indexedDB' in window)) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Não foi possível abrir o armazenamento de ilustrações.'));
    });
  }

  async function savePersistentImage(key, dataUrl) {
    if (!key || !/^data:image\/png;base64,/i.test(dataUrl || '')) return false;
    const db = await openDatabase();
    if (!db) return false;
    try {
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        transaction.objectStore(STORE_NAME).put({ key, dataUrl, updatedAt: new Date().toISOString() });
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error || new Error('Falha ao salvar a ilustração.'));
        transaction.onabort = () => reject(transaction.error || new Error('Salvamento da ilustração cancelado.'));
      });
      return true;
    } finally {
      db.close();
    }
  }

  async function readPersistentImage(key) {
    if (!key) return '';
    const db = await openDatabase();
    if (!db) return '';
    try {
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const request = transaction.objectStore(STORE_NAME).get(key);
        request.onsuccess = () => resolve(request.result?.dataUrl || '');
        request.onerror = () => reject(request.error || new Error('Falha ao recuperar a ilustração.'));
      });
    } finally {
      db.close();
    }
  }

  function applyImage(shell, dataUrl, origin = 'generated') {
    const visual = shell?.querySelector('.te-final-student .te-final-visual');
    if (!visual || !dataUrl) return null;
    let image = currentStudentImage(shell);
    if (!image) {
      image = document.createElement('img');
      visual.appendChild(image);
    }
    image.src = dataUrl;
    image.alt = `Ilustração pedagógica gerada para ${activityData(shell).topic}`;
    image.dataset.teAiIllustration = 'true';
    image.dataset.tePersistentIllustration = origin === 'persistent' ? 'true' : 'pending';
    image.style.display = '';
    if (shell._teFinalData) shell._teFinalData.visual = dataUrl;
    return image;
  }

  async function persistShellImage(shell, dataUrl) {
    const data = activityData(shell);
    const key = cacheKey(data);
    generationCache.set(key, dataUrl);
    const saved = await savePersistentImage(key, dataUrl);
    const image = applyImage(shell, dataUrl, saved ? 'persistent' : 'generated');
    if (image && saved) image.dataset.tePersistentIllustration = 'true';
    return saved;
  }

  async function restoreFinalImage(shell) {
    if (!shell) return null;

    const data = activityData(shell);
    const key = cacheKey(data);
    const persistent = generationCache.get(key) || await readPersistentImage(key).catch(() => '');

    if (persistent && /^data:image\/png;base64,/i.test(persistent)) {
      generationCache.set(key, persistent);
      return applyImage(shell, persistent, 'persistent');
    }

    return currentStudentImage(shell);
  }

  async function generateFinalImage(shell) {
    await restoreFinalImage(shell);
    let image = currentStudentImage(shell);
    if (validFinalImage(image) && image?.dataset.tePersistentIllustration === 'true') return image;

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
        await restoreFinalImage(shell).catch(() => null);
        throw new Error(payload.error || 'Não foi possível gerar a ilustração.');
      }
      dataUrl = payload.illustrationDataUrl;
    }

    if (!/^data:image\/png;base64,/i.test(dataUrl)) {
      await restoreFinalImage(shell).catch(() => null);
      throw new Error('A geração não retornou uma imagem PNG válida.');
    }

    await persistShellImage(shell, dataUrl);
    return currentStudentImage(shell);
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
      try { await image.decode(); } catch { }
    }

    const src = imageSource(image);
    if (!src) throw new Error('A ilustração final está vazia.');
    if (shell._teFinalData) shell._teFinalData.visual = src;
    return image;
  }

  async function ensureImageFixedForExport(shell) {
    await restoreFinalImage(shell);
    const image = await waitForFinalImage(shell);
    const src = imageSource(image);
    if (!src) throw new Error('A ilustração final está vazia.');

    if (/^data:image\/png;base64,/i.test(src)) {
      const saved = await persistShellImage(shell, src);
      if (!saved) throw new Error('A imagem foi gerada, mas não pôde ser fixada no exercício antes do download.');
    }

    if (shell._teFinalData) shell._teFinalData.visual = src;
    return src;
  }

  async function restoreAll(root = document) {
    const shells = [...(root.querySelectorAll?.('.collection-preview-shell') || [])];
    await Promise.all(shells.map(shell => restoreFinalImage(shell).catch(error => {
      console.warn('teacheasy-illustration-restore', error);
      return null;
    })));
  }

  window.tePersistLibraryIllustration = async function tePersistLibraryIllustration(shell, dataUrl) {
    return persistShellImage(shell, dataUrl);
  };
  window.teRestoreLibraryIllustration = restoreFinalImage;

  const previewRoot = document.querySelector('#preview-content') || document.body;
  const observer = new MutationObserver(() => {
    requestAnimationFrame(() => restoreAll(previewRoot));
  });
  observer.observe(previewRoot, { childList: true, subtree: true });
  restoreAll(previewRoot);

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
      await restoreFinalImage(shell);
      let current = currentStudentImage(shell);
      if (!validFinalImage(current) || current?.dataset.tePersistentIllustration !== 'true') {
        button.textContent = 'Gerando imagem...';
        await generateFinalImage(shell);
      }

      button.textContent = 'Preparando arquivo...';
      await ensureImageFixedForExport(shell);
      button.dataset.teExportImageReady = 'true';
      button.disabled = false;
      button.textContent = originalText;
      button.click();
    } catch (error) {
      console.error('teacheasy-export-image-sync', error);
      await restoreFinalImage(shell).catch(() => null);
      button.disabled = false;
      button.textContent = originalText;
      window.alert(error.message || 'Não foi possível preparar a imagem antes do download.');
    }
  }, true);
})();
