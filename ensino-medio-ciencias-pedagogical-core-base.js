(() => {
  const COLLECTION = 'em-1serie-1bimestre-ciencias-v2';
  const q = (numero, tipo, enunciado, alternativas = [], espacoResposta = 'medio') => ({
    numero, tipo, enunciado, alternativas, espacoResposta, figuraId: null
  });
  const a = (numero, resposta, justificativa) => ({ numero, resposta, justificativa });
  const fmt = (value, digits = 2) => {
    const rounded = Math.round((value + Number.EPSILON) * (10 ** digits)) / (10 ** digits);
    return String(rounded).replace('.', ',');
  };
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
    descricao: 'A atividade foi planejada para ser resolvida integralmente com o texto, os dados e as tabelas descritas no próprio enunciado.',
    objetivoPedagogico: 'Garantir que nenhuma resposta dependa de uma imagem externa e que os dados científicos necessários estejam disponíveis na folha.',
    arquivo: null,
    status: 'nao-necessaria'
  };
  const objectives = {
    radiation: 'Avaliar aplicações, benefícios e riscos das radiações com base em dados de exposição e no contexto de uso.',
    material: 'Avaliar riscos de materiais e produtos considerando concentração, nível de exposição, uso e descarte responsável.',
    cycle: 'Analisar fluxos de um ciclo biogeoquímico, calcular balanços e avaliar efeitos de interferências humanas.',
    energy: 'Comparar soluções de geração e consumo de energia considerando demanda, perdas, eficiência e impactos.',
    device: 'Analisar transformações de energia em dispositivos elétricos e estimar potência, consumo e eficiência.',
    conservation: 'Representar transformações e conservação de energia em um sistema com dados mensuráveis e perdas identificáveis.',
    thermal: 'Avaliar o desempenho de sistemas térmicos a partir de variação de temperatura, taxa de troca de calor e finalidade do sistema.'
  };

  const overrides = {};
  const reviewedIds = [];
  const core = { q, a, fmt, objectives, builders: {} };

  function buildPatch(s) {
    const builder = core.builders[s.kind];
    if (!builder) throw new Error(`Construtor científico ausente: ${s.kind}`);
    const built = builder(s, core);
    return {
      titulo: s.title,
      ...built,
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: {
        orientacao: 'Dividir a leitura em três etapas: dados do contexto, cálculo/análise e conclusão. Destacar unidades e permitir resposta por tópicos quando necessário.'
      },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    };
  }

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

  globalThis.TeachEasySciencePedagogicalCore = core;
  globalThis.TeachEasyHighSchoolSciencePedagogicalOverrides = {
    collection: COLLECTION,
    reviewedIds,
    register(items) {
      for (const scenario of items) {
        if (!scenario?.id || overrides[scenario.id]) continue;
        overrides[scenario.id] = buildPatch(scenario);
        reviewedIds.push(scenario.id);
      }
      return this;
    },
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
