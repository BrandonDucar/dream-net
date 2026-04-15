# HALO Loop

The HALO Loop (Hierarchical Autonomous Learning & Optimization Loop) is DreamNet's self-healing and optimization system. It continuously analyzes the system, detects weak points, and generates tasks to improve the system.

## Overview

- **Package**: `@dreamnet/halo-loop`
- **Location**: `packages/halo-loop/`
- **Purpose**: System analysis, weak point detection, and task generation

## Core Concepts

### Analyzers

Analyzers scan the system for issues:
- **Agent Health Analyzer**: Checks agent status and health
- **Squad Efficiency Analyzer**: Analyzes squad performance
- **Endpoint Health Analyzer**: Checks API endpoint health
- **Environment Consistency Analyzer**: Validates environment variables
- **Repository Integrity Analyzer**: Checks code integrity
- **Graft Analyzer**: Analyzes graft status

### Strategies

Strategies convert issues into tasks:
- **Revive Agent Strategy**: Revive failed agents
- **Repair Endpoint Strategy**: Repair failed endpoints
- **Environment Sync Strategy**: Sync environment variables
- **Optimize Squad Strategy**: Optimize squad performance
- **Code Quality Strategy**: Improve code quality
- **Repair Graft Strategy**: Repair failed grafts

### Triggers

Triggers determine when HALO runs:
- **Time Trigger**: Runs on a schedule (default: 5 minutes)
- **Request Volume Trigger**: Runs when request volume is high
- **Error Rate Trigger**: Runs when error rate is high
- **Deploy Trigger**: Runs after deployments
- **Event Wormhole Trigger**: Runs when critical events occur

### Cycles

HALO runs in cycles:
- **Analysis**: Analyzes system state
- **Weak Point Detection**: Detects weak points
- **Task Generation**: Generates tasks to fix issues
- **Task Dispatch**: Dispatches tasks to squads
- **Results Recording**: Records cycle results

## API Endpoints

### Status

- `GET /api/halo/status` - Get HALO status
- `POST /api/halo/run` - Manually trigger a HALO cycle
- `GET /api/halo/history` - Get HALO cycle history
- `GET /api/halo/weakpoints` - Get current weak points

## Integration

### Event Wormholes

HALO Loop integrates with Event Wormholes:
- Emits events for cycle completion (`halo.cycle.completed`)
- Emits events for critical weakpoints (`halo.weakpoint.critical`)
- Triggers on critical/error events from Event Wormholes

### Squad Builder

HALO Loop integrates with Squad Builder:
- Generates tasks for squads
- Tasks are created with status `pending-approval`
- Tasks can be approved and dispatched

### Memory DNA

HALO Loop integrates with Memory DNA:
- Updates traits from cycle results
- Tracks system evolution over time
- Learns from past cycles

### Resonance Engine

HALO Loop integrates with Resonance Engine:
- Computes resonance insights
- Identifies patterns across cycles
- Optimizes future cycles

## Usage Example

```typescript
import { haloEngine, registerHaloLoop } from "@dreamnet/halo-loop";

// Register HALO Loop
const registration = registerHaloLoop();

// Manually trigger a cycle
const cycle = await haloEngine.runCycle("manual");

// Get weak points
const weakPoints = cycle.weakPoints;

// Get generated tasks
const tasks = cycle.generatedTasks;
```

## Analyzers

### Agent Health Analyzer
- Checks agent online status
- Detects failed agents
- Identifies agents needing revival

### Squad Efficiency Analyzer
- Analyzes squad performance
- Detects inefficient squads
- Identifies optimization opportunities

### Endpoint Health Analyzer
- Checks API endpoint health
- Detects failed endpoints
- Identifies endpoints needing repair

### Environment Consistency Analyzer
- Validates environment variables
- Detects missing variables
- Identifies inconsistencies

### Repository Integrity Analyzer
- Checks code integrity
- Detects broken dependencies
- Identifies code quality issues

### Graft Analyzer
- Analyzes graft status
- Detects failed grafts
- Identifies grafts needing repair

## Strategies

### Revive Agent Strategy
- Creates tasks to revive failed agents
- Targets: DreamOps agent
- Task type: `agent.revive`

### Repair Endpoint Strategy
- Creates tasks to repair failed endpoints
- Targets: DeployKeeper agent
- Task type: `repair.api.endpoint`

### Environment Sync Strategy
- Creates tasks to sync environment variables
- Targets: EnvKeeper agent
- Task type: `env.audit`

### Optimize Squad Strategy
- Creates tasks to optimize squad performance
- Targets: DreamOps agent
- Task type: `squad.optimize`

### Code Quality Strategy
- Creates tasks to improve code quality
- Targets: BuildKeeper agent
- Task type: `code.quality`

### Repair Graft Strategy
- Creates tasks to repair failed grafts
- Targets: GraftBuilder agent
- Task type: `graft.repair`

## Triggers

### Time Trigger
- Runs on a schedule
- Default interval: 5 minutes
- Configurable via `HALO_INTERVAL_MS` env var

### Request Volume Trigger
- Runs when request volume is high
- Threshold: configurable
- Tracks request count over time

### Error Rate Trigger
- Runs when error rate is high
- Threshold: configurable
- Tracks error count over time

### Deploy Trigger
- Runs after deployments
- Triggered by deploy events
- Analyzes post-deployment state

### Event Wormhole Trigger
- Runs when critical events occur
- Triggered by Event Wormholes
- Analyzes system after critical events

## Cycle Flow

```
Trigger → Analyze → Detect Weak Points → Generate Tasks → Dispatch Tasks → Record Results
```

## Safety Guarantees

- Tasks are created with status `pending-approval`
- Operators must approve tasks before execution
- Cycles are logged and queryable
- Weak points are tracked and monitored
- System evolution is recorded in Memory DNA

## History

HALO cycles are recorded in history:
- Cycle ID and timestamp
- Analysis results
- Weak points detected
- Tasks generated
- Dispatch results
- Summary

## Configuration

- `HALO_INTERVAL_MS`: Time trigger interval (default: 5 minutes)
- `HALO_REQUEST_THRESHOLD`: Request volume threshold
- `HALO_ERROR_THRESHOLD`: Error rate threshold

