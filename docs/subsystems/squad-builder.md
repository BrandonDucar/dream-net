# Squad Builder

The Squad Builder is DreamNet's agent orchestration and task dispatch system. It manages agents, squads, and tasks, and routes tasks to the appropriate agents for execution.

## Overview

- **Package**: `@dreamnet/squad-builder`
- **Location**: `packages/squad-builder/`
- **Purpose**: Agent orchestration, task dispatch, and squad management

## Core Concepts

### Agents

Agents are individual workers that can execute tasks. Each agent has:
- **Role**: The agent's role (DreamKeeper, DeployKeeper, EnvKeeper, RelayBot, etc.)
- **Capabilities**: List of capabilities the agent can perform
- **Status**: Online/offline status
- **Last Seen**: Timestamp of last activity

### Squads

Squads are groups of agents that work together on related tasks. Each squad has:
- **Agents**: List of agents in the squad
- **Active Task**: Currently executing task (if any)
- **Status**: Active/inactive status

### Tasks

Tasks are work items that need to be executed. Each task has:
- **Type**: Task type (graft.install, deploy.vercel, env.audit, etc.)
- **Status**: pending, running, success, failed, suggested, pending-approval
- **Payload**: Task data
- **Assigned Agent**: Agent assigned to execute the task
- **Logs**: Execution logs

## API Endpoints

### Agents

- `GET /api/squad/agents` - List all agents
- `POST /api/squad/agents` - Register a new agent

### Squads

- `GET /api/squad` - List all squads
- `GET /api/squad/:id` - Get squad by ID
- `POST /api/squad` - Create a new squad
- `PUT /api/squad/:id` - Update a squad

### Tasks

- `GET /api/squad/tasks` - List all tasks (optionally filter by squadId)
- `POST /api/squad/tasks` - Create a new task
- `GET /api/squad/tasks/:id` - Get task by ID
- `POST /api/squad/tasks/:id/dispatch` - Dispatch a task to an agent

## Integration

### DreamNet OS

Squad Builder integrates with DreamNet OS to execute agents:
- Tasks are dispatched to agents via `dreamNetOS.runAgent()`
- Agent roles are mapped to DreamNet OS agent names
- Execution results are tracked and logged

### Event Wormholes

Squad Builder emits events for:
- Task completion (`squad.task.completed`)
- Task failure (`squad.task.failed`)

## Usage Example

```typescript
import { createTask, dispatchTask } from "@dreamnet/squad-builder";

// Create a task
const task = createTask({
  type: "graft.install",
  status: "pending",
  payload: { graftId: "graft-123" },
});

// Dispatch the task
const result = await dispatchTask(task.id);
if (result.success) {
  console.log(`Task dispatched to agent ${result.agentId}`);
}
```

## Task Types

- `graft.install` - Install a graft (GraftBuilder)
- `deploy.vercel` - Deploy to Vercel (DeployKeeper)
- `env.audit` - Audit environment variables (EnvKeeper)
- `build.module` - Build a module (BuildKeeper)
- `repair.api.endpoint` - Repair an API endpoint (DeployKeeper)
- `agent.revive` - Revive an agent (DreamOps)

## Status Flow

```
pending → running → success/failed
suggested → pending-approval → pending → running → success/failed
```

## Safety Guarantees

- Tasks with status `suggested` or `pending-approval` require approval before execution
- Only tasks with status `pending` can be dispatched
- Task execution is logged and tracked
- Failed tasks emit events for monitoring

