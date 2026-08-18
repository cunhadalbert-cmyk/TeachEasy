(() => {
  const EXPECTED_SCIENCE_ACTIVITIES = 30;
  const EXPECTED_MATH_ACTIVITIES = 30;
  const EXPECTED_PORTUGUESE_ACTIVITIES = 30;

  collectionRegistry['Ciências'].count = EXPECTED_SCIENCE_ACTIVITIES;
  collectionRegistry['Ciências'].extraPath = 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias-extra.json';
  collectionRegistry['Matemática'].count = EXPECTED_MATH_ACTIVITIES;
  collectionRegistry['Matemática'].extraPath = 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica-extra.json';
  collectionRegistry['Língua Portuguesa'].count = EXPECTED_PORTUGUESE_ACTIVITIES;
  collectionRegistry['Língua Portuguesa'].extraPath = 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa-extra.json';

  const INITIAL_YEAR_NUMBERS = [1, 2, 3, 4, 5];
  const BIMESTERS = [1, 2, 3, 4];
  const SUBJECT_DEFINITIONS = {
    'Língua Portuguesa': { file: 'lingua-portuguesa', symbol: '📖', colors: ['#ffe2e8', '#eee3ff'] },
    'Matemática': { file: 'matematica', symbol: '➗', colors: ['#e1ebff', '#fff1bd'] },
    'História': { file: 'historia', symbol: '🏺', colors: ['#f1dfc8', '#ffe7cf'] },
    'Geografia': { file: 'geografia', symbol: '🗺️', colors: ['#d8efff', '#dff3dc'] },
    'Ciências': { file: 'ciencias', symbol: '🔬', colors: ['#d9f1e1', '#e8f0ff'] }
  };
  const PRIMARY_SUBJECTS_FUNDAMENTAL_I = new Set(Object.keys(SUBJECT_DEFINITIONS));

  function specialExtraPath(year, term, subject) {
    if (year !== 4 || term !== 3) return '';
    return {
      'Ciências': 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias-extra.json',
      'Matemática': 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica-extra.json',
      'Língua Portuguesa': 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa-extra.json'
    }[subject] || '';
  }

  const collectionConfigs = INITIAL_YEAR_NUMBERS.flatMap(year =>
    BIMESTERS.flatMap(term =>
      [...PRIMARY_SUBJECTS_FUNDAMENTAL_I].map(subject => {
        const definition = SUBJECT_DEFINITIONS[subject];
        const collection = `${year}ano-${term}bimestre-${definition.file}`;
        const basePath = `data/atividades/fundamental-anos-iniciais/${year}-ano/${term}-bimestre`;
        const config = {
          path: `${basePath}/${definition.file}.json`,
          collection,
          count: 30,
          grade: `${year}º ano`,
          term,
          symbol: definition.symbol,
          colors: [...definition.colors]
        };
        const extraPath = specialExtraPath(year, term, subject);
        if (extraPath) config.extraPath = extraPath;
        return config;
      })
    )
  );

  function isPrimaryFundamentalISubject(subject) {
    return PRIMARY_SUBJECTS_FUNDAMENTAL_I.has(subject);
  }

  const originalMatchesFilters = matchesFilters;
  matchesFilters = function matchesFiltersWithPrimarySubjects(activity, filters) {
    if (activity.stage === 'Ensino Fundamental I'
      && ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano'].includes(activity.grade)
      && !isPrimaryFundamentalISubject(activity.subject)) {
      return false;
    }
    return originalMatchesFilters(activity, filters);
  };

  function refreshSubjectOptionsForCurrentGrade() {
    const select = filterForm.elements.subject;
    const currentValue = select.value;
    const allOption = select.querySelector('option[value=""]');
    const isEarlyChildhood = navigation.stage === 'Educação Infantil'
      && ['Maternal', 'Pré I', 'Pré II'].includes(navigation.grade);
    const isInitialYears = navigation.stage === 'Ensino Fundamental I'
      && ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano'].includes(navigation.grade);
    const isFinalYears = navigation.stage === 'Ensino Fundamental II'
      && ['6º ano', '7º ano', '8º ano', '9º ano'].includes(navigation.grade);
    const isHighSchool = navigation.stage === 'Ensino Médio'
      && ['1ª série', '2ª série', '3ª série'].includes(navigation.grade);
    const values = isEarlyChildhood
      ? earlyChildhoodSubjects
      : isInitialYears
        ? [...PRIMARY_SUBJECTS_FUNDAMENTAL_I]
        : isFinalYears
          ? Object.keys(finalYearsSubjects)
          : isHighSchool
            ? Object.keys(highSchoolSubjects)
            : uniqueSorted('subject');

    select.replaceChildren(allOption || new Option('Todas as disciplinas', ''));
    values.forEach(value => select.append(new Option(value, value)));
    select.value = values.includes(currentValue) ? currentValue : '';
  }

  const originalRenderNavigation = renderNavigation;
  renderNavigation = function renderNavigationWithPrimarySubjects() {
    originalRenderNavigation();
    refreshSubjectOptionsForCurrentGrade();
  };

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

  readStoredSet(STORAGE_KEYS.favorites).forEach(id => favorites.add(id));
  readStoredSet(STORAGE_KEYS.selection).forEach(id => selectedActivities.add(id));
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

  function isSupportedCollectionPeriod() {
    if (navigation.stage !== 'Ensino Fundamental I') return false;
    if (['1º ano', '2º ano', '3º ano', '4º ano', '5º ano'].includes(navigation.grade)) {
      return ['1', '2', '3', '4'].includes(navigation.term);
    }
    return false;
  }

  function configsForCurrentFilter() {
    if (!isSupportedCollectionPeriod()) return [];

    const selectedSubject = String(filterForm.elements.subject.value || '');
    return collectionConfigs.filter(config =>
      config.grade === navigation.grade
      && Number(config.term) === Number(navigation.term)
      && (!selectedSubject || config.collection.endsWith(subjectCollectionSuffix(selectedSubject)))
    );
  }

  function subjectCollectionSuffix(subject) {
    return {
      'Ciências': '-ciencias',
      'Matemática': '-matematica',
      'Língua Portuguesa': '-lingua-portuguesa',
      'História': '-historia',
      'Geografia': '-geografia'
    }[subject] || '-disciplina-inexistente';
  }

  async function loadCollection(config) {
    if (loadedCollections.has(config.collection)) return;

    if (!collectionPromises.has(config.collection)) {
      const promise = fetch(config.path)
        .then(response => {
          if (!response.ok) throw new Error(`Não foi possível carregar ${config.collection}.`);
          return response.json();
        })
        .then(async collection => {
          if (config.extraPath) {
            const extraResponse = await fetch(config.extraPath);
            if (!extraResponse.ok) {
              throw new Error(`Não foi possível carregar as atividades extras de ${config.collection}.`);
            }
            const extraCollection = await extraResponse.json();
            collection = {
              ...collection,
              atividades: [...collection.atividades, ...extraCollection.atividades]
            };
          }

          validateCollection(collection, config);
          await validateCollectionAssets(collection);
          return collection;
        })
        .then(collection => {
          const normalized = collection.atividades.map(activity =>
            normalizeCollectionActivity(activity, collection, config)
          );
          const incomingIds = new Set(normalized.map(activity => activity.id));
          if (incomingIds.size !== normalized.length) {
            throw new Error(`ID duplicado encontrado em ${config.collection}.`);
          }

          activities = activities
            .filter(activity => !(
              activity.stage === 'Ensino Fundamental I'
              && activity.grade === config.grade
              && activity.term === Number(config.term)
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

  async function ensureCurrentCollections() {
    const configs = configsForCurrentFilter();
    const missing = configs.filter(config => !loadedCollections.has(config.collection));
    if (!missing.length) return;

    showToast(missing.length > 1
      ? `Carregando as atividades do ${navigation.grade}…`
      : 'Carregando a disciplina selecionada…');

    const results = await Promise.allSettled(missing.map(loadCollection));
    const failure = results.find(result => result.status === 'rejected');
    if (failure) {
      showToast(failure.reason?.message || 'Não foi possível carregar todas as atividades.');
    }

    currentPage = 1;
    renderActivities();
  }

  const originalEnsureSelectedCollection = ensureSelectedCollection;
  ensureSelectedCollection = async function ensureCollectionsWithoutDuplication() {
    if (isSupportedCollectionPeriod()) {
      await ensureCurrentCollections();
      return;
    }
    await originalEnsureSelectedCollection();
  };

  choiceGrid.addEventListener('click', () => {
    queueMicrotask(() => {
      ensureCurrentCollections().catch(error => showToast(error.message));
    });
  });

  filterForm.addEventListener('change', () => {
    ensureCurrentCollections().catch(error => showToast(error.message));
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

  openCollectionPreview = function openCollectionPreviewEightQuestions(activity) {
    const questions = Array.isArray(activity?.questions) ? activity.questions.slice(0, 8) : [];
    const firstPageQuestions = questions.slice(0, 4);
    const secondPageQuestions = questions.slice(4, 8);

    previewContent.innerHTML = `
      <div class="preview-shell collection-preview-shell">
        <div class="preview-topline">Revisão · ${activity.stage} · ${activity.grade} · ${activity.term}º bimestre</div>
        ${pendingFiguresMarkup(activity)}
        <div class="collection-export-actions">
          <button class="btn btn-outline preview-print" type="button">Baixar PDF / Imprimir</button>
          <button class="btn btn-primary preview-word" type="button">Baixar Word</button>
        </div>

        <section class="worksheet-page collection-student-page">
          <div class="student-fields">
            <span>Nome: ___________________________________________</span>
            <span>Turma: __________________</span>
            <span>Data: ____/____/____</span>
          </div>
          <h1>${activity.topic}</h1>
          <p class="collection-instruction">${activity.instruction}</p>
          ${activity.supportText && activity.supportText.conteudo ? `
            <article class="support-text">
              ${activity.supportText.titulo ? `<h2>${activity.supportText.titulo}</h2>` : ''}
              <p>${activity.supportText.conteudo.replace(/\n/g, '<br>')}</p>
            </article>
          ` : ''}
          ${activityFigureMarkup(activity)}
          <ol class="question-list collection-question-list">${questionMarkup(activity, firstPageQuestions)}</ol>
        </section>

        <section class="worksheet-page collection-student-page collection-student-page-two">
          <ol class="question-list collection-question-list" start="5">${questionMarkup(activity, secondPageQuestions)}</ol>
        </section>

        <section class="worksheet-page answer-key-page collection-answer-key">
          <h2>Gabarito</h2>
          <h3>${activity.topic}</h3>
          <ol>${answerMarkup(activity)}</ol>
        </section>
      </div>`;

    previewContent.querySelector('.preview-print').addEventListener('click', () => window.print());
    previewContent.querySelector('.preview-word').addEventListener('click', () => {
      downloadCollectionWord(activity).catch(error => showToast(error.message));
    });
    preview.showModal();
  };

  renderNavigation();
})();
