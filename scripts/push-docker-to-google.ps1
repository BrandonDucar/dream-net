# Push Docker Image to Google Artifact Registry
# Run this after a successful docker build

$ErrorActionPreference = "Stop"

Write-Host "🐳 Pushing Docker Image to Google Artifact Registry" -ForegroundColor Cyan
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
$ARTIFACT_REPO = if ($env:ARTIFACT_REGISTRY_REPO) { $env:ARTIFACT_REGISTRY_REPO } else { "dreamnet-repo" }
$IMAGE_NAME = "dreamnet"
$TAG = if ($env:BUILD_TAG) { $env:BUILD_TAG } else { "latest" }

$IMAGE_URI = "${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}/${IMAGE_NAME}:${TAG}"

Write-Host "✅ Project: $PROJECT_ID" -ForegroundColor Green
Write-Host "✅ Region: $REGION" -ForegroundColor Green
Write-Host "✅ Repository: $ARTIFACT_REPO" -ForegroundColor Green
Write-Host "✅ Image URI: $IMAGE_URI" -ForegroundColor Green
Write-Host ""

# Configure Docker to use gcloud as credential helper
Write-Host "🔐 Configuring Docker authentication..." -ForegroundColor Cyan
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet
Write-Host "✅ Docker authenticated" -ForegroundColor Green
Write-Host ""

# Tag the image
Write-Host "🏷️  Tagging image..." -ForegroundColor Cyan
docker tag dreamnet:latest $IMAGE_URI
Write-Host "✅ Image tagged" -ForegroundColor Green
Write-Host ""

# Push the image
Write-Host "📤 Pushing image to Artifact Registry..." -ForegroundColor Cyan
docker push $IMAGE_URI
Write-Host "✅ Image pushed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Done! Image is now in Artifact Registry:" -ForegroundColor Green
Write-Host "   $IMAGE_URI" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next step: Deploy to Cloud Run with:" -ForegroundColor Yellow
Write-Host "   gcloud run deploy dreamnet --image $IMAGE_URI --region $REGION --platform managed" -ForegroundColor White

