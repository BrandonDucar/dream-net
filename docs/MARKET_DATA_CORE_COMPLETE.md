# Market Data Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Market Data Core provides **real-time market data collection** for metals, crypto, and stock markets. It uses intelligent agent wrappers to collect, process, and provide market data spikes with configurable frequency and filtering.

---

## Key Features

### Multi-Asset Support
- **Metals**: Gold (XAU), Silver (XAG), Platinum (XPT), Palladium (XPD)
- **Crypto**: All major cryptocurrencies
- **Stocks**: Major stock indices and individual stocks

### Intelligent Agents
- MetalsAgent: Metal price collection
- CryptoAgent: Crypto price collection
- StockAgent: Stock price collection
- RWAValuationOracle: RWA valuation

### Real-Time Data
- Configurable frequency
- Automatic updates
- Error handling
- Status tracking

### Agent Integration
- Agent registry integration
- Intelligent wrappers
- Fallback to direct spikes
- Consistent interface

---

## Architecture

### Components

1. **Market Data Core** (`index.ts`)
   - Main orchestrator
   - Agent management
   - Status tracking
   - Configuration

2. **Metals Spike** (`metalsSpike.ts`)
   - Metal price collection
   - API integration
   - Data processing

3. **Crypto Spike** (`cryptoSpike.ts`)
   - Crypto price collection
   - CoinGecko integration
   - Market data processing

4. **Stock Spike** (`stockSpike.ts`)
   - Stock price collection
   - Market API integration
   - Data processing

5. **Agents**
   - MetalsAgent
   - CryptoAgent
   - StockAgent
   - RWAValuationOracle

---

## API Reference

### Initialization

#### `new MarketDataCore(config?: MarketDataCoreConfig): MarketDataCore`
Creates Market Data Core instance.

**Example**:
```typescript
import { MarketDataCore } from '@dreamnet/market-data-core';

const marketData = new MarketDataCore({
  metals: {
    enabled: true,
    frequency: 60000, // 1 minute
  },
  crypto: {
    enabled: true,
    frequency: 30000, // 30 seconds
    symbols: ['BTC', 'ETH', 'DREAM'],
  },
  stocks: {
    enabled: true,
    frequency: 60000,
    symbols: ['AAPL', 'GOOGL'],
  },
  useAgents: true, // Default: true
});
```

### Control

#### `start(): void`
Starts all enabled agents/spikes.

**Example**:
```typescript
marketData.start();
```

#### `stop(): void`
Stops all agents/spikes.

**Example**:
```typescript
marketData.stop();
```

#### `getStatus(): MarketDataSpikeStatus`
Gets status of all agents/spikes.

**Example**:
```typescript
const status = marketData.getStatus();
console.log(`Metals: ${status.metals.isRunning}`);
console.log(`Crypto: ${status.crypto.isRunning}`);
console.log(`Stocks: ${status.stocks.isRunning}`);
```

---

## Data Models

### MetalPrice

```typescript
interface MetalPrice {
  symbol: string; // XAU, XAG, XPT, XPD
  price: number;
  currency: string;
  timestamp: number;
  change24h?: number;
  changePercent24h?: number;
}
```

### CryptoPrice

```typescript
interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  totalVolume: number;
  high24h: number;
  low24h: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  timestamp: number;
}
```

### StockPrice

```typescript
interface StockPrice {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
  change?: number;
  changePercent?: number;
}
```

### MarketDataSpikeConfig

```typescript
interface MarketDataSpikeConfig {
  enabled: boolean;
  frequency: number; // milliseconds
  apiKey?: string;
  symbols?: string[];
}
```

---

## Agents Explained

### MetalsAgent
- Collects metal prices
- Supports XAU, XAG, XPT, XPD
- Real-time updates
- Error handling

### CryptoAgent
- Collects crypto prices
- CoinGecko integration
- Market data processing
- Symbol filtering

### StockAgent
- Collects stock prices
- Market API integration
- Symbol filtering
- Real-time updates

### RWAValuationOracle
- RWA valuation
- Real-time updates
- Integration with RWA systems

---

## Integration Points

### DreamNet Systems
- **Agent Registry Core**: Agent registration
- **Economic Engine Core**: Economic data
- **CoinSensei Core**: Price data
- **Liquidity Engine**: Market data

### External Systems
- **CoinGecko**: Crypto prices
- **Metal APIs**: Metal prices
- **Stock APIs**: Stock prices
- **RWA Systems**: RWA valuation

---

## Usage Examples

### Basic Setup

```typescript
const marketData = new MarketDataCore({
  crypto: { enabled: true, frequency: 60000 },
});
marketData.start();
```

### With Filtering

```typescript
const marketData = new MarketDataCore({
  crypto: {
    enabled: true,
    frequency: 30000,
    symbols: ['BTC', 'ETH', 'DREAM'],
  },
});
```

### Get Status

```typescript
const status = marketData.getStatus();
console.log(`Crypto Status:`, status.crypto);
```

---

## Best Practices

1. **Configuration**
   - Set appropriate frequencies
   - Enable only needed assets
   - Use symbol filtering
   - Configure API keys

2. **Error Handling**
   - Monitor error counts
   - Handle API failures
   - Retry logic
   - Log errors

3. **Performance**
   - Use appropriate frequencies
   - Filter symbols
   - Cache data
   - Monitor status

---

## Security Considerations

1. **API Keys**
   - Protect API keys
   - Use environment variables
   - Rotate keys regularly
   - Monitor usage

2. **Data Security**
   - Validate data
   - Sanitize inputs
   - Protect endpoints
   - Audit access

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
