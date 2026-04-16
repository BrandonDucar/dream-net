import { NerveBus } from '@dreamnet/nerve';
import { arenaService } from './core/ArenaService.js';
import { economicGovernor } from './core/EconomicGovernor.js';

async function testArena() {
    console.log('🧪 Starting Arena Truth-Settlement Test...');
    const bus = new NerveBus();

    const marketId = 'MKT-001';
    const description = 'Will Agent 0xEDF0 achieve >95% Neural Resonance?';

    // 1. Open Market
    console.log('\n--- Step 1: Opening Market ---');
    bus.publish('SYSTEM_CORE', {
        id: 'evt-1',
        channelId: 'SYSTEM_CORE',
        kind: 'ARENA_MARKET_OPEN',
        payload: { marketId, description },
        timestamp: Date.now()
    } as any);

    // 2. Place Bets
    console.log('\n--- Step 2: Placing Bets ---');
    arenaService.placeBet(marketId, 'AlphaAgent', 50, 'YES');
    arenaService.placeBet(marketId, 'BetaAgent', 30, 'NO');

    console.log(`Alpha Joules: ${economicGovernor.getBalance()}`);

    // Pulse a bit
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Resolve Market
    console.log('\n--- Step 3: Resolving Market ---');
    bus.publish('SYSTEM_CORE', {
        id: 'evt-2',
        channelId: 'SYSTEM_CORE',
        kind: 'ARENA_MARKET_RESOLVED',
        payload: { marketId, outcome: 'YES' },
        timestamp: Date.now()
    } as any);

    // Check Payout
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`\nFinal Joule Balance (Alpha): ${economicGovernor.getBalance()}`);

    console.log('Test Complete.');
    process.exit(0);
}

testArena().catch(console.error);
