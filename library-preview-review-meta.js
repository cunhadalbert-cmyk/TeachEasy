(() => {
  const META_RE = /^Revisão\s*·\s*/i;
  const PORTUGUESE_4B_CANONICAL = 'data/atividades/fundamental-anos-iniciais/4-ano/4-bimestre/lingua-portuguesa.json?v=20260907-bncc-gabarito-v2';

  function normalize(value = '') {
    return String(value).replace(/\s+/g, ' ').trim();
  }

  function shellTopic(shell) {
    return normalize(
      shell.querySelector('.te-final-subtitle')?.textContent
      || shell.querySelector('.collection-student-page h1')?.textContent
      || document.querySelector('#preview-title')?.textContent
    );
  }

  function findActivityForShell(shell) {
    if (typeof activities === 'undefined' || !Array.isArray(activities)) return null;
    const topic = shellTopic(shell);
    if (!topic) return null;

    const candidates = activities.filter(activity =>
      activity?.collectionActivity && normalize(activity.topic) === topic
    );
    if (!candidates.length) return null;

    return candidates.find(activity =>
      Array.isArray(activity?.bnccDetails)
      && activity.bnccDetails.some(item => normalize(item?.codigo))
    ) || candidates.find(activity => activity?.gabaritoCabecalho?.exibirBncc === true) || candidates[0];
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

  function renderBnccBox(answer, details, fallbackCodes = '') {
    if (!answer || answer.querySelector('.te-final-bncc-meta')) return false;

    const validDetails = Array.isArray(details)
      ? details.filter(item => normalize(item?.codigo))
      : [];
    const codes = normalize(fallbackCodes);
    if (!validDetails.length && !codes) return false;

    const box = document.createElement('div');
    box.className = 'te-final-bncc-meta';

    const title = document.createElement('strong');
    title.className = 'te-final-bncc-title';
    title.textContent = 'BNCC';
    box.appendChild(title);

    if (validDetails.length) {
      validDetails.forEach(item => {
        const line = document.createElement('div');
        line.className = 'te-final-bncc-line';

        const code = document.createElement('strong');
        code.textContent = normalize(item.codigo);
        line.appendChild(code);

        const skill = normalize(item.habilidadeOficial || '');
        if (skill) line.appendChild(document.createTextNode(` — ${skill}`));
        box.appendChild(line);
      });
    } else {
      const line = document.createElement('div');
      line.className = 'te-final-bncc-line';
      line.textContent = codes;
      box.appendChild(line);
    }

    const subtitle = answer.querySelector('h3');
    if (subtitle) subtitle.insertAdjacentElement('afterend', box);
    else answer.prepend(box);
    return true;
  }

  function ensureAnswerBncc(shell, activity) {
    const answer = shell.querySelector('.te-final-answer');
    if (!answer || answer.querySelector('.te-final-bncc-meta')) return;

    const details = Array.isArray(activity?.bnccDetails)
      ? activity.bnccDetails
      : [];
    const fallbackCodes = normalize(activity?.bncc || '');
    renderBnccBox(answer, details, fallbackCodes);
  }

  async function ensureCanonicalAnswerBncc(shell) {
    const answer = shell.querySelector('.te-final-answer');
    if (!answer || answer.querySelector('.te-final-bncc-meta')) return;
    if (shell.dataset.teBnccCanonicalLoading === '1') return;

    const topic = shellTopic(shell);
    if (!topic) return;

    shell.dataset.teBnccCanonicalLoading = '1';
    try {
      const response = await fetch(PORTUGUESE_4B_CANONICAL, { cache: 'no-store' });
      if (!response.ok) return;
      const collection = await response.json();
      const canonical = (collection?.atividades || []).find(activity =>
        normalize(activity?.titulo) === topic || normalize(activity?.tema) === topic
      );
      if (!canonical) return;

      const details = Array.isArray(canonical.bncc)
        ? canonical.bncc.map(item => ({
            codigo: item?.codigo || '',
            habilidadeOficial: item?.habilidadeOficial || ''
          }))
        : [];
      const fallbackCodes = details.map(item => normalize(item.codigo)).filter(Boolean).join(', ');
      renderBnccBox(answer, details, fallbackCodes);
    } catch (error) {
      console.warn('TeachEasy: não foi possível carregar a BNCC canônica do gabarito.', error);
    } finally {
      shell.dataset.teBnccCanonicalLoading = '0';
    }
  }

  function processShell(shell) {
    if (!shell) return;

    syncFinalVisual(shell);
    const activity = findActivityForShell(shell);
    if (activity?.collectionActivity) ensureAnswerBncc(shell, activity);
    if (!shell.querySelector('.te-final-bncc-meta')) ensureCanonicalAnswerBncc(shell);

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
    const bncc = answer.querySelector('.te-final-bncc-meta');
    const subtitle = answer.querySelector('h3');
    if (bncc) bncc.insertAdjacentElement('afterend', meta);
    else if (subtitle) subtitle.insertAdjacentElement('afterend', meta);
    else answer.prepend(meta);
  }

  function process() {
    document.querySelectorAll('#preview-content .collection-preview-shell').forEach(processShell);
  }

  const style = document.createElement('style');
  style.textContent = `
    .te-final-bncc-meta,
    .te-final-review-meta{
      margin:0 0 5mm;
      padding:2.5mm 3mm;
      border:1px solid #000;
      font:10pt/1.3 Arial,sans-serif;
      color:#141414;
      background:#fff;
    }
    .te-final-bncc-title{
      display:block;
      margin-bottom:1.5mm;
      font-weight:700;
      text-align:center;
    }
    .te-final-bncc-line + .te-final-bncc-line{margin-top:1.5mm}
    .te-final-review-meta{
      font-weight:700;
      text-align:center;
    }
    @media print{
      .te-final-bncc-meta,
      .te-final-review-meta{display:block!important}
    }
  `;
  document.head.appendChild(style);

  const root = document.querySelector('#preview-content');
  if (root) new MutationObserver(process).observe(root, { childList: true, subtree: true });
  process();
})();
