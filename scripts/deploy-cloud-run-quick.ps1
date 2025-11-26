# Quick Cloud Run Deployment Script
# Assumes Docker image is already built and tagged

$ErrorActionPreference = "Stop"

Write-Host "🚀 Quick Cloud Run Deployment" -ForegroundColor Cyan
Write-Host ""

# Get project ID
$PROJECT_ID = $env:GCP_PROJECT_ID
if (-not $PROJECT_ID) {
    $PROJECT_ID = gcloud config get-value project 2>$null
}
if (-not $PROJECT_ID) {
    Write-Host "⚠️  GCP_PROJECT_ID not set." -ForegroundColor Yellow
    $PROJECT_ID = Read-Host "Enter your GCP Project ID"
    gcloud config set project $PROJECT_ID
}

$REGION = if ($env:GCP_REGION) { $env:GCP_REGION } else { "us-central1" }
$SERVICE_NAME = if ($env:GCP_SERVICE_NAME) { $env:GCP_SERVICE_NAME } else { "dreamhub" }
$ARTIFACT_REPO = if ($env:ARTIFACT_REGISTRY_REPO) { $env:ARTIFACT_REGISTRY_REPO } else { "dreamnet-repo" }
$IMAGE_TAG = if ($env:IMAGE_TAG) { $env:IMAGE_TAG } else { "latest" }

$IMAGE_URI = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}/dreamnet:${IMAGE_TAG}"

Write-Host "✅ Project: $PROJECT_ID" -ForegroundColor Green
Write-Host "✅ Region: $REGION" -ForegroundColor Green
Write-Host "✅ Service: $SERVICE_NAME" -ForegroundColor Green
Write-Host "✅ Image: $IMAGE_URI" -ForegroundColor Green
Write-Host ""

# Deploy to Cloud Run with optimized settings
Write-Host "📤 Deploying to Cloud Run..." -ForegroundColor Cyan

gcloud run deploy $SERVICE_NAME `
  --image $IMAGE_URI `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --port 8080 `
  --memory 2Gi `
  --cpu 2 `
  --timeout 300s `
  --max-instances 10 `
  --min-instances 0 `
  --set-env-vars "NODE_ENV=production,PORT=8080,INIT_SUBSYSTEMS=false,INIT_HEAVY_SUBSYSTEMS=false,MESH_AUTOSTART=false" `
  --startup-cpu-boost `
  --cpu-throttling

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    $SERVICE_URL = gcloud run services describe $SERVICE_NAME --region $REGION --format "value(status.url)"
    Write-Host ""
    Write-Host "🌐 Service URL: $SERVICE_URL" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Test health endpoint:" -ForegroundColor Yellow
    Write-Host "   curl $SERVICE_URL/health" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed. Check logs above." -ForegroundColor Red
    exit 1
}

