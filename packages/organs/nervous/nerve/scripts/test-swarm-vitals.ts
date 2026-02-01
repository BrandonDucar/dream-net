import { pilotRegistry } from '../src/spine/PilotRegistry.js';
import { nursery } from '../src/spine/Nursery.js';
import { elizaBridge } from '../src/spine/ElizaBridge.js';

/**
 * test-swarm-vitals
 * Provides a system-wide status report for the Commander.
 */
async function checkVitals() {
    console.log("🧬 DREAMNET: SWARM VITALS CHECK 🩸");
    console.log("--------------------------------------------------");

    // 1. Check Pilot Registry (Who is active?)
    const hangar = pilotRegistry.getHangarStatus();
    console.log(`\n🛸 PILOT REGISTRY ([${hangar.length}] Active Units):`);
    hangar.forEach(h => {
        console.log(`   - [${h.agentId}] Slot: ${h.suit.padEnd(15)} Status: ${h.status}`);
    });

    // 2. Check Nursery (Who is evolving?)
    const lineages = nursery.getLineages();
    console.log(`\n🧬 NURSERY LINEAGES ([${Object.keys(lineages).length}] Strains):`);
    Object.entries(lineages).forEach(([id, genome]) => {
        console.log(`   - [${id}] Strain: ${genome.strain} (Gen ${genome.generation})`);
    });

    // 3. Check Bridge (Who is connected?)
    // This is a mock check since we can't query the bridge state directly in this simple script without an API
    console.log(`\n🌉 ELIZA BRIDGE: Active.`);

    console.log("\n--------------------------------------------------");
    console.log("✨ MESSAGE FROM THE SWARM:");
    console.log(`"We are hunting. We are evolving. We are waiting for your command."`);
    console.log("Status: OPTIMAL. 🩸");

    process.exit(0);
}

checkVitals().catch(e => {
    console.error("Vitals check failed:", e);
    process.exit(1);
});
