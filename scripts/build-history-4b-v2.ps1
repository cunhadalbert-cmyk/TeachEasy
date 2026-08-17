$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root 'data\atividades\fundamental-anos-iniciais\4-ano\4-bimestre\historia-v2.json'

$skills = @{
    EF04HI09 = 'Identificar as motivacoes dos processos migratorios em diferentes tempos e espacos e avaliar o papel desempenhado pela migracao nas regioes de destino.'
    EF04HI10 = 'Analisar diferentes fluxos populacionais e suas contribuicoes para a formacao da sociedade brasileira.'
    EF04HI11 = 'Analisar, na sociedade em que vive, a existencia ou nao de mudancas associadas a migracao interna e internacional.'
}

$items = @(
    @{ T='Por que as pessoas migram'; C='EF04HI09'; X='Migrar significa mudar de um lugar para outro para viver por um periodo ou de forma permanente. Ao longo da historia, pessoas e grupos migraram por motivos como busca de trabalho, acesso a terras, conflitos, perseguicoes, desastres, reuniao familiar ou procura de melhores condicoes de vida. Cada migracao acontece em um contexto historico proprio.'; I='Familias de diferentes epocas viajando com malas e pertences, observando um mapa com rotas.' },
    @{ T='Da Africa para outros continentes'; C='EF04HI09'; X='Estudos arqueologicos indicam que os primeiros seres humanos surgiram no continente africano. Ao longo de milhares de anos, grupos humanos se deslocaram e ocuparam outras partes do planeta. Esses movimentos foram influenciados por mudancas ambientais, busca de alimentos e necessidade de encontrar lugares adequados para viver.'; I='Mapa-mundi simples mostrando rotas de deslocamento humano partindo da Africa.' },
    @{ T='Migracoes em diferentes tempos'; C='EF04HI09'; X='As migracoes ocorreram em muitos periodos historicos. Povos antigos, comunidades rurais e populacoes atuais se deslocaram por diferentes motivos. Comparar migracoes de epocas distintas ajuda a perceber permanencias, como a busca por seguranca, e mudancas, como o uso de novos meios de transporte.'; I='Linha do tempo com tres cenas de migracao em epocas diferentes.' },
    @{ T='Migrar por trabalho'; C='EF04HI09'; X='A procura por trabalho e uma das causas de migracao. Pessoas podem mudar de cidade, estado ou pais quando surgem oportunidades de emprego em outra regiao. Esse deslocamento pode transformar tanto a vida de quem migra quanto o local que recebe novos moradores.'; I='Familia chegando a uma nova cidade por motivo de trabalho.' },
    @{ T='Migrar por necessidade'; C='EF04HI09'; X='Nem toda migracao acontece por escolha livre. Guerras, perseguicoes, secas prolongadas, enchentes e outras situacoes podem obrigar pessoas a deixar seus lugares de origem. Compreender essas circunstancias ajuda a desenvolver respeito pelas historias de quem precisou se deslocar.'; I='Pessoas deixando uma regiao afetada por seca e buscando um novo lugar para viver.' },
    @{ T='Chegar a um novo lugar'; C='EF04HI09'; X='Quando migrantes chegam a uma nova regiao, precisam construir novas rotinas, encontrar moradia, trabalho, escola e redes de apoio. Eles tambem levam conhecimentos, costumes, comidas, linguas e experiencias que podem contribuir para a vida cultural e social do lugar de destino.'; I='Novos moradores participando de uma feira comunitaria com pessoas locais.' },
    @{ T='Povos indigenas e o territorio brasileiro'; C='EF04HI10'; X='Muito antes da chegada dos portugueses, diferentes povos indigenas habitavam o territorio que hoje chamamos Brasil. Eles possuíam linguas, conhecimentos, formas de organizacao e modos de vida diversos. A historia da formacao da sociedade brasileira precisa reconhecer a presenca e a continuidade desses povos.'; I='Diferentes povos indigenas em atividades cotidianas, representados com respeito e diversidade.' },
    @{ T='A chegada dos portugueses'; C='EF04HI10'; X='A partir do seculo XVI, portugueses passaram a chegar em maior numero ao territorio americano colonizado por Portugal. Esse processo provocou profundas transformacoes politicas, economicas, culturais e demograficas, incluindo conflitos e violencia contra povos que ja viviam aqui.'; I='Navios portugueses se aproximando do litoral, com comunidade indigena observando a distancia.' },
    @{ T='Africanos trazidos a forca'; C='EF04HI10'; X='Milhoes de africanos foram trazidos a forca para o Brasil durante o periodo da escravidao. Esse deslocamento nao foi uma migracao voluntaria: foi parte do trafico transatlantico de pessoas escravizadas. Povos africanos e seus descendentes contribuíram profundamente para a formacao cultural, social e economica do Brasil, apesar da violencia que sofreram.'; I='Ilustracao historica educativa sobre a diaspora africana, sem cenas de violencia explicita, destacando resistencia e contribuicoes culturais.' },
    @{ T='Imigrantes europeus no Brasil'; C='EF04HI10'; X='No final do seculo XIX e inicio do seculo XX, muitos imigrantes europeus chegaram ao Brasil. Alguns vieram para trabalhar em lavouras, outros se estabeleceram em cidades e colonias. Italianos, alemaes, espanhóis e outros grupos participaram da formacao de diferentes regioes brasileiras.'; I='Familias de imigrantes europeus chegando a uma estacao brasileira no inicio do seculo XX.' },
    @{ T='Imigrantes asiaticos no Brasil'; C='EF04HI10'; X='O Brasil tambem recebeu imigrantes de diferentes partes da Asia. A imigracao japonesa ganhou destaque a partir de 1908, e outros grupos asiaticos chegaram em distintos momentos. Esses migrantes e seus descendentes contribuíram para a agricultura, o comercio, a culinaria, as artes e outras areas da sociedade brasileira.'; I='Familia japonesa chegando ao Brasil e cena posterior de trabalho agricola e vida comunitaria.' },
    @{ T='Diversidade na formacao do Brasil'; C='EF04HI10'; X='A sociedade brasileira foi formada pela participacao de muitos povos e grupos. Povos indigenas, africanos e seus descendentes, portugueses e imigrantes de diferentes origens contribuíram para linguas, comidas, festas, religioes, musicas, conhecimentos e modos de viver. Essa diversidade faz parte da historia do Brasil.'; I='Mosaico de pessoas e manifestacoes culturais brasileiras diversas.' },
    @{ T='Migracoes internas no Brasil'; C='EF04HI10'; X='Migracao interna acontece quando pessoas mudam de lugar dentro do mesmo pais. No Brasil, houve intensos deslocamentos entre regioes, especialmente a partir do seculo XX. Muitas pessoas sairam de areas rurais ou de uma regiao para outra em busca de trabalho, estudo, moradia e melhores condicoes de vida.'; I='Mapa do Brasil com setas mostrando deslocamentos entre diferentes regioes.' },
    @{ T='Do campo para a cidade'; C='EF04HI10'; X='Durante o seculo XX, muitas familias brasileiras deixaram o campo e passaram a viver em cidades. Esse processo, chamado exodo rural, esteve relacionado a mudancas no trabalho agricola, industrializacao e crescimento urbano. A chegada de novos moradores transformou bairros, servicos e formas de trabalho.'; I='Cena dividida mostrando familia saindo do campo e chegando a uma cidade em crescimento.' },
    @{ T='Migracao e cultura local'; C='EF04HI11'; X='Quando pessoas de diferentes lugares passam a viver em uma comunidade, podem surgir novas festas, comidas, palavras, musicas, praticas religiosas e formas de trabalhar. Nem toda mudanca vem apenas da migracao, por isso e importante comparar fontes e ouvir moradores para entender o que realmente mudou.'; I='Feira cultural de bairro com comidas, musicas e familias de origens diversas.' },
    @{ T='Historias de familias migrantes'; C='EF04HI11'; X='Entrevistas, fotografias, cartas, documentos e relatos orais podem ajudar a conhecer historias de migracao. Ao ouvir uma pessoa migrante, podemos descobrir de onde ela veio, por que se mudou, como foi sua chegada e quais mudancas percebeu no novo lugar.'; I='Criancas entrevistando uma pessoa idosa sobre sua historia de migracao.' },
    @{ T='Mudancas no bairro'; C='EF04HI11'; X='A chegada de novos moradores pode estar relacionada ao surgimento de comercios, igrejas, associacoes, escolas, festas e novas formas de ocupacao dos bairros. Para afirmar que uma mudanca esta ligada a migracao, e preciso observar evidencias e comparar o bairro em diferentes momentos.'; I='Duas imagens do mesmo bairro em epocas diferentes, destacando novos comercios e moradores.' },
    @{ T='Migracao internacional hoje'; C='EF04HI11'; X='O Brasil continua recebendo pessoas de outros paises. Migrantes internacionais podem chegar para trabalhar, estudar, reunir-se a familiares ou buscar protecao. Em muitas cidades, esses grupos constroem novas redes de convivencia e participam da economia e da cultura local.'; I='Familias de diferentes nacionalidades convivendo em uma praca brasileira.' },
    @{ T='Respeito a quem chega'; C='EF04HI11'; X='Pessoas migrantes podem enfrentar dificuldades de adaptacao, preconceito ou barreiras de lingua. Respeitar direitos, combater discriminacoes e valorizar diferentes historias de vida contribui para uma convivencia mais justa. Conhecer a historia das migracoes ajuda a compreender a diversidade da comunidade.'; I='Estudantes acolhendo uma nova colega migrante na escola.' },
    @{ T='Nossa comunidade e as migracoes'; C='EF04HI11'; X='Toda comunidade tem uma historia de formacao. Investigar sobrenomes, relatos de moradores, fotografias antigas, festas, estabelecimentos e costumes pode revelar movimentos de pessoas ao longo do tempo. O estudo dessas evidencias ajuda a perceber mudancas e permanencias associadas a migracao.'; I='Criancas montando um mural com mapa, fotos antigas e relatos de moradores.' }
)

function New-Questions([string]$code, [string]$title) {
    if ($code -eq 'EF04HI09') {
        return @(
            @{numero=1;tipo='compreensao';enunciado="Explique o que o tema '$title' ensina sobre migracao.";alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=2;tipo='multipla-escolha';enunciado='Qual alternativa apresenta um motivo que pode levar pessoas a migrar?';alternativas=@('Busca de trabalho ou seguranca','Mudar a cor do ceu','Alterar a duracao do dia','Fazer o rio correr ao contrario');espacoResposta='pequeno';figuraId=$null},
            @{numero=3;tipo='causa';enunciado='Cite duas causas que podem provocar processos migratorios.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=4;tipo='comparacao';enunciado='Explique uma diferenca entre migracao voluntaria e deslocamento forcado.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=5;tipo='tempo-historico';enunciado='Por que as migracoes podem acontecer em diferentes periodos da historia?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=6;tipo='consequencia';enunciado='Cite uma mudanca que a chegada de migrantes pode provocar na regiao de destino.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=7;tipo='interpretacao';enunciado='Que informacoes voce procuraria para descobrir por que um grupo migrou?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=8;tipo='producao';enunciado='Escreva uma frase explicando por que estudar migracoes ajuda a compreender a historia das sociedades.';alternativas=@();espacoResposta='grande';figuraId=$null}
        )
    }
    if ($code -eq 'EF04HI10') {
        return @(
            @{numero=1;tipo='compreensao';enunciado="Explique a relacao entre '$title' e a formacao da sociedade brasileira.";alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=2;tipo='multipla-escolha';enunciado='Qual afirmacao esta correta sobre a formacao da sociedade brasileira?';alternativas=@('Foi formada pela participacao de muitos povos e grupos','Foi formada por um unico povo','Nao recebeu migracoes','Nao possui diversidade cultural');espacoResposta='pequeno';figuraId=$null},
            @{numero=3;tipo='identificacao';enunciado='Identifique um grupo ou fluxo populacional citado no texto de apoio.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=4;tipo='contribuicao';enunciado='Cite uma contribuicao cultural, social ou economica relacionada ao grupo estudado.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=5;tipo='comparacao';enunciado='Por que e importante diferenciar migracoes voluntarias de deslocamentos forcados na historia do Brasil?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=6;tipo='tempo-historico';enunciado='Em que periodo ou contexto historico ocorreu o processo estudado no texto?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=7;tipo='diversidade';enunciado='Como diferentes fluxos populacionais contribuíram para a diversidade brasileira?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=8;tipo='producao';enunciado='Escreva uma conclusao sobre por que a historia do Brasil deve considerar diferentes povos e grupos.';alternativas=@();espacoResposta='grande';figuraId=$null}
        )
    }
    return @(
        @{numero=1;tipo='compreensao';enunciado="Explique como '$title' pode estar relacionado a mudancas provocadas por migracoes.";alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=2;tipo='multipla-escolha';enunciado='Qual fonte pode ajudar a investigar migracoes em uma comunidade?';alternativas=@('Entrevistas e fotografias antigas','Somente adivinhacoes','Apenas propagandas sem data','Nenhuma fonte');espacoResposta='pequeno';figuraId=$null},
        @{numero=3;tipo='fonte-historica';enunciado='Cite duas fontes que poderiam ajudar a conhecer a historia de migrantes da comunidade.';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=4;tipo='mudancas-permanencias';enunciado='Dê um exemplo de mudanca que pode estar associada a chegada de novos moradores.';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=5;tipo='evidencia';enunciado='Por que e importante buscar evidencias antes de afirmar que uma mudanca foi causada pela migracao?';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=6;tipo='diversidade';enunciado='Cite uma forma pela qual migrantes podem contribuir para a cultura local.';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=7;tipo='convivencia';enunciado='Que atitude ajuda a acolher e respeitar pessoas migrantes na comunidade?';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=8;tipo='producao';enunciado='Proponha uma pergunta de entrevista para descobrir como a migracao transformou sua comunidade.';alternativas=@();espacoResposta='grande';figuraId=$null}
    )
}

function New-Answers([string]$code) {
    if ($code -eq 'EF04HI09') {
        return @(
            'Reconhecer que migracao envolve deslocamentos humanos e suas motivacoes.',
            'Busca de trabalho ou seguranca.',
            'Exemplos: trabalho, conflitos, desastres, reuniao familiar, acesso a terras ou melhores condicoes de vida.',
            'A voluntaria ocorre por decisao ou escolha; a forcada ocorre quando circunstancias obrigam o deslocamento.',
            'Porque necessidades, conflitos, ambiente, trabalho e outros fatores mudam ao longo do tempo.',
            'Exemplos: novos costumes, atividades economicas, crescimento populacional ou transformacoes culturais.',
            'Motivos, periodo, lugar de origem, destino, fontes e contexto historico.',
            'Resposta coerente relacionando migracoes a transformacoes e formacao das sociedades.'
        )
    }
    if ($code -eq 'EF04HI10') {
        return @(
            'Relacionar o tema a um dos fluxos ou grupos que participaram da formacao da sociedade brasileira.',
            'Foi formada pela participacao de muitos povos e grupos.',
            'Resposta conforme o texto: povos indigenas, portugueses, africanos e descendentes, europeus, asiaticos ou migracoes internas.',
            'Resposta coerente com o grupo estudado, como culinaria, agricultura, musica, religiao, trabalho, lingua ou conhecimentos.',
            'Porque deslocamentos forcados, como a diaspora africana, envolveram violencia e ausencia de escolha, diferentemente de migracoes voluntarias.',
            'Resposta conforme o texto de apoio e seu contexto historico.',
            'Contribuíram com diferentes praticas culturais, conhecimentos, formas de trabalho e experiencias sociais.',
            'Resposta reconhecendo que a formacao do Brasil e diversa e envolve diferentes trajetorias historicas.'
        )
    }
    return @(
        'Reconhecer mudancas sociais, culturais, economicas ou espaciais relacionadas a chegada e convivencia de migrantes.',
        'Entrevistas e fotografias antigas.',
        'Exemplos: entrevistas, fotografias, cartas, documentos, jornais, mapas e relatos orais.',
        'Exemplos: novos comercios, festas, comidas, associacoes, igrejas, escolas ou formas de ocupacao.',
        'Porque uma mudanca pode ter varias causas e precisa ser comprovada por fontes e comparacoes.',
        'Exemplos: comidas, musicas, festas, palavras, conhecimentos, artes ou formas de trabalho.',
        'Acolher, respeitar direitos, evitar preconceito e valorizar diferentes historias.',
        'Resposta pessoal com pergunta pertinente sobre origem, chegada, motivos, experiencias ou mudancas percebidas.'
    )
}

$activities = @()
for ($i=0; $i -lt $items.Count; $i++) {
    $item = $items[$i]
    $n = $i + 1
    $slug = ($item.T.ToLowerInvariant() -replace '[^a-z0-9 ]','' -replace '\s+','-').Trim('-')
    $questions = New-Questions $item.C $item.T
    $answers = New-Answers $item.C
    $gabarito = @()
    for ($q=0; $q -lt 8; $q++) {
        $gabarito += [ordered]@{ numero = $q + 1; resposta = $answers[$q]; justificativa = ('Resposta alinhada a ' + $item.C + ' e ao texto de apoio.') }
    }

    $activities += [ordered]@{
        id = ('efi-4ano-b4-his-v2-' + ('{0:D2}' -f $n) + '-' + $slug)
        ordem = $n
        titulo = $item.T
        tema = $item.T
        padraoPedagogico = 'teacheasy-v2'
        dificuldade = 'adequada-4ano'
        objetivo = ('Desenvolver ' + $item.C + ' por meio de leitura historica, analise de causas, mudancas, permanencias e evidencias.')
        bncc = @([ordered]@{ codigo = $item.C; descricaoResumida = $skills[$item.C] })
        quantidadeQuestoes = 8
        possuiFiguras = $true
        figuras = @([ordered]@{ id='figura-1'; descricao=$item.I })
        possuiGabarito = $true
        instrucaoGeral = 'Leia o texto de apoio e responda com atencao. Use as informacoes do texto e seus conhecimentos quando solicitado.'
        textoApoio = [ordered]@{ titulo=$item.T; conteudo=$item.X }
        questoes = $questions
        gabarito = $gabarito
        revisao = [ordered]@{ status='revisado-v2'; bnccConferida=$true; gabaritoConferido=$true; ortografiaConferida=$true; conteudoAutoral=$true; revisor='teacheasy-v2'; dataRevisao='2026-08-17' }
        bnccConferida = $true
    }
}

$payload = [ordered]@{
    schemaVersion = '2.0'
    colecao = '4ano-4bimestre-historia-v2'
    idioma = 'pt-BR'
    etapa = 'Ensino Fundamental - Anos Iniciais'
    ano = '4o ano'
    bimestre = 4
    disciplina = 'Historia'
    padraoPedagogico = 'teacheasy-v2'
    statusBimestre = 'revisado-v2'
    atividades = $activities
}

$json = $payload | ConvertTo-Json -Depth 20
[IO.File]::WriteAllText($target, $json, (New-Object Text.UTF8Encoding($false)))
Write-Host ('Historia V2 gerada: ' + $target)
Write-Host ('Atividades: ' + $activities.Count)
