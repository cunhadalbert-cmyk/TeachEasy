(() => {
  'use strict';

  const cache = new Map();
  const pending = new WeakMap();
  const clean = (value = '') => String(value).replace(/\s+/g, ' ').trim();

  function needsGeneratedIllustration(image) {
    if (!image) return false;
    const src = clean(image.getAttribute('src') || image.src || '');
    if (src.includes('/illustrations/biblioteca/')) return false;
    return /^data:image\/svg\+xml/i.test(src) && false;
  }

  function activityData(page) {
    const title = clean(page.querySelector('.te-final-title')?.textContent || 'ATIVIDADE ESCOLAR');
    const subject = title.replace(/^ATIVIDADE DE\s+/i, '') || 'Atividade Escolar';
    const topic = clean(page.querySelector('.te-final-subtitle')?.textContent || 'conteúdo escolar');
    const context = clean(page.querySelector('.te-final-text')?.textContent || '').slice(0, 700);
    return { subject, topic, context };
  }

  function cacheKey(data) {
    return `${data.subject}|${data.topic}|${data.context}`.toLowerCase().slice(0, 900);
  }

  function setLoading(visual, loading) {
    visual.classList.toggle('te-illustration-loading', loading);
    let status = visual.querySelector('.te-illustration-status');
    if (loading && !status) {
      status = document.createElement('span');
      status.className = 'te-illustration-status';
      status.textContent = 'Gerando ilustração pedagógica...';
      visual.appendChild(status);
    }
    if (!loading && status) status.remove();
  }

  async function generateFor(page) {
    const visual = page.querySelector('.te-final-visual');
    if (!visual || pending.has(page)) return;
    let image = visual.querySelector('img');
    if (!needsGeneratedIllustration(image)) return;

    const data = activityData(page);
    const key = cacheKey(data);
    if (cache.has(key)) {
      if (!image) {
        image = document.createElement('img');
        visual.appendChild(image);
      }
      image.src = cache.get(key);
      image.alt = `Ilustração pedagógica colorida sobre ${data.topic}`;
      image.dataset.teAiIllustration = 'true';
      return;
    }

    if (image) image.style.display = 'none';
    setLoading(visual, true);

    const promise = fetch('/api/generate-library-illustration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(async response => {
        const result = await response.json();
        if (!response.ok || !result.illustrationDataUrl) throw new Error(result.error || 'Falha ao gerar ilustração.');
        return result.illustrationDataUrl;
      })
      .then(src => {
        cache.set(key, src);
        if (!image) {
          image = document.createElement('img');
          visual.appendChild(image);
        }
        image.src = src;
        image.alt = `Ilustração pedagógica colorida sobre ${data.topic}`;
        image.dataset.teAiIllustration = 'true';
        image.style.display = '';
      })
      .catch(error => {
        console.error('teacheasy-library-illustration', error);
        if (image) image.remove();
        let status = visual.querySelector('.te-illustration-status');
        if (!status) {
          status = document.createElement('span');
          status.className = 'te-illustration-status';
          visual.appendChild(status);
        }
        status.textContent = 'Ilustração temporariamente indisponível.';
      })
      .finally(() => {
        pending.delete(page);
        visual.classList.remove('te-illustration-loading');
        const status = visual.querySelector('.te-illustration-status');
        if (status?.textContent === 'Gerando ilustração pedagógica...') status.remove();
      });

    pending.set(page, promise);
  }

  function apply() {
    document.querySelectorAll('.te-final-student').forEach(page => generateFor(page));
  }

  const style = document.createElement('style');
  style.textContent = `
    .te-final-visual.te-illustration-loading{background:#f5faf6;position:relative}
    .te-illustration-status{font:700 10pt Arial,sans-serif;color:#4D8B63;text-align:center;padding:12px}
    .te-final-visual img[data-te-ai-illustration="true"]{width:100%;height:100%;object-fit:cover;object-position:center;display:block}
  `;
  document.head.appendChild(style);

  const observer = new MutationObserver(apply);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
})();
