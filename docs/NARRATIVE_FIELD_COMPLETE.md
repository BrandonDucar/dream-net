# Narrative Field - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Narrative Field provides **narrative and history management** for DreamNet. It tracks events, decisions, and changes across the system, creating a living history and narrative stream.

---

## Key Features

### Narrative Entries
- Event tracking
- Decision logging
- Change history
- System narrative

### Narrative Domains
- Infrastructure narratives
- Routing narratives
- Swarm narratives
- Dream narratives
- Reputation narratives
- Cross-chain narratives
- Security narratives

### Narrative References
- Dream references
- Agent references
- Service references
- Route references
- Chain references
- Wallet references

---

## Architecture

### Components

1. **Narrative Store** (`store/narrativeStore.ts`)
   - Entry storage
   - Entry retrieval
   - Filtering

2. **Narrative Scheduler** (`scheduler/narrativeScheduler.ts`)
   - Cycle execution
   - Entry processing

---

## API Reference

### Entry Management

#### `add(entry: NarrativeEntry): void`
Adds a narrative entry.

**Example**:
```typescript
import { NarrativeField } from '@dreamnet/narrative-field';

NarrativeField.add({
  id: `entry-${Date.now()}`,
  timestamp: Date.now(),
  title: 'API Gateway Optimized',
  summary: 'Optimized API gateway for better performance',
  severity: 'info',
  domain: 'infra',
  tags: ['optimization', 'api', 'performance'],
  references: [
    { kind: 'service', id: 'api-gateway', label: 'API Gateway' },
  ],
});
```

#### `list(filter?: NarrativeFilter): NarrativeEntry[]`
Lists narrative entries.

**Example**:
```typescript
const entries = NarrativeField.list({
  domain: 'infra',
  severityMin: 'warning',
  sinceTs: Date.now() - 86400000, // Last 24 hours
});
```

### Execution

#### `run(context: NarrativeContext): NarrativeStatus`
Runs Narrative Field cycle.

#### `status(): NarrativeStatus`
Gets Narrative Field status.

---

## Data Models

### NarrativeSeverity

```typescript
type NarrativeSeverity =
  | 'info'
  | 'notice'
  | 'warning'
  | 'critical';
```

### NarrativeDomain

```typescript
type NarrativeDomain =
  | 'infra'
  | 'routing'
  | 'swarm'
  | 'dream'
  | 'reputation'
  | 'cross-chain'
  | 'security'
  | 'generic';
```

### NarrativeEntry

```typescript
interface NarrativeEntry {
  id: string;
  timestamp: number;
  title: string;
  summary: string;
  severity: NarrativeSeverity;
  domain: NarrativeDomain;
  tags?: string[];
  references?: NarrativeReference[];
  meta?: Record<string, any>;
}
```

### NarrativeReference

```typescript
interface NarrativeReference {
  kind: 'dream' | 'agent' | 'service' | 'route' | 'chain' | 'wallet' | 'other';
  id: string;
  label?: string;
}
```

### NarrativeFilter

```typescript
interface NarrativeFilter {
  domain?: NarrativeDomain;
  severityMin?: NarrativeSeverity;
  sinceTs?: number;
  tag?: string;
}
```

---

## Narrative Domains

### Infrastructure
- System infrastructure events
- Infrastructure changes
- Infrastructure decisions
- Infrastructure health

### Routing
- Routing events
- Routing changes
- Routing decisions
- Routing health

### Swarm
- Swarm events
- Swarm changes
- Swarm decisions
- Swarm health

### Dream
- Dream events
- Dream changes
- Dream decisions
- Dream progress

### Reputation
- Reputation events
- Reputation changes
- Reputation decisions
- Reputation updates

### Cross-Chain
- Cross-chain events
- Cross-chain changes
- Cross-chain decisions
- Bridge operations

### Security
- Security events
- Security changes
- Security decisions
- Security incidents

---

## Integration Points

### DreamNet Systems
- **Dream Cortex**: Dream narratives
- **Reputation Lattice**: Reputation narratives
- **Wolf Pack**: Anomaly narratives
- **Star Bridge**: Cross-chain narratives
- **Slug Time**: Temporal narratives
- **Neural Mesh**: Pattern narratives

### External Systems
- **Analytics**: Narrative analysis
- **Dashboards**: Narrative visualization
- **Reporting**: Narrative reports

---

## Usage Examples

### Add Narrative Entry

```typescript
NarrativeField.add({
  id: `entry-${Date.now()}`,
  timestamp: Date.now(),
  title: 'Dream Completed',
  summary: 'Successfully completed dream: API Optimization',
  severity: 'info',
  domain: 'dream',
  tags: ['completion', 'api', 'optimization'],
  references: [
    { kind: 'dream', id: 'dream-api-optimization', label: 'API Optimization' },
  ],
});
```

### List Narratives

```typescript
const entries = NarrativeField.list({
  domain: 'infra',
  severityMin: 'warning',
  sinceTs: Date.now() - 86400000,
});

entries.forEach(entry => {
  console.log(`${entry.title}: ${entry.summary}`);
  console.log(`Severity: ${entry.severity}, Domain: ${entry.domain}`);
});
```

### Run Cycle

```typescript
const status = NarrativeField.run({
  dreamCortex: dreamCortex,
  reputationLattice: reputationLattice,
  wolfPack: wolfPack,
  starBridge: starBridge,
  slugTime: slugTime,
  neuralMesh: neuralMesh,
});

console.log(`Entries: ${status.entryCount}`);
console.log(`Recent: ${status.recentEntries.length}`);
```

---

## Best Practices

1. **Entry Creation**
   - Use clear titles
   - Provide summaries
   - Set appropriate severity
   - Include references

2. **Narrative Management**
   - Track important events
   - Document decisions
   - Record changes
   - Maintain history

3. **Filtering**
   - Use appropriate filters
   - Filter by domain
   - Filter by severity
   - Filter by time

---

## Security Considerations

1. **Entry Security**
   - Validate entry data
   - Protect sensitive information
   - Audit entry creation
   - Prevent manipulation

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27
