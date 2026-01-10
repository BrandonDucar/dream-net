import type { QALContext, QALPrediction } from "../types";

export function predictPRHotspots(ctx: QALContext): QALPrediction[] {
  const now = Date.now();

  return [
    {
      id: `pr-${now}`,
      type: "pr-hotspot",
      confidence: 0.3,
      etaMs: 15 * 60 * 1000,
      meta: {
        reason: "placeholder heuristic: anticipate review/merge bursts",
      },
      createdAt: now,
    },
  ];
}

