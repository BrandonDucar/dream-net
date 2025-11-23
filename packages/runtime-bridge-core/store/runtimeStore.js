let initialized = false;
const snapshots = {
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
    isInitialized() {
        return initialized;
    },
    updateCycleInfo(opts) {
        snapshots.lastCycleAt = opts.finishedAt;
        snapshots.lastCycleDurationMs = opts.durationMs;
        snapshots.lastCycleError = opts.error;
    },
    updateOSStatus(osStatus) {
        snapshots.osStatus = osStatus;
    },
    updateCivicStatus(civicStatus) {
        snapshots.civicStatus = civicStatus;
    },
    updateEconStatus(econStatus) {
        snapshots.econStatus = econStatus;
    },
    getStatus() {
        return {
            initialized,
            snapshots,
        };
    },
};
