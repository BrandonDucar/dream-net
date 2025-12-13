# DreamNet Architecture Diagrams

**Generated**: 2025-01-27  
**Status**: Architecture Documentation

---

## Purpose

This document provides visual architecture diagrams and descriptions for understanding DreamNet's system architecture.

---

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        DreamNet Organism                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Nervous    │  │   Circulatory│  │   Immune     │         │
│  │   System     │  │   System     │  │   System     │         │
│  │  (Message    │  │  (Tokens)    │  │  (Shield)    │         │
│  │   Bus)       │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Respiratory │  │  Skeletal    │  │  Cognitive   │         │
│  │  System      │  │  System      │  │  Layer       │         │
│  │ (Star Bridge)│  │  (Control)   │  │ (Neural Mesh)│         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Nervous System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Nervous System Core                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │  Message Bus │◄────►│ Shared Memory│◄────►│ Citadel  │ │
│  │ (Spinal Cord)│      │(Hippocampus) │      │(Prefrontal│ │
│  └──────────────┘      └──────────────┘      │  Cortex)  │ │
│         │                      │              └──────────┘ │
│         │                      │                           │
│         ▼                      ▼                           │
│  ┌──────────────┐      ┌──────────────┐                  │
│  │ Topic Router │      │ Vector Store │                  │
│  │              │      │ (Neural Mesh)│                  │
│  └──────────────┘      └──────────────┘                  │
│                                                             │
│  ┌──────────────┐                                          │
│  │ Drone Dome   │                                          │
│  │(Sensory      │                                          │
│  │ Cortex)      │                                          │
│  └──────────────┘                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Communication Flow

```
External Event
    │
    ▼
┌──────────────┐
│ Spider Web   │  (Event Classification)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Message Bus  │  (Topic Routing)
└──────┬───────┘
       │
       ├──► intel.snapshot ──► Drone Dome
       ├──► task.plan ───────► Citadel
       ├──► task.exec ───────► Workers
       ├──► alert ───────────► Incident Core
       ├──► telemetry ───────► Metrics Core
       └──► state.delta ─────► Shared Memory
```

---

## Dependency Hierarchy

```
Level 0: Foundation
├── Database (Neon/Postgres)
└── Queues (Kafka/PubSub)

Level 1: Core Infrastructure
├── Control Core
├── Identity Grid
└── Directory

Level 2: System Core
├── Nervous System Core
├── DreamNet OS Core
├── Citadel Core
└── Registry Proofs Core

Level 3: Detection & Resilience
├── Detector Generator Core
├── Resilience Early-Warning
├── DIN Infrastructure Core
└── Intent Router Core

Level 4: Cross-Chain & Abstraction
├── Chain Abstraction Core
├── Star Bridge Lungs
└── Slime-Mold Router

Level 5: Orchestration
├── Orchestrator Core
├── Agent Registry Core
└── Super Spine

Level 6: Application Layer
├── APIs (DreamHub, Agent Gateway)
└── Frontends (Mini-Apps)
```

---

## Agent Orchestration Flow

```
User Request
    │
    ▼
┌──────────────┐
│ Agent Gateway│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Super Spine  │  (Agent Registry)
└──────┬───────┘
       │
       ├──► Citadel ──► Planning
       ├──► Drone Dome ──► Scanning
       ├──► Wolf Pack ──► Funding
       ├──► Whale Pack ──► Commerce
       └──► Orca Pack ──► Communications
```

---

## Intent Processing Flow

```
User Intent
    │
    ▼
┌──────────────┐
│ Intent Router│  (Parse & Validate)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Solver Match │  (Find Optimal Solvers)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ MEV Protect  │  (Detect & Mitigate)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Chain Select │  (Select Optimal Chain)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Execute      │  (Execute Intent)
└──────┬───────┘
       │
       ▼
   Result
```

---

## Health Monitoring Chain

```
System Metrics
    │
    ▼
┌──────────────┐
│ Metrics Core │  (Collection)
└──────┬───────┘
       │
       ├──► Detector Generator ──► Anomaly Detection
       │
       └──► Resilience Early-Warning ──► Predictive Failure
                │
                ├──► Autoscale ──► Scale Up/Down
                ├──► Rate Limit ──► Throttle Traffic
                └──► Brownout ──► Reduce Functionality
```

---

## Cryptoeconomic Security Flow

```
Node Operator
    │
    ▼
┌──────────────┐
│   Staking    │  (Stake ETH/stETH)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Performance  │  (Monitor Metrics)
│  Monitoring  │
└──────┬───────┘
       │
       ├──► Success Rate > 99% ──► Continue
       ├──► Latency < 250ms ─────► Continue
       └──► Failure ────────────► Slashing
```

---

## Safe Startup Sequence

```
Server Start
    │
    ▼
┌──────────────┐
│ Load DAG     │  (Dependency Graph)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Validate     │  (No Cycles)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Topological  │  (Init Order)
│    Sort      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Initialize   │  (Dependency Order)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Health Gates │  (Liveness + Readiness)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Traffic      │  (1% → 10% → 50% → 100%)
│   Grader     │
└──────┬───────┘
       │
       ▼
    Ready
```

---

## Incident Response Flow

```
Golden Signals
    │
    ▼
┌──────────────┐
│ Classify     │  (P0/P1/P2)
└──────┬───────┘
       │
       ├──► P0 ──► SAFE_MODE + WRITE_DRAIN
       ├──► P1 ──► Feature Flags + Rate Limit
       └──► P2 ──► Monitor + Alert
       │
       ▼
┌──────────────┐
│ Pre-Baked    │  (Rollback, Rotate Keys, etc.)
│  Commands    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Recovery     │  (Monitor & Resolve)
└──────┬───────┘
       │
       ▼
    Resolved
```

---

## Data Flow Patterns

### Event Flow
```
Event → Spider Web → Message Bus → Topic → Handler → Response
```

### State Flow
```
State → Shared Memory → Neural Mesh → Pattern Learning → Optimization
```

### Metrics Flow
```
Metrics → Metrics Core → Detector → Resilience → Guardrails
```

### Intent Flow
```
Intent → Router → Solver → MEV Protect → Execute → Result
```

---

## Component Interaction Matrix

```
                NS  SB  DG  RE  DI  RP  IR  CA  SS  IR  VA
Nervous System   •   •   •   •   •   •   •   •   •   •   •
Star Bridge      •   •       •   •       •   •           •
Detector Gen     •           •                           •
Resilience EW    •   •   •   •                           •
DIN Infra        •   •               •                   •
Registry Proofs  •                   •   •               •
Intent Router    •   •                       •   •       •
Chain Abstract   •   •                       •   •       •
Startup Seq      •                                       •
Incident RB      •                   •                   •
Vertex Agents    •                                       •   •
```

Legend:
- NS = Nervous System
- SB = Star Bridge
- DG = Detector Generator
- RE = Resilience Early-Warning
- DI = DIN Infrastructure
- RP = Registry Proofs
- IR = Intent Router
- CA = Chain Abstraction
- SS = Startup Sequence
- IR = Incident Runbook
- VA = Vertex Agents

---

**Status**: ✅ Architecture Diagrams Complete  
**Last Updated**: 2025-01-27

