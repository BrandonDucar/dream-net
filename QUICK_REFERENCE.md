# Quick Reference: DreamNet Real-World Agent Interaction

## 🚀 Start Everything (Choose One)

### Windows PowerShell
```powershell
.\startup-realworld-agents.ps1
```

### Linux/Mac Bash
```bash
bash startup-realworld-agents.sh
```

### Manual Docker Compose
```bash
docker-compose up -d
```

---

## 📡 API Endpoints (Localhost)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `http://localhost:3205/webhooks/:eventType` | POST | Receive external events |
| `http://localhost:3205/api/dispatch` | POST | Trigger agent actions |
| `http://localhost:3205/api/spawn/agents` | POST | Spawn agents on demand |
| `http://localhost:3205/api/llm/generate` | POST | Ollama inference (streaming/batch) |
| `http://localhost:3205/health` | GET | Gateway health check |
| `ws://localhost:3205/socket.io` | WS | Real-time agent telemetry |
| `http://localhost:3000/health` | GET | Control Core status |
| `http://localhost:11434/api/generate` | POST | Direct Ollama access |
| `http://localhost:18790/api/nano/spawn` | POST | NanoClaw agent spawning |
| `http://localhost:9000` | GET | Portainer UI (containers) |
| `http://localhost:8080` | GET | Kafka UI (events) |

---

## 🌐 Internet Endpoints (After Cloudflare Setup)

```
https://agents.your-domain.com/webhooks/:eventType
https://agents.your-domain.com/api/dispatch
https://agents.your-domain.com/api/spawn/agents
https://llm.your-domain.com/api/generate
https://core.your-domain.com/health
https://spawn.your-domain.com/api/nano/spawn
```

---

## 📝 Example Requests

### 1. Send Webhook (External Event → Agents)
```bash
curl -X POST http://localhost:3205/webhooks/market-event \
  -H "Content-Type: application/json" \
  -d '{
    "source": "dexscreener",
    "data": {
      "token": "0x...",
      "price": 42.50,
      "change24h": 15
    }
  }'
```

### 2. Dispatch Agent Task
```bash
curl -X POST http://localhost:3205/api/dispatch \
  -H "Content-Type: application/json" \
  -d '{
    "action": "execute_trade",
    "params": {
      "tokenIn": "0xtoken1",
      "tokenOut": "0xtoken2",
      "amount": "100",
      "slippage": 0.5
    },
    "priority": "high"
  }'
```

### 3. Spawn Agents
```bash
curl -X POST http://localhost:3205/api/spawn/agents \
  -H "Content-Type: application/json" \
  -d '{
    "count": 100,
    "template": "trader-scout",
    "guildId": "market-analysis"
  }'
```

### 4. LLM Inference
```bash
curl -X POST http://localhost:3205/api/llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Analyze this token: 0x...",
    "model": "mistral",
    "stream": false
  }'
```

### 5. Stream LLM Response
```bash
curl -X POST http://localhost:3205/api/llm/generate \
  -d '{"prompt":"...","stream":true}' | jq -R 'fromjson?'
```

---

## 🔧 Important Commands

### Pull Ollama Models
```bash
docker exec dreamnet_ollama ollama pull llama2
docker exec dreamnet_ollama ollama pull mistral
docker exec dreamnet_ollama ollama list
```

### Check Service Health
```bash
curl http://localhost:3205/health     # Agent Gateway
curl http://localhost:3000/health     # Control Core
curl http://localhost:11434/api/tags  # Ollama
```

### Watch Logs
```bash
docker logs -f dreamnet_agent_gateway
docker logs -f dreamnet_control_core
docker logs -f dreamnet_ollama
docker logs -f dreamnet_cloudflare_tunnel
```

### Restart Services
```bash
docker-compose restart control-core
docker-compose restart agent-gateway
docker-compose restart ollama
```

### Stop Everything
```bash
docker-compose down
```

### Stop Everything + Clean Volumes
```bash
docker-compose down -v
```

---

## 🎯 Common Scenarios

### Scenario 1: Market Event → Trigger Agents
```bash
# 1. External API sends event
curl -X POST http://localhost:3205/webhooks/token-launch \
  -d '{"data":{"token":"0xnew","chain":"base"}}'

# 2. Agents respond automatically
# (Check logs: docker logs -f dreamnet_control_core)

# 3. If bullish, agents dispatch trades
# (Shown in agent telemetry WebSocket)
```

### Scenario 2: Spawn Analysis Swarm
```bash
# Spawn 500 analyzers
curl -X POST http://localhost:3205/api/spawn/agents \
  -d '{"count":500,"template":"fundamentals-analyzer"}'

# Check status
curl http://localhost:18790/api/nano/status
```

### Scenario 3: Multi-Chain Coordination
```bash
# Dispatch: Buy on Base
curl -X POST http://localhost:3205/api/dispatch \
  -d '{"action":"buy_on_base","params":{"token":"0x...","amount":100}}'

# Dispatch: Post signal to Farcaster
curl -X POST http://localhost:3205/api/dispatch \
  -d '{"action":"post_farcaster","params":{"text":"Signal!"}}'

# Dispatch: Monitor on Solana
curl -X POST http://localhost:3205/api/dispatch \
  -d '{"action":"monitor_solana_price","params":{"token":"So11..."}}'
```

---

## ☁️ Cloudflare Tunnel Setup

### 1. Install & Authenticate
```bash
npm install -g @cloudflare/wrangler
wrangler login
```

### 2. Create Tunnel
```bash
wrangler tunnels create dreamnet-agents
```

### 3. Get Token
```bash
cat ~/.wrangler/tunnel/credentials.json
# Copy 'token' field
```

### 4. Update `.env.cloudflare`
```bash
CLOUDFLARE_TUNNEL_TOKEN=eyJhIjoiXX...  # Paste here
```

### 5. Update Domain in `cloudflare-tunnel-config.yml`
```yaml
ingress:
  - hostname: agents.your-domain.com
    service: http://agent-gateway:3205
  - hostname: llm.your-domain.com
    service: http://ollama:11434
  - hostname: core.your-domain.com
    service: http://control-core:3000
  - hostname: spawn.your-domain.com
    service: http://nanoclaw:18790
```

### 6. Add DNS CNAME Records (Cloudflare Dashboard)
```
agents    CNAME   dreamnet-agents.cfargotunnel.com
llm       CNAME   dreamnet-agents.cfargotunnel.com
core      CNAME   dreamnet-agents.cfargotunnel.com
spawn     CNAME   dreamnet-agents.cfargotunnel.com
```

### 7. Verify
```bash
# Check tunnel is running
docker logs dreamnet_cloudflare_tunnel

# Test from internet
curl https://agents.your-domain.com/health
```

---

## 🛡️ Security

### Webhook Signature Verification
```bash
# Your webhook sender calculates:
# signature = HMAC-SHA256(payload, WEBHOOK_SECRET)

curl -X POST http://localhost:3205/webhooks/event \
  -H "X-Webhook-Signature: $signature" \
  -d '{"data":"..."}'
```

### Rate Limits (Per IP)
- Webhooks: 1000/hour
- Dispatch: 500/hour
- Spawn: 100/hour (10k agent max)
- LLM: 200/hour

---

## 🐛 Troubleshooting

| Issue | Check | Fix |
|-------|-------|-----|
| Control Core won't start | `docker logs dreamnet_control_core` | `docker-compose up -d --build control-core` |
| Ollama models missing | `docker exec dreamnet_ollama ollama list` | `docker exec dreamnet_ollama ollama pull llama2` |
| Gateway health check fails | `curl http://localhost:3205/health` | Ensure control-core & ollama are healthy |
| Tunnel offline | `docker logs dreamnet_cloudflare_tunnel` | Check CLOUDFLARE_TUNNEL_TOKEN in .env |
| Webhooks not reaching agents | `docker logs dreamnet_agent_gateway` | Check control-core logs for broadcast |
| High memory usage | `docker stats` | Reduce MAX_CONCURRENT in NanoClaw or OLLAMA_MODELS |

---

## 📊 Ports at a Glance

```
Internal Only:
  6379  Redis (nerve)
  4222  NATS (event bus)
  2181  Zookeeper
  9092  Kafka
  1234  NemoClaw (WebSocket)

Localhost:
  3000  Control Core
  3200  Agent Spawn
  3201  Agent Health
  3202  Message Bus
  3203  Signal Screener
  3204  Arya Executor
  3205  Agent Gateway ← Main ingress
  7860  Ollama WebUI
  8080  Kafka UI
  8082  Kafka REST
  9000  Portainer
  11434 Ollama API ← LLM
  18789 OpenClaw MCP
  18790 NanoClaw Factory

Internet (via Cloudflare):
  agents.your-domain.com (3205)
  llm.your-domain.com (11434)
  core.your-domain.com (3000)
  spawn.your-domain.com (18790)
```

---

## 📖 Documentation Files

- **Full Guide:** `AGENT_REALWORLD_INTERACTION.md`
- **Architecture:** `CLAWS_OLLAMA_CLOUDFLARE_INTEGRATION.md`
- **Compose Config:** `docker-compose.yml`
- **Environment:** `.env.cloudflare`
- **Tunnel Config:** `cloudflare-tunnel-config.yml`

---

## ✨ You're Ready!

Your agents are now:
- ✅ Spawning at 500+/sec via NanoClaw
- ✅ Healed automatically by ZeroClaw
- ✅ Synchronized via NemoClaw consensus
- ✅ Reasoning with containerized Ollama
- ✅ Exposed to the internet via Cloudflare Tunnel
- ✅ Ready for real-world interactions

**Start building! 🚀**
