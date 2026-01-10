import type {
  ChainId,
  BreathDirection,
  ChainBreathMetrics,
  BreathSnapshot,
  StarBridgeContext,
  StarBridgeStatus,
} from './types.js';
import { runStarBridgeCycle, starBridgeStatus } from './scheduler/breathScheduler.js';

export const StarBridgeLungs = {
  async run(context: StarBridgeContext): Promise<StarBridgeStatus> {
    return await runStarBridgeCycle(context);
  },

  status(): StarBridgeStatus {
    return starBridgeStatus();
  },
};

export * from './types.js';
export * from './engine/resonance.js';
export default StarBridgeLungs;

