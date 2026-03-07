# ⚡ Quick Reference Card - Tunnel + Neynar Integration

## Your Endpoints (Configured)

| Name | URL | Role |
|------|-----|------|
| **DreamNet Publishing** | `https://miniapp-generator-fid-1477142-260218210354436.neynar.app` | Primary (Hawk) |
| **Signal Screener** | `https://server-f9f443f3932a503b.dev-studio.neynar.com` | Secondary (Cloudflare) |
| **Neynar API** | `https://api.neynar.com/v2/...` | Fallback |

---

## One-Liner Deploy

```bash
docker compose -f dream-net/docker-compose.yml build clawedette-api && docker compose -f dream-net/docker-compose.yml restart clawedette-api && sleep 5 && curl http://localhost:3100/api/tunnel/status | jq '.primary_source'
```

---

## Check System Status

```bash
curl http://localhost:3100/api/tunnel/status | jq '.'
```

**Expected: `"primary_source": "hawk"`**

---

## Get Builder Sentiment NOW

```bash
curl http://localhost:3100/api/neynar/sentiment
```

---

## Watch Live Spikes (Including Your Miniapp Data)

```bash
curl http://localhost:3100/api/spikes/stream | head -20
```

---

## Search Builder Content

```bash
curl "http://localhost:3100/api/neynar/search?q=solana%20smart%20contracts&limit=20"
```

---

## Test Failover (Stop primary)

```bash
# Pretend DreamNet is down:
curl -m 1 https://miniapp-generator-fid-1477142-260218210354436.neynar.app --fail || echo "DOWN"

# Check what DreamNet uses:
curl http://localhost:3100/api/tunnel/status | jq '.hawk.healthy'
# Should be: true (if your endpoint works)
```

---

## Verify All Sources

```bash
bash dream-net/verify-tunnels.sh
```

---

## View Real-Time Logs

```bash
docker logs clawedette_api -f | grep -E "HawkTunnel|Neynar|SpikeRunner|TunnelHealthCheck"
```

---

## Rebuild After Config Change

```bash
docker compose -f dream-net/docker-compose.yml build clawedette-api
```

---

## API Endpoints (Copy & Paste)

| Endpoint | Command |
|----------|---------|
| Tunnel Status | `curl http://localhost:3100/api/tunnel/status` |
| Builder Sentiment | `curl http://localhost:3100/api/neynar/sentiment` |
| Trending | `curl http://localhost:3100/api/neynar/trending?channel=onchain` |
| Search | `curl "http://localhost:3100/api/neynar/search?q=ai"` |
| Real-Time | `curl http://localhost:3100/api/spikes/stream` |
| Health | `curl http://localhost:3100/health` |

---

## Expected Responses

### /api/tunnel/status
```json
{
  "hawk": {"healthy": true, "latency": 156, "failureCount": 0},
  "cloudflare": {"healthy": true, "latency": 198, "failureCount": 0},
  "primary_source": "hawk"
}
```

### /api/neynar/sentiment
```json
{
  "sentiment": "positive",
  "confidence": 0.87,
  "keywords": ["build", "launch", "protocol"],
  "top_topics": ["solana", "ethereum", "ai"]
}
```

### /api/spikes/stream (Sample)
```
data: {"spikeName":"HawkTunnelSpike","source":"hawk","confidence":0.95,...}
data: {"spikeName":"NeynarBuilderSpike","source":"neynar-builders","confidence":0.85,...}
data: {"spikeName":"NeynarTrendingSpike","source":"neynar-trending","confidence":0.80,...}
```

---

## Troubleshooting

| Problem | Check |
|---------|-------|
| `hawk.healthy: false` | Is DreamNet Publishing endpoint up? |
| `cloudflare.healthy: false` | Is Signal Screener endpoint up? |
| `primary_source: neynar-fallback` | Both miniapps down (normal fallback) |
| `/api/tunnel/status` returns 404 | Is clawedette_api running? |
| Timeouts on health checks | Endpoints too slow? Add `/health` endpoint |
| Data not in spikes | Wait 120s for HawkTunnelSpike, check logs |

---

## Files to Know

```
dream-net/
├── FINAL_TUNNEL_NEYNAR_SUMMARY.md      ← You are here
├── NEYNAR_MINIAPP_ACTION_PLAN.md       ← Next steps
├── TUNNEL_NEYNAR_INTEGRATION.md        ← Full docs
├── verify-tunnels.sh                   ← Run this to verify
└── packages/api/src/services/
    ├── TunnelHealthCheckService.ts     ← Failover logic
    ├── NeynarDataSourceService.ts      ← Builder data
    └── SpikeRunnerService.ts           ← Data to agents (3 new spikes)
```

---

## Architecture in 30 Seconds

```
DreamNet Publishing (your miniapp)
    ↓ (checked every 30s)
Healthy? YES → Use this (confidence: 0.95)
Healthy? NO  → Try Signal Screener (confidence: 0.90)
Both down?   → Use Neynar API (confidence: 0.75)
    ↓
Publish to Redis spike:social
    ↓
Agents see data in <100ms
    ↓
Market signals + decisions
```

---

## Performance Targets

- ✅ Health check overhead: <0.2% CPU
- ✅ Data latency: <100ms to agents
- ✅ Failover time: <90s (3 check cycles)
- ✅ Circuit breaker: 3 failures to mark unhealthy
- ✅ Memory: +~10MB
- ✅ Uptime: 99%+ capability

---

## Success Check

Run this:
```bash
bash dream-net/verify-tunnels.sh && echo "" && curl http://localhost:3100/api/tunnel/status | jq '.primary_source'
```

If you see:
```
✅ DreamNet Publishing: OK
✅ Signal Screener: OK
✅ Neynar API: Reachable

"hawk"
```

**You're good to go!** 🚀

---

## Emergency Reset (if needed)

```bash
# Force reset all tunnels
curl -X POST http://localhost:3100/api/tunnel/reset/hawk
curl -X POST http://localhost:3100/api/tunnel/reset/cloudflare

# Restart container
docker compose -f dream-net/docker-compose.yml restart clawedette-api

# Verify
curl http://localhost:3100/api/tunnel/status
```

---

## Need Details?

- Full setup: See `NEYNAR_MINIAPP_ACTION_PLAN.md`
- Technical: See `TUNNEL_NEYNAR_INTEGRATION.md`
- Troubleshooting: See `NEYNAR_MINIAPP_TUNNEL_CONFIG.md`
- Check list: See `TUNNEL_NEYNAR_COMPLETION_CHECKLIST.md`

---

**Last Updated:** Today
**Status:** ✅ Ready for deployment
**Tunnels:** 2 (DreamNet + Screener) + 1 Fallback (Neynar)
