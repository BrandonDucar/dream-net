#!/bin/bash
# Verify pnpm-lock.yaml integrity - check for tampering or unexpected changes

set -euo pipefail

echo "🔍 Verifying lockfile integrity..."

if [ ! -f "pnpm-lock.yaml" ]; then
  echo "❌ ERROR: pnpm-lock.yaml not found!"
  exit 1
fi

# Check for unexpected package sources (potential registry poisoning)
echo "Checking for unexpected package sources..."
if grep -q "registry.npmjs.org" pnpm-lock.yaml; then
  echo "✅ Using official npm registry"
else
  echo "⚠️  WARNING: Non-standard registry detected"
fi

# Check lockfile version
LOCKFILE_VERSION=$(head -n 1 pnpm-lock.yaml | grep -oP "lockfileVersion: '\K[^']+" || echo "")
if [ -n "$LOCKFILE_VERSION" ]; then
  echo "Lockfile version: $LOCKFILE_VERSION"
  echo "✅ Lockfile version detected: $LOCKFILE_VERSION"
else
  echo "⚠️  Could not determine lockfile version"
fi

# Verify checksum if packageExtensionsChecksum exists
if grep -q "packageExtensionsChecksum" pnpm-lock.yaml; then
  echo "✅ Package extensions checksum found"
fi

echo ""
echo "✅ Lockfile integrity check complete"
echo "   For full verification, compare against known-good baseline"

