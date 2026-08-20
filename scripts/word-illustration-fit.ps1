function Get-TeachEasyIllustrationFromManifest {
    param(
        [string]$Root,
        [string]$ActivityId
    )

    if ([string]::IsNullOrWhiteSpace($Root) -or [string]::IsNullOrWhiteSpace($ActivityId)) { return $null }
    $manifestPath = Join-Path $Root 'var\illustration-production\manifest.json'
    if (-not (Test-Path -LiteralPath $manifestPath)) { return $null }

    try {
        $manifest = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
        $item = @($manifest.items | Where-Object { $_.id -eq $ActivityId }) | Select-Object -First 1
        if ($null -eq $item -or $item.status -ne 'gerada' -or [string]::IsNullOrWhiteSpace([string]$item.outputFile)) { return $null }
        $candidate = Join-Path $Root ([string]$item.outputFile -replace '/', '\')
        if (Test-Path -LiteralPath $candidate) { return [System.IO.Path]::GetFullPath($candidate) }
    } catch {}

    return $null
}

function New-TeachEasyCoverImage {
    param(
        [string]$SourcePath,
        [string]$TargetPath,
        [int]$WidthPx = 1200,
        [int]$HeightPx = 720
    )

    if (-not (Test-Path -LiteralPath $SourcePath)) { return $null }
    Add-Type -AssemblyName System.Drawing

    $source = $null
    $bitmap = $null
    $graphics = $null
    try {
        $source = [System.Drawing.Image]::FromFile($SourcePath)
        if ($source.Width -le 0 -or $source.Height -le 0) { return $null }

        $sourceRatio = [double]$source.Width / [double]$source.Height
        $targetRatio = [double]$WidthPx / [double]$HeightPx

        if ($sourceRatio -gt $targetRatio) {
            $cropHeight = $source.Height
            $cropWidth = [int][Math]::Round($source.Height * $targetRatio)
            $cropX = [int][Math]::Floor(($source.Width - $cropWidth) / 2)
            $cropY = 0
        } else {
            $cropWidth = $source.Width
            $cropHeight = [int][Math]::Round($source.Width / $targetRatio)
            $cropX = 0
            $cropY = [int][Math]::Floor(($source.Height - $cropHeight) / 2)
        }

        $bitmap = New-Object System.Drawing.Bitmap($WidthPx, $HeightPx)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage(
            $source,
            (New-Object System.Drawing.Rectangle(0, 0, $WidthPx, $HeightPx)),
            (New-Object System.Drawing.Rectangle($cropX, $cropY, $cropWidth, $cropHeight)),
            [System.Drawing.GraphicsUnit]::Pixel
        )
        $bitmap.Save($TargetPath, [System.Drawing.Imaging.ImageFormat]::Png)
        return $TargetPath
    } finally {
        if ($null -ne $graphics) { $graphics.Dispose() }
        if ($null -ne $bitmap) { $bitmap.Dispose() }
        if ($null -ne $source) { $source.Dispose() }
    }
}

function Add-TeachEasyIllustrationToCell {
    param(
        $Word,
        $Cell,
        [string]$SourcePath,
        [double]$WidthCm = 8.6,
        [double]$HeightCm = 5.2
    )

    if ($null -eq $Word -or $null -eq $Cell -or -not (Test-Path -LiteralPath $SourcePath)) { return $false }

    $tempPath = Join-Path ([System.IO.Path]::GetTempPath()) ('teacheasy-cover-' + [guid]::NewGuid().ToString('N') + '.png')
    $range = $null
    $shape = $null
    try {
        $prepared = New-TeachEasyCoverImage -SourcePath $SourcePath -TargetPath $tempPath
        if ([string]::IsNullOrWhiteSpace($prepared) -or -not (Test-Path -LiteralPath $prepared)) { return $false }

        $range = $Cell.Range
        $range.Text = ''
        $range.Collapse(1)
        $shape = $range.InlineShapes.AddPicture($prepared, $false, $true)
        $shape.LockAspectRatio = -1
        $shape.Width = $Word.CentimetersToPoints($WidthCm)
        $shape.Height = $Word.CentimetersToPoints($HeightCm)
        $range.ParagraphFormat.Alignment = 1
        $Cell.VerticalAlignment = 1
        return $true
    } finally {
        if ($null -ne $shape -and [Runtime.InteropServices.Marshal]::IsComObject($shape)) { [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($shape) }
        if ($null -ne $range -and [Runtime.InteropServices.Marshal]::IsComObject($range)) { [void][Runtime.InteropServices.Marshal]::FinalReleaseComObject($range) }
        Remove-Item -LiteralPath $tempPath -Force -ErrorAction SilentlyContinue
    }
}
