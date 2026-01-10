import type { OctopusTask, OctopusContext, OctopusArmId } from '../types.js';
import { ArmRegistry } from '../arms/armRegistry.js';

const taskQueue: OctopusTask[] = [];

export function enqueueTask(task: OctopusTask) {
  taskQueue.push(task);
}

export function getQueuedTaskCount(): number {
  return taskQueue.length;
}

export async function runOctopusCycle(ctx: OctopusContext) {
  const arms = ArmRegistry.getAllArms();
  const now = Date.now();

  for (const state of arms) {
    const { config, handler, status } = state;
    if (!config.enabled) continue;

    let parallelLimit = config.maxParallel ?? 1;
    let processedForArm = 0;

    while (parallelLimit > 0 && taskQueue.length > 0) {
      const task = pickTaskForArm(taskQueue, config.id);
      if (!task) break;

      status.activeTasks += 1;
      status.lastRunAt = now;

      try {
        await handler(task, ctx);
        status.processedCount += 1;
      } catch (err) {
        if (ctx.neuralMesh?.remember) {
          ctx.neuralMesh.remember({
            source: "OctopusExecutor",
            arm: config.id,
            task,
            error: String(err),
            timestamp: Date.now(),
          });
        }
      } finally {
        status.activeTasks -= 1;
      }

      processedForArm += 1;
      parallelLimit -= 1;
    }

    if (processedForArm > 0 && ctx.neuralMesh?.remember) {
      ctx.neuralMesh.remember({
        source: "OctopusExecutor",
        arm: config.id,
        processed: processedForArm,
        timestamp: now,
      });
    }
  }
}

function pickTaskForArm(queue: OctopusTask[], armId: OctopusArmId): OctopusTask | undefined {
  // Simple heuristic for now: just shift() from queue.
  // In a later iteration, this can route based on task.type -> armId mapping.
  return queue.shift();
}

