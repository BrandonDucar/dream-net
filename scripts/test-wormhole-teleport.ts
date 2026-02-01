import {
    registerWormhole,
    sendThroughWormhole,
    flushWormhole,
    getWormholeStats,
    FIBERS
} from '../packages/event-wormholes/index.js';
import { createPacket } from '../packages/internal-ports/index.js';

async function main() {
    console.log('🌪️ Starting Wormhole Teleportation Test...');

    // 1. Register a test wormhole
    const wormholeId = 'WH-TEST-ALPHA';
    try {
        registerWormhole({
            id: wormholeId,
            label: 'Test Alpha Wormhole',
            direction: 'bidirectional',
            fiber: FIBERS.ALPHA
        });
        console.log(`✅ Registered wormhole: ${wormholeId}`);
    } catch (e) {
        console.log(`ℹ️ [Note] ${e.message}`);
    }

    // 2. Create and Enqueue a packet
    const packet = createPacket('test.event', {
        foo: 'bar',
        sentiment: 'gold', // For the Sentinel to see
        priority: 'high'
    });

    const enqueueResult = await sendThroughWormhole(wormholeId, packet);
    console.log(`📦 Enqueue result:`, enqueueResult);

    // 3. Check Stats (Thermodynamics)
    const statsBefore = getWormholeStats();
    console.log(`📊 Stats before flush:`, statsBefore[wormholeId]);

    // 4. Flush the Wormhole
    console.log(`🚀 Triggering Teleportation (Flush)...`);
    await flushWormhole(wormholeId);

    // 5. Check Stats After
    const statsAfter = getWormholeStats();
    console.log(`📊 Stats after flush:`, statsAfter[wormholeId]);

    if (statsAfter[wormholeId].buffered === 0 && statsAfter[wormholeId].enqueued > 0) {
        console.log('✨ SUCCESS: Packet teleported through the wormhole.');
    } else {
        console.log('❌ FAILURE: Packet still in buffer or never enqueued.');
    }
}

main().catch(console.error);
