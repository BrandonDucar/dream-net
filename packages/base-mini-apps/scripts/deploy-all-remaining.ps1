# Deploy All Remaining Contracts to Base
# Run this from packages/base-mini-apps directory

$ErrorActionPreference = "Continue"

Write-Host "🚀 Deploying All Remaining Contracts to Base" -ForegroundColor Cyan
Write-Host ""

$contracts = @(
    "deploy:social-hub",
    "deploy:wolf-pack",
    "deploy:whale-pack",
    "deploy:treasury",
    "deploy:onboarding",
    "deploy:creator-studio",
    "deploy:social-ops",
    "deploy:inbox-squared",
    "deploy:coinsensei"
)

$successCount = 0
$failCount = 0

foreach ($contract in $contracts) {
    Write-Host ""
    Write-Host "📦 Deploying: $contract" -ForegroundColor Yellow
    Write-Host "─────────────────────────────────────" -ForegroundColor Gray
    
    pnpm $contract
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $contract deployed successfully" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "❌ $contract failed" -ForegroundColor Red
        $failCount++
    }
    
    # Small delay between deployments
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Deployment Summary" -ForegroundColor Cyan
Write-Host "   Successful: $successCount" -ForegroundColor Green
Write-Host "   Failed: $failCount" -ForegroundColor Red
Write-Host "=======================================" -ForegroundColor Cyan

