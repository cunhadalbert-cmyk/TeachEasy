(() => {
  'use strict';

  if (typeof window.normalizeCollectionActivity !== 'function') return;

  const baseNormalizeCollectionActivity = window.normalizeCollectionActivity;
  const clean = (value = '') => String(value || '').replace(/\s+/g, ' ').trim();
  const lowerFirst = (value = '') => {
    const text = clean(value);
    return text ? text.charAt(0).toLocaleLowerCase('pt-BR') + text.slice(1) : text;
  };

  function stageLevel(collection, config) {
    const stage = clean(config?.stage || collection?.etapa || '');
    const grade = clean(config?.grade || collection?.ano || '');
    const number = Number.parseInt(grade, 10) || 0;
    if (/Ensino Médio/i.test(stage)) return 'medio';
    if (/Fundamental II|Anos Finais/i.test(stage) || number >= 6) return 'finais';
    if (number <= 2) return 'iniciais-1-2';
    return 'iniciais-3-5';
  }

  function bnccData(activity) {
    const item = Array.isArray(activity?.bncc) ? activity.bncc[0] : null;
    const code = clean(item?.codigo || '');
    const description = clean(item?.descricaoResumida || '')
      .replace(new RegExp(`^Habilidade\\s+${code}:?\\s*`, 'i'), '')
      .replace(/^Habilidade\s+[A-Z0-9]+:?\s*/i, '');
    return { code, description };
  }

  function explanatoryText(activity, collection, config) {
    const topic = clean(activity?.tema || activity?.titulo || 'o espaço geográfico');
    const title = clean(activity?.titulo || topic);
    const { description } = bnccData(activity);
    const level = stageLevel(collection, config);
    const focus = description || clean(activity?.objetivo || `compreender ${lowerFirst(topic)}`);

    if (level === 'iniciais-1-2') {
      return {
        titulo: title,
        conteudo: `${title} ajuda a perceber como os lugares fazem parte da nossa vida. Em um mesmo lugar podemos observar pessoas, casas, ruas, plantas, meios de transporte, áreas de convivência e elementos da natureza. Esses elementos ocupam posições diferentes e podem ser descritos usando palavras como perto, longe, em frente, atrás, ao lado, dentro e fora. Os lugares também mudam quando as pessoas constroem, cuidam, utilizam ou transformam o espaço. Ao estudar ${lowerFirst(topic)}, é importante observar com atenção, comparar o que aparece no lugar e explicar como as pessoas e a natureza se relacionam. ${focus}`
      };
    }

    if (level === 'iniciais-3-5') {
      return {
        titulo: title,
        conteudo: `${title} permite compreender que o espaço geográfico é formado por elementos naturais e por transformações realizadas pelas pessoas. Paisagens, bairros, cidades, áreas rurais, rios, estradas, moradias e atividades de trabalho mostram diferentes formas de organização do espaço. Mapas, fotografias, trajetos, legendas e outros registros ajudam a localizar elementos, comparar lugares e perceber mudanças ao longo do tempo. No estudo de ${lowerFirst(topic)}, também é importante relacionar as ações humanas aos efeitos sobre a paisagem, a circulação, o uso dos recursos naturais e a qualidade de vida. A leitura deve considerar informações do próprio texto e estabelecer relações entre lugar, sociedade e natureza. ${focus}`
      };
    }

    if (level === 'finais') {
      return {
        titulo: title,
        conteudo: `${title} deve ser analisado como parte da produção e da organização do espaço geográfico. Para compreender ${lowerFirst(topic)}, é necessário observar paisagens, territórios, redes, fluxos, atividades econômicas, dinâmicas populacionais e relações sociedade-natureza em diferentes escalas. Mapas, gráficos, tabelas, imagens e relatos podem funcionar como evidências para comparar lugares, identificar agentes envolvidos e explicar causas e consequências de mudanças espaciais. Uma análise geográfica consistente distingue informações observáveis de interpretações, considera desigualdades e reconhece que diferentes grupos usam, disputam e transformam o território de maneiras distintas. ${focus}`
      };
    }

    return {
      titulo: title,
      conteudo: `${title} envolve processos socioespaciais que precisam ser analisados em diferentes escalas e temporalidades. O estudo de ${lowerFirst(topic)} exige relacionar território, redes, fluxos, população, economia, ambiente, políticas públicas e relações de poder, identificando os agentes que produzem e transformam o espaço. Mapas temáticos, séries estatísticas, imagens de satélite, documentos e diferentes narrativas devem ser confrontados para sustentar interpretações e reconhecer limites das fontes. A análise geográfica também precisa explicar causas, consequências, conflitos, desigualdades e possibilidades de intervenção, evitando conclusões baseadas apenas em opinião. ${focus}`
    };
  }

  function questionsFor(activity, collection, config) {
    const topic = clean(activity?.tema || activity?.titulo || 'o tema estudado');
    const level = stageLevel(collection, config);

    if (level === 'iniciais-1-2') {
      return [
        ['compreensao', 'Segundo o texto, que tipos de elementos podemos observar em um lugar?', 'medio'],
        ['localizacao', 'Quais palavras do texto podem ser usadas para indicar a posição de um elemento no espaço?', 'medio'],
        ['relacao', 'De acordo com o texto, de que maneiras as pessoas podem mudar um lugar?', 'medio'],
        ['comparacao', `Explique com suas palavras o que devemos observar ao estudar ${lowerFirst(topic)}.`, 'medio'],
        ['aplicacao', 'Pense no lugar onde você mora ou estuda. Cite um elemento natural e um elemento construído pelas pessoas.', 'medio'],
        ['observacao', 'Escolha um lugar conhecido e diga uma característica que pode ser observada nele.', 'medio'],
        ['mudanca', 'Dê um exemplo de uma mudança que as pessoas podem realizar em um lugar.', 'medio'],
        ['sintese', 'Escreva uma frase explicando o que o texto ensina sobre os lugares.', 'grande']
      ];
    }

    if (level === 'iniciais-3-5') {
      return [
        ['ideia-principal', `Qual é a ideia principal do texto sobre ${lowerFirst(topic)}?`, 'medio'],
        ['evidencia', 'Cite dois exemplos apresentados no texto de elementos que ajudam a compreender a organização do espaço.', 'medio'],
        ['representacao', 'Segundo o texto, para que mapas, fotografias, trajetos e legendas podem ser usados?', 'medio'],
        ['relacao', 'Explique a relação apresentada no texto entre ações humanas e transformação da paisagem.', 'medio'],
        ['circulacao', 'Como a circulação de pessoas ou mercadorias pode modificar a organização de um lugar?', 'medio'],
        ['comparacao', 'Compare dois tipos de lugar citados no texto e indique uma diferença possível entre eles.', 'medio'],
        ['aplicacao', 'Use uma informação do texto para explicar uma mudança que pode ocorrer em um bairro, cidade ou área rural.', 'grande'],
        ['sintese', 'Faça uma conclusão usando pelo menos duas informações do texto e relacionando sociedade e natureza.', 'grande']
      ];
    }

    if (level === 'finais') {
      return [
        ['ideia-principal', `Explique a ideia central do texto sobre ${lowerFirst(topic)}.`, 'medio'],
        ['conceitos', 'Quais conceitos ou dimensões geográficas o texto indica que devem ser observados na análise do espaço?', 'medio'],
        ['fontes', 'Que tipos de fontes o texto apresenta como evidências para comparar lugares e interpretar processos?', 'medio'],
        ['causa-consequencia', 'De acordo com o texto, por que uma análise geográfica deve identificar agentes, causas e consequências?', 'medio'],
        ['escala', 'Por que analisar um fenômeno em diferentes escalas pode ampliar sua compreensão?', 'medio'],
        ['agentes', 'Cite um agente que pode transformar o território e explique uma forma de atuação.', 'medio'],
        ['analise', 'Escolha uma afirmação do texto sobre desigualdade, território ou relação sociedade-natureza e explique seu significado.', 'grande'],
        ['sintese', `Produza uma conclusão sobre ${lowerFirst(topic)} usando pelo menos duas informações retiradas do texto.`, 'grande']
      ];
    }

    return [
      ['tese', `Qual é a tese principal apresentada no texto sobre ${lowerFirst(topic)}?`, 'medio'],
      ['conceitos', 'Quais dimensões socioespaciais o texto afirma que precisam ser relacionadas para compreender o tema?', 'medio'],
      ['fontes', 'Por que o texto recomenda confrontar mapas, dados, imagens e narrativas diferentes?', 'medio'],
      ['processos', 'Explique como agentes, relações de poder, causas e consequências aparecem na análise geográfica proposta pelo texto.', 'grande'],
      ['escalas', 'Como a mudança de escala de análise pode alterar a interpretação de um processo socioespacial?', 'medio'],
      ['evidencias', 'Que cuidado deve ser tomado ao usar dados e documentos como evidências de uma análise geográfica?', 'medio'],
      ['argumentacao', 'Selecione duas informações do texto e use-as para sustentar uma interpretação geográfica do tema.', 'grande'],
      ['sintese', `Elabore uma conclusão argumentativa sobre ${lowerFirst(topic)}, distinguindo evidência, interpretação e possibilidade de intervenção.`, 'grande']
    ];
  }

  function answerKeyFor(activity, collection, config) {
    const topic = clean(activity?.tema || activity?.titulo || 'o tema estudado');
    const { code } = bnccData(activity);
    const level = stageLevel(collection, config);
    const skill = code ? `, em coerência com ${code}` : '';

    if (level === 'iniciais-1-2') {
      return [
        `Identificar no texto elementos como pessoas, casas, ruas, plantas, transportes, espaços de convivência e natureza${skill}.`,
        'Reconhecer referências espaciais citadas no texto, como perto, longe, em frente, atrás, ao lado, dentro e fora.',
        'Indicar que as pessoas podem construir, cuidar, usar ou transformar os espaços.',
        `Explicar ${lowerFirst(topic)} com base na observação dos elementos do lugar e na relação entre pessoas e natureza.`,
        'Apresentar um exemplo coerente de elemento natural e outro produzido ou construído pelas pessoas.',
        'Apresentar uma característica observável e coerente do lugar escolhido.',
        'Dar um exemplo coerente de transformação humana em um lugar.',
        'Produzir frase coerente mostrando que os lugares possuem diferentes elementos e podem ser transformados.'
      ];
    }

    if (level === 'iniciais-3-5') {
      return [
        `Explicar que ${lowerFirst(topic)} ajuda a compreender a organização do espaço e as relações entre elementos naturais e ações humanas${skill}.`,
        'Citar dois elementos coerentes com o texto, como paisagens, bairros, cidades, áreas rurais, rios, estradas, moradias ou atividades de trabalho.',
        'Explicar que esses registros ajudam a localizar, comparar lugares e perceber mudanças no espaço.',
        'Relacionar ações humanas a transformações na paisagem, circulação, uso dos recursos naturais ou qualidade de vida.',
        'Explicar que fluxos de pessoas ou mercadorias podem alterar transportes, serviços, vias, comércio ou outras formas de organização espacial.',
        'Apresentar comparação coerente entre dois lugares citados, indicando uma diferença observável ou funcional.',
        'Aplicar uma informação do texto a uma situação espacial concreta de forma coerente.',
        'Construir conclusão apoiada em pelo menos duas informações do texto e relacionar sociedade e natureza.'
      ];
    }

    if (level === 'finais') {
      return [
        `Apresentar a ideia de que ${lowerFirst(topic)} integra a produção e a organização do espaço geográfico${skill}.`,
        'Mencionar conceitos ou dimensões presentes no texto, como paisagem, território, redes, fluxos, economia, população ou relações sociedade-natureza.',
        'Identificar mapas, gráficos, tabelas, imagens e relatos como possíveis evidências de análise.',
        'Explicar que agentes, causas e consequências permitem compreender como e por que os processos espaciais ocorrem.',
        'Explicar que diferentes escalas revelam relações locais, regionais, nacionais ou globais que podem não aparecer em uma única escala.',
        'Identificar um agente coerente, como Estado, empresas, população ou movimentos sociais, e explicar uma forma de transformação do território.',
        'Interpretar corretamente uma afirmação do texto sobre desigualdade, território ou relações sociedade-natureza.',
        'Produzir síntese apoiada em duas informações explícitas do texto e articulada ao tema.'
      ];
    }

    return [
      `Explicar que ${lowerFirst(topic)} deve ser analisado como processo socioespacial, considerando escalas, temporalidades e múltiplos agentes${skill}.`,
      'Relacionar dimensões como território, redes, fluxos, população, economia, ambiente, políticas públicas e relações de poder.',
      'Explicar que o confronto entre fontes permite verificar evidências, reconhecer perspectivas e evitar conclusões frágeis.',
      'Mostrar como agentes e relações de poder participam da produção do espaço e como causas e consequências estruturam a explicação do processo.',
      'Explicar que diferentes escalas destacam relações, agentes e efeitos distintos de um mesmo processo.',
      'Indicar a necessidade de verificar origem, contexto, período, metodologia e limites das fontes utilizadas.',
      'Selecionar duas informações efetivamente presentes no texto e utilizá-las como evidências para uma interpretação coerente.',
      'Elaborar conclusão argumentativa que diferencie evidência e interpretação e apresente possibilidade de intervenção ou investigação.'
    ];
  }

  function enhanceGeography(activity, collection, config) {
    if (clean(collection?.disciplina) !== 'Geografia') return activity;

    const text = explanatoryText(activity, collection, config);
    const questions = questionsFor(activity, collection, config).map(([tipo, enunciado, espacoResposta], index) => ({
      numero: index + 1,
      tipo,
      enunciado,
      alternativas: [],
      espacoResposta,
      figuraId: null
    }));
    const answers = answerKeyFor(activity, collection, config).map((resposta, index) => ({
      numero: index + 1,
      resposta,
      justificativa: `Resposta construída a partir do texto explicativo da própria atividade e da habilidade ${bnccData(activity).code || 'BNCC'} em foco.`
    }));

    return {
      ...activity,
      instrucaoGeral: 'Leia o texto explicativo com atenção. Depois responda às questões usando informações do próprio texto e seus conhecimentos de Geografia.',
      textoApoio: text,
      questoes: questions,
      gabarito: answers,
      quantidadeQuestoes: 8
    };
  }

  window.normalizeCollectionActivity = function geographyReadingNormalize(activity, collection, config) {
    return baseNormalizeCollectionActivity(enhanceGeography(activity, collection, config), collection, config);
  };
})();
