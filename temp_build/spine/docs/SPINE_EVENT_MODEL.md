# Spine Event Model

## Event Flow Architecture

The Spine uses a centralized Event Bus for all inter-component communication. All components emit events rather than calling each other directly.

```
┌─────────────────┐
│  Event Source   │
│ (BGP, Registry, │
│   Wrappers)     │
└────────┬────────┘
         │ publish()
         ▼
┌─────────────────┐
│  DreamEventBus  │
│   (In-Memory)   │
└────────┬────────┘
         │ notify
         ▼
┌─────────────────┐
│  Subscribers    │
│  (Handlers)     │
└─────────────────┘
```

## EventEnvelope Structure

Every event follows this structure:

```typescript
{
  id: string;           // UUID
  type: string;         // Event type constant
  timestamp: number;    // Unix timestamp
  source: string;       // Component identifier
  payload: T;           // Event-specific data
  metadata?: Record;    // Optional metadata
}
```

## Event Types

### Agent BGP Events

**Agent.Route.Announced**
```typescript
payload: {
  prefix: string;
  nextHop: string;
  metadata?: Record<string, unknown>;
}
```

**Agent.Route.Withdrawn**
```typescript
payload: {
  prefix: string;
}
```

### Interop Events

**Interop.Provider.Registered**
```typescript
payload: ProviderDescriptor {
  name: string;
  version?: string;
  capabilities: string[];
  metadata?: Record<string, unknown>;
}
```

**Interop.Provider.Removed**
```typescript
payload: {
  name: string;
}
```

### Security Events

**Security.ThreatEvaluated**
```typescript
payload: {
  input: unknown;
  result: string;
}
```

**Security.IncidentReported**
```typescript
payload: unknown  // Incident details
```

### Browser Events

**Browser.NavigationBlocked**
```typescript
payload: {
  url: string;
}
```

### Deployment Events

**Deployment.Announced**
```typescript
payload: {
  platform: string;
  timestamp: number;
}
```

**Deployment.ResultRecorded**
```typescript
payload: {
  platform: string;
  success: boolean;
  timestamp: number;
}
```

### DreamKeeper Events

**DreamKeeper.HealthReported**
```typescript
payload: {
  entityId: string;
  status: string;
  timestamp: number;
}
```

**DreamKeeper.StateChanged**
```typescript
payload: {
  entityId: string;
  state: string;
  timestamp: number;
}
```

### MiniApp Events

**MiniApp.Event**
```typescript
payload: {
  appId: string;
  eventType: string;
  payload?: unknown;
  timestamp: number;
}
```

### FreeTier Events

**FreeTier.UsageRecorded**
```typescript
payload: {
  service: string;
  amount: number;
  total: number;
}
```

**FreeTier.QuotaChecked**
```typescript
payload: {
  service: string;
  allowed: boolean;
  remaining?: number;
}
```

## Example Flows

### Flow 1: Agent Route Announcement

```typescript
// 1. Create Event Bus
const bus = new DreamEventBus();

// 2. Subscribe to route events
bus.subscribe(EventTypes.AGENT_ROUTE_ANNOUNCED, (event) => {
  console.log('Route announced:', event.payload);
});

// 3. Announce a route
const announcer = new RouteAnnouncements(bus, 'agent-1');
announcer.announceRoute({
  prefix: '/api/v1',
  nextHop: 'service-a',
});
```

### Flow 2: Provider Registration

```typescript
// 1. Create Event Bus
const bus = new DreamEventBus();

// 2. Create Registry
const registry = new AgentInteropRegistry(bus);

// 3. Subscribe to registration events
bus.subscribe(EventTypes.INTEROP_PROVIDER_REGISTERED, (event) => {
  console.log('Provider registered:', event.payload.name);
});

// 4. Register a provider
registry.registerProvider(OpenAIProvider);
```

### Flow 3: Deployment Recording

```typescript
// 1. Create Event Bus
const bus = new DreamEventBus();

// 2. Create Deployment Wrapper
const deployment = new DeploymentWrapper(bus);

// 3. Subscribe to deployment events
bus.subscribe(EventTypes.DEPLOYMENT_ANNOUNCED, (event) => {
  console.log('Deployment to:', event.payload.platform);
});

// 4. Announce deployment
deployment.announceDeploy('vercel');
deployment.recordDeployResult('vercel', true);
```

## Event Ordering

Events are processed **synchronously** in Phase I. Handlers are called in subscription order.

## Error Handling

If a handler throws an error:
1. The error is logged to console
2. Other handlers continue to execute
3. The event is not re-emitted

## Phase II Enhancements

Planned for Phase II:
- Async event processing
- Event persistence
- Event replay
- Event filtering
- Priority queues
- Dead letter queues
