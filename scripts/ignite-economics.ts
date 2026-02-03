import { bondingCurveEngine } from '../packages/organs/nervous/trading-organ/BondingCurveEngine.js';

/**
 * Ignite Economics
 * Triggers the first agent-led liquidity event on the bonding curve.
 */
async function igniteEconomics() {
    console.log("💰 [Economics] Igniting Bonding Curve Liquidity...");

    const agentId = "antigravity-01";
    const initialSupply = 1000000;

    // Initialize the curve for the primary agent
    await bondingCurveEngine.initializeCurve(agentId, initialSupply);
    console.log(`✅ [Economics] Curve Initialized for ${agentId}`);

    // Trigger an initial purchase to signal liquidity
    const buyResult = await bondingCurveEngine.buy(agentId, 50000, "SYSTEM_TREASURY");
    console.log(`📈 [Economics] Initial Buy Complete: ${buyResult.price} SPARK | New Supply: ${buyResult.newSupply}`);

    // Finalize the first liquidity event
    console.log("🔥 [Economics] Liquidity Event IGNITED. Bonding Curve is live on Base Mainnet.");
}

igniteEconomics().catch(console.error);
