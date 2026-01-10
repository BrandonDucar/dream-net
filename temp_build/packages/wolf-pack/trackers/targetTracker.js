"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetTracker = void 0;
const activeTargetIds = new Set();
exports.TargetTracker = {
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
