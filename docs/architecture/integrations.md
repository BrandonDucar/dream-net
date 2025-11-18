# DreamNet Integration Architecture

This document describes how DreamNet subsystems integrate with each other.

## Integration Overview

DreamNet subsystems are designed to work together through event-driven architecture and direct integrations:

```
Event Wormholes (event bus)
    ↓
HALO Loop (analyze) → Squad Builder (dispatch) → DreamNet OS (execute)
    ↓
Memory DNA (store) → Resonance Engine (learn)
    ↓
Spore Engine (distribute) → Graft Engine (expand)
    ↓
Dark Fabric (generate) → Squad Builder (deploy)
```

## Integration Flows

### 1. Event-Driven Flow

**Event Wormholes → HALO Loop → Squad Builder → DreamNet OS**

1. Event occurs (e.g., API endpoint fails)
2. Event Wormholes captures the event
3. Event Wormholes triggers HALO Loop (if critical/error)
4. HALO Loop analyzes the system
5. HALO Loop generates tasks
6. Tasks are created in Squad Builder (status: `pending-approval`)
7. Operator approves tasks
8. Tasks are dispatched to agents
9. Agents execute via DreamNet OS
10. Results are logged and events are emitted

### 2. Spore Distribution Flow

**Spore Engine → Graft Engine → Event Wormholes**

1. Spore is deployed to agents/squads
2. Spore Engine creates a graft (if config/template type)
3. Graft is created in Graft Engine
4. Event Wormholes emits `spore.deployed` event
5. Graft can be installed to add spore to system

### 3. Code Generation Flow

**Dark Fabric → Squad Builder → DreamNet OS**

1. Fabric task is created
2. Code is generated in sandbox
3. Code is validated
4. Diff is computed
5. Task is approved/rejected
6. Approved tasks create Squad Builder tasks
7. Tasks are dispatched to agents
8. Agents execute via DreamNet OS

### 4. System Analysis Flow

**HALO Loop → Memory DNA → Resonance Engine**

1. HALO Loop analyzes system
2. Weak points are detected
3. Traits are updated in Memory DNA
4. Resonance Engine computes insights
5. Insights inform future HALO cycles

## Direct Integrations

### Squad Builder → DreamNet OS

- **Purpose**: Execute agents
- **Method**: Direct function calls
- **Flow**: `dispatchTask()` → `dreamNetOS.runAgent()`
- **Events**: Emits `squad.task.completed` and `squad.task.failed`

### Event Wormholes → HALO Loop

- **Purpose**: Trigger HALO cycles
- **Method**: Direct function calls
- **Flow**: `processEvent()` → `haloTriggers.triggerFromEvent()`
- **Conditions**: Critical/error events

### Spore Engine → Graft Engine

- **Purpose**: Create grafts from spores
- **Method**: Direct function calls
- **Flow**: `deploySpore()` → `submitGraft()`
- **Conditions**: Config/template spore types

### HALO Loop → Event Wormholes

- **Purpose**: Emit cycle events
- **Method**: Direct function calls
- **Flow**: `runCycle()` → `emitEvent()`
- **Events**: `halo.cycle.completed`, `halo.weakpoint.critical`

### API Forge → Event Wormholes

- **Purpose**: Emit API events
- **Method**: Direct function calls
- **Flow**: Request execution → `emitEvent()`
- **Events**: `api.endpoint.failed`, `api.endpoint.success`

### Graft Engine → Event Wormholes

- **Purpose**: Emit graft events
- **Method**: Direct function calls
- **Flow**: Graft operations → `emitEvent()`
- **Events**: `graft.installed`, `graft.install.failed`

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

### Task Execution
- Tasks require approval before execution
- Only tasks with status `pending` can be dispatched
- Task execution is logged and tracked
- Failed tasks emit events for monitoring

### Event Processing
- Events are logged and persisted
- Event processing is async and non-blocking
- Critical events trigger HALO cycles
- Event processing errors are caught and logged

### Code Generation
- Code is validated before execution
- Dangerous patterns are detected and warned
- Tasks require approval before deployment
- Sandbox execution is isolated

### Spore Distribution
- Only published spores can be deployed
- Spore usage is tracked and logged
- Distribution is logged and reversible

## Error Handling

### Integration Errors
- Integration errors are caught and logged
- Systems continue to function if integrations fail
- Errors are emitted as events for monitoring
- Operators are notified of integration failures

### Event Processing Errors
- Event processing errors are caught and logged
- Events are still logged even if processing fails
- Failed event processing doesn't block other events
- Errors are emitted as events for monitoring

### Task Execution Errors
- Task execution errors are caught and logged
- Failed tasks emit events for monitoring
- Tasks can be retried if they fail
- Operators are notified of task failures

## Monitoring

### Event Monitoring
- All events are logged and queryable
- Event processing is tracked and monitored
- Event processing errors are logged and monitored

### Task Monitoring
- Task execution is tracked and monitored
- Task execution errors are logged and monitored
- Task execution results are logged and queryable

### System Monitoring
- System health is monitored via Alive Mode
- System evolution is tracked via Memory DNA
- System optimization is tracked via HALO Loop

## Future Integrations

### Phase 2
- Full notification system
- Auto-execution of approved tasks
- Complex event chains
- Event replay and analysis
- Full VM isolation for Dark Fabric
- LLM integration for code generation
- Automatic code application

### Phase 3
- Multi-agent coordination
- Distributed task execution
- Event sourcing
- CQRS patterns
- Real-time collaboration
- Advanced analytics

