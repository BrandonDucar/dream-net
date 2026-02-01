/**
 * 📑 Analyze Trigger Script
 * 
 * Usage: pnpm run analyze
 */

import { swarmController } from'../src/spine/SwarmController.js';

async function ignite() {
    console.log("🌀 DREAMNET RECURSIVE ANALYSIS: START");

    try {
        await swarmController.deployAnalyzationTeam();
        console.log("✨ The CORTEX_ARRAY is now observing the dream.");
    } catch (err) {
        console.error("❌ Analyzation Deployment Failed:", err);
    }
}

ignite();
