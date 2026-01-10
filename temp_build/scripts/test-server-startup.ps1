# Test server startup sequence
Write-Host "Testing server startup dependencies..." -ForegroundColor Cyan

# Check NODE_ENV
Write-Host "`n1. Checking NODE_ENV..." -ForegroundColor Yellow
if ($env:NODE_ENV) {
    Write-Host "   ✅ NODE_ENV=$env:NODE_ENV" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  NODE_ENV not set (will default to development)" -ForegroundColor Yellow
}

# Check critical packages
Write-Host "`n2. Checking critical package imports..." -ForegroundColor Yellow
$packages = @(
    "@dreamnet/directory",
    "@dreamnet/squad-builder",
    "@dreamnet/star-bridge-lungs",
    "@dreamnet/wolf-pack"
)

foreach ($pkg in $packages) {
    try {
        $pkgPath = $pkg -replace "@dreamnet/", "packages/"
        if (Test-Path $pkgPath) {
            Write-Host "   ✅ $pkg exists" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $pkg NOT FOUND" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ⚠️  $pkg check failed: $_" -ForegroundColor Yellow
    }
}

# Check server file
Write-Host "`n3. Checking server/index.ts..." -ForegroundColor Yellow
if (Test-Path "server/index.ts") {
    Write-Host "   ✅ server/index.ts exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ server/index.ts NOT FOUND" -ForegroundColor Red
}

# Try to compile check
Write-Host "`n4. Running TypeScript check..." -ForegroundColor Yellow
try {
    cd server
    $result = pnpm tsx --check index.ts 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ TypeScript check passed" -ForegroundColor Green
    } else {
        Write-Host "   ❌ TypeScript errors:" -ForegroundColor Red
        $result | Select-Object -First 10 | ForEach-Object { Write-Host "      $_" -ForegroundColor Red }
    }
    cd ..
} catch {
    Write-Host "   ⚠️  Could not run TypeScript check: $_" -ForegroundColor Yellow
}

Write-Host "`n✅ Startup test complete!" -ForegroundColor Green

