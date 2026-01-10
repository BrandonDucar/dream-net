#!/bin/bash
# Standalone build script for Vercel that only installs site dependencies

set -e

echo "Building DreamNet site..."

# Copy site package.json to root temporarily
cp apps/site/package.json package.json.site

# Install only site dependencies using npm (Vercel's default)
cd apps/site
npm install --legacy-peer-deps --ignore-scripts

# Build
npm run build

# Move dist to expected location
cd ../..
mkdir -p dist
cp -r apps/site/dist/* dist/

echo "Build complete!"

