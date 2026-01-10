# Force Clean Install - Aggressive OneDrive Fix
# This script forcefully removes node_modules and handles OneDrive locks

Write-Host "Force Clean Install - Aggressive OneDrive Fix" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop ALL OneDrive processes aggressively
Write-Host "Step 1: Stopping ALL OneDrive processes..." -ForegroundColor Yellow
$onedriveProcesses = Get-Process | Where-Object {$_.ProcessName -like "*OneDrive*"}
if ($onedriveProcesses) {
    Write-Host "   Found $($onedriveProcesses.Count) OneDrive process(es)" -ForegroundColor Yellow
    foreach ($proc in $onedriveProcesses) {
        Write-Host "   Stopping: $($proc.ProcessName) (PID: $($proc.Id))" -ForegroundColor Yellow
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 3
    Write-Host "   OneDrive processes stopped" -ForegroundColor Green
} else {
    Write-Host "   No OneDrive processes found" -ForegroundColor Gray
}

# Step 2: Unlock and remove node_modules with retries
Write-Host ""
Write-Host "Step 2: Force removing node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $maxRetries = 5
    $retryCount = 0
    $removed = $false
    
    while ($retryCount -lt $maxRetries -and -not $removed) {
        $retryCount++
        Write-Host "   Attempt $($retryCount) of $($maxRetries): Removing node_modules..." -ForegroundColor Yellow
        
        try {
            # Try to remove specific locked file first
            $lockedFile = "node_modules\.pnpm\bufferutil@4.0.9\node_modules\bufferutil\prebuilds\win32-x64\bufferutil.node"
            if (Test-Path $lockedFile) {
                Write-Host "   Removing locked file: $lockedFile" -ForegroundColor Yellow
                Remove-Item -Path $lockedFile -Force -ErrorAction SilentlyContinue
            }
            
            # Remove entire node_modules
            Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction Stop
            $removed = $true
            Write-Host "   node_modules removed successfully" -ForegroundColor Green
        } catch {
            Write-Host "   Failed: $($_.Exception.Message)" -ForegroundColor Red
            if ($retryCount -lt $maxRetries) {
                Write-Host "   Waiting 2 seconds before retry..." -ForegroundColor Yellow
                Start-Sleep -Seconds 2
                
                # Try stopping OneDrive again
                $onedriveProcesses = Get-Process | Where-Object {$_.ProcessName -like "*OneDrive*"}
                if ($onedriveProcesses) {
                    $onedriveProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Seconds 1
                }
            }
        }
    }
    
    if (-not $removed) {
        Write-Host ""
        Write-Host "ERROR: Could not remove node_modules after $($maxRetries) attempts" -ForegroundColor Red
        Write-Host ""
        Write-Host "Manual steps:" -ForegroundColor Yellow
        Write-Host "1. Close ALL applications (VS Code, terminals, etc.)" -ForegroundColor White
        Write-Host "2. Open Task Manager (Ctrl+Shift+Esc)" -ForegroundColor White
        Write-Host "3. End ALL 'OneDrive' processes" -ForegroundColor White
        Write-Host "4. Manually delete the 'node_modules' folder" -ForegroundColor White
        Write-Host "5. Run 'pnpm install' again" -ForegroundColor White
        exit 1
    }
} else {
    Write-Host "   node_modules doesn't exist" -ForegroundColor Gray
}

# Step 3: Clear pnpm cache
Write-Host ""
Write-Host "Step 3: Clearing pnpm cache..." -ForegroundColor Yellow
try {
    pnpm store prune 2>&1 | Out-Null
    Write-Host "   pnpm cache cleared" -ForegroundColor Green
} catch {
    Write-Host "   Warning: Could not clear pnpm cache" -ForegroundColor Yellow
}

# Step 4: Check if we're in OneDrive
Write-Host ""
Write-Host "Step 4: Checking project location..." -ForegroundColor Yellow
$currentPath = (Get-Location).Path
if ($currentPath -like "*OneDrive*") {
    Write-Host "   WARNING: Project is in OneDrive folder!" -ForegroundColor Red
    Write-Host "   Location: $currentPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   RECOMMENDATION:" -ForegroundColor Cyan
    Write-Host "   Move project outside OneDrive to prevent future issues:" -ForegroundColor White
    Write-Host "   1. Move to: C:\dev\dream-net (or similar)" -ForegroundColor White
    Write-Host "   2. Or exclude 'node_modules' from OneDrive sync" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "   Project is NOT in OneDrive folder" -ForegroundColor Green
}

# Step 5: Ready to install
Write-Host ""
Write-Host "Ready to run: pnpm install" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Keep OneDrive stopped while installing!" -ForegroundColor Yellow
Write-Host "Run 'pnpm install' now, then restart OneDrive manually if needed." -ForegroundColor Yellow

