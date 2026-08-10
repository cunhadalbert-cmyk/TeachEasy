(() => {
  'use strict';

  const clean = (value = '') => String(value).replace(/\s+/g, ' ').trim();
  const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[c]));

  function isSvg(image) {
    const src = clean(image?.getAttribute('src') || image?.src || '');
    return /^data:image\/svg\+xml/i.test(src);
  }

  function removeVectorFallbacks(root = document) {
    root.querySelectorAll('#ai-preview-document img, #photo-preview-content img').forEach(image => {
      if (!isSvg(image)) return;
      const figure = image.closest('.generated-figure, .photo-generated-figure');
      image.remove();
      if (figure && !figure.querySelector('.te-illustration-unavailable')) {
        const notice = document.createElement('span');
        notice.className = 'te-illustration-unavailable';
        notice.textContent = 'Ilustração aguardando geração em alta qualidade.';
        figure.appendChild(notice);
      }
    });
  }

  function moveBnccToAnswerKey(root = document) {
    const ai = root.querySelector('#ai-preview-document');
    if (!ai) return;
    const studentBncc = ai.querySelector('.generated-bncc');
    if (!studentBncc) return;
    const bnccText = clean(studentBncc.textContent).replace(/^BNCC:\s*/i, '');
    const answerKey = ai.querySelector('.generated-answer-key-page');
    studentBncc.remove();
    if (!answerKey || !bnccText || answerKey.querySelector('[data-reference-bncc]')) return;
    const block = document.createElement('div');
    block.dataset.referenceBncc = 'true';
    block.className = 'generated-bncc';
    block.innerHTML = `<strong>BNCC:</strong> ${esc(bnccText)}`;
    answerKey.appendChild(block);
  }

  function apply() {
    removeVectorFallbacks(document);
    moveBnccToAnswerKey(document);
  }

  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
})();
