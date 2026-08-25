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
        action: 'Um estudante revisando um texto sobre um cachorro da praça, usando referências visuais diferentes para o mesmo animal e evitando repetição',
        objects: ['cachorro', 'casinha do cachorro', 'caderno em revisão', 'cartões visuais com o mesmo cachorro representado de formas diferentes']
      };
    }
    if (/horta da escola|alface|cebolinha|tomate|revisar um par[aá]grafo/.test(source)) {
      return {
        action: 'Um estudante revisando cuidadosamente um parágrafo sobre a horta da escola, com a horta como referência visual concreta',
        objects: ['caderno com linhas sem texto legível', 'lápis de revisão', 'alface', 'cebolinha', 'tomate', 'canteiro escolar simplificado']
      };
    }
    if (/divulga[cç][aã]o cient[ií]fica/.test(source)) {
      return {
        action: 'Estudantes explorando um material de divulgação científica infantil, observando evidências e registrando descobertas',
        objects: ['revista ou ficha científica sem texto legível', 'lupa', 'amostra ou modelo científico', 'caderno de registro']
      };
    }
    if (/not[ií]cia/.test(source)) {
      const variant = hashText(item.normalizedTitle) % 3;
      if (variant === 0) return {
        action: 'Estudantes analisando uma notícia escolar para identificar fato, participantes, local e momento do acontecimento',
        objects: ['folha de notícia sem texto legível', 'fotografia ilustrativa', 'marcadores visuais', 'caderno']
      };
      if (variant === 1) return {
        action: 'Estudantes organizando visualmente as informações principais de uma notícia em grupos distintos',
        objects: ['notícia impressa sem texto legível', 'cartões visuais', 'imagem do acontecimento', 'caderno']
      };
      return {
        action: 'Estudantes comparando elementos de uma notícia e justificando quais informações são essenciais para compreender o acontecimento',
        objects: ['duas áreas visuais de notícia sem texto legível', 'imagem do acontecimento', 'marcadores', 'caderno']
      };
    }

    return {
      action: `Representar diretamente a cena concreta descrita no texto de apoio: ${excerpt}`,
      objects: ['personagens, objetos e ações mencionados explicitamente no texto', 'materiais escolares apenas quando necessários']
    };
  }

  function compositionOptions() {
    return [
      'composição central, fundo claro, foco na ação principal',
      'vista frontal, fundo claro, personagens e objetos principais bem separados',
      'ângulo lateral, fundo claro, foco na interação entre personagens',
      'close pedagógico, fundo branco, apenas os elementos indispensáveis',
      'composição em sequência curta, fundo claro, ação organizada da esquerda para a direita'
    ];
  }

  function buildRecord(item, index, usedCompositions) {
    const scene = sceneFor(item);
    const options = compositionOptions();
    let composition = options[(hashText(item.normalizedTitle) + index) % options.length];
    for (const candidate of options) {
      if (!usedCompositions.has(candidate)) {
        composition = candidate;
        break;
      }
    }
    usedCompositions.add(composition);
    const excerpt = concreteExcerpt(item);
    const restrictions = 'ilustração educativa infantil limpa; fundo claro ou branco; sem paisagem desnecessária; sem texto legível; sem logotipos; sem respostas; não inventar personagens, objetos ou fatos que contradigam o texto; não repetir a composição ou a cena de outra atividade do lote';
    const visualBrief = `Cena concreta prioritária: ${scene.action}. Trecho-base da atividade: ${excerpt}. Objetos obrigatórios: ${scene.objects.join(', ')}. Conceito pedagógico: ${item.topic}. Composição: ${composition}. Restrições: ${restrictions}.`;
    return {
      version: VERSION,
      collectionKey: collectionKey(item),
      normalizedTitle: item.normalizedTitle,
      sourceHash: hashText(`${item.topic}|${item.supportText}|${item.statement}|${item.questions.join('|')}`),
      action: scene.action,
      objects: scene.objects,
      composition,
      signature: normalizeTitle(`${item.topic}|${scene.action}|${scene.objects.join('|')}|${composition}`),
      visualBrief
    };
  }

  function preparedActivities(items) {
    const signatures = readJson(VISUAL_SIGNATURES_KEY, {});
    const usedCompositions = new Set();
    const activities = items.map((item, index) => {
      const record = buildRecord(item, index, usedCompositions);
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
