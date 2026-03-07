# 🌉 Enhanced Data Ingestion System - Tunnel + Neynar Integration

## Overview

The system now has a **three-tier data ingestion architecture** with intelligent fallback:

```
Tier 1 (Primary):    Hawk Tunnel → Direct high-bandwidth data
                     ↓ (if down)
Tier 2 (Secondary):  Cloudflare Tunnel → Redundant path
                     ↓ (if down)
Tier 3 (Fallback):   Neynar API → Multi-channel builder content
```

This ensures **continuous data flow** even when primary tunnels are unavailable.

---

## Architecture

### 1. **TunnelHealthCheckService** (`TunnelHealthCheckService.ts`)

Monitors tunnel health with circuit breaker pattern:

```typescript
- Hawk Tunnel (http://hawk:3203/api/signal)
- Cloudflare Tunnel (https://tunnel.dreamnet.workers.dev/api/signal)
- Neynar Fallback (always enabled)
```

**Features:**
- **30-second health checks** on all tunnels
- **Circuit breaker**: 3 failures → marked unhealthy
- **Automatic recovery**: Reset failure count when tunnel recovers
- **Latency tracking**: Monitors response times (<2s threshold)
- **Graceful fallback**: Automatically switches to next source

**Status Report:**
```json
{
  "hawk": {
    "healthy": true,
    "latency": 145,
    "failureCount": 0
  },
  "cloudflare": {
    "healthy": false,
    "latency": 0,
    "failureCount": 3
  },
  "primary_source": "hawk",
  "neynar_fallback_enabled": true
}
```

### 2. **NeynarDataSourceService** (`NeynarDataSourceService.ts`)

Pulls builder-focused content from Neynar with **10 dedicated channels**:

```
Primary Channels:
- onchain        → Onchain builders
- development    → Dev discussions
- ai-agents      → AI & agent builders
- solana         → Solana ecosystem
- ethereum       → Ethereum ecosystem

Secondary Channels:
- llm            → LLM applications
- protocol-labs  → Protocol developers
- tools          → Dev tools & infrastructure
- security       → Security-focused builders
- payments       → Payment tech builders
```

**Key Methods:**

```typescript
getTrending(channel)          // Get trending casts from channel
getBuilderSentiment()         // Analyze sentiment across builders
searchBuilderContent(query)   // Search for specific content
getChannelInfo(channelId)     // Get channel metadata
aggregateBuilderChannels()    // Combine content from all channels
```

**When Trending is Limited:**
- If primary channel has <3 casts, system automatically aggregates from all 10 builder channels
- Combines content, deduplicates by hash, ranks by engagement (likes + 2x recasts + replies)
- Returns top 15 sorted by engagement

### 3. **Enhanced SpikeRunnerService** (`SpikeRunnerService.ts`)

Now includes **3 new spikes** for tunnel + Neynar data:

```typescript
HawkTunnelSpike (120s)        // Fetch from best available tunnel
NeynarBuilderSpike (120s)     // Builder sentiment analysis
NeynarTrendingSpike (300s)    // Trending builder content
```

All spikes publish to `spike:social` Redis channel and `spike:all` firehose.

---

## API Endpoints

### Tunnel Status

```
GET /api/tunnel/status
→ Returns health status of Hawk, Cloudflare, and Neynar fallback

GET /api/tunnel/endpoints
→ Returns configured tunnel URLs

POST /api/tunnel/reset/:tunnel
→ Force reset a tunnel (hawk or cloudflare) after manual intervention
```

**Example Response:**
```json
{
  "hawk": {
    "healthy": true,
    "latency": 142,
    "failureCount": 0,
    "lastCheck": 1708518645000
  },
  "cloudflare": {
    "healthy": false,
    "latency": 0,
    "failureCount": 3,
    "lastCheck": 1708518642000
  },
  "primary_source": "hawk",
  "last_updated": 1708518645000
}
```

### Neynar Sentiment

```
GET /api/neynar/sentiment
→ Get builder sentiment analysis across all channels
```

**Response:**
```json
{
  "sentiment": "positive",
  "confidence": 0.87,
  "keywords": ["build", "launch", "protocol", "dev"],
  "builder_channels_active": 10,
  "top_topics": ["solana", "ethereum", "ai", "defi"],
  "timestamp": 1708518645000
}
```

### Neynar Trending

```
GET /api/neynar/trending?channel=onchain
→ Get trending casts from specific channel (auto-aggregates if limited)
```

**Response:**
```json
{
  "trending": [
    {
      "hash": "0x...",
      "text": "just shipped onchain feature...",
      "author": {"username": "builder", "display_name": "Builder Name"},
      "timestamp": "2026-02-20T...",
      "likes": 245,
      "replies": 12,
      "recasts": 89
    }
  ],
  "channel": "onchain",
  "total_signals": 15,
  "timestamp": 1708518645000
}
```

### Neynar Search

```
GET /api/neynar/search?q=solana+smart+contracts&limit=20
→ Search builder content across all channels
```

### Neynar Channel Info

```
GET /api/neynar/channel/onchain
→ Get metadata about a specific channel
```

---

## Configuration

### Environment Variables

```bash
# Tunnel URLs (defaults to local/docker-network)
HAWK_TUNNEL_URL=http://hawk:3203/api/signal
CLOUDFLARE_TUNNEL_URL=https://tunnel.dreamnet.workers.dev/api/signal

# Neynar API
NEYNAR_API_KEY=your_neynar_api_key_here

# Other spikes
NASA_API_KEY=...
NEWS_API_KEY=...
```

---

## Data Flow

### Primary Path (Hawk Tunnel)
```
1. HawkTunnelSpike fetches every 120s
2. TunnelHealthCheck verifies Hawk is healthy
3. If healthy, returns high-bandwidth signal data
4. Data published to spike:social + spike:all
5. Consumed by agents, dashboard, marketplace
```

### Secondary Path (Cloudflare Tunnel)
```
1. If Hawk fails 3 checks, marked unhealthy
2. TunnelHealthCheck automatically tries Cloudflare
3. If Cloudflare healthy, uses that tunnel
4. Same publishing chain as primary
```

### Fallback Path (Neynar)
```
1. If all primary tunnels unhealthy/unavailable
2. NeynarBuilderSpike runs every 120s
3. NeynarTrendingSpike runs every 300s
4. Pulls from builder-focused channels
5. On low trending: aggregates all 10 channels
6. Data published to spike:social + spike:all
7. Full sentiment + keywords + top topics included
```

---

## Circuit Breaker Pattern

Each tunnel tracks:
- `failureCount`: Number of consecutive failures
- `failureThreshold`: Threshold to mark unhealthy (default: 3)
- `healthy`: Boolean status
- `latency`: Last response time in ms

**Failure Scenarios:**
- Response timeout (>5s)
- Status code ≠ 200
- Response latency >2000ms
- Network error

**Recovery:**
- Next successful health check resets `failureCount` to 0
- Can manually reset with `POST /api/tunnel/reset/:tunnel`

---

## Real-Time Monitoring

### WebSocket Stream (via Server-Sent Events)

```
GET /api/spikes/stream
→ Real-time stream of all spikes including tunnel/Neynar data
```

Consumers get immediate notifications when:
- Tunnel goes up/down
- Hawk returns new trending signals
- Builder sentiment changes
- Cloudflare takes over from Hawk

---

## Spike Categories

After integration, spikes fall into these categories:

```
spike:financial     → Crypto, Metals, Stocks
spike:weather       → Weather, Solar
spike:defense       → Aegis, Flight, Low-altitude
spike:science       → NASA, Cosmic
spike:social        → News, Reddit, Neynar, Hawk Tunnel, Sentiment ⭐
spike:earth         → Earthquakes
spike:infra         → GitHub Trends, Grants
spike:all           → Firehose (all spikes)
```

The **spike:social** channel is now the richest, combining:
- NewsSpike (traditional news)
- RedditSpike (Reddit trends)
- **HawkTunnelSpike** (high-value tunnel data)
- **NeynarBuilderSpike** (builder sentiment)
- **NeynarTrendingSpike** (builder content)

---

## Testing Tunnel Failures

To test fallback behavior:

```bash
# 1. Check current status
curl http://localhost:3100/api/tunnel/status

# 2. Simulate Hawk failure (stop container or pause it)
docker pause hawk  # or let it naturally timeout

# 3. Wait for 3 health checks (~90 seconds)
# or manually reset to speed up testing:
curl -X POST http://localhost:3100/api/tunnel/reset/hawk

# 4. Verify fallback to Cloudflare
curl http://localhost:3100/api/tunnel/status
→ Should show cloudflare.healthy = true

# 5. Resume Hawk
docker unpause hawk

# 6. Verify recovery
curl http://localhost:3100/api/tunnel/status
→ Should show hawk.healthy = true after next check
```

---

## Performance Metrics

### Tunnel Latencies (typical)
- **Hawk** (local): 50-200ms
- **Cloudflare** (CDN): 150-400ms
- **Neynar** (API): 300-800ms

### Health Check Overhead
- Every 30 seconds: 2 HTTP requests (Hawk + Cloudflare)
- ~5ms each = negligible impact
- Auto-scales down when tunnels unhealthy (fewer checks)

### Data Freshness
- **Hawk Spike**: Latest data every 120s
- **Neynar Builder**: Sentiment every 120s
- **Neynar Trending**: Top content every 300s
- Agents see updates within seconds via Redis sub

---

## Builder Channel Priorities

When aggregating (low trending scenario):

1. **onchain** (primary, highest weight)
2. **solana** + **ethereum** (major ecosystems)
3. **development** + **ai-agents** (active builders)
4. **llm** + **tools** (emerging tech)
5. **protocol-labs** + **security** + **payments** (specialized)

Sorting: Engagement (likes + 2x recasts + replies) → Timestamp

---

## Error Handling

### Tunnel Unavailable
```json
{
  "source": "neynar-fallback",
  "tunnel": "neynar",
  "confidence": 0.75,
  "data": { ... }
}
```

### All Sources Down
```json
{
  "source": "error",
  "tunnel": "none",
  "confidence": 0,
  "data": { "error": "All data sources unavailable" }
}
```

### Neynar API Key Missing
```json
{
  "sentiment": "neutral",
  "confidence": 0.3,
  "keywords": [],
  "builder_channels_active": 0,
  "top_topics": []
}
```

---

## Future Enhancements

1. **Per-Tunnel Rate Limiting**: Respect API rate limits
2. **Weighted Averaging**: Blend data from multiple sources when available
3. **Geographic Routing**: Use closest tunnel based on requestor location
4. **Adaptive Intervals**: Increase check frequency when tunnel unstable
5. **Machine Learning**: Predict tunnel failures before they happen
6. **Cross-Chain Data**: Add other builder networks (Base, Optimism, Arbitrum)

---

## Summary

✅ **Hawk Tunnel** = Primary high-bandwidth path
✅ **Cloudflare Tunnel** = Automatic secondary failover
✅ **Neynar** = Always-on builder content fallback
✅ **10 Builder Channels** = Rich, relevant content
✅ **Circuit Breaker** = Automatic recovery when up
✅ **Real-Time Streams** = Agents see changes immediately
✅ **Monitoring Dashboard** = Full visibility into tunnel health

The system is now **resilient, adaptive, and always flowing with builder intelligence**.
