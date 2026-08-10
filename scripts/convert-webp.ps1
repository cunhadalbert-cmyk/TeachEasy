Add-Type -AssemblyName System.Drawing
$matDir = "c:\Users\usuario\Downloads\TeachEasy\assets\desenhos\matematica"
$outDir = "c:\Users\usuario\Downloads\TeachEasy\public\illustrations\biblioteca\fundamental-iniciais\3-ano\1-bimestre\matematica"

$json = Get-Content "c:\Users\usuario\Downloads\TeachEasy\data\atividades\fundamental-anos-iniciais\3-ano\1-bimestre\matematica.json" | ConvertFrom-Json

for ($i = 0; $i -lt $json.atividades.Count; $i++) {
    $act = $json.atividades[$i]
    $num = "{0:D3}" -f ($i + 1)
    $webpPath = Join-Path $matDir "matematica-$num.webp"
    $pngPath = Join-Path $outDir "$($act.id).png"

    if (Test-Path $webpPath) {
        Write-Host "Converting $webpPath to $pngPath..."
        $img = [System.Drawing.Image]::FromFile($webpPath)
        $img.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $img.Dispose()
    } else {
        Write-Host "WebP not found: $webpPath"
    }
}
Write-Host "All drawings converted successfully!"
