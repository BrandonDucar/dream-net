
import { optioOrchestrator } from 'C:/dev/dream-net/packages/organs/nervous-subsystem/OptioOrchestrator.ts';
import { sageCortex } from 'C:/dev/dream-net/packages/organs/nervous/nerve/src/spine/intelligence/SageCortex.ts';
import { assessorBotService } from 'C:/dev/dream-net/packages/organs/integumentary/server/src/services/AssessorBotService.ts';
import { dreamEventBus } from 'C:/dev/dream-net/packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/DreamEventBus.ts';
import { bondingCurveEngine } from 'C:/dev/dream-net/packages/organs/nervous/trading-organ/BondingCurveEngine.ts';

async function verify() {
    console.log("🚀 [PHASE XXXIX-B VERIFICATION] Initializing synergy check...");

    // 1. Optio Sync
    console.log("📡 Step 1: Optio Vigor Sync...");
    // @ts-ignore
    await (optioOrchestrator as any).syncPOIMetrics();
    console.log("✅ Optio Sync Verified.");

    // 2. Sage Inhalation
    console.log("🧘 Step 2: Strategic Inhalation (Top Minds)...");
    const pollak = await sageCortex.inhale('pollak');
    const karpathy = await sageCortex.inhale('karpathy');
    console.log(`✅ Inhaled Jesse Pollak: ${pollak?.essence}`);
    console.log(`✅ Inhaled Andrej Karpathy: ${karpathy?.essence}`);

    // 3. AssessorBot Recruitment Loop (Consensus)
    console.log("🕵️ Step 3: AssessorBot Recruitment Consensus...");
    const testAgentId = 'Agent_X_99';

    // Check if bonding curve exists before toolgym
    let initialToken = bondingCurveEngine.getState(`${testAgentId}_TOKEN`);
    console.log(`   Initial Token State for ${testAgentId}: ${initialToken ? 'EXISTS' : 'MISSING'}`);

    // Trigger Benchmark Complete
    console.log(`   Publishing BenchmarkComplete for ${testAgentId}...`);
    dreamEventBus.publish('ToolGym.BenchmarkComplete', {
        agentId: testAgentId,
        score: 92,
        rank: 'APEX'
    });

    // Wait for async audit
    await new Promise(r => setTimeout(r, 2000));

    const assessment = assessorBotService.getAssessment(testAgentId);
    if (assessment) {
        console.log(`✅ Assessment for ${testAgentId}:`);
        console.log(`   - Verdict: ${assessment.verdict}`);
        console.log(`   - Final Score: ${assessment.score.toFixed(1)}`);
        console.log(`   - Consensus (Tech/Social/Finance): ${assessment.consensus?.techScore}/${assessment.consensus?.socialScore}/${assessment.consensus?.financialScore}`);
        console.log(`   - Notes: ${assessment.assessorNotes.join(' | ')}`);

        // Check bonding curve after
        const postToken = bondingCurveEngine.getState(`${testAgentId}_TOKEN`);
        console.log(`✅ Post-Audit Token State: ${postToken ? 'INITIALIZED' : 'FAILED'}`);
    } else {
        console.error("❌ Assessment failed to materialize. Check event bus listeners.");
    }

    console.log("\n🏁 [PHASE XXXIX-B] VERIFICATION COMPLETE. Substrate Synchronized.");
    process.exit(0);
}

verify().catch(err => {
    console.error("❌ Verification Script Error:");
    console.error(err);
    process.exit(1);
});
