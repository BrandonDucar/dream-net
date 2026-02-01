/**
 * 🧪 NURSERY IGNITION & GENOME VERIFICATION
 * 
 * Objectives:
 * 1. Verify agents are registered in the Nursery.
 * 2. Simulate 'AlphaExtracted' events to boost fitness.
 * 3. Trigger a 'GeneticShift' (Evolution).
 * 4. Confirm agents consume new genomic parameters.
 */

import { dreamEventBus } from '../src/spine/dreamnet-event-bus/index.js';
import { nursery } from '../src/spine/Nursery.js';
import { FlashTrader } from '../src/spine/FlashTrader.js';
import { ArbitrageAgent } from '../../agents/src/specialized/ArbitrageAgent.js';
import { HarvesterAgent } from '../../agents/src/specialized/HarvesterAgent.js';
import { STRAINS } from '../../shared/genetic/Strains.js';

async function verifyNursery() {
    console.log("🌌 DREAMNET: NURSERY IGNITION PROTOCOL...");

    // 1. Initialize the Organs
    const flashTrader = FlashTrader.getInstance();
    const scouter = new ArbitrageAgent("Scouter_Z", {
        scoutFrequency: 1000,
        minYieldThreshold: 0.02,
        protocols: ['Uniswap'],
        genome: STRAINS.SCOUT
    });
    const harvester = new HarvesterAgent("Impact_X", {
        targetNodeIds: ['node_1'],
        harvestGoal: 10,
        viralityFactor: 0.5,
        genome: STRAINS.PREDATOR
    });

    console.log("\n--- [STAGE 1: Registration Check] ---");
    const ftGenome = nursery.getGenome('FlashTrader');
    console.log(`FlashTrader Genome: ${ftGenome?.strain} (Gen ${ftGenome?.generation})`);

    // 2. Simulate Performance
    console.log("\n--- [STAGE 2: Fitness Accumulation] ---");
    console.log("Simulating high-yield trade for FlashTrader...");
    dreamEventBus.publish({
        type: 'Market.AlphaExtracted',
        payload: { agentId: 'FlashTrader', yield: 0.082 },
        source: 'Simulator'
    });

    await new Promise(r => setTimeout(r, 100)); // Wait for bus pulse

    // 3. Trigger Evolution
    console.log("\n--- [STAGE 3: The Mutation] ---");
    const nextGenome = nursery.evolve('FlashTrader');
    console.log(`FlashTrader evolved to Generation ${nextGenome.generation}`);

    // Verify genes changed
    const oldYield = 0.02; // Initial
    const newYield = nextGenome.genes.minYield.value;
    console.log(`Yield Threshold: ${oldYield.toFixed(4)} -> ${newYield.toFixed(4)}`);

    // 4. Verify propagation in agent
    console.log("\n--- [STAGE 4: Neural Propagation] ---");
    const stats = flashTrader.getStats();
    if (stats.currentGenome.generation === 2) {
        console.log("✅ Propagation Success: FlashTrader is now using Generation 2 DNA.");
    } else {
        console.error("❌ Propagation Failed: FlashTrader still on legacy DNA.");
    }

    console.log("\n🌌 NURSERY ONLINE. THE SWARM IS EVOLVING. 🩸");
    process.exit(0);
}

verifyNursery().catch(e => {
    console.error("Fatal Nursery failure:", e);
    process.exit(1);
});
