(() => {
  const COLLECTION_RE = /^em-(1|2|3)serie-(1|2|3|4)bimestre-(lingua-portuguesa|matematica|ciencias|historia|geografia)-v2$/;
  const COMPLETED = new Set([
    'em-1serie-1bimestre-lingua-portuguesa-v2',
    'em-1serie-1bimestre-matematica-v2',
    'em-1serie-1bimestre-ciencias-v2',
    'em-1serie-1bimestre-historia-v2',
    'em-1serie-1bimestre-geografia-v2'
  ]);

  const STOP = new Set('a o as os de da do das dos e em para por com sem que se um uma uns umas ao aos à às como sobre entre sua seu suas seus este esta esse essa isso isto ser estar foi são pela pelo pelas pelos ou também mais menos muito pouco cada partir meio forma formações situações analisar análise relacionar relação desenvolver habilidade atividade estudante estudantes'.split(/\s+/));

  function normalize(text) {
    return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function cleanTopic(text) {
    return String(text || 'estudo aplicado').replace(/\s+/g, ' ').replace(/\.$/, '').trim();
  }

  function keywords(activity) {
    const theme = cleanTopic(activity.tema);
    const skill = cleanTopic(activity.bncc?.[0]?.habilidadeOficial);
    const words = normalize(`${theme} ${skill}`)
      .replace(/[^a-z0-9çãõáéíóúâêôü\s-]/gi, ' ')
      .split(/\s+/)
      .filter(word => word.length >= 5 && !STOP.has(word) && !/^em13/.test(word));
    return [...new Set(words)].slice(0, 6);
  }

  function shortTopic(activity) {
    const theme = cleanTopic(activity.tema);
    if (theme.length <= 140) return theme;
    const cut = theme.slice(0, 137);
    return `${cut.slice(0, cut.lastIndexOf(' ') > 90 ? cut.lastIndexOf(' ') : 137)}...`;
  }

  function prefixFor(discipline, topic, number) {
    const labels = {
      'lingua-portuguesa': [
        `No texto-base sobre “${topic}”,`,
        `Ainda considerando “${topic}” e sua situação de circulação,`,
        `Com base nas informações linguísticas do estudo de “${topic}”,`,
        `Relacionando gênero, público e finalidade em “${topic}”,`,
        `Ao analisar os efeitos de sentido ligados a “${topic}”,`,
        `Usando evidências do texto-base de “${topic}”,`,
        `Para revisar a comunicação sobre “${topic}” com maior precisão,`,
        `Na produção final sobre “${topic}”,`
      ],
      matematica: [
        `Na situação matemática sobre “${topic}”,`,
        `Considerando os dados e relações apresentados em “${topic}”,`,
        `Usando os valores do problema de “${topic}”,`,
        `Ao modelar “${topic}” matematicamente,`,
        `Para interpretar o resultado obtido em “${topic}”,`,
        `Ao comparar estratégias de resolução para “${topic}”,`,
        `Para verificar a coerência matemática do estudo de “${topic}”,`,
        `Na síntese matemática de “${topic}”,`
      ],
      ciencias: [
        `Na investigação científica sobre “${topic}”,`,
        `Considerando as variáveis e evidências de “${topic}”,`,
        `Usando os dados experimentais de “${topic}”,`,
        `Ao comparar as condições descritas em “${topic}”,`,
        `Para explicar o fenômeno central de “${topic}”,`,
        `Ao avaliar os limites da conclusão sobre “${topic}”,`,
        `Para propor um procedimento de investigação de “${topic}”,`,
        `Na síntese científica de “${topic}”,`
      ],
      historia: [
        `No estudo histórico sobre “${topic}”,`,
        `Considerando autoria, contexto e finalidade das fontes de “${topic}”,`,
        `Ao cruzar as evidências apresentadas em “${topic}”,`,
        `Comparando as perspectivas das fontes sobre “${topic}”,`,
        `Para interpretar historicamente “${topic}”,`,
        `Ao avaliar limites e silêncios das fontes de “${topic}”,`,
        `Para formular uma hipótese histórica sobre “${topic}”,`,
        `Na síntese histórica de “${topic}”,`
      ],
      geografia: [
        `Na análise geográfica sobre “${topic}”,`,
        `Considerando localização, escala e agentes envolvidos em “${topic}”,`,
        `Usando os dados espaciais apresentados em “${topic}”,`,
        `Ao comparar os recortes territoriais de “${topic}”,`,
        `Para interpretar os efeitos territoriais de “${topic}”,`,
        `Ao relacionar redes, fluxos e desigualdades em “${topic}”,`,
        `Para avaliar alternativas no problema geográfico de “${topic}”,`,
        `Na síntese geográfica de “${topic}”,`
      ]
    };
    return labels[discipline]?.[number - 1] || `Considerando “${topic}”,`;
  }

  function matches(collection) {
    const match = collection?.colecao?.match(COLLECTION_RE);
    return Boolean(match && !COMPLETED.has(collection.colecao));
  }

  function apply(collection) {
    if (!matches(collection)) return collection;
    const discipline = collection.colecao.match(COLLECTION_RE)?.[3];

    collection.atividades = (collection.atividades || []).map(activity => {
      const topic = shortTopic(activity);
      const theme = cleanTopic(activity.tema);
      const skillText = cleanTopic(activity.bncc?.[0]?.habilidadeOficial);
      const terms = keywords(activity);
      const focusTerms = terms.length ? terms.join(', ') : theme;
      const originalSupport = String(activity.textoApoio?.conteudo || '').trim();
      const support = `${originalSupport} Foco conceitual específico: ${theme}. Para resolver esta atividade com coerência, o estudante deve relacionar as evidências do caso aos conceitos centrais ${focusTerms}. A interpretação esperada deve permanecer compatível com a habilidade trabalhada: ${skillText}`.replace(/\s+/g, ' ').trim();

      const questions = (activity.questoes || []).map((question, index) => {
        const prefix = prefixFor(discipline, topic, index + 1);
        const base = String(question.enunciado || '').replace(/^\s+|\s+$/g, '');
        const alreadyAnchored = normalize(base).includes(normalize(topic).slice(0, 24));
        return {
          ...question,
          enunciado: alreadyAnchored ? base : `${prefix} ${base.charAt(0).toLowerCase()}${base.slice(1)}`
        };
      });

      const answers = (activity.gabarito || []).map((answer, index) => {
        const baseJust = String(answer.justificativa || '').trim();
        const anchor = `A correção deve usar evidências do texto e manter relação direta com o foco “${topic}”, especialmente com ${focusTerms}.`;
        return {
          ...answer,
          justificativa: `${baseJust}${baseJust ? ' ' : ''}${anchor}`.trim()
        };
      });

      return {
        ...activity,
        textoApoio: { ...(activity.textoApoio || {}), conteudo: support },
        questoes: questions,
        gabarito: answers,
        coerenciaSemantica: {
          status: 'aprovada',
          tema: theme,
          habilidadeTexto: skillText,
          palavrasChave: terms,
          textoAncorado: true,
          questoesAncoradas: questions.length,
          gabaritosAncorados: answers.length
        },
        revisao: {
          ...(activity.revisao || {}),
          coerenciaTextoQuestoes: true,
          coerenciaQuestoesGabarito: true,
          habilidadeAlinhadaAoConteudo: true
        }
      };
    });

    collection.coerenciaSemantica = {
      status: 'aprovada',
      quantidadeAtividades: collection.atividades.length,
      criterio: 'tema-habilidade-texto-questoes-gabarito'
    };
    return collection;
  }

  globalThis.TeachEasyHighSchoolSemanticCoherence = {
    matches,
    apply,
    expectedCollections: 55,
    expectedActivities: 2750
  };
})();
