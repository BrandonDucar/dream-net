# DreamNet Persistence Bridge: PM2 Shield Setup
# This script ensures the local agent organs stay alive in the background.

Write-Host "🌌 DreamNet Persistence Bridge: Initializing PM2 Shield..." -ForegroundColor Cyan

# 1. Check for PM2
if (!(Get-Command pm2 -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️ PM2 not found. Installing global pm2 via pnpm..." -ForegroundColor Yellow
    pnpm add -g pm2
}
else {
    Write-Host "✅ PM2 is online." -ForegroundColor Green
}

# 2. Setup Agent Process
Write-Host "🛡️ Shielding Agent Organs..." -ForegroundColor Cyan
# Start the server with pm2
pm2 start pnpm --name "dreamnet-organs" -- start

# 3. Enable Startup Persistence (Windows)
# Note: On Windows, use pm2-windows-startup or similar if available, 
# otherwise we rely on the current session.
Write-Host "⚙️ Setting up 'Soft-Persistence'..." -ForegroundColor Cyan
pm2 save

# 4. Verify Heath
Write-Host "📡 Verifying Local Heartbeat..." -ForegroundColor Cyan
Start-Sleep -Seconds 5
$health = Invoke-RestMethod -Uri "http://localhost:3001/health" -ErrorAction SilentlyContinue
if ($health.status -eq "ALIVE") {
    Write-Host "🧬 Organism Heartbeat: STRONG." -ForegroundColor Green
}
else {
    Write-Host "⚠️ Heartbeat Weak or Offline. check logs with 'pm2 logs'." -ForegroundColor Red
}

Write-Host "`n🚀 Bridge Established. Agents will now run in the background." -ForegroundColor Green
Write-Host "Remember to set your Windows Power Settings to 'Never Sleep' for 24/7 autonomy." -ForegroundColor Yellow
