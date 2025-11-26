# Configure Cloud Run to prevent shutdown (keep instances alive)
# This sets minInstances > 0 so services don't scale to zero

param(
    [string]$ServiceName = "dreamnet",
    [string]$ProjectId = $env:GCP_PROJECT_ID ?? "dreamnet-main",
    [string]$Region = $env:GCP_REGION ?? "us-central1",
    [int]$MinInstances = 1
)

Write-Host "🔧 Configuring Cloud Run Keep-Alive..." -ForegroundColor Cyan
Write-Host "   Service: $ServiceName" -ForegroundColor Gray
Write-Host "   Min Instances: $MinInstances" -ForegroundColor Gray
Write-Host ""

# Update Cloud Run service with minInstances
Write-Host "📝 Updating Cloud Run service configuration..." -ForegroundColor Yellow

$updateCmd = "gcloud run services update $ServiceName " +
    "--region=$Region " +
    "--project=$ProjectId " +
    "--min-instances=$MinInstances " +
    "--max-instances=10 " +
    "--cpu=2 " +
    "--memory=2Gi " +
    "--timeout=300s " +
    "--concurrency=80"

Write-Host "Running: $updateCmd" -ForegroundColor Gray
Invoke-Expression $updateCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Cloud Run configured for keep-alive!" -ForegroundColor Green
    Write-Host "   Min Instances: $MinInstances (prevents scale-to-zero)" -ForegroundColor Gray
    Write-Host "   Max Instances: 10" -ForegroundColor Gray
    Write-Host "   CPU: 2" -ForegroundColor Gray
    Write-Host "   Memory: 2Gi" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Note: This will incur costs (~$10-30/month per instance)" -ForegroundColor Yellow
    Write-Host "   But ensures DreamNet never shuts down!" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Failed to update Cloud Run service" -ForegroundColor Red
    exit 1
}

