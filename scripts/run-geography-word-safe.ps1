$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$generator = Join-Path $PSScriptRoot 'generate-geography-word.ps1'
$output = Join-Path $root 'exports\word\4-ano\geografia\3-bimestre'

if (-not (Test-Path $generator)) {
    throw "Gerador nao encontrado: $generator"
}

function Stop-OrphanWord {
    $processes = Get-Process WINWORD -ErrorAction SilentlyContinue
    foreach ($process in $processes) {
        if ([string]::IsNullOrWhiteSpace($process.MainWindowTitle)) {
            Write-Host ('Encerrando WINWORD sem janela: PID ' + $process.Id)
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host '=== TeachEasy - Geografia Word (modo seguro) ==='
Write-Host ('Gerador: ' + $generator)
Write-Host ('Destino esperado: ' + $output)

Stop-OrphanWord
Start-Sleep -Milliseconds 500

$before = @{}
if (Test-Path $output) {
    Get-ChildItem $output -Filter '*.docx' -File -ErrorAction SilentlyContinue | ForEach-Object {
        $before[$_.FullName] = $_.LastWriteTimeUtc
    }
}

$job = Start-Job -ScriptBlock {
    param($scriptPath)
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $scriptPath 2>&1
} -ArgumentList $generator

$lastCount = 0
$stagnantChecks = 0
try {
    while ($job.State -eq 'Running') {
        Start-Sleep -Seconds 2

        $currentCount = 0
        if (Test-Path $output) {
            $currentCount = @(Get-ChildItem $output -Filter '*.docx' -File -ErrorAction SilentlyContinue).Count
        }

        if ($currentCount -gt $lastCount) {
            Write-Host ('Arquivos Word encontrados no 3o bimestre: ' + $currentCount)
            $lastCount = $currentCount
            $stagnantChecks = 0
        } else {
            $stagnantChecks++
        }

        # O gerador antigo pode deixar o Word aberto apos salvar um arquivo.
        # Se houver WINWORD sem janela e nenhum progresso por ~20 segundos,
        # encerra apenas a instancia orfa para permitir a limpeza do processo.
        if ($stagnantChecks -ge 10) {
            Stop-OrphanWord
            $stagnantChecks = 0
        }
    }

    $log = Receive-Job $job
    $log | ForEach-Object { Write-Host $_ }

    if ($job.State -ne 'Completed') {
        throw ('Gerador terminou em estado inesperado: ' + $job.State)
    }
}
finally {
    Remove-Job $job -Force -ErrorAction SilentlyContinue
    Stop-OrphanWord
}

$files = @()
if (Test-Path $output) {
    $files = @(Get-ChildItem $output -Filter '*.docx' -File | Sort-Object Name)
}

Write-Host ''
Write-Host ('Total de DOCX no destino: ' + $files.Count)
$files | ForEach-Object { Write-Host ('[DOCX] ' + $_.Name) }

if ($files.Count -lt 20) {
    Write-Warning ('Esperados pelo menos 20 DOCX no 3o bimestre; encontrados: ' + $files.Count)
    exit 2
}

Write-Host 'Geracao segura concluida.'
