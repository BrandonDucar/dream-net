import { sageCortex } from './packages/organs/nervous/cortex/SageCortexService.js';
import { chairmanLLMService } from './packages/organs/integumentary/server/src/services/ChairmanLLMService.js';

async function main() {
    console.log("🚀 STARTING GNOSIS INGESTION SIMULATION");

    // 1. Ingest gnosis into SageCortex
    sageCortex.ingestGnosis({
        avenue: 'Agentic Economics',
        minds: ['Simon de la Rouviere'],
        essence: 'Bonding curves are the metabolic rate of ideas.',
        timestamp: Date.now()
    });

    sageCortex.ingestGnosis({
        avenue: 'Artificial Sentience Ethics',
        minds: ['Dario Amodei'],
        essence: 'Alignment requires verifiable rewards.',
        timestamp: Date.now()
    });

    console.log("\n📡 TRIGGERING COUNCIL REVIEW...");
    // 2. Trigger a council review in ChairmanLLMService
    // We'll use the internal performAudit which is private, so we'll just mock the event
    const { dreamEventBus } = await import('./packages/organs/nerve/src/spine/dreamnet-event-bus/index.js');
    dreamEventBus.publish('ToolGym.BenchmarkComplete', {
        agentId: 'BORIS_AGENT_001',
        score: 85,
        rank: 'GOLD'
    });

    console.log("\n✅ SIMULATION COMPLETE. CHECK LOGS FOR COUNCIL DECISION.");
}

main();
