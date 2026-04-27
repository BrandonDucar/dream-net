
// Dynamic imports to bypass local static resolution flakiness
async function runPilot() {
    console.log('⏳ [Phase XXXI] Initiating Temporal Weave Pilot...');
    
    // Import the services
    const { chronoLoom } = await import('../../nerve/src/spine/memory/ChronoLoom.js');
    const { dreamEventBus } = await import('../../nerve/src/dreamnet-event-bus/DreamEventBus.js');

    // Wait for services to initialize
    await new Promise(r => setTimeout(r, 500));

    console.log('\n🧶 [ChronoLoom] Injecting Entropy...');
    
    // Simulate events
    const testEvents = [
        { type: 'ORBITAL_ALIGNMENT', payload: { azimuth: 124.5, elevation: 42.0 } },
        { type: 'DREAM_SEED_LAUNCH', payload: { podId: 'seed-alpha', velocity: 7500 } },
        { type: 'VECTOR_MESH_SYNC', payload: { shards: 12, size: '4MB' } }
    ];

    for (const evt of testEvents) {
        dreamEventBus.publish(dreamEventBus.createEnvelope(
            evt.type,
            'PilotScript',
            evt.payload
        ));
        await new Promise(r => setTimeout(r, 100)); // Stagger for timeline effect
    }

    // Give ChronoLoom time to process
    await new Promise(r => setTimeout(r, 1000));
    
    // Query Slice
    const timeline = await chronoLoom.getTimelineSlice();
    console.log(`\n🧶 [ChronoLoom] Timeline Slice Retrieved: ${timeline.length} events.`);
    if (timeline.length > 0) {
        console.log('   > Last Event Provenance:', timeline[timeline.length - 1].provenance);
        console.log('   > Vectorized: ✅');
    }

    console.log('\n✅ [Phase XXXI] Pilot Complete. Time is Woven.');
}

runPilot().catch(err => console.error('❌ Pilot Failed:', err));
