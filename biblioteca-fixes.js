(() => {
  const EXPECTED_MATH_ACTIVITIES = 20;
  collectionRegistry['Matemática'].count = EXPECTED_MATH_ACTIVITIES;

  const STORAGE_KEYS = {
    favorites: 'teacheasy.library.favorites',
    selection: 'teacheasy.library.selection'
  };

  function readStoredSet(key) {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      return new Set(Array.isArray(stored) ? stored.filter(item => typeof item === 'string') : []);
    } catch {
      localStorage.removeItem(key);
      return new Set();
    }
  }

  function saveStoredSet(key, values) {
    try {
      localStorage.setItem(key, JSON.stringify([...values]));
    } catch {
      // A biblioteca continua funcionando mesmo quando o armazenamento está indisponível.
    }
  }

  const storedFavorites = readStoredSet(STORAGE_KEYS.favorites);
  const storedSelection = readStoredSet(STORAGE_KEYS.selection);

  storedFavorites.forEach(id => favorites.add(id));
  storedSelection.forEach(id => selectedActivities.add(id));
  selectionCount.textContent = String(selectedActivities.size);

  const originalToggleFavorite = toggleFavorite;
  toggleFavorite = function persistFavorite(id) {
    originalToggleFavorite(id);
    saveStoredSet(STORAGE_KEYS.favorites, favorites);
  };

  const originalToggleSelection = toggleSelection;
  toggleSelection = function persistSelection(id) {
    originalToggleSelection(id);
    saveStoredSet(STORAGE_KEYS.selection, selectedActivities);
  };

  function isFourthGradeThirdTerm() {
    return navigation.stage === 'Ensino Fundamental I'
      && navigation.grade === '4º ano'
      && navigation.term === '3';
  }

  function collectionConfigsForCurrentFilter() {
    if (!isFourthGradeThirdTerm()) return [];

    const selectedSubject = String(filterForm.elements.subject.value || '');
    if (selectedSubject) {
      const selected = collectionRegistry[selectedSubject];
      return selected ? [selected] : [];
    }

    return Object.values(collectionRegistry);
  }

  async function loadCollection(config) {
    if (loadedCollections.has(config.collection)) return;

    if (!collectionPromises.has(config.collection)) {
      const promise = fetch(config.path)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Não foi possível carregar ${config.collection}.`);
          }
          return response.json();
        })
        .then(collection => {
          validateCollection(collection, config);
          return validateCollectionAssets(collection).then(() => collection);
        })
        .then(collection => {
          const normalized = collection.atividades.map(activity =>
            normalizeCollectionActivity(activity, collection, config)
          );

          const incomingIds = new Set();
          normalized.forEach(activity => {
            if (incomingIds.has(activity.id)) {
              throw new Error(`ID duplicado encontrado: ${activity.id}.`);
            }
            incomingIds.add(activity.id);
          });

          activities = activities
            .filter(activity => !(
              activity.stage === 'Ensino Fundamental I'
              && activity.grade === '4º ano'
              && activity.term === 3
              && activity.subject === collection.disciplina
            ))
            .concat(normalized);

          loadedCollections.add(config.collection);
        })
        .catch(error => {
          collectionPromises.delete(config.collection);
          throw error;
        });

      collectionPromises.set(config.collection, promise);
    }

    return collectionPromises.get(config.collection);
  }

  async function ensureFourthGradeCollections() {
    const configs = collectionConfigsForCurrentFilter();
    if (!configs.length) return;

    const missing = configs.filter(config => !loadedCollections.has(config.collection));
    if (!missing.length) return;

    showToast(missing.length > 1
      ? 'Carregando as atividades do 4º ano…'
      : 'Carregando a disciplina selecionada…');

    const results = await Promise.allSettled(missing.map(loadCollection));
    const failures = results.filter(result => result.status === 'rejected');

    if (failures.length) {
      const message = failures[0].reason?.message || 'Não foi possível carregar todas as atividades.';
      showToast(message);
    }

    currentPage = 1;
    renderActivities();
  }

  const originalEnsureSelectedCollection = ensureSelectedCollection;
  ensureSelectedCollection = async function ensureCollectionsWithoutDuplication() {
    if (isFourthGradeThirdTerm()) {
      await ensureFourthGradeCollections();
      return;
    }
    await originalEnsureSelectedCollection();
  };

  choiceGrid.addEventListener('click', () => {
    queueMicrotask(() => {
      ensureFourthGradeCollections().catch(error => showToast(error.message));
    });
  });

  filterForm.addEventListener('change', () => {
    ensureFourthGradeCollections().catch(error => showToast(error.message));
  });

  window.addEventListener('storage', event => {
    if (![STORAGE_KEYS.favorites, STORAGE_KEYS.selection].includes(event.key)) return;

    favorites.clear();
    selectedActivities.clear();
    readStoredSet(STORAGE_KEYS.favorites).forEach(id => favorites.add(id));
    readStoredSet(STORAGE_KEYS.selection).forEach(id => selectedActivities.add(id));
    selectionCount.textContent = String(selectedActivities.size);
    renderActivities();
  });

  renderActivities();
})();
