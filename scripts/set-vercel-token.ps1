# Quick script to set Vercel token for this session
param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

$env:VERCEL_TOKEN = $Token
Write-Host "✅ VERCEL_TOKEN set for this session"
Write-Host "   Token: $($Token.Substring(0,10))..."
Write-Host ""
Write-Host "Now run: pnpm tsx scripts/check-vercel-status.ts"

