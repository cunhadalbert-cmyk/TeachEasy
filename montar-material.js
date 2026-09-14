(() => {
  const catalog = globalThis.TeachEasyLibraryCatalog;
  const sourceForm = document.querySelector('#source-form');
  const subjectSelect = sourceForm.elements.subject;
  const status = document.querySelector('#source-status');
  const searchInput = document.querySelector('#activity-search');
  const activityList = document.querySelector('#activity-list');
  const openedActivity = document.querySelector('#opened-activity');
  const openedTitle = document.querySelector('#opened-activity-title');
  const materialSummary = document.querySelector('#material-summary');
  const materialCount = document.querySelector('#material-count');
  const openPreviewButton = document.querySelector('#open-preview');
  const clearMaterialButton = document.querySelector('#clear-material');
  const preview = document.querySelector('#preview-dialog');
  const previewClose = document.querySelector('#preview-close');
  const printArea = document.querySelector('#print-area');
  const toast = document.querySelector('#builder-toast');

  const headerSchool = document.querySelector('#header-school');
  const headerTeacher = document.querySelector('#header-teacher');
  const headerClass = document.querySelector('#header-class');
  const headerDate = document.querySelector('#header-date');
  const customTitle = document.querySelector('#material-custom-title');

  let currentCollection = null;
  let currentActivities = [];
  let currentActivity = null;
  let toastTimer = null;

  const material = new Map();

  const subjects = Object.keys(catalog?.subjects || {});
  subjectSelect.append(...subjects.map(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    return option;
  }));

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const nl2br = value => escapeHtml(value).replace(/\n/g, '<br>');

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
  }

  function collectionPath() {
    const year = Number(sourceForm.elements.year.value);
    const term = Number(sourceForm.elements.term.value);
    const subject = sourceForm.elements.subject.value;
    return catalog?.entry(year, term, subject) || null;
  }

  function figureForActivity(activity) {
    const figures = Array.isArray(activity.figuras) ? activity.figuras : [];
    return figures.find(figure =>
      figure?.arquivo && figure.posicaoSugerida === 'antes-das-questoes'
    ) || figures.find(figure => figure?.arquivo) || null;
  }

  function figureForQuestion(activity, question) {
    if (!question?.figuraId || !Array.isArray(activity.figuras)) return null;
    return activity.figuras.find(figure => figure.id === question.figuraId && figure.arquivo) || null;
  }

  function defaultLines(question) {
    if (Array.isArray(question?.alternativas) && question.alternativas.length) return 0;
    return { pequeno: 1, medio: 2, grande: 4 }[question?.espacoResposta] ?? 2;
  }

  function answerForQuestion(activity, question, index) {
    const answers = Array.isArray(activity.gabarito) ? activity.gabarito : [];
    return answers.find(answer => Number(answer.numero) === Number(question.numero))
      || answers[index]
      || null;
  }

  function normalizeCollection(data, config) {
    if (!data || !Array.isArray(data.atividades)) {
      throw new Error('A coleção selecionada não contém uma lista válida de atividades.');
    }

    return data.atividades
      .filter(activity => Array.isArray(activity.questoes) && activity.questoes.length)
      .map(activity => ({
        ...activity,
        _source: {
          year: config.year,
          term: config.term,
          subject: config.subject,
          path: config.path
        }
      }));
  }

  async function loadCollection() {
    const config = collectionPath();
    if (!config) throw new Error('Escolha ano, bimestre e disciplina.');

    status.textContent = 'Carregando atividades da Biblioteca...';
    const response = await fetch(config.path, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Não foi possível abrir essa coleção da Biblioteca.');
    }
    const data = await response.json();
    currentCollection = data;
    currentActivities = normalizeCollection(data, config);
    currentActivity = currentActivities[0] || null;
    searchInput.disabled = false;
    searchInput.value = '';
    renderActivityList();
    renderOpenedActivity();
    status.textContent = `${currentActivities.length} atividades carregadas de ${data.disciplina || config.subject}.`;
  }

  function renderActivityList() {
    const query = searchInput.value.trim().toLocaleLowerCase('pt-BR');
    const filtered = currentActivities.filter(activity => {
      const text = `${activity.titulo || ''} ${activity.tema || ''} ${activity.objetivo || ''}`
        .toLocaleLowerCase('pt-BR');
      return !query || text.includes(query);
    });

    if (!filtered.length) {
      activityList.innerHTML = '<div class="empty-panel">Nenhuma atividade encontrada com esse título.</div>';
      return;
    }

    activityList.replaceChildren(...filtered.map(activity => {
      const button = document.createElement('button');
      button.className = `activity-list-item${currentActivity?.id === activity.id ? ' active' : ''}`;
      button.type = 'button';
      button.innerHTML = `
        <strong>${escapeHtml(activity.titulo || activity.tema || activity.id)}</strong>
        <span>${escapeHtml(activity.sequencia || '')}${activity.tipoSequencia ? ` · ${escapeHtml(activity.tipoSequencia)}` : ''}</span>
      `;
      button.addEventListener('click', () => {
        currentActivity = activity;
        renderActivityList();
        renderOpenedActivity();
      });
      return button;
    }));
  }

  function renderOpenedActivity() {
    if (!currentActivity) {
      openedTitle.textContent = 'Abra uma atividade';
      openedActivity.innerHTML = '<div class="empty-panel">Nenhuma atividade disponível nesta coleção.</div>';
      return;
    }

    const activity = currentActivity;
    const text = activity.textoApoio?.conteudo || '';
    const textTitle = activity.textoApoio?.titulo || '';
    const mainFigure = figureForActivity(activity);
    const selectedMap = material.get(activity.id)?.selected || new Map();

    openedTitle.textContent = activity.titulo || activity.tema || 'Atividade';
    openedActivity.innerHTML = `
      <div class="source-meta">
        <span>${escapeHtml(activity._source.year)}º ano</span>
        <span>${escapeHtml(activity._source.term)}º bimestre</span>
        <span>${escapeHtml(activity._source.subject)}</span>
        <span>${escapeHtml(activity.questoes.length)} questões</span>
      </div>
      <h3>${escapeHtml(activity.titulo || activity.tema || activity.id)}</h3>
      ${activity.objetivo ? `<p class="activity-objective">${escapeHtml(activity.objetivo)}</p>` : ''}
      ${(text || mainFigure) ? `
        <div class="context-card">
          ${text ? `<div>
            ${textTitle ? `<h4>${escapeHtml(textTitle)}</h4>` : ''}
            <p>${nl2br(text)}</p>
          </div>` : ''}
          ${mainFigure ? `<img class="context-image" src="${escapeHtml(mainFigure.arquivo)}" alt="${escapeHtml(mainFigure.textoAlternativo || mainFigure.descricao || 'Ilustração da atividade')}">` : ''}
        </div>
        <div class="context-rule"><strong>Regra do montador:</strong> se você usar qualquer questão desta atividade, este contexto original será mantido no material final.</div>
      ` : ''}
      <div class="question-picker">
        ${activity.questoes.map((question, index) => {
          const checked = selectedMap.has(index);
          const lines = selectedMap.get(index)?.lines ?? defaultLines(question);
          return `
            <label class="question-option">
              <input type="checkbox" data-question-index="${index}" ${checked ? 'checked' : ''}>
              <span class="question-copy">
                <strong>${escapeHtml(question.numero ?? index + 1)}. ${escapeHtml(question.enunciado || String(question))}</strong>
                ${Array.isArray(question.alternativas) && question.alternativas.length
                  ? `<small>${question.alternativas.map((alt, altIndex) => `${String.fromCharCode(97 + altIndex)}) ${escapeHtml(alt)}`).join(' · ')}</small>`
                  : ''}
              </span>
              <span class="line-control">
                <select data-lines-for="${index}" aria-label="Número de linhas para resposta" ${Array.isArray(question.alternativas) && question.alternativas.length ? 'disabled' : ''}>
                  ${[0,1,2,3,4,5,6].map(value => `<option value="${value}" ${Number(lines) === value ? 'selected' : ''}>${value === 0 ? 'sem linhas' : `${value} linha${value === 1 ? '' : 's'}`}</option>`).join('')}
                </select>
              </span>
            </label>
          `;
        }).join('')}
      </div>
    `;

    openedActivity.querySelectorAll('input[data-question-index]').forEach(input => {
      input.addEventListener('change', () => {
        const index = Number(input.dataset.questionIndex);
        const lineSelect = openedActivity.querySelector(`select[data-lines-for="${index}"]`);
        if (input.checked) {
          if (!material.has(activity.id)) {
            material.set(activity.id, { activity, selected: new Map() });
          }
          material.get(activity.id).selected.set(index, { lines: Number(lineSelect?.value ?? defaultLines(activity.questoes[index])) });
        } else if (material.has(activity.id)) {
          material.get(activity.id).selected.delete(index);
          if (!material.get(activity.id).selected.size) material.delete(activity.id);
        }
        renderMaterial();
        renderPreview();
      });
    });

    openedActivity.querySelectorAll('select[data-lines-for]').forEach(select => {
      select.addEventListener('change', () => {
        const index = Number(select.dataset.linesFor);
        if (material.has(activity.id) && material.get(activity.id).selected.has(index)) {
          material.get(activity.id).selected.set(index, { lines: Number(select.value) });
          renderMaterial();
          renderPreview();
        }
      });
    });
  }

  function totalQuestions() {
    return [...material.values()].reduce((total, group) => total + group.selected.size, 0);
  }

  function renderMaterial() {
    const count = totalQuestions();
    materialCount.textContent = `${count} ${count === 1 ? 'questão' : 'questões'}`;
    openPreviewButton.disabled = count === 0;

    if (!count) {
      materialSummary.innerHTML = '<div class="empty-panel">As questões escolhidas aparecerão aqui, agrupadas pela atividade de origem.</div>';
      return;
    }

    materialSummary.innerHTML = [...material.values()].map(group => `
      <section class="material-source-group">
        <header>
          <div>
            <strong>${escapeHtml(group.activity.titulo || group.activity.tema || group.activity.id)}</strong><br>
            <span>${escapeHtml(group.activity._source.subject)} · ${group.selected.size} ${group.selected.size === 1 ? 'questão' : 'questões'}</span>
          </div>
        </header>
        ${[...group.selected.entries()].map(([index]) => {
          const question = group.activity.questoes[index];
          return `
            <div class="selected-question">
              <span>${escapeHtml(question.numero ?? index + 1)}. ${escapeHtml(question.enunciado || String(question))}</span>
              <button class="remove-question" type="button" data-source-id="${escapeHtml(group.activity.id)}" data-question-index="${index}" aria-label="Remover questão">×</button>
            </div>
          `;
        }).join('')}
      </section>
    `).join('');

    materialSummary.querySelectorAll('.remove-question').forEach(button => {
      button.addEventListener('click', () => {
        const sourceId = button.dataset.sourceId;
        const index = Number(button.dataset.questionIndex);
        if (material.has(sourceId)) {
          material.get(sourceId).selected.delete(index);
          if (!material.get(sourceId).selected.size) material.delete(sourceId);
        }
        renderMaterial();
        renderOpenedActivity();
        renderPreview();
      });
    });
  }

  function materialSubjectTitle() {
    const subjectsInMaterial = [...new Set([...material.values()].map(group => group.activity._source.subject))];
    return subjectsInMaterial.length === 1
      ? `ATIVIDADE DE ${subjectsInMaterial[0].toLocaleUpperCase('pt-BR')}`
      : 'ATIVIDADE';
  }

  function effectiveTitle() {
    return customTitle.value.trim() || materialSubjectTitle();
  }

  function headerMarkup() {
    const school = headerSchool.value.trim();
    const teacher = headerTeacher.value.trim();
    const className = headerClass.value.trim();
    const date = headerDate.value.trim();
    return `
      <header class="worksheet-school-header">
        <div><strong>Escola:</strong> <span class="header-value">${escapeHtml(school)}</span></div>
        <div><strong>Nome:</strong> <span class="header-value"></span></div>
        <div class="header-row">
          <div><strong>Turma:</strong> <span class="header-value">${escapeHtml(className)}</span></div>
          <div><strong>Data:</strong> <span class="header-value">${escapeHtml(date)}</span></div>
          <div><strong>Prof.:</strong> <span class="header-value">${escapeHtml(teacher)}</span></div>
        </div>
      </header>
    `;
  }

  function answerLinesMarkup(lines) {
    const count = Math.max(0, Math.min(6, Number(lines) || 0));
    if (!count) return '';
    return `<div class="answer-lines" aria-label="${count} linhas para resposta">${Array.from({ length: count }, () => '<span></span>').join('')}</div>`;
  }

  function questionMarkup(activity, question, index, finalNumber, lines) {
    const figure = figureForQuestion(activity, question);
    return `
      <li value="${finalNumber}">
        <p>${escapeHtml(question.enunciado || String(question))}</p>
        ${figure ? `<img class="question-image" src="${escapeHtml(figure.arquivo)}" alt="${escapeHtml(figure.textoAlternativo || figure.descricao || 'Ilustração da questão')}">` : ''}
        ${Array.isArray(question.alternativas) && question.alternativas.length
          ? `<ol class="final-alternatives" type="a">${question.alternativas.map(alt => `<li>${escapeHtml(alt)}</li>`).join('')}</ol>`
          : answerLinesMarkup(lines)}
      </li>
    `;
  }

  function sourceBlockMarkup(group, counterRef) {
    const activity = group.activity;
    const supportText = activity.textoApoio?.conteudo || '';
    const supportTitle = activity.textoApoio?.titulo || '';
    const figure = figureForActivity(activity);
    const noImageClass = figure ? '' : ' no-image';

    const questions = [...group.selected.entries()].map(([index, options]) => {
      counterRef.value += 1;
      return questionMarkup(activity, activity.questoes[index], index, counterRef.value, options.lines);
    }).join('');

    return `
      <section class="source-block">
        <h3>${escapeHtml(activity.titulo || activity.tema || activity.id)}</h3>
        ${(supportText || figure) ? `
          <div class="source-support${noImageClass}">
            <div class="source-support-text">
              ${supportTitle ? `<h4>${escapeHtml(supportTitle)}</h4>` : ''}
              ${supportText ? `<p>${nl2br(supportText)}</p>` : ''}
            </div>
            ${figure ? `<img src="${escapeHtml(figure.arquivo)}" alt="${escapeHtml(figure.textoAlternativo || figure.descricao || 'Ilustração da atividade')}">` : ''}
          </div>
        ` : ''}
        <ol class="final-questions">${questions}</ol>
      </section>
    `;
  }

  function answerKeyMarkup() {
    let finalNumber = 0;
    const groups = [...material.values()].map(group => {
      const items = [...group.selected.keys()].map(index => {
        finalNumber += 1;
        const question = group.activity.questoes[index];
        const answer = answerForQuestion(group.activity, question, index);
        return `
          <li value="${finalNumber}">
            <strong>${escapeHtml(answer?.resposta || 'Gabarito não cadastrado para esta questão.')}</strong>
            ${answer?.justificativa ? `<div>${escapeHtml(answer.justificativa)}</div>` : ''}
          </li>
        `;
      }).join('');
      return `
        <section class="answer-key-group">
          <h3>${escapeHtml(group.activity.titulo || group.activity.tema || group.activity.id)}</h3>
          <ol class="answer-key-list">${items}</ol>
        </section>
      `;
    }).join('');

    const bncc = new Map();
    [...material.values()].forEach(group => {
      (Array.isArray(group.activity.bncc) ? group.activity.bncc : []).forEach(item => {
        if (item?.codigo && !bncc.has(item.codigo)) bncc.set(item.codigo, item);
      });
    });

    const bnccMarkup = bncc.size ? `
      <section class="bncc-box">
        <h3>BNCC</h3>
        ${[...bncc.values()].map(item => `
          <p><strong>${escapeHtml(item.codigo)}</strong>${item.habilidadeOficial ? ` — ${escapeHtml(item.habilidadeOficial)}` : ''}</p>
        `).join('')}
      </section>
    ` : '';

    return `
      <section class="a4-page answer-key-page">
        <h2>GABARITO</h2>
        ${groups}
        ${bnccMarkup}
      </section>
    `;
  }

  function renderPreview() {
    if (!material.size) {
      printArea.innerHTML = '';
      return;
    }

    const counter = { value: 0 };
    const sourceBlocks = [...material.values()].map(group => sourceBlockMarkup(group, counter)).join('');
    printArea.innerHTML = `
      <section class="a4-page student-page">
        ${headerMarkup()}
        <h1 class="worksheet-title">${escapeHtml(effectiveTitle())}</h1>
        ${material.size === 1 && [...material.values()][0].activity.tipoSequencia
          ? `<p class="worksheet-subtitle">${escapeHtml([...material.values()][0].activity.tipoSequencia)}</p>`
          : ''}
        ${sourceBlocks}
      </section>
      ${answerKeyMarkup()}
    `;
  }

  function saveHeaderProfile() {
    const profile = {
      school: headerSchool.value,
      teacher: headerTeacher.value,
      className: headerClass.value,
      date: headerDate.value
    };
    localStorage.setItem('teacheasy.materialBuilder.header', JSON.stringify(profile));
  }

  function restoreHeaderProfile() {
    try {
      const profile = JSON.parse(localStorage.getItem('teacheasy.materialBuilder.header') || '{}');
      headerSchool.value = profile.school || '';
      headerTeacher.value = profile.teacher || '';
      headerClass.value = profile.className || '';
      headerDate.value = profile.date || '';
    } catch {
      localStorage.removeItem('teacheasy.materialBuilder.header');
    }
  }

  async function dataUrl(source) {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Não foi possível incorporar a imagem ${source}.`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function downloadWord() {
    if (!material.size) return;
    renderPreview();

    const clone = printArea.cloneNode(true);
    const images = [...clone.querySelectorAll('img')];
    await Promise.all(images.map(async image => {
      image.src = await dataUrl(image.getAttribute('src'));
    }));

    const documentHtml = `<!doctype html>
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(effectiveTitle())}</title>
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          body { font-family: Arial, sans-serif; font-size: 10pt; color: #111; }
          .a4-page { min-height: 277mm; page-break-after: always; }
          .a4-page:last-child { page-break-after: auto; }
          .worksheet-school-header { border: 1px solid #333; padding: 4mm 5mm; margin-bottom: 4mm; }
          .worksheet-school-header > div { margin-bottom: 2mm; }
          .header-row > div { display: inline-block; width: 31%; margin-right: 1%; }
          .header-value { display: inline-block; min-width: 35mm; border-bottom: 1px solid #555; }
          .worksheet-title { text-align: center; color: #1e4e81; font-size: 14pt; margin: 0 0 2mm; }
          .worksheet-subtitle { text-align: center; font-weight: bold; margin: 0 0 4mm; }
          .source-block { border: 1px solid #777; padding: 4mm; margin-bottom: 5mm; page-break-inside: avoid; }
          .source-block h3 { text-align: center; font-size: 12pt; margin: 0 0 2mm; }
          .source-support-text p { white-space: pre-line; line-height: 1.35; }
          .source-support img, .question-image { display: block; max-width: 75mm; max-height: 50mm; margin: 2mm auto; }
          .final-questions li { margin-bottom: 4mm; page-break-inside: avoid; }
          .answer-lines span { display: block; min-height: 5mm; border-bottom: 1px solid #777; }
          .answer-key-list li { margin-bottom: 3mm; }
          .bncc-box { border-top: 1px solid #999; margin-top: 7mm; padding-top: 4mm; }
        </style>
      </head><body>${clone.innerHTML}</body></html>`;

    const blob = new Blob(['\ufeff', documentHtml], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'teacheasy-material.doc';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  sourceForm.addEventListener('submit', event => {
    event.preventDefault();
    loadCollection().catch(error => {
      status.textContent = error.message;
      currentCollection = null;
      currentActivities = [];
      currentActivity = null;
      renderActivityList();
      renderOpenedActivity();
    });
  });

  searchInput.addEventListener('input', renderActivityList);

  openPreviewButton.addEventListener('click', () => {
    renderPreview();
    preview.showModal();
  });

  previewClose.addEventListener('click', () => preview.close());
  preview.addEventListener('click', event => {
    if (event.target === preview) preview.close();
  });

  document.querySelector('#print-material').addEventListener('click', () => {
    renderPreview();
    window.print();
  });

  document.querySelector('#download-word').addEventListener('click', () => {
    downloadWord().catch(error => showToast(error.message));
  });

  clearMaterialButton.addEventListener('click', () => {
    if (!material.size) return;
    material.clear();
    renderMaterial();
    renderOpenedActivity();
    renderPreview();
    showToast('Montagem limpa.');
  });

  [headerSchool, headerTeacher, headerClass, headerDate].forEach(input => {
    input.addEventListener('input', () => {
      saveHeaderProfile();
      renderPreview();
    });
  });
  customTitle.addEventListener('input', renderPreview);

  restoreHeaderProfile();
  renderMaterial();
})();
