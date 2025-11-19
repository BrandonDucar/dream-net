# CoinSensei 2.0

**READ_ONLY Portfolio Analytics**

## 🔒 Security: Read-Only Mode

CoinSensei is **strictly read-only**:

- ✅ Accepts: Public wallet addresses, CSV transactions, manual entries
- ❌ NEVER accepts: Private keys, seeds, mnemonics, 2FA codes
- ✅ Returns: Analytics only (P&L, allocation, suggestions)
- ❌ NEVER offers: Send, trade, swap, bridge actions

## Hard Boundary

**User Wallets (CoinSensei):**
- Public addresses only
- Read-only portfolio analysis
- No private keys or sensitive data

**Agent Wallets (Separate System):**
- System wallets for infra/testing
- Managed by AgentWalletManager
- NEVER accessed by CoinSensei

## Usage

```typescript
import { CoinSensei } from '@dreamnet/coinsensei-core';

const sensei = new CoinSensei({
  read_only: true, // Always true
});

// Only public data
const result = await sensei.analyze({
  wallets: [
    { address: '0x...', chain: 'ethereum' }, // Public address only
  ],
  manual_entries: [
    { token: 'BTC', amount: 0.5, buy_price: 50000, buy_date: '2024-01-01' },
  ],
});

// Returns analytics only - no transaction capabilities
console.log(result.summary.total_value);
console.log(result.dca_suggestions); // Suggestions only, not actions
```

## API

`POST /api/coinsensei/analyze`

**Accepts:**
- `wallets`: Array of public addresses only
- `cex_transactions`: Transaction history
- `manual_entries`: Manual position entries

**Returns:**
- Portfolio summary
- Positions with P&L
- Data hygiene issues
- Smart suggestions (DCA, rebalance)
- SEO summaries

**NEVER returns:**
- Transaction capabilities
- Trading interfaces
- Send/swap/bridge actions

