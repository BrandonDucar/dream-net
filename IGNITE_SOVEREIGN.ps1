# DreamNet Sovereign Ignition Script
# This script handles the environment repair and launches the Control Core.

param(
    [switch]$SkipClean
)

Write-Host 'Initiating Sovereign Ignition...' -ForegroundColor Cyan

# 0. Clear Port 5000
$connection = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($null -ne $connection) {
    Write-Host '🧹 Clearing Port 5000 (stage reset)...' -ForegroundColor Yellow
    $pidToKill = $connection.OwningProcess
    if ($pidToKill) {
        Write-Host "Killing existing process on port 5000 (PID: $pidToKill)..."
        Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
    }
}

# Ensure we are in the root
if (!(Test-Path 'pnpm-workspace.yaml')) {
    Write-Host 'Error: Please run this script from the monorepo root.' -ForegroundColor Red
    exit
}

if (-not $SkipClean) {
    # 1. Surgical Clean
    Write-Host 'Cleaning corrupt toolchain artifacts...' -ForegroundColor Yellow
    Remove-Item -Path 'node_modules' -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path 'temp_build' -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path 'dist_swc' -Recurse -Force -ErrorAction SilentlyContinue

    # 2. Fresh Restore
    Write-Host 'Restoring dependencies (pnpm install --force)...' -ForegroundColor Yellow
    pnpm install --force
}
else {
    Write-Host 'Skipping cleanup and install. Rapid booting...' -ForegroundColor Cyan
}

# 3. Boot the Control Core
Write-Host 'Launching Control Core (Night Watchman Mode)...' -ForegroundColor Green
npx tsx packages/dreamnet-control-core/src/server.ts
