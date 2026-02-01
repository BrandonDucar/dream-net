import type { SlugMetricSample, SlugMetricSnapshot, SlugTimeConfig } from '../types.js';

const samplesByKey: Map<string, SlugMetricSample[]> = new Map();
const snapshotsByKey: Map<string, SlugMetricSnapshot> = new Map();

let config: SlugTimeConfig = {
  decayHalfLifeMs: 1000 * 60 * 60 * 24, // default: 24h half-life
  maxSamplesPerKey: 512,
};

export const SlugMemoryStore = {
  configure(partial: Partial<SlugTimeConfig>) {
    config = { ...config, ...partial };
  },

  getConfig(): SlugTimeConfig {
    return config;
  },

  addSample(sample: SlugMetricSample) {
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

  getSamples(): Map<string, SlugMetricSample[]> {
    return samplesByKey;
  },

  updateSnapshot(key: string, snapshot: SlugMetricSnapshot) {
    snapshotsByKey.set(key, snapshot);
  },

  getSnapshots(): Map<string, SlugMetricSnapshot> {
    return snapshotsByKey;
  },

  status(): { totalSamples: number; snapshotCount: number } {
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

