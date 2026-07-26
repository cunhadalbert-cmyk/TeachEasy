const aiLauncher = document.querySelector('#ai-content-launcher');
const aiDialog = document.querySelector('#ai-content-dialog');
const aiForm = document.querySelector('#ai-content-form');
const aiPreview = document.querySelector('#ai-content-preview');
const aiDocument = document.querySelector('#ai-preview-document');
const aiChangeRequest = document.querySelector('#ai-change-request');
let aiGeneration = 0;

function escapeContent(value = '') {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[character]);
}

function buildSchoolHeader(data) {
  if (!data.school && !data.teacher && !data.student && !data.classroom && !data.date) return '';
  return `<header class="generated-school-header">
    ${data.school ? `<strong>${escapeContent(data.school)}</strong>` : ''}
    <p>${[
      data.teacher && `Professor: ${escapeContent(data.teacher)}`,
      data.student && `Aluno: ${escapeContent(data.student)}`,
      data.classroom && `Turma: ${escapeContent(data.classroom)}`,
      data.date && `Data: ${escapeContent(data.date.split('-').reverse().join('/'))}`
    ].filter(Boolean).join(' · ')}</p>
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
    ${buildSchoolHeader(data)}
    <section class="generated-material">
      <small>${escapeContent(data.materialType)} · ${escapeContent(data.stage)} · ${escapeContent(data.grade)}</small>
      <h2>${escapeContent(data.topic)}</h2>
      <p><strong>Disciplina:</strong> ${escapeContent(data.subject)} · <strong>Dificuldade:</strong> ${escapeContent(data.difficulty)}</p>
      ${data.objective ? `<p><strong>Objetivo:</strong> ${escapeContent(data.objective)}</p>` : ''}
      ${data.figures ? '<div class="generated-figure" role="img" aria-label="Espaço sugerido para figura pedagógica">Figura pedagógica sugerida para este conteúdo</div>' : ''}
      <ol class="generated-questions">${buildQuestions(data)}</ol>
      ${data.answerKey ? `<section class="generated-answer-key"><h3>Gabarito</h3><p>Respostas orientadoras para revisão do professor.</p></section>` : ''}
      ${data.adapted ? `<section class="generated-adapted"><h3>Versão adaptada para inclusão</h3><p>Comandos curtos, apoio visual, linguagem direta e menor carga por bloco.</p></section>` : ''}
      ${data.notes ? `<p><strong>Observações consideradas:</strong> ${escapeContent(data.notes)}</p>` : ''}
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
aiDialog.querySelector('.ai-content-close').addEventListener('click', () => aiDialog.close());
aiDialog.addEventListener('click', event => {
  if (event.target === aiDialog) aiDialog.close();
});
aiForm.addEventListener('submit', event => {
  event.preventDefault();
  renderAiPreview();
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
