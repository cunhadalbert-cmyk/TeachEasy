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
    'em-1s-b1-lingua-portuguesa-16-debate-literatura': {
      titulo: 'Escolhas de palavras e efeitos de sentido em texto literário',
      tema: 'Efeitos produzidos por repetição, contraste, ordem das palavras e escolhas lexicais em um texto literário.',
      objetivo: 'Analisar como escolhas expressivas de linguagem modificam ritmo, ênfase e construção de sentidos, mobilizando a habilidade EM13LP06.',
      instrucaoGeral: 'Leia o fragmento literário e as reformulações. Compare como pequenas mudanças de palavras e de ordem alteram o efeito produzido.',
      textoApoio: {
        titulo: 'A rua depois da chuva',
        conteudo: 'TEXTO PRINCIPAL\nA chuva foi embora, mas deixou a rua acordada. Pingava do toldo, pingava da árvore, pingava do fio. No asfalto escuro, cada farol acendia um caminho que durava só um segundo. Devagar, muito devagar, a cidade voltava a caber dentro dos seus ruídos.\n\nREFORMULAÇÃO 1\nA chuva terminou e havia gotas em vários lugares. Os carros passavam pela rua. A cidade voltou ao movimento normal.\n\nREFORMULAÇÃO 2\nMuito devagar, devagar mesmo, a cidade despertava outra vez: primeiro um farol, depois um motor, depois uma porta batendo.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'No Texto Principal, a repetição de “pingava” contribui principalmente para:', [
          'criar ritmo e destacar a continuidade dos sons e gotas após a chuva.',
          'informar a quantidade exata de gotas na rua.',
          'indicar que três pessoas diferentes estão falando.',
          'substituir a descrição do espaço por uma explicação científica.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: a Reformulação 1 preserva as informações básicas, mas reduz parte do efeito poético do Texto Principal.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Explique o efeito de sentido da expressão “a rua acordada” no contexto do Texto Principal.', [], 'medio'),
        q(4, 'multipla-escolha', 'Em “Devagar, muito devagar”, a repetição e a posição da expressão no início do período reforçam a ideia de:', [
          'retomada gradual dos movimentos e sons da cidade.',
          'mudança repentina e violenta do clima.',
          'silêncio absoluto durante toda a noite.',
          'velocidade crescente dos automóveis.'
        ], 'pequeno'),
        q(5, 'analise', 'Compare o Texto Principal e a Reformulação 1. Cite duas escolhas expressivas presentes no primeiro que se perdem ou enfraquecem no segundo.', [], 'grande'),
        q(6, 'associacao', 'Associe cada recurso ao efeito predominante: 1. repetição de “pingava”; 2. “a rua acordada”; 3. “um caminho que durava só um segundo”. Alternativas: ritmo; personificação; imagem passageira criada pelo reflexo do farol.', ['1 — ritmo', '2 — personificação', '3 — imagem passageira criada pelo reflexo do farol'], 'pequeno'),
        q(7, 'aplicacao', 'Reescreva “A cidade voltou ao movimento normal” de modo mais expressivo, usando repetição, comparação, metáfora ou mudança de ordem das palavras.', [], 'medio'),
        q(8, 'producao', 'Escreva três ou quatro linhas descrevendo o fim de uma tempestade. Use conscientemente dois recursos expressivos e, ao final, indique quais recursos escolheu e qual efeito pretendia produzir.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) criar ritmo e destacar a continuidade dos sons e gotas após a chuva.', 'A repetição organiza a cadência da frase e faz o leitor perceber a presença das gotas em sequência.'),
        a(2, 'Verdadeiro.', 'A reformulação resume os acontecimentos, mas elimina repetições, imagens figuradas e parte do ritmo.'),
        a(3, 'A expressão personifica a rua, sugerindo que, embora a chuva tenha terminado, o espaço continua cheio de sons, reflexos e movimento.', 'A resposta deve relacionar a escolha figurada ao cenário descrito.'),
        a(4, 'A) retomada gradual dos movimentos e sons da cidade.', 'A repetição de “devagar” intensifica a lentidão da retomada.'),
        a(5, 'Exemplos: repetição de “pingava”; personificação em “rua acordada”; imagem do farol como caminho; repetição de “devagar”; oposição entre chuva que foi embora e marcas que ficaram.', 'Aceitar duas escolhas corretamente identificadas e explicadas.'),
        a(6, '1 — ritmo; 2 — personificação; 3 — imagem passageira criada pelo reflexo do farol.', 'Os recursos e seus efeitos podem ser reconhecidos diretamente no fragmento.'),
        a(7, 'Resposta possível: “Aos poucos, bem aos poucos, a cidade vestiu novamente seus barulhos.”', 'Aceitar formulações autorais que mantenham a ideia e empreguem recurso expressivo identificável.'),
        a(8, 'Resposta autoral com dois recursos expressivos efetivamente usados e explicação coerente dos efeitos pretendidos.', 'Avaliar a relação entre escolha linguística, contexto e efeito de sentido, não apenas a presença nominal do recurso.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Apresentar o Texto Principal e a Reformulação 1 lado a lado. Destacar repetição, personificação e imagens figuradas com marcações diferentes antes de responder.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-17-oficina-literatura': {
      titulo: 'Modalizadores em resenhas: como o autor mostra sua posição',
      tema: 'Marcas linguísticas de certeza, possibilidade, obrigação e avaliação em resenhas literárias.',
      objetivo: 'Reconhecer e analisar modalizadores que revelam o posicionamento do enunciador em textos de apreciação literária, mobilizando a habilidade EM13LP07.',
      instrucaoGeral: 'Leia duas resenhas curtas sobre o mesmo livro fictício. Observe palavras e construções que indicam certeza, dúvida, recomendação, obrigação ou avaliação.',
      textoApoio: {
        titulo: 'Duas leituras de “A Última Estação”',
        conteudo: 'RESENHA A\n“A Última Estação” certamente conquista leitores que gostam de narrativas de mistério. A alternância entre passado e presente funciona muito bem e, provavelmente, é o recurso que mais sustenta a curiosidade até o final. Alguns capítulos podem parecer lentos, mas o desfecho compensa essa espera.\n\nRESENHA B\nTalvez “A Última Estação” agrade mais a quem prefere histórias construídas aos poucos. O início parece demorado e o leitor precisa acompanhar atentamente as mudanças de tempo. Ainda assim, é possível reconhecer um projeto narrativo consistente. Quem busca ação imediata deve considerar esse ritmo antes de escolher a leitura.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Na Resenha A, a palavra “certamente” expressa principalmente:', [
          'alto grau de certeza do resenhista.',
          'proibição dirigida ao leitor.',
          'dúvida absoluta sobre a obra.',
          'indicação de tempo passado.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: “Talvez”, na Resenha B, diminui o grau de certeza da afirmação seguinte.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'completar', 'Complete com um modalizador do texto que indica possibilidade: “__________ é o recurso que mais sustenta a curiosidade até o final.”', [], 'pequeno'),
        q(4, 'multipla-escolha', 'No trecho “Quem busca ação imediata deve considerar esse ritmo”, o verbo “deve” introduz ideia de:', [
          'recomendação ou orientação.',
          'lembrança involuntária.',
          'descrição de cenário.',
          'certeza sobre um fato passado.'
        ], 'pequeno'),
        q(5, 'analise', 'Compare “certamente conquista leitores” e “talvez agrade mais”. Como os modalizadores alteram o grau de compromisso de cada resenhista com sua afirmação?', [], 'grande'),
        q(6, 'associacao', 'Associe: 1. certamente; 2. provavelmente; 3. talvez; 4. deve. Alternativas: certeza forte; probabilidade; possibilidade; recomendação.', ['1 — certeza forte', '2 — probabilidade', '3 — possibilidade', '4 — recomendação'], 'pequeno'),
        q(7, 'revisao', 'Reescreva a frase “Esse livro é o melhor para todos os leitores” de modo mais responsável e menos absoluto, usando um modalizador.', [], 'medio'),
        q(8, 'producao', 'Escreva uma recomendação de três ou quatro linhas sobre um livro que você conhece ou sobre o livro fictício do material. Use pelo menos dois modalizadores diferentes e sublinhe-os.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) alto grau de certeza do resenhista.', '“Certamente” marca forte adesão do enunciador à afirmação.'),
        a(2, 'Verdadeiro.', '“Talvez” apresenta a avaliação como possibilidade, não como certeza.'),
        a(3, 'provavelmente', 'O advérbio modaliza a afirmação como provável.'),
        a(4, 'A) recomendação ou orientação.', 'Nesse contexto, “deve” orienta o leitor a considerar o ritmo da obra.'),
        a(5, '“Certamente” apresenta a avaliação com maior grau de certeza; “talvez” reduz o compromisso e abre espaço para outras experiências de leitura.', 'A resposta deve relacionar modalização e posicionamento do enunciador.'),
        a(6, '1 — certeza forte; 2 — probabilidade; 3 — possibilidade; 4 — recomendação.', 'Os sentidos correspondem ao uso dos modalizadores no contexto das resenhas.'),
        a(7, 'Resposta possível: “Esse livro provavelmente agradará leitores que preferem narrativas de mistério.”', 'Aceitar reescritas que reduzam a generalização e empreguem modalização coerente.'),
        a(8, 'Resposta autoral com pelo menos dois modalizadores usados de forma coerente e identificável.', 'Avaliar se as marcas linguísticas realmente expressam graus de certeza, possibilidade, avaliação ou recomendação.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Criar uma escala visual CERTEZA → PROBABILIDADE → POSSIBILIDADE e posicionar “certamente”, “provavelmente” e “talvez”. Tratar “deve” separadamente como orientação.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-18-analise-de-dados-literatura': {
      titulo: 'Sintaxe e ritmo: como a ordem das frases muda a narrativa',
      tema: 'Ordem dos constituintes, coordenação, subordinação e efeitos sintáticos na construção de um texto literário.',
      objetivo: 'Analisar como diferentes organizações sintáticas alteram ênfase, ritmo e progressão narrativa, mobilizando a habilidade EM13LP08.',
      instrucaoGeral: 'Leia as versões de uma mesma cena. Observe a ordem dos termos, as relações entre orações e o ritmo criado por períodos curtos ou articulados.',
      textoApoio: {
        titulo: 'Três maneiras de narrar a mesma chegada',
        conteudo: 'VERSÃO A\nMiguel abriu a porta e entrou na sala porque ouviu um ruído. Ele acendeu a luz, mas não encontrou ninguém.\n\nVERSÃO B\nPorque ouviu um ruído, Miguel abriu a porta e entrou na sala. Acendeu a luz; ninguém encontrou.\n\nVERSÃO C\nA porta, Miguel abriu devagar. Na sala entrou sem chamar. Como ouvira um ruído atrás da estante, acendeu a luz — e ninguém havia ali.\n\nAs três versões apresentam ações semelhantes, mas a organização sintática muda a ênfase, a fluidez e até a naturalidade de algumas construções.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Na Versão A, a oração “porque ouviu um ruído” expressa relação de:', [
          'causa.',
          'oposição.',
          'conclusão.',
          'comparação.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: mover a oração causal para o início, como na Versão B, altera a ênfase sem necessariamente mudar a relação de causa.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Compare “Miguel abriu a porta” com “A porta, Miguel abriu devagar”. Que elemento recebe mais destaque na segunda construção?', [], 'medio'),
        q(4, 'multipla-escolha', 'Qual problema de clareza aparece em “Acendeu a luz; ninguém encontrou”, na Versão B?', [
          'O verbo “encontrou” fica sem complemento claro no contexto.',
          'A frase possui dois sujeitos explicitamente repetidos.',
          'A palavra “luz” está no plural.',
          'A oração apresenta excesso de adjetivos.'
        ], 'pequeno'),
        q(5, 'analise', 'Explique como períodos mais curtos ou estruturas invertidas podem contribuir para suspense ou destaque em uma narrativa.', [], 'grande'),
        q(6, 'associacao', 'Associe: 1. porque; 2. mas; 3. como, em “Como ouvira um ruído”; 4. e. Alternativas: causa; oposição; causa antecipada; adição/encadeamento.', ['1 — causa', '2 — oposição', '3 — causa antecipada', '4 — adição/encadeamento'], 'pequeno'),
        q(7, 'revisao', 'Reescreva “Acendeu a luz; ninguém encontrou” para tornar a relação sintática e o sentido mais claros, preservando a ideia da cena.', [], 'medio'),
        q(8, 'producao', 'Escreva duas versões de uma frase narrativa: uma em ordem mais direta e outra com inversão para destacar um elemento. Depois, explique brevemente o efeito da mudança.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) causa.', 'O ruído é apresentado como motivo para Miguel abrir a porta e entrar.'),
        a(2, 'Verdadeiro.', 'A posição da oração causal muda o foco informacional, mas a relação lógico-sintática permanece causal.'),
        a(3, 'A porta recebe maior destaque, pois é deslocada para o início da frase antes do sujeito e do verbo.', 'A resposta deve reconhecer o efeito do deslocamento sintático.'),
        a(4, 'A) O verbo “encontrou” fica sem complemento claro no contexto.', 'A construção deixa incerto o que ou quem não foi encontrado e soa inadequada para o sentido pretendido.'),
        a(5, 'Períodos curtos podem acelerar ou fragmentar a percepção das ações; inversões podem colocar um objeto, circunstância ou informação em posição de destaque, favorecendo suspense ou ênfase.', 'Aceitar explicações equivalentes apoiadas em exemplos do material.'),
        a(6, '1 — causa; 2 — oposição; 3 — causa antecipada; 4 — adição/encadeamento.', 'As conjunções e estruturas estabelecem essas relações no contexto.'),
        a(7, 'Resposta possível: “Acendeu a luz, mas não encontrou ninguém.”', 'A reescrita deve recuperar o complemento e estabelecer relação clara entre as ações.'),
        a(8, 'Resposta autoral com duas versões semanticamente relacionadas e explicação coerente sobre destaque, ritmo ou ênfase produzidos pela inversão.', 'Avaliar consciência da organização sintática, não apenas troca aleatória da ordem das palavras.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Recortar cada oração em blocos e permitir reorganização física da ordem. Marcar sujeito, verbo, complemento e conectivo antes de comparar os efeitos.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-19-projeto-aplicado-literatura': {
      titulo: 'Fontes confiáveis para um texto sobre leitura na escola',
      tema: 'Seleção, comparação e uso referenciado de informações de fontes com diferentes níveis de confiabilidade.',
      objetivo: 'Avaliar fontes, selecionar dados pertinentes e utilizá-los de forma referenciada em uma produção sobre práticas de leitura, mobilizando a habilidade EM13LP12.',
      instrucaoGeral: 'Considere as três fontes simuladas para um projeto de texto sobre leitura na escola. Analise autoria, método, data, transparência e possibilidade de verificação antes de usar as informações.',
      textoApoio: {
        titulo: 'Três fontes simuladas para a mesma pesquisa',
        conteudo: 'FONTE A — RELATÓRIO DA BIBLIOTECA DA ESCOLA, 2026\nDocumento assinado pela equipe da biblioteca. Informa que, em março, 180 estudantes responderam voluntariamente a um formulário sobre empréstimo e preferência de gêneros. O relatório apresenta o número de participantes, as perguntas utilizadas e uma tabela com os resultados.\n\nFONTE B — POSTAGEM ANÔNIMA EM REDE SOCIAL\n“Todo mundo sabe que adolescente não lê mais. Quase ninguém pega livro, e isso só piora a cada ano.” A publicação não informa autoria, escola, período, número de participantes nem fonte dos dados.\n\nFONTE C — ENTREVISTA PARA O JORNAL ESCOLAR\nA professora responsável pelo clube de leitura explica como os encontros são organizados e relata mudanças observadas na participação dos integrantes. A matéria identifica entrevistadora, entrevistada e data, mas deixa claro que os relatos descrevem apenas o grupo participante do clube.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual fonte oferece dados quantitativos com método mais verificável?', [
          'Fonte A.',
          'Fonte B.',
          'Fonte C.',
          'Nenhuma das três.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: a ausência de autoria, período e origem dos dados reduz a confiabilidade da Fonte B.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Indique duas informações da Fonte A que permitem avaliar melhor a qualidade dos dados apresentados.', [], 'medio'),
        q(4, 'multipla-escolha', 'Para escrever sobre a experiência específica do clube de leitura, a Fonte C é útil principalmente porque:', [
          'traz um relato identificado e delimita o grupo ao qual as observações se referem.',
          'prova o comportamento de todos os adolescentes do país.',
          'não informa quem foi entrevistado.',
          'substitui qualquer necessidade de dados quantitativos.'
        ], 'pequeno'),
        q(5, 'analise', 'Explique por que seria inadequado usar a frase “adolescente não lê mais”, da Fonte B, como conclusão geral sem verificação adicional.', [], 'grande'),
        q(6, 'associacao', 'Associe: 1. Fonte A; 2. Fonte B; 3. Fonte C. Alternativas: relatório com método descrito; opinião anônima sem evidências; entrevista identificada e delimitada.', ['1 — relatório com método descrito', '2 — opinião anônima sem evidências', '3 — entrevista identificada e delimitada'], 'pequeno'),
        q(7, 'aplicacao', 'Escreva uma frase que use corretamente uma informação da Fonte A e indique a origem da informação no próprio período.', [], 'medio'),
        q(8, 'producao', 'Produza um parágrafo curto para um jornal escolar sobre práticas de leitura. Use informações de pelo menos duas fontes adequadas, identificando-as e respeitando os limites de cada uma.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Fonte A.', 'Ela informa responsável, período, número de participantes, instrumento de coleta e apresentação dos resultados.'),
        a(2, 'Verdadeiro.', 'Sem esses elementos, a afirmação não pode ser verificada nem relacionada a uma população claramente definida.'),
        a(3, 'Exemplos: 180 participantes; coleta em março; formulário; perguntas apresentadas; tabela de resultados; assinatura da equipe da biblioteca.', 'Aceitar duas características que contribuam para transparência e verificabilidade.'),
        a(4, 'A) traz um relato identificado e delimita o grupo ao qual as observações se referem.', 'A fonte é pertinente para compreender a experiência do clube, mas não permite generalizar para todos os estudantes.'),
        a(5, 'Porque se trata de uma generalização sem autoria, amostra, período, método ou dados verificáveis. Seria necessário buscar evidências confiáveis antes de sustentar essa conclusão.', 'A resposta deve apontar a falta de base verificável e o problema da generalização.'),
        a(6, '1 — relatório com método descrito; 2 — opinião anônima sem evidências; 3 — entrevista identificada e delimitada.', 'A classificação decorre das características explicitadas no material.'),
        a(7, 'Resposta possível: “Segundo o Relatório da Biblioteca da Escola (2026), 180 estudantes responderam ao formulário aplicado em março.”', 'A frase deve atribuir a informação à fonte e não extrapolar o que ela afirma.'),
        a(8, 'Resposta autoral. Espera-se uso referenciado de pelo menos duas fontes adequadas — especialmente A e C — com distinção entre dado quantitativo e relato localizado.', 'Corrigir pertinência, referência à origem e ausência de generalizações não sustentadas.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Usar um quadro com quatro critérios para cada fonte: AUTORIA, DATA, COMO OBTEVE A INFORMAÇÃO e POSSO VERIFICAR?. Preencher antes das questões.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-20-sintese-autoral-literatura': {
      titulo: 'Planejar, escrever e revisar uma resenha para o blog da escola',
      tema: 'Planejamento, produção, revisão e edição de texto adequado ao público, gênero e meio de circulação.',
      objetivo: 'Aplicar etapas de planejamento e revisão para produzir uma resenha breve adequada ao blog escolar, mobilizando a habilidade EM13LP15.',
      instrucaoGeral: 'Analise a situação comunicativa, o rascunho e a lista de revisão. Depois, proponha melhorias e produza uma versão adequada ao blog da escola.',
      textoApoio: {
        titulo: 'Do rascunho à publicação',
        conteudo: 'SITUAÇÃO DE PRODUÇÃO\nO clube de leitura publicará no blog da escola uma resenha curta para estudantes do Ensino Médio. O texto deve apresentar a obra, fazer uma avaliação fundamentada e ajudar o leitor a decidir se deseja conhecê-la, sem revelar o final.\n\nRASCUNHO\n“Eu li o livro e ele é legal. O livro tem uma personagem que muda de cidade e aí acontecem várias coisas. Eu gostei porque é legal e a história é boa. Todo mundo tem que ler porque é muito bom mesmo.”\n\nLISTA DE REVISÃO\n1. O leitor entende qual é a obra e qual é sua situação inicial?\n2. A avaliação apresenta razões específicas?\n3. Há repetições que podem ser substituídas?\n4. O tom é adequado ao blog escolar e evita ordens absolutas ao leitor?\n5. Ortografia, pontuação e concordância foram revisadas?'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual é o principal problema da avaliação no rascunho?', [
          'Ela usa avaliações vagas e repetidas, sem razões específicas suficientes.',
          'Ela apresenta dados demais sobre a editora.',
          'Ela utiliza linguagem científica excessivamente técnica.',
          'Ela revela detalhadamente o final da obra.'
        ], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: antes de revisar frases isoladas, é importante considerar público, finalidade, gênero e meio de circulação.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Cite duas repetições ou escolhas vagas do rascunho que deveriam ser revistas.', [], 'medio'),
        q(4, 'multipla-escolha', 'Qual alternativa reescreve melhor “Todo mundo tem que ler porque é muito bom mesmo” para o contexto de uma resenha?', [
          'A obra pode interessar a leitores que apreciam histórias de mudança e adaptação, especialmente pelo desenvolvimento da personagem principal.',
          'Todo mundo é obrigado a ler porque eu mandei.',
          'É bom, bom, bom e pronto.',
          'Leia imediatamente e não questione.'
        ], 'pequeno'),
        q(5, 'revisao', 'Reescreva as duas primeiras frases do rascunho, apresentando a situação inicial da obra com mais precisão e evitando repetição de “livro”.', [], 'medio'),
        q(6, 'analise', 'Explique por que a frase “Todo mundo tem que ler” é pouco adequada à finalidade de ajudar o leitor a decidir por si mesmo.', [], 'medio'),
        q(7, 'aplicacao', 'Monte um plano de três tópicos para a resenha: apresentação da obra, avaliação fundamentada e recomendação ao público.', [], 'grande'),
        q(8, 'producao', 'Produza uma resenha curta de cinco a sete linhas para o blog escolar, usando a situação inicial do rascunho sem inventar o final. Inclua avaliação com justificativa e uma recomendação adequada ao público.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Ela usa avaliações vagas e repetidas, sem razões específicas suficientes.', '“Legal”, “boa” e “muito bom” repetem avaliação sem explicar quais aspectos da obra justificam o julgamento.'),
        a(2, 'Verdadeiro.', 'A adequação global à situação de produção orienta decisões de conteúdo, linguagem, organização e revisão.'),
        a(3, 'Exemplos: repetição de “livro”; repetição de “legal”; “várias coisas”; “a história é boa”; “muito bom mesmo”.', 'Aceitar duas ocorrências que mostrem vagueza ou repetição.'),
        a(4, 'A) A obra pode interessar a leitores que apreciam histórias de mudança e adaptação, especialmente pelo desenvolvimento da personagem principal.', 'A alternativa apresenta público possível e uma razão, sem impor a leitura.'),
        a(5, 'Resposta possível: “A obra acompanha uma personagem que precisa se adaptar depois de mudar de cidade. A partir dessa mudança, novos conflitos passam a desafiar sua forma de ver o lugar e as pessoas.”', 'Aceitar reescritas coerentes com as informações disponíveis, sem inventar desfecho.'),
        a(6, 'Porque uma resenha deve oferecer elementos para avaliação do leitor; uma ordem absoluta substitui argumentação por imposição e ignora diferentes interesses de leitura.', 'A resposta deve relacionar escolha linguística, finalidade e autonomia do leitor.'),
        a(7, 'Plano possível: 1. apresentar título/obra e situação inicial; 2. avaliar um aspecto específico e justificar; 3. indicar a que tipo de leitor a obra pode interessar.', 'Aceitar planos equivalentes que organizem as etapas exigidas.'),
        a(8, 'Resposta autoral de cinco a sete linhas com apresentação compreensível, avaliação fundamentada, recomendação adequada ao público e revisão linguística básica.', 'Avaliar adequação ao gênero, público, finalidade, coesão e qualidade da revisão, sem exigir uma opinião específica sobre a obra fictícia.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Dividir a produção em três cartões: APRESENTAR, AVALIAR COM RAZÃO e RECOMENDAR. Só depois juntar as partes e aplicar a lista de revisão item por item.' },
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
