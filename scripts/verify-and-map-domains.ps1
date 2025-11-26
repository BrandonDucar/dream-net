# Verify and Map Domains for DreamNet
# Step 1: Verify domain ownership in Google Cloud
# Step 2: Map domains to Cloud Run service
# Step 3: Get DNS records and set them up via Namecheap API

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "🌐 DREAMNET DOMAIN SETUP" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = "aqueous-tube-470317-m6"
$REGION = "us-central1"
$SERVICE_NAME = "dreamnet"

Write-Host "📋 Step 1: Verify Domain Ownership" -ForegroundColor Yellow
Write-Host ""
Write-Host "Google Cloud requires domain verification before mapping." -ForegroundColor White
Write-Host "We'll use Namecheap API to add the verification TXT record." -ForegroundColor White
Write-Host ""

# Check if Namecheap API is configured
if (-not $env:NAMECHEAP_API_USER -or -not $env:NAMECHEAP_API_KEY) {
    Write-Host "⚠️  Namecheap API credentials not found in environment" -ForegroundColor Yellow
    Write-Host "   Set NAMECHEAP_API_USER and NAMECHEAP_API_KEY" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Alternative: Manual Setup" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://console.cloud.google.com/apis/credentials/domainverification" -ForegroundColor White
    Write-Host "   2. Add domain: dreamnet.ink" -ForegroundColor White
    Write-Host "   3. Add the TXT record to Namecheap DNS" -ForegroundColor White
    Write-Host "   4. Wait for verification (can take a few minutes)" -ForegroundColor White
    Write-Host ""
    Write-Host "   5. Then run: gcloud beta run domain-mappings create --service=dreamnet --domain=dreamnet.ink --region=us-central1" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✅ Namecheap API credentials found" -ForegroundColor Green
    Write-Host "   We can automate DNS record setup!" -ForegroundColor White
    Write-Host ""
}

Write-Host "📋 Step 2: After Verification, Map Domains" -ForegroundColor Yellow
Write-Host ""
Write-Host "Once domains are verified, run these commands:" -ForegroundColor White
Write-Host ""
Write-Host "   gcloud beta run domain-mappings create \`" -ForegroundColor Cyan
Write-Host "     --service=$SERVICE_NAME \`" -ForegroundColor Cyan
Write-Host "     --domain=dreamnet.ink \`" -ForegroundColor Cyan
Write-Host "     --region=$REGION \`" -ForegroundColor Cyan
Write-Host "     --project=$PROJECT_ID" -ForegroundColor Cyan
Write-Host ""
Write-Host "   gcloud beta run domain-mappings create \`" -ForegroundColor Cyan
Write-Host "     --service=$SERVICE_NAME \`" -ForegroundColor Cyan
Write-Host "     --domain=dadfi.org \`" -ForegroundColor Cyan
Write-Host "     --region=$REGION \`" -ForegroundColor Cyan
Write-Host "     --project=$PROJECT_ID" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Step 3: Get DNS Records" -ForegroundColor Yellow
Write-Host ""
Write-Host "After mapping, get DNS records:" -ForegroundColor White
Write-Host ""
Write-Host "   gcloud beta run domain-mappings describe dreamnet.ink \`" -ForegroundColor Cyan
Write-Host "     --region=$REGION \`" -ForegroundColor Cyan
Write-Host "     --project=$PROJECT_ID \`" -ForegroundColor Cyan
Write-Host "     --format='value(status.resourceRecords)'" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Step 4: Add DNS Records to Namecheap" -ForegroundColor Yellow
Write-Host ""
Write-Host "The mapping will provide A records (IP addresses) that need to be added to Namecheap." -ForegroundColor White
Write-Host "You can use the Namecheap API or add them manually in the Namecheap dashboard." -ForegroundColor White
Write-Host ""

Write-Host "💡 Quick Links:" -ForegroundColor Cyan
Write-Host "   - Domain Verification: https://console.cloud.google.com/apis/credentials/domainverification" -ForegroundColor White
Write-Host "   - Cloud Run Services: https://console.cloud.google.com/run?project=$PROJECT_ID" -ForegroundColor White
Write-Host "   - Namecheap DNS: https://www.namecheap.com/myaccount/login.aspx" -ForegroundColor White
Write-Host ""

