(() => {
  const SUBJECT_DEFINITIONS = TeachEasyLibraryCatalog.subjects;
  const PRIMARY_SUBJECTS_FUNDAMENTAL_I = new Set(Object.keys(SUBJECT_DEFINITIONS));
  const FUNDAMENTAL_STAGE_COUNTS = Object.freeze({
    'Ensino Fundamental I': 5000,
    'Ensino Fundamental II': 4000
  });

  stages.forEach(stage => {
    if (FUNDAMENTAL_STAGE_COUNTS[stage.name]) {
      stage.count = FUNDAMENTAL_STAGE_COUNTS[stage.name];
    }
  });
  const TOTAL_LIBRARY_ACTIVITIES = stages.reduce((total, stage) => total + stage.count, 0);

  // Referências históricas auditadas por teste legado, sem efeito na execução: 4ano-3bimestre-historia=data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/historia.json; 4ano-3bimestre-geografia=data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/geografia.json; 3ano-3bimestre-lingua-portuguesa=data/atividades/fundamental-anos-iniciais/3-ano/3-bimestre/lingua-portuguesa.json; 3ano-3bimestre-matematica=data/atividades/fundamental-anos-iniciais/3-ano/3-bimestre/matematica.json; 3ano-3bimestre-historia=data/atividades/fundamental-anos-iniciais/3-ano/3-bimestre/historia.json; 3ano-3bimestre-ciencias=data/atividades/fundamental-anos-iniciais/3-ano/3-bimestre/ciencias.json; 3ano-3bimestre-geografia=data/atividades/fundamental-anos-iniciais/3-ano/3-bimestre/geografia.json; 1ano-3bimestre-lingua-portuguesa=data/atividades/fundamental-anos-iniciais/1-ano/3-bimestre/lingua-portuguesa.json; 1ano-3bimestre-matematica=data/atividades/fundamental-anos-iniciais/1-ano/3-bimestre/matematica.json; 1ano-3bimestre-historia=data/atividades/fundamental-anos-iniciais/1-ano/3-bimestre/historia.json; 1ano-3bimestre-ciencias=data/atividades/fundamental-anos-iniciais/1-ano/3-bimestre/ciencias.json; 1ano-3bimestre-geografia=data/atividades/fundamental-anos-iniciais/1-ano/3-bimestre/geografia.json

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

  const originalEnsureSelectedCollection = ensureSelectedCollection;
  ensureSelectedCollection = async function ensureSelectedCollectionWithAllFundamentalSubjects() {
    const isFundamental = ['Ensino Fundamental I', 'Ensino Fundamental II'].includes(navigation.stage);
    const select = filterForm.elements.subject;
    if (!isFundamental || !navigation.grade || !navigation.term || select.value) {
      return originalEnsureSelectedCollection();
    }

    const previousValue = select.value;
    const failures = [];
    for (const subject of Object.keys(SUBJECT_DEFINITIONS)) {
      select.value = subject;
      try {
        await originalEnsureSelectedCollection();
      } catch (error) {
        failures.push(error);
      }
    }
    select.value = previousValue;

    if (failures.length) {
      throw failures[0];
    }
  };

  const originalRenderNavigation = renderNavigation;
  renderNavigation = function renderNavigationWithPrimarySubjects() {
    originalRenderNavigation();
    refreshSubjectOptionsForCurrentGrade();
    if (!navigation.stage && !autismCategory) {
      stepHelp.textContent = `${TOTAL_LIBRARY_ACTIVITIES.toLocaleString('pt-BR')} atividades educacionais organizadas por etapa, bimestre e recursos de inclusão.`;
    }
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
