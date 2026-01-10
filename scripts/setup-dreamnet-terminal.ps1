# DreamNet Terminal Setup for PowerShell
# Makes your Cursor terminal DreamNet-aware

Write-Host "💬 Setting up DreamNet Natural Language Terminal..." -ForegroundColor Cyan

# Create DreamNet function that wraps commands
$dreamnetFunction = @'
function DreamNet {
    param([string]$command)
    
    if ($command -eq "" -or $command -eq $null) {
        # Start interactive shell
        pnpm dreamnet:shell
    } else {
        # Pass to CLI
        pnpm dreamnet $command
    }
}

# Alias for quick access
Set-Alias -Name dn -Value DreamNet

Write-Host "✅ DreamNet terminal ready!" -ForegroundColor Green
Write-Host "💡 Type 'DreamNet' or 'dn' to start, or 'dn deploy' to deploy" -ForegroundColor Yellow
'@

# Add to PowerShell profile
$profilePath = $PROFILE.CurrentUserAllHosts
$profileDir = Split-Path $profilePath -Parent

if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
}

# Append to profile
Add-Content -Path $profilePath -Value "`n$dreamnetFunction"

Write-Host "✅ DreamNet added to your PowerShell profile!" -ForegroundColor Green
Write-Host "💡 Restart your terminal or run: . `$PROFILE" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then you can use:" -ForegroundColor Cyan
Write-Host "   DreamNet 'deploy to cloud run'" -ForegroundColor White
Write-Host "   dn 'show me all verticals'" -ForegroundColor White
Write-Host "   DreamNet  (starts interactive shell)" -ForegroundColor White

