"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSpiderWebCycle = runSpiderWebCycle;
const spiderStore_1 = require("../store/spiderStore");
const headSpider_1 = require("../logic/headSpider");
const funnelWebSpider_1 = require("../logic/funnelWebSpider");
const orbWeaver_1 = require("../logic/orbWeaver");
const silkBinder_1 = require("../logic/silkBinder");
const threadTemplates_1 = require("../logic/threadTemplates");
const patternLearner_1 = require("../logic/patternLearner");
async function runSpiderWebCycle(ctx) {
    const now = Date.now();
    console.log("[SpiderWeb:Scheduler] Running Spider Web cycle...");
    // 1. Ensure default sensors and templates exist
    (0, funnelWebSpider_1.ensureDefaultSensors)();
    (0, threadTemplates_1.ensureDefaultTemplates)();
    // 2. Head Spider: read packs & create threads
    const headThreads = (0, headSpider_1.runHeadSpider)(ctx);
    if (headThreads.length > 0) {
        console.log(`[SpiderWeb:Scheduler] Head Spider created ${headThreads.length} thread(s)`);
    }
    // 3. Funnel Web Spider: catch flies from sensors
    const funnelThreads = await (0, funnelWebSpider_1.runFunnelWebSpider)(ctx);
    if (funnelThreads.length > 0) {
        console.log(`[SpiderWeb:Scheduler] Funnel Web Spider caught ${funnelThreads.length} fly/fly and created thread(s)`);
    }
    // 4. Silk Binder Spider: legal/compliance insights
    const silkInsights = (0, silkBinder_1.runSilkBinder)(ctx);
    if (silkInsights.length > 0) {
        console.log(`[SpiderWeb:Scheduler] Silk Binder generated ${silkInsights.length} insight(s)`);
    }
    // 5. Orb Weaver: route and execute threads
    await (0, orbWeaver_1.runOrbWeaver)(ctx);
    // 6. Pattern Learning: learn from completed threads and flies
    const threadPatterns = (0, patternLearner_1.learnThreadPatterns)();
    const flyPatterns = (0, patternLearner_1.learnFlyPatterns)();
    if (threadPatterns.length > 0 || flyPatterns.length > 0) {
        console.log(`[SpiderWeb:Scheduler] Learned ${threadPatterns.length} thread pattern(s) and ${flyPatterns.length} fly pattern(s)`);
    }
    spiderStore_1.SpiderStore.setLastRunAt(now);
    console.log("[SpiderWeb:Scheduler] Spider Web cycle complete.");
    return spiderStore_1.SpiderStore.status();
}
