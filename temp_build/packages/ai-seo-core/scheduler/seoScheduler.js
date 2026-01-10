"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAISEOCycle = runAISEOCycle;
const seoStore_1 = require("../store/seoStore");
const geofencer_1 = require("../logic/geofencer");
const seoInsights_1 = require("../logic/seoInsights");
/**
 * Run AI SEO cycle
 */
function runAISEOCycle(ctx) {
    const now = Date.now();
    console.log("[AISEOCore:Scheduler] Running AI SEO cycle...");
    // Ensure default geofences
    (0, geofencer_1.ensureDefaultGeofences)();
    // Generate insights
    const insights = (0, seoInsights_1.generateSEOInsights)();
    if (insights.length > 0) {
        console.log(`[AISEOCore:Scheduler] Generated ${insights.length} SEO insight(s)`);
    }
    // Future: Auto-optimize content from packs
    if (ctx.orcaPackCore?.listPlans) {
        const plans = ctx.orcaPackCore.listPlans();
        // Could auto-optimize social posts here
    }
    seoStore_1.SEOStore.setLastRunAt(now);
    console.log("[AISEOCore:Scheduler] AI SEO cycle complete.");
    return seoStore_1.SEOStore.status();
}
