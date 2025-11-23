import { enqueueTask } from "./engine/octopusEngine";
import { runOctopusScheduler, octopusStatus, ensureOctopusInitialized } from "./scheduler/octopusScheduler";
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
export * from "./types";
export default OctopusExecutor;
