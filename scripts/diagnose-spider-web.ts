import { SpiderWebCore } from '../packages/organs/nervous/nerve/src/spider-web/index.js';

async function diagnose() {
    console.log("========================================");
    console.log("🕸️  SPIDER WEB DIAGNOSTIC STARTING...");
    console.log("========================================");

    // 1. Check current status
    const status = SpiderWebCore.status();
    console.log("\n📊 CURRENT STATUS:");
    console.log(`Threads: ${status.threadCount} (Total)`);
    console.log(`  - Pending: ${status.pendingCount}`);
    console.log(`  - In Progress: ${status.inProgressCount}`);
    console.log(`  - Completed: ${status.completedCount}`);
    console.log(`  - Failed: ${status.failedCount}`);
    console.log(`Flies: ${status.flyCount} (Total)`);
    console.log(`  - Caught Today: ${status.fliesCaughtToday}`);
    console.log(`Insights: ${status.insightCount}`);

    // 2. Simulate Fly Catching (Test Stochastic Filter)
    console.log("\n🧪 TESTING FLY CATCHER (Stochastic Filter)...");
    let caught = 0;
    const TEST_COUNT = 10;

    for (let i = 0; i < TEST_COUNT; i++) {
        const fly = SpiderWebCore.createFly("message", "diagnostic-test", { testId: i }, "medium", false);
        const result = SpiderWebCore.catchFly(fly);
        if (result) caught++;
    }

    console.log(`Caught ${caught}/${TEST_COUNT} medium-priority (non-sticky) flies.`);
    if (caught < TEST_COUNT) {
        console.warn(`⚠️ STOCHASTIC LOSS DETECTED: ${TEST_COUNT - caught} flies bounced!`);
    }

    // 3. Print Recent Insights
    const recentInsights = SpiderWebCore.listRecentInsights(5);
    if (recentInsights.length > 0) {
        console.log("\n🔍 RECENT INSIGHTS:");
        recentInsights.forEach(insight => {
            console.log(`- [${insight.timestamp}] ${insight.title}: ${insight.summary}`);
        });
    } else {
        console.log("\n🔍 NO RECENT INSIGHTS (Store empty?)");
    }

    console.log("\n========================================");
    console.log("🏁 DIAGNOSTIC COMPLETE");
    console.log("========================================");
}

diagnose().catch(err => {
    console.error("\n❌ DIAGNOSTIC FAILED:", err);
    process.exit(1);
});
