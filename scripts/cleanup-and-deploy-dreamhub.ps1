# Clean Up Old Cloud Run Services and Deploy Fresh Dream Hub
# This will clean up the 5 services and deploy one clean service

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "🧹 CLEANING UP CLOUD RUN SERVICES" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = $env:GCP_PROJECT_ID ?? "aqueous-tube-470317-m6"
$REGION = $env:GCP_REGION ?? "us-central1"

# List all services
Write-Host "📋 Current Services:" -ForegroundColor Yellow
$services = gcloud run services list --format="value(metadata.name,metadata.labels['cloud.googleapis.com/location'])" --project=$PROJECT_ID 2>&1

$servicesToDelete = @()
$services -split "`n" | ForEach-Object {
    if ($_ -match "dream") {
        $parts = $_ -split "`t"
        if ($parts.Length -ge 2) {
            $name = $parts[0]
            $svcRegion = $parts[1]
            $servicesToDelete += @{Name=$name; Region=$svcRegion}
        }
    }
}

Write-Host ""
Write-Host "🗑️  Services to Delete:" -ForegroundColor Yellow
$servicesToDelete | ForEach-Object {
    Write-Host "   - $($_.Name) ($($_.Region))" -ForegroundColor White
}

Write-Host ""
$confirm = Read-Host "Delete these services? (y/N)"
if ($confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

# Delete old services
Write-Host ""
Write-Host "🗑️  Deleting old services..." -ForegroundColor Yellow
$servicesToDelete | ForEach-Object {
    Write-Host "   Deleting $($_.Name) in $($_.Region)..." -ForegroundColor Gray
    gcloud run services delete $($_.Name) --region=$($_.Region) --project=$PROJECT_ID --quiet 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Deleted $($_.Name)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Failed to delete $($_.Name) (may not exist)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Cleanup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Now deploy fresh:" -ForegroundColor Cyan
Write-Host "   .\scripts\deploy-watchable.ps1" -ForegroundColor White
Write-Host ""

