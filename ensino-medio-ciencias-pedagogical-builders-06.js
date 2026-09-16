(() => {
  const core = globalThis.TeachEasySciencePedagogicalCore;
  if (!core?.builders) return;
  const { q, a, fmt } = core;

  core.builders.infrastructure = function(s) {
    const beforePct = (s.before / s.population) * 100;
    const afterPct = (s.after / s.population) * 100;
    const gain = afterPct - beforePct;
    const gap = s.population - s.after;
    const text = `CONTEXTO — ${s.service}\n` +
      `A comunidade analisada possui ${s.population} moradores. Antes do programa, ${s.before} tinham acesso regular ao serviço; depois da intervenção, ${s.after}. ` +
      `Também foi registrado ${s.qualityIndicator}. O objetivo é investigar se o programa ampliou acesso e quais necessidades permanecem, lembrando que cobertura numérica não mede sozinha qualidade, continuidade, custo ou desigualdade territorial. ` +
      `A análise deve combinar porcentagens de cobertura, indicador de qualidade e necessidades locais.`;
    return {
      tema:`${s.service}: cobertura, qualidade e necessidade local`,
      objetivo:'Investigar efeitos de programas de infraestrutura e serviços básicos, identificar necessidades locais e avaliar ações para qualidade de vida e saúde.',
      instrucaoGeral:'Calcule a cobertura antes/depois e use também o indicador de qualidade para avaliar o programa.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'resolucao','Calcule a porcentagem de moradores com acesso ao serviço antes do programa.'),
        q(2,'resolucao','Calcule a porcentagem de moradores com acesso ao serviço depois do programa.'),
        q(3,'resolucao','Calcule o ganho de cobertura em pontos percentuais.'),
        q(4,'completar','Complete: depois do programa, ainda restam ____ moradores sem acesso regular ao serviço.'),
        q(5,'analise',`Explique por que o indicador “${s.qualityIndicator}” deve ser analisado junto com a cobertura.`),
        q(6,'verdadeiro-falso','Marque Verdadeiro ou Falso: atingir 100% de cobertura numérica garantiria, sozinho, que o serviço fosse contínuo, seguro e de boa qualidade.',['Verdadeiro','Falso'],'pequeno'),
        q(7,'interpretacao',`Avalie o avanço do programa com base no ganho de ${fmt(gain,1)} pontos percentuais e indique uma necessidade ainda não resolvida.`),
        q(8,'producao','Proponha uma ação local de melhoria e um indicador mensurável para acompanhar seu resultado.')
      ],
      gabarito:[
        a(1,`${fmt(beforePct,1)}%.`,'Pessoas atendidas antes divididas pela população total.'),
        a(2,`${fmt(afterPct,1)}%.`,'Pessoas atendidas depois divididas pela população total.'),
        a(3,`${fmt(gain,1)} pontos percentuais.`,'Diferença entre as coberturas.'),
        a(4,`${gap} moradores.`,'População total menos atendidos após o programa.'),
        a(5,'Porque acesso e qualidade são dimensões diferentes; um serviço pode alcançar mais pessoas e ainda ter falhas de continuidade, segurança ou desempenho.','A avaliação de infraestrutura deve ser multidimensional.'),
        a(6,'Falso.','Cobertura não mede sozinha qualidade, continuidade, custo ou equidade.'),
        a(7,`O programa aumentou a cobertura em ${fmt(gain,1)} pontos percentuais, mas ainda há ${gap} moradores sem acesso e o indicador de qualidade também deve orientar a decisão.`,'Síntese baseada em dados.'),
        a(8,'Resposta autoral com ação viável e indicador antes/depois, como cobertura, interrupções, qualidade ou tempo de atendimento.','A proposta deve ser mensurável.')
      ]
    };
  };

  core.builders.scienceCommunication = function(s) {
    const change = s.after - s.before;
    const pct = (change / s.before) * 100;
    const text = `CONTEXTO — ${s.study}\n` +
      `Um estudo escolar mediu ${s.variable}. Antes da intervenção, a média foi ${fmt(s.before)} ${s.unit}; depois, ${fmt(s.after)} ${s.unit}, em ${s.samples} medições comparáveis. ` +
      `O grupo precisa comunicar o resultado para ${s.audience}. Uma comunicação científica responsável deve mostrar método, unidade, tamanho da amostra, resultado, incerteza e limites, escolhendo linguagem e representação adequadas ao público. ` +
      `O dado não autoriza afirmar que todo caso individual terá o mesmo resultado.`;
    return {
      tema:`${s.study}: comunicar resultados com clareza e contexto`,
      objetivo:'Comunicar resultados de análises e experimentos para públicos variados usando dados, representações e linguagem adequada.',
      instrucaoGeral:'Calcule a mudança e transforme o resultado em comunicação clara, sem esconder método ou limitações.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'resolucao','Calcule a mudança absoluta entre a média antes e depois da intervenção.'),
        q(2,'resolucao','Calcule a variação percentual aproximada em relação ao valor inicial.'),
        q(3,'multipla-escolha','Qual informação é indispensável para comunicar o resultado com transparência?',[`unidade, amostra e método de medição`,`somente um título chamativo`,`apenas a conclusão sem dados`,`o nome completo de cada participante`],'pequeno'),
        q(4,'analise',`Qual representação seria adequada para mostrar a comparação a ${s.audience}: tabela, gráfico de barras ou texto corrido? Justifique.`),
        q(5,'verdadeiro-falso','Marque Verdadeiro ou Falso: adaptar a linguagem ao público permite omitir limitações importantes do estudo.',['Verdadeiro','Falso'],'pequeno'),
        q(6,'revisao','Reescreva a frase “a intervenção resolveu completamente o problema” de modo compatível com os dados e limites do estudo.'),
        q(7,'interpretacao',`Explique o que uma variação de ${fmt(pct,1)}% significa e o que ela não permite concluir.`),
        q(8,'producao',`Escreva um resumo de quatro linhas para ${s.audience}, citando o resultado, a amostra e uma limitação.`)
      ],
      gabarito:[
        a(1,`${fmt(change)} ${s.unit}.`,'Valor final menos valor inicial.'),
        a(2,`${fmt(pct,1)}% aproximadamente.`,'Mudança dividida pelo valor inicial, vezes 100.'),
        a(3,'A) unidade, amostra e método de medição.','Esses dados permitem interpretar e verificar o resultado.'),
        a(4,'Resposta coerente; gráfico de barras é adequado para duas médias, tabela é útil para valores exatos e texto ajuda a contextualizar.','A escolha deve considerar o público e o tipo de dado.'),
        a(5,'Falso.','Adaptação de linguagem não autoriza ocultar limitações relevantes.'),
        a(6,'Resposta possível: “Nas medições realizadas, a média mudou após a intervenção; novos dados são necessários para avaliar a generalização do efeito.”','Evita afirmação absoluta.'),
        a(7,`A média mudou cerca de ${fmt(pct,1)}% em relação ao valor inicial; isso não garante o mesmo efeito em todo indivíduo nem prova sozinho causalidade universal.`,'Interpretação com limite.'),
        a(8,`Resumo deve informar ${s.samples} medições, valores ${fmt(s.before)} e ${fmt(s.after)} ${s.unit}, público e ao menos uma limitação.`,'Comunicação completa e responsável.')
      ]
    };
  };

  core.builders.sourceReliability = function(s) {
    const text = `CONTEXTO — ${s.topic}\n` +
      `FONTE A: ${s.sourceA}. FONTE B: ${s.sourceB}. FONTE C: ${s.sourceC}. ` +
      `Para avaliar confiabilidade, considere autoria identificável, método descrito, dados verificáveis, referências, data/contexto e separação entre evidência e opinião. ` +
      `Uma fonte confiável ainda pode ter limites; o objetivo é comparar a qualidade da evidência e a coerência entre dados e conclusão, não apenas concordar com a mensagem.`;
    return {
      tema:`${s.topic}: evidência, argumento e confiabilidade de fontes`,
      objetivo:'Interpretar divulgação científica avaliando apresentação de dados, consistência dos argumentos e confiabilidade das fontes.',
      instrucaoGeral:'Compare as três fontes pelos critérios de verificabilidade e pela relação entre dados e conclusão.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'multipla-escolha','Qual critério aumenta mais a possibilidade de verificar uma afirmação científica?',['método e dados descritos com fonte identificável','muitos compartilhamentos','linguagem muito confiante','ausência de referências'],'pequeno'),
        q(2,'analise','Compare as fontes A e B e indique qual oferece melhor condição de verificação, justificando com dois elementos do texto.'),
        q(3,'analise','Identifique uma fragilidade específica da Fonte C.'),
        q(4,'verdadeiro-falso','Marque Verdadeiro ou Falso: uma fonte pode apresentar números verdadeiros e ainda chegar a uma conclusão exagerada se ignorar contexto ou limitações.',['Verdadeiro','Falso'],'pequeno'),
        q(5,'associacao','Associe critério e função: autoria, método, referência e limitação.',['autoria — identifica responsabilidade','método — mostra como o dado foi obtido','referência — permite rastrear informação','limitação — delimita o alcance da conclusão'],'medio'),
        q(6,'revisao','Reescreva uma conclusão excessivamente absoluta do caso de modo que fique proporcional às evidências disponíveis.'),
        q(7,'interpretacao','Explique por que consenso científico não é medido pelo número de curtidas ou compartilhamentos de uma publicação.'),
        q(8,'producao','Monte um checklist de quatro itens para verificar uma nova fonte sobre o mesmo tema.')
      ],
      gabarito:[
        a(1,'A) método e dados descritos com fonte identificável.','Permite rastreamento e avaliação do processo de produção da informação.'),
        a(2,'Resposta deve comparar autoria, método, dados, referências e contexto, identificando a fonte mais verificável pelos elementos fornecidos.','Não basta dizer “parece confiável”.'),
        a(3,'Resposta baseada em uma fragilidade explícita: ausência de método, autoria, referência, contexto ou extrapolação.','Deve citar o material.'),
        a(4,'Verdadeiro.','A validade de dados não garante automaticamente uma conclusão proporcional.'),
        a(5,'Autoria — responsabilidade; método — obtenção; referência — rastreio; limitação — alcance.','Correspondências de avaliação de fontes.'),
        a(6,'Resposta revisada com linguagem proporcional, como “os dados sugerem”, “nesta amostra” ou “é necessário confirmar”.','Deve reduzir certeza não sustentada.'),
        a(7,'Porque popularidade mede circulação social, não qualidade metodológica, reprodução de resultados ou convergência de evidências.','Distingue alcance de validação científica.'),
        a(8,'Checklist possível: autoria/afiliação; método/amostra; referências/dados; limitações/data/contexto.','Aceitar quatro critérios verificáveis.')
      ]
    };
  };

  core.builders.controversy = function(s) {
    const text = `CONTEXTO — ${s.topic}\n` +
      `A aplicação científica/tecnológica em debate é ${s.application}. Benefício potencial apresentado: ${s.benefit}. Risco ou preocupação: ${s.concern}. ` +
      `Dado disponível: ${s.data}. Há também requisitos éticos e/ou legais: ${s.ethics}. ` +
      `A atividade não pede concordância automática com uma posição; pede comparar argumentos, distinguir evidência de valor e construir uma decisão responsável que reconheça benefícios, riscos, direitos e incertezas.`;
    return {
      tema:`${s.topic}: evidências, ética e decisão responsável`,
      objetivo:'Analisar situações controversas envolvendo aplicações das Ciências da Natureza com argumentos consistentes, éticos, legais e responsáveis.',
      instrucaoGeral:'Separe evidências empíricas, riscos, valores éticos e condições legais antes de construir sua posição argumentada.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'associacao','Associe os elementos do caso: benefício, risco, evidência e princípio ético/legal.',['benefício — resultado positivo esperado','risco — possibilidade de dano','evidência — dado que sustenta uma afirmação factual','princípio ético/legal — limite ou obrigação para a decisão'],'medio'),
        q(2,'analise',`Explique o que o dado “${s.data}” permite concluir e o que não permite.`),
        q(3,'multipla-escolha','Qual argumento é mais responsável?',['Ponderar benefício, risco, evidência, direitos e incertezas.','Aceitar a aplicação porque é nova.','Rejeitar a aplicação apenas porque gera debate.','Ignorar requisitos éticos quando há benefício técnico.'],'pequeno'),
        q(4,'verdadeiro-falso','Marque Verdadeiro ou Falso: duas pessoas podem concordar sobre os mesmos dados e ainda atribuir pesos diferentes a valores éticos, desde que não distorçam as evidências.',['Verdadeiro','Falso'],'pequeno'),
        q(5,'discursiva',`Apresente um argumento favorável condicionado a salvaguardas e um argumento de cautela sobre ${s.application}.`),
        q(6,'analise',`Explique por que “${s.ethics}” precisa fazer parte da avaliação e não pode ser substituído apenas por eficiência técnica.`),
        q(7,'revisao','Transforme uma afirmação extrema (“é totalmente seguro” ou “é sempre inaceitável”) em uma frase proporcional às evidências do caso.'),
        q(8,'producao','Escreva uma decisão argumentada de cinco linhas com condição de uso, salvaguarda, evidência e uma incerteza ainda relevante.')
      ],
      gabarito:[
        a(1,'Benefício — resultado positivo; risco — dano possível; evidência — dado; princípio ético/legal — limite/obrigação.','Distingue dimensões da decisão.'),
        a(2,'Resposta deve delimitar a conclusão ao alcance do dado e identificar ao menos uma inferência que exigiria informação adicional.','Evita extrapolação.'),
        a(3,'A) Ponderar benefício, risco, evidência, direitos e incertezas.','É a abordagem compatível com análise responsável.'),
        a(4,'Verdadeiro.','Valores podem influenciar decisões, mas fatos e evidências não devem ser distorcidos.'),
        a(5,`Favorável: reconhecer ${s.benefit} sob condições. Cautela: considerar ${s.concern} e salvaguardas.`,'Aceitar formulações equivalentes sustentadas no material.'),
        a(6,'Porque aplicações científicas afetam pessoas, direitos, ambiente e responsabilidade; eficiência não resolve sozinha questões de consentimento, justiça ou segurança.','Integra técnica e ética.'),
        a(7,'Resposta proporcional, por exemplo: “nas condições estudadas, os dados sugerem benefício/risco, mas há limites e salvaguardas necessárias”.','Evitar absolutos não sustentados.'),
        a(8,'Decisão autoral que cite evidência, benefício, risco, salvaguarda e incerteza.','Não há resposta única; avaliar qualidade argumentativa.')
      ]
    };
  };

  core.builders.equityMisuse = function(s) {
    const text = `CONTEXTO — ${s.caseName}\n` +
      `${s.historicalClaim}. Hoje, a análise científica reconhece problemas metodológicos e éticos: ${s.problem}. ` +
      `O uso indevido de conceitos biológicos para criar hierarquias sociais confundiu variação humana, ambiente, cultura e direitos, além de transformar descrições ou dados enviesados em justificativas normativas. ` +
      `A atividade examina como identificar esse uso indevido e como comunicar ciência de modo compatível com equidade e respeito à diversidade.`;
    return {
      tema:`${s.caseName}: uso indevido da ciência, discriminação e equidade`,
      objetivo:'Investigar usos indevidos de conhecimentos das Ciências da Natureza na justificativa de discriminação e privação de direitos, promovendo equidade e respeito à diversidade.',
      instrucaoGeral:'Analise falhas científicas e éticas sem reproduzir como válidas as hierarquias discriminatórias do caso histórico.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'analise','Identifique uma falha metodológica e uma falha ética presentes no uso da ciência descrito no caso.'),
        q(2,'multipla-escolha','Qual princípio é compatível com a ciência contemporânea e com direitos humanos?',['Variação biológica não determina hierarquias de valor ou direitos entre grupos humanos.','Uma medida física define mérito social.','Diferenças médias autorizam negar direitos individuais.','Dados enviesados tornam discriminação cientificamente válida.'],'pequeno'),
        q(3,'verdadeiro-falso','Marque Verdadeiro ou Falso: descrever diferenças observadas autoriza transformar essas diferenças em uma escala de valor social.',['Verdadeiro','Falso'],'pequeno'),
        q(4,'discursiva',`Explique por que “${s.problem}” enfraquece a conclusão apresentada historicamente.`),
        q(5,'associacao','Associe: viés de amostra, correlação, causalidade e equidade.',['viés de amostra — seleção que distorce a representação','correlação — associação entre variáveis','causalidade — relação de causa que exige evidência específica','equidade — compromisso com direitos e redução de desigualdades injustas'],'medio'),
        q(6,'analise','Explique como fatores ambientais, sociais e históricos podem confundir interpretações simplistas de diferenças entre grupos.'),
        q(7,'revisao','Reescreva a conclusão discriminatória do caso como uma crítica científica que aponte limites dos dados e rejeite hierarquias de valor humano.'),
        q(8,'producao','Produza um parágrafo curto sobre como a educação científica pode ajudar a reconhecer e combater usos indevidos da ciência.')
      ],
      gabarito:[
        a(1,'Falha metodológica: amostragem, variável de confusão, correlação tratada como causa ou medição inadequada; falha ética: uso para hierarquizar pessoas/retirar direitos.','A resposta deve abordar ciência e ética.'),
        a(2,'A) Variação biológica não determina hierarquias de valor ou direitos entre grupos humanos.','Diferença biológica não fundamenta desigualdade de dignidade ou direitos.'),
        a(3,'Falso.','Descrições empíricas não produzem automaticamente juízos normativos de valor.'),
        a(4,`Deve explicar como ${s.problem} impede inferência robusta ou generalização legítima.`,'Relacionar problema metodológico à conclusão.'),
        a(5,'Viés — distorção de seleção; correlação — associação; causalidade — causa; equidade — direitos e redução de desigualdades injustas.','Definições.'),
        a(6,'Ambiente, nutrição, acesso a recursos, discriminação e história social podem afetar medidas e resultados, impedindo explicações puramente biológicas simplistas.','Reconhece variáveis de contexto.'),
        a(7,'Resposta deve rejeitar a hierarquia, apontar limites metodológicos e evitar generalização discriminatória.','Revisão científica e ética.'),
        a(8,'Parágrafo deve citar pensamento crítico, verificação de evidências, história da ciência e compromisso com respeito à diversidade.','Avaliar coerência e responsabilidade.')
      ]
    };
  };

  core.builders.safetyRisk = function(s) {
    const riskA = s.probA * s.sevA;
    const riskB = s.probB * s.sevB;
    const higher = riskA >= riskB ? s.hazardA : s.hazardB;
    const text = `CONTEXTO — ${s.activity}\n` +
      `Para priorizar controles, use um índice didático de risco = probabilidade × gravidade. ${s.hazardA}: probabilidade ${s.probA} e gravidade ${s.sevA}. ` +
      `${s.hazardB}: probabilidade ${s.probB} e gravidade ${s.sevB}. Os valores servem apenas para ordenar prioridades no exercício; uma análise real inclui normas, exposição, treinamento e características do ambiente. ` +
      `Medidas disponíveis: ${s.controls}. A prevenção deve preferir eliminar/reduzir o perigo na fonte antes de depender apenas de equipamento de proteção individual.`;
    return {
      tema:`${s.activity}: avaliação de risco e prevenção`,
      objetivo:'Avaliar riscos de atividades cotidianas e justificar equipamentos, recursos e comportamentos de segurança.',
      instrucaoGeral:'Calcule os índices, priorize controles e justifique medidas de segurança pela hierarquia de prevenção.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'resolucao',`Calcule o índice didático de risco para “${s.hazardA}”.`),
        q(2,'resolucao',`Calcule o índice didático de risco para “${s.hazardB}”.`),
        q(3,'multipla-escolha','Qual perigo recebe prioridade pelo índice calculado?',[higher,higher===s.hazardA?s.hazardB:s.hazardA,'Os dois têm índice zero.','Não existe diferença entre os índices.'],'pequeno'),
        q(4,'verdadeiro-falso','Marque Verdadeiro ou Falso: equipamento de proteção individual é sempre a única e melhor forma de controlar qualquer risco.',['Verdadeiro','Falso'],'pequeno'),
        q(5,'analise',`Explique como uma medida de “${s.controls}” pode reduzir probabilidade, gravidade ou exposição.`),
        q(6,'associacao','Associe: eliminar, substituir/engenharia, procedimento e EPI.',['eliminar — retirar o perigo quando possível','engenharia — isolar ou reduzir o perigo na fonte','procedimento — organizar comportamento e trabalho','EPI — barreira individual complementar'],'medio'),
        q(7,'interpretacao','Explique por que o índice numérico ajuda a priorizar, mas não substitui uma análise de risco completa.'),
        q(8,'producao','Crie um plano de três medidas em ordem de prioridade para o cenário, justificando cada uma.')
      ],
      gabarito:[
        a(1,`${riskA}.`,'Probabilidade A × gravidade A.'),
        a(2,`${riskB}.`,'Probabilidade B × gravidade B.'),
        a(3,`${higher}.`,'Maior índice didático calculado.'),
        a(4,'Falso.','Controles na fonte e medidas de engenharia/procedimento podem ser mais eficazes; EPI é complementar.'),
        a(5,'Resposta deve ligar a medida a redução de probabilidade, gravidade ou exposição.','Justificativa causal de segurança.'),
        a(6,'Eliminar — retirar; engenharia — isolar/reduzir na fonte; procedimento — organizar trabalho; EPI — barreira individual.','Hierarquia simplificada de controles.'),
        a(7,'Porque riscos reais dependem de exposição, frequência, pessoas afetadas, incerteza e normas além do produto probabilidade×gravidade.','Reconhece limite do modelo.'),
        a(8,'Plano autoral priorizando controles coletivos/na fonte e usando EPI de forma complementar quando pertinente.','Avaliar hierarquia e justificativa.')
      ]
    };
  };

  core.builders.materialProperties = function(s) {
    const text = `CONTEXTO — ${s.application}\n` +
      `Três materiais são candidatos. A: ${s.matA}. B: ${s.matB}. C: ${s.matC}. ` +
      `A aplicação exige principalmente ${s.requirement1} e ${s.requirement2}, além de considerar segurança, durabilidade, custo de ciclo de vida e possibilidade de reutilização/reciclagem. ` +
      `Nenhuma propriedade isolada determina a escolha: o material adequado resulta da combinação entre requisitos da função e impactos do contexto.`;
    return {
      tema:`${s.application}: propriedades, adequação e sustentabilidade`,
      objetivo:'Analisar propriedades dos materiais para avaliar adequação de uso e propor soluções seguras e sustentáveis.',
      instrucaoGeral:'Compare propriedades relevantes para a função e justifique a escolha por critérios técnicos e ambientais.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'analise',`Qual propriedade é diretamente relacionada ao requisito “${s.requirement1}”? Explique.`),
        q(2,'analise',`Qual propriedade é diretamente relacionada ao requisito “${s.requirement2}”? Explique.`),
        q(3,'multipla-escolha','Qual procedimento é mais adequado para selecionar um material?',['Comparar simultaneamente requisitos, propriedades, segurança e ciclo de vida.','Escolher sempre o material mais barato.','Escolher apenas pela aparência.','Ignorar condições de uso.'],'pequeno'),
        q(4,'discursiva','Compare os materiais A e B e apresente uma vantagem e uma limitação de cada um para a aplicação.'),
        q(5,'verdadeiro-falso','Marque Verdadeiro ou Falso: um material pode ter excelente desempenho técnico e ainda ser inadequado se gerar risco ou impacto incompatível com o contexto.',['Verdadeiro','Falso'],'pequeno'),
        q(6,'associacao','Associe critério e pergunta: propriedade, segurança, durabilidade e circularidade.',['propriedade — atende à função física/química?','segurança — gera risco no uso?','durabilidade — mantém desempenho ao longo do tempo?','circularidade — pode ser reutilizado, reparado ou reciclado?'],'medio'),
        q(7,'interpretacao','Escolha entre A, B e C para o contexto e justifique com pelo menos três critérios do material.'),
        q(8,'producao','Proponha uma melhoria de projeto que permita usar menos material ou ampliar sua vida útil sem comprometer a segurança.')
      ],
      gabarito:[
        a(1,`Resposta deve relacionar ${s.requirement1} à propriedade pertinente descrita nos candidatos.`,'Relação função-propriedade.'),
        a(2,`Resposta deve relacionar ${s.requirement2} à propriedade pertinente descrita nos candidatos.`,'Relação função-propriedade.'),
        a(3,'A) Comparar simultaneamente requisitos, propriedades, segurança e ciclo de vida.','Seleção de material é multicritério.'),
        a(4,'Resposta baseada nas propriedades descritas, sem inventar características ausentes.','Comparação fundamentada.'),
        a(5,'Verdadeiro.','Adequação inclui desempenho, risco e impacto.'),
        a(6,'Propriedade — função; segurança — risco; durabilidade — tempo de serviço; circularidade — reuso/reparo/reciclagem.','Critérios de projeto.'),
        a(7,'Não há escolha única se diferentes critérios forem ponderados; a resposta deve citar ao menos três propriedades/requisitos do texto e explicitar a prioridade adotada.','Avaliar justificativa técnica.'),
        a(8,'Resposta autoral plausível, como reduzir massa, modularizar, reparar ou usar revestimento, mantendo requisito de segurança.','Melhoria deve respeitar função.')
      ]
    };
  };

  core.builders.automation = function(s) {
    const triggered = s.measure >= s.threshold;
    const text = `CONTEXTO — ${s.system}\n` +
      `O sistema usa um sensor de ${s.variable}. A regra de controle é: se a leitura for maior ou igual a ${fmt(s.threshold)} ${s.unit}, o atuador ${s.actionOn}; abaixo disso, ${s.actionOff}. ` +
      `Em um teste, a leitura foi ${fmt(s.measure)} ${s.unit}. O sistema consome ${fmt(s.power)} W quando o atuador está ligado e opera por ${fmt(s.hours)} h no cenário analisado. ` +
      `Além do funcionamento técnico, a avaliação deve considerar falhas de sensor, manutenção, consumo de energia, impactos sociais e descarte de componentes eletrônicos.`;
    return {
      tema:`${s.system}: sensor, decisão automática e impactos`,
      objetivo:'Investigar o funcionamento de equipamentos eletrônicos e sistemas de automação e avaliar impactos sociais, culturais e ambientais.',
      instrucaoGeral:'Aplique a lógica do controle, calcule o consumo e analise benefícios e falhas possíveis.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'multipla-escolha','Com a leitura do teste, qual estado o sistema deve assumir?',[triggered?s.actionOn:s.actionOff,triggered?s.actionOff:s.actionOn,'Desligar definitivamente o sensor.','Ignorar a regra programada.'],'pequeno'),
        q(2,'resolucao','Calcule a energia consumida pelo atuador no período informado, em Wh.'),
        q(3,'analise','Explique a função do sensor e a função do atuador no sistema.'),
        q(4,'verdadeiro-falso','Marque Verdadeiro ou Falso: se o sensor estiver descalibrado, a automação pode executar uma ação inadequada mesmo que o código esteja correto.',['Verdadeiro','Falso'],'pequeno'),
        q(5,'discursiva','Indique uma vantagem e um risco da automação para usuários ou trabalhadores.'),
        q(6,'analise','Explique um impacto ambiental associado ao consumo de energia ou ao descarte dos componentes eletrônicos.'),
        q(7,'associacao','Associe: sensor, controlador, atuador e realimentação.',['sensor — mede variável','controlador — aplica regra de decisão','atuador — executa ação física','realimentação — nova medição usada para ajustar o sistema'],'medio'),
        q(8,'producao','Proponha uma melhoria de segurança ou eficiência e indique como testá-la antes de colocar o sistema em uso.')
      ],
      gabarito:[
        a(1,`${triggered?s.actionOn:s.actionOff}.`,'A leitura é comparada ao limiar definido.'),
        a(2,`${fmt(s.power*s.hours)} Wh.`,'Potência multiplicada pelo tempo.'),
        a(3,'Sensor mede a variável; atuador transforma o comando em ação física.','Funções básicas da automação.'),
        a(4,'Verdadeiro.','Erro de medição pode produzir decisão incorreta mesmo com regra lógica correta.'),
        a(5,'Resposta coerente, como ganho de precisão/tempo versus dependência, falha, vigilância ou alteração do trabalho.','Considerar impacto social realista.'),
        a(6,'Resposta pode citar consumo elétrico, produção de equipamentos, baterias ou lixo eletrônico.','Relacionar tecnologia e ambiente.'),
        a(7,'Sensor — mede; controlador — decide; atuador — executa; realimentação — mede novamente para ajuste.','Arquitetura básica.'),
        a(8,'Resposta com melhoria específica e procedimento de teste controlado/falha segura.','Deve incluir verificação antes do uso.')
      ]
    };
  };

  core.builders.researchDesign = function(s) {
    const meanA = s.valuesA.reduce((x,y)=>x+y,0)/s.valuesA.length;
    const meanB = s.valuesB.reduce((x,y)=>x+y,0)/s.valuesB.length;
    const diff = meanB - meanA;
    const text = `CONTEXTO — ${s.question}\n` +
      `Hipótese proposta: ${s.hypothesis}. O grupo comparou ${s.conditionA} e ${s.conditionB}. Resultados de A: ${s.valuesA.join(', ')} ${s.unit}; resultados de B: ${s.valuesB.join(', ')} ${s.unit}. ` +
      `A variável observada é ${s.variable}; um controle importante é ${s.control}. Foram feitas repetições porque uma única medida pode sofrer variação experimental. ` +
      `A conclusão deve ser proporcional aos dados e indicar possíveis fontes de erro.`;
    return {
      tema:`${s.question}: hipótese, variável, evidência e conclusão`,
      objetivo:'Construir questões e hipóteses, empregar medições, interpretar resultados experimentais e justificar conclusões.',
      instrucaoGeral:'Calcule as médias, identifique variáveis e avalie se os dados apoiam a hipótese sem extrapolação.',
      textoApoio:{titulo:s.title,conteudo:text},
      questoes:[
        q(1,'resolucao',`Calcule a média dos resultados em ${s.conditionA}.`),
        q(2,'resolucao',`Calcule a média dos resultados em ${s.conditionB}.`),
        q(3,'resolucao','Calcule a diferença entre a média de B e a média de A.'),
        q(4,'associacao','Associe: hipótese, variável independente, variável dependente e controle.',['hipótese — previsão testável','independente — condição comparada/manipulada','dependente — resultado medido','controle — fator mantido constante'],'medio'),
        q(5,'verdadeiro-falso','Marque Verdadeiro ou Falso: repetir medidas ajuda a observar variabilidade e reduz a dependência de um único resultado.',['Verdadeiro','Falso'],'pequeno'),
        q(6,'analise',`Com base nas médias, os dados apoiam a hipótese “${s.hypothesis}”? Justifique sem afirmar certeza absoluta.`),
        q(7,'discursiva','Indique uma fonte possível de erro ou incerteza e uma forma de reduzi-la em nova repetição.'),
        q(8,'producao','Escreva uma conclusão científica de quatro linhas contendo resultado numérico, relação com a hipótese e uma limitação.')
      ],
      gabarito:[
        a(1,`${fmt(meanA,2)} ${s.unit}.`,'Média aritmética das repetições A.'),
        a(2,`${fmt(meanB,2)} ${s.unit}.`,'Média aritmética das repetições B.'),
        a(3,`${fmt(diff,2)} ${s.unit}.`,'Média B menos média A.'),
        a(4,'Hipótese — previsão; independente — condição manipulada; dependente — resultado; controle — fator constante.','Elementos do desenho experimental.'),
        a(5,'Verdadeiro.','Repetições mostram variabilidade e tornam a estimativa mais robusta.'),
        a(6,'Resposta deve comparar direção da diferença com a hipótese e usar linguagem como “apoia”, “não apoia” ou “é inconclusivo” nesta amostra.','Não aceitar certeza universal a partir do conjunto limitado.'),
        a(7,'Exemplos: erro de instrumento, variação ambiental, tempo de leitura; reduzir por calibração, controle, padronização ou mais repetições.','Fonte e correção devem corresponder.'),
        a(8,`Conclusão deve citar médias ${fmt(meanA,2)} e ${fmt(meanB,2)} ${s.unit}, diferença ${fmt(diff,2)}, relação com hipótese e limitação.`,'Síntese completa do experimento.')
      ]
    };
  };
})();
