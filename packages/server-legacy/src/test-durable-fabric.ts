import { NERVE_BUS } from '@dreamnet/nerve';
import { laminarHarbor } from './core/LaminarHarborService.js';
import { eventGraph } from './core/EventGraphQLService.js';

async function testDurableFabric() {
    console.log('🧪 Starting Durable Event Fabric Test...');

    // 1. Emit some events
    const testEvents = [
        { type: 'NEURAL_PULSE', message: 'First sub-ms pulse' },
        { type: 'ENERGY_SHIFT', message: 'Sodium flow steady' },
        { type: 'ARENA_UPDATE', message: 'Consensus forming' }
    ];

    for (const data of testEvents) {
        NERVE_BUS.publish({
            eventType: data.type,
            source: 'test_script',
            payload: data
        });
        // Short delay to ensure disk write
        await new Promise(r => setTimeout(r, 100));
    }

    console.log('✅ Events published and (hopefully) replicated.');

    // 2. Query via GraphQL Service
    console.log('\n🔍 Querying Historical Data (NEURAL_PULSE)...');
    const pulseResults = await eventGraph.queryEvents({
        topic: 'dreamnet.pulse.NEURAL_PULSE',
        startTime: Date.now() - 60000 // Last minute
    });

    console.log(`📊 Found ${pulseResults.length} events for Neural Pulse.`);
    pulseResults.forEach(ev => {
        console.log(`   [${ev.status}] ${ev.eventId} @ ${new Date(ev.timestamp).toLocaleTimeString()} : ${ev.payload?.message || 'N/A'}`);
    });

    // 3. Verify specifically for the test data
    const foundTest = pulseResults.find(ev => ev.source === 'test_script');
    if (foundTest) {
        console.log('\n✨ VERIFICATION SUCCESS: Replicated event recovered from durable storage.');
    } else {
        console.error('\n❌ VERIFICATION FAILURE: Could not recover replicated event.');
        process.exit(1);
    }
}

testDurableFabric().catch(err => {
    console.error('💥 Test Error:', err);
    process.exit(1);
});
