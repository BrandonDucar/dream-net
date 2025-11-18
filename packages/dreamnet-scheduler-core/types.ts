/**
 * DreamNet Scheduler Core Types
 * Cron-based scheduled operations
 */

export type ScheduleType = "cron" | "interval" | "once";

export interface ScheduledTask {
  id: string;
  name: string;
  type: ScheduleType;
  schedule: string; // Cron expression or interval in ms
  enabled: boolean;
  action: string; // Action to perform (e.g., "kill_switch:enable", "rate_limit:update")
  params: Record<string, any>;
  lastRun?: number;
  nextRun?: number;
  runCount: number;
  errorCount: number;
  lastError?: string;
}

export interface TaskExecution {
  taskId: string;
  startedAt: number;
  completedAt?: number;
  success: boolean;
  error?: string;
  result?: any;
}

