(() => {
  const nativeFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async (...args) => {
    const response = await nativeFetch(...args);
    const request = args[0];
    const url = typeof request === 'string' ? request : request?.url || '';
    const patchers = [
      globalThis.TeachEasyHighSchoolPedagogicalOverrides,
      globalThis.TeachEasyHighSchoolMathPedagogicalOverrides
    ].filter(item => item?.apply && item?.collection);

    if (!response.ok
      || !url.includes('data/atividades/ensino-medio/')
      || patchers.length === 0) {
      return response;
    }

    try {
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
