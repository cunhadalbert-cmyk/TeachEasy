param(
    [int]$OnlyTerm = 0,
    [int]$OnlyOrder = 0
)

$ErrorActionPreference = 'Stop'

# Reaproveita o exportador de Geografia ja validado no Windows,
# trocando apenas os pontos especificos da disciplina Historia.
$baseScript = Join-Path $PSScriptRoot 'generate-geography-word.ps1'
if (-not (Test-Path -LiteralPath $baseScript)) {
    throw ('Gerador base nao encontrado: ' + $baseScript)
}

$source = [IO.File]::ReadAllText($baseScript, [Text.Encoding]::UTF8)
$source = $source.Replace("exports\word\4-ano\geografia", "exports\word\4-ano\historia")
$source = $source.Replace("'geografia-v2.json'", "'historia-v2.json'")
$source = $source.Replace("'geografia-v2-lote-*.json'", "'historia-v2-lote-*.json'")
$source = $source.Replace("'geografia.json'", "'historia.json'")
$source = $source.Replace("'ATIVIDADE DE GEOGRAFIA'", "'ATIVIDADE DE HISTORIA'")
$source = $source.Replace("'Geografia Word concluido. Gerados: '", "'Historia Word concluido. Gerados: '")

# Compatibilidade com o formato do builder de Historia.
$source = $source.Replace("(Clean-Text $activity.ilustracao.descricao)", "(Clean-Text $activity.figuras[0].descricao)")
$source = $source.Replace("(Clean-Text $skill.habilidadeOficial)", "(Clean-Text $skill.descricaoResumida)")

$temp = Join-Path ([IO.Path]::GetTempPath()) ('teacheasy-history-word-' + [guid]::NewGuid().ToString('N') + '.ps1')
try {
    [IO.File]::WriteAllText($temp, $source, (New-Object Text.UTF8Encoding($true)))
    & powershell -NoProfile -ExecutionPolicy Bypass -File $temp -OnlyTerm $OnlyTerm -OnlyOrder $OnlyOrder
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
finally {
    Remove-Item -LiteralPath $temp -Force -ErrorAction SilentlyContinue
}
