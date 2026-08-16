param(
    [int]$OnlyTerm = 0,
    [int]$OnlyOrder = 0
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$dataRoot = Join-Path $root 'data\atividades\fundamental-anos-iniciais\4-ano'
$outputRoot = Join-Path $root 'exports\word\4-ano\geografia'

function U([string]$text) {
    return [System.Text.RegularExpressions.Regex]::Unescape($text)
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
    if ($null -ne $activity.sequenciaNumero -and [string]$activity.sequenciaNumero -ne '') {
        return [int]$activity.sequenciaNumero
    }
    if ($null -ne $activity.numero -and [string]$activity.numero -ne '') {
        return [int]$activity.numero
    }
    return $fallback
}

function Add-Paragraph($doc, [string]$text, [double]$size, [bool]$bold, [int]$align) {
    $range = $null
    $font = $null
    $paragraph = $null
    try {
        $range = $doc.Content
        $range.Collapse(0)
        $range.InsertAfter((Clean-Text $text))
        $font = $range.Font
        $font.Name = 'Arial'
        $font.Size = $size
        if ($bold) { $font.Bold = 1 } else { $font.Bold = 0 }
        $paragraph = $range.ParagraphFormat
        $paragraph.Alignment = $align
        $range.InsertParagraphAfter()
    }
    finally {
        Release-Com $paragraph
        Release-Com $font
        Release-Com $range
    }
}

function Set-CellText($cell, [string]$text, [double]$size, [bool]$bold, [int]$align) {
    $range = $null
    $font = $null
    $paragraph = $null
    try {
        $range = $cell.Range
        $range.Text = Clean-Text $text
        $font = $range.Font
        $font.Name = 'Arial'
        $font.Size = $size
        if ($bold) { $font.Bold = 1 } else { $font.Bold = 0 }
        $paragraph = $range.ParagraphFormat
        $paragraph.Alignment = $align
        $cell.VerticalAlignment = 1
    }
    finally {
        Release-Com $paragraph
        Release-Com $font
        Release-Com $range
    }
}

$word = $null
$generated = 0
$existing = 0
$skipped = 0
$seenIds = @{}

Write-Host '[1/4] Iniciando Microsoft Word...'

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false

    Write-Host '[2/4] Word iniciado em modo silencioso.'

    $terms = if ($OnlyTerm -gt 0) { @($OnlyTerm) } else { @(1,2,3,4) }

    foreach ($term in $terms) {
        $termFolder = Join-Path $dataRoot ($term.ToString() + '-bimestre')
        if (-not (Test-Path -LiteralPath $termFolder)) { continue }

        $destination = Join-Path $outputRoot ($term.ToString() + '-bimestre')
        New-Item -ItemType Directory -Force -Path $destination | Out-Null

        $jsonPaths = @()
        $mainV2 = Join-Path $termFolder 'geografia-v2.json'
        if (Test-Path -LiteralPath $mainV2) { $jsonPaths += $mainV2 }

        $lotFiles = Get-ChildItem -Path $termFolder -File -Filter 'geografia-v2-lote-*.json' -ErrorAction SilentlyContinue | Sort-Object Name
        foreach ($lotFile in $lotFiles) { $jsonPaths += $lotFile.FullName }

        if ($jsonPaths.Count -eq 0) {
            $legacy = Join-Path $termFolder 'geografia.json'
            if (Test-Path -LiteralPath $legacy) { $jsonPaths += $legacy } else { continue }
        }

        foreach ($jsonPath in $jsonPaths) {
            Write-Host ('[3/4] Lendo ' + $jsonPath)
            $collection = Get-Content -LiteralPath $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

            foreach ($activity in $collection.atividades) {
                if ($activity.padraoPedagogico -ne 'teacheasy-v2') {
                    $skipped++
                    continue
                }

                $activityId = Clean-Text $activity.id
                if (-not [string]::IsNullOrWhiteSpace($activityId)) {
                    if ($seenIds.ContainsKey($activityId)) { continue }
                    $seenIds[$activityId] = $true
                }

                $order = Get-Order $activity ($generated + $existing + 1)
                if ($OnlyOrder -gt 0 -and $order -ne $OnlyOrder) { continue }

                if ($activity.questoes.Count -ne 8 -or $activity.gabarito.Count -ne 8) {
                    throw ('Atividade ' + $activity.id + ' deve possuir exatamente 8 questoes e 8 respostas.')
                }

                $skill = $activity.bncc[0]
                $normalized = (Clean-Text $activity.titulo).Normalize([Text.NormalizationForm]::FormD)
                $safeTitle = ($normalized -replace '\p{Mn}', '' -replace '[^a-zA-Z0-9]+', '-').Trim('-').ToLower()
                $code = (Clean-Text $skill.codigo).ToLower()
                $filename = ('{0:D2}-{1}-{2}.docx' -f $order, $code, $safeTitle)
                $target = Join-Path $destination $filename

                if (Test-Path -LiteralPath $target) {
                    $existing++
                    Write-Host ('[JA EXISTE] ' + [string]$term + ' bimestre -> ' + $filename)
                    continue
                }

                Write-Host ('[4/4] Gerando: ' + (Clean-Text $activity.titulo))

                $doc = $null
                $section = $null
                $setup = $null
                $range = $null
                $header = $null
                $contentTable = $null

                try {
                    $doc = $word.Documents.Add()

                    # Replica o fluxo simples que foi validado manualmente no Windows:
                    # Documents.Add() + SaveAs2() direto no caminho final.
                    Write-Host ('[PRE-SAVE DIRECT] ' + $filename)
                    $doc.SaveAs2($target, 16)
                    Write-Host ('[DIRECT SAVE OK] ' + $filename)

                    $section = $doc.Sections.Item(1)
                    $setup = $section.PageSetup
                    $setup.PaperSize = 7
                    $setup.TopMargin = $word.CentimetersToPoints(1)
                    $setup.BottomMargin = $word.CentimetersToPoints(1)
                    $setup.LeftMargin = $word.CentimetersToPoints(1)
                    $setup.RightMargin = $word.CentimetersToPoints(1)

                    $range = $doc.Range(0, 0)
                    $header = $doc.Tables.Add($range, 3, 3)
                    $header.Borders.Enable = 1

                    $c11 = $header.Cell(1,1); $c13 = $header.Cell(1,3); $c11.Merge($c13)
                    Release-Com $c13; Release-Com $c11
                    $c21 = $header.Cell(2,1); $c23 = $header.Cell(2,3); $c21.Merge($c23)
                    Release-Com $c23; Release-Com $c21

                    $cell = $header.Cell(1,1); Set-CellText $cell 'Escola: ____________________________________________________________' 11 $true 0; Release-Com $cell
                    $cell = $header.Cell(2,1); Set-CellText $cell 'Nome: _____________________________________________________________' 11 $true 0; Release-Com $cell
                    $cell = $header.Cell(3,1); Set-CellText $cell 'Turma: ______________' 11 $true 0; Release-Com $cell
                    $cell = $header.Cell(3,2); Set-CellText $cell 'Data: ____/____/______' 11 $true 0; Release-Com $cell
                    $cell = $header.Cell(3,3); Set-CellText $cell 'Prof.:__________' 11 $true 0; Release-Com $cell

                    Add-Paragraph $doc 'ATIVIDADE DE GEOGRAFIA' 15 $true 1
                    Add-Paragraph $doc (Clean-Text $activity.titulo) 13 $true 1

                    Release-Com $range
                    $range = $doc.Content
                    $range.Collapse(0)
                    $contentTable = $doc.Tables.Add($range, 1, 2)
                    $contentTable.Borders.Enable = 1

                    $supportText = (Clean-Text $activity.textoApoio.titulo) + "`r`n`r`n" + (Clean-Text $activity.textoApoio.conteudo)
                    $cell = $contentTable.Cell(1,1); Set-CellText $cell $supportText 11 $false 0; Release-Com $cell

                    $illustrationText = (U 'ILUSTRA\u00C7\u00C3O') + "`r`n`r`n" + (Clean-Text $activity.ilustracao.descricao)
                    $cell = $contentTable.Cell(1,2); Set-CellText $cell $illustrationText 10 $false 1; Release-Com $cell

                    $instruction = Clean-Text $activity.instrucaoGeral
                    if ([string]::IsNullOrWhiteSpace($instruction)) { $instruction = U 'Responda \u00E0s quest\u00F5es de acordo com o texto.' }
                    Add-Paragraph $doc $instruction 12 $true 1

                    foreach ($q in $activity.questoes) {
                        Add-Paragraph $doc (([string]$q.numero) + ' - ' + (Clean-Text $q.enunciado)) 11 $false 0
                        if ($null -ne $q.alternativas -and $q.alternativas.Count -gt 0) {
                            $letter = 97
                            foreach ($alt in $q.alternativas) {
                                Add-Paragraph $doc ((([char]$letter).ToString()) + ') ' + (Clean-Text $alt)) 11 $false 0
                                $letter++
                            }
                        } else {
                            Add-Paragraph $doc '________________________________________________________________________________________' 9 $false 0
                            if ($q.espacoResposta -eq 'grande') {
                                Add-Paragraph $doc '________________________________________________________________________________________' 9 $false 0
                            }
                        }
                    }

                    $breakRange = $doc.Content
                    $breakRange.Collapse(0)
                    $breakRange.InsertBreak(7)
                    Release-Com $breakRange

                    Add-Paragraph $doc 'GABARITO' 15 $true 1
                    Add-Paragraph $doc (Clean-Text $activity.titulo) 13 $true 1
                    foreach ($answer in $activity.gabarito) {
                        Add-Paragraph $doc (([string]$answer.numero) + '. ' + (Clean-Text $answer.resposta)) 11 $false 0
                    }
                    Add-Paragraph $doc ('BNCC: ' + (Clean-Text $skill.codigo) + ' - ' + (Clean-Text $skill.habilidadeOficial)) 10 $true 0

                    Release-Com $contentTable; $contentTable = $null
                    Release-Com $header; $header = $null
                    Release-Com $range; $range = $null
                    Release-Com $setup; $setup = $null
                    Release-Com $section; $section = $null

                    Write-Host ('[PRE-SAVE] ' + $filename)
                    $doc.Save()
                    Write-Host ('[SAVE OK] ' + $filename)
                    $doc.Close(0)
                    Write-Host ('[FECHADO] ' + $filename)
                    Release-Com $doc
                    $doc = $null

                    if (-not (Test-Path -LiteralPath $target)) {
                        throw ('Arquivo final nao encontrado apos salvar: ' + $target)
                    }
                    $generated++
                    Write-Host ('[OK] ' + [string]$term + ' bimestre -> ' + $filename)
                }
                finally {
                    Release-Com $contentTable
                    Release-Com $header
                    Release-Com $range
                    Release-Com $setup
                    Release-Com $section
                    if ($null -ne $doc) {
                        try { $doc.Close(0) } catch {}
                        Release-Com $doc
                    }
                    [GC]::Collect()
                    [GC]::WaitForPendingFinalizers()
                }
            }
        }
    }
}
finally {
    if ($null -ne $word) {
        try { $word.Quit(0) } catch {}
        Release-Com $word
    }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}

Write-Host ''
Write-Host ('Geografia Word concluido. Gerados: ' + $generated + '. Ja existentes: ' + $existing + '. Legados ignorados: ' + $skipped + '.')
