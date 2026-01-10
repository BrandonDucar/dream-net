import { TankStore } from './store/tankStore.js';
import { runDreamTankCycle } from './scheduler/tankScheduler.js';
import { evaluateDream } from './logic/evaluationEngine.js';
export const DreamTankCore = {
    // Dreams
    // ✅ Identity Layer v1: Already accepts ownerIdentityId in DreamIncubation
    // Usage: DreamTankCore.upsertDream({ ..., ownerIdentityId: ctx.identityId, ... })
    upsertDream(dream) {
        return TankStore.upsertDream(dream);
    },
    getDream(id) {
        return TankStore.getDream(id);
    },
    listDreams() {
        return TankStore.listDreams();
    },
    // Milestones
    upsertMilestone(milestone) {
        return TankStore.upsertMilestone(milestone);
    },
    listMilestonesForDream(dreamId) {
        return TankStore.listMilestonesForDream(dreamId);
    },
    // Evaluations
    evaluateDream(context, dream, kind = "health-check") {
        return evaluateDream(context, dream, kind);
    },
    // Orchestration
    run(context) {
        return runDreamTankCycle(context);
    },
    status() {
        return TankStore.status();
    },
};
export * from './types.js';
export default DreamTankCore;
//# sourceMappingURL=index.js.map