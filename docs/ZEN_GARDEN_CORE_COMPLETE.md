# Zen Garden Core - Complete Documentation

**Package**: `@dreamnet/zen-garden-core`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

Zen Garden Core provides a **wellness and activity tracking system** for DreamNet. It manages wellness sessions (meditation, breathwork, yoga, walks, etc.), tracks activities within sessions, and computes reward recommendations based on session completion.

### Key Features

- **Session Management**: Create and track wellness sessions
- **Activity Tracking**: Record activities within sessions (meditation, breathwork, yoga, etc.)
- **Ritual Integration**: Link sessions to DreamVault rituals/templates
- **Reward Computation**: Compute reward recommendations for completed sessions
- **Identity Integration**: Sessions linked to IdentityGrid identities
- **State Tracking**: Track session state (planned, in-progress, completed, abandoned)

---

## Architecture

### How It Works

```
Session Creation → Activity Recording → Session Completion → Reward Computation → Economic Engine
```

1. **Session Creation**: Sessions created with identity, state, optional ritual link
2. **Activity Recording**: Activities recorded within sessions (kind, duration, intensity)
3. **Session Completion**: Sessions marked as completed
4. **Reward Computation**: Rewards computed based on activities and session completion
5. **Economic Engine**: Rewards sent to Economic Engine for token distribution

### Why This Design

- **Wellness Focus**: Promotes wellness activities within DreamNet
- **Session-Based**: Sessions enable structured activity tracking
- **Ritual Integration**: Links to DreamVault enable reusable rituals
- **Reward System**: Rewards incentivize wellness activities
- **Identity Integration**: Identity-based tracking enables personalization

---

## API Reference

### Types

```typescript
export type ActivityKind =
  | "meditation"
  | "breathwork"
  | "yoga"
  | "walk"
  | "strength"
  | "stretching"
  | "music"
  | "class"
  | "journal"
  | "other";

export type SessionState =
  | "planned"
  | "in-progress"
  | "completed"
  | "abandoned";

export interface ActivityRecord {
  id: string;
  sessionId: string;
  identityId: string;       // IdentityGrid node id
  kind: ActivityKind;
  label?: string;
  durationMinutes?: number;
  intensity?: number;       // 0–1 subjective intensity
  timestamp: number;
  meta?: Record<string, any>;
}

export interface ZenSession {
  id: string;
  identityId: string;
  state: SessionState;
  title?: string;
  ritualVaultItemId?: string;  // Link to DreamVault ritual/template
  startedAt: number;
  endedAt?: number;
  activityIds: string[];
  tags?: string[];
  meta?: Record<string, any>;
}

export type RewardKind =
  | "points"
  | "token"
  | "badge"
  | "unlock";

export interface RewardRecommendation {
  id: string;
  sessionId: string;
  identityId: string;
  kind: RewardKind;
  amount?: number;
  currency?: string;        // "SHEEP", "FLBY", "ZEN_POINTS", etc.
  reason: string;
  createdAt: number;
}
```

### Functions

#### `upsertSession(session: Omit<ZenSession, "activityIds" | "startedAt"> & {...}): ZenSession`

Create or update a session.

**Example**:
```typescript
import { ZenGardenCore } from "@dreamnet/zen-garden-core";

const session = ZenGardenCore.upsertSession({
  id: "session:123",
  identityId: "identity:user-123",
  state: "in-progress",
  title: "Morning Meditation",
  ritualVaultItemId: "vault:ritual-meditation",
  startedAt: Date.now(),
});
```

#### `getSession(id: string): ZenSession | undefined`

Get session by ID.

#### `listSessions(): ZenSession[]`

List all sessions.

#### `upsertActivity(record: ActivityRecord): ActivityRecord`

Record an activity.

**Example**:
```typescript
const activity = ZenGardenCore.upsertActivity({
  id: "activity:123",
  sessionId: "session:123",
  identityId: "identity:user-123",
  kind: "meditation",
  label: "Mindfulness Meditation",
  durationMinutes: 20,
  intensity: 0.7,
  timestamp: Date.now(),
});
```

#### `listActivitiesForSession(sessionId: string): ActivityRecord[]`

List activities for a session.

#### `computeRewardsForSession(context: ZenGardenContext, session: ZenSession): RewardRecommendation[]`

Compute reward recommendations for a session.

**Example**:
```typescript
const session = ZenGardenCore.getSession("session:123");
const rewards = ZenGardenCore.computeRewardsForSession(
  { identityGrid: IdentityGrid, dreamVault: DreamVault },
  session
);
// Returns: [{ kind: "points", amount: 10, currency: "ZEN_POINTS", ... }]
```

#### `run(context: ZenGardenContext): ZenGardenStatus`

Run zen garden cycle.

#### `status(): ZenGardenStatus`

Get current garden status.

---

## Integration Points

### Consumes

- **Identity Grid**: Identity IDs for sessions
- **DreamVault**: Ritual/template links
- **Economic Engine**: Reward distribution

### Produces

- **Sessions**: Wellness sessions
- **Activities**: Activity records
- **Reward Recommendations**: Rewards for Economic Engine

### Integration Pattern

```typescript
// Session completion flow
ZenGardenCore.upsertSession({...})
  → Activities recorded
  → Session completed
  → computeRewardsForSession()
  → EconomicEngineCore.recordRawReward({
      source: "zen-garden",
      kind: "activity",
      baseValue: 10,
    })
```

---

## Usage Examples

### Create Session

```typescript
import { ZenGardenCore } from "@dreamnet/zen-garden-core";

const session = ZenGardenCore.upsertSession({
  id: "session:morning-meditation",
  identityId: "identity:user-123",
  state: "in-progress",
  title: "Morning Meditation",
  ritualVaultItemId: "vault:ritual-meditation",
  startedAt: Date.now(),
});
```

### Record Activities

```typescript
// Record meditation activity
ZenGardenCore.upsertActivity({
  id: "activity:meditation-1",
  sessionId: "session:morning-meditation",
  identityId: "identity:user-123",
  kind: "meditation",
  durationMinutes: 20,
  intensity: 0.8,
  timestamp: Date.now(),
});

// Record breathwork activity
ZenGardenCore.upsertActivity({
  id: "activity:breathwork-1",
  sessionId: "session:morning-meditation",
  identityId: "identity:user-123",
  kind: "breathwork",
  durationMinutes: 5,
  intensity: 0.6,
  timestamp: Date.now(),
});
```

### Complete Session and Compute Rewards

```typescript
// Complete session
const session = ZenGardenCore.getSession("session:morning-meditation");
ZenGardenCore.upsertSession({
  ...session,
  state: "completed",
  endedAt: Date.now(),
});

// Compute rewards
const rewards = ZenGardenCore.computeRewardsForSession(
  { identityGrid: IdentityGrid, dreamVault: DreamVault },
  session
);

// Send to Economic Engine
rewards.forEach(reward => {
  EconomicEngineCore.recordRawReward({
    identityId: reward.identityId,
    source: "zen-garden",
    kind: "activity",
    baseValue: reward.amount || 10,
  });
});
```

---

## Best Practices

1. **Session Planning**: Plan sessions before starting
2. **Activity Recording**: Record activities as they happen
3. **Ritual Links**: Link sessions to DreamVault rituals for consistency
4. **Reward Computation**: Compute rewards after session completion
5. **Identity Linking**: Always link sessions to identities

---

## Security Considerations

- **Identity Verification**: Verify identity IDs exist
- **Activity Validation**: Validate activity data before recording
- **Reward Integrity**: Ensure reward computation is fair and consistent

---

## Related Systems

- **Identity Grid**: Identity management
- **DreamVault**: Ritual/template storage
- **Economic Engine Core**: Reward distribution
- **Field Layer**: Wellness scoring (potential)

---

**Status**: ✅ Complete  
**Next**: Continue with Civic Panel Core documentation
