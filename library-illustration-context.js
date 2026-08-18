(() => {
  'use strict';

  const clean = (value = '') => String(value || '').replace(/\s+/g, ' ').trim();

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
})();
