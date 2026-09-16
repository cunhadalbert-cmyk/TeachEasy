(() => {
  const core = globalThis.TeachEasySciencePedagogicalCore;
  if (!core?.builders) return;
  const { q, a, fmt } = core;

  core.builders.originModels = function(s) {
    const text = `CONTEXTO — ${s.topic}\n` +
      `${s.historical}. O modelo científico atual considerado no exercício é: ${s.scientific}. ` +
      `Evidências usadas na avaliação científica: ${s.evidence1}; ${s.evidence2}. ` +
      `Explicações culturais e científicas podem responder a perguntas diferentes e usar critérios diferentes; a comparação aqui se concentra em quais afirmações são testáveis por observações, medições e evidências reproduzíveis.`;
    return {
      tema: `${s.topic}: comparação de explicações e evidências`,
      objetivo: 'Comparar explicações sobre a origem e evolução da vida, da Terra ou do Universo, distinguindo critérios culturais, históricos e científicos sem desrespeitar diferentes tradições.',
      instrucaoGeral: 'Compare as explicações pelo tipo de pergunta, pela possibilidade de teste e pelas evidências apresentadas.',
      textoApoio: { titulo: s.title, conteudo: text },
      questoes: [
        q(1,'multipla-escolha','Qual elemento do texto funciona como evidência testável no modelo científico?',[s.evidence1,s.historical,'A preferência pessoal do pesquisador.','A repetição de uma afirmação sem dados.'],'pequeno'),
        q(2,'discursiva','Explique uma diferença entre o modo de construção da explicação histórica/cultural e o modelo científico apresentado.'),
        q(3,'associacao','Associe corretamente: explicação cultural/histórica, hipótese científica, evidência e revisão de modelo.',['explicação cultural/histórica — interpretação ligada a contexto e tradição','hipótese científica — proposição testável','evidência — dado que pode sustentar ou contrariar uma hipótese','revisão de modelo — mudança diante de novas evidências'],'medio'),
        q(4,'analise',`Explique como a evidência “${s.evidence2}” contribui para avaliar o modelo científico.`),
        q(5,'verdadeiro-falso','Marque Verdadeiro ou Falso: uma explicação científica deve poder ser confrontada com dados e pode ser revisada quando novas evidências surgem.',['Verdadeiro','Falso'],'pequeno'),
        q(6,'discursiva','Indique uma limitação do modelo científico apresentado no texto: o que ele não explica sozinho?'),
        q(7,'interpretacao','Por que comparar explicações não exige tratar uma tradição cultural como se fosse uma hipótese experimental?'),
        q(8,'producao','Escreva uma síntese de quatro linhas distinguindo respeito à diversidade cultural de avaliação científica baseada em evidências.')
      ],
      gabarito: [
        a(1,`A) ${s.evidence1}.`,'É o item apresentado como dado observável/testável.'),
        a(2,'A resposta deve destacar que explicações científicas são avaliadas por testes, observações e revisão por evidências, enquanto explicações culturais/históricas podem ter funções simbólicas, filosóficas ou identitárias.','A comparação deve ser respeitosa e metodologicamente correta.'),
        a(3,'Explicação cultural/histórica — contexto e tradição; hipótese — proposição testável; evidência — dado; revisão de modelo — mudança diante de novas evidências.','Correspondências conceituais.'),
        a(4,`Deve explicar de que modo “${s.evidence2}” é compatível, incompatível ou limitante para o modelo.`,'O foco é relacionar evidência e explicação.'),
        a(5,'Verdadeiro.','A revisabilidade é característica do conhecimento científico.'),
        a(6,'Resposta coerente que reconheça simplificações, lacunas de dados ou aspectos não abrangidos pelo modelo.','Modelos científicos têm alcance e limites.'),
        a(7,'Porque tradições culturais não precisam assumir a mesma finalidade nem os mesmos critérios de teste de uma hipótese científica.','Evita falsa equivalência metodológica e desrespeito cultural.'),
        a(8,'Síntese autoral que preserve respeito cultural e deixe claro que afirmações científicas são avaliadas por evidências testáveis.','Avaliar clareza e distinção entre campos de explicação.')
      ]
    };
  };

  core.builders.lifeConditions = function(s) {
    const diff = s.countA - s.countB;
    const ratio = s.countB === 0 ? 0 : s.countA / s.countB;
    const text = `CONTEXTO — ${s.organism}\n` +
      `Uma investigação comparou duas condições ambientais. ${s.conditionA}: ${s.factorA}, com média de ${s.countA} indivíduos/unidades observadas. ` +
      `${s.conditionB}: ${s.factorB}, com média de ${s.countB}. O fator ambiental em estudo é ${s.limitingFactor}. ` +
      `As demais condições foram mantidas tão semelhantes quanto possível. Os dados permitem discutir como condições favoráveis e fatores limitantes influenciam a manifestação e a organização da vida, sem concluir que um único fator explica todo o sistema.`;
    return {
      tema: `${s.organism}: condições ambientais e fator limitante`,
      objetivo: 'Analisar formas de manifestação da vida e relacioná-las a condições ambientais favoráveis e fatores limitantes.',
      instrucaoGeral: 'Use os dados comparativos e diferencie associação observada de explicação causal definitiva.',
      textoApoio: { titulo: s.title, conteudo: text },
      questoes: [
        q(1,'resolucao','Calcule a diferença entre as médias observadas nas condições A e B.'),
        q(2,'resolucao','Calcule quantas vezes a média da condição A representa a média da condição B.'),
        q(3,'multipla-escolha','Qual fator o experimento pretende relacionar à diferença observada?',[s.limitingFactor,'O nome da escola.','A ordem das perguntas.','A cor da tabela.'],'pequeno'),
        q(4,'analise',`Explique por que “${s.limitingFactor}” pode funcionar como fator limitante para ${s.organism}.`),
        q(5,'verdadeiro-falso','Marque Verdadeiro ou Falso: observar uma diferença entre duas condições, sozinho, prova que nenhum outro fator participa do resultado.',['Verdadeiro','Falso'],'pequeno'),
        q(6,'discursiva','Cite uma variável que deveria ser controlada para tornar a comparação mais confiável.'),
        q(7,'interpretacao','Interprete a razão calculada entre as duas médias em linguagem biológica, sem afirmar mais do que os dados permitem.'),
        q(8,'producao','Proponha uma nova condição experimental que permita testar melhor o papel do fator limitante.')
      ],
      gabarito: [
        a(1,`${fmt(diff)} unidades.`,'Diferença entre as médias A e B.'),
        a(2,`${fmt(ratio,2)} vezes.`,'Razão entre A e B.'),
        a(3,`A) ${s.limitingFactor}.`,'É a variável destacada no contexto.'),
        a(4,`Resposta deve relacionar ${s.limitingFactor} a recursos, metabolismo, reprodução, sobrevivência ou outra necessidade coerente de ${s.organism}.`,'O mecanismo deve ser biologicamente plausível.'),
        a(5,'Falso.','Outros fatores podem contribuir; o desenho experimental precisa controlar variáveis.'),
        a(6,'Resposta possível: temperatura, disponibilidade de água/nutrientes, tempo de observação, luminosidade ou outro fator pertinente mantido constante.','Aceitar controles coerentes.'),
        a(7,`A média em A foi cerca de ${fmt(ratio,2)} vezes a média em B, associação compatível com diferença nas condições, mas não prova causalidade isolada.`,'Interpretação proporcional e cautelosa.'),
        a(8,'Resposta autoral com nova condição, variável definida e critério de comparação.','Deve ampliar a capacidade de testar a hipótese.')
      ]
    };
  };

  core.builders.ecosystemIntervention = function(s) {
    const changeSpecies = s.afterSpecies - s.beforeSpecies;
    const pct = ((s.afterSpecies - s.beforeSpecies) / s.beforeSpecies) * 100;
    const text = `CONTEXTO — ${s.ecosystem}\n` +
      `Antes da intervenção “${s.intervention}”, o indicador de ${s.speciesIndicator} era ${s.beforeSpecies}; depois, passou para ${s.afterSpecies}. ` +
      `Outro indicador mudou de ${s.beforeEnv} para ${s.afterEnv} ${s.envUnit}. A intervenção pode alterar relações alimentares, disponibilidade de recursos e ciclos de matéria/energia. ` +
      `Os dados são suficientes para prever efeitos possíveis, mas a conclusão deve considerar que ecossistemas têm múltiplas variáveis e respostas ao longo do tempo.`;
    return {
      tema: `${s.ecosystem}: intervenção e efeitos ecológicos`,
      objetivo: 'Avaliar e prever efeitos de intervenções em ecossistemas com base em indicadores biológicos e ambientais.',
      instrucaoGeral: 'Calcule as mudanças observadas, proponha mecanismos ecológicos e explicite limites da previsão.',
      textoApoio: { titulo: s.title, conteudo: text },
      questoes: [
        q(1,'resolucao',`Calcule a mudança absoluta no indicador de ${s.speciesIndicator}.`),
        q(2,'resolucao',`Calcule a variação percentual do indicador de ${s.speciesIndicator}.`),
        q(3,'completar',`Complete: o segundo indicador variou de ${fmt(s.beforeEnv)} para ____ ${s.envUnit}.`),
        q(4,'analise',`Explique um mecanismo pelo qual “${s.intervention}” poderia produzir as mudanças observadas.`),
        q(5,'verdadeiro-falso','Marque Verdadeiro ou Falso: uma intervenção em um ecossistema pode produzir efeitos indiretos em espécies que não são o alvo inicial.',['Verdadeiro','Falso'],'pequeno'),
        q(6,'interpretacao','Com base nos dois indicadores, formule uma previsão para o próximo período e deixe claro o grau de incerteza.'),
        q(7,'associacao','Associe: intervenção, indicador biológico, indicador ambiental e previsão.',['intervenção — alteração introduzida no sistema','indicador biológico — resposta dos seres vivos','indicador ambiental — condição física/química medida','previsão — resultado esperado com incerteza'],'medio'),
        q(8,'producao','Proponha uma medida de monitoramento para avaliar se o efeito continua, se estabiliza ou se reverte.')
      ],
      gabarito: [
        a(1,`${fmt(changeSpecies)} unidades.`,'Valor depois menos valor antes.'),
        a(2,`${fmt(pct,1)}% aproximadamente.`,'Variação relativa ao valor inicial.'),
        a(3,`${fmt(s.afterEnv)} ${s.envUnit}.`,'Valor final informado no texto.'),
        a(4,'Resposta deve conectar a intervenção a uma cadeia causal ecológica plausível, como recurso, predação, competição, habitat ou qualidade ambiental.','Avaliar mecanismo, não apenas repetição dos dados.'),
        a(5,'Verdadeiro.','Ecossistemas possuem relações diretas e indiretas entre componentes.'),
        a(6,'Previsão coerente com a tendência, acompanhada de ressalva sobre variáveis não medidas e necessidade de novos dados.','Previsão científica deve explicitar incerteza.'),
        a(7,'Intervenção — alteração; indicador biológico — resposta dos seres vivos; indicador ambiental — condição medida; previsão — resultado esperado com incerteza.','Correspondências do modelo.'),
        a(8,'Resposta autoral com variável, periodicidade de coleta e critério de comparação.','Monitoramento deve gerar dados comparáveis.')
      ]
    };
  };

  core.builders.biodiversity = function(s) {
    const loss = s.richnessBefore - s.richnessAfter;
    const pctLoss = (loss / s.richnessBefore) * 100;
    const protectedGain = s.protectedAfter - s.protectedBefore;
    const text = `CONTEXTO — ${s.area}\n` +
      `Um levantamento registrou ${s.richnessBefore} espécies antes de ${s.pressure} e ${s.richnessAfter} depois. A cobertura protegida era ${s.protectedBefore}% e uma proposta de conservação elevaria essa cobertura para ${s.protectedAfter}%. ` +
      `Os pesquisadores destacam que riqueza de espécies é apenas um indicador: abundância, conectividade, espécies endêmicas e qualidade do habitat também importam. ` +
      `A decisão deve considerar dados quantitativos, efeitos da ação humana e viabilidade de medidas de conservação.`;
    return {
      tema: `${s.area}: biodiversidade, pressão humana e conservação`,
      objetivo: 'Discutir a importância da conservação da biodiversidade usando parâmetros quantitativos e qualitativos.',
      instrucaoGeral: 'Calcule a perda registrada e avalie a proposta sem reduzir biodiversidade a um único número.',
      textoApoio: { titulo: s.title, conteudo: text },
      questoes: [
        q(1,'resolucao','Calcule quantas espécies deixaram de ser registradas entre os dois levantamentos.'),
        q(2,'resolucao','Calcule a redução percentual aproximada na riqueza de espécies.'),
        q(3,'resolucao','Calcule quantos pontos percentuais de cobertura protegida a proposta acrescenta.'),
        q(4,'analise',`Explique como ${s.pressure} pode afetar a biodiversidade além da simples redução no número de espécies.`),
        q(5,'multipla-escolha','Qual indicador adicional ajudaria a avaliar melhor a conservação?', ['abundância e conectividade das populações','somente a cor do mapa','o nome do pesquisador','a ordem alfabética das espécies'],'pequeno'),
        q(6,'verdadeiro-falso','Marque Verdadeiro ou Falso: aumentar a área protegida garante automaticamente a recuperação de todas as espécies, independentemente da qualidade e conectividade do habitat.',['Verdadeiro','Falso'],'pequeno'),
        q(7,'interpretacao','Avalie a proposta de aumento de cobertura protegida usando os dados e pelo menos uma limitação.'),
        q(8,'producao','Escreva duas ações complementares de conservação e indique um indicador para acompanhar cada uma.')
      ],
      gabarito: [
        a(1,`${loss} espécies.`,'Diferença entre riqueza inicial e final.'),
        a(2,`${fmt(pctLoss,1)}% aproximadamente.`,'Perda dividida pela riqueza inicial, vezes 100.'),
        a(3,`${protectedGain} pontos percentuais.`,'Diferença entre coberturas protegidas.'),
        a(4,'Resposta deve citar mecanismos como perda/fragmentação de habitat, redução populacional, alteração de interações ou isolamento.','Efeito deve ser ecologicamente coerente.'),
        a(5,'A) abundância e conectividade das populações.','Complementam o dado de riqueza.'),
        a(6,'Falso.','Qualidade, conectividade, pressões externas e tempo de recuperação também importam.'),
        a(7,`A proposta amplia a proteção em ${protectedGain} pontos percentuais, mas precisa ser acompanhada por qualidade do habitat, conectividade e monitoramento.`,'Conclusão equilibrada com dado e limite.'),
        a(8,'Resposta autoral com ações plausíveis e indicadores mensuráveis.','Ex.: restauração + cobertura vegetal; corredor + conectividade; fiscalização + taxa de perda.')
      ]
    };
  };

  core.builders.healthVulnerability = function(s) {
    const diff = s.groupA - s.groupB;
    const text = `CONTEXTO — ${s.topic}\n` +
      `Uma pesquisa escolar anônima com ${s.sample} estudantes observou dois grupos. ${s.groupALabel}: ${s.groupA}% relataram ${s.outcome}; ${s.groupBLabel}: ${s.groupB}%. ` +
      `O levantamento também registrou fatores físicos, psicoemocionais e sociais, mas não permite diagnosticar indivíduos nem provar causalidade. ` +
      `A proposta educativa é ${s.prevention}. O objetivo é reconhecer vulnerabilidades e construir ações de prevenção e bem-estar sem culpabilizar estudantes.`;
    return {
      tema: `${s.topic}: vulnerabilidades e promoção do bem-estar`,
      objetivo: 'Analisar vulnerabilidades das juventudes articulando aspectos físicos, psicoemocionais e sociais e propor ações de prevenção.',
      instrucaoGeral: 'Use os dados do levantamento sem transformar associação em diagnóstico ou culpa individual.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'resolucao','Calcule a diferença, em pontos percentuais, entre os dois grupos.'),
        q(2,'multipla-escolha','Qual conclusão é mais adequada aos dados?',['Há associação entre os grupos e o desfecho, mas o levantamento não prova causalidade.','O fator observado causa o desfecho em todos os estudantes.','O grupo B não apresenta qualquer vulnerabilidade.','A pesquisa permite diagnosticar cada participante.'],'pequeno'),
        q(3,'analise','Identifique um aspecto físico, um psicoemocional e um social que poderiam ser considerados em uma análise mais completa.'),
        q(4,'verdadeiro-falso','Marque Verdadeiro ou Falso: dados anônimos de grupo devem ser usados para planejar prevenção, não para rotular estudantes individualmente.',['Verdadeiro','Falso'],'pequeno'),
        q(5,'interpretacao',`Explique como a diferença de ${diff} pontos percentuais pode orientar uma ação coletiva sem provar causa única.`),
        q(6,'associacao','Associe: vulnerabilidade, fator de proteção, dado agregado e prevenção.',['vulnerabilidade — condição que pode aumentar risco','fator de proteção — condição que favorece bem-estar','dado agregado — informação de grupo, não diagnóstico individual','prevenção — ação para reduzir riscos e ampliar proteção'],'medio'),
        q(7,'discursiva',`Avalie a proposta “${s.prevention}” e indique um indicador que permitiria verificar seus efeitos.`),
        q(8,'producao','Escreva uma mensagem curta de promoção do bem-estar que seja informativa, não estigmatizante e compatível com os dados.')
      ],
      gabarito:[
        a(1,`${diff} pontos percentuais.`,'Diferença entre os percentuais dos grupos.'),
        a(2,'A) Há associação entre os grupos e o desfecho, mas o levantamento não prova causalidade.','É a interpretação compatível com um estudo observacional.'),
        a(3,'Exemplos: sono/atividade física; estresse/apoio emocional; rotina escolar/rede de apoio.','Aceitar exemplos coerentes nas três dimensões.'),
        a(4,'Verdadeiro.','Dados coletivos não autorizam diagnóstico ou rotulação individual.'),
        a(5,`A diferença de ${diff} pontos percentuais sinaliza um grupo com maior frequência do desfecho, útil para prevenção, mas outros fatores podem explicar parte da associação.`,'Interpretação sem causalidade indevida.'),
        a(6,'Vulnerabilidade — aumenta risco; fator de proteção — favorece bem-estar; dado agregado — informação de grupo; prevenção — reduz riscos/amplia proteção.','Correspondências conceituais.'),
        a(7,'Resposta deve discutir viabilidade da ação e sugerir indicador antes/depois, como frequência do desfecho ou adesão.','Avaliação deve ser mensurável.'),
        a(8,'Mensagem respeitosa, preventiva e sem estigma, evitando diagnóstico ou generalizações.','Avaliar adequação comunicativa e científica.')
      ]
    };
  };

  core.builders.humanEvolution = function(s) {
    const text = `CONTEXTO — ${s.topic}\n` +
      `O conjunto didático apresenta três evidências: ${s.e1}; ${s.e2}; ${s.e3}. ` +
      `A evolução humana é representada como uma árvore ramificada, não como uma escada de “superioridade”. Populações humanas atuais compartilham ancestralidade comum recente e nenhuma classificação biológica sustenta hierarquias de valor entre grupos étnicos ou culturais. ` +
      `O objetivo é usar princípios evolutivos para discutir origem, diversificação, dispersão e interação com ambientes, valorizando a diversidade humana.`;
    return {
      tema: `${s.topic}: evolução humana, dispersão e diversidade`,
      objetivo:'Aplicar princípios de evolução biológica à história humana, evitando interpretações hierarquizantes e valorizando a diversidade étnica e cultural.',
      instrucaoGeral:'Analise as evidências e diferencie ancestralidade evolutiva de julgamentos sociais ou culturais.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'multipla-escolha','Qual representação é mais adequada para a evolução humana?',['Uma árvore ramificada com ancestralidade compartilhada.','Uma escada linear de povos inferiores para superiores.','Uma sequência definida pela tecnologia atual.','Uma classificação baseada em valor cultural.'],'pequeno'),
        q(2,'analise',`Explique o que a evidência “${s.e1}” pode informar sobre a história evolutiva humana.`),
        q(3,'associacao','Associe: fóssil, DNA, dispersão e adaptação.',['fóssil — registro de organismos do passado','DNA — evidência de relações de ancestralidade','dispersão — movimento de populações entre regiões','adaptação — características influenciadas por seleção ao longo de gerações'],'medio'),
        q(4,'verdadeiro-falso','Marque Verdadeiro ou Falso: diferenças biológicas entre populações humanas justificam hierarquias de direitos ou valor social.',['Verdadeiro','Falso'],'pequeno'),
        q(5,'discursiva','Explique por que ancestralidade comum e diversificação populacional podem ocorrer ao mesmo tempo.'),
        q(6,'analise',`Relacione “${s.e2}” a uma possível rota de dispersão ou interação com o ambiente.`),
        q(7,'interpretacao','Por que o modelo de árvore ramificada é mais compatível com evolução do que a ideia de progresso linear?'),
        q(8,'producao','Escreva uma síntese que relacione evolução humana e respeito à diversidade sem usar linguagem de superioridade/inferioridade entre povos.')
      ],
      gabarito:[
        a(1,'A) Uma árvore ramificada com ancestralidade compartilhada.','Evolução envolve divergência e ancestralidade comum, não escala de valor.'),
        a(2,'Resposta deve indicar que a evidência contribui para inferir cronologia, ancestralidade, distribuição ou características de populações antigas.','Relacionar evidência a inferência evolutiva.'),
        a(3,'Fóssil — registro; DNA — ancestralidade; dispersão — movimento; adaptação — seleção ao longo de gerações.','Correspondências científicas.'),
        a(4,'Falso.','Biologia evolutiva não fundamenta hierarquias de direitos ou valor humano.'),
        a(5,'Populações podem compartilhar ancestrais e, após dispersão e isolamento parcial, acumular diferenças sem deixar de pertencer à mesma espécie.','Integra ancestralidade e diversificação.'),
        a(6,'Resposta coerente ligando a evidência a deslocamento, clima, recursos ou adaptação local.','A relação deve ser sustentada pelo contexto.'),
        a(7,'Porque linhagens podem divergir, coexistir e se extinguir; não há direção obrigatória para uma forma “superior”.','Interpretação evolutiva adequada.'),
        a(8,'Síntese autoral cientificamente correta e respeitosa, enfatizando ancestralidade compartilhada e diversidade.','Não aceitar hierarquização de grupos humanos.')
      ]
    };
  };

  core.builders.uncertainty = function(s) {
    const freq = (s.successes / s.trials) * 100;
    const text = `CONTEXTO — ${s.phenomenon}\n` +
      `Em ${s.trials} observações/simulações comparáveis, o evento “${s.event}” ocorreu ${s.successes} vezes. A frequência observada foi usada como estimativa de probabilidade, mas ela pode variar com novas amostras. ` +
      `O fenômeno também depende de ${s.uncertainty}. O objetivo não é prometer um resultado, e sim usar dados para fazer uma previsão com incerteza explícita e reconhecer os limites explicativos do modelo.`;
    return {
      tema:`${s.phenomenon}: probabilidade, previsão e incerteza`,
      objetivo:'Interpretar resultados e realizar previsões baseadas em probabilidade e incerteza, reconhecendo limites do modelo.',
      instrucaoGeral:'Calcule a frequência observada e formule previsões como probabilidades, não como certezas.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'resolucao','Calcule a frequência percentual observada do evento no conjunto de dados.'),
        q(2,'completar','Complete: em uma nova série de 100 situações semelhantes, a melhor estimativa inicial seria cerca de ____ ocorrências, sem garantia de valor exato.'),
        q(3,'verdadeiro-falso','Marque Verdadeiro ou Falso: uma frequência observada de 70% significa que o evento obrigatoriamente ocorrerá exatamente 7 vezes em cada grupo de 10.',['Verdadeiro','Falso'],'pequeno'),
        q(4,'analise',`Explique como “${s.uncertainty}” pode alterar a previsão.`),
        q(5,'multipla-escolha','Qual frase comunica melhor a incerteza?',[`Os dados sugerem probabilidade aproximada de ${fmt(freq,1)}%, sujeita a variação.`,`O evento ocorrerá com certeza absoluta em ${fmt(freq,1)}% de cada grupo.`,`Não existe informação útil porque há incerteza.`,`Uma única ocorrência define o resultado futuro.`],'pequeno'),
        q(6,'discursiva','Indique uma forma de reduzir a incerteza estatística da estimativa.'),
        q(7,'interpretacao','Explique por que um modelo probabilístico pode ser útil mesmo sem prever cada caso individual.'),
        q(8,'producao','Escreva uma previsão de duas linhas que inclua o valor estimado e uma limitação do conjunto de dados.')
      ],
      gabarito:[
        a(1,`${fmt(freq,1)}%.`,'Número de ocorrências dividido pelo total, vezes 100.'),
        a(2,`${fmt(freq,1)} ocorrências aproximadamente.`,'Aplicação da frequência estimada a 100 casos.'),
        a(3,'Falso.','Probabilidade descreve tendência em muitas repetições, não sequência determinística.'),
        a(4,`Resposta deve explicar como ${s.uncertainty} introduz variação ou informação não controlada no resultado.`,'Relacionar fonte de incerteza à previsão.'),
        a(5,`A) Os dados sugerem probabilidade aproximada de ${fmt(freq,1)}%, sujeita a variação.`,'Comunica estimativa e incerteza.'),
        a(6,'Aumentar o número de observações/repetições e padronizar as condições de coleta.','Maior amostra tende a estabilizar a estimativa.'),
        a(7,'Porque permite quantificar chances, comparar cenários e tomar decisões mesmo quando cada ocorrência individual é incerta.','Utilidade de modelos probabilísticos.'),
        a(8,`Deve citar aproximadamente ${fmt(freq,1)}% e explicitar limitação de amostra, condições ou variáveis não controladas.`,'Previsão deve evitar certeza absoluta.')
      ]
    };
  };

  core.builders.stellarEvolution = function(s) {
    const text = `CONTEXTO — ${s.starCase}\n` +
      `Modelo simplificado: estrelas de menor massa podem terminar como anãs brancas após fases de gigante; estrelas de maior massa podem produzir elementos mais pesados, explodir como supernovas e deixar estrelas de nêutrons ou buracos negros. ` +
      `No caso analisado, ${s.data}. Elementos como carbono e oxigênio são formados em estrelas, enquanto muitos elementos mais pesados dependem de eventos energéticos e processos posteriores. ` +
      `Esses materiais podem integrar nuvens que formam novas estrelas e planetas. O modelo resume processos complexos e não determina, sozinho, a existência de vida.`;
    return {
      tema:`${s.starCase}: evolução estelar e origem dos elementos`,
      objetivo:'Analisar evolução estelar relacionando massa, formação/distribuição de elementos e condições para sistemas planetários.',
      instrucaoGeral:'Use o modelo simplificado para relacionar etapas, elementos e formação de novos sistemas, reconhecendo limites.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'multipla-escolha','Segundo o modelo, qual propriedade influencia fortemente o caminho evolutivo de uma estrela?',['massa inicial','nome da constelação','posição da estrela no alfabeto','cor escolhida no desenho'],'pequeno'),
        q(2,'associacao','Associe: estrela de menor massa, estrela massiva, supernova e nuvem interestelar.',['estrela de menor massa — pode terminar como anã branca','estrela massiva — pode produzir elementos e terminar em evento energético','supernova — dispersa matéria enriquecida','nuvem interestelar — pode participar da formação de novos sistemas'],'medio'),
        q(3,'analise',`Explique o que os dados “${s.data}” sugerem sobre a fase ou evolução do objeto.`),
        q(4,'verdadeiro-falso','Marque Verdadeiro ou Falso: os elementos químicos presentes em planetas podem ter origem em processos ocorridos em gerações anteriores de estrelas.',['Verdadeiro','Falso'],'pequeno'),
        q(5,'discursiva','Explique a relação entre evolução estelar, dispersão de elementos e formação de sistemas planetários.'),
        q(6,'interpretacao','Por que a presença de elementos químicos necessários à vida não é prova de que exista vida em um planeta?'),
        q(7,'analise','Indique uma limitação do modelo simplificado apresentado no texto.'),
        q(8,'producao','Construa uma sequência de quatro etapas ligando estrela, produção/dispersão de elementos, nuvem interestelar e formação de novo sistema planetário.')
      ],
      gabarito:[
        a(1,'A) massa inicial.','A massa é parâmetro central da evolução estelar.'),
        a(2,'Menor massa — anã branca; massiva — evolução energética; supernova — dispersão; nuvem — formação de novos sistemas.','Sequência conceitual do modelo.'),
        a(3,'Resposta deve interpretar os dados fornecidos de forma compatível com o modelo, sem determinar estágio além do que os dados permitem.','Avaliar evidência e limite.'),
        a(4,'Verdadeiro.','A matéria de sistemas planetários pode incluir elementos formados e dispersos por estrelas anteriores.'),
        a(5,'Estrelas produzem/redistribuem elementos; eventos e ventos estelares enriquecem o meio; nuvens enriquecidas podem formar novas estrelas e planetas.','Relação causal principal.'),
        a(6,'Porque vida também depende de condições ambientais, estabilidade, solventes, fontes de energia e história do sistema; elementos são necessários em certos modelos, mas não suficientes.','Evita conclusão indevida.'),
        a(7,'Exemplos: omite detalhes de massa, composição, metalicidade, tempos de evolução e diversidade de eventos.','Reconhecer simplificação.'),
        a(8,'Sequência esperada: evolução estelar → produção/dispersão de elementos → enriquecimento de nuvem → formação de novo sistema.','Ordem causal coerente.')
      ]
    };
  };

  core.builders.gravity = function(s) {
    const d1 = 0.5 * s.g * (s.t1 ** 2);
    const d2 = 0.5 * s.g * (s.t2 ** 2);
    const ratio = d2 / d1;
    const text = `CONTEXTO — ${s.caseName}\n` +
      `Para um modelo de queda vertical próxima à superfície, desconsiderando resistência do ar e partindo do repouso, use d = 1/2 · g · t². ` +
      `No cenário, adota-se g = ${fmt(s.g)} m/s² e comparam-se os tempos ${fmt(s.t1)} s e ${fmt(s.t2)} s. ` +
      `O modelo permite elaborar previsões quantitativas sobre movimento sob interação gravitacional, mas deixa de representar arrasto do ar, rotação, forma do objeto e variações locais de g.`;
    return {
      tema:`${s.caseName}: movimento e interação gravitacional`,
      objetivo:'Elaborar explicações, previsões e cálculos sobre movimento com base em interações gravitacionais.',
      instrucaoGeral:'Aplique a equação do modelo, compare os resultados e deixe claras suas condições de validade.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'resolucao',`Calcule a distância prevista pelo modelo após ${fmt(s.t1)} s.`),
        q(2,'resolucao',`Calcule a distância prevista pelo modelo após ${fmt(s.t2)} s.`),
        q(3,'resolucao','Calcule quantas vezes a segunda distância é maior que a primeira.'),
        q(4,'multipla-escolha','No modelo d = 1/2·g·t², se o tempo dobra, a distância percorrida a partir do repouso tende a:',['quadruplicar','dobrar','cair pela metade','permanecer igual'],'pequeno'),
        q(5,'verdadeiro-falso','Marque Verdadeiro ou Falso: o modelo apresentado considera a resistência do ar.',['Verdadeiro','Falso'],'pequeno'),
        q(6,'analise','Explique por que dois objetos de formatos muito diferentes podem se afastar da previsão ideal em graus diferentes no ar.'),
        q(7,'interpretacao','Explique como a equação expressa uma relação entre gravidade, tempo e movimento.'),
        q(8,'producao','Proponha um teste simples e seguro para comparar a previsão do modelo com uma medição real, indicando o que seria controlado.')
      ],
      gabarito:[
        a(1,`${fmt(d1)} m.`,'Aplicação direta de d = 1/2·g·t².'),
        a(2,`${fmt(d2)} m.`,'Aplicação direta de d = 1/2·g·t².'),
        a(3,`${fmt(ratio)} vezes.`,'Razão entre as duas distâncias.'),
        a(4,'A) quadruplicar.','A distância é proporcional ao quadrado do tempo.'),
        a(5,'Falso.','O texto declara que a resistência do ar foi desconsiderada.'),
        a(6,'Porque área, forma e velocidade alteram a força de arrasto, ausente no modelo ideal.','Reconhecer efeito de variável omitida.'),
        a(7,'Com g constante, o deslocamento cresce com t²; a gravidade determina a aceleração do movimento no modelo.','Relação matemática e física.'),
        a(8,'Resposta com queda curta/segura, medição de altura e tempo, mesmo ponto de soltura e repetição; reconhecer limite de precisão.','Deve controlar variáveis e priorizar segurança.')
      ]
    };
  };
})();
