# 🏰 The Citadel - Functionality & Capabilities Summary

## Overview

**The Citadel** is DreamNet's strategic command center - a new system that orchestrates 8 specialized Vertex AI agents to continuously analyze the ecosystem and generate strategic intelligence.

## New Functionality

### 1. **Automated Strategic Intelligence Generation**

The Citadel runs automatically every 60 seconds with OrchestratorCore, generating:

- **State Snapshots**: Comprehensive view of DreamNet's current state
- **Health Analysis**: Overall ecosystem health and risk assessment
- **Event Blueprints**: Complete event fabric design for monitoring
- **Health Systems**: Diagnostic and repair protocols

### 2. **Agent Orchestration System**

- **Sequential Execution**: Agents run in dependency order (1 → 2 → 3 → 4...)
- **Dependency Validation**: Agents only run when upstream outputs are available
- **Error Handling**: Errors logged but don't stop the cycle
- **Status Tracking**: Monitor which agents ran and when

### 3. **Output Storage & Retrieval**

- **Automatic Storage**: All outputs stored in `data/agent-outputs/`
- **Version History**: Complete history of all outputs
- **Latest Versions**: Always available for downstream consumption
- **REST APIs**: Query outputs via HTTP endpoints

### 4. **Helper Utilities**

- **Read Functions**: Easy access to any agent's output
- **Dependency Mapping**: Know what each agent needs
- **Validation**: Check if dependencies exist before running

## Key Capabilities

### Capability 1: Ecosystem State Mapping

**What it does**: Scans the entire DreamNet codebase to create a comprehensive snapshot

**Output**: `vertex_fusion_snapshot` JSON with:
- All GPT agents (83 agents cataloged)
- All apps and services (48 apps, 182 services)
- Infrastructure components (Docker, Cloud Build, Netlify configs)
- Integrations (Base, Zora, GCP, Netlify, etc.)
- Data stores and event definitions
- Open questions and missing details

**Use cases**:
- Understanding current ecosystem state
- Identifying gaps and missing components
- Planning infrastructure improvements
- Onboarding new team members

### Capability 2: Health & Risk Assessment

**What it does**: Analyzes the snapshot to determine ecosystem health and identify risks

**Output**: `drone_dome_report` with:
- Overall health status (stable/fragile/unknown/critical)
- Risk zones (infrastructure issues, missing details, incomplete schemas)
- Priority zones (what should be built first)
- Dome maps for all domains (agents, apps, services, data, events, integrations, infra)
- Commands for downstream agents

**Use cases**:
- Monitoring ecosystem health
- Identifying critical issues before they become problems
- Prioritizing development work
- Risk management

### Capability 3: Event Fabric Design

**What it does**: Designs a complete event system for DreamNet monitoring

**Output**: `event_fabric_spec` and `monitoring_blueprint` with:
- 7 event families (dream_lifecycle, agent_activity, deployment_pipeline, wallet_scoring, social_activity, mini_app_usage, security_incidents)
- Event schemas with required/optional fields
- Monitoring streams for DreamScope
- Dashboard definitions
- Alert rules
- Storage and rollup strategies

**Use cases**:
- Implementing event-driven architecture
- Building monitoring dashboards
- Setting up alerting systems
- Creating observability infrastructure

### Capability 4: Health System Design

**What it does**: Creates a complete health monitoring and diagnostic system

**Output**: `dreamkeeper_spec` and `surgeon_protocols` with:
- Health entities (dreams, agents, services, infra, wallets)
- Metrics (activity scores, error rates, response times)
- Scoring models (health scores 0-100)
- Health bands (healthy/watch/unstable/critical)
- Diagnostic checks (error bursts, infections, degradations)
- Automated repair playbooks (surgeon protocols)
- Escalation rules

**Use cases**:
- Implementing health monitoring
- Automated incident response
- Self-healing systems
- Proactive issue detection

## Integration Points

### With OrchestratorCore

The Citadel runs **first** in every orchestrator cycle, ensuring all downstream systems have access to the latest strategic intelligence.

### With Other Systems

- **DreamKeeper**: Can use health scores from Agent 4
- **DeployKeeper**: Can use deployment blueprints from Agent 5 (when implemented)
- **Event System**: Can implement event fabric from Agent 3
- **Monitoring**: Can build dashboards from Agent 3's blueprint
- **Neural Mesh**: Can store outputs as memory traces

## API Endpoints

### Snapshot API (Agent 1)
- `POST /api/snapshot/generate` - Generate new snapshot
- `GET /api/snapshot` - Get latest snapshot

### Drone Dome API (Agent 2)
- `POST /api/drone-dome/analyze` - Run full analysis
- `GET /api/drone-dome/report` - Get latest report
- `GET /api/drone-dome/commands` - Get latest commands

### Event Fabric API (Agent 3)
- `POST /api/event-fabric/analyze` - Run full analysis
- `GET /api/event-fabric/spec` - Get event fabric spec
- `GET /api/event-fabric/monitoring` - Get monitoring blueprint

### DreamKeeper API (Agent 4)
- `POST /api/dreamkeeper/analyze` - Run full analysis
- `GET /api/dreamkeeper/spec` - Get dreamkeeper spec
- `GET /api/dreamkeeper/protocols` - Get surgeon protocols

### Agent Outputs API (All Agents)
- `POST /api/agent-outputs/:agentId/:outputType` - Store output
- `GET /api/agent-outputs/:agentId/:outputType` - Get latest output
- `GET /api/agent-outputs/:agentId` - Get all outputs for agent
- `GET /api/agent-outputs` - Get all outputs
- `GET /api/agent-outputs/:agentId/:outputType/history` - Get history

## Benefits

### 1. **Automated Intelligence**
- No manual analysis needed
- Continuous monitoring of ecosystem state
- Proactive risk identification

### 2. **Strategic Planning**
- Clear view of what exists
- Identification of gaps
- Prioritized roadmap

### 3. **System Design**
- Event fabric blueprint
- Health system design
- Deployment unification plan (when Agent 5 is implemented)

### 4. **Operational Excellence**
- Health monitoring
- Automated diagnostics
- Self-healing capabilities

## Current Status

### ✅ Implemented (Agents 1-4)
- Agent 1: Snapshot Engine
- Agent 2: Drone Dome Scanner
- Agent 3: Event Fabric Builder
- Agent 4: DreamKeeper Architect

### ⏳ Pending (Agents 5-8)
- Agent 5: DeployKeeper Architect
- Agent 6: Data Spine Architect
- Agent 7: SocialOps Architect
- Agent 8: Master Blueprint Planner

## Future Enhancements

1. **Complete Agent Pipeline**: Implement Agents 5-8
2. **Neural Mesh Integration**: Store outputs as memory traces
3. **Real-time Dashboards**: Build DreamScope from Agent 3's blueprint
4. **Health Monitoring**: Implement health scores from Agent 4
5. **Event System**: Implement event fabric from Agent 3
6. **Automated Actions**: Execute surgeon protocols automatically

## Documentation

- **[Complete Documentation](THE_CITADEL.md)** - Full technical documentation
- **[Quick Start Guide](CITADEL_QUICK_START.md)** - Get started quickly
- **[Package README](../packages/citadel-core/README.md)** - Package usage

## Summary

The Citadel provides DreamNet with:

✅ **Automated strategic intelligence** - Continuous ecosystem analysis  
✅ **Health monitoring** - Proactive risk identification  
✅ **System design blueprints** - Event fabric, health systems, deployment plans  
✅ **Operational excellence** - Automated diagnostics and self-healing  
✅ **REST APIs** - Easy access to all intelligence  
✅ **Integration ready** - Works seamlessly with existing systems  

It's the "brain" that watches over DreamNet and provides the strategic intelligence needed for all other systems to operate effectively.

