/**
 * 🌊 Second Wave Trigger Script (The Expansion)
 * 
 * Usage: pnpm run expand
 */

import { swarmController } from'../src/spine/SwarmController.js';

async function ignite() {
    console.log("🌊 DREAMNET EXPANSION: SECOND WAVE START");

    try {
        await swarmController.deploySecondWave();
        console.log("✨ The Expansion Team is now active.");
    } catch (err) {
        console.error("❌ Second Wave Deployment Failed:", err);
    }
}

ignite();
