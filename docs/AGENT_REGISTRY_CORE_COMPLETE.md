# Agent Registry Core - Complete Documentation

**Package**: `@dreamnet/agent-registry-core`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

Agent Registry Core provides **agent management, configuration, and health tracking** for DreamNet agents. It maintains a registry of all agents (system, infra, swarm, governance, economy, social, game, wellness), tracks their health status, and integrates with Field Layer and Reputation Lattice for trust/risk scoring.

### Key Features

- **Agent Configuration**: Register and manage agent configurations with metadata
- **Health Tracking**: Track agent state (idle, active, degraded, error, disabled)
- **Success/Error Recording**: Record agent execution success/failure with latency tracking
- **Trust/Risk Scores**: Integrate with Field Layer and Reputation Lattice for scoring
- **Default Agents**: Pre-seeded default agents for common subsystems
- **Status Reporting**: Aggregate status with sample agents for monitoring

---

## Architecture

### How It Works

```
Agent Registration → Health Tracking → Success/Error Recording → Trust/Risk Refresh → Status Aggregation
```

1. **Agent Registration**: Agents registered with config (id, name, kind, subsystem, tags)
2. **Health Tracking**: Health state tracked (idle → active → degraded/error)
3. **Success/Error Recording**: Agents call `recordSuccess()` or `recordError()` after execution
4. **Trust/Risk Refresh**: Scores refreshed from Field Layer and Reputation Lattice
5. **Status Aggregation**: Status aggregated for monitoring (active/degraded/error counts)

### Why This Design

- **Centralized Registry**: Single source of truth for all agents
- **Health Visibility**: Track agent health for monitoring and alerting
- **Integration**: Integrates with Field Layer and Reputation Lattice for scoring
- **Default Seeding**: Pre-seeded agents reduce setup time
- **Observable**: Status reporting enables monitoring and debugging

---

## API Reference

### Types

```typescript
export type AgentKind =
  | "system"
  | "infra"
  | "swarm"
  | "governance"
  | "economy"
  | "social"
  | "game"
  | "wellness"
  | "init"
  | "other";

export type AgentState =
  | "idle"
  | "active"
  | "degraded"
  | "error"
  | "disabled";

export interface AgentConfig {
  id: string;                 // e.g. "agent:DreamOps", "agent:WolfPack"
  name: string;               // human-friendly label
  kind: AgentKind;
  description?: string;
  subsystem?: string;         // e.g. "DreamVault", "FieldLayer"
  tags?: string[];
}

export interface AgentHealth {
  agentId: string;
  state: AgentState;
  lastRunAt?: number;
  lastSuccessAt?: number;
  lastErrorAt?: number;
  lastErrorMessage?: string;
  successCount: number;
  errorCount: number;
  avgLatencyMs?: number;
  trustScore?: number;        // 0–1
  riskScore?: number;         // 0–1
  updatedAt: number;
}

export interface AgentRegistryContext {
  fieldLayer?: any;
  reputationLattice?: any;
  narrativeField?: any;
  neuralMesh?: any;
}

export interface AgentRegistryStatus {
  lastRunAt: number | null;
  agentCount: number;
  activeCount: number;
  degradedCount: number;
  errorCount: number;
  sampleAgents: Array<{
    config: AgentConfig;
    health: AgentHealth;
  }>;
}
```

### Default Agents

Pre-seeded agents include:
- `agent:DreamOps` - DreamOps Orchestrator (infra)
- `agent:DeployKeeper` - DeployKeeper (infra)
- `agent:EnvKeeper` - EnvKeeper (infra)
- `agent:WolfPack` - Wolf Pack Protocol (swarm)
- `agent:SwarmPatrol` - Swarm Repair Patrol (swarm)
- `agent:FieldLayer` - Field Layer Engine (economy)
- `agent:EconomicEngine` - Economic Engine Core (economy)
- `agent:ZenGarden` - Zen Garden Core (wellness)
- `agent:DreamTank` - Dream Tank Incubator (governance)
- `agent:SocialHub` - Social Hub Core (social)
- `agent:WolfPackFunding` - Wolf Pack Funding Core (economy)

### Functions

#### `ensureDefaultAgentsSeeded(): void`

Seed default agents (called on initialization).

**Example**:
```typescript
import { AgentRegistryCore } from "@dreamnet/agent-registry-core";

AgentRegistryCore.ensureDefaultAgentsSeeded();
```

#### `upsertAgentConfig(cfg: AgentConfig): AgentConfig`

Register or update an agent configuration.

**Example**:
```typescript
AgentRegistryCore.upsertAgentConfig({
  id: "agent:CustomAgent",
  name: "Custom Agent",
  kind: "other",
  description: "Custom agent for specific task",
  subsystem: "CustomSystem",
  tags: ["custom", "task"],
});
```

#### `listAgentConfigs(): AgentConfig[]`

List all agent configurations.

#### `getAgentHealth(agentId: string): AgentHealth | undefined`

Get health status for an agent.

**Example**:
```typescript
const health = AgentRegistryCore.getAgentHealth("agent:DreamOps");
console.log(`State: ${health?.state}, Success: ${health?.successCount}`);
```

#### `listAgentHealth(): AgentHealth[]`

List health status for all agents.

#### `recordSuccess(agentId: string, latencyMs?: number): void`

Record successful agent execution.

**Example**:
```typescript
try {
  await agent.execute();
  AgentRegistryCore.recordSuccess("agent:DreamOps", 150); // 150ms latency
} catch (error) {
  AgentRegistryCore.recordError("agent:DreamOps", error.message);
}
```

#### `recordError(agentId: string, errorMessage: string): void`

Record failed agent execution.

**Example**:
```typescript
try {
  await agent.execute();
} catch (error) {
  AgentRegistryCore.recordError("agent:DreamOps", error.message);
}
```

#### `run(context: AgentRegistryContext): AgentRegistryStatus`

Run agent registry cycle (refreshes trust/risk scores, aggregates status).

**Example**:
```typescript
const status = AgentRegistryCore.run({
  fieldLayer: FieldLayer,
  reputationLattice: ReputationLattice,
});
console.log(`Active agents: ${status.activeCount}`);
```

#### `status(): AgentRegistryStatus`

Get current registry status.

---

## Integration Points

### Consumes

- **Field Layer**: Samples trust/risk scores for agents
- **Reputation Lattice**: Gets reputation scores for agents

### Produces

- **Agent Health**: Health status used by OS Core, monitoring systems

### Integration Pattern

```typescript
// Agent execution flow
Agent.execute()
  → AgentRegistryCore.recordSuccess(agentId, latency)
  → Health updated (state: "active")
  → Field Layer / Reputation Lattice sampled
  → Trust/Risk scores refreshed
```

---

## Usage Examples

### Register Custom Agent

```typescript
import { AgentRegistryCore } from "@dreamnet/agent-registry-core";

// Register agent
AgentRegistryCore.upsertAgentConfig({
  id: "agent:MyCustomAgent",
  name: "My Custom Agent",
  kind: "other",
  subsystem: "MySystem",
  tags: ["custom"],
});

// Record execution
try {
  await myAgent.run();
  AgentRegistryCore.recordSuccess("agent:MyCustomAgent", 200);
} catch (error) {
  AgentRegistryCore.recordError("agent:MyCustomAgent", error.message);
}
```

### Monitor Agent Health

```typescript
// Get health status
const health = AgentRegistryCore.getAgentHealth("agent:DreamOps");
if (health?.state === "error") {
  console.error(`Agent error: ${health.lastErrorMessage}`);
}

// Get registry status
const status = AgentRegistryCore.status();
console.log(`Total agents: ${status.agentCount}`);
console.log(`Active: ${status.activeCount}, Errors: ${status.errorCount}`);
```

### Run Registry Cycle

```typescript
// Run cycle with context
const status = AgentRegistryCore.run({
  fieldLayer: FieldLayer,
  reputationLattice: ReputationLattice,
});

// Check for degraded agents
if (status.degradedCount > 0) {
  console.warn(`${status.degradedCount} agents in degraded state`);
}
```

---

## Best Practices

1. **Record Executions**: Always record success/error after agent execution
2. **Latency Tracking**: Include latency in `recordSuccess()` for performance monitoring
3. **Error Messages**: Include descriptive error messages in `recordError()`
4. **Health Monitoring**: Monitor `status()` regularly for degraded/error agents
5. **Trust/Risk Scores**: Use Field Layer and Reputation Lattice for scoring

---

## Security Considerations

- **Agent IDs**: Use consistent naming convention (e.g., `agent:Name`)
- **Health Data**: Health data is internal, don't expose sensitive information
- **Error Messages**: Sanitize error messages before recording

---

## Related Systems

- **Field Layer**: Provides trust/risk scores
- **Reputation Lattice**: Provides reputation scores
- **DreamNet OS Core**: Uses agent health for system monitoring
- **Orchestrator Core**: Coordinates agent execution

---

**Status**: ✅ Complete  
**Next**: Continue with Agent Wallet Manager documentation
