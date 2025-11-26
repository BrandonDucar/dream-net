# Spike Agents Implementation

## Overview

Each market data spike (MetalsSpike, CryptoSpike, StockSpike) now has an intelligent agent wrapper that monitors data collection, uses browser automation for verification, and makes autonomous decisions.

## Architecture

### Agent Hierarchy

```
BaseSpikeAgent (abstract)
├── MetalsAgent → wraps MetalsSpike
├── CryptoAgent → wraps CryptoSpike
└── StockAgent → wraps StockSpike
```

### Key Components

1. **BaseSpikeAgent** (`packages/market-data-core/agents/BaseSpikeAgent.ts`)
   - Abstract base class providing common functionality
   - Health monitoring (success/error tracking, latency, data quality)
   - Agent Registry integration
   - Spider Web Core fly emission
   - Decision making framework

2. **MetalsAgent** (`packages/market-data-core/agents/MetalsAgent.ts`)
   - Monitors Metals-API health
   - Browser automation for dashboard checks
   - Price verification on external websites
   - Frequency adjustment based on API health

3. **CryptoAgent** (`packages/market-data-core/agents/CryptoAgent.ts`)
   - Monitors CoinGecko API health
   - Checks CoinGecko status page
   - Verifies prices on CoinGecko website
   - Detects missing coins in responses

4. **StockAgent** (`packages/market-data-core/agents/StockAgent.ts`)
   - Monitors Alpha Vantage API health
   - Respects rate limits (5 calls/minute)
   - Verifies prices on financial websites
   - Prioritizes high-value symbols

5. **Browser Helpers** (`packages/market-data-core/agents/browser-helpers.ts`)
   - `checkAPIDashboard()` - Check API dashboard for status
   - `verifyPriceOnWebsite()` - Verify price matches on external site
   - `checkAPIStatusPage()` - Check API status page

6. **Agent Registry Integration** (`packages/market-data-core/agents/agent-registry.ts`)
   - Registers all three agents with Agent Registry
   - Initializes integration on startup

## Agent Capabilities

### Monitoring
- **Fetch Latency**: Tracks response times for each fetch
- **Data Quality**: Calculates quality score based on success rate
- **API Health**: Monitors API status (healthy/degraded/down)
- **Error Tracking**: Counts and categorizes errors

### Browser Automation
- **Dashboard Checks**: Automatically checks API dashboards when errors occur
- **Price Verification**: Verifies prices on external websites
- **Status Page Monitoring**: Checks API status pages for outages
- **Screenshot Capture**: Takes screenshots for troubleshooting

### Decision Making
- **Fetch Skipping**: Skips fetches if API is down
- **Frequency Adjustment**: Adjusts fetch frequency based on API health
- **Rate Limit Handling**: Respects API rate limits (especially for stocks)
- **Anomaly Detection**: Alerts on price anomalies or missing data

### Health Reporting
- **Agent Registry**: Reports success/error counts and state
- **Spider Web Core**: Emits flies with agent events and health metrics
- **DreamKeeper**: Health metrics available for diagnostics

## API Endpoints

### Existing Endpoints (Backward Compatible)
- `GET /api/market-data/status` - Get status of all spikes
- `GET /api/market-data/metals` - Get current metals prices
- `GET /api/market-data/crypto` - Get current crypto prices
- `GET /api/market-data/stocks` - Get current stock prices
- `GET /api/market-data/all` - Get all market data

### New Endpoints
- `GET /api/market-data/agents` - Get agent metrics and health for all spike agents

## Agent Authorization

Spike agents are authorized to use browser automation:
- `MetalsAgent`
- `CryptoAgent`
- `StockAgent`

(Along with `WebOpsAgent` and `BrowserSurgeon`)

## Configuration

Agents are automatically initialized when `MarketDataCore` is created:

```typescript
const marketDataCore = new MarketDataCore({
  useAgents: true, // Default: true
  metals: {
    enabled: true,
    frequency: 60000, // 1 minute
    apiKey: process.env.METALS_API_KEY,
  },
  crypto: {
    enabled: true,
    frequency: 60000,
    symbols: ["bitcoin", "ethereum", "base", "solana"],
  },
  stocks: {
    enabled: true,
    frequency: 300000, // 5 minutes (rate limits)
    apiKey: process.env.ALPHA_VANTAGE_API_KEY,
    symbols: ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"],
  },
});
```

## Usage

### Accessing Agents

```typescript
const marketDataCore = (global as any).marketDataCore;

// Get agent instances
const metalsAgent = marketDataCore.getMetalsAgent();
const cryptoAgent = marketDataCore.getCryptoAgent();
const stockAgent = marketDataCore.getStockAgent();

// Get agent metrics
const metalsMetrics = metalsAgent.getMetrics();
const cryptoMetrics = cryptoAgent.getMetrics();
const stockMetrics = stockAgent.getMetrics();

// Get spike status
const metalsStatus = metalsAgent.getSpikeStatus();
const cryptoStatus = cryptoAgent.getSpikeStatus();
const stockStatus = stockAgent.getSpikeStatus();
```

### Browser Automation

Agents can use browser automation to verify data and troubleshoot:

```typescript
// Check API dashboard
const dashboardStatus = await metalsAgent.checkAPIDashboard();

// Verify price on website
const priceMatch = await metalsAgent.verifyDataOnWebsite("XAU", 2000, "https://goldprice.org");

// Check API status page
const statusCheck = await cryptoAgent.checkAPIDashboard();
```

## Benefits

1. **Intelligence**: Agents make autonomous decisions about when to fetch, when to skip, and how to handle errors
2. **Monitoring**: Built-in health tracking and reporting to Agent Registry and DreamKeeper
3. **Browser Automation**: Can verify data, check dashboards, and troubleshoot issues automatically
4. **Integration**: Works seamlessly with Agent Registry, DreamKeeper, and Spider Web Core
5. **Scalability**: Easy to add more spike agents in the future
6. **Backward Compatibility**: Existing API routes and spike access methods still work

## Future Enhancements

- ML-based anomaly detection for price changes
- Predictive API health monitoring
- Automated API key rotation
- Cross-agent coordination for shared resources
- Advanced browser automation workflows

