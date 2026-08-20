param(
    [int]$Limit = 10,
    [int]$Serie = 1,
    [int]$Term = 1,
    [ValidateSet('lingua-portuguesa','matematica','ciencias','historia','geografia')]
    [string]$Subject = 'ciencias'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $root 'var\illustration-production\manifest.json'
$wordScript = Join-Path $PSScriptRoot 'generate-ensino-medio-word.ps1'

if (-not (Test-Path -LiteralPath $manifestPath)) {
    throw "Manifesto não encontrado: $manifestPath"
}
if (-not (Test-Path -LiteralPath $wordScript)) {
    throw "Gerador Word não encontrado: $wordScript"
}

Write-Host '[1/4] Importando imagens disponíveis na inbox...'
& node (Join-Path $PSScriptRoot 'illustration-production-pipeline.mjs') ingest --limit $Limit
if ($LASTEXITCODE -ne 0) { throw 'Falha no ingest das ilustrações.' }

Write-Host '[2/4] Conferindo status do lote...'
$manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$items = @($manifest.items | Select-Object -First $Limit)
$pending = @($items | Where-Object { $_.status -ne 'gerada' })

if ($pending.Count -gt 0) {
    Write-Host ''
    Write-Host ("Lote ainda não está completo. Pendentes: {0}" -f $pending.Count)
    foreach ($item in $pending) {
        Write-Host ("[PENDENTE] {0} - status: {1}" -f $item.id, $item.status)
    }
    Write-Host ''
    Write-Host 'Coloque os PNGs faltantes em var\illustration-production\inbox e execute novamente.'
    exit 2
}

Write-Host '[3/4] Todas as imagens do lote estão geradas. Gerando os arquivos Word...'
for ($order = 1; $order -le $Limit; $order++) {
    Write-Host ("[WORD] Atividade {0}/{1}" -f $order, $Limit)
    & powershell -NoProfile -ExecutionPolicy Bypass -File $wordScript -Serie $Serie -Term $Term -Subject $Subject -Order $order -Force
    if ($LASTEXITCODE -ne 0) { throw ("Falha ao gerar Word da atividade {0}." -f $order) }
}

Write-Host '[4/4] Lote concluído.'
Write-Host ("Total processado: {0}" -f $Limit)
