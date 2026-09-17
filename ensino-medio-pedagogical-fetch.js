(() => {
  const nativeFetch = globalThis.fetch.bind(globalThis);
  let mathLoadPromise = null;
  let mathWordingLoadPromise = null;
  let scienceLoadPromise = null;
  let historyLoadPromise = null;
  let geographyLoadPromise = null;
  let remainingLoadPromise = null;

  async function ensureMathPatcher(url) {
    if (!url.includes('/1-serie/1-bimestre/matematica.json')) return;

    if (!globalThis.TeachEasyHighSchoolMathPedagogicalOverrides?.apply) {
      mathLoadPromise ||= import('./ensino-medio-matematica-pedagogical-overrides.js?v=20260916-1s1b-mat-01-50-v1');
      await mathLoadPromise;
    }

    mathWordingLoadPromise ||= import('./ensino-medio-matematica-pedagogical-wording.js?v=20260916-1s1b-mat-wording-v1');
    await mathWordingLoadPromise;
  }

  async function ensureSciencePatcher(url) {
    if (!url.includes('/1-serie/1-bimestre/ciencias.json')) return;
    if (globalThis.TeachEasyHighSchoolSciencePedagogicalOverrides?.reviewedIds?.length === 50) return;

    scienceLoadPromise ||= (async () => {
      await import('./ensino-medio-ciencias-pedagogical-core-base.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-01.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-02.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-03.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-04.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-05.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-builders-06.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-01.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-02.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-03.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-04.js?v=20260916-1s1b-ciencias-v2');
      await import('./ensino-medio-ciencias-pedagogical-05.js?v=20260916-1s1b-ciencias-v2');
    })();
    await scienceLoadPromise;
  }

  async function ensureHistoryPatcher(url) {
    if (!url.includes('/1-serie/1-bimestre/historia.json')) return;
    if (globalThis.TeachEasyHighSchoolHistoryPedagogicalOverrides?.reviewedIds?.length === 50) return;

    historyLoadPromise ||= (async () => {
      await import('./ensino-medio-historia-pedagogical-core.js?v=20260916-1s1b-historia-v1');
      await import('./ensino-medio-historia-pedagogical-01.js?v=20260916-1s1b-historia-v1');
      await import('./ensino-medio-historia-pedagogical-02.js?v=20260916-1s1b-historia-v1');
      await import('./ensino-medio-historia-pedagogical-03.js?v=20260916-1s1b-historia-v1');
      await import('./ensino-medio-historia-pedagogical-04.js?v=20260916-1s1b-historia-v1');
      await import('./ensino-medio-historia-pedagogical-05.js?v=20260916-1s1b-historia-v1');
    })();
    await historyLoadPromise;
  }

  async function ensureGeographyPatcher(url) {
    if (!url.includes('/1-serie/1-bimestre/geografia.json')) return;
    if (globalThis.TeachEasyHighSchoolGeographyPedagogicalOverrides?.reviewedIds?.length === 50) return;

    geographyLoadPromise ||= (async () => {
      await import('./ensino-medio-geografia-pedagogical-core.js?v=20260916-1s1b-geografia-v1');
      await import('./ensino-medio-geografia-pedagogical-01.js?v=20260916-1s1b-geografia-v1');
      await import('./ensino-medio-geografia-pedagogical-02.js?v=20260916-1s1b-geografia-v1');
      await import('./ensino-medio-geografia-pedagogical-03.js?v=20260916-1s1b-geografia-v1');
      await import('./ensino-medio-geografia-pedagogical-04.js?v=20260916-1s1b-geografia-v1');
      await import('./ensino-medio-geografia-pedagogical-05.js?v=20260916-1s1b-geografia-v1');
    })();
    await geographyLoadPromise;
  }

  async function ensureRemainingPatcher(url) {
    if (!/\/ensino-medio\/(?:1|2|3)-serie\/(?:1|2|3|4)-bimestre\/(?:lingua-portuguesa|matematica|ciencias|historia|geografia)\.json(?:\?|$)/.test(url)) return;
    if (/\/1-serie\/1-bimestre\/(?:lingua-portuguesa|matematica|ciencias|historia|geografia)\.json(?:\?|$)/.test(url)) return;
    if (globalThis.TeachEasyHighSchoolRemainingPedagogicalOverrides?.apply && globalThis.TeachEasyHighSchoolRemainingPedagogicalOverrides?.__wordingExpanded && globalThis.TeachEasyHighSchoolSemanticCoherence?.apply) return;

    remainingLoadPromise ||= (async () => {
      await import('./ensino-medio-restante-pedagogical-overrides.js?v=20260916-em-restante-2750-v3');
      await import('./ensino-medio-restante-pedagogical-wording.js?v=20260916-em-restante-2750-v3');
      await import('./ensino-medio-semantic-coherence.js?v=20260916-em-coerencia-2750-v1');
    })();
    await remainingLoadPromise;
  }

  globalThis.fetch = async (...args) => {
    const response = await nativeFetch(...args);
    const request = args[0];
    const url = typeof request === 'string' ? request : request?.url || '';

    if (!response.ok || !url.includes('data/atividades/ensino-medio/')) {
      return response;
    }

    try {
      await ensureMathPatcher(url);
      await ensureSciencePatcher(url);
      await ensureHistoryPatcher(url);
      await ensureGeographyPatcher(url);
      await ensureRemainingPatcher(url);

      const collection = await response.clone().json();
      const fixedPatchers = [
        globalThis.TeachEasyHighSchoolPedagogicalOverrides,
        globalThis.TeachEasyHighSchoolMathPedagogicalOverrides,
        globalThis.TeachEasyHighSchoolSciencePedagogicalOverrides,
        globalThis.TeachEasyHighSchoolHistoryPedagogicalOverrides,
        globalThis.TeachEasyHighSchoolGeographyPedagogicalOverrides
      ].filter(item => item?.apply && item?.collection);

      const fixedPatcher = fixedPatchers.find(item => item.collection === collection?.colecao);
      const remainingPatcher = globalThis.TeachEasyHighSchoolRemainingPedagogicalOverrides;
      const patcher = fixedPatcher || (remainingPatcher?.apply && remainingPatcher?.matches?.(collection) ? remainingPatcher : null);
      if (!patcher) return response;

      let patched = patcher.apply(collection);
      const semantic = globalThis.TeachEasyHighSchoolSemanticCoherence;
      if (!fixedPatcher && semantic?.matches?.(patched)) patched = semantic.apply(patched);

      const headers = new Headers(response.headers);
      headers.set('content-type', 'application/json; charset=utf-8');
      return new Response(JSON.stringify(patched), {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    } catch {
      return response;
    }
  };
})();
