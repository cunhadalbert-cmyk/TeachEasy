(() => {
  'use strict';

  function selectedItems() {
    const items = window.teGetIllustrationBatchSelection?.();
    return Array.isArray(items) ? items : [];
  }

  function normalizeTitle(value = '') {
    if (window.TeLibraryTitleImages?.normalizeTitle) {
      return window.TeLibraryTitleImages.normalizeTitle(value);
    }
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function contextFor(item) {
    const activities = window.TeLibraryIllustrationBatchContext?.activities;
    if (!Array.isArray(activities)) return null;
    return activities.find(activity => normalizeTitle(activity?.topic) === item.normalizedTitle) || null;
  }

  async function prepareBatch() {
    const items = selectedItems();
    if (!items.length) {
      alert('Selecione uma atividade para montar automaticamente o lote de até 10.');
      return;
    }

    const request = {
      mode: 'manual-chatgpt-illustration-batch-by-title',
      quantity: items.length,
      rule: 'Gerar uma imagem quadrada separada para cada atividade. Nomear cada arquivo exatamente pelo título normalizado informado em fileName. Não usar ordem ou numeração para vincular.',
      activities: items.map((item, index) => {
        const context = contextFor(item);
        return {
          order: index + 1,
          subject: item.subject,
          topic: item.topic,
          normalizedTitle: item.normalizedTitle,
          fileName: `${item.normalizedTitle}.png`,
          context
        };
      }),
      createdAt: new Date().toISOString()
    };

    const text = JSON.stringify(request, null, 2);
    try {
      localStorage.setItem('te-pending-manual-illustration-batch', text);
    } catch {}

    try {
      await navigator.clipboard.writeText(text);
      alert(`Lote com ${items.length} atividade(s) copiado. Cole no ChatGPT para gerar as imagens.`);
    } catch {
      prompt('Copie este lote e cole no ChatGPT:', text);
    }
  }

  function install() {
    const toolbar = document.querySelector('#te-illustration-batch-toolbar');
    if (!toolbar) return false;
    if (!toolbar.querySelector('[data-prepare-batch]')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.prepareBatch = 'true';
      button.textContent = 'Preparar lote de 10';
      button.addEventListener('click', prepareBatch);
      const importButton = toolbar.querySelector('[data-import]');
      if (importButton) toolbar.insertBefore(button, importButton);
      else toolbar.appendChild(button);
    }
    return true;
  }

  function loadZipFix() {
    if (window.TeLibraryZipImportFix || document.querySelector('script[data-te-zip-fix]')) return;
    const script = document.createElement('script');
    script.src = 'library-illustration-zip-import-fix.js?v=20260824-zip-fix-v1';
    script.dataset.teZipFix = 'true';
    document.head.appendChild(script);
  }

  install();
  loadZipFix();

  const observer = new MutationObserver(() => {
    install();
    loadZipFix();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
