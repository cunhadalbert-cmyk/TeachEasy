(() => {
  'use strict';

  const targetPath = 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json';
  const targetId = 'efi-4ano-b3-lp-noticia-b';
  const imagePath = 'assets/atividades/lingua-portuguesa/fig-informacao-opiniao-01.svg';
  const originalFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const requestUrl = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';

    if (!requestUrl.includes(targetPath) || !response.ok) return response;

    try {
      const data = await response.clone().json();
      const activity = Array.isArray(data?.atividades)
        ? data.atividades.find(item => item?.id === targetId)
        : null;

      if (!activity) return response;

      activity.possuiFiguras = true;
      activity.figuras = [{
        id: 'lp-fig-informacao-opiniao-01',
        arquivo: imagePath,
        descricao: 'Dois estudantes analisam um jornal e conversam para diferenciar informação verificável de opinião.',
        funcaoPedagogica: 'Apoiar visualmente a distinção entre fato e opinião em uma situação de leitura de notícia.',
        posicaoSugerida: 'antes-das-questoes',
        textoAlternativo: 'Dois estudantes em uma biblioteca observam um jornal enquanto conversam sobre informação e opinião.',
        compativelPretoBranco: true
      }];
      activity.ilustracao = {
        ...(activity.ilustracao || {}),
        status: 'aprovada',
        arquivo: imagePath
      };

      return new Response(JSON.stringify(data), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    } catch {
      return response;
    }
  };
})();