(() => {
  const current = globalThis.TeachEasyHighSchoolPedagogicalOverrides;
  const COLLECTION = 'em-1serie-1bimestre-lingua-portuguesa-v2';
  if (!current || current.collection !== COLLECTION) return;

  const q = (numero, tipo, enunciado, alternativas = [], espacoResposta = 'medio') => ({ numero, tipo, enunciado, alternativas, espacoResposta, figuraId: null });
  const a = (numero, resposta, justificativa) => ({ numero, resposta, justificativa });
  const reviewed = { status: 'aprovada-pedagogicamente', bnccConferida: true, conteudoConferido: true, questoesConferidas: true, gabaritoConferido: true, ilustracaoConferida: true, validacaoAutomatica: true };
  const noRequiredIllustration = {
    descricao: 'Esta atividade foi planejada para funcionar integralmente com o material textual fornecido. Nenhuma questão depende de imagem.',
    objetivoPedagogico: 'Garantir que todas as respostas possam ser construídas apenas com os textos, dados e exemplos apresentados na própria atividade.',
    arquivo: null,
    status: 'nao-necessaria'
  };

  const overrides = {
    'em-1s-b1-lingua-portuguesa-26-debate-producao-textual': {
      titulo: 'Escolhas de palavras em campanha: informar ou mobilizar?',
      tema: 'Efeitos de sentido produzidos por verbos, repetições, contrastes e escolhas lexicais em textos de campanha.',
      objetivo: 'Analisar efeitos de sentido decorrentes de escolhas expressivas da linguagem e empregá-las conscientemente na produção textual, mobilizando a habilidade EM13LP06.',
      instrucaoGeral: 'Leia duas versões de uma campanha escolar sobre descarte correto de resíduos e compare como palavras e estruturas diferentes mudam o impacto da mensagem.',
      textoApoio: {
        titulo: 'Duas versões para a mesma campanha',
        conteudo: 'VERSÃO A — INFORMATIVA\nSepare papel, plástico, metal e vidro antes de descartar. Utilize as lixeiras identificadas no pátio e nas salas. O descarte correto facilita a coleta seletiva da escola.\n\nVERSÃO B — MOBILIZADORA\nAntes de jogar fora, escolha o destino. Separe hoje. Separe aqui. Separe certo. Uma embalagem no lugar errado vira problema; no lugar certo, volta a ser recurso. A coleta seletiva começa na sua mão.\n\nAs duas versões defendem a mesma prática, mas utilizam diferentes escolhas de palavras, ritmo e organização para produzir efeitos distintos no leitor.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Na Versão B, a repetição de “Separe” produz principalmente qual efeito?', ['Reforça a ação esperada e cria ritmo de convocação.', 'Apaga a finalidade da campanha.', 'Indica dúvida sobre o descarte correto.', 'Transforma o texto em relato do passado.'], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: a Versão A prioriza instruções objetivas, enquanto a Versão B combina informação e apelo direto ao leitor.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Explique o contraste construído em “no lugar errado vira problema; no lugar certo, volta a ser recurso”.', [], 'medio'),
        q(4, 'multipla-escolha', 'A frase “A coleta seletiva começa na sua mão” busca principalmente:', ['aproximar a responsabilidade do leitor por meio de uma formulação figurada.', 'informar o peso exato de cada embalagem.', 'negar que a escola tenha lixeiras.', 'descrever literalmente uma coleta feita com as mãos.'], 'pequeno'),
        q(5, 'analise', 'Compare duas escolhas linguísticas da Versão B com a Versão A e explique como elas tornam a campanha mais mobilizadora.', [], 'grande'),
        q(6, 'associacao', 'Associe recurso e efeito: 1. repetição de “Separe”; 2. contraste “errado/certo”; 3. “começa na sua mão”. Alternativas: ritmo e insistência; oposição de consequências; responsabilização do leitor.', ['1 — ritmo e insistência', '2 — oposição de consequências', '3 — responsabilização do leitor'], 'pequeno'),
        q(7, 'revisao', 'Reescreva “Jogue o lixo na lixeira correta” de forma mais expressiva, sem perder a clareza da orientação.', [], 'medio'),
        q(8, 'producao', 'Crie uma chamada de três linhas para uma campanha escolar. Use conscientemente dois recursos expressivos e explique o efeito pretendido por cada um.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Reforça a ação esperada e cria ritmo de convocação.', 'A repetição enfatiza o verbo de ação e intensifica o caráter mobilizador.'),
        a(2, 'Verdadeiro.', 'A primeira versão organiza instruções; a segunda interpela o leitor com ritmo, contraste e formulação figurada.'),
        a(3, 'O contraste apresenta duas consequências opostas para o mesmo objeto: descarte inadequado como problema e descarte correto como possibilidade de reaproveitamento.', 'A resposta deve relacionar a oposição lexical à mudança de consequência.'),
        a(4, 'A) aproximar a responsabilidade do leitor por meio de uma formulação figurada.', 'A expressão atribui ao leitor participação direta no início do processo.'),
        a(5, 'Exemplos: repetição de “Separe”, oposição “errado/certo”, imperativos, frases curtas e “começa na sua mão”. Esses recursos aumentam ritmo, ênfase e interlocução.', 'Aceitar duas escolhas corretamente identificadas e relacionadas a seus efeitos.'),
        a(6, '1 — ritmo e insistência; 2 — oposição de consequências; 3 — responsabilização do leitor.', 'Cada recurso produz o efeito indicado no contexto da campanha.'),
        a(7, 'Resposta possível: “Escolha certo antes de descartar: cada resíduo tem seu lugar.”', 'Aceitar formulações claras que introduzam algum recurso expressivo pertinente.'),
        a(8, 'Resposta autoral com dois recursos expressivos efetivamente empregados e explicação coerente dos efeitos pretendidos.', 'Avaliar relação entre escolha linguística, finalidade e público.')
      ],
      possuiFiguras: false, figuras: [], possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Destacar verbos de ação, repetições e contrastes em três marcações diferentes. Comparar primeiro os efeitos e só depois produzir a própria chamada.' },
      ilustracao: noRequiredIllustration, revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-27-oficina-producao-textual': {
      titulo: 'Modalização em pedido formal: firmeza sem exagero',
      tema: 'Marcas linguísticas de possibilidade, necessidade, certeza e recomendação em um pedido dirigido à gestão escolar.',
      objetivo: 'Analisar e empregar modalizadores para ajustar o grau de certeza, necessidade e cortesia em uma produção formal, mobilizando a habilidade EM13LP07.',
      instrucaoGeral: 'Leia o pedido e uma versão exagerada. Observe como modalizadores alteram o tom, a força das afirmações e a relação com o destinatário.',
      textoApoio: {
        titulo: 'Pedido de ampliação do horário da biblioteca',
        conteudo: 'VERSÃO A — PEDIDO REVISADO\nPrezada equipe gestora, gostaríamos de sugerir que a biblioteca possa permanecer aberta por mais trinta minutos em dois dias da semana. Essa mudança provavelmente beneficiaria estudantes que utilizam o transporte escolar e têm pouco tempo livre após as aulas. Sabemos que a alteração depende da disponibilidade da equipe; por isso, talvez seja possível iniciar com um período de teste.\n\nVERSÃO B — PEDIDO EXAGERADO\nA biblioteca tem que ficar aberta por mais tempo, porque isso com certeza resolverá o problema de todos os estudantes. A gestão deve fazer a mudança imediatamente e não há motivo para testar antes.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Em “provavelmente beneficiaria”, o modalizador indica:', ['probabilidade, sem apresentar o benefício como certeza absoluta.', 'ordem obrigatória.', 'negação completa da proposta.', 'descrição de um fato passado.'], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: “talvez seja possível” reduz o grau de certeza e abre espaço para negociação.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Compare “gostaríamos de sugerir” com “tem que”. Que diferença de tom essas expressões produzem?', [], 'medio'),
        q(4, 'multipla-escolha', 'Qual problema aparece em “com certeza resolverá o problema de todos os estudantes”?', ['A afirmação é absoluta e não apresenta evidência que permita garantir o resultado para todos.', 'A frase não contém verbo.', 'A expressão indica apenas possibilidade.', 'O trecho apresenta uma data incorreta.'], 'pequeno'),
        q(5, 'analise', 'Explique como os modalizadores da Versão A contribuem para um pedido firme, mas aberto à negociação.', [], 'grande'),
        q(6, 'associacao', 'Associe: 1. provavelmente; 2. talvez; 3. gostaríamos; 4. deve. Alternativas: probabilidade; possibilidade; cortesia/atenuação; obrigação.', ['1 — probabilidade', '2 — possibilidade', '3 — cortesia/atenuação', '4 — obrigação'], 'pequeno'),
        q(7, 'revisao', 'Reescreva “A gestão deve aceitar nossa proposta” com um modalizador que mantenha a solicitação, mas reduza a imposição.', [], 'medio'),
        q(8, 'producao', 'Escreva três ou quatro linhas de um pedido formal à escola. Use pelo menos dois modalizadores diferentes e escolha-os de acordo com o efeito que deseja produzir.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) probabilidade, sem apresentar o benefício como certeza absoluta.', '“Provavelmente” marca o enunciado como uma avaliação provável.'),
        a(2, 'Verdadeiro.', '“Talvez” explicita possibilidade e reduz o compromisso com uma afirmação categórica.'),
        a(3, '“Gostaríamos de sugerir” apresenta o pedido de modo cortês e negociável; “tem que” constrói uma obrigação direta e mais impositiva.', 'A resposta deve relacionar escolha modal ao tom produzido.'),
        a(4, 'A) A afirmação é absoluta e não apresenta evidência que permita garantir o resultado para todos.', 'A generalização e a certeza total tornam a afirmação mais forte do que os dados disponíveis permitem.'),
        a(5, 'Expressões como “gostaríamos”, “provavelmente” e “talvez” apresentam proposta, benefício possível e alternativa de teste sem transformar a solicitação em ordem ou certeza infundada.', 'Aceitar explicações equivalentes sobre graus de compromisso e negociação.'),
        a(6, '1 — probabilidade; 2 — possibilidade; 3 — cortesia/atenuação; 4 — obrigação.', 'Os valores modais correspondem ao uso no material.'),
        a(7, 'Resposta possível: “A gestão poderia considerar nossa proposta.”', 'Aceitar reescritas que reduzam a imposição e preservem o pedido.'),
        a(8, 'Resposta autoral com pelo menos dois modalizadores coerentes com um pedido formal.', 'Avaliar adequação dos modalizadores à relação entre enunciador, destinatário e finalidade.')
      ],
      possuiFiguras: false, figuras: [], possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Organizar os modalizadores em uma escala: CERTEZA/OBRIGAÇÃO → PROBABILIDADE → POSSIBILIDADE/CORTESIA. Classificar os exemplos antes da produção.' },
      ilustracao: noRequiredIllustration, revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-28-analise-de-dados-producao-textual': {
      titulo: 'Sintaxe na revisão: clareza, ordem e relações entre ideias',
      tema: 'Organização sintática, posição dos termos, conectivos e ambiguidade na revisão de um comunicado.',
      objetivo: 'Analisar como escolhas sintáticas afetam clareza e sentido e revisar construções inadequadas, mobilizando a habilidade EM13LP08.',
      instrucaoGeral: 'Leia um rascunho de comunicado e sua versão revisada. Observe ordem dos termos, conectivos e referências que podem gerar ambiguidade.',
      textoApoio: {
        titulo: 'Um comunicado antes e depois da revisão',
        conteudo: 'RASCUNHO\nA direção informou aos estudantes que a oficina seria transferida ontem. Por causa da chuva na sala multimídia não haverá encontro. Os participantes receberão nova data e poderão confirmar presença, mas pelo formulário.\n\nVERSÃO REVISADA\nOntem, a direção informou aos estudantes que a oficina seria transferida. Como houve infiltração causada pela chuva na sala multimídia, o encontro não acontecerá na data prevista. Os participantes receberão uma nova data e poderão confirmar a presença pelo formulário.\n\nA revisão muda a posição de “ontem”, explicita a relação causal e reorganiza termos que estavam mal associados.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'No rascunho, a posição de “ontem” pode gerar dúvida sobre:', ['se ontem ocorreu a informação ou a transferência da oficina.', 'quem é a direção da escola.', 'quantos estudantes existem.', 'qual é a cor da sala.'], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: colocar “Ontem” no início da versão revisada ajuda a ligá-lo claramente ao ato de informar.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Explique por que “Por causa da chuva na sala multimídia” pode sugerir uma relação inadequada entre “chuva” e “sala”.', [], 'medio'),
        q(4, 'multipla-escolha', 'Na versão revisada, “Como houve infiltração...” estabelece explicitamente uma relação de:', ['causa.', 'oposição.', 'comparação.', 'alternância.'], 'pequeno'),
        q(5, 'analise', 'Compare o último período das duas versões. Que mudança sintática torna mais claro o meio usado para confirmar a presença?', [], 'grande'),
        q(6, 'associacao', 'Associe problema e revisão: 1. “ontem” em posição ambígua; 2. “chuva na sala”; 3. “mas pelo formulário”. Alternativas: deslocamento temporal; explicitação da infiltração; reorganização do complemento.', ['1 — deslocamento temporal', '2 — explicitação da infiltração', '3 — reorganização do complemento'], 'pequeno'),
        q(7, 'revisao', 'Reescreva “A professora avisou aos alunos que a prova mudaria amanhã” de duas formas, deixando claro em cada uma a que ação “amanhã” se refere.', [], 'grande'),
        q(8, 'producao', 'Escreva um pequeno comunicado escolar de três frases e revise a ordem dos termos e os conectivos para evitar ambiguidades.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) se ontem ocorreu a informação ou a transferência da oficina.', 'A proximidade de “ontem” com “seria transferida” permite mais de uma leitura.'),
        a(2, 'Verdadeiro.', 'O deslocamento para o início do período associa o marcador temporal à oração principal.'),
        a(3, 'A sequência pode ser lida como se a chuva ocorresse “na sala multimídia”; a revisão explicita que houve infiltração na sala causada pela chuva.', 'A resposta deve identificar a associação sintática inadequada.'),
        a(4, 'A) causa.', 'A oração introduz o motivo pelo qual o encontro não ocorrerá.'),
        a(5, 'A versão revisada liga diretamente “pelo formulário” ao verbo “confirmar”, retirando o “mas” inadequado e aproximando o complemento da ação que ele especifica.', 'Aceitar explicações equivalentes.'),
        a(6, '1 — deslocamento temporal; 2 — explicitação da infiltração; 3 — reorganização do complemento.', 'Cada revisão responde a um problema sintático do rascunho.'),
        a(7, 'Exemplos: “Amanhã, a professora avisará aos alunos que a prova mudará.” / “A professora avisou aos alunos que a prova seria transferida para amanhã.”', 'Aceitar duas versões que eliminem a ambiguidade, mesmo com ajustes verbais necessários.'),
        a(8, 'Resposta autoral com comunicado compreensível, relações sintáticas claras e conectivos adequados.', 'Avaliar clareza, ordem dos termos e relações entre orações.')
      ],
      possuiFiguras: false, figuras: [], possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Separar cada período em blocos móveis e perguntar: QUEM? FEZ O QUÊ? QUANDO? POR QUÊ? COMO?. Reorganizar os blocos antes de registrar a resposta.' },
      ilustracao: noRequiredIllustration, revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-29-projeto-aplicado-producao-textual': {
      titulo: 'Selecionando fontes para um artigo escolar sobre estudo e celular',
      tema: 'Curadoria, comparação e uso responsável de fontes para sustentar uma produção argumentativa.',
      objetivo: 'Selecionar informações de fontes confiáveis e pertinentes e utilizá-las de modo referenciado, mobilizando a habilidade EM13LP12.',
      instrucaoGeral: 'Analise três fontes simuladas sobre uso de celular durante momentos de estudo. Compare método, autoria e limites antes de decidir quais informações usar.',
      textoApoio: {
        titulo: 'Fontes para um artigo do jornal escolar',
        conteudo: 'FONTE A — QUESTIONÁRIO DA ESCOLA\nEm maio, 220 estudantes responderam anonimamente a um questionário elaborado pela equipe pedagógica. Entre as perguntas havia frequência de notificações durante o estudo e estratégias usadas para reduzir interrupções. O relatório apresenta número de participantes, perguntas e percentuais, mas informa que os dados descrevem apenas os estudantes que responderam.\n\nFONTE B — POSTAGEM SEM AUTORIA\n“Celular destrói totalmente a concentração de qualquer pessoa. Está provado.” A postagem não apresenta autor, pesquisa, amostra, data nem referência verificável.\n\nFONTE C — ENTREVISTA COM ORIENTADORA EDUCACIONAL\nA orientadora relata que alguns estudantes do grupo de acompanhamento passaram a deixar notificações desativadas durante blocos de estudo e disseram perceber menos interrupções. A matéria identifica entrevistada e data e deixa claro que se trata de relato de um grupo específico.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual fonte apresenta o método de coleta quantitativa de forma mais transparente?', ['Fonte A.', 'Fonte B.', 'Fonte C.', 'Nenhuma fonte.'], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: a Fonte A permite discutir o grupo respondente, mas não autoriza afirmar automaticamente que os resultados representam todos os estudantes.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Indique duas razões pelas quais a Fonte B não deve ser usada como prova de uma afirmação geral.', [], 'medio'),
        q(4, 'multipla-escolha', 'A principal utilidade da Fonte C em um artigo escolar é:', ['apresentar um relato identificado e delimitado sobre uma experiência específica.', 'provar uma regra universal sobre concentração.', 'substituir todos os dados quantitativos.', 'fornecer percentuais que não aparecem no texto.'], 'pequeno'),
        q(5, 'analise', 'Explique como um artigo pode combinar a Fonte A e a Fonte C sem confundir dado quantitativo com relato localizado.', [], 'grande'),
        q(6, 'associacao', 'Associe: 1. Fonte A; 2. Fonte B; 3. Fonte C. Alternativas: questionário com método descrito; afirmação anônima sem evidências; entrevista identificada com alcance limitado.', ['1 — questionário com método descrito', '2 — afirmação anônima sem evidências', '3 — entrevista identificada com alcance limitado'], 'pequeno'),
        q(7, 'aplicacao', 'Escreva uma frase que use uma informação da Fonte A sem extrapolar o grupo pesquisado e identifique a origem.', [], 'medio'),
        q(8, 'producao', 'Escreva um parágrafo de artigo escolar sobre concentração no estudo usando duas fontes adequadas e deixando explícito o limite de cada evidência.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Fonte A.', 'Ela informa período, número de participantes, responsável pelo instrumento e natureza das perguntas.'),
        a(2, 'Verdadeiro.', 'O próprio relatório limita os resultados aos participantes que responderam.'),
        a(3, 'Exemplos: ausência de autoria, data, pesquisa, amostra, método e referência verificável; além disso, usa generalização absoluta.', 'Aceitar duas limitações claramente identificadas.'),
        a(4, 'A) apresentar um relato identificado e delimitado sobre uma experiência específica.', 'A entrevista pode ilustrar uma experiência sem ser generalizada para todos.'),
        a(5, 'A Fonte A pode fornecer dados do grupo respondente e a Fonte C pode acrescentar um exemplo qualitativo do grupo acompanhado, com cada uma explicitamente atribuída e delimitada.', 'A resposta deve distinguir natureza e alcance das evidências.'),
        a(6, '1 — questionário com método descrito; 2 — afirmação anônima sem evidências; 3 — entrevista identificada com alcance limitado.', 'A associação corresponde às características informadas.'),
        a(7, 'Resposta possível: “Segundo o questionário da escola realizado em maio com 220 respondentes, estudantes relataram diferentes frequências de interrupção por notificações durante o estudo.”', 'A frase deve indicar origem e evitar transformar a amostra em totalidade.'),
        a(8, 'Resposta autoral com uso pertinente e referenciado de duas fontes adequadas, sem generalizações além do que os dados permitem.', 'Avaliar curadoria, atribuição e coerência entre evidência e conclusão.')
      ],
      possuiFiguras: false, figuras: [], possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Montar uma tabela com AUTORIA, MÉTODO, QUEM PARTICIPOU e O QUE POSSO CONCLUIR. Preencher para cada fonte antes da produção.' },
      ilustracao: noRequiredIllustration, revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-30-sintese-autoral-producao-textual': {
      titulo: 'Da ideia à versão final: carta aberta sobre um espaço de convivência',
      tema: 'Planejamento, textualização, revisão e edição de uma carta aberta adequada ao público e ao meio de circulação.',
      objetivo: 'Planejar, produzir, revisar e editar um texto considerando gênero, leitor, circulação e convenções linguísticas, mobilizando a habilidade EM13LP15.',
      instrucaoGeral: 'Analise a situação de produção, o plano inicial e um rascunho. Em seguida, revise escolhas de conteúdo, organização, tom e linguagem.',
      textoApoio: {
        titulo: 'Planejamento e rascunho de uma carta aberta',
        conteudo: 'SITUAÇÃO\nEstudantes querem propor melhorias no pátio coberto, que é usado nos intervalos. A carta aberta será publicada no mural e no site da escola e terá como leitores estudantes, famílias e equipe gestora.\n\nPLANO\n1. Apresentar o uso atual do espaço.\n2. Propor mais bancos e uma área silenciosa de convivência.\n3. Justificar as propostas com situações observadas nos intervalos.\n4. Encerrar convidando a comunidade a discutir soluções.\n\nRASCUNHO\n“O pátio é importante e precisa melhorar. Tem pouca cadeira e é meio ruim quando chove. A escola tem que colocar banco e fazer um canto quieto. Isso seria melhor. Esperamos resposta.”\n\nLISTA DE REVISÃO\nA proposta está específica? As justificativas estão claras? O tom é adequado aos leitores? Há palavras vagas ou impositivas? Ortografia, pontuação e concordância foram conferidas?'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual informação da situação de produção deve orientar diretamente o tom da carta?', ['Ela será lida por estudantes, famílias e equipe gestora.', 'O texto deve ser escrito sem revisão.', 'A carta não terá destinatários.', 'O texto será apenas uma anotação pessoal.'], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: o plano ajuda a organizar conteúdo e progressão antes da redação da versão final.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Identifique duas expressões vagas ou pouco adequadas do rascunho e explique por que merecem revisão.', [], 'medio'),
        q(4, 'multipla-escolha', 'Qual reescrita melhora “A escola tem que colocar banco” para uma carta aberta propositiva?', ['“Propomos a instalação de mais bancos para ampliar os lugares de descanso durante os intervalos.”', '“A escola é obrigada e acabou.”', '“Banco, banco, banco.”', '“Talvez alguma coisa pudesse acontecer.”'], 'pequeno'),
        q(5, 'revisao', 'Reescreva a frase “Isso seria melhor” substituindo o pronome vago por uma justificativa específica ligada ao plano.', [], 'medio'),
        q(6, 'analise', 'Explique por que a etapa de revisão precisa considerar tanto correção linguística quanto adequação ao público e à finalidade.', [], 'grande'),
        q(7, 'aplicacao', 'Elabore um parágrafo de desenvolvimento que apresente uma das propostas do plano e uma justificativa concreta.', [], 'grande'),
        q(8, 'producao', 'Produza uma versão final curta da carta aberta, com apresentação do problema, proposta, justificativa e encerramento adequado à comunidade escolar.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Ela será lida por estudantes, famílias e equipe gestora.', 'O leitor previsto influencia formalidade, explicitação e modo de formular propostas.'),
        a(2, 'Verdadeiro.', 'O plano antecipa os principais movimentos do texto e ajuda a manter progressão temática.'),
        a(3, 'Exemplos: “precisa melhorar”, “pouca cadeira”, “meio ruim”, “tem que”, “Isso seria melhor”. São formulações vagas, coloquiais ou impositivas sem justificativa suficiente.', 'Aceitar duas escolhas com explicação pertinente.'),
        a(4, 'A) “Propomos a instalação de mais bancos para ampliar os lugares de descanso durante os intervalos.”', 'A formulação apresenta ação concreta e justificativa com tom propositivo.'),
        a(5, 'Resposta possível: “A criação de uma área silenciosa ampliaria as opções de convivência para estudantes que preferem um intervalo com menos ruído.”', 'A reescrita deve substituir referência vaga por ideia específica e justificada.'),
        a(6, 'Porque um texto pode estar ortograficamente correto e ainda ser inadequado ao gênero, ao leitor ou ao objetivo; revisão envolve forma linguística e eficácia comunicativa.', 'A resposta deve articular os dois níveis de revisão.'),
        a(7, 'Resposta autoral com uma proposta identificável e justificativa concreta coerente com o plano.', 'Avaliar progressão, clareza e relação entre proposta e razão.'),
        a(8, 'Resposta autoral com estrutura de carta aberta, problema, proposta, justificativa, interlocução adequada e revisão linguística básica.', 'Avaliar adequação global à situação de produção, não preferência por uma proposta específica.')
      ],
      possuiFiguras: false, figuras: [], possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Dividir a tarefa em quatro cartões: PROBLEMA, PROPOSTA, JUSTIFICATIVA e ENCERRAMENTO. Revisar um cartão por vez antes de juntar o texto.' },
      ilustracao: noRequiredIllustration, revisao: reviewed
    }
  };

  function mergeActivity(activity, patch) {
    return { ...activity, ...patch, bncc: activity.bncc, quantidadeQuestoes: 8, possuiGabarito: true, revisao: { ...activity.revisao, ...patch.revisao }, ilustracao: { ...activity.ilustracao, ...patch.ilustracao } };
  }

  const previousApply = current.apply.bind(current);
  const previousIds = Array.from(current.reviewedIds || []);
  globalThis.TeachEasyHighSchoolPedagogicalOverrides = {
    collection: COLLECTION,
    reviewedIds: [...previousIds, ...Object.keys(overrides)],
    apply(collection) {
      const base = previousApply(collection);
      if (!base || base.colecao !== COLLECTION || !Array.isArray(base.atividades)) return base;
      base.atividades = base.atividades.map(activity => overrides[activity.id] ? mergeActivity(activity, overrides[activity.id]) : activity);
      return base;
    }
  };
})();
