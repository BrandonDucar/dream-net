import { runStarBridgeCycle, starBridgeStatus } from './scheduler/breathScheduler.js';
export const StarBridgeLungs = {
    async run(context) {
        return await runStarBridgeCycle(context);
    },
    status() {
        return starBridgeStatus();
    },
};
export * from './types.js';
export * from './engine/resonance.js';
export default StarBridgeLungs;
//# sourceMappingURL=index.js.map