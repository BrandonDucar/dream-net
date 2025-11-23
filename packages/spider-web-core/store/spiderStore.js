const threads = new Map();
const insights = [];
const flies = new Map();
const sensors = new Map();
const templates = new Map();
const threadPatterns = new Map();
const flyPatterns = new Map();
let lastRunAt = null;
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
    addThread(thread) {
        threads.set(thread.id, thread);
        return thread;
    },
    updateThread(thread) {
        threads.set(thread.id, thread);
        return thread;
    },
    getThread(id) {
        return threads.get(id);
    },
    listThreads() {
        return Array.from(threads.values());
    },
    listThreadsByStatus(status) {
        return Array.from(threads.values()).filter((t) => t.status === status);
    },
    listThreadsByPriority(priority) {
        return Array.from(threads.values()).filter((t) => t.priority === priority);
    },
    // Flies
    catchFly(fly) {
        resetDailyFlyCount();
        flies.set(fly.id, fly);
        fliesCaughtToday += 1;
        return fly;
    },
    getFly(id) {
        return flies.get(id);
    },
    listFlies() {
        return Array.from(flies.values());
    },
    listUnprocessedFlies() {
        return Array.from(flies.values()).filter((f) => !f.processed);
    },
    listStickyFlies() {
        return Array.from(flies.values()).filter((f) => f.sticky);
    },
    markFlyProcessed(flyId, threadId) {
        const fly = flies.get(flyId);
        if (!fly)
            return false;
        fly.processed = true;
        if (threadId)
            fly.threadId = threadId;
        flies.set(flyId, fly);
        return true;
    },
    // Sensors
    addSensor(sensor) {
        sensors.set(sensor.id, sensor);
        return sensor;
    },
    getSensor(id) {
        return sensors.get(id);
    },
    updateSensor(sensor) {
        sensors.set(sensor.id, sensor);
        return sensor;
    },
    listSensors() {
        return Array.from(sensors.values());
    },
    listActiveSensors() {
        return Array.from(sensors.values()).filter((s) => s.active);
    },
    updateSensorCatchRate(sensorId, catchRate) {
        const sensor = sensors.get(sensorId);
        if (!sensor)
            return false;
        sensor.catchRate = catchRate;
        sensors.set(sensorId, sensor);
        return true;
    },
    // Templates
    addTemplate(template) {
        templates.set(template.id, template);
        return template;
    },
    getTemplate(id) {
        return templates.get(id);
    },
    listTemplates() {
        return Array.from(templates.values());
    },
    updateTemplateUsage(templateId, success) {
        const template = templates.get(templateId);
        if (!template)
            return false;
        template.usageCount += 1;
        if (success) {
            template.successRate = (template.successRate * (template.usageCount - 1) + 1) / template.usageCount;
        }
        else {
            template.successRate = (template.successRate * (template.usageCount - 1)) / template.usageCount;
        }
        template.updatedAt = Date.now();
        templates.set(templateId, template);
        return true;
    },
    // Thread Patterns
    addThreadPattern(pattern) {
        threadPatterns.set(pattern.id, pattern);
        return pattern;
    },
    getThreadPattern(id) {
        return threadPatterns.get(id);
    },
    listThreadPatterns() {
        return Array.from(threadPatterns.values());
    },
    // Fly Patterns
    addFlyPattern(pattern) {
        flyPatterns.set(pattern.id, pattern);
        return pattern;
    },
    getFlyPattern(id) {
        return flyPatterns.get(id);
    },
    listFlyPatterns() {
        return Array.from(flyPatterns.values());
    },
    // Insights
    addInsight(insight) {
        insights.push(insight);
        if (insights.length > 1000) {
            insights.shift();
        }
        return insight;
    },
    listInsights() {
        return insights;
    },
    listRecentInsights(limit = 20) {
        return insights.slice(-limit).reverse();
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
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
