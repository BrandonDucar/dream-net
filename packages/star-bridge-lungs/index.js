import { runStarBridgeCycle, starBridgeStatus } from "./scheduler/breathScheduler";
export const StarBridgeLungs = {
    run(context) {
        return runStarBridgeCycle(context);
    },
    status() {
        return starBridgeStatus();
    },
};
export * from "./types";
export default StarBridgeLungs;
