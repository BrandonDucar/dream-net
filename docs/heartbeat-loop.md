# Heartbeat Loop Implementation

The Heartbeat Loop provides automatic, periodic health/status checks for DreamNet's backend systems, updating the Operator Panel and DreamScope Alive page in real-time.

## Overview

The Heartbeat Loop is a lightweight, composable system that:
- Periodically pings backend health/status endpoints
- Updates UI components automatically without manual refresh
- Handles errors gracefully with consecutive failure tracking
- Is safe, cancellable, and prevents memory leaks

## Architecture

### Backend Endpoints

1. **GET /api/alive/status** (existing)
   - Returns full system status including phase and subsystems
   - Used by heartbeat for comprehensive health checks

2. **GET /api/alive/ping** (new, optional)
   - Lightweight ping endpoint returning only timestamp
   - Can be used for ultra-lightweight heartbeat checks
   - Returns: `{ ok: true, timestamp: "..." }`

### Frontend Hook

**`useHeartbeat<T>(options)`** - Located at `apps/site/src/hooks/useHeartbeat.ts`

#### Options
- `intervalMs` (default: 15000) - Polling interval in milliseconds (minimum 10000)
- `onTick` - Optional callback called after each successful fetch
- `endpoint` (default: "/api/alive/status") - Endpoint to poll
- `enabled` (default: true) - Enable/disable heartbeat

#### Returns
- `status: T | null` - Current status data
- `lastUpdated: Date | null` - Timestamp of last successful update
- `isLoading: boolean` - Whether a fetch is in progress
- `error: string | null` - Last error message (if any)
- `refetch: () => Promise<void>` - Manual refetch function
- `consecutiveFailures: number` - Count of consecutive failures

#### Features
- ✅ Immediate fetch on mount
- ✅ Automatic periodic polling
- ✅ Safe cleanup on unmount (prevents memory leaks)
- ✅ Error handling with consecutive failure tracking
- ✅ Minimum interval enforcement (10 seconds)
- ✅ Mounted state tracking (prevents state updates after unmount)

## Integration Points

### Operator Panel (`/operator`)

The Operator Panel uses the heartbeat hook to:
- Automatically update alive status every 10 seconds
- Display last check time in the UI
- Show consecutive failure count if heartbeat is lost
- Trigger refetch after "Run Boot Check" button is clicked

**Location**: `apps/site/src/operator/OperatorPanel.tsx`

```typescript
const heartbeat = useHeartbeat<AliveStatus>({
  intervalMs: 10000,
  endpoint: "/api/alive/status",
});
```

### DreamScope Alive Page (`/dreamscope/alive`)

The Alive page uses the heartbeat hook to:
- Automatically update status every 10 seconds
- Show live status without page refresh
- Display error states with consecutive failure count
- Trigger refetch after "Run Boot Check" button is clicked

**Location**: `apps/site/src/dreamscope/DreamScopeRouter.tsx` (AliveView component)

```typescript
const heartbeat = useHeartbeat<AliveStatus>({
  intervalMs: 10000,
  endpoint: "/api/alive/status",
});
```

## Safety Features

1. **Minimum Interval**: Enforced 10-second minimum to prevent server spam
2. **Cleanup**: Intervals are cleared on unmount to prevent memory leaks
3. **Mounted State**: Prevents state updates after component unmounts
4. **Error Handling**: Errors are caught and displayed without crashing the component
5. **Consecutive Failures**: Tracks consecutive failures for monitoring

## Usage Example

```typescript
import { useHeartbeat } from "../hooks/useHeartbeat";

function MyComponent() {
  const heartbeat = useHeartbeat<MyStatusType>({
    intervalMs: 15000,
    endpoint: "/api/my/status",
    onTick: (status) => {
      console.log("Status updated:", status);
    },
  });

  return (
    <div>
      {heartbeat.isLoading && <p>Loading...</p>}
      {heartbeat.error && <p>Error: {heartbeat.error}</p>}
      {heartbeat.status && (
        <div>
          <p>Status: {JSON.stringify(heartbeat.status)}</p>
          <p>Last updated: {heartbeat.lastUpdated?.toLocaleTimeString()}</p>
        </div>
      )}
      <button onClick={() => heartbeat.refetch()}>Refresh</button>
    </div>
  );
}
```

## Testing

To test the Heartbeat Loop:

1. Start the dev server: `pnpm --filter @dreamnet/site dev`
2. Open `/operator` in your browser
3. Observe:
   - Status updates every ~10 seconds
   - "Last check" time updates automatically
   - If backend is stopped, error state is shown with consecutive failure count
4. Open `/dreamscope/alive` and verify same behavior

## Performance

- **Polling Interval**: 10-15 seconds (configurable, minimum 10 seconds)
- **Network Overhead**: Minimal (single GET request per interval)
- **Memory**: Safe cleanup prevents leaks
- **CPU**: Negligible (simple interval timer)

## Future Enhancements

Potential improvements:
- Exponential backoff on consecutive failures
- WebSocket support for real-time updates (replacing polling)
- Configurable retry logic
- Multiple endpoint support
- Health score aggregation

