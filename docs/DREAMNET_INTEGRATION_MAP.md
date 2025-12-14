# DreamNet Complete Integration Map

**Generated**: 2025-01-27  
**Status**: Complete Integration Documentation

---

## Purpose

This document maps all integration points between DreamNet components, showing how systems communicate, share state, and coordinate operations.

---

## Integration Patterns

### Pattern 1: Message Bus Communication

**Description**: Topic-based event-driven communication

**Components**:
- Nervous System Core (Message Bus)
- All systems publish/subscribe to topics

**Topics**:
- `intel.snapshot` - Intelligence data
- `task.plan` - Task planning
- `task.exec` - Task execution
- `alert` - Alerts and incidents
- `telemetry` - Metrics and monitoring
- `state.delta` - State changes

**Example Flow**:
```
Drone Dome → intel.snapshot → Message Bus → Citadel → task.plan → Workers
```

---

### Pattern 2: Shared Memory Access

**Description**: KV, document, and vector storage shared across systems

**Components**:
- Nervous System Core (Shared Memory)
- Neural Mesh (Vector operations)
- Latent Collaboration (Context sharing)

**Storage Types**:
- **KV**: Key-value pairs with TTL
- **Doc**: JSON documents with queries
- **Vec**: Embeddings with similarity search

**Example Flow**:
```
Citadel → Shared Memory (KV) → Store task state
Agent → Shared Memory (Vec) → Neural Mesh → Find similar patterns
```

---

### Pattern 3: Health Monitoring Chain

**Description**: Metrics flow through detection and resilience systems

**Components**:
- Metrics Core (Source)
- Detector Generator (Anomaly detection)
- Resilience Early-Warning (Predictive)
- OS Core (Aggregation)

**Flow**:
```
System → Metrics Core → Detector Generator → Resilience Early-Warning → Guardrails
```

---

### Pattern 4: Cryptoeconomic Security

**Description**: Staking, performance monitoring, and slashing

**Components**:
- DIN Infrastructure Core
- Star Bridge Lungs (Performance data)
- Control Core (Kill-switches)
- Agent Wallet Manager (Wallets)

**Flow**:
```
Node Operator → Staking → Performance Monitoring → Slashing (if needed) → Control Core
```

---

### Pattern 5: Intent Processing

**Description**: High-level goals processed through solvers

**Components**:
- Intent Router Core
- Star Bridge Lungs (Chain metrics)
- Chain Abstraction (Unified API)
- Base Mini-Apps (User interface)

**Flow**:
```
User → Intent → Intent Router → Solver Matching → MEV Protection → Execution → Chain Abstraction
```

---

### Pattern 6: Chain Abstraction

**Description**: Unified API across all chains

**Components**:
- Chain Abstraction Core
- Star Bridge Lungs (Chain health)
- Intent Router (Routing decisions)
- Base Mini-Apps (User interface)

**Flow**:
```
User Request → Chain Abstraction → Select Optimal Chain → Execute → Return Result
```

---

### Pattern 7: Safe Startup

**Description**: Dependency-ordered initialization

**Components**:
- Startup Sequence Core
- Health Core (Health checks)
- All systems (Initialization)

**Flow**:
```
Load DAG → Validate → Topological Sort → Initialize → Health Gates → Traffic Grader → Ready
```

---

### Pattern 8: Incident Response

**Description**: Automated incident detection and response

**Components**:
- Incident Runbook Core
- Incident Core (Tracking)
- Control Core (Hotkeys)
- OS Core (Golden signals)

**Flow**:
```
Golden Signals → Classification → Hotkeys → Pre-Baked Commands → Recovery → Resolution
```

---

### Pattern 9: Agent Orchestration

**Description**: IAM-based agent execution with memory

**Components**:
- Vertex Agent Integration
- Citadel (Orchestration)
- Drone Dome (Scanning)
- Latent Collaboration (Memory)

**Flow**:
```
Request → Agent Factory → IAM Identity → Memory Bank → Execute → Observability → Result
```

---

### Pattern 10: Registry Proofs

**Description**: On-chain compliance and attestations

**Components**:
- Registry Proofs Core
- Identity Grid (Identity mapping)
- Dream State (Passport tiers)
- Base Mini-Apps (Access control)

**Flow**:
```
User → KYC/KYB → Attester → On-Chain Registry → Proof Verification → Access Granted
```

---

## Component Integration Matrix

| Component | Integrates With | Integration Type | Purpose |
|-----------|---------------|------------------|---------|
| **Nervous System Core** | All systems | Message Bus | Central communication |
| **Detector Generator** | Metrics Core, OS Core | Metrics pipeline | Anomaly detection |
| **Resilience Early-Warning** | Metrics Core, Autoscale | Guardrails | Predictive failure |
| **DIN Infrastructure** | Star Bridge, Control Core | Performance data | Cryptoeconomic security |
| **Registry Proofs** | Identity Grid, Dream State | Identity mapping | Compliance |
| **Intent Router** | Star Bridge, Chain Abstraction | Chain metrics | Intent processing |
| **Chain Abstraction** | Star Bridge, Intent Router | Unified API | Chain operations |
| **Startup Sequence** | Health Core, All systems | Initialization | Safe startup |
| **Incident Runbook** | Incident Core, Control Core | Hotkeys | Incident response |
| **Vertex Agents** | Citadel, Drone Dome | Agent execution | Production agents |

---

## Data Flow Diagrams

### Event Flow
```
External Event → Spider Web → Message Bus → Topic Routing → Handler → Response
```

### State Flow
```
Component State → Shared Memory → Neural Mesh → Pattern Learning → Optimization
```

### Metrics Flow
```
System Metrics → Metrics Core → Detector Generator → Resilience Early-Warning → Alerts
```

### Intent Flow
```
User Intent → Intent Router → Solver Matching → MEV Protection → Execution → Result
```

### Chain Flow
```
User Request → Chain Abstraction → Chain Selection → Star Bridge → Execution → Result
```

---

## Integration Points by System

### Nervous System Core
- **Publishes**: All topics
- **Subscribes**: All topics
- **Shared Memory**: All systems access
- **Integration**: Central hub for all communication

### Detector Generator
- **Consumes**: Metrics Core
- **Produces**: Detector alerts
- **Integrates**: OS Core, Resilience Early-Warning

### Resilience Early-Warning
- **Consumes**: Metrics Core, Detector Generator
- **Produces**: Resilience Index, Guardrail triggers
- **Integrates**: Autoscale Core, Control Core

### DIN Infrastructure
- **Consumes**: Star Bridge Lungs (performance)
- **Produces**: Staking/slashing events
- **Integrates**: Control Core, Agent Wallet Manager

### Registry Proofs
- **Consumes**: Identity Grid, KYC/KYB providers
- **Produces**: On-chain attestations
- **Integrates**: Dream State, Base Mini-Apps

### Intent Router
- **Consumes**: Star Bridge Lungs (chain metrics)
- **Produces**: Intent executions
- **Integrates**: Chain Abstraction, Base Mini-Apps

### Chain Abstraction
- **Consumes**: Star Bridge Lungs (chain health)
- **Produces**: Unified chain operations
- **Integrates**: Intent Router, Base Mini-Apps

### Startup Sequence
- **Consumes**: Health Core (health checks)
- **Produces**: Initialization order
- **Integrates**: All systems (startup)

### Incident Runbook
- **Consumes**: Incident Core, OS Core (golden signals)
- **Produces**: Hotkey commands, recovery actions
- **Integrates**: Control Core, Incident Core

### Vertex Agents
- **Consumes**: Citadel, Drone Dome (tasks)
- **Produces**: Agent executions, memories
- **Integrates**: Latent Collaboration, Nervous System

---

## API Integration Points

### REST APIs
- `/api/health` - Health checks
- `/api/metrics` - Metrics collection
- `/api/incidents` - Incident management
- `/api/agents` - Agent operations
- `/api/intents` - Intent submission

### Message Bus APIs
- `publish(topic, message)` - Publish message
- `subscribe(topic, handler)` - Subscribe to topic
- `getSharedMemory()` - Access shared memory

### Shared Memory APIs
- `kv.get(key)` - Get value
- `kv.put(key, value)` - Store value
- `doc.read(id)` - Read document
- `vec.search(embedding, k)` - Vector search

---

## Error Handling & Recovery

### Error Propagation
```
Component Error → Message Bus (alert topic) → Incident Core → Runbook → Recovery
```

### Recovery Actions
- **Automatic**: Guardrails, circuit breakers
- **Semi-Automatic**: Pre-baked commands
- **Manual**: Hotkey commands, runbook procedures

---

## Security Integration

### Authentication
- Identity Grid → All systems
- IAM identities → Vertex Agents

### Authorization
- Control Core → Feature flags, kill-switches
- Registry Proofs → Access control

### Audit
- Dream Snail → All operations
- Incident Core → Incident tracking

---

**Status**: ✅ Complete Integration Map  
**Last Updated**: 2025-01-27
