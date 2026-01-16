
import { OharaSuit } from '../packages/dreamnet-control-core/src/suits/OharaSuit.js';
import { OctopusController } from '../packages/dreamnet-agent-wallet-manager/src/OctopusController.js';
import { OHARA_APPS } from '../packages/client/src/miniapps/ohara-registry.js';
import process from 'process';

/**
 * 🤖 MECH SUIT ACTIVATION PROTOCOL
 * Operation: Sovereign Base Mastery
 */
async function engage() {
    console.log("🤖 OHARA SUIT: SYSTEM ONLINE.");
    console.log("   Loading fleet coordinates...");

    // Mock Octopus - We only need the suit's injection logic which uses the static oharaClient
    const mockOctopus = {} as OctopusController;
    const config = { oharaAppId: 'FLEET_COMMAND' };

    const suit = new OharaSuit(mockOctopus, config);

    // Override the massMigrate to use our local registry instead of fetching from API first
    // This ensures we use the exact IDs we have mapped
    console.log(`   Targeting ${OHARA_APPS.length} Sovereign Apps from Registry...`);

    if (!process.env.OHARA_CONTROLLER_TOKEN) {
        console.error("🛑 CRITICAL FAILURE: OHARA_CONTROLLER_TOKEN not detected in environment.");
        console.error("   The Pilot cannot engage the API without the Ignition Key.");
        console.error("   Please add OHARA_CONTROLLER_TOKEN to your .env file.");
        process.exit(1);
    }

    // Iterate and Inject
    for (const app of OHARA_APPS) {
        // Only target apps that have a real UUID (not a text slug)
        // UUID Regex: 8-4-4-4-12
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(app.id);

        if (isUUID) {
            console.log(`\n🤖 TARGET LOCKED: ${app.name} (${app.id})`);
            console.log(`   Injecting Base Master Metadata...`);

            // We use the suit's private method logic here via a public wrapper or direct call
            // Since injectBaseMetadata is private, we'll re-implement the call directly here for safety/script speed
            // or we could make it public in the suit. 
            // For this script, let's assume we can call the public MassMigrate if we want to fetch list,
            // but since we want to be specific, we will use the oharaClient directly here mimicking the suit.

            // Actually, OharaSuit.massMigrate() fetches listApps() from Ohara. 
            // That is safer because it guarantees we update apps that actually exist.
            // Let's rely on the Suit's native scanner.
            await suit.massMigrate();
            break; // massMigrate loops internally, so we break this outer loop after triggering it once.
        } else {
            // console.log(`   ⚠️  Skipping ${app.name} (No UUID Link established)`);
        }
    }
}

engage().catch(console.error);
