# docker-cleanup.ps1
# Reclaims Docker disk space by removing:
#   - Dangling images (untagged, not used by any container)
#   - Stopped containers
#   - Unused networks
#   - Volumes NOT currently mounted by a running container
#
# Does NOT touch:
#   - Running containers
#   - Images actively used by running containers
#   - Named volumes for: nerve_data, passports_data, goose_config
#
# Run with: .\scripts\docker-cleanup.ps1
# Run aggressive (removes ALL unused images): .\scripts\docker-cleanup.ps1 -Aggressive

param(
    [switch]$Aggressive,
    [switch]$DryRun
)

$PROTECTED_VOLUMES = @("nerve_data", "passports_data", "goose_config", "portainer_data")

Write-Host ""
Write-Host "=== DreamNet Docker Cleanup ===" -ForegroundColor Cyan
Write-Host ""

# Show current usage
Write-Host "--- Before ---" -ForegroundColor Yellow
docker system df
Write-Host ""

if ($DryRun) {
    Write-Host "[DRY RUN] No changes will be made." -ForegroundColor Magenta
    Write-Host ""
}

# 1. Remove stopped containers
Write-Host "Removing stopped containers..." -ForegroundColor Green
if (-not $DryRun) {
    docker container prune -f
}

# 2. Remove dangling images (untagged layers)
Write-Host "Removing dangling images..." -ForegroundColor Green
if (-not $DryRun) {
    docker image prune -f
}

# 3. Remove unused networks
Write-Host "Removing unused networks..." -ForegroundColor Green
if (-not $DryRun) {
    docker network prune -f
}

# 4. Build cache
Write-Host "Removing build cache..." -ForegroundColor Green
if (-not $DryRun) {
    docker builder prune -f
}

# 5. Aggressive: remove ALL unused images (big savings — ollama 9GB, mindsdb 3.7GB, etc.)
if ($Aggressive) {
    Write-Host ""
    Write-Host "AGGRESSIVE MODE: removing ALL unused images (not just dangling)" -ForegroundColor Red
    Write-Host "This will remove: ollama (9GB), mindsdb (3.7GB), old dream-net builds, etc." -ForegroundColor Red
    Write-Host "They will re-pull from Docker Hub / GHCR next time you need them." -ForegroundColor Yellow
    Write-Host ""
    $confirm = Read-Host "Type YES to continue"
    if ($confirm -eq "YES") {
        if (-not $DryRun) {
            docker image prune -a -f
        }
        Write-Host "Done. Massive images removed." -ForegroundColor Green
    } else {
        Write-Host "Skipped aggressive image prune." -ForegroundColor Yellow
    }
}

# 6. Orphan volumes (skip protected ones)
Write-Host ""
Write-Host "Checking for orphan volumes (skipping protected: $($PROTECTED_VOLUMES -join ', '))..." -ForegroundColor Green
$orphanVolumes = docker volume ls -qf dangling=true 2>&1
if ($orphanVolumes) {
    foreach ($vol in $orphanVolumes) {
        $volName = $vol.Trim()
        $isProtected = $PROTECTED_VOLUMES | Where-Object { $volName -like "*$_*" }
        if ($isProtected) {
            Write-Host "  SKIP (protected): $volName" -ForegroundColor Yellow
        } else {
            Write-Host "  Removing orphan volume: $volName" -ForegroundColor Red
            if (-not $DryRun) {
                docker volume rm $volName 2>&1 | Out-Null
            }
        }
    }
} else {
    Write-Host "  No orphan volumes found." -ForegroundColor Gray
}

Write-Host ""
Write-Host "--- After ---" -ForegroundColor Yellow
docker system df
Write-Host ""
Write-Host "=== Cleanup complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  Push images to GHCR:  gh workflow run ghcr-publish.yml" -ForegroundColor Gray
Write-Host "  Pull from GHCR:       docker compose pull" -ForegroundColor Gray
Write-Host "  Aggressive clean:     .\scripts\docker-cleanup.ps1 -Aggressive" -ForegroundColor Gray
