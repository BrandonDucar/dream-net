import { SlugMemoryStore } from "../store/slugMemoryStore";
export function recomputeSnapshots(now) {
    const samplesByKey = SlugMemoryStore.getSamples();
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
        SlugMemoryStore.updateSnapshot(key, snapshot);
    }
}
