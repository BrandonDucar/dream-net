import { chronoLoom } from '../packages/organs/nervous/cortex/ChronoLoomService.js';
import { optioOrchestrator } from '../packages/organs/nervous-subsystem/OptioOrchestrator.js';

/**
 * Test: Temporal Mesh Verification
 * Ensures that "ripe" memories are correctly offloaded to the Optio Distributed Mesh.
 */
async function testTemporalMesh() {
    console.log("⏳ [Test] Starting Temporal Mesh Verification...");

    // 1. Initialize Optio Mesh (Mock Ignition)
    await optioOrchestrator.ignite();

    // 2. Weave a memory
    const memoryId = "mem_test_protocol_001";
    chronoLoom.weave(memoryId);

    // 3. Simulate drift (Force Ripen)
    console.log("⏳ [Test] Forcing temporal drift...");

    // Hack: Manually force ripeness for test (since we can't wait 24h)
    // accessing private map via any for testing purposes
    const thread = (chronoLoom as any).memoryThreads.get(memoryId);
    if (thread) {
        thread.birth = Date.now() - (1000 * 60 * 60 * 25); // 25 hours ago
    }

    await chronoLoom.ripen(memoryId);

    // 4. Verify Offload
    const status = chronoLoom.getStatus();
    console.log("📊 [Test] ChronoLoom Status:", JSON.stringify(status, null, 2));

    if (status.offloadedCount === 1) {
        console.log("✅ [PASS] Memory successfully offloaded to Optio Mesh.");
    } else {
        console.error("❌ [FAIL] Memory was not offloaded.");
        process.exit(1);
    }

    // 5. Cleanup
    optioOrchestrator.stop();
    console.log("🛑 [Test] Stopping Optio Orchestrator.");
}

testTemporalMesh().catch(console.error);
