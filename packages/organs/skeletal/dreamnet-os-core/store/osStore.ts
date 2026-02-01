import type { DreamNetOSStatus, DreamNetOSSnapshot, DreamNetVersionInfo, GlobalHealthScores } from '../types.js';

let lastRunAt: number | null = null;
let lastSnapshot: DreamNetOSSnapshot | null = null;

const defaultVersion: DreamNetVersionInfo = {
  major: 0,
  minor: 4,
  patch: 0,
  label: "Tier IV Scaffold",
};

const defaultHealth: GlobalHealthScores = {
  infraHealth: 0.5,
  economyHealth: 0.5,
  socialHealth: 0.5,
  dreamPipelineHealth: 0.5,
};

export const OSStore = {
  setSnapshot(snapshot: DreamNetOSSnapshot) {
    lastSnapshot = snapshot;
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  getStatus(): DreamNetOSStatus {
    const snapshot: DreamNetOSSnapshot =
      lastSnapshot ?? {
        version: defaultVersion,
        heartbeatAt: Date.now(),
        globalHealth: defaultHealth,
        subsystems: [],
      };

    return {
      lastRunAt,
      snapshot,
    };
  },
};

