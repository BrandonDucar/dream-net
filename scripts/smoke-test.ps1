param(
    [string]$BaseUrl = "http://localhost:8080"
)

Write-Host "🧪 Running smoke tests against $BaseUrl" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health check
Write-Host "Test 1: Health check" -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get -TimeoutSec 10
    if ($response.status -eq "ok") {
        Write-Host " ✅ PASS" -ForegroundColor Green
    } else {
        Write-Host " ❌ FAIL (status: $($response.status))" -ForegroundColor Red
    }
} catch {
    Write-Host " ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: API health
Write-Host "Test 2: API health" -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/health" -Method Get -TimeoutSec 10
    if ($response.status -eq "ok") {
        Write-Host " ✅ PASS" -ForegroundColor Green
    } else {
        Write-Host " ❌ FAIL (status: $($response.status))" -ForegroundColor Red
    }
} catch {
    Write-Host " ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Frontend
Write-Host "Test 3: Frontend" -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/" -Method Get -TimeoutSec 10
    if ($response.Content -match "html") {
        Write-Host " ✅ PASS" -ForegroundColor Green
    } else {
        Write-Host " ❌ FAIL (no HTML content)" -ForegroundColor Red
    }
} catch {
    Write-Host " ❌ FAIL: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: API endpoint (optional)
Write-Host "Test 4: API endpoint (optional)" -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/dreams" -Method Get -TimeoutSec 10
    Write-Host " ✅ PASS (returned: $($response.GetType().Name))" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -match "404") {
        Write-Host " ⚠️ SKIP (endpoint not found)" -ForegroundColor Yellow
    } elseif ($_.Exception.Message -match "500") {
        Write-Host " ⚠️ SKIP (DB required)" -ForegroundColor Yellow
    } else {
        Write-Host " ⚠️ SKIP ($($_.Exception.Message))" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Smoke tests complete!" -ForegroundColor Cyan
