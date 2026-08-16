$ErrorActionPreference = 'Stop'

$generator = Join-Path $PSScriptRoot 'generate-geography-word.ps1'
if (-not (Test-Path -LiteralPath $generator)) {
    throw "Gerador nao encontrado: $generator"
}

$source = Get-Content -LiteralPath $generator -Raw -Encoding UTF8

$createPattern = [regex]::Escape('$doc = $word.Documents.Add()')
$createReplacement = @'
$doc = $word.Documents.Add()
                    $tempTarget = Join-Path ([IO.Path]::GetTempPath()) ('teacheasy-geografia-' + [guid]::NewGuid().ToString('N') + '.docx')
                    Write-Host ('Pre-salvando temporario: ' + $tempTarget)
                    $doc.SaveAs2($tempTarget, 16)
'@
$patched = [regex]::Replace($source, $createPattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $createReplacement }, 1)

$savePattern = [regex]::Escape("Write-Host ('Salvando em: ' + `$target)") + "\s*" + [regex]::Escape('$doc.SaveAs2($target, 16)') + "\s*" + [regex]::Escape('$doc.Saved = $true') + "\s*" + [regex]::Escape('$doc.Close(0)')
$saveReplacement = @'
Write-Host ('Salvando em: ' + $target)
                    $doc.Save()
                    $doc.Saved = $true
                    $doc.Close(0)
                    Move-Item -LiteralPath $tempTarget -Destination $target -Force
'@
$patched = [regex]::Replace($patched, $savePattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $saveReplacement }, 1)

if ($patched -eq $source) {
    throw 'Nao foi possivel aplicar a correcao segura ao gerador.'
}

$tempScript = Join-Path ([IO.Path]::GetTempPath()) ('teacheasy-geografia-run-' + [guid]::NewGuid().ToString('N') + '.ps1')
try {
    Set-Content -LiteralPath $tempScript -Value $patched -Encoding UTF8
    Write-Host '=== TeachEasy Geografia - modo seguro ==='
    Write-Host 'O Word sera pre-salvo vazio, preenchido, salvo e movido para a pasta final.'
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $tempScript
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}
finally {
    Remove-Item -LiteralPath $tempScript -Force -ErrorAction SilentlyContinue
}
