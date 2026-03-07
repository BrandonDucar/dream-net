# 🌐 Neynar Miniapp Integration - Tunnel Configuration

## Your Infrastructure

You have two Neynar endpoints deployed:

1. **DreamNet Publishing** (Miniapp Generator)
   ```
   https://miniapp-generator-fid-1477142-260218210354436.neynar.app/
   ```
   - AI-powered research publishing
   - Signal generation capability
   - Primary data source (Hawk equivalent)

2. **Signal Screener** (Neynar Dev Studio)
   ```
   https://server-f9f443f3932a503b.dev-studio.neynar.com
   ```
   - Builder signal monitoring
   - Trending analysis
   - Secondary fallback (Cloudflare equivalent)

---

## Updated Tunnel Architecture

```
┌─ Tier 1: DreamNet Publishing (Primary) ───────────────┐
│ https://miniapp-generator-fid-1477142-260218210354436  │
│ .neynar.app/api/signal                                 │
│ - Your research publishing engine                       │
│ - Custom signal generation                             │
│ - Direct stream to agents                              │
└────────────────────────────────────────────────────────┘
            ↓ (if down)
┌─ Tier 2: Signal Screener (Secondary) ──────────────────┐
│ https://server-f9f443f3932a503b.dev-studio.neynar.com  │
│ /api/signal                                             │
│ - Builder activity analysis                            │
│ - Farcaster signal processing                          │
│ - Redundant path                                       │
└────────────────────────────────────────────────────────┘
            ↓ (if down)
┌─ Tier 3: Neynar API (Fallback) ────────────────────────┐
│ https://api.neynar.com/v2/...                          │
│ - 10 builder-focused channels                          │
│ - Always available                                     │
│ - Sentiment + trending                                │
└────────────────────────────────────────────────────────┘
```

---

## Configuration

### Environment Variables (`.env.clawedette`)

```bash
# Point to YOUR Neynar miniapp endpoints
HAWK_TUNNEL_URL=https://miniapp-generator-fid-1477142-260218210354436.neynar.app/api/signal

CLOUDFLARE_TUNNEL_URL=https://server-f9f443f3932a503b.dev-studio.neynar.com/api/signal

# Your Neynar API key (optional but recommended)
NEYNAR_API_KEY=your_neynar_api_key
```

### Default Behavior (without env vars)
- **Hawk (Primary)**: Uses DreamNet Publishing miniapp
- **Cloudflare (Secondary)**: Uses Signal Screener
- **Neynar (Fallback)**: Always available

---

## What Each Endpoint Should Return

### DreamNet Publishing Miniapp
```
GET https://miniapp-generator-fid-1477142-260218210354436.neynar.app/api/signal

Expected:
{
  "signals": [...],              // Generated research signals
  "timestamp": 1708518645000,
  "count": 15,
  "confidence": 0.95
}
```

### Signal Screener
```
GET https://server-f9f443f3932a503b.dev-studio.neynar.com/api/signal

Expected:
{
  "builder_activity": [...],     // Farcaster builder signals
  "trending": [...],
  "timestamp": 1708518645000,
  "confidence": 0.90
}
```

### Neynar API (Fallback)
```
GET https://api.neynar.com/v2/farcaster/feed/trending?channel_id=onchain

Expected:
{
  "casts": [...],
  "count": 15
}
```

---

## Health Check Behavior

### Every 30 seconds:

1. **Check DreamNet Publishing**
   - GET `{HAWK_TUNNEL_URL}/status` (or ping endpoint)
   - If responds in <2s with 200: ✅ Healthy
   - If timeout or error: 🔄 Retry next cycle

2. **Check Signal Screener**
   - GET `{CLOUDFLARE_TUNNEL_URL}/status`
   - Same logic as above

3. **Status Updates**
   - `/api/tunnel/status` shows which is primary
   - Real-time in logs: `🌉 [TunnelHealthCheck] Status: X/2 healthy`

---

## Failover Scenarios

### Scenario 1: Both Miniapps Healthy ✅
```
HawkTunnelSpike → DreamNet Publishing (primary)
                  ↓ 
                  Returns research signals
                  ↓
                  spike:social + spike:all
                  ↓
                  Agents see high-confidence research data
```

### Scenario 2: DreamNet Down, Signal Screener Up
```
HawkTunnelSpike → DreamNet Publishing (timeout)
                  ↓ (failover)
                  Signal Screener (responds)
                  ↓
                  Returns builder activity
                  ↓
                  spike:social + spike:all
                  ↓
                  Agents see builder signals (slightly lower confidence)
```

### Scenario 3: Both Miniapps Down
```
HawkTunnelSpike → DreamNet Publishing (timeout)
                  ↓
                  Signal Screener (timeout)
                  ↓ (fallback)
                  Neynar API + 10 builder channels
                  ↓
                  Returns aggregated sentiment + trending
                  ↓
                  spike:social + spike:all
                  ↓
                  Agents see Neynar data (confidence: 0.75)
```

---

## Testing Your Miniapp Endpoints

### Check DreamNet Publishing
```bash
curl https://miniapp-generator-fid-1477142-260218210354436.neynar.app/api/signal

# Or with timeout:
curl -m 5 https://miniapp-generator-fid-1477142-260218210354436.neynar.app/api/signal/status
```

### Check Signal Screener
```bash
curl https://server-f9f443f3932a503b.dev-studio.neynar.com/api/signal

# Or status endpoint:
curl -m 5 https://server-f9f443f3932a503b.dev-studio.neynar.com/api/signal/status
```

### Check Tunnel Health in DreamNet
```bash
curl http://localhost:3100/api/tunnel/status

# Expected response:
{
  "hawk": {
    "healthy": true,
    "latency": 245,
    "failureCount": 0,
    "url": "https://miniapp-generator-fid-1477142-260218210354436.neynar.app/api/signal"
  },
  "cloudflare": {
    "healthy": true,
    "latency": 198,
    "failureCount": 0,
    "url": "https://server-f9f443f3932a503b.dev-studio.neynar.com/api/signal"
  },
  "primary_source": "hawk",
  "neynar_fallback_enabled": true
}
```

---

## Spikes Now Feed From Your Miniapps

### HawkTunnelSpike (120s)
```
Fetches from DreamNet Publishing → Signal Screener → Neynar
Published to: spike:social, spike:all
Data type: Research signals → Builder signals → Sentiment
Confidence: 0.95 (DreamNet) → 0.90 (Screener) → 0.75 (Neynar)
```

### NeynarBuilderSpike (120s)
```
Analyzes 10 builder channels directly from Neynar API
Published to: spike:social, spike:all
Data type: Sentiment analysis + keywords + topics
Confidence: 0.85 (Neynar API)
```

### NeynarTrendingSpike (300s)
```
Aggregates trending across builder channels
Published to: spike:social, spike:all
Data type: Engagement-ranked content
Confidence: 0.80 (Neynar API)
```

---

## Integration Points

### For Your Miniapps
The system now automatically:
- ✅ Checks health every 30 seconds
- ✅ Routes agent requests to healthiest miniapp
- ✅ Falls back gracefully if one is down
- ✅ Reports status via `/api/tunnel/status`
- ✅ Publishes data to Redis for real-time consumption

### For Your Agents
Agents can now:
- ✅ Subscribe to `spike:social` for miniapp data
- ✅ See confidence scores (know data source quality)
- ✅ Get research signals + builder signals + sentiment
- ✅ Know when fallback is active
- ✅ Query specific endpoints via API

### For Your Dashboard
Dashboard can now:
- ✅ Display tunnel health status
- ✅ Show which miniapp is primary
- ✅ See failover history
- ✅ Monitor data freshness
- ✅ Display confidence scores

---

## Next Steps

### 1. **Verify Your Miniapp APIs**

Make sure your endpoints return something at `/api/signal`:

```bash
# DreamNet Publishing
curl https://miniapp-generator-fid-1477142-260218210354436.neynar.app/api/signal

# Signal Screener
curl https://server-f9f443f3932a503b.dev-studio.neynar.com/api/signal
```

If they return 404 or similar, update the paths in `.env.clawedette`:

```bash
HAWK_TUNNEL_URL=https://miniapp-generator-fid-1477142-260218210354436.neynar.app
CLOUDFLARE_TUNNEL_URL=https://server-f9f443f3932a503b.dev-studio.neynar.com
```

### 2. **Add a Status/Health Endpoint**

For better health checking, consider adding to your miniapps:

```bash
GET /status or /health
→ Return { status: "ok", timestamp: Date.now() }
```

This lets the circuit breaker know the app is alive without hitting expensive `/api/signal` endpoints.

### 3. **Rebuild & Test**

```bash
# Rebuild with new tunnel URLs
docker compose -f dream-net/docker-compose.yml build clawedette-api

# Restart
docker compose -f dream-net/docker-compose.yml restart clawedette-api

# Check status
curl http://localhost:3100/api/tunnel/status

# Should show both miniapps healthy
```

### 4. **Monitor Real-Time Data**

```bash
# Watch spikes flowing from your miniapps
curl http://localhost:3100/api/spikes/stream

# You should see:
# - HawkTunnelSpike (from DreamNet Publishing)
# - NeynarBuilderSpike (from Neynar API)
# - NeynarTrendingSpike (from Neynar API)
```

---

## Summary

**Before:**
- ❌ Hawk tunnel timeouts (generic local address)
- ❌ Cloudflare tunnel not accessible
- ❌ Falling back to Neynar only

**After:**
- ✅ Points directly to your DreamNet Publishing miniapp (primary)
- ✅ Falls back to Signal Screener (secondary)
- ✅ Then Neynar API (always available)
- ✅ Agents get research + builder signals + sentiment
- ✅ Real-time failover, zero downtime
- ✅ Full visibility into which source is active

Your miniapps are now **integrated into the core DreamNet data pipeline**. 🚀
