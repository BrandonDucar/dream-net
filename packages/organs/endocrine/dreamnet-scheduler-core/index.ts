/**
 * @dreamnet/dreamnet-scheduler-core — Task Scheduler
 * 
 * Cron-based and event-driven task scheduling for all agents.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'scheduler',
  name: 'DreamNet Scheduler',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['cron-scheduling', 'event-triggers', 'delayed-execution', 'recurring-tasks'],
  metadata: { organ: 'endocrine', role: 'scheduler' },
});

export interface ScheduledTask {
  id: string;
  name: string;
  cronExpr?: string;
  intervalMs?: number;
  targetAgent: string;
  command: string;
  data?: any;
  enabled: boolean;
  lastRun?: number;
  nextRun?: number;
}

const tasks: Map<string, ScheduledTask> = new Map();
const timers: Map<string, NodeJS.Timeout> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function schedule(task: ScheduledTask): void {
  tasks.set(task.id, task);
  if (task.enabled && task.intervalMs) {
    const timer = setInterval(async () => {
      task.lastRun = Date.now();
      await bridge.send(task.targetAgent, `[SCHEDULED] ${task.name}: ${task.command}`, 'command', task.data);
    }, task.intervalMs);
    timers.set(task.id, timer);
  }
}

export function cancel(taskId: string): void {
  const timer = timers.get(taskId);
  if (timer) clearInterval(timer);
  timers.delete(taskId);
  tasks.delete(taskId);
}

export function getTasks(): ScheduledTask[] { return Array.from(tasks.values()); }

export { bridge };
export default { connect, schedule, cancel, getTasks, bridge };
