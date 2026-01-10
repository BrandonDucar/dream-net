export {
  SpiderNodeKind,
  SpiderNodeRef,
  SignalKind,
  SignalStatus,
  SignalThread,
  SpiderInsightType,
  SpiderInsight,
  SpiderWebContext,
  SpiderWebStatus,
  Fly,
  FlyType,
  FlyPriority,
  WebSensor,
  SensorType,
  ThreadTemplate,
  ThreadPattern,
  FlyPattern,
  ThreadPriority,
} from './types.js';
import { SpiderStore } from './store/spiderStore.js';
import { runSpiderWebCycle } from './scheduler/spiderScheduler.js';
import { catchFly, createFly } from './logic/flyCatcher.js';
import { executeThread, canExecuteThread } from './logic/threadExecutor.js';
import { ensureDefaultTemplates, findMatchingTemplate, applyTemplateToThread } from './logic/threadTemplates.js';
import { ensureDefaultSensors } from './logic/funnelWebSpider.js';

export const SpiderWebCore = {
  // Orchestration
  async run(context: SpiderWebContext): Promise<SpiderWebStatus> {
    return runSpiderWebCycle(context);
  },

  status(): SpiderWebStatus {
    return SpiderStore.status();
  },

  // Threads
  listThreads(): SignalThread[] {
    return SpiderStore.listThreads();
  },

  listThreadsByStatus(status: SignalStatus): SignalThread[] {
    return SpiderStore.listThreadsByStatus(status);
  },

  listThreadsByPriority(priority: ThreadPriority): SignalThread[] {
    return SpiderStore.listThreadsByPriority(priority);
  },

  getThread(id: string): SignalThread | undefined {
    return SpiderStore.getThread(id);
  },

  addThread(thread: SignalThread): SignalThread {
    return SpiderStore.addThread(thread);
  },

  async executeThread(threadId: string, context: SpiderWebContext): Promise<{ success: boolean; result?: Record<string, any>; error?: string }> {
    const thread = SpiderStore.getThread(threadId);
    if (!thread) {
      return { success: false, error: "Thread not found" };
    }
    return executeThread(thread, context);
  },

  canExecuteThread(threadId: string): boolean {
    const thread = SpiderStore.getThread(threadId);
    if (!thread) return false;
    return canExecuteThread(thread);
  },

  // Flies
  catchFly(fly: Fly): SignalThread | null {
    return catchFly(fly);
  },

  createFly(
    type: FlyType,
    source: string,
    payload: Record<string, any>,
    priority?: FlyPriority,
    sticky?: boolean
  ): Fly {
    return createFly(type, source, payload, priority, sticky);
  },

  getFly(id: string): Fly | undefined {
    return SpiderStore.getFly(id);
  },

  listFlies(): Fly[] {
    return SpiderStore.listFlies();
  },

  listUnprocessedFlies(): Fly[] {
    return SpiderStore.listUnprocessedFlies();
  },

  // Sensors
  addSensor(sensor: WebSensor): WebSensor {
    return SpiderStore.addSensor(sensor);
  },

  getSensor(id: string): WebSensor | undefined {
    return SpiderStore.getSensor(id);
  },

  listSensors(): WebSensor[] {
    return SpiderStore.listSensors();
  },

  listActiveSensors(): WebSensor[] {
    return SpiderStore.listActiveSensors();
  },

  ensureDefaultSensors(): WebSensor[] {
    return ensureDefaultSensors();
  },

  // Templates
  addTemplate(template: ThreadTemplate): ThreadTemplate {
    return SpiderStore.addTemplate(template);
  },

  getTemplate(id: string): ThreadTemplate | undefined {
    return SpiderStore.getTemplate(id);
  },

  listTemplates(): ThreadTemplate[] {
    return SpiderStore.listTemplates();
  },

  findMatchingTemplate(thread: SignalThread): ThreadTemplate | undefined {
    return findMatchingTemplate(thread);
  },

  applyTemplateToThread(thread: SignalThread, template: ThreadTemplate): SignalThread {
    return applyTemplateToThread(thread, template);
  },

  ensureDefaultTemplates(): ThreadTemplate[] {
    return ensureDefaultTemplates();
  },

  // Patterns
  listThreadPatterns(): ThreadPattern[] {
    return SpiderStore.listThreadPatterns();
  },

  listFlyPatterns(): FlyPattern[] {
    return SpiderStore.listFlyPatterns();
  },

  // Insights
  listInsights(): SpiderInsight[] {
    return SpiderStore.listInsights();
  },

  listRecentInsights(limit?: number): SpiderInsight[] {
    return SpiderStore.listRecentInsights(limit ?? 20);
  },
};

export * from './logic/index.js';
export * from './adapters/index.js';
export * from './scheduler/index.js';
export * from './store/index.js';
export default SpiderWebCore;
