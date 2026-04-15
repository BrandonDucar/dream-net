# Agent Wallet Manager

**SECURITY BOUNDARY: Testnet/Sandbox Use Only**

## ⚠️ Security Warnings

1. **Hard Separation from User Wallets**
   - User wallets (CoinSensei) = public addresses only (read-only)
   - Agent wallets = system wallets for infra/testing
   - NEVER mix these boundaries

2. **Private Key Protection**
   - Mnemonic comes ONLY from environment variables
   - NEVER logged, NEVER returned in API responses
   - NO endpoints that export private keys or mnemonics
   - Private keys stored in memory only (encrypt at rest in production)

3. **Production Use**
   - This is for testnet/sandbox use unless explicitly marked 'production-safe'
   - In production: use hardware security modules (HSM) for key storage
   - Implement key rotation policies
   - Add audit logging for wallet operations

## Usage

```typescript
import { getAgentWalletManager } from '@dreamnet/agent-wallet-manager';

// Mnemonic from env only
const mnemonic = process.env.AGENT_WALLET_MNEMONIC;
const walletManager = getAgentWalletManager(mnemonic);

// Create wallet (returns PUBLIC interface only)
const wallet = await walletManager.getOrCreateWallet('agent-id', 'ethereum');
console.log(wallet.address); // Public address only
// wallet.privateKey is NEVER exposed
```

## API Endpoints

All endpoints return PUBLIC data only (no private keys):

- `POST /api/agent-wallets/:agentId/wallet` - Create/get wallet
- `GET /api/agent-wallets/:agentId/wallet/:chain/balance` - Get balance
- `GET /api/agent-wallets/:agentId/wallets` - List agent wallets
- `GET /api/agent-wallets/all` - List all wallets (admin)

**NEVER exposes:**
- Private keys
- Mnemonics
- Seeds
- Any sensitive data

