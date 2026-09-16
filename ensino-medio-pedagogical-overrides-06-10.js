(() => {
  const current = globalThis.TeachEasyHighSchoolPedagogicalOverrides;
  const COLLECTION = 'em-1serie-1bimestre-lingua-portuguesa-v2';
  if (!current || current.collection !== COLLECTION) return;

  const q = (numero, tipo, enunciado, alternativas = [], espacoResposta = 'medio') => ({
    numero,
    tipo,
    enunciado,
    alternativas,
    espacoResposta,
    figuraId: null
  });
  const a = (numero, resposta, justificativa) => ({ numero, resposta, justificativa });

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
    descricao: 'Esta atividade foi planejada para funcionar integralmente com o material textual fornecido. Nenhuma questão depende de imagem.',
    objetivoPedagogico: 'Garantir que todas as respostas possam ser construídas apenas com os textos, dados e exemplos apresentados na própria atividade.',
    arquivo: null,
    status: 'nao-necessaria'
  };

  const overrides = {
    'em-1s-b1-lingua-portuguesa-06-debate-leitura-critica': {
      titulo: 'Escolhas expressivas: como as palavras mudam o efeito de uma mensagem',
      tema: 'Efeitos de sentido produzidos por escolha, combinação, contraste e ordenação de palavras.',
      objetivo: 'Comparar formulações sobre o mesmo fato e analisar como escolhas expressivas alteram tom e efeito de sentido, mobilizando a habilidade EM13LP06.',
      instrucaoGeral: 'Leia as duas versões do mesmo acontecimento e observe como a escolha e a ordem das palavras mudam a maneira de apresentar a cena.',
      textoApoio: {
        titulo: 'Duas formas de contar o mesmo fato',
        conteudo: 'VERSÃO A — NOTA INFORMATIVA\nDepois de três meses de obras, a quadra da escola foi reaberta na sexta-feira. Estudantes voltaram a usar o espaço no intervalo e nas aulas de Educação Física.\n\nVERSÃO B — TEXTO PARA A REDE SOCIAL DA ESCOLA\nSexta-feira, a quadra voltou a respirar. Depois de três meses de portões fechados e passos desviados, a escola recuperou um de seus lugares mais vivos. No primeiro intervalo, bolas, vozes e risadas ocuparam novamente o espaço.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual expressão da Versão B é mais claramente figurada?', [
          '“três meses de obras”.',
          '“a quadra voltou a respirar”.',
          '“na sexta-feira”.',
          '“no primeiro intervalo”.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: as duas versões informam a reabertura da quadra, mas produzem efeitos de sentido diferentes.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Explique o efeito produzido pela expressão “portões fechados e passos desviados”.', [], 'medio'),
        q(4, 'multipla-escolha', 'Na sequência “bolas, vozes e risadas”, a enumeração contribui principalmente para:', [
          'criar sensação de movimento e retomada da vida no espaço.',
          'apresentar datas e horários da reabertura.',
          'provar que todos os estudantes participaram.',
          'substituir a informação de que houve obras.'
        ], 'pequeno'),
        q(5, 'analise', 'Compare o tom da Versão A com o da Versão B. Cite uma escolha linguística de cada texto que sustente sua resposta.', [], 'grande'),
        q(6, 'completar', 'Complete com uma palavra do texto: na Versão B, a escola recuperou “um de seus lugares mais __________”.', [], 'pequeno'),
        q(7, 'aplicacao', 'Reescreva a frase “A quadra foi reaberta” de modo mais expressivo, sem alterar o fato informado.', [], 'medio'),
        q(8, 'producao', 'Produza duas frases sobre a reabertura: uma neutra, própria de comunicado oficial, e outra expressiva, própria de rede social.', [], 'grande')
      ],
      gabarito: [
        a(1, 'B) “a quadra voltou a respirar”.', 'A expressão atribui à quadra uma ação própria de seres vivos e produz efeito figurado.'),
        a(2, 'Verdadeiro.', 'O fato central é o mesmo, mas a Versão A é objetiva e a Versão B usa imagens, enumeração e maior carga afetiva.'),
        a(3, 'A expressão sugere um período de interrupção e mudança de rotina: os portões estavam fechados e as pessoas precisavam evitar o local.', 'A resposta deve relacionar a combinação de palavras à ideia de ausência de uso da quadra.'),
        a(4, 'A) criar sensação de movimento e retomada da vida no espaço.', 'A enumeração reúne elementos sonoros e visuais associados ao uso da quadra.'),
        a(5, 'A Versão A tem tom informativo e direto, com dados como “três meses de obras” e “foi reaberta”. A Versão B tem tom expressivo, com construções como “voltou a respirar” e a enumeração “bolas, vozes e risadas”.', 'Aceitar outras comparações sustentadas por elementos efetivamente presentes nos textos.'),
        a(6, 'vivos', 'A palavra aparece no segundo período da Versão B.'),
        a(7, 'Resposta possível: “Depois de meses em silêncio, a quadra abriu de novo seus portões para a turma.”', 'Aceitar outras reescritas que preservem o fato e introduzam recurso expressivo identificável.'),
        a(8, 'Resposta autoral. A primeira frase deve privilegiar objetividade; a segunda deve usar alguma escolha expressiva sem inventar fatos.', 'Corrigir a diferença de efeito de sentido entre as duas formulações e a fidelidade ao acontecimento.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Apresentar as duas versões lado a lado. Destacar em uma cor informações objetivas e em outra expressões figuradas, enumerações e palavras de maior carga afetiva.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-07-oficina-leitura-critica': {
      titulo: 'Modalizadores em debate: certeza, possibilidade e obrigação',
      tema: 'Marcas linguísticas que revelam a posição do enunciador e diferentes graus de certeza, obrigação e avaliação.',
      objetivo: 'Identificar modalizadores e estratégias de impessoalização e analisar como expressam posicionamento em um debate escolar, mobilizando a habilidade EM13LP07.',
      instrucaoGeral: 'Leia os três enunciados sobre uma proposta escolar e observe palavras que indicam certeza, possibilidade, obrigação e avaliação.',
      textoApoio: {
        titulo: 'Uso de celular no recreio: três modos de se posicionar',
        conteudo: 'ENUNCIADO 1 — “Certamente, liberar o celular em todo o recreio aumentará as distrações e reduzirá a convivência entre os estudantes.”\n\nENUNCIADO 2 — “Talvez seja possível permitir o uso em uma área específica, desde que se mantenham espaços livres de telas.”\n\nENUNCIADO 3 — “É necessário definir regras claras antes de qualquer mudança, e recomenda-se avaliar a medida depois de um período de teste.”'
      },
      questoes: [
        q(1, 'multipla-escolha', 'No Enunciado 1, a palavra “Certamente” expressa principalmente:', [
          'alto grau de certeza do enunciador.',
          'dúvida sobre a proposta.',
          'ordem dirigida aos estudantes.',
          'neutralidade completa.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: a palavra “Talvez” reduz o grau de certeza e apresenta a proposta como possibilidade.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'multipla-escolha', 'A expressão “É necessário” indica principalmente:', [
          'possibilidade.',
          'obrigação ou necessidade.',
          'lembrança do passado.',
          'ironia.'
        ], 'pequeno'),
        q(4, 'discursiva', 'Explique a diferença de posicionamento entre “Certamente” e “Talvez” nos Enunciados 1 e 2.', [], 'medio'),
        q(5, 'analise', 'No trecho “recomenda-se avaliar a medida”, quem faz a recomendação aparece explicitamente? Explique o efeito dessa forma impessoal.', [], 'medio'),
        q(6, 'associacao', 'Associe cada expressão ao efeito predominante: 1. Certamente; 2. Talvez; 3. É necessário. Alternativas: certeza; possibilidade; necessidade.', ['1 — certeza', '2 — possibilidade', '3 — necessidade'], 'pequeno'),
        q(7, 'aplicacao', 'Reescreva o Enunciado 2 com maior grau de certeza, mantendo a ideia de permitir o uso em uma área específica.', [], 'medio'),
        q(8, 'producao', 'Escreva um posicionamento de três linhas sobre o uso de celular no recreio usando pelo menos dois modalizadores diferentes. Depois, sublinhe-os.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) alto grau de certeza do enunciador.', '“Certamente” apresenta a afirmação como muito provável ou segura para quem fala.'),
        a(2, 'Verdadeiro.', '“Talvez” marca possibilidade e menor compromisso com a certeza da afirmação.'),
        a(3, 'B) obrigação ou necessidade.', 'A expressão apresenta a definição de regras como condição necessária.'),
        a(4, '“Certamente” mostra forte convicção; “Talvez” apresenta uma possibilidade e deixa espaço para incerteza ou negociação.', 'A comparação deve relacionar cada modalizador ao grau de compromisso do enunciador.'),
        a(5, 'Não. A construção “recomenda-se” apaga ou deixa indeterminado quem recomenda, produzindo um efeito mais impessoal e institucional.', 'A resposta deve reconhecer a estratégia de impessoalização.'),
        a(6, '1 — certeza; 2 — possibilidade; 3 — necessidade.', 'Cada expressão corresponde ao valor modal predominante indicado no material.'),
        a(7, 'Resposta possível: “É possível permitir o uso em uma área específica, desde que se mantenham espaços livres de telas.” ou “Certamente é possível...”, conforme a justificativa do estudante.', 'A reescrita deve aumentar o grau de certeza sem mudar o núcleo da proposta.'),
        a(8, 'Resposta autoral com ao menos dois modalizadores identificáveis e coerentes com a posição defendida.', 'Corrigir o uso dos modalizadores e a relação entre escolha linguística e posicionamento.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Oferecer um quadro de apoio com três colunas: CERTEZA, POSSIBILIDADE e NECESSIDADE, incluindo as expressões “certamente”, “talvez” e “é necessário”.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-08-analise-de-dados-leitura-critica': {
      titulo: 'Sintaxe em uso: ordem, causa, adição e efeito de destaque',
      tema: 'Ordem dos constituintes, coordenação, subordinação e efeitos sintáticos em um texto de circulação escolar.',
      objetivo: 'Analisar como mudanças de ordem e relações sintáticas de causa e adição contribuem para a clareza e para o destaque de informações, mobilizando a habilidade EM13LP08.',
      instrucaoGeral: 'Leia o pequeno texto e compare as construções destacadas. Observe a ordem das informações e as relações estabelecidas por conectivos.',
      textoApoio: {
        titulo: 'Feira de Ciências amplia horário de visitação',
        conteudo: 'A Feira de Ciências ficará aberta até as 20h porque muitas famílias só conseguem visitar a escola depois do trabalho. A equipe ampliou o horário e organizou uma escala de estudantes monitores.\n\nCompare também estas duas frases:\nFRASE A — “As famílias poderão visitar os projetos no período noturno.”\nFRASE B — “No período noturno, as famílias poderão visitar os projetos.”\nAs duas frases comunicam o mesmo fato básico, mas a Frase B coloca o período noturno em posição de destaque.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'No primeiro período, a oração iniciada por “porque” apresenta:', [
          'a causa da ampliação do horário.',
          'uma oposição à feira.',
          'uma condição impossível.',
          'uma comparação entre famílias.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: na frase “A equipe ampliou o horário e organizou uma escala”, a conjunção “e” coordena duas ações atribuídas ao mesmo sujeito.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Qual informação recebe maior destaque na Frase B por aparecer no início do período?', [], 'pequeno'),
        q(4, 'multipla-escolha', 'Se a expressão “No período noturno” voltar para o final da Frase B, o fato principal muda?', [
          'Não; muda principalmente o foco/destaque da informação.',
          'Sim; passa a significar que a feira foi cancelada.',
          'Sim; passa a indicar obrigação.',
          'Não; e também não ocorre nenhuma mudança de destaque.'
        ], 'pequeno'),
        q(5, 'analise', 'Explique como a relação de causa no primeiro período ajuda o leitor a entender a decisão de ampliar o horário.', [], 'medio'),
        q(6, 'completar', 'Complete com o conectivo do texto que liga duas ações da equipe: “A equipe ampliou o horário ___ organizou uma escala”.', [], 'pequeno'),
        q(7, 'aplicacao', 'Reescreva a Frase A colocando “no período noturno” no início. Depois, explique em uma frase o que recebeu destaque.', [], 'medio'),
        q(8, 'producao', 'Escreva um período sobre a Feira de Ciências contendo uma oração de causa introduzida por “porque” e duas ações coordenadas por “e”.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) a causa da ampliação do horário.', 'O texto informa que o horário foi estendido porque muitas famílias só podem visitar depois do trabalho.'),
        a(2, 'Verdadeiro.', '“Ampliou” e “organizou” são duas ações do sujeito “A equipe”, ligadas por coordenação aditiva.'),
        a(3, 'O período noturno.', 'A expressão temporal é deslocada para o início e ganha destaque informacional.'),
        a(4, 'A) Não; muda principalmente o foco/destaque da informação.', 'A alteração de ordem não muda o fato central, mas modifica a saliência do elemento temporal.'),
        a(5, 'A oração causal explica a razão da decisão: muitas famílias só conseguem visitar a escola depois do trabalho.', 'A resposta deve ligar a necessidade das famílias à ampliação do horário.'),
        a(6, 'e', 'O conectivo aparece ligando “ampliou” e “organizou”.'),
        a(7, '“No período noturno, as famílias poderão visitar os projetos.” O destaque recai sobre o momento da visita.', 'A reescrita deve preservar o sentido básico e identificar o efeito de posição inicial.'),
        a(8, 'Resposta possível: “A escola ampliou a visitação porque recebeu pedidos das famílias e organizou novos horários de monitoria.”', 'Aceitar outros períodos corretos que apresentem claramente relação de causa e coordenação aditiva.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Usar setas para ligar causa e consequência, circular o conectivo “e” e apresentar as Frases A e B em cartões separados para comparação da ordem.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-09-projeto-aplicado-leitura-critica': {
      titulo: 'Fontes confiáveis: selecionar dados para sustentar um texto',
      tema: 'Seleção, comparação e referência de informações provenientes de fontes com diferentes níveis de confiabilidade.',
      objetivo: 'Selecionar informações de fontes identificadas e pertinentes, distinguir dado de opinião e usar referência explícita na produção textual, mobilizando a habilidade EM13LP12.',
      instrucaoGeral: 'Analise as três fontes fictícias sobre bebedouros e consumo de água na escola. Avalie autoria, método, data e possibilidade de verificação antes de usar as informações.',
      textoApoio: {
        titulo: 'Três fontes sobre o uso dos bebedouros',
        conteudo: 'FONTE A — RELATÓRIO DA COMISSÃO DE SUSTENTABILIDADE DA ESCOLA, 12/08. Durante cinco dias letivos, a comissão contou o número de garrafas abastecidas em dois bebedouros entre 7h e 17h. Média registrada: 184 abastecimentos por dia.\n\nFONTE B — POSTAGEM ANÔNIMA EM REDE SOCIAL, sem data. “Todo mundo sabe que quase ninguém usa os bebedouros da escola.” A postagem não informa como chegou a essa conclusão.\n\nFONTE C — QUESTIONÁRIO DO GRÊMIO ESTUDANTIL, 14/08. Entre 120 estudantes que responderam voluntariamente, 78 afirmaram levar garrafa reutilizável pelo menos três dias por semana. O grêmio informa o número de participantes e reconhece que a pesquisa não representa necessariamente toda a escola.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual fonte apresenta um dado obtido por observação direta com período e procedimento descritos?', [
          'Fonte A.',
          'Fonte B.',
          'Fonte C apenas porque está em rede social.',
          'Nenhuma das fontes.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: a Fonte B apresenta autoria, data e método que permitem verificar sua afirmação.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Cite dois elementos que tornam a Fonte A mais verificável que a Fonte B.', [], 'medio'),
        q(4, 'multipla-escolha', 'Qual limitação da Fonte C é reconhecida no próprio texto?', [
          'O questionário não tem nenhuma resposta.',
          'Os participantes responderam voluntariamente e podem não representar toda a escola.',
          'O grêmio não informou quantos estudantes participaram.',
          'A pesquisa foi feita fora da escola e sem tema definido.'
        ], 'pequeno'),
        q(5, 'analise', 'Explique por que o número “78 de 120” pode ser útil em um texto, mas não deve ser apresentado como se descrevesse automaticamente todos os estudantes da escola.', [], 'grande'),
        q(6, 'associacao', 'Associe cada fonte ao uso mais adequado: A — dado de observação; B — opinião não verificada; C — resultado de questionário com limitação amostral.', ['A — dado de observação', 'B — opinião não verificada', 'C — questionário com limitação amostral'], 'pequeno'),
        q(7, 'aplicacao', 'Escreva uma frase que use corretamente o dado da Fonte A e mencione a origem da informação.', [], 'medio'),
        q(8, 'producao', 'Produza um parágrafo curto defendendo ou questionando a instalação de mais pontos de abastecimento. Use pelo menos uma informação das Fontes A ou C e indique de onde ela veio.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Fonte A.', 'Ela informa responsável, data, duração da observação, local e procedimento de contagem.'),
        a(2, 'Falso.', 'A postagem é anônima, não tem data nem descreve método ou evidência.'),
        a(3, 'Exemplos: a Fonte A identifica a comissão responsável, informa a data, descreve cinco dias de observação e explica o que foi contado; a Fonte B não apresenta esses elementos.', 'Aceitar dois critérios concretos de verificabilidade presentes no material.'),
        a(4, 'B) Os participantes responderam voluntariamente e podem não representar toda a escola.', 'A própria Fonte C explicita essa limitação.'),
        a(5, 'O dado descreve o grupo que respondeu ao questionário, não necessariamente toda a população escolar; por isso deve ser apresentado com referência ao número de respondentes e à forma de participação.', 'A resposta deve distinguir amostra observada de generalização para toda a escola.'),
        a(6, 'A — dado de observação; B — opinião não verificada; C — questionário com limitação amostral.', 'As classificações correspondem às características descritas em cada fonte.'),
        a(7, 'Resposta possível: “Segundo o relatório da Comissão de Sustentabilidade, de 12/08, os dois bebedouros registraram média de 184 abastecimentos por dia durante cinco dias letivos.”', 'A frase deve atribuir o dado à fonte e preservar os limites da informação.'),
        a(8, 'Resposta autoral com posição clara, dado corretamente atribuído a uma fonte identificada e sem extrapolar o que as informações permitem concluir.', 'Corrigir referência, fidelidade ao dado e relação entre evidência e conclusão.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Organizar as fontes em uma tabela com quatro perguntas: quem publicou? quando? como obteve a informação? há limitação declarada? Permitir resposta por marcação antes da escrita.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-10-sintese-autoral-leitura-critica': {
      titulo: 'Planejar, revisar e editar um aviso para a comunidade escolar',
      tema: 'Adequação de gênero, público, suporte, linguagem e revisão de texto antes da circulação.',
      objetivo: 'Planejar e revisar um aviso destinado às famílias, adequando conteúdo, organização, linguagem e aspectos notacionais ao suporte de circulação, mobilizando a habilidade EM13LP15.',
      instrucaoGeral: 'Leia a situação comunicativa, os dados que precisam aparecer no aviso e o rascunho inicial. Depois, avalie e melhore o texto antes da publicação.',
      textoApoio: {
        titulo: 'Aviso sobre a Mostra de Ciências',
        conteudo: 'SITUAÇÃO — A escola enviará pelo aplicativo oficial um aviso às famílias sobre a Mostra de Ciências. O texto precisa ser breve, claro e informativo.\n\nDADOS OBRIGATÓRIOS — Data: 27 de setembro. Horário: 18h30 às 20h30. Local: quadra coberta. Entrada gratuita. Os estudantes expositores devem chegar às 18h.\n\nRASCUNHO — “Oi gente!!! Vai ter a mostra dia 27 lá na escola. Vai ser muito legal, aparece lá. Quem vai apresentar tem que chegar antes porque sim. Entrada de graça!!!”'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Quem é o público principal do aviso que será publicado no aplicativo oficial?', [
          'As famílias dos estudantes.',
          'Apenas os professores de Ciências.',
          'Somente os estudantes expositores.',
          'Pessoas sem relação com a escola.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: o rascunho apresenta todos os dados obrigatórios com clareza suficiente para publicação.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Liste três informações obrigatórias que estão ausentes ou pouco claras no rascunho.', [], 'medio'),
        q(4, 'multipla-escolha', 'Qual abertura é mais adequada para um aviso oficial às famílias?', [
          '“Oi gente!!!”',
          '“Prezadas famílias,”',
          '“E aí, pessoal?”',
          '“Fala, galera!”'
        ], 'pequeno'),
        q(5, 'analise', 'Explique por que a frase “tem que chegar antes porque sim” é inadequada para o texto final.', [], 'medio'),
        q(6, 'revisao', 'Reescreva a informação destinada aos estudantes expositores, incluindo o horário exato e linguagem adequada ao aviso.', [], 'medio'),
        q(7, 'producao', 'Produza a versão final do aviso em até seis linhas, incluindo todos os dados obrigatórios e linguagem adequada às famílias.', [], 'grande'),
        q(8, 'revisao', 'Revise sua versão final e registre duas alterações feitas para melhorar clareza, pontuação, adequação ao público ou organização das informações.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) As famílias dos estudantes.', 'A situação comunicativa informa explicitamente que o aviso será enviado às famílias pelo aplicativo oficial.'),
        a(2, 'Falso.', 'Faltam ou estão pouco claros horário completo, local, horário de chegada dos expositores e finalidade de algumas informações.'),
        a(3, 'Exemplos: horário da Mostra (18h30 às 20h30), local (quadra coberta) e horário de chegada dos expositores (18h).', 'Aceitar três informações obrigatórias ausentes ou imprecisas no rascunho.'),
        a(4, 'B) “Prezadas famílias,”', 'A abertura é compatível com o público e com o caráter institucional do suporte.'),
        a(5, 'Porque é imprecisa, não informa o horário de chegada e usa uma justificativa sem conteúdo (“porque sim”), inadequada a um aviso informativo.', 'A resposta deve relacionar clareza, precisão e adequação comunicativa.'),
        a(6, 'Resposta possível: “Os estudantes expositores deverão chegar às 18h para organização dos trabalhos.”', 'Aceitar outras formulações claras, corretas e adequadas ao gênero.'),
        a(7, 'Resposta autoral. Deve incluir: 27 de setembro; 18h30 às 20h30; quadra coberta; entrada gratuita; expositores às 18h; além de tom claro e adequado às famílias.', 'Corrigir completude, organização, clareza, pontuação e adequação ao aplicativo oficial.'),
        a(8, 'Resposta pessoal, mas deve registrar duas mudanças concretas efetivamente relacionadas à revisão do texto.', 'Aceitar alterações de clareza, ortografia, pontuação, ordem das informações, concisão ou adequação ao público, desde que justificadas.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Disponibilizar uma checklist com os cinco dados obrigatórios e um modelo de estrutura: saudação, evento, data/horário, local, informação aos expositores e encerramento.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    }
  };

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

  const previousApply = current.apply.bind(current);
  const previousIds = Array.from(current.reviewedIds || []);

  globalThis.TeachEasyHighSchoolPedagogicalOverrides = {
    collection: COLLECTION,
    reviewedIds: [...previousIds, ...Object.keys(overrides)],
    apply(collection) {
      const base = previousApply(collection);
      if (!base || base.colecao !== COLLECTION || !Array.isArray(base.atividades)) return base;
      base.atividades = base.atividades.map(activity => {
        const patch = overrides[activity.id];
        return patch ? mergeActivity(activity, patch) : activity;
      });
      return base;
    }
  };
})();
