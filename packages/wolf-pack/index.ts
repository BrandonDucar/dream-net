import type {
  WolfContext,
  WolfSignal,
  WolfPackStatus,
} from "./types";
import { runWolfPackCycle, wolfPackStatus } from "./engine/wolfPackEngine";
import { TargetTracker } from "./trackers/targetTracker";

export const WolfPack = {
  run(context: WolfContext): { signals: WolfSignal[]; strikes: any[] } {
    return runWolfPackCycle(context);
  },

  status(): WolfPackStatus {
    return wolfPackStatus();
  },

  listTargets(): string[] {
    return TargetTracker.listTargets();
  },

  clearTarget(targetId: string) {
    TargetTracker.clearTarget(targetId);
  },

  clearAllTargets() {
    TargetTracker.clearAll();
  },
};

export * from "./types";
export default WolfPack;

