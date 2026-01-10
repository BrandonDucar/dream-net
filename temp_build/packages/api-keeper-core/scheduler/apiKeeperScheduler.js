"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAPIKeeperCycle = runAPIKeeperCycle;
const apiStore_1 = require("../store/apiStore");
const apiDiscoverer_1 = require("../logic/apiDiscoverer");
const railGuards_1 = require("../logic/railGuards");
const keyAutoDiscoverer_1 = require("../logic/keyAutoDiscoverer");
/**
 * Run API Keeper cycle
 */
function runAPIKeeperCycle(ctx) {
    const now = Date.now();
    console.log("[APIKeeper:Scheduler] Running API Keeper cycle...");
    // 1. Discover new APIs
    const discovered = (0, apiDiscoverer_1.discoverAPIs)();
    if (discovered.length > 0) {
        console.log(`[APIKeeper:Scheduler] Discovered ${discovered.length} API provider(s)`);
    }
    // 2. ZERO-TOUCH: Auto-discover API keys from ALL sources (continuous)
    // This runs every cycle to catch new keys automatically
    const discoveredKeys = (0, keyAutoDiscoverer_1.autoDiscoverAllKeys)();
    if (discoveredKeys.length > 0) {
        console.log(`[APIKeeper:Scheduler] 🔍 Zero-touch discovery: ${discoveredKeys.length} new API key(s) found`);
    }
    else {
        console.log(`[APIKeeper:Scheduler] ✅ All keys up-to-date (zero-touch mode)`);
    }
    // 3. Ensure default rail guards
    (0, railGuards_1.ensureDefaultRailGuards)();
    // 4. Update provider statuses (check if still active)
    const providers = apiStore_1.APIStore.listProviders();
    for (const provider of providers) {
        // In production, could ping APIs to check status
        apiStore_1.APIStore.updateProvider(provider.id, { lastCheckedAt: now });
    }
    // 5. Check key statuses and reset quotas if new month
    const keys = apiStore_1.APIStore.listKeys();
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const monthStart = thisMonth.getTime();
    for (const key of keys) {
        if (key.lastUsedAt < monthStart && key.usageThisMonth > 0) {
            // Reset monthly usage
            apiStore_1.APIStore.updateKey(key.id, {
                usageThisMonth: 0,
                costThisMonth: 0,
                quotaUsed: 0,
            });
        }
        // Reactivate keys that were rate-limited if enough time passed
        if (key.status === "rate-limited" && key.rateLimitResetAt) {
            if (now >= key.rateLimitResetAt) {
                apiStore_1.APIStore.updateKey(key.id, { status: "active" });
            }
        }
    }
    apiStore_1.APIStore.setLastRunAt(now);
    console.log("[APIKeeper:Scheduler] API Keeper cycle complete.");
    return apiStore_1.APIStore.status();
}
