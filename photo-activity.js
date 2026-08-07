const photoActivityDialog = document.querySelector('#photo-activity-dialog');
const photoDialogClose = document.querySelector('.photo-dialog-close');
const photoActivityForm = document.querySelector('#photo-activity-form');
const photoFormError = document.querySelector('#photo-form-error');
const photoGeneratedPreview = document.querySelector('#photo-generated-preview');
const photoPreviewContent = document.querySelector('#photo-preview-content');
const photoRegenerate = document.querySelector('#photo-regenerate');
const schoolHeaderToggle = document.querySelector('#school-header-toggle');
const schoolHeader = document.querySelector('#school-header');
const photoDownloadPdf = document.querySelector('#photo-download-pdf');
const photoDownloadWord = document.querySelector('#photo-download-word');
let photoGeneration = 0;
let lastPhotoPayload = null;

function photoQuestions(count, adapted) {
  const standard = [
    'Observe a situação apresentada e registre o que mais chamou sua atenção.',
    'Explique o tema da imagem com suas próprias palavras.',
    'Relacione a referência a um conteúdo estudado em sala.',
    'Crie uma solução, exemplo ou conclusão para a situação.',
    'Revise sua resposta e destaque a informação mais importante.'
  ];
  const accessible = [
    'Observe uma parte da referência e diga o que você percebe.',
    'Escolha uma informação importante e registre com palavras ou desenho.',
    'Relacione a imagem a algo que você já conhece.'
  ];
  const source = adapted ? accessible : standard;
  return Array.from({ length: count }, (_, index) => source[index % source.length]);
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
}

function renderPhotoPreview(activity) {
  const data = new FormData(photoActivityForm);
  const grade = String(data.get('grade') || 'Ano/série selecionado');
  const count = Math.min(20, Math.max(1, Number(data.get('questionCount')) || 5));
  const adapted = data.has('adapted');
  const answerKey = data.has('answerKey');
  photoGeneration += 1;
  const title = activity?.title || 'Atividade criada a partir da referência visual';
  const questions = Array.isArray(activity?.questions) && activity.questions.length
    ? activity.questions.map(question => question.prompt || question).filter(Boolean)
    : photoQuestions(count, adapted);
  const answerKeyContent = activity?.answerKey || 'Respostas avaliadas por compreensão, relação com a referência e clareza do registro.';

  photoPreviewContent.innerHTML = `
    <div class="photo-preview-heading">
      <span>${grade}</span>
      <small>Prévia demonstrativa · versão ${photoGeneration}</small>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(activity?.summary || 'A foto orientou o tema e o contexto. Os enunciados abaixo são novos e não são uma simples cópia do texto da imagem.')}</p>
    </div>
    <div class="photo-generated-figure">
      <strong>Figura de apoio</strong>
      <span>Incluída automaticamente quando ajuda a compreender o conteúdo.</span>
    </div>
    <ol class="photo-question-list">
      ${questions.map(question => `<li>${escapeHtml(question)}</li>`).join('')}
    </ol>
    ${answerKey ? `
      <div class="photo-answer-key">
        <strong>Gabarito orientativo</strong>
        <p>${escapeHtml(answerKeyContent)}</p>
      </div>
    ` : ''}
    ${adapted ? `
      <div class="photo-adapted-note">
        <strong>Versão adaptada</strong>
        <span>Comandos curtos, uma etapa por vez e possibilidade de resposta por desenho ou símbolos.</span>
      </div>
    ` : ''}
  `;
  photoGeneratedPreview.hidden = false;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

async function generatePhotoActivity() {
  const file = photoActivityForm.elements.photo.files?.[0];
  const data = new FormData(photoActivityForm);
  const submit = photoActivityForm.querySelector('[type="submit"]');
  submit.disabled = true;
  submit.textContent = 'Analisando foto...';
  try {
    const imageDataUrl = await fileToDataUrl(file);
    if (imageDataUrl.length > 6_500_000) throw new Error('A imagem é grande demais. Envie uma foto de até 4 MB.');
    lastPhotoPayload = {
      mode: 'photo', imageDataUrl, grade: data.get('grade'), questionCount: Number(data.get('questionCount')),
      answerKey: data.has('answerKey'), adapted: data.has('adapted')
    };
    const response = await fetch('/api/generate-activity', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lastPhotoPayload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Não foi possível criar a atividade agora.');
    renderPhotoPreview(result.activity);
  } catch (error) {
    photoFormError.textContent = error.message || 'Não foi possível gerar a atividade.';
    photoFormError.hidden = false;
  } finally {
    submit.disabled = false;
    submit.textContent = 'Gerar prévia';
  }
}

function validatePhotoReference() {
  const file = photoActivityForm.elements.photo.files?.[0];
  const validType = file && /^(image\/jpeg|image\/png)$/.test(file.type);
  if (!validType) {
    photoFormError.textContent = 'Adicione uma imagem JPG, JPEG ou PNG para gerar a prévia.';
    photoFormError.hidden = false;
    photoGeneratedPreview.hidden = true;
    return false;
  }
  photoFormError.hidden = true;
  return true;
}

function downloadWordPreview() {
  const documentHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Atividade TeachEasy</title></head><body>${schoolHeader.hidden ? '' : schoolHeader.outerHTML}${photoPreviewContent.innerHTML}</body></html>`;
  const blob = new Blob([documentHtml], { type: 'application/msword' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'atividade-teacheasy.doc';
  link.click();
  URL.revokeObjectURL(link.href);
}

photoDialogClose.addEventListener('click', () => photoActivityDialog.close());
photoActivityDialog.addEventListener('click', event => {
  if (event.target === photoActivityDialog) photoActivityDialog.close();
});
photoActivityForm.addEventListener('submit', event => {
  event.preventDefault();
  if (validatePhotoReference()) generatePhotoActivity();
});
photoRegenerate.addEventListener('click', () => {
  if (validatePhotoReference()) generatePhotoActivity();
});
schoolHeaderToggle.addEventListener('change', () => {
  schoolHeader.hidden = !schoolHeaderToggle.checked;
});
photoDownloadPdf.addEventListener('click', () => window.print());
photoDownloadWord.addEventListener('click', downloadWordPreview);
