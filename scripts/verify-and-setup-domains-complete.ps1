# Complete Domain Verification and DNS Setup
# This script guides through the entire process

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "🌐 COMPLETE DOMAIN SETUP FOR DREAMNET" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = "aqueous-tube-470317-m6"
$REGION = "us-east1"
$SERVICE_NAME = "dreamnet"
$DOMAINS = @("dreamnet.ink", "dadfi.org")

Write-Host "⚠️  IMPORTANT: Dream Hub is NOT deployed yet!" -ForegroundColor Yellow
Write-Host "   Service is using placeholder image" -ForegroundColor White
Write-Host "   We'll set up DNS, but you'll need to deploy first" -ForegroundColor White
Write-Host ""

Write-Host "📋 Step 1: Verify Domains in Google Cloud" -ForegroundColor Cyan
Write-Host ""
Write-Host "You need to verify domain ownership first:" -ForegroundColor White
Write-Host "   1. Go to: https://console.cloud.google.com/apis/credentials/domainverification?project=$PROJECT_ID" -ForegroundColor Yellow
Write-Host "   2. Click 'Add Domain' for each domain:" -ForegroundColor White
foreach ($domain in $DOMAINS) {
    Write-Host "      - $domain" -ForegroundColor White
}
Write-Host "   3. Google will provide TXT records to add to Namecheap" -ForegroundColor White
Write-Host "   4. Wait 5-10 minutes for verification" -ForegroundColor White
Write-Host ""

Write-Host "📋 Step 2: Create Domain Mappings" -ForegroundColor Cyan
Write-Host ""
Write-Host "After verification, run these commands:" -ForegroundColor White
Write-Host ""
foreach ($domain in $DOMAINS) {
    Write-Host "   gcloud beta run domain-mappings create \`" -ForegroundColor Cyan
    Write-Host "     --service=$SERVICE_NAME \`" -ForegroundColor Cyan
    Write-Host "     --domain=$domain \`" -ForegroundColor Cyan
    Write-Host "     --region=$REGION \`" -ForegroundColor Cyan
    Write-Host "     --project=$PROJECT_ID" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "📋 Step 3: Get DNS Records" -ForegroundColor Cyan
Write-Host ""
Write-Host "After mapping, get the A records:" -ForegroundColor White
Write-Host ""
foreach ($domain in $DOMAINS) {
    Write-Host "   # For $domain" -ForegroundColor Yellow
    Write-Host "   gcloud beta run domain-mappings describe $domain \`" -ForegroundColor Cyan
    Write-Host "     --region=$REGION \`" -ForegroundColor Cyan
    Write-Host "     --project=$PROJECT_ID \`" -ForegroundColor Cyan
    Write-Host "     --format='value(status.resourceRecords)'" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "📋 Step 4: Add DNS Records to Namecheap" -ForegroundColor Cyan
Write-Host ""
Write-Host "You'll get 4 A records (IP addresses) for each domain." -ForegroundColor White
Write-Host "Add them to Namecheap DNS:" -ForegroundColor White
Write-Host ""
Write-Host "   For each domain:" -ForegroundColor Yellow
Write-Host "   1. Go to: https://www.namecheap.com/myaccount/login/" -ForegroundColor White
Write-Host "   2. Navigate to: Domain List → [domain] → Advanced DNS" -ForegroundColor White
Write-Host "   3. Add A records:" -ForegroundColor White
Write-Host "      - Type: A" -ForegroundColor White
Write-Host "      - Host: @ (for root) or www (for www subdomain)" -ForegroundColor White
Write-Host "      - Value: [IP from Google]" -ForegroundColor White
Write-Host "      - TTL: Automatic" -ForegroundColor White
Write-Host "   4. Repeat for all 4 IPs" -ForegroundColor White
Write-Host ""

Write-Host "📋 Step 5: Deploy Dream Hub" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before domains will work, deploy the actual application:" -ForegroundColor White
Write-Host ""
Write-Host "   `$env:GCP_REGION = 'us-east1'" -ForegroundColor Cyan
Write-Host "   .\scripts\deploy-watchable.ps1" -ForegroundColor Cyan
Write-Host ""

Write-Host "Quick Reference:" -ForegroundColor Yellow
Write-Host "   - Google Cloud Console: https://console.cloud.google.com/run?project=$PROJECT_ID" -ForegroundColor White
Write-Host "   - Domain Verification: https://console.cloud.google.com/apis/credentials/domainverification?project=$PROJECT_ID" -ForegroundColor White
Write-Host "   - Namecheap Login: https://www.namecheap.com/myaccount/login/" -ForegroundColor White
Write-Host ""

$proceed = Read-Host "Would you like me to attempt domain mapping now? (y/N)"
if ($proceed -eq "y") {
    Write-Host ""
    Write-Host "🔄 Attempting domain mappings..." -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($domain in $DOMAINS) {
        Write-Host "   Mapping $domain..." -ForegroundColor Cyan
        $result = gcloud beta run domain-mappings create --service=$SERVICE_NAME --domain=$domain --region=$REGION --project=$PROJECT_ID 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Successfully mapped $domain" -ForegroundColor Green
        } else {
            if ($result -match "not.*verified") {
                Write-Host "   ⚠️  Domain not verified yet - need to verify first" -ForegroundColor Yellow
            } else {
                Write-Host "   ⚠️  $result" -ForegroundColor Yellow
            }
        }
        Write-Host ""
    }
}

Write-Host ""
Write-Host "✅ Setup guide complete!" -ForegroundColor Green
Write-Host ""

