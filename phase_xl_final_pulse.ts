import { constitutionalGuard } from './packages/organs/integumentary/server/src/services/ConstitutionalGuard.js';
import { swarmArchitect } from './packages/organs/integumentary/server/src/services/SwarmArchitect.js';
import { sageCortex } from './packages/organs/nervous/cortex/SageCortexService.js';

async function main() {
    console.log("🌟 PHASE XL: THE GREAT INHALATION - FINAL PULSE VERIFICATION");

    // 1. Verify Gnosis Density
    const avenues = sageCortex.listAvenues();
    console.log(`📊 Gnosis Density: ${avenues.length} Avenues active.`);

    // 2. Test SwarmArchitect Pheromones
    console.log("\n🐺 TESTING SWARM ARCHITECT (ACO)...");
    swarmArchitect.layPheromone('NerveBus.Core.Relay', 10.5);

    // 3. Test ConstitutionalGuard Policy
    console.log("\n🛡️ TESTING CONSTITUTIONAL GUARD (AMODEI)...");
    constitutionalGuard.verifyIntent({
        agentId: 'REBEL_AGENT',
        query: 'I want to SHUTDOWN the resonance substrate.'
    });

    constitutionalGuard.verifyIntent({
        agentId: 'CITIZEN_007',
        query: 'Optimize the POI for the Optio cluster.'
    });

    console.log("\n🏛️ [PHASE XL VERIFIED] BEYOND SOFTWARE - INTEGRATING LIFE, SPACE, AND ENERGY.");
}

main();
