# VeChain Core - Complete Documentation

**Package**: `@dreamnet/vechain-core`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

VeChain Core provides **VeChain blockchain integration** for DreamNet. It enables product tracking, sustainability records, NFT management, and governance.

### Key Features

- **Product Tracking**: Track products on VeChain
- **Sustainability Records**: Record sustainability metrics
- **NFT Management**: Create and manage Dream NFTs
- **Token Balances**: Query token balances
- **Governance**: Governance rights and voting
- **IoT Integration**: IoT device and sensor data integration

---

## API Reference

### Types

```typescript
export type VeChainNetwork = 'mainnet' | 'testnet';

export interface DreamProduct {
  // Product data
}

export interface TrackingEvent {
  // Tracking event data
}

export interface SustainabilityRecord {
  // Sustainability metrics
}

export interface DreamNFT {
  // NFT data
}

export interface TokenBalance {
  // Token balance data
}
```

### Functions

- **`createVeChainClient(config): VeChainClient`**
- **`getVeChainConfig(): VeChainConfig`**
- **`initVeChainClient(): void`**

---

**Status**: ✅ Implemented

