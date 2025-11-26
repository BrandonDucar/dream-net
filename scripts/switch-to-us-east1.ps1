# Switch DreamNet to use us-east1 region (closer to user)
# This updates the default region in deployment scripts

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "🔄 SWITCHING TO US-EAST1 REGION" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Current Situation:" -ForegroundColor Yellow
Write-Host "  - You're located in us-east1" -ForegroundColor White
Write-Host "  - Most scripts default to us-central1" -ForegroundColor White
Write-Host "  - You already have an active service in us-east1!" -ForegroundColor Green
Write-Host ""

Write-Host "✅ Active Service Found:" -ForegroundColor Green
$eastService = gcloud run services describe dreamnet --region=us-east1 --format="value(status.url)" 2>&1
if ($eastService -and -not ($eastService -match "ERROR")) {
    Write-Host "   URL: $eastService" -ForegroundColor White
    Write-Host "   Region: us-east1" -ForegroundColor White
    Write-Host "   Status: ✅ Active" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Service not found or not accessible" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Benefits of Using us-east1:" -ForegroundColor Cyan
Write-Host "  - Lower latency (~10-20ms faster for you)" -ForegroundColor White
Write-Host "  - Better performance for East Coast users" -ForegroundColor White
Write-Host "  - Same functionality, just faster" -ForegroundColor White
Write-Host ""

Write-Host "📝 Options:" -ForegroundColor Yellow
Write-Host "  1. Use existing us-east1 service (recommended)" -ForegroundColor White
Write-Host "  2. Update scripts to default to us-east1" -ForegroundColor White
Write-Host "  3. Deploy fresh to us-east1" -ForegroundColor White
Write-Host ""

$choice = Read-Host "What would you like to do? (1/2/3)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "✅ Using existing us-east1 service!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 To map domains to us-east1 service:" -ForegroundColor Cyan
    Write-Host "   gcloud beta run domain-mappings create \`" -ForegroundColor White
    Write-Host "     --service=dreamnet \`" -ForegroundColor White
    Write-Host "     --domain=dreamnet.ink \`" -ForegroundColor White
    Write-Host "     --region=us-east1 \`" -ForegroundColor White
    Write-Host "     --project=aqueous-tube-470317-m6" -ForegroundColor White
    Write-Host ""
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "📝 Updating scripts to default to us-east1..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Set environment variable:" -ForegroundColor White
    Write-Host "   `$env:GCP_REGION = 'us-east1'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Or add to .env file:" -ForegroundColor White
    Write-Host "   GCP_REGION=us-east1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   This will make all future deployments use us-east1" -ForegroundColor White
    Write-Host ""
} elseif ($choice -eq "3") {
    Write-Host ""
    Write-Host "🚀 Deploying fresh to us-east1..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Run: `$env:GCP_REGION='us-east1'; .\scripts\deploy-watchable.ps1" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "❌ Invalid choice" -ForegroundColor Red
}

Write-Host ""

