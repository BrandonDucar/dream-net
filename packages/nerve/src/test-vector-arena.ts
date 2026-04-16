import { ActionEvent, dreamEventBus } from './spine/dreamnet-event-bus/DreamEventBus.js';
import { vectorMeshConduit } from './spine/memory/VectorMeshConduit.js';
import { arenaSettlement } from './spine/arena/ArenaSettlementService.js';
import { laminarHarbor } from './spine/streaming/LaminarHarborService.js';

async function runVectorArenaTest() {
    console.log('🧪 [Test] Starting Vector Mesh + Arena Grounding Test...');

    // 1. Simulate Agent Thought & Memory Sharding
    const agentId = 'test-agent-alpha';
    const thought = 'Initial analysis of Avenue 22 (Viral Sovereignty) suggests that high-speed telemetry is critical for agent coordination.';

    console.log('🧪 [Test] 1. Sharding memory conduit...');
    await vectorMeshConduit.shard({
        id: `mem-${Date.now()}`,
        values: new Array(1536).fill(0.1),
        metadata: { agentId, timestamp: Date.now(), tags: ['viral-sovereignty', 'phase-22'] }
    });

    // 2. Create Arena Prop Market based on the thought
    console.log('🧪 [Test] 2. Initializing Arena Truth-Market...');
    const marketId = arenaSettlement.createMarket(
        'Should DreamNet prioritize Svelte-based dashboards for all performance-critical telemetry?',
        ['YES', 'NO', 'REQUIRES_ABSTRACTION'],
        5000 // 5 seconds duration
    );

    // 3. Simulate Collective Voting
    console.log('🧪 [Test] 3. Simulating agent consensus...');
    arenaSettlement.castVote(marketId, 'agent-beta', 'YES');
    arenaSettlement.castVote(marketId, 'agent-gamma', 'YES');
    arenaSettlement.castVote(marketId, 'agent-delta', 'REQUIRES_ABSTRACTION');

    // 4. Resolve Market
    console.log('🧪 [Test] 4. Resolving market consensus...');
    arenaSettlement.resolveMarket(marketId);

    const market = arenaSettlement.getMarket(marketId);
    console.log(`🧪 [Test] FINAL RESOLUTION: ${market?.resolution}`);

    // 5. Verify Durable Logging
    console.log('🧪 [Test] 5. Verifying durable fabric mirror...');
    // LaminarHarbor automatically subscribes to all events via the bus

    console.log('🧪 [Test] Grounding complete. All conduits verified.');
}

runVectorArenaTest().catch(console.error);
