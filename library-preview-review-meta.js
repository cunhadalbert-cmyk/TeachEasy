(() => {
  const META_RE = /^Revisão\s*·\s*/i;

  function normalize(value = '') {
    return String(value).replace(/\s+/g, ' ').trim();
  }

  function findActivityForShell(shell) {
    if (typeof activities === 'undefined' || !Array.isArray(activities)) return null;
    const topic = normalize(
      shell.querySelector('.te-final-subtitle')?.textContent
      || shell.querySelector('.collection-student-page h1')?.textContent
      || document.querySelector('#preview-title')?.textContent
    );
    if (!topic) return null;
    return activities.find(activity => activity?.collectionActivity && normalize(activity.topic) === topic) || null;
  }

  function syncFinalVisual(shell) {
    const target = shell.querySelector('.te-final-visual');
    if (!target || target.querySelector('img')) return;

    const original = shell.querySelector('.collection-student-page img.activity-figure, .collection-student-page img.question-figure');
    let src = original?.getAttribute('data-original-src') || original?.getAttribute('src') || '';
    let alt = original?.getAttribute('alt') || '';

    if (!src) {
      const activity = findActivityForShell(shell);
      const referencedIds = new Set((activity?.questions || []).map(question => question.figuraId).filter(Boolean));
      const figure = (activity?.figures || []).find(item => item?.arquivo
        && (item.posicaoSugerida === 'antes-das-questoes' || referencedIds.has(item.id)));
      src = figure?.arquivo || '';
      alt = figure?.textoAlternativo || alt;
    }

    if (!src) return;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || 'Ilustração pedagógica da atividade';
    img.decoding = 'async';
    target.replaceChildren(img);

    if (shell._teFinalData) shell._teFinalData.visual = img.src;
  }

  function processShell(shell) {
    if (!shell) return;

    syncFinalVisual(shell);

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
