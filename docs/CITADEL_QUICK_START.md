# 🏰 The Citadel - Quick Start Guide

## What is The Citadel?

The Citadel is DreamNet's **strategic command center** - a system that runs 8 specialized agents to generate intelligence about the ecosystem. It runs automatically every 60 seconds with the orchestrator cycle.

## Key Capabilities

### 1. **State Snapshot Generation** (Agent 1)
Creates a comprehensive snapshot of DreamNet's current state:
- 83 GPT agents registered
- 48 apps identified
- 182 services cataloged
- 7 integrations mapped
- Infrastructure components documented

### 2. **Health & Risk Analysis** (Agent 2)
Analyzes the snapshot to determine:
- Overall ecosystem health (stable/fragile/unknown/critical)
- Risk zones (infrastructure issues, missing details)
- Priority zones (what should be built first)
- Commands for downstream agents

### 3. **Event Fabric Design** (Agent 3)
Designs the event system:
- 7 event families (dream_lifecycle, agent_activity, deployment_pipeline, etc.)
- Event schemas with required/optional fields
- Monitoring streams for DreamScope
- Dashboards and alerts

### 4. **Health System Design** (Agent 4)
Creates the health monitoring system:
- Health entities (dreams, agents, services, infra, wallets)
- Metrics and scoring models
- Diagnostic checks
- Automated repair playbooks (surgeon protocols)

## How to Use

### Automatic Execution

The Citadel runs automatically with OrchestratorCore. No action needed - it just works!

### Manual API Calls

```bash
# Generate a snapshot
curl -X POST http://localhost:3000/api/snapshot/generate

# Run drone dome analysis
curl -X POST http://localhost:3000/api/drone-dome/analyze

# Get latest snapshot
curl http://localhost:3000/api/snapshot

# Get drone dome report
curl http://localhost:3000/api/drone-dome/report

# Get all agent outputs
curl http://localhost:3000/api/agent-outputs
```

### Programmatic Usage

```typescript
import { CitadelCore } from "@dreamnet/citadel-core";
import { readSnapshot, readDomeReport } from "../server/services/AgentHelpers";

// Run Citadel cycle
const { agentsRun, errors } = await CitadelCore.run();

// Read outputs
const snapshot = await readSnapshot();
const domeReport = await readDomeReport();

// Check status
const status = CitadelCore.getStatus();
console.log(`Total runs: ${status.totalRuns}`);
```

## Output Storage

All outputs are stored in `data/agent-outputs/`:

- **Latest versions**: `data/agent-outputs/latest/`
- **History**: `data/agent-outputs/history/`

Each output includes:
- Agent ID and output type
- Data payload
- Version and timestamp
- Dependencies metadata

## What Gets Generated

### Agent 1 Output: `vertex_fusion_snapshot`
```json
{
  "meta": {
    "snapshot_version": "v1",
    "created_at": "2025-01-27T...",
    "source": "VERTEX_CORE_AGENT_1"
  },
  "domains": {
    "ai_agents": [...],
    "apps": [...],
    "services": [...],
    "data": [...],
    "events": [...],
    "integrations": [...],
    "infra": [...]
  },
  "todo": {
    "open_questions": [...],
    "missing_details": [...],
    "proposed_next_steps": [...]
  }
}
```

### Agent 2 Output: `drone_dome_report`
```json
{
  "summary": "DreamNet ecosystem has 83 agents...",
  "overall_health": "fragile",
  "risk_zones": [...],
  "priority_zones": [...],
  "maps": {
    "agents": [...],
    "apps": [...],
    "services": [...]
  }
}
```

### Agent 3 Output: `event_fabric_spec`
- Event families and schemas
- Global conventions
- Implementation notes

### Agent 4 Output: `dreamkeeper_spec`
- Health entities and metrics
- Scoring models
- Diagnostic checks
- Surgeon protocols

## Testing

```bash
# Test the full pipeline
pnpm test:agent-pipeline
```

This will:
1. Generate snapshot (Agent 1)
2. Run drone dome analysis (Agent 2)
3. Verify outputs are stored
4. Display summary

## Next Steps

- **Agents 5-8**: Can be implemented following the same pattern
- **Integration**: Use outputs in other systems (DreamKeeper, DeployKeeper, etc.)
- **Monitoring**: Build dashboards from Agent 3's blueprint
- **Health**: Implement health scores from Agent 4

## See Also

- [Complete Documentation](THE_CITADEL.md)
- [Citadel Core Package](../packages/citadel-core/README.md)
- [Agent Helpers](../server/services/AgentHelpers.ts)

