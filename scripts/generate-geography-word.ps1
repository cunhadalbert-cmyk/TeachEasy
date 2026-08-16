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

function Release-ComObject([object]$value) {
    if ($null -eq $value) { return }
    try {
        if ([Runtime.InteropServices.Marshal]::IsComObject($value)) {
            [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($value)
        }
    } catch {}
}

function Convert-WordColor([string]$hex) {
    $value = (Clean-Text $hex).TrimStart('#')
    if ($value.Length -ne 6) { return 0 }
    $r = [Convert]::ToInt32($value.Substring(0, 2), 16)
    $g = [Convert]::ToInt32($value.Substring(2, 2), 16)
    $b = [Convert]::ToInt32($value.Substring(4, 2), 16)
    return ($r + ($g * 256) + ($b * 65536))
}

function Add-Paragraph($doc, [string]$text, [double]$size, [bool]$bold, [int]$align, [string]$color) {
    $range = $null
    try {
        $range = $doc.Content
        $range.Collapse(0)
        $range.InsertAfter((Clean-Text $text))
        $range.Font.Name = 'Arial'
        $range.Font.Size = $size
        if ($bold) { $range.Font.Bold = 1 } else { $range.Font.Bold = 0 }
        $range.Font.Color = Convert-WordColor $color
        $range.ParagraphFormat.Alignment = $align
        $range.InsertParagraphAfter()
    } finally {
        Release-ComObject $range
    }
}

function Set-CellText($cell, [string]$text, [double]$size, [bool]$bold, [int]$align) {
    $cellRange = $null
    try {
        $cellRange = $cell.Range
        $cellRange.Text = Clean-Text $text
        $cellRange.Font.Name = 'Arial'
        $cellRange.Font.Size = $size
        if ($bold) { $cellRange.Font.Bold = 1 } else { $cellRange.Font.Bold = 0 }
        $cellRange.ParagraphFormat.Alignment = $align
        $cell.VerticalAlignment = 1
    } finally {
        Release-ComObject $cellRange
        Release-ComObject $cell
    }
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

$word = $null
$generated = 0
$skipped = 0
$existing = 0
$seenIds = @{}

Write-Host '[1/4] Iniciando Microsoft Word...'

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $word.ScreenUpdating = $false
    $word.Options.SaveNormalPrompt = $false
    $word.Options.BackgroundSave = $false
    Write-Host '[2/4] Word iniciado em modo silencioso.'

    foreach ($term in 1..4) {
        $termFolder = Join-Path $dataRoot ($term.ToString() + '-bimestre')
        if (-not (Test-Path $termFolder)) { continue }

        $destination = Join-Path $outputRoot ($term.ToString() + '-bimestre')
        New-Item -ItemType Directory -Force -Path $destination | Out-Null

        $jsonPaths = @()
        $mainV2Path = Join-Path $termFolder 'geografia-v2.json'
        if (Test-Path $mainV2Path) { $jsonPaths += $mainV2Path }

        $lotFiles = Get-ChildItem -Path $termFolder -File -Filter 'geografia-v2-lote-*.json' -ErrorAction SilentlyContinue | Sort-Object Name
        foreach ($lotFile in $lotFiles) { $jsonPaths += $lotFile.FullName }

        if ($jsonPaths.Count -eq 0) {
            $legacyPath = Join-Path $termFolder 'geografia.json'
            if (Test-Path $legacyPath) { $jsonPaths += $legacyPath } else { continue }
        }

        foreach ($jsonPath in $jsonPaths) {
            Write-Host ('[3/4] Lendo ' + $jsonPath)
            $collection = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

            foreach ($activity in $collection.atividades) {
                if ($activity.padraoPedagogico -ne 'teacheasy-v2') {
                    $skipped++
                    continue
                }

                $activityId = Clean-Text $activity.id
                if (-not [string]::IsNullOrWhiteSpace($activityId)) {
                    if ($seenIds.ContainsKey($activityId)) {
                        Write-Host ('[IGNORADA DUPLICADA] ' + $activityId)
                        continue
                    }
                    $seenIds[$activityId] = $true
                }

                if ($activity.questoes.Count -ne 8 -or $activity.gabarito.Count -ne 8) {
                    throw ('Atividade ' + $activity.id + ' deve possuir exatamente 8 questoes e 8 respostas.')
                }

                $skill = $activity.bncc[0]
                $order = Get-Order $activity ($generated + $existing + 1)
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
                $pageRange = $null
                $header = $null
                $contentRange = $null
                $content = $null
                $imageCell = $null
                $shape = $null
                $endRange = $null

                try {
                    $doc = $word.Documents.Add()
                    $section = $doc.Sections.Item(1)
                    $section.PageSetup.PaperSize = 7
                    $section.PageSetup.TopMargin = $word.CentimetersToPoints(0.06)
                    $section.PageSetup.BottomMargin = 0
                    $section.PageSetup.LeftMargin = $word.CentimetersToPoints(0.69)
                    $section.PageSetup.RightMargin = $word.CentimetersToPoints(0.69)

                    $pageRange = $doc.Range(0, 0)
                    $header = $doc.Tables.Add($pageRange, 3, 3)
                    $header.Borders.Enable = 1
                    $header.Rows.Item(1).Height = $word.CentimetersToPoints(0.737)
                    $header.Rows.Item(2).Height = $word.CentimetersToPoints(0.737)
                    $header.Rows.Item(3).Height = $word.CentimetersToPoints(0.767)

                    $cell11 = $header.Cell(1, 1)
                    $cell13 = $header.Cell(1, 3)
                    $cell11.Merge($cell13)
                    Release-ComObject $cell13
                    Release-ComObject $cell11

                    $cell21 = $header.Cell(2, 1)
                    $cell23 = $header.Cell(2, 3)
                    $cell21.Merge($cell23)
                    Release-ComObject $cell23
                    Release-ComObject $cell21

                    Set-CellText ($header.Cell(1, 1)) 'Escola: ____________________________________________________________' 11 $true 0
                    Set-CellText ($header.Cell(2, 1)) 'Nome: _____________________________________________________________' 11 $true 0
                    Set-CellText ($header.Cell(3, 1)) 'Turma: ______________' 11 $true 0
                    Set-CellText ($header.Cell(3, 2)) 'Data: ____/____/______' 11 $true 0
                    Set-CellText ($header.Cell(3, 3)) 'Prof.:__________' 11 $true 0

                    Add-Paragraph $doc (U 'ATIVIDADE DE GEOGRAFIA') 15 $true 1 '1F497D'
                    Add-Paragraph $doc (Clean-Text $activity.titulo) 13 $true 1 '141414'

                    $contentRange = $doc.Content
                    $contentRange.Collapse(0)
                    $content = $doc.Tables.Add($contentRange, 1, 2)
                    $content.Borders.Enable = 1
                    $content.Rows.Item(1).Height = $word.CentimetersToPoints(9.627)
                    $content.Columns.Item(1).Width = $word.CentimetersToPoints(8.763)
                    $content.Columns.Item(2).Width = $word.CentimetersToPoints(9.779)

                    $supportText = (Clean-Text $activity.textoApoio.titulo) + "`r`n`r`n" + (Clean-Text $activity.textoApoio.conteudo)
                    Set-CellText ($content.Cell(1, 1)) $supportText 11 $false 0

                    $imageInserted = $false
                    $imagePath = Clean-Text $activity.ilustracao.arquivo
                    if (-not [string]::IsNullOrWhiteSpace($imagePath)) {
                        if ([System.IO.Path]::IsPathRooted($imagePath)) { $resolvedImage = $imagePath } else { $resolvedImage = Join-Path $root $imagePath }
                        if (Test-Path $resolvedImage) {
                            $imageCell = $content.Cell(1, 2)
                            $imageCell.Range.Text = ''
                            $shape = $imageCell.Range.InlineShapes.AddPicture($resolvedImage, $false, $true)
                            $shape.LockAspectRatio = -1
                            if ($shape.Width -gt $word.CentimetersToPoints(8.8)) { $shape.Width = $word.CentimetersToPoints(8.8) }
                            if ($shape.Height -gt $word.CentimetersToPoints(8.8)) { $shape.Height = $word.CentimetersToPoints(8.8) }
                            $imageCell.Range.ParagraphFormat.Alignment = 1
                            $imageInserted = $true
                        }
                    }

                    if (-not $imageInserted) {
                        $illustrationText = (U 'ILUSTRA\u00C7\u00C3O') + "`r`n`r`n" + (Clean-Text $activity.ilustracao.descricao)
                        Set-CellText ($content.Cell(1, 2)) $illustrationText 10 $false 1
                    }

                    $instruction = Clean-Text $activity.instrucaoGeral
                    if ([string]::IsNullOrWhiteSpace($instruction)) { $instruction = U 'Responda \u00E0s quest\u00F5es de acordo com o texto.' }
                    Add-Paragraph $doc $instruction 13 $true 1 '1F497D'

                    foreach ($q in $activity.questoes) {
                        Add-Paragraph $doc (([string]$q.numero) + ' - ' + (Clean-Text $q.enunciado)) 11 $false 0 '141414'
                        if ($null -ne $q.alternativas -and $q.alternativas.Count -gt 0) {
                            $letter = 97
                            foreach ($alt in $q.alternativas) {
                                Add-Paragraph $doc ((([char]$letter).ToString()) + ') ' + (Clean-Text $alt)) 11 $false 0 '141414'
                                $letter++
                            }
                        } else {
                            Add-Paragraph $doc '________________________________________________________________________________________' 9 $false 0 '666666'
                            if ($q.espacoResposta -eq 'grande') {
                                Add-Paragraph $doc '________________________________________________________________________________________' 9 $false 0 '666666'
                            }
                        }
                    }

                    $endRange = $doc.Content
                    $endRange.Collapse(0)
                    $endRange.InsertBreak(7)
                    Release-ComObject $endRange
                    $endRange = $null

                    Add-Paragraph $doc 'GABARITO' 15 $true 1 '1F497D'
                    Add-Paragraph $doc (Clean-Text $activity.titulo) 13 $true 1 '141414'
                    $reviewText = (U 'Revis\u00E3o') + ' - ' + (Clean-Text $collection.etapa) + ' - ' + (Clean-Text $collection.ano) + ' - ' + ([string]$collection.bimestre) + (U '\u00BA bimestre') + ' - Geografia'
                    Add-Paragraph $doc $reviewText 9 $false 1 '666666'

                    foreach ($answer in $activity.gabarito) {
                        Add-Paragraph $doc (([string]$answer.numero) + '. ' + (Clean-Text $answer.resposta)) 11 $false 0 '141414'
                    }

                    Add-Paragraph $doc ('BNCC: ' + (Clean-Text $skill.codigo) + ' - ' + (Clean-Text $skill.habilidadeOficial)) 10 $true 0 '141414'
                    Add-Paragraph $doc ('Verbo central: ' + (Clean-Text $skill.verbo)) 10 $false 0 '141414'

                    Write-Host ('Salvando em: ' + $target)
                    $doc.SaveAs2($target, 16)
                    $doc.Saved = $true
                    $doc.Close(0)
                    $generated++
                    Write-Host ('[OK] ' + [string]$term + ' bimestre -> ' + $filename)
                }
                finally {
                    Release-ComObject $shape
                    Release-ComObject $imageCell
                    Release-ComObject $content
                    Release-ComObject $contentRange
                    Release-ComObject $header
                    Release-ComObject $pageRange
                    Release-ComObject $section
                    if ($null -ne $doc) {
                        try { if (-not $doc.Saved) { $doc.Close(0) } } catch {}
                        Release-ComObject $doc
                    }
                    [GC]::Collect()
                    [GC]::WaitForPendingFinalizers()
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
        Release-ComObject $word
    }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}

Write-Host ''
Write-Host ('Geografia Word concluido. Gerados: ' + [string]$generated + '. Ja existentes: ' + [string]$existing + '. Legados ignorados: ' + [string]$skipped + '.')
if ($generated -eq 0 -and $existing -eq 0) {
    Write-Host 'Nenhuma atividade V2 foi encontrada ainda. Isso e esperado ate comecarmos a reconstrucao de Geografia.'
}
