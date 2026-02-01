import type { WolfSignal } from '../types.js';

const activeTargetIds = new Set<string>();

export const TargetTracker = {
  trackFromSignals(signals: WolfSignal[]) {
    signals.forEach((signal) => {
      if (signal.targetId && signal.type !== "noop") {
        activeTargetIds.add(signal.targetId);
      }
    });
  },

  listTargets(): string[] {
    return Array.from(activeTargetIds);
  },

  clearTarget(targetId: string) {
    activeTargetIds.delete(targetId);
  },

  clearAll() {
    activeTargetIds.clear();
  },
};

