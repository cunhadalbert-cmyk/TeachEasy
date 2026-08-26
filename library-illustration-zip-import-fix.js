(() => {
  'use strict';

  const DB_NAME = 'TeachEasyIllustrationsByNormalizedTitleV1';
  const DB_VERSION = 1;
  const STORE_NAME = 'imagesByNormalizedTitleV1';

  function selectedItems() {
    const items = window.teGetIllustrationBatchSelection?.();
    return Array.isArray(items) ? items : [];
  }

  function setStatus(message = '') {
    const status = document.querySelector('#te-illustration-batch-toolbar [data-status]');
    if (status) status.textContent = message;
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'normalizedTitle' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Falha ao abrir IndexedDB.'));
    });
  }

  async function saveRecord(activity, url) {
    const db = await openDatabase();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put({
          normalizedTitle: activity.normalizedTitle,
          topic: activity.topic,
          url,
          updatedAt: Date.now()
        });
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error('Falha ao salvar imagem.'));
        tx.onabort = () => reject(tx.error || new Error('Gravação interrompida.'));
      });
    } finally {
      db.close();
    }
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('Falha ao ler imagem.'));
      reader.readAsDataURL(file);
    });
  }

  async function compressImage(file) {
    const sourceUrl = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.decoding = 'async';
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error(`Não foi possível abrir ${file.name}.`));
        image.src = sourceUrl;
      });

      const maxSide = 1024;
      const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || 1, image.naturalHeight || 1));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) throw new Error('Canvas indisponível para compactar a imagem.');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);
      return canvas.toDataURL('image/jpeg', 0.84);
    } catch (error) {
      console.warn('Compactação falhou; usando imagem original.', file.name, error);
      return fileToDataUrl(file);
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
  }

  async function importZipFixed(zipFile) {
    const api = window.TeLibraryTitleImages;
    if (!api?.extractZipImages || !api?.matchFiles) {
      throw new Error('Importador principal não foi carregado. Recarregue a página.');
    }

    const activities = selectedItems();
    if (!activities.length) throw new Error('Nenhum lote foi selecionado.');

    setStatus('Abrindo ZIP...');
    const files = await api.extractZipImages(zipFile);
    if (!files.length) throw new Error('O ZIP não contém imagens PNG, JPG, JPEG ou WEBP.');

    setStatus(`${files.length} imagens encontradas. Conferindo títulos...`);
    const result = api.matchFiles(files, activities);
    if (!result.pairs.length) {
      throw new Error(`Nenhum nome do ZIP corresponde aos ${activities.length} títulos selecionados.`);
    }

    let linkedCount = 0;
    for (const { activity, file } of result.pairs) {
      setStatus(`Compactando e salvando ${linkedCount + 1}/${activities.length}: ${activity.topic}`);
      const url = await compressImage(file);
      await saveRecord(activity, url);
      linkedCount += 1;
    }

    await api.refresh?.();
    const finalResult = { ...result, linkedCount, total: activities.length };
    setStatus(result.missingTitles.length
      ? `${linkedCount}/${activities.length} imagens vinculadas.`
      : `${linkedCount}/${activities.length} imagens vinculadas corretamente`);
    alert(api.importMessage ? api.importMessage(finalResult) : `${linkedCount}/${activities.length} imagens vinculadas.`);
    return finalResult;
  }

  function openPicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = '.zip,application/zip,application/x-zip-compressed';
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        await importZipFixed(file);
      } catch (error) {
        console.error(error);
        const message = error?.message || String(error);
        setStatus(`ERRO: ${message}`);
        alert(`Falha ao importar ZIP: ${message}`);
      }
    });
    input.click();
  }

  function install() {
    const toolbar = document.querySelector('#te-illustration-batch-toolbar');
    const oldButton = toolbar?.querySelector('[data-import]');
    if (!toolbar || !oldButton) return;
    if (oldButton.dataset.teZipFix === 'true') return;

    const button = oldButton.cloneNode(true);
    button.dataset.teZipFix = 'true';
    button.textContent = 'Importar ZIP de imagens';
    button.addEventListener('click', openPicker);
    oldButton.replaceWith(button);
  }

  install();
  new MutationObserver(install).observe(document.documentElement, { childList: true, subtree: true });

  window.TeLibraryZipImportFix = { importZipFixed, openPicker };
})();
