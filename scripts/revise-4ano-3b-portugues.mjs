import fs from 'node:fs';

const FILE = 'data/atividades/fundamental-anos-iniciais/4-ano/3-bimestre/lingua-portuguesa.json';
const BNCC_SOURCE = 'https://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf';

const SKILLS = {
  EF04LP04: ['Usar acento gráfico (agudo ou circunflexo) em paroxítonas terminadas em -i(s), -l, -r, -ão(s).', 'Usar'],
  EF04LP05: ['Identificar a função na leitura e usar, adequadamente, na escrita ponto final, de interrogação, de exclamação, dois-pontos e travessão em diálogos (discurso direto), vírgula em enumerações e em separação de vocativo e de aposto.', 'Identificar e usar'],
  EF04LP13: ['Identificar e reproduzir, em textos injuntivos instrucionais (instruções de jogos digitais ou impressos), a formatação própria desses textos (verbos imperativos, indicação de passos a ser seguidos) e formato específico dos textos orais ou escritos desses gêneros (lista/apresentação de materiais e instruções/passos de jogo).', 'Identificar e reproduzir'],
  EF04LP14: ['Identificar, em notícias, fatos, participantes, local e tempo da ocorrência do fato noticiado.', 'Identificar'],
  EF04LP15: ['Distinguir fatos de opiniões/sugestões em textos (informativos, jornalísticos, publicitários etc.).', 'Distinguir'],
  EF04LP16: ['Produzir notícias sobre fatos ocorridos no universo escolar, digitais ou impressas, para o jornal da escola, noticiando os fatos e seus atores e comentando decorrências, de acordo com as convenções do gênero notícia e considerando a situação comunicativa e o tema/assunto do texto.', 'Produzir'],
  EF04LP17: ['Produzir jornais radiofônicos ou televisivos e entrevistas veiculadas em rádio, TV e na internet, orientando-se por roteiro ou texto e demonstrando conhecimento dos gêneros jornal falado/televisivo e entrevista.', 'Produzir'],
  EF04LP19: ['Ler e compreender textos expositivos de divulgação científica para crianças, considerando a situação comunicativa e o tema/assunto do texto.', 'Ler e compreender'],
  EF04LP20: ['Reconhecer a função de gráficos, diagramas e tabelas em textos, como forma de apresentação de dados e informações.', 'Reconhecer'],
  EF04LP23: ['Identificar e reproduzir, em verbetes de enciclopédia infantil, digitais ou impressos, a formatação e diagramação específica desse gênero (título do verbete, definição, detalhamento, curiosidades), considerando a situação comunicativa e o tema/assunto/finalidade do texto.', 'Identificar e reproduzir'],
  EF15LP01: ['Identificar a função social de textos que circulam em campos da vida social dos quais participa cotidianamente (a casa, a rua, a comunidade, a escola) e nas mídias impressa, de massa e digital, reconhecendo para que foram produzidos, onde circulam, quem os produziu e a quem se destinam.', 'Identificar'],
  EF15LP03: ['Localizar informações explícitas em textos.', 'Localizar'],
  EF15LP04: ['Identificar o efeito de sentido produzido pelo uso de recursos expressivos gráfico-visuais em textos multissemióticos.', 'Identificar'],
  EF15LP05: ['Planejar, com a ajuda do professor, o texto que será produzido, considerando a situação comunicativa, os interlocutores (quem escreve/para quem escreve); a finalidade ou o propósito (escrever para quê); a circulação (onde o texto vai circular); o suporte (qual é o portador do texto); a linguagem, organização e forma do texto e seu tema, pesquisando em meios impressos ou digitais, sempre que for preciso, informações necessárias à produção do texto, organizando em tópicos os dados e as fontes pesquisadas.', 'Planejar'],
  EF15LP06: ['Reler e revisar o texto produzido com a ajuda do professor e a colaboração dos colegas, para corrigi-lo e aprimorá-lo, fazendo cortes, acréscimos, reformulações, correções de ortografia e pontuação.', 'Reler e revisar'],
  EF15LP14: ['Construir o sentido de histórias em quadrinhos e tirinhas, relacionando imagens e palavras e interpretando recursos gráficos (tipos de balões, de letras, onomatopeias).', 'Construir o sentido'],
  EF35LP06: ['Recuperar relações entre partes de um texto, identificando substituições lexicais (de substantivos por sinônimos) ou pronominais (uso de pronomes anafóricos – pessoais, possessivos, demonstrativos) que contribuem para a continuidade do texto.', 'Recuperar'],
  EF35LP09: ['Organizar o texto em unidades de sentido, dividindo-o em parágrafos segundo as normas gráficas e de acordo com as características do gênero textual.', 'Organizar'],
  EF35LP16: ['Identificar e reproduzir, em notícias, manchetes, lides e corpo de notícias simples para público infantil e cartas de reclamação (revista infantil), digitais ou impressos, a formatação e diagramação específica de cada um desses gêneros, inclusive em suas versões orais.', 'Identificar e reproduzir'],
  EF35LP21: ['Ler e compreender, de forma autônoma, textos literários de diferentes gêneros e extensões, inclusive aqueles sem ilustrações, estabelecendo preferências por gêneros, temas, autores.', 'Ler e compreender'],
  EF35LP23: ['Apreciar poemas e outros textos versificados, observando rimas, aliterações e diferentes modos de divisão dos versos, estrofes e refrões e seu efeito de sentido.', 'Apreciar'],
  EF35LP25: ['Criar narrativas ficcionais, com certa autonomia, utilizando detalhes descritivos, sequências de eventos e imagens apropriadas para sustentar o sentido do texto, e marcadores de tempo, espaço e de fala de personagens.', 'Criar'],
  EF35LP26: ['Ler e compreender, com certa autonomia, narrativas ficcionais que apresentem cenários e personagens, observando os elementos da estrutura narrativa: enredo, tempo, espaço, personagens, narrador e a construção do discurso indireto e discurso direto.', 'Ler e compreender'],
  EF35LP29: ['Identificar, em narrativas, cenário, personagem central, conflito gerador, resolução e o ponto de vista com base no qual histórias são narradas, diferenciando narrativas em primeira e terceira pessoas.', 'Identificar']
};

const q = (numero, enunciado, tipo = 'resposta-curta', alternativas = [], espacoResposta = 'medio') => ({ numero, tipo, enunciado, alternativas, espacoResposta, figuraId: null });
const a = (numero, resposta, justificativa) => ({ numero, resposta, justificativa });
const skillObjects = codes => codes.map(codigo => ({ codigo, habilidadeOficial: SKILLS[codigo][0], verbo: SKILLS[codigo][1], fonte: BNCC_SOURCE }));

function news(s) {
  const content = `${s.when}, ${s.actors} ${s.event} ${s.place}. ${s.detail} Segundo ${s.source}, “${s.quote}”. ${s.impact}`;
  const base = [
    q(1, `Qual é o fato principal apresentado na notícia “${s.title}”?`),
    q(2, 'Quem participou diretamente do acontecimento noticiado?'),
    q(3, 'Onde o fato aconteceu?'),
    q(4, 'Quando o fato aconteceu?'),
    q(5, 'Qual fonte é citada no texto e que informação ela acrescenta?'),
    q(6, 'Que consequência ou resultado do acontecimento é informado no texto?', 'interpretacao', [], 'grande')
  ];
  const ans = [
    a(1, s.eventAnswer, 'A resposta retoma o acontecimento central informado no início da notícia.'),
    a(2, s.actorsAnswer, 'Os participantes são identificados explicitamente no texto.'),
    a(3, s.placeAnswer, 'O local aparece de forma explícita.'),
    a(4, s.whenAnswer, 'O marcador temporal informa quando ocorreu o fato.'),
    a(5, `${s.source}. ${s.sourceAnswer}`, 'A notícia atribui essa informação a uma fonte identificada.'),
    a(6, s.impactAnswer, 'A consequência está explicitada no fechamento da notícia.')
  ];
  if (s.mode === 'fact') {
    base.push(q(7, `A fala “${s.quote}” é apresentada como fato verificado pela notícia ou como avaliação/opinião da fonte? Explique.`));
    base.push(q(8, 'Escreva uma frase factual, verificável, que poderia ser acrescentada à notícia sem apresentar opinião.', 'producao', [], 'grande'));
    ans.push(a(7, s.quoteKind, 'A classificação deve considerar se a frase pode ser comprovada diretamente ou se expressa avaliação da pessoa citada.'));
    ans.push(a(8, 'Resposta pessoal, desde que apresente informação verificável relacionada ao fato, sem adjetivação opinativa.', 'Avaliar objetividade, relação com o acontecimento e possibilidade de verificação.'));
  } else if (s.mode === 'production') {
    base.push(q(7, 'Escreva um lide de uma ou duas frases que responda: o que aconteceu, quem participou, onde e quando.', 'producao', [], 'grande'));
    base.push(q(8, 'Crie uma manchete curta e objetiva para essa notícia escolar.', 'producao', [], 'grande'));
    ans.push(a(7, `Resposta esperada deve reunir o fato (${s.eventAnswer}), os participantes (${s.actorsAnswer}), o local (${s.placeAnswer}) e o tempo (${s.whenAnswer}).`, 'O lide deve concentrar as informações essenciais da notícia.'));
    ans.push(a(8, 'Resposta pessoal: manchete curta, informativa, coerente com o fato e sem opinião.', 'A manchete deve antecipar o assunto central da notícia.'));
  } else {
    base.push(q(7, 'Explique por que o primeiro período funciona como um lide da notícia.', 'analise-texto', [], 'grande'));
    base.push(q(8, 'Escreva uma nova manchete objetiva que destaque o fato principal.', 'producao', [], 'grande'));
    ans.push(a(7, 'Porque concentra informações essenciais sobre o que aconteceu, quem participou, onde e quando.', 'Esses elementos caracterizam o lide de uma notícia simples.'));
    ans.push(a(8, 'Resposta pessoal, desde que seja curta, informativa e coerente com o fato principal.', 'Avaliar clareza, objetividade e relação com o acontecimento.'));
  }
  return { objective: s.objective, supportTitle: s.headline, supportText: content, questions: base, answers: ans };
}

function science(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: `${s.subject} ${s.definition} ${s.process} ${s.example} ${s.curiosity}`,
    questions: [
      q(1, `Qual é o assunto científico principal do texto “${s.title}”?`),
      q(2, `Segundo o texto, o que é ${s.keyTerm}?`),
      q(3, `Como acontece ${s.processName}?`, 'explicacao', [], 'grande'),
      q(4, 'Que exemplo do cotidiano ajuda a compreender a explicação científica?'),
      q(5, `No contexto, o que significa a palavra “${s.word}”?`),
      q(6, 'Qual informação do texto pode ser considerada uma curiosidade científica?'),
      q(7, 'Explique como o texto usa explicação e exemplo para tornar a informação científica compreensível para crianças.', 'analise-texto', [], 'grande'),
      q(8, `Escreva duas frases explicando ${s.keyTerm} para um colega que não leu o texto.`, 'producao', [], 'grande')
    ],
    answers: [
      a(1, s.subjectAnswer, 'O assunto aparece ao longo de toda a explicação.'),
      a(2, s.definitionAnswer, 'A definição está explicitada no texto.'),
      a(3, s.processAnswer, 'A resposta deve recuperar a sequência explicativa apresentada.'),
      a(4, s.exampleAnswer, 'O exemplo aproxima o conceito de uma situação cotidiana.'),
      a(5, s.wordAnswer, 'O sentido é inferido pelo contexto da explicação.'),
      a(6, s.curiosityAnswer, 'A curiosidade amplia a informação principal.'),
      a(7, s.analysisAnswer, 'O estudante deve relacionar o recurso expositivo à finalidade de divulgação científica.'),
      a(8, 'Resposta pessoal, com duas frases corretas e coerentes com as informações científicas do texto.', 'Avaliar fidelidade ao texto e clareza da explicação.')
    ]
  };
}

function dataReading(s) {
  const rows = s.rows.map(([label, value]) => `${label}: ${value}`).join('; ');
  const max = [...s.rows].sort((x,y)=>y[1]-x[1])[0];
  const min = [...s.rows].sort((x,y)=>x[1]-y[1])[0];
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: `${s.context} Os dados foram organizados ${s.format}: ${rows}. ${s.note}`,
    questions: [
      q(1, `Qual categoria apresenta o maior valor no levantamento “${s.title}”?`),
      q(2, 'Qual categoria apresenta o menor valor?'),
      q(3, `Quantos registros há em ${s.askA}?`),
      q(4, `Qual é a diferença entre ${s.askB} e ${s.askC}?`, 'comparacao'),
      q(5, `Qual é a função do ${s.formatName} nesse texto?`, 'analise-texto'),
      q(6, `Escreva uma conclusão correta a partir dos dados apresentados.`, 'conclusao', [], 'grande'),
      q(7, 'Explique por que apresentar os números de forma organizada facilita a comparação das informações.', 'analise-texto', [], 'grande'),
      q(8, 'Proponha uma ação da turma baseada em um dos dados e justifique com um número do levantamento.', 'producao', [], 'grande')
    ],
    answers: [
      a(1, `${max[0]}, com ${max[1]}.`, 'É o maior valor apresentado.'),
      a(2, `${min[0]}, com ${min[1]}.`, 'É o menor valor apresentado.'),
      a(3, String(s.valueA), 'O valor é lido diretamente nos dados.'),
      a(4, String(s.diff), 'A diferença é obtida comparando os dois valores indicados.'),
      a(5, `Organizar os dados de modo que o leitor possa localizar e comparar informações com rapidez.`, 'Gráficos, tabelas e diagramas sintetizam informações quantitativas.'),
      a(6, s.conclusion, 'A conclusão deve ser sustentada pelos números apresentados.'),
      a(7, 'Porque a organização visual reúne categorias e valores em um mesmo padrão, permitindo perceber maiores, menores e diferenças.', 'A resposta relaciona forma de apresentação e leitura de dados.'),
      a(8, 'Resposta pessoal, desde que proponha uma ação coerente e cite corretamente ao menos um dado numérico.', 'Avaliar uso de evidência do levantamento.')
    ]
  };
}

function narrative(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: s.text,
    questions: [
      q(1, `Quem é o personagem central do texto “${s.title}”?`),
      q(2, 'Onde a história acontece?'),
      q(3, 'Qual acontecimento inicia o problema ou conflito da narrativa?'),
      q(4, 'Que atitude do personagem contribui para a solução do problema?', 'interpretacao'),
      q(5, 'O narrador conta a história em primeira ou em terceira pessoa? Cite uma pista do texto.'),
      q(6, 'Organize em ordem: situação inicial, conflito e resolução, resumindo cada momento em uma frase.', 'ordenacao', [], 'grande'),
      q(7, `Que característica do personagem pode ser inferida por suas ações? Justifique com uma ação do texto.`, 'inferencia', [], 'grande'),
      q(8, 'Escreva outro título para a narrativa que tenha relação com o conflito ou com a solução.', 'producao', [], 'grande')
    ],
    answers: [
      a(1, s.character, 'O personagem conduz os acontecimentos principais.'),
      a(2, s.setting, 'O cenário é informado no texto.'),
      a(3, s.conflict, 'Esse acontecimento rompe a situação inicial e cria o problema.'),
      a(4, s.solutionAction, 'A ação está ligada à resolução do conflito.'),
      a(5, s.pointOfView, 'A resposta deve indicar uma marca linguística coerente com o foco narrativo.'),
      a(6, s.sequence, 'A ordem deve respeitar o desenvolvimento do enredo.'),
      a(7, s.trait, 'A inferência deve ser sustentada por uma ação do personagem.'),
      a(8, 'Resposta pessoal, desde que o título seja coerente com a narrativa.', 'Avaliar relação entre título e conteúdo.')
    ]
  };
}

function narrativeProduction(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: s.text,
    questions: [
      q(1, 'Quem é o personagem principal do texto-modelo?'),
      q(2, 'Qual marcador indica quando a história acontece?'),
      q(3, 'Qual expressão indica onde a ação ocorre?'),
      q(4, 'Qual é o problema enfrentado pelo personagem?'),
      q(5, 'Copie uma expressão que descreva o personagem, o objeto ou o lugar.'),
      q(6, 'Planeje uma nova narrativa: indique personagem, lugar e problema.', 'planejamento', [], 'grande'),
      q(7, 'Escreva três acontecimentos em sequência para desenvolver a narrativa planejada.', 'producao', [], 'grande'),
      q(8, 'Escreva um desfecho coerente que resolva ou encerre o problema apresentado no seu planejamento.', 'producao', [], 'grande')
    ],
    answers: [
      a(1, s.character, 'O personagem principal aparece no centro da ação.'),
      a(2, s.timeMarker, 'O marcador temporal situa o início do enredo.'),
      a(3, s.placeMarker, 'A expressão localiza espacialmente os acontecimentos.'),
      a(4, s.problem, 'O conflito é o obstáculo que movimenta a história.'),
      a(5, s.description, 'Aceitar o trecho indicado ou outro detalhe descritivo correto do texto.'),
      a(6, 'Resposta pessoal com personagem, lugar e problema claramente definidos.', 'O planejamento deve prever elementos básicos da narrativa.'),
      a(7, 'Resposta pessoal com três acontecimentos em ordem lógica e relacionados ao problema planejado.', 'Avaliar sequência temporal e coerência.'),
      a(8, 'Resposta pessoal com encerramento coerente em relação ao problema e aos acontecimentos anteriores.', 'O desfecho deve concluir a narrativa sem contradizer o planejamento.')
    ]
  };
}

function accent(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: `Observe as palavras usadas no mural da turma: ${s.words.join(', ')}. Todas são paroxítonas e recebem acento conforme a terminação estudada. O dicionário pode ajudar a confirmar a grafia e a divisão silábica.`,
    questions: [
      q(1, `Separe em sílabas a palavra “${s.w1}” e indique a sílaba tônica.`),
      q(2, `Qual sinal gráfico aparece em “${s.w2}”?`),
      q(3, `Qual é a terminação da palavra “${s.w3}” que explica sua acentuação?`),
      q(4, `Reescreva corretamente sem retirar o acento: ${s.w4.toUpperCase()}.`),
      q(5, `Entre ${s.choice.join(', ')}, quais palavras seguem a mesma regra de acentuação?`, 'classificacao'),
      q(6, 'Explique por que consultar um dicionário ajuda quando há dúvida sobre a grafia de uma palavra.'),
      q(7, `Escreva uma frase usando corretamente duas palavras da lista.`, 'producao', [], 'grande'),
      q(8, 'Registre duas novas palavras paroxítonas que terminem como alguma das palavras estudadas e que, por isso, recebam acento.', 'producao', [], 'grande')
    ],
    answers: [
      a(1, s.a1, 'A separação e a identificação da sílaba tônica devem corresponder à pronúncia da palavra.'),
      a(2, s.a2, 'O acento é visível na grafia da palavra.'),
      a(3, s.a3, 'A terminação integra a regra de acentuação trabalhada.'),
      a(4, s.w4, 'A palavra deve manter sua acentuação correta.'),
      a(5, s.a5, 'As palavras indicadas apresentam a terminação prevista pela regra.'),
      a(6, 'Porque o dicionário registra a forma ortográfica convencional e permite confirmar como a palavra é escrita.', 'A resposta deve relacionar consulta e verificação da grafia.'),
      a(7, 'Resposta pessoal, desde que use duas palavras da lista com grafia e sentido adequados.', 'Avaliar uso contextual e acentuação.'),
      a(8, s.a8, 'Aceitar outras palavras corretas que atendam à regra.')
    ]
  };
}

function letter(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: s.text,
    questions: [
      q(1, 'Quem escreveu a carta?'),
      q(2, 'Para quem a carta foi escrita?'),
      q(3, 'Qual é a finalidade principal da mensagem?'),
      q(4, 'Qual expressão funciona como saudação?'),
      q(5, 'Qual trecho mostra uma informação importante para o destinatário?'),
      q(6, 'Que elemento do final da carta identifica quem escreveu?'),
      q(7, 'Explique por que a linguagem usada é adequada à relação entre remetente e destinatário.', 'analise-texto', [], 'grande'),
      q(8, 'Escreva uma resposta curta à carta, mantendo destinatário, assunto e tom adequados.', 'producao', [], 'grande')
    ],
    answers: [
      a(1, s.sender, 'O remetente aparece identificado ao final.'),
      a(2, s.recipient, 'O destinatário é indicado na saudação.'),
      a(3, s.purpose, 'A finalidade é inferida pelo assunto central da mensagem.'),
      a(4, s.greeting, 'A saudação abre a comunicação com o destinatário.'),
      a(5, s.importantInfo, 'O trecho recupera a informação central da carta.'),
      a(6, 'A assinatura do remetente.', 'A assinatura identifica quem escreveu a carta.'),
      a(7, s.languageAnswer, 'A análise deve relacionar escolhas linguísticas, interlocutores e situação comunicativa.'),
      a(8, 'Resposta pessoal, com saudação, mensagem coerente com o assunto e identificação do remetente.', 'Avaliar adequação ao gênero e ao interlocutor.')
    ]
  };
}

function entry(s) {
  return {
    objective: s.objective,
    supportTitle: s.term,
    supportText: `${s.term}. ${s.definition} ${s.details} Curiosidade: ${s.curiosity}`,
    questions: [
      q(1, `O que é ${s.term}, segundo o verbete?`),
      q(2, 'Qual trecho apresenta a definição do termo?'),
      q(3, 'Cite duas informações de detalhamento apresentadas depois da definição.'),
      q(4, 'Qual informação aparece marcada como curiosidade?'),
      q(5, 'Por que o título do verbete é formado pelo nome do assunto explicado?'),
      q(6, 'Organize as partes do verbete na ordem em que aparecem: curiosidade, definição, título e detalhamento.', 'ordenacao'),
      q(7, `Escreva uma frase de definição para um verbete sobre “${s.newTerm}”.`, 'producao', [], 'grande'),
      q(8, `Produza uma curiosidade adequada para completar esse novo verbete.`, 'producao', [], 'grande')
    ],
    answers: [
      a(1, s.definitionAnswer, 'A definição aparece logo após o título.'),
      a(2, s.definition, 'É a frase que apresenta o que o termo significa.'),
      a(3, s.detailAnswer, 'Aceitar duas informações corretas do detalhamento.'),
      a(4, s.curiosity, 'A informação está identificada como curiosidade.'),
      a(5, 'Porque o título indica ao leitor qual palavra, ser, objeto ou conceito será explicado no verbete.', 'Essa organização é característica do gênero.'),
      a(6, 'Título; definição; detalhamento; curiosidade.', 'Essa é a organização do verbete apresentado.'),
      a(7, 'Resposta pessoal em forma de definição objetiva, dizendo o que é o termo proposto.', 'Avaliar clareza e função definidora.'),
      a(8, 'Resposta pessoal, desde que seja uma informação adicional pertinente ao assunto do novo verbete.', 'A curiosidade deve ampliar, e não repetir, a definição.')
    ]
  };
}

function poem(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: s.lines.join('\n'),
    questions: [
      q(1, `Quantos versos há no poema “${s.title}”?`),
      q(2, 'Quantas estrofes há no poema?'),
      q(3, `Quais palavras formam a rima destacada pelo som final na primeira estrofe?`),
      q(4, `Que imagem poética é criada pelo verso “${s.imageLine}”?`, 'interpretacao', [], 'grande'),
      q(5, 'Que sensação ou sentimento predomina no poema? Justifique com uma palavra ou verso.'),
      q(6, 'Explique como a repetição de sons ou a rima contribui para o ritmo do poema.', 'analise-texto', [], 'grande'),
      q(7, 'Escreva dois versos sobre o mesmo tema usando palavras que rimem.', 'producao', [], 'grande'),
      q(8, 'Dê outro título ao poema e explique em uma frase por que ele combina com o texto.', 'producao', [], 'grande')
    ],
    answers: [
      a(1, String(s.verseCount), 'Cada linha do poema corresponde a um verso.'),
      a(2, String(s.stanzaCount), 'As estrofes são os blocos de versos separados no texto.'),
      a(3, s.rhyme, 'As palavras apresentam sons finais semelhantes.'),
      a(4, s.imageAnswer, 'A resposta deve interpretar a linguagem figurada do verso.'),
      a(5, s.feeling, 'A justificativa deve se apoiar em elemento do poema.'),
      a(6, 'A rima e a repetição aproximam sons, marcam o ritmo e tornam a leitura mais musical.', 'A resposta relaciona recurso sonoro e efeito de sentido.'),
      a(7, 'Resposta pessoal com dois versos coerentes com o tema e ao menos uma aproximação de rima.', 'Avaliar produção poética e recurso sonoro.'),
      a(8, 'Resposta pessoal, desde que o novo título se relacione ao tema ou a uma imagem importante do poema.', 'Avaliar justificativa e coerência.')
    ]
  };
}

function comics(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: `A tirinha tem três quadros. No primeiro, ${s.p1} No segundo, ${s.p2} No terceiro, ${s.p3}`,
    questions: [
      q(1, 'O que acontece no primeiro quadro da tirinha?'),
      q(2, `O que a expressão “${s.expression}” revela sobre o personagem?`, 'inferencia'),
      q(3, `Que efeito a onomatopeia “${s.sound}” produz na cena?`),
      q(4, 'Como a sequência das imagens ajuda a entender o que mudou do primeiro para o último quadro?', 'interpretacao', [], 'grande'),
      q(5, 'Qual informação é compreendida principalmente pela imagem e não apenas pelas palavras?'),
      q(6, 'Explique a graça, surpresa ou desfecho da tirinha com base na relação entre os quadros.', 'interpretacao', [], 'grande'),
      q(7, 'Crie uma fala curta que poderia ser colocada em um balão no último quadro sem mudar o sentido da cena.', 'producao', [], 'grande'),
      q(8, 'Indique um recurso gráfico típico de quadrinhos e explique sua função.', 'analise-texto', [], 'grande')
    ],
    answers: [
      a(1, s.a1, 'A resposta deve recuperar a ação inicial descrita.'),
      a(2, s.a2, 'A expressão permite inferir o estado ou a intenção do personagem.'),
      a(3, s.a3, 'A onomatopeia representa visualmente um som da ação.'),
      a(4, s.a4, 'A leitura em sequência constrói a progressão da ação.'),
      a(5, s.a5, 'A informação depende da leitura do componente visual.'),
      a(6, s.a6, 'O sentido resulta da relação entre os acontecimentos dos quadros.'),
      a(7, 'Resposta pessoal, desde que seja curta e coerente com a situação do último quadro.', 'Avaliar adequação ao contexto e ao gênero.'),
      a(8, 'Exemplos: balão de fala, balão de pensamento, onomatopeia, letras ampliadas ou expressão facial; a explicação deve indicar sua função na construção do sentido.', 'Aceitar recurso gráfico pertinente e explicação adequada.')
    ]
  };
}

function instructions(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: `${s.intro} Materiais: ${s.materials}. Como fazer: 1. ${s.steps[0]} 2. ${s.steps[1]} 3. ${s.steps[2]} 4. ${s.steps[3]}`,
    questions: [
      q(1, 'Qual é a finalidade do texto instrucional?'),
      q(2, 'Quais materiais são necessários?'),
      q(3, 'Qual é a primeira ação que deve ser realizada?'),
      q(4, 'Por que os passos aparecem numerados?'),
      q(5, `Que ideia o verbo “${s.verb}” expressa nesse texto?`),
      q(6, 'O que poderia dar errado se o leitor invertesse o segundo e o terceiro passos?', 'inferencia', [], 'grande'),
      q(7, 'Reescreva um dos passos usando outro verbo no imperativo, sem mudar a ação principal.', 'producao', [], 'grande'),
      q(8, 'Acrescente um quinto passo coerente com a atividade, mantendo a linguagem de instrução.', 'producao', [], 'grande')
    ],
    answers: [
      a(1, s.purpose, 'A finalidade é orientar o leitor a executar a atividade.'),
      a(2, s.materialAnswer, 'Os materiais aparecem listados antes dos passos.'),
      a(3, s.steps[0], 'É o passo indicado pelo número 1.'),
      a(4, 'Para indicar a ordem em que as ações devem ser realizadas e facilitar o acompanhamento.', 'A numeração organiza a sequência do procedimento.'),
      a(5, s.verbAnswer, 'O verbo orienta uma ação que o leitor deve executar.'),
      a(6, s.inversionAnswer, 'A resposta deve considerar a dependência entre as etapas.'),
      a(7, 'Resposta pessoal, desde que mantenha a ação e use forma verbal adequada à instrução.', 'Avaliar equivalência de sentido e linguagem injuntiva.'),
      a(8, 'Resposta pessoal com uma ação possível depois dos quatro passos, escrita como instrução.', 'Avaliar sequência lógica e clareza.')
    ]
  };
}

function interview(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: `${s.intro}\nEntrevistador: ${s.q1}\n${s.guest}: ${s.r1}\nEntrevistador: ${s.q2}\n${s.guest}: ${s.r2}\nEntrevistador: ${s.q3}\n${s.guest}: ${s.r3}`,
    questions: [
      q(1, 'Quem é a pessoa entrevistada e por que ela foi escolhida para falar sobre o tema?'),
      q(2, `Qual informação aparece na resposta à pergunta “${s.q1}”?`),
      q(3, 'Qual pergunta pede uma explicação, e não apenas uma resposta de sim ou não?'),
      q(4, 'Que informação nova a segunda resposta acrescenta ao tema da entrevista?'),
      q(5, 'Explique por que as perguntas estão organizadas em uma sequência lógica.', 'analise-texto', [], 'grande'),
      q(6, `Escreva uma nova pergunta aberta que poderia ser feita a ${s.guest}.`, 'producao', [], 'grande'),
      q(7, 'Monte um roteiro com três tópicos que o entrevistador deveria conferir antes da gravação.', 'planejamento', [], 'grande'),
      q(8, 'Transforme uma das respostas em uma frase curta para apresentar oralmente a informação principal da entrevista.', 'producao', [], 'grande')
    ],
    answers: [
      a(1, s.guestReason, 'A identificação e a pertinência do entrevistado aparecem na introdução.'),
      a(2, s.a2, 'A resposta é recuperada diretamente do primeiro par pergunta-resposta.'),
      a(3, s.openQuestion, 'Perguntas abertas solicitam desenvolvimento ou explicação.'),
      a(4, s.a4, 'A segunda resposta amplia o assunto com informação específica.'),
      a(5, s.sequenceAnswer, 'A organização do roteiro deve favorecer continuidade temática.'),
      a(6, 'Resposta pessoal, desde que seja uma pergunta aberta, pertinente ao tema e dirigida ao entrevistado.', 'Avaliar relação com o objetivo da entrevista.'),
      a(7, 'Resposta possível: conferir o tema e o objetivo; ordenar as perguntas; verificar nomes, equipamentos e tempo de fala.', 'Aceitar roteiro equivalente com três providências pertinentes.'),
      a(8, 'Resposta pessoal que sintetize corretamente uma informação dada pelo entrevistado.', 'Avaliar fidelidade à resposta original e clareza oral.')
    ]
  };
}

function campaign(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: `Campanha da ${s.author} para ${s.audience}. Frase principal: “${s.slogan}”. Informação: ${s.fact} Avaliação de um estudante: “${s.opinion}”. Imagem sugerida no cartaz: ${s.image}.`,
    questions: [
      q(1, 'Qual é a finalidade da campanha?'),
      q(2, 'Quem produziu a campanha e a quem ela se dirige?'),
      q(3, `Que ação o verbo presente em “${s.slogan}” pede ao leitor?`),
      q(4, `A frase “${s.fact}” apresenta fato, opinião ou sugestão? Justifique.`),
      q(5, `A frase “${s.opinion}” apresenta fato ou opinião? Qual palavra ou ideia mostra isso?`),
      q(6, 'Explique como a imagem sugerida reforça a mensagem da campanha.', 'interpretacao', [], 'grande'),
      q(7, 'Escreva uma nova chamada curta, no imperativo, para a mesma campanha.', 'producao', [], 'grande'),
      q(8, 'Indique uma informação verificável que poderia ser acrescentada ao cartaz sem transformá-la em opinião.', 'producao', [], 'grande')
    ],
    answers: [
      a(1, s.purpose, 'A campanha procura orientar ou mobilizar um público para uma ação.'),
      a(2, `${s.author}; público: ${s.audience}.`, 'Autor e destinatário aparecem na apresentação do cartaz.'),
      a(3, s.action, 'O verbo no imperativo chama o leitor para agir.'),
      a(4, s.factKind, 'A classificação deve considerar possibilidade de verificação ou caráter de recomendação.'),
      a(5, s.opinionAnswer, 'A frase expressa avaliação subjetiva, não um dado comprovável da campanha.'),
      a(6, s.imageAnswer, 'O recurso visual deve ser relacionado à mensagem verbal.'),
      a(7, 'Resposta pessoal, curta, coerente com o tema e escrita como chamada para ação.', 'Avaliar emprego de linguagem persuasiva adequada.'),
      a(8, 'Resposta pessoal, desde que seja verificável, pertinente ao tema e formulada sem julgamento subjetivo.', 'Avaliar distinção entre fato e opinião.')
    ]
  };
}

function dialogue(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: `${s.intro}\n— ${s.lines[0]}\n— ${s.lines[1]}\n— ${s.lines[2]}\n— ${s.lines[3]}`,
    questions: [
      q(1, 'Que sinal marca o início das falas no diálogo?'),
      q(2, 'Copie uma frase interrogativa e explique por que ela termina com ponto de interrogação.'),
      q(3, 'Copie uma frase exclamativa e explique o efeito do ponto de exclamação.'),
      q(4, 'Qual é a função dos dois-pontos na frase que anuncia o diálogo?'),
      q(5, 'Reescreva uma das falas em discurso indireto, usando um verbo como perguntou, respondeu ou explicou.', 'producao', [], 'grande'),
      q(6, 'Acrescente uma nova fala ao diálogo usando corretamente travessão e um sinal de pontuação final.', 'producao', [], 'grande'),
      q(7, 'Explique como a pontuação ajuda o leitor a distinguir pergunta, resposta e emoção das personagens.', 'analise-texto', [], 'grande'),
      q(8, 'Revise esta frase e pontue-a como uma fala de personagem: voce trouxe o livro', 'revisao', [], 'grande')
    ],
    answers: [
      a(1, 'O travessão.', 'Ele marca o início de cada fala no discurso direto.'),
      a(2, s.questionLine, 'O ponto de interrogação indica que a personagem faz uma pergunta.'),
      a(3, s.exclamationLine, 'O ponto de exclamação intensifica emoção, surpresa, ordem ou entusiasmo.'),
      a(4, 'Anunciar que, a seguir, começam as falas ou uma citação.', 'Os dois-pontos introduzem o diálogo.'),
      a(5, 'Resposta pessoal correta, transformando a fala escolhida em discurso indireto e preservando seu sentido.', 'Avaliar mudança de estrutura sem perda da informação.'),
      a(6, 'Resposta pessoal iniciada por travessão e com pontuação final adequada ao tipo de fala.', 'Avaliar uso do discurso direto.'),
      a(7, 'A pontuação sinaliza a intenção das frases e organiza a troca de falas, ajudando a identificar perguntas, respostas e emoções.', 'A resposta deve relacionar sinais e efeitos de leitura.'),
      a(8, '— Você trouxe o livro?', 'A frase é uma pergunta direta, iniciada por travessão e encerrada por interrogação.')
    ]
  };
}

function cohesion(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: s.text,
    questions: [
      q(1, `A quem o pronome “${s.pronoun1}” se refere no texto?`),
      q(2, `Que palavra ou expressão retoma “${s.noun}” sem repeti-lo exatamente?`),
      q(3, 'Por que essas retomadas ajudam a leitura do parágrafo?'),
      q(4, `Substitua a repetição em “${s.bad}” por um pronome ou expressão equivalente.`, 'revisao'),
      q(5, `No trecho “${s.pronounSentence}”, qual informação anterior é recuperada?`),
      q(6, 'Explique a diferença entre repetir o mesmo substantivo muitas vezes e usar retomadas pronominais ou lexicais.', 'analise-texto', [], 'grande'),
      q(7, 'Reescreva duas frases do texto unindo-as e evitando repetição desnecessária.', 'producao', [], 'grande'),
      q(8, 'Crie duas frases sobre outro personagem usando um nome na primeira e um pronome que o retome na segunda.', 'producao', [], 'grande')
    ],
    answers: [
      a(1, s.a1, 'O referente é identificado pela informação anterior do texto.'),
      a(2, s.a2, 'A expressão mantém o referente sem repetição literal.'),
      a(3, 'Elas evitam repetições excessivas e ajudam a manter a continuidade entre as frases.', 'Esse é o papel coesivo das substituições lexicais e pronominais.'),
      a(4, s.a4, 'Aceitar outra reescrita que elimine a repetição e preserve o sentido.'),
      a(5, s.a5, 'A retomada depende da relação com a informação anterior.'),
      a(6, 'A repetição excessiva pode tornar o texto cansativo; as retomadas mantêm o assunto e conectam as frases com mais fluidez.', 'A resposta deve explicar função de continuidade textual.'),
      a(7, 'Resposta pessoal, desde que preserve o sentido e empregue uma retomada adequada.', 'Avaliar coesão e ausência de ambiguidade.'),
      a(8, 'Resposta pessoal com referente claro entre o nome e o pronome usado na frase seguinte.', 'Avaliar correspondência pronominal e continuidade.')
    ]
  };
}

function paragraph(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: s.text,
    questions: [
      q(1, 'Quantos parágrafos há no texto-modelo?'),
      q(2, 'Qual é a ideia principal do primeiro parágrafo?'),
      q(3, 'Qual é a ideia principal do segundo parágrafo?'),
      q(4, 'Por que separar essas duas ideias em parágrafos melhora a organização do texto?'),
      q(5, `Em qual parágrafo a frase “${s.sentence}” se encaixa melhor? Justifique.`),
      q(6, 'Dê um título curto que represente o assunto dos dois parágrafos.'),
      q(7, 'Reescreva um dos parágrafos acrescentando uma frase que desenvolva sua ideia principal.', 'producao', [], 'grande'),
      q(8, 'Revise o texto produzido na questão anterior: verifique pontuação, repetição de palavras e se todas as frases tratam da mesma ideia.', 'revisao', [], 'grande')
    ],
    answers: [
      a(1, 'Dois parágrafos.', 'O texto-modelo apresenta dois blocos de sentido.'),
      a(2, s.idea1, 'Essa é a ideia central desenvolvida no primeiro bloco.'),
      a(3, s.idea2, 'Essa é a ideia central desenvolvida no segundo bloco.'),
      a(4, 'Porque cada parágrafo reúne frases relacionadas a uma ideia central, facilitando a leitura e a progressão do assunto.', 'A divisão em unidades de sentido organiza o texto.'),
      a(5, s.sentencePlace, 'A justificativa deve relacionar a frase à ideia central do parágrafo escolhido.'),
      a(6, 'Resposta pessoal, desde que sintetize o assunto comum aos dois parágrafos.', 'Avaliar pertinência e concisão.'),
      a(7, 'Resposta pessoal com uma frase nova coerente com a ideia principal do parágrafo.', 'Avaliar unidade temática.'),
      a(8, 'Resposta pessoal revisada, com pontuação adequada, sem repetição excessiva e mantendo unidade de sentido.', 'Avaliar processo de revisão e aprimoramento.')
    ]
  };
}

function poster(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: `Cartaz: “${s.headline}”. ${s.details}. A palavra “${s.highlight}” aparece em destaque e a ilustração mostra ${s.image}.`,
    questions: [
      q(1, 'Qual é a finalidade principal do cartaz?'),
      q(2, 'Que informação indica quando o evento acontecerá?'),
      q(3, 'Que informação indica onde ele acontecerá?'),
      q(4, `Por que a palavra “${s.highlight}” foi colocada em destaque?`),
      q(5, 'Como a ilustração ajuda o leitor a antecipar o assunto do cartaz?'),
      q(6, 'Quem é o público mais provável do cartaz? Justifique.'),
      q(7, 'Escreva uma chamada curta que poderia substituir o título sem perder a finalidade do cartaz.', 'producao', [], 'grande'),
      q(8, 'Indique dois recursos gráfico-visuais que ajudam a organizar ou destacar informações em um cartaz.', 'analise-texto')
    ],
    answers: [
      a(1, s.purpose, 'A finalidade é inferida pelas informações de convite/divulgação.'),
      a(2, s.when, 'A data e o horário são informações explícitas.'),
      a(3, s.where, 'O local é informado diretamente.'),
      a(4, s.highlightAnswer, 'O destaque visual direciona a atenção para uma informação importante.'),
      a(5, s.imageAnswer, 'A imagem complementa e antecipa o conteúdo verbal.'),
      a(6, s.audienceAnswer, 'A justificativa deve usar pistas do cartaz.'),
      a(7, 'Resposta pessoal, curta, convidativa e coerente com o evento.', 'Avaliar finalidade comunicativa.'),
      a(8, 'Exemplos: tamanho de letra, negrito, cores, ícones, molduras, disposição em blocos e ilustrações.', 'Aceitar dois recursos pertinentes com função de destaque ou organização.')
    ]
  };
}

function mapReading(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: `Mapa simplificado do bairro da escola. Legenda: ★ escola; ● praça; ■ biblioteca; ▲ posto de saúde. A escola fica ao norte da praça. A biblioteca fica a leste da praça e o posto de saúde, a oeste. A Rua das Flores liga a praça à escola.`,
    questions: [
      q(1, 'O que o símbolo ★ representa na legenda?'),
      q(2, 'Qual lugar está a leste da praça?'),
      q(3, 'Qual lugar está a oeste da praça?'),
      q(4, 'Que rua liga a praça à escola?'),
      q(5, 'Por que a legenda é necessária para compreender o mapa?'),
      q(6, 'Escreva uma orientação curta para uma pessoa sair da praça e chegar à escola.'),
      q(7, 'Explique como símbolos e palavras trabalham juntos na leitura desse mapa.', 'analise-texto', [], 'grande'),
      q(8, 'Crie um novo símbolo para representar um ponto de ônibus e escreva como ele apareceria na legenda.', 'producao')
    ],
    answers: [
      a(1, 'A escola.', 'A legenda associa o símbolo ao lugar.'),
      a(2, 'A biblioteca.', 'A posição é informada explicitamente.'),
      a(3, 'O posto de saúde.', 'A posição é informada explicitamente.'),
      a(4, 'Rua das Flores.', 'O nome da rua aparece no texto do mapa.'),
      a(5, 'Porque ela explica o significado dos símbolos usados para representar os lugares.', 'Sem a legenda, os sinais poderiam ser ambíguos.'),
      a(6, 'Resposta possível: saia da praça em direção ao norte e siga pela Rua das Flores até a escola.', 'Aceitar orientação equivalente coerente com as relações espaciais.'),
      a(7, 'Os símbolos localizam rapidamente os lugares e as palavras da legenda explicam o que cada símbolo representa.', 'A resposta deve relacionar recursos visuais e verbais.'),
      a(8, 'Resposta pessoal com um símbolo distinto e a indicação “ponto de ônibus” na legenda.', 'Avaliar clareza da correspondência entre símbolo e significado.')
    ]
  };
}

function notice(s) {
  return {
    objective: s.objective,
    supportTitle: s.supportTitle,
    supportText: `AVISO À TURMA DO 4º ANO. ${s.message} Data: ${s.date}. Horário: ${s.time}. Local: ${s.place}. Responsável: ${s.author}.`,
    questions: [
      q(1, 'A quem o aviso é dirigido?'),
      q(2, 'Qual é a finalidade do aviso?'),
      q(3, 'Qual é a data informada?'),
      q(4, 'Qual é o horário?'),
      q(5, 'Onde acontecerá a atividade?'),
      q(6, 'Quem é responsável pelo aviso?'),
      q(7, 'Explique por que data, horário e local são informações essenciais nesse gênero.', 'analise-texto', [], 'grande'),
      q(8, 'Escreva um aviso de duas frases para lembrar a turma de outra atividade escolar, informando pelo menos data e local.', 'producao', [], 'grande')
    ],
    answers: [
      a(1, 'À turma do 4º ano.', 'O destinatário está indicado no cabeçalho.'),
      a(2, s.purpose, 'A finalidade decorre da mensagem principal.'),
      a(3, s.date, 'A data é informação explícita.'),
      a(4, s.time, 'O horário é informação explícita.'),
      a(5, s.place, 'O local é informação explícita.'),
      a(6, s.author, 'O responsável é identificado ao final.'),
      a(7, 'Porque permitem ao destinatário saber exatamente quando e onde deve participar da atividade anunciada.', 'A resposta deve relacionar informação prática e função social do aviso.'),
      a(8, 'Resposta pessoal com destinatário ou contexto claro, finalidade, data e local.', 'Avaliar adequação à função de informar/lembrar.')
    ]
  };
}

const specs = [
  {type:'news', title:'Conhecendo a estrutura da notícia', theme:'Notícia', codes:['EF04LP14','EF35LP16'], data:{headline:'Horta da escola ganha sistema de irrigação', when:'Na manhã de terça-feira', actors:'os alunos do 4º ano', event:'inauguraram um sistema simples de irrigação', place:'na horta da Escola Caminhos', detail:'O projeto usa garrafas reaproveitadas para levar água lentamente às plantas.', source:'a professora responsável pela horta', quote:'o sistema ajuda a economizar água nos fins de semana', impact:'A turma pretende acompanhar o consumo de água durante o mês.', eventAnswer:'A inauguração de um sistema simples de irrigação.', actorsAnswer:'Os alunos do 4º ano.', placeAnswer:'Na horta da Escola Caminhos.', whenAnswer:'Na manhã de terça-feira.', sourceAnswer:'Ela explica que o sistema ajuda a economizar água.', impactAnswer:'A turma passará a acompanhar o consumo de água.', title:'Conhecendo a estrutura da notícia', mode:'structure', objective:'Ler uma notícia escolar e identificar fato, participantes, local, tempo, fonte e organização básica do gênero.'}},
  {type:'news', title:'Informação ou opinião?', theme:'Notícia', codes:['EF04LP15'], data:{headline:'Biblioteca recebe novos livros', when:'Na segunda-feira', actors:'a biblioteca da Escola Caminhos', event:'recebeu 120 livros novos', place:'para o espaço de leitura dos anos iniciais', detail:'Os livros foram catalogados por estudantes e professores.', source:'a bibliotecária Ana', quote:'a nova coleção ficou muito bonita e convidativa', impact:'O empréstimo dos novos títulos começará na sexta-feira.', eventAnswer:'O recebimento de 120 livros novos.', actorsAnswer:'A biblioteca, com estudantes e professores na organização.', placeAnswer:'No espaço de leitura dos anos iniciais.', whenAnswer:'Na segunda-feira.', sourceAnswer:'Ela avalia que a coleção ficou bonita e convidativa.', impactAnswer:'O empréstimo começará na sexta-feira.', title:'Informação ou opinião?', mode:'fact', quoteKind:'Opinião, porque expressa uma avaliação subjetiva da bibliotecária.', objective:'Distinguir fatos verificáveis de opiniões atribuídas a fontes em uma notícia escolar.'}},
  {type:'news', title:'Produzindo uma notícia escolar', theme:'Notícia', codes:['EF04LP16','EF35LP16'], data:{headline:'Feira de ciências apresenta soluções para a escola', when:'Na sexta-feira à tarde', actors:'as turmas do 4º ano', event:'apresentaram projetos na feira de ciências', place:'no pátio da Escola Caminhos', detail:'Entre os trabalhos havia filtros de água, hortas em garrafas e maquetes de energia solar.', source:'a coordenadora pedagógica', quote:'os projetos nasceram de problemas observados pelos próprios estudantes', impact:'As propostas mais viáveis serão discutidas pelo conselho escolar.', eventAnswer:'A apresentação de projetos na feira de ciências.', actorsAnswer:'As turmas do 4º ano.', placeAnswer:'No pátio da Escola Caminhos.', whenAnswer:'Na sexta-feira à tarde.', sourceAnswer:'Ela informa que os projetos partiram de problemas observados pelos estudantes.', impactAnswer:'As propostas mais viáveis serão discutidas pelo conselho escolar.', title:'Produzindo uma notícia escolar', mode:'production', objective:'Planejar e produzir elementos de uma notícia sobre um fato do universo escolar, respeitando informações essenciais do gênero.'}},
  {type:'science', title:'Descobrindo informações científicas', theme:'Divulgação científica', codes:['EF04LP19'], data:{supportTitle:'Por que as folhas mudam de cor?', subject:'As folhas das plantas produzem alimento usando luz, água e gás carbônico.', definition:'A clorofila é o pigmento verde que participa desse processo.', process:'Quando há menos luz em determinadas épocas do ano, algumas plantas reduzem a produção de clorofila e outros pigmentos ficam mais visíveis.', example:'Por isso, certas folhas passam do verde para tons amarelados ou avermelhados antes de cair.', curiosity:'Nem todas as árvores perdem as folhas ao mesmo tempo, porque as espécies respondem de modos diferentes ao ambiente.', keyTerm:'clorofila', processName:'a mudança de cor de algumas folhas', word:'pigmento', subjectAnswer:'A mudança de cor das folhas e o papel da clorofila.', definitionAnswer:'É o pigmento verde que participa da produção de alimento da planta.', processAnswer:'Com menos luz, algumas plantas reduzem a clorofila e outros pigmentos tornam-se mais visíveis.', exampleAnswer:'Folhas que passam do verde para amarelo ou vermelho antes de cair.', wordAnswer:'Substância que dá cor ou participa da coloração.', curiosityAnswer:'Nem todas as árvores perdem as folhas ao mesmo tempo.', analysisAnswer:'O texto define a clorofila e usa a mudança de cor das folhas como exemplo observável do processo.', title:'Descobrindo informações científicas', objective:'Ler texto de divulgação científica, localizar definições, explicar relações de causa e compreender exemplos usados para divulgar ciência.'}},
  {type:'data', title:'Organizando informações de uma pesquisa', theme:'Pesquisa e registro', codes:['EF04LP20'], data:{supportTitle:'Preferências de leitura da turma', context:'Uma pesquisa perguntou a 30 estudantes qual gênero gostariam de encontrar com mais frequência na biblioteca.', format:'em uma tabela', formatName:'tabela', rows:[['Aventura',12],['Histórias em quadrinhos',9],['Contos',6],['Poesia',3]], note:'A turma usará os resultados para sugerir novas compras à biblioteca.', askA:'Histórias em quadrinhos', valueA:'9 estudantes', askB:'Aventura', askC:'Poesia', diff:'9 estudantes', conclusion:'Aventura foi a opção mais escolhida, enquanto poesia teve menos escolhas.', title:'Organizando informações de uma pesquisa', objective:'Ler dados organizados em tabela, comparar valores e produzir conclusões sustentadas por informações quantitativas.'}},
  {type:'narrative', title:'Personagens, acontecimentos e sentidos', theme:'Texto literário', codes:['EF35LP21','EF35LP26'], data:{supportTitle:'A chave do depósito', text:'Num sábado de manhã, Clara ajudava o avô a arrumar uma estante na casa antiga da família. Atrás de um livro, encontrou uma pequena chave de bronze. O avô sorriu e apontou para o depósito do quintal. Lá, Clara usou a chave para abrir um baú com cartas e fotografias antigas. Os dois passaram a tarde lendo histórias de outros tempos e organizando as lembranças da família.', character:'Clara.', setting:'Na casa antiga da família, especialmente no depósito do quintal.', conflict:'Clara encontra uma chave misteriosa e precisa descobrir o que ela abre.', solutionAction:'Ela pergunta ao avô e usa a chave no baú indicado por ele.', pointOfView:'Terceira pessoa; o narrador fala de Clara como “ela” e não participa da história.', sequence:'Situação inicial: Clara arrumava a estante com o avô; conflito: encontrou uma chave e quis descobrir sua função; resolução: abriu o baú e conheceu lembranças da família.', trait:'Clara pode ser considerada curiosa, porque procura descobrir o que a chave abre.', title:'Personagens, acontecimentos e sentidos', objective:'Ler uma narrativa literária e identificar personagens, cenário, sequência de acontecimentos, conflito, resolução e foco narrativo.'}},
  {type:'narrativeProduction', title:'Escrevendo uma narrativa curta', theme:'Produção textual', codes:['EF35LP25','EF15LP05'], data:{supportTitle:'O caderno no banco da praça', text:'No fim da tarde, Ravi atravessava a praça quando viu um caderno azul de capa brilhante esquecido em um banco. Ele abriu apenas a primeira página e encontrou um nome e o desenho de uma escola próxima. Sem saber quem era o dono, decidiu procurar uma forma de devolver o caderno.', character:'Ravi.', timeMarker:'No fim da tarde.', placeMarker:'na praça / em um banco da praça.', problem:'Encontrar o dono de um caderno esquecido.', description:'“caderno azul de capa brilhante”', title:'Escrevendo uma narrativa curta', objective:'Planejar e produzir uma narrativa curta com personagem, tempo, espaço, problema, sequência de eventos, detalhes descritivos e desfecho coerente.'}},
  {type:'accent', title:'Acento, sílaba forte e busca no dicionário', theme:'Ortografia e acentuação', codes:['EF04LP04'], data:{supportTitle:'Palavras do mural da turma', words:['tátil','fácil','açúcar','órfão','júri','lápis'], w1:'fácil', w2:'órfão', w3:'tátil', w4:'açúcar', choice:['tátil','papel','júri','sabor'], a1:'fá-cil; a sílaba tônica é “fá”.', a2:'Acento agudo.', a3:'Termina em -l.', a5:'tátil e júri.', a8:'Exemplos: útil, fóssil, táxi, júri, caráter. Aceitar outras paroxítonas corretamente acentuadas conforme as terminações estudadas.', title:'Acento, sílaba forte e busca no dicionário', objective:'Reconhecer e usar acento gráfico em paroxítonas com terminações previstas para o 4º ano, recorrendo ao dicionário para confirmar a grafia.'}},
  {type:'letter', title:'Quem escreve, para quem e por quê', theme:'Carta pessoal', codes:['EF15LP01','EF15LP03'], data:{supportTitle:'Uma carta para o primo', text:'Florianópolis, 18 de agosto. Querido Lucas, fiquei muito feliz com a sua mensagem. No próximo sábado haverá uma feira de livros na minha escola, das 9h às 12h. Gostaria que você viesse comigo, porque haverá troca de livros e contação de histórias. Se puder vir, avise minha mãe até quinta-feira. Um abraço, Marina.', sender:'Marina.', recipient:'Lucas, primo de Marina.', purpose:'Convidar Lucas para a feira de livros da escola e informar como confirmar a participação.', greeting:'“Querido Lucas”.', importantInfo:'A feira será no próximo sábado, das 9h às 12h, e Lucas deve avisar até quinta-feira se puder ir.', languageAnswer:'A carta usa saudação afetiva e despedida informal porque Marina escreve para um familiar próximo.', title:'Quem escreve, para quem e por quê', objective:'Identificar remetente, destinatário, finalidade e informações explícitas de uma carta pessoal, relacionando linguagem e situação comunicativa.'}},
  {type:'entry', title:'Como se organiza um verbete', theme:'Verbete de enciclopédia', codes:['EF04LP23'], data:{term:'Boto-cor-de-rosa', definition:'Golfinho de água doce que vive nos rios da Amazônia.', details:'Quando adulto, pode medir cerca de dois metros e meio. Alimenta-se principalmente de peixes e usa sons e ecos para se orientar na água.', curiosity:'A coloração rosada costuma ficar mais evidente em alguns adultos.', definitionAnswer:'Um golfinho de água doce que vive nos rios da Amazônia.', detailAnswer:'Exemplos: pode medir cerca de dois metros e meio; alimenta-se de peixes; usa sons e ecos para se orientar.', newTerm:'arara-azul', title:'Como se organiza um verbete', objective:'Identificar e reproduzir a organização de um verbete de enciclopédia infantil: título, definição, detalhamento e curiosidade.'}},
  {type:'poem', title:'Versos, estrofes e o som das palavras', theme:'Poema', codes:['EF35LP23'], data:{supportTitle:'Chuva no quintal', lines:['A chuva chegou ligeira,','bateu tambor no telhado,','molhou a velha mangueira,','deixou o chão espelhado.','','Depois o sol veio cedo,','dourou a folha no chão,','a água levou meu medo,','e o vento trouxe canção.'], verseCount:8, stanzaCount:2, rhyme:'ligeira/mangueira e telhado/espelhado.', imageLine:'bateu tambor no telhado', imageAnswer:'Compara o barulho das gotas no telhado ao som de um tambor.', feeling:'Predomina uma passagem do receio para a tranquilidade/alegria, sugerida por “a água levou meu medo” e “o vento trouxe canção”.', title:'Versos, estrofes e o som das palavras', objective:'Apreciar poema observando versos, estrofes, rimas, imagens poéticas e efeitos de sentido produzidos por recursos sonoros.'}},
  {type:'comics', title:'O que a imagem conta na tirinha', theme:'História em quadrinhos', codes:['EF15LP14'], data:{supportTitle:'A surpresa do guarda-chuva', p1:'Léo olha pela janela e diz “Que sol forte!”.', p2:'ele sai de casa sem guarda-chuva e uma nuvem escura aparece; ouve-se “PLOC!”.', p3:'a chuva começa e Léo corre de volta, dizendo “Eu devia ter olhado melhor...”.', expression:'Eu devia ter olhado melhor...', sound:'PLOC!', a1:'Léo observa o dia ensolarado e decide sair sem guarda-chuva.', a2:'Revela arrependimento por ter concluído rapidamente que não choveria.', a3:'Representa o som da primeira gota e anuncia a mudança do tempo.', a4:'As imagens passam do sol para a nuvem e depois para a chuva, mostrando a mudança do tempo e a reação de Léo.', a5:'A aproximação da nuvem escura e a chuva são compreendidas visualmente na sequência.', a6:'A surpresa ocorre porque Léo confia apenas no sol do primeiro quadro e logo é surpreendido pela chuva.', title:'O que a imagem conta na tirinha', objective:'Construir o sentido de uma tirinha relacionando sequência de imagens, falas, expressão de personagem e onomatopeia.'}},
  {type:'instructions', title:'As regras de um jogo, passo a passo', theme:'Texto instrucional', codes:['EF04LP13'], data:{supportTitle:'Jogo das palavras escondidas', intro:'O objetivo é formar o maior número de palavras com as letras sorteadas.', materials:'20 cartões com letras, papel e lápis', steps:['Embaralhe os cartões e coloque-os virados para baixo.','Cada jogador retire cinco cartões.','Forme uma palavra usando apenas as letras retiradas.','Anote a palavra e devolva os cartões antes da rodada seguinte.'], verb:'Embaralhe', purpose:'Ensinar como jogar o Jogo das palavras escondidas.', materialAnswer:'20 cartões com letras, papel e lápis.', verbAnswer:'Uma ordem ou orientação para misturar os cartões antes do início.', inversionAnswer:'Se o jogador tentasse formar a palavra antes de retirar os cartões, não teria as letras disponíveis para cumprir a etapa.', title:'As regras de um jogo, passo a passo', objective:'Ler e analisar instruções de jogo, reconhecendo materiais, sequência de passos e emprego de verbos no imperativo.'}},
  {type:'narrative', title:'Meu ponto de vista, na ordem certa', theme:'Relato pessoal', codes:['EF35LP29'], data:{supportTitle:'Meu primeiro dia na rádio da escola', text:'Na quarta-feira eu participei pela primeira vez da rádio da escola. Entrei na sala com as mãos frias de nervoso e revisei meu pequeno texto duas vezes. Quando a luz do microfone acendeu, respirei fundo e li o aviso da feira de livros. No fim, meus colegas bateram palmas, e eu saí orgulhoso porque consegui terminar sem esquecer nenhuma informação.', character:'O narrador-estudante que participa da rádio.', setting:'Na sala da rádio da escola.', conflict:'O narrador está nervoso para falar ao microfone pela primeira vez.', solutionAction:'Ele respira fundo, lê o aviso e consegue concluir a participação.', pointOfView:'Primeira pessoa; aparecem marcas como “eu participei”, “entrei” e “meus colegas”.', sequence:'Situação inicial: primeira participação na rádio; conflito: nervosismo antes de falar; resolução: lê o aviso e termina com sucesso.', trait:'Pode ser considerado perseverante/corajoso, pois enfrenta o nervosismo e realiza a leitura.', title:'Meu ponto de vista, na ordem certa', objective:'Ler um relato em primeira pessoa, reconhecer ponto de vista e organizar acontecimentos em sequência temporal.'}},
  {type:'narrative', title:'Conflito e desfecho no conto popular', theme:'Conto popular brasileiro', codes:['EF35LP29'], data:{supportTitle:'A panela que não parava', text:'Numa pequena vila, Dona Tereza ganhou de uma viajante uma panela que cozinhava mingau quando ouvia as palavras certas. O neto Bento aprendeu a fazê-la começar, mas esqueceu o comando para parar. O mingau encheu a cozinha e começou a escorrer pela porta. Bento correu até a avó, que voltou depressa e disse a palavra correta. A panela parou, e os vizinhos ajudaram a limpar tudo enquanto Bento prometia anotar as instruções da próxima vez.', character:'Bento.', setting:'Numa pequena vila, na casa de Dona Tereza.', conflict:'Bento faz a panela produzir mingau, mas esquece como fazê-la parar.', solutionAction:'Ele procura a avó, que volta e diz a palavra correta para parar a panela.', pointOfView:'Terceira pessoa; o narrador conta os acontecimentos de fora.', sequence:'Situação inicial: a família recebe a panela; conflito: Bento não consegue pará-la; resolução: Dona Tereza usa a palavra correta e a panela para.', trait:'Bento aprende a ser mais cuidadoso, pois decide anotar as instruções depois do problema.', title:'Conflito e desfecho no conto popular', objective:'Identificar personagem central, cenário, conflito, ações e resolução em um conto de estrutura popular.'}},
  {type:'interview', title:'Perguntar para descobrir', theme:'Entrevista', codes:['EF04LP17'], data:{supportTitle:'Entrevista com a cuidadora da horta', intro:'A turma preparou um roteiro para entrevistar Joana, responsável pela horta comunitária do bairro.', guest:'Joana', q1:'Como a horta começou?', r1:'Começou com seis canteiros feitos por moradores e estudantes há três anos.', q2:'O que vocês fazem para economizar água?', r2:'Usamos cobertura de folhas secas no solo e regamos cedo, quando há menos evaporação.', q3:'Como as crianças podem participar?', r3:'Elas podem ajudar a plantar mudas, registrar o crescimento e cuidar da compostagem.', guestReason:'Joana é a entrevistada porque é responsável pela horta e conhece sua história e seu funcionamento.', a2:'A horta começou há três anos com seis canteiros feitos por moradores e estudantes.', openQuestion:'“O que vocês fazem para economizar água?” — ou qualquer uma das três, pois todas solicitam explicação.', a4:'Explica duas práticas de economia de água: cobertura de folhas secas e rega no início do dia.', sequenceAnswer:'As perguntas vão da origem da horta para os cuidados atuais e depois para formas de participação das crianças.', title:'Perguntar para descobrir', objective:'Analisar um roteiro de entrevista, reconhecer perguntas abertas e produzir novas perguntas pertinentes ao tema e ao entrevistado.'}},
  {type:'campaign', title:'Uma mensagem para quem?', theme:'Campanha educativa', codes:['EF04LP15','EF15LP04'], data:{supportTitle:'Feche a torneira', author:'Escola Caminhos', audience:'alunos do 4º ano', slogan:'Feche a torneira enquanto escova os dentes!', fact:'Uma torneira aberta deixa água limpa seguir pelo ralo sem ser usada.', opinion:'Essa é a campanha mais bonita da escola.', image:'uma torneira pingando ao lado de uma escova de dentes', purpose:'Incentivar os alunos a evitar desperdício de água.', action:'Fechar a torneira durante a escovação.', factKind:'Fato, pois descreve uma situação observável e verificável de desperdício.', opinionAnswer:'Opinião; a expressão “mais bonita” apresenta uma avaliação pessoal.', imageAnswer:'A torneira pingando torna visível o desperdício que a frase pede para evitar.', title:'Uma mensagem para quem?', objective:'Interpretar campanha educativa, distinguir fato de opinião e relacionar chamada verbal a recurso gráfico-visual.'}},
  {type:'dialogue', title:'Travessão, dois-pontos e a fala das personagens', theme:'Pontuação em diálogos', codes:['EF04LP05'], data:{supportTitle:'Antes da aula', intro:'Marina chegou à sala e perguntou aos colegas:', lines:['A professora já entrou?','Ainda não — respondeu Téo.','Que bom! Eu precisava entregar este livro.','Então deixe-o sobre a mesa antes do sinal.'], questionLine:'“— A professora já entrou?”', exclamationLine:'“— Que bom! Eu precisava entregar este livro.”', title:'Travessão, dois-pontos e a fala das personagens', objective:'Identificar e usar travessão, dois-pontos, interrogação e exclamação em diálogos, compreendendo a função de cada sinal.'}},
  {type:'cohesion', title:'Palavras que evitam repetição', theme:'Coesão textual', codes:['EF35LP06'], data:{supportTitle:'A apresentação de Lívia', text:'Lívia preparou um cartaz sobre alimentação saudável. A estudante pesquisou frutas da estação e anotou os preços. Depois, ela organizou as informações em uma tabela. Esse material ajudou a turma a comparar os dados durante a apresentação.', pronoun1:'ela', noun:'Lívia', bad:'Lívia fez o cartaz. Lívia apresentou o cartaz à turma.', pronounSentence:'Esse material ajudou a turma a comparar os dados', a1:'Lívia.', a2:'“A estudante” retoma Lívia; “esse material” retoma o cartaz/conjunto de informações organizado.', a4:'Exemplo: “Lívia fez o cartaz e o apresentou à turma.”', a5:'Retoma o cartaz e as informações organizadas por Lívia.', title:'Palavras que evitam repetição', objective:'Reconhecer e usar substituições lexicais e pronominais que evitam repetições e garantem continuidade ao texto.'}},
  {type:'paragraph', title:'Escrever e revisar um parágrafo claro', theme:'Produção e revisão de parágrafo', codes:['EF35LP09','EF15LP06'], data:{supportTitle:'A biblioteca da turma', text:'Nossa turma organizou uma pequena biblioteca no fundo da sala. Cada estudante trouxe um livro identificado e ajudou a separar os títulos por assunto.\n\nDepois da organização, criamos uma ficha simples de empréstimo. Assim, todos conseguem registrar qual livro levaram e a data prevista para devolução.', sentence:'Também colocamos etiquetas nas prateleiras.', idea1:'A organização física da biblioteca e dos livros.', idea2:'A criação de um sistema de empréstimo para controlar retiradas e devoluções.', sentencePlace:'No primeiro parágrafo, porque a frase trata da organização dos livros e das prateleiras.', title:'Escrever e revisar um parágrafo claro', objective:'Organizar ideias em parágrafos e revisar texto para manter unidade de sentido, clareza, pontuação e continuidade.'}},
  {type:'poster', title:'Lendo um cartaz de feira de livros', theme:'Cartaz', codes:['EF15LP01','EF15LP04'], data:{supportTitle:'Feira de troca de livros', headline:'FEIRA DE TROCA DE LIVROS — Histórias que circulam!', details:'Sábado, 22 de agosto, das 9h às 12h, no pátio da Escola Caminhos. Traga um livro em bom estado e escolha outro para levar', highlight:'TROCA', image:'duas crianças entregando livros uma à outra', purpose:'Divulgar e convidar a comunidade escolar para a feira de troca de livros.', when:'Sábado, 22 de agosto, das 9h às 12h.', where:'No pátio da Escola Caminhos.', highlightAnswer:'Para chamar atenção para a ação principal do evento: trocar livros.', imageAnswer:'Mostra visualmente a ação de trocar livros, reforçando o tema do evento.', audienceAnswer:'A comunidade escolar, especialmente estudantes e famílias que podem levar livros para trocar.', title:'Lendo um cartaz de feira de livros', objective:'Interpretar finalidade, público e informações explícitas de um cartaz, observando efeitos de recursos gráfico-visuais.'}},
  {type:'instructions', title:'Receita em sequência', theme:'Texto instrucional', codes:['EF04LP13'], data:{supportTitle:'Salada de frutas da turma', intro:'A receita orienta o preparo de uma salada simples para quatro pessoas.', materials:'1 banana, 1 maçã, 1 pera, suco de 1 laranja e uma tigela', steps:['Lave as frutas e seque-as.','Corte banana, maçã e pera em pedaços pequenos com ajuda de um adulto.','Coloque os pedaços na tigela e misture.','Acrescente o suco de laranja e sirva.'], verb:'Lave', purpose:'Ensinar a preparar uma salada de frutas simples.', materialAnswer:'Banana, maçã, pera, suco de laranja e uma tigela.', verbAnswer:'Uma instrução para higienizar as frutas antes do preparo.', inversionAnswer:'Se misturasse antes de cortar as frutas, os ingredientes ainda não estariam preparados em pedaços para compor a salada.', title:'Receita em sequência', objective:'Identificar finalidade, materiais, verbos de ação e ordem de etapas em um texto instrucional de receita.'}},
  {type:'map', title:'Legenda e orientação no mapa', theme:'Leitura de mapa', codes:['EF15LP03','EF15LP04'], data:{supportTitle:'Como chegar aos lugares do bairro', title:'Legenda e orientação no mapa', objective:'Ler legenda e relações espaciais de um mapa simples, integrando símbolos, palavras e informações explícitas.'}},
  {type:'data', title:'Lendo um infográfico sobre reciclagem', theme:'Infográfico', codes:['EF04LP20','EF15LP04'], data:{supportTitle:'Resíduos separados na escola', context:'Um infográfico mostra a quantidade de material reciclável recolhida em uma semana pela escola.', format:'em quatro blocos com ícones e números', formatName:'infográfico', rows:[['Papel',18],['Plástico',12],['Metal',7],['Vidro',5]], note:'Setas levam os blocos até a frase “Separar hoje ajuda a reutilizar amanhã”.', askA:'Plástico', valueA:'12 kg', askB:'Papel', askC:'Vidro', diff:'13 kg', conclusion:'Papel foi o material mais recolhido e vidro teve a menor quantidade.', title:'Lendo um infográfico sobre reciclagem', objective:'Interpretar dados e recursos gráfico-visuais de um infográfico, reconhecendo como números, ícones e organização apoiam a compreensão.'}},
  {type:'notice', title:'Aviso e calendário da turma', theme:'Aviso', codes:['EF15LP01','EF15LP03'], data:{supportTitle:'Reunião para preparar a mostra cultural', message:'Na próxima semana teremos uma reunião para dividir as tarefas da mostra cultural.', date:'15 de setembro', time:'14 horas', place:'sala do 4º ano', author:'Professora Helena', purpose:'Informar e lembrar a turma sobre a reunião de preparação da mostra cultural.', title:'Aviso e calendário da turma', objective:'Reconhecer função social, destinatário e informações explícitas de um aviso escolar, como data, horário, local e responsável.'}},
  {type:'comics', title:'Inferindo sentimentos pela imagem', theme:'Leitura de imagem', codes:['EF15LP14','EF15LP04'], data:{supportTitle:'O desenho perdido', p1:'Nina segura uma folha e sorri ao mostrar seu desenho a um colega.', p2:'uma rajada de vento leva a folha para longe; aparece “FUUSH!” e Nina arregala os olhos.', p3:'o colega alcança a folha junto ao portão e a devolve; Nina respira aliviada e diz “Ainda bem!”.', expression:'Ainda bem!', sound:'FUUSH!', a1:'Nina mostra o desenho ao colega e está contente.', a2:'Revela alívio porque o desenho foi recuperado.', a3:'Representa o som/força do vento levando a folha.', a4:'A sequência mostra alegria, surpresa/preocupação e depois alívio, conforme o desenho se perde e é recuperado.', a5:'A mudança das expressões faciais de Nina indica seus sentimentos ao longo da cena.', a6:'O desfecho traz alívio porque o colega recupera o desenho que o vento havia levado.', title:'Inferindo sentimentos pela imagem', objective:'Inferir sentimentos e mudanças de situação em sequência de quadrinhos, relacionando expressões faciais, ações, palavras e onomatopeia.'}},
  {type:'data', title:'Dados de leitura em gráfico', theme:'Gráfico e síntese', codes:['EF04LP20'], data:{supportTitle:'Livros lidos por mês', context:'A turma registrou quantos livros terminou em quatro meses para acompanhar seu hábito de leitura.', format:'em um gráfico de colunas', formatName:'gráfico de colunas', rows:[['Março',14],['Abril',18],['Maio',16],['Junho',22]], note:'O gráfico será usado para planejar a próxima roda de recomendações de leitura.', askA:'Abril', valueA:'18 livros', askB:'Junho', askC:'Março', diff:'8 livros', conclusion:'Junho teve o maior número de livros concluídos, com 22, enquanto março teve 14.', title:'Dados de leitura em gráfico', objective:'Ler e comparar dados de um gráfico de colunas e produzir conclusões fundamentadas em valores explícitos.'}},
  {type:'dialogue', title:'Pontuação e intenção da frase', theme:'Pontuação', codes:['EF04LP05'], data:{supportTitle:'Na porta da biblioteca', intro:'Ao chegar à biblioteca, Caio encontrou Manu e os dois conversaram:', lines:['Você trouxe a devolução?','Trouxe, sim. Está na mochila.','Ótimo! Hoje quero escolher outro livro.','Vamos entrar antes que a fila aumente.'], questionLine:'“— Você trouxe a devolução?”', exclamationLine:'“— Ótimo! Hoje quero escolher outro livro.”', title:'Pontuação e intenção da frase', objective:'Relacionar sinais de pontuação à intenção de perguntas, respostas e exclamações em falas de personagens.'}},
  {type:'news', title:'Foto, legenda e notícia', theme:'Notícia', codes:['EF04LP14','EF15LP04'], data:{headline:'Turma planta mudas no jardim da escola', when:'Na quarta-feira pela manhã', actors:'estudantes do 4º ano e funcionários', event:'plantaram quinze mudas de flores nativas', place:'no jardim da Escola Caminhos', detail:'Uma fotografia mostra os estudantes usando pás pequenas ao lado dos novos canteiros.', source:'o funcionário Marcos', quote:'as espécies escolhidas precisam de pouca água depois de adaptadas', impact:'A turma ficará responsável por registrar o crescimento das mudas.', eventAnswer:'O plantio de quinze mudas de flores nativas.', actorsAnswer:'Estudantes do 4º ano e funcionários.', placeAnswer:'No jardim da Escola Caminhos.', whenAnswer:'Na quarta-feira pela manhã.', sourceAnswer:'Ele explica que as espécies escolhidas precisam de pouca água depois de adaptadas.', impactAnswer:'A turma registrará o crescimento das mudas.', title:'Foto, legenda e notícia', mode:'structure', objective:'Identificar informações essenciais de uma notícia e relacionar texto, foto e legenda à compreensão do fato noticiado.'}},
  {type:'cohesion', title:'Pronomes que retomam personagens', theme:'Coesão textual', codes:['EF35LP06'], data:{supportTitle:'O projeto de Samuel', text:'Samuel levou uma caixa de sementes para a aula. O estudante explicou que havia separado feijão, milho e girassol. Depois, ele mostrou como cada semente seria identificada. Esse conjunto serviria para iniciar o experimento de germinação da turma.', pronoun1:'ele', noun:'Samuel', bad:'Samuel abriu a caixa. Samuel mostrou as sementes aos colegas.', pronounSentence:'Esse conjunto serviria para iniciar o experimento', a1:'Samuel.', a2:'“O estudante” retoma Samuel; “esse conjunto” retoma as sementes separadas.', a4:'Exemplo: “Samuel abriu a caixa e mostrou as sementes aos colegas.”', a5:'Retoma o conjunto de sementes apresentado anteriormente.', title:'Pronomes que retomam personagens', objective:'Identificar referentes de pronomes e expressões de retomada e empregá-los para garantir continuidade sem repetição excessiva.'}},
  {type:'news', title:'Manchete, lide e corpo da notícia', theme:'Notícia', codes:['EF04LP14','EF35LP16'], data:{headline:'Clube de leitura abre inscrições para novas turmas', when:'Nesta segunda-feira', actors:'a biblioteca da Escola Caminhos', event:'abriu inscrições para um novo clube de leitura', place:'na própria biblioteca escolar', detail:'Os encontros serão quinzenais e cada grupo poderá escolher um livro para leitura compartilhada.', source:'a professora Marta', quote:'a primeira reunião será dedicada à escolha coletiva dos títulos', impact:'As inscrições ficarão abertas até sexta-feira.', eventAnswer:'A abertura das inscrições para um novo clube de leitura.', actorsAnswer:'A biblioteca da Escola Caminhos e os estudantes interessados.', placeAnswer:'Na biblioteca escolar.', whenAnswer:'Nesta segunda-feira.', sourceAnswer:'Ela informa que o primeiro encontro será dedicado à escolha coletiva dos livros.', impactAnswer:'As inscrições ficarão abertas até sexta-feira.', title:'Manchete, lide e corpo da notícia', mode:'structure', objective:'Reconhecer manchete, lide e desenvolvimento de notícia simples, identificando informações essenciais e organização do gênero.'}},
  {type:'news', title:'Fato, opinião e fonte da informação', theme:'Notícia', codes:['EF04LP15'], data:{headline:'Quadra recebe nova pintura', when:'No sábado', actors:'uma equipe de manutenção', event:'concluiu a pintura das linhas da quadra esportiva', place:'na Escola Caminhos', detail:'A direção informou que a quadra será liberada para as turmas na segunda-feira.', source:'o estudante Pedro', quote:'as novas linhas deixaram a quadra muito mais bonita', impact:'A primeira aula prevista no espaço será de educação física do 4º ano.', eventAnswer:'A conclusão da pintura das linhas da quadra.', actorsAnswer:'Uma equipe de manutenção.', placeAnswer:'Na Escola Caminhos, na quadra esportiva.', whenAnswer:'No sábado.', sourceAnswer:'Pedro apresenta uma avaliação sobre a aparência da quadra.', impactAnswer:'A quadra será usada pelas turmas a partir de segunda-feira.', title:'Fato, opinião e fonte da informação', mode:'fact', quoteKind:'Opinião, porque “muito mais bonita” expressa uma avaliação de Pedro.', objective:'Distinguir informações factuais de opiniões atribuídas a pessoas em notícia, observando marcas de avaliação.'}},
  {type:'news', title:'Revisando uma notícia escolar', theme:'Notícia', codes:['EF04LP16','EF15LP06'], data:{headline:'Estudantes organizam campanha de arrecadação', when:'Na manhã de quinta-feira', actors:'representantes das turmas do 4º ano', event:'iniciaram uma campanha de arrecadação de livros infantis', place:'na entrada da Escola Caminhos', detail:'Caixas identificadas foram colocadas perto da secretaria para receber doações em bom estado.', source:'a professora Helena', quote:'os livros serão separados por faixa etária antes de serem encaminhados', impact:'A campanha termina no dia 30 e depois os estudantes revisarão a notícia para o jornal da escola.', eventAnswer:'O início de uma campanha de arrecadação de livros infantis.', actorsAnswer:'Representantes das turmas do 4º ano.', placeAnswer:'Na entrada da Escola Caminhos.', whenAnswer:'Na manhã de quinta-feira.', sourceAnswer:'Ela explica que os livros serão separados por faixa etária.', impactAnswer:'A campanha termina no dia 30 e será noticiada no jornal escolar.', title:'Revisando uma notícia escolar', mode:'production', objective:'Produzir e revisar notícia escolar com fato, participantes, local, tempo, fonte e linguagem objetiva.'}},
  {type:'science', title:'Ciência no cotidiano: como o texto explica', theme:'Divulgação científica', codes:['EF04LP19'], data:{supportTitle:'Por que o gelo derrete?', subject:'O gelo é água no estado sólido.', definition:'Derretimento é a passagem do estado sólido para o líquido quando o gelo recebe energia térmica.', process:'Ao ficar fora do congelador, o gelo recebe calor do ambiente e suas partículas passam a se mover mais, transformando-o em água líquida.', example:'Um cubo colocado num prato sobre a mesa forma uma pequena poça depois de alguns minutos.', curiosity:'O gelo não precisa estar ao sol para derreter; basta estar em um ambiente acima de sua temperatura de fusão.', keyTerm:'derretimento', processName:'o derretimento do gelo', word:'fusão', subjectAnswer:'O derretimento do gelo e a passagem da água do estado sólido para o líquido.', definitionAnswer:'É a passagem do estado sólido para o líquido.', processAnswer:'O gelo recebe calor do ambiente e se transforma em água líquida.', exampleAnswer:'O cubo de gelo sobre um prato forma uma poça depois de alguns minutos.', wordAnswer:'Mudança do estado sólido para o líquido.', curiosityAnswer:'O gelo pode derreter mesmo sem receber luz direta do sol.', analysisAnswer:'O texto define o fenômeno e usa o exemplo do cubo no prato para aproximá-lo da observação cotidiana.', title:'Ciência no cotidiano: como o texto explica', objective:'Compreender texto expositivo de divulgação científica, articulando definição, processo, exemplo e curiosidade.'}},
  {type:'data', title:'Lendo dados de uma pesquisa escolar', theme:'Pesquisa e registro', codes:['EF04LP20'], data:{supportTitle:'Como os estudantes chegam à escola', context:'Uma pesquisa com 40 estudantes perguntou qual meio de transporte usam com mais frequência para chegar à escola.', format:'em um gráfico de barras', formatName:'gráfico de barras', rows:[['A pé',11],['Bicicleta',7],['Ônibus',14],['Carro',8]], note:'Os dados serão apresentados numa reunião sobre mobilidade no entorno da escola.', askA:'Bicicleta', valueA:'7 estudantes', askB:'Ônibus', askC:'Bicicleta', diff:'7 estudantes', conclusion:'Ônibus foi o meio mais citado, com 14 respostas, e bicicleta o menos citado, com 7.', title:'Lendo dados de uma pesquisa escolar', objective:'Interpretar gráfico de pesquisa escolar, localizar valores, comparar categorias e sustentar conclusões com dados.'}},
  {type:'narrative', title:'Narrador, cenário e sequência de acontecimentos', theme:'Texto literário', codes:['EF35LP21','EF35LP26'], data:{supportTitle:'A luz no corredor', text:'Quando a escola já estava quase vazia, Júlia voltou à sala para buscar seu estojo. No corredor silencioso, percebeu uma luz piscando perto da biblioteca. Ela caminhou devagar e descobriu que era a lanterna do zelador, esquecida sobre um carrinho. Júlia desligou a lanterna, levou-a até a portaria e deixou um bilhete explicando onde a encontrara. No dia seguinte, o zelador agradeceu seu cuidado.', character:'Júlia.', setting:'Na escola quase vazia, entre o corredor, a biblioteca e a portaria.', conflict:'Júlia vê uma luz piscando no corredor e não sabe de onde ela vem.', solutionAction:'Ela investiga com cuidado, encontra a lanterna, desliga-a e a entrega na portaria.', pointOfView:'Terceira pessoa; o narrador se refere a Júlia como “ela”.', sequence:'Situação inicial: Júlia volta para buscar o estojo; conflito: percebe uma luz estranha; resolução: identifica a lanterna e a devolve.', trait:'Júlia demonstra responsabilidade e cuidado ao investigar sem danificar o objeto e deixá-lo na portaria.', title:'Narrador, cenário e sequência de acontecimentos', objective:'Ler narrativa ficcional reconhecendo cenário, personagem, foco narrativo, sequência, conflito, resolução e inferências sobre ações.'}},
  {type:'narrativeProduction', title:'Planejando começo, conflito e desfecho', theme:'Produção textual', codes:['EF35LP25','EF15LP05','EF15LP06'], data:{supportTitle:'O mapa dobrado', text:'Certa manhã, Sofia encontrou um mapa dobrado dentro de um livro devolvido à biblioteca. O papel tinha linhas azuis, três círculos vermelhos e uma pequena anotação: “comece pela árvore do pátio”. Curiosa, ela chamou um colega e decidiu descobrir a que lugares as pistas levavam.', character:'Sofia.', timeMarker:'Certa manhã.', placeMarker:'na biblioteca / no pátio da escola.', problem:'Descobrir aonde levam as pistas do mapa encontrado no livro.', description:'“mapa dobrado”, “linhas azuis” e “três círculos vermelhos”.', title:'Planejando começo, conflito e desfecho', objective:'Planejar, escrever e revisar narrativa ficcional articulando situação inicial, conflito, sequência de ações, marcadores de tempo/espaço e desfecho.'}},
  {type:'accent', title:'Acentuação em palavras do cotidiano', theme:'Ortografia e acentuação', codes:['EF04LP04'], data:{supportTitle:'Lista para a exposição', words:['fácil','tátil','caráter','júri','órfão','lápis'], w1:'tátil', w2:'júri', w3:'caráter', w4:'lápis', choice:['fácil','anel','órfão','motor'], a1:'tá-til; a sílaba tônica é “tá”.', a2:'Acento agudo.', a3:'Termina em -r.', a5:'fácil e órfão.', a8:'Exemplos: útil, táxi, caráter, órgão. Aceitar outras palavras que atendam às terminações e à tonicidade estudadas.', title:'Acentuação em palavras do cotidiano', objective:'Aplicar regras de acentuação de paroxítonas em palavras de uso frequente e justificar a grafia pela terminação e tonicidade.'}},
  {type:'letter', title:'Carta pessoal: saudação, mensagem e despedida', theme:'Carta pessoal', codes:['EF15LP01','EF15LP05'], data:{supportTitle:'Carta sobre as férias', text:'Joinville, 4 de setembro. Oi, Bia! As férias foram muito divertidas. Visitei meus avós e aprendi com eles a fazer pão caseiro. Quero contar tudo quando nos encontrarmos. Você pode vir à minha casa no próximo domingo à tarde? Escreva dizendo se consegue. Com carinho, Alice.', sender:'Alice.', recipient:'Bia.', purpose:'Contar uma experiência das férias e convidar Bia para um encontro no domingo.', greeting:'“Oi, Bia!”', importantInfo:'Alice convida Bia para ir à sua casa no próximo domingo à tarde e pede uma resposta.', languageAnswer:'A linguagem é próxima e afetiva, adequada a uma carta entre amigas.', title:'Carta pessoal: saudação, mensagem e despedida', objective:'Reconhecer elementos de carta pessoal e planejar resposta adequada ao destinatário, à finalidade e ao assunto da mensagem.'}},
  {type:'entry', title:'Verbete: definição, detalhes e curiosidades', theme:'Verbete de enciclopédia', codes:['EF04LP23'], data:{term:'Tamanduá-bandeira', definition:'Mamífero brasileiro de focinho comprido e língua adaptada para capturar formigas e cupins.', details:'Pode medir mais de um metro sem contar a cauda. Usa garras fortes para abrir cupinzeiros e costuma caminhar longas distâncias em busca de alimento.', curiosity:'Apesar de não ter dentes, consegue se alimentar rapidamente usando a língua pegajosa.', definitionAnswer:'Um mamífero brasileiro de focinho comprido que se alimenta de formigas e cupins.', detailAnswer:'Exemplos: pode medir mais de um metro; usa garras para abrir cupinzeiros; percorre longas distâncias.', newTerm:'tatu-bola', title:'Verbete: definição, detalhes e curiosidades', objective:'Analisar e produzir partes de verbete de enciclopédia infantil, diferenciando definição, detalhamento e curiosidade.'}},
  {type:'poem', title:'Rimas e imagens poéticas', theme:'Poema', codes:['EF35LP23'], data:{supportTitle:'Vento de manhã', lines:['O vento varreu a rua,','fez a cortina dançar,','empurrou nuvem e lua,','chamou o dia pra acordar.','','Passou correndo ligeiro,','assobiou no portão,','balançou o limoeiro,','e virou minha canção.'], verseCount:8, stanzaCount:2, rhyme:'rua/lua; dançar/acordar; ligeiro/limoeiro; portão/canção.', imageLine:'fez a cortina dançar', imageAnswer:'Atribui à cortina um movimento parecido com dança, provocado pelo vento.', feeling:'Predomina sensação de movimento e leveza, construída pelas ações do vento e pelo fechamento “virou minha canção”.', title:'Rimas e imagens poéticas', objective:'Interpretar rimas, personificação e imagens poéticas, observando como recursos sonoros e figurados produzem ritmo e sentido.'}},
  {type:'comics', title:'Balões, expressões e onomatopeias', theme:'História em quadrinhos', codes:['EF15LP14'], data:{supportTitle:'O despertador teimoso', p1:'Davi dorme e o relógio mostra 6h45; um balão de pensamento diz “Só mais cinco minutos...”.', p2:'o despertador toca “TRIM! TRIM!” e Davi abre os olhos assustado.', p3:'ele já está vestido, correndo para a porta, e grita “Agora não dá para perder nem um minuto!”.', expression:'Agora não dá para perder nem um minuto!', sound:'TRIM! TRIM!', a1:'Davi está dormindo e pensa em ficar mais cinco minutos na cama.', a2:'Revela urgência e preocupação porque ele percebe que precisa se apressar.', a3:'Representa o toque forte e repetido do despertador.', a4:'As imagens mostram Davi passando do sono para o susto e depois para a pressa.', a5:'A expressão corporal e a corrida de Davi mostram visualmente a urgência.', a6:'O humor vem do contraste entre querer dormir mais e depois ter de correr por falta de tempo.', title:'Balões, expressões e onomatopeias', objective:'Interpretar quadrinhos relacionando tipos de balão, expressões, sequência de ações e onomatopeias à construção de sentido.'}},
  {type:'instructions', title:'Instruções claras e ordem das ações', theme:'Texto instrucional', codes:['EF04LP13'], data:{supportTitle:'Como montar um marcador de página', intro:'O texto ensina a fazer um marcador simples para usar nos livros da turma.', materials:'uma tira de papel firme, lápis de cor, régua e fita adesiva transparente', steps:['Corte uma tira de papel com cerca de 5 cm de largura.','Desenhe e escreva seu nome em um dos lados.','Cubra os dois lados com fita adesiva transparente.','Apare as sobras de fita e teste o marcador em um livro.'], verb:'Corte', purpose:'Ensinar a montar um marcador de página.', materialAnswer:'Tira de papel firme, lápis de cor, régua e fita adesiva transparente.', verbAnswer:'Uma orientação para recortar o papel no tamanho inicial.', inversionAnswer:'Se cobrisse o papel com fita antes de desenhar e escrever, seria mais difícil colorir ou registrar o nome sobre a superfície plastificada.', title:'Instruções claras e ordem das ações', objective:'Analisar e produzir instruções com materiais, verbos no imperativo e passos organizados em sequência lógica.'}},
  {type:'narrative', title:'Relato em primeira pessoa', theme:'Relato pessoal', codes:['EF35LP29'], data:{supportTitle:'A manhã da apresentação', text:'Eu cheguei cedo à escola porque nossa turma apresentaria uma peça para as famílias. Primeiro ajudei a organizar as cadeiras; depois, conferi meu figurino e repeti minhas falas com Ana. Quando a cortina abriu, senti um frio na barriga, mas lembrei do ensaio. No final, ouvi os aplausos e fiquei aliviado por ter conseguido participar.', character:'O estudante que narra sua própria experiência.', setting:'Na escola, durante a preparação e a apresentação de uma peça.', conflict:'O narrador sente nervosismo antes de se apresentar.', solutionAction:'Ele se apoia no ensaio, participa da peça e conclui sua apresentação.', pointOfView:'Primeira pessoa, com marcas como “eu cheguei”, “ajudei”, “senti” e “fiquei”.', sequence:'Situação inicial: chega cedo e prepara o espaço; conflito: sente nervosismo; resolução: lembra do ensaio, participa e recebe aplausos.', trait:'Demonstra responsabilidade e coragem, pois ajuda na organização e enfrenta o nervosismo para se apresentar.', title:'Relato em primeira pessoa', objective:'Reconhecer o ponto de vista de primeira pessoa e ordenar acontecimentos, sentimentos e ações em um relato de experiência.'}},
  {type:'narrative', title:'Personagem, conflito e solução', theme:'Conto popular brasileiro', codes:['EF35LP29'], data:{supportTitle:'O pote na janela', text:'Em uma vila cercada por morros, todos conheciam Seu Amaro por consertar objetos quebrados. Um dia, uma menina levou até ele um pote de barro rachado que havia pertencido à avó. Seu Amaro avisou que a peça não voltaria a ser como antes, mas poderia ganhar nova função. Ele limpou o pote, fechou a rachadura e transformou-o em vaso. A menina plantou uma muda e colocou o vaso na janela, feliz por preservar a lembrança da família.', character:'A menina que leva o pote para conserto, com participação de Seu Amaro.', setting:'Numa vila cercada por morros, na oficina/casa de Seu Amaro.', conflict:'O pote de barro herdado da avó está rachado e não pode voltar a ser exatamente como antes.', solutionAction:'Seu Amaro restaura o pote e o transforma em vaso, permitindo que a menina preserve a lembrança.', pointOfView:'Terceira pessoa.', sequence:'Situação inicial: a menina leva o pote; conflito: ele está rachado e não pode ser restaurado totalmente; resolução: vira um vaso com uma muda.', trait:'A menina valoriza a memória da família, pois procura uma forma de conservar o objeto da avó.', title:'Personagem, conflito e solução', objective:'Identificar cenário, personagem, conflito gerador, ações de resolução e desfecho em conto de estrutura tradicional.'}},
  {type:'interview', title:'Entrevista: roteiro e respostas', theme:'Entrevista', codes:['EF04LP17'], data:{supportTitle:'Entrevista sobre o jornal da escola', intro:'Antes de gravar um programa para a rádio escolar, Ravi entrevistou Marta, estudante que participa do jornal da escola.', guest:'Marta', q1:'Como vocês escolhem as notícias que entram no jornal?', r1:'Observamos fatos da escola que interessam a várias turmas e conferimos as informações com professores ou responsáveis.', q2:'O que vocês fazem antes de publicar um texto?', r2:'Revisamos nomes, datas, pontuação e verificamos se opinião está identificada como opinião.', q3:'Qual foi a notícia de que você mais gostou de participar?', r3:'A cobertura da mostra cultural, porque conversei com estudantes de diferentes anos.', guestReason:'Marta é entrevistada porque participa do jornal da escola e conhece seu processo de produção.', a2:'Eles escolhem fatos de interesse das turmas e conferem as informações com fontes.', openQuestion:'As três são abertas; por exemplo, “Como vocês escolhem as notícias que entram no jornal?” exige explicação.', a4:'Informa que a equipe revisa nomes, datas e pontuação e verifica a identificação de opiniões antes de publicar.', sequenceAnswer:'As perguntas apresentam primeiro a seleção de pautas, depois a revisão e por fim uma experiência pessoal da entrevistada.', title:'Entrevista: roteiro e respostas', objective:'Planejar e analisar entrevista escolar, produzindo perguntas abertas, organizando roteiro e sintetizando respostas para apresentação oral.'}},
  {type:'campaign', title:'Campanha: informação, opinião e chamada à ação', theme:'Campanha educativa', codes:['EF04LP15','EF15LP04'], data:{supportTitle:'Menos plástico no recreio', author:'grêmio estudantil', audience:'estudantes e famílias', slogan:'Traga sua garrafa reutilizável!', fact:'A cantina recolheu 180 copos descartáveis em um único recreio de sexta-feira.', opinion:'Copos reutilizáveis são muito mais bonitos.', image:'uma garrafa reutilizável ao lado de uma pilha de copos descartáveis', purpose:'Reduzir o uso de copos descartáveis durante o recreio.', action:'Levar e usar garrafa reutilizável.', factKind:'Fato, porque apresenta um número ligado a uma coleta realizada em um momento definido.', opinionAnswer:'Opinião; “muito mais bonitos” expressa preferência pessoal.', imageAnswer:'A comparação visual entre uma garrafa e muitos copos reforça a ideia de reduzir resíduos.', title:'Campanha: informação, opinião e chamada à ação', objective:'Analisar campanha publicitária educativa distinguindo fato, opinião e sugestão, e relacionando texto verbal a recurso visual.'}},
  {type:'dialogue', title:'Pontuação que organiza o diálogo', theme:'Pontuação em diálogos', codes:['EF04LP05'], data:{supportTitle:'Preparando a exposição', intro:'Ao terminar o cartaz, Lívia chamou Téo e disse:', lines:['Você pode conferir o título?','Posso. Falta um ponto final nesta frase.','Verdade! Eu não tinha percebido.','Depois disso, vamos prender o cartaz no mural.'], questionLine:'“— Você pode conferir o título?”', exclamationLine:'“— Verdade! Eu não tinha percebido.”', title:'Pontuação que organiza o diálogo', objective:'Usar sinais de pontuação em discurso direto e explicar como eles organizam falas, perguntas, respostas e emoções.'}},
  {type:'cohesion', title:'Pronomes e palavras que retomam ideias', theme:'Coesão textual', codes:['EF35LP06'], data:{supportTitle:'A experiência de Manu', text:'Manu colocou três sementes de feijão em um pote transparente. A aluna cobriu as sementes com algodão úmido e deixou o recipiente perto da janela. Nos dias seguintes, ela observou pequenas raízes. Esse crescimento foi registrado em um caderno com desenhos e datas.', pronoun1:'ela', noun:'Manu', bad:'Manu observou o pote. Manu registrou o crescimento no caderno.', pronounSentence:'Esse crescimento foi registrado em um caderno', a1:'Manu.', a2:'“A aluna” retoma Manu; “o recipiente” retoma o pote transparente.', a4:'Exemplo: “Manu observou o pote e registrou o crescimento no caderno.”', a5:'Retoma o aparecimento/crescimento das pequenas raízes observado nos dias seguintes.', title:'Pronomes e palavras que retomam ideias', objective:'Recuperar referentes de pronomes e substituições lexicais e empregar retomadas que mantenham clareza e continuidade entre frases.'}},
  {type:'paragraph', title:'Revisando a organização dos parágrafos', theme:'Produção e revisão de parágrafo', codes:['EF35LP09','EF15LP06'], data:{supportTitle:'Nosso projeto de compostagem', text:'A turma começou um projeto de compostagem com restos de frutas do lanche. Primeiro, separamos uma caixa ventilada e combinamos quais resíduos poderiam ser colocados nela.\n\nA cada semana, dois estudantes verificam a umidade e registram as mudanças no material. Depois de algumas semanas, o composto será usado nos vasos e canteiros da escola.', sentence:'Também fizemos uma lista do que não deve ser colocado na caixa.', idea1:'A criação da composteira e a organização inicial dos resíduos.', idea2:'O acompanhamento semanal e o uso futuro do composto.', sentencePlace:'No primeiro parágrafo, porque a frase faz parte das regras e da organização inicial da composteira.', title:'Revisando a organização dos parágrafos', objective:'Revisar a divisão de texto em parágrafos, verificando unidade de sentido, progressão de ideias, pontuação e necessidade de reformulações.'}}
];

const collection = JSON.parse(fs.readFileSync(FILE, 'utf8'));
if (!Array.isArray(collection.atividades) || collection.atividades.length !== 50) {
  throw new Error(`Esperadas 50 atividades; encontradas ${collection.atividades?.length || 0}.`);
}
if (specs.length !== 50) throw new Error(`Specs inválidas: ${specs.length}.`);

const makers = {news, science, data:dataReading, narrative, narrativeProduction, accent, letter, entry, poem, comics, instructions, interview, campaign, dialogue, cohesion, paragraph, poster, map:mapReading, notice};

collection.colecao = '4ano-3bimestre-lingua-portuguesa-v3-revisao-editorial';
collection.statusBimestre = 'revisao-json-concluida-imagens-em-revisao';
collection.padraoPedagogico = 'teacheasy-v2';

collection.atividades = collection.atividades.map((activity, index) => {
  const spec = specs[index];
  const maker = makers[spec.type];
  if (!maker) throw new Error(`Gerador ausente para ${spec.type}`);
  const built = maker({...spec.data, title: spec.title});
  if (built.questions.length !== 8 || built.answers.length !== 8) throw new Error(`Atividade ${index + 1} não gerou 8/8.`);

  const figures = Array.isArray(activity.figuras) ? activity.figuras.map((figure, figIndex) => ({
    ...figure,
    id: figure.id || `lp-4ano-b3-${String(index + 1).padStart(2,'0')}-${figIndex + 1}`,
    arquivoValidado: figure.arquivoValidado !== false,
    descricao: figure.descricao && !/Ilustracao pedagogica relacionada/i.test(figure.descricao)
      ? figure.descricao
      : `Ilustração relacionada a “${spec.title}”, usada como apoio visual ao conteúdo da atividade.`,
    funcaoPedagogica: `Apoiar visualmente a compreensão do conteúdo trabalhado em “${spec.title}”.`,
    textoAlternativo: figure.textoAlternativo && !/Ilustracao pedagogica relacionada/i.test(figure.textoAlternativo)
      ? figure.textoAlternativo
      : `Ilustração pedagógica relacionada à atividade “${spec.title}”.`,
    compativelPretoBranco: figure.compativelPretoBranco !== false
  })) : [];

  return {
    ...activity,
    titulo: spec.title,
    tema: spec.theme,
    sequencia: `Atividade ${index + 1}`,
    tipoSequencia: index < 30 ? (activity.tipoSequencia || 'Sequência didática') : 'Revisão e aprofundamento editorial',
    padraoPedagogico: 'teacheasy-v2',
    dificuldade: activity.dificuldade || 'adequada-anos-iniciais',
    objetivo: built.objective,
    bncc: skillObjects(spec.codes),
    bnccConferida: true,
    quantidadeQuestoes: 8,
    possuiFiguras: figures.length > 0,
    figuras: figures,
    possuiGabarito: true,
    gabaritoCabecalho: {
      exibirBncc: true,
      usarCampoDaAtividade: 'bncc',
      observacao: 'A BNCC exibida no gabarito deve ser lida diretamente do campo bncc desta atividade, com código e habilidade oficial.'
    },
    possuiVersaoAdaptada: true,
    instrucaoGeral: 'Leia o texto de apoio com atenção e responda às oito questões. Use informações do texto para justificar suas respostas quando solicitado.',
    textoApoio: { titulo: built.supportTitle, conteudo: built.supportText },
    questoes: built.questions,
    gabarito: built.answers,
    revisao: {
      status: 'revisao-pedagogica-humana-pendente',
      bnccConferida: true,
      conteudoConferido: true,
      questoesConferidas: true,
      gabaritoConferido: true,
      ilustracaoConferida: false,
      validacaoAutomatica: true,
      fonteBncc: { titulo: 'Base Nacional Comum Curricular', url: BNCC_SOURCE }
    },
    ilustracao: {
      ...(activity.ilustracao || {}),
      objetivoPedagogico: `Apoiar a compreensão de “${spec.title}” com uma representação visual coerente com o texto e o objetivo da atividade.`,
      descricao: figures[0]?.descricao || `Representação pedagógica relacionada a “${spec.title}”, adequada ao 4º ano e com função didática clara.`,
      status: figures[0]?.arquivo ? 'produzida-pendente-conferencia-visual' : 'producao-visual-pendente',
      estilo: 'TeachEasy — ilustração pedagógica de Língua Portuguesa adequada ao 4º ano',
      ...(figures[0]?.arquivo ? {arquivo: figures[0].arquivo} : {})
    },
    versaoAdaptada: {
      orientacao: 'Apresentar uma questão por vez, destacar palavras-chave, permitir resposta oral quando necessário e oferecer tempo ampliado conforme a necessidade do estudante.'
    }
  };
});

const ids = new Set(collection.atividades.map(a=>a.id));
const titles = new Set(collection.atividades.map(a=>a.titulo.toLocaleLowerCase('pt-BR')));
const prompts = new Set(collection.atividades.flatMap(a=>a.questoes.map(q=>q.enunciado.toLocaleLowerCase('pt-BR'))));
if (ids.size !== 50 || titles.size !== 50 || prompts.size !== 400) {
  throw new Error(`Unicidade inválida: ids=${ids.size}, títulos=${titles.size}, questões=${prompts.size}.`);
}

fs.writeFileSync(FILE, JSON.stringify(collection, null, 2) + '\n', 'utf8');
console.log(`Revisão editorial gerada: 50 atividades, 400 questões e 400 respostas em ${FILE}.`);
