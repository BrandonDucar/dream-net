import { runPSLCycle, pslStatus } from './scheduler/pslScheduler.js';
export const PredatorScavengerLoop = {
    run(context) {
        return runPSLCycle(context);
    },
    status() {
        return pslStatus();
    },
};
export * from './types.js';
export default PredatorScavengerLoop;
//# sourceMappingURL=index.js.map