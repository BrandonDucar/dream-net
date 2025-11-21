#!/bin/bash
# Activate Phase 1: Government Offices
# Run this after infrastructure is ready

set -e

echo "🏛️ Activating Phase 1: Government Offices"
echo "=========================================="
echo ""

# Check if server is running
if ! curl -s http://localhost:5000/api/ops/status > /dev/null 2>&1; then
  echo "❌ ERROR: Server not running"
  echo "Start server first: pnpm dev:app"
  exit 1
fi

echo "✅ Server is running"
echo ""

# Test Passport Office
echo "📋 Testing Passport Issuance Office..."
TEST_PASSPORT=$(curl -s -X POST http://localhost:5000/api/passports/issue \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "tier": "dreamer",
    "autoIssueDomain": true
  }')

if echo "$TEST_PASSPORT" | grep -q "success"; then
  echo "✅ Passport Office: ACTIVE"
else
  echo "❌ Passport Office: FAILED"
  echo "$TEST_PASSPORT"
  exit 1
fi

# Test Domain Registry
echo ""
echo "🎫 Testing Domain Registry Office..."
TEST_DOMAIN=$(curl -s http://localhost:5000/api/domains/list)

if echo "$TEST_DOMAIN" | grep -q "success\|domains"; then
  echo "✅ Domain Registry: ACTIVE"
else
  echo "❌ Domain Registry: FAILED"
  echo "$TEST_DOMAIN"
  exit 1
fi

# Test Citizenship Directory
echo ""
echo "👥 Testing Citizenship Directory..."
TEST_CITIZENS=$(curl -s http://localhost:5000/api/citizens/stats)

if echo "$TEST_CITIZENS" | grep -q "success\|stats"; then
  echo "✅ Citizenship Directory: ACTIVE"
else
  echo "❌ Citizenship Directory: FAILED"
  echo "$TEST_CITIZENS"
  exit 1
fi

echo ""
echo "🎉 Phase 1: Government Offices ACTIVATED!"
echo ""
echo "Next Steps:"
echo "1. Prepare citizen directory (CSV/JSON)"
echo "2. Run batch passport issuance"
echo "3. Activate Aegis Fleet (Phase 2)"

