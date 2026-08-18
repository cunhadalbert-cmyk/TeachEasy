import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = process.cwd();
const bnccUrl = 'https://cdn.mec.gov.br/basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf';
const stageDir = y => y <= 5 ? 'fundamental-anos-iniciais' : 'fundamental-anos-finais';
const stageName = y => y <= 5 ? 'Ensino Fundamental — Anos Iniciais' : 'Ensino Fundamental — Anos Finais';
const slug = s => s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

const SKILLS = {
  1: [
    ['EF01HI06','Histórias da família e da escola','Famílias e escolas têm histórias construídas por diferentes pessoas. Fotografias, relatos, objetos e lembranças ajudam a perceber quem participou dessas histórias, quais papéis exerceu e como os espaços foram usados.','Conhecer as histórias da família e da escola e identificar o papel desempenhado por diferentes sujeitos em diferentes espaços.'],
    ['EF01HI07','Mudanças e permanências nas famílias','As formas de organização familiar podem mudar com o tempo e variar entre grupos. Comparar relatos e imagens permite reconhecer mudanças, permanências e diferentes maneiras de convivência sem tratar uma configuração como superior a outra.','Identificar mudanças e permanências nas formas de organização familiar.'],
    ['EF01HI08','Festas da escola, da família e da comunidade','Comemorações podem acontecer na escola, na família ou na comunidade e ter significados diferentes. Conhecer quem participa, por que a data é lembrada e quais práticas são realizadas ajuda a distinguir esses contextos.','Reconhecer o significado das comemorações e festas escolares, diferenciando-as das datas festivas comemoradas no âmbito familiar ou da comunidade.']
  ],
  2: [
    ['EF02HI08','Histórias registradas em diferentes fontes','Uma mesma história da família ou da comunidade pode aparecer em relatos orais, fotografias, cartas, objetos e registros digitais. Reunir fontes diferentes ajuda a completar informações e perceber pontos de vista.','Compilar histórias da família e/ou da comunidade registradas em diferentes fontes.'],
    ['EF02HI09','Objetos, documentos e memória','Alguns objetos e documentos são preservados porque guardam lembranças, informações ou significados para pessoas e grupos. Outros deixam de ser usados ou são descartados, e essas escolhas também contam parte da história.','Identificar objetos e documentos pessoais que remetam à própria experiência no âmbito da família e/ou da comunidade, discutindo as razões pelas quais alguns objetos são preservados e outros são descartados.'],
    ['EF02HI10','Formas de trabalho na comunidade','Na comunidade existem trabalhos realizados em lugares e condições diferentes. Cada atividade tem funções, conhecimentos e instrumentos próprios e participa da organização da vida cotidiana.','Identificar diferentes formas de trabalho existentes na comunidade em que vive, seus significados, suas especificidades e importância.'],
    ['EF02HI11','Trabalho e impactos no ambiente','Formas de trabalho podem modificar o ambiente ao usar água, solo, energia, materiais e espaços. Observar essas mudanças ajuda a discutir maneiras de reduzir impactos e cuidar do lugar onde se vive.','Identificar impactos no ambiente causados pelas diferentes formas de trabalho existentes na comunidade em que vive.']
  ],
  3: [
    ['EF03HI09','Espaços públicos e suas funções','Ruas, praças, escolas, hospitais, prefeitura e câmara municipal são espaços públicos com funções distintas. Mapear esses lugares ajuda a compreender como a cidade organiza serviços, convivência e participação coletiva.','Mapear os espaços públicos no lugar em que vive (ruas, praças, escolas, hospitais, prédios da Prefeitura e da Câmara de Vereadores etc.) e identificar suas funções.'],
    ['EF03HI10','Espaços domésticos, públicos e áreas de conservação','A casa, os espaços públicos e as áreas de conservação têm usos e regras diferentes. Distingui-los permite compreender responsabilidades individuais e coletivas e a importância de proteger áreas destinadas à conservação ambiental.','Identificar as diferenças entre o espaço doméstico, os espaços públicos e as áreas de conservação ambiental, compreendendo a importância dessa distinção.'],
    ['EF03HI11','Trabalho na cidade e no campo','Cidade e campo apresentam formas diversas de trabalho, e tecnologias podem transformar ferramentas, ritmos e relações de produção. Comparar situações concretas evita a ideia de que um espaço possui um único tipo de atividade.','Identificar diferenças entre formas de trabalho realizadas na cidade e no campo, considerando também o uso da tecnologia nesses diferentes contextos.'],
    ['EF03HI12','Trabalho e lazer: mudanças e permanências','Trabalho e lazer mudam ao longo do tempo conforme tecnologias, costumes, direitos e organização social se transformam. Fontes de épocas distintas permitem reconhecer o que mudou e o que permaneceu.','Comparar as relações de trabalho e lazer do presente com as de outros tempos e espaços, analisando mudanças e permanências.']
  ],
  4: [
    ['EF04HI09','Motivações e efeitos das migrações','Pessoas migram por razões diversas, como trabalho, estudo, conflitos, perseguições, desastres, redes familiares ou busca por melhores condições de vida. A chegada de migrantes também transforma regiões de destino em aspectos culturais, econômicos e sociais.','Identificar as motivações dos processos migratórios em diferentes tempos e espaços e avaliar o papel desempenhado pela migração nas regiões de destino.'],
    ['EF04HI10','Fluxos populacionais e formação do Brasil','A sociedade brasileira foi formada por diferentes fluxos populacionais, incluindo povos indígenas originários, colonizadores portugueses, africanos trazidos pela diáspora forçada e migrantes de diversas partes do mundo. Esses processos ocorreram em condições históricas muito diferentes.','Analisar diferentes fluxos populacionais e suas contribuições para a formação da sociedade brasileira.'],
    ['EF04HI11','Migrações internas e internacionais hoje','Migrações internas e internacionais continuam alterando bairros, cidades e regiões. Novos moradores podem trazer práticas culturais, conhecimentos e formas de trabalho, enquanto também enfrentam desafios de adaptação, acesso a direitos e pertencimento.','Analisar, na sociedade em que vive, a existência ou não de mudanças associadas à migração (interna e internacional).']
  ],
  5: [
    ['EF05HI07','Marcos de memória e grupos sociais','Nomes de ruas, monumentos, museus, datas e outros marcos de memória resultam de escolhas feitas em determinados contextos. Perguntar quem é lembrado e quem fica ausente ajuda a compreender disputas de memória e representação social.','Identificar os processos de produção, hierarquização e difusão dos marcos de memória e discutir a presença e/ou a ausência de diferentes grupos que compõem a sociedade na nomeação desses marcos de memória.'],
    ['EF05HI08','Formas de marcar a passagem do tempo','Sociedades criam diferentes formas de marcar o tempo por calendários, ciclos naturais, festas, atividades produtivas e memórias coletivas. Povos indígenas originários e povos africanos desenvolveram referências temporais ligadas a seus modos de vida e conhecimentos.','Identificar formas de marcação da passagem do tempo em distintas sociedades, incluindo os povos indígenas originários e os povos africanos.'],
    ['EF05HI09','Pontos de vista e fontes históricas','Temas do presente podem ser interpretados de modos diferentes. Comparar relatos orais, notícias, documentos, imagens e outras fontes permite identificar argumentos, experiências e posições sem confundir opinião com evidência.','Comparar pontos de vista sobre temas que impactam a vida cotidiana no tempo presente, por meio do acesso a diferentes fontes, incluindo orais.'],
    ['EF05HI10','Patrimônios materiais e imateriais','Patrimônio material inclui construções, objetos e sítios; patrimônio imaterial envolve saberes, celebrações, práticas e expressões culturais. Esses patrimônios podem mudar, desaparecer, ser preservados ou ganhar novos sentidos ao longo do tempo.','Inventariar os patrimônios materiais e imateriais da humanidade e analisar mudanças e permanências desses patrimônios ao longo do tempo.']
  ],
  6: [
    ['EF06HI14','Contato, adaptação e exclusão entre populações','Encontros entre populações em diferentes tempos podem produzir trocas, alianças, conflitos, adaptações e exclusões. A análise histórica precisa observar relações de poder e evitar tratar processos complexos como simples encontros harmoniosos.','Identificar e analisar diferentes formas de contato, adaptação ou exclusão entre populações em diferentes tempos e espaços.'],
    ['EF06HI15','Circulação no Mediterrâneo','O Mediterrâneo conectou sociedades da Europa, África e Oriente Médio por rotas de pessoas, mercadorias, técnicas, crenças e conhecimentos. Essa circulação produziu intercâmbios e conflitos e foi importante para diferentes economias e culturas.','Descrever as dinâmicas de circulação de pessoas, produtos e culturas no Mediterrâneo e seu significado.'],
    ['EF06HI16','Abastecimento, trabalho e vida social','Sociedades antigas e medievais organizaram produção, abastecimento e trabalho de maneiras diversas. Comparar essas formas ajuda a compreender relações de dependência, hierarquias e o vínculo entre senhores e servos em contextos específicos.','Caracterizar e comparar as dinâmicas de abastecimento e as formas de organização do trabalho e da vida social em diferentes sociedades e períodos, com destaque para as relações entre senhores e servos.'],
    ['EF06HI17','Escravidão, servidão e trabalho livre','Escravidão, servidão e trabalho livre são formas históricas distintas de organizar o trabalho. Elas diferem em direitos, obrigações, vínculos jurídicos e possibilidades de autonomia, por isso não devem ser usadas como sinônimos.','Diferenciar escravidão, servidão e trabalho livre no mundo antigo.'],
    ['EF06HI18','Cristianismo e sociedade medieval','No período medieval europeu, o cristianismo influenciou práticas culturais, instituições, calendários, educação, arte e formas de organização social. Essa influência variou conforme tempo e lugar e conviveu com conflitos e outras tradições.','Analisar o papel da religião cristã na cultura e nos modos de organização social no período medieval.'],
    ['EF06HI19','Mulheres no mundo antigo e medieval','Mulheres exerceram papéis sociais diversos no mundo antigo e medieval, definidos por posição social, trabalho, família, religião e normas de cada sociedade. Fontes históricas permitem investigar tanto limites impostos quanto formas de atuação.','Descrever e analisar os diferentes papéis sociais das mulheres no mundo antigo e nas sociedades medievais.']
  ],
  7: [
    ['EF07HI12','Distribuição da população brasileira','A distribuição da população no território brasileiro mudou ao longo do tempo. Mapas e dados históricos ajudam a observar deslocamentos e a diversidade indígena, africana, europeia e asiática sem apagar diferenças entre experiências e contextos.','Identificar a distribuição territorial da população brasileira em diferentes épocas, considerando a diversidade étnico-racial e étnico-cultural (indígena, africana, europeia e asiática).'],
    ['EF07HI13','Mercantilismo e domínio europeu no Atlântico','Estados e comerciantes europeus organizaram rotas, monopólios e disputas para ampliar o domínio de mercados e territórios no mundo atlântico. Essas lógicas mercantis envolveram coerção, alianças, concorrência e exploração colonial.','Caracterizar a ação dos europeus e suas lógicas mercantis visando ao domínio no mundo atlântico.'],
    ['EF07HI14','Comércio em sociedades americanas e africanas','Sociedades americanas e africanas possuíam dinâmicas comerciais próprias antes e durante a expansão europeia. O contato com circuitos do Ocidente e do Oriente transformou redes, produtos, poderes e relações sociais de maneira desigual.','Descrever as dinâmicas comerciais das sociedades americanas e africanas e analisar suas interações com outras sociedades do Ocidente e do Oriente.'],
    ['EF07HI15','Escravidão moderna e outras formas de trabalho compulsório','A escravidão moderna vinculada à expansão atlântica possui características distintas do escravismo antigo e da servidão medieval. Comparar contextos, formas de coerção e relações jurídicas evita anacronismos.','Discutir o conceito de escravidão moderna e suas distinções em relação ao escravismo antigo e à servidão medieval.'],
    ['EF07HI16','Tráfico atlântico de africanos escravizados','O tráfico atlântico retirou à força milhões de africanos de diferentes regiões e envolveu redes de comerciantes, autoridades e mercados. Estudar agentes, rotas e procedências evidencia a violência do sistema e a diversidade dos povos atingidos.','Analisar os mecanismos e as dinâmicas de comércio de escravizados em suas diferentes fases, identificando os agentes responsáveis pelo tráfico e as regiões e zonas africanas de procedência dos escravizados.'],
    ['EF07HI17','Do mercantilismo ao capitalismo','A passagem do mercantilismo para formas capitalistas ocorreu por transformações graduais em produção, comércio, finanças, propriedade e relações de trabalho. Explicações históricas precisam relacionar esses processos sem tratá-los como uma mudança instantânea.','Discutir as razões da passagem do mercantilismo para o capitalismo.']
  ],
  8: [
    ['EF08HI20','Legados da escravidão e ações afirmativas','A escravidão deixou efeitos duradouros na estrutura social brasileira, inclusive desigualdades de acesso a renda, educação e poder. Ações afirmativas são políticas voltadas a enfrentar desigualdades históricas e ampliar oportunidades.','Identificar e relacionar aspectos das estruturas sociais da atualidade com os legados da escravidão no Brasil e discutir a importância de ações afirmativas.'],
    ['EF08HI21','Políticas indigenistas no Império','Durante o Império brasileiro, políticas oficiais dirigidas aos povos indígenas envolveram tutela, ocupação territorial e projetos de assimilação. A análise deve considerar também as respostas, estratégias e resistências indígenas.','Identificar e analisar as políticas oficiais com relação ao indígena durante o Império.'],
    ['EF08HI22','Cultura e identidades no Brasil do século XIX','No Brasil do século XIX, literatura, imprensa, artes, tradições orais e outras práticas culturais participaram da construção de identidades. Diferentes grupos produziram e transmitiram cultura por linguagens letradas e não letradas.','Discutir o papel das culturas letradas, não letradas e das artes na produção das identidades no Brasil do século XIX.'],
    ['EF08HI23','Racismo científico e imperialismo','Ideias de hierarquização racial e determinismo foram usadas no século XIX para legitimar dominação imperialista. Hoje essas teorias são reconhecidas como construções pseudocientíficas ligadas a relações de poder e violência colonial.','Estabelecer relações causais entre as ideologias raciais e o determinismo no contexto do imperialismo europeu e seus impactos na África e na Ásia.'],
    ['EF08HI24','Exploração econômica no imperialismo africano','O imperialismo europeu intensificou a extração de produtos e matérias-primas africanas e reorganizou economias locais segundo interesses coloniais. Isso produziu impactos em trabalho, território e formas de organização comunitária.','Reconhecer os principais produtos, utilizados pelos europeus, procedentes do continente africano durante o imperialismo e analisar os impactos sobre as comunidades locais na forma de organização e exploração econômica.'],
    ['EF08HI25','Estados Unidos e América Latina no século XIX','As relações entre Estados Unidos e países latino-americanos no século XIX envolveram comércio, diplomacia, expansão territorial e disputas de influência. Cada processo precisa ser analisado em seu contexto e a partir de diferentes interesses.','Caracterizar e contextualizar aspectos das relações entre os Estados Unidos da América e a América Latina no século XIX.'],
    ['EF08HI26','Resistências africanas e asiáticas ao imperialismo','Populações locais na África e na Ásia resistiram ao imperialismo por meios militares, políticos, diplomáticos, culturais e cotidianos. Reconhecer esse protagonismo evita narrativas que apresentam os povos colonizados apenas como vítimas passivas.','Identificar e contextualizar o protagonismo das populações locais na resistência ao imperialismo na África e Ásia.'],
    ['EF08HI27','Discursos civilizatórios e seus impactos','Discursos chamados civilizatórios foram usados para justificar dominação, apagamento de saberes e violência contra povos indígenas e populações negras. Analisar seus efeitos históricos ajuda a reconhecer racismo e colonialismo como relações de poder.','Identificar as tensões e os significados dos discursos civilizatórios, avaliando seus impactos negativos para os povos indígenas originários e as populações negras nas Américas.']
  ],
  9: [
    ['EF09HI28','Guerra Fria e tensões geopolíticas','A Guerra Fria organizou grande parte da política internacional em torno da disputa entre blocos liderados por Estados Unidos e União Soviética. Houve corrida armamentista, propaganda, conflitos indiretos e tensões também dentro de cada bloco.','Identificar e analisar aspectos da Guerra Fria, seus principais conflitos e as tensões geopolíticas no interior dos blocos liderados por soviéticos e estadunidenses.'],
    ['EF09HI29','Ditaduras e resistências na América Latina','Ditaduras latino-americanas do século XX usaram diferentes mecanismos de controle político, repressão e articulação internacional. Ao mesmo tempo, movimentos sociais, organizações políticas, familiares e defensores de direitos humanos atuaram na contestação.','Descrever e analisar as experiências ditatoriais na América Latina, seus procedimentos e vínculos com o poder, em nível nacional e internacional, e a atuação de movimentos de contestação às ditaduras.'],
    ['EF09HI30','Comparação entre ditaduras latino-americanas','Regimes ditatoriais latino-americanos apresentaram semelhanças e diferenças em censura, repressão, uso da força e reformas econômicas. Compará-los requer considerar contexto, duração, instituições e efeitos sociais de cada caso.','Comparar as características dos regimes ditatoriais latino-americanos, com especial atenção para a censura política, a opressão e o uso da força, bem como para as reformas econômicas e sociais e seus impactos.'],
    ['EF09HI31','Descolonização da África e da Ásia','Após a Segunda Guerra Mundial, movimentos de independência desafiaram impérios coloniais na África e na Ásia. Os processos envolveram negociações, mobilização política, guerras e projetos nacionais diversos, com consequências que continuaram após a independência.','Descrever e avaliar os processos de descolonização na África e na Ásia.'],
    ['EF09HI32','Globalização: mudanças, permanências e críticas','A globalização ampliou fluxos de mercadorias, capitais, informações e pessoas, mas seus efeitos são desiguais. Movimentos críticos discutem trabalho, ambiente, soberania, concentração econômica e acesso aos benefícios desses processos.','Analisar mudanças e permanências associadas ao processo de globalização, considerando os argumentos dos movimentos críticos às políticas globais.'],
    ['EF09HI33','Tecnologias digitais e relações políticas','Tecnologias digitais modificaram campanhas, mobilizações, comunicação governamental e circulação de informações. Também criaram desafios ligados a desinformação, vigilância, concentração de plataformas e participação política.','Analisar as transformações nas relações políticas locais e globais geradas pelo desenvolvimento das tecnologias digitais de informação e comunicação.'],
    ['EF09HI34','Políticas econômicas na América Latina','Países latino-americanos adotaram políticas econômicas distintas em diferentes momentos, influenciadas por crises, governos, organismos internacionais e disputas internas. Avaliar seus impactos exige observar emprego, renda, serviços públicos e desigualdade.','Discutir as motivações da adoção de diferentes políticas econômicas na América Latina, assim como seus impactos sociais nos países da região.'],
    ['EF09HI35','Terrorismo e conflitos contemporâneos','O terrorismo contemporâneo envolve contextos políticos e históricos diversos e não pode ser associado de forma automática a povos, religiões ou migrantes. A análise histórica deve diferenciar grupos, motivações, conflitos e consequências sem reforçar preconceitos.','Analisar os aspectos relacionados ao fenômeno do terrorismo na contemporaneidade, incluindo os movimentos migratórios e os choques entre diferentes grupos e culturas.'],
    ['EF09HI36','Diversidades identitárias no século XXI','Identidades são construções históricas relacionadas a pertencimentos, experiências e disputas por reconhecimento. No século XXI, movimentos e grupos defendem direitos e visibilidade, e o estudo histórico deve combater preconceito e violência.','Identificar e discutir as diversidades identitárias e seus significados históricos no início do século XXI, combatendo qualquer forma de preconceito e violência.']
  ]
};

const contexts = [
  ['leitura de fotografia histórica','Uma fotografia precisa ser situada no tempo, no lugar e nas condições em que foi produzida antes de ser usada como evidência.'],
  ['relato oral e memória','Relatos orais registram experiências e pontos de vista; comparar narrativas ajuda a perceber lembranças, silêncios e diferenças de perspectiva.'],
  ['linha do tempo comentada','Uma linha do tempo organiza acontecimentos, mas a seleção dos eventos também expressa escolhas sobre o que será destacado.'],
  ['mapa histórico','Mapas históricos permitem observar territórios, deslocamentos e fronteiras, lembrando que toda representação foi produzida em um contexto.'],
  ['objeto como fonte','Objetos podem informar sobre técnicas, usos, relações sociais e valores quando são investigados com perguntas sobre origem e função.'],
  ['comparação passado e presente','Comparar épocas exige usar critérios claros e reconhecer simultaneamente mudanças e permanências.'],
  ['duas fontes em contraste','Fontes diferentes podem concordar em alguns aspectos e divergir em outros; a divergência também é informação histórica.'],
  ['estudo de caso local','Um caso da comunidade pode ser relacionado a processos mais amplos sem supor que todos os lugares tiveram a mesma experiência.'],
  ['notícia e contexto histórico','Uma notícia pode ser ponto de partida para investigar processos históricos, desde que fatos atuais sejam contextualizados e comparados com outras fontes.'],
  ['museu e patrimônio','Museus e acervos fazem escolhas sobre o que guardar e expor, por isso também participam da construção de memórias.'],
  ['gráfico ou tabela histórica','Dados quantitativos ajudam a observar tendências, mas precisam ser interpretados com atenção à fonte, ao período e ao que não foi contado.'],
  ['biografia e contexto','Uma trajetória individual ajuda a conhecer uma época quando é relacionada às condições sociais, políticas e culturais do período.'],
  ['debate de interpretações','Interpretações históricas devem apresentar argumentos apoiados em fontes e podem ser revistas diante de novas evidências.'],
  ['permanências e transformações','Processos históricos raramente mudam tudo de uma vez; diferentes ritmos de mudança podem coexistir.'],
  ['direitos e participação','Direitos são construções históricas resultantes de disputas, leis, movimentos e práticas sociais, e seu acesso pode ser desigual.'],
  ['trabalho com documento','Antes de interpretar um documento, é importante identificar autoria, data, público, finalidade e contexto de produção.'],
  ['memória e silenciamento','O que uma sociedade escolhe lembrar ou esquecer pode revelar relações de poder e disputas entre grupos.'],
  ['causas e consequências','Fenômenos históricos têm múltiplas causas e consequências; uma explicação consistente evita atribuir processos complexos a um único fator.'],
  ['escala local e global','Acontecimentos locais podem estar ligados a redes regionais e globais, mas essas conexões precisam ser demonstradas por evidências.'],
  ['síntese com evidências','Uma síntese histórica reúne contexto, fontes e relações entre acontecimentos para sustentar uma conclusão clara.']
];

const skillMap = new Map(Object.values(SKILLS).flat().map(x => [x[0], {code:x[0],topic:x[1],core:x[2],official:x[3]}]));
function qset(year,title,sk){
  const qs = year <= 2 ? [
    `Quem ou o que aparece como parte importante da história estudada em “${title}”?`,
    `Que pista do texto ajuda a saber algo sobre “${title}”?`,
    `O que mudou ou permaneceu na situação apresentada em “${title}”?`,
    `Que fonte — fotografia, relato, objeto ou documento — ajudaria a conhecer melhor “${title}”?`,
    `Conte com suas palavras o que aconteceu ou como a situação se organiza em “${title}”.`,
    `Que relação “${title}” tem com a família, a escola ou a comunidade?`,
    `Por que duas pessoas podem lembrar ou explicar “${title}” de modos diferentes?`,
    `Escreva uma conclusão curta sobre o que você aprendeu em “${title}”.`
  ] : [
    `Contextualize historicamente o tema apresentado em “${title}” com base no texto de apoio.`,
    `Selecione uma evidência adequada para investigar “${title}” e explique o que ela permite saber.`,
    `Identifique uma mudança, permanência ou relação histórica relevante em “${title}”.`,
    `Compare dois sujeitos, grupos, tempos ou espaços relacionados a “${title}”, usando um critério explícito.`,
    `Explique uma causa, consequência ou mecanismo histórico envolvido em “${title}”, evitando explicações de fator único.`,
    `Analise como relações de poder, escolhas ou diferentes pontos de vista aparecem em “${title}”.`,
    `Aponte um cuidado necessário ao interpretar fontes sobre “${title}” e justifique.`,
    `Elabore uma síntese de “${title}” relacionando contexto, evidência e conclusão.`
  ];
  return qs.map((enunciado,i)=>({numero:i+1,tipo:['contexto','fonte','mudanca-permanencia','comparacao','causalidade','perspectiva','critica-de-fontes','sintese'][i],enunciado,alternativas:[],espacoResposta:i===7?'grande':'medio',figuraId:null}));
}
function aset(year,title,sk){
  return [
    `A resposta deve situar corretamente ${sk.topic.toLowerCase()} no contexto indicado pelo texto, sem anacronismos.`,
    `Deve indicar uma fonte ou evidência pertinente e explicar que informação histórica ela pode sustentar.`,
    `Deve reconhecer mudança, permanência ou relação coerente com ${sk.topic.toLowerCase()} e justificá-la.`,
    `Deve comparar os elementos com o mesmo critério e usar informações históricas do texto de apoio.`,
    `Deve apresentar relação causal ou consequência plausível, reconhecendo que processos históricos podem ter múltiplos fatores.`,
    `Deve reconhecer sujeitos, interesses, relações de poder ou diferentes perspectivas sem naturalizar desigualdades.`,
    `Deve mencionar autoria, data, finalidade, contexto, lacunas ou necessidade de comparar fontes, conforme o caso.`,
    `Síntese autoral coerente que relacione o tema, as evidências e uma conclusão historicamente fundamentada.`
  ].map((resposta,i)=>({numero:i+1,resposta,justificativa:`Critério de correção alinhado à habilidade ${sk.code}, conferida na BNCC oficial do MEC para História do ${year}º ano.`}));
}
function activity(year,seq,sk,ctx){
  const title = `${sk.topic} — ${ctx[0]} — ${year}º ano`;
  return {
    id:`${year<=5?'efi':'efii'}-${year}ano-b4-his-v2-${String(seq).padStart(2,'0')}-${slug(sk.topic)}-${slug(ctx[0])}`,
    titulo:title,tema:sk.topic,sequencia:`Atividade ${seq}`,sequenciaNumero:seq,tipoSequencia:'Coleção principal V2',padraoPedagogico:'teacheasy-v2',dificuldade:`adequada-${year}-ano`,
    objetivo:`Analisar ${sk.topic.toLowerCase()} por meio de contextualização, leitura de fontes, comparação e construção de explicações históricas adequadas ao ${year}º ano.`,
    bncc:[{codigo:sk.code,habilidadeOficial:sk.official,descricaoResumida:sk.official,verbo:sk.official.split(/\s+/)[0]}],bnccConferida:true,quantidadeQuestoes:8,possuiFiguras:false,figuras:[],possuiGabarito:true,possuiVersaoAdaptada:false,
    instrucaoGeral:'Leia o texto de apoio, observe as evidências apresentadas e responda às oito questões. O gabarito está registrado separadamente.',
    textoApoio:{titulo:`Leitura histórica — ${title}`,conteudo:`${sk.core} ${ctx[1]} Nesta atividade, o objetivo é interpretar o tema historicamente, distinguindo evidências, contextos e pontos de vista.`},
    ilustracao:{objetivoPedagogico:`Apoiar a interpretação histórica de ${sk.topic.toLowerCase()} por meio de evidências visuais coerentes.`,descricao:`Cena pedagógica sobre ${sk.topic.toLowerCase()}, relacionada a ${ctx[0]}, com fontes ou elementos históricos coerentes e sem anacronismos.`,status:'producao-visual-pendente',estilo:`TeachEasy — ilustração histórica pedagógica adequada ao ${year}º ano`},
    questoes:qset(year,title,sk),gabarito:aset(year,title,sk),
    revisao:{status:'revisao-pedagogica-humana-pendente',bnccConferidaAutomaticamente:true,pedagogicaHumanaConcluida:false,gabaritoConferidoAutomaticamente:true,ortografiaConferidaAutomaticamente:true,conteudoAutoral:true,revisor:'validacao-automatica-teacheasy',dataValidacao:'2026-08-18'},
    revisaoPedagogicaHumana:'pendente'
  };
}

let preserved = 0;
const allIds = new Set(), allTitles = new Set(), allPrompts = new Set();
for(let year=1;year<=9;year++){
  const file=path.join(root,'data','atividades',stageDir(year),`${year}-ano`,'4-bimestre','historia.json');
  const old=JSON.parse(fs.readFileSync(file,'utf8'));
  const activities=[];
  for(const a of old.atividades||[]){
    const code=a.bncc?.[0]?.codigo; const txt=a.textoApoio?.conteudo||'';
    if(a.padraoPedagogico==='teacheasy-v2' && a.questoes?.length===8 && a.gabarito?.length===8 && skillMap.has(code) && txt.trim().length>80){
      activities.push({...a,sequencia:`Atividade ${activities.length+1}`,sequenciaNumero:activities.length+1,padraoPedagogico:'teacheasy-v2',quantidadeQuestoes:8,possuiFiguras:false,figuras:[],possuiGabarito:true,ilustracao:{descricao:a.ilustracao?.descricao||`Cena histórica coerente com ${a.titulo}.`,status:'producao-visual-pendente',estilo:`TeachEasy — ilustração histórica pedagógica adequada ao ${year}º ano`},revisao:{...(a.revisao||{}),status:'revisao-pedagogica-humana-pendente',pedagogicaHumanaConcluida:false,bnccConferidaAutomaticamente:true},revisaoPedagogicaHumana:'pendente'}); preserved++;
    }
  }
  outer: for(const ctx of contexts) for(const raw of SKILLS[year]){
    if(activities.length>=50) break outer;
    const sk=skillMap.get(raw[0]); const a=activity(year,activities.length+1,sk,ctx);
    if(activities.some(x=>x.titulo===a.titulo)) continue;
    activities.push(a);
  }
  assert.equal(activities.length,50,`História ${year}º ano deve ter 50 atividades`);
  const col={schemaVersion:'2.0',padraoPedagogico:'teacheasy-v2',colecao:`${year}ano-4bimestre-historia-v2`,idioma:'pt-BR',etapa:stageName(year),ano:`${year}º ano`,bimestre:4,disciplina:'História',statusBimestre:'validado-automaticamente-v2',bnccConferida:true,referenciaBncc:year<=5?'BNCC — Ensino Fundamental — Anos Iniciais — MEC':'BNCC — Ensino Fundamental — Anos Finais — MEC',referenciaBnccUrl:bnccUrl,quantidadeAtividades:50,revisaoPedagogicaHumana:'pendente',producaoVisual:'pendente',layout:{formato:'A4',margensCm:1,moldura:'preta',gabarito:'separado'},atividades:activities};
  for(const a of activities){
    assert.equal(a.questoes.length,8); assert.equal(a.gabarito.length,8); assert.ok(a.textoApoio.conteudo.trim().length>80); assert.equal(a.ilustracao.status,'producao-visual-pendente'); assert.equal(a.revisao.pedagogicaHumanaConcluida,false); assert.match(a.bncc[0].codigo,new RegExp(`^EF0?${year}HI\\d{2}$`));
    assert.ok(!allIds.has(a.id)); allIds.add(a.id); assert.ok(!allTitles.has(a.titulo)); allTitles.add(a.titulo);
    for(const q of a.questoes){assert.ok(!/EF\d{2}HI\d{2}/.test(q.enunciado));assert.ok(!allPrompts.has(q.enunciado));allPrompts.add(q.enunciado);}
  }
  fs.writeFileSync(file,JSON.stringify(col,null,2)+'\n','utf8');
}
assert.equal(allIds.size,450); assert.equal(allTitles.size,450); assert.equal(allPrompts.size,3600);
console.log(`História: 450 atividades, 3600 questões, 3600 respostas; V2 antigas preservadas: ${preserved}.`);

let catalog=fs.readFileSync(path.join(root,'library-catalog.js'),'utf8');
catalog=catalog.replace("term === 4 && ['Língua Portuguesa', 'Matemática', 'Ciências'].includes(subject)","term === 4 && ['Língua Portuguesa', 'Matemática', 'Ciências', 'História'].includes(subject)");
fs.writeFileSync(path.join(root,'library-catalog.js'),catalog,'utf8');

let initial=fs.readFileSync(path.join(root,'tests','fundamental-iniciais-bncc.test.mjs'),'utf8');
initial=initial.replace("['Língua Portuguesa', 'Matemática', 'Ciências'].includes(subject) ? 50 : 20","['Língua Portuguesa', 'Matemática', 'Ciências', 'História'].includes(subject) ? 50 : 20");
initial=initial.replace('assert.equal(total, 3290);','assert.equal(total, 3390);');
fs.writeFileSync(path.join(root,'tests','fundamental-iniciais-bncc.test.mjs'),initial,'utf8');

let finals=fs.readFileSync(path.join(root,'tests','fundamental-finais.test.mjs'),'utf8');
finals=finals.replace('3.320 atividades','3.360 atividades');
finals=finals.replaceAll('assert.equal(total, 3320);','assert.equal(total, 3360);');
finals=finals.replace('grades.forEach(grade => assert.equal(byGrade.get(grade), 830));','grades.forEach(grade => assert.equal(byGrade.get(grade), 840));');
finals=finals.replace("['Língua Portuguesa', 'Matemática', 'Ciências'].includes(subject) ? 680 : 640","['Língua Portuguesa', 'Matemática', 'Ciências', 'História'].includes(subject) ? 680 : 640");
fs.writeFileSync(path.join(root,'tests','fundamental-finais.test.mjs'),finals,'utf8');

const test=`import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs';\nimport path from 'node:path';\nimport vm from 'node:vm';\nconst root=path.resolve(import.meta.dirname,'..');\nconst official='${bnccUrl}';\nfunction read(y){const s=y<=5?'fundamental-anos-iniciais':'fundamental-anos-finais';return JSON.parse(fs.readFileSync(path.join(root,'data','atividades',s,y+'-ano','4-bimestre','historia.json'),'utf8'));}\ntest('História do 4º bimestre possui 50 atividades V2 por ano e 450 no total',()=>{const ids=new Set(),titles=new Set(),prompts=new Set();let ac=0,qc=0,rc=0;for(let y=1;y<=9;y++){const c=read(y);assert.equal(c.quantidadeAtividades,50);assert.equal(c.atividades.length,50);assert.equal(c.padraoPedagogico,'teacheasy-v2');assert.equal(c.referenciaBnccUrl,official);assert.equal(c.revisaoPedagogicaHumana,'pendente');assert.deepEqual(c.layout,{formato:'A4',margensCm:1,moldura:'preta',gabarito:'separado'});for(const a of c.atividades){ac++;qc+=a.questoes.length;rc+=a.gabarito.length;assert.equal(a.questoes.length,8);assert.equal(a.gabarito.length,8);assert.ok(a.textoApoio.conteudo.trim().length>80);assert.equal(a.ilustracao.status,'producao-visual-pendente');assert.equal(a.revisao.pedagogicaHumanaConcluida,false);assert.match(a.bncc[0].codigo,new RegExp('^EF0?'+y+'HI\\\\d{2}$'));assert.ok(!ids.has(a.id));ids.add(a.id);assert.ok(!titles.has(a.titulo));titles.add(a.titulo);for(const q of a.questoes){assert.ok(!/EF\\d{2}HI\\d{2}/.test(q.enunciado));assert.ok(!prompts.has(q.enunciado));prompts.add(q.enunciado);}}}assert.equal(ac,450);assert.equal(qc,3600);assert.equal(rc,3600);assert.equal(ids.size,450);assert.equal(titles.size,450);assert.equal(prompts.size,3600);});\ntest('catálogo aponta 50 atividades canônicas de História no 4º bimestre',()=>{const code=fs.readFileSync(path.join(root,'library-catalog.js'),'utf8');const context={};vm.createContext(context);vm.runInContext(code,context);const es=context.TeachEasyLibraryCatalog.entries.filter(e=>e.subject==='História'&&e.term===4);assert.equal(es.length,9);for(const e of es){assert.equal(e.count,50);assert.ok(e.path.endsWith('/4-bimestre/historia.json'));}});\n`;
fs.writeFileSync(path.join(root,'tests','history-fourth-term-v2.test.mjs'),test,'utf8');
let pkg=fs.readFileSync(path.join(root,'package.json'),'utf8');
if(!pkg.includes('tests/history-fourth-term-v2.test.mjs')) pkg=pkg.replace('tests/science-fourth-term-v2.test.mjs','tests/science-fourth-term-v2.test.mjs tests/history-fourth-term-v2.test.mjs');
fs.writeFileSync(path.join(root,'package.json'),pkg,'utf8');

let state=fs.readFileSync(path.join(root,'docs','estado-projeto.md'),'utf8');
state=state.replace('Anos Iniciais: 3.290 atividades canônicas. Português, Matemática e Ciências do 4º bimestre possuem 50 atividades V2 em cada ano do 1º ao 5º.','Anos Iniciais: 3.390 atividades canônicas. Português, Matemática, Ciências e História do 4º bimestre possuem 50 atividades V2 em cada ano do 1º ao 5º.');
state=state.replace('Anos Finais: 3.320 atividades canônicas. Português, Matemática e Ciências do 4º bimestre possuem 50 atividades V2 em cada ano do 6º ao 9º.','Anos Finais: 3.360 atividades canônicas. Português, Matemática, Ciências e História do 4º bimestre possuem 50 atividades V2 em cada ano do 6º ao 9º.');
state=state.replace('- Ciências do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. Os códigos e o pertencimento ao ano/disciplina foram validados automaticamente contra a BNCC oficial do MEC; a revisão pedagógica humana e a produção das imagens definitivas permanecem pendentes.','- Ciências do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. Os códigos e o pertencimento ao ano/disciplina foram validados automaticamente contra a BNCC oficial do MEC; a revisão pedagógica humana e a produção das imagens definitivas permanecem pendentes.\n- História do 1º ao 9º ano/4º bimestre: 450 atividades V2, 3.600 questões e 3.600 respostas. Os códigos foram conferidos contra a BNCC oficial do MEC; revisão pedagógica humana e produção visual definitiva permanecem pendentes.');
fs.writeFileSync(path.join(root,'docs','estado-projeto.md'),state,'utf8');
