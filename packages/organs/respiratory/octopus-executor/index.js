import { enqueueTask } from './engine/octopusEngine.js';
import { runOctopusScheduler, octopusStatus, ensureOctopusInitialized } from './scheduler/octopusScheduler.js';
export const OctopusExecutor = {
    async init() {
        await ensureOctopusInitialized();
    },
    enqueue(task) {
        enqueueTask(task);
    },
    async run(context) {
        await runOctopusScheduler(context);
    },
    status() {
        return octopusStatus();
    },
};
export * from './types.js';
export default OctopusExecutor;
//# sourceMappingURL=index.js.map