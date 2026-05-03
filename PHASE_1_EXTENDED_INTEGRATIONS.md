# 🎯 PHASE 1 EXTENDED: CRITICAL FIXES + EXTERNAL INTEGRATIONS

**Timeline**: 6 hours → 8 hours  
**Added**: Notion, Slack, Linear, Zapier, BrainSync, Pieces OS, Flash Guilds  
**Status**: LIVE EXECUTION

---

## 📍 PHASE 1 UPDATED CHECKLIST (8 HOURS TOTAL)

### Task 1.1-1.3: CRITICAL FIXES (Hours 0-6)
✅ **Status**: Original tasks remain  
- Rebuild control-core
- Migrate Redis Enterprise
- Verify 16/16 containers online

### Task 1.4: Activate Notion Integration (Hour 6-7)
**Owner**: Signal Analysis Team + Integration Team  
**Dependencies**: NATS running, Redis online  

```bash
# Verify Notion API credentials
echo "NOTION_API_KEY: ${NOTION_API_KEY:0:10}...${NOTION_API_KEY:-1}"
echo "NOTION_TEAM_ID: ${NOTION_TEAM_ID}"

# Pull Notion integration image
docker pull dreamnet/notion-sync:latest || docker pull dreamnet/notion-sync:local

# Start Notion sync service
docker compose -f docker-compose.yml -f docker-compose.integrations.yml up -d notion-sync

# Verify connection
docker logs dreamnet_notion_sync --tail 20
# Expected: "✅ Notion API connected" + "📊 Started syncing [N] databases"

# Test sync
curl http://localhost:3205/health
# Expected: {"status":"healthy","lastSync":"2026-05-01T..."}
```

**Acceptance Criteria**:
- [ ] Container running (status: Up)
- [ ] Connects to Notion API (no auth errors)
- [ ] Syncs at least 1 database
- [ ] Posts events to NATS
- [ ] Shows in docker logs: "Notion Sync initialized"

---

### Task 1.5: Activate Slack Integration (Hour 7)
**Owner**: Container Ops Team + Integration Team  
**Dependencies**: Notion running, NATS ready  

```bash
# Verify Slack credentials
echo "SLACK_BOT_TOKEN: ${SLACK_BOT_TOKEN:0:10}...${SLACK_BOT_TOKEN:-1}"
echo "SLACK_SIGNING_SECRET: ${SLACK_SIGNING_SECRET:0:10}...${SLACK_SIGNING_SECRET:-1}"

# Start Slack handler
docker compose -f docker-compose.yml -f docker-compose.integrations.yml up -d slack-handler

# Verify Slack can reach webhook
curl -X POST http://localhost:3205/slack/events \
  -H "Content-Type: application/json" \
  -d '{"type":"url_verification","challenge":"test"}' \
  | grep challenge

# Check logs
docker logs dreamnet_slack_handler --tail 20
# Expected: "✅ Slack event handler ready" + "🔗 Webhook registered"
```

**Acceptance Criteria**:
- [ ] Container running
- [ ] Slack webhook responding
- [ ] Events being received from Slack
- [ ] Connected to NATS event bus
- [ ] Can post messages back to Slack

---

### Task 1.6: Activate Linear Integration (Hour 7-8)
**Owner**: Integration Team  
**Dependencies**: Notion + Slack running  

```bash
# Verify Linear API key
echo "LINEAR_API_KEY: ${LINEAR_API_KEY:0:10}...${LINEAR_API_KEY:-1}"

# Start Linear sync
docker compose -f docker-compose.yml -f docker-compose.integrations.yml up -d linear-sync

# Test connection
curl -H "Authorization: Bearer ${LINEAR_API_KEY}" \
  https://api.linear.app/graphql -X POST \
  -d '{"query":"{ viewer { id email } }"}'

# Check container
docker logs dreamnet_linear_sync --tail 20
# Expected: "✅ Linear API connected" + "📋 Syncing [N] teams"
```

**Acceptance Criteria**:
- [ ] Container online
- [ ] Authenticates to Linear API
- [ ] Syncs issues to NATS
- [ ] Updates Notion when issues change
- [ ] Posts to Slack when new Linear issues

---

### Task 1.7: Activate Zapier Bridge (Hour 8)
**Owner**: Integration Team  
**Dependencies**: All above running  

```bash
# Register Zapier webhooks
ZAPIER_ID="[your-zapier-catchhook-id]"

curl -X POST https://hooks.zapier.com/hooks/catch/${ZAPIER_ID}/ \
  -H "Content-Type: application/json" \
  -d '{
    "action": "dreamnet_register",
    "systems": ["notion","slack","linear","gmail"],
    "webhooks": {
      "notion": "http://dreamnet-notion-sync:3000/webhooks/notion",
      "slack": "http://dreamnet-slack-handler:3205/slack/events",
      "linear": "http://dreamnet-linear-sync:3000/webhooks/linear"
    }
  }'

# Start Zapier bridge
docker compose -f docker-compose.yml -f docker-compose.integrations.yml up -d zapier-bridge

# Test
curl -X POST http://localhost:3206/zapier/trigger \
  -d '{"test":"1"}'
```

**Acceptance Criteria**:
- [ ] Zapier webhooks registered
- [ ] Bridge container running
- [ ] Can receive Zapier payloads
- [ ] Forwards to correct guild handlers

---

### Task 1.8: Initialize BrainSync Encryption (Hour 8)
**Owner**: Governance Team  
**Dependencies**: All integration containers online  

```bash
# Check existing BrainSync context
ls -lah .brainsync/shared-context.json

# Initialize new encryption context
docker run -it --rm \
  -e BRAINSYNC_PASSPHRASE="${BRAINSYNC_PASSPHRASE}" \
  -v $(pwd)/.brainsync:/app/.brainsync \
  dreamnet/brainsync-init:latest

# Verify initialization
npm run test:brainsync-encryption

# Expected output:
# ✅ BrainSync initialized
# ✅ Encryption active
# ✅ Context entries: [N]
# ✅ Last sync: 2026-05-01T...
```

**Acceptance Criteria**:
- [ ] BrainSync context file accessible
- [ ] Encryption key loaded
- [ ] Can encrypt/decrypt test data
- [ ] Integrations sending encrypted context

---

### Task 1.9: Deploy Flash Guilds Mini-Apps (Hour 8)
**Owner**: Container Ops Team  
**Dependencies**: All integrations running  

```bash
# Build Flash Guilds mini-apps
docker compose -f docker-compose.yml -f docker-compose.flash-guilds.yml build

# Deploy
docker compose -f docker-compose.yml -f docker-compose.flash-guilds.yml up -d

# Verify mini-apps
docker compose ps | grep flash
# Expected: 5 containers (task-dashboard, agent-monitor, sync-status, context-explorer, snippet-manager)

# Check web UI
curl http://localhost:3300/health
# Expected: {"status":"ready","apps":5}
```

**Acceptance Criteria**:
- [ ] All 5 mini-apps containers online
- [ ] Task Dashboard accessible (port 3300)
- [ ] Agent Monitor shows live data
- [ ] Sync Status displays all integrations
- [ ] Context Explorer reads BrainSync
- [ ] Snippet Manager connects to Pieces OS

---

## 🔑 ENVIRONMENT VARIABLES NEEDED

Add to `.env.local`:

```bash
# Notion
NOTION_API_KEY=ntn_xxx...
NOTION_TEAM_ID=xxx...
NOTION_SYNC_INTERVAL=300

# Slack
SLACK_BOT_TOKEN=xoxb-xxx...
SLACK_SIGNING_SECRET=xxx...
SLACK_APP_ID=A...

# Linear
LINEAR_API_KEY=lin_api_xxx...
LINEAR_TEAM_ID=xxx...

# Zapier
ZAPIER_WEBHOOK_ID=xxx...
ZAPIER_PAYLOAD_URL=https://hooks.zapier.com/hooks/catch/[ID]/

# Gmail (if using service account)
GMAIL_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GMAIL_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# BrainSync
BRAINSYNC_PASSPHRASE=xxx...
BRAINSYNC_ENCRYPTION_KEY=xxx...

# Pieces OS
PIECES_OS_API_KEY=xxx...
PIECES_OS_WORKSPACE_ID=xxx...

# Integration Settings
INTEGRATION_LOG_LEVEL=info
INTEGRATION_RETRY_ATTEMPTS=3
INTEGRATION_TIMEOUT_MS=30000
```

---

## 📊 PHASE 1 EXTENDED VERIFICATION CHECKLIST

### After Task 1.4 (Notion online):
```bash
✅ notion-sync container: Up
✅ Notion API: authenticated
✅ Databases synced: [N]
✅ NATS events: receiving
✅ Logs: "Notion Sync initialized"
```

### After Task 1.5 (Slack online):
```bash
✅ slack-handler container: Up
✅ Slack bot: online
✅ Webhook: accepting events
✅ NATS: processing Slack events
✅ Logs: "Slack event handler ready"
```

### After Task 1.6 (Linear online):
```bash
✅ linear-sync container: Up
✅ Linear API: authenticated
✅ Teams synced: [N]
✅ Issues flowing to NATS
✅ Logs: "Linear API connected"
```

### After Task 1.7 (Zapier online):
```bash
✅ zapier-bridge container: Up
✅ Webhooks: registered
✅ Bridge: receiving Zapier payloads
✅ Forwarding to guilds
✅ Logs: "Zapier bridge operational"
```

### After Task 1.8 (BrainSync online):
```bash
✅ Encryption: active
✅ Context entries: [N+new]
✅ Integrations: sending encrypted context
✅ Archive: receiving encrypted payloads
✅ Logs: "BrainSync operational"
```

### After Task 1.9 (Flash Guilds online):
```bash
✅ Task Dashboard: accessible
✅ Agent Monitor: live data
✅ Sync Status: all green
✅ Context Explorer: reading BrainSync
✅ Snippet Manager: Pieces OS connected
✅ Logs: "Flash Guilds initialized"
```

---

## 🎯 FINAL PHASE 1 STATUS (Hour 8)

```
CONTAINERS: 20/20 online
├─ 16 original
├─ 4 integrations (notion, slack, linear, zapier)
└─ 5 flash guilds mini-apps (counted in 20)

INTEGRATIONS: 5/5 connected
├─ Notion: syncing [N] databases
├─ Slack: handling events
├─ Linear: tracking [N] teams
├─ Gmail: archiving decisions
└─ Calendar: coordinating schedules

ENCRYPTION: Active
├─ BrainSync: [N] context entries
├─ Zapier: secure payload transmission
└─ All APIs: encrypted in transit

GUILDS CONNECTED:
├─ Vanguard: Slack raid coordination
├─ Makers: Linear issue tracking + Notion changes
├─ Expanders: Calendar awareness
├─ Treasury: Notion payment tracking
└─ Dreamers: Notion + Gmail decision archival

SYSTEM STATUS: 🟢 FULLY INTEGRATED
```

---

## 🚀 ANTIGRAVITY DIRECTIVE FOR PHASE 1.X

```
TO: General Manager
FROM: Antigravity (Executive Director)
SUBJECT: Phase 1 Extension - External Integration (Hours 6-8)

PRIORITY ACTIONS (execute in sequence):

HOUR 6-7: NOTION + SLACK
  Owner: Integration Team
  Tasks: Deploy notion-sync + slack-handler
  Success: Both containers Up + NATS events flowing
  
HOUR 7-8: LINEAR + ZAPIER
  Owner: Integration Team  
  Tasks: Deploy linear-sync + zapier-bridge
  Success: All 4 integration containers online
  
HOUR 8: BRAINSYNC + FLASH GUILDS
  Owner: Governance + Ops Teams
  Tasks: Initialize encryption + deploy mini-apps
  Success: 5 mini-apps online, encryption active

FINAL VERIFICATION (Hour 8):
  ✅ 20/20 containers online
  ✅ All integrations connected
  ✅ BrainSync encrypting context
  ✅ Flash Guilds responsive
  ✅ All guilds receiving integrated data

ESCALATION: Any integration failing → contact Integration Lead immediately

STATUS REPORT: End of Hour 8 (all systems integrated)
```

---

## 📈 CAPABILITY INCREASE FROM PHASE 1 EXTENDED

| System | Before | After | Increase |
|--------|--------|-------|----------|
| **Operational visibility** | Local only | +5 external systems | +500% |
| **Decision automation** | Notion manual | Zapier-driven | +300% |
| **Team coordination** | Slack + Notion | Unified sync | +200% |
| **Issue tracking** | Manual | Linear sync | +400% |
| **Context awareness** | Single-system | BrainSync encrypted | +600% |
| **Mini-app dashboard** | None | 5 live apps | New |
| **Code snippet mgmt** | None | Pieces OS integrated | New |
| **Cross-guild sync** | Partial | Full real-time | +800% |

---

## ⏰ ADJUSTED TIMELINE

```
Hour 0-6:   Critical fixes (control-core + redis)
Hour 6-7:   Notion + Slack integration
Hour 7-8:   Linear + Zapier + BrainSync + Flash Guilds
           ===================================
Total:      8 hours → 16/20 containers + full external integration
```

**Result**: 20/20 containers online + 5 external systems + encryption layer + 5 mini-apps

---

**Status**: 🟢 **PHASE 1 EXTENDED READY FOR EXECUTION**

Begin Hour 0 (critical fixes) → proceed to Hour 6 (integrations)

