"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recomputeSnapshots = recomputeSnapshots;
const slugMemoryStore_1 = require("../store/slugMemoryStore");
function recomputeSnapshots(now) {
    const samplesByKey = slugMemoryStore_1.SlugMemoryStore.getSamples();
    for (const [key, samples] of samplesByKey.entries()) {
        if (!samples.length)
            continue;
        // Basic average for now; decay will be applied elsewhere
        const sum = samples.reduce((acc, s) => acc + s.value * (s.weight ?? 1), 0);
        const weightSum = samples.reduce((acc, s) => acc + (s.weight ?? 1), 0) || 1;
        const avg = sum / weightSum;
        const lastUpdatedAt = samples[samples.length - 1]?.createdAt ?? now;
        const [kind, metricKey] = key.split(":");
        const snapshot = {
            key: metricKey,
            kind: kind,
            avg,
            count: samples.length,
            lastUpdatedAt,
        };
        slugMemoryStore_1.SlugMemoryStore.updateSnapshot(key, snapshot);
    }
}
