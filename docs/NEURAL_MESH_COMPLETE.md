# Neural Mesh - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Neural Mesh (N-Mesh) is the **unified nervous system** for DreamNet. It connects swarm systems, wormholes, routing, governance, and halo-loop through synapses, pulses events through the mesh, stores memory traces, and manages latent representations for agent collaboration.

---

## Key Features

### Synapse System
- Link subsystems via synapses
- Synapse configuration
- Connection management
- Pulse routing

### Event Pulsing
- Convert events to synaptic spikes
- Normalize event schema
- Emit pulses to mesh
- Batch pulse support

### Memory System
- Memory trace storage
- Long-term learning signals
- Memory decay
- Tag-based retrieval

### Latent Memory
- Agent collaboration memory
- Vector similarity search
- Agent history tracking
- On-chain context support

---

## Architecture

### Components

1. **Synapse Builder** (`synapseBuilder.ts`)
   - Synapse creation
   - Connection management
   - Status tracking

2. **Mesh Pulse** (`meshPulse.ts`)
   - Event normalization
   - Spike generation
   - Event emission

3. **Mesh Memory** (`meshMemory.ts`)
   - Memory trace storage
   - Memory retrieval
   - Decay application
   - Pheromone integration

4. **Latent Memory** (`latentMemory.ts`)
   - Latent representation storage
   - Similarity search
   - Agent history

---

## API Reference

### Synapse Management

#### `link(systems: SynapseConfig): Record<string, any>`
Links subsystems together via synapses.

**Example**:
```typescript
import { NeuralMesh } from '@dreamnet/neural-mesh';

const synapses = NeuralMesh.link({
  swarm: swarmSystem,
  governance: governanceSystem,
  wormholes: wormholeSystem,
  routing: routingSystem,
  haloLoop: haloLoopSystem,
});
```

### Event Pulsing

#### `pulse(event: any): Promise<SynapticSpike>`
Pulses an event through the mesh.

**Example**:
```typescript
const spike = await NeuralMesh.pulse({
  type: 'system.alert',
  severity: 'critical',
  payload: { message: 'System overload' },
  source: 'monitoring',
});
```

### Memory Management

#### `remember(trace: any): void`
Stores a memory trace.

**Example**:
```typescript
NeuralMesh.remember({
  source: 'DreamState',
  event: 'proposal.created',
  success: true,
  path: 'governance/proposal',
  strength: 0.8,
  tags: ['governance', 'proposal'],
});
```

### Latent Memory

#### `storeLatent(agentId: string, latentRep: number[], originalThought: string, metadata?: LatentMetadata): Promise<string>`
Stores latent representation.

**Example**:
```typescript
const memoryId = await NeuralMesh.storeLatent(
  'agent:citadel',
  [0.1, 0.2, 0.3, ...], // Vector embedding
  'I think we should optimize routing',
  {
    task: 'routing-optimization',
    context: { routeId: 'route-123' },
    relatedAgents: ['agent:spider'],
  }
);
```

#### `retrieveLatent(query: number[] | string, limit?: number, agentId?: string): Promise<LatentMemory[]>`
Retrieves similar latent representations.

#### `getAgentLatentHistory(agentId: string, limit?: number): Promise<LatentMemory[]>`
Gets agent's latent history.

### Status

#### `status(): NeuralMeshStatus`
Gets Neural Mesh status.

---

## Data Models

### SynapticSpike

```typescript
interface SynapticSpike {
  type: string;
  timestamp: number;
  payload: unknown;
  intensity: number;
  source?: string;
  target?: string;
}
```

### MemoryTrace

```typescript
interface MemoryTrace {
  trace: unknown;
  timestamp: number;
  decay?: number;
  tags?: string[];
}
```

### LatentMemory

```typescript
interface LatentMemory {
  id: string;
  agentId: string;
  latentRep: number[];
  originalThought: string;
  timestamp: Date;
  metadata?: {
    task?: string;
    context?: Record<string, any>;
    relatedAgents?: string[];
    onchainContext?: {
      chain?: string;
      walletAddress?: string;
      tokenAddress?: string;
      amount?: string;
    };
  };
}
```

---

## Memory Decay

### Exponential Decay
- Time-based decay
- Configurable decay rate
- Automatic pruning
- Strength reduction

### Decay Rate
- Default: 0.001 per day
- Configurable per trace
- Age-based calculation
- Strength preservation

---

## Latent Memory Search

### Cosine Similarity
- Vector similarity calculation
- High-dimensional search
- Agent-specific filtering
- Relevance ranking

### Search Features
- Query by vector or text
- Limit results
- Filter by agent
- Sort by similarity

---

## Integration Points

### DreamNet Systems
- **Event Wormholes**: Event emission
- **HALO Loop**: Pheromone integration
- **Swarm Systems**: Swarm connections
- **Governance**: Governance signals
- **Routing**: Routing signals

### External Systems
- **Vector Databases**: Latent storage
- **Analytics**: Memory analytics
- **Monitoring**: Pulse monitoring

---

## Usage Examples

### Link Subsystems

```typescript
const synapses = NeuralMesh.link({
  swarm: swarmSystem,
  governance: governanceSystem,
  wormholes: wormholeSystem,
});
```

### Pulse Event

```typescript
const spike = await NeuralMesh.pulse({
  type: 'dream.created',
  payload: { dreamId: 'dream-123' },
  source: 'dream-cortex',
  intensity: 5,
});
```

### Store Memory

```typescript
NeuralMesh.remember({
  source: 'SpiderWeb',
  event: 'thread.executed',
  success: true,
  path: 'spider/thread/execution',
  strength: 0.9,
  tags: ['spider', 'thread', 'execution'],
});
```

### Store Latent Memory

```typescript
const memoryId = await NeuralMesh.storeLatent(
  'agent:citadel',
  embeddingVector,
  'We should optimize the routing system',
  {
    task: 'routing-optimization',
    relatedAgents: ['agent:spider'],
  }
);
```

### Retrieve Similar Memories

```typescript
const similar = await NeuralMesh.retrieveLatent(
  queryVector,
  10, // limit
  'agent:citadel' // filter by agent
);
```

---

## Best Practices

1. **Synapse Design**
   - Link related systems
   - Configure appropriately
   - Monitor connections
   - Track pulse rates

2. **Memory Management**
   - Use meaningful tags
   - Set appropriate decay
   - Store important traces
   - Retrieve efficiently

3. **Latent Memory**
   - Use consistent vectors
   - Include context
   - Track agent history
   - Search efficiently

---

## Security Considerations

1. **Memory Security**
   - Validate memory data
   - Protect sensitive traces
   - Audit memory access
   - Prevent manipulation

2. **Latent Security**
   - Validate vectors
   - Protect agent data
   - Secure searches
   - Audit access

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
