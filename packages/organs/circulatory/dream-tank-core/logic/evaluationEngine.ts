import type {
  DreamTankContext,
  DreamIncubation,
  DreamEvaluation,
  EvaluationKind,
} from '../types.js';
import { TankStore } from '../store/tankStore.js';

let evalCounter = 0;
function nextEvalId(): string {
  evalCounter += 1;
  return `eval-${Date.now()}-${evalCounter}`;
}

export function evaluateDream(
  ctx: DreamTankContext,
  dream: DreamIncubation,
  kind: EvaluationKind = "health-check"
): DreamEvaluation {
  const now = Date.now();

  // Basic heuristic scores
  const priority = dream.priorityScore ?? 0.5;
  const trust = dream.trustScore ?? 0.5;
  const risk = dream.riskScore ?? 0.5;

  // If FieldLayer is present, refine risk/priority
  if (ctx.fieldLayer?.sample) {
    const priSample = ctx.fieldLayer.sample("dreamPriority", {
      kind: "dream",
      id: `dream:${dream.id}`,
    });
    if (priSample?.value != null) {
      dream.priorityScore = priSample.value;
    }

    const riskSample = ctx.fieldLayer.sample("risk", {
      kind: "dream",
      id: `dream:${dream.id}`,
    });
    if (riskSample?.value != null) {
      dream.riskScore = riskSample.value;
    }
  }

  const effectivePriority = dream.priorityScore ?? priority;
  const effectiveRisk = dream.riskScore ?? risk;
  const effectiveTrust = dream.trustScore ?? trust;

  // Simple combined score heuristic
  const score = Math.max(
    0,
    Math.min(
      1,
      0.5 * effectivePriority +
        0.3 * effectiveTrust +
        0.2 * (1 - effectiveRisk)
    )
  );

  const summary = `Dream '${dream.name}' evaluated with score=${score.toFixed(
    2
  )}, priority=${effectivePriority.toFixed(
    2
  )}, trust=${effectiveTrust.toFixed(
    2
  )}, risk=${effectiveRisk.toFixed(2)}.`;

  const evaluation: DreamEvaluation = {
    id: nextEvalId(),
    dreamId: dream.id,
    kind,
    summary,
    score,
    createdAt: now,
    meta: {
      stage: dream.stage,
      health: dream.health,
      priority: effectivePriority,
      trust: effectiveTrust,
      risk: effectiveRisk,
    },
  };

  TankStore.addEvaluation(evaluation);
  return evaluation;
}

