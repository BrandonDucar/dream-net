# Identity Grid - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Identity Grid provides a **graph-based identity management system** for DreamNet. It manages identity nodes (wallets, users, agents, services, dreams) and edges (relationships) between them, creating a comprehensive identity graph.

---

## Key Features

### Identity Nodes
- Multiple identity types (wallet, user, agent, service, dream)
- Chain references for wallets
- Metadata and tags
- Auto-passport issuance

### Identity Edges
- Relationship types (owns, controls, operates, relates-to, trusts, belongs-to)
- Bidirectional relationships
- Edge metadata
- Relationship tracking

### Identity Synchronization
- Auto-sync from Dream Cortex
- Auto-sync from Star Bridge
- Auto-sync from Reputation Lattice
- Cross-system linking

---

## Architecture

### Components

1. **Identity Store** (`store/identityStore.ts`)
   - Node storage
   - Edge storage
   - Graph queries

2. **Identity Linker** (`logic/identityLinker.ts`)
   - Cross-system linking
   - Auto-sync logic
   - Relationship creation

3. **Identity Scheduler** (`scheduler/identityScheduler.ts`)
   - Identity cycle execution
   - Sync coordination

---

## API Reference

### Node Management

#### `upsertNode(node: Omit<IdentityNode, "createdAt" | "updatedAt">): IdentityNode`
Creates or updates an identity node.

**Example**:
```typescript
import { IdentityGrid } from '@dreamnet/identity-grid';

const node = IdentityGrid.upsertNode({
  id: 'user:founder',
  type: 'user',
  label: 'Founder',
  tags: ['founder', 'admin'],
  meta: {
    email: 'founder@dreamnet.io',
  },
});

console.log(`Created node: ${node.id}`);
```

### Edge Management

#### `addEdge(edge: IdentityEdge): IdentityEdge`
Adds an identity edge.

**Example**:
```typescript
IdentityGrid.addEdge({
  id: 'edge-123',
  fromId: 'user:founder',
  toId: 'wallet:0x1234...',
  linkType: 'controls',
  createdAt: Date.now(),
  meta: {
    verified: true,
  },
});
```

### Graph Queries

#### `listNodes(): IdentityNode[]`
Lists all identity nodes.

#### `listEdges(): IdentityEdge[]`
Lists all identity edges.

#### `getSnapshot(): IdentitySnapshot`
Gets complete identity graph snapshot.

### Execution

#### `run(context: IdentityContext): IdentityStatus`
Runs identity cycle.

#### `status(): IdentityStatus`
Gets identity grid status.

---

## Data Models

### IdentityType

```typescript
type IdentityType =
  | 'wallet'
  | 'user'
  | 'agent'
  | 'service'
  | 'dream';
```

### ChainRef

```typescript
type ChainRef =
  | 'base'
  | 'ethereum'
  | 'solana'
  | 'polygon'
  | 'arbitrum'
  | 'avalanche'
  | 'near'
  | 'monad'
  | 'unknown';
```

### IdentityNode

```typescript
interface IdentityNode {
  id: string;
  type: IdentityType;
  label?: string;
  chain?: ChainRef;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  meta?: Record<string, any>;
}
```

### IdentityLinkType

```typescript
type IdentityLinkType =
  | 'owns'
  | 'controls'
  | 'operates'
  | 'relates-to'
  | 'trusts'
  | 'belongs-to';
```

### IdentityEdge

```typescript
interface IdentityEdge {
  id: string;
  fromId: string;
  toId: string;
  linkType: IdentityLinkType;
  createdAt: number;
  meta?: Record<string, any>;
}
```

### IdentitySnapshot

```typescript
interface IdentitySnapshot {
  nodes: IdentityNode[];
  edges: IdentityEdge[];
}
```

---

## Identity Types

### Wallet
- Blockchain wallet addresses
- Chain-specific identities
- On-chain verification

### User
- Human users
- Account identities
- User profiles

### Agent
- AI agents
- Automated systems
- Agent identities

### Service
- System services
- Infrastructure components
- Service identities

### Dream
- Dream entities
- Dream projects
- Dream identities

---

## Link Types

### Owns
- Wallet owns dream/asset
- Ownership relationships
- Asset tracking

### Controls
- User controls agent/wallet
- Control relationships
- Access management

### Operates
- Agent operates service
- Operational relationships
- Service management

### Relates-To
- Generic relationships
- Flexible linking
- Custom relationships

### Trusts
- Trust relationships
- Reputation links
- Trust networks

### Belongs-To
- Membership relationships
- Group membership
- Organization links

---

## Auto-Synchronization

### Dream Cortex Sync
- Dreams as identity nodes
- Dream metadata
- Dream relationships

### Star Bridge Sync
- Chains as service identities
- Chain metrics
- Cross-chain relationships

### Reputation Lattice Sync
- Reputation entities
- Score metadata
- Reputation links

---

## Integration Points

### DreamNet Systems
- **Dream State Core**: Passport issuance
- **Dream Cortex**: Dream identities
- **Star Bridge**: Chain identities
- **Reputation Lattice**: Reputation entities
- **Neural Mesh**: Identity patterns

### External Systems
- **Blockchain**: Wallet verification
- **Auth Systems**: User authentication
- **Analytics**: Identity analytics

---

## Usage Examples

### Create User Node

```typescript
const userNode = IdentityGrid.upsertNode({
  id: 'user:founder',
  type: 'user',
  label: 'Founder',
  tags: ['founder', 'admin'],
  meta: {
    email: 'founder@dreamnet.io',
    role: 'founder',
  },
});
```

### Create Wallet Node

```typescript
const walletNode = IdentityGrid.upsertNode({
  id: 'wallet:0x1234...',
  type: 'wallet',
  chain: 'base',
  label: 'Founder Wallet',
  tags: ['primary'],
});
```

### Link User to Wallet

```typescript
IdentityGrid.addEdge({
  id: `edge-${Date.now()}`,
  fromId: 'user:founder',
  toId: 'wallet:0x1234...',
  linkType: 'controls',
  createdAt: Date.now(),
  meta: {
    verified: true,
    primary: true,
  },
});
```

### Get Graph Snapshot

```typescript
const snapshot = IdentityGrid.getSnapshot();
console.log(`Nodes: ${snapshot.nodes.length}`);
console.log(`Edges: ${snapshot.edges.length}`);
```

---

## Best Practices

1. **Node Management**
   - Use consistent IDs
   - Add meaningful labels
   - Include relevant tags
   - Store useful metadata

2. **Edge Management**
   - Use appropriate link types
   - Add relationship metadata
   - Track edge creation
   - Maintain graph integrity

3. **Synchronization**
   - Enable auto-sync
   - Monitor sync status
   - Handle conflicts
   - Maintain consistency

---

## Security Considerations

1. **Identity Security**
   - Validate identity IDs
   - Protect identity data
   - Audit identity changes
   - Prevent manipulation

2. **Graph Security**
   - Validate edges
   - Prevent cycles
   - Secure relationships
   - Audit graph changes

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
