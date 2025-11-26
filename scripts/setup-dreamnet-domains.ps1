# Setup Domain Mappings for DreamNet
# Maps dreamnet.ink and dadfi.org to Cloud Run services

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "🌐 SETTING UP DREAMNET DOMAINS" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = if ($env:GCP_PROJECT_ID) { $env:GCP_PROJECT_ID } else { "aqueous-tube-470317-m6" }
$REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { "us-central1" }
$SERVICE_NAME = "dreamnet" # Main service to map domains to

# Get service URL
Write-Host "📋 Getting Cloud Run service URL..." -ForegroundColor Yellow
$SERVICE_URL = gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format="value(status.url)" 2>&1

if (-not $SERVICE_URL -or $SERVICE_URL -match "ERROR") {
    Write-Host "❌ Service '$SERVICE_NAME' not found in region '$REGION'" -ForegroundColor Red
    Write-Host "   Available services:" -ForegroundColor Yellow
    gcloud run services list --format="table(metadata.name,status.url)" --limit=10
    exit 1
}

Write-Host "✅ Service URL: $SERVICE_URL" -ForegroundColor Green
Write-Host ""

# Map dreamnet.ink
Write-Host "🌐 Mapping dreamnet.ink..." -ForegroundColor Yellow
$mapping1 = gcloud beta run domain-mappings create --service=$SERVICE_NAME --domain=dreamnet.ink --region=$REGION --project=$PROJECT_ID 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Created domain mapping for dreamnet.ink" -ForegroundColor Green
} else {
    if ($mapping1 -match "already exists") {
        Write-Host "   ℹ️  dreamnet.ink already mapped" -ForegroundColor Cyan
    } else {
        Write-Host "   ⚠️  $mapping1" -ForegroundColor Yellow
    }
}

Write-Host ""

# Map dadfi.org
Write-Host "🌐 Mapping dadfi.org..." -ForegroundColor Yellow
$mapping2 = gcloud beta run domain-mappings create --service=$SERVICE_NAME --domain=dadfi.org --region=$REGION --project=$PROJECT_ID 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Created domain mapping for dadfi.org" -ForegroundColor Green
} else {
    if ($mapping2 -match "already exists") {
        Write-Host "   ℹ️  dadfi.org already mapped" -ForegroundColor Cyan
    } else {
        Write-Host "   ⚠️  $mapping2" -ForegroundColor Yellow
    }
}

Write-Host ""

# Get DNS records needed
Write-Host "📋 DNS Records Needed:" -ForegroundColor Cyan
Write-Host ""

$mappings = gcloud beta run domain-mappings describe dreamnet.ink --region=$REGION --project=$PROJECT_ID --format="json" 2>&1
if ($LASTEXITCODE -eq 0) {
    $mappingData = $mappings | ConvertFrom-Json
    $records = $mappingData.status.resourceRecords
    
    Write-Host "   For dreamnet.ink:" -ForegroundColor Yellow
    $records | ForEach-Object {
        Write-Host "      Type: $($_.type) | Name: $($_.name) | Data: $($_.rrdata)" -ForegroundColor White
    }
} else {
    Write-Host "   ⚠️  Could not get DNS records for dreamnet.ink (mapping may not exist yet)" -ForegroundColor Yellow
}

Write-Host ""

# Check dadfi.org
$mappings2 = gcloud beta run domain-mappings describe dadfi.org --region=$REGION --project=$PROJECT_ID --format="json" 2>&1
if ($LASTEXITCODE -eq 0) {
    $mappingData2 = $mappings2 | ConvertFrom-Json
    $records2 = $mappingData2.status.resourceRecords
    
    Write-Host "   For dadfi.org:" -ForegroundColor Yellow
    $records2 | ForEach-Object {
        Write-Host "      Type: $($_.type) | Name: $($_.name) | Data: $($_.rrdata)" -ForegroundColor White
    }
} else {
    Write-Host "   ⚠️  Could not get DNS records for dadfi.org (mapping may not exist yet)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ("=" * 70) -ForegroundColor Green
Write-Host "✅ Domain Mapping Setup Complete!" -ForegroundColor Green
Write-Host ("=" * 70) -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Add DNS records to Namecheap (or your DNS provider)" -ForegroundColor White
Write-Host "   2. Wait 5-10 minutes for DNS propagation" -ForegroundColor White
Write-Host "   3. Visit https://dreamnet.ink to see Dream Hub!" -ForegroundColor White
Write-Host ""
Write-Host "💡 I can help set up DNS records via Namecheap API if needed" -ForegroundColor Yellow
Write-Host ""
