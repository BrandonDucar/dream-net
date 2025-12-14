# DreamNet Agent System Patterns

**Last Updated**: 2025-01-27  
**Status**: ✅ Patterns Documented

---

## Overview

DreamNet has a comprehensive agent system for managing autonomous agents, task orchestration, and agent communication. Understanding these patterns is key to understanding how agents work in DreamNet.

---

## Agent Architecture

### Agent Components

1. **Agent Registry Core** - Tracks agent configs and health
2. **Agent Gateway** - API gateway for agent communication
3. **Agent Wallet Manager** - Manages on-chain wallets for agents
4. **Squad Builder** - Task orchestration and agent assignment
5. **DreamNet Bridge** - Cursor ↔ DreamNet integration
6. **Agent Client** - TypeScript/Python client for agents

---

## Agent Registry Pattern

### Agent Config

**WHAT**: Agent configuration stored in AgentStore

**HOW**:
```typescript
interface AgentConfig {
  id: string;              // e.g., "agent:DreamOps"
  name: string;            // e.g., "DreamOps Orchestrator"
  kind: "infra" | "swarm" | "economy" | "social" | "wellness" | "governance";
  subsystem: string;       // e.g., "DreamNet OS"
  tags?: string[];         // e.g., ["orchestration", "devops"]
}
```

**WHY**: Tracks what agents exist and their capabilities

---

### Agent Health

**WHAT**: Health tracking for agents

**HOW**:
```typescript
interface AgentHealth {
  agentId: string;
  state: "idle" | "active" | "degraded" | "error" | "disabled";
  successCount: number;
  errorCount: number;
  trustScore?: number;
  riskScore?: number;
  avgLatencyMs?: number;
  lastRunAt?: number;
  lastSuccessAt?: number;
  lastErrorAt?: number;
  lastErrorMessage?: string;
  updatedAt: number;
}
```

**WHY**: Monitors agent performance and reliability

---

### Default Agents

**WHAT**: Pre-seeded agents that mirror subsystems

**HOW**: `ensureDefaultAgentsSeeded()` seeds:
- DreamOps (orchestration)
- DeployKeeper (deployments)
- EnvKeeper (env vars)
- WolfPack (funding)
- SwarmPatrol (repair)
- FieldLayer (fields)
- EconomicEngine (rewards)
- ZenGarden (wellness)
- DreamTank (incubator)
- SocialHub (social)
- WolfPackFunding (funding)

**WHY**: Ensures agents exist for all major subsystems

---

## Agent Health Tracking

### Success Recording

**HOW**: `recordAgentSuccess(agentId, latencyMs?)`
- Updates state to "active"
- Increments successCount
- Updates avgLatencyMs
- Sets lastSuccessAt

**WHY**: Tracks successful agent operations

---

### Error Recording

**HOW**: `recordAgentError(agentId, errorMessage)`
- Updates state to "error"
- Increments errorCount
- Sets lastErrorMessage
- Sets lastErrorAt

**WHY**: Tracks agent failures for debugging

---

### Score Refresh

**HOW**: `refreshAgentScores(ctx)`
- Samples FieldLayer for risk/trust scores
- Updates agent health with scores
- Runs every cycle

**WHY**: Keeps agent scores in sync with global fields

---

## Squad Builder Pattern

### Task Model

**WHAT**: Tasks that can be assigned to agents

**HOW**:
```typescript
interface TaskModel {
  id: string;
  type: string;              // e.g., "deploy.vercel", "env.audit"
  squadId?: string;
  assignedAgent?: string;
  status: "suggested" | "pending-approval" | "queued" | "running" | "completed" | "failed";
  logs: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

**WHY**: Represents work that needs to be done

---

### Agent Assignment

**HOW**: `findBestAgentForTask(task)`
1. Check if task already has assigned agent (and is online)
2. Use role mapping to find candidate:
   - `graft.install` → GraftBuilder
   - `deploy.vercel` → DeployKeeper
   - `env.audit` → EnvKeeper
   - `build.module` → BuildKeeper
   - `repair.api.endpoint` → DeployKeeper
   - `agent.revive` → DreamOps
3. Use pheromone routing if available (fallback to base router)
4. Return best agent or null

**WHY**: Routes tasks to appropriate agents based on type

---

### Task Dispatch

**HOW**: `dispatchTask(taskId)`
1. Load task
2. Check if task requires approval (suggested/pending-approval)
3. Find best agent for task
4. Update task status to "running"
5. Assign agent to task
6. Execute agent via DreamNet OS
7. Update task status based on result

**WHY**: Executes tasks through appropriate agents

---

## Agent Gateway Pattern

### API Gateway

**WHAT**: Central API gateway for agent communication

**HOW**: Routes agent requests to appropriate handlers

**WHY**: Single entry point for agent communication

---

## Agent Wallet Manager

### Wallet Management

**WHAT**: Manages on-chain wallets for agents

**HOW**: 
- Creates wallets for agents
- Manages wallet addresses
- Handles token transfers
- Tracks balances

**WHY**: Enables agents to interact with blockchain

---

## DreamNet Bridge Pattern

### Cursor Integration

**WHAT**: Bridge between Cursor IDE and DreamNet agents

**HOW**: Provides functions:
- `dnStatus()` - System status
- `dnEconomy(query)` - Economic queries
- `dnDevOps(query)` - DevOps queries
- `dnWalletIntel(query)` - Wallet intelligence
- `dnOpsContract()` - OPS contract summary
- `dnOpsValidate()` - OPS validation

**WHY**: Allows Cursor to delegate tasks to DreamNet agents

---

### Agent Client

**WHAT**: TypeScript/Python client for DreamNet API

**HOW**: 
- Natural language interface (`autonomousQuery`)
- Structured API calls
- Auto-retry with exponential backoff
- Rate limit handling

**WHY**: Easy integration for external tools

---

## Agent Communication Patterns

### 1. Direct API Calls

**HOW**: Agents call DreamNet API directly

**WHY**: Simple, direct communication

---

### 2. Task Queue

**HOW**: Tasks queued, agents pick up tasks

**WHY**: Decoupled, scalable

---

### 3. Pheromone Routing

**HOW**: Uses pheromone trails to route tasks

**WHY**: Learns from successful routes

---

## Agent Lifecycle

### 1. Registration

**HOW**: Agent config added to AgentStore

**WHY**: Makes agent available for tasks

---

### 2. Health Tracking

**HOW**: Success/error recorded in AgentHealth

**WHY**: Monitors agent reliability

---

### 3. Task Assignment

**HOW**: Tasks routed to agents based on type

**WHY**: Ensures tasks go to right agents

---

### 4. Execution

**HOW**: Agent executes task via DreamNet OS

**WHY**: Agents perform actual work

---

### 5. Result Recording

**HOW**: Success/error recorded

**WHY**: Tracks agent performance

---

## Integration Points

### Agent Registry ↔ Field Layer

**HOW**: Agent scores sampled from FieldLayer

**WHY**: Keeps agent trust/risk scores in sync

---

### Agent Registry ↔ Neural Mesh

**HOW**: Agent activity logged to Neural Mesh

**WHY**: Long-term memory of agent behavior

---

### Squad Builder ↔ DreamNet OS

**HOW**: Tasks executed via DreamNet OS

**WHY**: Centralized execution

---

## Key Insights

### 1. Agents Mirror Subsystems

- Each major subsystem has a corresponding agent
- Agents track subsystem health
- Agents can execute subsystem operations

### 2. Task-Based Architecture

- Work is represented as tasks
- Tasks are routed to agents
- Agents execute tasks

### 3. Health-Driven Routing

- Agent health influences routing
- Pheromone trails learn from success
- Failed agents are avoided

### 4. Decoupled Design

- Agents don't directly call subsystems
- Tasks queue between agents and work
- Gateway provides abstraction

---

## What's Missing

### 1. Agent Discovery

**ISSUE**: No dynamic agent discovery

**DIRECTION**: Add agent discovery mechanism
- Agents register themselves
- Dynamic capability discovery
- Auto-routing based on capabilities

### 2. Agent Communication

**ISSUE**: No direct agent-to-agent communication

**DIRECTION**: Add agent communication layer
- Agent message bus
- Direct agent calls
- Agent collaboration

### 3. Agent Persistence

**ISSUE**: Agent state lost on restart

**DIRECTION**: Add agent state persistence
- Database storage for agents
- Task persistence
- Health history

---

## Summary

**Agents**: Mirror subsystems, track health, execute tasks  
**Tasks**: Represent work, routed to agents, executed via DreamNet OS  
**Routing**: Role-based + pheromone trails  
**Health**: Tracked continuously, influences routing  
**Integration**: Field Layer, Neural Mesh, DreamNet OS

**Understanding these patterns is key to understanding DreamNet's agent system.**

