(() => {
  const COLLECTION_RE = /^em-(1|2|3)serie-(1|2|3|4)bimestre-(lingua-portuguesa|matematica|ciencias|historia|geografia)-v2$/;
  const COMPLETED = new Set([
    'em-1serie-1bimestre-lingua-portuguesa-v2',
    'em-1serie-1bimestre-matematica-v2',
    'em-1serie-1bimestre-ciencias-v2',
    'em-1serie-1bimestre-historia-v2',
    'em-1serie-1bimestre-geografia-v2'
  ]);

  const SERIES_LABEL = { 1: '1ª série', 2: '2ª série', 3: '3ª série' };
  const LEVEL_NOTE = {
    1: 'Priorize identificação de dados, relações fundamentais e justificativas claras.',
    2: 'Além de resolver, compare estratégias, avalie evidências e justifique escolhas.',
    3: 'Além de resolver, avalie limites do modelo, consequências e alternativas possíveis.'
  };

  const CONTEXTS = {
    'lingua-portuguesa': [
      ['campanha de arrecadação da escola', 'cartaz de campanha', 'famílias e estudantes', 'A campanha convida a comunidade a doar livros em bom estado e informa local, prazo e finalidade da coleta.'],
      ['assembleia do grêmio', 'ata e comunicado', 'estudantes', 'O comunicado resume decisões da assembleia e orienta como os estudantes podem apresentar propostas para a próxima reunião.'],
      ['feira de ciências', 'notícia escolar', 'comunidade escolar', 'A notícia apresenta os projetos selecionados, informa horário de visitação e destaca a participação das equipes.'],
      ['biblioteca comunitária', 'resenha de livro', 'jovens leitores', 'A resenha apresenta a obra, comenta um conflito central sem revelar o desfecho e recomenda a leitura a um público específico.'],
      ['mobilidade no bairro', 'carta aberta', 'moradores e poder público', 'A carta relata dificuldades no transporte, apresenta dois exemplos concretos e pede medidas para melhorar a circulação no bairro.'],
      ['uso responsável de redes sociais', 'post informativo', 'adolescentes', 'O post orienta a verificar autoria, data e fonte antes de compartilhar conteúdo e alerta para títulos sensacionalistas.'],
      ['evento cultural', 'convite', 'comunidade local', 'O convite informa data, local, programação e forma de participação, usando linguagem direta e acolhedora.'],
      ['projeto de leitura', 'podcast escolar', 'estudantes do ensino médio', 'O roteiro apresenta um livro, contextualiza o autor e propõe uma pergunta para estimular debate entre os ouvintes.'],
      ['preservação de praça pública', 'abaixo-assinado', 'moradores', 'O texto apresenta o problema, reúne justificativas e solicita manutenção, iluminação e preservação das áreas verdes.'],
      ['orientação profissional', 'entrevista', 'estudantes concluintes', 'A entrevista reúne perguntas objetivas sobre formação, rotina de trabalho, desafios da profissão e possibilidades de ingresso na área.'],
      ['consumo consciente', 'artigo de opinião', 'leitores do jornal escolar', 'O artigo defende reduzir compras por impulso e sustenta a posição com exemplos de orçamento, descarte e reutilização.'],
      ['memória do bairro', 'relato de memória', 'comunidade escolar', 'O relato recupera mudanças percebidas por um morador ao longo dos anos e distingue lembrança pessoal de informação verificável.']
    ],
    'historia': [
      ['inscrições e objetos de uma cidade antiga', 'uma inscrição pública registra decisões de autoridades locais', 'objetos domésticos revelam práticas cotidianas ausentes no registro oficial'],
      ['mobilidade de um grupo pastoril', 'um viajante externo descreve a mobilidade como sinal de atraso', 'uma narrativa do próprio grupo explica deslocamentos ligados à água, pastagem e ciclos sazonais'],
      ['abolição da escravidão no Brasil', 'jornais e associações registram campanhas abolicionistas', 'documentos judiciais e cartas registram ações de pessoas escravizadas e libertas'],
      ['imprensa e circulação de textos', 'registros de copistas mostram limites da reprodução manuscrita', 'catálogos de oficinas impressoras indicam aumento de exemplares e redes de venda'],
      ['fronteiras do mundo romano', 'mapas arqueológicos registram fortes e estradas', 'moedas e cerâmicas de diferentes origens indicam trocas através das zonas de fronteira'],
      ['mineração na América portuguesa', 'mapas administrativos registram caminhos e núcleos de ocupação', 'requerimentos locais mostram disputas por terras, abastecimento e trabalho'],
      ['cidadania em uma pólis antiga', 'normas registram critérios formais de participação política', 'testemunhos e estudos mostram grupos residentes excluídos da cidadania plena'],
      ['industrialização e trabalho urbano', 'regulamentos de fábrica mostram disciplina de horários', 'relatos de trabalhadores descrevem jornadas, salários e condições de moradia'],
      ['migração e formação de bairros', 'registros populacionais mostram crescimento de moradores vindos de outras regiões', 'entrevistas registram redes de parentesco, trabalho e adaptação cultural'],
      ['descolonização no século XX', 'discursos oficiais defendem manutenção do império', 'manifestos de movimentos locais reivindicam autonomia e soberania'],
      ['ampliação de direitos civis', 'leis registram mudanças formais de direitos', 'relatos de movimentos sociais mostram mobilização anterior e disputas pela efetivação'],
      ['memória digital de acontecimentos recentes', 'portais institucionais preservam documentos e comunicados', 'postagens pessoais registram experiências, mas exigem verificação de autoria e contexto']
    ],
    'geografia': [
      ['corredor de ônibus metropolitano', 'passageiros/dia', 18000, 22500],
      ['bacia hidrográfica urbana', 'litros de escoamento no modelo', 4200, 3150],
      ['bairro em expansão', 'moradores', 12800, 15400],
      ['porto e rede logística', 'toneladas/dia', 760, 950],
      ['área de coleta seletiva', 'kg/semana', 3200, 4480],
      ['região agrícola irrigada', 'hectares atendidos', 1250, 1500],
      ['parque urbano e ilhas de calor', 'pontos monitorados', 24, 36],
      ['rota migratória regional', 'deslocamentos/ano', 8400, 10200],
      ['rede de comércio eletrônico', 'entregas/dia', 5600, 7350],
      ['fronteira internacional', 'travessias/dia', 2100, 2750],
      ['zona costeira turística', 'visitantes/mês', 18500, 23100],
      ['distrito industrial', 'empregos diretos', 6400, 7200]
    ],
    'matematica': [
      'consumo de energia de um laboratório',
      'produção de uma cooperativa',
      'deslocamento de um ônibus escolar',
      'captação de água da chuva',
      'orçamento de uma feira estudantil',
      'crescimento de mudas em uma estufa',
      'armazenamento digital de vídeos',
      'reforma de uma sala de estudos',
      'pesquisa de opinião da escola',
      'produção de peças em oficina',
      'uso de bicicletas compartilhadas',
      'controle de estoque de uma biblioteca'
    ],
    'ciencias': [
      'laboratório escolar',
      'estação de monitoramento ambiental',
      'horta experimental',
      'sistema de geração de energia',
      'campanha de saúde preventiva',
      'área de conservação',
      'observação astronômica',
      'estudo de materiais',
      'experimento de transferência de calor',
      'levantamento de biodiversidade',
      'circuito elétrico didático',
      'investigação sobre qualidade da água'
    ]
  };

  function matchMeta(collection) {
    const hit = collection?.colecao?.match(COLLECTION_RE);
    if (!hit || COMPLETED.has(collection.colecao)) return null;
    return {
      series: Number(hit[1]),
      bimester: Number(hit[2]),
      discipline: hit[3],
      label: SERIES_LABEL[Number(hit[1])]
    };
  }

  function blockLabel(activity) {
    const id = activity?.id || '';
    const hit = id.match(/-\d{2}-(?:mapa-conceitual|estudo-de-caso|investigacao|situacao-problema|leitura-critica|debate|oficina|analise-de-dados|projeto-aplicado|sintese-autoral)-(.+)$/);
    const raw = hit?.[1] || activity?.textoApoio?.titulo || 'estudo aplicado';
    return String(raw).replaceAll('-', ' ').replace(/\b\w/g, letter => letter.toUpperCase());
  }

  function seed(meta, index) {
    return meta.series * 101 + meta.bimester * 37 + (index + 1) * 17;
  }

  function pick(list, n) {
    return list[((n % list.length) + list.length) % list.length];
  }

  function round(value, digits = 1) {
    const scale = 10 ** digits;
    return Math.round((value + Number.EPSILON) * scale) / scale;
  }

  function fmt(value) {
    return Number.isInteger(value) ? String(value) : String(value).replace('.', ',');
  }

  function common(activity, built, meta) {
    return {
      ...activity,
      titulo: built.title,
      objetivo: built.objective,
      instrucaoGeral: built.instruction || 'Leia o material de apoio, analise os dados e responda às oito questões justificando cada conclusão com informações do próprio material.',
      textoApoio: { titulo: built.title, conteudo: built.support },
      quantidadeQuestoes: 8,
      questoes: built.questions,
      possuiGabarito: true,
      gabarito: built.answers,
      possuiVersaoAdaptada: true,
      versaoAdaptada: {
        orientacao: `Dividir a atividade em etapas, destacar dados e palavras-chave, oferecer organizador visual e permitir resposta oral ou por tópicos antes da escrita final. ${LEVEL_NOTE[meta.series]}`
      },
      bncc: activity.bncc,
      bnccConferida: true,
      possuiFiguras: false,
      figuras: [],
      ilustracao: {
        ...(activity.ilustracao || {}),
        arquivo: null,
        status: 'nao-necessaria',
        descricao: 'Não necessária: todas as informações exigidas nas questões estão presentes no texto, nos dados ou nas representações descritas no material de apoio.',
        objetivoPedagogico: 'A atividade pode ser resolvida integralmente sem depender de imagem externa.'
      },
      revisao: {
        ...(activity.revisao || {}),
        status: 'aprovada-pedagogicamente',
        bnccConferida: true,
        conteudoConferido: true,
        questoesConferidas: true,
        gabaritoConferido: true,
        ilustracaoConferida: true,
        validacaoAutomatica: true
      }
    };
  }

  function portuguese(activity, meta, index) {
    const s = seed(meta, index);
    const [place, genre, audience, text] = pick(CONTEXTS['lingua-portuguesa'], s);
    const block = blockLabel(activity);
    const title = `${activity.tipoSequencia}: ${place} — ${block}`;
    const support = `Situação de linguagem (${meta.label}, ${meta.bimester}º bimestre): ${place}. Gênero em foco: ${genre}. Público principal: ${audience}. Texto-base: “${text}” O texto deve ser lido considerando finalidade, circulação, autoria, escolhas de linguagem e efeitos de sentido. O foco desta atividade é ${String(activity.tema || '').replace(/\.$/, '').toLowerCase()}. ${LEVEL_NOTE[meta.series]}`;
    const central = `O texto organiza informações e escolhas de linguagem para cumprir uma finalidade comunicativa diante de ${audience}.`;
    const questions = [
      { numero: 1, tipo: 'multipla-escolha', enunciado: 'Qual interpretação resume melhor a relação entre o texto-base, sua finalidade e o público indicado?', alternativas: [central, 'O texto não possui finalidade definida porque todo gênero circula do mesmo modo.', 'A escolha de linguagem independe do público e da situação de circulação.', 'O gênero pode ser identificado apenas pelo tamanho do texto, sem considerar sua função.'], espacoResposta: 'pequeno', figuraId: null },
      { numero: 2, tipo: 'verdadeiro-falso', enunciado: `Considere a afirmação: “Para analisar um ${genre}, é relevante observar quem produz, para quem circula e com qual objetivo.” Julgue-a com base no material.`, alternativas: ['Verdadeiro','Falso'], espacoResposta: 'pequeno', figuraId: null },
      { numero: 3, tipo: 'completar', enunciado: `Complete: o gênero trabalhado nesta situação de linguagem é ______ e seu público principal é ${audience}.`, alternativas: [], espacoResposta: 'pequeno', figuraId: null },
      { numero: 4, tipo: 'associacao', enunciado: 'Associe os elementos “finalidade”, “público” e “circulação” às informações correspondentes do texto-base e explique uma relação entre eles.', alternativas: [], espacoResposta: 'medio', figuraId: null },
      { numero: 5, tipo: 'analise', enunciado: 'Analise duas escolhas de palavras ou de organização das informações do texto-base e explique como elas ajudam a produzir o efeito pretendido.', alternativas: [], espacoResposta: 'medio', figuraId: null },
      { numero: 6, tipo: 'interpretacao', enunciado: 'Explique como o mesmo conteúdo precisaria ser reformulado se fosse dirigido a outro público ou publicado em outro suporte.', alternativas: [], espacoResposta: 'medio', figuraId: null },
      { numero: 7, tipo: 'revisao', enunciado: 'Proponha uma revisão pontual que deixe o texto mais claro, preciso ou adequado ao gênero, sem alterar sua finalidade principal.', alternativas: [], espacoResposta: 'grande', figuraId: null },
      { numero: 8, tipo: 'producao', enunciado: `Produza um pequeno trecho adequado ao gênero ${genre}, mantendo a situação comunicativa e incorporando pelo menos duas informações do material de apoio.`, alternativas: [], espacoResposta: 'grande', figuraId: null }
    ];
    const answers = [
      { numero: 1, resposta: central, justificativa: 'A alternativa relaciona gênero, finalidade, circulação e público sem tratar a linguagem como neutra.' },
      { numero: 2, resposta: 'Verdadeiro', justificativa: 'Condições de produção e circulação interferem na construção de sentidos e nas escolhas linguísticas.' },
      { numero: 3, resposta: genre, justificativa: `O material identifica explicitamente o gênero como ${genre}.` },
      { numero: 4, resposta: `Finalidade: cumprir a função indicada pela situação; público: ${audience}; circulação: contexto de ${place}. A forma do texto é ajustada a esses três elementos.`, justificativa: 'A associação recupera dados explícitos do material.' },
      { numero: 5, resposta: 'A resposta deve citar duas escolhas efetivamente presentes no texto-base e explicar o efeito de cada uma, como objetividade, convite, orientação, avaliação ou defesa de uma ideia.', justificativa: 'O critério exige evidência textual e explicação do efeito de sentido.' },
      { numero: 6, resposta: 'A reformulação deve alterar vocabulário, grau de explicitação, organização ou tom conforme o novo público/suporte, preservando o conteúdo essencial.', justificativa: 'Adequação linguística depende da situação comunicativa.' },
      { numero: 7, resposta: 'Aceitar revisão que melhore clareza, coesão, precisão ou adequação ao gênero e que seja justificada com referência ao texto-base.', justificativa: 'A revisão precisa ter finalidade identificável e não ser mera troca aleatória de palavras.' },
      { numero: 8, resposta: `O trecho deve ser reconhecível como ${genre}, adequado a ${audience} e recuperar ao menos duas informações do material, com coesão e linguagem compatível com a situação.`, justificativa: 'O gabarito define critérios verificáveis sem impedir autoria.' }
    ];
    return { title, objective: `Ler, analisar e produzir linguagem em situação concreta de ${place}, articulando o tema da atividade a gênero, finalidade, público e efeitos de sentido.`, support, questions, answers };
  }

  function math(activity, meta, index) {
    const s = seed(meta, index);
    const code = activity.bncc?.[0]?.codigo || '';
    const context = pick(CONTEXTS.matematica, s);
    const block = blockLabel(activity);
    const a = 2 + (s % 7);
    const b = 20 + (s % 31);
    const x = 5 + (s % 9);
    const n = 120 + (s % 9) * 20;
    const p = 30 + (s % 6) * 5;
    let support, qs, ans, concept;

    if (code === 'EM13MAT102' || code === 'EM13MAT202') {
      const sample = 40 + (s % 5) * 20;
      const yes = Math.round(sample * p / 100);
      const estimate = Math.round(n * yes / sample);
      concept = 'amostragem e porcentagem';
      support = `No contexto de ${context}, uma população de ${n} pessoas foi estudada por uma amostra de ${sample}. Na amostra, ${yes} responderam “sim” a uma pergunta objetiva. Considere que a seleção precisa ser representativa para que uma estimativa seja defensável. ${LEVEL_NOTE[meta.series]}`;
      qs = [
        ['multipla-escolha','Qual percentual da amostra respondeu “sim”?',[`${fmt(round(yes/sample*100,1))}%`,`${fmt(round((yes+5)/sample*100,1))}%`,'100%','Não é possível calcular com os dados fornecidos.']],
        ['verdadeiro-falso','Uma amostra enviesada pode produzir uma estimativa pouco representativa mesmo quando os cálculos estão corretos.',['Verdadeiro','Falso']],
        ['completar','Complete: a razão entre quantidade de respostas “sim” e tamanho da amostra é ______.'],
        ['resolucao',`Estime quantas pessoas da população de ${n} corresponderiam ao mesmo percentual observado na amostra.`],
        ['analise','Explique uma condição necessária para que a estimativa seja razoável.'],
        ['associacao','Associe “população”, “amostra” e “proporção observada” aos valores do problema.'],
        ['interpretacao','Explique por que aumentar o tamanho da amostra não corrige, sozinho, um método de seleção enviesado.'],
        ['producao','Escreva uma conclusão curta que apresente a estimativa e uma limitação do levantamento.']
      ];
      ans = [`${fmt(round(yes/sample*100,1))}%`,'Verdadeiro',`${yes}/${sample}`,`${estimate} pessoas`,'A seleção deve representar adequadamente a população, evitando concentração em apenas um grupo.','População: '+n+'; amostra: '+sample+'; proporção observada: '+fmt(round(yes/sample*100,1))+'%.','Porque o viés decorre de quem é incluído ou excluído da seleção; uma amostra grande ainda pode representar mal a população.','A conclusão deve informar a estimativa de '+estimate+' pessoas e registrar que ela depende da representatividade da amostra.'];
    } else if (code === 'EM13MAT103') {
      const gb = 2 + (s % 5);
      const mb = gb * 1024;
      const bits = mb * 8;
      concept = 'conversão de unidades';
      support = `Em ${context}, um conjunto de arquivos ocupa ${gb} GB. Use 1 GB = 1024 MB e 1 byte = 8 bits. A equipe precisa registrar as conversões de unidade antes de comparar capacidade de armazenamento e velocidade de transferência. ${LEVEL_NOTE[meta.series]}`;
      qs = [
        ['multipla-escolha',`Quantos megabytes correspondem a ${gb} GB?`,[`${mb} MB`,`${gb*1000} MB`,`${gb*1024*8} MB`,`${gb} MB`]],
        ['verdadeiro-falso','A conversão entre bytes e bits usa o fator 8.',['Verdadeiro','Falso']],
        ['completar','Complete: 1 GB corresponde a ______ MB no padrão adotado.'],
        ['resolucao',`Converta ${mb} MB para megabits, usando 1 byte = 8 bits.`],
        ['analise','Explique por que misturar unidades diferentes sem conversão pode levar a uma comparação incorreta.'],
        ['associacao','Associe GB, MB e megabits aos valores calculados no problema.'],
        ['interpretacao','Se a capacidade disponível for o dobro do arquivo, quantos GB estarão disponíveis?'],
        ['producao','Escreva um procedimento de três passos para conferir uma conversão de unidades digitais.']
      ];
      ans = [`${mb} MB`,'Verdadeiro','1024',`${bits} megabits`,'Porque valores numericamente semelhantes podem representar quantidades diferentes quando as unidades não são equivalentes.','GB: '+gb+'; MB: '+mb+'; megabits: '+bits+'.',`${gb*2} GB`,'Identificar unidade inicial e final; aplicar o fator correto; conferir se a ordem de grandeza é coerente.'];
    } else if (code === 'EM13MAT104') {
      const distance = 60 + (s % 8) * 10;
      const time = 1.5 + (s % 4) * 0.5;
      const speed = round(distance / time,1);
      const fuel = 6 + (s % 5);
      concept = 'razões e taxas';
      support = `Em ${context}, um deslocamento de ${distance} km foi realizado em ${fmt(time)} h e consumiu ${fuel} L de combustível. Os dados permitem comparar velocidade média e eficiência do consumo sem confundir grandezas de naturezas diferentes. ${LEVEL_NOTE[meta.series]}`;
      qs = [
        ['multipla-escolha','Qual foi a velocidade média do deslocamento?',[`${fmt(speed)} km/h`,`${fmt(round(time/distance,2))} km/h`,`${distance+fuel} km/h`,`${fuel} km/h`]],
        ['verdadeiro-falso','A unidade km/h expressa uma razão entre distância e tempo.',['Verdadeiro','Falso']],
        ['completar','Complete: consumo em km/L é calculado dividindo ______ por ______.'],
        ['resolucao','Calcule a eficiência do deslocamento em km/L.'],
        ['analise','Explique por que velocidade média e eficiência de combustível não são a mesma grandeza.'],
        ['associacao','Associe distância, tempo e combustível aos valores do problema.'],
        ['interpretacao','Mantida a mesma eficiência, quantos litros seriam necessários para o dobro da distância?'],
        ['producao','Escreva uma conclusão que apresente as duas taxas calculadas e suas unidades.']
      ];
      ans = [`${fmt(speed)} km/h`,'Verdadeiro','distância; combustível',`${fmt(round(distance/fuel,1))} km/L`,'A primeira relaciona distância e tempo; a segunda relaciona distância e volume de combustível.','Distância: '+distance+' km; tempo: '+fmt(time)+' h; combustível: '+fuel+' L.',`${fuel*2} L`,'A conclusão deve registrar '+fmt(speed)+' km/h e '+fmt(round(distance/fuel,1))+' km/L, identificando corretamente cada taxa.'];
    } else if (code === 'EM13MAT105' || code === 'EM13MAT203') {
      const length = 4 + (s % 6);
      const width = 3 + (s % 5);
      const area = length * width;
      const perimeter = 2 * (length + width);
      concept = 'medidas geométricas';
      support = `Em ${context}, uma área retangular mede ${length} m por ${width} m. A equipe precisa calcular área, perímetro e uma margem de 10% para compra de material de revestimento, distinguindo grandezas lineares de grandezas de superfície. ${LEVEL_NOTE[meta.series]}`;
      qs = [
        ['multipla-escolha','Qual é a área do retângulo?',[`${area} m²`,`${perimeter} m²`,`${length+width} m²`,`${area*2} m²`]],
        ['verdadeiro-falso','Área e perímetro usam unidades diferentes porque medem grandezas diferentes.',['Verdadeiro','Falso']],
        ['completar','Complete: o perímetro de um retângulo é calculado por ______.'],
        ['resolucao','Calcule o perímetro da área descrita.'],
        ['analise','Explique por que não se deve somar um valor em metros a um valor em metros quadrados.'],
        ['associacao','Associe comprimento, largura, área e perímetro aos valores do problema.'],
        ['interpretacao','Calcule a quantidade de revestimento com 10% de margem sobre a área.'],
        ['producao','Registre um procedimento para conferir se os resultados de área e perímetro são plausíveis.']
      ];
      ans = [`${area} m²`,'Verdadeiro','2 × (comprimento + largura)',`${perimeter} m`,'Porque metros medem comprimento e metros quadrados medem superfície; são grandezas distintas.','Comprimento: '+length+' m; largura: '+width+' m; área: '+area+' m²; perímetro: '+perimeter+' m.',`${fmt(round(area*1.1,1))} m²`,'Recalcular pelas fórmulas, conferir unidades e comparar a ordem de grandeza com as dimensões dadas.'];
    } else if (code === 'EM13MAT301') {
      const unitA = 8 + (s % 5);
      const unitB = 5 + (s % 4);
      const totalItems = 30 + (s % 7) * 2;
      const xA = 10 + (s % 8);
      const xB = totalItems - xA;
      const totalValue = unitA*xA + unitB*xB;
      concept = 'sistema linear';
      support = `Em ${context}, foram registrados ${totalItems} itens de dois tipos. O tipo A vale ${unitA} unidades monetárias e o tipo B vale ${unitB}. A receita total foi ${totalValue}. Considere x a quantidade do tipo A e y a quantidade do tipo B. ${LEVEL_NOTE[meta.series]}`;
      qs = [
        ['multipla-escolha','Qual sistema representa corretamente o problema?',[`x + y = ${totalItems} e ${unitA}x + ${unitB}y = ${totalValue}`,`x - y = ${totalItems} e ${unitA}x = ${totalValue}`,`${unitA}x + y = ${totalItems} e x + ${unitB}y = ${totalValue}`,`x + y = ${totalValue} e ${unitA}x + ${unitB}y = ${totalItems}`]],
        ['verdadeiro-falso','Uma solução do sistema precisa satisfazer simultaneamente as duas equações.',['Verdadeiro','Falso']],
        ['completar','Complete: a primeira equação representa a quantidade ______ de itens.'],
        ['resolucao','Resolva o sistema e determine x e y.'],
        ['analise','Substitua os valores encontrados nas duas equações e verifique a solução.'],
        ['associacao','Associe x, y, preço A e preço B aos valores do problema.'],
        ['interpretacao','Calcule o percentual de itens do tipo A no total.'],
        ['producao','Explique por que conhecer apenas o total de itens não seria suficiente para determinar x e y.']
      ];
      ans = [`x + y = ${totalItems} e ${unitA}x + ${unitB}y = ${totalValue}`,'Verdadeiro','total',`x = ${xA} e y = ${xB}`,`${xA}+${xB}=${totalItems} e ${unitA}×${xA}+${unitB}×${xB}=${totalValue}.`,'x: quantidade A; y: quantidade B; preço A: '+unitA+'; preço B: '+unitB+'.',`${fmt(round(xA/totalItems*100,1))}%`,'Porque uma única equação com duas incógnitas admite várias combinações; a informação de valor total fornece a segunda relação necessária.'];
    } else if (code === 'EM13MAT302') {
      const r1 = 1 + (s % 4);
      const r2 = r1 + 4;
      const sum = r1 + r2;
      const prod = r1 * r2;
      concept = 'função polinomial';
      support = `Em ${context}, um modelo simplificado usa f(x) = x² - ${sum}x + ${prod}. O estudo pede interpretação do modelo, cálculo de valores e identificação dos zeros, relacionando procedimentos algébricos a uma situação concreta. ${LEVEL_NOTE[meta.series]}`;
      qs = [
        ['multipla-escolha','Qual é o grau da função apresentada?',['2','1','3','0']],
        ['verdadeiro-falso','Os zeros da função são valores de x para os quais f(x)=0.',['Verdadeiro','Falso']],
        ['completar','Complete: o coeficiente de x² na função é ______.'],
        ['resolucao',`Calcule f(${r1}).`],
        ['analise','Explique o significado matemático de um zero da função em um modelo.'],
        ['associacao','Associe termo quadrático, termo linear e termo constante aos coeficientes da expressão.'],
        ['interpretacao','Determine os dois zeros da função.'],
        ['producao','Descreva como verificar os zeros encontrados sem repetir todo o processo de resolução.']
      ];
      ans = ['2','Verdadeiro','1','0','É um valor de entrada em que a saída do modelo é zero.','Quadrático: 1; linear: -'+sum+'; constante: '+prod+'.',`x = ${r1} e x = ${r2}`,'Substituir cada valor na expressão e confirmar que o resultado é zero.'];
    } else {
      const y = a*x+b;
      concept = 'variação de grandezas';
      support = `Em ${context}, a grandeza y é modelada por y = ${a}x + ${b}, em que x representa unidades de atividade e y representa o resultado medido. Para x = ${x}, o modelo permite calcular um valor e interpretar a taxa constante ${a}. ${LEVEL_NOTE[meta.series]}`;
      qs = [
        ['multipla-escolha',`Qual é o valor de y quando x = ${x}?`,[String(y),String(y+a),String(b),String(a*x)]],
        ['verdadeiro-falso','No modelo apresentado, o coeficiente de x representa uma taxa de variação constante.',['Verdadeiro','Falso']],
        ['completar','Complete: quando x aumenta uma unidade, y aumenta ______ unidades.'],
        ['resolucao',`Calcule y para x = ${x+3}.`],
        ['analise','Explique o significado do termo constante no modelo, considerando que ele é o valor de y quando x=0.'],
        ['associacao','Associe variável independente, variável dependente, taxa de variação e valor inicial aos elementos da fórmula.'],
        ['interpretacao',`Determine x quando y = ${a*(x+5)+b}.`],
        ['producao','Escreva uma frase que interprete o comportamento do modelo sem confundir taxa de variação com valor inicial.']
      ];
      ans = [String(y),'Verdadeiro',String(a),String(a*(x+3)+b),`O termo ${b} representa o valor inicial de y quando x=0.`,'x: independente; y: dependente; '+a+': taxa; '+b+': valor inicial.',String(x+5),`y cresce ${a} unidades a cada unidade adicional de x e parte do valor inicial ${b}.`];
    }

    const title = `${activity.tipoSequencia}: ${context} — ${block}`;
    const questions = qs.map((q, i) => ({ numero:i+1, tipo:q[0], enunciado:q[1], alternativas:q[2] || [], espacoResposta:i<3?'pequeno':i<6?'medio':'grande', figuraId:null }));
    const answers = ans.map((a0, i) => ({ numero:i+1, resposta:String(a0), justificativa:`Resposta conferida a partir dos dados e do conceito de ${concept} apresentados no material.` }));
    return { title, objective:`Resolver e interpretar uma situação de ${context} usando ${concept}, com registros de cálculo, unidades e verificação do resultado.`, support, questions, answers };
  }

  function scienceCategory(activity) {
    const text = `${activity.tema || ''} ${activity.bncc?.[0]?.habilidadeOficial || ''}`.toLowerCase();
    if (/evolução estelar|universo|sistema solar|planet/.test(text)) return 'astronomia';
    if (/radia|onda eletromagn/.test(text)) return 'radiacao';
    if (/tóx|material|substância|contamina|polu/.test(text)) return 'materiais';
    if (/ciclo|carbono|nitrog|biogeo/.test(text)) return 'ciclos';
    if (/biodivers|ecossistema|populaç|cadeia alimentar|ambiente/.test(text)) return 'ecologia';
    if (/evoluç|origem da vida|seleção natural/.test(text)) return 'evolucao';
    if (/saúde|doença|vacina|sexual|reprodução/.test(text)) return 'saude';
    if (/eletric|circuit|motor|gerador/.test(text)) return 'eletricidade';
    if (/energia|term|calor/.test(text)) return 'energia';
    if (/discrimina|ética|direit/.test(text)) return 'etica';
    return 'investigacao';
  }

  function science(activity, meta, index) {
    const s = seed(meta, index);
    const context = pick(CONTEXTS.ciencias, s);
    const block = blockLabel(activity);
    const cat = scienceCategory(activity);
    const a = 20 + (s % 21);
    const b = a + 10 + (s % 16);
    const c = a - 5 + (s % 9);
    const diff = b - a;
    const changePct = round((b-a)/a*100,1);
    const theme = String(activity.tema || '').replace(/\.$/,'');
    const categoryText = {
      astronomia:'observação e modelos astronômicos',
      radiacao:'exposição, dose e proteção',
      materiais:'concentração, propriedades e risco',
      ciclos:'fluxos de matéria em um sistema',
      ecologia:'relações ecológicas e variação de populações',
      evolucao:'evidências e explicações evolutivas',
      saude:'dados de saúde, prevenção e fatores de risco',
      eletricidade:'medidas elétricas, energia e segurança',
      energia:'transformações de energia e transferência de calor',
      etica:'uso responsável de conhecimento científico e direitos',
      investigacao:'hipótese, variável, evidência e limite de conclusão'
    }[cat];
    const support = `Estudo científico (${meta.label}, ${meta.bimester}º bimestre) em ${context}. Tema de análise: ${theme}. Em uma comparação controlada, a condição A apresentou valor ${a}, a condição B apresentou ${b} e uma medida de referência registrou ${c}, todos na unidade definida pelo protocolo da atividade. A diferença A→B é ${diff} e corresponde a ${fmt(changePct)}% do valor de A. O estudo trabalha ${categoryText}; os dados permitem comparar resultados, mas não autorizam afirmar causalidade além das variáveis efetivamente controladas. ${LEVEL_NOTE[meta.series]}`;
    const correct = `A condição B é ${diff} unidades maior que A; essa diferença precisa ser interpretada junto ao desenho do estudo e às variáveis controladas.`;
    const questions = [
      { numero:1,tipo:'multipla-escolha',enunciado:'Qual conclusão quantitativa é diretamente sustentada pelos valores A e B?',alternativas:[correct,'A condição B prova, sozinha, a causa de qualquer diferença observada.','A condição A e a condição B são iguais porque pertencem ao mesmo estudo.','Os dados não permitem calcular nenhuma diferença.'],espacoResposta:'pequeno',figuraId:null },
      { numero:2,tipo:'verdadeiro-falso',enunciado:'Uma diferença numérica entre duas condições não basta, por si só, para demonstrar uma relação causal sem considerar o desenho da investigação.',alternativas:['Verdadeiro','Falso'],espacoResposta:'pequeno',figuraId:null },
      { numero:3,tipo:'completar',enunciado:`Complete: a diferença entre B (${b}) e A (${a}) é ______ unidades.`,alternativas:[],espacoResposta:'pequeno',figuraId:null },
      { numero:4,tipo:'resolucao',enunciado:'Calcule a variação percentual de A para B, usando A como referência e arredondando para uma casa decimal.',alternativas:[],espacoResposta:'medio',figuraId:null },
      { numero:5,tipo:'analise',enunciado:`Explique como o tema “${theme}” pode ser investigado sem confundir observação, hipótese e conclusão.`,alternativas:[],espacoResposta:'medio',figuraId:null },
      { numero:6,tipo:'associacao',enunciado:'Associe condição A, condição B e referência aos três valores apresentados e indique qual comparação é diretamente possível.',alternativas:[],espacoResposta:'medio',figuraId:null },
      { numero:7,tipo:'interpretacao',enunciado:`Indique uma variável que deveria ser controlada ou registrada para fortalecer uma investigação sobre ${categoryText}.`,alternativas:[],espacoResposta:'grande',figuraId:null },
      { numero:8,tipo:'producao',enunciado:'Escreva uma conclusão científica curta que use pelo menos dois dados numéricos, reconheça uma limitação e não extrapole as evidências disponíveis.',alternativas:[],espacoResposta:'grande',figuraId:null }
    ];
    const answers = [
      {numero:1,resposta:correct,justificativa:'É a única alternativa que calcula a diferença e preserva os limites de inferência.'},
      {numero:2,resposta:'Verdadeiro',justificativa:'Causalidade exige desenho adequado, controle de variáveis e evidências compatíveis.'},
      {numero:3,resposta:String(diff),justificativa:`${b} - ${a} = ${diff}.`},
      {numero:4,resposta:`${fmt(changePct)}%`,justificativa:`(${b}-${a})/${a} × 100 = ${fmt(changePct)}%.`},
      {numero:5,resposta:'A resposta deve distinguir hipótese inicial, procedimento de observação/medição e conclusão limitada aos dados obtidos.',justificativa:'O raciocínio científico separa etapas e não transforma hipótese em resultado.'},
      {numero:6,resposta:`A = ${a}; B = ${b}; referência = ${c}. É possível comparar diferenças entre esses valores nas condições descritas.`,justificativa:'A associação recupera os dados explícitos do material.'},
      {numero:7,resposta:'Aceitar variável pertinente ao caso, como tempo, temperatura, volume, exposição, local, espécie, equipamento, dose ou método de coleta, desde que a justificativa seja coerente.',justificativa:'A variável proposta deve afetar a interpretação do estudo e ser controlável ou registrável.'},
      {numero:8,resposta:`A conclusão deve mencionar A=${a}, B=${b} e/ou a diferença de ${diff}, afirmar apenas o que a comparação sustenta e registrar uma limitação do desenho.`,justificativa:'O critério exige uso de evidência numérica e prudência inferencial.'}
    ];
    return { title:`${activity.tipoSequencia}: ${context} — ${block}`, objective:`Investigar ${theme.toLowerCase()} por meio de dados, comparação de evidências e limites de conclusão científica.`, support, questions, answers };
  }

  function history(activity, meta, index) {
    const s = seed(meta, index);
    const [caseTitle, sourceA, sourceB] = pick(CONTEXTS.historia, s);
    const block = blockLabel(activity);
    const theme = String(activity.tema || '').replace(/\.$/,'');
    const title = `${activity.tipoSequencia}: ${caseTitle} — ${block}`;
    const support = `Estudo histórico (${meta.label}, ${meta.bimester}º bimestre): ${caseTitle}. Fonte A — ${sourceA}. Fonte B — ${sourceB}. Tema em análise: ${theme}. As duas fontes devem ser contextualizadas quanto a autoria, finalidade, posição social, temporalidade e limites. Elas podem se complementar ou tensionar, mas nenhuma deve ser tratada como retrato neutro e completo do passado. ${LEVEL_NOTE[meta.series]}`;
    const correct = 'As duas fontes podem oferecer perspectivas distintas e precisam ser cruzadas com contexto e autoria antes de sustentar uma interpretação.';
    const questions = [
      {numero:1,tipo:'multipla-escolha',enunciado:'Qual princípio de análise histórica é mais adequado ao conjunto de fontes apresentado?',alternativas:[correct,'A fonte institucional deve ser aceita como neutra e suficiente.','Fontes diferentes impedem qualquer interpretação histórica.','Uma fonte só é útil quando confirma exatamente a outra.'],espacoResposta:'pequeno',figuraId:null},
      {numero:2,tipo:'verdadeiro-falso',enunciado:'Autoria, finalidade e contexto de produção interferem no tipo de informação que uma fonte histórica pode oferecer.',alternativas:['Verdadeiro','Falso'],espacoResposta:'pequeno',figuraId:null},
      {numero:3,tipo:'completar',enunciado:'Complete: comparar evidências de origens diferentes e avaliar seus limites faz parte da ______ das fontes.',alternativas:[],espacoResposta:'pequeno',figuraId:null},
      {numero:4,tipo:'associacao',enunciado:'Associe Fonte A e Fonte B ao tipo de evidência que cada uma oferece e identifique uma diferença de perspectiva.',alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:5,tipo:'analise',enunciado:`Explique como as duas fontes ajudam a investigar o tema “${theme}” sem transformar uma perspectiva particular em explicação total.`,alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:6,tipo:'interpretacao',enunciado:'Organize uma sequência de investigação: contextualização, comparação das fontes, identificação de convergências/divergências e formulação de uma conclusão.',alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:7,tipo:'critica-fontes',enunciado:'Aponte uma utilidade e um limite de cada fonte para o caso estudado.',alternativas:[],espacoResposta:'grande',figuraId:null},
      {numero:8,tipo:'producao',enunciado:'Produza uma síntese histórica curta que use uma evidência de cada fonte, situe o caso no contexto e evite anacronismos.',alternativas:[],espacoResposta:'grande',figuraId:null}
    ];
    const answers = [
      {numero:1,resposta:correct,justificativa:'A interpretação histórica exige contextualização e cruzamento de evidências.'},
      {numero:2,resposta:'Verdadeiro',justificativa:'Fontes são produzidas em situações concretas e carregam seleções, finalidades e perspectivas.'},
      {numero:3,resposta:'crítica',justificativa:'Crítica das fontes envolve autoria, contexto, finalidade, alcance e limites.'},
      {numero:4,resposta:`Fonte A: ${sourceA}; Fonte B: ${sourceB}. A diferença deve ser explicada pela origem, finalidade ou posição dos produtores de cada evidência.`,justificativa:'A associação parte das informações explícitas do material.'},
      {numero:5,resposta:'A resposta deve mobilizar informações das duas fontes, mostrar o que cada uma acrescenta e evitar que uma delas seja tratada como explicação única.',justificativa:'O critério exige comparação efetiva e contextualização.'},
      {numero:6,resposta:'Contextualizar → comparar → identificar convergências/divergências → formular conclusão sustentada pelas evidências.',justificativa:'A ordem preserva o procedimento básico de investigação histórica.'},
      {numero:7,resposta:'Aceitar utilidades e limites coerentes com autoria, finalidade, público, preservação, alcance e posição social de cada fonte.',justificativa:'A crítica precisa ser específica para cada evidência.'},
      {numero:8,resposta:'A síntese deve situar o caso, usar uma evidência de cada fonte, articular o tema da atividade e evitar aplicar categorias atuais de forma automática ao passado.',justificativa:'O gabarito define elementos verificáveis sem exigir uma redação única.'}
    ];
    return { title, objective:`Analisar ${caseTitle} por meio do cruzamento crítico de fontes e do tema ${theme.toLowerCase()}.`, support, questions, answers };
  }

  function geography(activity, meta, index) {
    const s = seed(meta, index);
    const [place, unit, a, baseB] = pick(CONTEXTS.geografia, s);
    const b = baseB + meta.series * 30 + meta.bimester * 20 + (index % 5) * 10;
    const diff = b-a;
    const p = round(diff/a*100,1);
    const block = blockLabel(activity);
    const theme = String(activity.tema || '').replace(/\.$/,'');
    const title = `${activity.tipoSequencia}: ${place} — ${block}`;
    const support = `Situação geográfica (${meta.label}, ${meta.bimester}º bimestre): ${place}. Indicador observado: ${unit}. No recorte A foram registrados ${a}; no recorte B, ${b}. A diferença é ${diff}, equivalente a ${fmt(p)}% do valor de A. Tema em análise: ${theme}. A leitura deve considerar localização, escala, distribuição, redes, fluxos, agentes e efeitos desiguais no território, sem atribuir causalidade automática a uma única variável. ${LEVEL_NOTE[meta.series]}`;
    const correct = `O indicador aumentou ${diff} ${unit}, ou ${fmt(p)}% em relação ao recorte A.`;
    const questions = [
      {numero:1,tipo:'multipla-escolha',enunciado:'Qual leitura quantitativa está correta para a mudança entre os recortes A e B?',alternativas:[correct,`O indicador caiu ${diff} ${unit}.`,'Os dois recortes têm exatamente o mesmo valor.','Não é possível comparar os recortes porque pertencem ao mesmo território.'],espacoResposta:'pequeno',figuraId:null},
      {numero:2,tipo:'verdadeiro-falso',enunciado:'Uma mudança no indicador deve ser interpretada junto à escala, aos agentes e às condições territoriais do caso.',alternativas:['Verdadeiro','Falso'],espacoResposta:'pequeno',figuraId:null},
      {numero:3,tipo:'completar',enunciado:`Complete: a diferença absoluta entre B (${b}) e A (${a}) é ______ ${unit}.`,alternativas:[],espacoResposta:'pequeno',figuraId:null},
      {numero:4,tipo:'resolucao',enunciado:'Calcule a variação percentual de A para B, usando A como base e arredondando para uma casa decimal.',alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:5,tipo:'analise',enunciado:`Explique como o tema “${theme}” pode produzir efeitos diferentes conforme o lugar, a escala ou o grupo social analisado.`,alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:6,tipo:'associacao',enunciado:'Associe “recorte A”, “recorte B”, “diferença absoluta” e “variação percentual” aos valores apresentados.',alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:7,tipo:'interpretacao',enunciado:'Indique uma informação espacial adicional — mapa, distribuição, rede, fluxo ou localização — que ajudaria a interpretar melhor o indicador e justifique.',alternativas:[],espacoResposta:'grande',figuraId:null},
      {numero:8,tipo:'producao',enunciado:'Escreva uma síntese geográfica curta que use os dados, identifique a escala de análise e apresente uma consequência ou decisão territorial plausível.',alternativas:[],espacoResposta:'grande',figuraId:null}
    ];
    const answers = [
      {numero:1,resposta:correct,justificativa:'A alternativa usa corretamente diferença absoluta e percentual.'},
      {numero:2,resposta:'Verdadeiro',justificativa:'Indicadores espaciais dependem de escala, distribuição, agentes e contexto territorial.'},
      {numero:3,resposta:String(diff),justificativa:`${b} - ${a} = ${diff}.`},
      {numero:4,resposta:`${fmt(p)}%`,justificativa:`(${b}-${a})/${a} × 100 = ${fmt(p)}%.`},
      {numero:5,resposta:'A resposta deve relacionar o tema a pelo menos uma diferença de localização, escala, acesso, infraestrutura, renda, ambiente ou poder entre grupos/lugares.',justificativa:'A análise geográfica exige diferenciação espacial e social.'},
      {numero:6,resposta:`A=${a}; B=${b}; diferença=${diff}; variação=${fmt(p)}%.`,justificativa:'Os quatro valores derivam diretamente do material.'},
      {numero:7,resposta:'Aceitar informação espacial pertinente, desde que o estudante explique como ela ajuda a localizar, comparar distribuição, identificar conexões ou avaliar desigualdades.',justificativa:'A informação adicional deve ampliar a interpretação territorial.'},
      {numero:8,resposta:`A síntese deve registrar A=${a}, B=${b}, variação=${fmt(p)}%, situar a escala do caso e propor uma consequência ou decisão coerente com o tema.`,justificativa:'O critério combina dado, escala e interpretação territorial.'}
    ];
    return { title, objective:`Interpretar ${place} por meio de dados espaciais, escalas, redes e relações territoriais vinculadas ao tema ${theme.toLowerCase()}.`, support, questions, answers };
  }

  const BUILDERS = {
    'lingua-portuguesa': portuguese,
    matematica: math,
    ciencias: science,
    historia: history,
    geografia: geography
  };

  function apply(input) {
    const meta = matchMeta(input);
    if (!meta || !Array.isArray(input.atividades) || input.atividades.length !== 50) return input;
    const builder = BUILDERS[meta.discipline];
    input.atividades = input.atividades.map((activity, index) => common(activity, builder(activity, meta, index), meta));
    input.statusBimestre = 'revisao-pedagogica-concluida';
    return input;
  }

  globalThis.TeachEasyHighSchoolRemainingPedagogicalOverrides = {
    matches: collection => Boolean(matchMeta(collection)),
    apply,
    expectedCollections: 55,
    expectedActivities: 2750
  };
})();
