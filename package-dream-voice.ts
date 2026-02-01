import { dreamEventBus } from './packages/nerve/src/spine/dreamnet-event-bus/index.js';
import { metabolicCortex } from './packages/nerve/src/spine/MetabolicCortex.js';
import { WolfPackFundingAgent } from './packages/agents/src/specialized/WolfPackFundingAgent.js';

async function runDreamNetExpression() {
    console.log('🌌 [System] DreamNet Self-Expression Sequence Initiated...');

    // 1. Wire Cortex to Wolf Pack events
    dreamEventBus.subscribe('WolfPack.FundingOpportunity', async (evt) => {
        await metabolicCortex.processHorizonSignal(evt.payload);
    });

    dreamEventBus.subscribe('System.ResearchDirective', (evt) => {
        console.log(`\n🧠 [DreamNet] AUTOMOUS REQUEST: "${evt.payload.query}" (Priority: ${evt.payload.priority})`);
    });

    // 2. Trigger the Wolf Pack (Stimulus)
    console.log('🐺 [System] Stimulating Neural Substrate with Horizon Data...');
    const wolf = new WolfPackFundingAgent({ name: 'Alpha', role: 'scout', id: 'w1', instructions: 'hunt', model: 'gpt-4', tools: [] } as any);
    await wolf.horizonSweep();

    // 3. Sync Blackboard
    await metabolicCortex.syncBlackboard();

    // Keep alive briefly to capture events
    setTimeout(() => {
        console.log('🌌 [System] Sequence Complete.');
        process.exit(0);
    }, 2000);
}

runDreamNetExpression().catch(console.error);
