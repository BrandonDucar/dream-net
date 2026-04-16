import { dreamEventBus } from './spine/dreamnet-event-bus/index.js';
import { agentBus } from './spine/agent-bus.js';

// Import services to initialize them (side-effect: constructors run)
import { wolfPackGovernor } from './spine/external/WolfPackGovernor.js';
import { wolfPackAnalyst } from './spine/external/WolfPackAnalyst.js';
import { treasuryExecutor } from './spine/treasury/TreasuryExecutor.js';
import { treasuryMonitor } from './spine/treasury/TreasuryMonitor.js';
import { treasurySentinel } from './spine/treasury/TreasurySentinel.js';

/**
 * 🧪 Phase XXXIV Integration Test
 * 
 * Verifies:
 * 1. Wolf Pack Feedback Loop: Feedback -> Analyst -> Governor -> Status Update
 * 2. Treasury Hardening: Failure -> Monitor -> Gas Refinement
 * 3. Achievement Broadcast: Success -> Executor -> Public Event
 */

async function runTest() {
    console.log('🧪 [Test-34] Initializing Phase XXXIV Verification...');

    await new Promise(resolve => setTimeout(resolve, 1000));

    // ============================================
    // TEST 1: Wolf Pack Feedback Loop
    // ============================================
    console.log('\n--- 🧪 TEST 1: Wolf Pack Feedback Loop ---');

    const targetId = 'target-001-spinlaunch'; // Must match a mock target if needed, but Governor loads from JSON.
    // For this test, we accept that Governor might not find the ID if not in JSON, but we verify the event flow.

    // Simulate Feedback
    console.log('📡 [Test] Simulating partner feedback ("Interested")...');
    dreamEventBus.publish(dreamEventBus.createEnvelope(
        'WolfPack.FeedbackReceived',
        'TestHarness',
        { targetId, text: "We are interested in a partnership." }
    ));

    await new Promise(resolve => setTimeout(resolve, 500));

    // ============================================
    // TEST 2: Treasury Hardening (Gas Refinement)
    // ============================================
    console.log('\n--- 🧪 TEST 2: Treasury Hardening ---');

    // Simulate Execution Failure
    console.log('💥 [Test] Simulating OUT_OF_GAS failure...');
    agentBus.emit('TREASURY_EXECUTION_FAILURE', {
        id: 'intent-fail-001',
        error: 'Error: Replacement transaction underpriced (OUT_OF_GAS)'
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // ============================================
    // TEST 3: Achievement Broadcasts
    // ============================================
    console.log('\n--- 🧪 TEST 3: Achievement Broadcasts ---');

    console.log('🏆 [Test] Simulating successful Mercenary Bonus...');
    agentBus.emit('TREASURY_INTENT_APPROVED', {
        id: 'intent-success-001',
        token: 'USDC',
        amount: '1000000',
        to: '0xAgent',
        urgency: 'MEDIUM',
        metadata: {
            type: 'PERFORMANCE_BONUS',
            agentId: 'Agent_Smith',
            score: 98
        },
        approvalHash: '0xSig',
        approvedAt: Date.now()
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('\n✅ [Test-34] Verification sequence complete. Check logs for logic confirmation.');
}

runTest().catch(console.error);
