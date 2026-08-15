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

function Add-Paragraph($doc, [string]$text, [double]$size, [bool]$bold, [int]$align, [string]$color) {
    $range = $doc.Content
    $range.Collapse(0)
    $range.InsertAfter((Clean-Text $text))
    $range.Font.Name = 'Arial'
    $range.Font.Size = $size
    if ($bold) { $range.Font.Bold = 1 } else { $range.Font.Bold = 0 }
    $range.Font.Color = [System.Drawing.ColorTranslator]::FromHtml('#' + $color).ToArgb()
    $range.ParagraphFormat.Alignment = $align
    $range.InsertParagraphAfter()
}

function Set-CellText($cell, [string]$text, [double]$size, [bool]$bold, [int]$align) {
    $cell.Range.Text = Clean-Text $text
    $cell.Range.Font.Name = 'Arial'
    $cell.Range.Font.Size = $size
    if ($bold) { $cell.Range.Font.Bold = 1 } else { $cell.Range.Font.Bold = 0 }
    $cell.Range.ParagraphFormat.Alignment = $align
    $cell.VerticalAlignment = 1
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

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0

    foreach ($term in 1..4) {
        $termFolder = Join-Path $dataRoot ($term.ToString() + '-bimestre')
        $v2Path = Join-Path $termFolder 'geografia-v2.json'
        $legacyPath = Join-Path $termFolder 'geografia.json'
        if (Test-Path $v2Path) {
            $jsonPath = $v2Path
        } elseif (Test-Path $legacyPath) {
            $jsonPath = $legacyPath
        } else {
            continue
        }

        $collection = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $destination = Join-Path $outputRoot ($term.ToString() + '-bimestre')
        New-Item -ItemType Directory -Force -Path $destination | Out-Null

        foreach ($activity in $collection.atividades) {
            if ($activity.padraoPedagogico -ne 'teacheasy-v2') {
                $skipped = $skipped + 1
                continue
            }

            if ($activity.questoes.Count -ne 6 -or $activity.gabarito.Count -ne 6) {
                throw ('Atividade ' + $activity.id + ' deve possuir exatamente 6 questoes e 6 respostas.')
            }

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
            $cell21 = $header.Cell(2, 1)
            $cell23 = $header.Cell(2, 3)
            $cell21.Merge($cell23)

            Set-CellText ($header.Cell(1, 1)) 'Escola: ____________________________________________________________' 11 $true 0
            Set-CellText ($header.Cell(2, 1)) 'Nome: _____________________________________________________________' 11 $true 0
            Set-CellText ($header.Cell(3, 1)) 'Turma: ______________' 11 $true 0
            Set-CellText ($header.Cell(3, 2)) 'Data: ____/____/______' 11 $true 0
            Set-CellText ($header.Cell(3, 3)) 'Prof.:__________' 11 $true 0

            Add-Paragraph $doc (U 'ATIVIDADE DE GEOGRAFIA') 15 $true 1 '1F497D'
            Add-Paragraph $doc (Clean-Text $activity.titulo) 13 $true 1 '141414'

            $range = $doc.Content
            $range.Collapse(0)
            $content = $doc.Tables.Add($range, 1, 2)
            $content.Borders.Enable = 1
            $content.Rows.Item(1).Height = $word.CentimetersToPoints(9.627)
            $content.Columns.Item(1).Width = $word.CentimetersToPoints(8.763)
            $content.Columns.Item(2).Width = $word.CentimetersToPoints(9.779)

            $supportText = (Clean-Text $activity.textoApoio.titulo) + "`r`n`r`n" + (Clean-Text $activity.textoApoio.conteudo)
            Set-CellText ($content.Cell(1, 1)) $supportText 11 $false 0

            $imageInserted = $false
            $imagePath = Clean-Text $activity.ilustracao.arquivo
            if (-not [string]::IsNullOrWhiteSpace($imagePath)) {
                if ([System.IO.Path]::IsPathRooted($imagePath)) {
                    $resolvedImage = $imagePath
                } else {
                    $resolvedImage = Join-Path $root $imagePath
                }
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
                $illustrationLabel = U 'ILUSTRA\u00C7\u00C3O'
                $illustrationText = $illustrationLabel + "`r`n`r`n" + (Clean-Text $activity.ilustracao.descricao)
                Set-CellText ($content.Cell(1, 2)) $illustrationText 10 $false 1
            }

            $instruction = Clean-Text $activity.instrucaoGeral
            if ([string]::IsNullOrWhiteSpace($instruction)) {
                $instruction = U 'Responda \u00E0s quest\u00F5es de acordo com o texto.'
            }
            Add-Paragraph $doc $instruction 13 $true 1 '1F497D'

            foreach ($q in $activity.questoes) {
                $questionText = ([string]$q.numero) + ' - ' + (Clean-Text $q.enunciado)
                Add-Paragraph $doc $questionText 11 $false 0 '141414'

                if ($null -ne $q.alternativas -and $q.alternativas.Count -gt 0) {
                    $letter = 97
                    foreach ($alt in $q.alternativas) {
                        $altText = ([char]$letter).ToString() + ') ' + (Clean-Text $alt)
                        Add-Paragraph $doc $altText 11 $false 0 '141414'
                        $letter = $letter + 1
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
            Add-Paragraph $doc 'GABARITO' 15 $true 1 '1F497D'
            Add-Paragraph $doc (Clean-Text $activity.titulo) 13 $true 1 '141414'

            $reviewText = (U 'Revis\u00E3o') + ' - ' + (Clean-Text $collection.etapa) + ' - ' + (Clean-Text $collection.ano) + ' - ' + ([string]$collection.bimestre) + (U '\u00BA bimestre') + ' - Geografia'
            Add-Paragraph $doc $reviewText 9 $false 1 '666666'

            foreach ($answer in $activity.gabarito) {
                $answerText = ([string]$answer.numero) + '. ' + (Clean-Text $answer.resposta)
                Add-Paragraph $doc $answerText 11 $false 0 '141414'
            }

            $skill = $activity.bncc[0]
            $bnccText = 'BNCC: ' + (Clean-Text $skill.codigo) + ' - ' + (Clean-Text $skill.habilidadeOficial)
            Add-Paragraph $doc $bnccText 10 $true 0 '141414'
            Add-Paragraph $doc ('Verbo central: ' + (Clean-Text $skill.verbo)) 10 $false 0 '141414'

            $order = Get-Order $activity ($generated + 1)
            $normalized = (Clean-Text $activity.titulo).Normalize([Text.NormalizationForm]::FormD)
            $safeTitle = $normalized -replace '\p{Mn}', '' -replace '[^a-zA-Z0-9]+', '-'
            $safeTitle = $safeTitle.Trim('-').ToLower()
            $code = (Clean-Text $skill.codigo).ToLower()
            $filename = ('{0:D2}-{1}-{2}.docx' -f $order, $code, $safeTitle)
            $target = Join-Path $destination $filename

            $doc.SaveAs2($target, 16)
            $doc.Close()
            $generated = $generated + 1
            Write-Host ('[OK] ' + [string]$term + ' bimestre -> ' + $filename)
        }
    }
}
finally {
    if ($null -ne $word) { $word.Quit() }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}

Write-Host ''
Write-Host ('Geografia Word concluido. Gerados: ' + [string]$generated + '. Legados ignorados: ' + [string]$skipped + '.')
if ($generated -eq 0) {
    Write-Host 'Nenhuma atividade V2 foi encontrada ainda. Isso e esperado ate comecarmos a reconstrucao de Geografia.'
}
