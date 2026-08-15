$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$dataRoot = Join-Path $root 'data\atividades\fundamental-anos-iniciais\4-ano'
$outputRoot = Join-Path $root 'exports\word\4-ano\geografia'

function Clean-Text([object]$value) {
    if ($null -eq $value) { return '' }
    return ([string]$value -replace '\s+', ' ').Trim()
}

function Add-Paragraph($doc, [string]$text, [double]$size = 11, [bool]$bold = $false, [int]$align = 0, [string]$color = '000000') {
    $range = $doc.Content
    $range.Collapse(0)
    $range.InsertAfter((Clean-Text $text))
    $range.Font.Name = 'Arial'
    $range.Font.Size = $size
    $range.Font.Bold = [int]$bold
    $range.ParagraphFormat.Alignment = $align
    $range.InsertParagraphAfter()
}

function Set-CellText($cell, [string]$text, [double]$size = 11, [bool]$bold = $false, [int]$align = 0) {
    $cell.Range.Text = Clean-Text $text
    $cell.Range.Font.Name = 'Arial'
    $cell.Range.Font.Size = $size
    $cell.Range.Font.Bold = [int]$bold
    $cell.Range.ParagraphFormat.Alignment = $align
    $cell.VerticalAlignment = 1
}

$word = $null
$generated = 0
$skipped = 0

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0

    foreach ($term in 1..4) {
        $jsonPath = Join-Path $dataRoot "$term-bimestre\geografia.json"
        if (-not (Test-Path $jsonPath)) { continue }

        $collection = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $destination = Join-Path $outputRoot "$term-bimestre"
        New-Item -ItemType Directory -Force -Path $destination | Out-Null

        foreach ($activity in $collection.atividades) {
            if ($activity.padraoPedagogico -ne 'teacheasy-v2') {
                $skipped++
                continue
            }

            if ($activity.questoes.Count -ne 6 -or $activity.gabarito.Count -ne 6) {
                throw "Atividade $($activity.id) não possui exatamente 6 questões e 6 respostas."
            }

            $doc = $word.Documents.Add()
            $section = $doc.Sections.Item(1)
            $section.PageSetup.PaperSize = 7
            $section.PageSetup.TopMargin = $word.CentimetersToPoints(0.06)
            $section.PageSetup.BottomMargin = 0
            $section.PageSetup.LeftMargin = $word.CentimetersToPoints(0.69)
            $section.PageSetup.RightMargin = $word.CentimetersToPoints(0.69)

            $pageRange = $doc.Range(0,0)
            $header = $doc.Tables.Add($pageRange, 3, 3)
            $header.Borders.Enable = 1
            $header.Rows.Item(1).Height = $word.CentimetersToPoints(0.737)
            $header.Rows.Item(2).Height = $word.CentimetersToPoints(0.737)
            $header.Rows.Item(3).Height = $word.CentimetersToPoints(0.767)
            $header.Cell(1,1).Merge($header.Cell(1,3))
            $header.Cell(2,1).Merge($header.Cell(2,3))
            Set-CellText $header.Cell(1,1) 'Escola: ____________________________________________________________' 11 $true
            Set-CellText $header.Cell(2,1) 'Nome: _____________________________________________________________' 11 $true
            Set-CellText $header.Cell(3,1) 'Turma: ______________' 11 $true
            Set-CellText $header.Cell(3,2) 'Data: ____/____/______' 11 $true
            Set-CellText $header.Cell(3,3) 'Prof.:__________' 11 $true
            $header.Columns.Item(1).Width = $word.CentimetersToPoints(6.731)
            $header.Columns.Item(2).Width = $word.CentimetersToPoints(5.334)
            $header.Columns.Item(3).Width = $word.CentimetersToPoints(5.969)

            Add-Paragraph $doc 'ATIVIDADE DE GEOGRAFIA' 15 $true 1 '1F497D'
            Add-Paragraph $doc $activity.titulo 13 $true 1

            $range = $doc.Content
            $range.Collapse(0)
            $content = $doc.Tables.Add($range, 1, 2)
            $content.Borders.Enable = 1
            $content.Rows.Item(1).Height = $word.CentimetersToPoints(9.627)
            $content.Columns.Item(1).Width = $word.CentimetersToPoints(8.763)
            $content.Columns.Item(2).Width = $word.CentimetersToPoints(9.779)
            Set-CellText $content.Cell(1,1) ("{0}`r`n`r`n{1}" -f (Clean-Text $activity.textoApoio.titulo), (Clean-Text $activity.textoApoio.conteudo)) 11 $false

            $imageInserted = $false
            $imagePath = Clean-Text $activity.ilustracao.arquivo
            if ($imagePath) {
                $resolvedImage = if ([System.IO.Path]::IsPathRooted($imagePath)) { $imagePath } else { Join-Path $root $imagePath }
                if (Test-Path $resolvedImage) {
                    $content.Cell(1,2).Range.Text = ''
                    $shape = $content.Cell(1,2).Range.InlineShapes.AddPicture($resolvedImage, $false, $true)
                    $shape.LockAspectRatio = -1
                    if ($shape.Width -gt $word.CentimetersToPoints(8.8)) { $shape.Width = $word.CentimetersToPoints(8.8) }
                    if ($shape.Height -gt $word.CentimetersToPoints(8.8)) { $shape.Height = $word.CentimetersToPoints(8.8) }
                    $content.Cell(1,2).Range.ParagraphFormat.Alignment = 1
                    $imageInserted = $true
                }
            }
            if (-not $imageInserted) {
                Set-CellText $content.Cell(1,2) ("ILUSTRAÇÃO`r`n`r`n{0}" -f (Clean-Text $activity.ilustracao.descricao)) 10 $false 1
            }

            Add-Paragraph $doc ($activity.instrucaoGeral ?? 'Responda às questões de acordo com o texto.') 13 $true 1 '1F497D'

            foreach ($q in $activity.questoes) {
                Add-Paragraph $doc ("{0} - {1}" -f $q.numero, (Clean-Text $q.enunciado)) 11 $false 0
                if ($q.alternativas -and $q.alternativas.Count -gt 0) {
                    $letter = 97
                    foreach ($alt in $q.alternativas) {
                        Add-Paragraph $doc ("{0}) {1}" -f [char]$letter, (Clean-Text $alt)) 11 $false 0
                        $letter++
                    }
                } else {
                    Add-Paragraph $doc '________________________________________________________________________________________' 9 $false 0
                    if ($q.espacoResposta -eq 'grande') {
                        Add-Paragraph $doc '________________________________________________________________________________________' 9 $false 0
                    }
                }
            }

            $end = $doc.Content
            $end.Collapse(0)
            $end.InsertBreak(7)
            Add-Paragraph $doc 'GABARITO' 15 $true 1 '1F497D'
            Add-Paragraph $doc $activity.titulo 13 $true 1
            Add-Paragraph $doc ("Revisão · {0} · {1} · {2}º bimestre · Geografia" -f $collection.etapa, $collection.ano, $collection.bimestre) 9 $false 1 '666666'

            foreach ($answer in $activity.gabarito) {
                Add-Paragraph $doc ("{0}. {1}" -f $answer.numero, (Clean-Text $answer.resposta)) 11 $false 0
            }

            $skill = $activity.bncc[0]
            Add-Paragraph $doc ("BNCC: {0} — {1}" -f $skill.codigo, (Clean-Text $skill.habilidadeOficial)) 10 $true 0
            Add-Paragraph $doc ("Verbo central: {0}" -f (Clean-Text $skill.verbo)) 10 $false 0

            $order = if ($activity.sequenciaNumero) { [int]$activity.sequenciaNumero } elseif ($activity.numero) { [int]$activity.numero } else { $generated + 1 }
            $safeTitle = (Clean-Text $activity.titulo).Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}', '' -replace '[^a-zA-Z0-9]+', '-'
            $safeTitle = $safeTitle.Trim('-').ToLower()
            $code = (Clean-Text $skill.codigo).ToLower()
            $filename = ('{0:D2}-{1}-{2}.docx' -f $order, $code, $safeTitle)
            $target = Join-Path $destination $filename
            $doc.SaveAs2($target, 16)
            $doc.Close()
            $generated++
            Write-Host "[OK] $termº bimestre -> $filename"
        }
    }
}
finally {
    if ($word) { $word.Quit() }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}

Write-Host ""
Write-Host "Geografia Word concluído. Gerados: $generated. Legados ignorados: $skipped."
if ($generated -eq 0) {
    Write-Host 'Nenhuma atividade V2 foi encontrada ainda. Isso é esperado até começarmos a reconstrução de Geografia.'
}
