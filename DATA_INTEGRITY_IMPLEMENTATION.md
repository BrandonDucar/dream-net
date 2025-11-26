# Data Integrity Core Implementation

## Overview

Data Integrity Core provides blockchain-based data integrity by hashing data to Base blockchain for immutable audit trails. It batches multiple hashes into Merkle roots for gas efficiency.

## Architecture

### Components

1. **DataIntegrityCore** (`packages/data-integrity-core/index.ts`)
   - Hashes data using SHA-256
   - Queues hashes for batching
   - Calculates Merkle roots for batches
   - Submits batches to Base blockchain
   - Verifies hashes on blockchain

2. **DataIntegrityRegistry Contract** (`packages/base-mini-apps/contracts/DataIntegrityRegistry.sol`)
   - Stores individual data hashes
   - Stores batch Merkle roots
   - Provides hash verification
   - Emits events for hash and batch recording

### Features

- **Data Hashing**: SHA-256 hashing of any data
- **Batching**: Groups hashes into Merkle roots for gas efficiency
- **Blockchain Storage**: Stores hashes and Merkle roots on Base blockchain
- **Verification**: Verify if a hash exists on blockchain
- **Spider Web Integration**: Emits flies for hash and batch events

## Deployment

### Deploy Contract

```bash
cd packages/base-mini-apps
pnpm deploy:data-integrity
```

This will:
1. Deploy `DataIntegrityRegistry` contract to Base
2. Save contract address to `contracts/deployment.json`
3. Output contract address for `.env` configuration

### Environment Variables

```bash
# Enable data integrity
DATA_INTEGRITY_ENABLED=true

# Blockchain configuration
DATA_INTEGRITY_BLOCKCHAIN=base
DATA_INTEGRITY_CHAIN_ID=8453
DATA_INTEGRITY_CONTRACT_ADDRESS=0x... # From deployment

# RPC and wallet
DATA_INTEGRITY_RPC_URL=https://mainnet.base.org
DATA_INTEGRITY_PRIVATE_KEY=0x... # Or use PRIVATE_KEY

# Batching configuration
DATA_INTEGRITY_BATCH_SIZE=100 # Hashes per batch
DATA_INTEGRITY_BATCH_INTERVAL=60000 # Milliseconds between batches
```

## Usage

### Hash Data

```typescript
import { getDataIntegrityCore } from "@dreamnet/data-integrity-core";

const core = getDataIntegrityCore();
const hash = await core.hashData(
  { price: 100, symbol: "XAU" },
  "market-data"
);
```

### Verify Hash

```typescript
const exists = await core.verifyHash("0x...");
```

### API Endpoints

- `POST /api/data-integrity/hash` - Hash data and queue for submission
- `GET /api/data-integrity/verify/:hash` - Verify hash exists on blockchain
- `GET /api/data-integrity/status` - Get core status
- `GET /api/data-integrity/pending` - Get pending hashes in queue
- `GET /api/data-integrity/batches` - Get all batches
- `GET /api/data-integrity/batches/:batchId` - Get specific batch

## Integration

### Automatic Integration

Data Integrity Core is automatically initialized in `server/index.ts` if:
- `DATA_INTEGRITY_ENABLED=true`
- `DATA_INTEGRITY_CONTRACT_ADDRESS` is set
- `DATA_INTEGRITY_RPC_URL` is set
- `DATA_INTEGRITY_PRIVATE_KEY` is set

### Manual Integration

```typescript
import { initDataIntegrityCore } from "@dreamnet/data-integrity-core";

const core = initDataIntegrityCore({
  enabled: true,
  blockchain: "base",
  chainId: "8453",
  contractAddress: "0x...",
  rpcUrl: "https://mainnet.base.org",
  privateKey: "0x...",
  batchSize: 100,
  batchInterval: 60000,
});
```

## Benefits

1. **Immutability**: Data hashes stored on blockchain cannot be tampered with
2. **Audit Trail**: Complete history of all data hashes
3. **Gas Efficiency**: Batching reduces gas costs
4. **Verification**: Anyone can verify data integrity on-chain
5. **Integration**: Works with Spider Web Core for event tracking

## Future Enhancements

- Support for multiple blockchains
- Merkle proof generation for individual hashes
- Batch compression for even more gas efficiency
- Integration with other DreamNet systems for automatic hashing

