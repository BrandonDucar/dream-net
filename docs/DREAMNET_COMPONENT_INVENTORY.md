# DreamNet Complete Component Inventory

**Generated**: 2025-01-27  
**Status**: Complete System Inventory

---

## Purpose

This document provides a complete inventory of all DreamNet components, their locations, purposes, and relationships. This serves as a reference guide for understanding the entire system.

---

## Core Biomimetic Systems

### 1. Nervous System Core
**Location**: `packages/nervous-system-core/`  
**Purpose**: Central communication hub for all DreamNet systems  
**Components**:
- Message Bus (`messageBus.ts`) - Topic-based routing
- Shared Memory (`sharedMemory.ts`) - KV, doc, vec storage
- Citadel (`citadel.ts`) - Orchestrator agent
- Drone Dome (`droneDome.ts`) - Scanner agent

**Dependencies**: Neural Mesh, Identity Grid  
**Dependents**: All systems connect through Nervous System

### 2. Star Bridge Lungs
**Location**: `packages/star-bridge-lungs/`  
**Purpose**: Cross-chain monitoring and routing  
**Components**:
- Chain health monitoring
- Gas price tracking
- Bridge reliability metrics
- Cross-chain routing

**Dependencies**: Nervous System Core  
**Dependents**: Chain Abstraction, Intent Router

### 3. Neural Mesh
**Location**: `packages/neural-mesh/`  
**Purpose**: Synaptic connections and memory traces  
**Components**:
- Synapse connections
- Memory traces
- Pattern learning

**Dependencies**: Shared Memory  
**Dependents**: QAL, Slug-Time Memory

### 4. Shield Core
**Location**: `packages/shield-core/`  
**Purpose**: Immune system / threat detection  
**Components**:
- Threat detection
- Rate limiting
- Anomaly detection

**Dependencies**: Nervous System Core  
**Dependents**: Control Core

---

## DIN Integration Components

### 5. Detector Generator Core
**Location**: `packages/detector-generator-core/`  
**Purpose**: Automated anomaly detection at scale  
**Components**:
- Generator (`generator.ts`) - Creates detectors
- Scorer (`scorer.ts`) - Scores detectors (eps=0.85)
- Store (`store/detectorStore.ts`) - Detector registry

**Dependencies**: Metrics Core, OS Core  
**Dependents**: Resilience Early-Warning, Halo-Loop

### 6. Resilience Early-Warning
**Location**: `packages/resilience-early-warning/`  
**Purpose**: Predictive failure detection  
**Components**:
- Signal Calculator (`signalCalculator.ts`) - Variance & AC1
- Resilience Index (`resilienceIndex.ts`) - 0-100 scale
- Guardrails (`guardrails.ts`) - Auto triggers

**Dependencies**: Metrics Core, Detector Generator  
**Dependents**: Autoscale Core, Control Core

### 7. DIN Infrastructure Core
**Location**: `packages/din-infrastructure-core/`  
**Purpose**: Cryptoeconomic security for infrastructure  
**Components**:
- Staking (`staking.ts`) - Node operator staking
- Slashing (`slashing.ts`) - Penalty mechanism
- Performance (`performance.ts`) - Monitoring
- Contract (`contracts/DINRegistry.sol`) - On-chain registry

**Dependencies**: Star Bridge Lungs, Control Core  
**Dependents**: Agent Wallet Manager

### 8. Registry Proofs Core
**Location**: `packages/registry-proofs-core/`  
**Purpose**: On-chain KYC/KYB attestations  
**Components**:
- Attester (`attester.ts`) - KYC/KYB provider integration
- Verifier (`verifier.ts`) - Proof verification
- Contract (`contracts/DreamRegistry.sol`) - On-chain registry

**Dependencies**: Identity Grid, Dream State  
**Dependents**: Base Mini-Apps, RWA Tokens

### 9. Intent Router Core
**Location**: `packages/intent-router-core/`  
**Purpose**: Intent-based operations with MEV protection  
**Components**:
- Intent Processor (`intentProcessor.ts`) - Parses intents
- Solver Matching (`solver.ts`) - Finds solvers
- Routing (`routing.ts`) - Cross-chain routing
- MEV Protection (`mevProtection.ts`) - MEV detection

**Dependencies**: Star Bridge Lungs, Nervous System  
**Dependents**: Base Mini-Apps, Chain Abstraction

### 10. Chain Abstraction Core
**Location**: `packages/chain-abstraction-core/`  
**Purpose**: Unified chain interface  
**Components**:
- CCT Standard (`cct.ts`) - Zero-slippage transfers
- Superchain (`superchain.ts`) - Chain abstraction
- Chain Selector - Automatic optimization

**Dependencies**: Star Bridge Lungs, Intent Router  
**Dependents**: Base Mini-Apps, Cross-Chain Operations

### 11. Startup Sequence Core
**Location**: `packages/startup-sequence-core/`  
**Purpose**: Safe-by-default initialization  
**Components**:
- DAG Builder (`dagBuilder.ts`) - Dependency graph
- Health Gates (`healthGates.ts`) - Liveness/readiness
- Traffic Grader (`trafficGrader.ts`) - Gradual opening
- Orchestrator (`initOrchestrator.ts`) - Init execution

**Dependencies**: Health Core, Nervous System  
**Dependents**: Server Startup

### 12. Incident Runbook Core
**Location**: `packages/incident-runbook-core/`  
**Purpose**: Incident response procedures  
**Components**:
- Hotkeys (`hotkeys.ts`) - Rapid commands
- Commands (`commands.ts`) - Pre-baked actions
- Classification (`classification.ts`) - P0/P1/P2

**Dependencies**: Incident Core, Control Core, OS Core  
**Dependents**: Incident Response, Monitoring

### 13. Vertex Agent Integration
**Location**: `packages/vertex-agent-integration/`  
**Purpose**: Production agent orchestration  
**Components**:
- Agent Factory (`agentFactory.ts`) - IAM-based creation
- Memory Bank (`memoryBank.ts`) - Long-term memory
- Observability (`observability.ts`) - Session tracking

**Dependencies**: Citadel, Drone Dome, Latent Collaboration  
**Dependents**: Agent Orchestration

---

## DreamNet Core Systems

### 14. DreamNet Control Core
**Location**: `packages/dreamnet-control-core/`  
**Purpose**: Kill-switches, rate limits, feature flags  
**Components**:
- Kill-switch management
- Rate limiting
- Feature flags
- Circuit breakers

**Dependencies**: Identity Grid  
**Dependents**: All systems use Control Core

### 15. DreamNet OS Core
**Location**: `packages/dreamnet-os-core/`  
**Purpose**: Global status and heartbeat  
**Components**:
- Health monitoring
- Alert system
- Recovery actions
- Integration gap detection

**Dependencies**: All subsystems  
**Dependents**: Monitoring, Alerts

### 16. DreamNet Metrics Core
**Location**: `packages/dreamnet-metrics-core/`  
**Purpose**: Metrics collection and aggregation  
**Components**:
- Golden signals
- Custom metrics
- Aggregation
- Storage

**Dependencies**: All systems emit metrics  
**Dependents**: Detector Generator, Resilience Early-Warning

### 17. DreamNet Incident Core
**Location**: `packages/dreamnet-incident-core/`  
**Purpose**: Incident tracking and management  
**Components**:
- Incident creation
- Timeline tracking
- Status updates
- Resolution

**Dependencies**: Spider Web Core  
**Dependents**: Incident Runbook, Monitoring

### 18. DreamNet Health Core
**Location**: `packages/dreamnet-health-core/`  
**Purpose**: Health checks and monitoring  
**Components**:
- Liveness checks
- Readiness checks
- Health endpoints
- Status aggregation

**Dependencies**: All systems  
**Dependents**: Startup Sequence, Monitoring

---

## Agent Systems

### 19. Citadel Core
**Location**: `packages/citadel-core/`  
**Purpose**: Planning and orchestration agent  
**Components**:
- Task planning
- Task execution
- Agent coordination

**Dependencies**: Nervous System Core  
**Dependents**: Orchestrator, Agent Mesh

### 20. Drone Dome Core
**Location**: `packages/drone-dome-core/`  
**Purpose**: World scanning and telemetry agent  
**Components**:
- Intel snapshots
- Telemetry collection
- World state scanning

**Dependencies**: Nervous System Core  
**Dependents**: Monitoring, Alerts

### 21. Super Spine
**Location**: `spine/super-spine/`  
**Purpose**: Agent registry and orchestration  
**Components**:
- Agent registry (143+ agents)
- Task routing
- Health tracking

**Dependencies**: Agent Registry Core  
**Dependents**: All agents

### 22. Agent Registry Core
**Location**: `packages/agent-registry-core/`  
**Purpose**: Agent store and health  
**Components**:
- Agent registration
- Health tracking
- Capability mapping

**Dependencies**: OS Core  
**Dependents**: Super Spine, Agent Mesh

---

## Identity & Governance

### 23. Identity Grid
**Location**: `packages/identity-grid/`  
**Purpose**: Wallet + agent identity layer  
**Components**:
- Identity nodes
- Relationship graphs
- Compliance verification

**Dependencies**: Database  
**Dependents**: All systems use Identity Grid

### 24. Dream State Core
**Location**: `packages/dream-state-core/`  
**Purpose**: Governance and citizenship  
**Components**:
- Passport system
- Governance proposals
- Voting system
- Diplomatic relations

**Dependencies**: Identity Grid  
**Dependents**: Registry Proofs, Mini-Apps

---

## Integration & Communication

### 25. Spider Web Core
**Location**: `packages/spider-web-core/`  
**Purpose**: Event threading system  
**Components**:
- Thread creation
- Event routing
- Signal processing

**Dependencies**: Nervous System Core  
**Dependents**: All event-driven systems

### 26. Latent Collaboration Core
**Location**: `packages/latent-collaboration-core/`  
**Purpose**: Agent collaboration and memory  
**Components**:
- Shared memory
- Context sharing
- Collaboration protocols

**Dependencies**: Neural Mesh, Shared Memory  
**Dependents**: Vertex Agents, Citadel

---

## Application Layer

### 27. Base Mini-Apps
**Location**: `packages/base-mini-apps/`  
**Purpose**: Mini-applications on Base  
**Components**:
- Mini-app framework
- On-chain contracts
- User interfaces

**Dependencies**: Chain Abstraction, Registry Proofs  
**Dependents**: User-facing applications

### 28. DreamHub
**Location**: `client/`  
**Purpose**: Main user interface  
**Components**:
- Web application
- API integration
- User management

**Dependencies**: All backend systems  
**Dependents**: Users

---

## Component Relationships

### Dependency Graph

```
Database/Queues (Level 0)
    ↓
Control Core, Identity Grid (Level 1)
    ↓
Nervous System Core, OS Core (Level 2)
    ↓
Detector Generator, Resilience Early-Warning (Level 3)
    ↓
Chain Abstraction, Star Bridge Lungs (Level 4)
    ↓
Orchestrator, Agent Registry (Level 5)
    ↓
APIs, Frontends (Level 6)
```

### Communication Flow

```
Event → Spider Web → Message Bus → Shared Memory → Agent Processing → Response
```

### State Management

```
Shared Memory → Neural Mesh → Slug-Time Memory → Pattern Learning
```

---

## File Locations Reference

### Documentation
- `docs/DREAMNET_COMPLETE_BLUEPRINT.md` - Master blueprint
- `docs/DIN_COMPLETE_MASTER_INDEX.md` - DIN integration index
- `docs/DREAMNET_COMPONENT_INVENTORY.md` - This document

### Implementation
- `packages/` - All core packages
- `server/` - Server implementation
- `client/` - Client application
- `spine/` - Agent spine systems

---

## Quick Reference

### By Purpose
- **Communication**: Nervous System Core, Spider Web Core, Message Bus
- **Security**: Shield Core, Control Core, DIN Infrastructure Core
- **Monitoring**: Detector Generator, Resilience Early-Warning, OS Core
- **Agents**: Citadel, Drone Dome, Super Spine, Agent Registry
- **Identity**: Identity Grid, Dream State Core, Registry Proofs
- **Cross-Chain**: Star Bridge Lungs, Chain Abstraction, Intent Router
- **Operations**: Startup Sequence, Incident Runbook, Health Core

### By Integration Level
- **Level 0**: Database, Queues
- **Level 1**: Control Core, Identity Grid
- **Level 2**: Nervous System, OS Core
- **Level 3**: Detector Generator, Resilience Early-Warning
- **Level 4**: Chain Abstraction, Star Bridge
- **Level 5**: Orchestrator, Agent Registry
- **Level 6**: APIs, Frontends

---

**Status**: ✅ Complete Inventory  
**Last Updated**: 2025-01-27

