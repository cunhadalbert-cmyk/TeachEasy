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

  const meta = {
    EM13LP01: {
      tema: 'Condições de produção, circulação, público, finalidade e suporte.',
      foco: 'as condições de produção e circulação',
      objetivo: 'Relacionar escolhas de linguagem ao público, à finalidade, ao suporte e ao papel social do enunciador.',
      mc: 'Qual fator explica melhor diferenças de linguagem entre versões de um mesmo conteúdo?',
      opcoes: ['O público, a finalidade e o meio de circulação previstos.', 'A quantidade de letras usadas.', 'A obrigação de todo texto ter o mesmo tom.', 'Somente a preferência pessoal do leitor.'],
      aplicacao: 'Qual procedimento aplica melhor a análise das condições de produção?',
      aplicacaoOpcoes: ['Identificar quem escreve, para quem, com qual objetivo e em qual suporte.', 'Contar apenas o número de linhas.', 'Ignorar o destinatário.', 'Avaliar somente a ortografia.'],
      associacao: ['1 — autor/enunciador: quem assume a voz', '2 — público: destinatário previsto', '3 — finalidade: objetivo comunicativo', '4 — suporte: meio de circulação']
    },
    EM13LP02: {
      tema: 'Coesão, progressão temática, conectivos e retomadas.',
      foco: 'a coesão e a progressão das ideias',
      objetivo: 'Estabelecer relações entre partes do texto por meio de conectivos, retomadas e organização lógico-discursiva.',
      mc: 'Qual recurso contribui diretamente para ligar ideias em um texto?',
      opcoes: ['Conectivos e expressões de retomada usados de acordo com o sentido.', 'Frases colocadas ao acaso.', 'Repetição integral de tudo o que já foi dito.', 'Retirada de qualquer referência ao tema anterior.'],
      aplicacao: 'Qual revisão tende a melhorar a progressão temática?',
      aplicacaoOpcoes: ['Explicitar relações de causa, consequência, oposição ou conclusão.', 'Apagar todos os conectivos.', 'Trocar o assunto a cada frase.', 'Repetir o mesmo período sem mudança.'],
      associacao: ['1 — porque: causa', '2 — por isso: consequência', '3 — porém: oposição', '4 — essa medida: retomada']
    },
    EM13LP03: {
      tema: 'Intertextualidade, transformação de enunciados e diálogo entre textos.',
      foco: 'a relação intertextual',
      objetivo: 'Analisar como um texto retoma, transforma ou alude a outro para produzir novos sentidos e posicionamentos.',
      mc: 'O que caracteriza uma relação intertextual?',
      opcoes: ['A retomada reconhecível de outro texto ou enunciado para construir novo sentido.', 'A ausência de qualquer referência anterior.', 'Somente o tamanho parecido entre dois textos.', 'A repetição acidental de uma palavra comum.'],
      aplicacao: 'Qual procedimento produz intertextualidade de forma consciente?',
      aplicacaoOpcoes: ['Retomar um enunciado conhecido e transformá-lo com nova finalidade.', 'Copiar sem indicar qualquer relação.', 'Mudar de assunto completamente.', 'Eliminar todo traço reconhecível do texto anterior.'],
      associacao: ['1 — paráfrase: reformulação', '2 — transformação/paródia: recriação', '3 — citação: reprodução marcada', '4 — alusão: referência indireta']
    },
    EM13LP04: {
      tema: 'Citação, paráfrase, atribuição de fonte e diálogo entre vozes.',
      foco: 'o uso marcado de citação e paráfrase',
      objetivo: 'Integrar informações e vozes de outras fontes ao texto, preservando atribuição, fidelidade e responsabilidade autoral.',
      mc: 'Qual diferença básica existe entre citação direta e paráfrase?',
      opcoes: ['A citação reproduz palavras da fonte com marcação; a paráfrase reformula a ideia e também indica a origem.', 'A paráfrase dispensa referência.', 'A citação permite alterar livremente o texto original.', 'As duas formas significam copiar sem crédito.'],
      aplicacao: 'Qual procedimento é adequado ao reformular uma informação de outra fonte?',
      aplicacaoOpcoes: ['Manter a ideia essencial com redação própria e atribuir a origem.', 'Copiar literalmente sem aspas.', 'Inventar dados adicionais.', 'Apagar a fonte.'],
      associacao: ['1 — citação direta: reprodução marcada', '2 — paráfrase: reformulação atribuída', '3 — referência: identificação da fonte', '4 — plágio: apropriação sem crédito']
    },
    EM13LP05: {
      tema: 'Tese, argumentos, contra-argumentação, refutação e força das evidências.',
      foco: 'a construção e avaliação de argumentos',
      objetivo: 'Analisar posições, argumentos, contra-argumentos e estratégias de refutação, considerando a qualidade das evidências.',
      mc: 'O que torna um argumento mais consistente?',
      opcoes: ['Uma razão ligada à tese e apoiada por evidência pertinente.', 'Uma afirmação repetida sem justificativa.', 'Um ataque pessoal.', 'Uma frase sem relação com a questão.'],
      aplicacao: 'Qual ação corresponde à refutação?',
      aplicacaoOpcoes: ['Responder a uma objeção mostrando limite, inconsistência ou evidência contrária.', 'Ignorar totalmente a objeção.', 'Mudar de assunto.', 'Repetir a tese sem raciocínio novo.'],
      associacao: ['1 — tese: posição central', '2 — argumento: razão/evidência', '3 — contra-argumento: objeção', '4 — refutação: resposta à objeção']
    },
    EM13LP06: {
      tema: 'Efeitos de sentido produzidos por repetição, contraste, ritmo, ordem e escolha lexical.',
      foco: 'os usos expressivos da linguagem',
      objetivo: 'Analisar como escolhas lexicais e de organização produzem ênfase, contraste, ritmo e outros efeitos de sentido.',
      mc: 'Qual recurso pode aumentar a ênfase sem acrescentar um novo dado factual?',
      opcoes: ['Repetição intencional de uma palavra ou estrutura.', 'Troca aleatória do assunto.', 'Eliminação de toda pontuação.', 'Retirada de qualquer relação com o leitor.'],
      aplicacao: 'Em um texto persuasivo, o contraste “não X, mas Y” tende a:',
      aplicacaoOpcoes: ['Opor ideias e destacar a segunda.', 'Apagar o posicionamento.', 'Indicar apenas uma data.', 'Transformar o trecho em lista neutra.'],
      associacao: ['1 — repetição: ênfase', '2 — contraste: oposição', '3 — pergunta retórica: provocação do leitor', '4 — frase curta: impacto e ritmo']
    },
    EM13LP07: {
      tema: 'Modalização: certeza, possibilidade, probabilidade, obrigação e avaliação.',
      foco: 'os modalizadores e o grau de compromisso do enunciador',
      objetivo: 'Analisar marcas de modalização e empregar graus de certeza, possibilidade e avaliação de modo coerente com as evidências.',
      mc: 'Qual expressão indica possibilidade, e não certeza absoluta?',
      opcoes: ['Talvez.', 'Sem dúvida alguma.', 'Obrigatoriamente.', 'É impossível.'],
      aplicacao: 'Ao trocar “certamente” por “provavelmente”, o enunciador:',
      aplicacaoOpcoes: ['Reduz o grau de certeza assumido.', 'Transforma a frase em ordem.', 'Elimina o verbo principal.', 'Passa a citar outra pessoa.'],
      associacao: ['1 — talvez: possibilidade', '2 — provavelmente: probabilidade', '3 — deve: obrigação/recomendação', '4 — infelizmente: avaliação apreciativa']
    },
    EM13LP08: {
      tema: 'Sintaxe, ordem dos constituintes, coordenação, subordinação e ambiguidade.',
      foco: 'a organização sintática e seus efeitos de sentido',
      objetivo: 'Analisar como ordem dos termos e relações entre orações interferem em clareza, foco e interpretação.',
      mc: 'Uma mudança na ordem dos termos de uma frase pode:',
      opcoes: ['Alterar destaque, clareza ou produzir ambiguidade, conforme o contexto.', 'Mudar automaticamente o assunto.', 'Eliminar a necessidade de verbo.', 'Tornar toda frase incorreta.'],
      aplicacao: 'Qual revisão tende a reduzir uma ambiguidade?',
      aplicacaoOpcoes: ['Aproximar o termo modificador do elemento a que ele se refere.', 'Afastar ainda mais o termo do referente.', 'Eliminar todos os conectivos.', 'Acrescentar palavras sem relação com a frase.'],
      associacao: ['1 — porque: causa', '2 — embora: concessão', '3 — se: condição', '4 — portanto: conclusão']
    },
    EM13LP12: {
      tema: 'Seleção, avaliação e uso referenciado de fontes confiáveis.',
      foco: 'a confiabilidade e a pertinência das fontes',
      objetivo: 'Selecionar informações, dados e argumentos verificáveis e adequados ao objetivo de uma produção.',
      mc: 'Qual critério é mais importante ao escolher uma fonte para fundamentar um texto?',
      opcoes: ['Autoria identificável, origem ou método dos dados e relação com a questão investigada.', 'Número de curtidas isoladamente.', 'Título chamativo sem indicação de origem.', 'Mensagem anônima sem possibilidade de verificação.'],
      aplicacao: 'Ao usar um dado de fonte confiável, o estudante deve:',
      aplicacaoOpcoes: ['Indicar a origem e integrar o dado ao raciocínio.', 'Apresentar o dado como se fosse próprio.', 'Omitir a fonte.', 'Alterar o número para fortalecer a tese.'],
      associacao: ['1 — registro institucional: dado administrativo', '2 — pesquisa com método: evidência pesquisável', '3 — postagem anônima: baixa verificabilidade factual', '4 — opinião identificada: perspectiva declarada']
    },
    EM13LP15: {
      tema: 'Planejamento, produção, revisão, reescrita, edição e adequação ao contexto.',
      foco: 'o processo de planejamento e revisão textual',
      objetivo: 'Planejar, produzir, revisar e editar textos considerando gênero, público, finalidade, suporte e correção linguística.',
      mc: 'Qual etapa deve ocorrer antes da versão final de um texto?',
      opcoes: ['Planejamento e revisão orientados por objetivo, público e gênero.', 'Publicação imediata do primeiro rascunho.', 'Retirada das informações essenciais.', 'Troca aleatória de gênero textual.'],
      aplicacao: 'Uma lista de revisão é útil porque:',
      aplicacaoOpcoes: ['Transforma critérios de qualidade em pontos verificáveis antes da publicação.', 'Substitui a necessidade de ler o texto.', 'Garante que todos os textos sejam idênticos.', 'Serve apenas para contar palavras.'],
      associacao: ['1 — planejar: definir objetivo e estrutura', '2 — redigir: produzir rascunho', '3 — revisar: avaliar e reescrever', '4 — editar/publicar: preparar versão final']
    }
  };

  const defs = [
    ['em-1s-b1-lingua-portuguesa-31-mapa-conceitual-analise-linguistica','EM13LP01','O mesmo aviso em dois contextos de circulação','Mural ou grupo de mensagens?','VERSÃO A — AVISO NO MURAL\nReunião do conselho de representantes de turma: quarta-feira, às 13h30, na sala 12. Cada turma deve enviar um representante com as sugestões registradas pela classe. A pauta será: uso dos espaços comuns, calendário cultural e propostas para a biblioteca.\n\nVERSÃO B — MENSAGEM NO GRUPO DOS REPRESENTANTES\nPessoal, lembrete da reunião de quarta, 13h30, sala 12. Levem as sugestões da turma, porque vamos fechar propostas sobre espaços comuns, calendário cultural e biblioteca. Quem não puder ir, avise antes para a turma indicar outra pessoa.\n\nAs duas versões comunicam o mesmo encontro, mas foram planejadas para públicos e meios de circulação diferentes.'],
    ['em-1s-b1-lingua-portuguesa-32-estudo-de-caso-analise-linguistica','EM13LP02','Coesão na revisão de um comunicado','Da sequência solta ao texto articulado','RASCUNHO\nA feira de profissões será na sexta-feira. Os estudantes devem levar perguntas. Os convidados falarão de suas áreas. Isso ajudará na escolha. O evento termina às 16h.\n\nVERSÃO REVISADA\nA feira de profissões será na sexta-feira e reunirá convidados de diferentes áreas. Como os estudantes poderão fazer perguntas diretamente aos profissionais, recomenda-se que preparem suas dúvidas com antecedência. Essa participação ativa poderá ajudar na reflexão sobre escolhas de estudo e trabalho. Por isso, o evento foi organizado até as 16h, com intervalos entre as mesas de conversa.\n\nA revisão cria relações mais claras entre as informações e usa expressões que retomam ideias anteriores.'],
    ['em-1s-b1-lingua-portuguesa-33-investigacao-analise-linguistica','EM13LP03','Intertextualidade em campanha de estudos','Do provérbio à campanha','ENUNCIADO CONHECIDO\n“Água mole em pedra dura, tanto bate até que fura.”\n\nNOVA VERSÃO — CAMPANHA DE ESTUDOS\n“Revisão curta, todo dia: pouco a pouco, o conteúdo fica.”\n\nA campanha não copia o provérbio palavra por palavra. Ela recupera a ideia de persistência e repetição para defender uma rotina de estudo distribuída ao longo da semana. O efeito depende de o leitor reconhecer a lógica do enunciado conhecido e perceber como ela foi deslocada para outro contexto.'],
    ['em-1s-b1-lingua-portuguesa-34-situacao-problema-analise-linguistica','EM13LP04','Citação e paráfrase sem apagar a fonte','Três modos de apresentar a mesma informação','FONTE — PESQUISA INTERNA DA ESCOLA\nEm uma consulta didática realizada com 120 estudantes do Ensino Médio, 78 disseram que conseguem se concentrar melhor quando deixam notificações do celular desativadas durante períodos curtos de estudo. A pesquisa foi organizada pela equipe pedagógica para uma atividade de leitura de dados; seus resultados valem apenas para o grupo consultado.\n\nTEXTO A — CITAÇÃO\nSegundo a síntese da pesquisa, “78 estudantes disseram que conseguem se concentrar melhor quando deixam notificações do celular desativadas durante períodos curtos de estudo”.\n\nTEXTO B — PARÁFRASE\nA consulta interna indica que a maioria dos participantes relatou melhor concentração ao estudar por períodos curtos sem notificações, conforme dados da equipe pedagógica.'],
    ['em-1s-b1-lingua-portuguesa-35-leitura-critica-analise-linguistica','EM13LP05','Analisando a força de argumentos sobre rotina de estudos','Duas posições sobre a rotina de estudos','QUESTÃO EM DEBATE\nA escola deve reservar um período semanal de estudo orientado sem tarefas para casa?\n\nPOSIÇÃO A\nSim. Um período orientado na própria escola pode reduzir dúvidas acumuladas e permitir que estudantes usem materiais e apoio docente. Como exemplo, turmas que já realizam plantões relatam maior procura por esclarecimento antes das avaliações.\n\nPOSIÇÃO B\nA proposta pode ajudar, mas não deveria eliminar totalmente tarefas de continuidade. Algumas atividades feitas fora da aula permitem leitura mais longa e treino individual. O problema, portanto, não é apenas existir tarefa, mas sua quantidade, finalidade e acompanhamento.\n\nAs duas posições apresentam razões diferentes e reconhecem limites que precisam ser analisados.'],
    ['em-1s-b1-lingua-portuguesa-36-debate-analise-linguistica','EM13LP06','Como a forma muda o impacto de um convite','Um convite neutro e um convite expressivo','VERSÃO A\nUse a biblioteca no intervalo. Há livros, mesas e espaço para leitura.\n\nVERSÃO B\nNo intervalo, abra espaço para outra coisa: abra um livro.\nCinco minutos de leitura. Dez páginas de descoberta.\nA biblioteca não é só uma sala; é uma porta aberta dentro da escola.\n\nA segunda versão utiliza repetição de “abra”, frases curtas, paralelismo e uma metáfora para produzir ritmo e aproximação. O conteúdo central continua sendo o convite ao uso da biblioteca, mas a forma busca maior impacto.'],
    ['em-1s-b1-lingua-portuguesa-37-oficina-analise-linguistica','EM13LP07','Modalizadores e grau de certeza em uma nota escolar','O que sabemos e o que ainda é possibilidade','NOTA SOBRE UMA POSSÍVEL MUDANÇA DE HORÁRIO\nA direção informou que o horário da mostra cultural poderá ser alterado se a previsão de chuva forte se confirmar. Segundo a comissão organizadora, provavelmente haverá uma decisão definitiva até quinta-feira. Caso seja necessário mudar a programação, as apresentações deverão ocorrer no ginásio. A equipe considera importante evitar afirmações categóricas antes da atualização meteorológica e, por isso, utiliza expressões de possibilidade e probabilidade.\n\nVERSÃO EXAGERADA\nA mostra certamente será transferida e, sem dúvida alguma, todas as atividades ocorrerão no ginásio.\n\nA segunda formulação apresenta um grau de certeza maior do que as informações disponíveis permitem.'],
    ['em-1s-b1-lingua-portuguesa-38-analise-de-dados-analise-linguistica','EM13LP08','Sintaxe e ambiguidade: quem faz o quê?','Duas leituras possíveis, duas revisões','VERSÃO AMBÍGUA\nA coordenadora informou aos alunos que apresentariam os trabalhos na sexta-feira.\n\nA frase permite duas leituras: quem apresentará os trabalhos — a coordenadora ou os alunos?\n\nVERSÃO REVISADA 1\nA coordenadora informou aos alunos que eles apresentariam os trabalhos na sexta-feira.\n\nVERSÃO REVISADA 2\nA coordenadora informou que apresentaria os trabalhos aos alunos na sexta-feira.\n\nOutro exemplo: “Somente na biblioteca os estudantes poderão consultar os mapas antigos.” A posição de “somente” define aquilo que está sendo restringido e pode alterar o foco da mensagem.'],
    ['em-1s-b1-lingua-portuguesa-39-projeto-aplicado-analise-linguistica','EM13LP12','Escolhendo fontes para falar de hábitos de leitura','Três fontes, três níveis de evidência','DOSSIÊ DIDÁTICO — HÁBITOS DE LEITURA NA ESCOLA\n\nFONTE A — REGISTRO DA BIBLIOTECA\nO sistema de empréstimos registrou 412 retiradas de livros no primeiro bimestre e 537 no segundo. Os números informam movimentação do acervo, mas não revelam sozinhos quanto cada estudante leu.\n\nFONTE B — QUESTIONÁRIO COM MÉTODO DESCRITO\nEm uma atividade de pesquisa, 180 estudantes responderam anonimamente a um questionário com as mesmas cinco perguntas. 64% disseram ler ao menos um texto não obrigatório por semana. O resultado se refere apenas aos participantes.\n\nFONTE C — POSTAGEM ANÔNIMA\n“Todo mundo na escola odeia ler. Ninguém pega livro nenhum.”\n\nAs três fontes têm naturezas e níveis de verificabilidade diferentes.'],
    ['em-1s-b1-lingua-portuguesa-40-sintese-autoral-analise-linguistica','EM13LP15','Do rascunho à publicação: revisão orientada','Feira de Ciências: antes e depois da revisão','SITUAÇÃO\nA turma publicará no site da escola um texto curto apresentando a nova feira de ciências.\n\nRASCUNHO\nVai ter feira de ciências e vai ser legal. Os trabalhos são de várias turmas. Quem quiser pode ir. Vai ter experiências e apresentações.\n\nLISTA DE REVISÃO\n1. O texto informa data, horário e local?\n2. O público está claramente convidado?\n3. Há repetição desnecessária de “vai”?\n4. A linguagem combina com o site institucional?\n5. O título ajuda o leitor a identificar o evento?\n\nVERSÃO REVISADA\nFeira de Ciências reúne projetos de diferentes turmas. Na sexta-feira, das 9h às 16h, o ginásio da escola receberá experiências e apresentações produzidas por estudantes. A comunidade escolar está convidada a visitar os projetos e conversar com as equipes participantes.'],
    ['em-1s-b1-lingua-portuguesa-41-mapa-conceitual-argumentacao','EM13LP01','A mesma proposta em dois espaços de argumentação','Conselho ou postagem?','VERSÃO A — FALA NO CONSELHO ESCOLAR\nSenhores representantes, proponho que o pátio coberto permaneça aberto durante parte do contraturno. A medida pode ampliar o espaço de estudo e convivência, desde que haja regras de uso e supervisão definidas.\n\nVERSÃO B — POSTAGEM DO GRÊMIO\nMais espaço para estudar depois da aula? A proposta é abrir o pátio coberto no contraturno, com regras claras e acompanhamento. Se você apoia a ideia, mande sua sugestão para o grêmio.\n\nAs duas versões defendem a mesma proposta, mas uma circula em reunião formal e a outra busca mobilizar estudantes em rede social.'],
    ['em-1s-b1-lingua-portuguesa-42-estudo-de-caso-argumentacao','EM13LP02','Coesão em um parágrafo argumentativo','Da lista de ideias ao raciocínio argumentativo','RASCUNHO\nA escola precisa de mais bebedouros. Há filas. Os intervalos são curtos. Alguns estudantes levam garrafa. A proposta é importante.\n\nVERSÃO REVISADA\nA escola precisa ampliar os pontos de água porque, nos intervalos, formam-se filas nos poucos bebedouros disponíveis. Como o tempo é curto, parte dos estudantes deixa de abastecer a garrafa. Por isso, instalar ao menos um novo ponto próximo ao ginásio reduziria o deslocamento e distribuiria melhor a demanda. Essa medida não elimina a necessidade de manutenção dos equipamentos atuais, mas enfrenta um problema identificado na rotina.\n\nA revisão articula tese, causa, consequência, proposta e ressalva.'],
    ['em-1s-b1-lingua-portuguesa-43-investigacao-argumentacao','EM13LP03','Intertextualidade para sustentar um posicionamento','Do ditado ao argumento','ENUNCIADO CONHECIDO\n“Quem espera sempre alcança.”\n\nNOVA VERSÃO — CAMPANHA DO GRÊMIO\n“Quem participa também alcança.”\n\nA frase aparece em uma campanha para incentivar estudantes a comparecerem às assembleias do grêmio. A nova versão preserva parte da estrutura do ditado, mas troca a ideia de esperar pela de participar. Com isso, constrói um posicionamento: mudanças na escola dependem também de envolvimento coletivo, não apenas de expectativa.'],
    ['em-1s-b1-lingua-portuguesa-44-situacao-problema-argumentacao','EM13LP04','Usando citação e paráfrase para sustentar um argumento','Uma evidência, duas formas de incorporar','FONTE — RELATÓRIO DO PROJETO HORTA ESCOLAR\nNo primeiro semestre, 86 estudantes participaram de ao menos uma atividade da horta, e 9 turmas utilizaram o espaço em aulas de Ciências, Matemática ou Língua Portuguesa. O relatório registra também dificuldades de manutenção nos fins de semana.\n\nTRECHO ARGUMENTATIVO COM CITAÇÃO\nO projeto merece continuidade porque já integra diferentes áreas. O relatório registra que “9 turmas utilizaram o espaço em aulas” no primeiro semestre.\n\nTRECHO ARGUMENTATIVO COM PARÁFRASE\nAlém da participação estudantil, os registros do projeto mostram uso pedagógico por nove turmas, embora o próprio relatório aponte desafios de manutenção nos fins de semana.'],
    ['em-1s-b1-lingua-portuguesa-45-leitura-critica-argumentacao','EM13LP05','Tese, contra-argumento e refutação no debate sobre celulares','Celular em aula: argumentos em confronto','QUESTÃO EM DEBATE\nCelulares devem ficar sempre guardados durante as aulas?\n\nPOSIÇÃO A\nManter os aparelhos guardados durante explicações e atividades que exigem concentração reduz interrupções e facilita o acompanhamento coletivo. Quando houver finalidade pedagógica definida, o professor pode autorizar o uso.\n\nPOSIÇÃO B\nUma proibição absoluta desconsidera usos legítimos, como fotografar uma experiência autorizada, acessar um dicionário ou responder a uma atividade digital. O mais adequado seria combinar momentos de uso e de guarda.\n\nCONTRA-ARGUMENTO\nMesmo com regras, notificações podem distrair.\n\nRESPOSTA\nPor isso, o uso pedagógico precisa ocorrer com notificações silenciadas e objetivo previamente indicado.'],
    ['em-1s-b1-lingua-portuguesa-46-debate-argumentacao','EM13LP06','Recursos expressivos que fortalecem um argumento','Da afirmação geral ao apelo argumentativo','VERSÃO A\nPrecisamos cuidar melhor dos espaços comuns da escola.\n\nVERSÃO B\nEspaço comum não é espaço de ninguém. É espaço de todos. Se a mesa fica riscada, quem perde? Se o pátio fica sujo, quem usa depois? Cuidar não é favor: é parte do uso.\n\nA segunda versão emprega contraste, repetição estrutural e perguntas retóricas para transformar uma afirmação geral em apelo argumentativo. As perguntas não buscam apenas uma resposta literal; elas conduzem o leitor a refletir sobre responsabilidade compartilhada.'],
    ['em-1s-b1-lingua-portuguesa-47-oficina-argumentacao','EM13LP07','Modalização e responsabilidade em um argumento','Quanto de certeza o argumento pode assumir?','AFIRMAÇÕES SOBRE INÍCIO DAS AULAS\n1. “Começar as aulas mais tarde certamente melhora o desempenho de todos.”\n2. “Começar as aulas um pouco mais tarde pode favorecer o descanso de parte dos estudantes, mas o efeito depende de transporte, rotina familiar e organização da escola.”\n3. “Talvez um projeto-piloto permita avaliar resultados antes de uma mudança permanente.”\n\nA primeira afirmação apresenta certeza absoluta e generalização. As demais usam modalizadores como “pode” e “talvez” para ajustar o grau de compromisso às limitações da evidência e às condições concretas da proposta.'],
    ['em-1s-b1-lingua-portuguesa-48-analise-de-dados-argumentacao','EM13LP08','Sintaxe que organiza relações argumentativas','A mesma questão, diferentes relações sintáticas','VERSÃO 1\nEmbora a escola tenha ampliado o número de lixeiras, ainda há descarte incorreto porque parte dos recipientes não possui identificação visível.\n\nVERSÃO 2\nA escola ampliou o número de lixeiras. Ainda há descarte incorreto. Parte dos recipientes não possui identificação visível.\n\nVERSÃO 3\nSe os recipientes forem identificados por tipo de resíduo, será mais fácil escolher o descarte adequado; portanto, a sinalização deve acompanhar a ampliação das lixeiras.\n\nAs três versões tratam do mesmo problema, mas usam estruturas sintáticas diferentes para explicitar concessão, causa, condição e conclusão.'],
    ['em-1s-b1-lingua-portuguesa-49-projeto-aplicado-argumentacao','EM13LP12','Fontes confiáveis para sustentar uma proposta ambiental','Dossiê de evidências sobre resíduos','DOSSIÊ DIDÁTICO — RESÍDUOS NA ESCOLA\n\nFONTE A — REGISTRO DA EQUIPE DE LIMPEZA\nDurante cinco dias de observação, a equipe registrou que as lixeiras próximas à cantina encheram antes das demais em quatro dias. O registro descreve local e período observados, mas não mede o peso dos resíduos.\n\nFONTE B — PESAGEM DA COLETA SELETIVA\nEm duas semanas de projeto-piloto, foram separados 28 kg de papel e 19 kg de plástico. Os valores constam em planilha do projeto com datas de pesagem.\n\nFONTE C — COMENTÁRIO ANÔNIMO\n“A escola nunca recicla nada e todo lixo vai para o mesmo lugar.”\n\nO dossiê permite discutir quais afirmações cada fonte realmente pode sustentar e quais limites precisam ser reconhecidos.'],
    ['em-1s-b1-lingua-portuguesa-50-sintese-autoral-argumentacao','EM13LP15','Síntese final: planejar, argumentar e revisar','Desafio final de argumentação','PROPOSTA FINAL\nEscreva um texto argumentativo curto para o mural digital da escola sobre a questão: “Como reduzir o desperdício de papel sem prejudicar atividades pedagógicas?”\n\nDOSSIÊ\nDADO 1 — A secretaria registrou maior consumo de papel nas semanas de provas impressas.\nDADO 2 — Em um teste de duas turmas, rascunhos foram impressos em frente e verso e o consumo caiu, sem eliminar as cópias necessárias.\nPONTO DE VISTA DE UM PROFESSOR — Algumas atividades precisam de folha física, especialmente quando há desenho, anotação manual ou dificuldade de acesso a dispositivos.\nPONTO DE VISTA DE ESTUDANTES — Materiais digitais ajudam em alguns casos, mas nem todos conseguem estudar bem apenas pela tela.\n\nLISTA DE REVISÃO\nA tese responde à questão? Há ao menos uma evidência do dossiê? O texto reconhece uma limitação ou contra-argumento? Os conectivos organizam o raciocínio? A proposta final é viável e respeita necessidades diferentes?']
  ];

  function build(def) {
    const [id, code, titulo, textoTitulo, texto] = def;
    const m = meta[code];
    return [id, {
      titulo,
      tema: m.tema,
      objetivo: `${m.objetivo} Habilidade preservada: ${code}.`,
      instrucaoGeral: `Leia o material de apoio e responda às oito questões, concentrando-se em ${m.foco}.`,
      textoApoio: { titulo: textoTitulo, conteudo: texto },
      questoes: [
        q(1,'multipla-escolha',m.mc,m.opcoes,'pequeno'),
        q(2,'verdadeiro-falso',`Marque Verdadeiro ou Falso: o material permite analisar ${m.foco} a partir de evidências presentes no próprio texto.`,['Verdadeiro','Falso'],'pequeno'),
        q(3,'discursiva',`Localize no material um exemplo relacionado a ${m.foco} e explique sua função no contexto.`),
        q(4,'multipla-escolha',m.aplicacao,m.aplicacaoOpcoes,'pequeno'),
        q(5,'analise',`Compare duas partes do material e explique como elas ajudam a compreender ${m.foco}.`,[],'grande'),
        q(6,'associacao',`Associe corretamente os quatro conceitos ligados a ${m.foco}.`,m.associacao,'pequeno'),
        q(7,'revisao',`Reescreva ou revise um trecho do material para tornar mais claro o uso de ${m.foco}, sem alterar a informação principal.`),
        q(8,'producao',`Produza um pequeno texto relacionado à situação apresentada, aplicando conscientemente ${m.foco}.`,[],'grande')
      ],
      gabarito: [
        a(1,`A) ${m.opcoes[0]}`,'A primeira alternativa corresponde ao conceito central trabalhado pela habilidade.'),
        a(2,'Verdadeiro.','As questões foram construídas para depender do material de apoio e de suas evidências.'),
        a(3,`Resposta que cite um elemento real do material e explique sua relação com ${m.foco}.`,'Não basta nomear o recurso; é necessário explicar sua função no contexto.'),
        a(4,`A) ${m.aplicacaoOpcoes[0]}`,'A primeira alternativa apresenta o procedimento compatível com a habilidade.'),
        a(5,`Resposta comparativa apoiada em duas partes do material, relacionando-as a ${m.foco}.`,'Avaliar se a interpretação está sustentada pelo texto.'),
        a(6,m.associacao.join('; '),'A associação reúne os quatro conceitos fundamentais trabalhados na atividade.'),
        a(7,`Revisão coerente que torne mais claro o emprego de ${m.foco} sem distorcer o conteúdo.`,'Aceitar diferentes reescritas quando preservarem o sentido e melhorarem a adequação.'),
        a(8,`Produção autoral coerente com a situação e com ${m.foco}.`,'Avaliar aplicação consciente do conteúdo, clareza e adequação ao contexto.')
      ],
      possuiFiguras: false,
      figuras: [],
      possuiVersaoAdaptada: true,
      versaoAdaptada: { orientacao: 'Destacar palavras-chave, dividir as oito questões em etapas curtas e permitir resposta oral ou por tópicos antes da escrita final.' },
      ilustracao: noRequiredIllustration,
      revisao: reviewed
    }];
  }

  const overrides = Object.fromEntries(defs.map(build));

  function mergeActivity(activity, patch) {
    return { ...activity, ...patch, bncc: activity.bncc, quantidadeQuestoes: 8, possuiGabarito: true, revisao: { ...activity.revisao, ...patch.revisao }, ilustracao: { ...activity.ilustracao, ...patch.ilustracao } };
  }

  const previousApply = current.apply.bind(current);
  const previousIds = Array.from(current.reviewedIds || []);
  globalThis.TeachEasyHighSchoolPedagogicalOverrides = {
    collection: COLLECTION,
    reviewedIds: [...previousIds, ...Object.keys(overrides)],
    apply(collection) {
      previousApply(collection);
      if (!collection || collection.colecao !== COLLECTION || !Array.isArray(collection.atividades)) return collection;
      collection.atividades = collection.atividades.map(activity => {
        const patch = overrides[activity.id];
        return patch ? mergeActivity(activity, patch) : activity;
      });
      return collection;
    }
  };
})();
