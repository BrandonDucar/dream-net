import type { WolfContext, WolfSignal } from "../types";

export function detectAnomalies(ctx: WolfContext): WolfSignal[] {
  const now = Date.now();
  const signals: WolfSignal[] = [];

  // Placeholder heuristic: if we have Halo-Loop or Swarm Patrol, assume potential anomalies
  if (ctx.haloLoop) {
    signals.push({
      id: `wolf-anomaly-halo-${now}`,
      type: "anomaly",
      targetType: "service",
      targetId: "halo-loop",
      severity: 0.4,
      confidence: 0.5,
      meta: {
        reason: "Baseline anomaly scan: Halo-Loop under observation",
      },
      createdAt: now,
    });
  }

  if (ctx.swarmPatrol) {
    signals.push({
      id: `wolf-anomaly-swarm-${now}`,
      type: "anomaly",
      targetType: "service",
      targetId: "swarm-patrol",
      severity: 0.5,
      confidence: 0.6,
      meta: {
        reason: "Baseline anomaly scan: Swarm Patrol under observation",
      },
      createdAt: now,
    });
  }

  // Optional: incorporate QAL predictions as early "scent" signals
  if (ctx.quantumAnticipation?.status) {
    const qalStatus = ctx.quantumAnticipation.status();
    signals.push({
      id: `wolf-anomaly-qal-${now}`,
      type: "anomaly",
      targetType: "service",
      targetId: "qal",
      severity: 0.3,
      confidence: 0.5,
      meta: {
        reason: "QAL status checked as part of anomaly baseline",
        qalStatus,
      },
      createdAt: now,
    });
  }

  if (!signals.length) {
    return [
      {
        id: `wolf-anomaly-noop-${now}`,
        type: "noop",
        targetType: "unknown",
        severity: 0,
        confidence: 0,
        createdAt: now,
      },
    ];
  }

  return signals;
}

