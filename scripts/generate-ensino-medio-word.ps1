param(
    [int]$Serie = 0,
    [int]$Term = 0,
    [ValidateSet('', 'lingua-portuguesa', 'matematica', 'ciencias', 'historia', 'geografia')]
    [string]$Subject = '',
    [int]$Order = 0,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$fitScript = Join-Path $PSScriptRoot 'word-illustration-fit.ps1'
if (-not (Test-Path -LiteralPath $fitScript)) { throw ('Modulo de encaixe de imagem ausente: ' + $fitScript) }
. $fitScript

$subjects = @{
    'lingua-portuguesa' = @{ File = 'lingua-portuguesa.json'; Label = 'LÍNGUA PORTUGUESA' }
    'matematica'        = @{ File = 'matematica.json';        Label = 'MATEMÁTICA' }
    'ciencias'          = @{ File = 'ciencias.json';          Label = 'CIÊNCIAS' }
    'historia'          = @{ File = 'historia.json';          Label = 'HISTÓRIA' }
    'geografia'         = @{ File = 'geografia.json';         Label = 'GEOGRAFIA' }
}

function Clean-Text([object]$value) {
    if ($null -eq $value) { return '' }
    return ([string]$value -replace '\s+', ' ').Trim()
}

function Release-Com([object]$value) {
    if ($null -eq $value) { return }
    try {
        if ([Runtime.InteropServices.Marshal]::IsComObject($value)) {
            [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($value)
        }
    } catch {}
}

function Get-Order($activity, [int]$fallback) {
    if ($null -ne $activity.sequenciaNumero -and [string]$activity.sequenciaNumero -ne '') { return [int]$activity.sequenciaNumero }
    if ($null -ne $activity.numero -and [string]$activity.numero -ne '') { return [int]$activity.numero }
    if ($null -ne $activity.sequencia -and ([string]$activity.sequencia -match '(\d+)$')) { return [int]$Matches[1] }
    return $fallback
}

function Add-Paragraph($doc, [string]$text, [double]$size, [bool]$bold, [int]$align, [double]$after = 2) {
    $range = $null; $font = $null; $paragraph = $null
    try {
        $range = $doc.Content
        $range.Collapse(0)
        $range.InsertAfter((Clean-Text $text))
        $font = $range.Font
        $font.Name = 'Arial'
        $font.Size = $size
        $font.Bold = $(if ($bold) { 1 } else { 0 })
        $paragraph = $range.ParagraphFormat
        $paragraph.Alignment = $align
        $paragraph.SpaceAfter = $after
        $range.InsertParagraphAfter()
    } finally {
        Release-Com $paragraph; Release-Com $font; Release-Com $range
    }
}

function Set-CellText($cell, [string]$text, [double]$size, [bool]$bold, [int]$align) {
    $range = $null; $font = $null; $paragraph = $null
    try {
        $range = $cell.Range
        $range.Text = $text
        $font = $range.Font
        $font.Name = 'Arial'
        $font.Size = $size
        $font.Bold = $(if ($bold) { 1 } else { 0 })
        $paragraph = $range.ParagraphFormat
        $paragraph.Alignment = $align
        $paragraph.SpaceAfter = 0
        $cell.VerticalAlignment = 1
    } finally {
        Release-Com $paragraph; Release-Com $font; Release-Com $range
    }
}

function Configure-Page($word, $doc) {
    $section = $null; $setup = $null; $borders = $null
    try {
        $section = $doc.Sections.Item(1)
        $setup = $section.PageSetup
        $setup.PaperSize = 7
        $setup.TopMargin = $word.CentimetersToPoints(1)
        $setup.BottomMargin = $word.CentimetersToPoints(1)
        $setup.LeftMargin = $word.CentimetersToPoints(1)
        $setup.RightMargin = $word.CentimetersToPoints(1)
        try {
            $borders = $section.Borders
            $borders.Enable = 1
            $borders.DistanceFromTop = 10
            $borders.DistanceFromBottom = 10
            $borders.DistanceFromLeft = 10
            $borders.DistanceFromRight = 10
        } catch {
            Write-Warning 'Nao foi possivel configurar a moldura da pagina automaticamente.'
        }
    } finally {
        Release-Com $borders; Release-Com $setup; Release-Com $section
    }
}

function Add-Header($doc) {
    $range = $null; $table = $null
    try {
        $range = $doc.Range(0, 0)
        $table = $doc.Tables.Add($range, 3, 3)
        $table.Borders.Enable = 1
        $c11 = $table.Cell(1,1); $c13 = $table.Cell(1,3); $c11.Merge($c13); Release-Com $c13; Release-Com $c11
        $c21 = $table.Cell(2,1); $c23 = $table.Cell(2,3); $c21.Merge($c23); Release-Com $c23; Release-Com $c21
        $cell = $table.Cell(1,1); Set-CellText $cell 'Escola: ____________________________________________________________' 10 $true 0; Release-Com $cell
        $cell = $table.Cell(2,1); Set-CellText $cell 'Nome: _____________________________________________________________' 10 $true 0; Release-Com $cell
        $cell = $table.Cell(3,1); Set-CellText $cell 'Turma: ______________' 10 $true 0; Release-Com $cell
        $cell = $table.Cell(3,2); Set-CellText $cell 'Data: ____/____/______' 10 $true 0; Release-Com $cell
        $cell = $table.Cell(3,3); Set-CellText $cell 'Prof.: ______________' 10 $true 0; Release-Com $cell
    } finally {
        Release-Com $table; Release-Com $range
    }
}

function Add-SupportAndIllustration($word, $doc, $activity) {
    $range = $null; $table = $null; $cell = $null
    try {
        $range = $doc.Content
        $range.Collapse(0)
        $table = $doc.Tables.Add($range, 1, 2)
        $table.Borders.Enable = 1
        $table.AllowAutoFit = $false
        $support = (Clean-Text $activity.textoApoio.titulo) + "`r`n`r`n" + (Clean-Text $activity.textoApoio.conteudo)
        $cell = $table.Cell(1,1); Set-CellText $cell $support 9 $false 0; Release-Com $cell; $cell = $null

        $cell = $table.Cell(1,2)
        $imagePath = Get-TeachEasyIllustrationFromManifest -Root $root -ActivityId (Clean-Text $activity.id)
        if ($null -ne $imagePath) {
            $inserted = Add-TeachEasyIllustrationToCell -Word $word -Cell $cell -SourcePath $imagePath -WidthCm 8.6 -HeightCm 5.2
            if (-not $inserted) { Set-CellText $cell ('ILUSTRAÇÃO' + "`r`n`r`n" + (Clean-Text $activity.ilustracao.descricao)) 9 $false 1 }
        } else {
            Set-CellText $cell ('ILUSTRAÇÃO' + "`r`n`r`n" + (Clean-Text $activity.ilustracao.descricao)) 9 $false 1
        }
    } finally {
        Release-Com $cell; Release-Com $table; Release-Com $range
    }
}

function New-ActivityDocument($word, $collection, $activity, [string]$label, [string]$target) {
    $doc = $null
    try {
        $doc = $word.Documents.Add()
        Configure-Page $word $doc
        Add-Header $doc
        Add-Paragraph $doc ('ATIVIDADE DE ' + $label) 14 $true 1 2
        Add-Paragraph $doc (Clean-Text $activity.titulo) 12 $true 1 3
        Add-SupportAndIllustration $word $doc $activity
        Add-Paragraph $doc (Clean-Text $activity.instrucaoGeral) 10 $true 0 2

        foreach ($q in $activity.questoes) {
            Add-Paragraph $doc (([string]$q.numero) + ' - ' + (Clean-Text $q.enunciado)) 9 $false 0 1
            if ($null -ne $q.alternativas -and $q.alternativas.Count -gt 0) {
                $letter = 97
                foreach ($alt in $q.alternativas) {
                    Add-Paragraph $doc ((([char]$letter).ToString()) + ') ' + (Clean-Text $alt)) 9 $false 0 0
                    $letter++
                }
            } else {
                Add-Paragraph $doc '________________________________________________________________________________________' 8 $false 0 0
                if ($q.espacoResposta -eq 'grande') { Add-Paragraph $doc '________________________________________________________________________________________' 8 $false 0 0 }
            }
        }

        $breakRange = $doc.Content
        $breakRange.Collapse(0)
        $breakRange.InsertBreak(7)
        Release-Com $breakRange

        Add-Paragraph $doc 'GABARITO' 14 $true 1 2
        Add-Paragraph $doc (Clean-Text $activity.titulo) 12 $true 1 3
        foreach ($answer in $activity.gabarito) {
            Add-Paragraph $doc (([string]$answer.numero) + '. ' + (Clean-Text $answer.resposta)) 9 $false 0 1
        }
        if ($activity.bncc.Count -gt 0) {
            $skill = $activity.bncc[0]
            Add-Paragraph $doc ('BNCC: ' + (Clean-Text $skill.codigo) + ' - ' + (Clean-Text $skill.habilidadeOficial)) 8 $true 0 1
        }

        $absolute = [System.IO.Path]::GetFullPath($target)
        $format = 16
        $doc.SaveAs2([ref]$absolute, [ref]$format)
        $doc.Close(0)
        Release-Com $doc; $doc = $null
    } finally {
        if ($null -ne $doc) { try { $doc.Close(0) } catch {}; Release-Com $doc }
        [GC]::Collect(); [GC]::WaitForPendingFinalizers()
    }
}

$series = if ($Serie -gt 0) { @($Serie) } else { @(1,2,3) }
$terms = if ($Term -gt 0) { @($Term) } else { @(1,2,3,4) }
$subjectKeys = if ([string]::IsNullOrWhiteSpace($Subject)) { @('lingua-portuguesa','matematica','ciencias','historia','geografia') } else { @($Subject) }
$word = $null
$generated = 0; $existing = 0

try {
    Write-Host '[1/4] Iniciando Microsoft Word...'
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $word.Options.SaveNormalPrompt = $false
    $word.Options.ConfirmConversions = $false
    $word.AutomationSecurity = 3
    Write-Host '[2/4] Word iniciado em modo silencioso.'

    foreach ($serie in $series) {
        if ($serie -lt 1 -or $serie -gt 3) { throw 'Serie deve ser 1, 2 ou 3.' }
        foreach ($term in $terms) {
            foreach ($subjectKey in $subjectKeys) {
                $config = $subjects[$subjectKey]
                $json = Join-Path $root ('data\atividades\ensino-medio\' + $serie + '-serie\' + $term + '-bimestre\' + $config.File)
                if (-not (Test-Path -LiteralPath $json)) { throw ('Arquivo canonico ausente: ' + $json) }
                Write-Host ('[3/4] Lendo ' + $json)
                $collection = Get-Content -LiteralPath $json -Raw -Encoding UTF8 | ConvertFrom-Json
                if ($collection.schemaVersion -ne '2.0') { throw ('Colecao fora do V2: ' + $json) }
                if ($collection.atividades.Count -ne 50) { throw ('Colecao deve conter 50 atividades: ' + $json) }
                $destination = Join-Path $root ('exports\word\ensino-medio\' + $serie + '-serie\' + $subjectKey + '\' + $term + '-bimestre')
                New-Item -ItemType Directory -Force -Path $destination | Out-Null

                $fallback = 0
                foreach ($activity in $collection.atividades) {
                    $fallback++
                    $activityOrder = Get-Order $activity $fallback
                    if ($Order -gt 0 -and $activityOrder -ne $Order) { continue }
                    if ($activity.questoes.Count -ne 8 -or $activity.gabarito.Count -ne 8) { throw ('Atividade invalida: ' + $activity.id) }
                    $normalized = (Clean-Text $activity.titulo).Normalize([Text.NormalizationForm]::FormD)
                    $safeTitle = ($normalized -replace '\p{Mn}', '' -replace '[^a-zA-Z0-9]+', '-').Trim('-').ToLower()
                    $code = if ($activity.bncc.Count -gt 0) { (Clean-Text $activity.bncc[0].codigo).ToLower() } else { 'sem-bncc' }
                    $filename = ('{0:D2}-{1}-{2}.docx' -f $activityOrder, $code, $safeTitle)
                    $target = Join-Path $destination $filename
                    if ((Test-Path -LiteralPath $target) -and -not $Force) { $existing++; Write-Host ('[JA EXISTE] ' + $target); continue }
                    if ((Test-Path -LiteralPath $target) -and $Force) { Remove-Item -LiteralPath $target -Force }
                    Write-Host ('[4/4] Gerando ' + $serie + 'a serie / ' + $term + 'o bimestre / ' + $config.Label + ' / ' + $activityOrder)
                    New-ActivityDocument $word $collection $activity $config.Label $target
                    if (-not (Test-Path -LiteralPath $target)) { throw ('Arquivo Word nao encontrado apos salvar: ' + $target) }
                    $generated++
                }
            }
        }
    }
} finally {
    if ($null -ne $word) { try { $word.Quit(0) } catch {}; Release-Com $word }
    [GC]::Collect(); [GC]::WaitForPendingFinalizers()
}

Write-Host ''
Write-Host ('Ensino Medio Word concluido. Gerados: ' + $generated + '. Ja existentes: ' + $existing + '.')
