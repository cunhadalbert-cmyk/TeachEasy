(() => {
  'use strict';

  const MAX_SELECTION = 10;
  const SELECTION_KEY = 'te-illustration-title-batch-selection-v1';
  const PREPARED_BATCH_KEY = 'te-illustration-prepared-batch-v1';

  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
  const normalizeTitle = value => (window.TeLibraryTitleImages?.normalizeTitle
    ? window.TeLibraryTitleImages.normalizeTitle(value)
    : clean(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''));

  function sameCollection(left, right) {
    return ['stage', 'grade', 'term', 'subject']
      .every(field => clean(left?.[field]) === clean(right?.[field]));
  }

  function toBatchItem(item) {
    return {
      normalizedTitle: normalizeTitle(item?.normalizedTitle || item?.topic),
      topic: clean(item?.topic),
      subject: clean(item?.subject),
      stage: clean(item?.stage),
      grade: clean(item?.grade),
      term: Number(item?.term) || clean(item?.term),
      supportText: clean(item?.supportText || item?.content),
      statement: clean(item?.statement || item?.instruction),
      questions: Array.isArray(item?.questions)
        ? item.questions.map(question => clean(question?.enunciado || question?.prompt || question)).filter(Boolean)
        : []
    };
  }

  function hasStoredImage(normalizedTitle) {
    return new Promise(resolve => {
      const api = window.TeLibraryTitleImages;
      if (!api || !window.indexedDB || !normalizedTitle) return resolve(false);
      const request = indexedDB.open(api.DB_NAME, api.DB_VERSION);
      request.onerror = () => resolve(false);
      request.onsuccess = () => {
        const database = request.result;
        try {
          const tx = database.transaction(api.STORE_NAME, 'readonly');
          const get = tx.objectStore(api.STORE_NAME).get(normalizedTitle);
          get.onsuccess = () => resolve(Boolean(get.result?.url));
          get.onerror = () => resolve(false);
          tx.oncomplete = () => database.close();
          tx.onabort = () => database.close();
        } catch {
          database.close();
          resolve(false);
        }
      };
    });
  }

  async function buildFromClickedShell(shell) {
    const context = window.TeLibraryIllustrationBatchContext;
    const candidates = Array.isArray(context?.activities) ? context.activities : [];
    const clickedKey = window.teIllustrationTitleForShell?.(shell) || '';
    if (!clickedKey || !candidates.length) return null;

    const startIndex = candidates.findIndex(item => normalizeTitle(item?.normalizedTitle || item?.topic) === clickedKey);
    if (startIndex < 0) return null;
    const start = candidates[startIndex];
    const batch = [];

    for (let index = startIndex; index < candidates.length && batch.length < MAX_SELECTION; index += 1) {
      const candidate = candidates[index];
      if (!sameCollection(candidate, start)) break;
      const item = toBatchItem(candidate);
      if (!item.normalizedTitle || !item.topic || candidate.hasStaticImage) continue;
      if (await hasStoredImage(item.normalizedTitle)) continue;
      batch.push(item);
    }
    return batch;
  }

  function setStatus(batch) {
    const status = document.querySelector('#te-illustration-batch-toolbar [data-status]');
    if (status) status.textContent = `Lote com ${batch.length} atividade${batch.length === 1 ? '' : 's'} realmente sem imagem.`;
  }

  document.addEventListener('change', async event => {
    const checkbox = event.target.closest?.('.te-batch-selector input');
    if (!checkbox || !checkbox.checked) return;
    const shell = checkbox.closest('.collection-preview-shell');
    if (!shell) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    checkbox.disabled = true;
    try {
      const batch = await buildFromClickedShell(shell);
      if (!batch) return;
      localStorage.setItem(SELECTION_KEY, JSON.stringify(batch));
      localStorage.removeItem(PREPARED_BATCH_KEY);
      await window.TeLibraryTitleImages?.refresh?.();
      setStatus(batch);
    } catch (error) {
      console.error('TeachEasy: falha ao montar lote sem imagens repetidas.', error);
      checkbox.checked = false;
      alert('Não foi possível montar o próximo lote sem imagens repetidas.');
    } finally {
      checkbox.disabled = false;
    }
  }, true);
})();
