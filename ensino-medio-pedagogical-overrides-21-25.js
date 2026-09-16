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
    'em-1s-b1-lingua-portuguesa-21-mapa-conceitual-producao-textual': {
      titulo: 'O mesmo convite em diferentes situações de circulação',
      tema: 'Adequação de um texto ao público, à finalidade, ao suporte e ao papel social de quem o publica.',
      objetivo: 'Relacionar decisões de escrita às condições de produção e circulação, mobilizando a habilidade EM13LP01.',
      instrucaoGeral: 'Leia a situação e duas versões de um convite. Compare as escolhas feitas para públicos e meios de circulação diferentes.',
      textoApoio: {
        titulo: 'Convite para a oficina de escrita',
        conteudo: 'SITUAÇÃO\nO grêmio estudantil organizará uma oficina gratuita de escrita criativa na escola. Há 30 vagas e as inscrições terminam em 18 de abril.\n\nVERSÃO A — MURAL DA ESCOLA\nOFICINA DE ESCRITA CRIATIVA — Estudantes do Ensino Médio podem se inscrever até 18 de abril na biblioteca. Serão 30 vagas. A atividade acontecerá na sexta-feira, às 14h, na sala multimídia. Organização: Grêmio Estudantil.\n\nVERSÃO B — REDE SOCIAL DO GRÊMIO\nTem uma ideia de história e não sabe por onde começar? Vem escrever com a gente! A oficina de escrita criativa acontece sexta, às 14h, na sala multimídia. São 30 vagas e a inscrição vai até 18/4, na biblioteca. Compartilhe com a turma.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual característica da Versão A combina mais diretamente com o mural escolar?', ['Organização objetiva de data, local, público e inscrição.', 'Uso exclusivo de gírias sem informações práticas.', 'Ausência do responsável pela atividade.', 'Eliminação da data de inscrição.'], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: as duas versões mantêm as informações essenciais, mas ajustam o modo de falar ao suporte e ao público.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Cite duas marcas da Versão B que buscam aproximar o grêmio do leitor.', [], 'medio'),
        q(4, 'multipla-escolha', 'A identificação “Organização: Grêmio Estudantil” ajuda o leitor principalmente a reconhecer:', ['quem assume a responsabilidade social pela divulgação.', 'a quantidade de professores da escola.', 'o tema de uma prova de Língua Portuguesa.', 'o nome do autor de um romance.'], 'pequeno'),
        q(5, 'analise', 'Explique como finalidade, público e suporte justificam diferenças de linguagem entre as versões A e B.', [], 'grande'),
        q(6, 'associacao', 'Associe: 1. mural; 2. rede social; 3. ambas. Alternativas: informação de consulta rápida; chamada direta e compartilhável; data, horário, local e inscrição.', ['1 — informação de consulta rápida', '2 — chamada direta e compartilhável', '3 — data, horário, local e inscrição'], 'pequeno'),
        q(7, 'aplicacao', 'Adapte o convite para um e-mail dirigido às famílias. Escreva assunto e duas frases com tom adequado.', [], 'medio'),
        q(8, 'producao', 'Explique em um parágrafo quais decisões você tomaria antes de escrever qualquer divulgação escolar, considerando autor, público, objetivo e meio de circulação.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Organização objetiva de data, local, público e inscrição.', 'O mural funciona como fonte de consulta e precisa tornar os dados práticos facilmente localizáveis.'),
        a(2, 'Verdadeiro.', 'As informações centrais são preservadas; o tom e a forma de apresentação mudam.'),
        a(3, 'Exemplos: pergunta inicial, “Vem escrever com a gente!” e “Compartilhe com a turma”.', 'Aceitar duas marcas de interlocução direta presentes no texto.'),
        a(4, 'A) quem assume a responsabilidade social pela divulgação.', 'A identificação do enunciador ajuda a compreender a origem e o papel social do texto.'),
        a(5, 'A Versão A prioriza clareza e consulta no mural; a B usa interpelação e convite direto porque circula em rede social e busca engajamento rápido dos estudantes.', 'A resposta deve relacionar pelo menos duas condições de produção às escolhas de linguagem.'),
        a(6, '1 — informação de consulta rápida; 2 — chamada direta e compartilhável; 3 — data, horário, local e inscrição.', 'A associação sintetiza o funcionamento de cada suporte.'),
        a(7, 'Resposta possível: Assunto: Oficina de escrita criativa para estudantes. “Prezadas famílias, o Grêmio Estudantil realizará uma oficina gratuita de escrita criativa na sexta-feira, às 14h. As inscrições, limitadas a 30 vagas, podem ser feitas na biblioteca até 18 de abril.”', 'A resposta deve adequar tom e informações ao novo destinatário.'),
        a(8, 'Resposta autoral que considere quem escreve, para quem, com qual objetivo, em qual gênero/suporte e quais informações são necessárias.', 'Avaliar a relação entre condições de produção e decisões de escrita.')
      ],
      possuiFiguras: false, figuras: [], possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Usar um quadro com quatro perguntas: QUEM ESCREVE? PARA QUEM? PARA QUÊ? ONDE VAI CIRCULAR?. Preencher para cada versão antes das questões.' },
      ilustracao: noRequiredIllustration, revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-22-estudo-de-caso-producao-textual': {
      titulo: 'Coesão na prática: transformando um rascunho em texto contínuo',
      tema: 'Retomadas, conectivos, relações de causa e consequência e progressão temática na revisão textual.',
      objetivo: 'Estabelecer relações coesivas entre partes de um texto durante leitura e revisão, mobilizando a habilidade EM13LP02.',
      instrucaoGeral: 'Compare o rascunho e a versão revisada. Observe como conectivos e expressões de retomada organizam as ideias.',
      textoApoio: {
        titulo: 'Antes e depois da revisão',
        conteudo: 'RASCUNHO\nA sala de leitura ficava vazia no intervalo. Os estudantes diziam que faltava tempo. O grêmio criou um carrinho com livros no pátio. Mais alunos começaram a pegar livros. O projeto continuou.\n\nVERSÃO REVISADA\nA sala de leitura ficava vazia no intervalo porque muitos estudantes diziam que faltava tempo para ir até lá. Por isso, o grêmio criou um carrinho com livros no pátio. A iniciativa aproximou o acervo dos locais de convivência e, como consequência, mais alunos começaram a fazer empréstimos. Diante desse resultado, o projeto continuou no mês seguinte.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Na versão revisada, “porque” estabelece relação de:', ['causa.', 'oposição.', 'comparação.', 'condição.'], 'pequeno'),
        q(2, 'completar', 'Complete com a expressão do texto que introduz uma consequência da falta de tempo: “__________, o grêmio criou um carrinho com livros no pátio.”', [], 'pequeno'),
        q(3, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: “A iniciativa” retoma a criação do carrinho com livros sem repetir toda a informação.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(4, 'multipla-escolha', 'A expressão “Diante desse resultado” retoma principalmente:', ['o aumento dos empréstimos após a aproximação do acervo.', 'a localização antiga da biblioteca.', 'a duração exata do intervalo.', 'o nome dos estudantes participantes.'], 'pequeno'),
        q(5, 'analise', 'Explique duas melhorias de coesão presentes na versão revisada em comparação com o rascunho.', [], 'grande'),
        q(6, 'associacao', 'Associe: 1. porque; 2. Por isso; 3. A iniciativa; 4. como consequência. Alternativas: causa; consequência; retomada; consequência explícita.', ['1 — causa', '2 — consequência', '3 — retomada', '4 — consequência explícita'], 'pequeno'),
        q(7, 'revisao', 'Una as frases “Choveu forte. O jogo foi adiado.” usando um conectivo que deixe clara a relação entre as ideias.', [], 'medio'),
        q(8, 'producao', 'Escreva três ou quatro frases sobre uma melhoria na escola. Use uma retomada e dois conectivos diferentes para garantir progressão e coerência.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) causa.', 'A falta de tempo é apresentada como motivo para a sala ficar vazia.'),
        a(2, 'Por isso', 'A expressão introduz a providência tomada em resposta ao problema apresentado.'),
        a(3, 'Verdadeiro.', 'A expressão nominal retoma a ação anterior e evita repetição extensa.'),
        a(4, 'A) o aumento dos empréstimos após a aproximação do acervo.', 'Esse é o resultado imediatamente retomado para justificar a continuidade do projeto.'),
        a(5, 'Exemplos: explicitação da causa com “porque”; consequência com “Por isso”; retomada por “A iniciativa”; conexão do aumento dos empréstimos a uma consequência; retomada do resultado no último período.', 'Aceitar duas melhorias corretamente explicadas.'),
        a(6, '1 — causa; 2 — consequência; 3 — retomada; 4 — consequência explícita.', 'Cada recurso exerce essa função no texto revisado.'),
        a(7, 'Resposta possível: “Como choveu forte, o jogo foi adiado.” ou “Choveu forte; por isso, o jogo foi adiado.”', 'Aceitar construções que expressem corretamente causa ou consequência.'),
        a(8, 'Resposta autoral com progressão compreensível, uma retomada e dois conectivos usados de maneira coerente.', 'Avaliar continuidade temática e relações lógico-discursivas.')
      ],
      possuiFiguras: false, figuras: [], possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Destacar no texto revisado as categorias CAUSA, CONSEQUÊNCIA e RETOMADA. Depois ligar cada expressão à ideia que ela conecta.' },
      ilustracao: noRequiredIllustration, revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-23-investigacao-producao-textual': {
      titulo: 'Intertextualidade em campanha: quando um provérbio ganha novo sentido',
      tema: 'Retomada e transformação de enunciados conhecidos para construir novos posicionamentos.',
      objetivo: 'Analisar relações intertextuais em textos de campanha e produzir uma transformação consciente, mobilizando a habilidade EM13LP03.',
      instrucaoGeral: 'Leia os enunciados e identifique o que foi retomado e transformado. Observe como o conhecimento do texto anterior contribui para o novo efeito.',
      textoApoio: {
        titulo: 'Do provérbio à campanha',
        conteudo: 'ENUNCIADO CONHECIDO\n“Quem conta um conto aumenta um ponto.”\n\nCAMPANHA DO CLUBE DE LEITURA\n“Quem lê um conto aumenta um mundo.”\nA frase aparece no convite do clube de leitura para uma semana dedicada a contos curtos. O novo enunciado preserva a estrutura sonora e sintática do provérbio, mas substitui palavras para associar a leitura à ampliação de experiências e imaginação.\n\nOUTRA PROPOSTA\n“De página em página, a escola aumenta a conversa.”\nNesse caso, a campanha não reproduz diretamente o provérbio, mas mantém a ideia de crescimento produzida pelo contato com histórias.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual elemento evidencia mais claramente a relação entre o provérbio e a frase da campanha?', ['A manutenção da estrutura “Quem... um... aumenta um...” com substituição de palavras.', 'A indicação de uma data de prova.', 'A presença de dados estatísticos.', 'A descrição física da biblioteca.'], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: compreender o provérbio anterior ajuda a perceber o jogo de transformação realizado pela campanha.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Quais palavras foram substituídas no novo enunciado e que mudança de sentido essas trocas produzem?', [], 'medio'),
        q(4, 'multipla-escolha', 'A expressão “aumenta um mundo” sugere principalmente:', ['ampliação imaginativa e de experiências pela leitura.', 'aumento físico do tamanho do livro.', 'crescimento do prédio da escola.', 'obrigação de comprar livros.'], 'pequeno'),
        q(5, 'analise', 'Compare a campanha principal e “De página em página...”. Qual delas estabelece intertextualidade mais explícita com o provérbio? Justifique.', [], 'grande'),
        q(6, 'associacao', 'Associe: 1. provérbio; 2. “Quem lê um conto...” ; 3. “De página em página...”. Alternativas: texto retomado; transformação explícita; relação temática menos direta.', ['1 — texto retomado', '2 — transformação explícita', '3 — relação temática menos direta'], 'pequeno'),
        q(7, 'aplicacao', 'Crie uma nova frase para campanha de leitura que dialogue com um ditado ou expressão conhecida. Indique qual expressão serviu de base.', [], 'medio'),
        q(8, 'producao', 'Explique em um parágrafo por que reutilizar de forma criativa um enunciado conhecido pode tornar uma campanha mais memorável, sem simplesmente copiá-lo.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) A manutenção da estrutura “Quem... um... aumenta um...” com substituição de palavras.', 'A estrutura compartilhada torna a retomada reconhecível.'),
        a(2, 'Verdadeiro.', 'O efeito depende da comparação entre o enunciado conhecido e sua transformação.'),
        a(3, '“Conta” passa a “lê” e “ponto” passa a “mundo”; a nova versão desloca o foco do acréscimo feito ao relato para a ampliação simbólica produzida pela leitura.', 'Aceitar explicações equivalentes sobre a transformação semântica.'),
        a(4, 'A) ampliação imaginativa e de experiências pela leitura.', 'O uso é figurado e coerente com a finalidade da campanha.'),
        a(5, '“Quem lê um conto aumenta um mundo” é mais explícita porque preserva a estrutura sintática e sonora do provérbio; a outra proposta mantém apenas relação temática de crescimento.', 'A justificativa deve apontar marcas concretas de retomada.'),
        a(6, '1 — texto retomado; 2 — transformação explícita; 3 — relação temática menos direta.', 'A associação distingue os graus de relação entre os enunciados.'),
        a(7, 'Resposta autoral. Deve indicar a expressão-base e apresentar transformação suficiente para produzir um novo sentido adequado à campanha.', 'Avaliar reconhecimento da relação intertextual e criatividade da adaptação.'),
        a(8, 'Resposta autoral. Espera-se explicar que o reconhecimento ativa memória cultural e comparação, enquanto a transformação acrescenta sentido novo e adequado ao objetivo comunicativo.', 'A resposta deve diferenciar diálogo intertextual de mera reprodução.')
      ],
      possuiFiguras: false, figuras: [], possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Colocar o provérbio e a campanha em linhas paralelas e circular palavras mantidas e substituídas. Só depois discutir o novo sentido.' },
      ilustracao: noRequiredIllustration, revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-24-situacao-problema-producao-textual': {
      titulo: 'Citação e paráfrase em texto informativo: como usar a fonte corretamente',
      tema: 'Incorporação marcada de informações de outra fonte para sustentar explicações sem confundir vozes.',
      objetivo: 'Empregar citação e paráfrase de forma marcada e funcional em uma produção, mobilizando a habilidade EM13LP04.',
      instrucaoGeral: 'Leia a fonte simulada e três formas de incorporá-la a um texto. Identifique o que é citação, paráfrase e uso inadequado.',
      textoApoio: {
        titulo: 'Uma fonte e três usos possíveis',
        conteudo: 'FONTE SIMULADA — RELATÓRIO DA BIBLIOTECA\n“O empréstimo de livros cresceu depois que o horário da biblioteca passou a incluir o intervalo do almoço.” O relatório informa que a mudança de horário ocorreu em março e compara os registros de fevereiro e abril.\n\nUSO A\nSegundo o Relatório da Biblioteca, “o empréstimo de livros cresceu” após a ampliação do horário de atendimento.\n\nUSO B\nDe acordo com o relatório, a biblioteca registrou mais empréstimos depois de passar a atender também no intervalo do almoço.\n\nUSO C\nO empréstimo de livros cresceu depois que o horário da biblioteca passou a incluir o intervalo do almoço. Isso aconteceu porque eu descobri sozinho.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'O Uso A apresenta:', ['citação direta marcada por aspas e referência à fonte.', 'opinião sem relação com a fonte.', 'paráfrase sem indicação de origem.', 'dado numérico inexistente.'], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: o Uso B é uma paráfrase porque reformula a informação e identifica sua origem.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Explique qual é o principal problema do Uso C.', [], 'medio'),
        q(4, 'multipla-escolha', 'Qual expressão do Uso B deixa explícita a origem da informação?', ['“De acordo com o relatório”.', '“mais empréstimos”.', '“intervalo do almoço”.', '“passar a atender”.'], 'pequeno'),
        q(5, 'analise', 'Compare os Usos A e B. Como cada um distingue a informação da fonte da voz de quem escreve?', [], 'grande'),
        q(6, 'revisao', 'Reescreva o Uso C de modo eticamente adequado, indicando a fonte e escolhendo citação ou paráfrase.', [], 'medio'),
        q(7, 'aplicacao', 'Escreva uma frase de comentário próprio após o Uso A, deixando claro que a interpretação é sua e não parte da citação.', [], 'medio'),
        q(8, 'producao', 'Produza um parágrafo de quatro linhas sobre a ampliação do horário da biblioteca. Use uma informação da fonte de forma marcada e acrescente uma conclusão própria.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) citação direta marcada por aspas e referência à fonte.', 'O trecho reproduz palavras da fonte e identifica sua origem.'),
        a(2, 'Verdadeiro.', 'A informação é reescrita com outras palavras e introduzida por referência ao relatório.'),
        a(3, 'O Uso C reproduz praticamente as palavras da fonte sem atribuí-las ao relatório e ainda apresenta a informação como descoberta própria.', 'A resposta deve reconhecer confusão/apagamento de autoria e falta de marcação da fonte.'),
        a(4, 'A) “De acordo com o relatório”.', 'A expressão atribui explicitamente a informação à fonte.'),
        a(5, 'O Uso A separa a voz da fonte com aspas; o Uso B reformula o conteúdo e usa uma expressão de atribuição. Nos dois casos, a origem é identificada.', 'A resposta deve diferenciar citação e paráfrase.'),
        a(6, 'Resposta possível: “Segundo o Relatório da Biblioteca, os empréstimos aumentaram depois da ampliação do atendimento para o intervalo do almoço.”', 'Aceitar citação ou paráfrase fiel, desde que a fonte seja indicada.'),
        a(7, 'Resposta possível: “Esse resultado sugere que a disponibilidade de horário pode facilitar o acesso dos estudantes ao acervo.”', 'O comentário deve ser claramente apresentado como interpretação, não como parte da fala citada.'),
        a(8, 'Resposta autoral com atribuição da informação à fonte e conclusão própria distinguível.', 'Avaliar fidelidade à fonte, marcação de vozes e consistência da conclusão.')
      ],
      possuiFiguras: false, figuras: [], possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Usar três etiquetas: PALAVRAS DA FONTE, IDEIA DA FONTE EM OUTRAS PALAVRAS e MINHA INTERPRETAÇÃO. Classificar cada trecho antes de escrever.' },
      ilustracao: noRequiredIllustration, revisao: reviewed
    },

    'em-1s-b1-lingua-portuguesa-25-leitura-critica-producao-textual': {
      titulo: 'Argumentar para decidir: tempo de leitura na rotina escolar',
      tema: 'Tese, sustentação, contra-argumentação e negociação em proposta de organização escolar.',
      objetivo: 'Analisar movimentos argumentativos e produzir posicionamento sustentado, mobilizando a habilidade EM13LP05.',
      instrucaoGeral: 'Leia duas propostas apresentadas em uma reunião fictícia. Identifique teses, argumentos, objeções e possibilidades de negociação.',
      textoApoio: {
        titulo: 'Duas propostas para o momento de leitura',
        conteudo: 'PROPOSTA A\nA escola deveria reservar quinze minutos de leitura silenciosa duas vezes por semana. Esse tempo garantiria uma oportunidade regular para estudantes que dizem não conseguir incluir leitura na rotina. É verdade que a grade já é apertada; por isso, a proposta sugere começar com um projeto-piloto de um mês e avaliar seus efeitos antes de torná-lo permanente.\n\nPROPOSTA B\nCriar um horário obrigatório pode reduzir a leitura a mais uma tarefa. Em vez disso, a escola poderia abrir a biblioteca em horários ampliados e promover rodas voluntárias. Reconheço que um tempo comum facilita a participação de todos, mas considero importante preservar alguma escolha sobre quando e o que ler.'
      },
      questoes: [
        q(1, 'multipla-escolha', 'Qual é a tese principal da Proposta A?', ['Reservar quinze minutos de leitura silenciosa duas vezes por semana.', 'Fechar a biblioteca no intervalo.', 'Eliminar qualquer atividade de leitura.', 'Substituir todas as aulas por rodas de conversa.'], 'pequeno'),
        q(2, 'verdadeiro-falso', 'Marque Verdadeiro ou Falso: a Proposta A reconhece uma objeção e responde a ela com a ideia de projeto-piloto.', ['Verdadeiro', 'Falso'], 'pequeno'),
        q(3, 'discursiva', 'Qual argumento central a Proposta B usa contra a obrigatoriedade do horário?', [], 'medio'),
        q(4, 'multipla-escolha', 'Em “Reconheço que um tempo comum facilita... mas...”, a Proposta B realiza:', ['negociação/concessão seguida de contraponto.', 'ataque pessoal.', 'mudança para assunto sem relação.', 'citação de dado estatístico.'], 'pequeno'),
        q(5, 'analise', 'Identifique um ponto de conflito e um ponto de possível acordo entre as duas propostas.', [], 'grande'),
        q(6, 'associacao', 'Associe: 1. “a grade já é apertada”; 2. “projeto-piloto de um mês”; 3. “Reconheço que...” ; 4. “pode reduzir a leitura a mais uma tarefa”. Alternativas: objeção; resposta/negociação; concessão; contra-argumento.', ['1 — objeção', '2 — resposta/negociação', '3 — concessão', '4 — contra-argumento'], 'pequeno'),
        q(7, 'aplicacao', 'Escreva uma proposta de negociação que aproveite ao menos um elemento de A e um de B.', [], 'medio'),
        q(8, 'producao', 'Produza um parágrafo defendendo uma forma de ampliar a leitura na escola. Inclua tese, argumento, reconhecimento de uma objeção e resposta a ela.', [], 'grande')
      ],
      gabarito: [
        a(1, 'A) Reservar quinze minutos de leitura silenciosa duas vezes por semana.', 'Essa é a ação central defendida no início da proposta.'),
        a(2, 'Verdadeiro.', 'A fala reconhece a limitação da grade e propõe teste temporário antes de adoção permanente.'),
        a(3, 'A Proposta B argumenta que tornar o horário obrigatório pode transformar a leitura em mais uma tarefa, reduzindo a autonomia do estudante.', 'A resposta deve recuperar o argumento expresso no texto.'),
        a(4, 'A) negociação/concessão seguida de contraponto.', 'A fala reconhece uma vantagem da outra posição e depois apresenta sua ressalva.'),
        a(5, 'Conflito: obrigatoriedade de um tempo comum versus maior liberdade de escolha. Acordo possível: ambas buscam ampliar oportunidades de leitura e admitem medidas de acesso/participação.', 'Aceitar pontos equivalentes sustentados pelo material.'),
        a(6, '1 — objeção; 2 — resposta/negociação; 3 — concessão; 4 — contra-argumento.', 'Os trechos cumprem movimentos argumentativos distintos.'),
        a(7, 'Resposta possível: testar por um mês um momento comum de leitura em um dos dias e, ao mesmo tempo, ampliar o horário da biblioteca e manter rodas voluntárias.', 'A proposta precisa integrar elementos reconhecíveis das duas posições.'),
        a(8, 'Resposta autoral com tese clara, argumento pertinente, objeção reconhecida e resposta coerente.', 'Avaliar estrutura argumentativa e mecanismos linguísticos, não a posição escolhida.')
      ],
      possuiFiguras: false, figuras: [], possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Organizar cada proposta em quatro caixas: O QUE DEFENDE, POR QUÊ, QUAL OBJEÇÃO RECONHECE e COMO RESPONDE. Depois formular a própria posição.' },
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
