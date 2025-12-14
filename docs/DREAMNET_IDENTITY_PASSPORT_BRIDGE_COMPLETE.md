# DreamNet Identity Passport Bridge - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

DreamNet Identity Passport Bridge provides **biomimetic integration** between Identity Grid (DNA) and Dream State Passport (Citizenship). It automatically issues passports when Identity Grid nodes are created, upgrades passports based on trust scores, and maintains the "IdentityGrid → Passport → Citizenship" flow.

---

## Key Features

### Auto-Passport Issuance
- Automatic passport issuance for new Identity Grid nodes
- Tier determination based on node type and trust score
- Agent nodes get operator tier
- User/wallet nodes get tier based on trust score

### Passport Upgrades
- Trust score-based upgrades
- Tier hierarchy management
- Automatic upgrade detection
- Upgrade logging

### Identity Grid Updates
- Passport action tracking
- Node metadata updates
- Trust score integration
- Citizenship flow

---

## Architecture

### Components

1. **Identity Passport Bridge** (`logic/identityPassportBridge.ts`)
   - Auto-passport issuance
   - Passport upgrades
   - Identity Grid updates
   - Trust score integration

---

## API Reference

### Auto-Passport Issuance

#### `autoIssuePassportForIdentity(node: IdentityNode): void`
Auto-issues passport when Identity Grid node is created.

**Example**:
```typescript
import { autoIssuePassportForIdentity } from '@dreamnet/dreamnet-identity-passport-bridge';

autoIssuePassportForIdentity({
  id: 'identity-123',
  type: 'user',
  label: 'Alice',
  trustScore: 85,
  createdAt: Date.now(),
});
```

### Identity Grid Updates

#### `updateIdentityGridFromPassportAction(identityId: string, action: PassportAction, tier?: DreamPassportTier): void`
Updates Identity Grid node when passport action occurs.

**Example**:
```typescript
import { updateIdentityGridFromPassportAction } from '@dreamnet/dreamnet-identity-passport-bridge';

updateIdentityGridFromPassportAction(
  'identity-123',
  'upgraded',
  'operator'
);
```

---

## Data Models

### IdentityNode

```typescript
interface IdentityNode {
  id: string;
  type: "wallet" | "user" | "agent";
  label: string;
  trustScore?: number;
  metadata?: Record<string, any>;
  createdAt: number;
}
```

### PassportIssueEvent

```typescript
interface PassportIssueEvent {
  identityId: string;
  nodeType: "wallet" | "user" | "agent";
  trustScore?: number;
  reason: "new_node" | "trust_upgrade" | "manual";
}
```

---

## Tier Determination Logic

### Initial Tier Assignment

#### Agent Nodes
- **Tier**: `operator`
- **Reason**: Agents get operator tier by default

#### User/Wallet Nodes
- **Trust Score ≥ 90**: `architect`
- **Trust Score ≥ 75**: `operator`
- **Trust Score ≥ 60**: `ambassador` (if available)
- **Trust Score ≥ 40**: `citizen`
- **Trust Score < 40**: `visitor`

### Tier Hierarchy

```
visitor (1)
  ↓
dreamer (2)
  ↓
citizen (3)
  ↓
operator (4)
  ↓
architect (5)
  ↓
founder (6)
```

### Upgrade Logic

- **Trust Score ≥ 90**: Upgrade to `architect` (if below)
- **Trust Score ≥ 75**: Upgrade to `operator` (if below)
- **Trust Score ≥ 60**: Upgrade to `ambassador` (if below)
- **Trust Score ≥ 40**: Upgrade to `citizen` (if below)

---

## Integration Points

### DreamNet Systems
- **Identity Grid**: Node creation and updates
- **Dream State Core**: Passport issuance and upgrades
- **Reputation Lattice**: Trust score source
- **DreamNet Audit Core**: Passport action logging

---

## Usage Examples

### Auto-Issue Passport

```typescript
autoIssuePassportForIdentity({
  id: 'identity-123',
  type: 'user',
  label: 'Alice',
  trustScore: 85,
  createdAt: Date.now(),
});
```

### Update Identity Grid

```typescript
updateIdentityGridFromPassportAction(
  'identity-123',
  'upgraded',
  'operator'
);
```

---

## Best Practices

1. **Passport Management**
   - Issue passports automatically
   - Upgrade based on trust scores
   - Track passport actions
   - Maintain tier hierarchy

2. **Trust Score Integration**
   - Use trust scores for tier determination
   - Monitor trust score changes
   - Upgrade passports appropriately
   - Log all upgrades

---

## Security Considerations

1. **Passport Security**
   - Validate identity nodes
   - Secure passport issuance
   - Prevent unauthorized upgrades
   - Audit passport actions

2. **Trust Score Security**
   - Validate trust scores
   - Secure trust score sources
   - Monitor trust score changes
   - Prevent manipulation

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

