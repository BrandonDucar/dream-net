import { WolfPackFundingAgent } from './packages/agents/src/specialized/WolfPackFundingAgent.js';

async function runWolfPackOutreach() {
    console.log('🐺 [WolfPack] Awakening Funding Agent...');

    // Quick mock config
    const config = {
        name: 'Alpha-Hunter',
        role: 'scout',
        id: 'wolf-01',
        instructions: 'Hunt',
        model: 'gpt-4o',
        tools: [],
        memory: [] as any
    };

    const wolf = new WolfPackFundingAgent(config);

    // Trigger the Strategic Horizon Sweep
    await wolf.horizonSweep();
}

runWolfPackOutreach().catch(console.error);
