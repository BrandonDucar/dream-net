# Governance Snapshot - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Governance Snapshot provides **off-chain voting integration** for DreamNet's Government vertical. It integrates with Snapshot's off-chain voting platform for gasless governance, enabling proposal creation, voting, and result tracking without on-chain transactions.

---

## Key Features

### Voting Operations
- Proposal retrieval
- Vote casting
- Result tracking
- Space management

### API Integration
- Snapshot Hub API integration
- Proposal management
- Vote tracking
- Error handling

---

## Architecture

### Components

1. **Snapshot Voting** (`SnapshotVoting.ts`)
   - Snapshot API wrapper
   - Voting operations
   - Proposal management

---

## API Reference

### Initialization

#### `new SnapshotVoting(config?: SnapshotConfig): SnapshotVoting`
Creates Snapshot voting client instance.

**Example**:
```typescript
import { SnapshotVoting } from '@dreamnet/governance-snapshot';

const voting = new SnapshotVoting({
  apiUrl: 'https://hub.snapshot.org/api',
  space: 'dreamnet.eth',
});
```

### Proposal Operations

#### `getProposals(space?: string, limit?: number): Promise<SnapshotProposal[]>`
Gets list of proposals.

**Example**:
```typescript
const proposals = await voting.getProposals('dreamnet.eth', 20);
proposals.forEach(proposal => {
  console.log(`${proposal.title}: ${proposal.state}`);
});
```

#### `getProposal(proposalId: string): Promise<SnapshotProposal | null>`
Gets proposal by ID.

**Example**:
```typescript
const proposal = await voting.getProposal('proposal-id');
if (proposal) {
  console.log(`Choices: ${proposal.choices.join(', ')}`);
}
```

### Vote Operations

#### `getVotes(proposalId: string): Promise<SnapshotVote[]>`
Gets votes for proposal.

**Example**:
```typescript
const votes = await voting.getVotes('proposal-id');
votes.forEach(vote => {
  console.log(`${vote.voter}: ${vote.choice} (${vote.vp} VP)`);
});
```

#### `castVote(proposalId: string, choice: number | number[], signer: ethers.Signer): Promise<{ success: boolean; error?: string }>`
Casts vote on proposal.

**Example**:
```typescript
const result = await voting.castVote('proposal-id', 1, signer);
if (result.success) {
  console.log('Vote cast successfully');
}
```

---

## Data Models

### SnapshotConfig

```typescript
interface SnapshotConfig {
  apiUrl?: string;
  space?: string;
}
```

### SnapshotProposal

```typescript
interface SnapshotProposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: "pending" | "active" | "closed";
  scores?: number[];
  scores_by_strategy?: Array<Record<string, number>>;
}
```

### SnapshotVote

```typescript
interface SnapshotVote {
  id: string;
  voter: string;
  choice: number | number[];
  vp: number;
  timestamp: number;
}
```

---

## Snapshot Voting

### Off-Chain Governance
- Gasless voting
- Multiple voting strategies
- Weighted voting power
- Result aggregation

### Voting Strategies
- Token-weighted
- NFT-weighted
- Custom strategies
- Multi-strategy support

---

## Integration Points

### DreamNet Systems
- **Government Vertical**: Governance platform
- **Dream State Core**: Governance integration
- **Identity Grid**: Voter mapping
- **DreamNet RBAC Core**: Permission management

---

## Usage Examples

### Get Proposals and Vote

```typescript
const voting = new SnapshotVoting({
  space: 'dreamnet.eth',
});

const proposals = await voting.getProposals();
const proposal = proposals[0];

const result = await voting.castVote(proposal.id, 1, signer);
```

---

## Best Practices

1. **Voting**
   - Review proposals carefully
   - Verify voting power
   - Cast votes early
   - Monitor results

2. **Proposal Management**
   - Create clear proposals
   - Set appropriate durations
   - Provide context
   - Track outcomes

---

## Security Considerations

1. **Vote Security**
   - Verify signatures
   - Validate voting power
   - Check proposal state
   - Monitor vote manipulation

2. **Proposal Security**
   - Validate proposal data
   - Check proposal state
   - Verify proposer permissions
   - Monitor proposal changes

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

