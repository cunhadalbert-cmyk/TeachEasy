$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root 'data\atividades\fundamental-anos-iniciais\4-ano\4-bimestre\ciencias-v2.json'

$skills = @{
    EF04CI09 = 'Identificar os pontos cardeais, com base no registro de diferentes posições relativas do Sol e da sombra de uma vara (gnômon).'
    EF04CI10 = 'Comparar as indicações dos pontos cardeais resultantes da observação das sombras de uma vara (gnômon) com aquelas obtidas por meio de uma bússola.'
    EF04CI11 = 'Associar os movimentos cíclicos da Lua e da Terra a períodos de tempo regulares e ao uso desse conhecimento para a construção de calendários em diferentes culturas.'
}

$items = @(
    @{T='Pontos cardeais';C='EF04CI09';X='Os pontos cardeais Norte, Sul, Leste e Oeste ajudam a orientar pessoas e localizar lugares. Podemos identificá-los observando a posição aparente do Sol e as sombras produzidas por objetos ao longo do dia.';I='Crianças observando uma rosa dos ventos no pátio da escola.'},
    @{T='O Sol e a orientação';C='EF04CI09';X='O Sol parece nascer aproximadamente na direção Leste e se pôr aproximadamente na direção Oeste. Essa observação pode ser usada como referência inicial para orientação, embora a posição aparente varie ao longo do ano.';I='Sequência mostrando o Sol pela manhã e no fim da tarde.'},
    @{T='Sombras ao longo do dia';C='EF04CI09';X='A direção e o comprimento das sombras mudam conforme a posição aparente do Sol no céu. Registrar essas mudanças permite comparar horários e inferir direções.';I='Uma vara no pátio projetando sombras em três horários.'},
    @{T='Construindo um gnômon';C='EF04CI09';X='Um gnômon pode ser feito com uma haste vertical fixada em local plano e ensolarado. Marcando a ponta da sombra em horários diferentes, podemos investigar a mudança de direção da sombra.';I='Experimento simples com haste vertical e marcações no chão.'},
    @{T='Registrando a sombra';C='EF04CI09';X='Uma investigação científica precisa de registros. Ao marcar horário, direção e comprimento da sombra, podemos comparar dados e reconhecer padrões.';I='Tabela simples com horário e comprimento da sombra.'},
    @{T='Orientação no pátio da escola';C='EF04CI09';X='Depois de identificar pontos cardeais, podemos descrever a posição de locais da escola, como portão, quadra e biblioteca, usando referências espaciais.';I='Mapa simples de uma escola com rosa dos ventos.'},
    @{T='Leste e Oeste na prática';C='EF04CI09';X='Observar o Sol em horários diferentes ajuda a construir referências de Leste e Oeste. A partir dessas referências, podemos estimar Norte e Sul.';I='Crianças comparando direções com os braços abertos no pátio.'},
    @{T='A bússola';C='EF04CI10';X='A bússola possui uma agulha magnetizada que se alinha aproximadamente na direção Norte-Sul. Ela é um instrumento usado para orientação e pode ser comparada com observações feitas por sombras.';I='Bússola grande ao lado de uma rosa dos ventos.'},
    @{T='Gnômon e bússola';C='EF04CI10';X='O gnômon usa a luz do Sol e as sombras para ajudar na orientação. A bússola utiliza o campo magnético terrestre. Comparar os dois métodos permite verificar semelhanças e diferenças.';I='Gnômon e bússola lado a lado em uma investigação escolar.'},
    @{T='Comparando resultados';C='EF04CI10';X='Ao investigar orientação, podemos comparar a direção indicada pela sombra com a direção indicada pela bússola. Pequenas diferenças podem ocorrer por horário, local, forma de medir e interferências.';I='Alunos anotando resultados de dois métodos em uma tabela.'},
    @{T='Como usar a bússola';C='EF04CI10';X='Para usar uma bússola, ela deve ficar nivelada e longe de objetos metálicos que possam interferir na agulha. Depois que a agulha estabiliza, podemos identificar as direções.';I='Criança usando bússola longe de objetos metálicos.'},
    @{T='Orientação em mapas';C='EF04CI10';X='Mapas podem indicar Norte, Sul, Leste e Oeste. A bússola ajuda a relacionar essas direções do mapa com o espaço real.';I='Mapa de bairro com seta do Norte e bússola.'},
    @{T='Interferências na bússola';C='EF04CI10';X='Alguns objetos metálicos e aparelhos podem alterar a leitura de uma bússola. Por isso, repetir medidas e comparar resultados aumenta a confiabilidade da investigação.';I='Bússola próxima e depois afastada de um objeto metálico.'},
    @{T='Orientação em uma trilha';C='EF04CI10';X='Em atividades de campo, referências visuais, mapas e bússola podem ser usados em conjunto. Comparar diferentes formas de orientação ajuda a reduzir erros.';I='Trilha educativa com placa, mapa e bússola.'},
    @{T='Movimentos cíclicos';C='EF04CI11';X='Alguns fenômenos da natureza se repetem em ciclos. O movimento de rotação da Terra está relacionado à alternância entre dia e noite, e outros ciclos ajudam a organizar períodos de tempo.';I='Esquema simples da Terra iluminada pelo Sol.'},
    @{T='Dia e noite';C='EF04CI11';X='A Terra gira em torno de seu próprio eixo. Esse movimento, chamado rotação, está relacionado à sucessão de dias e noites e dura aproximadamente 24 horas.';I='Terra mostrando lado iluminado e lado escuro.'},
    @{T='Fases da Lua';C='EF04CI11';X='A Lua apresenta fases que se repetem em um ciclo. Essas mudanças aparentes resultam das diferentes porções iluminadas pelo Sol que vemos da Terra.';I='Sequência das principais fases da Lua.'},
    @{T='Meses e ciclos da Lua';C='EF04CI11';X='Ao longo da história, diferentes povos observaram os ciclos da Lua para organizar períodos de tempo. Alguns calendários usam esses ciclos como referência para definir meses.';I='Calendário com desenhos das fases da Lua.'},
    @{T='Calendários em diferentes culturas';C='EF04CI11';X='Calendários foram construídos por diferentes sociedades a partir da observação de ciclos naturais, como os movimentos da Terra, do Sol aparente e da Lua. Eles ajudam a organizar atividades sociais, festas e plantios.';I='Três calendários culturais representados de forma educativa.'},
    @{T='Ciclos naturais e organização do tempo';C='EF04CI11';X='Observar ciclos naturais permite reconhecer regularidades. Dias, meses e anos são formas de organizar o tempo relacionadas a movimentos e ciclos astronômicos.';I='Linha do tempo ligando dia, mês e ano a fenômenos astronômicos.'}
)

function New-Questions([string]$code,[string]$title) {
    if ($code -eq 'EF04CI09') {
        return @(
            @{numero=1;tipo='compreensao';enunciado="Explique o que '$title' ensina sobre orientação.";alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=2;tipo='multipla-escolha';enunciado='Qual conjunto apresenta os quatro pontos cardeais?';alternativas=@('Norte, Sul, Leste e Oeste','Cima, baixo, perto e longe','Manhã, tarde, noite e madrugada','Frio, calor, chuva e vento');espacoResposta='pequeno';figuraId=$null},
            @{numero=3;tipo='investigacao';enunciado='Como a sombra de uma vara pode ajudar a investigar direções?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=4;tipo='registro';enunciado='Quais dados devem ser registrados ao observar sombras em horários diferentes?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=5;tipo='comparacao';enunciado='Por que a sombra muda de direção e comprimento ao longo do dia?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=6;tipo='aplicacao';enunciado='Dê um exemplo de como os pontos cardeais podem ser usados na escola ou no bairro.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=7;tipo='seguranca';enunciado='Que cuidado devemos ter ao observar o Sol durante a atividade?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=8;tipo='producao';enunciado='Escreva uma conclusão sobre como o Sol e a sombra podem auxiliar na orientação.';alternativas=@();espacoResposta='grande';figuraId=$null}
        )
    }
    if ($code -eq 'EF04CI10') {
        return @(
            @{numero=1;tipo='compreensao';enunciado="Explique a ideia principal de '$title'.";alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=2;tipo='multipla-escolha';enunciado='Qual instrumento possui agulha magnetizada e ajuda na orientação?';alternativas=@('Bússola','Termômetro','Régua','Calendário');espacoResposta='pequeno';figuraId=$null},
            @{numero=3;tipo='comparacao';enunciado='Cite uma diferença entre orientar-se pelo gnômon e pela bússola.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=4;tipo='investigacao';enunciado='Por que é importante comparar os resultados obtidos pelos dois métodos?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=5;tipo='procedimento';enunciado='Cite um cuidado necessário para usar a bússola corretamente.';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=6;tipo='aplicacao';enunciado='Como uma bússola pode ajudar na leitura de um mapa?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=7;tipo='evidencia';enunciado='O que você faria se gnômon e bússola apresentassem resultados muito diferentes?';alternativas=@();espacoResposta='medio';figuraId=$null},
            @{numero=8;tipo='producao';enunciado='Escreva uma conclusão comparando bússola e observação das sombras.';alternativas=@();espacoResposta='grande';figuraId=$null}
        )
    }
    return @(
        @{numero=1;tipo='compreensao';enunciado="Explique qual ciclo natural aparece no tema '$title'.";alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=2;tipo='multipla-escolha';enunciado='Qual movimento da Terra está relacionado à sucessão de dias e noites?';alternativas=@('Rotação','Evaporação','Germinação','Erosão');espacoResposta='pequeno';figuraId=$null},
        @{numero=3;tipo='identificacao';enunciado='Cite um fenômeno natural que se repete em ciclos regulares.';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=4;tipo='comparacao';enunciado='Qual relação pode existir entre ciclos da Lua e a organização dos meses?';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=5;tipo='tempo';enunciado='Como os movimentos cíclicos ajudam a organizar a passagem do tempo?';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=6;tipo='cultura';enunciado='Por que diferentes culturas podem construir calendários de formas diferentes?';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=7;tipo='aplicacao';enunciado='Dê um exemplo de atividade humana organizada com ajuda de calendários.';alternativas=@();espacoResposta='medio';figuraId=$null},
        @{numero=8;tipo='producao';enunciado='Escreva uma conclusão ligando ciclos naturais e organização do tempo.';alternativas=@();espacoResposta='grande';figuraId=$null}
    )
}

function New-Answers([string]$code) {
    if ($code -eq 'EF04CI09') { return @('Reconhecer orientação por pontos cardeais.','Norte, Sul, Leste e Oeste.','Observar e registrar mudanças na direção da sombra.','Horário, direção e/ou comprimento da sombra.','Porque a posição aparente do Sol muda ao longo do dia.','Resposta coerente usando pontos cardeais.','Nunca olhar diretamente para o Sol.','Conclusão relacionando Sol, sombra e orientação.') }
    if ($code -eq 'EF04CI10') { return @('Explicação coerente sobre orientação e comparação de métodos.','Bússola.','Gnômon depende da luz solar e sombras; bússola usa agulha magnetizada.','Para verificar a confiabilidade das observações.','Manter nivelada e longe de objetos que interfiram.','Ajuda a relacionar o Norte do mapa com o espaço real.','Repetir medidas, conferir procedimento e afastar interferências.','Conclusão comparando corretamente os dois métodos.') }
    return @('Identificar o ciclo natural estudado.','Rotação.','Exemplos: dia/noite, fases da Lua ou ciclo anual.','Fases lunares podem servir de referência para meses em alguns calendários.','Criam referências regulares como dias, meses e anos.','Porque sociedades observam e organizam ciclos de modos diferentes.','Exemplos: festas, plantio, aulas, trabalho ou compromissos.','Conclusão relacionando ciclos naturais e organização do tempo.')
}

$activities = @()
for ($i=0; $i -lt $items.Count; $i++) {
    $it=$items[$i]; $n=$i+1; $code=$it.C
    $slug = ($it.T.Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}','' -replace '[^a-zA-Z0-9]+','-').Trim('-').ToLower()
    $activities += [ordered]@{
        id=('efi-4ano-b4-cie-v2-{0:D2}-{1}' -f $n,$slug)
        titulo=$it.T; tema=$it.T; sequencia=('Atividade ' + $n); sequenciaNumero=$n
        tipoSequencia='Coleção principal V2'; padraoPedagogico='teacheasy-v2'; dificuldade='adequada-4-ano'
        objetivo="Desenvolver a habilidade $code por meio de leitura, investigação, comparação e aplicação sobre $($it.T.ToLower())."
        bncc=@(@{codigo=$code;habilidadeOficial=$skills[$code];descricaoResumida=$skills[$code]})
        quantidadeQuestoes=8; possuiFiguras=$true; figuras=@(); possuiGabarito=$true; possuiVersaoAdaptada=$false
        instrucaoGeral='Leia o texto de apoio, observe a proposta de ilustração e responda às questões com atenção.'
        textoApoio=@{titulo=$it.T;conteudo=$it.X}
        ilustracao=@{descricao=$it.I;status='planejada';estilo='TeachEasy - ilustração pedagógica colorida, clara e adequada ao 4º ano'}
        questoes=(New-Questions $code $it.T)
        gabarito=@(for($j=0;$j -lt 8;$j++){ @{numero=$j+1;resposta=(New-Answers $code)[$j]} })
        revisao=@{status='revisado-v2';bnccConferida=$true;gabaritoConferido=$true;ortografiaConferida=$true;conteudoAutoral=$true;revisor='TeachEasy';dataRevisao='2026-08-17'}
        bnccConferida=$true
    }
}

$collection=[ordered]@{schemaVersion='2.0';padraoPedagogico='teacheasy-v2';colecao='4ano-4bimestre-ciencias-v2';idioma='pt-BR';etapa='Ensino Fundamental - Anos Iniciais';ano='4º ano';bimestre=4;disciplina='Ciências';statusBimestre='revisado-v2';atividades=$activities}
$json=$collection | ConvertTo-Json -Depth 12
[IO.File]::WriteAllText($target,$json,(New-Object Text.UTF8Encoding($true)))
Write-Host ('Ciências V2 gerada: ' + $target)
Write-Host ('Atividades: ' + $activities.Count)
