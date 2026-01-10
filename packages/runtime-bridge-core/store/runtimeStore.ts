import { RuntimeSnapshot, RuntimeBridgeStatus } from '../types.js';

let initialized = false;

const snapshots: RuntimeSnapshot = {
  lastCycleAt: null,
  lastCycleDurationMs: null,
  lastCycleError: undefined,
  osStatus: undefined,
  civicStatus: undefined,
  econStatus: undefined,
};

export const RuntimeStore = {
  markInitialized() {
    initialized = true;
  },

  isInitialized(): boolean {
    return initialized;
  },

  updateCycleInfo(opts: {
    finishedAt: number;
    durationMs: number;
    error?: string;
  }) {
    snapshots.lastCycleAt = opts.finishedAt;
    snapshots.lastCycleDurationMs = opts.durationMs;
    snapshots.lastCycleError = opts.error;
  },

  updateOSStatus(osStatus: any) {
    snapshots.osStatus = osStatus;
  },

  updateCivicStatus(civicStatus: any) {
    snapshots.civicStatus = civicStatus;
  },

  updateEconStatus(econStatus: any) {
    snapshots.econStatus = econStatus;
  },

  getStatus(): RuntimeBridgeStatus {
    return {
      initialized,
      snapshots,
    };
  },
};

