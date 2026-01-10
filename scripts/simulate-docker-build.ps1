$ErrorActionPreference = "Stop"

echo "🧹 Cleaning previous simulation..."
if (Test-Path "temp_build") { Remove-Item -Recurse -Force "temp_build" }

echo "📂 Creating temp_build directory..."
New-Item -ItemType Directory -Path "temp_build" | Out-Null

echo "📦 Copying files (Simulating Docker COPY . .)..."
# Using robocopy for speed and exclusion
robocopy . temp_build /E /XD node_modules .git .next dist .turbo temp_build /XF .env* /NFL /NDL /NJH /NJS /NC /NS /NP

echo "📂 Moving to temp_build..."
cd temp_build

echo "Installing dependencies (Simulating RUN pnpm install)..."
# Use --no-frozen-lockfile as per Dockerfile
pnpm install --no-frozen-lockfile

if ($LASTEXITCODE -ne 0) {
    echo "Install Failed!"
    exit 1
}

echo "Building Server (Simulating RUN cd server && pnpm run build)..."
cd server
pnpm run build

if ($LASTEXITCODE -ne 0) {
    echo "Build Failed!"
    exit 1
}

echo "Simulation Successful!"
