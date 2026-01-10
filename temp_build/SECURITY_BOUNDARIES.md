# 🔒 Security Boundaries - CoinSensei & Agent Wallets

## Hard Boundary: User Wallets vs Agent Wallets

### User Wallets (CoinSensei) - READ_ONLY
- **Input:** Public wallet addresses only
- **NEVER accepts:** Private keys, seeds, mnemonics, 2FA codes
- **Returns:** Analytics only (P&L, allocation, suggestions)
- **NEVER offers:** Send, trade, swap, bridge actions
- **Purpose:** Read-only portfolio analysis for humans

### Agent Wallets (AgentWalletManager) - SYSTEM USE ONLY
- **Input:** Agent IDs (system-generated)
- **Mnemonic:** From `AGENT_WALLET_MNEMONIC` env var ONLY
- **Returns:** Public addresses only (private keys NEVER exposed)
- **Purpose:** System wallets for infra/testing
- **Warning:** Testnet/sandbox use unless marked 'production-safe'

---

## CoinSensei Security

### ✅ What CoinSensei Accepts:
- Public wallet addresses
- CEX transaction CSV data
- Manual position entries (token, amount, price, date)

### ❌ What CoinSensei NEVER Accepts:
- Private keys
- Seeds or mnemonics
- 2FA codes or passwords
- Any sensitive authentication data

### ✅ What CoinSensei Returns:
- Portfolio summary (value, P&L, ROI)
- Token positions with analytics
- Data hygiene issues
- Smart suggestions (DCA, rebalance)
- SEO summaries

### ❌ What CoinSensei NEVER Returns:
- Transaction capabilities
- Trading interfaces
- Send/swap/bridge actions
- Any way to move funds

---

## Agent Wallet Manager Security

### ✅ What AgentWalletManager Does:
- Creates wallets for AI agents
- Stores private keys internally (memory only)
- Returns public addresses only
- Uses mnemonic from env var only

### ❌ What AgentWalletManager NEVER Does:
- Exposes private keys via API
- Logs mnemonics or private keys
- Accepts mnemonic from user input
- Returns sensitive data in responses

### 🔐 Environment Variable:
```bash
AGENT_WALLET_MNEMONIC="your twelve word mnemonic phrase here"
```

**Security Rules:**
1. Mnemonic comes ONLY from `AGENT_WALLET_MNEMONIC` env var
2. NEVER logged in console or error messages
3. NEVER returned in API responses
4. NEVER accepted from request body or user input

---

## API Endpoints

### CoinSensei (`/api/coinsensei`)
- `POST /analyze` - Analyzes portfolio (public addresses only)
- `GET /health` - Health check

**Security Validation:**
- Rejects any input containing `privateKey`, `seed`, or `mnemonic`
- Validates wallet address format
- Forces `read_only: true` mode

### Agent Wallets (`/api/agent-wallets`)
- `POST /:agentId/wallet` - Create/get wallet (returns public data only)
- `GET /:agentId/wallet/:chain/balance` - Get balance
- `GET /:agentId/wallets` - List wallets (public data only)
- `GET /all` - List all wallets (admin, public data only)

**Security:**
- All endpoints return `AgentWalletPublic` interface
- Private keys NEVER included in responses
- Mnemonic initialized from env only

---

## Code Structure

### Type Separation:
```typescript
// User wallets - public only
interface WalletAddress {
  address: string; // Public address only
  // NOTE: NEVER include privateKey, seed, mnemonic
}

// Agent wallets - internal vs public
interface AgentWalletInternal {
  privateKey: string; // Internal use only
}

interface AgentWalletPublic {
  // No privateKey - safe to return
}
```

### Function Boundaries:
- `CoinSensei.analyze()` - Only accepts public data
- `AgentWalletManager.getOrCreateWallet()` - Returns public interface only
- `AgentWalletManager.getPrivateKey()` - Internal use only, never exposed via API

---

## Production Checklist

- [ ] Set `AGENT_WALLET_MNEMONIC` in environment variables
- [ ] Encrypt private keys at rest (not just in memory)
- [ ] Use hardware security modules (HSM) for key storage
- [ ] Implement key rotation policies
- [ ] Add audit logging for wallet operations
- [ ] Rate limit API endpoints
- [ ] Add authentication/authorization for agent wallet endpoints
- [ ] Review all error messages for sensitive data leaks
- [ ] Test that private keys never appear in logs or responses

---

**Status: 🔒 Security boundaries enforced and documented**

