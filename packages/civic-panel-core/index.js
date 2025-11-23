import { CommandStore } from "./store/commandStore";
import { runCivicPanelCycle } from "./scheduler/panelScheduler";
import { enqueueCommand } from "./logic/commandHandler";
export const CivicPanelCore = {
    // Main orchestration
    async run(context) {
        return runCivicPanelCycle(context);
    },
    status() {
        return CommandStore.status();
    },
    getDashboardSnapshot() {
        return CommandStore.status().snapshot;
    },
    // Commands
    enqueueCommand(type, label, meta) {
        return enqueueCommand(type, label, meta);
    },
};
export * from "./types";
export default CivicPanelCore;
