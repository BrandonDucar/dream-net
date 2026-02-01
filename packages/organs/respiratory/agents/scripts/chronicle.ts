/**
 * 🚀 Chronicle Trigger Script
 * 
 * Usage: pnpm run chronicle
 */

import { ChronicleAgent } from'../src/operational/ChronicleAgent.js';

async function ignite() {
    const agent = new ChronicleAgent();
    console.log("🌊 Igniting the Chronicle Loop...");

    try {
        const result = await agent.chronicles();
        console.log("✅ Chronicle Loop Complete.");
        console.log("---");
        console.log(result.summary);
        console.log("---");
    } catch (err) {
        console.error("❌ Chronicle Loop Failed:", err);
    }
}

ignite();
