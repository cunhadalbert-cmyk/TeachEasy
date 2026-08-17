param(
    [int]$OnlyTerm = 4
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$outputRoot = Join-Path $root 'exports\word\4-ano\geografia'
$targetDir = Join-Path $outputRoot ($OnlyTerm.ToString() + '-bimestre')

if (-not (Test-Path -LiteralPath $targetDir)) {
    throw ('Pasta nao encontrada: ' + $targetDir)
}

function Release-Com([object]$value) {
    if ($null -eq $value) { return }
    try {
        if ([Runtime.InteropServices.Marshal]::IsComObject($value)) {
            [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($value)
        }
    } catch {}
}

$word = $null
$updated = 0

Write-Host '[1/3] Iniciando Microsoft Word...'

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0

    $files = Get-ChildItem -LiteralPath $targetDir -File -Filter '*.docx' | Sort-Object Name
    Write-Host ('[2/3] Arquivos encontrados: ' + $files.Count)

    foreach ($file in $files) {
        $doc = $null
        try {
            $doc = $word.Documents.Open($file.FullName, $false, $false)

            for ($s = 1; $s -le $doc.Sections.Count; $s++) {
                $section = $null
                $borders = $null
                try {
                    $section = $doc.Sections.Item($s)
                    $borders = $section.Borders

                    # Distancia medida a partir da borda da pagina.
                    # 14.2 pt = aproximadamente 0,5 cm.
                    $borders.DistanceFrom = 1
                    $borders.DistanceFromTop = 14
                    $borders.DistanceFromBottom = 14
                    $borders.DistanceFromLeft = 14
                    $borders.DistanceFromRight = 14
                    $borders.AlwaysInFront = $true

                    # Quatro lados da moldura: superior, esquerdo, inferior e direito.
                    foreach ($borderType in @(-1, -2, -3, -4)) {
                        $border = $null
                        try {
                            $border = $borders.Item($borderType)
                            $border.LineStyle = 1
                            $border.LineWidth = 8
                            $border.Color = 0
                        }
                        finally {
                            Release-Com $border
                        }
                    }
                }
                finally {
                    Release-Com $borders
                    Release-Com $section
                }
            }

            $doc.Save()
            $updated++
            Write-Host ('[OK] ' + $file.Name)
            $doc.Close(0)
            Release-Com $doc
            $doc = $null
        }
        finally {
            if ($null -ne $doc) {
                try { $doc.Close(0) } catch {}
                Release-Com $doc
            }
            [GC]::Collect()
            [GC]::WaitForPendingFinalizers()
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
Write-Host ('[3/3] Moldura preta aplicada em ' + $updated + ' arquivo(s).')
