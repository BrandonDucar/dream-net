# 🏰 The Citadel - Strategic Command Center

## Overview

**The Citadel** is DreamNet's strategic command center - a system that orchestrates 8 specialized Vertex AI agents to generate comprehensive snapshots, reports, and blueprints that provide foundational intelligence for the entire DreamNet ecosystem.

## Purpose

The Citadel serves as the "brain" of DreamNet, continuously analyzing the ecosystem's state and generating strategic intelligence that other systems depend on. It runs first in every orchestrator cycle, ensuring all downstream systems have access to the latest strategic data.

## Architecture

### Integration Points

- **OrchestratorCore**: Runs first in every cycle (before FieldLayer)
- **Agent Output Store**: Stores all agent outputs in `data/agent-outputs/`
- **Neural Mesh**: Can receive context for learning and memory
- **API Endpoints**: Provides REST APIs for manual triggering and querying

### Execution Flow

```
Orchestrator Cycle Starts (every 60 seconds)
  ↓
🏰 The Citadel.run()
  ├─ Validates dependencies
  ├─ Runs agents sequentially (1 → 2 → 3 → 4...)
  ├─ Stores outputs automatically
  └─ Logs status and errors
  ↓
FieldLayer.run()
  ↓
... rest of orchestrator cycle
```

## The 8 Agents

### Agent 1: VERTEX CORE // AGENT 1 - Snapshot Engine
**Purpose**: Creates the foundational snapshot of DreamNet's current state

**Output**: `vertex_fusion_snapshot`
- **domains**: ai_agents, apps, services, data, events, integrations, infra
- **todo**: open_questions, missing_details, proposed_next_steps

**What it does**:
- Scans codebase for GPT agents (from `registry.json`)
- Identifies apps and services (from `server/routes/`)
- Maps integrations (packages, external platforms)
- Catalogs infrastructure (Dockerfile, cloudbuild.yaml, netlify.toml)
- Generates comprehensive JSON snapshot

**Dependencies**: None (runs first)

**API**: 
- `POST /api/snapshot/generate` - Generate new snapshot
- `GET /api/snapshot` - Get latest snapshot

---

### Agent 2: DRONE DOME SKY SCANNER // AGENT 2 - Dome Analyzer
**Purpose**: Analyzes the snapshot and builds a dome-level view of health, risks, and priorities

**Outputs**: 
- `drone_dome_report`: Overall health, risk zones, priority zones, maps
- `drone_dome_commands`: Actionable commands for downstream agents (3-8)

**What it does**:
- Ingests Agent 1's snapshot
- Determines overall health (stable/fragile/unknown/critical)
- Identifies risk zones (infra issues, missing details, incomplete schemas)
- Defines priority zones (what should be built first)
- Creates dome maps for all domains (agents, apps, services, data, events, integrations, infra)
- Generates commands for Agents 3-8

**Dependencies**: Agent 1 (vertex_fusion_snapshot)

**API**:
- `POST /api/drone-dome/analyze` - Run full analysis
- `GET /api/drone-dome/report` - Get latest report
- `GET /api/drone-dome/commands` - Get latest commands

---

### Agent 3: EVENT & MONITORING BLUEPRINT BUILDER
**Purpose**: Designs coherent, future-proof event fabric and monitoring blueprint

**Outputs**:
- `event_fabric_spec`: Event families, schemas, global conventions
- `monitoring_blueprint`: Streams, dashboards, alerts, storage, rollup jobs

**What it does**:
- Defines event families (dream_lifecycle, agent_activity, deployment_pipeline, wallet_scoring, social_activity, mini_app_usage, security_incidents)
- Creates event schemas with required/optional fields
- Designs monitoring streams for DreamScope
- Defines dashboards (DreamNet Overview, Infrastructure Health, Security Monitoring)
- Creates alert rules (agent errors, deployment failures, security threats)
- Specifies storage and rollup strategies

**Dependencies**: Agents 1, 2 (snapshot, dome report)

**API**:
- `POST /api/event-fabric/analyze` - Run full analysis
- `GET /api/event-fabric/spec` - Get event fabric spec
- `GET /api/event-fabric/monitoring` - Get monitoring blueprint

---

### Agent 4: DREAMKEEPER HEALTH & DIAGNOSTIC ARCHITECT
**Purpose**: Designs health scores and diagnostic systems for DreamNet entities

**Outputs**:
- `dreamkeeper_spec`: Entities, metrics, scoring models, health bands, diagnostic checks
- `surgeon_protocols`: Playbooks, escalation rules, integration points

**What it does**:
- Defines health entities (dreams, agents, services, infra_components, wallets)
- Creates metrics (dream_activity_score, agent_error_rate, service_response_time, etc.)
- Designs scoring models (dream_health_score, agent_health_score, service_health_score)
- Defines health bands (healthy/watch/unstable/critical)
- Creates diagnostic checks (agent_error_burst, dream_infection_detected, service_degradation)
- Designs surgeon playbooks (automated repair protocols)
- Defines escalation rules (when to alert humans)

**Dependencies**: Agents 1, 2, 3 (snapshot, dome report, event fabric)

**API**:
- `POST /api/dreamkeeper/analyze` - Run full analysis
- `GET /api/dreamkeeper/spec` - Get dreamkeeper spec
- `GET /api/dreamkeeper/protocols` - Get surgeon protocols

---

### Agent 5: DEPLOYKEEPER INFRA & DEPLOY ARCHITECT
**Purpose**: Designs unified deployment and infrastructure model (Status: Pending)

**Outputs**:
- `deploykeeper_blueprint`: Services, environments, CI/CD flows, config management, safety guards
- `infra_unification_plan`: Current state, target state, migration steps

**Dependencies**: Agents 1, 2 (snapshot, dome report)

**Status**: Not yet implemented

---

### Agent 6: DATA SPINE & SCHEMA ARCHITECT
**Purpose**: Transforms conceptual domains into concrete data spine (Status: Pending)

**Outputs**:
- `data_spine_spec`: Core entities and relations
- `storage_plan`: Storage choices (OLTP/OLAP)
- `migration_recommendations`: How to migrate existing data

**Dependencies**: Agent 1 (snapshot)

**Status**: Not yet implemented

---

### Agent 7: SOCIALOPS / EXTERNAL-EDGE ARCHITECT
**Purpose**: Maps external platforms and designs social operations playbooks (Status: Pending)

**Outputs**:
- `socialops_spec`: External edge mappings
- `external_edge_playbooks`: Standardized playbooks for posting, growth, interaction
- `risk_and_safety_guidelines`: Safety and compliance guidelines

**Dependencies**: Agents 1, 2 (snapshot, dome report)

**Status**: Not yet implemented

---

### Agent 8: MASTER BLUEPRINT & EVOLUTION PLANNER
**Purpose**: Synthesizes all agent outputs into phased build plan (Status: Pending)

**Outputs**:
- `master_blueprint`: Complete system blueprint
- `evolution_roadmap`: Phased build plan with dependencies
- `risk_matrix`: Risk assessment matrix

**Dependencies**: All previous agents (1-7)

**Status**: Not yet implemented

## Storage System

### Agent Output Store

All agent outputs are stored in `data/agent-outputs/`:

```
data/agent-outputs/
  ├─ latest/
  │   ├─ agent-1-vertex_fusion_snapshot.json
  │   ├─ agent-2-drone_dome_report.json
  │   ├─ agent-2-drone_dome_commands.json
  │   └─ ...
  └─ history/
      ├─ agent-1-vertex_fusion_snapshot-2025-01-27T10-30-00.json
      └─ ...
```

### Storage Features

- **Latest versions**: Always available in `latest/` directory
- **History**: All versions stored in `history/` with timestamps
- **Automatic storage**: Agents automatically store outputs after generation
- **Version tracking**: Each output includes version and creation timestamp

## API Endpoints

### Agent Outputs API
**Base**: `/api/agent-outputs`

- `POST /api/agent-outputs/:agentId/:outputType` - Store agent output
- `GET /api/agent-outputs/:agentId/:outputType` - Get latest output
- `GET /api/agent-outputs/:agentId` - Get all outputs for an agent
- `GET /api/agent-outputs` - Get all outputs across all agents
- `GET /api/agent-outputs/:agentId/:outputType/history` - Get output history

### Snapshot API (Agent 1)
**Base**: `/api/snapshot`

- `POST /api/snapshot/generate` - Generate new snapshot
- `GET /api/snapshot` - Get latest snapshot

### Drone Dome API (Agent 2)
**Base**: `/api/drone-dome`

- `POST /api/drone-dome/analyze` - Run full analysis
- `GET /api/drone-dome/report` - Get latest report
- `GET /api/drone-dome/commands` - Get latest commands

### Event Fabric API (Agent 3)
**Base**: `/api/event-fabric`

- `POST /api/event-fabric/analyze` - Run full analysis
- `GET /api/event-fabric/spec` - Get event fabric spec
- `GET /api/event-fabric/monitoring` - Get monitoring blueprint

### DreamKeeper API (Agent 4)
**Base**: `/api/dreamkeeper`

- `POST /api/dreamkeeper/analyze` - Run full analysis
- `GET /api/dreamkeeper/spec` - Get dreamkeeper spec
- `GET /api/dreamkeeper/protocols` - Get surgeon protocols

## Helper Utilities

### AgentHelpers Service

Located in `server/services/AgentHelpers.ts`, provides:

- `readSnapshot()` - Read Agent 1's snapshot
- `readDomeReport()` - Read Agent 2's report
- `readDomeCommands()` - Read Agent 2's commands
- `readEventFabricSpec()` - Read Agent 3's event fabric spec
- `readMonitoringBlueprint()` - Read Agent 3's monitoring blueprint
- `readDreamkeeperSpec()` - Read Agent 4's spec
- `readSurgeonProtocols()` - Read Agent 4's protocols
- `getAgentDependencies(agentId)` - Get all dependencies for an agent
- `validateDependencies(agentId)` - Validate dependencies exist

## Usage Examples

### Manual Snapshot Generation

```bash
# Generate a new snapshot
curl -X POST http://localhost:3000/api/snapshot/generate

# Get the latest snapshot
curl http://localhost:3000/api/snapshot
```

### Run Full Citadel Cycle

The Citadel runs automatically with OrchestratorCore, but you can also trigger it manually:

```typescript
import { CitadelCore } from "@dreamnet/citadel-core";

// Run Citadel cycle
const { agentsRun, errors } = await CitadelCore.run({
  neuralMesh: neuralMeshInstance,
});

console.log(`Agents run: ${agentsRun.join(", ")}`);
if (errors.length > 0) {
  console.error(`Errors: ${errors.join(", ")}`);
}

// Get status
const status = CitadelCore.getStatus();
console.log(`Total runs: ${status.totalRuns}`);
```

### Reading Agent Outputs

```typescript
import { readSnapshot, readDomeReport } from "../server/services/AgentHelpers";

// Read Agent 1's snapshot
const snapshot = await readSnapshot();
console.log(`Found ${snapshot.domains.ai_agents.length} agents`);

// Read Agent 2's report
const domeReport = await readDomeReport();
console.log(`Overall health: ${domeReport.overall_health}`);
console.log(`Risk zones: ${domeReport.risk_zones.length}`);
```

## Status Tracking

### Citadel Status

```typescript
const status = CitadelCore.getStatus();
// {
//   lastRun: {
//     cycleId: 1,
//     startedAt: 1234567890,
//     finishedAt: 1234567900,
//     durationMs: 100,
//     agentsRun: [1, 2, 3, 4],
//     errors: []
//   },
//   totalRuns: 1
// }
```

## Error Handling

- **Dependency validation**: Agents skip if dependencies are missing (not an error)
- **Error logging**: Errors are logged but don't stop the cycle
- **Graceful degradation**: If Agent 1 fails, others skip (expected behavior)
- **Status tracking**: All errors are tracked in Citadel status

## Future Enhancements

### Agents 5-8 Implementation

Agents 5-8 can be added following the same pattern:

1. Create service in `server/services/`
2. Create API routes in `server/routes/`
3. Add to `CitadelCore.run()` in `packages/citadel-core/index.ts`
4. Add helper functions to `AgentHelpers.ts`

### Integration Opportunities

- **Neural Mesh**: Store agent outputs as memory traces
- **DreamKeeper**: Use health scores from Agent 4
- **DeployKeeper**: Use deployment blueprints from Agent 5
- **Event System**: Implement event fabric from Agent 3
- **Monitoring**: Build dashboards from Agent 3's blueprint

## Configuration

### Environment Variables

No special environment variables required. The Citadel uses:
- Existing file system for storage (`data/agent-outputs/`)
- Existing GPT registry (`registry.json`)
- Existing codebase structure for scanning

### Orchestrator Integration

The Citadel is automatically initialized when `INIT_HEAVY_SUBSYSTEMS=true`:

```typescript
// In server/index.ts
const { CitadelCore } = await import("../packages/citadel-core");
dreamNetOS.citadelCore = CitadelCore;

// Added to OrchestratorCore context
OrchestratorCore.startIntervalLoop({
  CitadelCore: dreamNetOS.citadelCore,
  // ... other systems
}, 60 * 1000);
```

## Testing

### Test Pipeline

```bash
# Test the full pipeline (Agent 1 → Agent 2)
pnpm test:agent-pipeline
```

This will:
1. Generate snapshot (Agent 1)
2. Validate dependencies
3. Run drone dome analysis (Agent 2)
4. Verify outputs are stored
5. Display summary

### Manual Testing

```bash
# Generate snapshot
curl -X POST http://localhost:3000/api/snapshot/generate

# Run drone dome analysis
curl -X POST http://localhost:3000/api/drone-dome/analyze

# Check status
curl http://localhost:3000/api/agent-outputs
```

## Summary

The Citadel is DreamNet's strategic command center that:

✅ **Runs automatically** with every orchestrator cycle  
✅ **Generates foundational intelligence** for the ecosystem  
✅ **Stores outputs** for downstream consumption  
✅ **Validates dependencies** before running agents  
✅ **Provides APIs** for manual triggering and querying  
✅ **Tracks status** and errors for monitoring  

It's the "brain" that watches over DreamNet and provides the strategic intelligence needed for all other systems to operate effectively.

