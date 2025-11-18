import type {
  ChainId,
  BreathDirection,
  ChainBreathMetrics,
  BreathSnapshot,
  StarBridgeContext,
  StarBridgeStatus,
} from "./types";
import { runStarBridgeCycle, starBridgeStatus } from "./scheduler/breathScheduler";

export const StarBridgeLungs = {
  run(context: StarBridgeContext): StarBridgeStatus {
    return runStarBridgeCycle(context);
  },

  status(): StarBridgeStatus {
    return starBridgeStatus();
  },
};

export * from "./types";
export default StarBridgeLungs;

