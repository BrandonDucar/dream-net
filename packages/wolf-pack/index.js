import { runWolfPackCycle, wolfPackStatus } from './engine/wolfPackEngine.js';
import { TargetTracker } from './trackers/targetTracker.js';
export const WolfPack = {
    run(context) {
        return runWolfPackCycle(context);
    },
    status() {
        return wolfPackStatus();
    },
    listTargets() {
        return TargetTracker.listTargets();
    },
    clearTarget(targetId) {
        TargetTracker.clearTarget(targetId);
    },
    clearAllTargets() {
        TargetTracker.clearAll();
    },
    async createAgent(meta) {
        console.log(`[WolfPack] Creating agent with meta:`, meta);
        return { id: `wolf-${Math.random().toString(36).slice(2, 9)}`, ok: true };
    },
    listAgents() {
        return [];
    },
    async assignTask(agentId, task) {
        console.log(`[WolfPack] Assigning task to ${agentId}:`, task);
        return { ok: true };
    },
};
export * from './types.js';
export default WolfPack;
//# sourceMappingURL=index.js.map