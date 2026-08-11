const photoActivityDialog = document.querySelector('#photo-activity-dialog');
const photoDialogClose = document.querySelector('.photo-dialog-close');
const photoActivityForm = document.querySelector('#photo-activity-form');
const photoFormError = document.querySelector('#photo-form-error');
const photoGeneratedPreview = document.querySelector('#photo-generated-preview');
const photoPreviewContent = document.querySelector('#photo-preview-content');
const photoRegenerate = document.querySelector('#photo-regenerate');
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
  const title = activity?.title || 'ATIVIDADE DE LÍNGUA PORTUGUESA';
  const subtitle = activity?.subtitle || 'Leitura e interpretação';
  const questions = Array.isArray(activity?.questions) && activity.questions.length
    ? activity.questions.map(question => question.prompt || question).filter(Boolean)
    : photoQuestions(count, adapted);
  const answerKeyContent = activity?.answerKey || 'Respostas avaliadas por compreensão, relação com a referência e clareza do registro.';

  const imageSrc = lastPhotoPayload?.imageDataUrl || 'assets/professora-alunos-uniforme-4k.png';
  const summaryText = activity?.summary || 'Atividade original gerada da imagem. Na escola de Ana, Pedro e Sofia, a turma participou de uma campanha de coleta seletiva. No pátio, foram colocadas lixeiras coloridas para papel, plástico, metal e vidro. A professora explicou que separar o lixo corretamente ajuda a proteger a natureza e a manter a escola limpa.';

  const formattedSummary = summaryText.split('\n').map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('');

  photoPreviewContent.innerHTML = `<section class="photo-activity-page teacheasy-a4-page" style="border: 3px dashed #4CAF50; border-radius: 20px; padding: 12mm 14mm; background: #fff; position: relative;">
    <!-- CABEÇALHO PADRÃO -->
    <div style="border: 2px solid #0d47a1; border-radius: 14px; padding: 10px 16px; margin-bottom: 14px; font-size: 14px; font-weight: 700; color: #1a252f; display: flex; flex-direction: column; gap: 8px;">
      <div style="display: flex; align-items: flex-end; gap: 8px; width: 100%;">
        <span>Escola:</span>
        <div style="flex: 1; border-bottom: 1.5px dotted #555; height: 16px;"></div>
      </div>
      <div style="display: flex; align-items: flex-end; gap: 8px; width: 100%;">
        <span>Nome:</span>
        <div style="flex: 1; border-bottom: 1.5px dotted #555; height: 16px;"></div>
      </div>
      <div style="display: grid; grid-template-columns: 1.2fr 1.5fr 2fr; gap: 15px; align-items: flex-end;">
        <div style="display: flex; align-items: flex-end; gap: 8px;">
          <span>Turma:</span>
          <div style="flex: 1; border-bottom: 1.5px dotted #555; height: 16px;"></div>
        </div>
        <div>Data: ____/____/______</div>
        <div style="display: flex; align-items: flex-end; gap: 8px;">
          <span>Prof.:</span>
          <div style="flex: 1; border-bottom: 1.5px dotted #555; height: 16px;"></div>
        </div>
      </div>
    </div>

    <!-- TÍTULO E SUBTÍTULO -->
    <h1 style="text-align: center; color: #0f4c81; font-family: sans-serif; font-size: 24px; font-weight: 800; text-transform: uppercase; margin-top: 4px; margin-bottom: 2px;">${escapeHtml(title)}</h1>
    <div style="text-align: center; color: #2e7d32; font-size: 17px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 16px;">🍃 ${escapeHtml(subtitle)} 🍃</div>

    <!-- CONTEÚDO 2 COLUNAS -->
    <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 16px; margin-bottom: 16px; align-items: stretch;">
      <div style="border: 2px dashed #81c784; border-radius: 14px; padding: 14px; font-size: 12.5px; line-height: 1.55; color: #2c3e50; text-align: justify; background: #fafafa; display: flex; flex-direction: column; justify-content: center;">
        ${formattedSummary}
      </div>
      <figure class="photo-generated-figure" style="border-radius: 14px; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e0e0e0; background: #f9f9f9; max-height: 220px; margin: 0;">
        <img src="${imageSrc}" alt="Ilustração da atividade" style="width: 100%; height: 100%; object-fit: cover;">
      </figure>
    </div>

    <!-- INSTRUÇÃO -->
    <div style="color: #2e7d32; font-weight: 800; font-size: 15px; margin-bottom: 14px; display: flex; align-items: center; gap: 6px;">
      <span>★ Responda às questões de acordo com o texto.</span>
    </div>

    <!-- QUESTÕES -->
    <ol class="photo-question-list" style="display: flex; flex-direction: column; gap: 11px; list-style: none; padding: 0; margin: 0;">
      ${questions.map((question, idx) => `
        <li style="display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px; color: #2c3e50;">
            <span style="background: #2e7d32; color: #ffffff; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0;">${idx + 1}</span>
            <span>${escapeHtml(question)}</span>
          </div>
          <div style="width: 100%; border-bottom: 1.5px solid #999; height: 20px;"></div>
        </li>
      `).join('')}
    </ol>
  </section>

  ${answerKey ? `
    <div class="photo-answer-key photo-answer-key-page" style="margin-top: 20px; padding: 16px; border-radius: 14px; background: #f4ebe7;">
      <strong style="color: #2e7d32; font-size: 16px;">GABARITO ORIENTATIVO</strong>
      <p style="margin-top: 8px;">${escapeHtml(answerKeyContent)}</p>
    </div>
  ` : ''}

  ${adapted ? `
    <div class="photo-adapted-note" style="margin-top: 15px; padding: 12px; border-radius: 10px; background: #e8f5e9; color: #1b5e20;">
      <strong>Versão adaptada (Inclusão/Autismo):</strong>
      <span>Comandos curtos, fonte clara e possibilidade de resposta por desenho ou símbolos.</span>
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
  const documentHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <title>Atividade TeachEasy Padronizada</title>
    <!--[if gte mso 9]>
    <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
      @page { size: A4; margin: 12mm 14mm; }
      body { font-family: 'Arial', sans-serif; font-size: 11pt; color: #2c3e50; }
      p { margin: 4px 0; }
    </style>
  </head>
  <body>
    ${photoPreviewContent.innerHTML}
  </body>
  </html>`;
  const blob = new Blob(['\ufeff', documentHtml], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'atividade_teacheasy_padronizada.docx';
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
photoDownloadPdf.addEventListener('click', () => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`<!DOCTYPE html><html><head><title>Atividade TeachEasy - PDF</title><style>@page{size:A4;margin:8mm}body{font-family:Arial,sans-serif;margin:0;padding:0;background:#fff;}</style></head><body>${photoPreviewContent.innerHTML}</body></html>`);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 300);
});
photoDownloadWord.addEventListener('click', downloadWordPreview);

