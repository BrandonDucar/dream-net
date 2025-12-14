# Dream State Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Dream State Core provides **citizenship, governance, and state management** for DreamNet. It manages passports, proposals, votes, government departments, diplomatic relations, and D-DAO attractors, creating a complete "nation-state" layer for the DreamNet ecosystem.

---

## Key Features

### Passport System
- Passport tiers (visitor, dreamer, citizen, operator, architect, founder)
- Passport issuance and upgrades
- Passport flags and metadata
- On-chain passport tokens

### Governance System
- Proposal creation and management
- Voting system with tier-based weights
- Proposal execution
- Vote tallying

### Government Structure
- Government departments
- Department leaders and budgets
- Government actions tracking
- State symbols

### Diplomacy
- Diplomatic relations with protocols/chains/DAOs
- Relation status tracking
- Contact management
- Treaty management

### D-DAO Attractors
- External DAO/protocol tracking
- Attractor scoring
- Category-based organization
- Alignment tracking

---

## Architecture

### Components

1. **Citizenship Store** (`store/citizenshipStore.ts`)
   - Passport storage
   - Proposal storage
   - Vote storage
   - Department storage

2. **Passport Issuer** (`logic/passportIssuer.ts`)
   - Passport issuance
   - Passport upgrades
   - Passport retrieval

3. **Governance** (`logic/governance.ts`)
   - Proposal creation
   - Voting logic
   - Proposal execution

4. **Government** (`logic/government.ts`)
   - Department management
   - Action recording
   - Symbol management

5. **Diplomacy** (`logic/diplomacy.ts`)
   - Relation establishment
   - Status upgrades
   - Contact management

---

## API Reference

### Passport Management

#### `issuePassport(identityId: string, tier: DreamPassportTier, flags?: string[]): DreamPassport`
Issues a passport to an identity.

**Example**:
```typescript
import { DreamStateCore } from '@dreamnet/dream-state-core';

const passport = DreamStateCore.issuePassport(
  'user:founder',
  'citizen',
  ['early', 'trusted', 'builder']
);

console.log(`Passport ID: ${passport.id}`);
console.log(`Tier: ${passport.tier}`);
console.log(`Flags: ${passport.flags}`);
```

#### `getPassport(identityId: string): DreamPassport | undefined`
Gets passport for an identity.

#### `upgradePassport(identityId: string, newTier: DreamPassportTier): DreamPassport | undefined`
Upgrades passport tier.

#### `listPassports(): DreamPassport[]`
Lists all passports.

### Governance

#### `createProposal(identityId: string, title: string, description: string, meta?: Record<string, any>): DreamProposal`
Creates a governance proposal.

**Example**:
```typescript
const proposal = DreamStateCore.createProposal(
  'user:founder',
  'Increase Dream Token Supply',
  'Proposal to increase token supply by 10%',
  { tokenSymbol: 'DREAM', increasePercent: 10 }
);
```

#### `castVote(identityId: string, proposalId: string, choice: "for" | "against", passportTier: DreamPassportTier): DreamVote`
Casts a vote.

#### `tallyProposal(proposalId: string): { for: number; against: number }`
Tallies votes for a proposal.

#### `proposalPassed(proposalId: string): boolean`
Checks if proposal passed.

#### `executeProposal(proposalId: string): boolean`
Executes a passed proposal.

### D-DAO Attractors

#### `registerDDAOAttractor(name: string, category: DDAOCategory, url?: string, tags?: string[], score?: number): DDAOAttractor`
Registers a D-DAO attractor.

#### `getTopDDAOAttractors(limit?: number): DDAOAttractor[]`
Gets top attractors by score.

### Execution

#### `run(context: DreamStateContext): DreamStateStatus`
Runs Dream State cycle.

#### `status(): DreamStateStatus`
Gets Dream State status.

---

## Data Models

### DreamPassportTier

```typescript
type DreamPassportTier =
  | 'visitor'
  | 'dreamer'
  | 'citizen'
  | 'operator'
  | 'architect'
  | 'founder';
```

### DreamPassport

```typescript
interface DreamPassport {
  id: string;
  identityId: string;
  tier: DreamPassportTier;
  issuedAt: number;
  updatedAt: number;
  expiresAt?: number;
  flags?: string[];
  meta?: Record<string, any>;
  onchainAddress?: string;
  passportTokenId?: string;
}
```

### DreamProposal

```typescript
interface DreamProposal {
  id: string;
  title: string;
  description: string;
  createdByIdentityId: string;
  createdAt: number;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  meta?: Record<string, any>;
}
```

### DreamVote

```typescript
interface DreamVote {
  proposalId: string;
  identityId: string;
  choice: 'for' | 'against';
  weight: number; // Based on passport tier
  castAt: number;
}
```

### GovernmentDepartment

```typescript
interface GovernmentDepartment {
  id: string;
  name: string;
  packId: string;
  leader?: string;
  responsibilities: string[];
  budget?: number;
  createdAt: number;
}
```

### DiplomaticRelation

```typescript
interface DiplomaticRelation {
  id: string;
  protocolName: string;
  protocolType: 'chain' | 'dao' | 'protocol' | 'nation';
  status: 'alliance' | 'neutral' | 'treaty' | 'embassy' | 'hostile';
  establishedAt: number;
  contactEmail?: string;
  notes?: string;
  wolfPackLeadId?: string;
  meta?: Record<string, any>;
}
```

### DDAOAttractor

```typescript
interface DDAOAttractor {
  id: string;
  name: string;
  category: DDAOCategory;
  url?: string;
  tags?: string[];
  score?: number;
  createdAt: number;
  updatedAt: number;
}
```

---

## Passport Tiers

### Visitor
- Basic access
- Limited permissions
- No voting rights

### Dreamer
- Standard access
- Basic permissions
- Limited voting rights

### Citizen
- Full access
- Standard permissions
- Full voting rights

### Operator
- Operational access
- System permissions
- Weighted voting

### Architect
- Design access
- Architecture permissions
- High-weighted voting

### Founder
- Full access
- All permissions
- Maximum voting weight

---

## Voting System

### Vote Weights
- Based on passport tier
- Higher tiers = higher weights
- Prevents vote manipulation
- Ensures fair governance

### Proposal Lifecycle
1. **Draft**: Proposal created
2. **Open**: Voting period
3. **Passed/Rejected**: Vote result
4. **Executed**: Proposal executed

---

## Integration Points

### DreamNet Systems
- **Identity Grid**: Identity management
- **Wolf Pack Funding**: Diplomatic outreach
- **Economic Engine**: State economy
- **Narrative Field**: State history
- **Neural Mesh**: State memory
- **Agent Registry**: Government agents

### External Systems
- **Blockchain**: On-chain passports
- **DAOs**: Diplomatic relations
- **Protocols**: Chain relations

---

## Usage Examples

### Issue Passport

```typescript
const passport = DreamStateCore.issuePassport(
  'user:founder',
  'citizen',
  ['early', 'trusted']
);

console.log(`Issued passport: ${passport.id}`);
```

### Create Proposal

```typescript
const proposal = DreamStateCore.createProposal(
  'user:founder',
  'New Feature Proposal',
  'Proposal to add new feature X',
  { featureId: 'feature-x' }
);

console.log(`Created proposal: ${proposal.id}`);
```

### Cast Vote

```typescript
const vote = DreamStateCore.castVote(
  'user:founder',
  proposal.id,
  'for',
  'citizen'
);

console.log(`Vote weight: ${vote.weight}`);
```

### Register D-DAO Attractor

```typescript
const attractor = DreamStateCore.registerDDAOAttractor(
  'Base Grants',
  'grants',
  'https://base.org/grants',
  ['base', 'grants', 'funding'],
  0.9
);

console.log(`Attractor score: ${attractor.score}`);
```

---

## Best Practices

1. **Passport Management**
   - Issue appropriate tiers
   - Use flags meaningfully
   - Track passport changes
   - Monitor tier distribution

2. **Governance**
   - Create clear proposals
   - Encourage participation
   - Execute promptly
   - Track outcomes

3. **Diplomacy**
   - Establish relations carefully
   - Maintain contacts
   - Track status changes
   - Document agreements

---

## Security Considerations

1. **Passport Security**
   - Validate identity IDs
   - Protect passport data
   - Audit tier changes
   - Prevent manipulation

2. **Governance Security**
   - Validate votes
   - Prevent double voting
   - Secure execution
   - Audit proposals

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

