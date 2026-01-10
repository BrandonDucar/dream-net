# Verify AWS CLI Setup
# Run this in a NEW PowerShell window after installing AWS CLI

Write-Host "🔍 Verifying AWS CLI Setup..." -ForegroundColor Cyan
Write-Host ""

# Check if AWS CLI is installed
try {
    $version = aws --version 2>&1
    Write-Host "✅ AWS CLI Installed: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not found. Please:" -ForegroundColor Red
    Write-Host "   1. Close and reopen PowerShell" -ForegroundColor Yellow
    Write-Host "   2. Or restart your computer" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check AWS configuration
Write-Host "📋 Checking AWS Configuration..." -ForegroundColor Cyan
try {
    aws configure list
} catch {
    Write-Host "❌ AWS not configured. Run: aws configure" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verify account access
Write-Host "🔐 Verifying AWS Account Access..." -ForegroundColor Cyan
try {
    $identity = aws sts get-caller-identity | ConvertFrom-Json
    Write-Host "✅ Connected to AWS Account!" -ForegroundColor Green
    Write-Host "   Account ID: $($identity.Account)" -ForegroundColor White
    Write-Host "   User ARN: $($identity.Arn)" -ForegroundColor White
    
    if ($identity.Account -eq "001092882186") {
        Write-Host "   ✅ Correct Account ID!" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Account ID doesn't match expected: 001092882186" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to verify account. Check your credentials." -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 AWS CLI Setup Verified!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Test AWS access: aws s3 ls" -ForegroundColor White
Write-Host "   2. Check regions: aws ec2 describe-regions" -ForegroundColor White
Write-Host "   3. Ready to deploy!" -ForegroundColor White

