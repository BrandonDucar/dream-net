import { runWolfPackCycle, wolfPackStatus } from "./engine/wolfPackEngine";
import { TargetTracker } from "./trackers/targetTracker";
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
};
export * from "./types";
export default WolfPack;
