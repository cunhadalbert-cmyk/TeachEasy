(() => {
  const META_RE = /^Revisão\s*·\s*/i;

  function normalize(value = '') {
    return String(value).replace(/\s+/g, ' ').trim();
  }

  function processShell(shell) {
    if (!shell) return;

    let metaText = shell.dataset.teReviewMeta || '';

    [...shell.children].forEach(node => {
      if (node.classList?.contains('te-final-page') || node.classList?.contains('te-final-tools')) return;
      const text = normalize(node.textContent);
      if (META_RE.test(text)) {
        metaText = text;
        node.classList.add('te-final-hidden');
        node.setAttribute('aria-hidden', 'true');
      }
    });

    if (!metaText) {
      [...document.querySelectorAll('#preview-content > *')].forEach(node => {
        if (node === shell) return;
        const text = normalize(node.textContent);
        if (META_RE.test(text)) {
          metaText = text;
          node.style.display = 'none';
          node.setAttribute('aria-hidden', 'true');
        }
      });
    }

    if (!metaText) return;
    shell.dataset.teReviewMeta = metaText;
    if (shell._teFinalData) shell._teFinalData.reviewMeta = metaText;

    const answer = shell.querySelector('.te-final-answer');
    if (!answer || answer.querySelector('.te-final-review-meta')) return;

    const meta = document.createElement('div');
    meta.className = 'te-final-review-meta';
    meta.textContent = metaText;
    const subtitle = answer.querySelector('h3');
    if (subtitle) subtitle.insertAdjacentElement('afterend', meta);
    else answer.prepend(meta);
  }

  function process() {
    document.querySelectorAll('#preview-content .collection-preview-shell').forEach(processShell);
  }

  const style = document.createElement('style');
  style.textContent = `
    .te-final-review-meta{
      margin:0 0 5mm;
      padding:2.5mm 3mm;
      border:1px solid #000;
      font:700 10pt/1.25 Arial,sans-serif;
      text-align:center;
      color:#141414;
      background:#fff;
    }
    @media print{.te-final-review-meta{display:block!important}}
  `;
  document.head.appendChild(style);

  const root = document.querySelector('#preview-content');
  if (root) new MutationObserver(process).observe(root, { childList: true, subtree: true });
  process();
})();
