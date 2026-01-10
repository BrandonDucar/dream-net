/**
 * DreamNet Scheduler Core
 * Cron-based scheduled operations
 */

import { TaskScheduler } from './logic/scheduler.js';
import type { ScheduledTask, TaskExecution } from './types.js';

const scheduler = new TaskScheduler();
const tasks: Map<string, ScheduledTask> = new Map();
const taskIntervals = new Map<string, NodeJS.Timeout>();

export const DreamNetSchedulerCore = {
  /**
   * Register a scheduled task
   */
  registerTask(task: ScheduledTask): void {
    tasks.set(task.id, task);
    
    if (task.enabled) {
      this.startTask(task.id);
    }
  },

  /**
   * Start a task
   */
  startTask(taskId: string): void {
    const task = tasks.get(taskId);
    if (!task || !task.enabled) {
      return;
    }

    // Clear existing interval
    const existing = taskIntervals.get(taskId);
    if (existing) {
      clearInterval(existing);
    }

    // Calculate next run
    task.nextRun = scheduler.calculateNextRun(task);
    tasks.set(taskId, task);

    // Schedule execution
    const scheduleExecution = () => {
      const currentTask = tasks.get(taskId);
      if (!currentTask || !currentTask.enabled) {
        return;
      }

      if (Date.now() >= (currentTask.nextRun || 0)) {
        scheduler.executeTask(currentTask).then((execution) => {
          currentTask.lastRun = execution.startedAt;
          currentTask.runCount++;
          if (!execution.success) {
            currentTask.errorCount++;
            currentTask.lastError = execution.error;
          }
          currentTask.nextRun = scheduler.calculateNextRun(currentTask);
          tasks.set(taskId, currentTask);
        });
      }
    };

    // Run immediately if scheduled
    if (task.type === "once" && task.nextRun <= Date.now()) {
      scheduleExecution();
    }

    // Set up interval for periodic checks
    const interval = setInterval(scheduleExecution, 60000); // Check every minute
    taskIntervals.set(taskId, interval);
  },

  /**
   * Stop a task
   */
  stopTask(taskId: string): void {
    const interval = taskIntervals.get(taskId);
    if (interval) {
      clearInterval(interval);
      taskIntervals.delete(taskId);
    }

    const task = tasks.get(taskId);
    if (task) {
      task.enabled = false;
      tasks.set(taskId, task);
    }
  },

  /**
   * Get all tasks
   */
  getAllTasks(): ScheduledTask[] {
    return Array.from(tasks.values());
  },

  /**
   * Get task by ID
   */
  getTask(taskId: string): ScheduledTask | undefined {
    return tasks.get(taskId);
  },
};

export * from './types.js';
export default DreamNetSchedulerCore;

