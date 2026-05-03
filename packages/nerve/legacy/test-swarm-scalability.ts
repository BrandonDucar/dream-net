
import { WorkerFactory } from './spine/factory/WorkerFactory.js';
import { dreamEventBus } from './spine/dreamnet-event-bus/index.js';

/**
 * 🧪 SWARM SCALABILITY TEST
 * 
 * Verifies:
 * 1. Factory Spawning: Can we create a specific worker?
 * 2. Joule Limits: Does the worker hibernate when exhausted?
 * 3. Event Emission: Does the Sifter broadcast findings?
 */

async function runTest() {
    console.log('🧪 [Test-35] Initializing Swarm Scalability Verification...');

    // 1. Spawn Sifter
    console.log('\n--- 🧪 TEST 1: Spawning Sifter ---');
    const sifter = WorkerFactory.spawnWorker('SIFTER', {
        name: 'Sifter-01',
        description: 'GitHub Issue Filter',
        jouleLimit: 50 // Low limit to test exhaustion
    });

    if (sifter.active) {
        console.log('✅ Sifter Spawned Successfully.');
    } else {
        console.error('❌ Sifter failed to spawn.');
    }

    // 2. Setup Listener for Findings
    let opportunityFound = false;
    dreamEventBus.subscribe('Swarm.OpportunityFound', (envelope) => {
        console.log(`📡 [MainBus] Received Opportunity: "${envelope.payload.snippet}"`);
        opportunityFound = true;
    });

    // 3. Execute Task (Search for Gold)
    console.log('\n--- 🧪 TEST 2: Execution & Filtering ---');
    const mockData = [
        "Docs update",
        "Fix typo in README",
        "Refactor CSS",
        "Urgent: Bounty for new feature ($500 Reward)", // Hit
        "Update dependency",
        "Help Wanted: UI Design", // Hit
        "Add comments"
    ];

    await sifter.execute({ source: 'GitHub', content: mockData });

    // 4. Test Exhaustion
    console.log('\n--- 🧪 TEST 3: Joule Exhaustion ---');
    console.log(`Current Joules: ${sifter.joulesRemaining}`);

    // Force exhaustion
    console.log('Running massive task to drain battery...');
    const massiveTask = Array(100).fill("Spam item to drain battery");
    await sifter.execute({ source: 'SpamSource', content: massiveTask });

    if (!sifter.active) {
        console.log('✅ Sifter successfully hibernated (Joule Limit enforced).');
    } else {
        console.error('❌ Sifter did not hibernate as expected.');
    }

    // Final Check
    if (opportunityFound) {
        console.log('\n✅ [Test-35] Verification sequence complete. Swarm is operational.');
    } else {
        console.error('\n❌ [Test-35] Verification failed: No opportunities detected.');
    }
}

runTest().catch(console.error);
