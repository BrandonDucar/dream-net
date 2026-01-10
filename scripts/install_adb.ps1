# ADB Auto-Installer
$ErrorActionPreference = "Stop"

$Url = "https://dl.google.com/android/repository/platform-tools-latest-windows.zip"
$ToolsDir = Join-Path (Get-Location) "..\tools"
$ZipPath = Join-Path $ToolsDir "platform-tools.zip"

# Create tools dir
if (!(Test-Path $ToolsDir)) { New-Item -ItemType Directory -Path $ToolsDir | Out-Null }

Write-Host "Downloading ADB..."
Invoke-WebRequest -Uri $Url -OutFile $ZipPath

Write-Host "Extracting..."
Expand-Archive -Path $ZipPath -DestinationPath $ToolsDir -Force

# Locate adb.exe
$AdbPath = Join-Path $ToolsDir "platform-tools"
if (Test-Path (Join-Path $AdbPath "adb.exe")) {
    Write-Host "ADB Installed."
    
    # Add to Path for this session
    $env:Path = $env:Path + ";" + $AdbPath
    
    & "$AdbPath\adb.exe" devices
}
else {
    Write-Host "Failed to locate adb.exe"
}

# Cleanup
Remove-Item $ZipPath -Force
