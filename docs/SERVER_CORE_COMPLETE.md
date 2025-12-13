# DreamNet Server Core - Complete Documentation

**Status**: ✅ Complete  
**Last Updated**: 2025-01-27  
**Total Core Files**: 18+ (including subdirectories)

---

## Overview

The `server/core/` directory contains the foundational systems that power DreamNet's autonomous orchestration, agent management, biomimetic integration, and reliability systems. These core files provide the infrastructure for all other systems.

---

## Core Files

### 1. `dreamnet-os.ts` - DreamNet OS Core

**Purpose**: The central operating system that initializes and manages all DreamNet subsystems, packages, and integrations.

**Key Components**:
- Initializes all 140+ packages
- Manages subsystem lifecycle
- Provides global access to subsystems via `dreamNetOS` singleton
- Integrates with external services (Jellyfin, PeerTube, LangChain, etc.)

**Exports**:
- `dreamNetOS` - Global singleton instance
- `initializeDreamNetOS()` - Initialize all systems

**Subsystems Managed**:
- Neural Mesh, Quantum Anticipation, Squad Alchemy
- Wolf Pack, Octopus Executor, Slug-Time Memory
- Star Bridge Lungs, Predator-Scavenger Loop
- Dream Cortex, Reputation Lattice, Narrative Field
- Identity Grid, Dream Vault, Dream Shop
- Field Layer, Dream Bet Core, Zen Garden Core
- Civic Panel Core, Dream Tank Core, Liquidity Engine
- Social Hub Core, Init Ritual Core, Economic Engine Core
- Agent Registry Core, DreamNet OS Core
- Orchestrator Core, Runtime Bridge Core
- Wolf Pack Funding Core, Wolf Pack Mailer Core
- 19+ integration packages (LangChain, CrewAI, SuperAGI, Lens, Farcaster, etc.)

**Usage**:
```typescript
import { dreamNetOS } from './core/dreamnet-os';

// Access subsystems
const neuralMesh = dreamNetOS.neuralMesh;
const wolfPack = dreamNetOS.wolfPack;
```

**Why**: Provides unified access to all DreamNet subsystems and ensures proper initialization order.

---

### 2. `SuperBrain.ts` - Autonomous Orchestration Layer

**Purpose**: The autonomous orchestration layer that watches all events, makes decisions, remembers everything, and connects all systems.

**Key Components**:
- **Event Watcher**: Watches all events and queues for processing
- **Decision Engine**: Makes autonomous decisions about what to do
- **Action Executor**: Executes decisions
- **Brain Store**: Persistent memory for long-term context
- **Cursor Integration**: Enables AI assistants to query and act

**Key Functions**:
- `startWatching()` - Start watching events
- `makeDecision(event)` - Make decision about event
- `executeAction(action)` - Execute action
- `remember(key, value)` - Store in memory
- `recall(key)` - Retrieve from memory
- `query(query)` - Query knowledge base (for Cursor/AI assistants)

**Integration**:
- Hooks to Starbridge events
- Integrates with Drive Engine
- Connects to Dream Vault
- Uses Wolf Pack for actions
- Provides Cursor query interface

**Usage**:
```typescript
import { superBrain } from './core/SuperBrain';

// Start watching
superBrain.startWatching();

// Make decision
const decision = await superBrain.makeDecision(event);

// Query (for AI assistants)
const result = await superBrain.query('What is DreamNet?');
```

**Why**: Enables autonomous decision-making and provides AI assistant integration.

---

### 3. `SuperSpine.ts` - Agent Orchestration Backbone

**Purpose**: The central nervous system that coordinates all agents - discovery, registration, task routing, load balancing, health monitoring, and inter-agent communication.

**Key Components**:
- **Agent Registry**: Discovers and registers agents
- **Task Router**: Routes tasks to appropriate agents
- **Load Balancer**: Distributes load across agents
- **Health Monitor**: Monitors agent health
- **Marketplace**: Agent marketplace and subscriptions

**Key Functions**:
- `registerAgent(agent)` - Register new agent
- `discoverAgents()` - Discover available agents
- `routeTask(task)` - Route task to agent
- `getAgentStatus(agentId)` - Get agent health status
- `subscribeToAgent(agentId, userId)` - Subscribe to agent

**Agent Status Types**:
- `idle` - Agent is idle
- `active` - Agent is active
- `busy` - Agent is busy
- `error` - Agent has error
- `offline` - Agent is offline

**Usage**:
```typescript
import { superSpine } from './core/SuperSpine';

// Register agent
await superSpine.registerAgent(agent);

// Route task
const result = await superSpine.routeTask({
  agentKey: 'wolf-pack',
  type: 'find_funding',
  params: { vertical: 'AI' }
});
```

**Why**: Provides centralized agent orchestration and marketplace functionality.

---

### 4. `DriveEngine.ts` - Pack Motivation System

**Purpose**: The motivator that gives all packs and agents a "drive" to act autonomously.

**Key Components**:
- **Purpose Engine**: Defines what drives each pack
- **Hunger System**: Measures how "hungry" each pack is
- **Momentum System**: Maintains velocity of actions
- **Action Generator**: Generates actions based on drive
- **Feedback Loop**: Adjusts drive based on outcomes

**Key Functions**:
- `calculateDrive(packId)` - Calculate drive level
- `generateAction(packId)` - Generate action based on drive
- `recordFeedback(feedback)` - Record action outcome
- `getPackProfile(packId)` - Get pack drive profile

**Pack Profiles**:
- **Wolf Pack**: Funding opportunities (hunger: 0.5, momentum: 0.5)
- **Whale Pack**: Commerce and products (hunger: 0.5, momentum: 0.5)
- **Orca Pack**: Communication and narrative (hunger: 0.5, momentum: 0.5)

**Drive Metrics**:
- `hungerLevel` - 0-1 (how much pack wants to act)
- `momentum` - 0-1 (velocity of actions)
- `successRate` - 0-1 (historical success)
- `driveMultiplier` - 0-2 (can boost or reduce drive)

**Usage**:
```typescript
import { driveEngine } from './core/DriveEngine';

// Calculate drive
const drive = driveEngine.calculateDrive('wolf-pack');

// Generate action
const action = driveEngine.generateAction('wolf-pack');
```

**Why**: Provides autonomous motivation for packs to act without explicit commands.

---

### 5. `BrainIntegration.ts` - Brain Integration Hooks

**Purpose**: Hooks Super Brain and Drive Engine to all systems.

**Key Functions**:
- `initialize()` - Initialize all integrations
- `hookStarbridgeToBrain()` - Hook Starbridge events to Super Brain
- `hookDriveEngineToPacks()` - Hook Drive Engine to packs
- `startDriveEngineCycle()` - Start Drive Engine cycle

**Integration Points**:
- Starbridge events → Super Brain
- Drive Engine → Packs
- Super Brain → Action Executor
- Cursor → Super Brain (query interface)

**Usage**:
```typescript
import { brainIntegration } from './core/BrainIntegration';

// Initialize all integrations
await brainIntegration.initialize();
```

**Why**: Provides unified integration layer for Super Brain and Drive Engine.

---

### 6. `BiomimeticIntegration.ts` - Biomimetic Systems Integration

**Purpose**: Hooks ALL biomimetic systems to Super Brain + Drive Engine.

**Key Functions**:
- `initialize()` - Initialize all biomimetic integrations
- `hookStarBridgeToBrain()` - Hook Star Bridge Lungs
- `hookNeuralMeshToBrain()` - Hook Neural Mesh
- `hookHaloLoopToBrain()` - Hook Halo Loop
- `hookShieldCoreToBrain()` - Hook Shield Core
- `hookDreamSnailToBrain()` - Hook Dream Snail
- `hookSlugTimeMemoryToBrain()` - Hook Slug-Time Memory
- `hookPredatorScavengerToBrain()` - Hook Predator-Scavenger Loop
- `hookDreamCortexToBrain()` - Hook Dream Cortex
- `hookMiniAppsToBrain()` - Hook Mini-Apps

**Biomimetic Systems**:
- **Star Bridge Lungs**: Cross-chain breathing
- **Neural Mesh**: Synapses (distributed memory)
- **Halo Loop**: Self-healing
- **Shield Core**: Immune system
- **Dream Snail**: Privacy layer
- **Predator-Scavenger Loop**: Metabolism (decay detection)
- **Dream Cortex**: Decision making
- **Slug-Time Memory**: Temporal memory
- **Mini-Apps**: 50+ apps

**Usage**:
```typescript
import { biomimeticIntegration } from './core/BiomimeticIntegration';

// Initialize all biomimetic systems
await biomimeticIntegration.initialize();
```

**Why**: Provides unified integration for all biomimetic systems.

---

### 7. `shield-spine-integration.ts` - Shield ↔ Spine Integration

**Purpose**: Provides wrapped Shield Core functions that emit events to Spine Event Bus.

**Key Functions**:
- `detectThreatWithSpine(params)` - Detect threat with Spine event
- `fireSpikeWithSpine(params)` - Fire spike with Spine event
- `updateRiskWithSpine(params)` - Update risk with Spine event

**Integration**:
- Wraps Shield Core functions
- Emits events to Spine Event Bus
- Provides correlation IDs for event tracking

**Usage**:
```typescript
import { detectThreatWithSpine } from './core/shield-spine-integration';

// Detect threat (emits Spine event)
const threat = await detectThreatWithSpine({
  type: 'rate_limit',
  level: 'high',
  source: 'api',
  target: 'endpoint',
  payload: { endpoint: '/api/dreams' }
});
```

**Why**: Ensures Shield Core events are visible in Spine Event Bus for observability.

---

### 8. `types.ts` - Core Types

**Purpose**: Defines core TypeScript types for agents and agent execution.

**Key Types**:
- `AgentRunInput` - Input for agent execution
- `AgentResult<T>` - Result from agent execution
- `AgentContext` - Context for agent execution
- `Agent` - Agent interface

**Usage**:
```typescript
import type { Agent, AgentResult, AgentContext } from './core/types';

const agent: Agent = {
  name: 'MyAgent',
  description: 'Does something',
  run: async (ctx: AgentContext, input: unknown): Promise<AgentResult> => {
    // Agent logic
  }
};
```

**Why**: Provides type safety for agent system.

---

## Reliability System Files

### 9. `startup-dag.ts` - Dependency DAG

**Purpose**: Manages service dependencies and startup order using a Directed Acyclic Graph (DAG).

**Key Components**:
- `ServiceNode` - Service definition with dependencies
- `StartupDAG` - DAG manager class
- `getStartupDAG()` - Get singleton DAG instance

**Key Functions**:
- `addNode(node)` - Add service node
- `initialize()` - Initialize services in dependency order
- `getReadiness()` - Get service readiness status
- `topologicalSort()` - Sort services by dependencies

**Usage**:
```typescript
import { getStartupDAG } from './core/startup-dag';

const dag = getStartupDAG();
await dag.initialize(); // Initialize all services in order
```

**Why**: Ensures services start in correct order based on dependencies.

---

### 10. `health-gates.ts` - Health Gates Manager

**Purpose**: Tracks readiness of critical services and controls traffic based on health gates.

**Key Components**:
- `HealthGate` - Health gate definition
- `HealthGatesManager` - Health gates manager class
- `getHealthGates()` - Get singleton manager instance

**Key Functions**:
- `registerGate(gate)` - Register health gate
- `checkGate(serviceId)` - Check specific gate
- `checkAllGates()` - Check all gates
- `getReadiness()` - Get overall readiness

**Usage**:
```typescript
import { getHealthGates } from './core/health-gates';

const gates = getHealthGates();
const readiness = await gates.getReadiness();
if (!readiness.ready) {
  // Block traffic
}
```

**Why**: Prevents traffic from reaching server until critical services are ready.

---

### 11. `circuit-breaker.ts` - Circuit Breaker Pattern

**Purpose**: Implements circuit breaker pattern to prevent cascading failures.

**Key Components**:
- `CircuitBreaker` - Circuit breaker class
- `CircuitBreakerRegistry` - Registry for multiple breakers
- `getCircuitBreakerRegistry()` - Get singleton registry

**Circuit States**:
- `CLOSED` - Normal operation
- `OPEN` - Failing, reject requests
- `HALF_OPEN` - Testing if service recovered

**Key Functions**:
- `fire(fn)` - Execute function with circuit breaker
- `getState()` - Get current state
- `reset()` - Reset circuit breaker

**Usage**:
```typescript
import { getCircuitBreakerRegistry } from './core/circuit-breaker';

const registry = getCircuitBreakerRegistry();
const breaker = registry.getBreaker('openai-api', {
  failureThreshold: 5,
  resetTimeout: 10000
});

const result = await breaker.fire(async () => {
  return await openaiClient.chat.completions.create(...);
});
```

**Why**: Prevents cascading failures by quickly failing requests to unhealthy services.

---

### 12. `db-circuit-breaker.ts` - Database Circuit Breaker

**Purpose**: Wrapper for database operations with circuit breaker protection.

**Key Functions**:
- `executeWithCircuitBreaker(operationName, dbCall)` - Execute DB operation with circuit breaker

**Usage**:
```typescript
import { executeWithCircuitBreaker } from './core/db-circuit-breaker';

const result = await executeWithCircuitBreaker('getDream', async (db) => {
  return await db.select().from(dreams).where(eq(dreams.id, dreamId));
});
```

**Why**: Protects database from overload and provides graceful degradation.

---

### 13. `dag-loader.ts` - DAG Loader

**Purpose**: Loads service definitions from `deploy/graph.json` and initializes reliability system.

**Key Functions**:
- `loadServicesFromGraph()` - Load services from graph.json
- `initializeHealthGates()` - Initialize health gates
- `initializeReliabilitySystem()` - Initialize entire reliability system

**Configuration**: Uses `deploy/graph.json` for service definitions

**Usage**:
```typescript
import { initializeReliabilitySystem } from './core/dag-loader';

await initializeReliabilitySystem();
```

**Why**: Provides declarative configuration for reliability system.

---

### 14. `traffic-shaping.ts` - Traffic Shaping

**Purpose**: Gradual traffic rollout and SLO monitoring for new features/deployments.

**Key Components**:
- `TrafficShapingManager` - Traffic shaping manager class
- `RolloutConfig` - Rollout configuration

**Key Functions**:
- `shouldRouteToNewVersion(rolloutName)` - Check if should route to new version
- `recordRequestMetrics(rolloutName, success, latency)` - Record metrics
- `getRolloutStatus(rolloutName)` - Get rollout status

**Usage**:
```typescript
import { shouldRouteToNewVersion, recordRequestMetrics } from './core/traffic-shaping';

if (shouldRouteToNewVersion('new-feature')) {
  // Route to new version
  recordRequestMetrics('new-feature', true, latency);
}
```

**Why**: Enables safe gradual rollouts and automatic rollback on SLO breaches.

---

### 15. `migrations.ts` - Database Migrations

**Purpose**: Idempotent database migrations.

**Key Functions**:
- `runMigrations()` - Run all migrations
- `rollbackMigration(migrationName)` - Rollback specific migration

**Usage**:
```typescript
import { runMigrations } from './core/migrations';

await runMigrations();
```

**Why**: Ensures database schema is up-to-date.

---

### 16. `queue-init.ts` - Queue Initialization

**Purpose**: Idempotent initialization of message queues and topics.

**Key Functions**:
- `initializeQueue(queueName)` - Initialize queue
- `initializeAllQueues()` - Initialize all queues

**Usage**:
```typescript
import { initializeAllQueues } from './core/queue-init';

await initializeAllQueues();
```

**Why**: Ensures queues exist before use.

---

## Core Agents Directory (`agents/`)

The `server/core/agents/` directory contains 13 agent implementations:

1. **AgentMarketplace.ts** - Agent marketplace logic
2. **beeQuorum.ts** - Bee quorum agent
3. **deploykeeper.ts** - Deployment keeper agent
4. **dreamkeeper.ts** - Dream keeper agent
5. **envkeeper.ts** - Environment keeper agent
6. **gpt-agent-factory.ts** - GPT agent factory
7. **manifest.json** - Agent manifest
8. **openai-assistant-agent.ts** - OpenAI Assistant agent
9. **openai-code-agent.ts** - OpenAI Code agent
10. **openai-react-agent.ts** - OpenAI ReAct agent
11. **relaybot.ts** - Relay bot agent
12. **RWACollateralManager.ts** - RWA collateral manager
13. **X402PaymentGateway.ts** - X402 payment gateway

---

## Browser Agent Directory (`browser-agent/`)

The `server/core/browser-agent/` directory contains browser agent utilities:

1. **domainAllowlist.ts** - Domain allowlist management
2. **ipBlocking.ts** - IP blocking utilities

---

## Integration Flow

```
dreamnet-os.ts
  ↓
SuperBrain.ts + SuperSpine.ts + DriveEngine.ts
  ↓
BrainIntegration.ts + BiomimeticIntegration.ts
  ↓
All subsystems (Neural Mesh, Wolf Pack, etc.)
  ↓
Reliability System (DAG, Health Gates, Circuit Breakers)
```

---

## Best Practices

1. **Initialize in order**: Use DAG to ensure proper initialization order
2. **Health gates**: Block traffic until critical services are ready
3. **Circuit breakers**: Protect external dependencies
4. **Traffic shaping**: Use gradual rollouts for new features
5. **Idempotent operations**: All initialization should be idempotent

---

**This documentation covers all core files in `server/core/`.**

