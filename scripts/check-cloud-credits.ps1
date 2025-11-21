# Check Cloud Credits and Free Tier Status
# PowerShell script to check AWS and Google Cloud free credits/usage

Write-Host "Checking Cloud Credits & Free Tier Status..." -ForegroundColor Cyan
Write-Host ""

# AWS Free Tier Check
Write-Host "AWS Free Tier Status" -ForegroundColor Green
Write-Host ("=" * 60)

# Check AWS account info
Write-Host "`nAccount Information:" -ForegroundColor Yellow
try {
    $awsIdentity = aws sts get-caller-identity 2>&1 | ConvertFrom-Json
    Write-Host "  Account ID: $($awsIdentity.Account)" -ForegroundColor White
    Write-Host "  User ARN: $($awsIdentity.Arn)" -ForegroundColor White
    Write-Host "  User ID: $($awsIdentity.UserId)" -ForegroundColor White
} catch {
    Write-Host "  Could not get AWS account info" -ForegroundColor Red
}

# AWS Free Tier typically includes:
Write-Host "`nAWS Free Tier (12 months from account creation):" -ForegroundColor Yellow
Write-Host "  - 750 hours/month EC2 t2.micro/t3.micro" -ForegroundColor White
Write-Host "  - 5 GB S3 Standard Storage" -ForegroundColor White
Write-Host "  - 20,000 Get Requests, 2,000 Put Requests" -ForegroundColor White
Write-Host "  - 750 hours/month RDS db.t2.micro" -ForegroundColor White
Write-Host "  - 10 GB EBS General Purpose (SSD)" -ForegroundColor White
Write-Host "  - 15 GB Data Transfer OUT" -ForegroundColor White
Write-Host "  - 1M Lambda requests/month" -ForegroundColor White
Write-Host "  - 10 GB ECR storage" -ForegroundColor White
Write-Host "  - App Runner: First 750 hours/month free" -ForegroundColor White
Write-Host "  - CloudFront: 1 TB data transfer out, 10M requests" -ForegroundColor White

# Check current usage (if permissions allow)
Write-Host "`nCurrent Usage (requires permissions):" -ForegroundColor Yellow
try {
    $s3Buckets = aws s3api list-buckets 2>&1 | ConvertFrom-Json
    Write-Host "  S3 Buckets: $($s3Buckets.Buckets.Count)" -ForegroundColor White
} catch {
    Write-Host "  Cannot check S3 usage (missing permissions)" -ForegroundColor Yellow
}

try {
    $ecrRepos = aws ecr describe-repositories 2>&1 | ConvertFrom-Json
    Write-Host "  ECR Repositories: $($ecrRepos.repositories.Count)" -ForegroundColor White
} catch {
    Write-Host "  Cannot check ECR usage (missing permissions)" -ForegroundColor Yellow
}

# Google Cloud Free Tier Check
Write-Host "`n`nGoogle Cloud Platform Free Tier Status" -ForegroundColor Blue
Write-Host ("=" * 60)

# Check if gcloud is installed
$gcloudPath = Get-Command gcloud -ErrorAction SilentlyContinue
if ($gcloudPath) {
    Write-Host "`ngcloud CLI found at: $($gcloudPath.Source)" -ForegroundColor Green
    
    try {
        $gcloudVersion = gcloud --version 2>&1 | Select-Object -First 1
        Write-Host "  Version: $gcloudVersion" -ForegroundColor White
    } catch {
        Write-Host "  Could not get gcloud version" -ForegroundColor Yellow
    }
    
    # Check project
    try {
        $gcloudProject = gcloud config get-value project 2>&1
        Write-Host "`nCurrent Project: $gcloudProject" -ForegroundColor White
    } catch {
        Write-Host "`nNo project set. Run: gcloud config set project dreamnet-62b49" -ForegroundColor Yellow
    }
} else {
    Write-Host "`ngcloud CLI not found in PATH" -ForegroundColor Yellow
    Write-Host "  Install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor White
}

# Google Cloud Free Tier typically includes:
Write-Host "`nGoogle Cloud Free Tier:" -ForegroundColor Yellow
Write-Host "  - 300 USD free credit (expires after 90 days)" -ForegroundColor White
Write-Host "  - Always Free (no expiration):" -ForegroundColor White
Write-Host "    - 1 GB Cloud Storage (Standard)" -ForegroundColor White
Write-Host "    - 5 GB Cloud Storage (Nearline)" -ForegroundColor White
Write-Host "    - 1 GB Cloud Storage (Coldline)" -ForegroundColor White
Write-Host "    - 1 GB Cloud Storage (Archive)" -ForegroundColor White
Write-Host "    - 1 GB/month Network Egress" -ForegroundColor White
Write-Host "    - Cloud Run: 2 million requests/month" -ForegroundColor White
Write-Host "    - Cloud Build: 120 build-minutes/day" -ForegroundColor White
Write-Host "    - Cloud Functions: 2 million invocations/month" -ForegroundColor White

# Check current usage (if gcloud is available)
if ($gcloudPath) {
    Write-Host "`nCurrent Usage:" -ForegroundColor Yellow
    try {
        $gcloudBuckets = gcloud storage buckets list --format="json" 2>&1 | ConvertFrom-Json
        Write-Host "  Cloud Storage Buckets: $($gcloudBuckets.Count)" -ForegroundColor White
    } catch {
        Write-Host "  Cannot check storage usage (may need auth)" -ForegroundColor Yellow
    }
    
    try {
        $gcloudServices = gcloud run services list --format="json" 2>&1 | ConvertFrom-Json
        Write-Host "  Cloud Run Services: $($gcloudServices.Count)" -ForegroundColor White
    } catch {
        Write-Host "  Cannot check Cloud Run usage (may need auth)" -ForegroundColor Yellow
    }
}

Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "To check detailed billing:" -ForegroundColor Yellow
Write-Host '  AWS: https://console.aws.amazon.com/billing/home' -ForegroundColor White
Write-Host '  GCP: https://console.cloud.google.com/billing' -ForegroundColor White
