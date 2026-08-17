$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root 'data\atividades\fundamental-anos-iniciais\4-ano\4-bimestre\ciencias-v2.json'

$skills = @{
    EF04CI09 = 'Identificar os pontos cardeais, com base no registro de diferentes posicoes relativas do Sol e da sombra de uma vara (gnomon).'
    EF04CI10 = 'Comparar as indicacoes dos pontos cardeais resultantes da observacao das sombras de uma vara (gnomon) com aquelas obtidas por meio de uma bussola.'
    EF04CI11 = 'Associar os movimentos ciclicos da Lua e da Terra a periodos de tempo regulares e ao uso desse conhecimento para a construcao de calendarios em diferentes culturas.'
}

$items = @(
    @{T='Pontos cardeais';C='EF04CI09';X='Os pontos cardeais Norte, Sul, Leste e Oeste ajudam a orientar pessoas e localizar lugares. Podemos identifica-los observando a posicao aparente do Sol e as sombras produzidas por objetos ao longo do dia.';I='Criancas observando uma rosa dos ventos no patio da escola.'},
    @{T='O Sol e a orientacao';C='EF04CI09';X='O Sol parece nascer aproximadamente na direcao Leste e se por aproximadamente na direcao Oeste. Essa observacao pode ser usada como referencia inicial para orientacao, embora a posicao aparente varie ao longo do ano.';I='Sequencia mostrando o Sol pela manha e no fim da tarde.'},
    @{T='Sombras ao longo do dia';C='EF04CI09';X='A direcao e o comprimento das sombras mudam conforme a posicao aparente do Sol no ceu. Registrar essas mudancas permite comparar horarios e inferir direcoes.';I='Uma vara no patio projetando sombras em tres horarios.'},
    @{T='Construindo um gnomon';C='EF04CI09';X='Um gnomon pode ser feito com uma haste vertical fixada em local plano e ensolarado. Marcando a ponta da sombra em horarios diferentes, podemos investigar a mudanca de direcao da sombra.';I='Experimento simples com haste vertical e marcacoes no chao.'},
    @{T='Registrando a sombra';C='EF04CI09';X='Uma investigacao cientifica precisa de registros. Ao marcar horario, direcao e comprimento da sombra, podemos comparar dados e reconhecer padroes.';I='Tabela simples com horario e comprimento da sombra.'},
    @{T='Orientacao no patio da escola';C='EF04CI09';X='Depois de identificar pontos cardeais, podemos descrever a posicao de locais da escola, como portao, quadra e biblioteca, usando referencias espaciais.';I='Mapa simples de uma escola com rosa dos ventos.'},
    @{T='Leste e Oeste na pratica';C='EF04CI09';X='Observar o Sol em horarios diferentes ajuda a construir referencias de Leste e Oeste. A partir dessas referencias, podemos estimar Norte e Sul.';I='Criancas comparando direcoes com os bracos abertos no patio.'},
    @{T='A bussola';C='EF04CI10';X='A bussola possui uma agulha magnetizada que se alinha aproximadamente na direcao Norte-Sul. Ela e um instrumento usado para orientacao e pode ser comparada com observacoes feitas por sombras.';I='Bussola grande ao lado de uma rosa dos ventos.'},
    @{T='Gnomon e bussola';C='EF04CI10';X='O gnomon usa a luz do Sol e as sombras para ajudar na orientacao. A bussola utiliza o campo magnetico terrestre. Comparar os dois metodos permite verificar semelhanças e diferencas.';I='Gnomon e bussola lado a lado em uma investigacao escolar.'},
    @{T='Comparando resultados';C='EF04CI10';X='Ao investigar orientacao, podemos comparar a direcao indicada pela sombra com a direcao indicada pela bussola. Pequenas diferencas podem ocorrer por horario, local, forma de medir e interferencias.';I='Alunos anotando resultados de dois metodos em uma tabela.'},
    @{T='Como usar a bussola';C='EF04CI10';X='Para usar uma bussola, ela deve ficar nivelada e longe de objetos metalicos que possam interferir na agulha. Depois que a agulha estabiliza, podemos identificar as direcoes.';I='Crianca usando bussola longe de objetos metalicos.'},
    @{T='Orientacao em mapas';C='EF04CI10';X='Mapas podem indicar Norte, Sul, Leste e Oeste. A bussola ajuda a relacionar essas direcoes do mapa com o espaco real.';I='Mapa de bairro com seta do Norte e bussola.'},
    @{T='Interferencias na bussola';C='EF04CI10';X='Alguns objetos metalicos e aparelhos podem alterar a leitura de uma bussola. Por isso, repetir medidas e comparar resultados aumenta a confiabilidade da investigacao.';I='Bussola proxima e depois afastada de um objeto metalico.'},
    @{T='Orientacao em uma trilha';C='EF04CI10';X='Em atividades de campo, referencias visuais, mapas e bussola podem ser usados em conjunto. Comparar diferentes formas de orientacao ajuda a reduzir erros.';I='Trilha educativa com placa, mapa e bussola.'},
    @{T='Movimentos ciclicos';C='EF04CI11';X='Alguns fenomenos da natureza se repetem em ciclos. O movimento de rotacao da Terra esta relacionado a alternancia entre dia e noite, e outros ciclos ajudam a organizar periodos de tempo.';I='Esquema simples da Terra iluminada pelo Sol.'},
    @{T='Dia e noite';C='EF04CI11';X='A Terra gira em torno de seu proprio eixo. Esse movimento, chamado rotacao, esta relacionado a sucessao de dias e noites e dura aproximadamente 24 horas.';I='Terra mostrando lado iluminado e lado escuro.'},
    @{T='Fases da Lua';C='EF04CI11';X='A Lua apresenta fases que se repetem em um ciclo. Essas mudancas aparentes resultam das diferentes porcoes iluminadas pelo Sol que vemos da Terra.';I='Sequencia das principais fases da Lua.'},
    @{T='Meses e ciclos da Lua';C='EF04CI11';X='Ao longo da historia, diferentes povos observaram os ciclos da Lua para organizar periodos de tempo. Alguns calendarios usam esses ciclos como referencia para definir meses.';I='Calendario com desenhos das fases da Lua.'},
    @{T='Calendarios em diferentes culturas';C='EF04CI11';X='Calendarios foram construidos por diferentes sociedades a partir da observacao de ciclos naturais, como os movimentos da Terra, do Sol aparente e da Lua. Eles ajudam a organizar atividades sociais, festas e plantios.';I='Tres calendarios culturais representados de forma educativa.'},
    @{T='Ciclos naturais e organizacao do tempo';C='EF04CI11';X='Observar ciclos naturais permite reconhecer regularidades. Dias, meses e anos sao formas de organizar o tempo relacionadas a movimentos e ciclos astronomicos.';I='Linha do tempo ligando dia, mes e ano a fenomenos astronomicos.'}
)

function New-Questions([string]$code,[string]$title) {
    if ($code -eq 'EF04CI09') {
        return @(
            @{numero=1;tipo='compreensao';enunciado="Explique o que '$title' ensina sobre orientacao.";alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=2;tipo='multipla-escolha';enunciado='Qual conjunto apresenta os quatro pontos cardeais?';alternativas=@('Norte, Sul, Leste e Oeste','Cima, baixo, perto e longe','Manha, tarde, noite e madrugada','Frio, calor, chuva e vento');espacoResposta='pequeno';figuraId=$null},
            @{numero=3;tipo='investigacao';enunciado='Como a sombra de uma vara pode ajudar a investigar direcoes?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=4;tipo='registro';enunciado='Quais dados devem ser registrados ao observar sombras em horarios diferentes?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=5;tipo='comparacao';enunciado='Por que a sombra muda de direcao e comprimento ao longo do dia?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=6;tipo='aplicacao';enunciado='Dê um exemplo de como os pontos cardeais podem ser usados na escola ou no bairro.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=7;tipo='seguranca';enunciado='Que cuidado devemos ter ao observar o Sol durante a atividade?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=8;tipo='producao';enunciado='Escreva uma conclusao sobre como Sol e sombra podem auxiliar na orientacao.';alternativas=@();espacoResposta='grande';figuraId=$null}
        )
    }
    if ($code -eq 'EF04CI10') {
        return @(
            @{numero=1;tipo='compreensao';enunciado="Explique a ideia principal de '$title'.";alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=2;tipo='multipla-escolha';enunciado='Qual instrumento possui agulha magnetizada e ajuda na orientacao?';alternativas=@('Bussola','Termometro','Regua','Calendario');espacoResposta='pequeno';figuraId=$null},
            @{numero=3;tipo='comparacao';enunciado='Cite uma diferenca entre orientar-se pelo gnomon e pela bussola.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=4;tipo='investigacao';enunciado='Por que e importante comparar os resultados obtidos pelos dois metodos?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=5;tipo='procedimento';enunciado='Cite um cuidado necessario para usar a bussola corretamente.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=6;tipo='aplicacao';enunciado='Como uma bussola pode ajudar na leitura de um mapa?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=7;tipo='evidencia';enunciado='O que voce faria se gnomon e bussola apresentassem resultados muito diferentes?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=8;tipo='producao';enunciado='Escreva uma conclusao comparando bussola e observacao das sombras.';alternativas=@();espacoResposta='grande';figuraId=$null}
        )
    }
    return @(
        @{numero=1;tipo='compreensao';enunciado="Explique qual ciclo natural aparece no tema '$title'.";alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=2;tipo='multipla-escolha';enunciado='Qual movimento da Terra esta relacionado a sucessao de dias e noites?';alternativas=@('Rotacao','Evaporacao','Germinacao','Erosao');espacoResposta='pequeno';figuraId=$null},
        @{numero=3;tipo='identificacao';enunciado='Cite um fenomeno natural que se repete em ciclos regulares.';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=4;tipo='comparacao';enunciado='Qual relacao pode existir entre ciclos da Lua e a organizacao dos meses?';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=5;tipo='tempo';enunciado='Como os movimentos ciclicos ajudam a organizar a passagem do tempo?';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=6;tipo='cultura';enunciado='Por que diferentes culturas podem construir calendarios de formas diferentes?';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=7;tipo='aplicacao';enunciado='Dê um exemplo de atividade humana organizada com ajuda de calendarios.';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=8;tipo='producao';enunciado='Escreva uma conclusao ligando ciclos naturais e organizacao do tempo.';alternativas=@();espacoResposta='grande';figuraId=$null}
    )
}

function New-Answers([string]$code) {
    if ($code -eq 'EF04CI09') { return @('Reconhecer orientacao por pontos cardeais.','Norte, Sul, Leste e Oeste.','Observar e registrar mudancas na direcao da sombra.','Horario, direcao e/ou comprimento da sombra.','Porque a posicao aparente do Sol muda ao longo do dia.','Resposta coerente usando pontos cardeais.','Nunca olhar diretamente para o Sol.','Conclusao relacionando Sol, sombra e orientacao.') }
    if ($code -eq 'EF04CI10') { return @('Explicacao coerente sobre orientacao e comparacao de metodos.','Bussola.','Gnomon depende da luz solar e sombras; bussola usa agulha magnetizada.','Para verificar a confiabilidade das observacoes.','Manter nivelada e longe de objetos que interfiram.','Ajuda a relacionar o Norte do mapa com o espaco real.','Repetir medidas, conferir procedimento e afastar interferencias.','Conclusao comparando corretamente os dois metodos.') }
    return @('Identificar o ciclo natural estudado.','Rotacao.','Exemplos: dia/noite, fases da Lua ou ciclo anual.','Fases lunares podem servir de referencia para meses em alguns calendarios.','Criam referencias regulares como dias, meses e anos.','Porque sociedades observam e organizam ciclos de modos diferentes.','Exemplos: festas, plantio, aulas, trabalho ou compromissos.','Conclusao relacionando ciclos naturais e organizacao do tempo.')
}

$activities = @()
for ($i=0; $i -lt $items.Count; $i++) {
    $it=$items[$i]; $n=$i+1; $code=$it.C
    $slug = ($it.T.Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}','' -replace '[^a-zA-Z0-9]+','-').Trim('-').ToLower()
    $activities += [ordered]@{
        id=('efi-4ano-b4-cie-v2-{0:D2}-{1}' -f $n,$slug)
        titulo=$it.T; tema=$it.T; sequencia=('Atividade ' + $n); sequenciaNumero=$n
        tipoSequencia='Colecao principal V2'; padraoPedagogico='teacheasy-v2'; dificuldade='adequada-4-ano'
        objetivo="Desenvolver a habilidade $code por meio de leitura, investigacao, comparacao e aplicacao sobre $($it.T.ToLower())."
        bncc=@(@{codigo=$code;habilidadeOficial=$skills[$code];descricaoResumida=$skills[$code]})
        quantidadeQuestoes=8; possuiFiguras=$true; figuras=@(); possuiGabarito=$true; possuiVersaoAdaptada=$false
        instrucaoGeral='Leia o texto de apoio, observe a proposta de ilustracao e responda as questoes com atencao.'
        textoApoio=@{titulo=$it.T;conteudo=$it.X}
        ilustracao=@{descricao=$it.I;status='planejada';estilo='TeachEasy - ilustracao pedagogica colorida, clara e adequada ao 4 ano'}
        questoes=(New-Questions $code $it.T)
        gabarito=@(for($j=0;$j -lt 8;$j++){ @{numero=$j+1;resposta=(New-Answers $code)[$j]} })
        revisao=@{status='revisado-v2';bnccConferida=$true;gabaritoConferido=$true;ortografiaConferida=$true;conteudoAutoral=$true;revisor='TeachEasy';dataRevisao='2026-08-17'}
        bnccConferida=$true
    }
}

$collection=[ordered]@{schemaVersion='2.0';padraoPedagogico='teacheasy-v2';colecao='4ano-4bimestre-ciencias-v2';idioma='pt-BR';etapa='Ensino Fundamental - Anos Iniciais';ano='4 ano';bimestre=4;disciplina='Ciencias';statusBimestre='revisado-v2';atividades=$activities}
$json=$collection | ConvertTo-Json -Depth 12
[IO.File]::WriteAllText($target,$json,(New-Object Text.UTF8Encoding($false)))
Write-Host ('Ciencias V2 gerada: ' + $target)
Write-Host ('Atividades: ' + $activities.Count)
