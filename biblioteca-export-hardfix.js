(() => {
  function cleanLegacyControls(root = document) {
    root.querySelectorAll('.collection-export-actions').forEach(group => {
      group.querySelectorAll('.preview-word, .preview-print').forEach(button => button.remove());
      if (!group.querySelector('button')) group.remove();
    });
  }

  function exposeOnlyMasterControls() {
    const root = document.querySelector('#preview-content');
    if (!root) return;
    cleanLegacyControls(root);

    const tools = root.querySelector('.te-library-standard-tools');
    if (tools) {
      tools.hidden = false;
      const word = tools.querySelector('.te-library-word');
      const pdf = tools.querySelector('.te-library-pdf');
      if (word) {
        word.textContent = 'Baixar Word editável (.docx)';
        word.dataset.teacheasyOfficialExport = 'word';
      }
      if (pdf) {
        pdf.textContent = 'Baixar PDF / Imprimir';
        pdf.dataset.teacheasyOfficialExport = 'pdf';
      }
    }
  }

  // O exportador antigo do biblioteca.js não deve mais ser chamado por nenhum fluxo.
  // A UI oficial fica restrita aos controles do biblioteca-standard.js.
  if (typeof window.downloadCollectionWord === 'function') {
    window.downloadCollectionWord = () => {
      const official = document.querySelector('.te-library-word');
      if (official) official.click();
      else throw new Error('Exportador Word oficial do TeachEasy não foi carregado.');
    };
  }

  document.addEventListener('click', event => {
    const legacy = event.target.closest('.preview-word, .preview-print');
    if (!legacy) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    exposeOnlyMasterControls();
    const selector = legacy.classList.contains('preview-word') ? '.te-library-word' : '.te-library-pdf';
    const official = document.querySelector(selector);
    if (official) official.click();
  }, true);

  const root = document.querySelector('#preview-content');
  if (root) {
    new MutationObserver(exposeOnlyMasterControls).observe(root, { childList: true, subtree: true });
  }

  exposeOnlyMasterControls();
})();
