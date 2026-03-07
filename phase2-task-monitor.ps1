# Phase 2: Scale Validation - Task Monitor
# Monitors task dispatch and system metrics during load test

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PHASE 2: SCALE VALIDATION" -ForegroundColor Cyan
Write-Host "Starting task dispatch and monitoring..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$startTime = Get-Date
$taskCheckInterval = 2000  # 2 seconds
$metrics = @{
    tasksCreated = 0
    tasksDispatched = 0
    tasksCompleted = 0
    tasksFailed = 0
    peakQueueLength = 0
    totalLatency = 0
    latencyCount = 0
}

Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Starting task dispatch monitor..." -ForegroundColor Green
Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Polling Redis queue every ${taskCheckInterval}ms" -ForegroundColor Gray

$iteration = 0
$maxIterations = 30  # Run for ~60 seconds

while ($iteration -lt $maxIterations) {
    Start-Sleep -Milliseconds $taskCheckInterval
    $iteration++
    
    # Get current queue length
    $queueLength = docker exec dreamnet_nerve redis-cli LLEN tasks:queue
    $dispatched = docker exec dreamnet_nerve redis-cli GET "tasks:dispatched"
    $completed = docker exec dreamnet_nerve redis-cli GET "tasks:completed"
    $failed = docker exec dreamnet_nerve redis-cli GET "tasks:failed"
    
    # Update metrics
    if ([int]$queueLength -gt $metrics.peakQueueLength) {
        $metrics.peakQueueLength = [int]$queueLength
    }
    
    $metrics.tasksDispatched = if ($dispatched) { [int]$dispatched } else { 0 }
    $metrics.tasksCompleted = if ($completed) { [int]$completed } else { 0 }
    $metrics.tasksFailed = if ($failed) { [int]$failed } else { 0 }
    
    # Display status every 5 iterations
    if ($iteration % 5 -eq 0) {
        $elapsed = (Get-Date) - $startTime
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ($($elapsed.Seconds)s) Queue: $queueLength | Dispatched: $($metrics.tasksDispatched) | Completed: $($metrics.tasksCompleted) | Failed: $($metrics.tasksFailed)" -ForegroundColor Yellow
    }
    
    # Stop if queue is empty and tasks were dispatched
    if ([int]$queueLength -eq 0 -and $metrics.tasksDispatched -gt 0) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Queue emptied. Waiting for completion..." -ForegroundColor Cyan
        Start-Sleep -Seconds 3
        break
    }
}

# Final metrics
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "PHASE 2: RESULTS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$totalTime = (Get-Date) - $startTime
Write-Host "`n⏱️  Total Time: $($totalTime.TotalSeconds) seconds"
Write-Host "📊 Tasks Dispatched: $($metrics.tasksDispatched)"
Write-Host "✅ Tasks Completed: $($metrics.tasksCompleted)"
Write-Host "❌ Tasks Failed: $($metrics.tasksFailed)"
Write-Host "📈 Peak Queue Length: $($metrics.peakQueueLength)"

if ($metrics.tasksDispatched -gt 0) {
    $throughput = $metrics.tasksDispatched / $totalTime.TotalSeconds
    Write-Host "`n🚀 Throughput: $([math]::Round($throughput, 2)) tasks/second"
}

if ($metrics.tasksCompleted -gt 0) {
    $successRate = ($metrics.tasksCompleted / $metrics.tasksDispatched) * 100
    Write-Host "🎯 Success Rate: $([math]::Round($successRate, 1))%"
}

Write-Host "`n========================================`n" -ForegroundColor Green
