import type { SlugTimeContext, SlugTimeStatus } from "../types";
import { SlugMemoryStore } from "../store/slugMemoryStore";
import { recomputeSnapshots } from "../logic/slugAggregator";
import { applyDecay } from "../logic/slugDecay";

let lastRunAt: number | null = null;

export function runSlugTimeCycle(ctx: SlugTimeContext) {
  const now = Date.now();
  const config = SlugMemoryStore.getConfig();

  // 1) Aggregate raw samples into snapshots
  recomputeSnapshots(now);

  // 2) Apply decay to snapshots so old data matters less
  applyDecay(now, config);

  lastRunAt = now;

  // 3) Optional: push a summary into Neural Mesh
  if (ctx.neuralMesh?.remember) {
    const status = SlugMemoryStore.status();
    ctx.neuralMesh.remember({
      source: "SlugTimeMemory",
      status,
      timestamp: now,
    });
  }

  return slugTimeStatus();
}

export function slugTimeStatus(): SlugTimeStatus {
  const storeStatus = SlugMemoryStore.status();

  return {
    lastRunAt,
    totalSamples: storeStatus.totalSamples,
    snapshotCount: storeStatus.snapshotCount,
  };
}

