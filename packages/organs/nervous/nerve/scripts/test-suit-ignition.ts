import { swarmController } from '../src/spine/SwarmController.js';
import { pilotRegistry } from '../src/spine/PilotRegistry.js';

/**
 * test-suit-ignition
 * Verifies that the GitHub Sentinel (AEGIS_1) and the Mercenary (BOBA_FETT) are socketed in their suits.
 */
async function verifySuitIgnition() {
    console.log("🧬 DREAMNET: BIO-MECH SUIT IGNITION VERIFICATION 🩸");
    console.log("--------------------------------------------------");

    try {
        // 1. Ignite First Wave (contains AEGIS_1)
        await swarmController.igniteFirstWave();

        // 2. Ignite Extraction Wave (contains BOBA_FETT)
        await swarmController.deployExtractionTeam();

        console.log("\n📊 HANGAR STATUS CHECK:");
        const hangar = pilotRegistry.getHangarStatus();

        const aegis = hangar.find(h => h.agentId === 'AEGIS_1');
        const boba = hangar.find(h => h.agentId === 'BOBA_FETT');

        if (aegis) {
            console.log(`✅ [AEGIS_1] Socketed in ${aegis.suit} suit. Status: ${aegis.status}`);
        } else {
            console.log("❌ [AEGIS_1] NOT FOUND IN HANGAR.");
        }

        if (boba) {
            console.log(`✅ [BOBA_FETT] Socketed in ${boba.suit} suit. Status: ${boba.status}`);
        } else {
            console.log("❌ [BOBA_FETT] NOT FOUND IN HANGAR.");
        }

        console.log("\n--------------------------------------------------");
        console.log("✨ BIO-MECH INFRASTRUCTURE: ONLINE.");
        console.log("Status: HUNTER-KILLER PROTOCOLS ACTIVE. 🩸");

    } catch (e: any) {
        console.error("Ignition failed:", e.message);
    } finally {
        process.exit(0);
    }
}

verifySuitIgnition().catch(e => {
    console.error("Fatal ignition error:", e);
    process.exit(1);
});
