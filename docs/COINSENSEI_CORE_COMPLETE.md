# CoinSensei Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

CoinSensei Core provides **READ_ONLY crypto portfolio analytics** for DreamNet. It analyzes portfolios using public wallet addresses, transaction history, and manual entries, providing P&L calculations, allocation analysis, data hygiene checks, and smart suggestions (DCA, rebalance) without any transaction capabilities.

---

## Key Features

### Security: READ_ONLY Mode
- ✅ Accepts: Public wallet addresses, CSV transactions, manual entries
- ❌ NEVER accepts: Private keys, seeds, mnemonics, 2FA codes
- ✅ Returns: Analytics only (P&L, allocation, suggestions)
- ❌ NEVER offers: Send, trade, swap, bridge actions

### Portfolio Analytics
- WAC (Weighted Average Cost) calculation
- FIFO (First In First Out) calculation
- P&L (Profit & Loss) tracking
- Realized and unrealized gains
- Allocation percentages
- Performance rankings

### Data Hygiene
- Duplicate detection
- Ticker mismatch detection
- Impossible quantity detection
- Missing price detection
- Future date detection

### Smart Mode
- DCA (Dollar Cost Averaging) suggestions
- Rebalancing suggestions
- Anomaly detection
- Concentration warnings

### SEO Summary
- Geo-contextual summaries
- ROI tables
- Key stats bullets
- Meta descriptions

---

## Architecture

### Components

1. **Portfolio Engine** (`portfolioEngine.ts`)
   - Portfolio computation
   - WAC/FIFO calculation
   - P&L tracking
   - Allocation calculation

2. **Data Hygiene Engine** (`dataHygiene.ts`)
   - Issue detection
   - Data validation
   - Quality checks
   - Fix suggestions

3. **Smart Mode Engine** (`smartMode.ts`)
   - DCA suggestions
   - Rebalance suggestions
   - Anomaly detection
   - Concentration analysis

4. **Price Provider** (`priceProvider.ts`)
   - Price fetching
   - Multi-source support
   - CoinGecko integration
   - Caching

---

## API Reference

### Initialization

#### `new CoinSensei(config?: Partial<CoinSenseiConfig>): CoinSensei`
Creates CoinSensei instance.

**Example**:
```typescript
import { CoinSensei } from '@dreamnet/coinsensei-core';

const sensei = new CoinSensei({
  quote_currency: 'USD',
  cost_basis_method: 'WAC',
  concentration_warn_threshold: 25,
  geo_default: 'Maryland',
  read_only: true, // Always true
  price_sources: ['coingecko'],
});
```

### Portfolio Analysis

#### `analyze(input: CoinSenseiInput): Promise<CoinSenseiOutput>`
Analyzes portfolio.

**Example**:
```typescript
const result = await sensei.analyze({
  wallets: [
    { address: '0x123...', chain: 'ethereum', label: 'Main Wallet' },
  ],
  cex_transactions: [
    {
      exchange: 'coinbase',
      type: 'buy',
      token: 'BTC',
      amount: 0.5,
      price: 50000,
      date: '2024-01-01',
    },
  ],
  manual_entries: [
    {
      token: 'ETH',
      amount: 10,
      buy_price: 3000,
      buy_date: '2024-01-01',
    },
  ],
});

console.log(`Total Value: $${result.summary.total_value}`);
console.log(`Total P&L: $${result.summary.total_pnl}`);
console.log(`ROI: ${result.summary.roi_pct}%`);
```

---

## Data Models

### CoinSenseiInput

```typescript
interface CoinSenseiInput {
  wallets?: WalletAddress[];
  cex_transactions?: CEXTransaction[];
  manual_entries?: ManualEntry[];
  config?: Partial<CoinSenseiConfig>;
}
```

### CoinSenseiOutput

```typescript
interface CoinSenseiOutput {
  summary: PortfolioSummary;
  positions: TokenPosition[];
  hygiene_issues: DataHygieneIssue[];
  dca_suggestions?: DCASuggestion[];
  rebalance_suggestions?: RebalanceSuggestion[];
  anomalies?: Anomaly[];
  seo_summary?: SEOSummary;
}
```

### PortfolioSummary

```typescript
interface PortfolioSummary {
  total_value: number;
  total_cost_basis: number;
  total_pnl_unrealized: number;
  total_pnl_realized: number;
  total_pnl: number;
  roi_pct: number;
  token_count: number;
  top_holdings: TokenPosition[];
  worst_performers: TokenPosition[];
  best_performers: TokenPosition[];
  concentration_warnings: TokenPosition[];
  summary_text: string;
}
```

### TokenPosition

```typescript
interface TokenPosition {
  token: string;
  symbol: string;
  chain?: string;
  amount: number;
  avg_cost_wac: number;
  avg_cost_fifo: number;
  current_price: number;
  price_source: string;
  total_value: number;
  cost_basis: number;
  pnl_unrealized: number;
  pnl_realized: number;
  allocation_pct: number;
  win_loss_ratio: number;
  first_buy_date?: Date;
  last_trade_date?: Date;
  trades: Trade[];
}
```

---

## Cost Basis Methods

### WAC (Weighted Average Cost)
- Calculates average cost across all purchases
- Weighted by purchase amounts
- Default method
- Suitable for most portfolios

### FIFO (First In First Out)
- Uses oldest purchases first
- More accurate for tax purposes
- Tracks individual lots
- Better for realized P&L

---

## Data Hygiene Issues

### Duplicate Detection
- Identifies duplicate transactions
- Flags same transaction multiple times
- Suggests removal

### Ticker Mismatch
- Detects inconsistent ticker symbols
- Flags potential errors
- Suggests corrections

### Impossible Quantity
- Detects negative balances
- Flags impossible amounts
- Suggests fixes

### Missing Price
- Identifies missing price data
- Flags incomplete transactions
- Suggests price sources

### Future Date
- Detects future-dated transactions
- Flags potential errors
- Suggests corrections

---

## Smart Mode Features

### DCA Suggestions
- Identifies tokens below average cost
- Suggests dollar-cost averaging
- Considers trends
- Provides reasoning

### Rebalance Suggestions
- Identifies concentration issues
- Suggests rebalancing actions
- Calculates target allocations
- Provides reasoning

### Anomaly Detection
- Detects P&L spikes
- Identifies import errors
- Flags airdrop hints
- Detects price discrepancies

---

## Integration Points

### DreamNet Systems
- **Agent Wallet Manager**: Separate system (never accessed)
- **Economic Engine Core**: Economic integration
- **AI SEO Core**: SEO summary integration

### External Systems
- **CoinGecko**: Price data
- **CMC**: Price data (optional)
- **Blockchain APIs**: Wallet data (read-only)

---

## Usage Examples

### Basic Analysis

```typescript
const sensei = new CoinSensei();
const result = await sensei.analyze({
  manual_entries: [
    {
      token: 'BTC',
      amount: 0.5,
      buy_price: 50000,
      buy_date: '2024-01-01',
    },
  ],
});
```

### With CEX Transactions

```typescript
const result = await sensei.analyze({
  cex_transactions: [
    {
      exchange: 'coinbase',
      type: 'buy',
      token: 'ETH',
      amount: 10,
      price: 3000,
      date: '2024-01-01',
    },
  ],
});
```

### With Wallets

```typescript
const result = await sensei.analyze({
  wallets: [
    { address: '0x123...', chain: 'ethereum' },
  ],
});
```

---

## Best Practices

1. **Security**
   - Never pass private keys
   - Use public addresses only
   - Validate inputs
   - Audit access

2. **Data Quality**
   - Clean transaction data
   - Fix hygiene issues
   - Validate prices
   - Check dates

3. **Analysis**
   - Use appropriate cost basis method
   - Review suggestions carefully
   - Monitor concentration
   - Track performance

---

## Security Considerations

1. **READ_ONLY Mode**
   - Enforced at all levels
   - No transaction capabilities
   - No key storage
   - Public data only

2. **Data Protection**
   - Protect wallet addresses
   - Secure transaction data
   - Validate inputs
   - Audit access

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

