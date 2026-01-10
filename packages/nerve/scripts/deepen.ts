/**
 * 🌊 Third Wave Trigger Script (The Intelligence)
 * 
 * Usage: pnpm exec tsx packages/nerve/scripts/deepen.ts
 */

import { swarmController } from'../src/spine/SwarmController.js';

async function ignite() {
    console.log("🧠 DREAMNET DEEPENING: THIRD WAVE START");

    try {
        await swarmController.deployThirdWave();
        console.log("✨ The Intelligence Wave is now observing.");
    } catch (err) {
        console.error("❌ Third Wave Deployment Failed:", err);
    }
}

ignite();
