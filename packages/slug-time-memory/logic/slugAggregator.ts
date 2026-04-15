import { SlugMemoryStore } from "../store/slugMemoryStore";
import type { SlugMetricSnapshot } from "../types";

export function recomputeSnapshots(now: number) {
  const samplesByKey = SlugMemoryStore.getSamples();

  for (const [key, samples] of samplesByKey.entries()) {
    if (!samples.length) continue;

    // Basic average for now; decay will be applied elsewhere
    const sum = samples.reduce((acc, s) => acc + s.value * (s.weight ?? 1), 0);
    const weightSum = samples.reduce((acc, s) => acc + (s.weight ?? 1), 0) || 1;
    const avg = sum / weightSum;

    const lastUpdatedAt =
      samples[samples.length - 1]?.createdAt ?? now;

    const [kind, metricKey] = key.split(":");

    const snapshot: SlugMetricSnapshot = {
      key: metricKey,
      kind: kind as any,
      avg,
      count: samples.length,
      lastUpdatedAt,
    };

    SlugMemoryStore.updateSnapshot(key, snapshot);
  }
}

