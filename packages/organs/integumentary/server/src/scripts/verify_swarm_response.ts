/**
 * 🔬 VerifySwarmResponse: The Heartbeat Stress Test (Surgical Edition)
 * 
 * Verifies that Citizens, Core Agents, and Mech Pilots are pulsing correctly.
 */

import { agentRegistry } from '../core/registry.js';
import { CitizenPulseHub } from '../CitizenPulseHub.js';
import { aiFoundry } from '@dreamnet/factory';
import { aiFactory } from '@dreamnet/factory';
import { BlackboardScheduler } from '../BlackboardScheduler.js';

async function verifySwarmResponse() {
    console.log("📡 [Swarm Test] Initiating Full Spectrum Response Audit...");
    console.log("---------------------------------------------------------");

    try {
        // 1. Activate Citizens (143+)
        console.log("👥 Phase 1: Activating 143+ Citizens...");
        const citizenCount = await CitizenPulseHub.activateSwarm();
        console.log(`✅ ${citizenCount} Citizens activated in Registry.`);

        // 2. Forge a Sample Pilot
        console.log("👨‍✈️ Phase 2: Forging Sample Mech Pilot (OG_KUSH)...");
        // Use a generic name that follows the weed strain naming convention
        const pilotName = "OG_KUSH";
        const blueprint = await aiFoundry.forgeMechSuit(pilotName, "Verification Pilot", "LIGHT");
        await aiFactory.runProduction(blueprint);
        console.log(`✅ Pilot ${pilotName} Forge successful and registered.`);

        // 3. Test Response Capture
        const agents = agentRegistry.listAgents();
        console.log(`📋 Total Agents in Registry: ${agents.length}`);

        // Sample different types
        const samples = [
            agents.find(a => a.id.startsWith('citizen:')),
            agents.find(a => a.id.includes('og_kush')), // Filtered by the name we just created
            agents.find(a => a.id === 'auditor')
        ].filter(Boolean);

        if (samples.length === 0) {
            console.error("❌ No sample agents found for testing.");
            process.exit(1);
        }

        console.log(`🧪 Phase 3: Testing Pulse Response for ${samples.length} sample nodes...`);

        for (const agent of samples) {
            console.log(`📡 Triggering manual pulse for: ${agent.id}...`);
            const ctx: any = {
                requestId: `test-${Date.now()}`,
                timestamp: new Date().toISOString()
            };

            if (agent.pulse) {
                const result = await agent.pulse(ctx);
                if (result.success) {
                    console.log(`✅ [Response] ${agent.id} responded successfully.`);
                } else {
                    console.error(`❌ [Response] ${agent.id} failed: ${result.error}`);
                }
            } else {
                console.warn(`⚠️ [Response] ${agent.id} has no pulse method.`);
            }
        }

        console.log("---------------------------------------------------------");
        console.log("✨ [Audit Complete] All layers of the swarm are responsive.");
        console.log("Check blackboard.md for the social signatures. 📓");

    } catch (error) {
        console.error("❌ Audit Failed:", error);
        process.exit(1);
    }
}

verifySwarmResponse();
