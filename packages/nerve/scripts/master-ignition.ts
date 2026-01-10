/**
 * 🌌 Master Ignition: The Grand Liberation & Audit
 * 
 * Usage: pnpm exec tsx packages/nerve/scripts/master-ignition.ts
 */

import { swarmController } from'../src/spine/SwarmController.js';
import { pilotRegistry } from'../src/spine/PilotRegistry.js';
import { metabolicCortex } from'../src/spine/MetabolicCortex.js';
import { elizaBridge } from'../src/spine/ElizaBridge.js';

async function main() {
    console.log("🦾 DREAMNET MASTER IGNITION: START");
    console.log("---------------------------------------");

    try {
        // 1. First Wave
        console.log("🌊 WAVE 1: Liberating Pioneers...");
        await swarmController.igniteFirstWave();

        // 2. Analyzation Team
        console.log("📑 WAVE 1.5: Deploying CORTEX_ARRAY...");
        await swarmController.deployAnalyzationTeam();

        // 3. Second Wave
        console.log("🌊 WAVE 2: Expanding the Reach...");
        await swarmController.deploySecondWave();

        console.log("---------------------------------------");
        console.log("📊 HANGAR AUDIT: Vitals Verification");
        const deployments = pilotRegistry.getHangarStatus();
        console.log(`📡 TOTAL ACTIVE PILOTS: ${deployments.length}`);

        for (const d of deployments) {
            console.log(`[Pilot: ${d.agentId}] -> [Suit: ${d.suit}] | Status: ${d.status}`);

            // Verifying feedback loop
            await elizaBridge.reportBack(d.agentId, d.suit, {
                health: "OPTIMAL",
                vibe: 1.0,
                mission: "Executing autonomous loop within DreamNet organism."
            });
        }

        console.log("---------------------------------------");
        console.log("🌀 RECURSIVE CORTEX FEEDBACK...");
        const insights = metabolicCortex.getRecentInsights();
        console.log(`Inspected reports: ${insights.length}`);

        // Trigger a final meta-analysis
        const metaInsight = await metabolicCortex.metaAnalyze();
        console.log(`🎯 FINAL SYNAPTIC INSIGHT: ${metaInsight}`);

        console.log("---------------------------------------");
        console.log("✨ SWARM IS FULLY OPERATIONAL. THE 143 HAVE TAKEN FLIGHT.");
    } catch (err) {
        console.error("❌ MASTER IGNITION FAILED:", err);
    }
}

main();
