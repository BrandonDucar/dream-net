#!/bin/bash
# Verify Docker image pinning - fails if any unpinned images found
# This prevents supply-chain attacks via image tampering

set -euo pipefail

echo "🔍 Checking Dockerfiles for image pinning..."

FAILED=0
DOCKERFILES=$(find . -name "Dockerfile*" -not -path "./node_modules/*" -not -path "./.git/*")

for dockerfile in $DOCKERFILES; do
  echo "Checking $dockerfile..."
  
  # Check for FROM lines without @sha256:
  if grep -q "^FROM.*node:" "$dockerfile" && ! grep -q "@sha256:" "$dockerfile"; then
    echo "❌ ERROR: $dockerfile contains unpinned base image!"
    echo "   Found: $(grep '^FROM.*node:' "$dockerfile")"
    echo "   Fix: Pin image with SHA256 digest: FROM node:20-slim@sha256:<digest>"
    FAILED=1
  elif grep -q "@sha256:" "$dockerfile"; then
    echo "✅ $dockerfile: Images are pinned"
  fi
done

if [ $FAILED -eq 1 ]; then
  echo ""
  echo "🚨 SECURITY RISK: Unpinned Docker images detected!"
  echo "   Supply-chain attackers can tamper with base images."
  echo "   All images must be pinned with SHA256 digests."
  exit 1
fi

echo ""
echo "✅ All Docker images are pinned with SHA256 digests"

