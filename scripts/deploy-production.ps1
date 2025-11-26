# DreamNet Production Deployment Script (PowerShell)
# Deploys to Google Cloud Run with real APIs

$ErrorActionPreference = "Stop"

Write-Host "🚀 DreamNet Production Deployment" -ForegroundColor Cyan
Write-Host ""

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit 1
}

# Get project ID
$PROJECT_ID = $env:GCP_PROJECT_ID
if (-not $PROJECT_ID) {
    $PROJECT_ID = gcloud config get-value project 2>$null
}
if (-not $PROJECT_ID) {
    Write-Host "⚠️  GCP_PROJECT_ID not set." -ForegroundColor Yellow
    $PROJECT_ID = Read-Host "Enter your GCP Project ID"
    $env:GCP_PROJECT_ID = $PROJECT_ID
    gcloud config set project $PROJECT_ID
}

$REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { "us-central1" }
$SERVICE_NAME = if ($env:GCP_SERVICE_NAME) { $env:GCP_SERVICE_NAME } else { "dreamnet" }
$ARTIFACT_REPO = if ($env:ARTIFACT_REGISTRY_REPO) { $env:ARTIFACT_REGISTRY_REPO } else { "dreamnet-repo" }

Write-Host "✅ Using GCP Project: $PROJECT_ID" -ForegroundColor Green
Write-Host "✅ Region: $REGION" -ForegroundColor Green
Write-Host "✅ Service Name: $SERVICE_NAME" -ForegroundColor Green
Write-Host ""

# Step 1: Enable required APIs
Write-Host "📦 Enabling required Google Cloud APIs..." -ForegroundColor Cyan
gcloud services enable cloudbuild.googleapis.com --project=$PROJECT_ID
gcloud services enable run.googleapis.com --project=$PROJECT_ID
gcloud services enable artifactregistry.googleapis.com --project=$PROJECT_ID
gcloud services enable secretmanager.googleapis.com --project=$PROJECT_ID
Write-Host "✅ APIs enabled" -ForegroundColor Green
Write-Host ""

# Step 2: Create Artifact Registry (if doesn't exist)
Write-Host "🐳 Creating Artifact Registry repository..." -ForegroundColor Cyan
$repoExists = gcloud artifacts repositories describe $ARTIFACT_REPO --location=$REGION --project=$PROJECT_ID 2>$null
if (-not $repoExists) {
    gcloud artifacts repositories create $ARTIFACT_REPO `
        --repository-format=docker `
        --location=$REGION `
        --description="DreamNet Docker images" `
        --project=$PROJECT_ID
    Write-Host "✅ Artifact Registry created" -ForegroundColor Green
} else {
    Write-Host "⚠️  Artifact Registry already exists" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Check for secrets
Write-Host "🔐 Checking required secrets..." -ForegroundColor Cyan
$REQUIRED_SECRETS = @(
    "database-url",
    "session-secret"
)

$OPTIONAL_SECRETS = @(
    "openai-api-key",
    "anthropic-api-key",
    "twilio-account-sid",
    "twilio-auth-token",
    "twilio-phone-number",
    "dreamnet-voice-recipient",
    "base-mainnet-rpc-url",
    "base-scan-api-key",
    "vercel-token",
    "stripe-secret-key"
)

$MISSING_SECRETS = @()

foreach ($secret in $REQUIRED_SECRETS) {
    $secretExists = gcloud secrets describe $secret --project=$PROJECT_ID 2>$null
    if (-not $secretExists) {
        $MISSING_SECRETS += $secret
        Write-Host "❌ Missing required secret: $secret" -ForegroundColor Red
    } else {
        Write-Host "✅ Secret exists: $secret" -ForegroundColor Green
    }
}

foreach ($secret in $OPTIONAL_SECRETS) {
    $secretExists = gcloud secrets describe $secret --project=$PROJECT_ID 2>$null
    if ($secretExists) {
        Write-Host "✅ Secret exists: $secret" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Optional secret not found: $secret" -ForegroundColor Yellow
    }
}

if ($MISSING_SECRETS.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Missing required secrets. Create them with:" -ForegroundColor Yellow
    Write-Host "  gcloud secrets create <secret-name> --data-file=- <<< `<"<value>`""
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}
Write-Host ""

# Step 4: Build secrets list for deployment
$SECRETS_ARGS = ""
$allSecrets = $REQUIRED_SECRETS + $OPTIONAL_SECRETS
foreach ($secret in $allSecrets) {
    $secretExists = gcloud secrets describe $secret --project=$PROJECT_ID 2>$null
    if ($secretExists) {
        $UPPER_SECRET = $secret.ToUpper().Replace("-", "_")
        $SECRETS_ARGS += " --set-secrets $UPPER_SECRET=$secret`:latest"
    }
}

# Step 5: Build and deploy
Write-Host "🏗️  Building and deploying to Cloud Run..." -ForegroundColor Cyan
Write-Host ""

# Use Cloud Build
gcloud builds submit --config cloudbuild.yaml `
    --substitutions="_REGION=$REGION,_SERVICE_NAME=$SERVICE_NAME,_ARTIFACT_REGISTRY_REPO=$ARTIFACT_REPO,_MEMORY=2Gi,_CPU=2,_TIMEOUT=300s,_MAX_INSTANCES=10,_MIN_INSTANCES=0" `
    --project=$PROJECT_ID

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""

# Step 6: Update Cloud Run service with secrets
Write-Host "🔐 Updating Cloud Run service with secrets..." -ForegroundColor Cyan
$updateCmd = "gcloud run services update $SERVICE_NAME --region=$REGION --project=$PROJECT_ID $SECRETS_ARGS"
Invoke-Expression $updateCmd

Write-Host ""
Write-Host "✅ Service updated with secrets" -ForegroundColor Green
Write-Host ""

# Step 7: Get service URL
$SERVICE_URL = gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format='value(status.url)'
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Service URL: $SERVICE_URL" -ForegroundColor Cyan
Write-Host ""

# Step 8: Test deployment
Write-Host "🧪 Testing deployment..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$SERVICE_URL/health" -Method GET -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Health check passed" -ForegroundColor Green
    } else {
        Write-Host "❌ Health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    Write-Host "View logs with: gcloud run services logs read $SERVICE_NAME --region=$REGION"
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Green
Write-Host "1. Point DNS for dreamnet.ink to this service"
Write-Host "2. Map custom domain in Cloud Run console"
Write-Host "3. Monitor logs: gcloud run services logs read $SERVICE_NAME --region=$REGION --follow"
Write-Host ""
Write-Host "✅ Production deployment complete!" -ForegroundColor Green

