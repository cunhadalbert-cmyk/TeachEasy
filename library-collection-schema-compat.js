(() => {
  const originalValidateCollection = validateCollection;

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
})();
