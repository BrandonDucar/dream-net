import {
  SignalThread,
  SpiderInsight,
  SpiderWebStatus,
  Fly,
  WebSensor,
  ThreadTemplate,
  ThreadPattern,
  FlyPattern,
  ThreadPriority,
} from '../types.js';

const threads: Map<string, SignalThread> = new Map();
const insights: SpiderInsight[] = [];
const flies: Map<string, Fly> = new Map();
const sensors: Map<string, WebSensor> = new Map();
const templates: Map<string, ThreadTemplate> = new Map();
const threadPatterns: Map<string, ThreadPattern> = new Map();
const flyPatterns: Map<string, FlyPattern> = new Map();

let lastRunAt: number | null = null;
let fliesCaughtToday = 0;
let lastDayReset = new Date().getDate();

function resetDailyFlyCount() {
  const today = new Date().getDate();
  if (today !== lastDayReset) {
    fliesCaughtToday = 0;
    lastDayReset = today;
  }
}

export const SpiderStore = {
  // Threads
  addThread(thread: SignalThread): SignalThread {
    threads.set(thread.id, thread);
    return thread;
  },

  updateThread(thread: SignalThread): SignalThread {
    threads.set(thread.id, thread);
    return thread;
  },

  getThread(id: string): SignalThread | undefined {
    return threads.get(id);
  },

  listThreads(): SignalThread[] {
    return Array.from(threads.values());
  },

  listThreadsByStatus(status: SignalThread["status"]): SignalThread[] {
    return Array.from(threads.values()).filter((t) => t.status === status);
  },

  listThreadsByPriority(priority: ThreadPriority): SignalThread[] {
    return Array.from(threads.values()).filter((t) => t.priority === priority);
  },

  // Flies
  catchFly(fly: Fly): Fly {
    resetDailyFlyCount();
    flies.set(fly.id, fly);
    fliesCaughtToday += 1;
    return fly;
  },

  getFly(id: string): Fly | undefined {
    return flies.get(id);
  },

  listFlies(): Fly[] {
    return Array.from(flies.values());
  },

  listUnprocessedFlies(): Fly[] {
    return Array.from(flies.values()).filter((f) => !f.processed);
  },

  listStickyFlies(): Fly[] {
    return Array.from(flies.values()).filter((f) => f.sticky);
  },

  markFlyProcessed(flyId: string, threadId?: string): boolean {
    const fly = flies.get(flyId);
    if (!fly) return false;
    fly.processed = true;
    if (threadId) fly.threadId = threadId;
    flies.set(flyId, fly);
    return true;
  },

  // Sensors
  addSensor(sensor: WebSensor): WebSensor {
    sensors.set(sensor.id, sensor);
    return sensor;
  },

  getSensor(id: string): WebSensor | undefined {
    return sensors.get(id);
  },

  updateSensor(sensor: WebSensor): WebSensor {
    sensors.set(sensor.id, sensor);
    return sensor;
  },

  listSensors(): WebSensor[] {
    return Array.from(sensors.values());
  },

  listActiveSensors(): WebSensor[] {
    return Array.from(sensors.values()).filter((s) => s.active);
  },

  updateSensorCatchRate(sensorId: string, catchRate: number): boolean {
    const sensor = sensors.get(sensorId);
    if (!sensor) return false;
    sensor.catchRate = catchRate;
    sensors.set(sensorId, sensor);
    return true;
  },

  // Templates
  addTemplate(template: ThreadTemplate): ThreadTemplate {
    templates.set(template.id, template);
    return template;
  },

  getTemplate(id: string): ThreadTemplate | undefined {
    return templates.get(id);
  },

  listTemplates(): ThreadTemplate[] {
    return Array.from(templates.values());
  },

  updateTemplateUsage(templateId: string, success: boolean): boolean {
    const template = templates.get(templateId);
    if (!template) return false;
    template.usageCount += 1;
    if (success) {
      template.successRate = (template.successRate * (template.usageCount - 1) + 1) / template.usageCount;
    } else {
      template.successRate = (template.successRate * (template.usageCount - 1)) / template.usageCount;
    }
    template.updatedAt = Date.now();
    templates.set(templateId, template);
    return true;
  },

  // Thread Patterns
  addThreadPattern(pattern: ThreadPattern): ThreadPattern {
    threadPatterns.set(pattern.id, pattern);
    return pattern;
  },

  getThreadPattern(id: string): ThreadPattern | undefined {
    return threadPatterns.get(id);
  },

  listThreadPatterns(): ThreadPattern[] {
    return Array.from(threadPatterns.values());
  },

  // Fly Patterns
  addFlyPattern(pattern: FlyPattern): FlyPattern {
    flyPatterns.set(pattern.id, pattern);
    return pattern;
  },

  getFlyPattern(id: string): FlyPattern | undefined {
    return flyPatterns.get(id);
  },

  listFlyPatterns(): FlyPattern[] {
    return Array.from(flyPatterns.values());
  },

  // Insights
  addInsight(insight: SpiderInsight): SpiderInsight {
    insights.push(insight);
    if (insights.length > 1000) {
      insights.shift();
    }
    return insight;
  },

  listInsights(): SpiderInsight[] {
    return insights;
  },

  listRecentInsights(limit: number = 20): SpiderInsight[] {
    return insights.slice(-limit).reverse();
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): SpiderWebStatus {
    resetDailyFlyCount();
    const allThreads = Array.from(threads.values());
    const pendingCount = allThreads.filter((t) => t.status === "pending").length;
    const inProgressCount = allThreads.filter((t) => t.status === "in-progress").length;
    const completedCount = allThreads.filter((t) => t.status === "completed").length;
    const failedCount = allThreads.filter((t) => t.status === "failed").length;
    
    const completedThreads = allThreads.filter((t) => t.status === "completed" && t.executedAt);
    const avgExecutionTime = completedThreads.length > 0
      ? completedThreads.reduce((sum, t) => sum + ((t.executedAt || t.updatedAt) - t.createdAt), 0) / completedThreads.length
      : 0;
    
    const threadSuccessRate = allThreads.length > 0
      ? completedCount / allThreads.length
      : 0;

    const allFlies = Array.from(flies.values());
    const stickyFlyCount = allFlies.filter((f) => f.sticky).length;
    const activeSensorsList = this.listActiveSensors();

    const sampleThreads = allThreads.slice(-20).reverse();
    const sampleInsights = this.listRecentInsights(20);
    const sampleFlies = allFlies.slice(-20).reverse();

    return {
      lastRunAt,
      threadCount: allThreads.length,
      pendingCount,
      inProgressCount,
      completedCount,
      failedCount,
      insightCount: insights.length,
      flyCount: allFlies.length,
      fliesCaughtToday,
      stickyFlyCount,
      activeSensors: activeSensorsList.length,
      avgExecutionTime,
      threadSuccessRate,
      templateCount: templates.size,
      patternCount: threadPatterns.size + flyPatterns.size,
      sampleThreads,
      sampleInsights,
      sampleFlies,
      activeSensorsList,
    };
  },
};
