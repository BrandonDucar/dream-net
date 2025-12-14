# Dream Tank Core - Complete Documentation

**Package**: `@dreamnet/dream-tank-core`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

Dream Tank Core provides a **dream incubation system** for DreamNet. It manages dream incubation stages (seed, cocoon, prototype, beta, launch-ready, launched, archived), tracks dream health (stable, fragile, stalled, infected), manages milestones, and provides evaluation capabilities.

### Key Features

- **Dream Incubation**: Track dreams through 7 stages of development
- **Health Monitoring**: Monitor dream health (stable, fragile, stalled, infected)
- **Milestone Management**: Create and track milestones for dreams
- **Evaluation System**: Evaluate dreams (health-check, stage-review, risk-assessment, launch-readiness)
- **Scoring**: Track priority, trust, and risk scores
- **Integration**: Links to Dream Cortex, DreamVault, Identity Grid

---

## Architecture

### How It Works

```
Dream Creation → Stage Tracking → Milestone Management → Evaluation → Health Monitoring
```

1. **Dream Creation**: Dreams created with stage, health, owner identity
2. **Stage Tracking**: Dreams progress through stages (seed → cocoon → prototype → beta → launch-ready → launched)
3. **Milestone Management**: Milestones created and tracked per dream
4. **Evaluation**: Dreams evaluated for health, stage, risk, launch-readiness
5. **Health Monitoring**: Health scores updated based on evaluations

### Why This Design

- **Lifecycle Management**: Stages enable structured development process
- **Health Tracking**: Health monitoring enables early problem detection
- **Milestone System**: Milestones enable progress tracking
- **Evaluation Framework**: Evaluations provide structured assessment
- **Identity Integration**: Owner identity enables ownership tracking

---

## API Reference

### Types

```typescript
export type DreamStage =
  | "seed"
  | "cocoon"
  | "prototype"
  | "beta"
  | "launch-ready"
  | "launched"
  | "archived";

export type DreamHealth =
  | "stable"
  | "fragile"
  | "stalled"
  | "infected";

export interface DreamIncubation {
  id: string;                 // Same as DreamCortex dream id where possible
  name: string;
  description?: string;
  stage: DreamStage;
  health: DreamHealth;
  cortexDreamId?: string;     // Link to Dream Cortex
  vaultBlueprintId?: string;  // Link to DreamVault blueprint
  ownerIdentityId?: string;   // IdentityGrid node id
  tags?: string[];
  priorityScore?: number;     // [0,1]
  trustScore?: number;        // [0,1]
  riskScore?: number;         // [0,1]
  createdAt: number;
  updatedAt: number;
}

export type MilestoneState =
  | "planned"
  | "in-progress"
  | "completed"
  | "dropped";

export interface DreamMilestone {
  id: string;
  dreamId: string;            // DreamIncubation.id
  title: string;
  description?: string;
  state: MilestoneState;
  order?: number;
  createdAt: number;
  updatedAt: number;
}

export type EvaluationKind =
  | "health-check"
  | "stage-review"
  | "risk-assessment"
  | "launch-readiness";

export interface DreamEvaluation {
  id: string;
  dreamId: string;
  kind: EvaluationKind;
  summary: string;
  score: number;              // [0,1]
  createdAt: number;
  meta?: Record<string, any>;
}
```

### Functions

#### `upsertDream(dream: Omit<DreamIncubation, "createdAt" | "updatedAt">): DreamIncubation`

Create or update a dream.

**Example**:
```typescript
import { DreamTankCore } from "@dreamnet/dream-tank-core";

const dream = DreamTankCore.upsertDream({
  id: "dream:my-dream",
  name: "My Dream",
  description: "A new dream",
  stage: "seed",
  health: "stable",
  ownerIdentityId: "identity:user-123",
  cortexDreamId: "dream:my-dream",
  vaultBlueprintId: "vault:blueprint-123",
});
```

#### `getDream(id: string): DreamIncubation | undefined`

Get dream by ID.

#### `listDreams(): DreamIncubation[]`

List all dreams.

#### `upsertMilestone(milestone: Omit<DreamMilestone, "createdAt" | "updatedAt">): DreamMilestone`

Create or update a milestone.

**Example**:
```typescript
const milestone = DreamTankCore.upsertMilestone({
  id: "milestone:1",
  dreamId: "dream:my-dream",
  title: "Complete MVP",
  description: "Build minimum viable product",
  state: "in-progress",
  order: 1,
});
```

#### `listMilestonesForDream(dreamId: string): DreamMilestone[]`

List milestones for a dream.

#### `evaluateDream(context: DreamTankContext, dream: DreamIncubation, kind?: EvaluationKind): DreamEvaluation`

Evaluate a dream.

**Example**:
```typescript
const evaluation = DreamTankCore.evaluateDream(
  { dreamCortex: DreamCortex, dreamVault: DreamVault },
  dream,
  "health-check"
);
console.log(`Health score: ${evaluation.score}`);
```

#### `run(context: DreamTankContext): DreamTankStatus`

Run dream tank cycle.

#### `status(): DreamTankStatus`

Get current tank status.

---

## Integration Points

### Consumes

- **Dream Cortex**: Links to dreams
- **DreamVault**: Links to blueprints
- **Reputation Lattice**: Trust scores
- **Field Layer**: Risk scores
- **Identity Grid**: Owner identities

### Produces

- **Dream Incubations**: Dreams in various stages
- **Milestones**: Progress tracking
- **Evaluations**: Assessment results

### Integration Pattern

```typescript
// Dream creation flow
DreamCortex.upsertDream({...})
  → DreamTankCore.upsertDream({
      cortexDreamId: dream.id,
      ...
    })
  → Milestones created
  → Evaluations run periodically
```

---

## Usage Examples

### Create Dream

```typescript
import { DreamTankCore } from "@dreamnet/dream-tank-core";

const dream = DreamTankCore.upsertDream({
  id: "dream:api-service",
  name: "API Service",
  description: "Build REST API service",
  stage: "seed",
  health: "stable",
  ownerIdentityId: "identity:user-123",
  cortexDreamId: "dream:api-service",
});
```

### Add Milestones

```typescript
// Add milestones
DreamTankCore.upsertMilestone({
  id: "milestone:1",
  dreamId: "dream:api-service",
  title: "Design API",
  state: "completed",
  order: 1,
});

DreamTankCore.upsertMilestone({
  id: "milestone:2",
  dreamId: "dream:api-service",
  title: "Implement Endpoints",
  state: "in-progress",
  order: 2,
});
```

### Evaluate Dream

```typescript
const dream = DreamTankCore.getDream("dream:api-service");

// Health check
const healthEval = DreamTankCore.evaluateDream(
  { dreamCortex: DreamCortex },
  dream,
  "health-check"
);

// Launch readiness
const launchEval = DreamTankCore.evaluateDream(
  { dreamCortex: DreamCortex },
  dream,
  "launch-readiness"
);
```

---

## Best Practices

1. **Stage Progression**: Progress dreams through stages systematically
2. **Health Monitoring**: Monitor health regularly, address fragile/stalled dreams
3. **Milestone Planning**: Create milestones before starting work
4. **Evaluation**: Run evaluations periodically (health-check, stage-review)
5. **Identity Linking**: Always link dreams to owner identities

---

## Security Considerations

- **Owner Verification**: Verify owner identity IDs exist
- **Access Control**: Implement access control for dream management
- **Evaluation Integrity**: Ensure evaluations are objective and consistent

---

## Related Systems

- **Dream Cortex**: Dream management
- **DreamVault**: Blueprint storage
- **Reputation Lattice**: Trust scoring
- **Field Layer**: Risk scoring
- **Identity Grid**: Owner identity management

---

**Status**: ✅ Complete  
**Next**: Continue with Zen Garden Core documentation
