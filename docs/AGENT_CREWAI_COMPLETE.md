# Agent CrewAI - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Agent CrewAI provides **multi-agent collaboration integration** for DreamNet's Agent Foundry vertical. It integrates with CrewAI patterns for orchestrating multiple agents working together on complex tasks, enabling sequential, hierarchical, or consensual agent collaboration workflows.

---

## Key Features

### Multi-Agent Collaboration
- Crew orchestration
- Agent role definition
- Task assignment
- Process types (sequential, hierarchical, consensual)

### API Integration
- CrewAI SDK integration
- Agent configuration
- Task management
- Error handling

---

## Architecture

### Components

1. **CrewAI Crew Orchestrator** (`CrewAICrewOrchestrator.ts`)
   - CrewAI SDK wrapper
   - Multi-agent orchestration
   - Task execution

---

## API Reference

### Initialization

#### `new CrewAICrewOrchestrator(config: DreamNetCrewConfig): CrewAICrewOrchestrator`
Creates CrewAI crew orchestrator instance.

**Example**:
```typescript
import { CrewAICrewOrchestrator } from '@dreamnet/agent-crewai';

const orchestrator = new CrewAICrewOrchestrator({
  agents: [
    {
      id: 'researcher',
      role: 'Research Analyst',
      goal: 'Research and analyze information',
      backstory: 'Expert researcher',
    },
    {
      id: 'writer',
      role: 'Content Writer',
      goal: 'Write compelling content',
      backstory: 'Skilled writer',
    },
  ],
  tasks: [
    {
      id: 'research-task',
      description: 'Research topic X',
      agentId: 'researcher',
      expectedOutput: 'Research report',
    },
    {
      id: 'write-task',
      description: 'Write article based on research',
      agentId: 'writer',
      expectedOutput: 'Article',
    },
  ],
  process: 'sequential',
});
```

#### `initialize(): Promise<void>`
Initializes crew with agents and tasks.

**Example**:
```typescript
await orchestrator.initialize();
```

### Execution

#### `execute(input?: string): Promise<{ result: string; tasks: Array<{ id: string; result: string }>; error?: string }>`
Executes crew (runs all tasks).

**Example**:
```typescript
const result = await orchestrator.execute('Research topic X');
console.log(`Result: ${result.result}`);
result.tasks.forEach(task => {
  console.log(`${task.id}: ${task.result}`);
});
```

---

## Data Models

### DreamNetCrewAgent

```typescript
interface DreamNetCrewAgent {
  id: string;
  role: string;
  goal: string;
  backstory: string;
  tools?: any[];
  verbose?: boolean;
}
```

### DreamNetCrewTask

```typescript
interface DreamNetCrewTask {
  id: string;
  description: string;
  agentId: string;
  expectedOutput?: string;
}
```

### DreamNetCrewConfig

```typescript
interface DreamNetCrewConfig {
  agents: DreamNetCrewAgent[];
  tasks: DreamNetCrewTask[];
  process?: "sequential" | "hierarchical" | "consensual";
  verbose?: boolean;
}
```

---

## Process Types

### Sequential
Tasks execute one after another in order.

### Hierarchical
Tasks execute in a hierarchical structure with dependencies.

### Consensual
Tasks execute with consensus-based decision making.

---

## Integration Points

### DreamNet Systems
- **Agent Foundry**: Agent creation vertical
- **Agent Registry Core**: Agent registration
- **Citadel Core**: Agent orchestration
- **Orchestrator Core**: System orchestration

---

## Usage Examples

### Create and Execute Crew

```typescript
const orchestrator = new CrewAICrewOrchestrator({
  agents: [
    {
      id: 'researcher',
      role: 'Research Analyst',
      goal: 'Research topics',
      backstory: 'Expert researcher',
    },
  ],
  tasks: [
    {
      id: 'research',
      description: 'Research topic',
      agentId: 'researcher',
    },
  ],
  process: 'sequential',
});

await orchestrator.initialize();
const result = await orchestrator.execute();
```

---

## Best Practices

1. **Crew Design**
   - Define clear agent roles
   - Set appropriate goals
   - Structure tasks logically
   - Choose appropriate process type

2. **Execution**
   - Initialize before execution
   - Handle errors gracefully
   - Monitor task progress
   - Cache results

---

## Security Considerations

1. **Agent Security**
   - Validate agent configurations
   - Control tool access
   - Monitor agent behavior
   - Audit executions

2. **Task Security**
   - Validate task descriptions
   - Control task assignments
   - Monitor execution
   - Prevent unauthorized actions

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

