#!/bin/bash
# Audit dependencies for supply-chain attacks (Shai-Hulud 2.0, CVE-2025-10894)
# Scans for compromised packages and suspicious activity

set -euo pipefail

echo "🔍 Running supply-chain security audit..."

# Run pnpm audit
echo ""
echo "=== Dependency Audit ==="
pnpm audit --audit-level=high || {
  echo "⚠️  High-severity vulnerabilities found. Review above."
}

# Check for Nx (CVE-2025-10894)
echo ""
echo "=== Checking for CVE-2025-10894 (Nx) ==="
if grep -q "\"nx\"" package.json || grep -q "\"@nx/" package.json; then
  echo "⚠️  WARNING: Nx detected - check for CVE-2025-10894"
  echo "   Review: https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2025-10894"
  echo "   Update to patched version if available"
else
  echo "✅ No Nx found (CVE-2025-10894 does not apply)"
fi

# Check for suspicious preinstall/postinstall scripts
echo ""
echo "=== Checking for suspicious package scripts ==="
SUSPICIOUS=0
if [ -d "node_modules" ]; then
  # Look for packages with preinstall/postinstall that access env vars or network
  for pkg_dir in node_modules/*/; do
    if [ -f "${pkg_dir}package.json" ]; then
      pkg_name=$(jq -r '.name' "${pkg_dir}package.json" 2>/dev/null || echo "")
      if [ -n "$pkg_name" ]; then
        # Check for suspicious script patterns
        if grep -q "preinstall\|postinstall" "${pkg_dir}package.json" 2>/dev/null; then
          scripts=$(jq -r '.scripts | to_entries[] | "\(.key):\(.value)"' "${pkg_dir}package.json" 2>/dev/null || echo "")
          if echo "$scripts" | grep -qiE "(curl|wget|fetch|http|process\.env|AWS_|GCP_|GITHUB_)"; then
            echo "⚠️  Suspicious scripts in $pkg_name:"
            echo "$scripts" | grep -iE "(curl|wget|fetch|http|process\.env|AWS_|GCP_|GITHUB_)" || true
            SUSPICIOUS=1
          fi
        fi
      fi
    fi
  done
fi

if [ $SUSPICIOUS -eq 0 ]; then
  echo "✅ No obviously suspicious package scripts detected"
else
  echo "⚠️  Suspicious package scripts found - review manually"
fi

# Check lockfile integrity
echo ""
echo "=== Lockfile Integrity Check ==="
if [ -f "pnpm-lock.yaml" ]; then
  echo "✅ pnpm-lock.yaml exists"
  # Check for unexpected sources
  if grep -q "registry.npmjs.org" pnpm-lock.yaml; then
    echo "✅ Using official npm registry"
  fi
else
  echo "❌ ERROR: pnpm-lock.yaml not found!"
  exit 1
fi

echo ""
echo "=== Audit Summary ==="
echo "Review audit output above for security issues"
echo "If high-severity CVEs found, update packages immediately"

