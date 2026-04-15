# Event Wormholes

Event Wormholes is DreamNet's event bus and routing system. It captures events from various sources, routes them through wormholes (routing rules), and triggers actions like creating tasks or triggering HALO cycles.

## Overview

- **Package**: `@dreamnet/event-wormholes`
- **Location**: `packages/event-wormholes/`
- **Purpose**: Event capture, routing, and action triggering

## Core Concepts

### Events

Events are occurrences in the DreamNet system. Each event has:
- **Source Type**: agent, squad, halo, api, graft, spore, system
- **Event Type**: Specific event type (e.g., `api.endpoint.failed`)
- **Severity**: info, warning, error, critical
- **Payload**: Event data
- **Timestamp**: When the event occurred

### Wormholes

Wormholes are routing rules that define how events should be handled. Each wormhole has:
- **From**: Event source type and event type to match
- **To**: Action to take (log, notify, create-task)
- **Filters**: Optional filters (minSeverity, matchTags)
- **Enabled**: Whether the wormhole is active

### Actions

Wormholes can trigger the following actions:
- **log**: Log the event (default)
- **notify**: Send a notification (Phase 2)
- **create-task**: Create a suggested task in Squad Builder

## API Endpoints

### Events

- `GET /api/events/recent` - Get recent events (limit: 50)
- `GET /api/events/:id` - Get event by ID

### Wormholes

- `GET /api/wormholes` - List all wormholes
- `GET /api/wormholes/:id` - Get wormhole by ID
- `POST /api/wormholes` - Create a new wormhole
- `PUT /api/wormholes/:id` - Update a wormhole
- `DELETE /api/wormholes/:id` - Delete a wormhole
- `POST /api/wormholes/:id/enable` - Enable a wormhole
- `POST /api/wormholes/:id/disable` - Disable a wormhole

## Integration

### HALO Loop

Event Wormholes triggers HALO cycles for critical/error events:
- Events with severity `error` or `critical` trigger HALO cycles
- HALO analyzes the system and generates tasks
- Tasks are created as `pending-approval` (requires approval)

### Squad Builder

Event Wormholes creates tasks in Squad Builder:
- Tasks are created with status `pending-approval`
- Tasks can be approved and dispatched by operators
- Task creation is logged and tracked

### API Forge

API Forge emits events for:
- API endpoint failures (`api.endpoint.failed`)
- Test failures (via test results)

### Graft Engine

Graft Engine emits events for:
- Graft installation (`graft.installed`)
- Graft installation failure (`graft.install.failed`)

### HALO Loop

HALO Loop emits events for:
- Cycle completion (`halo.cycle.completed`)
- Critical weakpoints (`halo.weakpoint.critical`)

### Squad Builder

Squad Builder emits events for:
- Task completion (`squad.task.completed`)
- Task failure (`squad.task.failed`)

## Usage Example

```typescript
import { emitEvent, createWormhole } from "@dreamnet/event-wormholes";

// Emit an event
await emitEvent({
  sourceType: "api",
  eventType: "api.endpoint.failed",
  severity: "error",
  payload: { url: "/api/test", error: "Connection timeout" },
});

// Create a wormhole
const wormhole = createWormhole({
  name: "API failure → repair task",
  from: {
    sourceType: "api",
    eventType: "api.endpoint.failed",
  },
  to: {
    actionType: "create-task",
    targetAgentRole: "DeployKeeper",
  },
  filters: {
    minSeverity: "error",
  },
  enabled: true,
});
```

## Event Types

### API Events
- `api.endpoint.failed` - API endpoint failed
- `api.endpoint.success` - API endpoint succeeded

### Graft Events
- `graft.installed` - Graft installed successfully
- `graft.install.failed` - Graft installation failed

### HALO Events
- `halo.cycle.completed` - HALO cycle completed
- `halo.weakpoint.critical` - Critical weakpoint detected

### Squad Events
- `squad.task.completed` - Task completed successfully
- `squad.task.failed` - Task failed

### Spore Events
- `spore.deployed` - Spore deployed successfully

## Safety Guarantees

- Events are logged and persisted
- Tasks created from wormholes require approval
- Critical/error events trigger HALO cycles
- Wormholes can be enabled/disabled
- Event processing is async and non-blocking

## Phase 1 vs Phase 2

### Phase 1 (Current)
- Event capture and logging
- Wormhole routing rules
- Task creation (pending-approval)
- HALO cycle triggering

### Phase 2 (Future)
- Full notification system
- Auto-execution of approved tasks
- Complex event chains
- Event replay and analysis

