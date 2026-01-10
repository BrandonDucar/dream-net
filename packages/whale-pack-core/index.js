import { WhaleStore } from './store/whaleStore.js';
import { runWhalePackCycle } from './scheduler/whaleScheduler.js';
export const WhalePackCore = {
    run(context) {
        return runWhalePackCycle(context);
    },
    status() {
        return WhaleStore.status();
    },
    // Helpers for seeding / manual control
    upsertProduct(product) {
        return WhaleStore.upsertProduct(product);
    },
    listProducts() {
        return WhaleStore.listProducts();
    },
    upsertAudience(aud) {
        return WhaleStore.upsertAudience(aud);
    },
    listAudiences() {
        return WhaleStore.listAudiences();
    },
    upsertPlan(plan) {
        return WhaleStore.upsertPlan(plan);
    },
    listPlans() {
        return WhaleStore.listPlans();
    },
    addInsight(insight) {
        return WhaleStore.addInsight(insight);
    },
    listInsights() {
        return WhaleStore.listInsights();
    },
};
export * from './types.js';
export * from './logic/whaleOutreachCore.js';
export default WhalePackCore;
//# sourceMappingURL=index.js.map