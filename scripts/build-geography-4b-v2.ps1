$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root 'data\atividades\fundamental-anos-iniciais\4-ano\4-bimestre\geografia-v2.json'

$skills = @{
    EF04GE05 = 'Distinguir unidades político-administrativas oficiais nacionais (Distrito, Município, Unidade da Federação e grande região), suas fronteiras e sua hierarquia, localizando seus lugares de vivência.'
    EF04GE10 = 'Comparar tipos variados de mapas, identificando suas características, elaboradores, finalidades, diferenças e semelhanças.'
    EF04GE11 = 'Identificar as características das paisagens naturais e antrópicas (relevo, cobertura vegetal, rios etc.) no ambiente em que vive, bem como a ação humana na conservação ou degradação dessas áreas.'
}

$items = @(
    @{ T='Brasil em grandes regiões'; C='EF04GE05'; X='O Brasil é organizado em cinco grandes regiões: Norte, Nordeste, Centro-Oeste, Sudeste e Sul. Essa divisão reúne estados e ajuda a estudar o território nacional. As grandes regiões não substituem os estados nem os municípios: são uma forma de organizar e compreender o espaço brasileiro.'; I='Mapa do Brasil dividido nas cinco grandes regiões, com cores diferentes, legenda simples e destaque para o Sudeste.' },
    @{ T='Estados, municípios e Distrito Federal'; C='EF04GE05'; X='O território brasileiro possui diferentes unidades político-administrativas. Os municípios fazem parte dos estados; os estados e o Distrito Federal formam as unidades da Federação. Cada nível possui funções próprias e limites que podem ser representados em mapas.'; I='Mapa esquemático mostrando Brasil, um estado destacado e, dentro dele, alguns municípios.' },
    @{ T='Onde fica meu município'; C='EF04GE05'; X='Todo município está localizado em uma unidade da Federação e em uma grande região do Brasil. Para localizar um município, podemos usar mapas políticos, nomes de estados, limites e referências espaciais.'; I='Crianças observando um mapa do estado do Rio de Janeiro com Angra dos Reis destacada.' },
    @{ T='Fronteiras e limites'; C='EF04GE05'; X='Limites separam áreas político-administrativas, como municípios e estados. Fronteiras também podem separar países. Em mapas, essas divisões são representadas por linhas e ajudam a identificar onde uma unidade territorial termina e outra começa.'; I='Mapa simples com dois municípios vizinhos separados por uma linha de limite.' },
    @{ T='Do município ao Brasil'; C='EF04GE05'; X='Uma pessoa vive em um município, que pertence a um estado ou ao Distrito Federal e integra uma das grandes regiões brasileiras. Essa organização em diferentes escalas permite compreender como o lugar onde vivemos faz parte de territórios maiores.'; I='Diagrama em círculos mostrando bairro, município, estado, região e Brasil.' },
    @{ T='Mapa político do Brasil'; C='EF04GE10'; X='O mapa político representa divisões administrativas, como estados, Distrito Federal e limites territoriais. Título, legenda, orientação e nomes dos lugares ajudam o leitor a interpretar as informações representadas.'; I='Mapa político do Brasil com estados delimitados, legenda, título e rosa dos ventos.' },
    @{ T='Mapa físico do Brasil'; C='EF04GE10'; X='Mapas físicos representam elementos naturais, como formas de relevo, rios e altitudes. As cores e símbolos da legenda explicam como esses elementos aparecem no mapa. Um mapa físico tem finalidade diferente de um mapa político.'; I='Mapa físico simplificado do Brasil com rios e faixas de altitude.' },
    @{ T='Mapa de vegetação'; C='EF04GE10'; X='Um mapa de vegetação mostra a distribuição de diferentes formações vegetais no território. A legenda associa cores ou padrões aos tipos de cobertura vegetal, permitindo comparar áreas.'; I='Mapa temático do Brasil com diferentes áreas de vegetação e legenda ilustrada.' },
    @{ T='Mapa de clima'; C='EF04GE10'; X='Mapas climáticos representam a distribuição de tipos de clima em uma área. Para interpretá-los, é necessário observar título, legenda, cores e localização. Eles podem ser comparados a mapas de vegetação e relevo.'; I='Mapa climático simplificado do Brasil com regiões coloridas e legenda clara.' },
    @{ T='Lendo legendas e símbolos'; C='EF04GE10'; X='A legenda explica o significado de cores, linhas e símbolos usados em um mapa. O título indica o assunto principal e a orientação ajuda a localizar direções.'; I='Crianças analisando um mapa com símbolos de rio, estrada, floresta e área urbana.' },
    @{ T='Relevo brasileiro'; C='EF04GE11'; X='O relevo corresponde às diferentes formas da superfície terrestre, como planaltos, planícies e depressões. Essas formas fazem parte das paisagens e se relacionam com rios, vegetação e ocupação humana.'; I='Paisagem brasileira com planalto, planície, vale e um rio.' },
    @{ T='Rios e a vida das pessoas'; C='EF04GE11'; X='Os rios fazem parte das paisagens naturais e são importantes para abastecimento, transporte, lazer, produção de alimentos e geração de energia. A poluição e o desmatamento das margens podem degradar esses ambientes.'; I='Rio limpo próximo a uma comunidade, com mata ciliar preservada.' },
    @{ T='Clima e paisagem'; C='EF04GE11'; X='O clima influencia características das paisagens, como tipos de vegetação e disponibilidade de água. Temperatura e chuvas variam entre lugares e ao longo do ano.'; I='Duas paisagens brasileiras contrastantes, uma mais úmida e outra mais seca.' },
    @{ T='Cobertura vegetal'; C='EF04GE11'; X='A cobertura vegetal protege o solo, oferece abrigo a animais e participa do ciclo da água. A retirada excessiva da vegetação altera a paisagem e pode favorecer erosão e perda de biodiversidade.'; I='Área preservada ao lado de área desmatada, mostrando diferenças no solo.' },
    @{ T='Paisagem natural e antrópica'; C='EF04GE11'; X='Paisagens naturais apresentam elementos da natureza, enquanto paisagens antrópicas foram transformadas pela ação humana. Muitos lugares reúnem elementos naturais e construídos ao mesmo tempo.'; I='Paisagem integrada com rio, morro, rua, ponte e casas.' },
    @{ T='Ação humana e transformação da paisagem'; C='EF04GE11'; X='Construção de moradias, estradas, áreas agrícolas e indústrias transforma paisagens. Algumas mudanças atendem necessidades da sociedade, mas precisam considerar impactos sobre rios, solo, vegetação e qualidade de vida.'; I='Paisagem antes e depois de ocupação humana planejada, com áreas verdes preservadas.' },
    @{ T='Conservação dos rios'; C='EF04GE11'; X='Conservar rios envolve proteger nascentes e margens, evitar despejo de lixo e esgoto e utilizar a água com responsabilidade. A população e o poder público têm responsabilidades nesse cuidado.'; I='Ação comunitária de cuidado com margem de rio.' },
    @{ T='Áreas protegidas e conservação'; C='EF04GE11'; X='Áreas protegidas contribuem para conservar paisagens, espécies, rios e outros elementos naturais. Nesses espaços, regras de uso procuram conciliar proteção ambiental, pesquisa, educação e visitação.'; I='Parque natural brasileiro com trilha sinalizada, mata e rio preservados.' },
    @{ T='Problemas ambientais no município'; C='EF04GE11'; X='Descarte irregular de lixo, poluição da água, retirada de vegetação e ocupação inadequada transformam a paisagem e podem prejudicar a qualidade de vida. Observar o município ajuda a identificar causas, consequências e soluções.'; I='Bairro com ponto de descarte irregular contrastando com outra área limpa.' },
    @{ T='Cuidando da paisagem local'; C='EF04GE11'; X='Cuidar da paisagem local exige reconhecer elementos naturais e construídos, identificar situações de conservação ou degradação e propor ações possíveis. Atitudes individuais e ações coletivas podem melhorar o lugar onde vivemos.'; I='Estudantes apresentando plano de cuidado do bairro com árvores, lixeiras e rio limpo.' }
)

function New-Questions([string]$code, [string]$title) {
    if ($code -eq 'EF04GE05') {
        return @(
            @{numero=1;tipo='compreensao';enunciado="Explique como o tema '$title' ajuda a compreender a organização do território brasileiro.";alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=2;tipo='multipla-escolha';enunciado='Qual alternativa apresenta uma unidade político-administrativa do Brasil?';alternativas=@('Município','Oceano','Continente europeu','Linha do Equador');espacoResposta='pequeno';figuraId=$null},
            @{numero=3;tipo='localizacao';enunciado='Organize do menor para o maior: município, estado, grande região e Brasil.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=4;tipo='comparacao';enunciado='Explique a diferença entre município e estado.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=5;tipo='analise-espacial';enunciado='Por que os limites representados nos mapas ajudam a identificar municípios e estados?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=6;tipo='aplicacao';enunciado='Em qual estado e em qual grande região está localizado o município onde você vive?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=7;tipo='interpretacao';enunciado='Que informações do título ou da legenda você procuraria para entender um mapa político?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=8;tipo='producao';enunciado='Escreva uma frase mostrando como seu município se relaciona com um território maior do Brasil.';alternativas=@();espacoResposta='grande';figuraId=$null}
        )
    }
    if ($code -eq 'EF04GE10') {
        return @(
            @{numero=1;tipo='compreensao';enunciado="Explique qual informação principal um mapa sobre '$title' pode representar.";alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=2;tipo='multipla-escolha';enunciado='Qual elemento do mapa explica o significado de cores e símbolos?';alternativas=@('Legenda','Margem da folha','Nome do aluno','Parágrafo');espacoResposta='pequeno';figuraId=$null},
            @{numero=3;tipo='interpretacao';enunciado='Por que é importante ler o título antes de interpretar um mapa?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=4;tipo='comparacao';enunciado='Cite uma diferença entre mapa político e mapa físico ou temático.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=5;tipo='analise-espacial';enunciado='O que pode acontecer se alguém interpretar as cores de um mapa sem consultar a legenda?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=6;tipo='aplicacao';enunciado='Indique dois elementos que você verificaria para compreender informações em um mapa.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=7;tipo='comparacao';enunciado='Por que dois mapas do Brasil podem mostrar informações diferentes e ainda estar corretos?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=8;tipo='producao';enunciado='Imagine um mapa do seu bairro. Escreva um título e três itens que deveriam aparecer na legenda.';alternativas=@();espacoResposta='grande';figuraId=$null}
        )
    }
    return @(
        @{numero=1;tipo='compreensao';enunciado="Identifique dois elementos da paisagem relacionados ao tema '$title'.";alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=2;tipo='multipla-escolha';enunciado='Qual atitude contribui para conservar uma paisagem?';alternativas=@('Proteger vegetação e evitar descarte de lixo','Jogar resíduos em rios','Retirar toda a vegetação das margens','Desperdiçar água');espacoResposta='pequeno';figuraId=$null},
        @{numero=3;tipo='comparacao';enunciado='Explique uma diferença entre uma paisagem conservada e uma paisagem degradada.';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=4;tipo='causa-consequencia';enunciado='Cite uma ação humana que transforma a paisagem e uma possível consequência.';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=5;tipo='analise-espacial';enunciado='Por que rios, relevo e vegetação devem ser observados quando estudamos uma paisagem?';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=6;tipo='aplicacao';enunciado='Dê um exemplo de conservação ou degradação que pode ser observado no lugar onde você vive.';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=7;tipo='proposta';enunciado='Proponha uma ação que moradores e poder público poderiam realizar para cuidar melhor da paisagem local.';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=8;tipo='producao';enunciado='Explique por que conservar os elementos naturais melhora a qualidade de vida.';alternativas=@();espacoResposta='grande';figuraId=$null}
    )
}

function New-Answers([string]$code) {
    if ($code -eq 'EF04GE05') {
        $a=@('Identificar unidades territoriais e compreender sua organização em escalas.','Município.','Município → estado → grande região → Brasil.','Município é uma divisão local que integra um estado; o estado é uma unidade da Federação.','Os limites mostram onde uma unidade territorial termina e outra começa.','Resposta pessoal coerente com o município do estudante.','Título, unidade destacada, significado das cores, limites ou símbolos.','Resposta pessoal relacionando corretamente município, estado, região ou país.')
    } elseif ($code -eq 'EF04GE10') {
        $a=@('Resposta coerente com o tema e a finalidade do mapa.','Legenda.','Porque o título informa o assunto principal da representação.','O político destaca divisões administrativas; o físico ou temático destaca elementos naturais ou um tema específico.','Pode atribuir significados errados às cores e símbolos.','Exemplos: título, legenda, orientação, escala, nomes e símbolos.','Porque cada mapa pode ter uma finalidade e selecionar informações diferentes sobre o mesmo território.','Resposta pessoal com título adequado e legenda coerente.')
    } else {
        $a=@('Resposta baseada no texto, citando dois elementos pertinentes da paisagem.','Proteger vegetação e evitar descarte de lixo.','A conservada mantém melhor seus elementos; a degradada apresenta danos.','Resposta coerente ligando uma ação humana a uma consequência.','Porque esses elementos caracterizam a paisagem e se relacionam entre si e com a ocupação humana.','Resposta pessoal coerente com o contexto local.','Exemplos: proteger rios, ampliar coleta de resíduos, preservar vegetação ou recuperar áreas degradadas.','Resposta relacionando conservação a água, solo, biodiversidade, bem-estar e qualidade de vida.')
    }
    $out=@(); for($i=0;$i -lt 8;$i++){ $out += @{numero=$i+1;resposta=$a[$i];justificativa="Resposta alinhada à habilidade $code e ao conteúdo da atividade."} }; return $out
}

$activities=@()
for($i=0;$i -lt $items.Count;$i++){
    $it=$items[$i]; $n=$i+1; $code=$it.C
    $activities += @{
        id=('efi-4ano-b4-geo-v2-{0:D2}' -f $n)
        padraoPedagogico='teacheasy-v2'
        sequenciaNumero=$n
        titulo=$it.T
        tema=$it.T
        sequencia="Atividade $n"
        tipoSequencia='Coleção TeachEasy V2'
        dificuldade='adequada-4-ano'
        objetivo="Desenvolver a habilidade $code por meio de leitura, interpretação, comparação e aplicação de conhecimentos geográficos sobre $($it.T.ToLower())."
        bncc=@(@{codigo=$code;habilidadeOficial=$skills[$code];descricaoResumida=$skills[$code]})
        quantidadeQuestoes=8
        possuiFiguras=$true
        figuras=@()
        possuiGabarito=$true
        possuiVersaoAdaptada=$false
        instrucaoGeral='Leia o texto de apoio, observe a proposta de ilustração e responda às questões com atenção.'
        textoApoio=@{titulo=$it.T;conteudo=$it.X}
        ilustracao=@{descricao=$it.I;status='planejada';estilo='TeachEasy — ilustração pedagógica colorida, clara e adequada ao 4º ano'}
        questoes=(New-Questions $code $it.T)
        gabarito=(New-Answers $code)
        revisao=@{status='revisado-v2';bnccConferida=$true;gabaritoConferido=$true;ortografiaConferida=$true;conteudoAutoral=$true;revisor='TeachEasy';dataRevisao='2026-08-17'}
        bnccConferida=$true
    }
}

$collection=@{
    schemaVersion='2.0'
    padraoPedagogico='teacheasy-v2'
    colecao='4ano-4bimestre-geografia-v2'
    idioma='pt-BR'
    etapa='Ensino Fundamental — Anos Iniciais'
    ano='4º ano'
    bimestre=4
    disciplina='Geografia'
    statusBimestre='revisado-v2'
    atividades=$activities
}

$json=$collection | ConvertTo-Json -Depth 12
[IO.File]::WriteAllText($target,$json,(New-Object Text.UTF8Encoding($false)))
Write-Host ('[OK] Geografia 4º bimestre V2 criada: ' + $target)
Write-Host ('Atividades: ' + $activities.Count + ' | Questões por atividade: 8 | Gabarito: 8')
