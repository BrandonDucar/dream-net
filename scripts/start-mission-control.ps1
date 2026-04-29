# Start DreamNet Sovereign Agents in Background
# Prevents terminals from popping up all over the screen

$Agents = @("clawedette", "hawk", "sable", "lil-miss-claw")

Write-Host "🚀 Initializing Sovereign Mission Control..." -ForegroundColor Cyan

foreach ($Agent in $Agents) {
    Write-Host "📡 Starting Agent: $Agent in background..." -ForegroundColor Yellow
    # Start-Process with -WindowStyle Hidden to prevent popups
    Start-Process npx -ArgumentList "tsx", "services/broadcasters/activity-broadcaster.ts", "--agent", $Agent -WindowStyle Hidden
}

Write-Host "✅ All organs are functioning in the shadows." -ForegroundColor Green
Write-Host "📊 Monitor activity on the Message Bus or Discord Webhooks." -ForegroundColor Green
