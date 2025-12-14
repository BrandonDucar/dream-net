# Governance Aragon - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Governance Aragon provides **DAO governance integration** for DreamNet's Government vertical. It integrates with Aragon DAO governance patterns for on-chain proposal creation, voting, and execution, enabling decentralized autonomous organization governance within DreamNet.

---

## Key Features

### DAO Governance
- Proposal creation
- On-chain voting
- Proposal execution
- Token-weighted voting

### API Integration
- Aragon contract integration
- Ethereum provider integration
- Voting contract interaction
- Error handling

---

## Architecture

### Components

1. **Aragon Governance Client** (`AragonGovernanceClient.ts`)
   - Contract client wrapper
   - Governance operations
   - Voting management

---

## API Reference

### Initialization

#### `new AragonGovernanceClient(config?: AragonConfig): AragonGovernanceClient`
Creates Aragon governance client instance.

**Example**:
```typescript
import { AragonGovernanceClient } from '@dreamnet/governance-aragon';

const client = new AragonGovernanceClient({
  rpcUrl: 'https://mainnet.infura.io/v3/YOUR_KEY',
  chainId: 1,
  daoAddress: '0x...',
  votingAddress: '0x...',
  tokenAddress: '0x...',
});

await client.initialize();
```

### Proposal Operations

#### `createProposal(title: string, description: string, executionData: string, signer: ethers.Signer): Promise<{ success: boolean; proposalId?: string; error?: string }>`
Creates a proposal.

**Example**:
```typescript
const result = await client.createProposal(
  'Proposal Title',
  'Proposal description',
  '0x...', // Execution data
  signer
);

if (result.success) {
  console.log(`Proposal created: ${result.proposalId}`);
}
```

#### `getProposals(limit?: number): Promise<Proposal[]>`
Gets list of proposals.

**Example**:
```typescript
const proposals = await client.getProposals(20);
proposals.forEach(proposal => {
  console.log(`${proposal.title}: ${proposal.status}`);
});
```

### Vote Operations

#### `castVote(proposalId: string, support: boolean, signer: ethers.Signer): Promise<{ success: boolean; error?: string }>`
Casts vote on proposal.

**Example**:
```typescript
const result = await client.castVote('proposal-id', true, signer);
if (result.success) {
  console.log('Vote cast successfully');
}
```

---

## Data Models

### AragonConfig

```typescript
interface AragonConfig {
  rpcUrl?: string;
  chainId?: number;
  daoAddress?: string;
  votingAddress?: string;
  tokenAddress?: string;
}
```

### Proposal

```typescript
interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  createdAt: number;
  startDate: number;
  endDate: number;
  status: "pending" | "active" | "passed" | "rejected" | "executed";
  votes: {
    yes: number;
    no: number;
    abstain: number;
  };
  executionData?: string;
}
```

### Vote

```typescript
interface Vote {
  proposalId: string;
  voter: string;
  support: boolean; // true = yes, false = no
  weight: number;
  timestamp: number;
}
```

---

## Aragon DAO

### On-Chain Governance
- Smart contract-based
- Token-weighted voting
- Proposal execution
- Transparent voting

### Features
- Proposal lifecycle
- Voting periods
- Execution automation
- Treasury management

---

## Integration Points

### DreamNet Systems
- **Government Vertical**: Governance platform
- **Dream State Core**: Governance integration
- **Identity Grid**: Voter mapping
- **Dream Token**: Token integration

---

## Usage Examples

### Create Proposal and Vote

```typescript
const client = new AragonGovernanceClient({
  rpcUrl: process.env.RPC_URL,
  daoAddress: '0x...',
  votingAddress: '0x...',
});

await client.initialize();

const result = await client.createProposal(
  'My Proposal',
  'Description',
  '0x...',
  signer
);

await client.castVote(result.proposalId!, true, signer);
```

---

## Best Practices

1. **Governance**
   - Create clear proposals
   - Set appropriate durations
   - Provide execution data
   - Monitor proposals

2. **Voting**
   - Review proposals carefully
   - Verify voting power
   - Cast votes early
   - Monitor results

---

## Security Considerations

1. **Contract Security**
   - Verify contract addresses
   - Validate execution data
   - Monitor contract state
   - Audit operations

2. **Vote Security**
   - Verify signatures
   - Validate voting power
   - Check proposal state
   - Monitor vote manipulation

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

