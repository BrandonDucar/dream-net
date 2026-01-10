# Simple server check script
$maxAttempts = 20
$attempt = 0

Write-Host "Monitoring server startup..." -ForegroundColor Cyan

while ($attempt -lt $maxAttempts) {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        $json = $response.Content | ConvertFrom-Json
        
        if ($json.ok) {
            Write-Host "`n✅ SERVER IS UP!" -ForegroundColor Green
            Write-Host "Health: $($json.ok)"
            Write-Host "Schema: $($json.details.schema_version)"
            Write-Host "DB: $($json.details.db_backend)"
            Write-Host "Security: $($json.details.security.status)"
            exit 0
        }
    } catch {
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 3
    }
}

Write-Host "`n⚠️ Server not responding after $maxAttempts attempts" -ForegroundColor Yellow
exit 1

