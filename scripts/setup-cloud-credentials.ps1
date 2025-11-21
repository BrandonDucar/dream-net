# Cloud Credentials Setup Script
# Sets up Google Cloud and AWS credentials for DreamNet

Write-Host "Cloud Credentials Setup" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

# Check Google Cloud CLI
Write-Host "Checking Google Cloud CLI..." -ForegroundColor Yellow
try {
    $gcloudVersion = gcloud --version 2>&1 | Select-Object -First 1
    Write-Host "   OK: gcloud installed: $gcloudVersion" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: gcloud not found" -ForegroundColor Red
    exit 1
}

# Set Google Cloud Project
Write-Host ""
Write-Host "Setting Google Cloud Project..." -ForegroundColor Yellow
$projectId = "dreamnet-62b49"
gcloud config set project $projectId
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: Project set to: $projectId" -ForegroundColor Green
} else {
    Write-Host "   WARNING: Failed to set project" -ForegroundColor Yellow
}

# Check if already authenticated
Write-Host ""
Write-Host "Checking Google Cloud Authentication..." -ForegroundColor Yellow
$currentAccount = gcloud config get-value account 2>&1
if ($currentAccount -and $currentAccount -ne "(unset)") {
    Write-Host "   OK: Authenticated as: $currentAccount" -ForegroundColor Green
    Write-Host "   INFO: To set up Application Default Credentials, run:" -ForegroundColor Cyan
    Write-Host "      gcloud auth application-default login" -ForegroundColor White
} else {
    Write-Host "   WARNING: Not authenticated" -ForegroundColor Yellow
    Write-Host "   INFO: Run: gcloud auth login" -ForegroundColor White
    Write-Host "   INFO: Then: gcloud auth application-default login" -ForegroundColor White
}

# Set environment variable for project
Write-Host ""
Write-Host "Setting Environment Variables..." -ForegroundColor Yellow
$env:GCP_PROJECT_ID = $projectId
$env:GOOGLE_CLOUD_PROJECT = $projectId
Write-Host "   OK: GCP_PROJECT_ID=$projectId" -ForegroundColor Green
Write-Host "   OK: GOOGLE_CLOUD_PROJECT=$projectId" -ForegroundColor Green

# Check AWS CLI
Write-Host ""
Write-Host "Checking AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version 2>&1
    Write-Host "   OK: AWS CLI installed: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: AWS CLI not found" -ForegroundColor Red
    exit 1
}

# Check AWS Credentials
Write-Host ""
Write-Host "Checking AWS Credentials..." -ForegroundColor Yellow
try {
    $awsIdentityJson = aws sts get-caller-identity 2>&1
    if ($LASTEXITCODE -eq 0) {
        $awsIdentity = $awsIdentityJson | ConvertFrom-Json
        Write-Host "   OK: AWS credentials configured" -ForegroundColor Green
        Write-Host "      Account: $($awsIdentity.Account)" -ForegroundColor White
        Write-Host "      User: $($awsIdentity.Arn)" -ForegroundColor White
        Write-Host ""
        Write-Host "   WARNING: IAM Permissions Needed:" -ForegroundColor Yellow
        Write-Host "      - AmazonS3FullAccess" -ForegroundColor White
        Write-Host "      - AmazonEC2ContainerRegistryFullAccess" -ForegroundColor White
        Write-Host "      - AWSAppRunnerFullAccess" -ForegroundColor White
        Write-Host "      - CloudFrontFullAccess" -ForegroundColor White
        Write-Host ""
        Write-Host "   INFO: Add permissions at:" -ForegroundColor Cyan
        Write-Host "      https://console.aws.amazon.com/iam/home#/users/Dreamnet" -ForegroundColor White
    } else {
        Write-Host "   ERROR: AWS credentials not configured" -ForegroundColor Red
        Write-Host "   INFO: Run: aws configure" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ERROR: AWS credentials not configured" -ForegroundColor Red
}

# Check AWS SDK packages
Write-Host ""
Write-Host "Checking AWS SDK Packages..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$requiredPackages = @(
    "@aws-sdk/client-amplify",
    "@aws-sdk/client-s3",
    "@aws-sdk/client-lambda",
    "@aws-sdk/client-sts"
)

$missingPackages = @()
foreach ($pkg in $requiredPackages) {
    $found = $false
    if ($packageJson.dependencies.PSObject.Properties.Name -contains $pkg) {
        $found = $true
    }
    if ($packageJson.devDependencies.PSObject.Properties.Name -contains $pkg) {
        $found = $true
    }
    if (-not $found) {
        $missingPackages += $pkg
    }
}

if ($missingPackages.Count -eq 0) {
    Write-Host "   OK: All AWS SDK packages installed" -ForegroundColor Green
} else {
    Write-Host "   WARNING: Missing packages: $($missingPackages -join ', ')" -ForegroundColor Yellow
    Write-Host "   INFO: Install with:" -ForegroundColor Cyan
    Write-Host "      pnpm add -w $($missingPackages -join ' ')" -ForegroundColor White
}

# Summary
Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "Setup Summary" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""

# Google Cloud Status
$gcpProject = gcloud config get-value project 2>&1
if ($gcpProject -and $gcpProject -ne "(unset)") {
    Write-Host "Google Cloud: OK Project set ($gcpProject)" -ForegroundColor Green
} else {
    Write-Host "Google Cloud: WARNING Project not set" -ForegroundColor Yellow
}

$gcpAuth = gcloud config get-value account 2>&1
if ($gcpAuth -and $gcpAuth -ne "(unset)") {
    Write-Host "   OK: Authenticated" -ForegroundColor Green
} else {
    Write-Host "   WARNING: Not authenticated" -ForegroundColor Yellow
}

# AWS Status
try {
    $awsIdentityJson = aws sts get-caller-identity 2>&1
    if ($LASTEXITCODE -eq 0) {
        $awsIdentity = $awsIdentityJson | ConvertFrom-Json
        Write-Host "AWS: OK Credentials configured" -ForegroundColor Green
        Write-Host "   Account: $($awsIdentity.Account)" -ForegroundColor White
    } else {
        Write-Host "AWS: ERROR Credentials not configured" -ForegroundColor Red
    }
} catch {
    Write-Host "AWS: ERROR Credentials not configured" -ForegroundColor Red
}

if ($missingPackages.Count -eq 0) {
    Write-Host "   OK: SDK packages installed" -ForegroundColor Green
} else {
    Write-Host "   WARNING: SDK packages missing" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Complete Google Cloud authentication:" -ForegroundColor White
Write-Host "      gcloud auth application-default login" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Add AWS IAM permissions (if needed):" -ForegroundColor White
Write-Host "      https://console.aws.amazon.com/iam/home#/users/Dreamnet" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Test credentials:" -ForegroundColor White
Write-Host "      pnpm tsx scripts/test-cloud-integrations-simple.ts" -ForegroundColor Gray
Write-Host ""
