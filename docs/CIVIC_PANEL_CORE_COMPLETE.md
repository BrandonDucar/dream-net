# Civic Panel Core - Complete Documentation

**Package**: `@dreamnet/civic-panel-core`  
**Status**: ✅ Complete  
**Last Updated**: 2025-01-27

---

## Overview

Civic Panel Core provides an **administrative dashboard system** for DreamNet. It generates dashboard snapshots with widgets (metric cards, tables, logs, graphs, status grids), manages administrative commands (refresh-vault, refresh-fields, refresh-reputation, etc.), and provides a unified view of DreamNet's status.

### Key Features

- **Dashboard Snapshots**: Generate snapshots with widgets showing system status
- **Command Queue**: Enqueue administrative commands for execution
- **Widget System**: Support for multiple widget types (metric-card, table, log, graph, status-grid)
- **Command Execution**: Execute commands against various subsystems
- **Status Aggregation**: Aggregate status from multiple subsystems

---

## Architecture

### How It Works

```
Command Enqueue → Command Execution → Subsystem Refresh → Widget Update → Snapshot Generation
```

1. **Command Enqueue**: Commands enqueued (refresh-vault, refresh-fields, etc.)
2. **Command Execution**: Commands executed against subsystems
3. **Subsystem Refresh**: Subsystems refreshed (run cycles)
4. **Widget Update**: Widgets updated with latest data
5. **Snapshot Generation**: Dashboard snapshot generated with widgets and recent commands

### Why This Design

- **Centralized Dashboard**: Single dashboard for all DreamNet status
- **Command Queue**: Asynchronous command execution prevents blocking
- **Widget System**: Flexible widgets enable custom dashboards
- **Subsystem Integration**: Integrates with all major subsystems
- **Status Aggregation**: Aggregates status for quick overview

---

## API Reference

### Types

```typescript
export type WidgetKind =
  | "metric-card"
  | "table"
  | "log"
  | "graph"
  | "status-grid";

export interface WidgetMetric {
  label: string;
  value: number | string;
  unit?: string;
  hint?: string;
}

export interface WidgetConfig {
  id: string;
  kind: WidgetKind;
  title: string;
  description?: string;
  metrics?: WidgetMetric[];
  payload?: any;              // Arbitrary payload for UI
  updatedAt: number;
}

export type CommandType =
  | "refresh-vault"
  | "refresh-fields"
  | "refresh-reputation"
  | "refresh-dreamcortex"
  | "refresh-dreamshop"
  | "refresh-dreambet"
  | "refresh-zen"
  | "noop";

export type CommandState =
  | "queued"
  | "running"
  | "completed"
  | "failed";

export interface CivicCommand {
  id: string;
  type: CommandType;
  label?: string;
  createdAt: number;
  updatedAt: number;
  state: CommandState;
  meta?: Record<string, any>;
}

export interface CivicDashboardSnapshot {
  generatedAt: number;
  widgets: WidgetConfig[];
  recentCommands: CivicCommand[];
}

export interface CivicPanelStatus {
  lastRunAt: number | null;
  widgetCount: number;
  commandCount: number;
  snapshot: CivicDashboardSnapshot;
}
```

### Functions

#### `run(context: CivicPanelContext): Promise<CivicPanelStatus>`

Run civic panel cycle (processes commands, generates snapshot).

**Example**:
```typescript
import { CivicPanelCore } from "@dreamnet/civic-panel-core";

const status = await CivicPanelCore.run({
  dreamVault: DreamVault,
  dreamShop: DreamShop,
  fieldLayer: FieldLayer,
  dreamBetCore: DreamBetCore,
  zenGardenCore: ZenGardenCore,
  dreamCortex: DreamCortex,
  reputationLattice: ReputationLattice,
});
```

#### `status(): CivicPanelStatus`

Get current panel status.

#### `getDashboardSnapshot(): CivicDashboardSnapshot`

Get current dashboard snapshot.

**Example**:
```typescript
const snapshot = CivicPanelCore.getDashboardSnapshot();
console.log(`Widgets: ${snapshot.widgets.length}`);
console.log(`Recent commands: ${snapshot.recentCommands.length}`);
```

#### `enqueueCommand(type: CommandType, label?: string, meta?: Record<string, any>): CivicCommand`

Enqueue an administrative command.

**Example**:
```typescript
// Refresh vault
CivicPanelCore.enqueueCommand("refresh-vault", "Refresh DreamVault");

// Refresh fields
CivicPanelCore.enqueueCommand("refresh-fields", "Refresh Field Layer");

// Refresh reputation
CivicPanelCore.enqueueCommand("refresh-reputation", "Refresh Reputation Lattice");
```

---

## Integration Points

### Consumes

- **All Subsystems**: DreamVault, DreamShop, FieldLayer, DreamBetCore, ZenGardenCore, DreamCortex, ReputationLattice, IdentityGrid, EconomicEngineCore, NeuralMesh, WolfPackFundingCore, WolfPackAnalystCore

### Produces

- **Dashboard Snapshots**: Widgets and commands for UI
- **Command Execution**: Commands executed against subsystems

### Integration Pattern

```typescript
// Command execution flow
CivicPanelCore.enqueueCommand("refresh-vault")
  → Command queued
  → run() processes command
  → DreamVault.run() executed
  → Widgets updated
  → Snapshot generated
```

---

## Usage Examples

### Run Panel Cycle

```typescript
import { CivicPanelCore } from "@dreamnet/civic-panel-core";

const status = await CivicPanelCore.run({
  dreamVault: DreamVault,
  dreamShop: DreamShop,
  fieldLayer: FieldLayer,
  dreamBetCore: DreamBetCore,
  zenGardenCore: ZenGardenCore,
  dreamCortex: DreamCortex,
  reputationLattice: ReputationLattice,
  identityGrid: IdentityGrid,
  economicEngineCore: EconomicEngineCore,
});

console.log(`Widgets: ${status.widgetCount}`);
console.log(`Commands: ${status.commandCount}`);
```

### Enqueue Commands

```typescript
// Refresh multiple subsystems
CivicPanelCore.enqueueCommand("refresh-vault", "Refresh DreamVault");
CivicPanelCore.enqueueCommand("refresh-fields", "Refresh Field Layer");
CivicPanelCore.enqueueCommand("refresh-reputation", "Refresh Reputation");
CivicPanelCore.enqueueCommand("refresh-dreamcortex", "Refresh Dream Cortex");
```

### Get Dashboard Snapshot

```typescript
const snapshot = CivicPanelCore.getDashboardSnapshot();

// Display widgets
snapshot.widgets.forEach(widget => {
  console.log(`${widget.title}: ${widget.kind}`);
  if (widget.metrics) {
    widget.metrics.forEach(metric => {
      console.log(`  ${metric.label}: ${metric.value} ${metric.unit || ''}`);
    });
  }
});

// Display recent commands
snapshot.recentCommands.forEach(cmd => {
  console.log(`${cmd.type}: ${cmd.state} (${cmd.label})`);
});
```

---

## Best Practices

1. **Command Batching**: Enqueue multiple commands before running cycle
2. **Context Injection**: Provide all subsystem contexts for full functionality
3. **Widget Updates**: Update widgets regularly for fresh data
4. **Command Monitoring**: Monitor command states for failures
5. **Snapshot Caching**: Cache snapshots for performance

---

## Security Considerations

- **Access Control**: Restrict access to administrative commands (RBAC)
- **Command Validation**: Validate commands before execution
- **Audit Logging**: Log all commands for audit trail
- **Widget Data**: Ensure widget data doesn't expose sensitive information

---

## Related Systems

- **All Subsystems**: Integrates with all DreamNet subsystems
- **DreamNet OS Core**: Uses panel for system monitoring
- **DreamNet RBAC Core**: Controls access to commands

---

**Status**: ✅ Complete  
**Phase 2 Progress**: 4/15 packages documented
