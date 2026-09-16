(() => {
  const nativeFetch = globalThis.fetch.bind(globalThis);
  let mathLoadPromise = null;

  async function ensureMathPatcher(url) {
    if (!url.includes('/1-serie/1-bimestre/matematica.json')
      || globalThis.TeachEasyHighSchoolMathPedagogicalOverrides?.apply) {
      return;
    }

    mathLoadPromise ||= import('./ensino-medio-matematica-pedagogical-overrides.js?v=20260916-1s1b-mat-01-50-v1');
    await mathLoadPromise;
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

      const patchers = [
        globalThis.TeachEasyHighSchoolPedagogicalOverrides,
        globalThis.TeachEasyHighSchoolMathPedagogicalOverrides
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
