(() => {
  'use strict';

  const TARGET = 'conhecendo a estrutura da notícia';
  const STATIC_IMAGE = 'assets/atividades/lingua-portuguesa/lp-noticia-irrigacao-01.jpg';

  const normalize = (value = '') => String(value).replace(/\s+/g, ' ').trim().toLowerCase();

  function apply(root = document) {
    const pages = root.querySelectorAll?.('.te-final-student') || [];
    pages.forEach((page) => {
      const title = normalize(page.querySelector('.te-final-subtitle')?.textContent);
      if (title !== TARGET) return;

      const image = page.querySelector('.te-final-visual img');
      if (!image || image.dataset.teNoticiaIrrigacao === 'true') return;

      image.src = STATIC_IMAGE;
      image.alt = 'Alunos do 4º ano cuidando da horta da escola com um sistema de irrigação feito com garrafas reaproveitadas.';
      image.dataset.teNoticiaIrrigacao = 'true';
    });
  }

  function process() {
    apply(document);
  }

  const preview = document.querySelector('#preview-content');
  if (preview) {
    new MutationObserver(process).observe(preview, { childList: true, subtree: true });
  }

  document.addEventListener('click', () => requestAnimationFrame(process), true);
  process();
})();
