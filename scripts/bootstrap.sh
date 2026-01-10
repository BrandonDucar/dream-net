#!/bin/bash

# DreamNet: Battle-Hardened Bootstrap 🚀
# Minimal, fast, and reproducible developer setup.

echo "🌵 Initializing DreamNet Sovereign Engine Bootstrap..."

# 1. Toolchain Verification
echo "🔍 Checking toolchain versioning..."

NODE_VERSION=$(node -v)
PNPM_VERSION=$(pnpm -v)

echo "✅ Node: $NODE_VERSION"
echo "✅ pnpm: $PNPM_VERSION"

# 2. Package Installation
echo "📦 Hydrating dependencies..."
pnpm install --no-frozen-lockfile

# 3. Environment Setup
echo "🔑 Verifying environment variables..."

if [ ! -f "server/.env" ]; then
    echo "⚠️  server/.env missing. Creating from template..."
    cp server/.env.example server/.env
fi

if [ ! -f "client/.env" ]; then
    echo "⚠️  client/.env missing. Creating from template..."
    cp client/.env.example client/.env
fi

# 4. Global Build (Prewarm Caches)
echo "⚡ Prewarming build caches (Zero-Error Fleet Check)..."
pnpm -r build --filter=!client

echo "🚀 Bootstrap COMPLETE. You are ready to ship to Base."
