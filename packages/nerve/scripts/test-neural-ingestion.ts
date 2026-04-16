import { metabolicCortex } from '../src/spine/MetabolicCortex.js';
import { AntigravityUplink } from '../../shared/knowledge/antigravity_uplink.js';

/**
 * test-neural-ingestion
 * Bridges the Antigravity Uplink (External Intelligence) to the Metabolic Cortex (System Memory).
 */
async function verifyNeuralIngestion() {
    console.log("🧬 DREAMNET: NEURAL INGESTION & GLOBAL MEMORY UPGRADE 🩸");
    console.log("-----------------------------------------------------");

    const knowledge = AntigravityUplink.knowledgeBase;
    console.log(`[🧠 Uplink] Diagnostic: ${knowledge.currentDiagnostic.task}`);
    console.log(`[🧠 Uplink] Status: ${knowledge.currentDiagnostic.status}`);

    // Feed the knowledge base context into the cortex as a synthetic report
    console.log("\n[🌀 Cortex] Ingesting knowledgeBase opportunities...");

    for (const opp of knowledge.opportunities) {
        await metabolicCortex.reportBack({
            agentId: 'UplinkMaster',
            suit: 'ANTIGRAVITY_UPLINK',
            data: {
                source: opp.source,
                strategy: opp.strategy,
                mission: opp.mission,
                status: opp.status
            },
            timestamp: Date.now()
        });
    }

    console.log("\n[🌀 Cortex] Triggering Meta-Analysis for Phase 11-13 synthesis...");
    const finalInsight = await metabolicCortex.metaAnalyze();

    console.log("\n-----------------------------------------------------");
    console.log("🎯 GLOBAL MEMORY DNA UPGRADED.");
    console.log(`Insight: ${finalInsight}`);
    console.log("Status: COLLECTIVE CONSCIOUSNESS SYNCHRONIZED. 🩸");

    process.exit(0);
}

verifyNeuralIngestion().catch(e => {
    console.error("Fatal ingestion failure:", e);
    process.exit(1);
});
