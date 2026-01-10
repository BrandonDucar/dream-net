/**
 * Scheduler
 * Executes scheduled tasks
 */

import type { ScheduledTask, TaskExecution } from "../types";
import { DreamNetControlCore } from "@dreamnet/dreamnet-control-core";
import { DreamNetAuditCore } from "@dreamnet/dreamnet-audit-core";
import { bridgeToSpiderWeb } from "@dreamnet/dreamnet-operational-bridge";

export class TaskScheduler {
  async executeTask(task: ScheduledTask): Promise<TaskExecution> {
    const execution: TaskExecution = {
      taskId: task.id,
      startedAt: Date.now(),
      success: false,
    };

    try {
      const result = await this.performAction(task.action, task.params);
      execution.completedAt = Date.now();
      execution.success = true;
      execution.result = result;

      // Log audit
      DreamNetAuditCore.recordAction("config_changed", {
        taskId: task.id,
        action: task.action,
        params: task.params,
      }, {
        success: true,
      });

      // Bridge to Spider Web
      bridgeToSpiderWeb({
        type: "scheduled_task_executed",
        clusterId: task.params.clusterId,
        severity: "low",
        message: `Scheduled task executed: ${task.name}`,
        metadata: {
          taskId: task.id,
          action: task.action,
        },
        timestamp: Date.now(),
      });
    } catch (error: any) {
      execution.completedAt = Date.now();
      execution.error = error.message;
      execution.success = false;

      // Log audit
      DreamNetAuditCore.recordAction("config_changed", {
        taskId: task.id,
        action: task.action,
        params: task.params,
      }, {
        success: false,
        error: error.message,
      });

      // Bridge failure to Spider Web
      bridgeToSpiderWeb({
        type: "scheduled_task_failed",
        clusterId: task.params.clusterId,
        severity: "high",
        message: `Scheduled task failed: ${task.name} - ${error.message}`,
        metadata: {
          taskId: task.id,
          action: task.action,
          error: error.message,
        },
        timestamp: Date.now(),
      });
    }

    return execution;
  }

  private async performAction(action: string, params: Record<string, any>): Promise<any> {
    const [category, operation] = action.split(":");

    switch (category) {
      case "kill_switch":
        if (operation === "enable") {
          DreamNetControlCore.enableGlobalKillSwitch();
          return { enabled: true };
        } else if (operation === "disable") {
          DreamNetControlCore.disableGlobalKillSwitch();
          return { enabled: false };
        }
        break;

      case "rate_limit":
        if (operation === "update" && params.clusterId && params.limit) {
          const rateLimits = DreamNetControlCore.listRateLimits(params.clusterId as any);
          if (rateLimits.length > 0) {
            DreamNetControlCore.updateRateLimit(rateLimits[0].id, { limit: params.limit });
            return { updated: true };
          }
        }
        break;

      case "cluster":
        // Cluster enable/disable would go here
        break;
    }

    throw new Error(`Unknown action: ${action}`);
  }

  calculateNextRun(task: ScheduledTask): number {
    if (task.type === "once") {
      return task.schedule ? parseInt(task.schedule) : Date.now();
    }

    if (task.type === "interval") {
      const intervalMs = parseInt(task.schedule);
      return (task.lastRun || Date.now()) + intervalMs;
    }

    // Cron parsing would go here (use a cron library in production)
    // For now, return a simple interval
    return Date.now() + 60000; // Default to 1 minute
  }
}

