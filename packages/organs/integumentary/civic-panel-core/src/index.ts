import type {
  WidgetKind,
  WidgetMetric,
  WidgetConfig,
  CommandType,
  CommandState,
  CivicCommand,
  CivicPanelContext,
  CivicDashboardSnapshot,
  CivicPanelStatus,
} from './types.js';
import { CommandStore } from './store/commandStore.js';
import { runCivicPanelCycle } from './scheduler/panelScheduler.js';
import { enqueueCommand } from './logic/commandHandler.js';

export const CivicPanelCore = {
  // Main orchestration
  async run(context: CivicPanelContext): Promise<CivicPanelStatus> {
    return runCivicPanelCycle(context);
  },

  status(): CivicPanelStatus {
    return CommandStore.status();
  },

  getDashboardSnapshot(): CivicDashboardSnapshot {
    return CommandStore.status().snapshot;
  },

  // Commands
  enqueueCommand(type: CommandType, label?: string, meta?: Record<string, any>): CivicCommand {
    return enqueueCommand(type, label, meta);
  },
};

export * from './types.js';
export default CivicPanelCore;

