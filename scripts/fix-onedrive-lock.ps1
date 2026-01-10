# Fix OneDrive File Locking Issue
# This script helps resolve EPERM errors during pnpm install

Write-Host "Fixing OneDrive File Locking Issue" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop OneDrive temporarily
Write-Host "Step 1: Stopping OneDrive sync..." -ForegroundColor Yellow
$onedriveProcesses = Get-Process | Where-Object {$_.ProcessName -like "*OneDrive*"}
if ($onedriveProcesses) {
    Write-Host "   Found OneDrive processes, stopping..." -ForegroundColor Yellow
    $onedriveProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "   OneDrive stopped" -ForegroundColor Green
} else {
    Write-Host "   OneDrive not running" -ForegroundColor Gray
}

# Step 2: Remove node_modules if it exists
Write-Host ""
Write-Host "Step 2: Cleaning node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   Removing node_modules directory..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Write-Host "   node_modules removed" -ForegroundColor Green
} else {
    Write-Host "   node_modules doesn't exist" -ForegroundColor Gray
}

# Step 3: Remove pnpm store cache
Write-Host ""
Write-Host "Step 3: Cleaning pnpm store..." -ForegroundColor Yellow
$pnpmStore = "$env:APPDATA\pnpm\store"
if (Test-Path $pnpmStore) {
    Write-Host "   Clearing pnpm store cache..." -ForegroundColor Yellow
    pnpm store prune 2>&1 | Out-Null
    Write-Host "   pnpm store cleaned" -ForegroundColor Green
} else {
    Write-Host "   pnpm store not found" -ForegroundColor Gray
}

# Step 4: Exclude node_modules from OneDrive sync (if possible)
Write-Host ""
Write-Host "Step 4: Recommendations:" -ForegroundColor Yellow
Write-Host "   To prevent this issue in the future:" -ForegroundColor Cyan
Write-Host "      1. Move project outside OneDrive folder" -ForegroundColor White
Write-Host "      2. Or exclude 'node_modules' from OneDrive sync:" -ForegroundColor White
Write-Host "         - Right-click node_modules folder" -ForegroundColor White
Write-Host "         - Choose 'Always keep on this device'" -ForegroundColor White
Write-Host "         - Or pause OneDrive sync while developing" -ForegroundColor White

# Step 5: Ready to install
Write-Host ""
Write-Host "Ready to run: pnpm install" -ForegroundColor Green
Write-Host ""
Write-Host "Note: OneDrive is stopped. Restart it manually if needed." -ForegroundColor Yellow
