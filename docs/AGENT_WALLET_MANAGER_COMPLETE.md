# Agent Wallet Manager - Complete Documentation

**Package**: `@dreamnet/agent-wallet-manager`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

Agent Wallet Manager provides **secure wallet management for AI agents** that need blockchain wallets. It creates and manages wallets for agents, with **hard separation** from user wallets (CoinSensei). This is for testnet/sandbox use unless explicitly marked production-safe.

### Key Features

- **Agent Wallets**: Creates wallets for agents (separate from user wallets)
- **Deterministic Generation**: Supports mnemonic-based deterministic wallet generation
- **Random Generation**: Supports random wallet generation
- **Balance Checking**: Get wallet balances via provider
- **Security Boundary**: Hard separation from user wallets, private keys never exposed

---

## Architecture

### How It Works

```
Agent Request → Wallet Lookup → Create Wallet (if needed) → Return Public Interface
```

1. **Agent Request**: Agent requests wallet via `getOrCreateWallet()`
2. **Wallet Lookup**: System checks if wallet exists for agent+chain
3. **Create Wallet**: If not exists, creates wallet (deterministic or random)
4. **Return Public Interface**: Returns public wallet data (no private keys)

### Why This Design

- **Security Boundary**: Hard separation from user wallets prevents confusion
- **Private Key Protection**: Private keys never exposed in public interface
- **Deterministic Option**: Mnemonic-based generation enables wallet recovery
- **Random Option**: Random generation for testnet/sandbox use
- **Agent-Specific**: Each agent gets its own wallet per chain

---

## API Reference

### Types

```typescript
export interface AgentWalletPublic {
  agentId: string;
  address: string;
  chain: string;
  createdAt: Date;
  balance?: string;
  label?: string;
  // NOTE: privateKey NEVER included in public interface
}
```

**Internal Types** (not exported):
- `AgentWalletInternal`: Contains private key (internal use only)

### Functions

#### `getAgentWalletManager(mnemonic?: string): AgentWalletManager`

Get singleton wallet manager instance.

**Example**:
```typescript
import { getAgentWalletManager } from "@dreamnet/agent-wallet-manager";

// With mnemonic (deterministic)
const manager = getAgentWalletManager(process.env.AGENT_MNEMONIC);

// Without mnemonic (random)
const manager = getAgentWalletManager();
```

#### `getOrCreateWallet(agentId: string, chain?: string, label?: string): Promise<AgentWalletPublic>`

Get or create wallet for an agent.

**Example**:
```typescript
const wallet = await manager.getOrCreateWallet(
  "agent:DreamOps",
  "ethereum",
  "DreamOps Ethereum Wallet"
);
console.log(`Address: ${wallet.address}`);
```

#### `getBalance(agentId: string, chain: string, provider: JsonRpcProvider): Promise<string>`

Get wallet balance.

**Example**:
```typescript
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider("https://eth.llamarpc.com");
const balance = await manager.getBalance("agent:DreamOps", "ethereum", provider);
console.log(`Balance: ${balance} wei`);
```

#### `getAgentWallets(agentId: string): AgentWalletPublic[]`

Get all wallets for an agent.

**Example**:
```typescript
const wallets = manager.getAgentWallets("agent:DreamOps");
wallets.forEach(w => console.log(`${w.chain}: ${w.address}`));
```

#### `getAllWallets(): AgentWalletPublic[]`

Get all wallets (public interface only).

#### `exportWallet(agentId: string, chain: string): AgentWalletPublic | null`

Export wallet public data (for backup).

**Example**:
```typescript
const wallet = manager.exportWallet("agent:DreamOps", "ethereum");
// Returns public data only (no private key)
```

#### `getPrivateKey(agentId: string, chain: string): string | null`

Get private key (INTERNAL USE ONLY - for signing transactions).

**⚠️ SECURITY WARNING**: Never expose via API, only for internal agent operations.

**Example**:
```typescript
// Internal use only
const privateKey = manager.getPrivateKey("agent:DreamOps", "ethereum");
if (privateKey) {
  const wallet = new Wallet(privateKey, provider);
  // Sign transaction
}
```

---

## Integration Points

### Consumes

- **Mnemonic**: Optional mnemonic from environment variables
- **Provider**: JsonRpcProvider for balance checking

### Produces

- **Agent Wallets**: Wallets for agents (separate from user wallets)

### Integration Pattern

```typescript
// Agent wallet creation
const manager = getAgentWalletManager(process.env.AGENT_MNEMONIC);
const wallet = await manager.getOrCreateWallet("agent:DreamOps", "ethereum");

// Use wallet for transactions (internal only)
const privateKey = manager.getPrivateKey("agent:DreamOps", "ethereum");
const wallet = new Wallet(privateKey, provider);
```

---

## Usage Examples

### Basic Wallet Creation

```typescript
import { getAgentWalletManager } from "@dreamnet/agent-wallet-manager";

const manager = getAgentWalletManager();

// Create wallet for agent
const wallet = await manager.getOrCreateWallet(
  "agent:DreamOps",
  "ethereum",
  "DreamOps Wallet"
);

console.log(`Agent wallet address: ${wallet.address}`);
```

### Deterministic Wallets

```typescript
// Use mnemonic for deterministic wallet generation
const manager = getAgentWalletManager(process.env.AGENT_MNEMONIC);

// Same agent + chain = same wallet address
const wallet1 = await manager.getOrCreateWallet("agent:DreamOps", "ethereum");
const wallet2 = await manager.getOrCreateWallet("agent:DreamOps", "ethereum");
// wallet1.address === wallet2.address (deterministic)
```

### Check Balance

```typescript
import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider("https://eth.llamarpc.com");
const balance = await manager.getBalance("agent:DreamOps", "ethereum", provider);
console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
```

### List Agent Wallets

```typescript
const wallets = manager.getAgentWallets("agent:DreamOps");
wallets.forEach(w => {
  console.log(`${w.chain}: ${w.address} (${w.label})`);
});
```

---

## Security Considerations

### Critical Security Warnings

1. **Hard Separation**: Agent wallets are SEPARATE from user wallets (CoinSensei)
2. **Private Keys**: Private keys NEVER exposed in public interface
3. **Mnemonic Source**: Mnemonic should ONLY come from environment variables
4. **No API Exposure**: NEVER expose private keys or mnemonics via API
5. **Production Use**: This is for testnet/sandbox unless explicitly marked production-safe
6. **Memory Storage**: Private keys stored in memory only (encrypt at rest in production)

### Security Best Practices

- **Environment Variables**: Store mnemonic in environment variables, never in code
- **Access Control**: Restrict access to `getPrivateKey()` to internal operations only
- **Audit Logging**: Log wallet creation/usage for audit trail
- **Encryption**: Encrypt private keys at rest in production
- **Key Rotation**: Implement key rotation for production wallets

---

## Related Systems

- **CoinSensei Core**: User wallet management (read-only, separate system)
- **Agent Registry Core**: Tracks agents that use wallets
- **DreamNet Snail Core**: Tracks wallet operations for provenance

---

**Status**: ✅ Complete  
**Next**: Continue with Base Mini-Apps documentation
