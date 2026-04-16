import { triuneMemory, MemoryTier } from './spine/memory/TriuneMemory.js';
import { dreamEventBus } from './spine/dreamnet-event-bus/index.js';

/**
 * 🧪 Test Triune Memory System
 * Verifies event persistence across LIZARD, MAMMAL, and COSMIC tiers.
 */
async function runTest() {
    console.log('🧪 [TriuneMemory Test] Starting verification...\n');

    // Inject test events
    console.log('📝 Injecting 5 test events...');
    for (let i = 0; i < 5; i++) {
        dreamEventBus.publish(dreamEventBus.createEnvelope(
            `Test.Event${i}`,
            'TriuneMemoryTest',
            { index: i, message: `Test event ${i}` },
            { severity: 'low' }
        ));
    }

    // Wait for async persistence
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test LIZARD tier (ephemeral buffer)
    console.log('\n🦎 [LIZARD Tier] Recalling from ephemeral buffer...');
    const lizardEvents = await triuneMemory.recall({ tier: 'LIZARD' as MemoryTier, limit: 10 });
    console.log(`   Found ${lizardEvents.length} events in LIZARD buffer:`);
    lizardEvents.forEach(e => console.log(`   - ${e.type} @ ${new Date(e.timestamp).toISOString()}`));

    // Test MAMMAL tier (semantic search)
    console.log('\n🧠 [MAMMAL Tier] Attempting semantic search...');
    try {
        const mammalEvents = await triuneMemory.recall({ 
            tier: 'MAMMAL' as MemoryTier, 
            query: 'test event',
            limit: 5 
        });
        console.log(`   Found ${mammalEvents.length} events via semantic search.`);
    } catch (error: any) {
        console.log(`   ⚠️  ${error.message}`);
    }

    // Test COSMIC tier (immutable archive)
    console.log('\n🌌 [COSMIC Tier] Attempting archive recall...');
    const cosmicEvents = await triuneMemory.recall({ tier: 'COSMIC' as MemoryTier });
    console.log(`   Found ${cosmicEvents.length} events in COSMIC archive.`);

    // Get memory stats
    console.log('\n📊 [Memory Stats]');
    const stats = triuneMemory.getStats();
    console.log(`   LIZARD: ${stats.lizard.count}/${stats.lizard.capacity} events`);
    console.log(`   Oldest: ${stats.lizard.oldest ? new Date(stats.lizard.oldest).toISOString() : 'N/A'}`);
    console.log(`   Newest: ${stats.lizard.newest ? new Date(stats.lizard.newest).toISOString() : 'N/A'}`);

    console.log('\n✅ [TriuneMemory Test] Verification complete.');
    process.exit(0);
}

runTest().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
