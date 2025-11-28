#!/bin/bash
# Pre-deploy security gate - fail fast on security issues
# Run before any deployment to ensure security requirements are met

set -euo pipefail

echo "🔒 Pre-Deploy Security Gate"
echo "============================"

FAILED=0

# Check environment variables
echo ""
echo "=== Environment Variables ==="
REQUIRED_VARS=("NODE_ENV" "DATABASE_URL" "JWT_SECRET" "PUBLIC_BASE_URL")
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "❌ MISSING $var"
    FAILED=1
  else
    echo "✅ OK $var"
  fi
done

# Check Docker image pinning
echo ""
echo "=== Docker Image Pinning ==="
if bash scripts/verify-docker-pinning.sh; then
  echo "✅ Docker images pinned"
else
  echo "❌ UNPINNED Docker images detected"
  FAILED=1
fi

# Check egress connectivity
echo ""
echo "=== Egress Connectivity ==="
if curl -fsS https://api.github.com >/dev/null 2>&1; then
  echo "✅ Egress OK"
else
  echo "❌ FAIL Egress connectivity"
  FAILED=1
fi

# Check GCP Cloud Run (if applicable)
echo ""
echo "=== GCP Cloud Run ==="
if command -v gcloud &> /dev/null; then
  if gcloud run services describe dreamnet-api --region=us-central1 --format="value(status.url)" >/dev/null 2>&1; then
    echo "✅ Cloud Run service accessible"
  else
    echo "⚠️  Cloud Run service not found or not accessible"
  fi
else
  echo "⚠️  gcloud CLI not available (skipping Cloud Run check)"
fi

# Check GitHub OIDC (if applicable)
echo ""
echo "=== GitHub OIDC ==="
if command -v gh &> /dev/null; then
  if gh secret list 2>/dev/null | grep -q "GCP_WORKLOAD_IDENTITY_PROVIDER"; then
    echo "✅ GitHub OIDC configured"
  else
    echo "⚠️  GitHub OIDC not configured (optional)"
  fi
else
  echo "⚠️  gh CLI not available (skipping GitHub OIDC check)"
fi

# Final result
echo ""
echo "============================"
if [ $FAILED -eq 1 ]; then
  echo "❌ SECURITY GATE FAILED"
  echo "   Fix issues above before deploying"
  exit 1
else
  echo "✅ Security gate passed"
  echo "   Safe to deploy"
fi

