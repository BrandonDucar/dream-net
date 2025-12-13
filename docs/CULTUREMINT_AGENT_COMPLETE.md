# CultureMint Agent - Complete Documentation

**Package**: `agents/CultureMint`  
**Type**: Domain-Specific Agent  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

**CultureMint** is a **token creation and deployment agent** that mints culturecoins and manages token creation within DreamNet's ecosystem. It handles the technical aspects of token deployment and contract management.

### Key Features

- **Token Minting**: Create new culturecoin tokens with custom metadata
- **Contract Deployment**: Deploy smart contracts to various networks
- **Metadata Management**: Handle token metadata and configuration
- **Multi-Network Support**: Deploy to different blockchain networks

---

## Role & Responsibilities

### Role

CultureMint acts as a **token creation and deployment specialist** for DreamNet's culturecoin ecosystem.

### Responsibilities

1. **Mint Tokens**: Create new culturecoin tokens with specified parameters
2. **Deploy Contracts**: Deploy smart contracts to blockchain networks
3. **Manage Metadata**: Handle token metadata and configuration
4. **Track Deployments**: Record token addresses and transaction hashes

---

## API Reference

### Agent Definition

```typescript
export const CultureMintAgent: Agent = {
  name: "CultureMint",
  description: "Mints culturecoins and manages token creation",
  capabilities: ["mint", "deploy"],
  async run(payload) {
    return runCultureMintTask(payload);
  },
};
```

### Types

```typescript
export interface CultureMintTask {
  mint: {
    name: string;
    symbol: string;
    supply?: number;
    metadata?: any;
  };
  deploy: {
    contract: string;
    network?: string;
  };
}

export interface CultureMintOutput {
  mint: {
    tokenAddress: string;
    transactionHash: string;
    metadata: any;
  };
  deploy: {
    contractAddress: string;
    network: string;
    status: string;
  };
}
```

---

## Tasks

### 1. Mint

Creates a new culturecoin token.

**Input**:
```typescript
{
  task: "mint",
  data: {
    name: string;           // Token name
    symbol: string;         // Token symbol
    supply?: number;        // Total supply (default: 1000000)
    metadata?: any;         // Additional metadata
  }
}
```

**Output**:
```typescript
{
  tokenAddress: string;     // Deployed token contract address
  transactionHash: string; // Transaction hash
  metadata: any;           // Token metadata including name, symbol, supply
}
```

**Example**:
```typescript
const result = await CultureMintAgent.run({
  task: "mint",
  data: {
    name: "DreamCoin",
    symbol: "DREAM",
    supply: 1000000,
    metadata: {
      description: "The official DreamNet token",
      image: "https://dreamnet.ink/dream.png"
    }
  }
});

// Result:
// {
//   success: true,
//   output: {
//     tokenAddress: "0x...",
//     transactionHash: "0x...",
//     metadata: { name: "DreamCoin", symbol: "DREAM", supply: 1000000, ... }
//   }
// }
```

### 2. Deploy

Deploys a smart contract to a blockchain network.

**Input**:
```typescript
{
  task: "deploy",
  data: {
    contract: string;       // Contract code or identifier
    network?: string;      // Target network (default: "base")
  }
}
```

**Output**:
```typescript
{
  contractAddress: string; // Deployed contract address
  network: string;         // Network where deployed
  status: string;          // Deployment status ("deployed")
}
```

**Example**:
```typescript
const result = await CultureMintAgent.run({
  task: "deploy",
  data: {
    contract: "ERC20Token",
    network: "base"
  }
});

// Result:
// {
//   success: true,
//   output: {
//     contractAddress: "0x...",
//     network: "base",
//     status: "deployed"
//   }
// }
```

---

## Implementation Details

### Token Minting

The minting process creates a new token with specified parameters:

```typescript
// Mock minting (will integrate with actual contract deployment later)
const tokenAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
const transactionHash = `0x${Math.random().toString(16).substring(2, 66)}`;
```

**Note**: Currently uses mock addresses. Future implementation will integrate with actual smart contract deployment.

### Contract Deployment

The deployment process handles contract deployment to specified networks:

```typescript
const contractAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
```

**Supported Networks**:
- `base` (default)
- Additional networks can be added

---

## Integration Points

### With Other Agents

- **CultureOps**: Orchestrates token creation workflows
- **Economic Engine Core**: Manages token economics and balances
- **Agent Wallet Manager**: Handles wallet operations for deployments

### With DreamNet Systems

- **Agent Registry Core**: Registered as a domain-specific agent
- **Audit Core**: Logs all minting and deployment actions
- **Economic Engine Core**: Integrates token configurations
- **Chain Abstraction Core**: Uses unified chain interface for deployments

---

## Usage Examples

### Example 1: Mint a Culturecoin

```typescript
import { CultureMintAgent } from '@dreamnet/agents/CultureMint';

const result = await CultureMintAgent.run({
  task: "mint",
  data: {
    name: "VibeCoin",
    symbol: "VIBE",
    supply: 500000,
    metadata: {
      description: "A token for good vibes",
      creator: "DreamNet",
      image: "https://dreamnet.ink/vibe.png"
    }
  }
});

if (result.success && result.output) {
  console.log(`Token minted: ${result.output.tokenAddress}`);
  console.log(`Transaction: ${result.output.transactionHash}`);
}
```

### Example 2: Deploy Contract

```typescript
const result = await CultureMintAgent.run({
  task: "deploy",
  data: {
    contract: "CultureCoinFactory",
    network: "base"
  }
});

if (result.success && result.output) {
  console.log(`Contract deployed to ${result.output.network}: ${result.output.contractAddress}`);
}
```

---

## Related Systems

- **Economic Engine Core**: Token economics and reward systems
- **Chain Abstraction Core**: Multi-chain deployment support
- **Agent Wallet Manager**: Wallet management for deployments
- **CultureOps Agent**: Cultural operations orchestration

---

## Future Enhancements

1. **Real Contract Integration**: Integrate with actual smart contract deployment
2. **Gas Optimization**: Optimize gas costs for deployments
3. **Multi-Chain Support**: Deploy to multiple chains simultaneously
4. **Token Standards**: Support ERC-20, ERC-721, ERC-1155, and custom standards
5. **Verification**: Automatic contract verification on block explorers
6. **Upgradeability**: Support upgradeable contract patterns
7. **Batch Operations**: Mint multiple tokens in a single transaction

---

**Status**: ✅ Implemented (Mock Implementation - Real Contract Integration Pending)

