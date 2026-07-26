const aiLauncher = document.querySelector('#ai-content-launcher');
const aiDialog = document.querySelector('#ai-content-dialog');
const aiForm = document.querySelector('#ai-content-form');
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
let aiGeneration = 0;
let schoolHeaderAsset = null;

function escapeContent(value = '') {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);
}

function buildSchoolHeader() {
  if (!schoolHeaderAsset || !aiUseHeader.checked) return '';
  if (schoolHeaderAsset.type === 'application/pdf') {
    return `<header class="generated-school-header generated-school-header-pdf">
      <strong>Cabeçalho escolar anexado</strong>
      <span>${escapeContent(schoolHeaderAsset.name)}</span>
    </header>`;
  }
  return `<header class="generated-school-header">
    <img src="${schoolHeaderAsset.dataUrl}" alt="Cabeçalho enviado pela escola">
  </header>`;
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

function renderAiPreview() {
  const data = Object.fromEntries(new FormData(aiForm));
  data.figures = aiForm.elements.figures.checked;
  data.answerKey = aiForm.elements.answerKey.checked;
  data.adapted = aiForm.elements.adapted.checked;
  aiGeneration += 1;

  aiDocument.innerHTML = `
    ${buildSchoolHeader()}
    <section class="generated-material">
      <small>${escapeContent(data.materialType)} · ${escapeContent(data.stage)} · ${escapeContent(data.grade)}</small>
      <h2>${escapeContent(data.topic)}</h2>
      <p><strong>Disciplina:</strong> ${escapeContent(data.subject)} · <strong>Dificuldade:</strong> ${escapeContent(data.difficulty)}</p>
      ${data.objective ? `<p><strong>Objetivo:</strong> ${escapeContent(data.objective)}</p>` : ''}
      ${data.figures ? '<div class="generated-figure" role="img" aria-label="Espaço sugerido para figura pedagógica">Figura pedagógica sugerida para este conteúdo</div>' : ''}
      <ol class="generated-questions">${buildQuestions(data)}</ol>
      ${data.answerKey ? `<section class="generated-answer-key"><h3>Gabarito</h3><p>Respostas orientadoras para revisão do professor.</p></section>` : ''}
      ${data.adapted ? `<section class="generated-adapted"><h3>Versão adaptada para inclusão</h3><p>Comandos curtos, apoio visual, linguagem direta e menor carga por bloco.</p></section>` : ''}
    </section>`;

  aiForm.hidden = true;
  aiPreview.hidden = false;
  aiDocument.focus();
}

function downloadAiContent(extension, mimeType) {
  const cleanDocument = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Material escolar</title>
    <style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;color:#17251f;line-height:1.5}
    h1,h2,h3{color:#541020}.generated-school-header{border-bottom:2px solid #333;margin-bottom:28px;padding-bottom:12px}
    li{margin:18px 0}.answer-lines{height:45px;border-bottom:1px solid #bbb}.generated-figure{padding:30px;border:1px dashed #888;text-align:center}</style>
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
aiForm.addEventListener('submit', event => {
  event.preventDefault();
  renderAiPreview();
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
document.querySelector('#ai-regenerate-content').addEventListener('click', renderAiPreview);
document.querySelector('#ai-download-pdf').addEventListener('click', () => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`<title>Material escolar</title><style>body{font-family:Arial;max-width:800px;margin:40px auto;line-height:1.5}li{margin:16px 0}</style>${aiDocument.innerHTML}`);
  printWindow.document.close();
  printWindow.print();
});
document.querySelector('#ai-download-word').addEventListener('click', () => {
  downloadAiContent('doc', 'application/msword');
});
