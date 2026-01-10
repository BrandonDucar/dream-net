"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpiderWebCore = void 0;
const spiderStore_1 = require("./store/spiderStore");
const spiderScheduler_1 = require("./scheduler/spiderScheduler");
const flyCatcher_1 = require("./logic/flyCatcher");
const threadExecutor_1 = require("./logic/threadExecutor");
const threadTemplates_1 = require("./logic/threadTemplates");
const funnelWebSpider_1 = require("./logic/funnelWebSpider");
exports.SpiderWebCore = {
    // Orchestration
    async run(context) {
        return (0, spiderScheduler_1.runSpiderWebCycle)(context);
    },
    status() {
        return spiderStore_1.SpiderStore.status();
    },
    // Threads
    listThreads() {
        return spiderStore_1.SpiderStore.listThreads();
    },
    listThreadsByStatus(status) {
        return spiderStore_1.SpiderStore.listThreadsByStatus(status);
    },
    listThreadsByPriority(priority) {
        return spiderStore_1.SpiderStore.listThreadsByPriority(priority);
    },
    getThread(id) {
        return spiderStore_1.SpiderStore.getThread(id);
    },
    addThread(thread) {
        return spiderStore_1.SpiderStore.addThread(thread);
    },
    async executeThread(threadId, context) {
        const thread = spiderStore_1.SpiderStore.getThread(threadId);
        if (!thread) {
            return { success: false, error: "Thread not found" };
        }
        return (0, threadExecutor_1.executeThread)(thread, context);
    },
    canExecuteThread(threadId) {
        const thread = spiderStore_1.SpiderStore.getThread(threadId);
        if (!thread)
            return false;
        return (0, threadExecutor_1.canExecuteThread)(thread);
    },
    // Flies
    catchFly(fly) {
        return (0, flyCatcher_1.catchFly)(fly);
    },
    createFly(type, source, payload, priority, sticky) {
        return (0, flyCatcher_1.createFly)(type, source, payload, priority, sticky);
    },
    getFly(id) {
        return spiderStore_1.SpiderStore.getFly(id);
    },
    listFlies() {
        return spiderStore_1.SpiderStore.listFlies();
    },
    listUnprocessedFlies() {
        return spiderStore_1.SpiderStore.listUnprocessedFlies();
    },
    // Sensors
    addSensor(sensor) {
        return spiderStore_1.SpiderStore.addSensor(sensor);
    },
    getSensor(id) {
        return spiderStore_1.SpiderStore.getSensor(id);
    },
    listSensors() {
        return spiderStore_1.SpiderStore.listSensors();
    },
    listActiveSensors() {
        return spiderStore_1.SpiderStore.listActiveSensors();
    },
    ensureDefaultSensors() {
        return (0, funnelWebSpider_1.ensureDefaultSensors)();
    },
    // Templates
    addTemplate(template) {
        return spiderStore_1.SpiderStore.addTemplate(template);
    },
    getTemplate(id) {
        return spiderStore_1.SpiderStore.getTemplate(id);
    },
    listTemplates() {
        return spiderStore_1.SpiderStore.listTemplates();
    },
    findMatchingTemplate(thread) {
        return (0, threadTemplates_1.findMatchingTemplate)(thread);
    },
    applyTemplateToThread(thread, template) {
        return (0, threadTemplates_1.applyTemplateToThread)(thread, template);
    },
    ensureDefaultTemplates() {
        return (0, threadTemplates_1.ensureDefaultTemplates)();
    },
    // Patterns
    listThreadPatterns() {
        return spiderStore_1.SpiderStore.listThreadPatterns();
    },
    listFlyPatterns() {
        return spiderStore_1.SpiderStore.listFlyPatterns();
    },
    // Insights
    listInsights() {
        return spiderStore_1.SpiderStore.listInsights();
    },
    listRecentInsights(limit) {
        return spiderStore_1.SpiderStore.listRecentInsights(limit ?? 20);
    },
};
__exportStar(require("./types"), exports);
__exportStar(require("./adapters/spiderStatusAdapter"), exports);
exports.default = exports.SpiderWebCore;
