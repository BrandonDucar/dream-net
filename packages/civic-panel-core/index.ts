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
} from "./types";
import { CommandStore } from "./store/commandStore";
import { runCivicPanelCycle } from "./scheduler/panelScheduler";
import { enqueueCommand } from "./logic/commandHandler";

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

export * from "./types";
export default CivicPanelCore;

