(() => {
  const printArea = document.querySelector('#print-area');
  const livePreview = document.querySelector('#live-preview');

  if (!printArea || !livePreview) return;

  let resizeTimer = null;
  let transformingHeader = false;

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function headerFieldValue(header, label) {
    const fields = [...header.querySelectorAll('div')];
    const field = fields.find(item => {
      const strong = [...item.children].find(child => child.tagName === 'STRONG');
      return strong?.textContent.trim() === label;
    });
    return field?.querySelector('.header-value')?.textContent || '';
  }

  function headerFieldMarkup(label, value, lineWidth) {
    return `<strong>${label}</strong> <span class="header-value" style="display:inline-block;min-width:0;width:${lineWidth};border-bottom:1px solid #555;min-height:4mm;vertical-align:bottom;">${escapeHtml(value)}</span>`;
  }

  function transformHeader(header) {
    if (header.dataset.compactHeader === 'v1') return;

    const values = {
      name: headerFieldValue(header, 'Nome:'),
      className: headerFieldValue(header, 'Turma:'),
      date: headerFieldValue(header, 'Data:'),
      school: headerFieldValue(header, 'Escola:'),
      teacher: headerFieldValue(header, 'Prof.:')
    };

    header.dataset.compactHeader = 'v1';
    header.setAttribute('aria-label', 'Cabeçalho da atividade em duas linhas');
    header.innerHTML = `
      <table class="compact-header-table" style="width:100%;border-collapse:collapse;table-layout:fixed;">
        <tbody>
          <tr>
            <td style="width:100%;padding:0 0 1.8mm;">
              <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
                <tbody><tr>
                  <td style="width:55%;padding:0 3mm 0 0;vertical-align:bottom;">${headerFieldMarkup('Nome:', values.name, '82%')}</td>
                  <td style="width:17%;padding:0 3mm 0 0;vertical-align:bottom;">${headerFieldMarkup('Turma:', values.className, '48%')}</td>
                  <td style="width:28%;padding:0;vertical-align:bottom;">${headerFieldMarkup('Data:', values.date, '67%')}</td>
                </tr></tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="width:100%;padding:0;">
              <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
                <tbody><tr>
                  <td style="width:58%;padding:0 4mm 0 0;vertical-align:bottom;">${headerFieldMarkup('Escola:', values.school, '82%')}</td>
                  <td style="width:42%;padding:0;vertical-align:bottom;">${headerFieldMarkup('Prof.:', values.teacher, '80%')}</td>
                </tr></tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }

  function applyCompactHeader() {
    if (transformingHeader) return;
    transformingHeader = true;
    printArea.querySelectorAll('.worksheet-school-header').forEach(transformHeader);
    transformingHeader = false;
  }

  function emptyMarkup() {
    return `
      <div class="live-preview-empty">
        <strong>Sua folha aparecerá aqui.</strong>
        <span>Marque uma questão para começar a montar.</span>
      </div>
    `;
  }

  function fitPage() {
    const stage = livePreview.querySelector('.live-preview-stage');
    const page = livePreview.querySelector('.live-preview-page');
    if (!stage || !page) return;

    page.style.transform = 'none';
    stage.style.width = '';
    stage.style.height = '';

    const availableWidth = Math.max(220, livePreview.clientWidth - 20);
    const pageWidth = page.offsetWidth || 794;
    const pageHeight = page.scrollHeight || page.offsetHeight || 1123;
    const scale = Math.min(1, availableWidth / pageWidth);

    page.style.transform = `scale(${scale})`;
    stage.style.width = `${Math.ceil(pageWidth * scale)}px`;
    stage.style.height = `${Math.ceil(pageHeight * scale)}px`;
  }

  function syncLivePreview() {
    applyCompactHeader();
    const studentPage = printArea.querySelector('.student-page');
    if (!studentPage) {
      livePreview.innerHTML = emptyMarkup();
      return;
    }

    const stage = document.createElement('div');
    stage.className = 'live-preview-stage';

    const clone = studentPage.cloneNode(true);
    clone.classList.add('live-preview-page');
    clone.setAttribute('aria-label', 'Prévia ao vivo do material em montagem');

    stage.append(clone);
    livePreview.replaceChildren(stage);
    requestAnimationFrame(fitPage);
  }

  const observer = new MutationObserver(syncLivePreview);
  observer.observe(printArea, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['data-layout']
  });

  const nativePrint = window.print.bind(window);
  window.print = (...args) => {
    applyCompactHeader();
    return nativePrint(...args);
  };

  const nativePrintAreaClone = printArea.cloneNode.bind(printArea);
  printArea.cloneNode = deep => {
    applyCompactHeader();
    return nativePrintAreaClone(deep);
  };

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitPage, 80);
  });

  syncLivePreview();
})();
