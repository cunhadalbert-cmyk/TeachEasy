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

  const collectionConfigs = [
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/1-bimestre/lingua-portuguesa.json',
      collection: '4ano-1bimestre-lingua-portuguesa',
      count: 30,
      grade: '4º ano',
      term: 1,
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/1-bimestre/matematica.json',
      collection: '4ano-1bimestre-matematica',
      count: 30,
      grade: '4º ano',
      term: 1,
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/1-bimestre/historia.json',
      collection: '4ano-1bimestre-historia',
      count: 30,
      grade: '4º ano',
      term: 1,
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/1-bimestre/geografia.json',
      collection: '4ano-1bimestre-geografia',
      count: 30,
      grade: '4º ano',
      term: 1,
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/1-bimestre/ciencias.json',
      collection: '4ano-1bimestre-ciencias',
      count: 30,
      grade: '4º ano',
      term: 1,
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/2-bimestre/lingua-portuguesa.json',
      collection: '4ano-2bimestre-lingua-portuguesa',
      count: 30,
      grade: '4º ano',
      term: 2,
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/2-bimestre/matematica.json',
      collection: '4ano-2bimestre-matematica',
      count: 30,
      grade: '4º ano',
      term: 2,
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/2-bimestre/historia.json',
      collection: '4ano-2bimestre-historia',
      count: 30,
      grade: '4º ano',
      term: 2,
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/2-bimestre/geografia.json',
      collection: '4ano-2bimestre-geografia',
      count: 30,
      grade: '4º ano',
      term: 2,
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/2-bimestre/ciencias.json',
      collection: '4ano-2bimestre-ciencias',
      count: 30,
      grade: '4º ano',
      term: 2,
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/4-bimestre/lingua-portuguesa.json',
      collection: '4ano-4bimestre-lingua-portuguesa',
      count: 30,
      grade: '4º ano',
      term: 4,
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/4-bimestre/matematica.json',
      collection: '4ano-4bimestre-matematica',
      count: 30,
      grade: '4º ano',
      term: 4,
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/4-bimestre/historia.json',
      collection: '4ano-4bimestre-historia',
      count: 30,
      grade: '4º ano',
      term: 4,
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/4-bimestre/geografia.json',
      collection: '4ano-4bimestre-geografia',
      count: 30,
      grade: '4º ano',
      term: 4,
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/4-bimestre/ciencias.json',
      collection: '4ano-4bimestre-ciencias',
      count: 30,
      grade: '4º ano',
      term: 4,
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json',
      extraPath: 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias-extra.json',
      collection: '4ano-3bimestre-ciencias',
      count: EXPECTED_SCIENCE_ACTIVITIES,
      grade: '4º ano',
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica.json',
      extraPath: 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica-extra.json',
      collection: '4ano-3bimestre-matematica',
      count: EXPECTED_MATH_ACTIVITIES,
      grade: '4º ano',
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json',
      extraPath: 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa-extra.json',
      collection: '4ano-3bimestre-lingua-portuguesa',
      count: EXPECTED_PORTUGUESE_ACTIVITIES,
      grade: '4º ano',
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/historia.json',
      collection: '4ano-3bimestre-historia',
      count: 30,
      grade: '4º ano',
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/geografia.json',
      collection: '4ano-3bimestre-geografia',
      count: 30,
      grade: '4º ano',
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/3-ano/3-bimestre/lingua-portuguesa.json',
      collection: '3ano-3bimestre-lingua-portuguesa',
      count: 30,
      grade: '3º ano',
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/3-ano/3-bimestre/matematica.json',
      collection: '3ano-3bimestre-matematica',
      count: 30,
      grade: '3º ano',
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/3-ano/3-bimestre/historia.json',
      collection: '3ano-3bimestre-historia',
      count: 30,
      grade: '3º ano',
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/3-ano/3-bimestre/ciencias.json',
      collection: '3ano-3bimestre-ciencias',
      count: 30,
      grade: '3º ano',
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/3-ano/3-bimestre/geografia.json',
      collection: '3ano-3bimestre-geografia',
      count: 30,
      grade: '3º ano',
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/3-bimestre/lingua-portuguesa.json',
      collection: '1ano-3bimestre-lingua-portuguesa',
      count: 30,
      grade: '1º ano',
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/3-bimestre/matematica.json',
      collection: '1ano-3bimestre-matematica',
      count: 30,
      grade: '1º ano',
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/3-bimestre/historia.json',
      collection: '1ano-3bimestre-historia',
      count: 30,
      grade: '1º ano',
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/3-bimestre/ciencias.json',
      collection: '1ano-3bimestre-ciencias',
      count: 30,
      grade: '1º ano',
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/3-bimestre/geografia.json',
      collection: '1ano-3bimestre-geografia',
      count: 30,
      grade: '1º ano',
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/1-bimestre/lingua-portuguesa.json',
      collection: '1ano-1bimestre-lingua-portuguesa',
      count: 30,
      grade: '1º ano',
      term: 1,
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/1-bimestre/matematica.json',
      collection: '1ano-1bimestre-matematica',
      count: 30,
      grade: '1º ano',
      term: 1,
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/1-bimestre/historia.json',
      collection: '1ano-1bimestre-historia',
      count: 30,
      grade: '1º ano',
      term: 1,
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/1-bimestre/geografia.json',
      collection: '1ano-1bimestre-geografia',
      count: 30,
      grade: '1º ano',
      term: 1,
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/1-bimestre/ciencias.json',
      collection: '1ano-1bimestre-ciencias',
      count: 30,
      grade: '1º ano',
      term: 1,
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/2-bimestre/lingua-portuguesa.json',
      collection: '1ano-2bimestre-lingua-portuguesa',
      count: 30,
      grade: '1º ano',
      term: 2,
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/2-bimestre/matematica.json',
      collection: '1ano-2bimestre-matematica',
      count: 30,
      grade: '1º ano',
      term: 2,
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/2-bimestre/historia.json',
      collection: '1ano-2bimestre-historia',
      count: 30,
      grade: '1º ano',
      term: 2,
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/2-bimestre/geografia.json',
      collection: '1ano-2bimestre-geografia',
      count: 30,
      grade: '1º ano',
      term: 2,
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/2-bimestre/ciencias.json',
      collection: '1ano-2bimestre-ciencias',
      count: 30,
      grade: '1º ano',
      term: 2,
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/4-bimestre/lingua-portuguesa.json',
      collection: '1ano-4bimestre-lingua-portuguesa',
      count: 30,
      grade: '1º ano',
      term: 4,
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/4-bimestre/matematica.json',
      collection: '1ano-4bimestre-matematica',
      count: 30,
      grade: '1º ano',
      term: 4,
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/4-bimestre/historia.json',
      collection: '1ano-4bimestre-historia',
      count: 30,
      grade: '1º ano',
      term: 4,
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/4-bimestre/geografia.json',
      collection: '1ano-4bimestre-geografia',
      count: 30,
      grade: '1º ano',
      term: 4,
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/1-ano/4-bimestre/ciencias.json',
      collection: '1ano-4bimestre-ciencias',
      count: 30,
      grade: '1º ano',
      term: 4,
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/1-bimestre/lingua-portuguesa.json',
      collection: '2ano-1bimestre-lingua-portuguesa',
      count: 30,
      grade: '2º ano',
      term: 1,
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/1-bimestre/matematica.json',
      collection: '2ano-1bimestre-matematica',
      count: 30,
      grade: '2º ano',
      term: 1,
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/1-bimestre/historia.json',
      collection: '2ano-1bimestre-historia',
      count: 30,
      grade: '2º ano',
      term: 1,
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/1-bimestre/geografia.json',
      collection: '2ano-1bimestre-geografia',
      count: 30,
      grade: '2º ano',
      term: 1,
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/1-bimestre/ciencias.json',
      collection: '2ano-1bimestre-ciencias',
      count: 30,
      grade: '2º ano',
      term: 1,
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/2-bimestre/lingua-portuguesa.json',
      collection: '2ano-2bimestre-lingua-portuguesa',
      count: 30,
      grade: '2º ano',
      term: 2,
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/2-bimestre/matematica.json',
      collection: '2ano-2bimestre-matematica',
      count: 30,
      grade: '2º ano',
      term: 2,
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/2-bimestre/historia.json',
      collection: '2ano-2bimestre-historia',
      count: 30,
      grade: '2º ano',
      term: 2,
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/2-bimestre/geografia.json',
      collection: '2ano-2bimestre-geografia',
      count: 30,
      grade: '2º ano',
      term: 2,
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/2-bimestre/ciencias.json',
      collection: '2ano-2bimestre-ciencias',
      count: 30,
      grade: '2º ano',
      term: 2,
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/3-bimestre/lingua-portuguesa.json',
      collection: '2ano-3bimestre-lingua-portuguesa',
      count: 30,
      grade: '2º ano',
      term: 3,
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/3-bimestre/matematica.json',
      collection: '2ano-3bimestre-matematica',
      count: 30,
      grade: '2º ano',
      term: 3,
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/3-bimestre/historia.json',
      collection: '2ano-3bimestre-historia',
      count: 30,
      grade: '2º ano',
      term: 3,
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/3-bimestre/geografia.json',
      collection: '2ano-3bimestre-geografia',
      count: 30,
      grade: '2º ano',
      term: 3,
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/3-bimestre/ciencias.json',
      collection: '2ano-3bimestre-ciencias',
      count: 30,
      grade: '2º ano',
      term: 3,
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/4-bimestre/lingua-portuguesa.json',
      collection: '2ano-4bimestre-lingua-portuguesa',
      count: 30,
      grade: '2º ano',
      term: 4,
      symbol: '📖',
      colors: ['#ffe2e8', '#eee3ff']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/4-bimestre/matematica.json',
      collection: '2ano-4bimestre-matematica',
      count: 30,
      grade: '2º ano',
      term: 4,
      symbol: '➗',
      colors: ['#e1ebff', '#fff1bd']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/4-bimestre/historia.json',
      collection: '2ano-4bimestre-historia',
      count: 30,
      grade: '2º ano',
      term: 4,
      symbol: '🏺',
      colors: ['#f1dfc8', '#ffe7cf']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/4-bimestre/geografia.json',
      collection: '2ano-4bimestre-geografia',
      count: 30,
      grade: '2º ano',
      term: 4,
      symbol: '🗺️',
      colors: ['#d8efff', '#dff3dc']
    },
    {
      path: 'data/atividades/fundamental-anos-iniciais/2-ano/4-bimestre/ciencias.json',
      collection: '2ano-4bimestre-ciencias',
      count: 30,
      grade: '2º ano',
      term: 4,
      symbol: '🔬',
      colors: ['#d9f1e1', '#e8f0ff']
    }
  ];


  const PRIMARY_SUBJECTS_FUNDAMENTAL_I = new Set([
    'Língua Portuguesa',
    'Matemática',
    'História',
    'Geografia',
    'Ciências'
  ]);

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
    const allOption = select.querySelector('option[value="]');
    const values = navigation.stage === 'Ensino Fundamental I'
      && ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano'].includes(navigation.grade)
      ? [...PRIMARY_SUBJECTS_FUNDAMENTAL_I]
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
    if (['1º ano', '2º ano', '4º ano'].includes(navigation.grade)) return ['1', '2', '3', '4'].includes(navigation.term);
    return navigation.grade === '3º ano' && navigation.term === '3';
  }

  function configsForCurrentFilter() {
    if (!isSupportedCollectionPeriod()) return [];

    const selectedSubject = String(filterForm.elements.subject.value || '');
    return collectionConfigs.filter(config =>
      config.grade === navigation.grade
      && Number(config.term || 3) === Number(navigation.term)
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
              && activity.term === Number(config.term || 3)
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

  renderActivities();
})();

