#!/bin/bash
# 🔍 Tunnel Endpoint Verification Script
# Tests both your Neynar miniapp endpoints + fallback

echo "🌐 DreamNet Tunnel Verification Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test DreamNet Publishing Miniapp
echo "🔹 Testing DreamNet Publishing (Primary Hawk)..."
HAWK_URL="https://miniapp-generator-fid-1477142-260218210354436.neynar.app"
HAWK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "$HAWK_URL")
HAWK_TIME=$(curl -s -o /dev/null -w "%{time_total}" -m 5 "$HAWK_URL")

if [ "$HAWK_STATUS" = "200" ]; then
  echo -e "${GREEN}✅ DreamNet Publishing: OK (${HAWK_TIME}s)${NC}"
else
  echo -e "${RED}❌ DreamNet Publishing: HTTP $HAWK_STATUS${NC}"
fi

# Test Signal Screener
echo "🔹 Testing Signal Screener (Secondary Cloudflare)..."
CF_URL="https://server-f9f443f3932a503b.dev-studio.neynar.com"
CF_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "$CF_URL")
CF_TIME=$(curl -s -o /dev/null -w "%{time_total}" -m 5 "$CF_URL")

if [ "$CF_STATUS" = "200" ]; then
  echo -e "${GREEN}✅ Signal Screener: OK (${CF_TIME}s)${NC}"
else
  echo -e "${RED}❌ Signal Screener: HTTP $CF_STATUS${NC}"
fi

# Test DreamNet API Tunnel Status
echo ""
echo "🔹 Testing DreamNet API Tunnel Status..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "http://localhost:3100/api/tunnel/status")

if [ "$API_STATUS" = "200" ]; then
  echo -e "${GREEN}✅ DreamNet API: OK${NC}"
  echo ""
  echo "   Tunnel Status:"
  curl -s http://localhost:3100/api/tunnel/status | jq '.' | sed 's/^/   /'
else
  echo -e "${RED}❌ DreamNet API: HTTP $API_STATUS (is clawedette_api running?)${NC}"
fi

# Test Neynar Fallback
echo ""
echo "🔹 Testing Neynar API (Fallback)..."
NEYNAR_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "https://api.neynar.com/v2/farcaster/channel?channel_id=onchain" -H "X-API-Key: NEYNAR_DEMO_KEY")

if [ "$NEYNAR_STATUS" = "200" ] || [ "$NEYNAR_STATUS" = "400" ]; then
  echo -e "${GREEN}✅ Neynar API: Reachable${NC}"
else
  echo -e "${RED}❌ Neynar API: HTTP $NEYNAR_STATUS${NC}"
fi

# Summary
echo ""
echo "======================================"
echo "📊 Summary:"
echo ""

HEALTHY=0
[ "$HAWK_STATUS" = "200" ] && ((HEALTHY++))
[ "$CF_STATUS" = "200" ] && ((HEALTHY++))
[ "$NEYNAR_STATUS" = "200" ] && ((HEALTHY++)) || [ "$NEYNAR_STATUS" = "400" ] && ((HEALTHY++))

echo "Primary (DreamNet):    $([ "$HAWK_STATUS" = "200" ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
echo "Secondary (Screener):  $([ "$CF_STATUS" = "200" ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
echo "Fallback (Neynar):     $([ "$NEYNAR_STATUS" = "200" ] || [ "$NEYNAR_STATUS" = "400" ] && echo -e "${GREEN}✅${NC}" || echo -e "${RED}❌${NC}")"
echo ""
echo "Data sources healthy: $HEALTHY/3"
echo ""

if [ $HEALTHY -gt 0 ]; then
  echo -e "${GREEN}✅ System is operational (at least one data source healthy)${NC}"
else
  echo -e "${RED}❌ No data sources available - check configuration${NC}"
fi

echo ""
echo "Next: curl http://localhost:3100/api/neynar/sentiment"
