(() => {
  const STORAGE_PREFIX = 'teacheasy-accessibility:';
  const OPTION_NAMES = [
    'visualSupport',
    'steps',
    'largeText',
    'spacious',
    'alternativeResponse',
    'reducedStimuli',
    'checklist',
    'flexibleTime'
  ];

  let activeActivity = null;
  let adapterDialog = null;

  function storageKey(activity) {
    return `${STORAGE_PREFIX}${activity.id}`;
  }

  function loadOptions(activity) {
    try {
      const saved = sessionStorage.getItem(storageKey(activity));
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  function saveOptions(activity, options) {
    try {
      sessionStorage.setItem(storageKey(activity), JSON.stringify(options));
    } catch {
      // A adaptação continua funcionando mesmo quando o armazenamento está indisponível.
    }
  }

  function defaultOptions(activity) {
    return {
      visualSupport: Boolean(activity.hasFigures),
      steps: true,
      largeText: false,
      spacious: true,
      alternativeResponse: true,
      reducedStimuli: false,
      checklist: true,
      flexibleTime: true
    };
  }

  function ensureDialog() {
    if (adapterDialog) return adapterDialog;

    adapterDialog = document.createElement('dialog');
    adapterDialog.className = 'accessibility-adapter-dialog';
    adapterDialog.id = 'accessibility-adapter-dialog';
    adapterDialog.setAttribute('aria-labelledby', 'accessibility-adapter-title');
    adapterDialog.innerHTML = `
      <form class="accessibility-adapter-form">
        <button class="accessibility-adapter-close" type="button" aria-label="Fechar">×</button>
        <span class="accessibility-adapter-eyebrow">ACESSIBILIDADE E ADAPTAÇÃO</span>
        <h2 id="accessibility-adapter-title">Adaptar atividade</h2>
        <p class="accessibility-adapter-intro">Escolha recursos de apresentação e resposta para esta atividade. O conteúdo curricular, o gabarito e a BNCC permanecem os mesmos.</p>

        <fieldset>
          <legend>Recursos para esta versão</legend>
          <label><input type="checkbox" name="visualSupport"> <span><strong>Destacar apoio visual existente</strong><small>Valoriza imagens e figuras pedagógicas já vinculadas à atividade.</small></span></label>
          <label><input type="checkbox" name="steps"> <span><strong>Organizar em etapas</strong><small>Numera visualmente as questões e deixa o percurso mais previsível.</small></span></label>
          <label><input type="checkbox" name="largeText"> <span><strong>Fonte maior</strong><small>Aumenta texto e espaçamento para facilitar a leitura.</small></span></label>
          <label><input type="checkbox" name="spacious"> <span><strong>Mais espaço entre questões</strong><small>Reduz a sensação de excesso de informação na página.</small></span></label>
          <label><input type="checkbox" name="alternativeResponse"> <span><strong>Formas alternativas de resposta</strong><small>Permite escrita, marcação, desenho, apontar ou símbolos quando isso for adequado à proposta.</small></span></label>
          <label><input type="checkbox" name="reducedStimuli"> <span><strong>Reduzir estímulos visuais</strong><small>Retira efeitos decorativos sem esconder imagens necessárias ao conteúdo.</small></span></label>
          <label><input type="checkbox" name="checklist"> <span><strong>Checklist visual</strong><small>Acrescenta uma sequência simples para orientar o estudante.</small></span></label>
          <label><input type="checkbox" name="flexibleTime"> <span><strong>Tempo flexível</strong><small>Mostra ao professor a orientação de respeitar o tempo necessário do estudante.</small></span></label>
        </fieldset>

        <p class="accessibility-adapter-note">A adaptação muda a forma de acesso à atividade, não reduz o objetivo pedagógico.</p>
        <div class="accessibility-adapter-actions">
          <button class="btn btn-outline accessibility-adapter-cancel" type="button">Cancelar</button>
          <button class="btn btn-primary accessibility-adapter-apply" type="submit">Aplicar adaptações</button>
        </div>
      </form>`;

    document.body.append(adapterDialog);

    adapterDialog.querySelector('.accessibility-adapter-close').addEventListener('click', () => adapterDialog.close());
    adapterDialog.querySelector('.accessibility-adapter-cancel').addEventListener('click', () => adapterDialog.close());
    adapterDialog.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      if (!activeActivity) return;
      const options = Object.fromEntries(OPTION_NAMES.map(name => [
        name,
        adapterDialog.querySelector(`[name="${name}"]`).checked
      ]));
      saveOptions(activeActivity, options);
      adapterDialog.close();
      openPreview(activeActivity);
    });

    return adapterDialog;
  }

  function openAdapter(activity) {
    activeActivity = activity;
    const dialog = ensureDialog();
    const options = loadOptions(activity) || defaultOptions(activity);
    const title = dialog.querySelector('#accessibility-adapter-title');
    title.textContent = `Adaptar: ${activity.topic}`;

    OPTION_NAMES.forEach(name => {
      dialog.querySelector(`[name="${name}"]`).checked = Boolean(options[name]);
    });

    const visualInput = dialog.querySelector('[name="visualSupport"]');
    visualInput.disabled = !activity.hasFigures;
    if (!activity.hasFigures) visualInput.checked = false;

    dialog.showModal();
  }

  function questionListsFor(shell) {
    const studentArea = shell.querySelector('.collection-student-page')
      || shell.querySelector('.student-page')
      || shell;
    const lists = [...studentArea.querySelectorAll('ol')]
      .filter(list => !list.closest('.collection-answer-key, .answer-key-page, .answer-key, .gabarito'));
    return { studentArea, lists };
  }

  function createSupportBox(activity, options) {
    const messages = [];
    if (options.visualSupport && activity.hasFigures) {
      messages.push('Observe primeiro as imagens ou figuras que ajudam a compreender a atividade.');
    }
    if (options.alternativeResponse) {
      messages.push('Quando a proposta permitir, você pode responder escrevendo, marcando, desenhando, apontando ou usando símbolos.');
    }
    if (!messages.length) return null;

    const box = document.createElement('aside');
    box.className = 'accessibility-student-support';
    box.setAttribute('aria-label', 'Apoios de acessibilidade');
    box.innerHTML = `<strong>Como fazer</strong>${messages.map(message => `<p>${message}</p>`).join('')}`;
    return box;
  }

  function createChecklist() {
    const checklist = document.createElement('aside');
    checklist.className = 'accessibility-checklist';
    checklist.innerHTML = `
      <strong>Checklist</strong>
      <span>□ 1. Leia ou escute a orientação.</span>
      <span>□ 2. Observe o apoio visual, quando houver.</span>
      <span>□ 3. Faça uma questão de cada vez.</span>
      <span>□ 4. Confira antes de finalizar.</span>`;
    return checklist;
  }

  function decoratePreview(activity, options) {
    const shell = document.querySelector('#preview-content .preview-shell');
    if (!shell || !options) return;

    shell.classList.add('accessibility-adapted');
    shell.classList.toggle('accessibility-large-text', Boolean(options.largeText));
    shell.classList.toggle('accessibility-spacious', Boolean(options.spacious));
    shell.classList.toggle('accessibility-low-stimulus', Boolean(options.reducedStimuli));
    shell.classList.toggle('accessibility-visual-support', Boolean(options.visualSupport));

    shell.querySelectorAll('.accessibility-applied-summary, .accessibility-student-support, .accessibility-checklist')
      .forEach(element => element.remove());

    const selectedLabels = [
      options.visualSupport && activity.hasFigures && 'apoio visual',
      options.steps && 'etapas',
      options.largeText && 'fonte maior',
      options.spacious && 'mais espaço',
      options.alternativeResponse && 'respostas alternativas',
      options.reducedStimuli && 'menos estímulos',
      options.checklist && 'checklist',
      options.flexibleTime && 'tempo flexível'
    ].filter(Boolean);

    const summary = document.createElement('section');
    summary.className = 'accessibility-applied-summary';
    summary.innerHTML = `
      <div>
        <strong>Versão com acessibilidade</strong>
        <span>${selectedLabels.join(' · ') || 'sem recurso adicional selecionado'}</span>
        <small>Conteúdo, numeração, gabarito e BNCC preservados.</small>
        ${options.flexibleTime ? '<small class="accessibility-teacher-time">Orientação ao professor: respeite o tempo necessário do estudante.</small>' : ''}
      </div>
      <button class="btn btn-outline" type="button">Alterar adaptações</button>`;

    const topline = shell.querySelector('.preview-topline');
    if (topline) topline.insertAdjacentElement('afterend', summary);
    else shell.prepend(summary);

    summary.querySelector('button').addEventListener('click', () => {
      const previewDialog = document.querySelector('#activity-preview');
      if (previewDialog?.open) previewDialog.close();
      openAdapter(activity);
    });

    const { studentArea, lists } = questionListsFor(shell);
    const firstList = lists[0] || null;
    const supportBox = createSupportBox(activity, options);
    if (supportBox) {
      if (firstList) firstList.insertAdjacentElement('beforebegin', supportBox);
      else studentArea.append(supportBox);
    }

    lists.forEach(list => {
      list.classList.toggle('accessibility-question-list', Boolean(options.steps));
      [...list.children].forEach(item => item.classList.toggle('accessibility-question-step', Boolean(options.steps)));
    });

    if (options.checklist) {
      const checklist = createChecklist();
      if (lists.length) lists[lists.length - 1].insertAdjacentElement('afterend', checklist);
      else studentArea.append(checklist);
    }
  }

  function enhanceCard(article, activity) {
    if (!article || article.querySelector('.accessibility-adapt-button')) return article;
    const actions = article.querySelector('.activity-card-actions');
    if (!actions) return article;

    const button = document.createElement('button');
    button.className = 'btn btn-outline accessibility-adapt-button';
    button.type = 'button';
    button.textContent = 'Adaptar atividade';
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      openAdapter(activity);
    });
    actions.insertBefore(button, actions.firstChild);
    return article;
  }

  function applyColorAndShapeModel(activity) {
    if (!activity) return;
    activity.symbol = '🔴  🔵  🟨  🔺';
    activity.hasFigures = true;
    activity.description = 'Exploração de cores e formas com apoio visual, elementos grandes e comandos objetivos.';
    activity.questions = [
      'Aponte o círculo vermelho.',
      'Aponte o círculo azul.',
      'Mostre o quadrado amarelo.',
      'Mostre o triângulo vermelho.'
    ];
    activity.answers = [
      'Círculo vermelho.',
      'Círculo azul.',
      'Quadrado amarelo.',
      'Triângulo vermelho.'
    ];
  }

  // Corrige os modelos antigos que apareciam como “cores e formas” sem qualquer forma visual.
  applyColorAndShapeModel(activities.find(activity => activity.id === 'EI01'));
  applyColorAndShapeModel(activities.find(activity => activity.id === 'AUT001'));

  if (typeof featureLabels === 'function') {
    const originalFeatureLabels = featureLabels;
    featureLabels = function accessibilityFeatureLabels(activity) {
      return originalFeatureLabels(activity)
        .map(label => label === 'Versão adaptada' ? 'Acessibilidade' : label);
    };
  }

  if (typeof renderCard === 'function') {
    const originalRenderCard = renderCard;
    renderCard = function renderCardWithAccessibility(activity) {
      return enhanceCard(originalRenderCard(activity), activity);
    };
  }

  if (typeof openPreview === 'function') {
    const originalOpenPreview = openPreview;
    openPreview = function openPreviewWithAccessibility(activity) {
      originalOpenPreview(activity);
      const options = loadOptions(activity);
      if (options) decoratePreview(activity, options);
    };
  }

  if (typeof renderAutismFeaturedActivities === 'function') {
    const originalRenderAutismFeaturedActivities = renderAutismFeaturedActivities;
    renderAutismFeaturedActivities = function renderAccessibilityFeaturedActivities() {
      originalRenderAutismFeaturedActivities();
      const title = document.querySelector('#autism-featured-title');
      const description = title?.nextElementSibling;
      if (title) title.textContent = 'Modelos adaptados prontos para usar';
      if (description) description.textContent = 'Use estes modelos ou escolha qualquer atividade curricular da Biblioteca e clique em “Adaptar atividade” para selecionar os recursos de acessibilidade necessários.';
      document.querySelectorAll('#autism-featured-grid .activity-library-card').forEach(card => {
        const activity = activities.find(item => item.id === card.dataset.activityId);
        if (activity) enhanceCard(card, activity);
      });
    };
  }

  document.querySelectorAll('.activity-library-card').forEach(card => {
    const activity = activities.find(item => item.id === card.dataset.activityId);
    if (activity) enhanceCard(card, activity);
  });

  const adaptedFilter = document.querySelector('#library-filters [name="adapted"]');
  if (adaptedFilter) {
    const label = adaptedFilter.closest('label');
    if (label) {
      label.lastChild.textContent = ' Acessibilidade e adaptação';
    }
  }

  const categoryTitle = document.querySelector('#autism-category-title');
  if (categoryTitle) categoryTitle.textContent = 'Atividades adaptadas e recursos de acessibilidade';
  const categoryCopy = categoryTitle?.nextElementSibling;
  if (categoryCopy) {
    categoryCopy.textContent = 'O conteúdo curricular permanece o mesmo. O professor escolhe apoios de apresentação, organização e resposta conforme a necessidade do estudante.';
  }

  if (typeof renderAutismFeaturedActivities === 'function' && autismCategory) {
    renderAutismFeaturedActivities();
  }
})();
