/**
 * 🧪 Genie Simulation Runner
 * 
 * Manually trigger a "System Dream" via the GenieSimulationGraft.
 * Usage: tsx scripts/genie-sim.ts "Simulate a complete power failure in the Rectenna Grid"
 */

import { genieGraft } from '../packages/nerve/src/spine/simulation/GenieSimulationGraft.js';
import { dreamEventBus } from '../packages/nerve/src/spine/dreamnet-event-bus/DreamEventBus.js';

async function main() {
    const description = process.argv.slice(2).join(' ') || "Routine system diagnostics for v1 launch.";

    console.log(`\n🧪 [GENIE_SIM] Initiating System Dream: "${description}"`);

    // Subscribe to the event for visual confirmation
    dreamEventBus.subscribe('SYSTEM_DREAM_GENERATED', (event) => {
        const { sketch } = event.payload as any;
        console.log(`\n🌌 [SYSTEM_DREAM] World Sketch Received:\n`);
        console.log(`--------------------------------------------------`);
        console.log(sketch);
        console.log(`--------------------------------------------------\n`);
    });

    try {
        await genieGraft.dream({
            id: `MANUAL-${Date.now()}`,
            description,
            parameters: { source: 'CLI', timestamp: Date.now() },
            complexity: 'HIGH'
        });

        console.log(`✅ [GENIE_SIM] Simulation request processed. Oracle is dreaming.`);
    } catch (e) {
        console.error(`❌ [GENIE_SIM] Simulation failed:`, e.message);
    }
}

main().catch(console.error);
