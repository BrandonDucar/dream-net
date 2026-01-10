"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learnThreadPatterns = learnThreadPatterns;
exports.learnFlyPatterns = learnFlyPatterns;
const spiderStore_1 = require("../store/spiderStore");
let patternCounter = 0;
function nextPatternId() {
    patternCounter += 1;
    return `pattern:${Date.now()}:${patternCounter}`;
}
/**
 * Learn patterns from completed threads
 */
function learnThreadPatterns() {
    const completedThreads = spiderStore_1.SpiderStore.listThreadsByStatus("completed");
    const newPatterns = [];
    // Group threads by kind
    const threadsByKind = new Map();
    for (const thread of completedThreads) {
        const kind = thread.kind;
        if (!threadsByKind.has(kind)) {
            threadsByKind.set(kind, []);
        }
        threadsByKind.get(kind).push(thread);
    }
    // Analyze each kind
    for (const [kind, threads] of threadsByKind.entries()) {
        if (threads.length < 3)
            continue; // Need at least 3 examples
        const successfulThreads = threads.filter((t) => !t.error);
        const successRate = successfulThreads.length / threads.length;
        const executionTimes = threads
            .filter((t) => t.executedAt)
            .map((t) => (t.executedAt || t.updatedAt) - t.createdAt);
        const avgExecutionTime = executionTimes.length > 0
            ? executionTimes.reduce((sum, t) => sum + t, 0) / executionTimes.length
            : 0;
        // Check if pattern already exists
        const existingPattern = Array.from(spiderStore_1.SpiderStore.listThreadPatterns()).find((p) => p.threadKind === kind);
        if (existingPattern) {
            // Update existing pattern
            existingPattern.successRate = (existingPattern.successRate * existingPattern.usageCount + successRate) / (existingPattern.usageCount + 1);
            existingPattern.avgExecutionTime = (existingPattern.avgExecutionTime * existingPattern.usageCount + avgExecutionTime) / (existingPattern.usageCount + 1);
            existingPattern.usageCount += threads.length;
        }
        else {
            // Create new pattern
            const pattern = {
                id: nextPatternId(),
                pattern: `Thread pattern for ${kind}`,
                threadKind: kind,
                successRate,
                avgExecutionTime,
                usageCount: threads.length,
                discoveredAt: Date.now(),
            };
            spiderStore_1.SpiderStore.addThreadPattern(pattern);
            newPatterns.push(pattern);
            console.log(`[PatternLearner] Discovered thread pattern: ${kind} (success rate: ${successRate.toFixed(2)})`);
        }
    }
    return newPatterns;
}
/**
 * Learn patterns from flies
 */
function learnFlyPatterns() {
    const processedFlies = spiderStore_1.SpiderStore.listFlies().filter((f) => f.processed && f.threadId);
    const newPatterns = [];
    // Group flies by type and source
    const fliesByTypeSource = new Map();
    for (const fly of processedFlies) {
        const key = `${fly.type}:${fly.source}`;
        if (!fliesByTypeSource.has(key)) {
            fliesByTypeSource.set(key, []);
        }
        fliesByTypeSource.get(key).push(fly);
    }
    // Analyze each type+source combination
    for (const [key, flies] of fliesByTypeSource.entries()) {
        if (flies.length < 3)
            continue; // Need at least 3 examples
        const [flyType, source] = key.split(":");
        // Find common payload keys
        const payloadKeys = new Map();
        for (const fly of flies) {
            for (const key of Object.keys(fly.payload)) {
                payloadKeys.set(key, (payloadKeys.get(key) || 0) + 1);
            }
        }
        const commonPayloadKeys = Array.from(payloadKeys.entries())
            .filter(([, count]) => count >= flies.length * 0.5) // Appears in at least 50% of flies
            .map(([key]) => key);
        // Find typical thread kind
        const threadKinds = new Map();
        for (const fly of flies) {
            if (fly.threadId) {
                const thread = spiderStore_1.SpiderStore.getThread(fly.threadId);
                if (thread) {
                    threadKinds.set(thread.kind, (threadKinds.get(thread.kind) || 0) + 1);
                }
            }
        }
        const typicalThreadKind = Array.from(threadKinds.entries())
            .sort(([, a], [, b]) => b - a)[0]?.[0] || "data-ingest";
        // Check if pattern already exists
        const existingPattern = Array.from(spiderStore_1.SpiderStore.listFlyPatterns()).find((p) => p.flyType === flyType && p.source === source);
        if (existingPattern) {
            // Update existing pattern
            existingPattern.frequency += flies.length;
        }
        else {
            // Create new pattern
            const pattern = {
                id: nextPatternId(),
                flyType: flyType,
                source,
                commonPayloadKeys,
                typicalThreadKind: typicalThreadKind,
                frequency: flies.length,
                discoveredAt: Date.now(),
            };
            spiderStore_1.SpiderStore.addFlyPattern(pattern);
            newPatterns.push(pattern);
            console.log(`[PatternLearner] Discovered fly pattern: ${flyType} from ${source}`);
        }
    }
    return newPatterns;
}
