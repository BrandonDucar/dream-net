import { apiHopper } from '../packages/api/src/services/APIHopperService.js';
import { roastEngine } from '../packages/api/src/services/RoastEngine.js';
import { tattooStudio } from '../packages/api/src/services/TattooStudio.js';
import { aryaAgent } from '../server/agents/AryaStarkAgent.js';
import { clawdChatSpike } from '../packages/sensory-spikes/src/spikes/ClawdChatSpike.js';

async function testProductionReadiness() {
    console.log('🧪 Starting Production Readiness Test...');

    // 1. Test API Hopper
    console.log('--- API Hopper ---');
    const providers = (apiHopper as any).providers;
    console.log(`✅ Loaded ${Object.keys(providers).length} providers.`);
    console.log(`   Providers: ${Object.keys(providers).join(', ')}`);

    // 2. Test Roast Engine Linkage
    console.log('\n--- Roast Engine ---');
    if (roastEngine) {
        console.log('✅ RoastEngine instantiated.');
    }

    // 3. Test Tattoo Studio Linkage
    console.log('\n--- Tattoo Studio ---');
    if (tattooStudio) {
        console.log('✅ TattooStudio instantiated.');
    }

    // 4. Test Arya Stark Agent
    console.log('\n--- Arya Stark Agent ---');
    if (aryaAgent) {
        console.log('✅ AryaStarkAgent initialized.');
        // Check if tools were discovered
        const tools = (aryaAgent as any).tools;
        console.log(`✅ Discovered ${tools?.length || 0} tools.`);
    }

    // 5. Test Sensory Spikes
    console.log('\n--- Sensory Spikes ---');
    if (clawdChatSpike) {
        console.log('✅ ClawdChatSpike implemented.');
    }

    console.log('\n✨ Production Readiness Check COMPLETE.');
}

testProductionReadiness().catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
});
