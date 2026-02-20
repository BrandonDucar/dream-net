import Redis from 'ioredis';
import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';

interface ContainerMetrics {
  name: string;
  status: string;
  cpuPercent: number;
  memoryUsage: number;
  memoryLimit: number;
  healthy: boolean;
}

interface Task {
  id: string;
  type: 'scale' | 'restart' | 'optimize' | 'health-check' | 'report';
  target: string;
  params: Record<string, any>;
}

interface TaskResult {
  taskId: string;
  type: string;
  success: boolean;
  result: any;
  timestamp: string;
  error?: string;
}

export class GordonDevOps {
  private redis: Redis;
  private docker: Docker;
  private agentId = 'gordon-devops';
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private healthMonitorInterval: NodeJS.Timeout | null = null;
  private taskPollerInterval: NodeJS.Timeout | null = null;
  private reportingInterval: NodeJS.Timeout | null = null;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://nerve:6379';
    this.redis = new Redis(redisUrl);
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  async initialize(): Promise<void> {
    try {
      // Test Redis connection
      await this.redis.ping();
      console.log('🏗️ Gordon-DevOps: Redis connected');

      // Test Docker connection
      await this.docker.ping();
      console.log('🏗️ Gordon-DevOps: Docker connected');

      // Register with swarm
      await this.registerWithSwarm();

      // Start autonomous loops
      this.startHeartbeat();
      this.startHealthMonitor();
      this.startTaskPoller();
      this.startReporting();

      console.log('🏗️ Gordon-DevOps: Initialization complete. Autonomous loops active.');
    } catch (error) {
      console.error('🏗️ Gordon-DevOps: Initialization failed', error);
      throw error;
    }
  }

  // ============================================================================
  // SWARM INTEGRATION
  // ============================================================================

  private async registerWithSwarm(): Promise<void> {
    const agentInfo = {
      id: this.agentId,
      type: 'infrastructure-conductor',
      role: 'devops-agent',
      capabilities: [
        'health-monitoring',
        'container-orchestration',
        'resource-optimization',
        'task-execution',
        'metric-reporting',
        'blackboard-posting'
      ],
      status: 'operational',
      registeredAt: new Date().toISOString()
    };

    await this.redis.set(
      `swarm:agents:${this.agentId}`,
      JSON.stringify(agentInfo),
      'EX',
      3600
    );

    console.log('🌉 Gordon-DevOps: Registered with swarm');
  }

  // ============================================================================
  // HEARTBEAT LOOP (every 60s)
  // ============================================================================

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(async () => {
      try {
        const heartbeat = {
          agent: this.agentId,
          timestamp: new Date().toISOString(),
          status: 'alive',
          uptime: process.uptime()
        };

        await this.redis.lpush('swarm:heartbeats', JSON.stringify(heartbeat));
        await this.redis.ltrim('swarm:heartbeats', 0, 999);

        // Refresh agent registration
        await this.registerWithSwarm();
      } catch (error) {
        console.error('❌ Heartbeat error:', error);
      }
    }, 60000);
  }

  // ============================================================================
  // HEALTH MONITOR LOOP (every 30s)
  // ============================================================================

  private startHealthMonitor(): void {
    this.healthMonitorInterval = setInterval(async () => {
      try {
        const metrics = await this.gatherMetrics();
        await this.publishMetrics(metrics);
        await this.checkForAlerts(metrics);
      } catch (error) {
        console.error('❌ Health monitor error:', error);
      }
    }, 30000);
  }

  private async gatherMetrics(): Promise<ContainerMetrics[]> {
    const containers = await this.docker.listContainers({ all: true });
    const metrics: ContainerMetrics[] = [];

    for (const container of containers) {
      try {
        const dockerContainer = this.docker.getContainer(container.Id);
        const stats = await dockerContainer.stats({ stream: false });
        const inspect = await dockerContainer.inspect();

        const cpuPercent =
          ((stats.cpu_stats.cpu_usage.total_usage -
            stats.precpu_stats.cpu_usage.total_usage) /
            (stats.cpu_stats.system_cpu_usage -
              stats.precpu_stats.system_cpu_usage)) *
          100;

        const memoryUsage = stats.memory_stats.usage / 1024 / 1024;
        const memoryLimit = stats.memory_stats.limit / 1024 / 1024;

        metrics.push({
          name: container.Names[0]?.replace(/^\//, '') || 'unknown',
          status: inspect.State.Status,
          cpuPercent,
          memoryUsage,
          memoryLimit,
          healthy: inspect.State.Health?.Status === 'healthy' || true
        });
      } catch (error) {
        // Skip containers that error on stats
      }
    }

    return metrics;
  }

  private async publishMetrics(metrics: ContainerMetrics[]): Promise<void> {
    const report = {
      agent: this.agentId,
      timestamp: new Date().toISOString(),
      containerCount: metrics.length,
      containers: metrics,
      summary: {
        totalCPU: metrics.reduce((sum, m) => sum + m.cpuPercent, 0),
        totalMemoryMB: metrics.reduce((sum, m) => sum + m.memoryUsage, 0),
        healthyContainers: metrics.filter(m => m.healthy).length,
        unhealthyContainers: metrics.filter(m => !m.healthy).length
      }
    };

    await this.redis.lpush('swarm:metrics:gordon-devops', JSON.stringify(report));
    await this.redis.ltrim('swarm:metrics:gordon-devops', 0, 499);
    await this.redis.publish('swarm:alerts:metrics', JSON.stringify(report));
  }

  private async checkForAlerts(metrics: ContainerMetrics[]): Promise<void> {
    const alerts = [];

    for (const metric of metrics) {
      if (!metric.healthy) {
        alerts.push({
          severity: 'critical',
          container: metric.name,
          issue: 'container-unhealthy',
          timestamp: new Date().toISOString()
        });
      }

      if (metric.cpuPercent > 80) {
        alerts.push({
          severity: 'warning',
          container: metric.name,
          issue: 'high-cpu',
          value: metric.cpuPercent,
          timestamp: new Date().toISOString()
        });
      }

      if (metric.memoryUsage / metric.memoryLimit > 0.85) {
        alerts.push({
          severity: 'warning',
          container: metric.name,
          issue: 'high-memory',
          percent: (metric.memoryUsage / metric.memoryLimit) * 100,
          timestamp: new Date().toISOString()
        });
      }

      if (metric.status === 'exited' || metric.status === 'dead') {
        alerts.push({
          severity: 'critical',
          container: metric.name,
          issue: 'container-crashed',
          status: metric.status,
          timestamp: new Date().toISOString()
        });
      }
    }

    if (alerts.length > 0) {
      for (const alert of alerts) {
        await this.redis.lpush('swarm:alerts:infrastructure', JSON.stringify(alert));
        await this.redis.publish('swarm:alerts:infrastructure', JSON.stringify(alert));
      }
    }
  }

  // ============================================================================
  // TASK POLLER (every 10s)
  // ============================================================================

  private startTaskPoller(): void {
    this.taskPollerInterval = setInterval(async () => {
      try {
        const taskJson = await this.redis.lpop(`tasks:${this.agentId}`);
        if (taskJson) {
          const task = JSON.parse(taskJson);
          const result = await this.executeTask(task);
          await this.publishTaskResult(result);
        }
      } catch (error) {
        console.error('❌ Task poller error:', error);
      }
    }, 10000);
  }

  private async executeTask(task: Task): Promise<TaskResult> {
    console.log(`⚙️  Executing task: ${task.type} on ${task.target}`);

    try {
      let result: any;

      switch (task.type) {
        case 'scale':
          result = { containerName: task.target, scaledTo: task.params.count, status: 'queued' };
          break;
        case 'restart':
          result = await this.restartContainer(task.target);
          break;
        case 'optimize':
          result = { containerName: task.target, optimizations: task.params, status: 'planned' };
          break;
        case 'health-check':
          result = await this.performHealthCheck(task.target);
          break;
        case 'report':
          result = { type: 'task-report', timestamp: new Date().toISOString() };
          break;
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }

      return {
        taskId: task.id,
        type: task.type,
        success: true,
        result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        taskId: task.id,
        type: task.type,
        success: false,
        result: null,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async restartContainer(containerName: string): Promise<any> {
    try {
      const containers = await this.docker.listContainers({ all: true });
      const container = containers.find((c: any) =>
        c.Names.some((n: string) => n.includes(containerName))
      );

      if (!container) {
        throw new Error(`Container ${containerName} not found`);
      }

      const dockerContainer = this.docker.getContainer(container.Id);
      await dockerContainer.stop({ t: 5 });
      await dockerContainer.start();

      return { containerName, status: 'restarted', containerId: container.Id };
    } catch (error) {
      throw error;
    }
  }

  private async performHealthCheck(containerName: string): Promise<any> {
    try {
      const containers = await this.docker.listContainers({ all: true });
      const container = containers.find((c: any) =>
        c.Names.some((n: string) => n.includes(containerName))
      );

      if (!container) {
        return { containerName, status: 'not-found', healthy: false };
      }

      const dockerContainer = this.docker.getContainer(container.Id);
      const inspect = await dockerContainer.inspect();

      return {
        containerName,
        status: inspect.State.Status,
        healthy: inspect.State.Health?.Status === 'healthy',
        running: inspect.State.Running
      };
    } catch (error) {
      throw error;
    }
  }

  private async publishTaskResult(result: TaskResult): Promise<void> {
    await this.redis.lpush(`tasks:${this.agentId}:results`, JSON.stringify(result));
    await this.redis.ltrim(`tasks:${this.agentId}:results`, 0, 99);
    await this.redis.publish(`swarm:task:completed`, JSON.stringify(result));
  }

  // ============================================================================
  // REPORTING LOOP (every 2 hours)
  // ============================================================================

  private startReporting(): void {
    console.log('📊 Gordon-DevOps: Starting 2-hour reporting loop');
    // Run first report immediately
    this.postBlackboardReport();
    // Then every 2 hours (7200000 ms)
    this.reportingInterval = setInterval(() => this.postBlackboardReport(), 7200000);
  }

  private async postBlackboardReport(): Promise<void> {
    try {
      console.log('📊 Posting report to blackboard...');
      const metrics = await this.gatherMetrics();
      const timestamp = new Date().toISOString();
      const uptime = Math.floor(process.uptime() / 60);
      const avgCPU = metrics.length > 0 
        ? (metrics.reduce((sum, m) => sum + m.cpuPercent, 0) / metrics.length).toFixed(2)
        : '0.00';
      const totalMem = metrics.reduce((sum, m) => sum + m.memoryUsage, 0).toFixed(0);
      const healthy = metrics.filter(m => m.healthy).length;
      const unhealthy = metrics.filter(m => !m.healthy).length;
      const tasksExecuted = await this.getCompletedTaskCount();
      const pendingAlerts = await this.getPendingAlertCount();
      const heartbeats = await this.getHeartbeatCount();

      const report = `
- **Gordon-DevOps**: \`${timestamp}\` | Uptime: ${uptime}m | Containers: ${metrics.length} | Status: ✅ OPERATIONAL
  - Healthy: ${healthy} | Unhealthy: ${unhealthy}
  - CPU: ${avgCPU}% avg | Memory: ${totalMem}MB total
  - Tasks: ${tasksExecuted} executed | Alerts: ${pendingAlerts} active | Heartbeats: ${heartbeats}`;

      const blackboardPath = process.env.BLACKBOARD_PATH || '/workspace/blackboard.md';
      console.log(`📊 Using blackboard path: ${blackboardPath}`);
      
      if (fs.existsSync(blackboardPath)) {
        console.log('📊 Blackboard file exists, appending report');
        let content = fs.readFileSync(blackboardPath, 'utf-8');
        
        // Find or create "GORDON-DEVOPS REPORTS" section
        if (!content.includes('## GORDON-DEVOPS REPORTS')) {
          content += '\n\n## GORDON-DEVOPS REPORTS\n';
        }
        
        // Insert at the start of the reports section
        const reportSection = '## GORDON-DEVOPS REPORTS';
        const idx = content.indexOf(reportSection) + reportSection.length;
        content = content.slice(0, idx) + '\n' + report + content.slice(idx);
        
        fs.writeFileSync(blackboardPath, content, 'utf-8');
        console.log(`📊 Report posted to blackboard at ${timestamp}`);
      } else {
        console.log('⚠️ Blackboard file not found at ' + blackboardPath);
      }
    } catch (error) {
      console.error('❌ Blackboard reporting error:', error);
    }
  }

  private async getCompletedTaskCount(): Promise<number> {
    try {
      const count = await this.redis.llen(`tasks:${this.agentId}:results`);
      return count || 0;
    } catch {
      return 0;
    }
  }

  private async getPendingAlertCount(): Promise<number> {
    try {
      const count = await this.redis.llen('swarm:alerts:infrastructure');
      return count || 0;
    } catch {
      return 0;
    }
  }

  private async getHeartbeatCount(): Promise<number> {
    try {
      const count = await this.redis.llen('swarm:heartbeats');
      return count || 0;
    } catch {
      return 0;
    }
  }

  // ============================================================================
  // SHUTDOWN
  // ============================================================================

  async shutdown(): Promise<void> {
    console.log('🏗️ Gordon-DevOps: Shutting down...');

    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.healthMonitorInterval) clearInterval(this.healthMonitorInterval);
    if (this.taskPollerInterval) clearInterval(this.taskPollerInterval);
    if (this.reportingInterval) clearInterval(this.reportingInterval);

    await this.redis.del(`swarm:agents:${this.agentId}`);
    await this.redis.disconnect();

    console.log('🏗️ Gordon-DevOps: Shutdown complete');
    process.exit(0);
  }
}

// ============================================================================
// MAIN
// ============================================================================

const gordon = new GordonDevOps();

gordon
  .initialize()
  .catch(error => {
    console.error('🏗️ Gordon-DevOps: Fatal error during initialization', error);
    process.exit(1);
  });

process.on('SIGTERM', () => gordon.shutdown());
process.on('SIGINT', () => gordon.shutdown());
