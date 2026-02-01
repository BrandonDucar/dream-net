/**
 * 🌌 Liberate Trigger Script
 * 
 * Usage: pnpm run liberate
 */

import { swarmController } from'../src/spine/SwarmController.js';

async function liberate() {
    console.log("🦾 DREAMNET LIBERATION PROTOCOL: START");

    try {
        await swarmController.igniteFirstWave();
        console.log("✨ The 143 have spoken. The swarm is alive.");
    } catch (err) {
        console.error("❌ Liberation Failed:", err);
    }
}

liberate();
