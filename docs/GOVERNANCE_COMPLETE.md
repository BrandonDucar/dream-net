# Governance - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Governance provides a **policy-based access control and quorum decision-making system** for DreamNet. It enforces policies, manages quorum voting, and ensures safe operations through multi-party approval.

---

## Key Features

### Policy System
- Policy table management
- Rule-based access control
- Actor-based permissions
- Capability-based restrictions
- Scope-based enforcement

### Quorum System
- Multi-party voting
- Quorum types (tech, creator, safety, admin)
- Approval thresholds
- Decision tracking
- Reversible policies

### Policy Enforcement
- Policy checking
- Condition evaluation
- Quorum requirement detection
- Access control

---

## Architecture

### Components

1. **Policy Table** (`policyTable.ts`)
   - Policy loading
   - Rule matching
   - Policy validation
   - Default policies

2. **Quorum Engine** (`quorumEngine.ts`)
   - Vote management
   - Decision tracking
   - Approval checking
   - Quorum validation

3. **Policy Enforcer** (`policyEnforcer.ts`)
   - Policy checking
   - Condition evaluation
   - Quorum requests
   - Access control

---

## API Reference

### Policy Checking

#### `checkPolicy(actor: ActorContext, capability: CapabilityType, scope: ScopeType): PolicyCheckResult`
Checks if an actor can perform a capability.

**Example**:
```typescript
import { checkPolicy } from '@dreamnet/governance';

const result = checkPolicy(
  {
    actorId: 'user-123',
    actorType: 'wallet',
    walletAddress: '0x...',
    trustScore: 0.8,
  },
  'publish',
  'dream'
);

if (result.allowed) {
  // Allow operation
} else if (result.requiresQuorum) {
  // Request quorum approval
}
```

### Quorum Management

#### `vote(policyId: string, voter: ActorContext, decision: "approve" | "reject" | "abstain", quorumTypes: QuorumType[], threshold: number, reason?: string): QuorumDecision`
Registers a vote for a policy decision.

**Example**:
```typescript
import { quorumEngine } from '@dreamnet/governance';

const decision = quorumEngine.vote(
  'policy-123',
  {
    actorId: 'admin-1',
    actorType: 'admin',
  },
  'approve',
  ['tech', 'safety'],
  2,
  'Looks good to me'
);
```

#### `getDecision(policyId: string): QuorumDecision | null`
Gets current decision status.

#### `isApproved(policyId: string): boolean`
Checks if decision is approved.

---

## Data Models

### PolicyRule

```typescript
interface PolicyRule {
  actor: ActorType;
  capability: CapabilityType;
  scope: ScopeType;
  reversible: boolean;
  review_quorum: QuorumType[];
  min_approvals?: number;
  conditions?: Record<string, unknown>;
}
```

### ActorType

```typescript
type ActorType = 'agent' | 'wallet' | 'system' | 'admin';
```

### CapabilityType

```typescript
type CapabilityType =
  | 'publish'
  | 'remix'
  | 'monetize'
  | 'archive'
  | 'deploy'
  | 'modify_schema'
  | 'manage_keys'
  | 'payout';
```

### ScopeType

```typescript
type ScopeType =
  | 'global'
  | 'dream'
  | 'agent'
  | 'token'
  | 'infrastructure';
```

### QuorumType

```typescript
type QuorumType = 'tech' | 'creator' | 'safety' | 'admin';
```

### ActorContext

```typescript
interface ActorContext {
  actorId: string;
  actorType: ActorType;
  walletAddress?: string;
  trustScore?: number;
  stakedTokens?: number;
  completedDreams?: number;
  badges?: string[];
}
```

### QuorumDecision

```typescript
interface QuorumDecision {
  policyId: string;
  quorumType: QuorumType;
  votes: QuorumVote[];
  threshold: number;
  reached: boolean;
  result: 'approved' | 'rejected' | 'pending';
  timestamp: string;
}
```

---

## Default Policies

### Wallet Policies
- **Publish**: Allowed, reversible, no quorum
- **Remix**: Allowed, reversible, no quorum

### Admin Policies
- **Deploy**: Requires tech + safety quorum, 2 approvals
- **Modify Schema**: Requires tech + safety quorum, 2 approvals
- **Manage Keys**: Requires tech + safety + admin quorum, 3 approvals
- **Payout**: Requires creator + safety quorum, 2 approvals

---

## Policy Evaluation

### Process

1. Find matching rule
2. Check conditions
3. Determine quorum requirement
4. Return policy check result

### Conditions

- `minTrustScore`: Minimum trust score required
- `minStakedTokens`: Minimum staked tokens required
- `completedDreams`: Minimum completed dreams
- `badges`: Required badges

---

## Quorum Types

### Tech Quorum
- Technical decisions
- Infrastructure changes
- Schema modifications
- Agent: Automated tests

### Creator Quorum
- Content decisions
- Monetization
- Payouts
- Community representatives

### Safety Quorum
- Security decisions
- Safety-critical changes
- Key management
- Risk assessment

### Admin Quorum
- Administrative decisions
- System-wide changes
- Emergency actions
- Platform operators

---

## Integration Points

### DreamNet Systems
- **Identity Grid**: Actor identity
- **Reputation Lattice**: Trust scores
- **Field Layer**: Risk scores
- **Dream State**: Governance integration

### External Systems
- **Voting Systems**: Quorum voting
- **Access Control**: Policy enforcement
- **Audit Systems**: Policy audit

---

## Usage Examples

### Check Policy

```typescript
import { checkPolicy } from '@dreamnet/governance';

const actor = {
  actorId: 'user-123',
  actorType: 'wallet',
  walletAddress: '0x1234...',
  trustScore: 0.8,
};

const result = checkPolicy(actor, 'publish', 'dream');

if (result.allowed) {
  // Publish dream
} else if (result.requiresQuorum) {
  // Request quorum approval
  console.log(`Requires quorum: ${result.quorumTypes.join(', ')}`);
}
```

### Request Quorum Approval

```typescript
import { requestQuorumApproval } from '@dreamnet/governance';

const request = requestQuorumApproval(
  'policy-deploy-infra',
  {
    actorId: 'admin-1',
    actorType: 'admin',
  },
  'deploy',
  'infrastructure',
  ['tech', 'safety']
);

console.log(`Status: ${request.status}`);
```

### Vote on Policy

```typescript
import { quorumEngine } from '@dreamnet/governance';

const decision = quorumEngine.vote(
  'policy-deploy-infra',
  {
    actorId: 'admin-1',
    actorType: 'admin',
  },
  'approve',
  ['tech', 'safety'],
  2,
  'Infrastructure looks good'
);

console.log(`Decision: ${decision.result}`);
console.log(`Approvals: ${decision.votes.filter(v => v.decision === 'approve').length}/${decision.threshold}`);
```

### Check Approval

```typescript
import { quorumEngine } from '@dreamnet/governance';

const isApproved = quorumEngine.isApproved('policy-deploy-infra');
if (isApproved) {
  // Execute deployment
}
```

---

## Best Practices

1. **Policy Design**
   - Use appropriate quorum types
   - Set realistic approval thresholds
   - Define clear conditions
   - Document policies

2. **Quorum Management**
   - Ensure quorum diversity
   - Track votes carefully
   - Document decisions
   - Review quorum effectiveness

3. **Policy Enforcement**
   - Check policies before operations
   - Request quorum when needed
   - Track policy decisions
   - Audit policy usage

4. **Security**
   - Default deny for safety
   - Require quorum for critical operations
   - Validate actor context
   - Audit all decisions

---

## Security Considerations

1. **Policy Security**
   - Default deny
   - Validate policies
   - Prevent policy manipulation
   - Audit policy changes

2. **Quorum Security**
   - Verify voter identity
   - Prevent vote manipulation
   - Track all votes
   - Enforce thresholds

3. **Access Control**
   - Enforce policies strictly
   - Check conditions
   - Require quorum when needed
   - Audit access

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

