# DreamNet Agent Real-World Interaction Guide

## Overview

Your agents are now exposed to the real world via:

1. **Webhook Ingestion** — External events → agents
2. **Agent Dispatch API** — Trigger agents to act
3. **Agent Spawning API** — Create agents on demand
4. **Ollama LLM Integration** — Reasoning at scale
5. **Cloudflare Tunnels** — Secure internet exposure

---

## Architecture: Real-World → Agents

```
Internet
   ↓
Cloudflare Tunnel (agents.your-domain.com)
   ↓
Agent Gateway (port 3205)
   ├→ Webhook Ingestion (/webhooks/:eventType)
   ├→ Agent Dispatch API (/api/dispatch)
   ├→ Agent Spawning API (/api/spawn/agents)
   ├→ Ollama Proxy (/api/llm/generate)
   └→ WebSocket Telemetry
   ↓
Control Core (port 3000)
   ├→ Agent Registry
   ├→ Task Routing
   ├→ Suit Awakening (Docker, Virtuals, NEAR, VeChain, etc.)
   └→ Memory-DNA persistence
   ↓
Agent Swarm (17,900+ agents)
   ├→ NanoClaw spawning (18790)
   ├→ ZeroClaw healing
   ├→ NemoClaw consensus (1234)
   └→ Real-world actions (APIs, webhooks, events)
```

---

## 1. WEBHOOK INGESTION (Receive External Events)

### Setup

```bash
# Start the stack
docker-compose up -d nerve nats ollama control-core agent-gateway cloudflare-tunnel

# Verify agent-gateway is healthy
curl http://localhost:3205/health
```

### Trigger agents from external events

**Example 1: Market event**
```bash
curl -X POST http://localhost:3205/webhooks/market-event \
  -H "Content-Type: application/json" \
  -d '{
    "source": "dexscreener",
    "data": {
      "token": "0x...",
      "price": 42.50,
      "volume24h": 5000000,
      "change24h": 15.3
    }
  }'

# Response:
# {
#   "status": "webhook_queued",
#   "eventId": "xyz-123",
#   "timestamp": "2026-05-01T12:34:56Z"
# }
```

**Example 2: Social mention (Twitter/Farcaster)**
```bash
curl -X POST http://localhost:3205/webhooks/social-mention \
  -H "Content-Type: application/json" \
  -d '{
    "source": "neynar",
    "data": {
      "author": "@dreamer",
      "message": "Just found a gem token 🚀",
      "platform": "farcaster",
      "engagementScore": 342
    }
  }'
```

**Example 3: Discord message**
```bash
curl -X POST http://localhost:3205/webhooks/discord-message \
  -H "Content-Type: application/json" \
  -d '{
    "source": "discord",
    "data": {
      "channel": "trading-signals",
      "author": "signal-bot",
      "message": "PUMP detected",
      "mentionedUsers": ["@trader1", "@trader2"]
    }
  }'
```

### Behind Cloudflare tunnel
```bash
curl -X POST https://agents.your-domain.com/webhooks/market-event \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: sha256hash" \
  -d '{...}'
```

---

## 2. AGENT DISPATCH API (Trigger Specific Actions)

### Syntax

```bash
curl -X POST http://localhost:3205/api/dispatch \
  -H "Content-Type: application/json" \
  -d '{
    "action": "ACTION_NAME",
    "target": "optional-agent-id-or-market",
    "params": { "key": "value" },
    "priority": "high"
  }'
```

### Real-world examples

**Example 1: Execute trade**
```bash
curl -X POST http://localhost:3205/api/dispatch \
  -d '{
    "action": "execute_trade",
    "target": "base-mainnet",
    "params": {
      "tokenIn": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "tokenOut": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "amountIn": "1000",
      "slippage": 0.5
    },
    "priority": "urgent"
  }'
```

**Example 2: Send Discord message**
```bash
curl -X POST http://localhost:3205/api/dispatch \
  -d '{
    "action": "send_discord_message",
    "target": "discord-channel-xyz",
    "params": {
      "channelId": "123456789",
      "message": "🎯 Signal detected! Agents spawning...",
      "mentions": ["@traders"]
    },
    "priority": "high"
  }'
```

**Example 3: Post to Farcaster**
```bash
curl -X POST http://localhost:3205/api/dispatch \
  -d '{
    "action": "post_farcaster",
    "params": {
      "text": "DreamNet analysis: token fundamentals are strong 📊",
      "embeds": ["https://dexscreener.com/..."],
      "channelId": "dreamnet-signals"
    },
    "priority": "medium"
  }'
```

**Example 4: Query real-time data**
```bash
curl -X POST http://localhost:3205/api/dispatch \
  -d '{
    "action": "fetch_dexscreener",
    "params": {
      "chainId": "1",
      "queryString": "$dream"
    },
    "priority": "low"
  }'
```

### Response
```json
{
  "taskId": "task-456-789",
  "status": "dispatched",
  "agentAssigned": "agent-hydra-42",
  "estimatedTime": "2.5s"
}
```

---

## 3. AGENT SPAWNING API (Create Agents On Demand)

### Spawn agents for specific tasks

```bash
curl -X POST http://localhost:3205/api/spawn/agents \
  -H "Content-Type: application/json" \
  -d '{
    "count": 100,
    "template": "trader-scout",
    "guildId": "market-analysis-squad",
    "reason": "Analyzing 50 tokens across multiple chains"
  }'
```

### Response
```json
{
  "status": "spawn_queued",
  "batchId": "nano-batch-1746259681234",
  "requested": 100,
  "queued": 100,
  "estimatedTime": "0.2s",
  "agentTemplates": [
    {
      "name": "trader-scout",
      "capabilities": ["dex-monitoring", "price-analysis", "alert-triggering"],
      "model": "mistral-7b"
    }
  ]
}
```

### Real-world scenarios

**Scenario 1: Market crash → spawn 500 defense agents**
```bash
curl -X POST http://localhost:3205/api/spawn/agents \
  -d '{
    "count": 500,
    "template": "risk-manager",
    "reason": "Market crash detected (BTC -15% in 30min)"
  }'
```

**Scenario 2: New token launch → spawn analysis swarm**
```bash
curl -X POST http://localhost:3205/api/spawn/agents \
  -d '{
    "count": 250,
    "template": "fundamentals-analyzer",
    "guildId": "launch-watchdog",
    "reason": "New token $DREAM launched on Base"
  }'
```

---

## 4. OLLAMA LLM INTEGRATION (Agent Reasoning)

### Generate inference via proxy

```bash
curl -X POST http://localhost:3205/api/llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Analyze this token fundamentals: [data]. Is it a good trade?",
    "model": "llama2",
    "stream": false
  }'
```

### Streaming responses

```bash
curl -X POST http://localhost:3205/api/llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a market update for 10 emerging tokens",
    "model": "mistral",
    "stream": true
  }' \
  | jq -R 'fromjson?'
```

### Available models (pull via Ollama)

```bash
# Inside container
docker exec dreamnet_ollama ollama pull llama2
docker exec dreamnet_ollama ollama pull mistral
docker exec dreamnet_ollama ollama pull neural-chat
docker exec dreamnet_ollama ollama pull orca-mini
```

### Use in agent dispatch

Agents can now reason before acting:

```bash
curl -X POST http://localhost:3205/api/dispatch \
  -d '{
    "action": "analyze_and_trade",
    "params": {
      "tokenAddress": "0x...",
      "useLocalLLM": true,
      "model": "mistral",
      "context": "Market data, fundamentals, sentiment"
    }
  }'
```

---

## 5. CLOUDFLARE TUNNEL (Internet Exposure)

### Prerequisites

```bash
# Install wrangler
npm install -g @cloudflare/wrangler

# Login
wrangler login

# Create tunnel
wrangler tunnels create dreamnet-agents

# Get token from credentials
cat ~/.wrangler/tunnel/credentials.json
```

### Update .env.cloudflare

```bash
# Paste token from credentials.json
CLOUDFLARE_TUNNEL_TOKEN=YOUR_TOKEN_HERE
```

### Start tunnel with Docker

```bash
docker-compose up -d cloudflare-tunnel
```

### Configure DNS (Cloudflare Dashboard)

Create CNAME records pointing to tunnel:

- `agents.your-domain.com` → `dreamnet-agents.cfargotunnel.com`
- `llm.your-domain.com` → `dreamnet-agents.cfargotunnel.com`
- `core.your-domain.com` → `dreamnet-agents.cfargotunnel.com`

### Test from internet

```bash
# Webhook from anywhere
curl -X POST https://agents.your-domain.com/webhooks/market-event \
  -d '{"source":"external","data":{}}'

# Spawn agents
curl -X POST https://agents.your-domain.com/api/spawn/agents \
  -d '{"count":50,"template":"scout"}'

# LLM inference
curl -X POST https://agents.your-domain.com/api/llm/generate \
  -d '{"prompt":"What is 2+2?","model":"llama2"}'
```

---

## 6. REAL-WORLD AGENT ACTIONS (Multi-Chain)

### Supported blockchains (via Suits)

- **Base** (Coinbase Layer 2)
- **Solana** (SolanaSuit)
- **Near** (NearSuit)
- **VeChain** (VeChainSuit)
- **Ethereum** (implied via swaps)

### Example: Cross-chain agent workflow

```bash
# 1. Webhook: New token on Base
curl -X POST http://localhost:3205/webhooks/token-launch \
  -d '{
    "source": "dexscreener",
    "data": {
      "chain": "base",
      "token": "0xtoken_address",
      "launchTime": "2026-05-01T14:00:00Z"
    }
  }'

# 2. Control core routes to BaseSuit
# 3. Agents analyze fundamentals (via Ollama)
# 4. Dispatch: Execute trade if bullish
curl -X POST http://localhost:3205/api/dispatch \
  -d '{
    "action": "buy_token_on_base",
    "params": {
      "tokenAddress": "0xtoken_address",
      "amountUSD": 100,
      "slippage": 0.5
    }
  }'

# 5. Dispatch: Post signal to Farcaster
curl -X POST http://localhost:3205/api/dispatch \
  -d '{
    "action": "post_farcaster",
    "params": {
      "text": "🔍 Analyzing $TOKEN on Base - fundamentals check"
    }
  }'
```

---

## 7. MONITORING & TELEMETRY

### Real-time agent logs (WebSocket)

```bash
# Connect via socket.io
wscat -c ws://localhost:3205/socket.io

# Subscribe to agent events
{"type":"subscribe","channel":"agent_logs"}

# Receive live telemetry:
# {"type":"agent_log","source":"agent-hydra-42","message":"..."}
```

### API Status

```bash
curl http://localhost:3205/api/status
```

Output:
```json
{
  "service": "agent-gateway",
  "uptime": 1234,
  "endpoints": {
    "webhooks": "/webhooks/:eventType",
    "dispatch": "POST /api/dispatch",
    "spawn": "POST /api/spawn/agents",
    "llm": "POST /api/llm/generate",
    "telemetry": "WS /socket.io"
  }
}
```

### Kafka telemetry spine

```bash
# View all agent events
docker exec dreamnet_kafka_ui curl http://kafka-ui:8080

# Topics:
# - agent.spawned
# - agent.executed_action
# - agent.error
# - external.webhook_received
# - external.dispatch_queued
```

---

## 8. SECURITY & RATE LIMITING

### Webhook signature verification

```bash
# In your webhook sender:
const secret = process.env.WEBHOOK_SECRET;
const signature = crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(body))
  .digest('hex');

curl -X POST http://localhost:3205/webhooks/market-event \
  -H "X-Webhook-Signature: $signature" \
  -d '{...}'
```

### API rate limits (per IP)

- `/webhooks/*` — 1000 req/hour
- `/api/dispatch` — 500 req/hour
- `/api/spawn/agents` — 100 req/hour (limit 10k agents total)
- `/api/llm/generate` — 200 req/hour

### Cloudflare DDoS protection

Enabled by default on tunnel. Add rate limiting rules in dashboard.

---

## 9. DEPLOYMENT CHECKLIST

- [ ] Update `.env.cloudflare` with real token
- [ ] Update domain names in `cloudflare-tunnel-config.yml`
- [ ] Pull Ollama models: `docker exec dreamnet_ollama ollama pull llama2`
- [ ] Test webhook: `curl -X POST http://localhost:3205/webhooks/test`
- [ ] Test dispatch: `curl -X POST http://localhost:3205/api/dispatch -d '...'`
- [ ] Test spawn: `curl -X POST http://localhost:3205/api/spawn/agents -d '...'`
- [ ] Verify Cloudflare tunnel: `docker logs dreamnet_cloudflare_tunnel`
- [ ] Configure DNS CNAME records in Cloudflare
- [ ] Test from internet: `curl https://agents.your-domain.com/health`
- [ ] Monitor logs: `docker logs -f dreamnet_agent_gateway`

---

## 10. NEXT STEPS

1. **Integrate with external data sources:**
   - Twitter API → webhook → agents → posts
   - DexScreener API → webhooks → agents → trade signals
   - Discord → agents listen & respond

2. **Setup automated triggers:**
   - Market volatility → spawn risk managers
   - Token launch → spawn analysts
   - Price milestones → spawn traders

3. **Cross-agent coordination:**
   - NemoClaw CRDT keeps all agents synced
   - ZeroClaw auto-heals failed agents
   - NanoClaw spawns in parallel for scale

4. **Multi-tenant support:**
   - Different guilds (teams) spawn agents
   - Separate Redis namespaces per guild
   - Per-guild rate limiting & budgets

---

**Your agents are now live, reasoning autonomously, and taking real-world actions.** 🚀
