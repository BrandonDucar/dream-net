let lastRunAt = null;
let lastSnapshot = null;
const defaultVersion = {
    major: 0,
    minor: 4,
    patch: 0,
    label: "Tier IV Scaffold",
};
const defaultHealth = {
    infraHealth: 0.5,
    economyHealth: 0.5,
    socialHealth: 0.5,
    dreamPipelineHealth: 0.5,
};
export const OSStore = {
    setSnapshot(snapshot) {
        lastSnapshot = snapshot;
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    getStatus() {
        const snapshot = lastSnapshot ?? {
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
//# sourceMappingURL=osStore.js.map