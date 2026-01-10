# Nuclear Clean - Most Aggressive node_modules Removal
# Uses robocopy trick and handles long paths/corrupted files

Write-Host "Nuclear Clean - Most Aggressive node_modules Removal" -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop ALL processes that might lock files
Write-Host "Step 1: Stopping processes..." -ForegroundColor Yellow
$processesToStop = @("OneDrive", "Code", "node", "pnpm")
foreach ($procName in $processesToStop) {
    $procs = Get-Process | Where-Object {$_.ProcessName -like "*$procName*"}
    if ($procs) {
        Write-Host "   Stopping $procName processes..." -ForegroundColor Yellow
        $procs | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}
Start-Sleep -Seconds 2
Write-Host "   Processes stopped" -ForegroundColor Green

# Step 2: Enable long path support (if admin)
Write-Host ""
Write-Host "Step 2: Checking long path support..." -ForegroundColor Yellow
try {
    $longPathEnabled = (Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -ErrorAction SilentlyContinue).LongPathsEnabled
    if ($longPathEnabled) {
        Write-Host "   Long paths enabled" -ForegroundColor Green
    } else {
        Write-Host "   Long paths not enabled (may cause issues)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   Could not check long path support" -ForegroundColor Yellow
}

# Step 3: Use robocopy trick to delete node_modules
Write-Host ""
Write-Host "Step 3: Removing node_modules using robocopy method..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    # Create empty temp directory
    $tempDir = "temp_empty_$(Get-Random)"
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    
    try {
        Write-Host "   Using robocopy to mirror empty directory..." -ForegroundColor Yellow
        # Robocopy trick: mirror empty dir to target = deletes everything
        $robocopyResult = robocopy $tempDir "node_modules" /MIR /R:0 /W:0 /NP /NFL /NDL /NJH /NJS 2>&1
        
        # Check if it worked
        Start-Sleep -Seconds 2
        if (Test-Path "node_modules") {
            # If still exists, try direct removal
            Write-Host "   Robocopy didn't fully remove, trying direct removal..." -ForegroundColor Yellow
            Get-ChildItem "node_modules" -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
            Remove-Item "node_modules" -Force -Recurse -ErrorAction SilentlyContinue
        }
        
        if (-not (Test-Path "node_modules")) {
            Write-Host "   node_modules removed successfully!" -ForegroundColor Green
        } else {
            Write-Host "   WARNING: node_modules still exists" -ForegroundColor Red
            Write-Host "   Trying alternative method..." -ForegroundColor Yellow
            
            # Alternative: Use cmd /c rmdir
            $cmdResult = cmd /c "rmdir /s /q node_modules" 2>&1
            Start-Sleep -Seconds 1
            
            if (-not (Test-Path "node_modules")) {
                Write-Host "   node_modules removed with cmd rmdir!" -ForegroundColor Green
            } else {
                Write-Host "   ERROR: Could not remove node_modules" -ForegroundColor Red
                Write-Host ""
                Write-Host "   MANUAL FIX REQUIRED:" -ForegroundColor Red
                Write-Host "   1. Close ALL applications (VS Code, terminals, browsers)" -ForegroundColor White
                Write-Host "   2. Open Task Manager (Ctrl+Shift+Esc)" -ForegroundColor White
                Write-Host "   3. End ALL 'node', 'OneDrive', 'Code' processes" -ForegroundColor White
                Write-Host "   4. Right-click node_modules folder -> Delete" -ForegroundColor White
                Write-Host "   5. If that fails, restart computer" -ForegroundColor White
                exit 1
            }
        }
    } finally {
        # Clean up temp directory
        if (Test-Path $tempDir) {
            Remove-Item $tempDir -Force -Recurse -ErrorAction SilentlyContinue
        }
    }
} else {
    Write-Host "   node_modules doesn't exist" -ForegroundColor Gray
}

# Step 4: Clear pnpm cache
Write-Host ""
Write-Host "Step 4: Clearing pnpm cache..." -ForegroundColor Yellow
try {
    pnpm store prune 2>&1 | Out-Null
    Write-Host "   pnpm cache cleared" -ForegroundColor Green
} catch {
    Write-Host "   Warning: Could not clear pnpm cache" -ForegroundColor Yellow
}

# Step 5: Check location
Write-Host ""
Write-Host "Step 5: Checking project location..." -ForegroundColor Yellow
$currentPath = (Get-Location).Path
if ($currentPath -like "*OneDrive*") {
    Write-Host "   WARNING: Project is in OneDrive folder!" -ForegroundColor Red
    Write-Host "   Location: $currentPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   STRONG RECOMMENDATION:" -ForegroundColor Cyan
    Write-Host "   Move project outside OneDrive:" -ForegroundColor White
    Write-Host "   C:\dev\dream-net" -ForegroundColor White
} else {
    Write-Host "   Project location OK" -ForegroundColor Green
}

# Step 6: Ready
Write-Host ""
Write-Host "Ready to run: pnpm install" -ForegroundColor Green
Write-Host ""
Write-Host "Keep OneDrive stopped while installing!" -ForegroundColor Yellow

