(() => {
  'use strict';

  const clean = (value = '') => String(value || '').replace(/\s+/g, ' ').trim();
  const CACHE_MIGRATION_KEY = 'teacheasy-illustrations-active-participants-v1';
  const DB_NAME = 'TeachEasyLibrary';

  if (typeof window.normalizeCollectionActivity === 'function') {
    const baseNormalizeCollectionActivity = window.normalizeCollectionActivity;
    window.normalizeCollectionActivity = function illustrationContextNormalize(activity, collection, config) {
      const normalized = baseNormalizeCollectionActivity(activity, collection, config);
      if (!normalized || !activity?.ilustracao) return normalized;
      return {
        ...normalized,
        illustrationContext: {
          objetivoPedagogico: clean(activity.ilustracao.objetivoPedagogico || ''),
          descricao: clean(activity.ilustracao.descricao || ''),
          arquivo: clean(activity.ilustracao.arquivo || '')
        }
      };
    };
  }

  if (typeof window.openCollectionPreview === 'function') {
    const baseOpenCollectionPreview = window.openCollectionPreview;
    window.openCollectionPreview = function illustrationContextPreview(activity) {
      const result = baseOpenCollectionPreview(activity);
      const shell = document.querySelector('#preview-content .collection-preview-shell');
      if (shell && activity?.illustrationContext) {
        shell._teIllustrationContext = activity.illustrationContext;
      }
      return result;
    };
  }

  window.teLibraryIllustrationContext = function teLibraryIllustrationContext(shell) {
    const context = shell?._teIllustrationContext;
    if (!context) return '';
    return clean([
      context.objetivoPedagogico ? `Objetivo visual: ${context.objetivoPedagogico}.` : '',
      context.descricao ? `Cena original da atividade: ${context.descricao}.` : ''
    ].filter(Boolean).join(' '));
  };

  const baseFetch = window.fetch.bind(window);
  window.fetch = async function illustrationContextFetch(input, init = {}) {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (url === '/api/generate-library-illustration' && init?.body) {
      try {
        const payload = JSON.parse(init.body);
        const shell = document.querySelector('#preview-content .collection-preview-shell');
        const sceneContext = window.teLibraryIllustrationContext(shell);
        if (sceneContext) {
          payload.context = clean(`${sceneContext} ${payload.context || ''}`).slice(0, 1200);
          init = { ...init, body: JSON.stringify(payload) };
        }
      } catch {
        // Mantém a chamada original se o corpo não for JSON válido.
      }
    }
    return baseFetch(input, init);
  };

  try {
    if (window.localStorage?.getItem(CACHE_MIGRATION_KEY) !== 'done' && 'indexedDB' in window) {
      const request = indexedDB.deleteDatabase(DB_NAME);
      const markDone = () => window.localStorage?.setItem(CACHE_MIGRATION_KEY, 'done');
      request.onsuccess = markDone;
      request.onerror = markDone;
      request.onblocked = () => console.warn('teacheasy-illustration-cache-migration-blocked');
    }
  } catch (error) {
    console.warn('teacheasy-illustration-cache-migration', error);
  }
})();
