param(
    [int]$OnlyTerm = 0,
    [int]$OnlyOrder = 0
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$baseScript = Join-Path $PSScriptRoot 'generate-geography-word.ps1'
if (-not (Test-Path -LiteralPath $baseScript)) {
    throw ('Gerador base nao encontrado: ' + $baseScript)
}

$source = [IO.File]::ReadAllText($baseScript, [Text.Encoding]::UTF8)
$escapedRoot = $projectRoot.Replace("'", "''")
$source = $source.Replace("`$root = Split-Path -Parent `$PSScriptRoot", "`$root = '$escapedRoot'")
$source = $source.Replace("exports\word\4-ano\geografia", "exports\word\4-ano\ciencias")
$source = $source.Replace("'geografia-v2.json'", "'ciencias-v2.json'")
$source = $source.Replace("'geografia-v2-lote-*.json'", "'ciencias-v2-lote-*.json'")
$source = $source.Replace("'geografia.json'", "'ciencias.json'")
$source = $source.Replace("'ATIVIDADE DE GEOGRAFIA'", "'ATIVIDADE DE CIENCIAS'")
$source = $source.Replace("'Geografia Word concluido. Gerados: '", "'Ciencias Word concluido. Gerados: '")

$temp = Join-Path ([IO.Path]::GetTempPath()) ('teacheasy-science-word-' + [guid]::NewGuid().ToString('N') + '.ps1')
try {
    [IO.File]::WriteAllText($temp, $source, (New-Object Text.UTF8Encoding($true)))
    & powershell -NoProfile -ExecutionPolicy Bypass -File $temp -OnlyTerm $OnlyTerm -OnlyOrder $OnlyOrder
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
    Remove-Item -LiteralPath $temp -Force -ErrorAction SilentlyContinue
}
