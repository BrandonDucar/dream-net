# Setup Firebase Authentication
# Run this script to set up Firebase auth

Write-Host "Setting up Firebase authentication..." -ForegroundColor Cyan

# Check if service account file exists
$serviceAccountPath = "$PSScriptRoot\..\firebase-service-account.json"

if (Test-Path $serviceAccountPath) {
    Write-Host "Found service account file!" -ForegroundColor Green
    
    # Set environment variable
    $env:GOOGLE_APPLICATION_CREDENTIALS = $serviceAccountPath
    Write-Host "Set GOOGLE_APPLICATION_CREDENTIALS=$serviceAccountPath" -ForegroundColor Green
    
    # Verify
    Write-Host "`nVerifying authentication..." -ForegroundColor Cyan
    firebase projects:list
    
} else {
    Write-Host "Service account file not found!" -ForegroundColor Yellow
    Write-Host "Please download it from Firebase Console:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://console.firebase.google.com/" -ForegroundColor Yellow
    Write-Host "2. Select project: DREAMNET V3" -ForegroundColor Yellow
    Write-Host "3. Project Settings → Service Accounts" -ForegroundColor Yellow
    Write-Host "4. Generate New Private Key" -ForegroundColor Yellow
    Write-Host "5. Save as: firebase-service-account.json in project root" -ForegroundColor Yellow
    Write-Host "`nOr use: firebase login" -ForegroundColor Cyan
    Write-Host "`nAfter downloading, run this script again." -ForegroundColor Cyan
}

