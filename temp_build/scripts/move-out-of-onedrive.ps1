# Move DreamNet Outside OneDrive
# Moves the entire project to C:\dev\dream-net

Write-Host "Moving DreamNet Outside OneDrive" -ForegroundColor Cyan
Write-Host ""

$sourcePath = "C:\Users\brand\OneDrive\Documents\GitHub\dream-net"
$destPath = "C:\dev\dream-net"

# Step 1: Check if source exists
Write-Host "Step 1: Checking source location..." -ForegroundColor Yellow
if (-not (Test-Path $sourcePath)) {
    Write-Host "   ERROR: Source path not found: $sourcePath" -ForegroundColor Red
    Write-Host "   Current directory: $((Get-Location).Path)" -ForegroundColor Yellow
    Write-Host "   Run this script from the dream-net directory" -ForegroundColor Yellow
    exit 1
}
Write-Host "   Source found: $sourcePath" -ForegroundColor Green

# Step 2: Stop processes
Write-Host ""
Write-Host "Step 2: Stopping processes that might lock files..." -ForegroundColor Yellow
$processesToStop = @("OneDrive", "Code", "node", "pnpm")
foreach ($procName in $processesToStop) {
    $procs = Get-Process | Where-Object {$_.ProcessName -like "*$procName*"}
    if ($procs) {
        Write-Host "   Stopping $procName..." -ForegroundColor Yellow
        $procs | Stop-Process -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 2
Write-Host "   Processes stopped" -ForegroundColor Green

# Step 3: Create destination directory
Write-Host ""
Write-Host "Step 3: Creating destination directory..." -ForegroundColor Yellow
if (-not (Test-Path "C:\dev")) {
    Write-Host "   Creating C:\dev directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "C:\dev" -Force | Out-Null
}
if (Test-Path $destPath) {
    Write-Host "   WARNING: Destination already exists: $destPath" -ForegroundColor Red
    Write-Host "   Do you want to overwrite? (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "   Cancelled" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "   Removing existing destination..." -ForegroundColor Yellow
    Remove-Item -Path $destPath -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $destPath -Force | Out-Null
Write-Host "   Destination created: $destPath" -ForegroundColor Green

# Step 4: Move files using robocopy (most reliable)
Write-Host ""
Write-Host "Step 4: Moving files (this may take 5-10 minutes)..." -ForegroundColor Yellow
Write-Host "   Source: $sourcePath" -ForegroundColor Gray
Write-Host "   Destination: $destPath" -ForegroundColor Gray
Write-Host ""

# Use robocopy to move (MOVE mode)
# /MOVE = move files and directories (delete from source)
# /E = copy subdirectories including empty ones
# /NFL = no file list (less output)
# /NDL = no directory list
# /NP = no progress
# /R:3 = retry 3 times
# /W:5 = wait 5 seconds between retries
try {
    $robocopyResult = robocopy $sourcePath $destPath /MOVE /E /NFL /NDL /NP /R:3 /W:5
    
    # Check robocopy exit code
    # 0-7 = success, 8+ = errors
    if ($LASTEXITCODE -le 7) {
        Write-Host ""
        Write-Host "   Files moved successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "   WARNING: Some files may not have moved (exit code: $LASTEXITCODE)" -ForegroundColor Yellow
        Write-Host "   Checking what's left..." -ForegroundColor Yellow
        
        # Check if source still has files
        $remainingFiles = Get-ChildItem -Path $sourcePath -Recurse -ErrorAction SilentlyContinue | Measure-Object
        if ($remainingFiles.Count -gt 0) {
            Write-Host "   $($remainingFiles.Count) files/directories still in source" -ForegroundColor Yellow
            Write-Host "   You may need to manually move remaining files" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host ""
    Write-Host "   ERROR: Failed to move files: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Try manual move or restart computer first" -ForegroundColor Yellow
    exit 1
}

# Step 5: Verify move
Write-Host ""
Write-Host "Step 5: Verifying move..." -ForegroundColor Yellow
if (Test-Path "$destPath\package.json") {
    Write-Host "   package.json found in destination - move successful!" -ForegroundColor Green
} else {
    Write-Host "   WARNING: package.json not found in destination" -ForegroundColor Red
    Write-Host "   Move may have failed" -ForegroundColor Yellow
    exit 1
}

# Step 6: Update git remote if needed
Write-Host ""
Write-Host "Step 6: Checking Git..." -ForegroundColor Yellow
if (Test-Path "$destPath\.git") {
    Write-Host "   Git repository detected" -ForegroundColor Green
    Write-Host "   Git should work fine in new location" -ForegroundColor Green
} else {
    Write-Host "   No Git repository found" -ForegroundColor Gray
}

# Step 7: Final instructions
Write-Host ""
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host "MOVE COMPLETE!" -ForegroundColor Green
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host ""
Write-Host "New location: $destPath" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Close this terminal" -ForegroundColor White
Write-Host "2. Open new terminal" -ForegroundColor White
Write-Host "3. Navigate to: cd C:\dev\dream-net" -ForegroundColor White
Write-Host "4. Run: pnpm install" -ForegroundColor White
Write-Host ""
Write-Host "Note: Old location may still exist with some files." -ForegroundColor Yellow
Write-Host "You can delete it after verifying everything works in new location." -ForegroundColor Yellow
Write-Host ""

