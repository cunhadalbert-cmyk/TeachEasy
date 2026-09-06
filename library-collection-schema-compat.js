(() => {
  const TARGET_COLLECTION = '4ano-4bimestre-lingua-portuguesa';
  const FRESH_VERSION = '20260906-editorial-v3';
  const originalValidateCollection = validateCollection;
  const originalEnsureSelectedCollection = ensureSelectedCollection;

  validateCollection = function validateCollectionWithEditorialV3(collection, config) {
    const schemaVersion = String(collection?.schemaVersion || '');
    const isEditorialV3 = schemaVersion === '2.0'
      && typeof collection?.colecao === 'string'
      && collection.colecao.startsWith(`${config.collection}-v3-`);

    if (!isEditorialV3) {
      return originalValidateCollection(collection, config);
    }

    const expectedCount = config.count;
    if (collection.idioma !== 'pt-BR'
      || !Array.isArray(collection.atividades)
      || collection.atividades.length !== expectedCount
      || collection.padraoPedagogico !== 'teacheasy-v2') {
      throw new Error(`Estrutura da coleção de ${collection.disciplina || 'atividades'} inválida.`);
    }

    const ids = new Set();
    collection.atividades.forEach(activity => {
      if (!activity?.id
        || ids.has(activity.id)
        || !Array.isArray(activity.questoes)
        || !Array.isArray(activity.gabarito)
        || activity.questoes.length !== 8
        || activity.gabarito.length !== 8) {
        throw new Error('Atividades, questões ou IDs da coleção são inválidos.');
      }

      ids.add(activity.id);
      const figures = Array.isArray(activity.figuras) ? activity.figuras : [];
      const figureIds = new Set(figures.map(figure => figure.id));
      activity.questoes.forEach(question => {
        if (question.figuraId && !figureIds.has(question.figuraId)) {
          throw new Error(`Referência de figura inválida em ${activity.id}.`);
        }
      });
    });
  };

  ensureSelectedCollection = async function ensureSelectedCollectionWithFreshEditorialData() {
    const config = selectedCollectionConfig();
    if (!config || config.collection !== TARGET_COLLECTION) {
      return originalEnsureSelectedCollection();
    }

    const separator = config.path.includes('?') ? '&' : '?';
    const response = await fetch(`${config.path}${separator}v=${FRESH_VERSION}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Não foi possível carregar a coleção revisada de Língua Portuguesa.');
    }

    const collection = await response.json();
    validateCollection(collection, config);

    // A ausência isolada de uma figura não pode impedir o carregamento do conteúdo canônico.
    try {
      await validateCollectionAssets(collection);
    } catch (error) {
      console.warn('TeachEasy: conteúdo carregado; uma ou mais figuras precisam de revisão.', error);
    }

    const normalizedActivities = collection.atividades.map(activity => {
      const normalized = normalizeCollectionActivity(activity, collection, config);
      normalized.bnccDetails = Array.isArray(activity.bncc)
        ? activity.bncc.map(item => ({
            codigo: item.codigo || '',
            habilidadeOficial: item.habilidadeOficial || '',
            fonte: item.fonte || ''
          }))
        : [];
      normalized.gabaritoCabecalho = activity.gabaritoCabecalho || null;
      return normalized;
    });

    activities = activities
      .filter(activity => !(activity.stage === config.stage
        && activity.grade === config.grade
        && activity.term === config.term
        && activity.subject === collection.disciplina))
      .concat(normalizedActivities);

    loadedCollections.add(config.collection);
    collectionPromises.delete(config.collection);
  };
})();
