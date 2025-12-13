# Chain Abstraction Core - Complete Documentation

**Package**: `@dreamnet/chain-abstraction-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Chain Abstraction Core provides **Superchain/CCT compatibility** for cross-chain operations. It enables zero-slippage cross-chain token transfers (CCT standard) and treats chains as fungible resources with automatic optimal chain selection.

### Key Features

- **CCT Standard**: Zero-slippage cross-chain token transfers
- **Superchain Abstraction**: Treats chains as fungible resources
- **Chain Selection**: Automatic optimal chain selection based on gas/latency/reliability
- **Chainlink CCIP**: Integration with Chainlink Cross-Chain Interoperability Protocol
- **Unified API**: Single API across all supported chains

---

## Architecture

### How It Works

```
Transfer Request → CCT Registry → Chain Selection → Star Bridge Lungs → Cross-Chain Transfer
```

1. **Token Registration**: CCT tokens registered with supported chains
2. **Transfer Request**: User requests cross-chain transfer
3. **Chain Selection**: Optimal chain selected based on scores
4. **Bridge Execution**: Star Bridge Lungs executes cross-chain transfer
5. **Event Emission**: Transfer events published to Nervous System

### Why This Design

- **Zero Slippage**: CCT standard eliminates slippage in cross-chain transfers
- **Chain Agnostic**: Users don't need to know which chain to use
- **Optimal Routing**: Automatically selects best chain for operations
- **Unified Interface**: Single API for all cross-chain operations

---

## API Reference

### Types

```typescript
export interface CCTToken {
  symbol: string;
  chains: ChainId[];
  totalSupply: Record<ChainId, bigint>;
  bridgeable: boolean;
  nativeChain?: ChainId;
  decimals: number;
}

export interface CCTTransfer {
  token: string;
  amount: bigint;
  from: ChainId;
  to: ChainId;
  recipient: string;
  constraints: {
    maxSlippage?: number;
    deadline?: number;
    preferredBridge?: string;
  };
}

export interface ChainScore {
  chain: ChainId;
  score: number; // 0-100
  factors: {
    gasPrice: number;
    latency: number;
    reliability: number;
  };
}

export interface CCIPMessage {
  messageId: string;
  sourceChain: ChainId;
  destinationChain: ChainId;
  token: string;
  amount: bigint;
  recipient: string;
  status: 'pending' | 'delivered' | 'failed';
  timestamp: number;
}

export interface ChainAbstractionStatus {
  supportedChains: ChainId[];
  cctTokens: string[];
  totalTransfers: number;
  activeTransfers: number;
  averageTransferTime: number; // ms
}
```

### Functions

#### `transferCCT(transfer: CCTTransfer): Promise<string>`

Transfer CCT token across chains with zero slippage.

**Example**:
```typescript
import { transferCCT } from "@dreamnet/chain-abstraction-core";

const txHash = await transferCCT({
  token: "USDC",
  amount: 1000000n, // 1 USDC (6 decimals)
  from: "base",
  to: "optimism",
  recipient: "0x...",
  constraints: {
    maxSlippage: 0.01, // 1%
    deadline: Date.now() + 3600000, // 1 hour
  }
});

console.log("Transfer hash:", txHash);
```

#### `getCCTBalance(symbol: string, address: string): Promise<Record<string, bigint>>`

Get CCT token balance across all supported chains.

**Example**:
```typescript
import { getCCTBalance } from "@dreamnet/chain-abstraction-core";

const balances = await getCCTBalance("USDC", "0x...");
console.log("Base balance:", balances.base);
console.log("Optimism balance:", balances.optimism);
```

#### `selectOptimalChain(preferredChains?: ChainId[]): ChainId`

Select optimal chain based on gas, latency, and reliability scores.

**Example**:
```typescript
import { selectOptimalChain } from "@dreamnet/chain-abstraction-core";

// Select from preferred chains
const chain = selectOptimalChain(["base", "optimism", "arbitrum"]);
console.log("Optimal chain:", chain);

// Select from all chains
const bestChain = selectOptimalChain();
```

#### `getAllChainScores(): ChainScore[]`

Get chain scores for all supported chains, sorted by score (highest first).

**Example**:
```typescript
import { getAllChainScores } from "@dreamnet/chain-abstraction-core";

const scores = getAllChainScores();
scores.forEach(chain => {
  console.log(`${chain.chain}: ${chain.score} (gas: ${chain.factors.gasPrice}, latency: ${chain.factors.latency}, reliability: ${chain.factors.reliability})`);
});
```

### Classes

#### `CCTRegistry`

Registry for CCT tokens.

**Methods**:

- **`registerToken(token: CCTToken): void`**
  - Register a CCT token

- **`getToken(symbol: string): CCTToken | undefined`**
  - Get CCT token by symbol

- **`listTokens(): CCTToken[]`**
  - List all registered CCT tokens

- **`isAvailableOnChain(symbol: string, chain: string): boolean`**
  - Check if token is available on chain

**Example**:
```typescript
import { cctRegistry } from "@dreamnet/chain-abstraction-core";

cctRegistry.registerToken({
  symbol: "USDC",
  chains: ["base", "optimism", "arbitrum"],
  totalSupply: {
    base: 1000000n,
    optimism: 500000n,
    arbitrum: 250000n,
  },
  bridgeable: true,
  nativeChain: "base",
  decimals: 6,
});
```

### Main Export

#### `ChainAbstractionCore`

Main API object with all chain abstraction methods.

**Methods**:

- **`transferCCT(transfer: CCTTransfer): Promise<string>`**
- **`getCCTBalance(symbol: string, address: string): Promise<Record<string, bigint>>`**
- **`selectOptimalChain(preferredChains?: ChainId[]): ChainId`**
- **`getAllChainScores(): ChainScore[]`**
- **`registerToken(token: CCTToken): void`**
- **`status(): ChainAbstractionStatus`**

**Example**:
```typescript
import ChainAbstractionCore from "@dreamnet/chain-abstraction-core";

// Transfer CCT
const txHash = await ChainAbstractionCore.transferCCT({
  token: "USDC",
  amount: 1000000n,
  from: "base",
  to: "optimism",
  recipient: "0x...",
});

// Get status
const status = ChainAbstractionCore.status();
console.log("Supported chains:", status.supportedChains);
console.log("CCT tokens:", status.cctTokens);
```

---

## Integration Points

### Consumes

- **Star Bridge Lungs**: Chain metrics and bridge execution
- **Nervous System Core**: Event emission for transfers
- **Chainlink CCIP**: Cross-chain message protocol

### Produces

- **Transfer Events**: Published to Nervous System
- **Chain Scores**: Calculated from Star Bridge Lungs metrics

---

## Usage Examples

### Register CCT Token

```typescript
import { cctRegistry } from "@dreamnet/chain-abstraction-core";

cctRegistry.registerToken({
  symbol: "DREAM",
  chains: ["base", "optimism"],
  totalSupply: {
    base: 1000000000n,
    optimism: 0n,
  },
  bridgeable: true,
  nativeChain: "base",
  decimals: 18,
});
```

### Transfer CCT Token

```typescript
import ChainAbstractionCore from "@dreamnet/chain-abstraction-core";

const txHash = await ChainAbstractionCore.transferCCT({
  token: "DREAM",
  amount: 1000000000000000000n, // 1 DREAM
  from: "base",
  to: "optimism",
  recipient: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  constraints: {
    maxSlippage: 0, // Zero slippage (CCT standard)
    deadline: Date.now() + 3600000, // 1 hour
  }
});
```

### Select Optimal Chain

```typescript
import ChainAbstractionCore from "@dreamnet/chain-abstraction-core";

// For a specific operation
const optimalChain = ChainAbstractionCore.selectOptimalChain(["base", "optimism", "arbitrum"]);

// Check all chain scores
const scores = ChainAbstractionCore.getAllChainScores();
console.log("Best chain:", scores[0].chain);
console.log("Score:", scores[0].score);
```

### Get CCT Balance

```typescript
import ChainAbstractionCore from "@dreamnet/chain-abstraction-core";

const balances = await ChainAbstractionCore.getCCTBalance("USDC", "0x...");
Object.entries(balances).forEach(([chain, balance]) => {
  console.log(`${chain}: ${balance}`);
});
```

---

## Best Practices

1. **Token Registration**: Register all CCT tokens before use
2. **Chain Selection**: Use `selectOptimalChain` for automatic routing
3. **Constraints**: Set appropriate `maxSlippage` and `deadline` values
4. **Error Handling**: Handle errors for invalid tokens or chains
5. **Balance Checks**: Check balances before transfers
6. **Event Monitoring**: Monitor transfer events via Nervous System

---

## Security Considerations

- **Token Validation**: Validate tokens exist and are bridgeable
- **Chain Validation**: Verify chains support the token
- **Amount Validation**: Check sufficient balance before transfer
- **Deadline Enforcement**: Respect transfer deadlines
- **Slippage Protection**: Use CCT standard for zero slippage

---

## Related Systems

- **Star Bridge Lungs**: Chain metrics and bridge execution
- **Nervous System Core**: Event emission
- **Intent Router Core**: Intent-based routing
- **Chainlink CCIP**: Cross-chain protocol

---

**Status**: ✅ Implemented  
**Next**: Add Chainlink CCIP integration and transfer tracking

