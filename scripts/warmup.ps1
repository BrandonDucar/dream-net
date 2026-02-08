# DreamNet Warm-Up Script
# Eliminates cold starts by probing critical paths and priming caches.

Write-Host "🔥 Initiating DreamNet Warm-Up Sequence..." -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"
$maxRetries = 5
$retryDelay = 2

function Probe-Endpoint ($name, $path) {
    Write-Host "   Pinging $name ($path)..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$path" -Method Head -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host " OK" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host " FAIL" -ForegroundColor Red
        return $false
    }
}

# 1. Flagship Frontend Warm-Up
Write-Host "`n[1/3] Warming Flagship Frontend (.ink)" -ForegroundColor Yellow
Probe-Endpoint "Home" "/"
Probe-Endpoint "Quiz" "/quiz"
Probe-Endpoint "Manifesto" "/manifesto"

# 2. Dashboard Warm-Up
Write-Host "`n[2/3] Warming Swarm Dashboard (.live)" -ForegroundColor Yellow
Probe-Endpoint "Login" "/login"
Probe-Endpoint "Dashboard" "/dashboard"

# 3. API & Cache Priming
Write-Host "`n[3/3] Priming Antigravity API & Redis" -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "http://localhost:3000/api/antigravity/nodes/status" -Method Get | Out-Null
    Write-Host "   Node Status... OK" -ForegroundColor Green
} catch { Write-Host "   Node Status... FAIL" -ForegroundColor Red }

try {
    Invoke-WebRequest -Uri "http://localhost:3000/api/antigravity/pheromone/leaderboard" -Method Get | Out-Null
    Write-Host "   Leaderboard Cache... OK" -ForegroundColor Green
} catch { Write-Host "   Leaderboard Cache... FAIL" -ForegroundColor Red }

Write-Host "`n✅ Warm-Up Complete. Systems Ready." -ForegroundColor Cyan
