import { runPSLCycle, pslStatus } from "./scheduler/pslScheduler";
export const PredatorScavengerLoop = {
    run(context) {
        return runPSLCycle(context);
    },
    status() {
        return pslStatus();
    },
};
export * from "./types";
export default PredatorScavengerLoop;
