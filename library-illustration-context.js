(() => {
  'use strict';

  const clean = (value = '') => String(value || '').replace(/\s+/g, ' ').trim();
  const CACHE_MIGRATION_KEY = 'teacheasy-illustrations-active-participants-v1';
  const DB_NAME = 'TeachEasyLibrary';
  const ACTIVE_CAST_RULE = 'REGRA TEACHEASY: preserve integralmente a cena e seus elementos essenciais. Inclua os personagens oficiais TeachEasy necessários como PARTICIPANTES ATIVOS, interagindo de forma natural e realizando ações coerentes com o conteúdo. Não os deixe apenas posados ou colados no cenário e nunca substitua, esconda ou descaracterize elementos essenciais.';

  function existingFigureDescription(activity) {
    const figures = Array.isArray(activity?.figuras) ? activity.figuras : [];
    return clean(figures.find(item => clean(item?.descricao))?.descricao || '');
  }

  function fallbackDescription(activity, collection) {
    const subject = clean(collection?.disciplina || activity?.disciplina || '');
    const topic = clean(activity?.titulo || activity?.tema || activity?.assunto || 'o conteúdo estudado');
    if (!topic) return '';
    if (subject === 'Geografia') {
      return `Cena pedagógica sobre ${topic}, representando visualmente os elementos geográficos centrais do tema de forma clara, adequada ao ano escolar e coerente com o texto da atividade.`;
    }
    return `Cena pedagógica sobre ${topic}, coerente com o texto e com o objetivo da atividade.`;
  }

  function contextFromActivity(activity, collection) {
    const explicit = activity?.ilustracao || {};
    const description = clean(explicit.descricao || existingFigureDescription(activity) || fallbackDescription(activity, collection));
    if (!description) return null;
    return {
      objetivoPedagogico: clean(explicit.objetivoPedagogico || activity?.objetivo || ''),
      descricao: description,
      arquivo: clean(explicit.arquivo || '')
    };
  }

  function placeholderText(context) {
    if (!context?.descricao) return '';
    return clean(`ILUSTRAÇÃO: ${context.descricao} ${ACTIVE_CAST_RULE}`);
  }

  function applyIllustrationPlaceholder(shell) {
    if (!shell) return false;
    const visual = shell.querySelector('.te-final-visual');
    if (!visual) return false;

    const oldPlaceholder = visual.querySelector('.te-illustration-request-placeholder');
    if (visual.querySelector('img')) {
      oldPlaceholder?.remove();
      return true;
    }

    const text = placeholderText(shell._teIllustrationContext);
    if (!text) return true;

    let placeholder = oldPlaceholder;
    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.className = 'te-illustration-request-placeholder';
      placeholder.style.cssText = 'box-sizing:border-box;width:100%;padding:4mm;font:10pt/1.25 Arial,sans-serif;text-align:left;color:#444;white-space:normal;overflow-wrap:anywhere;';
      visual.appendChild(placeholder);
    }
    if (placeholder.textContent !== text) placeholder.textContent = text;
    return true;
  }

  function schedulePlaceholder(shell) {
    if (!shell) return;
    const tryApply = () => applyIllustrationPlaceholder(shell);
    queueMicrotask(tryApply);
    requestAnimationFrame(tryApply);
    setTimeout(tryApply, 80);
    setTimeout(tryApply, 250);
  }

  if (typeof window.normalizeCollectionActivity === 'function') {
    const baseNormalizeCollectionActivity = window.normalizeCollectionActivity;
    window.normalizeCollectionActivity = function illustrationContextNormalize(activity, collection, config) {
      const normalized = baseNormalizeCollectionActivity(activity, collection, config);
      if (!normalized) return normalized;
      const illustrationContext = contextFromActivity(activity, collection);
      if (!illustrationContext) return normalized;
      return { ...normalized, illustrationContext };
    };
  }

  if (typeof window.openCollectionPreview === 'function') {
    const baseOpenCollectionPreview = window.openCollectionPreview;
    window.openCollectionPreview = function illustrationContextPreview(activity) {
      const result = baseOpenCollectionPreview(activity);
      const shell = document.querySelector('#preview-content .collection-preview-shell');
      if (shell && activity?.illustrationContext) {
        shell._teIllustrationContext = activity.illustrationContext;
        schedulePlaceholder(shell);
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
