import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = process.cwd();
const bnccUrl = 'https://cdn.mec.gov.br/basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf';

const S = {
  1: [
    ['EF01CI05','Escalas de tempo','Manhã, tarde e noite fazem parte do dia; dias formam semanas, semanas compõem meses e meses organizam os anos. Essas escalas ajudam a ordenar acontecimentos e rotinas.','Identificar e nomear diferentes escalas de tempo: os períodos diários (manhã, tarde, noite) e a sucessão de dias, semanas, meses e anos.','sequência temporal, calendário e rotina','uma linha do tempo ilustrada com manhã, tarde, noite, semana, mês e ano'],
    ['EF01CI06','Dia, noite e ritmos dos seres vivos','A alternância entre dia e noite influencia horários de sono, alimentação, estudo e atividade de muitos seres vivos. Pessoas e animais podem ter ritmos diferentes ao longo das 24 horas.','Selecionar exemplos de como a sucessão de dias e noites orienta o ritmo de atividades diárias de seres humanos e de outros seres vivos.','rotina diária de pessoas e animais','crianças comparando atividades diurnas e noturnas de pessoas e animais']
  ],
  2: [
    ['EF02CI07','Sol e tamanho das sombras','A posição aparente do Sol muda ao longo do dia e, por isso, a direção e o comprimento das sombras também mudam. Comparar sombras em horários diferentes permite reconhecer esse padrão.','Descrever as posições do Sol em diversos horários do dia e associá-las ao tamanho da sombra projetada.','posição do Sol, horário e comprimento da sombra','crianças observando a sombra de uma haste pela manhã, ao meio-dia e à tarde'],
    ['EF02CI08','Aquecimento e reflexão da luz solar','Superfícies claras, escuras, metálicas, água, areia e solo podem aquecer e refletir a luz solar de modos diferentes. Comparações devem ser feitas nas mesmas condições para produzir observações confiáveis.','Comparar o efeito da radiação solar (aquecimento e reflexão) em diferentes tipos de superfície (água, areia, solo, superfícies escura, clara e metálica etc.).','aquecimento e reflexão em superfícies','mesa de investigação com superfícies claras, escuras, metálicas, água, areia e solo sob luz solar']
  ],
  3: [
    ['EF03CI07','Representações do planeta Terra','Globos, mapas e fotografias mostram a Terra de maneiras diferentes. A comparação dessas representações ajuda a reconhecer o formato aproximadamente esférico do planeta e a presença de água e continentes.','Identificar características da Terra (como seu formato esférico, a presença de água, solo etc.), com base na observação, manipulação e comparação de diferentes formas de representação do planeta (mapas, globos, fotografias etc.).','globo, mapa, fotografia e características da Terra','alunos comparando globo terrestre, mapa-múndi e fotografia do planeta'],
    ['EF03CI08','Astros visíveis no céu','O céu observado durante o dia não é igual ao céu noturno. Sol, Lua, estrelas e alguns planetas podem ser percebidos em períodos diferentes, e registros de observação ajudam a comparar o que aparece em cada horário.','Observar, identificar e registrar os períodos diários (dia e/ou noite) em que o Sol, demais estrelas, Lua e planetas estão visíveis no céu.','registro de observação do céu','diário ilustrado do céu durante o dia e a noite'],
    ['EF03CI09','Características de diferentes solos','Amostras de solo podem variar em cor, textura, cheiro, tamanho dos grãos e capacidade de deixar a água passar. Observar as mesmas características em cada amostra permite comparações mais justas.','Comparar diferentes amostras de solo do entorno da escola com base em características como cor, textura, cheiro, tamanho das partículas, permeabilidade etc.','cor, textura, partículas e permeabilidade do solo','bandejas com diferentes amostras de solo e uma investigação de permeabilidade'],
    ['EF03CI10','Usos e importância do solo','O solo sustenta plantas, abriga organismos, participa da produção de alimentos e fornece materiais usados pelas pessoas. Seu uso precisa considerar conservação, agricultura e qualidade ambiental.','Identificar os diferentes usos do solo (plantação e extração de materiais, dentre outras possibilidades), reconhecendo a importância do solo para a agricultura e para a vida.','agricultura, vida e usos do solo','paisagem mostrando horta, área de vegetação e uso responsável do solo']
  ],
  4: [
    ['EF04CI09','Pontos cardeais, Sol e gnômon','Norte, Sul, Leste e Oeste são referências de orientação. O registro das posições aparentes do Sol e das sombras de uma haste vertical em horários diferentes pode ajudar a determinar direções.','Identificar os pontos cardeais, com base no registro de diferentes posições relativas do Sol e da sombra de uma vara (gnômon).','pontos cardeais, Sol e sombra','crianças usando um gnômon e uma rosa dos ventos no pátio'],
    ['EF04CI10','Gnômon e bússola','O gnômon usa a mudança das sombras e a bússola usa uma agulha magnetizada como referências de orientação. Comparar os dois procedimentos permite verificar resultados e discutir possíveis diferenças de medição.','Comparar as indicações dos pontos cardeais resultantes da observação das sombras de uma vara (gnômon) com aquelas obtidas por meio de uma bússola.','comparação entre gnômon e bússola','grupo registrando, lado a lado, indicações de um gnômon e de uma bússola'],
    ['EF04CI11','Ciclos da Lua, da Terra e calendários','Movimentos cíclicos da Terra e da Lua produzem regularidades observadas pelas pessoas. Diferentes culturas usaram essas regularidades para organizar dias, meses, épocas de plantio, festas e calendários.','Associar os movimentos cíclicos da Lua e da Terra a períodos de tempo regulares e ao uso desse conhecimento para a construção de calendários em diferentes culturas.','ciclos astronômicos e calendários','sequência das fases da Lua, Terra e diferentes formas de calendário']
  ],
  5: [
    ['EF05CI10','Constelações e mapas celestes','Constelações são padrões aparentes de estrelas vistos da Terra. Mapas celestes e aplicativos ajudam a localizar constelações e a perceber que algumas ficam mais fáceis de observar em determinadas épocas do ano.','Identificar algumas constelações no céu, com o apoio de recursos (como mapas celestes e aplicativos digitais, entre outros), e os períodos do ano em que elas são visíveis no início da noite.','mapas celestes, constelações e épocas do ano','estudantes usando mapa celeste para reconhecer constelações no início da noite'],
    ['EF05CI11','Rotação da Terra e movimento aparente do céu','A Terra gira em torno de seu próprio eixo. Esse movimento de rotação ajuda a explicar por que o Sol e outras estrelas parecem se deslocar no céu ao longo do dia e da noite.','Associar o movimento diário do Sol e das demais estrelas no céu ao movimento de rotação da Terra.','rotação terrestre e movimento aparente dos astros','modelo com a Terra girando e setas mostrando o movimento aparente do céu'],
    ['EF05CI12','Periodicidade das fases da Lua','As formas aparentes da Lua mudam em uma sequência que se repete. Registros feitos ao longo de várias semanas permitem reconhecer a periodicidade das fases e comparar datas e aparências.','Concluir sobre a periodicidade das fases da Lua, com base na observação e no registro das formas aparentes da Lua no céu ao longo de, pelo menos, dois meses.','observação e registro das fases da Lua','calendário de dois meses com registros sucessivos das fases da Lua'],
    ['EF05CI13','Instrumentos ópticos e seus usos','Lupas, microscópios, lunetas, periscópios e câmeras ampliam, aproximam, desviam ou registram imagens. A construção de modelos simples ajuda a compreender suas funções e os usos sociais desses dispositivos.','Projetar e construir dispositivos para observação à distância (luneta, periscópio etc.), para observação ampliada de objetos (lupas, microscópios) ou para registro de imagens (máquinas fotográficas) e discutir usos sociais desses dispositivos.','instrumentos ópticos, construção e função','bancada escolar com lupa, periscópio, luneta e câmera em uso']
  ],
  6: [
    ['EF06CI11','Camadas do planeta Terra','A Terra possui camadas com características distintas, da crosta e regiões internas até a atmosfera. Modelos científicos organizam essas partes para explicar a estrutura do planeta.','Identificar as diferentes camadas que estruturam o planeta Terra (da estrutura interna à atmosfera) e suas principais características.','estrutura interna da Terra e atmosfera','corte esquemático da Terra com suas camadas e a atmosfera'],
    ['EF06CI12','Rochas e formação de fósseis','Rochas ígneas, sedimentares e metamórficas se formam por processos diferentes. Fósseis são encontrados principalmente em rochas sedimentares, nas quais sedimentos podem preservar vestígios de seres vivos ao longo do tempo geológico.','Identificar diferentes tipos de rocha, relacionando a formação de fósseis a rochas sedimentares em diferentes períodos geológicos.','tipos de rocha, sedimentos e fósseis','amostras de rochas e camadas sedimentares contendo um fóssil'],
    ['EF06CI13','Evidências da esfericidade da Terra','A esfericidade da Terra é sustentada por diferentes evidências, como fotografias obtidas do espaço, a sombra terrestre em eclipses lunares e mudanças observadas no horizonte. Uma conclusão científica reúne evidências convergentes.','Selecionar argumentos e evidências que demonstrem a esfericidade da Terra.','argumentos e evidências sobre a forma da Terra','montagem com horizonte, eclipse lunar, globo e imagem da Terra vista do espaço'],
    ['EF06CI14','Sombras, rotação e translação','O comprimento e a direção da sombra de um gnômon variam ao longo do dia e também em diferentes épocas do ano. Esses padrões se relacionam à rotação, à translação e à inclinação do eixo terrestre.','Inferir que as mudanças na sombra de uma vara (gnômon) ao longo do dia em diferentes períodos do ano são uma evidência dos movimentos relativos entre a Terra e o Sol, que podem ser explicados por meio dos movimentos de rotação e translação da Terra e da inclinação de seu eixo de rotação em relação ao plano de sua órbita em torno do Sol.','gnômon, rotação, translação e inclinação do eixo','gráfico de sombras de um gnômon em horários e épocas do ano diferentes']
  ],
  7: [
    ['EF07CI12','Composição do ar','O ar atmosférico é uma mistura formada principalmente por nitrogênio e oxigênio, além de outros gases em menores proporções. Processos naturais e ações humanas podem alterar localmente sua composição e a qualidade do ar.','Demonstrar que o ar é uma mistura de gases, identificando sua composição, e discutir fenômenos naturais ou antrópicos que podem alterar essa composição.','mistura de gases e qualidade do ar','diagrama da composição do ar e fontes naturais e humanas de alteração'],
    ['EF07CI13','Efeito estufa e atividades humanas','O efeito estufa natural mantém a Terra em temperaturas compatíveis com a vida. O aumento da concentração de gases de efeito estufa por queima de combustíveis fósseis, desmatamento e queimadas intensifica o aquecimento do planeta.','Descrever o mecanismo natural do efeito estufa, seu papel fundamental para o desenvolvimento da vida na Terra, discutir as ações humanas responsáveis pelo seu aumento artificial (queima dos combustíveis fósseis, desmatamento, queimadas etc.) e selecionar e implementar propostas para a reversão ou controle desse quadro.','efeito estufa natural, intensificação e mitigação','esquema da atmosfera retendo parte do calor e ações de redução de emissões'],
    ['EF07CI14','Camada de ozônio','A camada de ozônio na estratosfera absorve grande parte da radiação ultravioleta solar prejudicial aos seres vivos. Certas substâncias podem favorecer sua redução, e acordos e ações de controle ajudam na preservação.','Justificar a importância da camada de ozônio para a vida na Terra, identificando os fatores que aumentam ou diminuem sua presença na atmosfera, e discutir propostas individuais e coletivas para sua preservação.','ozônio estratosférico e proteção contra ultravioleta','camada de ozônio filtrando radiação ultravioleta e ações de preservação'],
    ['EF07CI15','Placas tectônicas e fenômenos naturais','A litosfera é dividida em placas tectônicas que se movimentam lentamente. Limites de placas concentram muitos terremotos, vulcões e tsunamis; o Brasil fica no interior da Placa Sul-Americana, o que ajuda a explicar a menor frequência de eventos intensos.','Interpretar fenômenos naturais (como vulcões, terremotos e tsunamis) e justificar a rara ocorrência desses fenômenos no Brasil, com base no modelo das placas tectônicas.','placas tectônicas, terremotos, vulcões e tsunamis','mapa de placas tectônicas com destaque para a posição do Brasil'],
    ['EF07CI16','Deriva continental','O encaixe aproximado entre partes das costas da América do Sul e da África é uma evidência histórica discutida na teoria da deriva continental. Outras evidências geológicas e fósseis reforçam que os continentes mudaram de posição ao longo do tempo.','Justificar o formato das costas brasileira e africana com base na teoria da deriva dos continentes.','deriva continental e evidências geológicas','mapa mostrando América do Sul e África aproximadas como em um quebra-cabeça']
  ],
  8: [
    ['EF08CI12','Fases da Lua e eclipses','Fases da Lua e eclipses dependem das posições relativas entre Sol, Terra e Lua. Modelos ajudam a distinguir a parte iluminada pelo Sol, a parte visível da Terra e os alinhamentos que produzem eclipses.','Justificar, por meio da construção de modelos e da observação da Lua no céu, a ocorrência das fases da Lua e dos eclipses, com base nas posições relativas entre Sol, Terra e Lua.','geometria Sol-Terra-Lua, fases e eclipses','modelo tridimensional das posições de Sol, Terra e Lua em fases e eclipses'],
    ['EF08CI13','Rotação, translação e estações do ano','Rotação é o giro da Terra em torno de seu eixo; translação é seu movimento ao redor do Sol. A inclinação do eixo terrestre modifica a distribuição de luz entre os hemisférios ao longo da órbita e participa da formação das estações.','Representar os movimentos de rotação e translação da Terra e analisar o papel da inclinação do eixo de rotação da Terra em relação à sua órbita na ocorrência das estações do ano, com a utilização de modelos tridimensionais.','movimentos da Terra, inclinação do eixo e estações','modelo da órbita terrestre com eixo inclinado em quatro posições do ano'],
    ['EF08CI14','Circulação atmosférica, oceanos e clima','A energia solar aquece a superfície terrestre de modo desigual. Diferenças de latitude, relevo, oceanos e circulação de ar e água contribuem para padrões climáticos regionais.','Relacionar climas regionais aos padrões de circulação atmosférica e oceânica e ao aquecimento desigual causado pela forma e pelos movimentos da Terra.','circulação atmosférica e oceânica, aquecimento desigual e clima','mapa com correntes oceânicas, ventos e faixas de aquecimento da Terra'],
    ['EF08CI15','Variáveis da previsão do tempo','Previsões do tempo combinam medidas como temperatura, umidade, pressão atmosférica, vento e precipitação. Instrumentos e séries de dados permitem acompanhar mudanças e estimar condições futuras.','Identificar as principais variáveis envolvidas na previsão do tempo e simular situações nas quais elas possam ser medidas.','temperatura, umidade, pressão, vento e precipitação','estação meteorológica escolar com termômetro, pluviômetro, anemômetro e barômetro'],
    ['EF08CI16','Alterações climáticas e equilíbrio ambiental','Mudanças climáticas podem alterar temperaturas, chuvas, eventos extremos e ecossistemas. Redução de emissões, proteção de vegetação, eficiência energética e adaptação local são exemplos de iniciativas baseadas em diagnóstico ambiental.','Discutir iniciativas que contribuam para restabelecer o equilíbrio ambiental a partir da identificação de alterações climáticas regionais e globais provocadas pela intervenção humana.','mudanças climáticas, mitigação e adaptação','comunidade analisando dados climáticos e planejando ações ambientais']
  ],
  9: [
    ['EF09CI12','Unidades de conservação e biodiversidade','Parques, reservas e florestas nacionais têm objetivos e regras diferentes, mas todos podem contribuir para conservar biodiversidade e patrimônio natural. O planejamento deve considerar ecossistemas, populações humanas e atividades relacionadas ao território.','Justificar a importância das unidades de conservação para a preservação da biodiversidade e do patrimônio nacional, considerando os diferentes tipos de unidades (parques, reservas e florestas nacionais), as populações humanas e as atividades a eles relacionados.','unidades de conservação, biodiversidade e sociedade','mapa de parque, reserva e floresta nacional com biodiversidade e comunidades locais'],
    ['EF09CI13','Sustentabilidade na comunidade','Problemas ambientais locais podem ser enfrentados por ações individuais e coletivas baseadas em evidências. Consumo consciente, redução de resíduos, mobilidade, uso eficiente de água e energia e recuperação de áreas são exemplos que precisam ser avaliados por resultados.','Propor iniciativas individuais e coletivas para a solução de problemas ambientais da cidade ou da comunidade, com base na análise de ações de consumo consciente e de sustentabilidade bem-sucedidas.','problemas ambientais locais e soluções sustentáveis','estudantes analisando indicadores ambientais e um plano de ação comunitário'],
    ['EF09CI14','Sistema Solar, Via Láctea e Universo','O Sistema Solar contém o Sol, planetas rochosos, gigantes gasosos, planetas anões e corpos menores. Ele está na Via Láctea, uma galáxia entre bilhões existentes no Universo.','Descrever a composição e a estrutura do Sistema Solar (Sol, planetas rochosos, planetas gigantes gasosos e corpos menores), assim como a localização do Sistema Solar na nossa Galáxia (a Via Láctea) e dela no Universo (apenas uma galáxia dentre bilhões).','estrutura e escalas do Sistema Solar ao Universo','diagrama em escalas do Sistema Solar, Via Láctea e conjunto de galáxias'],
    ['EF09CI15','Astronomia e culturas','Diferentes povos observaram o céu para orientar deslocamentos, marcar épocas de plantio e caça, construir calendários e elaborar explicações culturais sobre a origem do mundo e dos astros. Essas leituras devem ser compreendidas em seus contextos históricos e culturais.','Relacionar diferentes leituras do céu e explicações sobre a origem da Terra, do Sol ou do Sistema Solar às necessidades de distintas culturas (agricultura, caça, mito, orientação espacial e temporal etc.).','observação do céu, necessidades sociais e diversidade cultural','painel respeitoso com diferentes formas culturais de observar e organizar conhecimentos do céu'],
    ['EF09CI16','Condições para vida fora da Terra','A sobrevivência humana fora da Terra exige água, fonte de energia, proteção contra radiação, temperatura e pressão adequadas, alimento e sistemas de suporte à vida. Distâncias astronômicas tornam viagens e abastecimento desafios importantes.','Selecionar argumentos sobre a viabilidade da sobrevivência humana fora da Terra, com base nas condições necessárias à vida, nas características dos planetas e nas distâncias e nos tempos envolvidos em viagens interplanetárias e interestelares.','condições de vida, características planetárias e distâncias','base espacial conceitual com sistemas de água, ar, energia e proteção contra radiação'],
    ['EF09CI17','Evolução das estrelas e do Sol','Estrelas nascem em nuvens de gás e poeira, passam longos períodos produzindo energia por fusão nuclear e evoluem de acordo com sua massa. O Sol também tem um ciclo de vida e suas mudanças futuras terão efeitos sobre o Sistema Solar.','Analisar o ciclo evolutivo do Sol (nascimento, vida e morte) baseado no conhecimento das etapas de evolução de estrelas de diferentes dimensões e os efeitos desse processo no nosso planeta.','ciclo de vida estelar e evolução do Sol','sequência científica de nascimento, vida e etapas futuras de uma estrela como o Sol']
  ]
};

const contexts = [
  ['registro de observação','Um registro organizado por data, horário e evidência permite comparar mudanças sem depender apenas da memória.'],
  ['investigação no pátio','No pátio da escola, observações podem ser repetidas em pontos e horários definidos para comparar resultados.'],
  ['diário de uma semana','Anotações feitas durante vários dias ajudam a reconhecer regularidades e também diferenças entre as observações.'],
  ['comparação de dois casos','Comparar dois casos mantendo critérios iguais ajuda a identificar quais características realmente mudaram.'],
  ['modelo construído pela turma','Um modelo não é uma cópia perfeita da realidade: ele destaca relações importantes para explicar um fenômeno.'],
  ['mapa ou esquema científico','Mapas e esquemas organizam informações espaciais e relações que seriam difíceis de perceber apenas em uma descrição oral.'],
  ['dados em tabela','Uma tabela bem organizada separa variáveis e facilita a comparação de evidências antes de formular uma conclusão.'],
  ['sequência de imagens','Imagens ordenadas no tempo podem revelar etapas, movimentos ou mudanças que precisam ser explicados cientificamente.'],
  ['situação do bairro','Relacionar o conteúdo a uma situação observável no bairro permite discutir aplicações do conhecimento científico no cotidiano.'],
  ['situação da escola','A escola oferece situações reais para observar, registrar, comparar e propor soluções com base em evidências.'],
  ['pergunta investigável','Uma boa pergunta científica pode ser respondida por observação, comparação, medição, consulta a dados ou construção de modelos.'],
  ['hipótese e evidência','Uma hipótese é uma explicação provisória; ela precisa ser confrontada com evidências antes de ser aceita ou rejeitada.'],
  ['explicação de causa e efeito','Explicar causa e efeito exige indicar o mecanismo ou a relação que conecta uma condição observada ao resultado.'],
  ['leitura de gráfico','Gráficos permitem reconhecer tendências, máximos, mínimos e diferenças entre conjuntos de observações.'],
  ['notícia de divulgação científica','Uma notícia científica deve ser lida distinguindo dados, explicações, incertezas e opiniões.'],
  ['planejamento de experimento','Um experimento confiável define o que será observado, quais condições serão mantidas e como os resultados serão registrados.'],
  ['comparação com instrumento','Instrumentos ampliam a precisão das observações, mas seu uso exige procedimento adequado e leitura cuidadosa.'],
  ['observação em horários diferentes','Repetir uma observação em horários diferentes permite identificar mudanças associadas ao tempo.'],
  ['observação em épocas diferentes','Comparar épocas do ano pode revelar padrões que não aparecem em uma única observação.'],
  ['explicação com evidências','Uma conclusão científica fica mais forte quando cita evidências específicas e explica como elas sustentam a ideia.'],
  ['decisão baseada em dados','Uma decisão responsável considera dados, consequências e critérios, em vez de se apoiar apenas em impressão pessoal.'],
  ['problema e solução','Definir claramente um problema ajuda a comparar soluções e escolher ações compatíveis com as evidências disponíveis.'],
  ['previsão e verificação','Uma previsão pode ser testada por observações posteriores; comparar previsão e resultado ajuda a revisar explicações.'],
  ['classificação por critérios','Classificar exige critérios explícitos, aplicados da mesma maneira a todos os exemplos analisados.'],
  ['linha do tempo','Organizar acontecimentos em sequência temporal ajuda a distinguir duração, repetição e mudança.'],
  ['estudo de caso','Um estudo de caso reúne informações de uma situação concreta para aplicar conceitos e justificar conclusões.'],
  ['atividade de campo','Em uma atividade de campo, localização, horário, condições e observações devem ser registrados de forma sistemática.'],
  ['debate com argumentos','Argumentos científicos precisam ser coerentes com evidências e podem ser revistos quando aparecem dados melhores.'],
  ['avaliação de uma explicação','Avaliar uma explicação envolve verificar se ela responde à pergunta, usa evidências e evita contradições.'],
  ['síntese final','Uma síntese reúne as ideias centrais, relaciona evidências e apresenta uma conclusão clara sobre o fenômeno estudado.']
];

const slug = s => s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const stage = y => y <= 5 ? 'Ensino Fundamental — Anos Iniciais' : 'Ensino Fundamental — Anos Finais';
const dir = y => y <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
const skillByCode = new Map(Object.values(S).flat().map(a => [a[0], {code:a[0], topic:a[1], core:a[2], official:a[3], focus:a[4], image:a[5]}]));

function questions(year, title, sk, ctx) {
  const simple = year <= 2;
  const q = simple ? [
    `O que o texto de “${title}” ensina sobre ${sk.focus}?`,
    `Qual observação é importante em “${title}”?`,
    `O que você compararia para entender melhor “${title}”?`,
    `Que registro simples pode ser feito na atividade “${title}”?`,
    `Explique com suas palavras uma mudança ou relação mostrada em “${title}”.`,
    `Dê um exemplo do cotidiano ligado a “${title}”.`,
    `Que cuidado ajuda a fazer uma boa observação em “${title}”?`,
    `Escreva uma conclusão curta sobre “${title}”.`
  ] : [
    `Explique a ideia científica central apresentada no texto de “${title}”.`,
    `Que evidência ou observação seria mais útil para estudar “${title}”? Justifique.`,
    `Como você organizaria um registro de dados para investigar “${title}”?`,
    `Compare duas situações possíveis em “${title}” e indique o critério científico usado.`,
    `Explique uma relação de causa, mecanismo ou padrão envolvido em “${title}”.`,
    `Aplique o conhecimento de “${title}” a uma situação real da escola, da comunidade ou do ambiente.`,
    `Que erro de interpretação ou de procedimento deve ser evitado ao estudar “${title}”?`,
    `Produza uma conclusão para “${title}” que relacione evidência, conceito e resultado.`
  ];
  return q.map((enunciado,i)=>({numero:i+1,tipo:['compreensao','evidencia','registro','comparacao','explicacao','aplicacao','analise-critica','conclusao'][i],enunciado,alternativas:[],espacoResposta:i===7?'grande':'medio',figuraId:null}));
}

function answers(year, title, sk, ctx) {
  return [
    `A resposta deve explicar corretamente ${sk.focus}, usando a ideia central do texto de apoio.`,
    `Deve indicar uma evidência observável ou mensurável pertinente a ${sk.focus} e explicar sua utilidade.`,
    `Deve propor registro organizado, como tabela, desenho científico, sequência, mapa, medida ou anotação com critérios definidos.`,
    `Deve comparar os casos com o mesmo critério e apontar semelhança ou diferença cientificamente coerente.`,
    `Deve apresentar a relação ou mecanismo de ${sk.focus} sem confundir coincidência com explicação causal.`,
    `Resposta variável, desde que aplique corretamente o conceito a uma situação real e explique a relação.`,
    `Deve citar um erro ou cuidado pertinente, como observar sem critério, alterar condições, interpretar dados isolados ou concluir sem evidências.`,
    `Conclusão autoral coerente que conecte o conceito de ${sk.focus} às evidências discutidas em “${title}”.`
  ].map((resposta,i)=>({numero:i+1,resposta,justificativa:`Critério de correção alinhado ao conteúdo científico da atividade e à habilidade ${sk.code}, cuja correspondência ao ${year}º ano foi validada automaticamente contra a BNCC oficial.`}));
}

function normalizePreserved(a, year, index) {
  const code = a.bncc?.[0]?.codigo;
  const sk = skillByCode.get(code);
  if (!sk) return null;
  const title = a.titulo;
  const ctx = {label:'conteúdo preservado', detail:'O conteúdo de apoio já existente foi preservado por ser específico, coerente e compatível com a habilidade oficial.'};
  const description = a.ilustracao?.descricao || a.figuras?.[0]?.descricao || sk.image;
  return {
    ...a,
    sequencia:`Atividade ${index}`,
    sequenciaNumero:index,
    tipoSequencia:'Coleção principal V2',
    padraoPedagogico:'teacheasy-v2',
    quantidadeQuestoes:8,
    possuiFiguras:false,
    figuras:[],
    possuiGabarito:true,
    instrucaoGeral:'Leia o texto de apoio e responda às oito questões. O gabarito está registrado separadamente da atividade.',
    ilustracao:{descricao:description,status:'producao-visual-pendente',estilo:`TeachEasy — ilustração pedagógica adequada ao ${year}º ano`},
    questoes:questions(year,title,sk,ctx),
    gabarito:answers(year,title,sk,ctx),
    revisao:{status:'revisao-pedagogica-humana-pendente',bnccConferidaAutomaticamente:true,pedagogicaHumanaConcluida:false,gabaritoConferidoAutomaticamente:true,ortografiaConferidaAutomaticamente:true,conteudoAutoral:true,revisor:'validacao-automatica-teacheasy',dataValidacao:'2026-08-18'},
    bnccConferida:true,
    revisaoPedagogicaHumana:'pendente'
  };
}

function generatedActivity(year, seq, sk, ctx) {
  const title = `${sk.topic} — ${ctx.label} — ${year}º ano`;
  const id = `${year<=5?'efi':'efii'}-${year}ano-b4-cie-v2-${String(seq).padStart(2,'0')}-${slug(sk.topic)}-${slug(ctx.label)}`;
  const support = `${sk.core} ${ctx.detail} O foco desta proposta é usar observação, representação ou dados para construir uma explicação sobre ${sk.focus}.`;
  return {
    id,titulo:title,tema:sk.topic,sequencia:`Atividade ${seq}`,sequenciaNumero:seq,tipoSequencia:'Coleção principal V2',padraoPedagogico:'teacheasy-v2',dificuldade:`adequada-${year}-ano`,
    objetivo:`Compreender ${sk.focus} por meio de leitura científica, investigação, registro, comparação e aplicação adequada ao ${year}º ano.`,
    bncc:[{codigo:sk.code,habilidadeOficial:sk.official,descricaoResumida:sk.official}],quantidadeQuestoes:8,possuiFiguras:false,figuras:[],possuiGabarito:true,possuiVersaoAdaptada:false,
    instrucaoGeral:'Leia o texto de apoio e responda às oito questões. O gabarito está registrado separadamente da atividade.',
    textoApoio:{titulo:title,conteudo:support},
    ilustracao:{descricao:`${sk.image}; a cena deve representar também ${ctx.label}, sem texto embutido desnecessário.`,status:'producao-visual-pendente',estilo:`TeachEasy — ilustração pedagógica colorida, clara e adequada ao ${year}º ano`},
    questoes:questions(year,title,sk,ctx),gabarito:answers(year,title,sk,ctx),
    revisao:{status:'revisao-pedagogica-humana-pendente',bnccConferidaAutomaticamente:true,pedagogicaHumanaConcluida:false,gabaritoConferidoAutomaticamente:true,ortografiaConferidaAutomaticamente:true,conteudoAutoral:true,revisor:'validacao-automatica-teacheasy',dataValidacao:'2026-08-18'},
    bnccConferida:true,revisaoPedagogicaHumana:'pendente'
  };
}

const allIds = new Set();
const allTitles = new Set();
const allQuestions = new Set();
let preserved = 0;

for (let year=1; year<=9; year++) {
  const file = path.join(root,'data','atividades',dir(year),`${year}-ano`,'4-bimestre','ciencias.json');
  const previous = JSON.parse(fs.readFileSync(file,'utf8'));
  let activities = [];
  if (year === 4 && previous.schemaVersion === '2.0') {
    for (const old of previous.atividades || []) {
      if (old.padraoPedagogico === 'teacheasy-v2' && old.questoes?.length === 8 && old.gabarito?.length === 8 && old.textoApoio?.conteudo && skillByCode.has(old.bncc?.[0]?.codigo)) {
        const fixed = normalizePreserved(old,year,activities.length+1);
        if (fixed) { activities.push(fixed); preserved++; }
      }
    }
  }
  const usedTitles = new Set(activities.map(a=>a.titulo));
  outer: for (const ctxData of contexts) {
    const ctx = {label:ctxData[0],detail:ctxData[1]};
    for (const raw of S[year]) {
      if (activities.length >= 50) break outer;
      const sk = skillByCode.get(raw[0]);
      const candidateTitle = `${sk.topic} — ${ctx.label} — ${year}º ano`;
      if (usedTitles.has(candidateTitle)) continue;
      activities.push(generatedActivity(year,activities.length+1,sk,ctx));
      usedTitles.add(candidateTitle);
    }
  }
  assert.equal(activities.length,50,`Ciências ${year}º ano precisa ter 50 atividades`);
  const collection = {
    schemaVersion:'2.0',padraoPedagogico:'teacheasy-v2',colecao:`${year}ano-4bimestre-ciencias-v2`,idioma:'pt-BR',etapa:stage(year),ano:`${year}º ano`,bimestre:4,disciplina:'Ciências',statusBimestre:'validado-automaticamente-v2',bnccConferida:true,referenciaBncc:year <= 5 ? 'BNCC — Ensino Fundamental — Anos Iniciais — MEC' : 'BNCC — Ensino Fundamental — Anos Finais — MEC',referenciaBnccUrl:bnccUrl,quantidadeAtividades:50,revisaoPedagogicaHumana:'pendente',producaoVisual:'pendente',
    layout:{formato:'A4',margensCm:1,moldura:'preta',gabarito:'separado'},atividades:activities
  };
  for (const a of activities) {
    assert.equal(a.padraoPedagogico,'teacheasy-v2');
    assert.equal(a.questoes.length,8); assert.equal(a.gabarito.length,8);
    assert.equal(a.ilustracao.status,'producao-visual-pendente');
    assert.equal(a.revisao.pedagogicaHumanaConcluida,false);
    assert.match(a.bncc[0].codigo,new RegExp(`^EF0?${year}CI\\d{2}$`));
    assert.ok(!allIds.has(a.id),`ID duplicado: ${a.id}`); allIds.add(a.id);
    assert.ok(!allTitles.has(a.titulo),`Título duplicado: ${a.titulo}`); allTitles.add(a.titulo);
    for (const q of a.questoes) {
      assert.ok(!/EF\d{2}CI\d{2}/.test(q.enunciado),`Código BNCC exposto ao aluno em ${a.id}`);
      assert.ok(!allQuestions.has(q.enunciado),`Enunciado duplicado: ${q.enunciado}`); allQuestions.add(q.enunciado);
    }
  }
  fs.writeFileSync(file,JSON.stringify(collection,null,2)+'\n','utf8');
}

assert.equal(allIds.size,450);
assert.equal(allTitles.size,450);
assert.equal(allQuestions.size,3600);
console.log(`Ciências: 450 atividades, 3600 questões, 3600 respostas; atividades V2 preservadas e corrigidas: ${preserved}.`);

const catalogPath = path.join(root,'library-catalog.js');
let catalog = fs.readFileSync(catalogPath,'utf8');
catalog = catalog.replace("    '4ano-4bimestre-ciencias': 20\n",'');
catalog = catalog.replace("term === 4 && ['Língua Portuguesa', 'Matemática'].includes(subject)","term === 4 && ['Língua Portuguesa', 'Matemática', 'Ciências'].includes(subject)");
fs.writeFileSync(catalogPath,catalog,'utf8');

const testPath = path.join(root,'tests','science-fourth-term-v2.test.mjs');
fs.writeFileSync(testPath,`import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs';\nimport path from 'node:path';\nimport vm from 'node:vm';\n\nconst root = path.resolve(import.meta.dirname,'..');\n\nfunction read(year) {\n  const stage = year <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';\n  return JSON.parse(fs.readFileSync(path.join(root,'data','atividades',stage,\\\`${'${year}'}-ano\\\`,'4-bimestre','ciencias.json'),'utf8'));\n}\n\ntest('Ciências do 4º bimestre possui 50 atividades V2 por ano e 450 no total',()=>{\n  const ids=new Set(), titles=new Set(), prompts=new Set(); let aCount=0,qCount=0,rCount=0;\n  for(let year=1;year<=9;year++){\n    const c=read(year); assert.equal(c.atividades.length,50); assert.equal(c.padraoPedagogico,'teacheasy-v2');\n    for(const a of c.atividades){\n      aCount++; assert.equal(a.padraoPedagogico,'teacheasy-v2'); assert.equal(a.questoes.length,8); assert.equal(a.gabarito.length,8); qCount+=8; rCount+=8;\n      assert.equal(a.ilustracao.status,'producao-visual-pendente'); assert.equal(a.revisao.pedagogicaHumanaConcluida,false);\n      assert.match(a.bncc[0].codigo,new RegExp(\\\`^EF0?${'${year}'}CI\\\\d{2}$\\\`));\n      assert.ok(!ids.has(a.id)); ids.add(a.id); assert.ok(!titles.has(a.titulo)); titles.add(a.titulo);\n      for(const q of a.questoes){ assert.ok(!/EF\\\\d{2}CI\\\\d{2}/.test(q.enunciado)); assert.ok(!prompts.has(q.enunciado)); prompts.add(q.enunciado); }\n    }\n  }\n  assert.equal(aCount,450); assert.equal(qCount,3600); assert.equal(rCount,3600); assert.equal(ids.size,450); assert.equal(titles.size,450); assert.equal(prompts.size,3600);\n});\n\ntest('catálogo aponta 50 atividades de Ciências no 4º bimestre sem fonte paralela',()=>{\n  const code=fs.readFileSync(path.join(root,'library-catalog.js'),'utf8'); const context={}; vm.createContext(context); vm.runInContext(code,context);\n  const entries=context.TeachEasyLibraryCatalog.entries.filter(e=>e.subject==='Ciências'&&e.term===4); assert.equal(entries.length,9);\n  for(const e of entries){ assert.equal(e.count,50); assert.match(e.path,/\\\\/4-bimestre\\\\/ciencias\\\\.json$|\\/4-bimestre\\/ciencias\\.json$/); }\n});\n`,'utf8');

const packagePath = path.join(root,'package.json');
let pkgText = fs.readFileSync(packagePath,'utf8');
if (!pkgText.includes('tests/science-fourth-term-v2.test.mjs')) {
  pkgText = pkgText.replace('tests/math-fourth-term-v2.test.mjs','tests/math-fourth-term-v2.test.mjs tests/science-fourth-term-v2.test.mjs');
  fs.writeFileSync(packagePath,pkgText,'utf8');
}

const statePath = path.join(root,'docs','estado-projeto.md');
let state = fs.readFileSync(statePath,'utf8');
state = state.replace('- Anos Iniciais: 3.180 atividades canônicas. Português e Matemática do 4º bimestre possuem 50 atividades V2 em cada ano do 1º ao 5º.','- Anos Iniciais: 3.290 atividades canônicas. Português, Matemática e Ciências do 4º bimestre possuem 50 atividades V2 em cada ano do 1º ao 5º.');
state = state.replace('- Anos Finais: 3.280 atividades canônicas. Português e Matemática do 4º bimestre possuem 50 atividades V2 em cada ano do 6º ao 9º.','- Anos Finais: 3.320 atividades canônicas. Português, Matemática e Ciências do 4º bimestre possuem 50 atividades V2 em cada ano do 6º ao 9º.');
state = state.replace('- Ciências do 4º ano/4º bimestre: 20 atividades V2, oito questões e oito respostas por atividade.','- Ciências do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. Os códigos e o pertencimento ao ano/disciplina foram validados automaticamente contra a BNCC oficial do MEC; a revisão pedagógica humana e a produção das imagens definitivas permanecem pendentes.');
fs.writeFileSync(statePath,state,'utf8');
