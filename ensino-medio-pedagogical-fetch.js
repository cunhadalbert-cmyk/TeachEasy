(() => {
  const nativeFetch = globalThis.fetch.bind(globalThis);
  let mathLoadPromise = null;
  let mathWordingLoadPromise = null;
  let scienceLoadPromise = null;

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
      await import('./ensino-medio-ciencias-pedagogical-core-base.js?v=20260916-1s1b-ciencias-v1');
      await import('./ensino-medio-ciencias-pedagogical-builders-01.js?v=20260916-1s1b-ciencias-v1');
      await import('./ensino-medio-ciencias-pedagogical-builders-02.js?v=20260916-1s1b-ciencias-v1');
      await import('./ensino-medio-ciencias-pedagogical-builders-03.js?v=20260916-1s1b-ciencias-v1');
      await import('./ensino-medio-ciencias-pedagogical-builders-04.js?v=20260916-1s1b-ciencias-v1');
      await import('./ensino-medio-ciencias-pedagogical-01.js?v=20260916-1s1b-ciencias-v1');
      await import('./ensino-medio-ciencias-pedagogical-02.js?v=20260916-1s1b-ciencias-v1');
      await import('./ensino-medio-ciencias-pedagogical-03.js?v=20260916-1s1b-ciencias-v1');
      await import('./ensino-medio-ciencias-pedagogical-04.js?v=20260916-1s1b-ciencias-v1');
      await import('./ensino-medio-ciencias-pedagogical-05.js?v=20260916-1s1b-ciencias-v1');
    })();
    await scienceLoadPromise;
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

      const patchers = [
        globalThis.TeachEasyHighSchoolPedagogicalOverrides,
        globalThis.TeachEasyHighSchoolMathPedagogicalOverrides,
        globalThis.TeachEasyHighSchoolSciencePedagogicalOverrides
      ].filter(item => item?.apply && item?.collection);

      if (patchers.length === 0) return response;

      const collection = await response.clone().json();
      const patcher = patchers.find(item => item.collection === collection?.colecao);
      if (!patcher) return response;

      const patched = patcher.apply(collection);
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
