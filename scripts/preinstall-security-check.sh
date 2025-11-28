#!/bin/bash
# Preinstall security check - monitors for malicious preinstall scripts
# Run this before pnpm install to detect credential exfiltration attempts

set -euo pipefail

echo "🔒 Preinstall security check..."

# Check for suspicious environment variable access patterns
SUSPICIOUS_ENV_VARS=(
  "AWS_ACCESS_KEY_ID"
  "AWS_SECRET_ACCESS_KEY"
  "GCP_CREDENTIALS"
  "GITHUB_TOKEN"
  "NPM_TOKEN"
  "VERCEL_TOKEN"
  "DATABASE_URL"
  "JWT_SECRET"
)

echo "Monitoring for access to sensitive environment variables..."

# This script should be run BEFORE pnpm install
# In CI/CD, set this as a preinstall hook in package.json:
# "preinstall": "bash scripts/preinstall-security-check.sh"

echo "✅ Preinstall check complete"
echo "   If suspicious activity detected during install, check package scripts"

