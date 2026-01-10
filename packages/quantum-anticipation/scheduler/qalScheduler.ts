import type { QALContext, QALPrediction } from '../types.js';
import { predictWorkloadSpikes } from '../predictors/workloadPredictor.js';
import { predictFailureRisk } from '../predictors/failurePredictor.js';
import { predictRoutingBottlenecks } from '../predictors/routingPredictor.js';
import { predictPRHotspots } from '../predictors/prPredictor.js';

let lastRunAt: number | null = null;
let lastPredictions: QALPrediction[] = [];

export function runQALCycle(ctx: QALContext): QALPrediction[] {
  const predictions: QALPrediction[] = [
    ...predictWorkloadSpikes(ctx),
    ...predictFailureRisk(ctx),
    ...predictRoutingBottlenecks(ctx),
    ...predictPRHotspots(ctx),
  ];

  lastRunAt = Date.now();
  lastPredictions = predictions;

  // TODO: feed signals into connected systems (neuralMesh, pheromoneStore, etc.)
  if (ctx.neuralMesh?.remember) {
    ctx.neuralMesh.remember({
      source: "QAL",
      predictions,
    });
  }

  // TODO: Send "workload-spike" signals to Ant-Trail Scheduler (pheromone store) to pre-lay trails
  if (ctx.pheromoneStore && predictions.some((p) => p.type === "workload-spike")) {
    // Pre-lay pheromone trails for anticipated workload
    const workloadPredictions = predictions.filter((p) => p.type === "workload-spike");
    for (const pred of workloadPredictions) {
      // TODO: Determine optimal paths and pre-deposit pheromones
      console.log("[QAL] Pre-laying pheromone trail for workload spike:", pred.id);
    }
  }

  // TODO: Send "routing-bottleneck" predictions to Slime-Mold Router to adjust topology preferences
  if (ctx.slimeRouter && predictions.some((p) => p.type === "routing-bottleneck")) {
    const routingPredictions = predictions.filter((p) => p.type === "routing-bottleneck");
    for (const pred of routingPredictions) {
      // TODO: Adjust slime-mold topology to avoid bottlenecks
      console.log("[QAL] Adjusting slime-mold router for bottleneck:", pred.id);
    }
  }

  // TODO: Send "failure-risk" predictions to Swarm Patrol / Halo-Loop as pre-emptive focus targets
  if (ctx.haloLoop && predictions.some((p) => p.type === "failure-risk")) {
    const failurePredictions = predictions.filter((p) => p.type === "failure-risk");
    for (const pred of failurePredictions) {
      // TODO: Trigger Halo-Loop analyzers for predicted failure areas
      console.log("[QAL] Alerting Halo-Loop to failure risk:", pred.id);
    }
  }

  return predictions;
}

export function qalStatus() {
  return {
    lastRunAt,
    lastPredictionsCount: lastPredictions.length,
  };
}

