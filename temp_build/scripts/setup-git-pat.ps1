# GitHub PAT Setup Script
# This script configures git to use a Personal Access Token for authentication

Write-Host "=== GitHub PAT Authentication Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if PAT is provided as argument
if ($args.Count -eq 0) {
    Write-Host "Usage: .\scripts\setup-git-pat.ps1 YOUR_PAT_TOKEN" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or set GITHUB_PAT environment variable:" -ForegroundColor Yellow
    Write-Host "  `$env:GITHUB_PAT = 'your_token_here'" -ForegroundColor Yellow
    Write-Host "  .\scripts\setup-git-pat.ps1" -ForegroundColor Yellow
    Write-Host ""
    
    # Check for environment variable
    if ($env:GITHUB_PAT) {
        $pat = $env:GITHUB_PAT
        Write-Host "Found GITHUB_PAT in environment variables" -ForegroundColor Green
    } else {
        Write-Host "Please provide your GitHub PAT token:" -ForegroundColor Yellow
        Write-Host "1. Get it from: https://github.com/settings/tokens" -ForegroundColor Cyan
        Write-Host "2. Create a token with 'repo' scope" -ForegroundColor Cyan
        Write-Host "3. Run: `$env:GITHUB_PAT = 'your_token'; .\scripts\setup-git-pat.ps1" -ForegroundColor Cyan
        exit 1
    }
} else {
    $pat = $args[0]
}

# Validate PAT format (starts with ghp_ or gho_)
if ($pat -notmatch '^gh[po]_') {
    Write-Host "Warning: PAT doesn't match expected format (ghp_... or gho_...)" -ForegroundColor Yellow
    Write-Host "Continuing anyway..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Configuring git to use PAT token..." -ForegroundColor Cyan

# Update remote URL to include PAT token
$remoteUrl = "https://${pat}@github.com/BDucar/dream-net.git"

Write-Host "Setting remote URL with PAT..." -ForegroundColor Yellow
git remote set-url origin $remoteUrl

Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Cyan
$testResult = git ls-remote origin 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Successfully authenticated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now push with:" -ForegroundColor Cyan
    Write-Host "  git push origin main" -ForegroundColor White
} else {
    Write-Host "✗ Authentication failed!" -ForegroundColor Red
    Write-Host $testResult
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Verify your PAT token is correct" -ForegroundColor White
    Write-Host "2. Ensure token has 'repo' scope" -ForegroundColor White
    Write-Host "3. Check if token has expired" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green

