(() => {
  const printArea = document.querySelector('#print-area');
  const livePreview = document.querySelector('#live-preview');
  const radios = [...document.querySelectorAll('input[name="material-layout"]')];
  const note = document.querySelector('#layout-current-note');
  if (!printArea || !radios.length) return;

  const STORAGE_KEY = 'teacheasy.materialBuilder.layout';
  const allowed = new Set(['classic', 'interactive', 'visual']);
  const labels = {
    classic: 'Clássico',
    interactive: 'Interativo',
    visual: 'Visual'
  };

  let current = 'classic';

  function savedLayout() {
    const value = localStorage.getItem(STORAGE_KEY) || 'classic';
    return allowed.has(value) ? value : 'classic';
  }

  function applyLayout(layout = current) {
    current = allowed.has(layout) ? layout : 'classic';
    printArea.dataset.layout = current;
    document.body.dataset.materialLayout = current;
    if (livePreview) livePreview.dataset.layout = current;

    printArea.querySelectorAll('.a4-page').forEach(page => {
      if (page.dataset.layout !== current) page.dataset.layout = current;
    });

    radios.forEach(radio => {
      radio.checked = radio.value === current;
    });

    if (note) note.textContent = `Selecionado: ${labels[current]}`;
  }

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (!radio.checked || !allowed.has(radio.value)) return;
      localStorage.setItem(STORAGE_KEY, radio.value);
      applyLayout(radio.value);
    });
  });

  const observer = new MutationObserver(() => applyLayout(current));
  observer.observe(printArea, { childList: true });

  current = savedLayout();
  applyLayout(current);

  globalThis.TeachEasyMaterialLayout = {
    current: () => current,
    apply: applyLayout
  };
})();
