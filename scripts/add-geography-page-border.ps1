param(
    [int]$OnlyTerm = 4
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $PSScriptRoot
$outputRoot = Join-Path $root 'exports\word\4-ano\geografia'
$targetDir = Join-Path $outputRoot ($OnlyTerm.ToString() + '-bimestre')

if (-not (Test-Path -LiteralPath $targetDir)) {
    throw ('Pasta nao encontrada: ' + $targetDir)
}

function Set-PageBorderInDocumentXml([string]$xmlText) {
    $pgBorders = '<w:pgBorders w:offsetFrom="page"><w:top w:val="single" w:sz="8" w:space="14" w:color="000000"/><w:left w:val="single" w:sz="8" w:space="14" w:color="000000"/><w:bottom w:val="single" w:sz="8" w:space="14" w:color="000000"/><w:right w:val="single" w:sz="8" w:space="14" w:color="000000"/></w:pgBorders>'

    # Remove borda existente para evitar duplicacao.
    $xmlText = [regex]::Replace($xmlText, '<w:pgBorders\b[^>]*>.*?</w:pgBorders>', '', 'Singleline')

    # Insere a borda dentro de cada w:sectPr, logo apos a abertura.
    return [regex]::Replace(
        $xmlText,
        '<w:sectPr(\s[^>]*)?>',
        { param($m) $m.Value + $pgBorders }
    )
}

$files = Get-ChildItem -LiteralPath $targetDir -File -Filter '*.docx' | Sort-Object Name
Write-Host ('[1/2] Arquivos encontrados: ' + $files.Count)

$updated = 0
foreach ($file in $files) {
    Write-Host ('[PROCESSANDO] ' + $file.Name)

    $tempDir = Join-Path ([IO.Path]::GetTempPath()) ('teacheasy-border-' + [guid]::NewGuid().ToString('N'))
    $tempZip = Join-Path ([IO.Path]::GetTempPath()) ('teacheasy-border-' + [guid]::NewGuid().ToString('N') + '.zip')

    try {
        New-Item -ItemType Directory -Path $tempDir | Out-Null
        [IO.Compression.ZipFile]::ExtractToDirectory($file.FullName, $tempDir)

        $documentXml = Join-Path $tempDir 'word\document.xml'
        if (-not (Test-Path -LiteralPath $documentXml)) {
            throw ('word/document.xml nao encontrado em ' + $file.Name)
        }

        $xml = [IO.File]::ReadAllText($documentXml, [Text.Encoding]::UTF8)
        $xml = Set-PageBorderInDocumentXml $xml
        [IO.File]::WriteAllText($documentXml, $xml, (New-Object Text.UTF8Encoding($false)))

        if (Test-Path -LiteralPath $tempZip) { Remove-Item -LiteralPath $tempZip -Force }
        [IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $tempZip, [IO.Compression.CompressionLevel]::Optimal, $false)

        Copy-Item -LiteralPath $tempZip -Destination $file.FullName -Force
        $updated++
        Write-Host ('[OK] ' + $file.Name)
    }
    finally {
        if (Test-Path -LiteralPath $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force -ErrorAction SilentlyContinue }
        if (Test-Path -LiteralPath $tempZip) { Remove-Item -LiteralPath $tempZip -Force -ErrorAction SilentlyContinue }
    }
}

Write-Host ''
Write-Host ('[2/2] Moldura preta aplicada em ' + $updated + ' arquivo(s), sem abrir o Word.')
