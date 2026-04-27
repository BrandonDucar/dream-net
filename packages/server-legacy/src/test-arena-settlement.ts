import { NerveBus } from '@dreamnet/nerve';
import { arenaService } from './core/ArenaService.js';
import { arenaSettlement } from './core/ArenaSettlementService.js';
import { economicGovernor } from './core/EconomicGovernor.js';

async function testArenaSettlementFlow() {
    console.log('🧪 Starting Full Arena Settlement Flow Test...');
    const bus = new NerveBus();

    const marketId = 'TRUTH-666';
    const description = 'Will the Starbridge build succeed within 30 seconds?';

    // 1. Create & Open Market
    console.log('\n--- Step 1: Opening Market ---');
    arenaSettlement.createMarket({
        id: marketId,
        question: description,
        deadline: Date.now() + 60000,
        status: 'open',
        poolJoules: 100
    });

    bus.publish('SYSTEM_CORE', {
        kind: 'ARENA_MARKET_OPEN',
        payload: { marketId, description },
        timestamp: Date.now()
    } as any);

    // 2. Agents place bets
    console.log('\n--- Step 2: Placing Bets ---');
    arenaService.placeBet(marketId, 'SovereignAgent', 50, 'YES');
    arenaService.placeBet(marketId, 'SkepticAgent', 50, 'NO');

    console.log(`Sovereign Balance (Before): ${economicGovernor.getBalance()}`);

    // Wait for internal state propagation
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. Trigger Truth Event (Auto-settlement trigger)
    console.log('\n--- Step 3: Triggering Truth (Build Success) ---');
    bus.publish('SYSTEM', {
        type: 'BUILD_SUCCESS',
        payload: { duration: 12000 }
    });

    // 4. Manual Settlement (Simulating the Oracle confirming the truth)
    console.log('\n--- Step 4: Confirming Settlement ---');
    await arenaSettlement.settle(marketId, true); // Outcome is YES

    // 5. Verify Payout
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`\nSovereign Balance (After): ${economicGovernor.getBalance()}`);

    if (economicGovernor.getBalance() > 1000) {
        console.log('✅ Success: Payout processed correctly.');
    } else {
        console.warn('❌ Failure: Payout not detected.');
    }

    console.log('Test Complete.');
    process.exit(0);
}

testArenaSettlementFlow().catch(console.error);
