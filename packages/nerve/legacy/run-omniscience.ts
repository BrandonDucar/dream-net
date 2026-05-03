
import { KnowledgeHarvester } from './spine/agents/KnowledgeHarvester.js';
import { KnowledgeSynthesizer } from './spine/agents/KnowledgeSynthesizer.js';
import { dreamEventBus } from './spine/dreamnet-event-bus/index.js';
import { memoryDNA } from './spine/memory/MemoryDNACore.js';

/**
 * 🧠 OPERATION OMNISCIENCE
 * 
 * This is the permanent ingestion process for the Hive Mind.
 * It initializes the Harvester and Synthesizer, then instructs the Harvester to
 * systematically ingest the entire 'OmniscienceTargets.json' dataset.
 */

async function runOmniscience() {
    console.log(`\n🧠 [HIVE MIND] INITIALIZING OPERATION OMNISCIENCE...`);
    console.log(`====================================================`);

    // 1. Initialize Agents
    const harvester = new KnowledgeHarvester();
    const synthesizer = new KnowledgeSynthesizer(); // Automatically subscribes to bus

    // 2. Setup Lifecycle Monitors
    dreamEventBus.subscribe('HiveMind.MasteryGained', (envelope) => {
        const { sector, currentMastery, globalMastery } = envelope.payload;
        // Visual logging for the user to see "ingestion" in real-time
        console.log(`✨ [Archetype] Integrated: ${sector.padEnd(25)} | Mastery: ${currentMastery.toFixed(1)}% | 🌍 Global: ${globalMastery}`);
    });

    // 3. Begin Full Ingestion
    console.log(`\n🚜 [Harvester] engaging scanning protocols for ALL sectors...`);

    try {
        // execute() with specific task to ingest ALL
        await harvester.execute({ mode: 'FULL_INGESTION' });

        console.log(`\n====================================================`);
        console.log(`✅ [HIVE MIND] OMNISCIENCE CYCLE COMPLETE.`);
        console.log(`   Final Global Mastery: ${memoryDNA.getGlobalMastery().toFixed(4)}%`);

    } catch (error) {
        console.error(`❌ [HIVE MIND] CRITICAL FAILURE:`, error);
        process.exit(1);
    }
}

// execute
runOmniscience();
