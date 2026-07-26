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
  'library-demo': {
    icon: '🗂️', title: 'Visualizar atividades da biblioteca',
    description: 'Passe pelos exemplos e veja como as atividades ficam organizadas antes de escolher.'
  },
  'coloring-demo': {
    icon: '🎨', title: 'Desenhos para colorir',
    description: 'Escolha uma categoria ou deixe o TeachEasy sugerir um tema.'
  },
  'games-demo': {
    icon: '🎲', title: 'Jogos pedagógicos',
    description: 'Veja materiais lúdicos que podem ser impressos e usados com a turma.'
  },
  'ai-demo': {
    icon: '✨', title: 'Veja a IA criando',
    description: 'Acompanhe o pedido se transformando em uma atividade pronta para revisão.'
  }
};

const serviceCards = [...document.querySelectorAll('[data-service]')];
const serviceDialog = document.querySelector('#service-dialog');
const serviceDialogClose = document.querySelector('.service-dialog-close');

function fillList(container, items) {
  container.innerHTML = items.map(item => '<li>' + item + '</li>').join('');
}

function libraryDemoMarkup() {
  return `
    <div class="demo-showcase">
      <div class="demo-carousel">
        <button class="demo-carousel-button demo-previous" type="button" aria-label="Atividade anterior">‹</button>
        <div class="demo-slide" aria-live="polite"></div>
        <button class="demo-carousel-button demo-next" type="button" aria-label="Próxima atividade">›</button>
      </div>
      <div class="demo-dots" aria-hidden="true"></div>
    </div>
  `;
}

function renderLibraryCarousel(container) {
  const examples = [
    { label: 'Educação Infantil · Natureza', title: 'Descobrindo as cores das plantas', text: 'Atividade visual com observação, pintura e versão adaptada.' },
    { label: '3º ano · Matemática · 2º bimestre', title: 'Problemas de adição e subtração', text: 'Situações do cotidiano com espaço para cálculo e gabarito.' },
    { label: '7º ano · Ciências · 3º bimestre', title: 'Ecossistemas brasileiros', text: 'Leitura curta, figuras de apoio e questões de compreensão.' },
    { label: 'Ensino Médio · Língua Portuguesa', title: 'Interpretação e argumentação', text: 'Texto de apoio, questões discursivas e critérios de resposta.' }
  ];
  let index = 0;
  const slide = container.querySelector('.demo-slide');
  const dots = container.querySelector('.demo-dots');
  const show = nextIndex => {
    index = (nextIndex + examples.length) % examples.length;
    const example = examples[index];
    slide.innerHTML = `<small>${example.label}</small><strong>${example.title}</strong><p>${example.text}</p>`;
    dots.innerHTML = examples.map((_, dotIndex) => `<span class="${dotIndex === index ? 'active' : ''}"></span>`).join('');
  };
  container.querySelector('.demo-previous').addEventListener('click', () => show(index - 1));
  container.querySelector('.demo-next').addEventListener('click', () => show(index + 1));
  show(0);
}

function coloringDemoMarkup() {
  const categories = ['Animais', 'Alfabeto', 'Números', 'Natureza', 'Profissões', 'Datas comemorativas'];
  return `
    <div class="demo-showcase">
      <div class="demo-category-grid">
        ${categories.map(category => `<button class="demo-category" type="button">${category}</button>`).join('')}
      </div>
      <button class="demo-surprise" type="button">✨ Surpreenda-me</button>
      <p class="demo-surprise-result" aria-live="polite"></p>
    </div>
  `;
}

function activateColoringDemo(container) {
  const categories = [...container.querySelectorAll('.demo-category')];
  const result = container.querySelector('.demo-surprise-result');
  const select = button => {
    categories.forEach(category => category.classList.toggle('active', category === button));
    result.textContent = `Categoria escolhida: ${button.textContent}`;
  };
  categories.forEach(button => button.addEventListener('click', () => select(button)));
  container.querySelector('.demo-surprise').addEventListener('click', () => {
    select(categories[Math.floor(Math.random() * categories.length)]);
  });
}

function gamesDemoMarkup() {
  const games = ['🔎 Caça-palavras', '✏️ Cruzadinhas', '🧠 Jogo da memória', '🎟️ Bingo educativo', '🖼️ Associação de imagens', '✂️ Recorte e montagem'];
  return `<div class="demo-showcase"><div class="demo-game-grid">${games.map(game => `<div class="demo-game">${game}</div>`).join('')}</div></div>`;
}

function aiDemoMarkup() {
  const steps = [
    ['1', 'Professor informa o pedido', 'Ano, tema e objetivo'],
    ['2', 'A IA gera', 'Conteúdo criado em tempo real'],
    ['3', 'A prévia é montada', 'Questões, figuras e gabarito'],
    ['4', 'Pronta para revisar', 'Professor confere e adapta']
  ];
  return `<div class="demo-showcase"><div class="ai-demo-flow">${steps.map(step => `
    <div class="ai-demo-step"><b>${step[0]}</b><strong>${step[1]}</strong><span>${step[2]}</span></div>
  `).join('')}</div></div>`;
}

function renderDemoExperience(serviceKey) {
  const container = serviceDialog.querySelector('.service-dialog-columns');
  if (serviceKey === 'library-demo') {
    container.innerHTML = libraryDemoMarkup();
    renderLibraryCarousel(container);
  } else if (serviceKey === 'coloring-demo') {
    container.innerHTML = coloringDemoMarkup();
    activateColoringDemo(container);
  } else if (serviceKey === 'games-demo') {
    container.innerHTML = gamesDemoMarkup();
  } else {
    container.innerHTML = aiDemoMarkup();
  }
}

function openServiceDetails(serviceKey) {
  const service = serviceDetails[serviceKey];
  if (!service || !serviceDialog) return;
  currentServiceKey = serviceKey;
  serviceDialog.classList.remove('request-mode');
  serviceDialog.classList.add('demo-mode');
  serviceDialog.querySelector('.service-dialog-icon').textContent = service.icon;
  serviceDialog.querySelector('#service-dialog-title').textContent = service.title;
  serviceDialog.querySelector('.service-dialog-description').textContent = service.description;
  renderDemoExperience(serviceKey);
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

const serviceFormConfig = {
  planning: {
    grade: ['Ano ou série', 'Ex.: 5º ano'],
    subject: ['Disciplina', 'Ex.: Matemática'],
    topic: ['Tema da aula', 'Ex.: Frações'],
    duration: ['Quantidade de aulas', 'Ex.: 2 aulas']
  },
  activity: {
    grade: ['Ano ou série', 'Ex.: 5º ano'],
    subject: ['Disciplina', 'Ex.: Matemática e Português'],
    topic: ['Tema ou conteúdo', 'Ex.: Frações e interpretação de texto'],
    duration: ['Quantidade de questões', 'Ex.: 5 questões']
  },
  assessment: {
    grade: ['Ano ou série', 'Ex.: 5º ano'],
    subject: ['Disciplina', 'Ex.: Ciências'],
    topic: ['Conteúdo da avaliação', 'Ex.: Sistema Solar'],
    duration: ['Quantidade de questões', 'Ex.: 10 questões']
  },
  sequence: {
    grade: ['Ano ou série', 'Ex.: Educação Infantil'],
    subject: ['Campo ou disciplina', 'Ex.: Linguagem'],
    topic: ['Tema da sequência', 'Ex.: Animais brasileiros'],
    duration: ['Quantidade de aulas', 'Ex.: 4 aulas']
  },
  portfolio: {
    grade: ['Ano ou turma', 'Ex.: 5º ano A'],
    subject: ['Nome do estudante', 'Ex.: João da Silva'],
    topic: ['Área acompanhada', 'Ex.: Leitura e escrita'],
    duration: ['Período avaliado', 'Ex.: 1º bimestre']
  }
};

function configureRequestForm(serviceKey) {
  const config = serviceFormConfig[serviceKey] || serviceFormConfig.activity;
  Object.entries(config).forEach(([field, settings]) => {
    const input = serviceRequestForm?.querySelector('[name="' + field + '"]');
    if (!input) return;
    const label = input.closest('label')?.querySelector('span');
    if (label) label.textContent = settings[0];
    input.placeholder = settings[1];
  });
  serviceRequestForm?.reset();
}

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
  const duration = valueOrExample('duration', '5 questões');
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

  if (serviceKey === 'portfolio') {
    const student = subject === 'Matemática' ? 'Estudante de exemplo' : subject;
    return [
      'PORTFÓLIO DO ESTUDANTE — ' + grade.toUpperCase(),
      'Estudante: ' + student + ' | Período: ' + duration,
      '',
      'ÁREA ACOMPANHADA: ' + topic,
      '',
      'Objetivos observados: desenvolver autonomia, participação e domínio progressivo das habilidades trabalhadas.',
      'Evidências: produções escritas, atividades realizadas, registros fotográficos e participação nas propostas.',
      'Avanços: demonstra evolução na organização das ideias e maior segurança para realizar as atividades.',
      'Desafios: continuar fortalecendo a leitura dos enunciados e a revisão das respostas.',
      'Intervenções: apoio visual, explicações em etapas, retomada dos conceitos e atividades diversificadas.',
      'Próximos passos: ampliar a autonomia e propor novos desafios adequados ao ritmo do estudante.',
      '',
      'PARECER DESCRITIVO',
      'O estudante participou das atividades do período e apresentou avanços importantes. Recomenda-se manter o acompanhamento e valorizar suas conquistas.'
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
    'Quantidade de questões: ' + valueOrExample('duration', '5 questões'),
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
    if (line === 'GABARITO') {
      if (y > 190) {
        pdf.addPage();
        y = 18;
      }
      pdf.addImage(figure, 'PNG', 18, y + 4, 174, 72);
      pdf.addPage();
      y = 18;
    }
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

  pdf.save(fileBase + '.pdf');
}

async function generateWord(material, topic, fileBase) {
  if (!window.docx?.Document) throw new Error('Gerador de Word indisponível');
  const image = dataUrlToBytes(createColorfulFigure(topic));
  const paragraphs = material.split(String.fromCharCode(10)).map((line, index) =>
    new window.docx.Paragraph({
      heading: index === 0 ? window.docx.HeadingLevel.TITLE : undefined,
      pageBreakBefore: line === 'GABARITO',
      spacing: { after: line ? 140 : 60 },
      children: [new window.docx.TextRun({ text: line || ' ', bold: line === 'GABARITO', color: line === 'GABARITO' ? '12372F' : undefined })]
    })
  );
  const answerKeyIndex = material.split(String.fromCharCode(10)).findIndex(line => line === 'GABARITO');
  paragraphs.splice(answerKeyIndex, 0, new window.docx.Paragraph({
    spacing: { before: 240, after: 240 },
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
