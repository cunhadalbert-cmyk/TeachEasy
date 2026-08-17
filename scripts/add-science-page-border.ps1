param(
    [int]$OnlyTerm = 4
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$baseScript = Join-Path $PSScriptRoot 'add-geography-page-border.ps1'
if (-not (Test-Path -LiteralPath $baseScript)) {
    throw ('Script base de moldura nao encontrado: ' + $baseScript)
}

$source = [IO.File]::ReadAllText($baseScript, [Text.Encoding]::UTF8)
$escapedRoot = $projectRoot.Replace("'", "''")
$source = $source.Replace("`$root = Split-Path -Parent `$PSScriptRoot", "`$root = '$escapedRoot'")
$source = $source.Replace("exports\word\4-ano\geografia", "exports\word\4-ano\ciencias")

$temp = Join-Path ([IO.Path]::GetTempPath()) ('teacheasy-science-border-' + [guid]::NewGuid().ToString('N') + '.ps1')
try {
    [IO.File]::WriteAllText($temp, $source, (New-Object Text.UTF8Encoding($true)))
    & powershell -NoProfile -ExecutionPolicy Bypass -File $temp -OnlyTerm $OnlyTerm
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
    Remove-Item -LiteralPath $temp -Force -ErrorAction SilentlyContinue
}
