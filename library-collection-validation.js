(() => {
  const V2_COLLECTION_COUNTS = {
    '4ano-4bimestre-ciencias': 20
  };

  validateCollection = function validateCollectionWithV2(collection, config) {
    const schemaVersion = String(collection?.schemaVersion || '');
    const isLegacy = schemaVersion === '1.0';
    const isV2 = schemaVersion === '2.0';

    if (!isLegacy && !isV2) {
      throw new Error(`Estrutura da coleção de ${collection?.disciplina || 'atividades'} inválida.`);
    }

    const expectedCollection = isV2 ? `${config.collection}-v2` : config.collection;
    const expectedCount = isV2
      ? (V2_COLLECTION_COUNTS[config.collection] ?? config.count)
      : config.count;
    const expectedQuestions = isV2 ? 8 : 6;

    if (collection.colecao !== expectedCollection
      || collection.idioma !== 'pt-BR'
      || !Array.isArray(collection.atividades)
      || collection.atividades.length !== expectedCount
      || (isV2 && collection.padraoPedagogico !== 'teacheasy-v2')) {
      throw new Error(`Estrutura da coleção de ${collection.disciplina || 'atividades'} inválida.`);
    }

    const ids = new Set();
    collection.atividades.forEach(activity => {
      if (!activity?.id
        || ids.has(activity.id)
        || !Array.isArray(activity.questoes)
        || !Array.isArray(activity.gabarito)
        || activity.questoes.length !== expectedQuestions
        || activity.gabarito.length !== expectedQuestions) {
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
})();
