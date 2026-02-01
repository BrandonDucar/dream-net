import { flashTrader } from '../src/spine/FlashTrader.js';
import { ArbitrageAgent } from '../../agents/src/specialized/ArbitrageAgent.js';
import { dreamEventBus } from '../src/spine/dreamnet-event-bus/index.js';
import { pilotRegistry } from '../src/spine/PilotRegistry.js';

async function main() {
    console.log("🚀 INITIALIZING ALPHA WAVE SIMULATION");

    // 1. Setup the environment
    console.log("\n📡 REGISTERING PREDATORY PILOTS...");
    pilotRegistry.assign('Pilot_Fox', 'arbitrage');

    // 2. Deploy Arbitrage Agent 'Fox_1'
    console.log("\n🦊 DEPLOYING ARBITRAGE AGENT: 'FOX_1'");
    const fox = new ArbitrageAgent('Fox_1', {
        scoutFrequency: 1000,
        minYieldThreshold: 0.02,
        protocols: ['Uniswap', 'Sushiswap', 'Curve']
    });

    // 3. Ignite the Harvester (Scout) after a brief settle
    console.log("\n⏳ NEURAL MESH SETTLING...");
    await new Promise(resolve => setTimeout(resolve, 500));
    await fox.ignite();

    // 4. Verify Event Propagation and Trader Execution
    console.log("\n⚡ MONITORING FLASHTRADER PULSE...");

    // We simulate a manual trigger to ensure the listener is active
    dreamEventBus.publish({
        type: 'Market.OpportunityDetected',
        payload: {
            opportunityId: 'OPP-MANUAL-777',
            protocol: 'Uniswap',
            tokenPair: ['ETH', 'DAI'],
            expectedYield: 0.045,
            confidence: 0.92
        },
        source: 'Manual_Ignition'
    });

    // 5. Check Stats
    setTimeout(() => {
        const stats = flashTrader.getStats();
        console.log("\n📈 ALPHA WAVE SESSION STATS:");
        console.log(`Total Alpha Extracted: ${(stats.totalAlphaExtracted * 100).toFixed(2)}%`);
        console.log(`Status: ${stats.status}`);

        if (stats.totalAlphaExtracted > 0) {
            console.log("\n✅ ALPHA WAVE LOGIC VERIFIED.");
        } else {
            console.warn("\n❌ ALPHA WAVE FAILED: No alpha extracted.");
            process.exit(1);
        }
    }, 1000);
}

main().catch(console.error);
