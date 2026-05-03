import { chronoLoom } from './spine/memory/ChronoLoom.js';
import { eventGraphQL } from './spine/streaming/EventGraphQLService.js';
import { dreamEventBus } from './spine/dreamnet-event-bus/DreamEventBus.js';

/**
 * 🧪 Test Recall: Verifying Quantum Recall & Reverse Siphon
 */
async function runTest() {
    console.log('🧪 Starting Quantum Recall Test...');

    // 1. Inject some events into the fabric
    const events = [
        { type: 'System.SolarYield', payload: { yield: 450, status: 'NOMINAL' } },
        { type: 'WolfPack.ProposalSent', payload: { target: 'Helion Energy', status: 'SENT' } },
        { type: 'System.MirageCloak', payload: { gateway: '10.0.0.1', rotation: true } }
    ];

    console.log('🧪 Injecting events...');
    for (const e of events) {
        dreamEventBus.publish(dreamEventBus.createEnvelope(
            e.type,
            'TestRunner',
            e.payload,
            { severity: 'low' }
        ));
    }

    // Wait for VectorMesh (simulated shard)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Test getTimelineSlice via GraphQL
    console.log('\n--- Testing getTimelineSlice ---');
    const timeline = await eventGraphQL.query('query { timeline(limit: 5) }', { limit: 5 });
    console.log('Timeline Result:', JSON.stringify(timeline, null, 2));

    // 3. Test searchTimeline (Reverse Siphon) via GraphQL
    console.log('\n--- Testing searchTimeline (Reverse Siphon) ---');
    const searchResults = await eventGraphQL.query('query { searchTimeline(query: "Solar energy prediction", limit: 3) }', { 
        query: 'Solar energy prediction', 
        limit: 3 
    });
    
    console.log('Search Results (Simulated Siphon):');
    (searchResults as any[]).forEach((res, i) => {
        console.log(`[${i+1}] Score: ${(res.score * 100).toFixed(1)}% | Type: ${res.type} | ID: ${res.id}`);
    });

    console.log('\n🧪 Quantum Recall Test Complete.');
}

runTest().catch(console.error);
