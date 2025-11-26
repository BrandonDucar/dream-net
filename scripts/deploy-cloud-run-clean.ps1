#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Clean Cloud Run deployment with full output and logging
    
.DESCRIPTION
    Deploys DreamNet to Google Cloud Run with:
    - Clear step-by-step output
    - Real-time log streaming
    - Error handling
    - Service URL display
    - No Docker Desktop required (uses Cloud Build)
    
.EXAMPLE
    .\scripts\deploy-cloud-run-clean.ps1
    
.EXAMPLE
    $env:GCP_PROJECT_ID="your-project"; .\scripts\deploy-cloud-run-clean.ps1
#>

$ErrorActionPreference = "Stop"

# Configuration
$PROJECT_ID = $env:GCP_PROJECT_ID ?? $env:GOOGLE_CLOUD_PROJECT ?? "aqueous-tube-470317-m6"
$REGION = $env:GCP_REGION ?? "us-central1"
$SERVICE_NAME = $env:GCP_SERVICE_NAME ?? "dreamnet"
$ARTIFACT_REGISTRY_REPO = $env:ARTIFACT_REGISTRY_REPO ?? "dreamnet-repo"
$MEMORY = $env:CLOUD_RUN_MEMORY ?? "2Gi"
$CPU = $env:CLOUD_RUN_CPU ?? "2"
$TIMEOUT = $env:CLOUD_RUN_TIMEOUT ?? "300s"
$MAX_INSTANCES = $env:CLOUD_RUN_MAX_INSTANCES ?? "10"
$MIN_INSTANCES = $env:CLOUD_RUN_MIN_INSTANCES ?? "0"

Write-Host "`n🚀 DreamNet Cloud Run Deployment`n" -ForegroundColor Cyan
Write-Host "📋 Configuration:" -ForegroundColor White
Write-Host "   Project: $PROJECT_ID" -ForegroundColor Gray
Write-Host "   Region: $REGION" -ForegroundColor Gray
Write-Host "   Service: $SERVICE_NAME" -ForegroundColor Gray
Write-Host "   Memory: $MEMORY" -ForegroundColor Gray
Write-Host "   CPU: $CPU" -ForegroundColor Gray
Write-Host "   Timeout: $TIMEOUT" -ForegroundColor Gray
Write-Host ""

# Step 1: Check authentication
Write-Host "🔐 Step 1: Checking authentication..." -ForegroundColor Yellow
try {
    $account = gcloud config get-value account 2>&1 | Out-String
    if ($account -match "unset" -or $account -match "ERROR") {
        throw "Not authenticated"
    }
    Write-Host "   ✅ Authenticated: $($account.Trim())" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Not authenticated" -ForegroundColor Red
    Write-Host "   Run: gcloud auth login" -ForegroundColor Yellow
    exit 1
}

# Step 2: Set project
Write-Host "`n📁 Step 2: Setting GCP project..." -ForegroundColor Yellow
try {
    gcloud config set project $PROJECT_ID 2>&1 | Out-Null
    Write-Host "   ✅ Project set to: $PROJECT_ID" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to set project" -ForegroundColor Red
    exit 1
}

# Step 3: Enable required APIs
Write-Host "`n🔌 Step 3: Enabling required APIs..." -ForegroundColor Yellow
$apis = @(
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudresourcemanager.googleapis.com"
)

foreach ($api in $apis) {
    try {
        $enabled = gcloud services list --enabled --filter="name:$api" --format="value(name)" 2>&1 | Out-String
        if ($enabled.Trim() -eq "") {
            Write-Host "   Enabling $api..." -ForegroundColor Gray
            gcloud services enable $api --project=$PROJECT_ID 2>&1 | Out-Null
            Write-Host "   ✅ Enabled: $api" -ForegroundColor Green
        } else {
            Write-Host "   ✅ Already enabled: $api" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⚠️  Warning: Could not enable $api" -ForegroundColor Yellow
    }
}

# Step 4: Create Artifact Registry repository if needed
Write-Host "`n📦 Step 4: Ensuring Artifact Registry repository exists..." -ForegroundColor Yellow
try {
    $repoExists = gcloud artifacts repositories describe $ARTIFACT_REGISTRY_REPO --location=$REGION --project=$PROJECT_ID 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   Creating repository..." -ForegroundColor Gray
        gcloud artifacts repositories create $ARTIFACT_REGISTRY_REPO `
            --repository-format=docker `
            --location=$REGION `
            --project=$PROJECT_ID 2>&1 | Out-Null
        Write-Host "   ✅ Repository created" -ForegroundColor Green
    } else {
        Write-Host "   ✅ Repository exists" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Warning: Could not verify/create repository" -ForegroundColor Yellow
}

# Step 5: Build and deploy using Cloud Build
Write-Host "`n🐳 Step 5: Building Docker image and deploying..." -ForegroundColor Yellow
Write-Host "   This will:" -ForegroundColor Gray
Write-Host "   1. Build Docker image in Google Cloud Build" -ForegroundColor Gray
Write-Host "   2. Push to Artifact Registry" -ForegroundColor Gray
Write-Host "   3. Deploy to Cloud Run" -ForegroundColor Gray
Write-Host "   (No local Docker needed!)" -ForegroundColor Gray
Write-Host ""

try {
    # Submit build with substitutions
    $buildCmd = @(
        "gcloud", "builds", "submit",
        "--config", "cloudbuild.yaml",
        "--substitutions", "_SERVICE_NAME=$SERVICE_NAME,_REGION=$REGION,_ARTIFACT_REGISTRY_REPO=$ARTIFACT_REGISTRY_REPO,_MEMORY=$MEMORY,_CPU=$CPU,_TIMEOUT=$TIMEOUT,_MAX_INSTANCES=$MAX_INSTANCES,_MIN_INSTANCES=$MIN_INSTANCES",
        "--project", $PROJECT_ID
    )
    
    Write-Host "   Running: $($buildCmd -join ' ')" -ForegroundColor Gray
    Write-Host ""
    
    & $buildCmd[0] $buildCmd[1..($buildCmd.Length-1)]
    
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed with exit code $LASTEXITCODE"
    }
    
    Write-Host "`n   ✅ Build and deployment successful!" -ForegroundColor Green
} catch {
    Write-Host "`n   ❌ Build/deployment failed" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "`n   Check logs: gcloud builds list --limit=1" -ForegroundColor Yellow
    exit 1
}

# Step 6: Get service URL
Write-Host "`n🔗 Step 6: Getting service URL..." -ForegroundColor Yellow
try {
    $serviceUrl = gcloud run services describe $SERVICE_NAME `
        --region=$REGION `
        --project=$PROJECT_ID `
        --format="value(status.url)" 2>&1
    
    if ($serviceUrl -and $serviceUrl -notmatch "ERROR") {
        Write-Host "`n   ✅ Service deployed successfully!" -ForegroundColor Green
        Write-Host "`n   🌐 Service URL: $serviceUrl" -ForegroundColor Cyan
        Write-Host "`n   📊 View in console:" -ForegroundColor White
        Write-Host "   https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME?project=$PROJECT_ID" -ForegroundColor Gray
        Write-Host "`n   📝 View logs:" -ForegroundColor White
        Write-Host "   gcloud run services logs read $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --limit=50" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "   ⚠️  Could not retrieve service URL" -ForegroundColor Yellow
        Write-Host "   Check console: https://console.cloud.google.com/run?project=$PROJECT_ID" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Could not get service URL" -ForegroundColor Yellow
    Write-Host "   Check console: https://console.cloud.google.com/run?project=$PROJECT_ID" -ForegroundColor Gray
}

Write-Host "`n✅ Deployment complete!`n" -ForegroundColor Green

