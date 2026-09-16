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
    'em-1s-b1-lingua-portuguesa-11-mapa-conceitual-literatura': {
      titulo: 'Um mesmo conto em diferentes contextos de circulação',
      tema: 'Relação entre texto literário, contexto de produção, público, suporte e finalidade de circulação.',
      objetivo: 'Relacionar escolhas de apresentação de um texto literário às condições de produção e circulação, mobilizando a habilidade EM13LP01.',
      instrucaoGeral: 'Leia o microconto e duas formas de apresentá-lo ao público. Observe como suporte, finalidade e audiência alteram o modo de introduzir a mesma obra.',
      textoApoio: {
        titulo: 'O banco da praça em dois suportes',
        conteudo: 'MICROCONTO — “O BANCO”\nToda tarde, Davi passava pela praça e encontrava o mesmo banco vazio. Na sexta-feira, havia sobre ele um livro fechado e um bilhete: “Para quem ainda acredita que uma história pode mudar o caminho de volta para casa.” Davi levou o livro. Na segunda-feira, devolveu-o ao banco com outro bilhete.\n\nAPRESENTAÇÃO A — CATÁLOGO DA BIBLIOTECA ESCOLAR\n“O Banco” integra a mostra de microcontos produzidos por estudantes da 1ª série. O texto explora leitura, encontro e circulação de histórias no espaço urbano. Disponível na seção Produção Estudantil durante o mês de abril.\n\nAPRESENTAÇÃO B — POSTAGEM PARA A REDE SOCIAL DO SARAU\nE se um livro estivesse esperando por você no caminho de casa? Conheça “O Banco”, microconto criado por estudantes da 1ª série, e descubra como um gesto simples pode fazer uma história continuar. Leitura no sarau desta sexta-feira.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual diferença entre as apresentações A e B está mais diretamente ligada ao suporte de circulação?', [
          'A apresentação A organiza informações de consulta; a B usa pergunta e convite para mobilizar o público.',
          'A apresentação A altera o final do microconto; a B elimina o personagem Davi.',
          'A apresentação A é ficcional; a B é um texto científico.',
          'As duas apresentações têm exatamente a mesma finalidade e linguagem.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: o microconto permanece o mesmo, mas sua apresentação muda conforme público, finalidade e meio de circulação.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Indique a finalidade principal da Apresentação A e cite uma informação do texto que sustente sua resposta.', [], 'medio'),
        q(4, 'multipla-escolha', 'Na Apresentação B, a pergunta “E se um livro estivesse esperando por você no caminho de casa?” serve principalmente para:', [
          'aproximar o público e despertar curiosidade para o sarau.',
          'informar a classificação etária do texto.',
          'substituir o título do microconto.',
          'provar que o episódio narrado aconteceu de verdade.'
        ], 'pequeno'),
        q(5, 'analise', 'Compare o papel social de quem publica a Apresentação A com o de quem publica a Apresentação B. Como isso interfere na linguagem usada?', [], 'grande'),
        q(6, 'associacao', 'Associe cada elemento ao suporte predominante: 1. “Disponível na seção Produção Estudantil”; 2. pergunta direta ao leitor; 3. data do sarau. Alternativas: catálogo; rede social; rede social.', ['1 — catálogo', '2 — rede social', '3 — rede social'], 'pequeno'),
        q(7, 'aplicacao', 'Escreva uma apresentação de duas linhas para “O Banco” destinada a um jornal escolar impresso. Preserve o tema do microconto e adapte a linguagem ao novo suporte.', [], 'medio'),
        q(8, 'producao', 'Explique, em um parágrafo curto, por que conhecer as condições de produção e circulação ajuda o leitor a interpretar não só o microconto, mas também os textos que o apresentam.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) A apresentação A organiza informações de consulta; a B usa pergunta e convite para mobilizar o público.', 'A diferença decorre da função de catálogo da primeira e do caráter de divulgação da segunda.'),
        a(2, 'Verdadeiro.', 'O texto literário não muda; mudam as escolhas de apresentação conforme suporte e finalidade.'),
        a(3, 'A Apresentação A tem finalidade informativa e de catalogação. Evidências possíveis: identifica a mostra, a seção e o período de disponibilidade.', 'A resposta deve relacionar uma finalidade concreta a uma marca textual da apresentação.'),
        a(4, 'A) aproximar o público e despertar curiosidade para o sarau.', 'A pergunta interpela diretamente o leitor e introduz o convite para conhecer o microconto.'),
        a(5, 'Na Apresentação A, a biblioteca atua como instituição que organiza e informa o acervo; por isso a linguagem é objetiva. Na B, a organização do sarau busca engajamento e presença do público; por isso usa pergunta, convite e tom mais próximo.', 'Aceitar formulações equivalentes que relacionem enunciador, finalidade e escolhas linguísticas.'),
        a(6, '1 — catálogo; 2 — rede social; 3 — rede social.', 'Os três elementos correspondem às funções descritas nos textos de apresentação.'),
        a(7, 'Resposta possível: “Produzido por estudantes da 1ª série, o microconto ‘O Banco’ transforma um encontro inesperado com um livro em reflexão sobre leitura e partilha. O texto será apresentado no sarau da escola.”', 'A resposta deve preservar informações do material e adequar-se ao tom de jornal escolar.'),
        a(8, 'Resposta autoral. Deve explicar que público, finalidade, autoria, época e suporte orientam escolhas de linguagem e, portanto, influenciam a construção de sentidos.', 'Corrigir a relação entre condições de circulação e interpretação, com referência ao material lido.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Apresentar o microconto e as duas apresentações em blocos separados. Destacar com etiquetas: QUEM PUBLICA, PARA QUEM, ONDE CIRCULA e PARA QUÊ.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-12-estudo-de-caso-literatura': {
      titulo: 'Coesão em narrativa: como o texto faz a história avançar',
      tema: 'Progressão temática, retomadas, conectivos e relações lógico-discursivas em narrativa literária.',
      objetivo: 'Analisar como recursos coesivos conectam ações, retomam personagens e organizam a progressão de uma narrativa, mobilizando a habilidade EM13LP02.',
      instrucaoGeral: 'Leia o trecho narrativo e observe como pronomes, expressões de retomada e conectivos ligam as informações e fazem a narrativa avançar.',
      textoApoio: {
        titulo: 'A chave da sala 7',
        conteudo: 'Quando o último sinal tocou, Clara percebeu uma pequena chave perto da porta da biblioteca. Ela a guardou no bolso porque o corredor já estava vazio. No dia seguinte, mostrou o objeto ao bibliotecário, mas ele disse que a chave não pertencia à biblioteca.\n\nPor isso, Clara decidiu perguntar na secretaria. Lá, descobriu que a chave abria a antiga sala 7, fechada havia meses para organização do arquivo. A estudante poderia simplesmente devolvê-la; no entanto, quis saber como ela tinha chegado ao corredor. Essa curiosidade deu início a uma investigação entre os colegas.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'No primeiro parágrafo, o pronome “Ela” retoma:', [
          'Clara.',
          'a biblioteca.',
          'a porta.',
          'a chave.'
        ], 'pequeno'),
        q(2, 'completar', 'Complete com o conectivo do texto que apresenta uma consequência: “__________, Clara decidiu perguntar na secretaria.”', [], 'pequeno'),
        q(3, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: a expressão “o objeto” retoma “uma pequena chave” e evita repetição desnecessária.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(4, 'multipla-escolha', 'A expressão “no entanto” estabelece entre as ideias uma relação de:', [
          'oposição ou contraste.',
          'causa.',
          'explicação de lugar.',
          'enumeração.'
        ], 'pequeno'),
        q(5, 'analise', 'Explique como a sequência “por isso” e “no entanto” ajuda a organizar as decisões de Clara ao longo do trecho.', [], 'medio'),
        q(6, 'associacao', 'Associe os termos às suas funções: 1. Ela; 2. o objeto; 3. Por isso; 4. no entanto. Alternativas: retoma Clara; retoma a chave; consequência; contraste.', ['1 — retoma Clara', '2 — retoma a chave', '3 — consequência', '4 — contraste'], 'pequeno'),
        q(7, 'aplicacao', 'Reescreva a frase “Clara encontrou a chave. Clara guardou a chave.” usando recursos de coesão para evitar as repetições.', [], 'medio'),
        q(8, 'producao', 'Escreva três ou quatro linhas dando continuidade à narrativa. Use pelo menos uma expressão de retomada e um conectivo que indique causa, consequência ou oposição.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Clara.', 'O pronome inicia a frase seguinte retomando a personagem mencionada imediatamente antes.'),
        a(2, 'Por isso', 'A expressão introduz a decisão tomada como consequência do fato de a chave não pertencer à biblioteca.'),
        a(3, 'Verdadeiro.', '“O objeto” funciona como expressão nominal que retoma a chave já mencionada.'),
        a(4, 'A) oposição ou contraste.', 'A estudante poderia devolver a chave, mas tomou uma decisão diferente: investigar.'),
        a(5, '“Por isso” liga a informação anterior à decisão de procurar a secretaria; “no entanto” contrapõe a opção de apenas devolver a chave à escolha de investigar sua origem.', 'A resposta deve explicar as duas relações lógico-discursivas com base nas ações narradas.'),
        a(6, '1 — retoma Clara; 2 — retoma a chave; 3 — consequência; 4 — contraste.', 'Cada item corresponde à função coesiva que exerce no trecho.'),
        a(7, 'Resposta possível: “Clara encontrou a chave e a guardou.”', 'Aceitar outras reescritas corretas que eliminem a repetição e mantenham o sentido.'),
        a(8, 'Resposta autoral com continuidade coerente, ao menos uma retomada e um conectivo empregado com relação lógica identificável.', 'Corrigir continuidade temática, coesão e uso adequado do conectivo.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Sublinhar as palavras retomadas e ligar com setas “Ela”, “o objeto” e “a estudante” aos referentes. Marcar conectivos em outra cor e nomear a relação que expressam.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-13-investigacao-literatura': {
      titulo: 'Intertextualidade: quando um conto conhecido ganha outra voz',
      tema: 'Relações dialógicas, paródia, retomada e mudança de perspectiva entre textos literários.',
      objetivo: 'Comparar um conto tradicional e uma recriação contemporânea para identificar intertextualidade, mudança de perspectiva e efeitos de sentido, mobilizando a habilidade EM13LP03.',
      instrucaoGeral: 'Leia o resumo do conto tradicional e a recriação escrita para esta atividade. Observe o que foi mantido, transformado e questionado na nova versão.',
      textoApoio: {
        titulo: 'Chapeuzinho em duas perspectivas',
        conteudo: 'TEXTO A — CONTO TRADICIONAL, EM RESUMO\nUma menina atravessa a floresta para levar alimentos à avó. No caminho, encontra um lobo que descobre seu destino e chega primeiro à casa. O perigo nasce do encontro entre a menina e o lobo e da confiança que ela deposita no desconhecido.\n\nTEXTO B — “RELATÓRIO DO LOBO”, RECRIAÇÃO\nDizem que eu estava escondido entre as árvores esperando uma menina distraída. Ninguém registra, porém, que eu tentava avisar sobre a ponte quebrada perto da casa da avó. Quando corri por um atalho, viram pressa e imaginaram ameaça. Cheguei primeiro, bati à porta e encontrei a senhora em segurança. Minutos depois, já havia uma história pronta sobre mim — e nenhum espaço para a minha versão.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual elemento do Texto A é claramente retomado no Texto B?', [
          'O encontro na floresta e o deslocamento até a casa da avó.',
          'Uma viagem de navio para outra cidade.',
          'Uma disputa esportiva entre estudantes.',
          'A construção de uma biblioteca na floresta.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: o Texto B muda a perspectiva porque o lobo passa a narrar e contestar a versão tradicional.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Cite uma informação do Texto B que modifica a imagem tradicional do lobo apresentada no resumo do Texto A.', [], 'medio'),
        q(4, 'multipla-escolha', 'O trecho “já havia uma história pronta sobre mim” sugere principalmente:', [
          'crítica a um julgamento feito sem ouvir outra perspectiva.',
          'confirmação de que o lobo escreveu o conto tradicional.',
          'explicação de que a avó não existia.',
          'mudança do cenário da floresta para uma cidade.'
        ], 'pequeno'),
        q(5, 'analise', 'Explique como a recriação depende do conhecimento do conto tradicional para produzir seu efeito de sentido.', [], 'grande'),
        q(6, 'associacao', 'Associe: 1. Texto A; 2. Texto B; 3. relação entre A e B. Alternativas: versão tradicional resumida; recriação com mudança de narrador; intertextualidade.', ['1 — versão tradicional resumida', '2 — recriação com mudança de narrador', '3 — intertextualidade'], 'pequeno'),
        q(7, 'aplicacao', 'Reescreva uma frase do resumo do Texto A pelo ponto de vista da avó, mantendo o acontecimento básico e mudando a perspectiva.', [], 'medio'),
        q(8, 'producao', 'Escreva um parágrafo explicando se a nova voz do Texto B apenas repete, questiona ou transforma a narrativa tradicional. Use duas evidências do material.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) O encontro na floresta e o deslocamento até a casa da avó.', 'Esses elementos do enredo tradicional são retomados explicitamente pela recriação.'),
        a(2, 'Verdadeiro.', 'A primeira pessoa dá ao lobo uma voz que contesta a interpretação tradicional de suas ações.'),
        a(3, 'Exemplo: o lobo afirma que tentava avisar sobre uma ponte quebrada e que encontrou a avó em segurança.', 'Aceitar qualquer informação explícita que altere a representação do lobo como ameaça.'),
        a(4, 'A) crítica a um julgamento feito sem ouvir outra perspectiva.', 'A frase enfatiza que uma versão sobre o lobo se consolidou antes de ele poder apresentar seu relato.'),
        a(5, 'O efeito depende da comparação com a narrativa conhecida: o leitor reconhece personagens e percurso, mas percebe que a nova voz reinterpretou ações antes tomadas como ameaça.', 'A resposta deve mostrar que a intertextualidade nasce do diálogo entre o conhecido e a transformação proposta.'),
        a(6, '1 — versão tradicional resumida; 2 — recriação com mudança de narrador; 3 — intertextualidade.', 'A classificação sintetiza o papel de cada texto e da relação entre eles.'),
        a(7, 'Resposta possível: “Quando ouvi passos se aproximando da casa, imaginei que minha neta estivesse chegando com a cesta.”', 'Aceitar outras frases que preservem um fato do resumo e adotem coerentemente o ponto de vista da avó.'),
        a(8, 'Resposta autoral. Espera-se reconhecer transformação e questionamento da versão tradicional, sustentados por duas evidências como mudança de narrador, ponte quebrada, avó em segurança ou ausência de espaço para a versão do lobo.', 'Corrigir a interpretação e o uso de evidências textuais pertinentes.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Usar uma tabela “MANTEVE / MUDOU / EFEITO”. Preencher primeiro personagens e espaço, depois narrador, intenção atribuída ao lobo e efeito da mudança de perspectiva.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-14-situacao-problema-literatura': {
      titulo: 'Citação e paráfrase para sustentar uma interpretação literária',
      tema: 'Uso marcado de citação e paráfrase para explicar e sustentar uma leitura de texto literário.',
      objetivo: 'Distinguir citação, paráfrase e comentário interpretativo e empregá-los para sustentar uma análise literária, mobilizando a habilidade EM13LP04.',
      instrucaoGeral: 'Leia o poema criado para esta atividade e dois comentários de estudantes. Observe como cada comentário incorpora palavras ou ideias do poema para sustentar a interpretação.',
      textoApoio: {
        titulo: 'Poema e comentários de leitura',
        conteudo: 'POEMA — “JANELA ACESA”\nNo prédio inteiro, uma janela acesa\nresiste ao fim da tarde.\nLá dentro, alguém vira uma página;\nlá fora, a rua corre depressa.\nA luz não pede que ninguém pare,\nmas guarda um minuto de silêncio\nno meio da cidade.\n\nCOMENTÁRIO 1\nO poema contrapõe a pressa da cidade a um momento de leitura. Isso aparece diretamente no verso “lá fora, a rua corre depressa”, colocado ao lado da imagem de alguém que vira uma página.\n\nCOMENTÁRIO 2\nO texto sugere que a leitura cria uma pequena pausa em meio à rotina urbana. Em outras palavras, a janela iluminada representa um espaço de atenção e silêncio, mesmo quando a cidade continua em movimento.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'No Comentário 1, qual recurso é usado para sustentar a interpretação?', [
          'Citação direta de um verso do poema.',
          'Informação biográfica sobre o autor.',
          'Dado estatístico sobre leitura.',
          'Resumo de outro poema.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: o Comentário 2 retoma uma ideia do poema com outras palavras, funcionando como paráfrase interpretativa.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Explique por que as aspas em “lá fora, a rua corre depressa” são importantes no Comentário 1.', [], 'medio'),
        q(4, 'multipla-escolha', 'Qual frase apresenta melhor uma paráfrase do verso “A luz não pede que ninguém pare”?', [
          'A luz não obriga as pessoas a interromperem o que estão fazendo.',
          '“A luz não pede que ninguém pare”.',
          'A cidade inteira ficou parada por causa da luz.',
          'O poema afirma que a janela foi apagada.'
        ], 'pequeno'),
        q(5, 'analise', 'Compare os Comentários 1 e 2: qual deles usa citação direta e qual usa predominantemente paráfrase? Explique como ambos sustentam uma interpretação semelhante.', [], 'grande'),
        q(6, 'revisao', 'Reescreva a frase “O poema fala que a cidade corre” como uma paráfrase mais precisa e adequada a um comentário literário.', [], 'medio'),
        q(7, 'aplicacao', 'Escreva uma afirmação sobre o contraste entre silêncio e movimento no poema e sustente-a com uma citação curta corretamente marcada por aspas.', [], 'medio'),
        q(8, 'producao', 'Produza um parágrafo de quatro ou cinco linhas interpretando a imagem da “janela acesa”. Use uma paráfrase e uma citação curta do poema, deixando claro o que pertence ao texto e o que é sua interpretação.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Citação direta de um verso do poema.', 'O comentário reproduz literalmente o verso e o marca com aspas.'),
        a(2, 'Verdadeiro.', 'O comentário reformula ideias do poema sem reproduzi-las literalmente, atribuindo-lhes uma interpretação.'),
        a(3, 'As aspas indicam que aquelas palavras foram retiradas literalmente do poema, distinguindo a voz do texto citado da explicação do estudante.', 'A resposta deve reconhecer a função de marcação da citação direta.'),
        a(4, 'A) A luz não obriga as pessoas a interromperem o que estão fazendo.', 'A alternativa conserva a ideia central com outras palavras, sem transformar a paráfrase em citação.'),
        a(5, 'O Comentário 1 usa citação direta; o Comentário 2 usa predominantemente paráfrase. Ambos defendem que há contraste entre a pressa urbana e um espaço de pausa/leitura.', 'A comparação deve identificar o recurso de incorporação da voz do texto e a interpretação compartilhada.'),
        a(6, 'Resposta possível: “O poema apresenta a rua como espaço de movimento acelerado, em contraste com a pausa sugerida pela janela acesa.”', 'Aceitar reformulações precisas que não atribuam ao poema uma afirmação vaga ou distorcida.'),
        a(7, 'Resposta possível: “O poema contrapõe movimento e pausa quando afirma que ‘a rua corre depressa’, enquanto a janela guarda um momento de silêncio.”', 'A resposta deve formular interpretação própria e usar uma citação curta, fiel e marcada.'),
        a(8, 'Resposta autoral com interpretação coerente, uma paráfrase fiel e uma citação curta marcada por aspas, sem confundir as palavras do poema com as do estudante.', 'Corrigir fidelidade, marcação das vozes e função das evidências na sustentação da interpretação.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Marcar no material três categorias com etiquetas: CITAÇÃO — palavras idênticas ao poema; PARÁFRASE — ideia reescrita; COMENTÁRIO — interpretação do leitor. Fazer a classificação antes da produção.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-15-leitura-critica-literatura': {
      titulo: 'Debate literário: clássicos e obras contemporâneas na escola',
      tema: 'Posicionamentos, sustentação, contra-argumentação e negociação em debate sobre leitura literária.',
      objetivo: 'Analisar argumentos e movimentos argumentativos em posições diferentes sobre o repertório de leitura escolar, mobilizando a habilidade EM13LP05.',
      instrucaoGeral: 'Leia duas falas de um debate fictício do conselho de leitura da escola. Identifique posições, argumentos, contra-argumentos e pontos de negociação.',
      textoApoio: {
        titulo: 'O que deve entrar no projeto de leitura?',
        conteudo: 'FALA A — “Os clássicos devem continuar no projeto porque ajudam a conhecer obras que influenciaram a língua e outras produções culturais. Sei que alguns textos apresentam linguagem distante do cotidiano, mas isso pode ser trabalhado com mediação, glossário e comparação com obras atuais. Retirá-los por completo reduziria o contato dos estudantes com parte importante da tradição literária.”\n\nFALA B — “Obras contemporâneas também precisam ocupar espaço relevante porque aproximam temas, linguagens e experiências de muitos jovens leitores. Concordo que conhecer clássicos é importante, porém o projeto não precisa escolher apenas um grupo. Podemos organizar percursos que coloquem um clássico e uma obra recente em diálogo, permitindo comparação de temas e formas de expressão.”'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual é a posição central defendida na Fala A?', [
          'Os clássicos devem permanecer no projeto de leitura.',
          'Somente obras contemporâneas devem ser lidas.',
          'O projeto de leitura deve ser encerrado.',
          'A escola não deve mediar textos de linguagem difícil.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: a Fala A reconhece uma dificuldade dos clássicos e responde a ela propondo formas de mediação.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Qual argumento a Fala B apresenta para defender maior presença de obras contemporâneas?', [], 'medio'),
        q(4, 'multipla-escolha', 'No trecho “Concordo que conhecer clássicos é importante, porém...”, a Fala B realiza qual movimento argumentativo?', [
          'Negociação seguida de contraponto.',
          'Mudança completa de assunto.',
          'Apresentação de dado estatístico.',
          'Ataque pessoal ao outro participante.'
        ], 'pequeno'),
        q(5, 'analise', 'Compare as duas falas e identifique um ponto de concordância e um ponto de diferença entre elas.', [], 'grande'),
        q(6, 'associacao', 'Associe: 1. “alguns textos apresentam linguagem distante”; 2. “mediação, glossário e comparação”; 3. “um clássico e uma obra recente em diálogo”. Alternativas: reconhecimento de objeção; resposta à objeção; proposta de negociação.', ['1 — reconhecimento de objeção', '2 — resposta à objeção', '3 — proposta de negociação'], 'pequeno'),
        q(7, 'aplicacao', 'Escreva um contra-argumento respeitoso a uma das falas. Depois, acrescente uma frase de negociação que reconheça ao menos um ponto válido da posição oposta.', [], 'grande'),
        q(8, 'producao', 'Produza um parágrafo defendendo um critério para selecionar obras no projeto de leitura da escola. Inclua uma posição clara, um argumento, uma possível objeção e uma resposta a essa objeção.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Os clássicos devem permanecer no projeto de leitura.', 'A fala sustenta a permanência dos clássicos e justifica sua relevância cultural e linguística.'),
        a(2, 'Verdadeiro.', 'A fala admite a distância linguística e responde com mediação, glossário e comparação com obras atuais.'),
        a(3, 'A Fala B argumenta que obras contemporâneas aproximam temas, linguagens e experiências de muitos jovens leitores.', 'A resposta deve identificar o argumento explícito usado para sustentar a presença dessas obras.'),
        a(4, 'A) Negociação seguida de contraponto.', 'A fala reconhece parte da posição anterior e, com “porém”, introduz sua própria proposta.'),
        a(5, 'Concordância: ambas reconhecem valor nos clássicos. Diferença: a Fala A enfatiza sua permanência; a Fala B enfatiza ampliar o espaço das obras contemporâneas e propõe colocá-las em diálogo.', 'Aceitar formulações equivalentes sustentadas pelo texto.'),
        a(6, '1 — reconhecimento de objeção; 2 — resposta à objeção; 3 — proposta de negociação.', 'Os trechos representam etapas diferentes do movimento argumentativo.'),
        a(7, 'Resposta autoral. Deve apresentar discordância baseada em argumento, sem ataque pessoal, e incluir ao menos uma concessão ou ponto de negociação.', 'Corrigir pertinência do contra-argumento e presença explícita de negociação.'),
        a(8, 'Resposta autoral com posição, argumento, objeção possível e resposta à objeção organizados de modo coerente.', 'Avaliar a força da relação entre tese, justificativa e movimento de contra-argumentação, não a escolha pessoal de repertório.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Organizar cada fala em quatro caixas: POSIÇÃO, ARGUMENTO, OBJEÇÃO/RESSALVA e PROPOSTA. Permitir que o estudante complete o quadro antes de responder às questões discursivas.' },
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
