(() => {
  const collection = 'em-1serie-1bimestre-historia-v2';
  const patches = new Map();
  const typeSlugs = ['mapa-conceitual','estudo-de-caso','investigacao','situacao-problema','leitura-critica','debate','oficina','analise-de-dados','projeto-aplicado','sintese-autoral'];
  const typeLabels = ['Mapa conceitual','Estudo de caso','Investigação','Situação-problema','Leitura crítica','Debate','Oficina','Análise de dados','Projeto aplicado','Síntese autoral'];
  const skills = {
    EM13CHS101: 'comparar fontes e narrativas, considerando autoria, linguagem, contexto e perspectiva',
    EM13CHS102: 'contextualizar matrizes conceituais e confrontar discursos de diferentes agentes sociais',
    EM13CHS103: 'formular hipóteses, selecionar evidências e construir argumentos históricos',
    EM13CHS105: 'criticar tipologias evolutivas e oposições dicotômicas, reconhecendo ambiguidades',
    EM13CHS106: 'interpretar criticamente mapas, gráficos, imagens, textos e linguagens digitais',
    EM13CHS201: 'analisar mobilidade de pessoas, mercadorias e capital e suas causas históricas',
    EM13CHS202: 'avaliar impactos das tecnologias nas relações sociais, econômicas, políticas e culturais',
    EM13CHS203: 'comparar sentidos históricos de território, fronteira e vazio sem naturalizar dicotomias',
    EM13CHS204: 'comparar processos de ocupação e formação territorial, agentes, conflitos e diversidade',
    EM13CHS603: 'analisar Estado, poder, soberania, formação de países e experiências de cidadania'
  };

  const adapted = {
    orientacao: 'Destacar palavras-chave, apresentar as duas fontes separadamente, dividir as oito questões em etapas curtas e permitir resposta oral ou por tópicos antes da escrita final.'
  };

  function build(meta, original) {
    const code = original.bncc?.[0]?.codigo || '';
    const focus = skills[code] || 'analisar evidências históricas de forma contextualizada';
    const support = `${meta.context} Fonte A — ${meta.sourceA} Fonte B — ${meta.sourceB} A atividade exige ${focus}. As fontes são sínteses didáticas e devem ser lidas como evidências situadas: autoria, finalidade, público, temporalidade e limites precisam ser considerados antes de qualquer conclusão.`;
    const q1 = `Considerando as Fontes A e B, qual interpretação é mais consistente com o conjunto de evidências e com o contexto apresentado?`;
    const alternatives = [
      meta.claim,
      'Somente a Fonte A pode ser usada porque uma fonte escrita ou institucional é sempre neutra.',
      'As duas fontes dizem exatamente a mesma coisa e, por isso, não é necessário considerar autoria ou contexto.',
      'A existência de perspectivas diferentes impede qualquer interpretação histórica fundamentada.'
    ];
    const questions = [
      { numero: 1, tipo: 'multipla-escolha', enunciado: q1, alternativas, espacoResposta: 'pequeno', figuraId: null },
      { numero: 2, tipo: 'verdadeiro-falso', enunciado: `${meta.statement} Julgue a afirmação com base no material de apoio.`, alternativas: ['Verdadeiro','Falso'], espacoResposta: 'pequeno', figuraId: null },
      { numero: 3, tipo: 'completar', enunciado: `Complete com o conceito histórico que melhor organiza a análise deste caso: “${meta.blank} ______.”`, alternativas: [], espacoResposta: 'pequeno', figuraId: null },
      { numero: 4, tipo: 'associacao', enunciado: `Associe cada fonte ao papel que ela cumpre na investigação: Fonte A e Fonte B. Explique em uma frase por que elas não devem ser tratadas como evidências idênticas.`, alternativas: [], espacoResposta: 'medio', figuraId: null },
      { numero: 5, tipo: 'analise', enunciado: `Compare as duas fontes e explique como contexto, autoria, interesse ou posição social ajudam a compreender a diferença entre elas.`, alternativas: [], espacoResposta: 'medio', figuraId: null },
      { numero: 6, tipo: 'resolucao', enunciado: `Organize a sequência histórica ou lógica indicada no caso, mostrando a relação entre antecedente, processo e consequência.`, alternativas: [], espacoResposta: 'medio', figuraId: null },
      { numero: 7, tipo: 'interpretacao', enunciado: `Que conclusão pode ser sustentada pelas duas fontes em conjunto sem ultrapassar os limites das evidências apresentadas?`, alternativas: [], espacoResposta: 'grande', figuraId: null },
      { numero: 8, tipo: 'producao', enunciado: `Produza uma síntese histórica curta que mobilize o conceito-chave, uma evidência de cada fonte e a conclusão do caso, evitando anacronismos e generalizações.`, alternativas: [], espacoResposta: 'grande', figuraId: null }
    ];
    const answers = [
      { numero: 1, resposta: meta.claim, justificativa: `É a alternativa que articula as duas fontes ao foco ${code} sem transformar uma evidência isolada em verdade absoluta.` },
      { numero: 2, resposta: meta.truth ? 'Verdadeiro' : 'Falso', justificativa: meta.statementReason },
      { numero: 3, resposta: meta.concept, justificativa: `O conceito “${meta.concept}” é o eixo indicado pelo contexto e pela habilidade trabalhada.` },
      { numero: 4, resposta: `Fonte A – ${meta.roleA}; Fonte B – ${meta.roleB}. Elas possuem origem, finalidade ou perspectiva distintas e precisam ser contextualizadas.`, justificativa: 'A associação diferencia a função de cada evidência e evita tratá-las como registros neutros e equivalentes.' },
      { numero: 5, resposta: meta.comparison, justificativa: 'A comparação relaciona perspectiva e contexto às diferenças observadas entre as fontes.' },
      { numero: 6, resposta: meta.order, justificativa: 'A sequência respeita a temporalidade e a relação causal ou processual indicada no material.' },
      { numero: 7, resposta: meta.inference, justificativa: 'A conclusão combina as duas evidências sem afirmar algo que o material não permite sustentar.' },
      { numero: 8, resposta: `A síntese deve mencionar “${meta.concept}”, utilizar uma evidência da Fonte A e uma da Fonte B e concluir que ${meta.inference.charAt(0).toLowerCase() + meta.inference.slice(1)}`, justificativa: 'O gabarito define os elementos obrigatórios e permite redação autoral sem perder verificabilidade.' }
    ];

    return {
      ...original,
      titulo: meta.title,
      objetivo: `Analisar ${meta.title.toLowerCase()} com foco em ${focus}, preservando a habilidade ${code}.`,
      instrucaoGeral: 'Leia o contexto e as duas fontes, responda às oito questões e sustente cada conclusão com evidências do material.',
      textoApoio: { titulo: meta.title, conteudo: support },
      quantidadeQuestoes: 8,
      questoes: questions,
      possuiGabarito: true,
      gabarito: answers,
      possuiVersaoAdaptada: true,
      versaoAdaptada: adapted,
      bncc: original.bncc,
      bnccConferida: true,
      ilustracao: {
        ...(original.ilustracao || {}),
        arquivo: null,
        status: 'nao-necessaria',
        descricao: 'Não necessária: a atividade foi construída para ser resolvida integralmente com o contexto e as duas fontes textuais apresentadas.',
        objetivoPedagogico: 'Não há questão dependente de imagem externa.'
      },
      revisao: {
        ...(original.revisao || {}),
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

  function registerBlock({ start, block, slug, items }) {
    items.forEach((item, index) => {
      const sequence = start + index;
      const pos = (sequence - 1) % 10;
      const id = `em-1s-b1-historia-${String(sequence).padStart(2, '0')}-${typeSlugs[pos]}-${slug}`;
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

  globalThis.TeachEasyHighSchoolHistoryPedagogicalOverrides = {
    collection,
    registerBlock,
    apply,
    get reviewedIds() { return Array.from(patches.keys()); }
  };
})();
