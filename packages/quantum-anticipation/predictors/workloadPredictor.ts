import type { QALContext, QALPrediction } from '../types.js';

export function predictWorkloadSpikes(ctx: QALContext): QALPrediction[] {
  // TODO: pull real metrics from haloLoop / pheromoneStore when available
  const now = Date.now();

  return [
    {
      id: `workload-${now}`,
      type: "workload-spike",
      confidence: 0.6,
      etaMs: 5 * 60 * 1000, // 5 minutes
      meta: {
        reason: "placeholder heuristic: assume periodic spike",
      },
      createdAt: now,
    },
  ];
}

