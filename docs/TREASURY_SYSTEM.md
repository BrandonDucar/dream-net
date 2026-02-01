# 🏦 Treasury Accountability System

## Overview

The Treasury Service enables **autonomous agent wallets** while maintaining **full human control and accountability**.

## Architecture

### Master Wallets (Human-Controlled)

- **Base**: `0x57D7789E4E90f6FE692CAb607D699ec591581D354` (MetaMask)
- **Solana**: `L6NM4Vone4DeMHHeg4THrUFbph6yNCLLervRKAQtkGKz` (Phantom)

### Agent Wallet Derivation

- Each agent can request a derived wallet on Base or Solana
- Wallets are deterministically generated using BIP32/BIP44 standards
- Derivation path: `m/44'/{coin_type}'/0'/0/{agent_index}`
- All private keys remain recoverable from master seed

### Tradeable Assets (Solana)

Agents are authorized to trade the following tokens from the Phantom wallet:

- ✅ **USDC** - `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- ✅ **CASH** - Solana-based cash token
- ✅ **WEN** - `WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk`
- ✅ **BEST** - `8f1zccZPpbjz177Ay9wZKT5Mx2oPtUyxAVz5p5yzEbonk`

### Protected Assets (Base)

- 🛡️ **SPARK (SPK)** - `0x692A07f2306a3bba739e5281A26A5a97C6D7A6cA` - **IMMUTABLE**
- 🛡️ **Staked SPARK (stSPK)** - **IMMUTABLE**

## Database Schema

### AgentWallet

```prisma
model AgentWallet {
  id             String   @id @default(cuid())
  agentId        String
  chain          String   // BASE or SOLANA
  address        String   @unique
  derivationPath String
  parentWallet   String   // Master wallet address
  createdAt      DateTime @default(now())
  
  @@unique([agentId, chain])
}
```

### AgentTransaction

```prisma
model AgentTransaction {
  id          String   @id @default(cuid())
  agentId     String
  chain       String   // BASE or SOLANA
  type        String   // SEND, RECEIVE, SWAP
  amount      String
  token       String
  destination String?
  txHash      String?
  timestamp   DateTime @default(now())
}
```

## Usage

### Create Agent Wallet

```typescript
const treasury = new TreasuryService();
const wallet = await treasury.createAgentWallet('agent-123', 'SOLANA');
// Returns: { address, derivationPath, parentWallet }
```

### Log Transaction

```typescript
await treasury.logTransaction(
  'agent-123',
  'SOLANA',
  'SWAP',
  '100',
  'USDC',
  'WEN_POOL',
  '0x...'
);
```

### Sweep Funds to Master

```typescript
await treasury.sweepToMaster('agent-123', 'SOLANA');
// All funds return to master wallet
```

## Security Guarantees

1. **Full Recoverability**: All agent wallets can be regenerated from master seed
2. **Audit Trail**: Every transaction is logged to Neon database
3. **Sweep Capability**: Funds can be recalled to master at any time
4. **Protected Assets**: SPARK tokens are hardcoded as immutable
5. **Durable Execution**: All operations use WAL for crash recovery

## Economic Flow

```
Master Wallet (Human)
    ↓
Agent Wallet (Derived)
    ↓
Trading Activity (Logged)
    ↓
Sweep Back (Recoverable)
```

## Compliance

- All transactions are timestamped and immutable
- Agent IDs link to Pulse X registry
- Chain-specific tracking (Base vs Solana)
- Real-time balance reconciliation available
