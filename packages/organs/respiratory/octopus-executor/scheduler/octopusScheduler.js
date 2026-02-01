import { runOctopusCycle, getQueuedTaskCount } from '../engine/octopusEngine.js';
import { ArmRegistry } from '../arms/armRegistry.js';
import { registerDefaultArms } from '../arms/defaultArms.js';
let initialized = false;
let lastRunAt = null;
export async function ensureOctopusInitialized() {
    if (initialized)
        return;
    registerDefaultArms();
    initialized = true;
}
export async function runOctopusScheduler(ctx) {
    await ensureOctopusInitialized();
    await runOctopusCycle(ctx);
    lastRunAt = Date.now();
}
export function octopusStatus() {
    return {
        lastRunAt,
        arms: ArmRegistry.status(),
        queuedTasks: getQueuedTaskCount(),
    };
}
//# sourceMappingURL=octopusScheduler.js.map