/**
 * 🐾 DREAMNET TASK DISPATCHER
 * 
 * Enables Clawedette → Redis Queue → Sable (Executor) workflow
 * This is the CRITICAL PIECE that was missing.
 * 
 * PRIORITY: ACTIVATE IMMEDIATELY
 */

import Redis from 'ioredis';
import axios from 'axios';

interface Task {
  id: string;
  type: 'benchmark' | 'computation' | 'analysis' | 'training';
  payload: any;
  priority?: number;
  deadline?: Date;
  reward?: number;
}

class TaskDispatcher {
  private redis: Redis.Redis;
  private sableUrl: string;
  private pollInterval: number;
  private isRunning: boolean = false;
  private dispatchLog: Task[] = [];

  constructor(
    redisUrl: string = process.env.REDIS_URL || 'redis://nerve:6379',
    sableUrl: string = process.env.SABLE_URL || 'http://dreamnet_openclaw_sable:18790'
  ) {
    this.redis = new Redis(redisUrl);
    this.sableUrl = sableUrl;
    this.pollInterval = parseInt(process.env.POLL_INTERVAL || '5000');
  }

  /**
   * Start the task dispatch loop
   * Polls Redis queue every N milliseconds
   */
  async start() {
    if (this.isRunning) {
      console.log('⚠️  TaskDispatcher already running');
      return;
    }

    this.isRunning = true;
    console.log(`🚀 TaskDispatcher started (poll interval: ${this.pollInterval}ms)`);

    // Start polling
    this.pollLoop();
  }

  /**
   * Main polling loop - check queue and dispatch
   */
  private pollLoop() {
    if (!this.isRunning) return;

    setInterval(async () => {
      try {
        await this.checkAndDispatch();
      } catch (error) {
        console.error('❌ Task dispatch error:', error);
      }
    }, this.pollInterval);
  }

  /**
   * Check queue and dispatch tasks
   */
  private async checkAndDispatch() {
    try {
      // Check queue length
      const queueLength = await this.redis.llen('tasks:queue');

      if (queueLength === 0) {
        return; // No tasks to dispatch
      }

      // Get tasks from queue (up to 10 at a time)
      const tasks: string[] = await this.redis.lrange('tasks:queue', 0, 9);

      for (const taskStr of tasks) {
        try {
          const task = JSON.parse(taskStr);
          
          // Dispatch to Sable
          await this.dispatchToSable(task);

          // Remove from queue after successful dispatch
          await this.redis.lrem('tasks:queue', 1, taskStr);

          console.log(`✅ Task dispatched: ${task.id}`);
        } catch (taskError) {
          console.error('Error processing individual task:', taskError);
        }
      }
    } catch (error) {
      console.error('Error in checkAndDispatch:', error);
    }
  }

  /**
   * Dispatch task to Sable executor
   */
  private async dispatchToSable(task: Task) {
    try {
      const response = await axios.post(`${this.sableUrl}/execute`, {
        ...task,
        timestamp: Date.now(),
        dispatchedBy: 'clawedette',
        dispatchedAt: new Date().toISOString()
      }, {
        timeout: 10000
      });

      // Log successful dispatch
      await this.logDispatch(task, 'success');

      // Track in Redis
      await this.redis.lpush('dispatch:log', JSON.stringify({
        taskId: task.id,
        dispatchedAt: new Date().toISOString(),
        executor: 'sable',
        status: 'dispatched'
      }));

      // Increment dispatch counter
      await this.redis.incr('tasks:dispatched');

      return response.data;
    } catch (error) {
      console.error(`Failed to dispatch task ${task.id}:`, error);
      
      // Log failure
      await this.logDispatch(task, 'failed');

      // Put back in queue for retry
      await this.redis.rpush('tasks:queue', JSON.stringify(task));

      throw error;
    }
  }

  /**
   * Log dispatch events for monitoring
   */
  private async logDispatch(task: Task, status: 'success' | 'failed') {
    const logEntry = {
      taskId: task.id,
      timestamp: new Date().toISOString(),
      status,
      type: task.type
    };

    this.dispatchLog.push(task);
    await this.redis.lpush('dispatch:history', JSON.stringify(logEntry));
  }

  /**
   * Get dispatch statistics
   */
  async getStats() {
    const dispatched = await this.redis.get('tasks:dispatched') || '0';
    const completed = await this.redis.get('tasks:completed') || '0';
    const failed = await this.redis.get('tasks:failed') || '0';

    return {
      dispatched: parseInt(dispatched),
      completed: parseInt(completed),
      failed: parseInt(failed),
      isRunning: this.isRunning
    };
  }

  /**
   * Gracefully stop the dispatcher
   */
  async stop() {
    this.isRunning = false;
    console.log('🛑 TaskDispatcher stopped');
  }
}

export default TaskDispatcher;
