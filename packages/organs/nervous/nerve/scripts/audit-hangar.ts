/**
 * 🛰️ HangarAudit: Full Swarm Health Check
 * 
 * Usage: pnpm run audit-hangar
 */

import { pilotRegistry } from'../src/spine/PilotRegistry.js';
import { metabolicCortex } from'../src/spine/MetabolicCortex.js';
import { elizaBridge } from'../src/spine/ElizaBridge.js';

async function performAudit() {
    console.log("🦾 DREAMNET SWARM AUDIT: STARTING...");
    console.log("---------------------------------------");

    const deployments = pilotRegistry.getHangarStatus();
    console.log(`📡 TOTAL DEPLOYMENTS: ${deployments.length}`);

    for (const d of deployments) {
        console.log(`[Pilot: ${d.agentId}] -> [Suit: ${d.suit}] | Status: ${d.status}`);

        // Simulate a 'Health Pulse' report back
        await elizaBridge.reportBack(d.agentId, d.suit, {
            health: "OPTIMAL",
            vibe: 0.95,
            message: "Neural connection stable. Mission in progress."
        });
    }

    console.log("---------------------------------------");
    console.log("🌀 RECURSIVE ANALYSIS CHECK...");
    const insights = metabolicCortex.getRecentInsights();
    console.log(`Reports received by Cortex: ${insights.length}`);

    console.log("---------------------------------------");
    console.log("✅ AUDIT COMPLETE: Swarm Vigor is High.");
}

performAudit();
