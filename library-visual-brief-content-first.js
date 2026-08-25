(() => {
  'use strict';

  const PREPARED_BATCH_KEY = 'te-illustration-prepared-batch-v1';
  const VISUAL_SIGNATURES_KEY = 'te-illustration-visual-signatures-v1';
  const VERSION = 1;

  const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
  const normalizeTitle = value => window.TeLibraryTitleImages?.normalizeTitle
    ? window.TeLibraryTitleImages.normalizeTitle(value)
    : clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  function hashText(value) {
    let hash = 2166136261;
    for (const character of String(value || '')) {
      hash ^= character.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function collectionKey(item) {
    return [item.stage, item.grade, item.term, item.subject].map(normalizeTitle).join('|');
  }

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function contextItems() {
    return Array.isArray(window.TeLibraryIllustrationBatchContext?.activities)
      ? window.TeLibraryIllustrationBatchContext.activities
      : [];
  }

  function selectedItems() {
    const selected = window.teGetIllustrationBatchSelection?.();
    return Array.isArray(selected) ? selected : [];
  }

  function fullItem(selected) {
    const context = contextItems().find(item => normalizeTitle(item?.topic) === selected.normalizedTitle) || selected;
    return {
      normalizedTitle: selected.normalizedTitle || normalizeTitle(context.topic),
      topic: clean(context.topic || selected.topic),
      subject: clean(context.subject || selected.subject),
      stage: clean(context.stage),
      grade: clean(context.grade),
      term: Number(context.term) || clean(context.term),
      supportText: clean(context.supportText || context.content),
      statement: clean(context.statement || context.instruction),
      questions: Array.isArray(context.questions)
        ? context.questions.map(question => clean(question?.enunciado || question?.prompt || question)).filter(Boolean)
        : []
    };
  }

  function concreteExcerpt(item) {
    const text = clean(item.supportText);
    if (!text) return clean(item.topic);
    const cut = text.split(/\bNo\s+\d+[ºoªa]?\s+ano\b/i)[0].trim();
    const source = cut || text;
    const sentences = source.match(/[^.!?]+[.!?]?/g) || [source];
    return clean(sentences.slice(0, 4).join(' ')).slice(0, 700);
  }

  function sceneFor(item) {
    const topic = item.topic.toLowerCase();
    const excerpt = concreteExcerpt(item);
    const source = `${topic} ${excerpt}`.toLowerCase();

    if (item.normalizedTitle === 'aprofundamento-31-noticia') {
      return {
        family: 'noticia-elementos-essenciais',
        action: 'Um estudante analisando uma notícia impressa e identificando visualmente o que aconteceu, quem participou, onde ocorreu e quando aconteceu por meio de quatro marcações coloridas sem palavras',
        objects: ['notícia impressa sem texto legível', 'quatro marcadores coloridos distintos', 'caderno de análise', 'lápis'],
        preferredCategory: 'vista superior parcial',
        characterPlan: 'um estudante, com mãos e materiais vistos em semi-top view',
        objectLayout: 'notícia central e quatro marcações distribuídas ao redor das informações analisadas',
        visualFocus: 'a notícia impressa e as quatro categorias de identificação'
      };
    }
    if (item.normalizedTitle === 'aprofundamento-32-noticia') {
      return {
        family: 'noticia-estrutura-cartoes',
        action: 'Uma dupla organizando as partes de uma notícia em cartões visuais separados, discutindo a ordem e a estrutura das informações',
        objects: ['cartões visuais sem texto legível', 'notícia impressa ao lado', 'fotografia do acontecimento', 'marcadores'],
        preferredCategory: 'vista frontal',
        characterPlan: 'dois estudantes lado a lado diante dos cartões',
        objectLayout: 'cartões separados em blocos frontais e notícia posicionada na lateral',
        visualFocus: 'a organização estrutural dos cartões'
      };
    }
    if (item.normalizedTitle === 'aprofundamento-33-noticia') {
      return {
        family: 'noticia-planejamento-grupo',
        action: 'Um pequeno grupo planejando uma notícia escolar a partir de um acontecimento, discutindo e selecionando quais informações devem entrar na produção',
        objects: ['fotografia do acontecimento escolar', 'fichas de planejamento sem texto legível', 'caderno', 'lápis e marcadores'],
        preferredCategory: 'composição em grupo',
        characterPlan: 'três estudantes em posições diferentes, interagindo em roda parcial',
        objectLayout: 'materiais compartilhados no centro e fichas selecionadas em dois grupos',
        visualFocus: 'a discussão do grupo e a seleção das informações'
      };
    }

    if (/apresenta[cç][aã]o de dan[cç]a|despertador|parada no port[aã]o/.test(source)) {
      return {
        action: 'Uma estudante chegando atrasada ao portão da escola enquanto sua turma participa de uma apresentação de dança ao fundo; ela demonstra preocupação e depois esperança',
        objects: ['mochila', 'portão da escola', 'colegas dançando', 'elemento visual de despertador sem números legíveis']
      };
    }
    if (/vov[oó] chica|cuia|servia caf[eé]/.test(source)) {
      return {
        action: 'Vovó Chica servindo café com uma cuia especial enquanto um vizinho observa; a cena deve sugerir generosidade e o conflito do conto popular',
        objects: ['cuia', 'xícaras de café', 'Vovó Chica', 'vizinho', 'mesa simples']
      };
    }
    if (/rep[oó]rter|seu raimundo|entrega cartas|carteir/.test(source)) {
      return {
        action: 'Uma criança repórter entrevistando Seu Raimundo, carteiro experiente, em uma conversa clara de pergunta e resposta',
        objects: ['microfone', 'bolsa de carteiro', 'cartas e encomendas sem texto legível', 'caderno de anotações']
      };
    }
    if (/marina chegou|respondeu t[eé]o|travess[aã]o|dois-pontos/.test(source)) {
      return {
        action: 'Marina e Téo conversando no corredor da escola, com gestos de pergunta e resposta, destacando visualmente a alternância de falas sem usar texto escrito',
        objects: ['mochila', 'livro nas mãos de Téo', 'corredor escolar', 'dois personagens conversando']
      };
    }
    if (/cachorro apareceu na pra[cç]a|casinha para o cachorro|evitam repeti[cç][aã]o/.test(source)) {
      return {
        family: 'coesao-cachorro-substituicoes',
        action: 'Crianças revisando um texto sobre o cachorro da praça e relacionando diferentes substituições visuais ao mesmo animal',
        objects: ['cachorro em primeiro plano', 'crianças', 'casinha do cachorro', 'caderno em revisão', 'cartões visuais de substituição sem palavras'],
        preferredCategory: 'composição central com objeto focal',
        characterPlan: 'duas crianças em segundo plano apontando para as substituições',
        objectLayout: 'cachorro no centro, casinha ao fundo e cartões distribuídos ao redor do animal',
        visualFocus: 'o cachorro e as diferentes referências visuais que o substituem'
      };
    }
    if (/horta da escola|alface|cebolinha|tomate|revisar um par[aá]grafo/.test(source)) {
      return {
        family: 'revisao-paragrafo-horta',
        action: 'Um estudante revisando cuidadosamente no caderno um parágrafo sobre a horta da escola',
        objects: ['caderno com linhas sem texto legível', 'lápis de revisão', 'alface', 'cebolinha', 'tomate', 'canteiro escolar simplificado'],
        preferredCategory: 'close pedagógico',
        characterPlan: 'um estudante sentado, visto de perto enquanto revisa',
        objectLayout: 'caderno e lápis em primeiro plano; horta pequena como referência secundária ao fundo',
        visualFocus: 'o caderno e a ação de revisar o parágrafo'
      };
    }
    if (/divulga[cç][aã]o cient[ií]fica/.test(source)) {
      return {
        action: 'Estudantes explorando um material de divulgação científica infantil, observando evidências e registrando descobertas',
        objects: ['revista ou ficha científica sem texto legível', 'lupa', 'amostra ou modelo científico', 'caderno de registro']
      };
    }
    if (/not[ií]cia/.test(source)) {
      return {
        family: 'noticia-generica',
        variants: [
          { action: 'Um estudante destacando evidências em uma notícia impressa', objects: ['notícia sem texto legível', 'marcadores coloridos', 'caderno'], preferredCategory: 'vista superior parcial', characterPlan: 'um estudante, mãos visíveis', objectLayout: 'folha central com marcadores nas bordas', visualFocus: 'as evidências destacadas' },
          { action: 'Uma dupla comparando duas fontes visuais sobre o mesmo acontecimento', objects: ['duas notícias sem texto legível', 'duas fotografias', 'fichas de comparação'], preferredCategory: 'vista frontal', characterPlan: 'dois estudantes em lados opostos', objectLayout: 'duas fontes paralelas separadas por fichas', visualFocus: 'a comparação entre as fontes' },
          { action: 'Três estudantes selecionando informações para um mural de notícia escolar', objects: ['fotografia do acontecimento', 'cartões visuais', 'painel vazio'], preferredCategory: 'composição em grupo', characterPlan: 'três estudantes ao redor do material', objectLayout: 'cartões no centro e painel ao fundo', visualFocus: 'a seleção coletiva das informações' },
          { action: 'Um estudante ordenando visualmente começo, desenvolvimento e fechamento de uma notícia', objects: ['três cartões sem texto legível', 'notícia impressa', 'setas visuais'], preferredCategory: 'sequência visual curta', characterPlan: 'um estudante posicionado na lateral', objectLayout: 'três cartões em sequência horizontal', visualFocus: 'a ordem das partes da notícia' },
          { action: 'Uma repórter mirim entrevistando uma testemunha de um acontecimento escolar', objects: ['microfone', 'caderno', 'fotografia do acontecimento'], preferredCategory: 'ângulo lateral', characterPlan: 'duas personagens de perfil em diálogo', objectLayout: 'personagens nas laterais e acontecimento sugerido ao fundo', visualFocus: 'a coleta oral de informações' },
          { action: 'Um estudante escolhendo a fotografia mais adequada para acompanhar uma notícia', objects: ['três fotografias diferentes', 'folha de notícia sem texto', 'marcador'], preferredCategory: 'composição central com objeto focal', characterPlan: 'um estudante atrás da mesa', objectLayout: 'fotografia escolhida no centro e alternativas afastadas', visualFocus: 'a fotografia selecionada' },
          { action: 'Uma dupla revisando se uma notícia apresenta informação suficiente e clara', objects: ['notícia impressa sem texto', 'lupa simbólica', 'fichas de verificação'], preferredCategory: 'close pedagógico', characterPlan: 'dois estudantes próximos ao material', objectLayout: 'notícia em primeiro plano e fichas agrupadas à direita', visualFocus: 'a revisão da clareza informativa' }
        ]
      };
    }

    return {
      action: `Representar diretamente a cena concreta descrita no texto de apoio: ${excerpt}`,
      objects: ['personagens, objetos e ações mencionados explicitamente no texto', 'materiais escolares apenas quando necessários']
    };
  }

  const COMPOSITION_CATEGORIES = [
    'close pedagógico',
    'vista frontal',
    'ângulo lateral',
    'vista superior parcial',
    'composição em grupo',
    'composição central com objeto focal',
    'sequência visual curta'
  ];

  const COMPOSITION_DETAILS = {
    'close pedagógico': 'enquadramento próximo das mãos, do material e da ação central',
    'vista frontal': 'personagens e objetos vistos de frente em planos bem separados',
    'ângulo lateral': 'ação observada de lado, com profundidade curta e interação visível',
    'vista superior parcial': 'mesa em semi-top view, mãos e materiais organizados claramente',
    'composição em grupo': 'enquadramento mais aberto, permitindo ver a interação entre participantes',
    'composição central com objeto focal': 'objeto pedagógico principal no centro e personagens subordinados a ele',
    'sequência visual curta': 'dois ou três momentos visuais organizados sem formato de quadrinhos'
  };

  function tokenSet(value) {
    return new Set(normalizeTitle(value).split('-').filter(token => token.length > 3));
  }

  function similarityScore(left, right) {
    const a = tokenSet(left);
    const b = tokenSet(right);
    if (!a.size || !b.size) return 0;
    const intersection = [...a].filter(token => b.has(token)).length;
    return intersection / Math.min(a.size, b.size);
  }

  function chooseCompositionCategory(scene, item, index, attempt, state) {
    if (attempt === 0 && scene.preferredCategory
      && (state.categoryCounts.get(scene.preferredCategory) || 0) < 2) {
      return scene.preferredCategory;
    }
    const start = (hashText(`${item.normalizedTitle}|${index}`) + attempt) % COMPOSITION_CATEGORIES.length;
    for (let offset = 0; offset < COMPOSITION_CATEGORIES.length; offset += 1) {
      const category = COMPOSITION_CATEGORIES[(start + offset) % COMPOSITION_CATEGORIES.length];
      if ((state.categoryCounts.get(category) || 0) < 2) return category;
    }
    return COMPOSITION_CATEGORIES[start];
  }

  function sceneForBatch(item, state) {
    const original = sceneFor(item);
    if (!Array.isArray(original.variants)) return original;
    const familyIndex = state.familyCounts.get(original.family) || 0;
    state.familyCounts.set(original.family, familyIndex + 1);
    const variant = original.variants[familyIndex % original.variants.length];
    return { ...original, ...variant, variants: undefined };
  }

  function rewrittenScene(scene, item, attempt) {
    if (!attempt) return scene;
    const characterPlans = [
      'um estudante isolado no lado esquerdo do quadro',
      'uma dupla em posições opostas, sem repetir gestos',
      'três estudantes distribuídos em triângulo ao redor do material',
      'somente mãos e objetos, sem rostos em destaque'
    ];
    const layouts = [
      'objetos organizados em diagonal com um único ponto focal',
      'objetos divididos em dois grupos assimétricos',
      'material principal no primeiro plano e referências secundárias afastadas',
      'objetos dispostos em arco ao redor do foco pedagógico'
    ];
    return {
      ...scene,
      action: `${scene.action}; mostrar esta ação com solução visual exclusiva para ${item.topic}`,
      characterPlan: characterPlans[(hashText(item.normalizedTitle) + attempt) % characterPlans.length],
      objectLayout: layouts[(hashText(`${item.normalizedTitle}|layout`) + attempt) % layouts.length],
      visualFocus: `${scene.visualFocus || item.topic}, sem compartilhar o mesmo foco de outra atividade do lote`
    };
  }

  function buildRecord(item, index, state) {
    const baseScene = sceneForBatch(item, state);
    let selected;
    for (let attempt = 0; attempt < COMPOSITION_CATEGORIES.length; attempt += 1) {
      const scene = rewrittenScene(baseScene, item, attempt);
      const category = chooseCompositionCategory(scene, item, index, attempt, state);
      const characterPlan = scene.characterPlan || 'personagens apenas quando necessários, em posição diferente das demais atividades';
      const objectLayout = scene.objectLayout || 'objetos essenciais organizados ao redor de um único foco';
      const visualFocus = scene.visualFocus || `a ação concreta relacionada a ${item.topic}`;
      const composition = `${category} — ${COMPOSITION_DETAILS[category]}; personagens: ${characterPlan}; organização dos objetos: ${objectLayout}; foco principal: ${visualFocus}`;
      const fingerprint = `${scene.action}|${scene.objects.join('|')}|${category}|${characterPlan}|${objectLayout}|${visualFocus}`;
      const tooSimilar = state.records.some(record => similarityScore(fingerprint, record.fingerprint) >= 0.62);
      selected = { scene, category, composition, fingerprint };
      if (!tooSimilar) break;
    }
    state.categoryCounts.set(selected.category, (state.categoryCounts.get(selected.category) || 0) + 1);
    const excerpt = concreteExcerpt(item);
    const restrictions = 'ilustração educativa infantil limpa; fundo claro ou branco; sem paisagem desnecessária; sem texto legível; sem logotipos; sem respostas; não inventar personagens, objetos ou fatos que contradigam o texto; não repetir a composição ou a cena de outra atividade do lote';
    const visualBrief = `Cena concreta prioritária: ${selected.scene.action}. Trecho-base da atividade: ${excerpt}. Objetos obrigatórios: ${selected.scene.objects.join(', ')}. Conceito pedagógico: ${item.topic}. Composição: ${selected.composition}. Restrições: ${restrictions}.`;
    const record = {
      version: VERSION,
      collectionKey: collectionKey(item),
      normalizedTitle: item.normalizedTitle,
      sourceHash: hashText(`${item.topic}|${item.supportText}|${item.statement}|${item.questions.join('|')}`),
      action: selected.scene.action,
      objects: selected.scene.objects,
      compositionCategory: selected.category,
      composition: selected.composition,
      characterPlan: selected.scene.characterPlan,
      objectLayout: selected.scene.objectLayout,
      visualFocus: selected.scene.visualFocus,
      signature: normalizeTitle(`${item.topic}|${selected.fingerprint}`),
      visualBrief
    };
    state.records.push({ fingerprint: selected.fingerprint, visualBrief });
    return record;
  }

  function preparedActivities(items) {
    const signatures = readJson(VISUAL_SIGNATURES_KEY, {});
    items.forEach(item => delete signatures[`${collectionKey(item)}::${item.normalizedTitle}`]);
    const state = { categoryCounts: new Map(), familyCounts: new Map(), records: [] };
    const activities = items.map((item, index) => {
      const record = buildRecord(item, index, state);
      signatures[`${collectionKey(item)}::${item.normalizedTitle}`] = record;
      return {
        order: index + 1,
        subject: item.subject,
        topic: item.topic,
        normalizedTitle: item.normalizedTitle,
        fileName: `${item.normalizedTitle}.png`,
        stage: item.stage,
        grade: item.grade,
        term: item.term,
        supportText: item.supportText,
        statement: item.statement,
        questions: item.questions,
        visualBrief: record.visualBrief,
        visualSignature: record.signature
      };
    });
    writeJson(VISUAL_SIGNATURES_KEY, signatures);
    return activities;
  }

  function downloadJson(activities) {
    const blob = new Blob([`${JSON.stringify(activities, null, 2)}\n`], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const first = activities[0] || {};
    link.href = url;
    link.download = `teacheasy-lote-${normalizeTitle(`${first.grade}-${first.term}-bimestre-${first.subject}`) || 'ilustracoes'}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function prepareContentFirstBatch() {
    const selected = selectedItems();
    if (!selected.length) throw new Error('Selecione uma atividade para montar o lote.');
    const items = selected.map(fullItem);
    const activities = preparedActivities(items);
    const linked = await Promise.all(items.map(item => window.TeLibraryTitleImages?.loadImage?.(item.normalizedTitle).catch?.(() => '') || ''));
    const prepared = {
      version: VERSION,
      preparedAt: new Date().toISOString(),
      collectionKey: collectionKey(items[0]),
      progress: { total: activities.length, prepared: activities.length, linked: linked.filter(Boolean).length },
      activities
    };
    writeJson(PREPARED_BATCH_KEY, prepared);
    downloadJson(activities);
    const status = document.querySelector('#te-illustration-batch-toolbar [data-status]');
    if (status) status.textContent = `Lote preparado com cena concreta: ${activities.length}/${activities.length}.`;
    return prepared;
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('#te-illustration-batch-toolbar [data-prepare]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    prepareContentFirstBatch().catch(error => {
      console.error(error);
      alert(`Não foi possível preparar o lote: ${error?.message || error}`);
    });
  }, true);

  window.TeLibraryContentFirstVisualBrief = {
    concreteExcerpt,
    sceneFor,
    preparedActivities,
    prepareContentFirstBatch
  };
})();
