# Research DeSci - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Research DeSci provides **Decentralized Science (DeSci) protocols integration** for DreamNet's Science vertical. It integrates with DeSci protocols for decentralized research, enabling research NFTs, Research DAOs, and IPFS-based research publication.

---

## Key Features

### Research Operations
- Research NFT minting
- Research DAO management
- IPFS integration
- Blockchain integration

### API Integration
- DeSci protocol integration
- Ethereum provider integration
- IPFS gateway integration
- Error handling

---

## Architecture

### Components

1. **DeSci Protocols** (`DeSciProtocols.ts`)
   - Protocol client wrapper
   - Research operations
   - NFT operations
   - DAO operations

---

## API Reference

### Initialization

#### `new DeSciProtocols(config?: DeSciConfig): DeSciProtocols`
Creates DeSci protocols client instance.

**Example**:
```typescript
import { DeSciProtocols } from '@dreamnet/research-desci';

const desci = new DeSciProtocols({
  rpcUrl: 'https://mainnet.infura.io/v3/YOUR_KEY',
  chainId: 1,
  ipfsGateway: 'https://ipfs.io/ipfs/',
});

await desci.initialize();
```

### Research NFT Operations

#### `mintResearchNFT(researchData: { title: string; authors: string[]; ipfsHash: string }, signer: ethers.Signer): Promise<{ success: boolean; tokenId?: string; error?: string }>`
Mints research as NFT.

**Example**:
```typescript
const result = await desci.mintResearchNFT({
  title: 'My Research Paper',
  authors: ['Author 1', 'Author 2'],
  ipfsHash: 'QmHash...',
}, signer);

if (result.success) {
  console.log(`Research NFT minted: ${result.tokenId}`);
}
```

#### `getResearchNFT(tokenId: string): Promise<ResearchNFT | null>`
Gets research NFT by token ID.

**Example**:
```typescript
const nft = await desci.getResearchNFT('token-id');
if (nft) {
  console.log(`Title: ${nft.title}`);
  console.log(`Authors: ${nft.authors.join(', ')}`);
}
```

### Research DAO Operations

#### `getResearchDAOs(limit?: number): Promise<ResearchDAO[]>`
Gets list of Research DAOs.

**Example**:
```typescript
const daos = await desci.getResearchDAOs(20);
daos.forEach(dao => {
  console.log(`${dao.name}: ${dao.memberCount} members`);
});
```

---

## Data Models

### DeSciConfig

```typescript
interface DeSciConfig {
  rpcUrl?: string;
  chainId?: number;
  ipfsGateway?: string;
}
```

### ResearchNFT

```typescript
interface ResearchNFT {
  tokenId: string;
  researchId: string;
  title: string;
  authors: string[];
  ipfsHash: string;
  publishedAt: number;
  owner: string;
}
```

### ResearchDAO

```typescript
interface ResearchDAO {
  address: string;
  name: string;
  description: string;
  memberCount: number;
  treasuryBalance: string;
}
```

---

## IPFS Integration

### Research Storage
- Research papers stored on IPFS
- IPFS hash stored on-chain
- Decentralized access
- Permanent storage

### Gateway Access
- IPFS gateway URLs
- Multiple gateway support
- Fallback gateways
- Caching strategies

---

## Integration Points

### DreamNet Systems
- **Science Vertical**: Research platform
- **Dream Vault**: Research storage
- **Dream State Core**: Research governance
- **Data Integrity Core**: Research verification

---

## Usage Examples

### Mint Research NFT

```typescript
const desci = new DeSciProtocols({
  rpcUrl: process.env.RPC_URL,
  ipfsGateway: 'https://ipfs.io/ipfs/',
});

await desci.initialize();

const result = await desci.mintResearchNFT({
  title: 'My Research',
  authors: ['Author'],
  ipfsHash: 'QmHash...',
}, signer);
```

---

## Best Practices

1. **Research Management**
   - Store research on IPFS
   - Mint NFTs for ownership
   - Join Research DAOs
   - Verify research integrity

2. **Blockchain Operations**
   - Use appropriate networks
   - Handle gas costs
   - Monitor transactions
   - Verify on-chain data

---

## Security Considerations

1. **Blockchain Security**
   - Secure private keys
   - Validate transactions
   - Monitor contracts
   - Audit operations

2. **IPFS Security**
   - Validate IPFS hashes
   - Verify content integrity
   - Control access
   - Monitor storage

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

