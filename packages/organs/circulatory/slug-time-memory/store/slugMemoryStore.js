const samplesByKey = new Map();
const snapshotsByKey = new Map();
let config = {
    decayHalfLifeMs: 1000 * 60 * 60 * 24, // default: 24h half-life
    maxSamplesPerKey: 512,
};
export const SlugMemoryStore = {
    configure(partial) {
        config = { ...config, ...partial };
    },
    getConfig() {
        return config;
    },
    addSample(sample) {
        const key = `${sample.kind}:${sample.key}`;
        const list = samplesByKey.get(key) ?? [];
        list.push(sample);
        // Trim if above maxSamplesPerKey
        const max = config.maxSamplesPerKey ?? 512;
        if (list.length > max) {
            list.splice(0, list.length - max);
        }
        samplesByKey.set(key, list);
    },
    getSamples() {
        return samplesByKey;
    },
    updateSnapshot(key, snapshot) {
        snapshotsByKey.set(key, snapshot);
    },
    getSnapshots() {
        return snapshotsByKey;
    },
    status() {
        let totalSamples = 0;
        for (const list of samplesByKey.values()) {
            totalSamples += list.length;
        }
        return {
            totalSamples,
            snapshotCount: snapshotsByKey.size,
        };
    },
};
//# sourceMappingURL=slugMemoryStore.js.map