import type { NarrativeContext, NarrativeStatus } from '../types.js';
import { assembleNarratives } from '../logic/narrativeAssembler.js';
import { NarrativeStore } from '../store/narrativeStore.js';

let lastRunAt: number | null = null;

export function runNarrativeCycle(ctx: NarrativeContext): NarrativeStatus {
  const entries = assembleNarratives(ctx);
  entries.forEach((e) => NarrativeStore.add(e));

  lastRunAt = Date.now();

  // Optional: push a compressed digest into Neural Mesh
  if (ctx.neuralMesh?.remember && entries.length) {
    ctx.neuralMesh.remember({
      source: "NarrativeField",
      count: entries.length,
      lastTitles: entries.slice(-5).map((e) => e.title),
      timestamp: lastRunAt,
    });
  }

  return narrativeStatus();
}

export function narrativeStatus(): NarrativeStatus {
  const st = NarrativeStore.status();

  return {
    lastRunAt,
    entryCount: st.entryCount,
    recentEntries: st.recentEntries,
  };
}

