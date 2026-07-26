const activitySeeds = [
  ['EI01', 'Educação Infantil', 'Maternal', 1, 'Campos de experiência', 'Cores e formas', 'Fácil', 'EI02TS02', '🎨', ['#ffd6d6', '#fff1b8']],
  ['EI02', 'Educação Infantil', 'Pré I', 1, 'Linguagem', 'Meu nome e minhas letras', 'Fácil', 'EI03EF09', '🔤', ['#d9ecff', '#f7ddff']],
  ['EI03', 'Educação Infantil', 'Pré II', 2, 'Matemática', 'Contagem até 10', 'Fácil', 'EI03ET07', '🔢', ['#dff3dc', '#fff0b7']],
  ['EI04', 'Educação Infantil', 'Maternal', 3, 'Natureza e sociedade', 'Animais e seus sons', 'Fácil', 'EI02ET03', '🐘', ['#d8f0de', '#ffe0b8']],
  ['EFI01', 'Ensino Fundamental I', '1º ano', 1, 'Língua Portuguesa', 'Alfabeto e consciência fonológica', 'Fácil', 'EF01LP05', '📚', ['#dbe9ff', '#ffe0ec']],
  ['EFI02', 'Ensino Fundamental I', '1º ano', 2, 'Matemática', 'Adição ilustrada', 'Fácil', 'EF01MA06', '➕', ['#dff3dc', '#fff0b7']],
  ['EFI03', 'Ensino Fundamental I', '2º ano', 1, 'Ciências', 'Partes das plantas', 'Média', 'EF02CI04', '🌱', ['#d3f1d4', '#fff4c6']],
  ['EFI04', 'Ensino Fundamental I', '2º ano', 3, 'Geografia', 'Paisagens do bairro', 'Média', 'EF02GE05', '🏘️', ['#d8efff', '#f5e4c5']],
  ['EFI05', 'Ensino Fundamental I', '3º ano', 1, 'História', 'Fontes históricas', 'Média', 'EF03HI02', '🏺', ['#f1dfc8', '#ffe7cf']],
  ['EFI06', 'Ensino Fundamental I', '3º ano', 2, 'Língua Portuguesa', 'Fábulas e moral', 'Média', 'EF35LP26', '🦊', ['#ffe3c6', '#f6d8ed']],
  ['EFI07', 'Ensino Fundamental I', '4º ano', 2, 'Matemática', 'Multiplicação e problemas', 'Média', 'EF04MA06', '✖️', ['#dbe9ff', '#dff3dc']],
  ['EFI08', 'Ensino Fundamental I', '4º ano', 3, 'Ciências', 'Cadeias alimentares', 'Média', 'EF04CI04', '🦋', ['#dff3dc', '#fff0b7']],
  ['EFI09', 'Ensino Fundamental I', '5º ano', 1, 'Matemática', 'Frações no cotidiano', 'Média', 'EF05MA03', '🍕', ['#ffd8d3', '#fff0b7']],
  ['EFI10', 'Ensino Fundamental I', '5º ano', 1, 'Língua Portuguesa', 'Interpretação de crônica', 'Média', 'EF05LP10', '📰', ['#dbe9ff', '#f5def2']],
  ['EFI11', 'Ensino Fundamental I', '5º ano', 2, 'Geografia', 'Regiões brasileiras', 'Média', 'EF05GE02', '🗺️', ['#d8efff', '#dff3dc']],
  ['EFI12', 'Ensino Fundamental I', '5º ano', 4, 'Arte', 'Cores quentes e frias', 'Fácil', 'EF15AR02', '🖌️', ['#ffd5c9', '#d8e9ff']],
  ['EFII01', 'Ensino Fundamental II', '6º ano', 1, 'Matemática', 'Números inteiros', 'Média', 'EF06MA03', '📈', ['#dbe9ff', '#dff3dc']],
  ['EFII02', 'Ensino Fundamental II', '6º ano', 2, 'Ciências', 'Misturas e separação', 'Média', 'EF06CI01', '🧪', ['#d9f2ef', '#eee0ff']],
  ['EFII03', 'Ensino Fundamental II', '7º ano', 2, 'História', 'Renascimento cultural', 'Média', 'EF07HI04', '🎭', ['#f4dfc7', '#f2ddec']],
  ['EFII04', 'Ensino Fundamental II', '7º ano', 3, 'Língua Portuguesa', 'Notícia e opinião', 'Desafiadora', 'EF07LP01', '🎙️', ['#dbe9ff', '#ffe2d8']],
  ['EFII05', 'Ensino Fundamental II', '8º ano', 1, 'Geografia', 'População e migrações', 'Desafiadora', 'EF08GE01', '🌎', ['#d7efff', '#dff3dc']],
  ['EFII06', 'Ensino Fundamental II', '9º ano', 3, 'Matemática', 'Funções e gráficos', 'Desafiadora', 'EF09MA06', '📊', ['#dbe9ff', '#eadfff']],
  ['EM01', 'Ensino Médio', '1ª série', 1, 'Biologia', 'Ecologia e relações ecológicas', 'Desafiadora', 'EM13CNT202', '🌿', ['#dff3dc', '#fff0b7']],
  ['EM02', 'Ensino Médio', '2ª série', 2, 'Física', 'Movimento e velocidade', 'Desafiadora', 'EM13CNT204', '🚀', ['#dbe9ff', '#e7dfff']],
  ['EM03', 'Ensino Médio', '3ª série', 3, 'Química', 'Funções orgânicas', 'Desafiadora', 'EM13CNT104', '⚗️', ['#d9f2ef', '#f5def2']],
  ['EM04', 'Ensino Médio', '3ª série', 4, 'Língua Portuguesa', 'Literatura brasileira', 'Desafiadora', 'EM13LP48', '📖', ['#f4dfc7', '#dbe9ff']]
];

const subjectQuestions = {
  Matemática: [
    'Resolva a situação-problema apresentada usando uma estratégia de sua escolha.',
    'Represente o resultado por meio de desenho, cálculo ou esquema.',
    'Explique como você conferiu sua resposta.',
    'Crie um novo problema relacionado ao mesmo conteúdo.'
  ],
  'Língua Portuguesa': [
    'Leia o texto com atenção e identifique sua ideia principal.',
    'Localize no texto duas informações que sustentam sua resposta.',
    'Explique o significado de uma palavra pelo contexto.',
    'Produza uma frase ou pequeno parágrafo relacionado ao tema.'
  ],
  Ciências: [
    'Observe a ilustração e registre o que você percebe.',
    'Explique o fenômeno estudado com suas palavras.',
    'Relacione o conteúdo a uma situação do cotidiano.',
    'Proponha uma atitude de investigação ou cuidado.'
  ],
  default: [
    'Observe a imagem e registre os elementos mais importantes.',
    'Explique o tema com suas palavras.',
    'Relacione o conteúdo a uma situação do cotidiano.',
    'Produza um pequeno registro sobre o que aprendeu.'
  ]
};

const answerTemplates = [
  'Resposta construída conforme a estratégia do estudante, considerando o conceito trabalhado.',
  'Espera-se uma representação coerente e organizada.',
  'Resposta pessoal com justificativa relacionada ao conteúdo.',
  'Produção autoral avaliada por clareza, pertinência e compreensão.'
];

let activities = activitySeeds.map((seed, index) => {
  const [id, stage, grade, term, subject, topic, difficulty, bncc, symbol, colors] = seed;
  const questions = (subjectQuestions[subject] || subjectQuestions.default).map(question =>
    question.replace('conteúdo', topic.toLowerCase())
  );

  return {
    id,
    stage,
    grade,
    term,
    subject,
    topic,
    difficulty,
    bncc,
    symbol,
    colors,
    questions,
    answers: answerTemplates,
    hasAnswerKey: index % 7 !== 0,
    hasFigures: index % 6 !== 0,
    hasAdapted: true,
    description: `Atividade demonstrativa sobre ${topic.toLowerCase()}, com linguagem adequada ao ${grade}.`
  };
});

const collectionRegistry = {
  'Ciências': {
    path: 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/ciencias.json',
    collection: '4ano-3bimestre-ciencias',
    count: 5,
    symbol: '🔬',
    colors: ['#d9f1e1', '#e8f0ff']
  },
  'Matemática': {
    path: 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/matematica.json',
    collection: '4ano-3bimestre-matematica',
    count: 8,
    symbol: '➗',
    colors: ['#e1ebff', '#fff1bd']
  },
  'Língua Portuguesa': {
    path: 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json',
    collection: '4ano-3bimestre-lingua-portuguesa',
    count: 7,
    symbol: '📖',
    colors: ['#ffe2e8', '#eee3ff']
  }
};
const loadedCollections = new Set();
const collectionPromises = new Map();

function difficultyLabel(value) {
  return {
    facil: 'Fácil',
    intermediaria: 'Intermediária',
    desafiadora: 'Desafiadora'
  }[value] || value;
}

function validateCollection(collection, config) {
  if (collection.schemaVersion !== '1.0'
    || collection.colecao !== config.collection
    || collection.idioma !== 'pt-BR'
    || collection.atividades.length !== config.count) {
    throw new Error(`Estrutura da coleção de ${collection.disciplina || 'atividades'} inválida.`);
  }
  const ids = new Set();
  collection.atividades.forEach(activity => {
    if (ids.has(activity.id) || activity.questoes.length !== 6 || activity.gabarito.length !== 6) {
      throw new Error('Atividades, questões ou IDs da coleção são inválidos.');
    }
    ids.add(activity.id);
    const figureIds = new Set(activity.figuras.map(figure => figure.id));
    activity.questoes.forEach(question => {
      if (question.figuraId && !figureIds.has(question.figuraId)) {
        throw new Error(`Referência de figura inválida em ${activity.id}.`);
      }
    });
  });
}

function normalizeCollectionActivity(activity, collection, config) {
  return {
    id: activity.id,
    stage: 'Ensino Fundamental I',
    grade: '4º ano',
    term: 3,
    subject: collection.disciplina,
    topic: activity.titulo,
    difficulty: difficultyLabel(activity.dificuldade),
    bncc: activity.bncc.map(item => item.codigo).join(', '),
    symbol: config.symbol,
    colors: config.colors,
    questions: activity.questoes,
    answers: activity.gabarito,
    figures: activity.figuras,
    hasAnswerKey: activity.possuiGabarito,
    hasFigures: activity.possuiFiguras,
    hasAdapted: activity.possuiVersaoAdaptada,
    description: activity.objetivo,
    instruction: activity.instrucaoGeral,
    supportText: activity.textoApoio,
    collectionActivity: true
  };
}

function selectedCollectionConfig() {
  if (navigation.stage !== 'Ensino Fundamental I'
    || navigation.grade !== '4º ano'
    || navigation.term !== '3') return null;
  return collectionRegistry[filterForm.elements.subject.value] || null;
}

async function ensureSelectedCollection() {
  const config = selectedCollectionConfig();
  if (!config || loadedCollections.has(config.collection)) return;
  if (!collectionPromises.has(config.collection)) {
    const promise = fetch(config.path)
      .then(response => {
        if (!response.ok) throw new Error('Não foi possível carregar a coleção selecionada.');
        return response.json();
      })
      .then(collection => {
        validateCollection(collection, config);
        activities = activities
          .filter(activity => !(activity.stage === 'Ensino Fundamental I'
            && activity.grade === '4º ano'
            && activity.term === 3
            && activity.subject === collection.disciplina))
          .concat(collection.atividades.map(activity => normalizeCollectionActivity(activity, collection, config)));
        loadedCollections.add(config.collection);
      })
      .catch(error => {
        collectionPromises.delete(config.collection);
        showToast(error.message);
        throw error;
      });
    collectionPromises.set(config.collection, promise);
  }
  return collectionPromises.get(config.collection);
}

const filterForm = document.querySelector('#library-filters');
const activityGrid = document.querySelector('#activity-grid');
const resultCount = document.querySelector('#result-count');
const selectionCount = document.querySelector('#selection-count');
const emptyState = document.querySelector('#empty-state');
const emptyReset = document.querySelector('#empty-reset');
const activeFilterSummary = document.querySelector('#active-filter-summary');
const preview = document.querySelector('#activity-preview');
const previewContent = document.querySelector('#preview-content');
const previewClose = document.querySelector('.preview-close');
const toast = document.querySelector('#library-toast');
const choiceGrid = document.querySelector('#library-choice-grid');
const stepTitle = document.querySelector('#library-step-title');
const stepHelp = document.querySelector('#library-step-help');
const breadcrumb = document.querySelector('#library-breadcrumb');
const backButton = document.querySelector('#library-back');
const pagination = document.querySelector('#library-pagination');
const previousPage = document.querySelector('#previous-page');
const nextPage = document.querySelector('#next-page');
const pageStatus = document.querySelector('#page-status');

const favorites = new Set();
const selectedActivities = new Set();
let toastTimer;
let currentPage = 1;
const pageSize = 5;
const navigation = { stage: '', grade: '', term: '' };

const stages = [
  { name: 'Educação Infantil', label: 'Educação Infantil', detail: 'Maternal, Pré I e Pré II', count: 288, theme: 'infantil' },
  { name: 'Ensino Fundamental I', label: 'Ensino Fundamental — Anos Iniciais', detail: '1º ao 5º ano', count: 800, theme: 'iniciais' },
  { name: 'Ensino Fundamental II', label: 'Ensino Fundamental — Anos Finais', detail: '6º ao 9º ano', count: 384, theme: 'finais' },
  { name: 'Ensino Médio', label: 'Ensino Médio', detail: '1ª à 3ª série', count: 240, theme: 'medio' }
];

const gradesByStage = {
  'Educação Infantil': ['Maternal', 'Pré I', 'Pré II'],
  'Ensino Fundamental I': ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano'],
  'Ensino Fundamental II': ['6º ano', '7º ano', '8º ano', '9º ano'],
  'Ensino Médio': ['1ª série', '2ª série', '3ª série']
};

function uniqueSorted(field) {
  return [...new Set(activities.map(activity => activity[field]))]
    .sort((a, b) => String(a).localeCompare(String(b), 'pt-BR', { numeric: true }));
}

function populateSelect(name, values) {
  const select = filterForm.elements[name];
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

populateSelect('subject', uniqueSorted('subject'));

function getFilters() {
  const data = new FormData(filterForm);
  return {
    stage: navigation.stage,
    grade: navigation.grade,
    term: navigation.term,
    subject: String(data.get('subject') || ''),
    query: String(data.get('query') || '').trim().toLocaleLowerCase('pt-BR'),
    answerKey: data.has('answerKey'),
    figures: data.has('figures'),
    adapted: data.has('adapted')
  };
}

function matchesFilters(activity, filters) {
  const searchable = `${activity.topic} ${activity.subject} ${activity.description}`.toLocaleLowerCase('pt-BR');
  return (!filters.stage || activity.stage === filters.stage)
    && (!filters.grade || activity.grade === filters.grade)
    && (!filters.term || String(activity.term) === filters.term)
    && (!filters.subject || activity.subject === filters.subject)
    && (!filters.query || searchable.includes(filters.query))
    && (!filters.answerKey || activity.hasAnswerKey)
    && (!filters.figures || activity.hasFigures)
    && (!filters.adapted || activity.hasAdapted);
}

function featureLabels(activity) {
  return [
    activity.bncc && `BNCC ${activity.bncc}`,
    activity.hasAnswerKey && 'Gabarito',
    activity.hasFigures && 'Figuras',
    activity.hasAdapted && 'Versão adaptada'
  ].filter(Boolean);
}

function renderCard(activity) {
  const article = document.createElement('article');
  article.className = 'activity-library-card';
  article.dataset.activityId = activity.id;
  article.innerHTML = `
    <div class="activity-card-visual" style="--visual-gradient:linear-gradient(135deg, ${activity.colors[0]}, ${activity.colors[1]})">
      <span class="activity-card-symbol" aria-hidden="true">${activity.symbol}</span>
      <button class="favorite-button" type="button" aria-label="Favoritar ${activity.topic}" aria-pressed="${favorites.has(activity.id)}">
        ${favorites.has(activity.id) ? '♥' : '♡'}
      </button>
    </div>
    <div class="activity-card-body">
      <div class="activity-meta">
        <span>${activity.grade}</span>
        <span>${activity.term}º bimestre</span>
        <span class="difficulty">${activity.difficulty}</span>
      </div>
      <h3>${activity.topic}</h3>
      <p><strong>${activity.subject}</strong> · ${activity.description}</p>
      <div class="activity-features">
        ${featureLabels(activity).map(label => `<span>${label}</span>`).join('')}
      </div>
      <div class="activity-card-actions">
        <button class="btn btn-outline preview-button" type="button">Visualizar</button>
        <button class="btn btn-outline favorite-text-button" type="button">Favoritar</button>
        <button class="btn btn-primary add-button" type="button" aria-pressed="${selectedActivities.has(activity.id)}">
          ${selectedActivities.has(activity.id) ? '✓ Adicionada' : 'Adicionar à seleção'}
        </button>
      </div>
    </div>
  `;

  article.querySelector('.preview-button').addEventListener('click', () => openPreview(activity));
  article.querySelector('.favorite-button').addEventListener('click', () => toggleFavorite(activity.id));
  article.querySelector('.favorite-text-button').addEventListener('click', () => toggleFavorite(activity.id));
  article.querySelector('.add-button').addEventListener('click', () => toggleSelection(activity.id));
  return article;
}

function renderActivities() {
  const filters = getFilters();
  const filtered = activities.filter(activity => matchesFilters(activity, filters));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  currentPage = Math.min(currentPage, pageCount);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  activityGrid.replaceChildren(...visible.map(renderCard));
  emptyState.hidden = filtered.length > 0;
  activityGrid.hidden = filtered.length === 0;
  pagination.hidden = filtered.length <= pageSize;
  pageStatus.textContent = `Página ${currentPage} de ${pageCount}`;
  previousPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === pageCount;
  renderFilterSummary(filters);
}

function renderFilterSummary(filters) {
  const labels = [
    filters.stage,
    filters.grade,
    filters.term && `${filters.term}º bimestre`,
    filters.subject,
    filters.query && `“${filters.query}”`,
    filters.answerKey && 'com gabarito',
    filters.figures && 'com figuras',
    filters.adapted && 'com adaptação'
  ].filter(Boolean);
  activeFilterSummary.textContent = labels.length ? `Filtros ativos: ${labels.join(' · ')}` : '';
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2400);
}

function toggleFavorite(id) {
  const activity = activities.find(item => item.id === id);
  if (favorites.has(id)) {
    favorites.delete(id);
    showToast(`“${activity.topic}” removida dos favoritos.`);
  } else {
    favorites.add(id);
    showToast(`“${activity.topic}” adicionada aos favoritos.`);
  }
  renderActivities();
}

function toggleSelection(id) {
  const activity = activities.find(item => item.id === id);
  if (selectedActivities.has(id)) {
    selectedActivities.delete(id);
    showToast(`“${activity.topic}” removida da seleção.`);
  } else {
    selectedActivities.add(id);
    showToast(`“${activity.topic}” adicionada à seleção.`);
  }
  selectionCount.textContent = selectedActivities.size;
  renderActivities();
}

function questionMarkup(activity, questions = activity.questions) {
  if (activity.collectionActivity) {
    return questions.map(question => `
      <li>
        <p>${question.enunciado.replace(/\n/g, '<br>')}</p>
        ${question.alternativas.length ? `<ol class="question-alternatives" type="a">${question.alternativas.map(alternative => `<li>${alternative}</li>`).join('')}</ol>` : ''}
        <div class="student-answer-space answer-space-${question.espacoResposta}" aria-label="Espaço para resposta"></div>
      </li>
    `).join('');
  }
  return activity.questions.map(question => `
    <li>${question}<span class="answer-line" aria-hidden="true"></span></li>
  `).join('');
}

function answerMarkup(activity) {
  if (activity.collectionActivity) {
    return activity.answers.map(answer => `
      <li><strong>${answer.resposta}</strong><p>${answer.justificativa}</p></li>
    `).join('');
  }
  return activity.answers.map(answer => `<li>${answer}</li>`).join('');
}

function openPreview(activity) {
  if (activity.collectionActivity) {
    openCollectionPreview(activity);
    return;
  }
  const gradient = `linear-gradient(135deg, ${activity.colors[0]}, ${activity.colors[1]})`;
  previewContent.innerHTML = `
    <div class="preview-shell">
      <div class="preview-topline">${activity.stage} · ${activity.grade} · ${activity.term}º BIMESTRE</div>
      <h2 id="preview-title">${activity.topic}</h2>
      <p class="preview-summary">${activity.subject} · ${activity.description}</p>

      <section class="worksheet-page">
        <header class="worksheet-header">
          <div>
            <h3>Atividade: ${activity.topic}</h3>
            <p>${activity.subject} · ${activity.grade}</p>
          </div>
          <span class="worksheet-brand">TeachEasy</span>
        </header>
        <div class="student-fields">
          <span>Nome:</span>
          <span>Data:</span>
        </div>
        ${activity.hasFigures ? `<div class="preview-illustration" style="--visual-gradient:${gradient}" role="img" aria-label="Ilustração colorida sobre ${activity.topic}">${activity.symbol}</div>` : ''}
        <ol class="question-list">${questionMarkup(activity)}</ol>
        <div class="preview-bncc"><strong>BNCC ${activity.bncc}</strong> — habilidade demonstrativa associada ao objeto de conhecimento.</div>
      </section>

      <section class="worksheet-page answer-key-page">
        <h3>Gabarito — folha separada</h3>
        ${activity.hasAnswerKey ? `<ol>${answerMarkup(activity)}</ol>` : '<p>Esta atividade foi cadastrada sem gabarito demonstrativo.</p>'}
      </section>

      <section class="worksheet-page adapted-page">
        <h3>Versão adaptada para autismo e inclusão</h3>
        <div class="adapted-badges">
          <span>Comandos curtos</span>
          <span>Apoio visual</span>
          <span>Uma etapa por vez</span>
          <span>Tempo flexível</span>
        </div>
        ${activity.hasAdapted ? `
          <div class="adapted-question"><strong>1.</strong> Observe a figura. Aponte ou escreva uma informação importante.</div>
          <div class="adapted-question"><strong>2.</strong> Escolha uma resposta e explique usando palavras, desenho ou símbolos.</div>
          <div class="adapted-question"><strong>3.</strong> Faça uma pausa. Depois, confira sua resposta com o professor.</div>
        ` : '<p>A versão adaptada será disponibilizada na coleção completa.</p>'}
      </section>
    </div>
  `;
  preview.showModal();
}

function pendingFiguresMarkup(activity) {
  if (!activity.figures.length) return '';
  return `<aside class="figure-production-review">
    <strong>Área administrativa/revisão</strong>
    ${activity.figures.map(figure => `<p data-figure-id="${figure.id}">Figura pendente de produção</p>`).join('')}
  </aside>`;
}

function openCollectionPreview(activity) {
  previewContent.innerHTML = `
    <div class="preview-shell collection-preview-shell">
      <div class="preview-topline">Revisão · ${activity.stage} · ${activity.grade} · ${activity.term}º bimestre</div>
      ${pendingFiguresMarkup(activity)}
      <button class="btn btn-primary preview-print" type="button">Imprimir atividade</button>

      <section class="worksheet-page collection-student-page">
        <div class="student-fields">
          <span>Nome:</span><span>Turma:</span><span>Data:</span>
        </div>
        <h1>${activity.topic}</h1>
        <p class="collection-instruction">${activity.instruction}</p>
        ${activity.supportText && activity.supportText.conteudo ? `
          <article class="support-text">
            ${activity.supportText.titulo ? `<h2>${activity.supportText.titulo}</h2>` : ''}
            <p>${activity.supportText.conteudo.replace(/\n/g, '<br>')}</p>
          </article>
        ` : ''}
        <ol class="question-list collection-question-list">${questionMarkup(activity, activity.questions.slice(0, 3))}</ol>
      </section>

      <section class="worksheet-page collection-student-page collection-student-page-two">
        <ol class="question-list collection-question-list" start="4">${questionMarkup(activity, activity.questions.slice(3, 6))}</ol>
      </section>

      <section class="worksheet-page answer-key-page collection-answer-key">
        <h2>Gabarito</h2>
        <h3>${activity.topic}</h3>
        <ol>${answerMarkup(activity)}</ol>
      </section>
    </div>`;
  previewContent.querySelector('.preview-print').addEventListener('click', () => window.print());
  preview.showModal();
}

function resetFilters() {
  filterForm.reset();
  currentPage = 1;
  requestAnimationFrame(renderActivities);
}

function choiceCard(title, detail, action, count = '', theme = '') {
  const button = document.createElement('button');
  button.className = 'library-choice-card';
  button.type = 'button';
  if (theme) button.dataset.theme = theme;
  button.innerHTML = `
    <strong>${title}</strong>
    <span>${detail}</span>
    ${count ? `<small>${count.toLocaleString('pt-BR')} atividades-base</small>` : ''}
  `;
  button.addEventListener('click', action);
  return button;
}

function stageLabel(name) {
  return stages.find(stage => stage.name === name)?.label || name;
}

function renderNavigation() {
  const atActivities = Boolean(navigation.term);
  filterForm.hidden = !atActivities;
  activityGrid.hidden = !atActivities;
  activeFilterSummary.hidden = !atActivities;
  pagination.hidden = true;
  choiceGrid.hidden = atActivities;
  backButton.hidden = !navigation.stage;

  const crumbs = ['Biblioteca'];
  if (navigation.stage) crumbs.push(stageLabel(navigation.stage));
  if (navigation.grade) crumbs.push(navigation.grade);
  if (navigation.term) crumbs.push(`${navigation.term}º bimestre`);
  breadcrumb.textContent = crumbs.join(' → ');

  if (!navigation.stage) {
    stepTitle.textContent = 'Escolha uma etapa';
    stepHelp.textContent = '1.712 atividades-base. Inclusão e autismo estão disponíveis em todas as etapas.';
    choiceGrid.replaceChildren(...stages.map(stage =>
      choiceCard(stage.label, stage.detail, () => {
        navigation.stage = stage.name;
        renderNavigation();
      }, stage.count, stage.theme)
    ));
    return;
  }

  if (!navigation.grade) {
    stepTitle.textContent = 'Escolha o ano ou a série';
    stepHelp.textContent = stageLabel(navigation.stage);
    choiceGrid.replaceChildren(...gradesByStage[navigation.stage].map(grade =>
      choiceCard(grade, 'Conteúdos dos quatro bimestres', () => {
        navigation.grade = grade;
        renderNavigation();
      })
    ));
    return;
  }

  if (!navigation.term) {
    stepTitle.textContent = 'Escolha o bimestre';
    stepHelp.textContent = `${stageLabel(navigation.stage)} · ${navigation.grade}`;
    choiceGrid.replaceChildren(...[1, 2, 3, 4].map(term =>
      choiceCard(`${term}º bimestre`, 'Ver atividades deste período', () => {
        navigation.term = String(term);
        currentPage = 1;
        renderNavigation();
      })
    ));
    return;
  }

  stepTitle.textContent = 'Escolha uma atividade';
  stepHelp.textContent = `${stageLabel(navigation.stage)} · ${navigation.grade} · ${navigation.term}º bimestre`;
  renderActivities();
}

filterForm.addEventListener('input', async () => {
  currentPage = 1;
  await ensureSelectedCollection().catch(() => {});
  renderActivities();
});
filterForm.addEventListener('submit', event => {
  event.preventDefault();
  ensureSelectedCollection().catch(() => {}).finally(renderActivities);
});
filterForm.addEventListener('reset', () => requestAnimationFrame(renderActivities));
emptyReset.addEventListener('click', resetFilters);
previewClose.addEventListener('click', () => preview.close());
preview.addEventListener('click', event => {
  if (event.target === preview) preview.close();
});

backButton.addEventListener('click', () => {
  if (navigation.term) navigation.term = '';
  else if (navigation.grade) navigation.grade = '';
  else navigation.stage = '';
  currentPage = 1;
  renderNavigation();
});
previousPage.addEventListener('click', () => {
  currentPage -= 1;
  renderActivities();
});
nextPage.addEventListener('click', () => {
  currentPage += 1;
  renderActivities();
});

renderNavigation();
