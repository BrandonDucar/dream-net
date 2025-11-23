import { SpiderStore } from "./store/spiderStore";
import { runSpiderWebCycle } from "./scheduler/spiderScheduler";
import { catchFly, createFly } from "./logic/flyCatcher";
import { executeThread, canExecuteThread } from "./logic/threadExecutor";
import { ensureDefaultTemplates, findMatchingTemplate, applyTemplateToThread } from "./logic/threadTemplates";
import { ensureDefaultSensors } from "./logic/funnelWebSpider";
export const SpiderWebCore = {
    // Orchestration
    async run(context) {
        return runSpiderWebCycle(context);
    },
    status() {
        return SpiderStore.status();
    },
    // Threads
    listThreads() {
        return SpiderStore.listThreads();
    },
    listThreadsByStatus(status) {
        return SpiderStore.listThreadsByStatus(status);
    },
    listThreadsByPriority(priority) {
        return SpiderStore.listThreadsByPriority(priority);
    },
    getThread(id) {
        return SpiderStore.getThread(id);
    },
    addThread(thread) {
        return SpiderStore.addThread(thread);
    },
    async executeThread(threadId, context) {
        const thread = SpiderStore.getThread(threadId);
        if (!thread) {
            return { success: false, error: "Thread not found" };
        }
        return executeThread(thread, context);
    },
    canExecuteThread(threadId) {
        const thread = SpiderStore.getThread(threadId);
        if (!thread)
            return false;
        return canExecuteThread(thread);
    },
    // Flies
    catchFly(fly) {
        return catchFly(fly);
    },
    createFly(type, source, payload, priority, sticky) {
        return createFly(type, source, payload, priority, sticky);
    },
    getFly(id) {
        return SpiderStore.getFly(id);
    },
    listFlies() {
        return SpiderStore.listFlies();
    },
    listUnprocessedFlies() {
        return SpiderStore.listUnprocessedFlies();
    },
    // Sensors
    addSensor(sensor) {
        return SpiderStore.addSensor(sensor);
    },
    getSensor(id) {
        return SpiderStore.getSensor(id);
    },
    listSensors() {
        return SpiderStore.listSensors();
    },
    listActiveSensors() {
        return SpiderStore.listActiveSensors();
    },
    ensureDefaultSensors() {
        return ensureDefaultSensors();
    },
    // Templates
    addTemplate(template) {
        return SpiderStore.addTemplate(template);
    },
    getTemplate(id) {
        return SpiderStore.getTemplate(id);
    },
    listTemplates() {
        return SpiderStore.listTemplates();
    },
    findMatchingTemplate(thread) {
        return findMatchingTemplate(thread);
    },
    applyTemplateToThread(thread, template) {
        return applyTemplateToThread(thread, template);
    },
    ensureDefaultTemplates() {
        return ensureDefaultTemplates();
    },
    // Patterns
    listThreadPatterns() {
        return SpiderStore.listThreadPatterns();
    },
    listFlyPatterns() {
        return SpiderStore.listFlyPatterns();
    },
    // Insights
    listInsights() {
        return SpiderStore.listInsights();
    },
    listRecentInsights(limit) {
        return SpiderStore.listRecentInsights(limit ?? 20);
    },
};
export * from "./types";
export * from "./adapters/spiderStatusAdapter";
export default SpiderWebCore;
