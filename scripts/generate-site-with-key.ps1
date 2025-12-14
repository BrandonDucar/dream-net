# Generate DreamNet Token Website
# This script prompts for OpenAI API key if not set

if (-not $env:OPENAI_API_KEY) {
    Write-Host "`n🔑 OpenAI API Key not found in environment" -ForegroundColor Yellow
    Write-Host "Please enter your OpenAI API key:" -ForegroundColor Cyan
    $apiKey = Read-Host -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
    $plainKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    $env:OPENAI_API_KEY = $plainKey
    Write-Host "✅ API key set for this session`n" -ForegroundColor Green
}

Write-Host "🚀 Generating beautiful DreamNet Token website...`n" -ForegroundColor Cyan
npx tsx scripts/generate-dream-token-site-ai.ts


