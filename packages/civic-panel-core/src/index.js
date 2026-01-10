import { CommandStore } from './store/commandStore.js';
import { runCivicPanelCycle } from './scheduler/panelScheduler.js';
import { enqueueCommand } from './logic/commandHandler.js';
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
export * from './types.js';
export default CivicPanelCore;
//# sourceMappingURL=index.js.map