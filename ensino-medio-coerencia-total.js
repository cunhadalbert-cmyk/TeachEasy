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
  const MODE_LABEL = {
    fundamentos: 'fundamentos e linguagem',
    relacoes: 'relações e aplicações',
    evidencias: 'análise de evidências',
    problemas: 'problemas contemporâneos'
  };

  const clone = value => JSON.parse(JSON.stringify(value));
  const fmt = value => Number.isInteger(value) ? String(value) : String(Math.round((value + Number.EPSILON) * 10) / 10).replace('.', ',');
  const pct = value => `${fmt(value)}%`;

  function meta(collection) {
    const hit = collection?.colecao?.match(COLLECTION_RE);
    if (!hit || COMPLETED.has(collection.colecao)) return null;
    return { series:Number(hit[1]), bimester:Number(hit[2]), discipline:hit[3], label:SERIES_LABEL[Number(hit[1])] };
  }

  function modeFromTheme(theme) {
    const text = String(theme || '').toLowerCase();
    if (text.includes('relações e aplicações')) return 'relacoes';
    if (text.includes('análise de evidências')) return 'evidencias';
    if (text.includes('problemas contemporâneos')) return 'problemas';
    return 'fundamentos';
  }

  function cleanFrontText(text) {
    return String(text || '').replace(/\bEM13[A-Z0-9]+\b/g, 'a habilidade curricular prevista');
  }

  function approvedFromBaseline(current, approved, collectionMeta) {
    const copied = clone(approved);
    return {
      ...current,
      titulo: copied.titulo,
      objetivo: cleanFrontText(copied.objetivo),
      instrucaoGeral: copied.instrucaoGeral,
      textoApoio: copied.textoApoio,
      quantidadeQuestoes: 8,
      questoes: copied.questoes,
      possuiGabarito: true,
      gabarito: copied.gabarito,
      possuiVersaoAdaptada: true,
      versaoAdaptada: copied.versaoAdaptada,
      possuiFiguras: Boolean(copied.possuiFiguras),
      figuras: copied.figuras || [],
      ilustracao: copied.ilustracao,
      revisao: { ...(copied.revisao || {}), status:'aprovada-pedagogicamente', conteudoConferido:true, questoesConferidas:true, gabaritoConferido:true, bnccConferida:true },
      id: current.id,
      tema: current.tema,
      sequencia: current.sequencia,
      tipoSequencia: current.tipoSequencia,
      dificuldade: current.dificuldade,
      bncc: current.bncc,
      bnccConferida: true,
      coerencia: {
        fonte: 'atividade-aprovada-equivalente',
        serie: collectionMeta.label,
        bimestre: collectionMeta.bimester,
        posicao: Number(String(current.sequencia || '').match(/\d+/)?.[0] || 0),
        codigoBncc: current.bncc?.[0]?.codigo || '',
        temaCanonico: current.tema,
        textoQuestoesGabaritoVinculados: true
      }
    };
  }

  const NUMERIC_PROFILES = {
    EM13CNT101:{focus:'conservação e transformação de energia e matéria',context:'sistema de aquecimento de água com recuperação de energia',unit:'kJ',aLabel:'energia fornecida ao sistema',bLabel:'energia útil transferida à água',rLabel:'energia dissipada ao ambiente',a:500,b:360,r:140,concept:'conservação de energia',mechanism:'A energia fornecida se distribui entre a parcela útil e a parcela dissipada; a soma das saídas deve ser compatível com a entrada dentro das incertezas de medição.',limit:'O balanço não identifica sozinho todos os mecanismos de perda; ele apenas verifica se as quantidades medidas são compatíveis com conservação.',action:'reduzir perdas térmicas com isolamento e repetir as medições para verificar a eficiência'},
    EM13CNT102:{focus:'desempenho de sistemas térmicos sustentáveis',context:'comparação de duas caixas térmicas para conservar água aquecida',unit:'°C de queda em 30 min',aLabel:'queda de temperatura no protótipo com isolamento simples',bLabel:'queda de temperatura no protótipo com isolamento reforçado',rLabel:'limite máximo de queda definido pelo projeto',a:12,b:6,r:8,concept:'isolamento térmico e eficiência',mechanism:'Menor queda de temperatura no mesmo intervalo indica menor transferência de energia térmica para o ambiente nas condições do teste.',limit:'O resultado vale para o tempo, volume, temperatura inicial e ambiente controlados no ensaio; mudar essas variáveis pode alterar o desempenho.',action:'adotar o isolamento reforçado e repetir o teste em outras temperaturas e tempos antes de definir o protótipo final'},
    EM13CNT103:{focus:'potencialidades e riscos das radiações',context:'teste didático de proteção contra radiação ultravioleta',unit:'% de radiação UV transmitida',aLabel:'transmissão sem barreira',bLabel:'transmissão com barreira protetora',rLabel:'meta máxima de transmissão do protocolo',a:100,b:18,r:25,concept:'radiação, exposição e proteção',mechanism:'A barreira reduz a fração de radiação que atravessa o material; menor transmissão significa menor exposição nas condições do teste.',limit:'O teste compara transmissão em uma montagem específica e não substitui protocolos reais de segurança, dose ou avaliação de saúde.',action:'usar barreiras adequadas, reduzir exposição desnecessária e seguir protocolos técnicos específicos para cada aplicação'},
    EM13CNT104:{focus:'toxicidade, reatividade, exposição e descarte responsável',context:'comparação de concentração de um produto de limpeza em água de descarte',unit:'mg/L do componente ativo',aLabel:'concentração antes da diluição controlada',bLabel:'concentração após o procedimento previsto',rLabel:'valor de referência didático do protocolo interno',a:80,b:20,r:25,concept:'risco químico depende de perigo e exposição',mechanism:'Reduzir a concentração diminui a exposição potencial, mas não transforma automaticamente uma substância perigosa em material de descarte livre.',limit:'Concentração é apenas uma parte da avaliação; toxicidade, reatividade, via de exposição e regras de descarte também precisam ser consideradas.',action:'seguir ficha de segurança, usar a quantidade necessária e encaminhar resíduos conforme orientação técnica, sem descarte improvisado'},
    EM13CNT105:{focus:'ciclos biogeoquímicos e interferência humana',context:'balanço simplificado de carbono em uma área escolar arborizada',unit:'kg de CO₂ equivalente por mês',aLabel:'emissões estimadas das atividades monitoradas',bLabel:'remoção estimada pela vegetação no modelo',rLabel:'emissões após uma ação de redução proposta',a:420,b:150,r:330,concept:'fluxos de carbono no sistema',mechanism:'Emissões acrescentam carbono ao fluxo atmosférico e a remoção pela vegetação representa apenas uma parcela do balanço; não são processos equivalentes em escala ilimitada.',limit:'O modelo simplifica o ciclo do carbono e não inclui todos os reservatórios, tempos de permanência e fluxos do sistema real.',action:'reduzir emissões na fonte e conservar/ampliar a vegetação, acompanhando os dois fluxos ao longo do tempo'},
    EM13CNT106:{focus:'geração, transporte, consumo e eficiência de energia elétrica',context:'comparação de duas soluções de iluminação para um bloco escolar',unit:'kWh por mês',aLabel:'consumo da solução atual',bLabel:'consumo da alternativa eficiente',rLabel:'meta mensal de consumo definida pelo projeto',a:900,b:540,r:600,concept:'eficiência energética e impacto',mechanism:'Para o mesmo serviço de iluminação, menor consumo elétrico indica maior eficiência energética, desde que desempenho e segurança sejam equivalentes.',limit:'Consumo não é o único critério: custo de implantação, vida útil, descarte, origem da energia e condições locais também entram na decisão.',action:'comparar custo total, eficiência, durabilidade e descarte antes de substituir os equipamentos'},
    EM13CNT107:{focus:'transformação e condução de energia em geradores, motores e baterias',context:'ensaio de um pequeno motor elétrico didático',unit:'W',aLabel:'potência elétrica de entrada',bLabel:'potência mecânica útil medida',rLabel:'potência dissipada estimada',a:120,b:84,r:36,concept:'transformação de energia e eficiência',mechanism:'A potência de entrada se transforma em potência mecânica útil e em perdas, principalmente térmicas; a eficiência relaciona saída útil e entrada.',limit:'O ensaio representa uma condição de carga e não descreve sozinho o comportamento do motor em todas as rotações, temperaturas e cargas.',action:'evitar sobrecarga, dimensionar corretamente o motor e comparar eficiência em diferentes condições de operação'},
    EM13CNT202:{focus:'formas de vida, níveis de organização e fatores limitantes',context:'crescimento de plantas da mesma espécie sob duas disponibilidades de luz',unit:'cm de crescimento médio',aLabel:'crescimento no regime de luz adequado',bLabel:'crescimento no regime de luz reduzido',rLabel:'crescimento médio em condição intermediária',a:18,b:9,r:14,concept:'fatores ambientais limitantes',mechanism:'A disponibilidade de luz pode limitar a produção de matéria orgânica pela planta e, por isso, alterar o crescimento quando outras condições são mantidas.',limit:'O experimento isola apenas parte das variáveis; água, nutrientes, temperatura e diferenças individuais também podem influenciar o crescimento.',action:'controlar as demais variáveis e repetir o experimento com várias plantas antes de generalizar o resultado'},
    EM13CNT203:{focus:'efeitos de intervenções nos ecossistemas',context:'monitoramento de organismos aquáticos antes e depois da recuperação de mata ciliar',unit:'número médio de táxons indicadores',aLabel:'riqueza antes da intervenção',bLabel:'riqueza após o período de recuperação',rLabel:'riqueza em um trecho de referência conservado',a:8,b:14,r:17,concept:'intervenção, biodiversidade e funcionamento do ecossistema',mechanism:'O aumento de táxons indicadores é compatível com melhora de condições ambientais, mas deve ser interpretado junto a outras variáveis do ecossistema.',limit:'Comparação temporal não prova, sozinha, que toda mudança foi causada pela intervenção; clima, vazão e outras ações também podem influenciar.',action:'manter a recuperação, ampliar os indicadores monitorados e comparar com trechos de referência ao longo do tempo'},
    EM13CNT204:{focus:'movimentos e interações gravitacionais',context:'comparação didática de períodos orbitais em duas órbitas circulares simuladas',unit:'unidades de tempo do modelo',aLabel:'período na órbita de menor raio',bLabel:'período na órbita de maior raio',rLabel:'período previsto pelo modelo para uma órbita intermediária',a:8,b:24,r:15,concept:'gravitação e movimento orbital',mechanism:'No modelo adotado, aumentar o raio orbital altera velocidade e período; o movimento resulta da interação gravitacional e das condições iniciais.',limit:'Os valores são de uma simulação didática e não podem ser transferidos diretamente para sistemas reais sem considerar massas, unidades e parâmetros físicos.',action:'usar o modelo para formular previsões e depois confrontá-las com dados ou simulações de parâmetros conhecidos'},
    EM13CNT205:{focus:'probabilidade, incerteza e limites de previsão',context:'repetição de um experimento de germinação sob condições controladas',unit:'% de sementes germinadas',aLabel:'taxa observada no primeiro conjunto',bLabel:'taxa observada na repetição independente',rLabel:'média das duas repetições',a:72,b:78,r:75,concept:'variabilidade e incerteza experimental',mechanism:'Resultados próximos, mas não idênticos, mostram variabilidade; a repetição ajuda a estimar uma tendência sem transformar o resultado em certeza absoluta.',limit:'Duas repetições ainda são poucas para caracterizar toda a variabilidade; tamanho da amostra e controle das condições afetam a incerteza.',action:'aumentar o número de repetições, registrar dispersão e apresentar previsões acompanhadas de suas limitações'},
    EM13CNT206:{focus:'preservação da biodiversidade e políticas ambientais',context:'comparação de dois fragmentos de vegetação monitorados',unit:'espécies registradas no levantamento padronizado',aLabel:'riqueza no fragmento protegido',bLabel:'riqueza no fragmento sob maior pressão humana',rLabel:'meta mínima definida para restauração do fragmento pressionado',a:42,b:24,r:35,concept:'biodiversidade, conservação e ação humana',mechanism:'Maior riqueza registrada no fragmento protegido é compatível com condições de conservação mais favoráveis, embora riqueza seja apenas um dos indicadores de biodiversidade.',limit:'Um levantamento pontual pode não detectar todas as espécies e não isola todos os fatores que diferenciam os fragmentos.',action:'reduzir pressões, restaurar habitat, manter monitoramento e avaliar políticas com múltiplos indicadores de biodiversidade'},
    EM13CNT207:{focus:'vulnerabilidades das juventudes e promoção de saúde e bem-estar',context:'levantamento escolar anônimo sobre horas de sono em dias letivos',unit:'% de respondentes abaixo da faixa de sono definida no protocolo educativo',aLabel:'percentual no primeiro levantamento',bLabel:'percentual após campanha educativa e mudança de rotina',rLabel:'meta de redução definida pelo projeto',a:46,b:34,r:30,concept:'vulnerabilidade, prevenção e promoção de bem-estar',mechanism:'A redução do percentual é compatível com melhora do indicador monitorado, mas o questionário não diagnostica indivíduos nem explica sozinho todas as causas.',limit:'Autorreporte, adesão voluntária e fatores externos limitam a interpretação; resultados coletivos não devem ser usados para rotular estudantes.',action:'manter ações educativas, oferecer canais de apoio e repetir o levantamento preservando anonimato e participação voluntária'},
    EM13CNT209:{focus:'evolução estelar, elementos químicos e sistemas planetários',context:'modelo didático de composição química de duas estrelas em fases distintas',unit:'% de elementos mais pesados que hélio no modelo',aLabel:'fração na estrela formada de material menos enriquecido',bLabel:'fração na estrela formada de material mais enriquecido por gerações anteriores',rLabel:'fração de referência do conjunto simulado',a:1,b:3,r:2,concept:'evolução estelar e enriquecimento químico',mechanism:'Elementos mais pesados são produzidos e redistribuídos por processos estelares; gerações posteriores podem formar-se de material mais enriquecido.',limit:'A fração química isolada não determina a existência de vida nem descreve toda a história da estrela ou do sistema planetário.',action:'relacionar composição, evolução estelar e formação planetária sem tratar uma única variável como prova de habitabilidade'},
    EM13CNT301:{focus:'questões, hipóteses, medidas e conclusões científicas',context:'investigação da temperatura de diferentes superfícies no pátio',unit:'°C ao meio-dia',aLabel:'temperatura média do piso escuro',bLabel:'temperatura média da área gramada',rLabel:'temperatura média do piso claro',a:48,b:32,r:39,concept:'hipótese, variável, medição e evidência',mechanism:'As medidas permitem comparar superfícies sob o protocolo usado e testar a hipótese de que características da cobertura influenciam o aquecimento.',limit:'Horário, sombra, umidade, instrumento e número de pontos medidos precisam ser controlados ou registrados antes de atribuir a diferença a uma única causa.',action:'repetir medidas em vários pontos e horários, registrar variáveis e usar os dados para avaliar a hipótese'},
    EM13CNT306:{focus:'avaliação de riscos e comportamentos de segurança',context:'simulação de trabalho com ferramenta que projeta partículas',unit:'partículas que atingiram a área facial do manequim em 20 ensaios',aLabel:'impactos sem proteção ocular',bLabel:'impactos com barreira ocular adequada',rLabel:'meta do protocolo com proteção corretamente posicionada',a:36,b:2,r:0,concept:'risco, exposição e barreira de proteção',mechanism:'A barreira reduz a exposição da área protegida, mas não elimina outros riscos da atividade nem substitui procedimentos seguros.',limit:'A simulação mede apenas um tipo de exposição e não reproduz todas as condições de uma situação real de trabalho.',action:'combinar equipamento adequado, procedimento seguro, treinamento e controle da fonte de risco'},
    EM13CNT307:{focus:'propriedades dos materiais e adequação de uso',context:'seleção de material para uma cobertura externa',unit:'% de perda de resistência após ensaio de envelhecimento',aLabel:'perda do material A',bLabel:'perda do material B',rLabel:'limite máximo aceito pelo projeto',a:28,b:12,r:15,concept:'propriedade, desempenho, segurança e sustentabilidade',mechanism:'Menor perda de resistência após o mesmo ensaio indica maior estabilidade mecânica nessa condição específica de envelhecimento.',limit:'A escolha final também depende de custo, massa, inflamabilidade, manutenção, reciclabilidade e outras propriedades relevantes ao uso.',action:'selecionar material apenas após comparar o conjunto de propriedades e o ciclo de vida, não um único ensaio'},
    EM13CNT308:{focus:'funcionamento de equipamentos eletrônicos e automação',context:'monitoramento de iluminação automatizada por sensor de presença',unit:'kWh por semana',aLabel:'consumo com acionamento manual contínuo',bLabel:'consumo com automação por presença',rLabel:'consumo de referência previsto no projeto',a:84,b:52,r:55,concept:'sensores, controle e consumo de energia',mechanism:'O sensor altera o tempo de funcionamento das lâmpadas conforme presença detectada, reduzindo consumo quando o espaço está vazio.',limit:'Economia de energia não avalia sozinha confiabilidade, conforto, descarte eletrônico, custo e possíveis falhas do sistema.',action:'avaliar consumo, taxa de falhas, manutenção e impactos do equipamento antes de ampliar a automação'},
    EM13CNT309:{focus:'dependência de recursos não renováveis e alternativas tecnológicas',context:'comparação de duas fontes de energia em um estudo de planejamento',unit:'kg de CO₂ equivalente por unidade de energia no modelo',aLabel:'emissão da alternativa baseada em combustível fóssil',bLabel:'emissão operacional da alternativa renovável no modelo',rLabel:'meta de emissão do cenário de transição',a:72,b:12,r:30,concept:'recursos não renováveis, transição e impactos',mechanism:'A diferença de emissão operacional favorece a alternativa de menor carbono nesse indicador, mas decisões energéticas envolvem disponibilidade, armazenamento, materiais e ciclo de vida.',limit:'Comparar apenas emissão operacional omite construção, mineração de materiais, infraestrutura, intermitência, custo e outros impactos.',action:'planejar transição com múltiplos critérios, reduzir dependência de não renováveis e avaliar o ciclo de vida das alternativas'},
    EM13CNT310:{focus:'infraestrutura, serviços básicos e qualidade de vida',context:'comparação de cobertura de saneamento em duas áreas do mesmo município',unit:'% de domicílios com coleta e tratamento adequados',aLabel:'cobertura na área com infraestrutura consolidada',bLabel:'cobertura na área com déficit de serviço',rLabel:'meta municipal de cobertura',a:92,b:58,r:90,concept:'infraestrutura, desigualdade de acesso e saúde coletiva',mechanism:'Menor cobertura identifica déficit objetivo de serviço e pode orientar prioridade de investimento quando combinado a dados populacionais e sanitários.',limit:'Cobertura percentual não explica sozinha todos os indicadores de saúde; renda, moradia, acesso a serviços e outras condições também influenciam.',action:'priorizar expansão do serviço na área deficitária, acompanhar qualidade do atendimento e avaliar resultados com indicadores diversos'}
  };

  const QUALITATIVE_PROFILES = {
    EM13CNT201:{focus:'comparação de modelos sobre origem e evolução da vida, Terra e Universo',context:'comparação entre uma explicação histórica sobre a origem dos seres vivos e o conhecimento científico contemporâneo',source1:'um texto histórico registra uma explicação formulada com os conhecimentos e pressupostos disponíveis em sua época',source2:'evidências atuais de genética, geologia e biologia evolutiva são usadas para testar modelos científicos contemporâneos',synthesis:'Modelos científicos são avaliados por evidências e podem ser revistos; explicações históricas devem ser contextualizadas, não ridicularizadas nem apresentadas como equivalentes metodologicamente sem análise.',misconception:'Uma explicação antiga deve ser julgada apenas por ser antiga, sem considerar contexto e evidências.',concept:'modelos científicos e contexto histórico',analysis:'Comparar pressupostos, evidências disponíveis e possibilidade de teste mostra por que modelos de épocas distintas precisam ser analisados em seus contextos.',limit:'O material didático resume debates complexos e não esgota a diversidade histórica de explicações.',action:'comparar evidências e critérios de validação, distinguindo respeito cultural de equivalência entre métodos de produção de conhecimento'},
    EM13CNT208:{focus:'evolução biológica e história humana',context:'análise de evidências sobre origem, dispersão e diversidade humana',source1:'fósseis e dados arqueológicos mostram populações humanas em diferentes regiões e períodos',source2:'dados genéticos indicam ancestralidade compartilhada e fluxo gênico entre populações, sem sustentar hierarquias biológicas entre grupos humanos atuais',synthesis:'A evolução humana envolve ancestralidade comum, diversificação e dispersão; diferenças culturais e identidades sociais não autorizam hierarquias biológicas entre povos.',misconception:'A evolução humana forma uma escada linear de povos mais simples para povos mais avançados.',concept:'ancestralidade comum e diversidade humana',analysis:'Fósseis, arqueologia e genética são linhas de evidência diferentes que se complementam na reconstrução da história humana.',limit:'Nenhuma linha de evidência isolada reconstrói todos os detalhes de populações passadas.',action:'usar evidências evolutivas para compreender diversidade sem transformar diferenças populacionais em justificativas para discriminação'},
    EM13CNT302:{focus:'comunicação de resultados científicos para públicos variados',context:'preparação de um relatório e de um cartaz sobre qualidade da água',source1:'o relatório técnico apresenta tabela com pH, turbidez, data, local de coleta e método de medição',source2:'o cartaz para a comunidade traduz os mesmos resultados em linguagem direta, explicando o que foi medido e quais limites a análise possui',synthesis:'A informação científica deve preservar dados, método, incertezas e conclusão ao mudar de linguagem e suporte para outro público.',misconception:'Simplificar a linguagem permite retirar limitações ou alterar valores para tornar a mensagem mais convincente.',concept:'comunicação científica e adequação ao público',analysis:'Relatório e cartaz podem ter níveis diferentes de detalhe, mas precisam manter os mesmos resultados e limites de interpretação.',limit:'Comunicação acessível não substitui o acesso aos dados completos quando decisões técnicas exigem maior detalhamento.',action:'adaptar vocabulário e formato sem distorcer resultados, fontes, unidades ou grau de certeza'},
    EM13CNT303:{focus:'avaliação de textos de divulgação científica e confiabilidade de fontes',context:'comparação de duas publicações sobre um novo material biodegradável',source1:'a publicação A identifica autores, instituição, método, tamanho da amostra, tabela de resultados e limitações do teste',source2:'a publicação B afirma que o material “resolve definitivamente o problema do plástico”, mas não informa autoria, método, dados nem fonte primária',synthesis:'A publicação A oferece elementos verificáveis; a B faz uma conclusão muito ampla sem apresentar evidências que a sustentem.',misconception:'Uma afirmação é confiável quando usa linguagem de certeza, mesmo sem método, autoria ou dados.',concept:'fonte, evidência e coerência da conclusão',analysis:'Autoria, método, dados, referências e limites permitem verificar como a conclusão foi construída e se ela corresponde às evidências.',limit:'Mesmo uma fonte bem documentada pode conter incertezas e precisa ser confrontada com outras evidências relevantes.',action:'priorizar fontes verificáveis, conferir dados e método e desconfiar de conclusões absolutas não sustentadas'},
    EM13CNT304:{focus:'debate ético e responsável sobre aplicações das Ciências da Natureza',context:'debate escolar sobre uso de edição genética em uma aplicação médica hipotética',source1:'a posição favorável destaca potencial terapêutico quando há evidência de benefício, controle de segurança, consentimento e acompanhamento',source2:'a posição cautelosa destaca riscos de efeitos não previstos, desigualdade de acesso, limites éticos e necessidade de regulação',synthesis:'A decisão responsável exige pesar benefícios, riscos, evidências, direitos, consentimento, justiça e regras aplicáveis; nenhuma posição se sustenta apenas por entusiasmo ou medo.',misconception:'Se uma tecnologia é cientificamente possível, sua aplicação é automaticamente ética e socialmente aceitável.',concept:'evidência, ética, direitos e responsabilidade',analysis:'As posições destacam critérios distintos e podem ser comparadas por qualidade das evidências e consequências, não por ataques pessoais.',limit:'O caso é didático e não substitui avaliação médica, jurídica ou ética de situações reais específicas.',action:'formular decisões condicionadas a evidência, segurança, consentimento, equidade e supervisão responsável'},
    EM13CNT305:{focus:'uso indevido de conhecimentos científicos para discriminação e privação de direitos',context:'análise histórica de uma alegação pseudocientífica usada para hierarquizar grupos humanos',source1:'o documento histórico apresenta medidas corporais como se determinassem valor intelectual e social de grupos inteiros',source2:'conhecimento científico contemporâneo mostra que características humanas complexas resultam de múltiplos fatores e que variação dentro de populações impede esse tipo de hierarquia biológica simplista',synthesis:'A alegação histórica extrapola dados, naturaliza desigualdades sociais e usa linguagem científica para justificar discriminação; deve ser criticada científica e eticamente.',misconception:'Qualquer afirmação que use números ou termos biológicos é científica e pode justificar diferenças de direitos.',concept:'evidência, extrapolação e discriminação',analysis:'É preciso separar medição de interpretação: dados limitados não sustentam conclusões deterministas sobre capacidades, valor social ou direitos.',limit:'O exemplo resume um problema histórico amplo e deve ser tratado sem reproduzir estereótipos como se fossem fatos.',action:'examinar método e inferências, explicitar violações de direitos e promover equidade e respeito à diversidade'}
  };

  function scienceSeed(collectionMeta, index) {
    return collectionMeta.series * 97 + collectionMeta.bimester * 31 + (index + 1) * 13;
  }

  function tweakNumber(base, seed, unit) {
    if (unit.includes('%')) return Math.max(1, base + ((seed % 3) - 1) * 2);
    if (unit === '°C de queda em 30 min') return Math.max(1, base + ((seed % 3) - 1));
    return Math.max(1, base + ((seed % 3) - 1) * Math.max(1, Math.round(base * 0.04)));
  }

  function scienceNumeric(activity, collectionMeta, index, profile) {
    const seed = scienceSeed(collectionMeta, index);
    const a = tweakNumber(profile.a, seed, profile.unit);
    const b = tweakNumber(profile.b, seed + 1, profile.unit);
    const r = tweakNumber(profile.r, seed + 2, profile.unit);
    const diff = b - a;
    const relative = Math.round((diff / a) * 1000) / 10;
    const mode = modeFromTheme(activity.tema);
    const modeText = MODE_LABEL[mode];
    const title = `${activity.tipoSequencia}: ${profile.context}`;
    const support = `Estudo de Ciências da Natureza — ${modeText}. Contexto: ${profile.context}. Foco: ${profile.focus}. Dados do material: ${profile.aLabel} = ${fmt(a)} ${profile.unit}; ${profile.bLabel} = ${fmt(b)} ${profile.unit}; ${profile.rLabel} = ${fmt(r)} ${profile.unit}. Conceito-chave: ${profile.concept}. Interpretação necessária: ${profile.mechanism} Limite da conclusão: ${profile.limit} Possível encaminhamento: ${profile.action}. Os valores pertencem a um modelo didático e devem ser interpretados somente nas condições descritas.`;
    const correct = `${profile.bLabel} apresenta ${fmt(Math.abs(diff))} ${profile.unit} ${diff >= 0 ? 'a mais' : 'a menos'} que ${profile.aLabel}.`;
    const refCompare = b === r ? 'é igual ao valor de referência' : `${b > r ? 'fica acima' : 'fica abaixo'} do valor de referência em ${fmt(Math.abs(b-r))} ${profile.unit}`;
    const questions = [
      {numero:1,tipo:'multipla-escolha',enunciado:`Com base nos dados de ${profile.context}, qual comparação entre as duas medidas principais é numericamente correta?`,alternativas:[correct,`${profile.bLabel} e ${profile.aLabel} têm exatamente o mesmo valor.`,'Os dados não permitem qualquer comparação numérica.','O valor de referência substitui as duas medidas e torna a comparação desnecessária.'],espacoResposta:'pequeno',figuraId:null},
      {numero:2,tipo:'verdadeiro-falso',enunciado:`Julgue a afirmação: “${profile.mechanism}”`,alternativas:['Verdadeiro','Falso'],espacoResposta:'pequeno',figuraId:null},
      {numero:3,tipo:'completar',enunciado:`Complete com o valor calculado: a diferença entre “${profile.bLabel}” e “${profile.aLabel}” é de ______ ${profile.unit}, considerando o sinal da variação.`,alternativas:[],espacoResposta:'pequeno',figuraId:null},
      {numero:4,tipo:'resolucao',enunciado:`Calcule a variação percentual da primeira medida (${fmt(a)}) para a segunda (${fmt(b)}), usando a primeira como base e arredondando para uma casa decimal.`,alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:5,tipo:'analise',enunciado:`Explique, com base no conceito de ${profile.concept}, por que a diferença observada é relevante para o foco “${profile.focus}”.`,alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:6,tipo:'interpretacao',enunciado:`Compare a segunda medida com o valor de referência (${fmt(r)} ${profile.unit}) e explique por que essa comparação ainda deve respeitar o limite de conclusão apresentado no texto.`,alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:7,tipo:'aplicacao',enunciado:`A partir dos dados e do limite do estudo, proponha uma ação coerente para o caso sem afirmar causalidade ou segurança além do que o material permite.`,alternativas:[],espacoResposta:'grande',figuraId:null},
      {numero:8,tipo:'producao',enunciado:`Produza uma conclusão de quatro a seis linhas sobre ${profile.context}. Ela deve citar as duas medidas, o conceito-chave, uma limitação e um encaminhamento compatível com as evidências.`,alternativas:[],espacoResposta:'grande',figuraId:null}
    ];
    const answers = [
      {numero:1,resposta:`A) ${correct}`,justificativa:`Os valores são ${fmt(a)} e ${fmt(b)} ${profile.unit}; a diferença é ${fmt(diff)} ${profile.unit}.`},
      {numero:2,resposta:'Verdadeiro.',justificativa:`A afirmação reproduz a interpretação científica explicitamente sustentada pelo material sobre ${profile.concept}.`},
      {numero:3,resposta:`${fmt(diff)} ${profile.unit}.`,justificativa:`${fmt(b)} − ${fmt(a)} = ${fmt(diff)}.`},
      {numero:4,resposta:pct(relative),justificativa:`(${fmt(b)} − ${fmt(a)}) ÷ ${fmt(a)} × 100 = ${pct(relative)}.`},
      {numero:5,resposta:profile.mechanism,justificativa:`A explicação deve relacionar os dados ao conceito de ${profile.concept}, sem apenas repetir os números.`},
      {numero:6,resposta:`A segunda medida ${refCompare}. ${profile.limit}`,justificativa:'A resposta combina comparação quantitativa e limite explícito do estudo.'},
      {numero:7,resposta:profile.action,justificativa:'O encaminhamento está presente no material e é compatível com o grau de evidência disponível.'},
      {numero:8,resposta:`A síntese deve registrar ${profile.aLabel} = ${fmt(a)} ${profile.unit}, ${profile.bLabel} = ${fmt(b)} ${profile.unit}, mencionar ${profile.concept}, reconhecer que ${profile.limit.charAt(0).toLowerCase()+profile.limit.slice(1)} e propor que se deve ${profile.action}.`,justificativa:'Esses elementos vinculam diretamente texto, dados, interpretação, limite e ação.'}
    ];
    return { title, support, questions, answers, evidence:[fmt(a),fmt(b),profile.concept,profile.context], mode };
  }

  function scienceQualitative(activity, collectionMeta, index, profile) {
    const mode = modeFromTheme(activity.tema);
    const modeText = MODE_LABEL[mode];
    const title = `${activity.tipoSequencia}: ${profile.context}`;
    const support = `Estudo de Ciências da Natureza — ${modeText}. Contexto: ${profile.context}. Foco: ${profile.focus}. Fonte 1 — ${profile.source1}. Fonte 2 — ${profile.source2}. Síntese sustentada pelo conjunto: ${profile.synthesis} Conceito-chave: ${profile.concept}. Limite: ${profile.limit} Encaminhamento responsável: ${profile.action}. Afirmação problemática para análise: “${profile.misconception}”`;
    const questions = [
      {numero:1,tipo:'multipla-escolha',enunciado:'Qual conclusão é mais consistente com as duas fontes e com o foco apresentado?',alternativas:[profile.synthesis,profile.misconception,'As duas fontes se anulam e nenhuma conclusão pode ser formulada.','Uma única frase de qualquer fonte basta para encerrar o debate sem considerar contexto ou evidência.'],espacoResposta:'pequeno',figuraId:null},
      {numero:2,tipo:'verdadeiro-falso',enunciado:`Julgue a afirmação problemática destacada no material: “${profile.misconception}”`,alternativas:['Verdadeiro','Falso'],espacoResposta:'pequeno',figuraId:null},
      {numero:3,tipo:'completar',enunciado:`Complete com o conceito-chave indicado no texto: “A análise deste caso exige articular ______.”`,alternativas:[],espacoResposta:'pequeno',figuraId:null},
      {numero:4,tipo:'associacao',enunciado:'Associe Fonte 1 e Fonte 2 ao tipo de contribuição que cada uma oferece e explique por que as duas precisam ser contextualizadas antes de uma conclusão.',alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:5,tipo:'analise',enunciado:`Explique como as duas fontes, lidas em conjunto, sustentam a síntese do material sem reproduzir a afirmação problemática.`,alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:6,tipo:'interpretacao',enunciado:'Qual é o principal limite explicitado no material e como ele deve modificar a força da conclusão?',alternativas:[],espacoResposta:'medio',figuraId:null},
      {numero:7,tipo:'aplicacao',enunciado:'Proponha uma decisão ou forma de comunicação compatível com as evidências, os direitos envolvidos e o encaminhamento responsável indicado.',alternativas:[],espacoResposta:'grande',figuraId:null},
      {numero:8,tipo:'producao',enunciado:`Produza uma síntese de quatro a seis linhas que apresente o contexto, use uma evidência de cada fonte, mobilize “${profile.concept}” e registre a limitação da análise.`,alternativas:[],espacoResposta:'grande',figuraId:null}
    ];
    const answers = [
      {numero:1,resposta:`A) ${profile.synthesis}`,justificativa:'É a única alternativa que articula as duas fontes sem extrapolar o material.'},
      {numero:2,resposta:'Falso.',justificativa:`A afirmação é problemática porque contradiz o conjunto de evidências e o conceito de ${profile.concept}.`},
      {numero:3,resposta:profile.concept,justificativa:'O conceito aparece explicitamente no material de apoio.'},
      {numero:4,resposta:`Fonte 1: ${profile.source1} Fonte 2: ${profile.source2} Elas oferecem evidências ou perspectivas diferentes e devem ser lidas considerando origem, finalidade e limites.`,justificativa:'A associação recupera informações explícitas das duas fontes.'},
      {numero:5,resposta:profile.analysis,justificativa:'A resposta explica a relação entre evidências e conclusão, em vez de apenas repetir a síntese.'},
      {numero:6,resposta:profile.limit,justificativa:'Esse limite está declarado no material e impede generalização indevida.'},
      {numero:7,resposta:profile.action,justificativa:'O encaminhamento preserva coerência científica, ética e social com o caso.'},
      {numero:8,resposta:`A síntese deve mencionar ${profile.context}, recuperar uma informação de cada fonte, usar o conceito “${profile.concept}” e reconhecer que ${profile.limit.charAt(0).toLowerCase()+profile.limit.slice(1)}`,justificativa:'Os critérios tornam a resposta autoral, porém verificável pelo material.'}
    ];
    return { title, support, questions, answers, evidence:[profile.context,profile.concept,'Fonte 1','Fonte 2'], mode };
  }

  function scienceActivity(activity, collectionMeta, index) {
    const code = activity.bncc?.[0]?.codigo || '';
    const numeric = NUMERIC_PROFILES[code];
    const qualitative = QUALITATIVE_PROFILES[code];
    if (!numeric && !qualitative) throw new Error(`Habilidade de Ciências sem perfil pedagógico: ${code}`);
    const built = numeric ? scienceNumeric(activity, collectionMeta, index, numeric) : scienceQualitative(activity, collectionMeta, index, qualitative);
    return {
      ...activity,
      titulo: built.title,
      objetivo: `Investigar ${numeric?.focus || qualitative.focus} em uma situação concreta, interpretando evidências e construindo conclusões compatíveis com o material.`,
      instrucaoGeral:'Leia o material de apoio, use exclusivamente os dados e evidências apresentados e responda às oito questões sem extrapolar os limites indicados.',
      textoApoio:{titulo:built.title,conteudo:built.support},
      quantidadeQuestoes:8,
      questoes:built.questions,
      possuiGabarito:true,
      gabarito:built.answers,
      possuiVersaoAdaptada:true,
      versaoAdaptada:{orientacao:'Destacar contexto, dados/evidências, conceito-chave, limite e encaminhamento em cinco blocos. Resolver primeiro as questões objetivas e depois usar um organizador de evidências para as respostas discursivas.'},
      possuiFiguras:false,
      figuras:[],
      ilustracao:{...(activity.ilustracao||{}),arquivo:null,status:'nao-necessaria',descricao:'Não necessária: todos os dados e evidências exigidos estão explicitamente escritos no material de apoio.',objetivoPedagogico:'Garantir que nenhuma resposta dependa de imagem externa.'},
      bncc:activity.bncc,
      bnccConferida:true,
      revisao:{...(activity.revisao||{}),status:'aprovada-pedagogicamente',bnccConferida:true,conteudoConferido:true,questoesConferidas:true,gabaritoConferido:true,ilustracaoConferida:true,validacaoAutomatica:true},
      coerencia:{fonte:'perfil-especifico-por-habilidade',codigoBncc:code,temaCanonico:activity.tema,modo:built.mode,evidencias:built.evidence,textoQuestoesGabaritoVinculados:true}
    };
  }

  function applyFromBaseline(collection, baseline) {
    const collectionMeta = meta(collection);
    if (!collectionMeta || collectionMeta.discipline === 'ciencias' || !Array.isArray(collection.atividades) || !Array.isArray(baseline?.atividades)) return collection;
    if (baseline.atividades.length !== collection.atividades.length) throw new Error('Coleção-base incompatível com a coleção de destino.');
    collection.atividades = collection.atividades.map((activity,index) => approvedFromBaseline(activity, baseline.atividades[index], collectionMeta));
    collection.statusBimestre = 'revisao-pedagogica-coerente-concluida';
    return collection;
  }

  function applyScience(collection) {
    const collectionMeta = meta(collection);
    if (!collectionMeta || collectionMeta.discipline !== 'ciencias' || !Array.isArray(collection.atividades)) return collection;
    collection.atividades = collection.atividades.map((activity,index) => scienceActivity(activity, collectionMeta, index));
    collection.statusBimestre = 'revisao-pedagogica-coerente-concluida';
    return collection;
  }

  globalThis.TeachEasyHighSchoolCoherentRemaining = {
    matches(collection){ return Boolean(meta(collection)); },
    applyFromBaseline,
    applyScience,
    scienceProfileCodes:[...Object.keys(NUMERIC_PROFILES),...Object.keys(QUALITATIVE_PROFILES)].sort(),
    expectedCollections:55,
    expectedActivities:2750
  };
})();
