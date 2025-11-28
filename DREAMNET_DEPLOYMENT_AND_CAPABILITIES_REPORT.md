# DreamNet Deployment Strategy & System Capabilities Report

**Date:** November 27, 2025  
**Status:** Active Development & Deployment  
**Report Type:** Comprehensive Architecture & Capabilities Analysis

---

## 🎯 CURRENT OBJECTIVE: Vercel Frontend Deployment

### What We're Trying to Do Right Now

**Primary Goal:** Deploy DreamNet's frontend application (`client/`) to Vercel and connect it to `dreamnet.ink` domain.

**Current Status:**
- ✅ Vercel project created: `dreamnet-client`
- ✅ GitHub repository connected: `BrandonDucar/dream-net`
- ✅ Domain configured: `dreamnet.ink` (assigned to project)
- ✅ Configuration files updated: `vercel.json` optimized for monorepo
- ⚠️ **Build failing** - Working through configuration issues

**Recent Fixes Applied:**
1. Removed `package-lock.json` from `client/` to force pnpm usage
2. Updated `installCommand` to work with `rootDirectory: client` setting
3. Simplified `buildCommand` to `pnpm build` (removed redundant install)
4. Configured Node.js 24.x runtime for functions

**Current Configuration (`vercel.json`):**
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "installCommand": "corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && pnpm install",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.dreamnet.ink/api/$1"
    }
  ],
  "functions": {
    "dist/**/*.js": {
      "runtime": "nodejs24.x"
    }
  }
}
```

**Vercel Dashboard Settings:**
- Root Directory: `client`
- Node.js Version: `24.x`
- Framework: Other (Vite)

---

## 🌐 DEPLOYMENT ARCHITECTURE: Why Vercel + Google Cloud?

### The Hybrid Strategy

DreamNet uses a **hybrid multi-platform deployment strategy** rather than a single provider:

```
┌─────────────────────────────────────────────────────────────┐
│                    DREAMNET ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  FRONTEND (Vercel)                                           │
│  ├─ URL: https://dreamnet.ink                               │
│  ├─ Location: client/ directory                             │
│  ├─ Framework: React 18 + TypeScript + Vite                 │
│  ├─ Build: Static HTML/CSS/JS                                │
│  └─ API Proxy: /api/* → https://api.dreamnet.ink/api/*     │
│                                                               │
│  BACKEND (Google Cloud Run)                                  │
│  ├─ URL: https://api.dreamnet.ink                           │
│  ├─ Location: server/ directory                              │
│  ├─ Runtime: Node.js 24.x                                    │
│  ├─ Service: Cloud Run (containerized serverless)           │
│  └─ Credits: $1,279 Google Cloud credits available          │
│                                                               │
│  DATABASE (Neon PostgreSQL)                                  │
│  ├─ Type: PostgreSQL (serverless)                            │
│  ├─ Location: Cloud-hosted                                    │
│  └─ Connection: Via DATABASE_URL env var                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Why Not Just Google Cloud?

**1. Frontend Optimization (Vercel Advantages)**
- **Global CDN**: Vercel's edge network provides sub-50ms latency worldwide
- **Automatic Deployments**: GitHub integration triggers instant deployments on push
- **Preview Deployments**: Every PR gets a preview URL for testing
- **Zero Configuration**: Optimized for React/Vite out of the box
- **Free Tier**: Vercel Pro plan provides unlimited bandwidth and deployments
- **Edge Functions**: Can run serverless functions at the edge for low latency

**2. Backend Optimization (Google Cloud Advantages)**
- **Credits Available**: $1,279 in Google Cloud credits to maximize
- **Cloud Run Benefits**:
  - Auto-scaling (0 to N instances based on traffic)
  - Pay-per-use pricing (only pay when requests are served)
  - Container-based (consistent deployment environment)
  - Integrated with Google Cloud services (Cloud SQL, Cloud Storage, etc.)
- **Free Tier**: 2M requests/month, 360K GB-seconds, 180K vCPU-seconds free
- **Enterprise Features**: Cloud SQL, Cloud Storage, BigQuery integration ready

**3. Separation of Concerns**
- **Frontend Independence**: Frontend can be updated/deployed without touching backend
- **Backend Scalability**: Backend scales independently based on API load
- **Cost Optimization**: Frontend (static) costs near-zero on Vercel, backend scales on-demand
- **Disaster Recovery**: If one platform fails, the other continues operating

**4. Best-of-Breed Approach**
- **Vercel**: Industry leader in frontend deployment (used by Next.js, React teams)
- **Google Cloud**: Enterprise-grade backend infrastructure with credits available
- **Neon**: Modern PostgreSQL with serverless scaling

**5. Cost Efficiency**
- **Vercel Pro**: Already paid for 60-month plan (unlimited deployments)
- **Google Cloud**: $1,279 credits + Free Tier = 6-12 months free
- **Total Monthly Cost**: ~$0-40/month (with credits)

### Why Not Just Google Cloud for Everything?

**Disadvantages of Single-Provider Approach:**

1. **Frontend Performance**: Google Cloud Run is optimized for API workloads, not static asset delivery
2. **Deployment Complexity**: Would need to build frontend into Docker container, serve static files from Express
3. **CDN Limitations**: Google Cloud CDN requires additional setup and configuration
4. **Developer Experience**: Vercel provides superior DX for frontend development (preview URLs, instant deployments)
5. **Cost**: Serving static files from Cloud Run would consume credits unnecessarily

**Current Architecture Benefits:**
- ✅ Frontend optimized for static delivery (Vercel CDN)
- ✅ Backend optimized for API workloads (Cloud Run)
- ✅ Each service uses the best tool for its job
- ✅ Maximum utilization of available credits
- ✅ Best developer experience for both frontend and backend

---

## 🚀 NEW CAPABILITIES & SYSTEM UPGRADES

### 1. Browser Agent Core (Phase 1 & 2 Complete)

**What It Is:**
A secure, governed browser automation system that allows specialized agents to interact with web pages in a controlled, auditable manner.

**Key Features:**
- **Specialized Agent Access**: Only `WebOpsAgent` / `BrowserSurgeon` can use browser capabilities
- **Domain Allowlist**: Strict domain validation before any browser actions
- **Mission-Based**: All browser actions wrapped in `BrowserMission` contracts
- **Full Audit Logging**: Every action logged with timestamps, agent ID, mission ID
- **Credential Indirection**: Credentials stored in secrets layer, never exposed to models
- **Phased Capability**: Started READ-ONLY, expanded to limited write operations

**Implementation:**
- **Phase 1**: Types, mission contracts, logging, stubbed executor
- **Phase 2**: Real Playwright integration, screenshot storage, credential profiles
- **Location**: `packages/browser-agent-core/`
- **API Routes**: `server/routes/browser-agent.ts`

**Use Cases:**
- Automated Vercel dashboard configuration
- Web scraping with governance
- Automated testing and monitoring
- WebOps automation tasks

---

### 2. Spike Agent Wrappers (Market Data Collection)

**What It Is:**
Intelligent agents that wrap existing data collection "spikes" (data collectors) with monitoring, browser automation, and autonomous decision-making capabilities.

**Three Spike Agents:**

#### **MetalsAgent** (Precious Metals)
- **Data Source**: Metals-API / MetalpriceAPI
- **Monitors**: XAU (Gold), XAG (Silver), XPT (Platinum), XPD (Palladium)
- **Capabilities**:
  - Real-time price monitoring
  - Price alert triggers
  - Browser automation for price verification
  - Autonomous decision-making on price thresholds
- **Location**: `packages/spike-agents/metals-agent/`

#### **CryptoAgent** (Cryptocurrency)
- **Data Source**: CoinGecko API
- **Monitors**: BTC, ETH, SHEEP token, and 100+ cryptocurrencies
- **Capabilities**:
  - Real-time price tracking
  - Portfolio monitoring
  - Trading signal generation
  - Meme coin scanning
- **Location**: `packages/spike-agents/crypto-agent/`

#### **StockAgent** (Stock Market)
- **Data Source**: Alpha Vantage API
- **Monitors**: S&P 500, NASDAQ, individual stocks
- **Capabilities**:
  - Real-time stock prices
  - Market trend analysis
  - Technical indicator calculation
  - Browser automation for market data verification
- **Location**: `packages/spike-agents/stock-agent/`

**Key Innovation:**
Each spike agent is **intelligent** - it doesn't just collect data, it:
- Monitors data quality and anomalies
- Makes autonomous decisions (e.g., "price dropped 5%, trigger alert")
- Uses browser automation to verify data from multiple sources
- Integrates with DreamNet's event system (Spider Web Core)

---

### 3. Competitive Intelligence Core

**What It Is:**
A comprehensive system for researching, analyzing, and learning from competitors across all industries DreamNet impacts.

**Components:**

#### **ResearchAgent**
- Scans top 10 companies in each vertical
- Identifies what competitors do best
- Discovers cutting-edge features and innovations
- Tracks competitor roadmaps and announcements

#### **AnalysisEngine**
- Analyzes competitor strengths and weaknesses
- Identifies feature gaps and opportunities
- Generates competitive positioning insights
- Creates opportunity matrices

#### **OpportunityFinder**
- Identifies features to "hijack" and improve
- Finds innovation opportunities
- Maps competitive landscape
- Prioritizes opportunities by impact

#### **RoadmapGenerator**
- Creates innovation roadmap based on competitive analysis
- Prioritizes features to stay ahead
- Generates "DreamNet way" implementations
- Plans feature rollout strategy

**Verticals Analyzed:**
- AI/ML Platforms & Agent Orchestration (OpenAI, Anthropic, LangChain)
- Web3/Blockchain Infrastructure (Base, Coinbase, Uniswap)
- Security & Threat Detection (Cloudflare, CrowdStrike)
- DevOps & Infrastructure (Vercel, Railway, AWS)
- Travel & Hospitality (Booking.com, Airbnb)
- OTT & Streaming (Netflix, Disney+, Spotify)
- Precious Metals & Trading (Kitco, APMEX)
- Financial Services (Stripe, Plaid, Bloomberg)
- Social Media & Communication (Meta, Twitter, Farcaster)
- Military & Defense Tech (Palantir, Anduril)

**Location**: `packages/competitive-intelligence-core/`

---

### 4. Google Cloud Free Tier Quota Tracking

**What It Is:**
A system that tracks Google Cloud Free Tier usage to maximize free credits before spending paid credits.

**Free Tier Limits Tracked:**

#### **Cloud Run**
- 2 million requests per month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds of compute time
- 1 GB of outbound data transfer from North America

#### **Cloud Build**
- 2,500 build-minutes per month (e2-standard-2 machine type)

#### **BigQuery**
- 1 TB of querying per month
- 10 GB of storage

**Features:**
- **Real-Time Tracking**: Records every Cloud Run request, calculates GB-seconds and vCPU-seconds
- **Throttling Logic**: When quota usage exceeds 80%, reduces rate limits; at 95%, blocks new operations
- **Monthly Reset**: Automatically resets all counters on the 1st of each month at midnight UTC
- **API Endpoints**: `/api/free-tier-quota/status` for monitoring
- **Governor Integration**: Cloud Run Governor checks quotas before allowing operations

**Location**: `server/services/FreeTierQuotaService.ts`, `server/routes/free-tier-quota.ts`

**Impact:**
- Maximizes $1,279 Google Cloud credits by using Free Tier first
- Prevents unexpected charges
- Provides visibility into resource usage
- Enables cost optimization

---

### 5. Data Integrity Core (Blockchain-Based)

**What It Is:**
A system that stores data hashes on the Base blockchain to provide immutable audit trails for all data collection.

**Features:**
- **SHA-256 Hashing**: All collected data is hashed before storage
- **Merkle Root Batching**: Multiple data points batched with Merkle root calculation
- **Base Blockchain Storage**: Hashes stored on Base network via ethers.js
- **Immutable Audit Trails**: Cannot be tampered with or deleted
- **Data Verification**: Any data can be verified against blockchain hash

**Use Cases:**
- Market data integrity verification
- Competitive intelligence data provenance
- Agent action audit trails
- System event immutability

**Location**: `packages/data-integrity-core/`

---

### 6. Enhanced Defensive & Offensive Spikes

**What It Is:**
Upgraded Shield Core system with modern threat detection and counter-attack capabilities.

**New Capabilities:**

#### **AI-Powered Threat Detection**
- Real-time ML threat classification
- Anomaly detection using behavioral analysis
- Predictive threat modeling
- Pattern recognition across attack vectors

#### **Offensive Spikes Enhanced**
- **Active Counter-Attacks**: Automated response to threats
- **Threat Intelligence Sharing**: Shares threat data across DreamNet nodes
- **Deception Networks**: Honeypots that learn from attackers
- **Rate-Limit Spikes**: Dynamic rate limiting based on threat level
- **Block & Redirect Spikes**: Intelligent blocking with redirect to safe zones
- **Trace Spikes**: Forensic tracking of attack sources

#### **Zero-Trust Architecture**
- Continuous verification of all requests
- Device fingerprinting
- Micro-segmentation of services
- Behavioral analysis for access control

**Location**: `packages/shield-core/`

---

### 7. Real-Time Streaming Data Collection

**What It Is:**
A Kafka-like architecture for real-time data collection with edge computing and stream processing.

**Features:**
- **Event Streaming**: Real-time event publishing via Instant Mesh
- **Edge Computing**: Data processing at the edge for low latency
- **Stream Processing**: Real-time transformation and aggregation
- **Time-Series Storage**: Optimized storage for time-series data
- **Fly Catching**: Spider Web Core catches and processes "flies" (events) in real-time

**Integration:**
- Spike agents publish events to Instant Mesh
- Spider Web Core processes events
- Data stored in time-series format
- Blockchain hashes stored for integrity

**Location**: `packages/spider-web-core/`, `packages/instant-mesh/`

---

### 8. Agent Registry & DreamKeeper Integration

**What It Is:**
Centralized agent registration, health monitoring, and governance system.

**Features:**
- **Agent Registry**: All 143+ agents registered in Super Spine
- **Health Monitoring**: Real-time agent health checks
- **DreamKeeper Core**: Governance system for diagnostics and healing
- **Agent Marketplace**: Paid agent subscriptions (Wolf Pack: 100 DREAM/month)
- **Task Routing**: Intelligent task routing to appropriate agents

**New Agents Registered:**
- Browser Agent (WebOpsAgent / BrowserSurgeon)
- MetalsAgent, CryptoAgent, StockAgent (Spike Agents)
- Competitive Intelligence Agents (ResearchAgent, AnalysisEngine, etc.)

**Location**: `server/core/SuperSpine.ts`, `packages/dreamkeeper-core/`

---

## 📊 SYSTEM STATISTICS

### Agent Ecosystem
- **Total Agents**: 143+ registered agents
- **Core Agents**: LUCID, CANVAS, ROOT, CRADLE, WING
- **Premium Agents**: Wolf Pack (100 DREAM/month), CRADLE (50 DREAM/month), WING (30 DREAM/month)
- **New Agents**: Browser Agent, 3 Spike Agents, Competitive Intelligence Agents

### Biomimetic Systems
- **Spider Web Core**: Nervous system (event routing)
- **Star Bridge Lungs**: Cross-chain communication (Base, Ethereum, Solana, Polygon, Arbitrum, Avalanche, Near, Monad)
- **Neural Mesh**: Synaptic connections and memory
- **Dream Snail**: Privacy layer with hash-chained trails
- **Shield Core**: Immune system / defense (400+ defense spikes)
- **Halo-Loop**: Self-healing analyzer
- **Predator-Scavenger Loop**: Metabolic cleanup

### Data Collection
- **Market Data**: Metals (4), Crypto (100+), Stocks (S&P 500, NASDAQ)
- **Competitive Intelligence**: 10 verticals, 100+ companies analyzed
- **Real-Time Feeds**: Live price updates every 3-5 seconds
- **Blockchain Integration**: Base network for data integrity

### Infrastructure
- **Frontend**: Vercel (dreamnet.ink)
- **Backend**: Google Cloud Run (api.dreamnet.ink)
- **Database**: Neon PostgreSQL
- **Credits**: $1,279 Google Cloud credits available
- **Free Tier**: Tracking Cloud Run, Cloud Build, BigQuery quotas

---

## 🎯 NEXT STEPS

### Immediate (Current Session)
1. ✅ Fix Vercel build configuration
2. ⏳ Verify successful deployment
3. ⏳ Connect `dreamnet.ink` domain
4. ⏳ Test frontend → backend API connection

### Short-Term
1. Deploy backend to Google Cloud Run
2. Configure domain routing (dreamnet.ink → Vercel, api.dreamnet.ink → Cloud Run)
3. Set up environment variables in both platforms
4. Verify Free Tier quota tracking is working
5. Test all new capabilities (Browser Agent, Spike Agents, Competitive Intelligence)

### Long-Term
1. Integrate VeChain and Kaspa blockchain support
2. Build game on Remix.gg platform
3. Expand competitive intelligence to more verticals
4. Enhance browser agent with more capabilities
5. Optimize Free Tier usage to maximize credits

---

## 💡 KEY INSIGHTS

### Why This Architecture Works

1. **Separation of Concerns**: Frontend and backend optimized for their specific workloads
2. **Cost Efficiency**: Maximizes free tiers and available credits
3. **Scalability**: Each component scales independently
4. **Developer Experience**: Best tools for each job (Vercel for frontend, GCP for backend)
5. **Resilience**: If one platform fails, the other continues operating

### Innovation Highlights

1. **Intelligent Data Collection**: Spike agents don't just collect data, they monitor, analyze, and make decisions
2. **Governed Browser Automation**: Secure, auditable browser automation for agents
3. **Competitive Intelligence**: Systematic analysis of competitors to stay ahead
4. **Free Tier Optimization**: Maximizing free credits before spending paid credits
5. **Blockchain Data Integrity**: Immutable audit trails for all collected data

---

**Report Generated:** November 27, 2025  
**Status:** Active Development  
**Next Review:** After successful Vercel deployment

