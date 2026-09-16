(() => {
  const COLLECTION = 'em-1serie-1bimestre-lingua-portuguesa-v2';

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
    descricao: 'Esta atividade foi planejada para funcionar integralmente com os textos fornecidos. Não há questão dependente de imagem.',
    objetivoPedagogico: 'Garantir que todas as respostas possam ser construídas apenas com o material textual disponibilizado.',
    arquivo: null,
    status: 'nao-necessaria'
  };

  const overrides = {
    'em-1s-b1-lingua-portuguesa-01-mapa-conceitual-leitura-critica': {
      titulo: 'Campanha de troca de livros: público, finalidade e circulação',
      tema: 'Relação entre texto, público, finalidade, suporte e contexto de circulação.',
      objetivo: 'Analisar como a mesma campanha escolar muda de linguagem conforme o público e o suporte, mobilizando a habilidade EM13LP01.',
      instrucaoGeral: 'Leia os dois textos da campanha de troca de livros. Responda às oito questões usando apenas as informações e escolhas de linguagem apresentadas.',
      textoApoio: {
        titulo: 'A mesma campanha em dois suportes',
        conteudo: 'TEXTO A — CARTAZ NO MURAL DA ESCOLA\nTROQUE UM LIVRO, DESCUBRA OUTRA HISTÓRIA!\nNos dias 18 e 19 de março, estudantes do Ensino Médio poderão levar um livro em bom estado à biblioteca e trocá-lo por outro título disponível. A ação acontece nos intervalos, das 9h40 às 10h e das 15h40 às 16h. Organização: Grêmio Estudantil e Biblioteca.\n\nTEXTO B — POSTAGEM NA REDE SOCIAL DA ESCOLA\nSeu livro já terminou uma história com você. Que tal começar outra com alguém? Traga um livro em bom estado nos dias 18 e 19 e participe da nossa troca na biblioteca. Chame a turma e venha escolher sua próxima leitura! #TrocaDeLivros #LeituraCircula'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual alternativa explica melhor por que os dois textos usam linguagens diferentes?', [
          'Porque foram escritos por autores de escolas diferentes.',
          'Porque circulam em suportes diferentes e procuram envolver o público de maneiras distintas.',
          'Porque tratam de campanhas sem relação entre si.',
          'Porque apenas o Texto B informa quando ocorrerá a ação.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: o Texto A prioriza informações práticas como datas, horários e responsáveis pela ação.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Indique duas informações que aparecem nos dois textos e mostram que eles divulgam a mesma campanha.', [], 'medio'),
        q(4, 'multipla-escolha', 'No Texto B, a pergunta “Que tal começar outra com alguém?” tem principalmente a função de:', [
          'substituir as datas da campanha.',
          'aproximar o leitor e incentivar sua participação.',
          'explicar as regras de conservação dos livros.',
          'informar quem organiza a biblioteca.'
        ], 'pequeno'),
        q(5, 'discursiva', 'Compare o público e a situação de circulação dos dois textos. Explique por que o cartaz é mais informativo e a postagem é mais convidativa.', [], 'grande'),
        q(6, 'completar', 'Complete com uma palavra do material de apoio: a troca acontecerá na __________ da escola.', [], 'pequeno'),
        q(7, 'aplicacao', 'Transforme o Texto B em uma mensagem curta destinada às famílias dos estudantes. Mantenha data, local e finalidade da campanha.', [], 'grande'),
        q(8, 'producao', 'Escreva um aviso de até três linhas para o aplicativo escolar convidando a turma a participar. Sua versão deve ser adequada a esse suporte.', [], 'grande')
      ],
      gabarito: [
        a(1, 'B) Porque circulam em suportes diferentes e procuram envolver o público de maneiras distintas.', 'O cartaz organiza dados objetivos; a postagem usa linguagem de convite, pergunta direta e hashtags.'),
        a(2, 'Verdadeiro.', 'O Texto A apresenta datas, horários, local e responsáveis pela ação.'),
        a(3, 'Exemplos: os dias 18 e 19, a troca de livros em bom estado e a realização na biblioteca.', 'Duas informações coincidentes bastam, desde que estejam explicitamente presentes nos textos.'),
        a(4, 'B) aproximar o leitor e incentivar sua participação.', 'A pergunta se dirige diretamente ao leitor e cria um tom de convite.'),
        a(5, 'Espera-se que o estudante reconheça que o cartaz funciona como aviso institucional no espaço escolar, enquanto a postagem circula em rede social e busca engajamento. O Texto A concentra dados práticos; o Texto B usa pergunta, imperativos e hashtags.', 'A resposta deve relacionar suporte, finalidade, público e escolhas de linguagem.'),
        a(6, 'biblioteca', 'A palavra aparece nos dois textos.'),
        a(7, 'Resposta possível: “Famílias, nos dias 18 e 19 de março haverá troca de livros na biblioteca da escola. Os estudantes podem levar um livro em bom estado e escolher outro título disponível.”', 'Aceitar outras formulações que preservem as informações essenciais e usem tom adequado às famílias.'),
        a(8, 'Resposta autoral. Deve trazer convite, referência à troca de livros e linguagem breve compatível com aplicativo escolar.', 'Corrigir pela adequação ao suporte, clareza e fidelidade às informações da campanha.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: {
        orientacao: 'Apresentar os Textos A e B lado a lado e destacar com cores diferentes: público, finalidade, local, data e marcas de convite. Permitir resposta por tópicos.'
      },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-02-estudo-de-caso-leitura-critica': {
      titulo: 'Coesão em notícia escolar: como as partes do texto se conectam',
      tema: 'Relações entre partes do texto, retomadas pronominais e conectivos de coesão.',
      objetivo: 'Reconhecer como pronomes, expressões de retomada e conectivos articulam as informações de uma notícia, mobilizando a habilidade EM13LP02.',
      instrucaoGeral: 'Leia a notícia escolar e observe como as palavras retomam ideias já apresentadas e estabelecem relações entre as partes do texto.',
      textoApoio: {
        titulo: 'Horta escolar recebe sistema de captação de água',
        conteudo: 'Na segunda-feira, estudantes da 1ª série instalaram um pequeno sistema de captação de água da chuva ao lado da horta escolar. O equipamento armazena a água que escorre do telhado do laboratório. Essa água será usada na irrigação durante os períodos sem chuva.\n\nA iniciativa surgiu depois de uma pesquisa feita pela turma sobre consumo de água na escola. Como o projeto apresentou bons resultados nos testes, a direção autorizou sua instalação. Além disso, os estudantes produzirão placas explicativas para mostrar à comunidade como o sistema funciona.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'A expressão “Essa água”, no primeiro parágrafo, retoma:', [
          'a água da chuva armazenada pelo equipamento.',
          'a água usada no laboratório de Ciências.',
          'a água trazida pelos estudantes.',
          'a água consumida pela direção.'
        ], 'pequeno'),
        q(2, 'completar', 'Complete com o conectivo usado no texto para acrescentar uma informação: “__________ disso, os estudantes produzirão placas explicativas”.', [], 'pequeno'),
        q(3, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: a expressão “sua instalação” retoma a instalação do sistema de captação de água.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(4, 'discursiva', 'Explique a relação de causa e consequência entre a pesquisa da turma e a instalação do sistema.', [], 'medio'),
        q(5, 'multipla-escolha', 'No trecho “Como o projeto apresentou bons resultados nos testes, a direção autorizou sua instalação”, a palavra “Como” introduz ideia de:', [
          'causa.',
          'oposição.',
          'tempo.',
          'comparação.'
        ], 'pequeno'),
        q(6, 'analise', 'Identifique duas expressões de retomada no texto e diga a que informação anterior cada uma se refere.', [], 'medio'),
        q(7, 'producao', 'Escreva um novo parágrafo de três ou quatro linhas dando continuidade à notícia. Use pelo menos um pronome de retomada e um conectivo.', [], 'grande'),
        q(8, 'revisao', 'Revise o parágrafo que você escreveu e registre uma alteração que melhore a coesão entre as frases.', [], 'medio')
      ],
      gabarito: [
        a(1, 'A) a água da chuva armazenada pelo equipamento.', '“Essa água” retoma a água que escorre do telhado e é armazenada.'),
        a(2, 'Além', 'O texto usa “Além disso” para acrescentar nova informação.'),
        a(3, 'Verdadeiro.', 'O pronome possessivo “sua” retoma o projeto/sistema cuja instalação foi autorizada.'),
        a(4, 'A pesquisa identificou uma questão ligada ao consumo de água; a partir dela, a turma desenvolveu e testou o projeto, que depois foi autorizado para instalação.', 'A resposta deve explicitar o encadeamento entre investigação, teste e autorização.'),
        a(5, 'A) causa.', 'O bom resultado do projeto é apresentado como motivo para a autorização.'),
        a(6, 'Exemplos: “Essa água” retoma a água captada; “a iniciativa” retoma o projeto de captação; “sua instalação” retoma a instalação do sistema/projeto.', 'Aceitar duas relações corretamente identificadas.'),
        a(7, 'Resposta autoral com continuidade temática, ao menos um elemento de retomada e um conectivo coerente.', 'Corrigir continuidade, clareza e uso efetivo dos mecanismos de coesão.'),
        a(8, 'Resposta pessoal, mas deve apontar uma mudança concreta, como substituir uma repetição por pronome ou inserir conectivo adequado.', 'A revisão precisa demonstrar melhora real da coesão.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: {
        orientacao: 'Sublinhar em uma cor as expressões retomadas e, em outra, os termos a que elas se referem. Oferecer um quadro com conectivos de causa, adição e consequência.'
      },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-03-investigacao-leitura-critica': {
      titulo: 'Intertextualidade em campanhas: quando um texto conversa com outro',
      tema: 'Relações de intertextualidade, paráfrase, transformação e posicionamento.',
      objetivo: 'Comparar dois textos e identificar como o segundo retoma e transforma uma formulação anterior para construir novo sentido, mobilizando a habilidade EM13LP03.',
      instrucaoGeral: 'Leia os dois enunciados e observe as semelhanças e mudanças de sentido entre eles.',
      textoApoio: {
        titulo: 'Do provérbio à campanha ambiental',
        conteudo: 'TEXTO A — PROVÉRBIO ADAPTADO PARA FINS DIDÁTICOS\n“Quem planta cuidado colhe futuro.”\n\nTEXTO B — FRASE DE UMA CAMPANHA ESCOLAR CONTRA O DESCARTE INCORRETO\n“Quem planta garrafa no chão colhe alagamento na cidade.”\n\nNa campanha, a estrutura do Texto A é retomada e modificada para criticar o descarte de resíduos nas ruas.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual elemento mostra de forma mais clara que o Texto B dialoga com o Texto A?', [
          'A repetição da estrutura “Quem planta... colhe...”.',
          'O uso da palavra “cidade” apenas no Texto B.',
          'O fato de os dois textos terem o mesmo número de palavras.',
          'A ausência de verbos nos dois textos.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: o Texto B repete o Texto A sem alterar seu sentido.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Explique que mudança de sentido ocorre quando “cuidado/futuro” é substituído por “garrafa no chão/alagamento”.', [], 'medio'),
        q(4, 'multipla-escolha', 'A retomada da estrutura do Texto A ajuda a campanha principalmente porque:', [
          'cria uma relação reconhecível e produz um efeito crítico.',
          'elimina a necessidade de discutir o descarte de lixo.',
          'transforma a frase em uma notícia objetiva.',
          'prova cientificamente que todo alagamento tem uma única causa.'
        ], 'pequeno'),
        q(5, 'analise', 'O Texto B apresenta um posicionamento sobre o comportamento das pessoas. Qual é esse posicionamento?', [], 'medio'),
        q(6, 'completar', 'Complete: a relação entre os dois textos é construída pela repetição da estrutura “Quem __________ ... colhe ...”.', [], 'pequeno'),
        q(7, 'aplicacao', 'Crie uma nova frase que dialogue com a estrutura do Texto A para incentivar economia de água. A relação com o modelo deve ser reconhecível.', [], 'grande'),
        q(8, 'producao', 'Explique, em um pequeno parágrafo, por que conhecer o texto de referência pode ampliar a compreensão do efeito produzido por um texto intertextual.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) A repetição da estrutura “Quem planta... colhe...”.', 'A estrutura sintática e lexical funciona como marca explícita do diálogo entre os textos.'),
        a(2, 'Falso.', 'O Texto B mantém a estrutura, mas modifica palavras e finalidade para produzir crítica ambiental.'),
        a(3, 'O Texto A associa cuidado a um futuro positivo; o Texto B transforma essa lógica em alerta, relacionando descarte inadequado a uma consequência negativa.', 'A resposta deve comparar os pares de ideias e o efeito da transformação.'),
        a(4, 'A) cria uma relação reconhecível e produz um efeito crítico.', 'A familiaridade da estrutura reforça o impacto da adaptação.'),
        a(5, 'O Texto B critica o descarte de garrafas/lixo no chão e associa esse comportamento a consequências urbanas negativas.', 'O posicionamento deve ser inferido a partir da formulação da campanha.'),
        a(6, 'planta', 'A palavra aparece na estrutura retomada pelos dois textos.'),
        a(7, 'Resposta possível: “Quem planta economia hoje colhe água amanhã.”', 'Aceitar formulações que retomem claramente a estrutura e estejam relacionadas ao uso responsável da água.'),
        a(8, 'Espera-se que o estudante explique que reconhecer a referência permite perceber melhor a transformação, a intenção e o posicionamento do novo texto.', 'A resposta deve articular referência, mudança e efeito de sentido.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: {
        orientacao: 'Apresentar os textos em duas colunas e marcar visualmente as palavras que permanecem e as que foram substituídas. Permitir resposta oral antes do registro escrito.'
      },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-04-situacao-problema-leitura-critica': {
      titulo: 'Citação e paráfrase em texto argumentativo',
      tema: 'Uso de citação e paráfrase para sustentar posicionamentos e explicações.',
      objetivo: 'Distinguir citação direta, paráfrase e comentário do autor e avaliar como esses recursos sustentam um posicionamento, mobilizando a habilidade EM13LP04.',
      instrucaoGeral: 'Leia a informação de referência e os dois parágrafos produzidos por estudantes. Observe como cada um incorpora a voz da fonte.',
      textoApoio: {
        titulo: 'Como incorporar uma fonte ao próprio texto',
        conteudo: 'INFORMAÇÃO DE REFERÊNCIA — Pesquisa interna fictícia da escola: “Sete em cada dez estudantes entrevistados disseram usar a biblioteca ao menos uma vez por semana.”\n\nPARÁGRAFO 1 — A biblioteca ocupa um lugar importante na rotina escolar. Segundo a pesquisa interna, “sete em cada dez estudantes entrevistados disseram usar a biblioteca ao menos uma vez por semana”. Esse dado indica que o espaço não é usado apenas em períodos de prova.\n\nPARÁGRAFO 2 — A pesquisa interna mostra que a maioria dos estudantes entrevistados frequenta a biblioteca semanalmente. Esse resultado reforça a importância de manter horários amplos de atendimento.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual parágrafo utiliza citação direta?', [
          'Apenas o Parágrafo 1.',
          'Apenas o Parágrafo 2.',
          'Os dois parágrafos.',
          'Nenhum dos parágrafos.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: o Parágrafo 2 apresenta uma paráfrase da informação de referência.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Copie do Parágrafo 1 o trecho em que o autor comenta o dado citado e explica seu significado.', [], 'medio'),
        q(4, 'analise', 'Explique por que a expressão “Segundo a pesquisa interna” é importante antes da citação.', [], 'medio'),
        q(5, 'multipla-escolha', 'No Parágrafo 2, qual trecho corresponde ao posicionamento construído a partir da fonte?', [
          '“Pesquisa interna”.',
          '“a maioria dos estudantes entrevistados”.',
          '“reforça a importância de manter horários amplos de atendimento”.',
          '“frequenta a biblioteca semanalmente”.'
        ], 'pequeno'),
        q(6, 'completar', 'Complete: reproduzir exatamente as palavras da fonte, marcando-as como fala de outro autor, caracteriza uma __________ direta.', [], 'pequeno'),
        q(7, 'aplicacao', 'Escreva uma paráfrase da informação de referência sem alterar o sentido dos dados.', [], 'grande'),
        q(8, 'producao', 'Produza duas frases defendendo a continuidade da biblioteca aberta nos intervalos. Use a informação de referência como evidência e deixe claro o que vem da fonte e o que é sua conclusão.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Apenas o Parágrafo 1.', 'O Parágrafo 1 reproduz literalmente a frase da pesquisa entre aspas.'),
        a(2, 'Verdadeiro.', 'O Parágrafo 2 reescreve a informação da pesquisa com outras palavras, preservando seu sentido geral.'),
        a(3, '“Esse dado indica que o espaço não é usado apenas em períodos de prova.”', 'Esse trecho interpreta a evidência apresentada na citação.'),
        a(4, 'Porque identifica a origem da informação e separa a voz da fonte da voz do estudante que escreve.', 'A marca de atribuição ajuda a manter clareza e responsabilidade no uso da informação.'),
        a(5, 'C) “reforça a importância de manter horários amplos de atendimento”.', 'Esse trecho usa o dado para sustentar uma conclusão/posição.'),
        a(6, 'citação', 'Citação direta reproduz literalmente palavras da fonte com marcação adequada.'),
        a(7, 'Resposta possível: “De acordo com a pesquisa interna, 70% dos estudantes consultados usam a biblioteca pelo menos uma vez por semana.”', 'Aceitar paráfrases fiéis ao dado, sem distorcer a proporção nem a frequência.'),
        a(8, 'Resposta autoral. Deve indicar a fonte do dado e, em seguida, formular uma conclusão favorável à manutenção do atendimento nos intervalos.', 'Corrigir a distinção entre evidência e posicionamento e a coerência do argumento.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: {
        orientacao: 'Usar três marcações visuais: fonte original, citação/paráfrase e comentário do autor. Oferecer modelo de frase com “Segundo...” e “Esse dado indica que...”.'
      },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-05-leitura-critica-leitura-critica': {
      titulo: 'Debate escolar: argumentos, contra-argumentos e negociação',
      tema: 'Posicionamentos e movimentos argumentativos em um debate.',
      objetivo: 'Identificar sustentação, contra-argumentação e negociação em textos argumentativos e avaliar a força dos argumentos apresentados, mobilizando a habilidade EM13LP05.',
      instrucaoGeral: 'Leia os dois posicionamentos sobre o uso do pátio no horário do almoço. Analise argumentos, respostas ao ponto de vista contrário e propostas de negociação.',
      textoApoio: {
        titulo: 'Deve haver música no pátio durante o almoço?',
        conteudo: 'POSIÇÃO A — Representante do grêmio: “A música no pátio pode tornar o intervalo mais acolhedor e valorizar apresentações dos próprios estudantes. Porém, o volume precisa ser controlado para não atrapalhar quem prefere conversar ou estudar. Uma solução seria usar música apenas em dois dias da semana e limitar o som a uma área do pátio.”\n\nPOSIÇÃO B — Representante do clube de leitura: “O almoço também é um momento de descanso, e nem todos se concentram bem com música. Mesmo em volume moderado, o som alcança mesas próximas. Em vez de música ambiente fixa, a escola poderia reservar datas específicas para apresentações, divulgadas com antecedência.”'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual é a tese principal da Posição A?', [
          'A música deve ser proibida em qualquer situação.',
          'A música pode ocorrer, desde que haja limites de volume, frequência e espaço.',
          'O pátio deve ser usado apenas para estudo.',
          'As apresentações devem acontecer sem aviso prévio.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: a Posição B rejeita qualquer possibilidade de apresentação musical na escola.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Identifique um argumento usado pela Posição B para questionar a proposta de música no pátio.', [], 'medio'),
        q(4, 'analise', 'A Posição A reconhece uma possível objeção antes de propor uma solução. Qual é essa objeção e como ela é negociada?', [], 'grande'),
        q(5, 'multipla-escolha', 'Qual trecho representa melhor um movimento de negociação?', [
          '“nem todos se concentram bem com música”.',
          '“o som alcança mesas próximas”.',
          '“uma solução seria usar música apenas em dois dias da semana e limitar o som a uma área do pátio”.',
          '“o almoço também é um momento de descanso”.'
        ], 'pequeno'),
        q(6, 'discursiva', 'Compare as propostas finais das duas posições. Em que elas se aproximam e em que diferem?', [], 'grande'),
        q(7, 'producao', 'Escreva um contra-argumento de duas ou três linhas dirigido à Posição A. Use uma razão concreta e evite atacar a pessoa que apresentou a proposta.', [], 'grande'),
        q(8, 'producao', 'Proponha uma solução de compromisso que considere pelo menos uma preocupação de cada posição.', [], 'grande')
      ],
      gabarito: [
        a(1, 'B) A música pode ocorrer, desde que haja limites de volume, frequência e espaço.', 'A Posição A defende a música, mas apresenta condições para reduzir impactos.'),
        a(2, 'Falso.', 'A Posição B admite apresentações em datas específicas e divulgadas previamente.'),
        a(3, 'Exemplos: nem todos descansam ou se concentram bem com música; mesmo com volume moderado, o som alcança mesas próximas.', 'Aceitar um argumento explícito da Posição B.'),
        a(4, 'A objeção é que a música pode atrapalhar quem quer conversar ou estudar. A negociação proposta é controlar o volume, restringir os dias e limitar o som a uma área.', 'A resposta deve identificar objeção e estratégia de acomodação.'),
        a(5, 'C) “uma solução seria usar música apenas em dois dias da semana e limitar o som a uma área do pátio”.', 'O trecho busca conciliar interesses diferentes por meio de limites.'),
        a(6, 'As duas posições aceitam alguma forma de atividade musical organizada; a Posição A propõe música em dois dias por semana numa área delimitada, e a Posição B prefere apresentações apenas em datas específicas.', 'A comparação deve apontar uma aproximação e uma diferença.'),
        a(7, 'Resposta autoral. Deve contestar um aspecto da Posição A com argumento pertinente e respeitoso.', 'Corrigir pela relevância da razão apresentada e pela ausência de ataque pessoal.'),
        a(8, 'Resposta autoral. Exemplo: realizar apresentações quinzenais em uma área delimitada, com horário curto, volume máximo definido e divulgação antecipada.', 'A solução precisa incorporar preocupações de convivência, descanso e possibilidade de expressão cultural.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: {
        orientacao: 'Organizar cada posição em um quadro com três campos: tese, argumento e proposta. Permitir que o estudante monte primeiro um mapa de argumentos antes da resposta escrita.'
      },
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

  function apply(collection) {
    if (!collection || collection.colecao !== COLLECTION || !Array.isArray(collection.atividades)) {
      return collection;
    }

    collection.atividades = collection.atividades.map(activity => {
      const patch = overrides[activity.id];
      return patch ? mergeActivity(activity, patch) : activity;
    });
    return collection;
  }

  globalThis.TeachEasyHighSchoolPedagogicalOverrides = {
    collection: COLLECTION,
    reviewedIds: Object.keys(overrides),
    apply
  };
})();
