(() => {
  const state = { photoBncc: '' };
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

    if (generationPayload?.mode === 'photo') {
      try {
        const data = await response.clone().json();
        state.photoBncc = cleanBncc(data?.activity?.bncc || '');
      } catch {
        state.photoBncc = '';
      }
    }

    return response;
  };

  function init() {
    addTeacherOptions();

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
