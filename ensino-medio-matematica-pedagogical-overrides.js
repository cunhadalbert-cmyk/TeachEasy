(() => {
  const COLLECTION = 'em-1serie-1bimestre-matematica-v2';

  const q = (numero, tipo, enunciado, alternativas = [], espacoResposta = 'medio') => ({
    numero, tipo, enunciado, alternativas, espacoResposta, figuraId: null
  });
  const a = (numero, resposta, justificativa) => ({ numero, resposta, justificativa });
  const fmt = value => {
    const rounded = Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace('.', ',').replace(/0+$/, '').replace(/,$/, '');
  };
  const pct = value => `${fmt(value)}%`;

  const reviewed = {
    status: 'aprovada-pedagogicamente',
    bnccConferida: true,
    conteudoConferido: true,
    questoesConferidas: true,
    gabaritoConferido: true,
    ilustracaoConferida: true,
    validacaoAutomatica: true
  };

  const noRequiredIllustration = {
    descricao: 'A atividade fornece no próprio enunciado todos os dados numéricos, tabelas textuais e relações necessárias. Nenhuma resposta depende de imagem externa.',
    objetivoPedagogico: 'Garantir resolução autônoma e verificável a partir dos dados matemáticos apresentados na própria folha.',
    arquivo: null,
    status: 'nao-necessaria'
  };

  const domains = [
    { slug: 'numeros-e-algebra', label: 'Números e Álgebra' },
    { slug: 'funcoes', label: 'Funções' },
    { slug: 'geometria', label: 'Geometria' },
    { slug: 'estatistica', label: 'Estatística' },
    { slug: 'modelagem', label: 'Modelagem' }
  ];

  const sequences = [
    { slug: 'mapa-conceitual', label: 'Mapa conceitual', code: 'EM13MAT101' },
    { slug: 'estudo-de-caso', label: 'Estudo de caso', code: 'EM13MAT102' },
    { slug: 'investigacao', label: 'Investigação', code: 'EM13MAT103' },
    { slug: 'situacao-problema', label: 'Situação-problema', code: 'EM13MAT104' },
    { slug: 'leitura-critica', label: 'Leitura crítica', code: 'EM13MAT105' },
    { slug: 'debate', label: 'Debate', code: 'EM13MAT201' },
    { slug: 'oficina', label: 'Oficina', code: 'EM13MAT202' },
    { slug: 'analise-de-dados', label: 'Análise de dados', code: 'EM13MAT203' },
    { slug: 'projeto-aplicado', label: 'Projeto aplicado', code: 'EM13MAT301' },
    { slug: 'sintese-autoral', label: 'Síntese autoral', code: 'EM13MAT302' }
  ];

  const skillMeta = {
    EM13MAT101: ['Variação de grandezas e taxas', 'Interpretar variações por meio de dados, gráficos e taxas de variação.'],
    EM13MAT102: ['Leitura crítica de pesquisas', 'Analisar tabelas, gráficos, amostras e conclusões, identificando interpretações inadequadas.'],
    EM13MAT103: ['Unidades e tecnologia', 'Interpretar grandezas e converter unidades usadas em armazenamento e transferência de dados.'],
    EM13MAT104: ['Taxas e índices', 'Interpretar e comparar taxas expressas em diferentes formas e unidades.'],
    EM13MAT105: ['Conversões de medidas', 'Converter unidades de comprimento, área e volume em situações concretas.'],
    EM13MAT201: ['Matemática para ação comunitária', 'Usar cálculos para analisar o impacto de uma ação coletiva e fundamentar decisões.'],
    EM13MAT202: ['Pesquisa amostral', 'Planejar uma amostra proporcional, calcular resultados e comunicar conclusões com cuidado.'],
    EM13MAT203: ['Medições e planejamento', 'Aplicar medidas, áreas e estimativas de materiais em um planejamento real.'],
    EM13MAT301: ['Sistemas lineares', 'Modelar e resolver situações com duas incógnitas por meio de equações lineares simultâneas.'],
    EM13MAT302: ['Funções polinomiais', 'Construir e interpretar modelos de primeiro ou segundo grau para resolver problemas.']
  };

  const problemCases = {
  "EM13MAT101": [
    {
      "context": "consumo de energia do laboratório",
      "unit": "kWh",
      "xunit": "h",
      "x0": 0,
      "y0": 120,
      "x1": 2,
      "y1": 156,
      "x2": 5,
      "y2": 228
    },
    {
      "context": "aquecimento de uma estufa experimental",
      "unit": "°C",
      "xunit": "min",
      "x0": 0,
      "y0": 18,
      "x1": 4,
      "y1": 42,
      "x2": 9,
      "y2": 77
    },
    {
      "context": "área irrigada por um sistema automático",
      "unit": "m²",
      "xunit": "h",
      "x0": 0,
      "y0": 0,
      "x1": 3,
      "y1": 180,
      "x2": 7,
      "y2": 460
    },
    {
      "context": "respostas acumuladas em uma pesquisa escolar",
      "unit": "respostas",
      "xunit": "dias",
      "x0": 0,
      "y0": 80,
      "x1": 2,
      "y1": 140,
      "x2": 6,
      "y2": 284
    },
    {
      "context": "volume de água acumulado em um reservatório",
      "unit": "L",
      "xunit": "h",
      "x0": 0,
      "y0": 500,
      "x1": 2,
      "y1": 620,
      "x2": 5,
      "y2": 830
    }
  ],
  "EM13MAT102": [
    {
      "context": "preferência por horários da biblioteca",
      "population": 500,
      "sample": 100,
      "a": 60,
      "b": 25,
      "c": 15,
      "labelA": "horário estendido",
      "claim": 70
    },
    {
      "context": "uso do transporte escolar",
      "population": 720,
      "sample": 120,
      "a": 54,
      "b": 42,
      "c": 24,
      "labelA": "ônibus escolar",
      "claim": 50
    },
    {
      "context": "preferência por espaços de estudo",
      "population": 450,
      "sample": 90,
      "a": 45,
      "b": 27,
      "c": 18,
      "labelA": "sala de leitura",
      "claim": 60
    },
    {
      "context": "hábitos de leitura digital",
      "population": 600,
      "sample": 150,
      "a": 84,
      "b": 42,
      "c": 24,
      "labelA": "leitura em celular",
      "claim": 65
    },
    {
      "context": "participação em oficinas de matemática",
      "population": 800,
      "sample": 160,
      "a": 96,
      "b": 40,
      "c": 24,
      "labelA": "participaria",
      "claim": 70
    }
  ],
  "EM13MAT103": [
    {
      "context": "backup dos computadores da escola",
      "files": 4,
      "fileGB": 2,
      "speed": 80
    },
    {
      "context": "envio de vídeos de uma feira científica",
      "files": 5,
      "fileGB": 1,
      "speed": 100
    },
    {
      "context": "transferência de modelos 3D para o laboratório",
      "files": 3,
      "fileGB": 4,
      "speed": 120
    },
    {
      "context": "armazenamento de dados de uma pesquisa",
      "files": 8,
      "fileGB": 1,
      "speed": 64
    },
    {
      "context": "sincronização de arquivos de um projeto",
      "files": 6,
      "fileGB": 2,
      "speed": 96
    }
  ],
  "EM13MAT104": [
    {
      "context": "van escolar",
      "distance": 240,
      "fuel": 20,
      "hours": 4,
      "target": 360,
      "otherL100": 9.5,
      "fuelPrice": 6.0
    },
    {
      "context": "trajeto para uma visita técnica",
      "distance": 300,
      "fuel": 24,
      "hours": 5,
      "target": 450,
      "otherL100": 9.0,
      "fuelPrice": 6.2
    },
    {
      "context": "veículo de manutenção da escola",
      "distance": 180,
      "fuel": 15,
      "hours": 3,
      "target": 300,
      "otherL100": 9.2,
      "fuelPrice": 5.9
    },
    {
      "context": "rota de coleta de materiais recicláveis",
      "distance": 210,
      "fuel": 14,
      "hours": 3.5,
      "target": 330,
      "otherL100": 7.5,
      "fuelPrice": 6.1
    },
    {
      "context": "micro-ônibus de um projeto comunitário",
      "distance": 280,
      "fuel": 21,
      "hours": 4,
      "target": 420,
      "otherL100": 8.4,
      "fuelPrice": 6.3
    }
  ],
  "EM13MAT105": [
    {
      "context": "reservatório retangular do jardim",
      "length": 2.0,
      "width": 1.5,
      "height": 0.8,
      "coverage": 6
    },
    {
      "context": "caixa d'água de apoio ao laboratório",
      "length": 1.8,
      "width": 1.2,
      "height": 1.0,
      "coverage": 5
    },
    {
      "context": "canteiro elevado para horta escolar",
      "length": 3.0,
      "width": 1.4,
      "height": 0.5,
      "coverage": 7
    },
    {
      "context": "tanque de captação de chuva",
      "length": 2.5,
      "width": 1.6,
      "height": 0.9,
      "coverage": 6.5
    },
    {
      "context": "módulo de armazenamento de água",
      "length": 2.2,
      "width": 1.5,
      "height": 1.1,
      "coverage": 5.5
    }
  ],
  "EM13MAT201": [
    {
      "context": "campanha comunitária de redução do consumo de água",
      "participants": 120,
      "saving": 18,
      "days": 30,
      "costPer1000": 5.8,
      "baseline": 90000
    },
    {
      "context": "correção de vazamentos em bebedouros e torneiras",
      "participants": 80,
      "saving": 25,
      "days": 22,
      "costPer1000": 6.0,
      "baseline": 65000
    },
    {
      "context": "reaproveitamento de água da chuva em residências",
      "participants": 150,
      "saving": 12,
      "days": 30,
      "costPer1000": 6.2,
      "baseline": 110000
    },
    {
      "context": "irrigação econômica de hortas comunitárias",
      "participants": 100,
      "saving": 15,
      "days": 26,
      "costPer1000": 5.9,
      "baseline": 72000
    },
    {
      "context": "projeto de reuso de água em atividades de limpeza",
      "participants": 60,
      "saving": 30,
      "days": 24,
      "costPer1000": 6.1,
      "baseline": 58000
    }
  ],
  "EM13MAT202": [
    {
      "context": "pesquisa sobre uso da biblioteca",
      "population": 600,
      "groups": [
        240,
        210,
        150
      ],
      "sample": 120,
      "yes": 72
    },
    {
      "context": "pesquisa sobre transporte até a escola",
      "population": 750,
      "groups": [
        300,
        270,
        180
      ],
      "sample": 150,
      "yes": 90
    },
    {
      "context": "pesquisa sobre atividades esportivas",
      "population": 500,
      "groups": [
        200,
        180,
        120
      ],
      "sample": 100,
      "yes": 58
    },
    {
      "context": "pesquisa sobre estudo fora da sala",
      "population": 900,
      "groups": [
        360,
        315,
        225
      ],
      "sample": 180,
      "yes": 117
    },
    {
      "context": "pesquisa sobre participação em projetos",
      "population": 800,
      "groups": [
        320,
        280,
        200
      ],
      "sample": 160,
      "yes": 104
    }
  ],
  "EM13MAT203": [
    {
      "context": "reforma de uma sala de estudos",
      "length": 8,
      "width": 6,
      "tileArea": 0.25,
      "tileCost": 7.5,
      "waste": 10
    },
    {
      "context": "pintura de um laboratório retangular",
      "length": 10,
      "width": 7,
      "tileArea": 0.5,
      "tileCost": 12,
      "waste": 8
    },
    {
      "context": "piso de uma área de convivência",
      "length": 12,
      "width": 5,
      "tileArea": 0.36,
      "tileCost": 9,
      "waste": 10
    },
    {
      "context": "organização de um espaço para exposição",
      "length": 9,
      "width": 8,
      "tileArea": 0.25,
      "tileCost": 8,
      "waste": 12
    },
    {
      "context": "montagem de uma sala maker",
      "length": 11,
      "width": 6,
      "tileArea": 0.5,
      "tileCost": 10,
      "waste": 10
    }
  ],
  "EM13MAT301": [
    {
      "context": "venda de ingressos para a mostra cultural",
      "itemA": "inteiras",
      "itemB": "meias",
      "priceA": 20,
      "priceB": 12,
      "x": 80,
      "y": 120
    },
    {
      "context": "kits de lanche em um evento escolar",
      "itemA": "kits completos",
      "itemB": "kits simples",
      "priceA": 18,
      "priceB": 10,
      "x": 70,
      "y": 110
    },
    {
      "context": "locação de bicicletas em uma atividade",
      "itemA": "locações longas",
      "itemB": "locações curtas",
      "priceA": 25,
      "priceB": 15,
      "x": 48,
      "y": 72
    },
    {
      "context": "venda de livros em uma feira",
      "itemA": "livros novos",
      "itemB": "livros usados",
      "priceA": 30,
      "priceB": 14,
      "x": 55,
      "y": 95
    },
    {
      "context": "inscrições em oficinas",
      "itemA": "inscrições com material",
      "itemB": "inscrições sem material",
      "priceA": 35,
      "priceB": 20,
      "x": 60,
      "y": 90
    }
  ],
  "EM13MAT302": [
    {
      "context": "custo de impressão de apostilas",
      "kind": "linear",
      "m": 4.5,
      "b": 120,
      "x1": 40,
      "x2": 75
    },
    {
      "context": "altura de uma bola lançada em experimento",
      "kind": "quadratic",
      "a": -1,
      "b": 6,
      "c": 7,
      "x1": 2,
      "x2": 5
    },
    {
      "context": "custo de montagem de painéis",
      "kind": "linear",
      "m": 12,
      "b": 250,
      "x1": 15,
      "x2": 28
    },
    {
      "context": "variação de saldo de um projeto",
      "kind": "quadratic",
      "a": 1,
      "b": -8,
      "c": 12,
      "x1": 3,
      "x2": 6
    },
    {
      "context": "produção de peças em uma oficina",
      "kind": "linear",
      "m": 7.5,
      "b": 80,
      "x1": 20,
      "x2": 36
    }
  ]
};

  function basePatch(code, domainLabel, caseData, built) {
    const [temaBase, habilidadeResumo] = skillMeta[code];
    return {
      titulo: built.titulo,
      tema: `${temaBase}: ${caseData.context}.`,
      objetivo: `${habilidadeResumo} A atividade mobiliza ${code} em uma situação concreta de ${caseData.context}.`,
      instrucaoGeral: 'Leia os dados com atenção. Registre cálculos, unidades e conclusões. Quando houver alternativas, escolha apenas uma resposta.',
      textoApoio: { titulo: built.textoTitulo, conteudo: built.texto },
      questoes: built.questoes,
      gabarito: built.gabarito,
      possuiFiguras: false,
      figuras: [],
      possuiGabarito: true,
      possuiVersaoAdaptada: true,
      versaoAdaptada: {
        orientacao: 'Resolver uma questão por vez, destacar os dados numéricos, permitir calculadora quando prevista pelo professor e oferecer tabela de apoio para organizar cálculos e unidades.'
      },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    };
  }

  function build101(p, domain) {
    const r1 = (p.y1 - p.y0) / (p.x1 - p.x0);
    const r2 = (p.y2 - p.y1) / (p.x2 - p.x1);
    const totalRate = (p.y2 - p.y0) / (p.x2 - p.x0);
    const forecastX = p.x2 + 2;
    const forecastY = p.y2 + r2 * 2;
    const percent = ((p.y2 - p.y0) / Math.abs(p.y0 || 1)) * 100;
    const secondHigher = r2 > r1;
    return {
      titulo: `${domain}: variação em ${p.context}`,
      textoTitulo: 'Dados de variação registrados',
      texto: `Em um estudo sobre ${p.context}, a grandeza analisada foi registrada em três momentos. No instante ${p.x0} ${p.xunit}, o valor era ${fmt(p.y0)} ${p.unit}; no instante ${p.x1} ${p.xunit}, passou para ${fmt(p.y1)} ${p.unit}; e no instante ${p.x2} ${p.xunit}, chegou a ${fmt(p.y2)} ${p.unit}. Considere a taxa média como a razão entre a variação da grandeza e a variação do tempo. Use os dados para comparar os intervalos e projetar um cenário, deixando claro quando a projeção depende da hipótese de manutenção da taxa.`,
      questoes: [
        q(1, 'multipla-escolha', `Qual foi a taxa média entre ${p.x0} e ${p.x1} ${p.xunit}?`, [`${fmt(r1)} ${p.unit}/${p.xunit}`, `${fmt(r2)} ${p.unit}/${p.xunit}`, `${fmt(totalRate)} ${p.unit}/${p.xunit}`, `${fmt(p.y1 - p.y0)} ${p.unit}/${p.xunit}`], 'pequeno'),
        q(2, 'completar', `Complete: a variação total entre ${p.x0} e ${p.x2} ${p.xunit} foi de ______ ${p.unit}.`, [], 'pequeno'),
        q(3, 'verdadeiro-falso', `Marque Verdadeiro ou Falso: a taxa média do segundo intervalo é ${secondHigher ? 'maior' : 'não maior'} que a do primeiro intervalo.`, ['Verdadeiro', 'Falso'], 'pequeno'),
        q(4, 'resolucao', `Se a taxa do segundo intervalo se mantiver por mais 2 ${p.xunit}, qual valor será projetado para o instante ${forecastX} ${p.xunit}?`, [], 'medio'),
        q(5, 'analise', 'Compare numericamente as taxas dos dois intervalos e indique a diferença entre elas.', [], 'medio'),
        q(6, 'associacao', 'Associe os intervalos às taxas: 1. primeiro intervalo; 2. segundo intervalo; 3. intervalo total.', [`1 — ${fmt(r1)} ${p.unit}/${p.xunit}`, `2 — ${fmt(r2)} ${p.unit}/${p.xunit}`, `3 — ${fmt(totalRate)} ${p.unit}/${p.xunit}`], 'pequeno'),
        q(7, 'interpretacao', `Qual foi a variação percentual do primeiro ao último registro? Use ${fmt(p.y0)} ${p.unit} como valor inicial.`, [], 'medio'),
        q(8, 'modelagem', `Escreva um modelo linear para o primeiro intervalo usando x em ${p.xunit}, com x=${p.x0} associado a ${fmt(p.y0)} ${p.unit}.`, [], 'grande')
      ],
      gabarito: [
        a(1, `A) ${fmt(r1)} ${p.unit}/${p.xunit}.`, `(${fmt(p.y1)} - ${fmt(p.y0)}) ÷ (${p.x1} - ${p.x0}) = ${fmt(r1)}.`),
        a(2, `${fmt(p.y2 - p.y0)} ${p.unit}.`, `A variação total é ${fmt(p.y2)} - ${fmt(p.y0)}.`),
        a(3, 'Verdadeiro.', `As taxas são ${fmt(r1)} e ${fmt(r2)} ${p.unit}/${p.xunit}; a afirmação foi formulada de acordo com essa comparação.`),
        a(4, `${fmt(forecastY)} ${p.unit}.`, `${fmt(p.y2)} + 2 × ${fmt(r2)} = ${fmt(forecastY)}.`),
        a(5, `Primeiro intervalo: ${fmt(r1)}; segundo: ${fmt(r2)} ${p.unit}/${p.xunit}; diferença: ${fmt(Math.abs(r2-r1))} ${p.unit}/${p.xunit}.`, 'A comparação usa as mesmas unidades e o mesmo conceito de taxa média.'),
        a(6, `1 — ${fmt(r1)}; 2 — ${fmt(r2)}; 3 — ${fmt(totalRate)} ${p.unit}/${p.xunit}.`, 'Cada taxa é variação da grandeza dividida pela duração do respectivo intervalo.'),
        a(7, p.y0 === 0 ? 'Não é adequado calcular variação percentual com valor inicial zero; deve-se relatar a variação absoluta.' : `${pct(percent)}.`, p.y0 === 0 ? 'Divisão percentual por zero é indefinida.' : `(${fmt(p.y2-p.y0)} ÷ ${fmt(p.y0)}) × 100.`),
        a(8, `f(x) = ${fmt(p.y0 - r1*p.x0)} + ${fmt(r1)}x.`, 'O coeficiente angular é a taxa do primeiro intervalo e o termo constante ajusta o valor inicial.')
      ]
    };
  }

  function build102(p, domain) {
    const pa = p.a / p.sample * 100;
    const pb = p.b / p.sample * 100;
    const pc = p.c / p.sample * 100;
    const sampleShare = p.sample / p.population * 100;
    const claimDiff = p.claim - pa;
    const moved = Math.min(10, p.b);
    const newPa = (p.a + moved) / p.sample * 100;
    const estimate = p.population * pa / 100;
    return {
      titulo: `${domain}: leitura crítica de pesquisa sobre ${p.context}`,
      textoTitulo: 'Amostra, gráfico e afirmação',
      texto: `Uma escola com ${p.population} estudantes realizou uma pesquisa sobre ${p.context}. Foram entrevistados ${p.sample} estudantes: ${p.a} escolheram “${p.labelA}”, ${p.b} escolheram a segunda opção e ${p.c} escolheram a terceira. Um cartaz resumiu o resultado afirmando que “${p.claim}% de todos os estudantes escolheriam ${p.labelA}”. A amostra corresponde apenas a uma parte da população, portanto a conclusão precisa ser confrontada com os percentuais realmente observados e com a forma como os participantes foram selecionados.`,
      questoes: [
        q(1, 'multipla-escolha', `Qual percentual da amostra escolheu “${p.labelA}”?`, [pct(pa), pct(pb), pct(pc), pct(sampleShare)], 'pequeno'),
        q(2, 'resolucao', `Quantos pontos percentuais separam a afirmação de ${p.claim}% do percentual realmente observado para “${p.labelA}”?`, [], 'pequeno'),
        q(3, 'verdadeiro-falso', `Marque Verdadeiro ou Falso: a amostra representa ${fmt(sampleShare)}% da população da escola.`, ['Verdadeiro', 'Falso'], 'pequeno'),
        q(4, 'completar', `Se ${moved} estudantes da segunda opção passassem a escolher “${p.labelA}”, o novo percentual seria ______.`, [], 'pequeno'),
        q(5, 'analise', 'Por que entrevistar apenas voluntários que já frequentam o local relacionado ao tema pode produzir viés de seleção?', [], 'medio'),
        q(6, 'associacao', 'Associe cada grupo ao percentual na amostra.', [`grupo A — ${pct(pa)}`, `grupo B — ${pct(pb)}`, `grupo C — ${pct(pc)}`], 'pequeno'),
        q(7, 'estimativa', `Se a amostra fosse representativa, aproximadamente quantos dos ${p.population} estudantes poderiam escolher “${p.labelA}”?`, [], 'medio'),
        q(8, 'interpretacao', `A frase do cartaz, com ${p.claim}%, é sustentada diretamente pelos dados da amostra? Responda usando os percentuais calculados.`, [], 'grande')
      ],
      gabarito: [
        a(1, `A) ${pct(pa)}.`, `${p.a} ÷ ${p.sample} × 100 = ${fmt(pa)}%.`),
        a(2, `${fmt(Math.abs(claimDiff))} pontos percentuais.`, `|${p.claim} - ${fmt(pa)}| = ${fmt(Math.abs(claimDiff))}.`),
        a(3, 'Verdadeiro.', `${p.sample} ÷ ${p.population} × 100 = ${fmt(sampleShare)}%.`),
        a(4, pct(newPa), `(${p.a} + ${moved}) ÷ ${p.sample} × 100 = ${fmt(newPa)}%.`),
        a(5, 'Porque esse grupo pode ter comportamento diferente do restante da população; a seleção deixa de representar adequadamente todos os estudantes.', 'A qualidade da conclusão depende não apenas do tamanho, mas também do modo de seleção da amostra.'),
        a(6, `A — ${pct(pa)}; B — ${pct(pb)}; C — ${pct(pc)}.`, 'Cada percentual é a frequência do grupo dividida pelo total da amostra.'),
        a(7, `${fmt(estimate)} estudantes, aproximadamente.`, `${p.population} × ${fmt(pa)}% = ${fmt(estimate)}.`),
        a(8, Math.abs(claimDiff) < 0.01 ? `Sim. A amostra observou ${pct(pa)}, igual ao valor anunciado.` : `Não diretamente. A amostra observou ${pct(pa)}, enquanto o cartaz afirma ${p.claim}%.`, 'A conclusão deve distinguir o percentual observado de uma generalização para toda a população.')
      ]
    };
  }

  function build103(p, domain) {
    const totalGB = p.files * p.fileGB;
    const totalMB = totalGB * 1024;
    const totalMb = totalGB * 8192;
    const seconds = totalMb / p.speed;
    const minutes = seconds / 60;
    const faster = p.speed * 1.5;
    const fasterTime = totalMb / faster;
    return {
      titulo: `${domain}: unidades digitais em ${p.context}`,
      textoTitulo: 'Armazenamento e velocidade de transferência',
      texto: `No contexto de ${p.context}, serão transferidos ${p.files} arquivos de ${fmt(p.fileGB)} GB cada. Para esta atividade, use 1 GB = 1024 MB e 1 byte = 8 bits. A conexão disponível transfere ${p.speed} megabits por segundo (Mbps). Para estimar o tempo teórico de transferência, converta primeiro o volume total para megabits e depois divida pela velocidade. Desconsidere perdas de protocolo e variações da rede.`,
      questoes: [
        q(1, 'multipla-escolha', 'Qual é o volume total dos arquivos em GB?', [`${fmt(totalGB)} GB`, `${fmt(totalMB)} GB`, `${fmt(p.files+p.fileGB)} GB`, `${fmt(p.fileGB)} GB`], 'pequeno'),
        q(2, 'completar', 'O volume total corresponde a ______ MB.', [], 'pequeno'),
        q(3, 'resolucao', 'Converta o volume total para megabits (Mb).', [], 'medio'),
        q(4, 'resolucao', `Qual é o tempo teórico, em segundos, para transferir tudo a ${p.speed} Mbps?`, [], 'medio'),
        q(5, 'interpretacao', 'Converta o tempo calculado para minutos.', [], 'medio'),
        q(6, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: mantendo o mesmo volume, dobrar a velocidade reduziria o tempo teórico pela metade.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(7, 'comparacao', `Se a velocidade aumentar para ${fmt(faster)} Mbps, qual será o novo tempo teórico em segundos?`, [], 'medio'),
        q(8, 'modelagem', `Escreva a fórmula T(v) para o tempo, em segundos, em função da velocidade v em Mbps, usando o volume total desta atividade.`, [], 'grande')
      ],
      gabarito: [
        a(1, `A) ${fmt(totalGB)} GB.`, `${p.files} × ${fmt(p.fileGB)} = ${fmt(totalGB)} GB.`),
        a(2, `${fmt(totalMB)} MB.`, `${fmt(totalGB)} × 1024 = ${fmt(totalMB)}.`),
        a(3, `${fmt(totalMb)} Mb.`, `${fmt(totalGB)} GB × 8192 = ${fmt(totalMb)} Mb.`),
        a(4, `${fmt(seconds)} s.`, `${fmt(totalMb)} ÷ ${p.speed} = ${fmt(seconds)}.`),
        a(5, `${fmt(minutes)} min.`, `${fmt(seconds)} ÷ 60 = ${fmt(minutes)}.`),
        a(6, 'Verdadeiro.', 'Como T = volume ÷ velocidade, para volume fixo tempo e velocidade são inversamente proporcionais.'),
        a(7, `${fmt(fasterTime)} s.`, `${fmt(totalMb)} ÷ ${fmt(faster)} = ${fmt(fasterTime)}.`),
        a(8, `T(v) = ${fmt(totalMb)} ÷ v.`, 'O numerador é o volume total em megabits e v é a taxa em megabits por segundo.')
      ]
    };
  }

  function build104(p, domain) {
    const speed = p.distance / p.hours;
    const l100 = p.fuel / p.distance * 100;
    const kmL = p.distance / p.fuel;
    const targetFuel = p.target * l100 / 100;
    const diff = Math.abs(l100 - p.otherL100);
    const moreEfficient = l100 < p.otherL100 ? 'o veículo analisado' : 'o veículo de comparação';
    const cost = targetFuel * p.fuelPrice;
    return {
      titulo: `${domain}: taxas no percurso de ${p.context}`,
      textoTitulo: 'Distância, tempo e consumo',
      texto: `Em um percurso com ${p.context}, foram percorridos ${p.distance} km em ${fmt(p.hours)} h, com consumo de ${p.fuel} L de combustível. Para comparar eficiência, também foi informado outro veículo com consumo de ${fmt(p.otherL100)} L/100 km. O preço considerado do combustível é R$ ${fmt(p.fuelPrice)} por litro. Analise velocidade média, consumo por 100 km e rendimento em km/L, mantendo atenção às unidades.`,
      questoes: [
        q(1, 'multipla-escolha', 'Qual foi a velocidade média no percurso?', [`${fmt(speed)} km/h`, `${fmt(l100)} km/h`, `${fmt(kmL)} km/h`, `${fmt(p.distance-p.fuel)} km/h`], 'pequeno'),
        q(2, 'resolucao', 'Calcule o consumo em litros por 100 km.', [], 'medio'),
        q(3, 'completar', 'O rendimento do veículo é de aproximadamente ______ km/L.', [], 'pequeno'),
        q(4, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: mantendo a mesma taxa de consumo, dobrar a distância dobra a quantidade de combustível necessária.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(5, 'resolucao', `Quantos litros seriam necessários para percorrer ${p.target} km mantendo o mesmo consumo?`, [], 'medio'),
        q(6, 'comparacao', `Comparando ${fmt(l100)} L/100 km com ${fmt(p.otherL100)} L/100 km, qual veículo é mais eficiente e qual é a diferença de consumo por 100 km?`, [], 'medio'),
        q(7, 'resolucao', `Quanto custaria o combustível necessário para ${p.target} km, a R$ ${fmt(p.fuelPrice)} por litro?`, [], 'medio'),
        q(8, 'modelagem', 'Escreva uma expressão L(d) para estimar os litros consumidos em função da distância d, em quilômetros.', [], 'grande')
      ],
      gabarito: [
        a(1, `A) ${fmt(speed)} km/h.`, `${p.distance} ÷ ${fmt(p.hours)} = ${fmt(speed)}.`),
        a(2, `${fmt(l100)} L/100 km.`, `${p.fuel} ÷ ${p.distance} × 100 = ${fmt(l100)}.`),
        a(3, `${fmt(kmL)} km/L.`, `${p.distance} ÷ ${p.fuel} = ${fmt(kmL)}.`),
        a(4, 'Verdadeiro.', 'Com taxa constante, consumo e distância são diretamente proporcionais.'),
        a(5, `${fmt(targetFuel)} L.`, `${p.target} × ${fmt(l100)} ÷ 100 = ${fmt(targetFuel)}.`),
        a(6, `${moreEfficient} é mais eficiente; diferença de ${fmt(diff)} L/100 km.`, 'Menor valor em L/100 km significa menor consumo para a mesma distância.'),
        a(7, `R$ ${fmt(cost)}.`, `${fmt(targetFuel)} × ${fmt(p.fuelPrice)} = ${fmt(cost)}.`),
        a(8, `L(d) = ${fmt(l100/100)}d.`, 'A taxa por quilômetro é o consumo por 100 km dividido por 100.')
      ]
    };
  }

  function build105(p, domain) {
    const area = p.length * p.width;
    const volume = area * p.height;
    const liters = volume * 1000;
    const liters75 = liters * .75;
    const coating = area / p.coverage;
    const newLiters = liters * 1.25;
    return {
      titulo: `${domain}: conversões no ${p.context}`,
      textoTitulo: 'Medidas do recipiente e conversões',
      texto: `O ${p.context} tem formato de paralelepípedo retângulo, com ${fmt(p.length)} m de comprimento, ${fmt(p.width)} m de largura e ${fmt(p.height)} m de altura. Para os cálculos, use 1 m = 100 cm, 1 m² = 10.000 cm² e 1 m³ = 1000 L. Um produto de proteção da base rende ${fmt(p.coverage)} m² por litro. Calcule áreas, volume e conversões sem misturar unidades de naturezas diferentes.`,
      questoes: [
        q(1, 'multipla-escolha', 'Qual é o comprimento convertido para centímetros?', [`${fmt(p.length*100)} cm`, `${fmt(p.length*10)} cm`, `${fmt(p.length*1000)} cm`, `${fmt(p.length)} cm`], 'pequeno'),
        q(2, 'resolucao', 'Calcule a área da base em metros quadrados.', [], 'medio'),
        q(3, 'resolucao', 'Calcule o volume total em metros cúbicos.', [], 'medio'),
        q(4, 'completar', 'O volume total corresponde a ______ litros.', [], 'pequeno'),
        q(5, 'resolucao', 'Quantos litros correspondem a 75% da capacidade total?', [], 'medio'),
        q(6, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: 1 m³ corresponde a 1000 L.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(7, 'resolucao', `Quantos litros do produto são necessários para cobrir a base, considerando rendimento de ${fmt(p.coverage)} m²/L?`, [], 'medio'),
        q(8, 'analise', 'Se apenas a altura aumentar 25%, qual será a nova capacidade em litros?', [], 'grande')
      ],
      gabarito: [
        a(1, `A) ${fmt(p.length*100)} cm.`, `${fmt(p.length)} × 100 = ${fmt(p.length*100)}.`),
        a(2, `${fmt(area)} m².`, `${fmt(p.length)} × ${fmt(p.width)} = ${fmt(area)}.`),
        a(3, `${fmt(volume)} m³.`, `${fmt(area)} × ${fmt(p.height)} = ${fmt(volume)}.`),
        a(4, `${fmt(liters)} L.`, `${fmt(volume)} × 1000 = ${fmt(liters)}.`),
        a(5, `${fmt(liters75)} L.`, `${fmt(liters)} × 0,75 = ${fmt(liters75)}.`),
        a(6, 'Verdadeiro.', 'Essa é a equivalência usada para converter volume em metros cúbicos para litros.'),
        a(7, `${fmt(coating)} L.`, `${fmt(area)} ÷ ${fmt(p.coverage)} = ${fmt(coating)}.`),
        a(8, `${fmt(newLiters)} L.`, 'Com base constante, aumentar a altura em 25% aumenta o volume na mesma proporção.')
      ]
    };
  }

  function build201(p, domain) {
    const daily = p.participants * p.saving;
    const total = daily * p.days;
    const cubic = total / 1000;
    const baselinePct = total / p.baseline * 100;
    const money = total / 1000 * p.costPer1000;
    const doubled = total * 2;
    return {
      titulo: `${domain}: impacto da ${p.context}`,
      textoTitulo: 'Estimativa coletiva de economia',
      texto: `Uma proposta de ${p.context} prevê a participação de ${p.participants} pessoas ou unidades participantes. Cada participante pode economizar, em média, ${fmt(p.saving)} litros por dia durante ${p.days} dias. O consumo de referência para comparação é ${fmt(p.baseline)} litros no mesmo período. Para estimar valor econômico, considere R$ ${fmt(p.costPer1000)} por 1000 litros. Os cálculos servem para avaliar a escala da ação antes de decidir sua implementação.`,
      questoes: [
        q(1, 'multipla-escolha', 'Qual é a economia diária total prevista?', [`${fmt(daily)} L`, `${fmt(total)} L`, `${fmt(p.saving*p.days)} L`, `${fmt(p.participants+p.saving)} L`], 'pequeno'),
        q(2, 'resolucao', `Qual é a economia total ao longo de ${p.days} dias?`, [], 'medio'),
        q(3, 'completar', 'Essa economia total corresponde a ______ m³ de água.', [], 'pequeno'),
        q(4, 'resolucao', `A economia representa quantos por cento do consumo de referência de ${fmt(p.baseline)} L?`, [], 'medio'),
        q(5, 'resolucao', `Qual é o valor econômico aproximado da economia, usando R$ ${fmt(p.costPer1000)} por 1000 L?`, [], 'medio'),
        q(6, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: se o número de participantes dobrar e a economia individual permanecer igual, a economia total também dobra.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(7, 'estimativa', 'Qual seria a economia total se participassem o dobro de pessoas, mantendo todas as outras condições?', [], 'medio'),
        q(8, 'interpretacao', 'Com base no percentual calculado, explique em uma frase o impacto quantitativo da ação sobre o consumo de referência.', [], 'grande')
      ],
      gabarito: [
        a(1, `A) ${fmt(daily)} L.`, `${p.participants} × ${fmt(p.saving)} = ${fmt(daily)}.`),
        a(2, `${fmt(total)} L.`, `${fmt(daily)} × ${p.days} = ${fmt(total)}.`),
        a(3, `${fmt(cubic)} m³.`, `${fmt(total)} ÷ 1000 = ${fmt(cubic)}.`),
        a(4, `${pct(baselinePct)}.`, `${fmt(total)} ÷ ${fmt(p.baseline)} × 100 = ${fmt(baselinePct)}%.`),
        a(5, `R$ ${fmt(money)}.`, `${fmt(total/1000)} × ${fmt(p.costPer1000)} = ${fmt(money)}.`),
        a(6, 'Verdadeiro.', 'A economia total é diretamente proporcional ao número de participantes quando a economia individual é constante.'),
        a(7, `${fmt(doubled)} L.`, `Dobrar participantes dobra ${fmt(total)} L para ${fmt(doubled)} L.`),
        a(8, `A ação economiza aproximadamente ${pct(baselinePct)} do consumo de referência no período.`, 'A interpretação deve usar o percentual efetivamente calculado.')
      ]
    };
  }

  function build202(p, domain) {
    const shares = p.groups.map(g => g / p.population);
    const sampleGroups = shares.map(s => Math.round(s * p.sample));
    const yesPct = p.yes / p.sample * 100;
    const estimateYes = p.population * yesPct / 100;
    return {
      titulo: `${domain}: planejamento da ${p.context}`,
      textoTitulo: 'Amostragem proporcional e resultado',
      texto: `A população da ${p.context} tem ${p.population} pessoas distribuídas em três grupos com ${p.groups[0]}, ${p.groups[1]} e ${p.groups[2]} integrantes. A equipe decidiu entrevistar ${p.sample} pessoas por amostragem proporcional, sorteando participantes dentro de cada grupo. Ao final, ${p.yes} entrevistados responderam “sim” à pergunta principal. A atividade exige calcular a composição da amostra, o percentual observado e uma estimativa para a população, distinguindo estimativa de certeza.`,
      questoes: [
        q(1, 'multipla-escolha', 'Qual fração percentual da população será entrevistada?', [pct(p.sample/p.population*100), pct(yesPct), pct(shares[0]*100), pct(100-p.sample/p.population*100)], 'pequeno'),
        q(2, 'resolucao', 'Quantos participantes do primeiro grupo devem entrar na amostra proporcional?', [], 'medio'),
        q(3, 'associacao', 'Associe cada grupo ao número planejado de entrevistados.', sampleGroups.map((v,i)=>`grupo ${i+1} — ${v}`), 'pequeno'),
        q(4, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: sortear participantes dentro de cada grupo ajuda a reduzir viés de escolha do pesquisador.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(5, 'resolucao', 'Qual percentual da amostra respondeu “sim”?', [], 'medio'),
        q(6, 'estimativa', `Se a amostra representar bem a população, quantas pessoas entre as ${p.population} poderiam responder “sim”?`, [], 'medio'),
        q(7, 'analise', 'Por que a estimativa obtida não deve ser apresentada como número exato de toda a população?', [], 'medio'),
        q(8, 'producao', 'Escreva uma conclusão curta de relatório contendo tamanho da amostra, percentual de “sim” e a palavra “estimativa”.', [], 'grande')
      ],
      gabarito: [
        a(1, `A) ${pct(p.sample/p.population*100)}.`, `${p.sample} ÷ ${p.population} × 100.`),
        a(2, `${sampleGroups[0]} participantes.`, `${p.groups[0]} ÷ ${p.population} × ${p.sample} = ${sampleGroups[0]}.`),
        a(3, sampleGroups.map((v,i)=>`${i+1} — ${v}`).join('; ')+'.', 'A distribuição mantém aproximadamente a proporção de cada grupo na população.'),
        a(4, 'Verdadeiro.', 'O sorteio reduz interferência subjetiva na seleção dos participantes.'),
        a(5, `${pct(yesPct)}.`, `${p.yes} ÷ ${p.sample} × 100 = ${fmt(yesPct)}%.`),
        a(6, `${fmt(estimateYes)} pessoas, aproximadamente.`, `${p.population} × ${fmt(yesPct)}% = ${fmt(estimateYes)}.`),
        a(7, 'Porque o resultado vem de uma amostra e está sujeito a variação amostral; ele serve para estimar a população, não para contar cada indivíduo.', 'Uma pesquisa amostral produz inferência, não censo.'),
        a(8, `Exemplo: “Foram entrevistadas ${p.sample} pessoas; ${pct(yesPct)} responderam sim. Se a amostra for representativa, esse percentual permite uma estimativa para a população.”`, 'A conclusão deve comunicar os números sem transformar estimativa em certeza.')
      ]
    };
  }

  function build203(p, domain) {
    const area = p.length * p.width;
    const perimeter = 2 * (p.length + p.width);
    const baseTiles = Math.ceil(area / p.tileArea);
    const withWaste = Math.ceil(baseTiles * (1 + p.waste/100));
    const baseCost = baseTiles * p.tileCost;
    const totalCost = withWaste * p.tileCost;
    return {
      titulo: `${domain}: medições para ${p.context}`,
      textoTitulo: 'Dimensões, material e margem de segurança',
      texto: `No planejamento de ${p.context}, o piso retangular mede ${p.length} m por ${p.width} m. Cada peça de revestimento cobre ${fmt(p.tileArea)} m² e custa R$ ${fmt(p.tileCost)}. Para compensar recortes e perdas, o planejamento prevê ${p.waste}% de margem sobre a quantidade mínima de peças. Considere que peças não podem ser compradas fracionadas e, por isso, qualquer quantidade decimal deve ser arredondada para cima.`,
      questoes: [
        q(1, 'multipla-escolha', 'Qual é a área total do piso?', [`${fmt(area)} m²`, `${fmt(perimeter)} m²`, `${fmt(p.length+p.width)} m²`, `${fmt(area*2)} m²`], 'pequeno'),
        q(2, 'resolucao', 'Calcule o perímetro do espaço.', [], 'medio'),
        q(3, 'resolucao', 'Qual é a quantidade mínima inteira de peças sem considerar perdas?', [], 'medio'),
        q(4, 'completar', `Com margem de ${p.waste}%, devem ser compradas ______ peças.`, [], 'pequeno'),
        q(5, 'resolucao', 'Qual seria o custo sem a margem de perdas?', [], 'medio'),
        q(6, 'resolucao', 'Qual será o custo final considerando a quantidade com margem?', [], 'medio'),
        q(7, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: usar perímetro no lugar de área para calcular peças de piso produziria uma medida de natureza inadequada.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(8, 'analise', 'Quantas peças a margem de segurança acrescenta em relação à quantidade mínima?', [], 'medio')
      ],
      gabarito: [
        a(1, `A) ${fmt(area)} m².`, `${p.length} × ${p.width} = ${fmt(area)}.`),
        a(2, `${fmt(perimeter)} m.`, `2 × (${p.length} + ${p.width}) = ${fmt(perimeter)}.`),
        a(3, `${baseTiles} peças.`, `${fmt(area)} ÷ ${fmt(p.tileArea)} = ${fmt(area/p.tileArea)}; arredonda-se para cima.`),
        a(4, `${withWaste} peças.`, `${baseTiles} × (1 + ${p.waste}/100) = ${fmt(baseTiles*(1+p.waste/100))}; arredonda-se para cima.`),
        a(5, `R$ ${fmt(baseCost)}.`, `${baseTiles} × ${fmt(p.tileCost)} = ${fmt(baseCost)}.`),
        a(6, `R$ ${fmt(totalCost)}.`, `${withWaste} × ${fmt(p.tileCost)} = ${fmt(totalCost)}.`),
        a(7, 'Verdadeiro.', 'Peças cobrem superfície; portanto a grandeza relevante é área, em m².'),
        a(8, `${withWaste-baseTiles} peças.`, `${withWaste} - ${baseTiles} = ${withWaste-baseTiles}.`)
      ]
    };
  }

  function build301(p, domain) {
    const total = p.x + p.y;
    const revenue = p.priceA*p.x + p.priceB*p.y;
    const revenueA = p.priceA*p.x;
    const pctA = p.x/total*100;
    const newRevenue = (p.priceA+2)*p.x + p.priceB*p.y;
    return {
      titulo: `${domain}: sistema linear em ${p.context}`,
      textoTitulo: 'Duas quantidades desconhecidas',
      texto: `Em ${p.context}, foram registrados ${total} itens ao todo. Há dois tipos: ${p.itemA}, a R$ ${p.priceA} cada, e ${p.itemB}, a R$ ${p.priceB} cada. A arrecadação total foi de R$ ${fmt(revenue)}. Chame de x a quantidade de ${p.itemA} e de y a quantidade de ${p.itemB}. Use as duas informações — quantidade total e arrecadação — para montar e resolver um sistema de duas equações lineares.`,
      questoes: [
        q(1, 'multipla-escolha', 'Qual sistema representa corretamente a situação?', [`x + y = ${total} e ${p.priceA}x + ${p.priceB}y = ${fmt(revenue)}`, `x - y = ${total} e ${p.priceA}x = ${fmt(revenue)}`, `xy = ${total} e x + y = ${fmt(revenue)}`, `x + y = ${fmt(revenue)} e ${p.priceA}+${p.priceB} = ${total}`], 'grande'),
        q(2, 'resolucao', `Resolva o sistema e determine a quantidade de ${p.itemA}.`, [], 'medio'),
        q(3, 'completar', `A quantidade de ${p.itemB} é ______.`, [], 'pequeno'),
        q(4, 'verificacao', 'Substitua os valores encontrados nas duas equações e verifique os totais.', [], 'medio'),
        q(5, 'resolucao', `Quanto da arrecadação veio apenas de ${p.itemA}?`, [], 'medio'),
        q(6, 'interpretacao', `Que percentual do total de itens corresponde a ${p.itemA}?`, [], 'medio'),
        q(7, 'variacao', `Se o preço de ${p.itemA} aumentasse R$ 2 e as quantidades fossem mantidas, qual seria a nova arrecadação total?`, [], 'medio'),
        q(8, 'analise', 'Explique por que apenas a equação da quantidade total não seria suficiente para determinar x e y de forma única.', [], 'grande')
      ],
      gabarito: [
        a(1, `A) x + y = ${total} e ${p.priceA}x + ${p.priceB}y = ${fmt(revenue)}.`, 'A primeira equação registra quantidade; a segunda, valor total.'),
        a(2, `${p.x} ${p.itemA}.`, 'A resolução simultânea das duas equações fornece x = '+p.x+'.'),
        a(3, `${p.y}.`, `Como x + y = ${total}, ${total} - ${p.x} = ${p.y}.`),
        a(4, `${p.x} + ${p.y} = ${total}; ${p.priceA}×${p.x} + ${p.priceB}×${p.y} = ${fmt(revenue)}.`, 'Os valores satisfazem simultaneamente as duas condições.'),
        a(5, `R$ ${fmt(revenueA)}.`, `${p.priceA} × ${p.x} = ${fmt(revenueA)}.`),
        a(6, `${pct(pctA)}.`, `${p.x} ÷ ${total} × 100 = ${fmt(pctA)}%.`),
        a(7, `R$ ${fmt(newRevenue)}.`, `(${p.priceA}+2)×${p.x} + ${p.priceB}×${p.y} = ${fmt(newRevenue)}.`),
        a(8, 'Porque uma única equação com duas incógnitas admite várias combinações; a segunda condição independente é necessária para identificar uma solução única.', 'O sistema precisa de duas relações independentes para determinar as duas incógnitas.')
      ]
    };
  }

  function build302(p, domain) {
    if (p.kind === 'linear') {
      const y1 = p.m*p.x1 + p.b;
      const y2 = p.m*p.x2 + p.b;
      const targetY = y1 + p.m*10;
      const targetX = (targetY-p.b)/p.m;
      return {
        titulo: `${domain}: função de 1º grau em ${p.context}`,
        textoTitulo: 'Modelo linear',
        texto: `Para representar ${p.context}, foi proposto o modelo f(x) = ${fmt(p.m)}x + ${fmt(p.b)}, em que x representa a quantidade considerada e f(x) representa o resultado correspondente. O termo ${fmt(p.b)} é o valor inicial do modelo e ${fmt(p.m)} indica quanto f varia quando x aumenta uma unidade. Analise o modelo para x = ${p.x1} e x = ${p.x2}, interprete seus coeficientes e resolva uma situação inversa.`,
        questoes: [
          q(1, 'multipla-escolha', 'O modelo apresentado é de qual grau?', ['1º grau', '2º grau', '3º grau', 'não é função'], 'pequeno'),
          q(2, 'resolucao', `Calcule f(${p.x1}).`, [], 'medio'),
          q(3, 'resolucao', `Calcule f(${p.x2}).`, [], 'medio'),
          q(4, 'completar', 'A taxa de variação constante do modelo é ______.', [], 'pequeno'),
          q(5, 'interpretacao', `O que representa o termo constante ${fmt(p.b)} quando x = 0?`, [], 'medio'),
          q(6, 'resolucao', `Para qual valor de x a função atinge ${fmt(targetY)}?`, [], 'medio'),
          q(7, 'verdadeiro-falso', `Marque Verdadeiro ou Falso: como o coeficiente ${fmt(p.m)} é positivo, f(x) cresce quando x aumenta.`, ['Verdadeiro', 'Falso'], 'pequeno'),
          q(8, 'modelagem', 'Reescreva o modelo identificando explicitamente coeficiente angular e termo constante.', [], 'grande')
        ],
        gabarito: [
          a(1, 'A) 1º grau.', 'O maior expoente de x é 1.'),
          a(2, `${fmt(y1)}.`, `${fmt(p.m)}×${p.x1} + ${fmt(p.b)} = ${fmt(y1)}.`),
          a(3, `${fmt(y2)}.`, `${fmt(p.m)}×${p.x2} + ${fmt(p.b)} = ${fmt(y2)}.`),
          a(4, `${fmt(p.m)} por unidade de x.`, 'É o coeficiente de x.'),
          a(5, `Representa o valor inicial ${fmt(p.b)} de f quando x = 0.`, 'Em f(0), o termo com x zera.'),
          a(6, `x = ${fmt(targetX)}.`, `(${fmt(targetY)} - ${fmt(p.b)}) ÷ ${fmt(p.m)} = ${fmt(targetX)}.`),
          a(7, 'Verdadeiro.', 'Coeficiente angular positivo caracteriza função crescente.'),
          a(8, `f(x) = ${fmt(p.m)}x + ${fmt(p.b)}; coeficiente angular = ${fmt(p.m)} e termo constante = ${fmt(p.b)}.`, 'A identificação separa a taxa de variação do valor inicial.')
        ]
      };
    }
    const disc = p.b*p.b - 4*p.a*p.c;
    const root1 = (-p.b - Math.sqrt(disc))/(2*p.a);
    const root2 = (-p.b + Math.sqrt(disc))/(2*p.a);
    const xv = -p.b/(2*p.a);
    const yv = p.a*xv*xv+p.b*xv+p.c;
    const y1 = p.a*p.x1*p.x1+p.b*p.x1+p.c;
    const y2 = p.a*p.x2*p.x2+p.b*p.x2+p.c;
    return {
      titulo: `${domain}: função de 2º grau em ${p.context}`,
      textoTitulo: 'Modelo quadrático',
      texto: `Para analisar ${p.context}, use o modelo f(x) = ${fmt(p.a)}x² + ${fmt(p.b)}x + ${fmt(p.c)}. Trata-se de uma função polinomial de segundo grau. O sinal do coeficiente de x² determina a concavidade da parábola, o vértice identifica um extremo do modelo e as raízes indicam os valores de x para os quais f(x) = 0. Calcule valores específicos e interprete esses elementos matemáticos.`,
      questoes: [
        q(1, 'multipla-escolha', 'O modelo apresentado é de qual grau?', ['2º grau', '1º grau', '3º grau', 'grau zero'], 'pequeno'),
        q(2, 'resolucao', `Calcule f(${p.x1}).`, [], 'medio'),
        q(3, 'resolucao', `Calcule f(${p.x2}).`, [], 'medio'),
        q(4, 'completar', 'A abscissa x do vértice é ______.', [], 'pequeno'),
        q(5, 'resolucao', 'Calcule o valor de f no vértice.', [], 'medio'),
        q(6, 'resolucao', 'Determine as duas raízes reais da função.', [], 'medio'),
        q(7, 'verdadeiro-falso', `Marque Verdadeiro ou Falso: a parábola tem concavidade para ${p.a > 0 ? 'cima' : 'baixo'}.`, ['Verdadeiro', 'Falso'], 'pequeno'),
        q(8, 'interpretacao', 'Explique o significado matemático de uma raiz no modelo: o que acontece com f(x) nesse ponto?', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) 2º grau.', 'O maior expoente de x é 2.'),
        a(2, `${fmt(y1)}.`, `Substituindo x = ${p.x1} no modelo obtém-se ${fmt(y1)}.`),
        a(3, `${fmt(y2)}.`, `Substituindo x = ${p.x2} no modelo obtém-se ${fmt(y2)}.`),
        a(4, `${fmt(xv)}.`, `xv = -b/(2a) = ${fmt(xv)}.`),
        a(5, `${fmt(yv)}.`, `f(${fmt(xv)}) = ${fmt(yv)}.`),
        a(6, `x = ${fmt(Math.min(root1,root2))} e x = ${fmt(Math.max(root1,root2))}.`, 'As raízes resolvem f(x)=0.'),
        a(7, 'Verdadeiro.', `Como a = ${fmt(p.a)}, a concavidade indicada no enunciado está correta.`),
        a(8, 'Em uma raiz, f(x) = 0; graficamente, é um ponto em que a parábola encontra o eixo x.', 'A interpretação liga solução algébrica e representação gráfica.')
      ]
    };
  }

  const builders = {
    EM13MAT101: build101,
    EM13MAT102: build102,
    EM13MAT103: build103,
    EM13MAT104: build104,
    EM13MAT105: build105,
    EM13MAT201: build201,
    EM13MAT202: build202,
    EM13MAT203: build203,
    EM13MAT301: build301,
    EM13MAT302: build302
  };

  const overrides = {};
  domains.forEach((domain, domainIndex) => {
    sequences.forEach((sequence, sequenceIndex) => {
      const n = domainIndex * 10 + sequenceIndex + 1;
      const id = `em-1s-b1-matematica-${String(n).padStart(2, '0')}-${sequence.slug}-${domain.slug}`;
      const caseData = problemCases[sequence.code][domainIndex];
      const built = builders[sequence.code](caseData, domain.label);
      overrides[id] = basePatch(sequence.code, domain.label, caseData, built);
    });
  });

  function mergeActivity(activity, patch) {
    return {
      ...activity,
      ...patch,
      bncc: activity.bncc,
      quantidadeQuestoes: 8,
      possuiGabarito: true,
      revisao: { ...activity.revisao, ...patch.revisao },
      ilustracao: { ...activity.ilustracao, ...patch.ilustracao }
    };
  }

  globalThis.TeachEasyHighSchoolMathPedagogicalOverrides = {
    collection: COLLECTION,
    reviewedIds: Object.keys(overrides),
    apply(collection) {
      if (!collection || collection.colecao !== COLLECTION || !Array.isArray(collection.atividades)) return collection;
      collection.atividades = collection.atividades.map(activity => {
        const patch = overrides[activity.id];
        return patch ? mergeActivity(activity, patch) : activity;
      });
      return collection;
    }
  };
})();
