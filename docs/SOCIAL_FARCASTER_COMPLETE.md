# Social Farcaster - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Social Farcaster provides **decentralized social protocol integration** for DreamNet's Crypto Social vertical. It integrates with Farcaster protocol for decentralized social networking, enabling cast publishing, user profiles, and social interactions on a decentralized network.

---

## Key Features

### Social Operations
- Cast retrieval
- User profiles
- Social interactions
- Decentralized networking

### API Integration
- Farcaster Hub API integration
- Ethereum provider integration
- Protocol compliance
- Error handling

---

## Architecture

### Components

1. **Farcaster Client** (`FarcasterClient.ts`)
   - Protocol client wrapper
   - Cast operations
   - User operations

---

## API Reference

### Initialization

#### `new FarcasterClient(config?: FarcasterConfig): FarcasterClient`
Creates Farcaster client instance.

**Example**:
```typescript
import { FarcasterClient } from '@dreamnet/social-farcaster';

const client = new FarcasterClient({
  rpcUrl: 'https://mainnet.infura.io/v3/YOUR_KEY',
  chainId: 1,
  hubUrl: 'https://hub.farcaster.xyz',
});

await client.initialize();
```

### Cast Operations

#### `getUserCasts(fid: number, limit?: number): Promise<FarcasterCast[]>`
Gets casts from a user.

**Example**:
```typescript
const casts = await client.getUserCasts(1234, 20);
casts.forEach(cast => {
  console.log(`${cast.author.displayName}: ${cast.text}`);
});
```

#### `publishCast(cast: { text: string; mentions?: number[]; embeds?: Array<{ url: string }>; parentHash?: string }, signer: ethers.Signer): Promise<{ success: boolean; hash?: string; error?: string }>`
Publishes a cast.

**Example**:
```typescript
const result = await client.publishCast({
  text: 'Hello Farcaster!',
  mentions: [1234],
}, signer);

if (result.success) {
  console.log(`Cast published: ${result.hash}`);
}
```

### User Operations

#### `getUserProfile(fid: number): Promise<FarcasterUser | null>`
Gets user profile.

**Example**:
```typescript
const user = await client.getUserProfile(1234);
if (user) {
  console.log(`${user.displayName}: ${user.bio}`);
}
```

---

## Data Models

### FarcasterConfig

```typescript
interface FarcasterConfig {
  rpcUrl?: string;
  chainId?: number;
  hubUrl?: string;
}
```

### FarcasterCast

```typescript
interface FarcasterCast {
  hash: string;
  author: {
    fid: number;
    username?: string;
    displayName?: string;
  };
  text: string;
  timestamp: number;
  mentions?: number[];
  embeds?: Array<{ url: string }>;
  parentHash?: string;
}
```

### FarcasterUser

```typescript
interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  bio?: string;
  pfp?: string;
  followerCount?: number;
  followingCount?: number;
}
```

---

## Farcaster Protocol

### Decentralized Social Network
- On-chain identity
- Off-chain data
- Hub-based architecture
- Protocol compliance

### Features
- Casts (posts)
- Mentions
- Embeds
- Threads (replies)

---

## Integration Points

### DreamNet Systems
- **Crypto Social Vertical**: Social networking
- **Social Hub Core**: Social integration
- **Identity Grid**: User mapping
- **Dream State Core**: Social governance

---

## Usage Examples

### Get User Casts

```typescript
const client = new FarcasterClient({
  hubUrl: 'https://hub.farcaster.xyz',
});

await client.initialize();

const casts = await client.getUserCasts(1234);
```

### Publish Cast

```typescript
const result = await client.publishCast({
  text: 'Hello DreamNet!',
}, signer);
```

---

## Best Practices

1. **Social Operations**
   - Follow protocol standards
   - Handle errors gracefully
   - Cache user data
   - Monitor rate limits

2. **Cast Management**
   - Validate content
   - Handle mentions properly
   - Support embeds
   - Manage threads

---

## Security Considerations

1. **Protocol Security**
   - Validate signatures
   - Verify on-chain data
   - Monitor hub health
   - Handle failures

2. **Content Security**
   - Validate cast content
   - Sanitize inputs
   - Control access
   - Audit operations

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

