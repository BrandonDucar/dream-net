# Dream Token - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Dream Token provides **DREAM token management** for DreamNet. It manages on-chain accounts, tracks balances, handles token events (mint, burn, reserve, sync, reward), and bridges between off-chain rewards and on-chain token balances.

---

## Key Features

### Token Configuration
- Max supply: 1 billion tokens
- Decimals: 18
- Symbol: DREAM
- Name: DreamNet Token
- Emission models: fixed, emissions, manual

### Account Management
- On-chain account tracking
- Base address management
- Balance synchronization
- Claimable balance tracking

### Token Events
- Mint events
- Burn events
- Reserve events
- Sync events
- Reward events

### Blockchain Integration
- Base L2 support
- ERC-20 token standard
- Contract address: `0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77`
- Balance queries
- Minting capabilities

---

## Architecture

### Components

1. **Config** (`config.ts`)
   - Token configuration
   - Default settings
   - Emission model

2. **Store** (`store.ts`)
   - Account storage
   - Event storage
   - Balance tracking

3. **Dream Token Bridge** (`dreamTokenBridge.ts`)
   - On-chain balance queries
   - Minting requests
   - Balance synchronization

---

## API Reference

### Configuration

#### `defaultConfig: DreamTokenConfig`
Default token configuration.

**Example**:
```typescript
import { defaultConfig } from '@dreamnet/dream-token';

console.log(`Max Supply: ${defaultConfig.maxSupply}`);
console.log(`Decimals: ${defaultConfig.decimals}`);
console.log(`Symbol: ${defaultConfig.symbol}`);
```

### Account Management

#### `getOnchainAccount(userId: string): DreamOnchainAccount | undefined`
Gets on-chain account.

#### `upsertOnchainAccount(account: DreamOnchainAccount): DreamOnchainAccount`
Creates or updates on-chain account.

**Example**:
```typescript
import { upsertOnchainAccount } from '@dreamnet/dream-token';

const account = upsertOnchainAccount({
  userId: 'user-123',
  baseAddress: '0x...',
  onchainBalance: '1000000000000000000', // 1 DREAM (18 decimals)
  claimableBalance: '500000000000000000', // 0.5 DREAM
  lastSyncedAt: new Date().toISOString(),
});
```

### Token Events

#### `recordDreamTokenEvent(event: DreamTokenEvent): void`
Records a token event.

**Example**:
```typescript
import { recordDreamTokenEvent } from '@dreamnet/dream-token';

recordDreamTokenEvent({
  id: 'event-123',
  type: 'reward',
  userId: 'user-123',
  amount: '1000000000000000000', // 1 DREAM
  createdAt: new Date().toISOString(),
  meta: { source: 'zen-garden' },
});
```

### Blockchain Bridge

#### `getOnchainBalance(address: string): Promise<string>`
Gets on-chain balance for an address.

**Example**:
```typescript
import { getOnchainBalance } from '@dreamnet/dream-token';

const balance = await getOnchainBalance('0x...');
console.log(`Balance: ${balance} wei`);
```

---

## Data Models

### DreamTokenConfig

```typescript
interface DreamTokenConfig {
  maxSupply: string; // "1000000000"
  decimals: number; // 18
  symbol: "DREAM";
  name: "DreamNet Token";
  emissionModel: "fixed" | "emissions" | "manual";
}
```

### DreamOnchainAccount

```typescript
interface DreamOnchainAccount {
  userId: string;
  baseAddress?: string;
  onchainBalance?: string; // BigInt string
  claimableBalance?: string; // BigInt string
  lastSyncedAt?: string;
}
```

### DreamTokenEvent

```typescript
interface DreamTokenEvent {
  id: string;
  type: "mint" | "burn" | "reserve" | "sync" | "reward";
  userId?: string;
  amount: string; // BigInt string
  createdAt: string;
  meta?: Record<string, unknown>;
}
```

---

## Token Details

### Contract Address
- **Base Mainnet**: `0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77`

### Token Specifications
- **Max Supply**: 1,000,000,000 DREAM
- **Decimals**: 18
- **Symbol**: DREAM
- **Name**: DreamNet Token

### Emission Models

#### Fixed
- Fixed supply
- No new minting
- Deflationary

#### Emissions
- Automated distribution
- Reward-based minting
- Controlled inflation

#### Manual
- Manual minting
- Admin-controlled
- On-demand distribution

---

## Integration Points

### DreamNet Systems
- **Rewards Engine**: Reward tracking
- **Economic Engine**: Token economics
- **Agent Wallet Manager**: Wallet integration
- **Dream State Core**: Token governance

### External Systems
- **Base Blockchain**: On-chain operations
- **ERC-20 Standard**: Token standard
- **Wallets**: User wallets

---

## Usage Examples

### Get Account

```typescript
import { getOnchainAccount } from '@dreamnet/dream-token';

const account = getOnchainAccount('user-123');
if (account) {
  console.log(`Address: ${account.baseAddress}`);
  console.log(`On-chain Balance: ${account.onchainBalance}`);
  console.log(`Claimable: ${account.claimableBalance}`);
}
```

### Record Reward Event

```typescript
import { recordDreamTokenEvent } from '@dreamnet/dream-token';

recordDreamTokenEvent({
  id: `event-${Date.now()}`,
  type: 'reward',
  userId: 'user-123',
  amount: '1000000000000000000', // 1 DREAM
  createdAt: new Date().toISOString(),
  meta: { source: 'zen-garden', activity: 'meditation' },
});
```

### Get On-Chain Balance

```typescript
import { getOnchainBalance } from '@dreamnet/dream-token';

const balance = await getOnchainBalance('0x...');
const dreamAmount = BigInt(balance) / BigInt(10 ** 18);
console.log(`Balance: ${dreamAmount} DREAM`);
```

---

## Best Practices

1. **Account Management**
   - Sync balances regularly
   - Track claimable amounts
   - Update last synced time
   - Validate addresses

2. **Event Recording**
   - Record all token events
   - Include metadata
   - Track event sources
   - Maintain audit trail

3. **Balance Management**
   - Use BigInt for amounts
   - Handle 18 decimals
   - Sync on-chain balances
   - Track claimable balances

---

## Security Considerations

1. **Token Security**
   - Protect private keys
   - Validate addresses
   - Secure minting
   - Audit events

2. **Balance Security**
   - Verify on-chain balances
   - Protect account data
   - Secure synchronization
   - Prevent manipulation

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

