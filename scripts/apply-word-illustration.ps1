param(
    [Parameter(Mandatory = $true)]
    [string]$DocumentPath,
    [Parameter(Mandatory = $true)]
    [string]$ImagePath,
    [double]$WidthCm = 8.6,
    [double]$HeightCm = 5.2
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'word-illustration-fit.ps1')

$documentFull = [System.IO.Path]::GetFullPath($DocumentPath)
$imageFull = [System.IO.Path]::GetFullPath($ImagePath)
if (-not (Test-Path -LiteralPath $documentFull)) { throw ('Documento não encontrado: ' + $documentFull) }
if (-not (Test-Path -LiteralPath $imageFull)) { throw ('Imagem não encontrada: ' + $imageFull) }

function Release-Com([object]$value) {
    if ($null -eq $value) { return }
    try {
        if ([Runtime.InteropServices.Marshal]::IsComObject($value)) {
            [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($value)
        }
    } catch {}
}

$word = $null
$doc = $null
$targetCell = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $word.Options.SaveNormalPrompt = $false
    $word.Options.ConfirmConversions = $false
    $word.AutomationSecurity = 3

    $doc = $word.Documents.Open($documentFull)

    foreach ($table in @($doc.Tables)) {
        try {
            foreach ($cell in @($table.Range.Cells)) {
                $text = ([string]$cell.Range.Text -replace '[\r\a]+', ' ' -replace '\s+', ' ').Trim()
                if ($text -match '^ILUSTRAÇÃO\b' -or $text -match '^ILUSTRACAO\b') {
                    $targetCell = $cell
                    break
                }
                Release-Com $cell
            }
            if ($null -ne $targetCell) { break }
        } finally {
            Release-Com $table
        }
    }

    if ($null -eq $targetCell) { throw 'Nenhuma célula de ILUSTRAÇÃO foi encontrada no documento.' }

    $ok = Add-TeachEasyIllustrationToCell -Word $word -Cell $targetCell -SourcePath $imageFull -WidthCm $WidthCm -HeightCm $HeightCm
    if (-not $ok) { throw 'Não foi possível inserir a ilustração no quadro.' }

    $doc.Save()
    Write-Host ('[OK] Ilustração ajustada no quadro: ' + $documentFull)
} finally {
    Release-Com $targetCell
    if ($null -ne $doc) { try { $doc.Close(0) } catch {}; Release-Com $doc }
    if ($null -ne $word) { try { $word.Quit(0) } catch {}; Release-Com $word }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}
