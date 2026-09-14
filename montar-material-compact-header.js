(() => {
  const printArea = document.querySelector('#print-area');
  if (!printArea) return;

  const FIELD_LABELS = {
    name: 'Nome:',
    className: 'Turma:',
    date: 'Data:',
    school: 'Escola:',
    teacher: 'Prof.:'
  };

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function fieldValue(header, label) {
    const candidates = [...header.querySelectorAll('div')];
    const field = candidates.find(item => item.querySelector(':scope > strong')?.textContent.trim() === label);
    return field?.querySelector('.header-value')?.textContent || '';
  }

  function fieldMarkup(label, value, lineWidth) {
    return `<strong>${label}</strong> <span class="header-value" style="display:inline-block;min-width:0;width:${lineWidth};border-bottom:1px solid #555;min-height:4mm;vertical-align:bottom;">${escapeHtml(value)}</span>`;
  }

  function transformHeader(header) {
    if (header.dataset.compactHeader === 'v1') return;

    const values = {
      name: fieldValue(header, FIELD_LABELS.name),
      className: fieldValue(header, FIELD_LABELS.className),
      date: fieldValue(header, FIELD_LABELS.date),
      school: fieldValue(header, FIELD_LABELS.school),
      teacher: fieldValue(header, FIELD_LABELS.teacher)
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
                  <td class="compact-field compact-name" style="width:55%;padding:0 3mm 0 0;vertical-align:bottom;">${fieldMarkup(FIELD_LABELS.name, values.name, '82%')}</td>
                  <td class="compact-field compact-class" style="width:17%;padding:0 3mm 0 0;vertical-align:bottom;">${fieldMarkup(FIELD_LABELS.className, values.className, '48%')}</td>
                  <td class="compact-field compact-date" style="width:28%;padding:0;vertical-align:bottom;">${fieldMarkup(FIELD_LABELS.date, values.date, '67%')}</td>
                </tr></tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="width:100%;padding:0;">
              <table style="width:100%;border-collapse:collapse;table-layout:fixed;">
                <tbody><tr>
                  <td class="compact-field compact-school" style="width:58%;padding:0 4mm 0 0;vertical-align:bottom;">${fieldMarkup(FIELD_LABELS.school, values.school, '82%')}</td>
                  <td class="compact-field compact-teacher" style="width:42%;padding:0;vertical-align:bottom;">${fieldMarkup(FIELD_LABELS.teacher, values.teacher, '80%')}</td>
                </tr></tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }

  let transforming = false;
  function applyCompactHeader() {
    if (transforming) return;
    transforming = true;
    printArea.querySelectorAll('.worksheet-school-header').forEach(transformHeader);
    transforming = false;
  }

  const observer = new MutationObserver(applyCompactHeader);
  observer.observe(printArea, {
    childList: true,
    subtree: true
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

  applyCompactHeader();
})();
