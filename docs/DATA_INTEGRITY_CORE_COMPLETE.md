# Data Integrity Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Data Integrity Core provides **blockchain-based data integrity** for DreamNet. It hashes data to blockchain for immutable audit trails, supports batch processing, and integrates with Base, Ethereum, and Optimism blockchains.

---

## Key Features

### Blockchain Integration
- Base blockchain support
- Ethereum blockchain support
- Optimism blockchain support
- Smart contract integration
- Transaction management

### Data Hashing
- SHA-256 hashing
- Data type tracking
- Timestamp recording
- Batch processing

### Batch Processing
- Merkle root generation
- Batch submission
- Configurable batch size
- Interval-based batching

### Immutable Audit Trail
- On-chain hash storage
- Verifiable proofs
- Timestamp validation
- Data type tracking

---

## Architecture

### Components

1. **Data Integrity Core** (`index.ts`)
   - Main orchestrator
   - Blockchain connection
   - Hash management
   - Batch processing

2. **Smart Contract** (`contracts/DataIntegrity.sol`)
   - Hash storage
   - Batch storage
   - Verification functions
   - Event emission

---

## API Reference

### Initialization

#### `new DataIntegrityCore(config: DataIntegrityConfig): DataIntegrityCore`
Creates Data Integrity Core instance.

**Example**:
```typescript
import { DataIntegrityCore } from '@dreamnet/data-integrity-core';

const dataIntegrity = new DataIntegrityCore({
  enabled: true,
  blockchain: 'base',
  chainId: '8453',
  contractAddress: '0x123...',
  rpcUrl: process.env.BASE_RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  batchSize: 10,
  batchInterval: 60000, // 1 minute
});
```

### Hashing

#### `hashData(data: string, dataType: string): Promise<DataHash>`
Hashes data and queues for submission.

**Example**:
```typescript
const hash = await dataIntegrity.hashData(
  JSON.stringify({ key: 'value' }),
  'audit-log'
);

console.log(`Hash: ${hash.hash}`);
console.log(`Batch ID: ${hash.batchId}`);
```

### Batch Management

#### `getBatchStatus(batchId: string): BatchStatus | undefined`
Gets batch status.

**Example**:
```typescript
const status = dataIntegrity.getBatchStatus('batch-123');
if (status) {
  console.log(`Status: ${status.status}`);
  console.log(`TX Hash: ${status.txHash}`);
}
```

### Verification

#### `verifyHash(hash: string): Promise<boolean>`
Verifies hash exists on-chain.

**Example**:
```typescript
const exists = await dataIntegrity.verifyHash('0x123...');
console.log(`Hash exists: ${exists}`);
```

### Status

#### `getStatus(): DataIntegrityStatus`
Gets data integrity status.

**Example**:
```typescript
const status = dataIntegrity.getStatus();
console.log(`Total Hashes: ${status.totalHashes}`);
console.log(`Total Batches: ${status.totalBatches}`);
console.log(`Pending Hashes: ${status.pendingHashes}`);
```

---

## Data Models

### DataIntegrityConfig

```typescript
interface DataIntegrityConfig {
  enabled: boolean;
  blockchain: "base" | "ethereum" | "optimism";
  chainId: string;
  contractAddress?: string;
  rpcUrl?: string;
  privateKey?: string;
  batchSize: number;
  batchInterval: number;
}
```

### DataHash

```typescript
interface DataHash {
  hash: string;
  dataType: string;
  timestamp: number;
  batchId?: string;
  txHash?: string;
}
```

### BatchStatus

```typescript
interface BatchStatus {
  batchId: string;
  merkleRoot: string;
  hashCount: number;
  timestamp: number;
  txHash?: string;
  status: "pending" | "submitted" | "confirmed" | "failed";
}
```

### DataIntegrityStatus

```typescript
interface DataIntegrityStatus {
  enabled: boolean;
  blockchain: string;
  chainId: string;
  contractAddress?: string;
  totalHashes: number;
  totalBatches: number;
  pendingHashes: number;
  lastBatchTime: number | null;
}
```

---

## Smart Contract Functions

### recordHash
- Records individual hash
- Stores data type
- Records timestamp
- Emits event

### recordBatch
- Records batch
- Stores merkle root
- Records hash count
- Emits event

### hashExists
- Checks hash existence
- Returns boolean
- On-chain verification

### getHash
- Retrieves hash data
- Returns hash details
- Timestamp and type

### getBatch
- Retrieves batch data
- Returns batch details
- Merkle root and count

---

## Batch Processing

### Purpose
- Reduce gas costs
- Improve efficiency
- Batch multiple hashes
- Merkle root generation

### Process
1. Collect hashes in queue
2. Generate merkle root
3. Submit batch transaction
4. Track batch status
5. Verify confirmation

### Configuration
- Batch size: Number of hashes per batch
- Batch interval: Time between batches
- Configurable per instance

---

## Integration Points

### DreamNet Systems
- **DreamNet Audit Core**: Audit log hashing
- **Dream Snail Core**: Trail hashing
- **Spider Web Core**: Event hashing
- **Narrative Field**: Narrative hashing

### External Systems
- **Blockchain RPCs**: Base, Ethereum, Optimism
- **Smart Contracts**: Data Integrity contract
- **Wallet Providers**: Transaction signing

---

## Usage Examples

### Initialize

```typescript
const dataIntegrity = new DataIntegrityCore({
  enabled: true,
  blockchain: 'base',
  chainId: '8453',
  contractAddress: '0x123...',
  rpcUrl: process.env.BASE_RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  batchSize: 10,
  batchInterval: 60000,
});
```

### Hash Data

```typescript
const hash = await dataIntegrity.hashData(
  JSON.stringify({ action: 'user-login', userId: '123' }),
  'audit-log'
);
```

### Verify Hash

```typescript
const exists = await dataIntegrity.verifyHash(hash.hash);
console.log(`Hash verified: ${exists}`);
```

### Get Status

```typescript
const status = dataIntegrity.getStatus();
console.log(`Total Hashes: ${status.totalHashes}`);
console.log(`Pending: ${status.pendingHashes}`);
```

---

## Best Practices

1. **Configuration**
   - Set appropriate batch size
   - Configure batch interval
   - Use appropriate blockchain
   - Secure private keys

2. **Hashing**
   - Hash important data
   - Use appropriate data types
   - Monitor queue size
   - Track batch status

3. **Verification**
   - Verify hashes regularly
   - Monitor batch confirmations
   - Handle failures gracefully
   - Audit trail regularly

---

## Security Considerations

1. **Private Key Security**
   - Protect private keys
   - Use environment variables
   - Rotate keys regularly
   - Monitor usage

2. **Data Security**
   - Hash sensitive data
   - Validate data types
   - Protect contract address
   - Audit access

3. **Blockchain Security**
   - Verify transactions
   - Monitor gas costs
   - Handle failures
   - Audit contracts

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
