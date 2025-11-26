# Setup Google Cloud Run Custom Domain (PowerShell)
# Usage: .\scripts\setup-google-domain.ps1 -Domain "dreamnet.world" -ServiceName "dreamnet" -Region "us-central1"

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "dreamnet",
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-central1"
)

Write-Host "🌐 Setting up custom domain: $Domain" -ForegroundColor Cyan
Write-Host "📦 Service: $ServiceName" -ForegroundColor Cyan
Write-Host "📍 Region: $Region" -ForegroundColor Cyan
Write-Host ""

# Check if domain mapping already exists
try {
    $existing = gcloud run domain-mappings describe --domain="$Domain" --region="$Region" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "⚠️  Domain mapping already exists for $Domain" -ForegroundColor Yellow
        Write-Host "📋 Current DNS records:" -ForegroundColor Cyan
        gcloud run domain-mappings describe --domain="$Domain" --region="$Region" --format="value(status.resourceRecords)"
        exit 0
    }
} catch {
    # Domain mapping doesn't exist, continue
}

# Create domain mapping
Write-Host "🔗 Creating domain mapping..." -ForegroundColor Cyan
gcloud run domain-mappings create `
    --service="$ServiceName" `
    --domain="$Domain" `
    --region="$Region"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create domain mapping" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Domain mapping created!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Add these DNS records to your domain registrar:" -ForegroundColor Cyan
Write-Host ""

# Get DNS records
gcloud run domain-mappings describe `
    --domain="$Domain" `
    --region="$Region" `
    --format="table(status.resourceRecords.type,status.resourceRecords.name,status.resourceRecords.rrdata)"

Write-Host ""
Write-Host "⏳ After adding DNS records, wait 5-60 minutes for propagation" -ForegroundColor Yellow
Write-Host "🔒 SSL certificate will be automatically provisioned (takes ~10 minutes)" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Verify with: gcloud run domain-mappings describe --domain=$Domain --region=$Region" -ForegroundColor Green

