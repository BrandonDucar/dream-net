# DreamNet Server Exploration Script
# Checks all systems and reports status

Write-Host "🔍 DreamNet Server Exploration" -ForegroundColor Cyan
Write-Host "=" * 60

$BASE_URL = "http://localhost:3000"
$results = @{}

# 1. Health Check
Write-Host "`n1️⃣ Checking Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get -TimeoutSec 5
    $results.health = $health
    if ($health.ok) {
        Write-Host "   ✅ Server is healthy" -ForegroundColor Green
        Write-Host "   Schema: $($health.details.schema_version)"
        Write-Host "   DB: $($health.details.db_backend)"
        Write-Host "   Security: $($health.details.security.status)"
    } else {
        Write-Host "   ❌ Health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   ⚠️  Server not responding" -ForegroundColor Yellow
    Write-Host "   Error: $_"
    exit 1
}

# 2. Agent Registration Status
Write-Host "`n2️⃣ Checking Agent Registration..." -ForegroundColor Yellow
try {
    $status = Invoke-RestMethod -Uri "$BASE_URL/api/register-agents/status" -Method Get -TimeoutSec 5
    $results.agentStatus = $status
    Write-Host "   Agents: $($status.verification.directoryAgents)"
    Write-Host "   Citizens: $($status.verification.directoryCitizens)"
    Write-Host "   Passports: $($status.verification.passportsIssued)"
    
    if ($status.verification.directoryAgents -lt 143) {
        Write-Host "   ⚠️  Agents need registration" -ForegroundColor Yellow
        Write-Host "   Registering agents..."
        $reg = Invoke-RestMethod -Uri "$BASE_URL/api/register-agents" -Method Post -TimeoutSec 60
        Write-Host "   ✅ Registered: $($reg.summary.registered)" -ForegroundColor Green
        Write-Host "   ✅ Passports: $($reg.summary.passportsIssued)" -ForegroundColor Green
        Write-Host "   ✅ Citizens: $($reg.summary.citizensCreated)" -ForegroundColor Green
    } else {
        Write-Host "   ✅ All agents registered!" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Registration endpoint not available" -ForegroundColor Yellow
}

# 3. Directory Status
Write-Host "`n3️⃣ Checking Directory..." -ForegroundColor Yellow
try {
    $dir = Invoke-RestMethod -Uri "$BASE_URL/api/directory/status" -Method Get -TimeoutSec 5
    $results.directory = $dir
    Write-Host "   Total Entities: $($dir.counts.total)"
    Write-Host "   Agents: $($dir.counts.agents)"
    Write-Host "   Citizens: $($dir.counts.citizens)"
    Write-Host "   Nodes: $($dir.counts.nodes)"
    Write-Host "   Ports: $($dir.counts.ports)"
    Write-Host "   Conduits: $($dir.counts.conduits)"
} catch {
    Write-Host "   ⚠️  Directory endpoint not available" -ForegroundColor Yellow
}

# 4. DreamState
Write-Host "`n4️⃣ Checking DreamState..." -ForegroundColor Yellow
try {
    $dreamState = Invoke-RestMethod -Uri "$BASE_URL/api/dream-state/status" -Method Get -TimeoutSec 5
    $results.dreamState = $dreamState
    Write-Host "   Passports: $($dreamState.passportCount)"
    Write-Host "   Departments: $($dreamState.departmentCount)"
} catch {
    Write-Host "   ⚠️  DreamState endpoint not available" -ForegroundColor Yellow
}

# 5. Star Bridge
Write-Host "`n5️⃣ Checking Star Bridge..." -ForegroundColor Yellow
try {
    $starBridge = Invoke-RestMethod -Uri "$BASE_URL/api/star-bridge/status" -Method Get -TimeoutSec 5
    $results.starBridge = $starBridge
    Write-Host "   ✅ Star Bridge active" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Star Bridge not available" -ForegroundColor Yellow
}

# 6. Wolf Pack
Write-Host "`n6️⃣ Checking Wolf Pack..." -ForegroundColor Yellow
try {
    $wolfPack = Invoke-RestMethod -Uri "$BASE_URL/api/wolf-pack/status" -Method Get -TimeoutSec 5
    $results.wolfPack = $wolfPack
    Write-Host "   ✅ Wolf Pack active" -ForegroundColor Green
    if ($wolfPack.targets) {
        Write-Host "   Targets: $($wolfPack.targets.Count)"
    }
} catch {
    Write-Host "   ⚠️  Wolf Pack not available" -ForegroundColor Yellow
}

# 7. Agent Gateway
Write-Host "`n7️⃣ Checking Agent Gateway..." -ForegroundColor Yellow
try {
    $gateway = Invoke-RestMethod -Uri "$BASE_URL/api/agent/gateway/tools" -Method Get -TimeoutSec 5
    $results.gateway = $gateway
    Write-Host "   ✅ Agent Gateway active" -ForegroundColor Green
    Write-Host "   Total Tools: $($gateway.totalTools)"
    Write-Host "   Available: $($gateway.availableTools)"
} catch {
    Write-Host "   ⚠️  Agent Gateway not available" -ForegroundColor Yellow
}

# Summary
Write-Host "`n📊 Summary" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host "Health: $(if ($results.health.ok) { '✅' } else { '❌' })"
Write-Host "Agents: $($results.agentStatus.verification.directoryAgents)/143"
Write-Host "Directory: $($results.directory.counts.total) entities"
Write-Host "Star Bridge: $(if ($results.starBridge) { '✅' } else { '⚠️' })"
Write-Host "Wolf Pack: $(if ($results.wolfPack) { '✅' } else { '⚠️' })"
Write-Host "Agent Gateway: $(if ($results.gateway) { '✅' } else { '⚠️' })"

Write-Host "`n✅ Exploration complete!" -ForegroundColor Green

