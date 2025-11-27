# DreamNet Event Bus Specification

## Overview

The DreamNet Event Bus provides a pub/sub system for agent-to-agent communication. It enables decoupled, event-driven communication between agents and subsystems.

## Purpose

The event bus serves as the "brainstem" for agent communication:
- Enables asynchronous agent-to-agent messaging
- Provides event routing and filtering
- Supports event envelopes with metadata
- Enables event replay and debugging

## Event Structure

### DreamNet Event

```typescript
{
  id: "event-123",
  type: "agent.task" | "agent.response" | "agent.capability" | ...,
  source: "dreamnet-lucid",
  destination: "openai-assistant", // optional for broadcasts
  payload: {
    // Event-specific data
  },
  priority: "low" | "normal" | "high" | "critical",
  timestamp: 1234567890,
  metadata: {
    // Additional metadata
  }
}
```

### Event Types

- `agent.task` - Task assignment to agent
- `agent.response` - Response from agent
- `agent.capability` - Capability announcement
- `agent.status` - Status update from agent
- `agent.error` - Error from agent
- `system.health` - System health event
- `system.event` - Generic system event
- `custom` - Custom event types

### Event Envelope

Events are wrapped in envelopes for routing and processing:

```typescript
{
  event: DreamNetEvent,
  routing: {
    path: ["dreamnet-lucid", "openai-assistant"],
    hops: 2,
    routeTimestamp: 1234567890
  },
  processing: {
    attempts: 1,
    deadline: 1234567900,
    status: "pending" | "processing" | "completed" | "failed"
  },
  metadata: {
    // Additional routing/processing metadata
  }
}
```

## Event Bus Operations

### Publish Event
```typescript
eventBus.publish({
  id: "event-1",
  type: "agent.task",
  source: "dreamnet-lucid",
  payload: { task: "generate code" },
  timestamp: Date.now()
});
```

### Subscribe to Event Type
```typescript
const subscriptionId = eventBus.subscribe("agent.task", (event) => {
  console.log("Received task:", event);
});
```

### Unsubscribe
```typescript
eventBus.unsubscribe(subscriptionId);
```

## Event Router

The Event Router routes events to appropriate handlers:

```typescript
router.registerHandler("agent.task", (event) => {
  // Handle task events
});

const envelope = router.route(event);
```

## Event Categories

### Agent Events
- Task assignments
- Responses
- Capability announcements
- Status updates
- Errors

### System Events
- Health checks
- Deployment events
- Security events
- Performance metrics

### Custom Events
- Application-specific events
- Integration events
- User action events

## Integration with DreamNet Systems

### Spider Web Core
The event bus will integrate with Spider Web Core for:
- Event threading
- Event persistence
- Event replay
- Event analytics

### Instant Mesh
Integration with Instant Mesh for:
- Message bus functionality
- Distributed event routing
- Event synchronization

### Shield Core
Integration with Shield Core for:
- Security event monitoring
- Threat event propagation
- Security policy enforcement

## Routing Strategies

1. **Direct Routing**: Route to specific destination
2. **Broadcast Routing**: Route to all subscribers
3. **Filtered Routing**: Route based on event filters
4. **Priority Routing**: Route high-priority events first
5. **Load-Balanced Routing**: Distribute events across handlers

## Event Processing

### Processing States
- `pending` - Event queued, not yet processed
- `processing` - Event currently being processed
- `completed` - Event successfully processed
- `failed` - Event processing failed

### Retry Logic
- Automatic retries on failure
- Exponential backoff
- Maximum retry attempts
- Dead letter queue for failed events

## Current State

All event bus logic is stubbed. Antigravity will implement:
- Pub/sub system
- Event routing algorithms
- Event persistence
- Integration with Spider Web Core
- Integration with Instant Mesh
- Event replay functionality
- Event analytics

## Future Enhancements

1. **Event Streaming**: Real-time event streaming
2. **Event Replay**: Replay events for debugging
3. **Event Analytics**: Analyze event patterns
4. **Event Filtering**: Advanced event filtering
5. **Event Transformation**: Transform events during routing
6. **Event Aggregation**: Aggregate multiple events
7. **Event Scheduling**: Schedule events for future delivery

