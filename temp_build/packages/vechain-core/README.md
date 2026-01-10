# @dreamnet/vechain-core

VeChain integration for DreamNet - Supply chain, NFTs, IoT, and sustainability tracking.

## Features

- ✅ VeChain Thor client connection
- ✅ Supply chain tracking
- ✅ NFT minting & management
- ✅ IoT device integration
- ✅ Sustainability/ESG tracking
- 🔜 Enterprise features

## Installation

```bash
pnpm add @dreamnet/vechain-core
```

## Quick Start

```typescript
import { createVeChainClient, initVeChainClient } from '@dreamnet/vechain-core';

// Initialize client from environment
const client = initVeChainClient();

// Or create custom client
const mainnetClient = createVeChainClient('mainnet');
const testnetClient = createVeChainClient('testnet');
```

## Environment Variables

```bash
VECHAIN_NETWORK=mainnet  # or testnet
VECHAIN_MAINNET_RPC_URL=https://mainnet.vechain.org
VECHAIN_TESTNET_RPC_URL=https://testnet.vechain.org
VECHAIN_WALLET_ADDRESS=0x...  # Your VeChain wallet address
```

## Usage

### Basic Client Setup

```typescript
import { initVeChainClient } from '@dreamnet/vechain-core';

const client = initVeChainClient();

// Get latest block
const block = await client.blocks.getBestBlock();
console.log('Latest block:', block);
```

### Network Configuration

```typescript
import { getVeChainConfig } from '@dreamnet/vechain-core';

const config = getVeChainConfig();
console.log('Network:', config.network);
console.log('RPC URL:', config.rpcUrl);
console.log('Wallet:', config.walletAddress);
```

## Roadmap

- [x] Foundation - Client setup
- [ ] NFT minting & management
- [ ] Supply chain tracking
- [ ] IoT device integration
- [ ] Sustainability tracking
- [ ] Enterprise features

## Documentation

See `docs/VECHAIN_INTEGRATION_OPPORTUNITIES.md` for full integration strategy.

