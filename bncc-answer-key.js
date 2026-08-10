(() => {
  const state = { photoBncc: '', aiSummary: '' };
  const originalFetch = window.fetch.bind(window);
  let normalizing = false;

  function cleanBncc(value = '') {
    return String(value).replace(/^\s*BNCC\s*:\s*/i, '').replace(/\s+/g, ' ').trim();
  }

  function teacherWantsBncc(kind) {
    const form = kind === 'photo'
      ? document.querySelector('#photo-activity-form')
      : document.querySelector('#ai-content-form');
    return Boolean(form?.elements?.bnccInAnswerKey?.checked && form?.elements?.answerKey?.checked);
  }

  function appendBnccToAnswerKey(answerKey, bncc) {
    const text = cleanBncc(bncc);
    if (!answerKey || !text) return;
    const paragraph = answerKey.querySelector('p');
    if (!paragraph || paragraph.querySelector('[data-bncc-answer-key]')) return;

    const marker = document.createElement('span');
    marker.dataset.bnccAnswerKey = 'true';
    marker.innerHTML = `<br><br><strong>BNCC:</strong> ${text.replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[character])}`;
    paragraph.appendChild(marker);
  }

  function standardizeHeader() {
    const aiHeader = document.querySelector('#ai-preview-document .generated-standard-header');
    if (aiHeader) {
      const strong = aiHeader.querySelector('strong');
      const row = aiHeader.querySelector('div');
      if (strong) strong.textContent = 'Escola: ________________________________________________________________';
      if (row) row.innerHTML = '<span>Nome: __________________________________________</span><span>Turma: __________</span><span>Data: ____/____/______</span><span>Prof.: __________________________</span>';
      aiHeader.style.border = '1.5px solid #1F5A96';
      aiHeader.style.padding = '7px 9px';
      aiHeader.style.marginBottom = '8px';
    }

    const photoHeader = document.querySelector('#school-header');
    if (photoHeader) {
      const strong = photoHeader.querySelector('strong');
      const row = photoHeader.querySelector('span');
      if (strong) strong.textContent = 'Escola: ________________________________________________________________';
      if (row) row.innerHTML = 'Nome: __________________________________ &nbsp; Turma: __________ &nbsp; Data: ____/____/______ &nbsp; Prof.: ____________________';
      photoHeader.style.border = '1.5px solid #1F5A96';
      photoHeader.style.padding = '7px 9px';
      photoHeader.style.marginBottom = '8px';
    }
  }

  function applyMasterLayout(root) {
    if (!root) return;
    const title = root.querySelector('.generated-material h2, .photo-preview-heading h3');
    if (title) {
      title.style.color = '#1F5A96';
      title.style.textAlign = 'center';
      title.style.fontWeight = '700';
      title.style.margin = '6px 0';
    }

    const figure = root.querySelector('.generated-figure, .photo-generated-figure');
    if (figure) {
      figure.style.maxWidth = '49%';
      figure.style.float = 'right';
      figure.style.margin = '4px 0 8px 12px';
      const image = figure.querySelector('img');
      if (image) {
        image.style.width = '100%';
        image.style.height = 'auto';
        image.style.maxHeight = '58mm';
        image.style.objectFit = 'contain';
      }
    }

    const questions = root.querySelector('.generated-questions, .photo-question-list');
    if (questions) {
      questions.style.clear = 'both';
      questions.style.marginTop = '8px';
    }
  }

  function ensureAiSummary(root) {
    if (!root || !state.aiSummary) return;
    let summary = root.querySelector('[data-teacheasy-summary]');
    if (!summary) {
      summary = document.createElement('p');
      summary.dataset.teacheasySummary = 'true';
      const figure = root.querySelector('.generated-figure');
      const material = root.querySelector('.generated-material');
      if (figure?.parentNode) figure.parentNode.insertBefore(summary, figure);
      else material?.appendChild(summary);
    }
    summary.textContent = state.aiSummary;
    summary.style.textAlign = 'justify';
    summary.style.lineHeight = '1.25';
    summary.style.margin = '6px 0';
  }

  function normalizeAiPreview() {
    if (normalizing) return;
    normalizing = true;
    try {
      const root = document.querySelector('#ai-preview-document');
      if (!root) return;

      const generatedBncc = root.querySelector('.generated-bncc');
      if (generatedBncc) {
        root.dataset.teacheasyBncc = cleanBncc(generatedBncc.textContent);
        generatedBncc.remove();
      }

      ensureAiSummary(root);
      standardizeHeader();
      applyMasterLayout(root);

      root.querySelectorAll('[data-bncc-answer-key]').forEach(node => node.remove());
      if (teacherWantsBncc('ai')) {
        appendBnccToAnswerKey(root.querySelector('.generated-answer-key-page'), root.dataset.teacheasyBncc);
      }
    } finally {
      normalizing = false;
    }
  }

  function normalizePhotoPreview() {
    if (normalizing) return;
    normalizing = true;
    try {
      const root = document.querySelector('#photo-preview-content');
      if (!root) return;
      standardizeHeader();
      applyMasterLayout(root);
      root.querySelectorAll('[data-bncc-answer-key]').forEach(node => node.remove());
      if (teacherWantsBncc('photo')) {
        appendBnccToAnswerKey(root.querySelector('.photo-answer-key-page'), state.photoBncc);
      }
    } finally {
      normalizing = false;
    }
  }

  function addTeacherOptions() {
    const aiForm = document.querySelector('#ai-content-form');
    const internalBncc = aiForm?.elements?.bncc;
    if (internalBncc) {
      internalBncc.checked = true;
      const internalLabel = internalBncc.closest('label');
      if (internalLabel) internalLabel.hidden = true;

      const options = aiForm.querySelector('.ai-content-options');
      if (options && !aiForm.elements.bnccInAnswerKey) {
        const label = document.createElement('label');
        label.innerHTML = '<input name="bnccInAnswerKey" type="checkbox" checked> Incluir BNCC no gabarito';
        label.title = 'A BNCC é considerada na criação, mas só aparece na página do gabarito quando esta opção estiver marcada.';
        options.appendChild(label);
      }

      const mode = aiForm.querySelector('#ai-bncc-mode')?.closest('label');
      const modeTitle = mode?.querySelector('span');
      if (modeTitle) modeTitle.textContent = 'Detalhamento da BNCC no gabarito';
    }

    const photoForm = document.querySelector('#photo-activity-form');
    const photoOptions = photoForm?.querySelector('.photo-options');
    if (photoOptions && !photoForm.elements.bnccInAnswerKey) {
      const label = document.createElement('label');
      label.innerHTML = '<input name="bnccInAnswerKey" type="checkbox" checked> Incluir BNCC no gabarito';
      label.title = 'A BNCC é considerada na criação por foto, mas não aparece na atividade do aluno.';
      photoOptions.appendChild(label);
    }
  }

  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    let requestInit = init;
    let generationPayload = null;

    if (url.includes('/api/generate-activity') && typeof init?.body === 'string') {
      try {
        generationPayload = JSON.parse(init.body);
        generationPayload.bncc = true;
        generationPayload.bnccMode = generationPayload.bnccMode || 'reference';
        requestInit = { ...init, body: JSON.stringify(generationPayload) };
      } catch {
        generationPayload = null;
      }
    }

    const response = await originalFetch(input, requestInit);

    if (generationPayload) {
      try {
        const data = await response.clone().json();
        if (generationPayload.mode === 'photo') state.photoBncc = cleanBncc(data?.activity?.bncc || '');
        if (generationPayload.mode === 'text') state.aiSummary = String(data?.activity?.summary || '').trim();
      } catch {
        if (generationPayload.mode === 'photo') state.photoBncc = '';
        if (generationPayload.mode === 'text') state.aiSummary = '';
      }
    }

    return response;
  };

  function init() {
    addTeacherOptions();
    standardizeHeader();

    const aiRoot = document.querySelector('#ai-preview-document');
    const photoRoot = document.querySelector('#photo-preview-content');
    const observer = new MutationObserver(() => {
      normalizeAiPreview();
      normalizePhotoPreview();
    });

    if (aiRoot) observer.observe(aiRoot, { childList: true, subtree: true });
    if (photoRoot) observer.observe(photoRoot, { childList: true, subtree: true });

    document.addEventListener('change', event => {
      if (!event.target.matches('[name="bnccInAnswerKey"], [name="answerKey"]')) return;
      normalizeAiPreview();
      normalizePhotoPreview();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
