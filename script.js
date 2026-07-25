const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.carousel-dots button')];
const chips = [...document.querySelectorAll('.carousel-chips button')];
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const carousel = document.querySelector('.carousel');

let current = 0;
let timer;

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
}

function restartTimer() {
  clearTimeout(timer);
  const delay = current === 0 ? 13000 : 5500;
  timer = setTimeout(() => {
    showSlide(current + 1);
    restartTimer();
  }, delay);
}

prev.addEventListener('click', () => {
  showSlide(current - 1);
  restartTimer();
});

next.addEventListener('click', () => {
  showSlide(current + 1);
  restartTimer();
});

dots.forEach(dot => dot.addEventListener('click', () => {
  showSlide(Number(dot.dataset.slide));
  restartTimer();
}));

carousel.setAttribute('tabindex', '0');
carousel.setAttribute('role', 'button');
carousel.setAttribute('aria-label', 'Avançar para o próximo destaque');

carousel.addEventListener('click', event => {
  if (event.target.closest('.carousel-dots button')) return;
  showSlide(current + 1);
  restartTimer();
});

carousel.addEventListener('keydown', event => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  showSlide(current + 1);
  restartTimer();
});

chips.forEach(chip => chip.addEventListener('click', () => {
  showSlide(Number(chip.dataset.slide));
  restartTimer();
}));

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

showSlide(0);
restartTimer();


const serviceDetails = {
  planning: {
    icon: '🗓', title: 'Planejamento de aula',
    description: 'Uma estrutura completa para orientar a aula do início à avaliação, adaptada à série, à disciplina e ao tema.',
    includes: ['Objetivos de aprendizagem', 'Habilidades e conhecimentos prévios', 'Recursos e metodologia', 'Desenvolvimento passo a passo', 'Avaliação e adaptações'],
    inputs: ['Ano ou série', 'Disciplina e tema', 'Quantidade e duração das aulas', 'Objetivo principal', 'Necessidades específicas da turma']
  },
  activity: {
    icon: '✏️', title: 'Atividade com gabarito',
    description: 'Exercícios adequados ao nível da turma, organizados para imprimir, editar e aplicar com facilidade.',
    includes: ['Texto de apoio quando necessário', 'Questões objetivas e discursivas', 'Nível de dificuldade ajustável', 'Espaço para respostas', 'Gabarito completo'],
    inputs: ['Ano ou série', 'Disciplina e tema', 'Quantidade de questões', 'Tipo de atividade', 'Nível de dificuldade']
  },
  assessment: {
    icon: '✅', title: 'Avaliação com gabarito',
    description: 'Uma avaliação clara e personalizável, com critérios de correção e questões alinhadas ao conteúdo trabalhado.',
    includes: ['Cabeçalho e orientações', 'Questões objetivas', 'Questões discursivas', 'Critérios de correção', 'Gabarito organizado'],
    inputs: ['Ano ou série', 'Disciplina e conteúdos', 'Quantidade de questões', 'Tipos de questão', 'Nível de dificuldade']
  },
  sequence: {
    icon: '📚', title: 'Sequência didática',
    description: 'Um conjunto de aulas conectadas, com progressão pedagógica e atividades que aprofundam o tema por etapas.',
    includes: ['Objetivo geral e objetivos por etapa', 'Organização das aulas', 'Atividades progressivas', 'Recursos e intervenções', 'Avaliação final'],
    inputs: ['Ano ou série', 'Disciplina e tema', 'Quantidade de aulas', 'Duração de cada encontro', 'Resultado esperado']
  }
};

const serviceCards = [...document.querySelectorAll('[data-service]')];
const serviceDialog = document.querySelector('#service-dialog');
const serviceDialogClose = document.querySelector('.service-dialog-close');

function fillList(container, items) {
  container.innerHTML = items.map(item => '<li>' + item + '</li>').join('');
}

function openServiceDetails(serviceKey) {
  const service = serviceDetails[serviceKey];
  if (!service || !serviceDialog) return;
  currentServiceKey = serviceKey;
  serviceDialog.classList.remove('request-mode');
  serviceDialog.querySelector('.service-dialog-icon').textContent = service.icon;
  serviceDialog.querySelector('#service-dialog-title').textContent = service.title;
  serviceDialog.querySelector('.service-dialog-description').textContent = service.description;
  fillList(serviceDialog.querySelector('.service-dialog-includes'), service.includes);
  fillList(serviceDialog.querySelector('.service-dialog-inputs'), service.inputs);
  serviceDialog.showModal();
}

serviceCards.forEach(card => {
  card.addEventListener('click', () => openServiceDetails(card.dataset.service));
  card.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openServiceDetails(card.dataset.service);
  });
});

serviceDialogClose?.addEventListener('click', () => serviceDialog.close());
serviceDialog?.addEventListener('click', event => {
  if (event.target === serviceDialog) serviceDialog.close();
});


// Configure aqui, somente com números: país + DDD + telefone.
// Exemplo: 5511999999999
const TEACHEASY_WHATSAPP_NUMBER = '5524999629129';

let currentServiceKey = '';
const serviceRequestForm = document.querySelector('.service-request-form');
const serviceRequestAction = document.querySelector('.service-dialog-action');
const serviceRequestBack = document.querySelector('.service-request-back');
const serviceRequestStatus = document.querySelector('.service-request-status');
const serviceGenerateExample = document.querySelector('.service-generate-example');

serviceRequestAction?.addEventListener('click', () => {
  serviceDialog.classList.add('request-mode');
  serviceRequestForm.hidden = false;
  serviceRequestStatus.textContent = '';
  serviceDialog.scrollTo({ top: 0, behavior: 'smooth' });
  serviceRequestForm.querySelector('input')?.focus();
});

serviceRequestBack?.addEventListener('click', () => {
  serviceDialog.classList.remove('request-mode');
  serviceRequestForm.hidden = true;
  serviceRequestStatus.textContent = '';
  serviceDialog.scrollTo({ top: 0, behavior: 'smooth' });
});

function buildDemoMaterial(serviceKey, data) {
  const valueOrExample = (field, example) => String(data.get(field) || '').trim() || example;
  const grade = valueOrExample('grade', '5º ano');
  const subject = valueOrExample('subject', 'Matemática');
  const topic = valueOrExample('topic', 'Frações');
  const duration = valueOrExample('duration', '1 aula de 50 minutos');
  const line = String.fromCharCode(10);

  if (serviceKey === 'activity') {
    const requestText = [subject, topic, String(data.get('notes') || '')].join(' ').toLowerCase();
    const mathMatch = requestText.match(/(\d+)\s*(?:quest(?:ão|ões)?\s*)?(?:de\s*)?matemática/);
    const portugueseMatch = requestText.match(/(\d+)\s*(?:quest(?:ão|ões)?\s*)?(?:de\s*)?português/);
    const mathCount = mathMatch ? Math.min(Number(mathMatch[1]), 5) : (requestText.includes('matemática') ? 3 : 5);
    const portugueseCount = portugueseMatch ? Math.min(Number(portugueseMatch[1]), 5) : (requestText.includes('português') ? 2 : 0);

    const mathQuestions = [
      ['Resolva: 245 + 378 =', '623.'],
      ['Uma escola recebeu 8 caixas com 24 lápis em cada uma. Quantos lápis recebeu ao todo?', '192 lápis.'],
      ['Uma pizza foi dividida em 8 partes iguais e 3 foram consumidas. Que fração representa a parte consumida?', '3/8.'],
      ['Calcule: 960 ÷ 6 =', '160.'],
      ['Qual é o valor de 7 × 9 + 12?', '75.']
    ];
    const portugueseQuestions = [
      ['Leia: “A menina abriu o livro colorido.” Qual é o substantivo que nomeia o objeto?', 'Livro.'],
      ['Reescreva no plural: “O aluno realizou a atividade.”', 'Os alunos realizaram as atividades.'],
      ['Qual é o adjetivo na frase: “O jardim estava florido e alegre”?', 'Florido e alegre.'],
      ['Separe em sílabas a palavra “professora”.', 'pro-fes-so-ra.'],
      ['Escreva uma frase usando corretamente um ponto de interrogação.', 'Resposta pessoal contendo uma pergunta e ponto de interrogação.']
    ];

    const output = [
      'ATIVIDADE INTERDISCIPLINAR COLORIDA — 5º ANO',
      'Matemática e Língua Portuguesa | ' + duration,
      '',
      'Nome: __________________________________  Data: ____/____/______',
      ''
    ];
    const answers = [];
    let questionNumber = 1;

    mathQuestions.slice(0, mathCount).forEach(([question, answer]) => {
      output.push('MATEMÁTICA ' + questionNumber + '. ' + question, '');
      answers.push(questionNumber + '. ' + answer);
      questionNumber += 1;
    });
    portugueseQuestions.slice(0, portugueseCount).forEach(([question, answer]) => {
      output.push('PORTUGUÊS ' + questionNumber + '. ' + question, '');
      answers.push(questionNumber + '. ' + answer);
      questionNumber += 1;
    });

    output.push('GABARITO', ...answers);
    return output.join(line);
  }

  if (serviceKey === 'assessment') {
    return [
      'AVALIAÇÃO GERADA — ' + topic.toUpperCase(),
      grade + ' | ' + subject,
      '',
      '1. Defina ' + topic + ' com suas palavras.',
      '2. Apresente um exemplo relacionado ao tema.',
      '3. Resolva uma situação-problema envolvendo ' + topic + '.',
      '4. Explique como chegou à resposta.',
      '',
      'GABARITO: respostas avaliadas pela compreensão do conceito, aplicação correta e clareza do raciocínio.'
    ].join(line);
  }

  if (serviceKey === 'sequence') {
    return [
      'SEQUÊNCIA DIDÁTICA GERADA — ' + topic.toUpperCase(),
      grade + ' | ' + subject + ' | ' + duration,
      '',
      'Aula 1: levantamento dos conhecimentos prévios e apresentação do tema.',
      'Aula 2: explicação dialogada com exemplos visuais e atividade em duplas.',
      'Aula 3: atividade prática, socialização das respostas e intervenção do professor.',
      'Aula 4: revisão, produção final e avaliação formativa.',
      '',
      'Inclusão: usar instruções curtas, apoio visual, exemplos concretos e tempo adicional quando necessário.'
    ].join(line);
  }

  return [
    'PLANEJAMENTO DE AULA GERADO — ' + topic.toUpperCase(),
    grade + ' | ' + subject + ' | ' + duration,
    '',
    'Objetivo: compreender e aplicar os conceitos principais de ' + topic + '.',
    'Abertura: conversa inicial e levantamento dos conhecimentos prévios.',
    'Desenvolvimento: explicação com exemplos, atividade guiada e prática em duplas.',
    'Recursos: quadro, material visual, folhas de atividade e objetos concretos.',
    'Avaliação: observação da participação, correção da atividade e pergunta de saída.',
    'Inclusão: linguagem objetiva, rotina visual, apoio individual e diferentes formas de resposta.'
  ].join(line);
}

function showGeneratedMaterial(data) {
  serviceRequestStatus.style.whiteSpace = 'pre-line';
  serviceRequestStatus.textContent = buildDemoMaterial(currentServiceKey || 'planning', data);
}

serviceRequestForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const data = new FormData(serviceRequestForm);
  const selectedService = serviceDetails[currentServiceKey] || serviceDetails.planning;
  const valueOrExample = (field, example) => String(data.get(field) || '').trim() || example;
  const notes = String(data.get('notes') || '').trim();
  const message = [
    'Olá! Quero solicitar um material no TeachEasy.',
    '',
    'Serviço: ' + selectedService.title,
    'Nome: ' + valueOrExample('teacher_name', 'Professor(a) de exemplo'),
    'Ano ou série: ' + valueOrExample('grade', '5º ano'),
    'Disciplina: ' + valueOrExample('subject', 'Matemática'),
    'Tema: ' + valueOrExample('topic', 'Frações'),
    'Quantidade e duração: ' + valueOrExample('duration', '1 aula de 50 minutos'),
    'Formato: ' + valueOrExample('format', 'PDF'),
    notes ? 'Observações: ' + notes : ''
  ].filter(Boolean).join(String.fromCharCode(10));

  if (!TEACHEASY_WHATSAPP_NUMBER) {
    showGeneratedMaterial(data);
    await downloadRequestedMaterial(data);
    return;
  }

  const whatsappUrl = 'https://wa.me/' + TEACHEASY_WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  serviceRequestStatus.textContent = 'Abrindo o WhatsApp com seu pedido preenchido…';
});

function createColorfulFigure(topic) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 1200, 500);
  gradient.addColorStop(0, '#e8f7f1');
  gradient.addColorStop(1, '#fff3cf');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 500);

  ctx.fillStyle = '#12372f';
  ctx.font = 'bold 54px Arial';
  ctx.fillText('Aprendendo ' + topic, 60, 85);
  ctx.font = '30px Arial';
  ctx.fillStyle = '#31564e';
  ctx.fillText('Observe a representação colorida:', 60, 140);

  const colors = ['#ff6b6b', '#f7b731', '#20bf6b', '#45aaf2', '#a55eea'];
  for (let i = 0; i < 5; i += 1) {
    const x = 80 + i * 205;
    ctx.beginPath();
    ctx.roundRect(x, 205, 165, 165, 24);
    ctx.fillStyle = i < 3 ? colors[i] : '#ffffff';
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#12372f';
    ctx.stroke();
  }

  ctx.fillStyle = '#12372f';
  ctx.font = 'bold 38px Arial';
  ctx.fillText('3 partes coloridas de um total de 5 = 3/5', 215, 445);
  return canvas.toDataURL('image/png');
}

function safeFileName(text) {
  return String(text || 'material-teacheasy')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-]+/g, '-').replace(/-+/g, '-').toLowerCase();
}

function dataUrlToBytes(dataUrl) {
  const binary = atob(dataUrl.split(',')[1]);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function generatePdf(material, topic, fileBase) {
  if (!window.jspdf?.jsPDF) throw new Error('Gerador de PDF indisponível');
  const pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
  const figure = createColorfulFigure(topic);
  const lines = material.split(String.fromCharCode(10));
  let y = 18;

  pdf.setTextColor(18, 55, 47);
  lines.forEach((line, index) => {
    const isTitle = index === 0 || line === 'GABARITO';
    pdf.setFont('helvetica', isTitle ? 'bold' : 'normal');
    pdf.setFontSize(isTitle ? 15 : 11);
    const wrapped = pdf.splitTextToSize(line || ' ', 174);
    if (y + wrapped.length * 6 > 270) {
      pdf.addPage();
      y = 18;
    }
    pdf.text(wrapped, 18, y);
    y += Math.max(6, wrapped.length * 6);
  });

  if (y > 195) {
    pdf.addPage();
    y = 18;
  }
  pdf.addImage(figure, 'PNG', 18, y + 4, 174, 72);
  pdf.save(fileBase + '.pdf');
}

async function generateWord(material, topic, fileBase) {
  if (!window.docx?.Document) throw new Error('Gerador de Word indisponível');
  const image = dataUrlToBytes(createColorfulFigure(topic));
  const paragraphs = material.split(String.fromCharCode(10)).map((line, index) =>
    new window.docx.Paragraph({
      heading: index === 0 ? window.docx.HeadingLevel.TITLE : undefined,
      spacing: { after: line ? 140 : 60 },
      children: [new window.docx.TextRun({ text: line || ' ', bold: line === 'GABARITO', color: line === 'GABARITO' ? '12372F' : undefined })]
    })
  );
  paragraphs.push(new window.docx.Paragraph({
    spacing: { before: 240 },
    children: [new window.docx.ImageRun({ data: image, transformation: { width: 600, height: 250 }, type: 'png' })]
  }));
  const documentFile = new window.docx.Document({
    sections: [{ properties: {}, children: paragraphs }]
  });
  const blob = await window.docx.Packer.toBlob(documentFile);
  downloadBlob(blob, fileBase + '.docx');
}

async function downloadRequestedMaterial(data) {
  const topic = String(data.get('topic') || '').trim() || 'Frações';
  const format = String(data.get('format') || 'PDF');
  const material = buildDemoMaterial(currentServiceKey || 'planning', data);
  const fileBase = safeFileName('TeachEasy-' + (serviceDetails[currentServiceKey]?.title || 'Material') + '-' + topic);

  serviceRequestStatus.style.whiteSpace = 'pre-line';
  serviceRequestStatus.textContent = material + '\n\nPreparando arquivo para download…';

  try {
    if (format === 'PDF' || format === 'PDF e Word editável') await generatePdf(material, topic, fileBase);
    if (format === 'Word editável' || format === 'PDF e Word editável') await generateWord(material, topic, fileBase);
    serviceRequestStatus.textContent = material + '\n\n✓ Arquivo gerado e baixado com figura colorida.';
  } catch (error) {
    serviceRequestStatus.textContent = material + '\n\nNão foi possível baixar o arquivo agora. Tente novamente.';
  }
}

serviceGenerateExample?.addEventListener('click', async () => {
  const data = new FormData(serviceRequestForm);
  showGeneratedMaterial(data);
  await downloadRequestedMaterial(data);
});
