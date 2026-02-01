import 'dotenv/config';
import { metabolicCortex } from '../src/spine/MetabolicCortex.js';

/**
 * test-cortex-consult
 * Injects reports from all major subsystems and triggers a Meta-Analysis 
 * to answer the Commander's query: "Does it have any suggestions?"
 */
async function consultCortex() {
    console.log("🧬 DREAMNET: SYSTEM-WIDE SYNTHESIS & CONSULTATION 🩸");
    console.log("--------------------------------------------------");

    console.log("\n[Cortex] Ingesting subsystem reports...");

    // 1. Report from FlashTrader
    await metabolicCortex.reportBack({
        agentId: 'FLASHTRADER-ALPHA',
        suit: 'solana_defi',
        data: { status: 'IDLE', reason: 'Awaiting Mainnet Capital', opportunity: 'Base/Solana Arbitrage' },
        timestamp: Date.now()
    });

    // 2. Report from Nursery
    await metabolicCortex.reportBack({
        agentId: 'NURSERY_GENESIS',
        suit: 'gene_pool',
        data: { generation: 2, topStrain: 'Amnesia Haze', evolutionReady: true },
        timestamp: Date.now()
    });

    // 3. Report from Sovereign Wallet
    await metabolicCortex.reportBack({
        agentId: 'SOVEREIGN_WALLET',
        suit: 'smart_wallet',
        data: { mode: 'SOVEREIGN_MODE', trustScore: 0, warning: 'Trust Accumulation Pending' },
        timestamp: Date.now()
    });

    // 4. Report from Wolf Pack
    await metabolicCortex.reportBack({
        agentId: 'WOLF_PACK_SCOUT',
        suit: 'outreach',
        data: { target: 'Arc Agentic Commerce', status: 'DRAFT_DISPATCHED', needs: 'Real Capital to Burn' },
        timestamp: Date.now()
    });

    // 4 reports in history. Need 1 more to trigger auto-analysis (every 5th).
    // Let's force it manually or add one more significant report.

    // 5. Report from HACK-MECH
    console.log("[Cortex] Triggering Critical Pulse...");
    await metabolicCortex.reportBack({
        agentId: 'BOBA_FETT',
        suit: 'hackathon_mech',
        data: { mission: 'LIVE_EXTRACTION', readiness: '100%', roadblock: 'Lack of Mainnet Fuel' },
        timestamp: Date.now()
    });

    // Note: The real metaAnalyze calls brainGate.think, which uses the LLM. 
    // Since we are running this in a script, we rely on the mocked/actual BrainGate behavior encoded in the file.
    // If BrainGate is not mocked to return text, this will hit the actual LLM API if keys are present.

    console.log("\n--------------------------------------------------");
    console.log("✨ CORTEX CONSULTATION COMPLETE.");
}

consultCortex().catch(e => {
    console.error("Consultation failed:", e);
    process.exit(1);
});
