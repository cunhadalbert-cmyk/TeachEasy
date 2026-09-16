(() => {
  const nativeFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async (...args) => {
    const response = await nativeFetch(...args);
    const request = args[0];
    const url = typeof request === 'string' ? request : request?.url || '';
    const patcher = globalThis.TeachEasyHighSchoolPedagogicalOverrides;

    if (!response.ok
      || !url.includes('data/atividades/ensino-medio/')
      || !patcher?.apply) {
      return response;
    }

    try {
      const collection = await response.clone().json();
      const patched = patcher.apply(collection);
      if (patched === collection && collection?.colecao !== patcher.collection) return response;

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
