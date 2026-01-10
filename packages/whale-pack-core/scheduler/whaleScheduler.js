import { WhaleStore } from '../store/whaleStore.js';
import { ensureSeedProductsAndAudiences, generateNewContentPlans } from '../logic/whaleSignalCore.js';
import { simulateWhalePosting } from '../logic/whalePosterCore.js';
import { runWhaleAnalysis } from '../logic/whaleAnalystCore.js';
export async function runWhalePackCycle(ctx) {
    const now = Date.now();
    ensureSeedProductsAndAudiences();
    generateNewContentPlans(ctx, 5);
    await simulateWhalePosting(ctx);
    runWhaleAnalysis(ctx);
    WhaleStore.setLastRunAt(now);
    return WhaleStore.status();
}
//# sourceMappingURL=whaleScheduler.js.map