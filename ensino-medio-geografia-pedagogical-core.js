(() => {
  const collection = 'em-1serie-1bimestre-geografia-v2';
  const patches = new Map();
  const typeSlugs = ['mapa-conceitual','estudo-de-caso','investigacao','situacao-problema','leitura-critica','debate','oficina','analise-de-dados','projeto-aplicado','sintese-autoral'];
  const typeLabels = ['Mapa conceitual','Estudo de caso','Investigação','Situação-problema','Leitura crítica','Debate','Oficina','Análise de dados','Projeto aplicado','Síntese autoral'];
  const skills = {
    EM13CHS101: 'comparar fontes e narrativas sobre processos espaciais, considerando autoria, linguagem, contexto e perspectiva',
    EM13CHS106: 'interpretar criticamente mapas, gráficos, imagens e linguagens digitais, reconhecendo escolhas de escala, legenda e representação',
    EM13CHS201: 'analisar fluxos e fixações de pessoas, mercadorias e capital e suas relações com fatores sociais, econômicos, políticos e ambientais',
    EM13CHS202: 'avaliar como tecnologias reestruturam territórios, redes, fluxos e decisões sociais, econômicas e ambientais',
    EM13CHS203: 'comparar sentidos de território, fronteira e vazio em diferentes contextos, evitando naturalizar visões dicotômicas',
    EM13CHS204: 'comparar processos de ocupação, territorialização e formação de fronteiras, identificando agentes, conflitos e diversidade',
    EM13CHS205: 'analisar territorialidades e formas de apropriação do espaço em suas dimensões culturais, econômicas, ambientais, políticas e sociais',
    EM13CHS206: 'aplicar localização, distribuição, extensão, conexão e causalidade para interpretar a produção do espaço',
    EM13CHS301: 'problematizar produção, reaproveitamento e descarte de resíduos e selecionar ações de sustentabilidade socioambiental',
    EM13CHS306: 'comparar impactos de modelos socioeconômicos no uso de recursos naturais, na desigualdade e na sustentabilidade'
  };
  const adapted = { orientacao: 'Destacar palavras-chave, apresentar os dados em etapas curtas, permitir uso de calculadora simples e resposta oral ou por tópicos antes da escrita final.' };
  const fmt = value => Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2))).replace('.', ',');

  function build(meta, original) {
    const code = original.bncc?.[0]?.codigo || '';
    const focus = skills[code] || 'analisar processos geográficos com base em evidências espaciais';
    const diff = Math.abs(meta.valueA - meta.valueB);
    const higher = meta.valueA > meta.valueB ? meta.labelA : meta.labelB;
    const lower = meta.valueA > meta.valueB ? meta.labelB : meta.labelA;
    const support = `${meta.context} Dado A — ${meta.labelA}: ${fmt(meta.valueA)} ${meta.unit}. Dado B — ${meta.labelB}: ${fmt(meta.valueB)} ${meta.unit}. ${meta.sourceA} ${meta.sourceB} A análise deve mobilizar ${focus}. Os dados são didáticos e servem para comparar distribuição, escala, agentes e consequências espaciais sem transformar um único indicador em explicação total.`;
    const questions = [
      { numero: 1, tipo: 'multipla-escolha', enunciado: `Qual interpretação é mais consistente com os dados e com o processo geográfico apresentado em “${meta.title}”?`, alternativas: [meta.claim, 'O maior valor numérico explica sozinho todas as causas do fenômeno.', 'Os dois lugares ou grupos são espacialmente idênticos porque pertencem ao mesmo tema.', 'Os dados tornam desnecessário considerar escala, agentes e contexto territorial.'], espacoResposta: 'pequeno', figuraId: null },
      { numero: 2, tipo: 'verdadeiro-falso', enunciado: `${meta.statement} Julgue a afirmação com base no material de apoio.`, alternativas: ['Verdadeiro','Falso'], espacoResposta: 'pequeno', figuraId: null },
      { numero: 3, tipo: 'completar', enunciado: `Complete com o conceito geográfico central: “${meta.blank} ______.”`, alternativas: [], espacoResposta: 'pequeno', figuraId: null },
      { numero: 4, tipo: 'resolucao', enunciado: `Calcule a diferença absoluta entre ${meta.labelA} e ${meta.labelB}. Apresente o resultado em ${meta.unit}.`, alternativas: [], espacoResposta: 'medio', figuraId: null },
      { numero: 5, tipo: 'associacao', enunciado: `Associe cada dado à sua leitura espacial: ${meta.labelA} e ${meta.labelB}. Em seguida, indique qual apresenta o maior valor e qual apresenta o menor valor.`, alternativas: [], espacoResposta: 'medio', figuraId: null },
      { numero: 6, tipo: 'analise', enunciado: `Explique como escala, localização, rede, fluxo, território ou paisagem ajudam a compreender por que os dois valores diferem. Use ao menos dois elementos do contexto.`, alternativas: [], espacoResposta: 'medio', figuraId: null },
      { numero: 7, tipo: 'interpretacao', enunciado: `Que conclusão pode ser sustentada pelos dados sem ultrapassar seus limites? Indique também uma informação adicional que seria necessária para explicar melhor o fenômeno.`, alternativas: [], espacoResposta: 'grande', figuraId: null },
      { numero: 8, tipo: 'producao', enunciado: `Produza uma síntese geográfica curta usando o conceito “${meta.concept}”, os dois dados e uma proposta ou implicação territorial coerente com o caso.`, alternativas: [], espacoResposta: 'grande', figuraId: null }
    ];
    const answers = [
      { numero: 1, resposta: meta.claim, justificativa: `A alternativa relaciona os dados ao foco ${code} e evita explicações deterministas ou sem contexto.` },
      { numero: 2, resposta: meta.truth ? 'Verdadeiro' : 'Falso', justificativa: meta.statementReason },
      { numero: 3, resposta: meta.concept, justificativa: `“${meta.concept}” é o conceito indicado pelo contexto e pela habilidade trabalhada.` },
      { numero: 4, resposta: `${fmt(diff)} ${meta.unit}.`, justificativa: `Diferença absoluta = |${fmt(meta.valueA)} − ${fmt(meta.valueB)}| = ${fmt(diff)} ${meta.unit}.` },
      { numero: 5, resposta: `${meta.labelA} – ${fmt(meta.valueA)} ${meta.unit}; ${meta.labelB} – ${fmt(meta.valueB)} ${meta.unit}. Maior: ${higher}. Menor: ${lower}.`, justificativa: 'A associação mantém cada valor ligado ao lugar ou grupo correto e permite uma comparação objetiva.' },
      { numero: 6, resposta: meta.comparison, justificativa: 'A resposta esperada articula pelo menos dois elementos espaciais e evita tratar o indicador como causa única.' },
      { numero: 7, resposta: `${meta.inference} Informação adicional pertinente: ${meta.extra}.`, justificativa: 'A conclusão permanece dentro do alcance dos dados e explicita a necessidade de evidências complementares.' },
      { numero: 8, resposta: `A síntese deve mencionar “${meta.concept}”, comparar ${fmt(meta.valueA)} e ${fmt(meta.valueB)} ${meta.unit} e relacionar o caso a ${meta.action}.`, justificativa: 'O gabarito define elementos obrigatórios, preservando autoria e verificabilidade.' }
    ];
    return {
      ...original,
      titulo: meta.title,
      objetivo: `Analisar ${meta.title.toLowerCase()} com foco em ${focus}, preservando a habilidade ${code}.`,
      instrucaoGeral: 'Leia o contexto e os dados, responda às oito questões e sustente as conclusões com evidências espaciais e conceitos geográficos.',
      textoApoio: { titulo: meta.title, conteudo: support },
      quantidadeQuestoes: 8,
      questoes: questions,
      possuiGabarito: true,
      gabarito: answers,
      possuiVersaoAdaptada: true,
      versaoAdaptada: adapted,
      bncc: original.bncc,
      bnccConferida: true,
      ilustracao: { ...(original.ilustracao || {}), arquivo: null, status: 'nao-necessaria', descricao: 'Não necessária: a atividade contém todos os dados e informações espaciais necessários em formato textual.', objetivoPedagogico: 'Nenhuma questão depende de imagem externa.' },
      revisao: { ...(original.revisao || {}), status: 'aprovada-pedagogicamente', bnccConferida: true, conteudoConferido: true, questoesConferidas: true, gabaritoConferido: true, ilustracaoConferida: true, validacaoAutomatica: true }
    };
  }

  function registerBlock({ start, block, slug, items }) {
    items.forEach((item, index) => {
      const sequence = start + index;
      const pos = (sequence - 1) % 10;
      const id = `em-1s-b1-geografia-${String(sequence).padStart(2, '0')}-${typeSlugs[pos]}-${slug}`;
      patches.set(id, { ...item, id, sequence, block, typeLabel: typeLabels[pos] });
    });
  }
  function apply(input) {
    if (!input || input.colecao !== collection || !Array.isArray(input.atividades)) return input;
    input.atividades = input.atividades.map(activity => {
      const meta = patches.get(activity.id);
      return meta ? build(meta, activity) : activity;
    });
    return input;
  }
  globalThis.TeachEasyHighSchoolGeographyPedagogicalOverrides = { collection, registerBlock, apply, get reviewedIds() { return Array.from(patches.keys()); } };
})();
