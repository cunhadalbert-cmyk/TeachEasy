(() => {
  const autismSeeds = [
    ['AUT001','Educação Infantil','Maternal',1,'Traços, sons, cores e formas','Pareamento de cores com apoio visual','EI02TS02','🎨'],
    ['AUT002','Educação Infantil','Maternal',1,'O eu, o outro e o nós','Reconhecendo emoções básicas','EI02EO04','🙂'],
    ['AUT003','Educação Infantil','Maternal',2,'Corpo, gestos e movimentos','Imitando movimentos simples','EI02CG03','🤸'],
    ['AUT004','Educação Infantil','Maternal',2,'Espaços, tempos, quantidades, relações e transformações','Separando grande e pequeno','EI02ET05','🔵'],
    ['AUT005','Educação Infantil','Pré I',1,'Escuta, fala, pensamento e imaginação','Meu nome com letras móveis','EI03EF09','🔤'],
    ['AUT006','Educação Infantil','Pré I',2,'Espaços, tempos, quantidades, relações e transformações','Contagem visual até 10','EI03ET07','🔢'],
    ['AUT007','Educação Infantil','Pré I',3,'O eu, o outro e o nós','Minha rotina em sequência','EI03EO04','🗓️'],
    ['AUT008','Educação Infantil','Pré II',2,'Escuta, fala, pensamento e imaginação','Sequência de imagens e história curta','EI03EF04','🖼️'],
    ['AUT009','Educação Infantil','Pré II',3,'Traços, sons, cores e formas','Formas geométricas no cotidiano','EI03TS02','🔺'],
    ['AUT010','Educação Infantil','Pré II',4,'Espaços, tempos, quantidades, relações e transformações','Antes e depois na rotina','EI03ET07','⏱️'],

    ['AUT011','Ensino Fundamental I','1º ano',1,'Língua Portuguesa','Vogais com figuras','EF01LP05','📚'],
    ['AUT012','Ensino Fundamental I','1º ano',1,'Matemática','Adição com apoio de objetos','EF01MA06','➕'],
    ['AUT013','Ensino Fundamental I','1º ano',2,'Língua Portuguesa','Palavras e imagens correspondentes','EF01LP05','🧩'],
    ['AUT014','Ensino Fundamental I','1º ano',3,'Matemática','Quantidade e numeral','EF01MA06','🔢'],
    ['AUT015','Ensino Fundamental I','2º ano',1,'Ciências','Partes das plantas com cartões visuais','EF02CI04','🌱'],
    ['AUT016','Ensino Fundamental I','2º ano',2,'Geografia','Lugares do meu bairro','EF02GE05','🏘️'],
    ['AUT017','Ensino Fundamental I','2º ano',3,'Língua Portuguesa','Frases curtas com sequência visual','EF12LP05','📝'],
    ['AUT018','Ensino Fundamental I','2º ano',4,'Matemática','Problemas simples com desenhos','EF02MA06','🧮'],
    ['AUT019','Ensino Fundamental I','3º ano',1,'História','Fontes históricas em imagens','EF03HI02','🏺'],
    ['AUT020','Ensino Fundamental I','3º ano',2,'Língua Portuguesa','Fábula com começo, meio e fim','EF35LP26','🦊'],
    ['AUT021','Ensino Fundamental I','3º ano',3,'Matemática','Multiplicação com grupos visuais','EF03MA07','✖️'],
    ['AUT022','Ensino Fundamental I','3º ano',4,'Ciências','Animais e seus ambientes','EF03CI04','🐾'],
    ['AUT023','Ensino Fundamental I','4º ano',1,'Matemática','Multiplicação passo a passo','EF04MA06','📐'],
    ['AUT024','Ensino Fundamental I','4º ano',2,'Ciências','Cadeia alimentar com setas','EF04CI04','🦋'],
    ['AUT025','Ensino Fundamental I','4º ano',3,'Língua Portuguesa','Ideia principal em texto curto','EF04LP03','📖'],
    ['AUT026','Ensino Fundamental I','5º ano',1,'Matemática','Frações com partes coloridas','EF05MA03','🍕'],
    ['AUT027','Ensino Fundamental I','5º ano',2,'Língua Portuguesa','Compreensão de crônica em blocos','EF05LP10','📰'],
    ['AUT028','Ensino Fundamental I','5º ano',3,'Geografia','Regiões brasileiras com mapa visual','EF05GE02','🗺️'],

    ['AUT029','Ensino Fundamental II','6º ano',1,'Matemática','Números inteiros na reta numérica','EF06MA03','📈'],
    ['AUT030','Ensino Fundamental II','6º ano',2,'Ciências','Misturas e separação em etapas','EF06CI01','🧪'],
    ['AUT031','Ensino Fundamental II','6º ano',3,'Inglês','Identity and everyday language com pictogramas','EF06LI01','💬'],
    ['AUT032','Ensino Fundamental II','7º ano',1,'História','Renascimento em linha do tempo','EF07HI04','🎭'],
    ['AUT033','Ensino Fundamental II','7º ano',2,'Língua Portuguesa','Notícia: fato e opinião','EF07LP01','🎙️'],
    ['AUT034','Ensino Fundamental II','7º ano',3,'Matemática','Razões e proporções com esquemas','EF07MA09','📊'],
    ['AUT035','Ensino Fundamental II','8º ano',1,'Geografia','População e migrações com mapa','EF08GE01','🌎'],
    ['AUT036','Ensino Fundamental II','8º ano',2,'Ciências','Sistema do corpo humano em esquema','EF08CI07','🫀'],
    ['AUT037','Ensino Fundamental II','9º ano',2,'Matemática','Funções e gráficos com leitura guiada','EF09MA06','📉'],
    ['AUT038','Ensino Fundamental II','9º ano',3,'Língua Portuguesa','Argumento e evidência em texto curto','EF89LP14','🗣️'],

    ['AUT039','Ensino Médio','1ª série',1,'Ciências','Ecologia e relações ecológicas em diagrama','EM13CNT202','🌿'],
    ['AUT040','Ensino Médio','1ª série',2,'Matemática','Leitura visual de gráficos e funções','EM13MAT101','📊'],
    ['AUT041','Ensino Médio','2ª série',2,'Ciências','Movimento e velocidade com esquema','EM13CNT204','🚀'],
    ['AUT042','Ensino Médio','3ª série',3,'Língua Portuguesa','Leitura literária com roteiro visual','EM13LP48','📖']
  ];

  const autismActivities = autismSeeds.map(([id, stage, grade, term, subject, topic, bncc, symbol], index) => ({
    id,
    stage,
    grade,
    term,
    subject,
    topic,
    difficulty: index < 10 ? 'Fácil' : index < 28 ? 'Intermediária' : 'Desafiadora',
    bncc,
    symbol,
    colors: index % 4 === 0 ? ['#d9ecff', '#fff1b8']
      : index % 4 === 1 ? ['#ffe1e8', '#e7e0ff']
        : index % 4 === 2 ? ['#dff3dc', '#fff0b7']
          : ['#d9f2ef', '#eee0ff'],
    questions: [
      `Observe o apoio visual sobre ${topic.toLowerCase()} e identifique a informação principal.`,
      `Escolha, aponte ou escreva a resposta correta sobre ${topic.toLowerCase()}.`,
      `Complete uma etapa de cada vez usando palavras, números, desenho ou símbolos.`,
      `Revise sua resposta com o checklist visual antes de finalizar.`
    ],
    answers: [
      'Resposta conforme o elemento principal apresentado no apoio visual.',
      'Resposta compatível com o conteúdo trabalhado e com a forma de comunicação escolhida pelo estudante.',
      'Registro correto da etapa proposta, aceitando resposta por escrita, desenho, seleção ou símbolos quando pedagogicamente adequado.',
      'Espera-se que o estudante utilize o checklist para conferir a própria produção com apoio do professor quando necessário.'
    ],
    hasAnswerKey: true,
    hasFigures: true,
    hasAdapted: true,
    autismSpecific: true,
    description: `Atividade adaptada sobre ${topic.toLowerCase()}, com comandos curtos, apoio visual, uma etapa por vez e possibilidade de resposta multimodal.`
  }));

  const existingIds = new Set(activities.map(activity => activity.id));
  autismActivities
    .filter(activity => !existingIds.has(activity.id))
    .forEach(activity => activities.push(activity));

  const filterToggles = document.querySelector('#library-filters .filter-toggles');
  if (filterToggles && !filterToggles.querySelector('[name="bnccOnly"]')) {
    const label = document.createElement('label');
    label.innerHTML = '<input type="checkbox" name="bnccOnly"> BNCC';
    filterToggles.append(label);
  }

  const originalGetFilters = getFilters;
  getFilters = function getFiltersWithBncc() {
    const filters = originalGetFilters();
    filters.bnccOnly = new FormData(filterForm).has('bnccOnly');
    return filters;
  };

  const originalMatchesFilters = matchesFilters;
  matchesFilters = function matchesFiltersWithBncc(activity, filters) {
    return originalMatchesFilters(activity, filters)
      && (!filters.bnccOnly || Boolean(activity.bncc));
  };

  const originalRenderFilterSummary = renderFilterSummary;
  renderFilterSummary = function renderFilterSummaryWithBncc(filters) {
    originalRenderFilterSummary(filters);
    if (filters.bnccOnly && !activeFilterSummary.textContent.includes('BNCC')) {
      activeFilterSummary.textContent += `${activeFilterSummary.textContent ? ' · ' : 'Filtros ativos: '}com BNCC`;
    }
  };

  renderAutismFeaturedActivities = function renderAllAutismActivities() {
    const shouldShow = autismCategory && !navigation.stage;
    autismFeaturedSection.hidden = !shouldShow;
    if (!shouldShow) {
      autismFeaturedGrid.replaceChildren();
      return;
    }

    const featured = activities.filter(activity => activity.autismSpecific);
    const title = document.querySelector('#autism-featured-title');
    const description = title?.nextElementSibling;
    if (title) title.textContent = '42 atividades adaptadas prontas para usar';
    if (description) description.textContent = 'Todas incluem indicação BNCC, apoio visual, comandos curtos, uma etapa por vez, tempo flexível e formas alternativas de resposta.';

    const cards = featured.map(activity => {
      const card = renderCard(activity);
      card.classList.add('autism-featured-card');
      card.dataset.featuredStage = activity.stage;
      card.querySelectorAll('.favorite-button, .favorite-text-button, .add-button')
        .forEach(button => button.remove());
      return card;
    });
    autismFeaturedGrid.replaceChildren(...cards);
  };

  if (autismCategory) {
    syncSubjectOptions();
    renderAutismFeaturedActivities();
    renderActivities();
  }
})();
