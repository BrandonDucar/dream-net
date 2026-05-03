import { dreamEventBus } from './spine/dreamnet-event-bus/DreamEventBus.js';
import { chronoLoom } from './spine/memory/ChronoLoom.js';

async function runChronoTest() {
    console.log('🧪 [Test] Starting ChronoLoom Temporal Weave Verification...');

    // 1. Flush any existing buffer to start clean
    // (We cast to any to access private method if needed, or rely on event trigger)
    
    // 2. Simulate High-Entropy System Events
    const events = [
        { type: 'System.GatewayRotation', source: 'MirageCloak', payload: { active: 'ipfs.io', latency: 45 } },
        { type: 'System.SolarYieldForecast', source: 'SolarReach', payload: { mw: 1200, angle: 45 } },
        { type: 'WolfPack.ProposalSent', source: 'WolfPackMailer', payload: { target: 'Helion' } },
        { type: 'BioDaemon.Stimulation', source: 'BioDaemon', payload: { hrv: 25, action: 'PULSE' } }
    ];

    console.log(`🧪 [Test] Injecting ${events.length} events into the Nerve Bus...`);

    for (const evt of events) {
        dreamEventBus.publish({
            eventType: evt.type,
            source: evt.source,
            payload: evt.payload,
            ttl: 5000,
            eventId: `test-${Date.now()}-${Math.random()}`,
            timestamp: Date.now()
        } as any);
        
        // Small delay to ensure order
        await new Promise(r => setTimeout(r, 50));
    }

    // 3. Trigger Buffer Flush (Batch Size is 10, so we simulate enough events to force it or wait)
    // We'll inject filler events to hit the batch limit of 10
    console.log('🧪 [Test] Filling buffer to force flush...');
    for (let i = 0; i < 7; i++) {
        dreamEventBus.publish({
            eventType: 'System.Heartbeat',
            source: 'PulseOne',
            payload: { tick: i },
            ttl: 0,
            eventId: `tick-${i}`,
            timestamp: Date.now()
        } as any);
    }

    // Wait for async processing
    await new Promise(r => setTimeout(r, 1000));

    // 4. Query Timeline Slice
    console.log('🧪 [Test] Querying ChronoLoom Timeline...');
    const history = await chronoLoom.getTimelineSlice(20);
    console.log(`🧪 [Test] Retrieved ${history.length} woven events from history.`);

    if (history.length > 0) {
        const sample = history[0];
        console.log('   -> Provenance Check:', sample.provenance ? '✅ SECURED' : '❌ MISSING');
        console.log('   -> Vector Check:', sample.provenance?.vectorized ? '✅ INDEXED' : '❌ FAILED');
    }

    console.log('🧪 [Test] CAUTION: Verify console logs for "Timeline Slice Persisted".');
}

runChronoTest().catch(console.error);
