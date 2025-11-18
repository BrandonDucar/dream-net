# Heartbeat Recovery Flow

The Heartbeat Recovery Flow is a hybrid system that automatically detects heartbeat failures and triggers recovery actions.

## Overview

When the heartbeat misses 2+ consecutive intervals:
1. **System Event**: Emits `heartbeat.lost` event
2. **Wormhole Task**: Creates a suggested repair task via Event Wormholes
3. **HALO Recovery**: Triggers a light HALO cycle for fast recovery scan
4. **UI Surface**: All actions are visible in Operator Panel and DreamScope

## Architecture

### Stage 1: Heartbeat Watcher

**Location**: `apps/site/src/hooks/useHeartbeat.ts`

The heartbeat hook now includes:
- `maxConsecutiveFailures` option (default: 2)
- `onFailureThreshold` callback triggered when threshold is reached
- Debouncing: Events are emitted at most once every 60 seconds
- Automatic failure tracking and reset on success

**Configuration**:
```typescript
const heartbeat = useHeartbeat<AliveStatus>({
  intervalMs: 10000,
  endpoint: "/api/alive/status",
  maxConsecutiveFailures: 2,
  onFailureThreshold: async (failures, lastUpdated) => {
    // Trigger recovery actions
  },
});
```

### Stage 2: Event Wormhole

**Location**: `packages/event-wormholes/src/wormholeEngine.ts`

A preset wormhole listens for `heartbeat.lost` events:
- **Name**: "Heartbeat lost → repair suggestion"
- **From**: `{ sourceType: "system", eventType: "heartbeat.lost" }`
- **To**: `{ actionType: "create-task", targetAgentRole: "DeployKeeper" }`
- **Filters**: `{ minSeverity: "warning" }`

**Task Created**:
```json
{
  "type": "infra.repair.suggested",
  "status": "pending-approval",
  "payload": {
    "reason": "heartbeat.lost",
    "lastUpdated": "...",
    "hint": "restart service / check health endpoints",
    "consecutiveFailures": 2
  }
}
```

**Seeding**: Run `pnpm seed:heartbeat-wormhole` to create the wormhole preset.

### Stage 3: HALO Light Mode

**Location**: `packages/halo-loop/haloEngine.ts`

HALO now supports a "light" mode for fast recovery scans:

**Light Mode Analyzers** (fast checks only):
- `agentHealthAnalyzer`
- `endpointHealthAnalyzer`
- `envConsistencyAnalyzer`

**Light Mode Behavior**:
- Tasks are created with status `suggested` (not auto-dispatched)
- No automatic task dispatch (advisory only)
- Cycle summary includes `[LIGHT MODE]` and reason tag

**API Usage**:
```typescript
POST /api/halo/run
{
  "mode": "light",
  "reason": "heartbeat.recovery"
}
```

### Stage 4: Operator Panel Integration

**Location**: `apps/site/src/operator/OperatorPanel.tsx`

The Operator Panel now includes:

1. **Heartbeat Widget**:
   - Status: OK / DEGRADED / LOST
   - Last updated time
   - Consecutive failure count

2. **Events Feed**:
   - `heartbeat.lost` events are highlighted with red border
   - Shows `[CRITICAL]` badge

3. **Tasks Panel**:
   - Heartbeat recovery tasks (`infra.repair.suggested`) are highlighted
   - Shows `[Heartbeat Recovery]` badge
   - Displays repair hints

4. **HALO Panel**:
   - Recovery cycles are highlighted with amber border
   - Shows `[Recovery]` badge
   - Displays cycle summary with mode and reason

### Stage 5: Safety Features

1. **Debouncing**: Events are emitted at most once every 60 seconds
2. **No Auto-Approve**: All repair tasks require manual approval
3. **Idempotent**: Actions are logged and can be safely retried
4. **Error Handling**: Failures in recovery actions don't crash the system

## Flow Diagram

```
Heartbeat Failure (2+ consecutive)
    ↓
Emit heartbeat.lost event (debounced 60s)
    ↓
Wormhole matches event
    ↓
Create infra.repair.suggested task (pending-approval)
    ↓
Trigger HALO light cycle
    ↓
HALO runs fast analyzers
    ↓
Generate suggested tasks (not auto-dispatched)
    ↓
All visible in Operator Panel + DreamScope
```

## Testing

To test the recovery flow:

1. **Start the dev server**: `pnpm --filter @dreamnet/site dev`
2. **Open Operator Panel**: Navigate to `/operator`
3. **Stop the backend**: Stop the server process
4. **Observe**:
   - Heartbeat widget shows "LOST" after 2 failures
   - `heartbeat.lost` event appears in Events feed
   - Repair task appears in Tasks panel (highlighted)
   - HALO recovery cycle appears in HALO panel (highlighted)
5. **Restart backend**: System should recover automatically

## Configuration

### Heartbeat Options

- `maxConsecutiveFailures`: Threshold for triggering recovery (default: 2)
- `intervalMs`: Polling interval (default: 10000ms, minimum: 10000ms)
- `onFailureThreshold`: Callback when threshold is reached

### HALO Light Mode

- Runs only fast analyzers (agent, endpoint, env)
- Tasks are suggested (not auto-dispatched)
- Summary includes mode and reason tags

### Wormhole Preset

- Automatically created via `pnpm seed:heartbeat-wormhole`
- Can be enabled/disabled via API
- Creates tasks with type `infra.repair.suggested`

## API Endpoints

### Emit Event
```
POST /api/events/emit
{
  "sourceType": "system",
  "eventType": "heartbeat.lost",
  "severity": "critical",
  "payload": { ... }
}
```

### Run HALO Light Cycle
```
POST /api/halo/run
{
  "mode": "light",
  "reason": "heartbeat.recovery"
}
```

## Files Modified

1. `apps/site/src/hooks/useHeartbeat.ts` - Added failure threshold detection
2. `apps/site/src/operator/OperatorPanel.tsx` - Added heartbeat widget and UI highlights
3. `apps/site/src/dreamscope/DreamScopeRouter.tsx` - Added failure threshold handling
4. `packages/halo-loop/haloEngine.ts` - Added light mode support
5. `packages/event-wormholes/src/wormholeEngine.ts` - Added heartbeat.lost task creation
6. `packages/event-wormholes/src/router.ts` - Added `/api/events/emit` endpoint
7. `server/routes/halo.ts` - Updated to accept mode and reason
8. `scripts/seed-heartbeat-wormhole.ts` - Script to seed wormhole preset

## Future Enhancements

- Exponential backoff for recovery attempts
- WebSocket-based heartbeat (replacing polling)
- Automatic task approval for low-risk repairs
- Heartbeat health score aggregation
- Multi-endpoint heartbeat monitoring

