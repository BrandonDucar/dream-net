const activeTargetIds = new Set();
export const TargetTracker = {
    trackFromSignals(signals) {
        signals.forEach((signal) => {
            if (signal.targetId && signal.type !== "noop") {
                activeTargetIds.add(signal.targetId);
            }
        });
    },
    listTargets() {
        return Array.from(activeTargetIds);
    },
    clearTarget(targetId) {
        activeTargetIds.delete(targetId);
    },
    clearAll() {
        activeTargetIds.clear();
    },
};
