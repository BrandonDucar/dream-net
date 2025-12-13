# DreamNet Core Packages - Complete Documentation

**Status**: ✅ In Progress  
**Last Updated**: 2025-01-27  
**Total Core Packages**: 20+ fundamental packages

---

## Overview

Core packages are the **foundational infrastructure** that powers DreamNet's operation. These packages provide the essential systems for orchestration, control, neural networking, event routing, and security.

---

## Core Infrastructure Packages

### 1. `@dreamnet/dreamnet-os-core` - DreamNet OS Core

**WHAT**: Global status and heartbeat layer - the "operating system" of DreamNet

**WHERE**: `packages/dreamnet-os-core/index.ts`, initialized in `server/index.ts` lines 663-691

**HOW**:
```typescript
import { DreamNetOSCore } from "@dreamnet/dreamnet-os-core";

// Run OS cycle (heartbeat)
const status = DreamNetOSCore.run({
  subsystems: { /* all subsystems */ },
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const osStatus = DreamNetOSCore.status();

// Get snapshot
const snapshot = DreamNetOSCore.getSnapshot();

// Alert system
const activeAlerts = DreamNetOSCore.getActiveAlerts();
const recentAlerts = DreamNetOSCore.getRecentAlerts(limit);

// Recovery system
const recoveryActions = DreamNetOSCore.generateRecoveryActions();

// Auto-integration system
const gaps = DreamNetOSCore.detectIntegrationGaps();
DreamNetOSCore.autoFixIntegrationGaps();
```

**Key Functions**:
- `run(context)` - Runs OS cycle, aggregates subsystem health
- `status()` - Returns current OS status
- `getSnapshot()` - Returns full system snapshot
- `getActiveAlerts()` - Returns active alerts
- `getRecentAlerts(limit)` - Returns recent alerts
- `generateRecoveryActions()` - Generates recovery actions
- `detectIntegrationGaps()` - Detects missing integrations
- `autoFixIntegrationGaps()` - Auto-fixes integration gaps

**Features**:
- Global health aggregation
- Alert system (active/recent alerts)
- Auto-recovery actions
- Integration gap detection
- System snapshot generation
- Health history tracking
- Trend detection

**WHY**: Provides centralized monitoring and management of all DreamNet subsystems, acting as the "heartbeat" of the system.

**Status**: ✅ Active (integrated in server initialization)

---

### 2. `@dreamnet/dreamnet-control-core` - Control Core

**WHAT**: Global kill-switch, rate limiting, tier-based access control, and cluster management

**WHERE**: `packages/dreamnet-control-core/index.ts`, used in `server/middleware/controlCoreMiddleware.ts`

**HOW**:
```typescript
import { DreamNetControlCore } from "@dreamnet/dreamnet-control-core";

// Kill-switch controls
DreamNetControlCore.enableGlobalKillSwitch("Emergency maintenance", "admin");
DreamNetControlCore.disableGlobalKillSwitch("Maintenance complete");
const isEnabled = DreamNetControlCore.isGlobalKillSwitchEnabled();

// Cluster management
DreamNetControlCore.enableCluster("wolf-pack", "Testing");
DreamNetControlCore.disableCluster("wolf-pack", "Rate limit exceeded", "system");
const isClusterEnabled = DreamNetControlCore.isClusterEnabled("wolf-pack");

// Rate limiting
DreamNetControlCore.setRateLimit({
  clusterId: "wolf-pack",
  requestsPerMinute: 100,
  burstSize: 10,
});
const check = DreamNetControlCore.checkRateLimit("wolf-pack");
DreamNetControlCore.recordRequest("wolf-pack");

// Circuit breakers
DreamNetControlCore.tripCircuitBreaker("wolf-pack", 60000); // Auto-reset after 60s
DreamNetControlCore.resetCircuitBreaker("wolf-pack");
const isTripped = DreamNetControlCore.isCircuitBreakerTripped("wolf-pack");

// Operation check (combines all checks)
const result = DreamNetControlCore.checkOperation({
  clusterId: "wolf-pack",
  traceId: "trace-123",
  callerTierId: "free",
  callerTier: { /* tier config */ },
});
if (!result.allowed) {
  console.log("Blocked:", result.reason);
}
```

**Key Functions**:
- `enableGlobalKillSwitch(reason?, disabledBy?)` - Enable global kill-switch
- `disableGlobalKillSwitch(reason?)` - Disable global kill-switch
- `enableCluster(clusterId, reason?)` - Enable cluster
- `disableCluster(clusterId, reason?, disabledBy?)` - Disable cluster
- `setRateLimit(limit)` - Set rate limit for cluster
- `checkRateLimit(clusterId)` - Check if request allowed
- `tripCircuitBreaker(clusterId, autoResetAfter?)` - Trip circuit breaker
- `checkOperation(context)` - Comprehensive operation check (kill-switch + rate limit + circuit breaker + tier)

**Features**:
- Global kill-switch (emergency shutdown)
- Per-cluster kill-switches
- Rate limiting (per-cluster, per-tier)
- Circuit breakers (auto-reset)
- Tier-based access control
- God Vault detection
- Identity resolution
- Policy engine
- Conduit system (dead letter queue)

**WHY**: Provides centralized control over all DreamNet operations, enabling emergency shutdowns, rate limiting, and access control.

**Status**: ✅ Active (used in middleware chain)

---

### 3. `@dreamnet/orchestrator-core` - Orchestrator Core

**WHAT**: Main agent orchestration system - runs cycles that coordinate all subsystems

**WHERE**: `packages/orchestrator-core/index.ts`, initialized in `server/index.ts` via RuntimeBridgeCore

**HOW**:
```typescript
import { OrchestratorCore } from "@dreamnet/orchestrator-core";

// Run single cycle
const telemetry = await OrchestratorCore.runSingleCycle({
  DreamVault: DreamVault,
  DreamShop: DreamShop,
  FieldLayer: FieldLayer,
  NeuralMesh: NeuralMesh,
  LatentCollaboration: LatentCollaboration,
  // ... all subsystems
});

// Get status
const status = OrchestratorCore.getStatus();

// Start interval loop
const interval = OrchestratorCore.startIntervalLoop(context, 5000); // Every 5s
// Later: clearInterval(interval);
```

**Key Functions**:
- `runSingleCycle(context)` - Runs one orchestration cycle
- `getStatus()` - Returns orchestrator status
- `startIntervalLoop(context, intervalMs)` - Starts continuous cycle loop

**Cycle Execution Order** (from `runCycle.ts`):
1. Citadel Core (strategic planning)
2. Latent Collaboration (agent reasoning sharing)
3. Dream Cortex (intent/goals)
4. Neural Mesh (synaptic connections)
5. Quantum Anticipation (predictions)
6. Squad Alchemy (squad optimization)
7. Wolf Pack (anomaly hunting)
8. Octopus Executor (parallel tasks)
9. Slug-Time Memory (trend tracking)
10. Star Bridge Lungs (cross-chain monitoring)
11. Predator-Scavenger Loop (cleanup)
12. All other subsystems

**WHY**: Coordinates all DreamNet subsystems in a unified cycle, ensuring subsystems run in the correct order and share context.

**Status**: ✅ Active (runs continuously via RuntimeBridgeCore)

---

### 4. `@dreamnet/runtime-bridge-core` - Runtime Bridge Core

**WHAT**: Runtime context manager - bridges orchestrator cycles with server runtime

**WHERE**: `packages/runtime-bridge-core/index.ts`, initialized in `server/index.ts` lines 2370-2499

**HOW**:
```typescript
import { RuntimeBridgeCore } from "@dreamnet/runtime-bridge-core";

// Initialize context
RuntimeBridgeCore.initContext({
  DreamVault: DreamVault,
  DreamShop: DreamShop,
  NeuralMesh: NeuralMesh,
  // ... all subsystems
});

// Run single cycle
await RuntimeBridgeCore.runOnce();

// Start continuous loop
RuntimeBridgeCore.startLoop(5000); // Every 5s

// Stop loop
RuntimeBridgeCore.stopLoop();

// Get status
const status = RuntimeBridgeCore.getStatus();
```

**Key Functions**:
- `initContext(ctx)` - Initialize runtime context
- `runOnce()` - Run single cycle
- `startLoop(intervalMs?)` - Start continuous loop
- `stopLoop()` - Stop loop
- `getStatus()` - Get runtime status

**WHY**: Provides the bridge between the Express server runtime and the orchestrator cycles, managing context and lifecycle.

**Status**: ✅ Active (initialized in server startup)

---

### 5. `@dreamnet/neural-mesh` - Neural Mesh

**WHAT**: Unified nervous system - synaptic connections and memory traces

**WHERE**: `packages/neural-mesh/index.ts`, initialized in `server/index.ts` lines 537-544

**HOW**:
```typescript
import { NeuralMesh } from "@dreamnet/neural-mesh";

// Link subsystems via synapses
const synapses = NeuralMesh.link({
  spiderWeb: SpiderWebCore,
  shieldCore: ShieldCore,
  neuralMesh: NeuralMesh,
});

// Pulse event through mesh
await NeuralMesh.pulse({
  type: "agent:task:completed",
  source: "wolf-pack",
  payload: { taskId: "task-123" },
});

// Store memory trace
NeuralMesh.remember({
  type: "pattern",
  data: { pattern: "successful_funding_outreach" },
  timestamp: Date.now(),
});

// Store latent representation (for agent collaboration)
const latentId = await NeuralMesh.storeLatent(
  "agent:wolf-pack",
  [0.1, 0.2, 0.3, ...], // latent vector
  "I should reach out to this fund",
  { sessionId: "session-123" }
);

// Retrieve similar latents
const similar = await NeuralMesh.retrieveLatent(
  [0.1, 0.2, 0.3, ...], // query vector
  10, // limit
  "agent:wolf-pack" // optional agent filter
);

// Get agent's latent history
const history = await NeuralMesh.getAgentLatentHistory("agent:wolf-pack", 50);

// Get status
const status = NeuralMesh.status();
```

**Key Functions**:
- `link(systems)` - Link subsystems via synapses
- `pulse(event)` - Pulse event through mesh
- `remember(trace)` - Store memory trace
- `storeLatent(agentId, latentRep, originalThought, metadata?)` - Store latent representation
- `retrieveLatent(query, limit?, agentId?)` - Retrieve similar latents
- `getAgentLatentHistory(agentId, limit?)` - Get agent's latent history
- `status()` - Get mesh status

**Features**:
- Synaptic connections between subsystems
- Event pulsing through mesh
- Memory trace storage
- Latent representation storage (for agent collaboration)
- Similarity search for latents
- Agent latent history

**WHY**: Provides the "nervous system" of DreamNet, connecting all subsystems and enabling agent collaboration via latent representations.

**Status**: ✅ Active (integrated with Latent Collaboration)

---

### 6. `@dreamnet/spider-web-core` - Spider Web Core

**WHAT**: Nervous system event routing - routes events through "threads" (signal pathways)

**WHERE**: `packages/spider-web-core/index.ts`, initialized in `server/index.ts` lines 1251-1280

**HOW**:
```typescript
import { SpiderWebCore } from "@dreamnet/spider-web-core";

// Run spider web cycle
const status = await SpiderWebCore.run({
  neuralMesh: NeuralMesh,
  shieldCore: ShieldCore,
});

// Create a fly (external event)
const fly = SpiderWebCore.createFly(
  "webhook", // type
  "github", // source
  { event: "push", repo: "dreamnet" }, // payload
  "high", // priority
  false // sticky
);

// Catch fly (convert to thread)
const thread = SpiderWebCore.catchFly(fly);

// Execute thread
const result = await SpiderWebCore.executeThread(thread.id, context);

// List threads
const threads = SpiderWebCore.listThreads();
const activeThreads = SpiderWebCore.listThreadsByStatus("active");
const highPriorityThreads = SpiderWebCore.listThreadsByPriority("high");

// Sensors (Funnel Web spiders that catch flies)
const sensors = SpiderWebCore.listSensors();
const activeSensors = SpiderWebCore.listActiveSensors();
SpiderWebCore.ensureDefaultSensors();

// Templates (thread templates for pattern matching)
const templates = SpiderWebCore.listTemplates();
const matchingTemplate = SpiderWebCore.findMatchingTemplate(thread);
const templatedThread = SpiderWebCore.applyTemplateToThread(thread, template);

// Patterns (learned patterns)
const threadPatterns = SpiderWebCore.listThreadPatterns();
const flyPatterns = SpiderWebCore.listFlyPatterns();

// Insights
const insights = SpiderWebCore.listInsights();
const recentInsights = SpiderWebCore.listRecentInsights(20);
```

**Key Concepts**:
- **Flies**: External events (webhooks, messages, signals)
- **Threads**: Signal pathways that route events to targets
- **Sensors**: Funnel Web spiders that catch flies
- **Orb Weaver**: Routes and executes threads
- **Templates**: Thread templates for pattern matching
- **Patterns**: Learned patterns from successful threads

**Key Functions**:
- `run(context)` - Run spider web cycle
- `createFly(type, source, payload, priority?, sticky?)` - Create fly
- `catchFly(fly)` - Convert fly to thread
- `executeThread(threadId, context)` - Execute thread
- `listThreads()` - List all threads
- `listThreadsByStatus(status)` - List threads by status
- `listSensors()` - List sensors
- `listTemplates()` - List templates
- `findMatchingTemplate(thread)` - Find matching template
- `listInsights()` - List insights

**WHY**: Provides the event routing "nervous system" of DreamNet, converting external events into internal signal pathways.

**Status**: ✅ Active (integrated with Shield Core and operational bridge)

---

### 7. `@dreamnet/shield-core` - Shield Core

**WHAT**: Immune system / defense organ - multi-phase shield system with threat detection

**WHERE**: `packages/shield-core/index.ts`, initialized in `server/index.ts` lines 1037-1090

**HOW**:
```typescript
import { ShieldCore } from "@dreamnet/shield-core";

// Run shield cycle
const status = ShieldCore.run({
  spiderWebCore: SpiderWebCore,
  neuralMesh: NeuralMesh,
  dreamNetOSCore: DreamNetOSCore,
});

// Ensure shield phases exist
const layers = ShieldCore.ensureShieldPhases();

// Rotate frequencies
ShieldCore.rotateFrequencies();

// Detect threat
const threat = ShieldCore.detectThreat(
  "rate_limit_exceeded", // type
  "high", // level
  "192.168.1.1", // source
  "/api/wolf-pack", // target
  { requests: 1000 } // payload
);

// Analyze threat
const analysis = ShieldCore.analyzeThreat(threat);

// Fire spike at threat
const spike = ShieldCore.fireSpikeAtThreat(threat);

// Fire custom spike
const customSpike = ShieldCore.fireSpike(
  "rate_limit_spike",
  "rate_limit",
  "192.168.1.1",
  100, // power
  { duration: 60000 } // meta
);

// Cellular shields
const cellularShield = ShieldCore.createCellularShield(
  "cell-123",
  "api_endpoint",
  "wormhole-456"
);

const shields = ShieldCore.listCellularShields();
ShieldCore.updateCellularShieldIntegrity("cell-123", 0.95);

// Propagate shield via wormhole
const signal = ShieldCore.propagateShieldViaWormhole(
  "integrity_update",
  "cellular",
  { cellId: "cell-123", integrity: 0.95 },
  ["cell-456", "cell-789"] // target cells
);

// Cross-chain shields
ShieldCore.initializeCrossChainShield("base", "8453");
ShieldCore.syncCrossChainShields();
const crossChainThreat = ShieldCore.detectCrossChainThreat(
  "base",
  "suspicious_transaction",
  "high",
  "0x123..."
);

// AI threat detection
const aiThreat = await ShieldCore.aiThreatDetector.detect({
  source: "192.168.1.1",
  pattern: "unusual_behavior",
});

// Advanced spikes
const advancedSpike = ShieldCore.fireAdvancedSpikeAtThreat(threat);
const bestSpike = ShieldCore.getBestSpikeType(threat);

// Zero trust verification
const verified = await ShieldCore.zeroTrustVerifier.verify({
  identity: "agent:wolf-pack",
  action: "api_call",
  context: { ip: "192.168.1.1" },
});

// Threat prediction
const prediction = ShieldCore.threatPredictor.predict({
  source: "192.168.1.1",
  pattern: "increasing_requests",
});
```

**Key Concepts**:
- **Shield Phases**: Multi-phase shield system (cellular, cross-chain)
- **Modulators**: Shield modulators that adjust shield properties
- **Emitters**: Shield emitters that target specific threat types
- **Threats**: Detected threats (rate limit, suspicious activity, etc.)
- **Spikes**: Offensive responses to threats
- **Cellular Shields**: Per-endpoint shields propagated via wormholes
- **Cross-Chain Shields**: Blockchain-specific shields

**Key Functions**:
- `run(context)` - Run shield cycle
- `ensureShieldPhases()` - Ensure shield phases exist
- `rotateFrequencies()` - Rotate shield frequencies
- `detectThreat(type, level, source?, target?, payload?)` - Detect threat
- `analyzeThreat(threat)` - Analyze threat
- `fireSpikeAtThreat(threat, spikeType?)` - Fire spike at threat
- `createCellularShield(cellId, cellType, wormholeId?)` - Create cellular shield
- `propagateShieldViaWormhole(signalType, sourcePhase, payload, targetCells?)` - Propagate shield
- `initializeCrossChainShield(blockchain, chainId)` - Initialize cross-chain shield
- `aiThreatDetector` - AI threat detection
- `fireAdvancedSpikeAtThreat(threat)` - Fire advanced spike
- `zeroTrustVerifier` - Zero trust verification
- `threatPredictor` - Threat prediction

**WHY**: Provides the "immune system" of DreamNet, detecting and responding to threats with multi-phase shields and offensive spikes.

**Status**: ✅ Active (runs continuously, integrated with Spider Web Core)

---

## Summary

These 7 core packages form the **foundational infrastructure** of DreamNet:

1. **DreamNet OS Core** - Global status and heartbeat
2. **Control Core** - Kill-switches, rate limiting, access control
3. **Orchestrator Core** - Agent orchestration cycles
4. **Runtime Bridge Core** - Runtime context management
5. **Neural Mesh** - Synaptic connections and memory
6. **Spider Web Core** - Event routing nervous system
7. **Shield Core** - Immune system and defense

---

## Biomimetic System Packages

### 8. `@dreamnet/dream-cortex` - Dream Cortex

**WHAT**: Global intent and goal engine - tracks dreams (goals) and generates directives

**WHERE**: `packages/dream-cortex/index.ts`, initialized in `server/index.ts` lines 641-648`

**HOW**:
```typescript
import { DreamCortex } from "@dreamnet/dream-cortex";

// Upsert dream (goal)
const dream = DreamCortex.upsertDream({
  id: "dream-123",
  name: "Improve API reliability",
  description: "Reduce error rate to <1%",
  status: "active",
  priority: "high",
  dependencies: ["dream-456"], // Other dreams this depends on
});

// Set dream status
DreamCortex.setDreamStatus("dream-123", "completed");

// Set dream priority
DreamCortex.setDreamPriority("dream-123", "critical");

// List all dreams
const dreams = DreamCortex.listDreams();

// Run cortex cycle (generates directives)
const status = DreamCortex.run({
  neuralMesh: NeuralMesh,
  quantumAnticipation: QuantumAnticipation,
  slugTimeMemory: SlugTimeMemory,
  wolfPack: WolfPack,
  starBridgeLungs: StarBridgeLungs,
});

// Get status
const cortexStatus = DreamCortex.status();
```

**Key Functions**:
- `upsertDream(dream)` - Create or update dream
- `setDreamStatus(id, status)` - Set dream status
- `setDreamPriority(id, priority)` - Set dream priority
- `listDreams()` - List all dreams
- `run(context)` - Run cortex cycle, generate directives
- `status()` - Get cortex status

**Features**:
- Dream registry (goal tracking)
- Goal graph (dependency tracking)
- Intent synthesis (priority + indirect goals)
- Directive generation (actionable directives)
- Confidence scoring (directive confidence 0-1)

**WHY**: Provides the "cognitive layer" of DreamNet, tracking goals and generating directives for agents/squads.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 9. `@dreamnet/quantum-anticipation` - Quantum Anticipation Layer (QAL)

**WHAT**: Predictive analysis layer - anticipates workload spikes, failures, bottlenecks

**WHERE**: `packages/quantum-anticipation/index.ts`, initialized in `server/index.ts` lines 546-552

**HOW**:
```typescript
import { QuantumAnticipation } from "@dreamnet/quantum-anticipation";

// Run QAL cycle (generates predictions)
const predictions = QuantumAnticipation.run({
  neuralMesh: NeuralMesh,
  haloLoop: HaloLoop,
  pheromoneStore: PheromoneStore,
  slimeRouter: SlimeRouter,
});

// Get status
const qalStatus = QuantumAnticipation.status();
```

**Key Functions**:
- `run(context)` - Run QAL cycle, generate predictions
- `status()` - Get QAL status

**Prediction Types**:
- Workload spikes (traffic/load increases)
- Failure risks (potential system failures)
- Routing bottlenecks (network congestion)
- PR hotspots (review/merge activity bursts)

**Features**:
- Predictive signals
- NeuralMesh integration (stores predictions as memory traces)
- Pheromone pre-laying (pre-lays trails for anticipated workload)
- Slime router adjustments (adjusts topology for predicted bottlenecks)
- Halo-Loop alerts (receives failure risk alerts)

**WHY**: Provides predictive capabilities, allowing DreamNet to anticipate and prepare for future events.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 10. `@dreamnet/squad-alchemy` - Squad Alchemy Engine

**WHAT**: Dynamic squad management - optimizes agent squads for tasks

**WHERE**: `packages/squad-alchemy/index.ts`, initialized in `server/index.ts` lines 554-560

**HOW**:
```typescript
import { SquadAlchemy } from "@dreamnet/squad-alchemy";

// Register squad
const squad = SquadAlchemy.registerSquad({
  id: "squad-123",
  name: "Funding Squad",
  members: [
    { agentId: "wolf-pack", role: "h: "lead" },
    { agentId: "analyst", role: "lead" },
  { agentId: "wolf-pack-mailer" },
  ],
  capabilities: ["funding", "outreach", "outreach"],
  status: "active",
});

// Get squad
const squad = SquadAlchemy.getSquad("squad-123");

// List squads
const squads = SquadAlchemy.listSquads();

// Run squad alchemy cycle (optimizes squads)
const decisions = SquadAlchemy.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
  },
});

// Get status
const status = SquadAlchemy.status();
```

**Key Functions**:
- `registerSquad(squad)` - Register squad
- `getSquad(id)` - Get squad
- `listSquads()` - List all squads
- `run(context)` - Run squad alchemy cycle
- `status()` - Get status

**Features**:
- Squad registry
- Squad optimization
- Dynamic squad formation
- Capability matching
- Squad Builder bridge

**WHY**: Optimizes agent squads for tasks, ensuring the right agents work together.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 11. `@dreamnet/wolf-pack` - Wolf Pack Protocol (WPP)

**WHAT**: Anomaly hunting system - detects anomalies and generates signals

**WHERE**: `packages/wolf-pack/index.ts`, initialized in `server/index.ts` lines 562-568

**HOW**:
```typescript
import { WolfPack } from "@dreamnet/wolf-pack";

// Run wolf pack cycle (hunt anomalies)
const result = WolfPack.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
  slugTimeMemory: SlugTimeMemory,
});

// Get signals and strikes
const { signals, strikes } = result;

// List targets
const targets = WolfPack.listTargets();

// Clear target
WolfPack.clearTarget("target-123");

// Clear all targets
WolfPack.clearAllTargets();

// Get status
const status = WolfPack.status();
```

**Key Functions**:
- `run(context)` - Run wolf pack cycle, hunt anomalies
- `listTargets()` - List active targets
- `clearTarget(targetId)` - Clear target
- `clearAllTargets()` - Clear all targets
- `status()` - Get wolf pack status

**Features**:
- Anomaly detection
- Signal generation
- Strike generation (offensive actions)
- Target tracking
- Pattern learning

**WHY**: Provides anomaly hunting capabilities, detecting unusual patterns and generating signals for other systems.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 12. `@dreamnet/octopus-executor` - Octopus Executor

**WHAT**: 8-arm parallel runtime - executes tasks in parallel across 8 "arms" (tentacles)

**WHERE**: `packages/octopus-executor/index.ts`, initialized in `server/index.ts` lines 571-585

**HOW**:
```typescript
import { OctopusExecutor } from "@dreamnet/octopus-executor";

// Initialize
await OctopusExecutor.init();

// Enqueue task
OctopusExecutor.enqueue({
  id: "task-123",
  type: "github",
  action: "create_pr",
  payload: { repo: "dreamnet", branch: "feature-x" },
  priority: "high",
});

// Run octopus scheduler
await OctopusExecutor.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const status = OctopusExecutor.status();
```

**Key Functions**:
- `init()` - Initialize octopus executor
- `enqueue(task)` - Enqueue task
- `run(context)` - Run octopus scheduler
- `status()` - Get octopus status

**8 Arms (Tentacles)**:
1. GitHub (PRs, issues, deployments)
2. Vercel (deployments, domains)
3. Replit (containers, databases)
4. Stripe (payments, subscriptions)
5. Google (APIs, services)
6. Railway (deployments, databases)
7. Base (blockchain, contracts)
8. Neon (databases, queries)

**Features**:
- Parallel task execution
- Task queuing
- Priority-based scheduling
- Arm-specific task routing
- Task status tracking

**WHY**: Provides parallel task execution across 8 integration points, maximizing throughput.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 13. `@dreamnet/slug-time-memory` - Slug-Time Memory Layer (STM)

**WHAT**: Low-frequency, long-horizon trend tracking - "slow memory" for long-term patterns

**WHERE**: `packages/slug-time-memory/index.ts`, initialized in `server/index.ts` lines 593-599

**HOW**:
```typescript
import { SlugTimeMemory } from "@dreamnet/slug-time-memory";

// Configure
SlugTimeMemory.configure({
  sampleInterval: 60000, // Sample every 5 minutes
});

// Add sample
SlugTimeMemory.addSample({
  kind: "api_latency",
  value: 150, // ms
  timestamp: Date.now(),
});

// Run slug time cycle
const status = SlugTimeMemory.run({
  neuralMesh: NeuralMesh,
});

// Get status
const status = SlugTimeMemory.status();
```

**Key Functions**:
- `configure(config)` - Configure slug time memory
- `addSample(sample)` - Add metric
- `run(context)` - Run slug-time cycle
- `status()` - Get status

**Features**:
- Low-frequency sampling
- Long-horizon pattern tracking
- Metric aggregation
- Snapshot generation

**WHY**: Provides long-term trend tracking, providing long-term patterns to be detected over time.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 14. `@dreamnet/star-bridge-lungs` - Star Bridge Lungs

**WHAT**: Cross-chain monitoring - monitors chain health and routing preferences

**WHERE**: `packages/star-bridge-lungs/index.ts`, initialized in `server/index.ts` lines 601-611

**HOW**:
```typescript
import { StarBridgeLungs } from "@dreamnet/star-bridge-lungs";

// Run star bridge cycle (breath cycle)
const status = StarBridgeLungs.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const bridgeStatus = StarBridgeLungs.status();
```

**Key Functions**:
- `run(context)` - Run breath cycle
- `status()` - Get bridge status

**Monitored Chains**:
- Base (8453)
- Ethereum (1)
- Solana (mainnet)
- Polygon (137)
- Arbitrum (42161)
- Avalanche (43114)
- Near (mainnet)
- Monad (testnet)

**Breath Cycle**: Runs every 2 minutes

**Features**:
- Chain health metrics (gas pressure, congestion, reliability)
- Routing preferences (inhale/exhale)
- Breath snapshots
- Cross-chain monitoring

**WHY**: Provides cross-chain monitoring, enabling DreamNet to "breathe" across multiple blockchains.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 15. `@dreamnet/predator-scavenger` - Predator-Scavenger Loop (PSL)

**WHAT**: Metabolic cleanup system - aggressive cleanup (predator) + gentle cleanup (scavenger)

**WHERE**: `packages/predator-scavenger/index.ts`, initialized in `server/index.ts` lines 620-625

**HOW**:
```typescript
import { PredatorScavengerLoop } from "@dreamnet/predator-scavenger";

// Run PSL cycle (cleanup)
const status = PredatorScavengerLoop.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const pslStatus = PredatorScavengerLoop.status();
```

**Key Functions**:
- `run(context)` - Run PSL cycle
- `status()` - Get PSL status

**Features**:
- Predator mode (aggressive cleanup)
- Scavenger mode (gentle cleanup)
- Decay detection
- Resource recycling

**WHY**: Provides metabolic cleanup, detecting decay and recycling resources.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 16. `@dreamnet/halo-loop` - Halo Loop

**WHAT**: Self-healing system - analyzer & repair coordinator

**WHERE**: `packages/halo-loop/index.ts`, integrated in `server/index.ts` via triggers

**HOW**:
```typescript
import { registerHaloLoop, haloTriggers } from "@dreamnet/halo-loop";

// Register halo loop
const registration = registerHaloLoop();

// Use triggers
haloTriggers.recordRequest();
haloTriggers.recordError();

// Record request
haloTriggers.recordRequest();

// Record error
haloTriggers.recordError();

// Notify deploy
haloTriggers.notifyDeploy({ version: "1.0.0" });
```

**Key Functions**:
- `registerHaloLoop(engine?)` - Register halo loop
- `haloTriggers.recordRequest()` - Record request
- `haloTriggers.recordError()` - Record error
- `haloTriggers.notifyDeploy(metadata?)` - Notify deploy

**Triggers**:
- Time trigger (periodic analysis)
- Request volume trigger (high volume detection)
- Error rate trigger (error spike detection)
- Deploy trigger (deployment detection)
- Event wormhole trigger (event-based triggers)

**Analyzers**:
- Agent health analyzer
- Squad efficiency analyzer
- Endpoint health analyzer
- Env consistency analyzer
- Repo integrity analyzer

**Strategies**:
- Revive agents
- Repair endpoints
- Sync env
- Optimize squads

**WHY**: Provides self-healing capabilities, analyzing system health and generating repair actions.

**Status**: ✅ Active (integrated via triggers in server)

---

### 17. `@dreamnet/dreamnet-snail-core` - Dream Snail Core

**WHAT**: Privacy layer - Know-All Win-All privacy trails with hash-chained provenance

**WHERE**: `packages/dreamnet-snail-core/index.ts`, initialized in `server/index.ts` lines 470-472

**HOW**:
```typescript
import { DreamSnailCore } from "@dreamnet/dreamnet-snail-core";

// Record trail
const trail = DreamSnailCore.recordTrail(
  "identity-123",
  "api_call",
  { endpoint: "/api/wolf-pack", method: "POST" },
  { source: "agent", privacyLevel: "internal" }
);

// Get identity trail
const trails = DreamSnailCore.getIdentityTrail("identity-123", false);

// Get privacy config
const config = DreamSnailCore.getPrivacyConfig("identity-123");

// Update privacy config
DreamSnailCore.updatePrivacyConfig("identity-123", {
  encryptionEnabled: true,
  zeroKnowledgeEnabled: false,
});

// Get insights
const insights = DreamSnailCore.getIdentityInsights("identity-123", "high");

// Verify trail integrity
const verification = DreamSnailCore.verifyTrailIntegrity("identity-123");

// Get analytics
const analytics = DreamSnailCore.getAnalytics("identity-123");

// Get status
const status = DreamSnailCore.status();
```

**Key Functions**:
- `recordTrail(identityId, eventType, eventData, metadata?)` - Record privacy trail
- `getIdentityTrail(identityId, includeEncrypted?)` - Get identity trail
- `getPrivacyConfig(identityId)` - Get privacy config
- `updatePrivacyConfig(identityId, updates)` - Update privacy config
- `getIdentityInsights(identityId, severity?)` - Get insights
- `verifyTrailIntegrity(identityId)` - Verify trail integrity
- `getAnalytics(identityId)` - Get analytics
- `status()` - Get snail status

**Features**:
- Hash-chained privacy trails
- Know-All Win-All mode (tracks everything, user controls privacy)
- Verifiable provenance
- Privacy config (encryption
- Zero-knowledge proofs
- Trail integrity verification
- Privacy analytics

**WHY**: Provides privacy layer with verifiable provenance, enabling "Know-All Win-All" privacy model.

**Status**: ⚠️ Placeholder (no-op implementation, needs full implementation)

---

## Summary

**Core Infrastructure Packages** (7):
1. DreamNet OS Core - Global status and heartbeat
2. Control Core - Kill-switches, rate limiting, access control
3. Orchestrator Core - Agent orchestration cycles
4. Runtime Bridge Core - Runtime context management
5. Neural Mesh - Synaptic connections and memory
6. Spider Web Core - Event routing nervous system
7. Shield Core - Immune system and defense

**Biomimetic System Packages** (10):
8. Dream Cortex - Global intent and goal engine
9. Quantum Anticipation - Predictive analysis layer
10. Squad Alchemy - Dynamic squad management
11. Wolf Pack - Anomaly hunting
12. Octopus Executor - 8-arm parallel runtime
13. Slug-Time Memory - Long-horizon trend tracking
14. Star Bridge Lungs - Cross-chain monitoring
15. Predator-Scavenger Loop - Metabolic cleanup
16. Halo Loop - Self-healing system
17. Dream Snail Core - Privacy layer

---

## Application Layer Packages

### 18. `@dreamnet/dream-vault` - Dream Vault

**WHAT**: Central repository for blueprints, rituals, and artifacts

**WHERE**: `packages/dream-vault/index.ts`, initialized in `server/index.ts` lines 724-730

**HOW**:
```typescript
import { DreamVault } from "@dreamnet/dream-vault";

// Upsert item
const item = DreamVault.upsertItem({
  id: "item-123",
  kind: "blueprint",
  name: "API Blueprint",
  content: { /* blueprint data */ },
  tags: ["api", "backend"],
});

// Get item
const item = DreamVault.getItem("item-123");

// List all items
const items = DreamVault.listAll();

// Search vault
const results = DreamVault.search({
  kind: "blueprint",
  tags: ["api"],
  query: "authentication",
});

// Run vault cycle
const status = DreamVault.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const vaultStatus = DreamVault.status();
```

**Key Functions**:
- `upsertItem(item)` - Create or update vault item
- `getItem(id)` - Get item by ID
- `listAll()` - List all items
- `search(query)` - Search vault
- `run(context)` - Run vault cycle
- `status()` - Get vault status

**Item Kinds**:
- Blueprints (system designs)
- Rituals (workflows)
- Artifacts (code, configs)
- Templates (reusable patterns)

**WHY**: Provides centralized storage for reusable blueprints, rituals, and artifacts.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 19. `@dreamnet/dream-shop` - Dream Shop

**WHAT**: Marketplace layer - offers, recommendations, and commerce

**WHERE**: `packages/dream-shop/index.ts`, initialized in `server/index.ts` lines 767-773

**HOW**:
```typescript
import { DreamShop } from "@dreamnet/dream-shop";

// Upsert offer
const offer = DreamShop.upsertOffer({
  id: "offer-123",
  category: "service",
  title: "API Development",
  description: "Custom API development",
  priceTag: {
    kind: "fixed",
    amount: 1000,
    currency: "DREAM",
  },
  state: "active",
});

// Get offer
const offer = DreamShop.getOffer("offer-123");

// List offers
const offers = DreamShop.listOffers();

// Get recommendations
const recommendations = DreamShop.recommend({
  identityId: "identity-123",
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Run shop cycle
const status = DreamShop.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const shopStatus = DreamShop.status();
```

**Key Functions**:
- `upsertOffer(offer)` - Create or update offer
- `getOffer(id)` - Get offer by ID
- `listOffers()` - List all offers
- `recommend(context)` - Get recommendations
- `run(context)` - Run shop cycle
- `status()` - Get shop status

**Offer Categories**:
- Service (development, consulting)
- Product (software, tools)
- Resource (compute, storage)
- Knowledge (courses, documentation)

**WHY**: Provides marketplace functionality, enabling commerce and resource exchange.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 20. `@dreamnet/field-layer` - Field Layer

**WHAT**: Global parameter fields - invisible physics layer for system-wide parameters

**WHERE**: `packages/field-layer/index.ts`, initialized in `server/index.ts` lines 774-778

**HOW**:
```typescript
import { FieldLayer } from "@dreamnet/field-layer";

// Configure field layer
FieldLayer.configure({
  sampleInterval: 5000, // Sample every 5 seconds
});

// Sample field at point
const sample = FieldLayer.sample("temperature", "point-123");

// Get all samples
const samples = FieldLayer.allSamples();

// Run field cycle
const status = FieldLayer.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const fieldStatus = FieldLayer.status();
```

**Key Functions**:
- `configure(config)` - Configure field layer
- `sample(field, point)` - Sample field at point
- `allSamples()` - Get all samples
- `run(context)` - Run field cycle
- `status()` - Get field status

**Field Types**:
- Temperature (system load)
- Pressure (resource pressure)
- Flow (traffic flow)
- Density (resource density)

**WHY**: Provides invisible physics layer for system-wide parameters, enabling subsystems to sample global state.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 21. `@dreamnet/dreambet-core` - DreamBet Core

**WHAT**: Games and fairness engine - gaming/betting with provably fair RNG

**WHERE**: `packages/dreambet-core/index.ts`, initialized in `server/index.ts` lines 821-827

**HOW**:
```typescript
import { DreamBetCore } from "@dreamnet/dreambet-core";

// Upsert game
const game = DreamBetCore.upsertGame({
  id: "game-123",
  type: "dice",
  state: "active",
  config: { sides: 6 },
});

// Get game
const game = DreamBetCore.getGame("game-123");

// List games
const games = DreamBetCore.listGames();

// Upsert round
const round = DreamBetCore.upsertRound({
  id: "round-123",
  gameId: "game-123",
  state: "completed",
  result: 5,
});

// List rounds for game
const rounds = DreamBetCore.listRoundsForGame("game-123");

// Generate RNG
const rng = DreamBetCore.generateRNG({
  seed: "seed-123",
  nonce: 1,
});

// Convert RNG to unit (0-1)
const unit = DreamBetCore.rngToUnit(rng.resultHex);

// Convert RNG to int (0-n)
const int = DreamBetCore.rngToInt(rng.resultHex, 6);

// Run dream bet cycle
const status = DreamBetCore.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const betStatus = DreamBetCore.status();
```

**Key Functions**:
- `upsertGame(game)` - Create or update game
- `getGame(id)` - Get game by ID
- `listGames()` - List all games
- `upsertRound(round)` - Create or update round
- `listRoundsForGame(gameId)` - List rounds for game
- `generateRNG(req)` - Generate provably fair RNG
- `rngToUnit(resultHex)` - Convert RNG to unit (0-1)
- `rngToInt(resultHex, n)` - Convert RNG to int (0-n)
- `run(context)` - Run dream bet cycle
- `status()` - Get bet status

**Game Types**:
- Dice (dice rolling)
- Coin (coin flipping)
- Lottery (random selection)
- Custom (custom games)

**WHY**: Provides gaming/betting functionality with provably fair RNG.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 22. `@dreamnet/zen-garden-core` - Zen Garden Core

**WHAT**: Ritual, activity, and reward engine - engagement and activity tracking

**WHERE**: `packages/zen-garden-core/index.ts`, initialized in `server/index.ts` lines 862-868

**HOW**:
```typescript
import { ZenGardenCore } from "@dreamnet/zen-garden-core";

// Upsert session
const session = ZenGardenCore.upsertSession({
  id: "session-123",
  identityId: "identity-123",
  state: "active",
  activityIds: ["activity-1", "activity-2"],
  startedAt: Date.now(),
});

// Get session
const session = ZenGardenCore.getSession("session-123");

// List sessions
const sessions = ZenGardenCore.listSessions();

// Upsert activity
const activity = ZenGardenCore.upsertActivity({
  id: "activity-123",
  sessionId: "session-123",
  kind: "api_call",
  metadata: { endpoint: "/api/wolf-pack" },
});

// List activities for session
const activities = ZenGardenCore.listActivitiesForSession("session-123");

// Compute rewards for session
const rewards = ZenGardenCore.computeRewardsForSession(
  {
    economicEngineCore: EconomicEngineCore,
    neuralMesh: NeuralMesh,
  },
  session
);

// Run zen garden cycle
const status = ZenGardenCore.run({
  economicEngineCore: EconomicEngineCore,
  neuralMesh: NeuralMesh,
});

// Get status
const gardenStatus = ZenGardenCore.status();
```

**Key Functions**:
- `upsertSession(session)` - Create or update session
- `getSession(id)` - Get session by ID
- `listSessions()` - List all sessions
- `upsertActivity(activity)` - Create or update activity
- `listActivitiesForSession(sessionId)` - List activities for session
- `computeRewardsForSession(context, session)` - Compute rewards
- `run(context)` - Run zen garden cycle
- `status()` - Get garden status

**Activity Kinds**:
- API call
- Page view
- Interaction
- Completion
- Achievement

**WHY**: Provides engagement and activity tracking, computing rewards for user participation.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 23. `@dreamnet/dream-tank-core` - Dream Tank Core

**WHAT**: Incubator engine - dream development and evaluation

**WHERE**: `packages/dream-tank-core/index.ts`, initialized in `server/index.ts` lines 907-913

**HOW**:
```typescript
import { DreamTankCore } from "@dreamnet/dream-tank-core";

// Upsert dream
const dream = DreamTankCore.upsertDream({
  id: "dream-123",
  ownerIdentityId: "identity-123",
  name: "API Improvement",
  stage: "incubation",
  health: "healthy",
});

// Get dream
const dream = DreamTankCore.getDream("dream-123");

// List dreams
const dreams = DreamTankCore.listDreams();

// Upsert milestone
const milestone = DreamTankCore.upsertMilestone({
  id: "milestone-123",
  dreamId: "dream-123",
  name: "API v1 Complete",
  state: "completed",
});

// List milestones for dream
const milestones = DreamTankCore.listMilestonesForDream("dream-123");

// Evaluate dream
const evaluation = DreamTankCore.evaluateDream(
  {
    neuralMesh: NeuralMesh,
    dreamCortex: DreamCortex,
  },
  dream,
  "health-check" // or "progress-check", "readiness-check"
);

// Run dream tank cycle
const status = DreamTankCore.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const tankStatus = DreamTankCore.status();
```

**Key Functions**:
- `upsertDream(dream)` - Create or update dream
- `getDream(id)` - Get dream by ID
- `listDreams()` - List all dreams
- `upsertMilestone(milestone)` - Create or update milestone
- `listMilestonesForDream(dreamId)` - List milestones for dream
- `evaluateDream(context, dream, kind)` - Evaluate dream
- `run(context)` - Run dream tank cycle
- `status()` - Get tank status

**Dream Stages**:
- Ideation
- Incubation
- Development
- Testing
- Launch
- Maintenance

**Evaluation Kinds**:
- Health check (overall health)
- Progress check (milestone progress)
- Readiness check (launch readiness)

**WHY**: Provides dream incubation and development tracking, evaluating dreams and milestones.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 24. `@dreamnet/social-hub-core` - Social Hub Core

**WHAT**: Social feed and posts layer - social media functionality

**WHERE**: `packages/social-hub-core/index.ts`, initialized in `server/index.ts` lines 874-880

**HOW**:
```typescript
import { SocialHubCore } from "@dreamnet/social-hub-core";

// Create post
const post = SocialHubCore.createPost({
  authorIdentityId: "identity-123",
  kind: "text",
  visibility: "public",
  text: "Hello DreamNet!",
  tags: ["announcement"],
});

// Upsert post
const post = SocialHubCore.upsertPost({
  id: "post-123",
  authorIdentityId: "identity-123",
  kind: "text",
  visibility: "public",
  text: "Updated post",
});

// Get post
const post = SocialHubCore.getPost("post-123");

// List posts
const posts = SocialHubCore.listPosts();

// Add comment
const comment = SocialHubCore.addComment({
  postId: "post-123",
  authorIdentityId: "identity-456",
  text: "Great post!",
});

// List comments for post
const comments = SocialHubCore.listCommentsForPost("post-123");

// Add reaction
const reaction = SocialHubCore.addReaction({
  postId: "post-123",
  reactorIdentityId: "identity-456",
  type: "like",
});

// List reactions for post
const reactions = SocialHubCore.listReactionsForPost("post-123");

// Build feed
const feed = SocialHubCore.buildFeed(
  {
    identityId: "identity-123",
    neuralMesh: NeuralMesh,
    reputationLattice: ReputationLattice,
  },
  {
    limit: 20,
    includeComments: true,
    includeReactions: true,
  }
);

// Run social hub cycle
const status = SocialHubCore.run({
  neuralMesh: NeuralMesh,
  reputationLattice: ReputationLattice,
});

// Get status
const hubStatus = SocialHubCore.status();
```

**Key Functions**:
- `createPost(params)` - Create post
- `upsertPost(post)` - Create or update post
- `getPost(id)` - Get post by ID
- `listPosts()` - List all posts
- `addComment(params)` - Add comment
- `listCommentsForPost(postId)` - List comments for post
- `addReaction(params)` - Add reaction
- `listReactionsForPost(postId)` - List reactions for post
- `buildFeed(context, query)` - Build feed
- `run(context)` - Run social hub cycle
- `status()` - Get hub status

**Post Kinds**:
- Text (text posts)
- Image (image posts)
- Video (video posts)
- Link (link posts)

**Reaction Types**:
- Like
- Love
- Laugh
- Wow
- Sad
- Angry

**WHY**: Provides social media functionality, enabling users to post, comment, and react.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 25. `@dreamnet/init-ritual-core` - Init & Ritual Core

**WHAT**: Onboarding and initialization layer - user onboarding flows

**WHERE**: `packages/init-ritual-core/index.ts`, initialized in `server/index.ts` lines 874-880

**HOW**:
```typescript
import { InitRitualCore } from "@dreamnet/init-ritual-core";

// Ensure default template seeded
InitRitualCore.ensureDefaultTemplateSeeded();

// Upsert template
const template = InitRitualCore.upsertTemplate({
  id: "custom-init",
  name: "Custom Onboarding",
  steps: [
    { id: "step-1", type: "welcome", required: true },
    { id: "step-2", type: "wallet-connect", required: true },
  ],
});

// List templates
const templates = InitRitualCore.listTemplates();

// Get or create identity state
const state = InitRitualCore.getOrCreateIdentityState("identity-123", "default-user-init");

// Get identity state
const state = InitRitualCore.getIdentityState("identity-123");

// Advance identity (get next step)
const result = InitRitualCore.advanceIdentity(
  {
    identityGrid: IdentityGrid,
    neuralMesh: NeuralMesh,
  },
  "identity-123",
  "default-user-init"
);

// Complete step
const updatedState = InitRitualCore.completeStep("identity-123", "step-1");

// Run init ritual cycle
const status = InitRitualCore.run({
  identityGrid: IdentityGrid,
  neuralMesh: NeuralMesh,
});

// Get status
const initStatus = InitRitualCore.status();
```

**Key Functions**:
- `ensureDefaultTemplateSeeded()` - Ensure default template exists
- `upsertTemplate(template)` - Create or update template
- `listTemplates()` - List all templates
- `getOrCreateIdentityState(identityId, templateId?)` - Get or create identity state
- `getIdentityState(identityId)` - Get identity state
- `advanceIdentity(context, identityId, templateId?)` - Advance identity to next step
- `completeStep(identityId, stepId)` - Complete step
- `run(context)` - Run init ritual cycle
- `status()` - Get init status

**Init Stages**:
- Welcome
- Wallet connect
- Profile setup
- Preferences
- Complete

**Step Types**:
- Welcome (welcome message)
- Wallet connect (wallet connection)
- Profile setup (profile creation)
- Preferences (preference selection)
- Complete (completion)

**WHY**: Provides user onboarding flows, guiding users through initialization steps.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 26. `@dreamnet/economic-engine-core` - Economic Engine Core

**WHAT**: Rewards and tokens layer - token balances, rewards, and emissions

**WHERE**: `packages/economic-engine-core/index.ts`, initialized in `server/index.ts` lines 862-868

**HOW**:
```typescript
import { EconomicEngineCore } from "@dreamnet/economic-engine-core";

// Ensure default config seeded
EconomicEngineCore.ensureDefaultConfigSeeded();

// List token configs
const configs = EconomicEngineCore.listTokenConfigs();

// List emission rules
const rules = EconomicEngineCore.listEmissionRules();

// Get balance
const balance = EconomicEngineCore.getBalance("identity-123", "SHEEP");

// List balances
const balances = EconomicEngineCore.listBalances();

// Record raw reward
const reward = EconomicEngineCore.recordRawReward({
  identityId: "identity-123",
  source: "zen-garden",
  kind: "activity_completion",
  amount: 100,
  token: "SHEEP",
});

// Apply emission for reward
const appliedRewards = EconomicEngineCore.applyEmissionForReward(reward);

// List applied rewards
const appliedRewards = EconomicEngineCore.listAppliedRewards();

// Run economic engine cycle
const status = EconomicEngineCore.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const econStatus = EconomicEngineCore.status();
```

**Key Functions**:
- `ensureDefaultConfigSeeded()` - Ensure default config exists
- `listTokenConfigs()` - List token configs
- `listEmissionRules()` - List emission rules
- `getBalance(identityId, token)` - Get balance
- `listBalances()` - List all balances
- `recordRawReward(ev)` - Record raw reward
- `applyEmissionForReward(ev)` - Apply emission for reward
- `listAppliedRewards()` - List applied rewards
- `run(context)` - Run economic engine cycle
- `status()` - Get economic status

**Token Symbols**:
- DREAM (main token)
- SHEEP (reward token)
- Custom tokens

**Reward Sources**:
- Zen Garden (activity rewards)
- Dream Tank (dream completion)
- Social Hub (engagement rewards)
- Custom sources

**WHY**: Provides token economy functionality, managing balances, rewards, and emissions.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 27. `@dreamnet/agent-registry-core` - Agent Registry Core

**WHAT**: Agent catalog and health layer - agent registration and health tracking

**WHERE**: `packages/agent-registry-core/index.ts`, initialized in `server/index.ts` lines 874-880

**HOW**:
```typescript
import { AgentRegistryCore } from "@dreamnet/agent-registry-core";

// Ensure default agents seeded
AgentRegistryCore.ensureDefaultAgentsSeeded();

// Upsert agent config
const config = AgentRegistryCore.upsertAgentConfig({
  id: "agent-123",
  kind: "wolf-pack",
  name: "Funding Agent",
  enabled: true,
});

// List agent configs
const configs = AgentRegistryCore.listAgentConfigs();

// Get agent health
const health = AgentRegistryCore.getAgentHealth("agent-123");

// List agent health
const healths = AgentRegistryCore.listAgentHealth();

// Record success
AgentRegistryCore.recordSuccess("agent-123", 150); // latency in ms

// Record error
AgentRegistryCore.recordError("agent-123", "Rate limit exceeded");

// Run agent registry cycle
const status = AgentRegistryCore.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const registryStatus = AgentRegistryCore.status();
```

**Key Functions**:
- `ensureDefaultAgentsSeeded()` - Ensure default agents exist
- `upsertAgentConfig(cfg)` - Create or update agent config
- `listAgentConfigs()` - List all agent configs
- `getAgentHealth(agentId)` - Get agent health
- `listAgentHealth()` - List all agent health
- `recordSuccess(agentId, latencyMs?)` - Record success
- `recordError(agentId, errorMessage)` - Record error
- `run(context)` - Run agent registry cycle
- `status()` - Get registry status

**Agent Kinds**:
- Wolf Pack (funding agents)
- Whale Pack (commerce agents)
- Orca Pack (communication agents)
- Custom agents

**Agent States**:
- Active
- Paused
- Disabled
- Error

**WHY**: Provides agent registration and health tracking, monitoring agent performance.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 28. `@dreamnet/civic-panel-core` - Civic Panel Core

**WHAT**: Admin and status layer - dashboard and command system

**WHERE**: `packages/civic-panel-core/index.ts`, initialized in `server/index.ts` lines 874-880

**HOW**:
```typescript
import { CivicPanelCore } from "@dreamnet/civic-panel-core";

// Run civic panel cycle
const status = await CivicPanelCore.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const panelStatus = CivicPanelCore.status();

// Get dashboard snapshot
const snapshot = CivicPanelCore.getDashboardSnapshot();

// Enqueue command
const command = CivicPanelCore.enqueueCommand(
  "restart_agent",
  "Restart Wolf Pack",
  { agentId: "wolf-pack" }
);
```

**Key Functions**:
- `run(context)` - Run civic panel cycle
- `status()` - Get panel status
- `getDashboardSnapshot()` - Get dashboard snapshot
- `enqueueCommand(type, label?, meta?)` - Enqueue command

**Command Types**:
- Restart agent
- Pause agent
- Enable agent
- Disable agent
- Update config
- Custom commands

**WHY**: Provides admin dashboard and command system for system management.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 29. `@dreamnet/reputation-lattice` - Reputation Lattice

**WHAT**: Trust and reputation layer - reputation scoring and trust system

**WHERE**: `packages/reputation-lattice/index.ts`, initialized in `server/index.ts` lines 649-655

**HOW**:
```typescript
import { ReputationLattice } from "@dreamnet/reputation-lattice";

// Configure reputation lattice
ReputationLattice.configure({
  decayRate: 0.1,
  minScore: 0,
  maxScore: 100,
});

// Add signal
ReputationLattice.addSignal({
  entityType: "agent",
  entityId: "wolf-pack",
  signalType: "success",
  value: 1,
  source: "task_completion",
});

// Get score
const score = ReputationLattice.getScore("agent", "wolf-pack");

// Run reputation cycle
const status = ReputationLattice.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const repStatus = ReputationLattice.status();
```

**Key Functions**:
- `configure(config)` - Configure reputation lattice
- `addSignal(signal)` - Add reputation signal
- `getScore(entityType, entityId)` - Get reputation score
- `run(context)` - Run reputation cycle
- `status()` - Get reputation status

**Entity Types**:
- Agent
- Identity
- Dream
- Service

**Signal Types**:
- Success
- Failure
- Trust
- Distrust

**WHY**: Provides reputation and trust scoring, enabling trust-based interactions.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 30. `@dreamnet/narrative-field` - Narrative Field

**WHAT**: Global story stream - narrative tracking and story generation

**WHERE**: `packages/narrative-field/index.ts`, initialized in `server/index.ts` lines 656-660

**HOW**:
```typescript
import { NarrativeField } from "@dreamnet/narrative-field";

// Add narrative entry
NarrativeField.add({
  id: "narrative-123",
  severity: "high",
  domain: "system",
  message: "Wolf Pack completed funding outreach",
  references: [
    { type: "agent", id: "wolf-pack" },
    { type: "task", id: "task-123" },
  ],
});

// List narratives
const narratives = NarrativeField.list();

// List with filter
const filtered = NarrativeField.list({
  severity: "high",
  domain: "system",
});

// Run narrative cycle
const status = NarrativeField.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const narrativeStatus = NarrativeField.status();
```

**Key Functions**:
- `add(entry)` - Add narrative entry
- `list(filter?)` - List narratives
- `run(context)` - Run narrative cycle
- `status()` - Get narrative status

**Severity Levels**:
- Low
- Medium
- High
- Critical

**Domains**:
- System
- Agent
- User
- Dream
- Custom

**WHY**: Provides narrative tracking, creating a global story stream of system events.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

### 31. `@dreamnet/identity-grid` - Identity Grid

**WHAT**: Unified identity, wallet, and agent layer - identity graph

**WHERE**: `packages/identity-grid/index.ts`, initialized in `server/index.ts` lines 691-699

**HOW**:
```typescript
import { IdentityGrid } from "@dreamnet/identity-grid";

// Upsert node
const node = IdentityGrid.upsertNode({
  id: "identity-123",
  type: "wallet",
  label: "0x123...",
  trustScore: 75,
  metadata: { chain: "base" },
});

// Add edge
const edge = IdentityGrid.addEdge({
  id: "edge-123",
  from: "identity-123",
  to: "identity-456",
  relation: "controls",
  weight: 1.0,
});

// List nodes
const nodes = IdentityGrid.listNodes();

// List edges
const edges = IdentityGrid.listEdges();

// Get snapshot
const snapshot = IdentityGrid.getSnapshot();

// Run identity cycle
const status = IdentityGrid.run({
  neuralMesh: NeuralMesh,
  dreamCortex: DreamCortex,
});

// Get status
const identityStatus = IdentityGrid.status();
```

**Key Functions**:
- `upsertNode(node)` - Create or update identity node
- `addEdge(edge)` - Add identity edge
- `listNodes()` - List all nodes
- `listEdges()` - List all edges
- `getSnapshot()` - Get identity snapshot
- `run(context)` - Run identity cycle
- `status()` - Get identity status

**Identity Types**:
- Wallet (blockchain wallet)
- Agent (AI agent)
- User (human user)
- Service (service account)

**Edge Relations**:
- Controls
- Owns
- Trusts
- Distrusts

**WHY**: Provides unified identity layer, connecting wallets, agents, and users in a graph.

**Status**: ✅ Active (integrated in orchestrator cycle, auto-issues passports)

---

### 32. `@dreamnet/dream-state-core` - Dream State Core

**WHAT**: Governance layer - passports, proposals, voting, and government

**WHERE**: `packages/dream-state-core/index.ts`, initialized in `server/index.ts` lines 663-691

**HOW**:
```typescript
import { DreamStateCore } from "@dreamnet/dream-state-core";

// Issue passport
const passport = DreamStateCore.issuePassport("identity-123", "citizen", ["verified"]);

// Get passport
const passport = DreamStateCore.getPassport("identity-123");

// Upgrade passport
const upgraded = DreamStateCore.upgradePassport("identity-123", "ambassador");

// List passports
const passports = DreamStateCore.listPassports();

// Create proposal
const proposal = DreamStateCore.createProposal(
  "identity-123",
  "Increase API Rate Limits",
  "Proposal to increase API rate limits from 100 to 200 req/min"
);

// Open proposal
DreamStateCore.openProposal("proposal-123");

// Cast vote
const vote = DreamStateCore.castVote("identity-123", "proposal-123", "for", "citizen");

// Tally proposal
const tally = DreamStateCore.tallyProposal("proposal-123");

// Check if passed
const passed = DreamStateCore.proposalPassed("proposal-123");

// Execute proposal
DreamStateCore.executeProposal("proposal-123");

// Register D-DAO attractor
const attractor = DreamStateCore.registerDDAOAttractor(
  "Aragon",
  "governance",
  "https://aragon.org",
  ["dao", "governance"],
  85
);

// List departments
const departments = DreamStateCore.listDepartments();

// Record government action
const action = DreamStateCore.recordAction(
  "policy_change",
  "treasury",
  "Increased token emission rate",
  { newRate: 1.5 }
);

// Establish diplomatic relation
const relation = DreamStateCore.establishDiplomaticRelation(
  { identityGrid: IdentityGrid },
  "Aragon",
  "governance_protocol",
  "contact@aragon.org",
  "Partnership for governance"
);

// Run dream state cycle
const status = DreamStateCore.run({
  identityGrid: IdentityGrid,
  neuralMesh: NeuralMesh,
});

// Get status
const stateStatus = DreamStateCore.status();
```

**Key Functions**:
- `issuePassport(identityId, tier, flags?)` - Issue passport
- `getPassport(identityId)` - Get passport
- `upgradePassport(identityId, newTier)` - Upgrade passport
- `createProposal(identityId, title, description, meta?)` - Create proposal
- `castVote(identityId, proposalId, choice, passportTier)` - Cast vote
- `tallyProposal(proposalId)` - Tally proposal
- `executeProposal(proposalId)` - Execute proposal
- `registerDDAOAttractor(name, category, url?, tags?, score?)` - Register D-DAO attractor
- `listDepartments()` - List departments
- `recordAction(type, department, action, meta?)` - Record government action
- `establishDiplomaticRelation(context, protocolName, protocolType, contactEmail?, notes?)` - Establish diplomatic relation
- `run(context)` - Run dream state cycle
- `status()` - Get state status

**Passport Tiers**:
- Visitor (lowest)
- Citizen
- Ambassador
- Operator
- Architect
- Founder (highest)

**WHY**: Provides governance layer, enabling passport-based citizenship, proposals, voting, and government operations.

**Status**: ✅ Active (integrated in orchestrator cycle)

---

## Summary

**Core Infrastructure Packages** (7):
1. DreamNet OS Core - Global status and heartbeat
2. Control Core - Kill-switches, rate limiting, access control
3. Orchestrator Core - Agent orchestration cycles
4. Runtime Bridge Core - Runtime context management
5. Neural Mesh - Synaptic connections and memory
6. Spider Web Core - Event routing nervous system
7. Shield Core - Immune system and defense

**Biomimetic System Packages** (10):
8. Dream Cortex - Global intent and goal engine
9. Quantum Anticipation - Predictive analysis layer
10. Squad Alchemy - Dynamic squad management
11. Wolf Pack - Anomaly hunting
12. Octopus Executor - 8-arm parallel runtime
13. Slug-Time Memory - Long-horizon trend tracking
14. Star Bridge Lungs - Cross-chain monitoring
15. Predator-Scavenger Loop - Metabolic cleanup
16. Halo Loop - Self-healing system
17. Dream Snail Core - Privacy layer

**Application Layer Packages** (15):
18. Dream Vault - Central repository
19. Dream Shop - Marketplace layer
20. Field Layer - Global parameter fields
21. DreamBet Core - Games and fairness engine
22. Zen Garden Core - Ritual, activity, and reward engine
23. Dream Tank Core - Incubator engine
24. Social Hub Core - Social feed and posts layer
25. Init Ritual Core - Onboarding and initialization layer
26. Economic Engine Core - Rewards and tokens layer
27. Agent Registry Core - Agent catalog and health layer
28. Civic Panel Core - Admin and status layer
29. Reputation Lattice - Trust and reputation layer
30. Narrative Field - Global story stream
31. Identity Grid - Unified identity, wallet, and agent layer
32. Dream State Core - Governance layer

**Total**: 32 core packages documented

**Next**: Continue exploring remaining packages (agent packages, economic packages, integration packages, etc.)

---

**This document provides comprehensive documentation for all core DreamNet packages.**

