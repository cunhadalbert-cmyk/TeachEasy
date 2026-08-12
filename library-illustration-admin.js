(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('modoIlustracao') !== '1') return;

  const preview = document.querySelector('#activity-preview');
  const previewContent = document.querySelector('#preview-content');
  if (!preview || !previewContent) return;

  const style = document.createElement('style');
  style.textContent = `
    .te-illustration-admin{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 12px;padding:10px 12px;border:1px solid #f0b84a;border-radius:10px;background:#fff9e8;font:600 14px/1.35 Arial,sans-serif}
    .te-illustration-admin strong{color:#7a4a00;margin-right:auto}
    .te-illustration-admin button{border:1px solid #245b9b;border-radius:8px;padding:8px 11px;background:#fff;color:#245b9b;font-weight:700;cursor:pointer}
    .te-illustration-admin button[data-primary="true"]{background:#245b9b;color:#fff}
    .te-illustration-admin button:disabled{opacity:.55;cursor:wait}
    .te-illustration-admin-status{width:100%;font-size:12px;font-weight:500;color:#555}
    @media print{.te-illustration-admin{display:none!important}}
  `;
  document.head.appendChild(style);

  function clean(value = '') {
    return String(value).replace(/\s+/g, ' ').trim();
  }

  function subjectName() {
    return clean(document.querySelector('#library-filters select[name="subject"]')?.value || 'Atividade Escolar');
  }

  function currentData() {
    const student = previewContent.querySelector('.te-final-student');
    if (!student) return null;
    const topic = clean(student.querySelector('.te-final-subtitle')?.textContent || document.querySelector('#preview-title')?.textContent || 'Atividade');
    const support = clean(student.querySelector('.te-final-text')?.textContent || '');
    const questions = [...student.querySelectorAll('.te-final-qhead')].slice(0, 4).map(node => clean(node.textContent)).join(' ');
    const image = student.querySelector('.te-final-visual img');
    const shell = student.closest('.collection-preview-shell');
    return { student, topic, context: clean(`${support} ${questions}`).slice(0, 700), image, shell };
  }

  function isFallbackImage(image) {
    if (!image) return true;
    const src = image.getAttribute('src') || image.src || '';
    return !src || src.startsWith('data:image/svg+xml');
  }

  function downloadDataUrl(dataUrl, topic) {
    const anchor = document.createElement('a');
    const slug = clean(topic).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'ilustracao';
    anchor.href = dataUrl;
    anchor.download = `${slug}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  async function installPanel() {
    const data = currentData();
    if (!data || previewContent.querySelector('.te-illustration-admin')) return;

    if (data.shell && typeof window.teRestoreLibraryIllustration === 'function') {
      await window.teRestoreLibraryIllustration(data.shell).catch(() => null);
    }

    const panel = document.createElement('div');
    panel.className = 'te-illustration-admin';
    panel.innerHTML = `
      <strong>Modo temporário de ilustrações</strong>
      <button type="button" data-primary="true" class="te-generate-illustration">Gerar manualmente</button>
      <button type="button" class="te-download-illustration" disabled>Baixar PNG</button>
      <span class="te-illustration-admin-status"></span>
    `;

    const tools = previewContent.querySelector('.te-final-tools');
    if (tools) tools.before(panel);
    else previewContent.prepend(panel);

    const generate = panel.querySelector('.te-generate-illustration');
    const download = panel.querySelector('.te-download-illustration');
    const status = panel.querySelector('.te-illustration-admin-status');
    let generatedDataUrl = '';

    const refreshed = currentData();
    status.textContent = isFallbackImage(refreshed?.image)
      ? 'Ao clicar em Word ou PDF, a imagem será gerada, salva neste exercício e usada no arquivo.'
      : refreshed?.image?.dataset.tePersistentIllustration === 'true'
        ? 'Esta atividade já possui a ilustração gerada salva e vinculada ao exercício.'
        : 'Esta atividade já possui uma imagem estática salva; Word e PDF serão baixados diretamente.';

    async function generateIllustration() {
      const latest = currentData();
      if (!latest?.image) {
        status.textContent = 'Não encontrei o espaço de imagem desta atividade.';
        return;
      }

      generate.disabled = true;
      download.disabled = true;
      status.textContent = 'Gerando com os personagens padrão do TeachEasy…';

      try {
        const response = await fetch('/api/generate-library-illustration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: subjectName(),
            topic: latest.topic,
            context: latest.context
          })
        });
        const payload = await response.json();
        if (!response.ok || !payload.illustrationDataUrl) throw new Error(payload.error || 'Falha ao gerar ilustração.');

        generatedDataUrl = payload.illustrationDataUrl;
        latest.image.src = generatedDataUrl;
        latest.image.dataset.teGeneratedIllustration = 'true';
        latest.image.alt = `Ilustração pedagógica gerada para ${latest.topic}`;

        if (latest.shell && typeof window.tePersistLibraryIllustration === 'function') {
          const saved = await window.tePersistLibraryIllustration(latest.shell, generatedDataUrl);
          if (!saved) throw new Error('A imagem foi gerada, mas não foi possível fixá-la no exercício neste navegador.');
        }

        download.disabled = false;
        status.textContent = 'Ilustração pronta e salva neste exercício. Ao reabrir a atividade, ela será restaurada automaticamente.';
      } catch (error) {
        status.textContent = error.message || 'Não foi possível gerar a ilustração.';
      } finally {
        generate.disabled = false;
      }
    }

    generate.addEventListener('click', generateIllustration);
    download.addEventListener('click', () => {
      if (generatedDataUrl) downloadDataUrl(generatedDataUrl, data.topic);
    });
  }

  const observer = new MutationObserver(() => {
    if (preview.open) requestAnimationFrame(installPanel);
  });
  observer.observe(previewContent, { childList: true, subtree: true });
  preview.addEventListener('toggle', () => {
    if (preview.open) requestAnimationFrame(installPanel);
  });
})();
