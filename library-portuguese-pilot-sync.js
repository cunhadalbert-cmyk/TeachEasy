(() => {
  const TARGET = 'Leitura e compreensão: leitura de contos';

  function syncPilotImage() {
    document.querySelectorAll('#preview-content .collection-preview-shell').forEach(shell => {
      const title = shell.querySelector('.te-final-subtitle')?.textContent?.trim()
        || shell.querySelector('.collection-student-page h1')?.textContent?.trim()
        || '';
      if (title !== TARGET) return;

      const pilot = shell.querySelector('img.te-pt-pilot-image');
      const finalImage = shell.querySelector('.te-final-visual img');
      if (!pilot?.src || !finalImage) return;

      if (finalImage.src !== pilot.src) {
        finalImage.src = pilot.src;
        finalImage.alt = 'Crianças lendo juntas em um ambiente escolar, ilustração pedagógica colorida.';
      }
    });
  }

  const root = document.querySelector('#preview-content');
  if (root) {
    new MutationObserver(syncPilotImage).observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src']
    });
  }

  syncPilotImage();
})();
