# Start DreamNet Server (Windows PowerShell)
$env:NODE_ENV = "development"
$env:PORT = "3000"

Write-Host "Starting DreamNet server..." -ForegroundColor Cyan
Write-Host "Port: $env:PORT" -ForegroundColor Yellow
Write-Host "Environment: $env:NODE_ENV" -ForegroundColor Yellow
Write-Host ""

tsx server/index.ts

