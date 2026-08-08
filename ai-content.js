const aiLauncher = document.querySelector('#ai-content-launcher');
const aiDialog = document.querySelector('#ai-content-dialog');
const aiForm = document.querySelector('#ai-content-form');
const aiFormError = document.querySelector('#ai-form-error');
const aiPreview = document.querySelector('#ai-content-preview');
const aiDocument = document.querySelector('#ai-preview-document');
const aiChangeRequest = document.querySelector('#ai-change-request');
const aiHeaderFile = document.querySelector('#ai-school-header-file');
const aiHeaderPreview = document.querySelector('#ai-header-file-preview');
const aiHeaderImage = document.querySelector('#ai-header-image-preview');
const aiHeaderPdfMessage = document.querySelector('#ai-header-pdf-message');
const aiHeaderName = document.querySelector('#ai-header-file-name');
const aiHeaderRemove = document.querySelector('#ai-header-remove');
const aiUseHeader = document.querySelector('#ai-use-school-header');
const aiUseHeaderOption = document.querySelector('.ai-use-header-option');
const aiPhotoDialog = document.querySelector('#photo-activity-dialog');
let aiGeneration = 0;
let schoolHeaderAsset = null;
let lastAiPayload = null;

function escapeContent(value = '') {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);
}

function buildSchoolHeader() {
  const standardHeader = `<header class="generated-school-header generated-standard-header">
    <strong>ESCOLA: _________________________________________________</strong>
    <div><span>Nome: ____________________________</span><span>Turma: __________</span><span>Data: ____/____/______</span></div>
  </header>`;
  if (!schoolHeaderAsset || !aiUseHeader.checked) return standardHeader;
  if (schoolHeaderAsset.type === 'application/pdf') {
    return `${standardHeader}<header class="generated-school-header generated-school-header-pdf">
      <strong>Cabeçalho escolar anexado</strong>
      <span>${escapeContent(schoolHeaderAsset.name)}</span>
    </header>`;
  }
  return `${standardHeader}<header class="generated-school-header">
    <img src="${schoolHeaderAsset.dataUrl}" alt="Cabeçalho enviado pela escola">
  </header>`;
}

function activityIllustration(activity, data) {
  const topic = escapeContent(activity?.illustration || data.topic || data.subject || 'Aprender');
  const subject = String(data.subject || '').toLowerCase();
  const symbol = subject.includes('matem') ? '＋ − × ÷' : subject.includes('ciên') ? '☀︎  ☁︎  ♧' : subject.includes('portugu') ? 'A  B  C' : '✦  ✦  ✦';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="150" viewBox="0 0 620 150" role="img" aria-label="Ilustração pedagógica: ${topic}">
    <rect width="620" height="150" rx="18" fill="#f5f7f1"/><circle cx="84" cy="75" r="46" fill="#d9eadf"/>
    <text x="84" y="88" text-anchor="middle" font-family="Arial, sans-serif" font-size="29" font-weight="700" fill="#1b513d">${symbol}</text>
    <text x="156" y="66" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#173d2e">Observe a ilustração</text>
    <text x="156" y="98" font-family="Arial, sans-serif" font-size="19" fill="#173d2e">${topic.slice(0, 58)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function buildQuestions(data) {
  const count = Math.min(Math.max(Number(data.questionCount) || 5, 1), 30);
  return Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    const prompt = data.questionType === 'Objetivas'
      ? `Assinale a alternativa correta sobre ${escapeContent(data.topic)}.`
      : data.questionType === 'Discursivas'
        ? `Explique com suas palavras um aspecto importante de ${escapeContent(data.topic)}.`
        : number % 2
          ? `Observe e explique o que você aprendeu sobre ${escapeContent(data.topic)}.`
          : `Relacione ${escapeContent(data.topic)} com uma situação do seu cotidiano.`;
    return `<li><p>${prompt}</p><div class="answer-lines"></div></li>`;
  }).join('');
}

function renderAiPreview(activity) {
  const data = Object.fromEntries(new FormData(aiForm));
  data.figures = aiForm.elements.figures.checked;
  data.answerKey = aiForm.elements.answerKey.checked;
  data.adapted = aiForm.elements.adapted.checked;
  aiGeneration += 1;

  aiDocument.innerHTML = `<section class="generated-activity-page">
    ${buildSchoolHeader()}
    <section class="generated-material">
      <small>${escapeContent(data.materialType || 'Atividade')} · ${escapeContent(data.stage || 'Ensino básico')} · ${escapeContent(data.grade || 'Turma')}</small>
      <h2>${escapeContent(activity?.title || data.topic)}</h2>
      <p><strong>Disciplina:</strong> ${escapeContent(data.subject || 'A definir')} · <strong>Dificuldade:</strong> ${escapeContent(data.difficulty)}</p>
      ${data.objective ? `<p><strong>Objetivo:</strong> ${escapeContent(data.objective)}</p>` : ''}
      ${data.figures ? `<figure class="generated-figure"><img src="${activityIllustration(activity, data)}" alt="Ilustração pedagógica sobre ${escapeContent(activity?.illustration || data.topic || data.subject)}"><figcaption>Figura de apoio para a atividade.</figcaption></figure>` : ''}
      <ol class="generated-questions">${Array.isArray(activity?.questions) && activity.questions.length ? activity.questions.map(question => `<li><p>${escapeContent(question.prompt || question)}</p><div class="answer-lines"></div></li>`).join('') : buildQuestions(data)}</ol>
      ${data.adapted ? `<section class="generated-adapted"><h3>Versão adaptada para inclusão</h3><p>Comandos curtos, apoio visual, linguagem direta e menor carga por bloco.</p></section>` : ''}
    </section></section>
    ${data.answerKey ? `<section class="generated-answer-key generated-answer-key-page"><h3>Gabarito</h3><p>${escapeContent(activity?.answerKey || 'Respostas orientadoras para revisão do professor.')}</p></section>` : ''}`;

  aiForm.hidden = true;
  aiPreview.hidden = false;
  aiDocument.focus();
}

function downloadAiContent(extension, mimeType) {
  const cleanDocument = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Material escolar</title>
    <style>@page{size:A4;margin:8mm}body{font-family:Arial,sans-serif;max-width:190mm;margin:0 auto;color:#17251f;font-size:10pt;line-height:1.2}
    h1,h2,h3{color:#541020}.generated-school-header{border-bottom:1px solid #333;margin-bottom:8px;padding-bottom:6px}.generated-standard-header div{display:flex;justify-content:space-between;font-size:9pt}.generated-material h2{margin:6px 0}.generated-material p{margin:5px 0}.generated-questions{margin:6px 0;padding-left:22px}.generated-questions li{margin:5px 0}.generated-questions p{margin:0}.answer-lines{height:23px;border-bottom:1px solid #bbb}.generated-figure{margin:6px 0;text-align:center}.generated-figure img{max-height:55px;max-width:100%}.generated-figure figcaption{font-size:8pt}.generated-answer-key-page{break-before:page;page-break-before:always;padding-top:12mm}.generated-activity-page{break-after:page;page-break-after:always}</style>
    <body>${aiDocument.innerHTML}</body></html>`;
  const blob = new Blob([cleanDocument], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `material-escolar.${extension}`;
  link.click();
  URL.revokeObjectURL(link.href);
}

aiLauncher.addEventListener('click', () => {
  aiDialog.showModal();
  aiForm.hidden = false;
  aiPreview.hidden = true;
});
aiLauncher.closest('.ai-content-feature').addEventListener('click', event => {
  if (!event.target.closest('#ai-content-launcher')) aiLauncher.click();
});
aiLauncher.closest('.ai-content-feature').addEventListener('keydown', event => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  aiLauncher.click();
});
aiDialog.querySelector('.ai-content-close').addEventListener('click', () => aiDialog.close());
aiDialog.addEventListener('click', event => {
  if (event.target === aiDialog) aiDialog.close();
});
aiForm.addEventListener('submit', async event => {
  event.preventDefault();
  aiFormError.hidden = true;
  const formData = Object.fromEntries(new FormData(aiForm));
  lastAiPayload = { mode: 'text', ...formData, figures: aiForm.elements.figures.checked, answerKey: aiForm.elements.answerKey.checked, adapted: aiForm.elements.adapted.checked };
  const submit = aiForm.querySelector('[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Criando com a IA...';
  try {
    const response = await fetch('/api/generate-activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lastAiPayload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Não foi possível criar o material agora.');
    renderAiPreview(result.activity);
  } catch (error) {
    aiFormError.textContent = error.message || 'Não foi possível criar o material agora.';
    aiFormError.hidden = false;
    aiFormError.focus();
  } finally {
    submit.disabled = false;
    submit.textContent = 'Criar conteúdo';
  }
});
aiHeaderFile.addEventListener('change', () => {
  const file = aiHeaderFile.files[0];
  if (!file) return;
  const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    aiHeaderFile.value = '';
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    schoolHeaderAsset = { name: file.name, type: file.type, dataUrl: reader.result };
    aiHeaderName.textContent = file.name;
    aiHeaderPreview.hidden = false;
    aiHeaderRemove.hidden = false;
    aiUseHeaderOption.hidden = false;
    aiUseHeader.checked = true;
    const isImage = file.type.startsWith('image/');
    aiHeaderImage.hidden = !isImage;
    aiHeaderPdfMessage.hidden = isImage;
    if (isImage) aiHeaderImage.src = reader.result;
  });
  reader.readAsDataURL(file);
});
aiHeaderRemove.addEventListener('click', () => {
  schoolHeaderAsset = null;
  aiHeaderFile.value = '';
  aiHeaderImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
  aiHeaderPreview.hidden = true;
  aiHeaderImage.hidden = true;
  aiHeaderPdfMessage.hidden = true;
  aiHeaderRemove.hidden = true;
  aiUseHeaderOption.hidden = true;
  aiUseHeader.checked = false;
});
document.querySelector('#ai-edit-content').addEventListener('click', event => {
  const editing = aiDocument.contentEditable !== 'true';
  aiDocument.contentEditable = editing ? 'true' : 'false';
  aiDocument.classList.toggle('is-editing', editing);
  event.currentTarget.textContent = editing ? 'Concluir edição' : 'Editar conteúdo';
  if (editing) aiDocument.focus();
});
document.querySelector('#ai-request-change').addEventListener('click', () => {
  const request = aiChangeRequest.value.trim();
  if (!request) {
    aiChangeRequest.focus();
    return;
  }
  aiDocument.insertAdjacentHTML('beforeend', `<aside class="generated-adjustment"><strong>Ajuste solicitado à IA:</strong> ${escapeContent(request)}</aside>`);
  aiChangeRequest.value = '';
});
document.querySelector('#ai-regenerate-content').addEventListener('click', () => aiForm.requestSubmit());
document.querySelector('#ai-photo-option').addEventListener('click', () => {
  aiDialog.close();
  aiPhotoDialog.showModal();
});
document.querySelector('#ai-download-pdf').addEventListener('click', () => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`<title>Material escolar</title><style>body{font-family:Arial;max-width:800px;margin:40px auto;line-height:1.5}li{margin:16px 0}</style>${aiDocument.innerHTML}`);
  printWindow.document.close();
  printWindow.print();
});
document.querySelector('#ai-download-word').addEventListener('click', () => {
  downloadAiContent('doc', 'application/msword');
});
