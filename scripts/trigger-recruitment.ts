import { dreamEventBus } from './packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/index';
import { assessorBotService } from './packages/organs/integumentary/server/src/services/AssessorBotService';
import { bondingCurveEngine } from './packages/organs/nervous/trading-organ/BondingCurveEngine';

async function simulateRecruitment() {
    console.log("🚀 STARTING RECRUITMENT SIMULATION...");

    const testAgentId = "Mercenary_Alpha_7";

    // 1. Simulate ToolGym Benchmark Completion
    console.log(`\n🏋️ Simulating ToolGym benchmark for ${testAgentId}...`);
    dreamEventBus.publish('ToolGym.BenchmarkComplete', {
        agentId: testAgentId,
        score: 92,
        rank: 'APEX'
    });

    // Wait for AssessorBot to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Check Assessment result
    const assessment = assessorBotService.getAssessment(testAgentId);
    if (assessment) {
        console.log(`\n⚖️ Assessment Result for ${testAgentId}:`);
        console.log(`Score: ${assessment.score.toFixed(2)}`);
        console.log(`Verdict: ${assessment.verdict}`);
        console.log("Notes:", assessment.assessorNotes);
        console.log("Consensus:", assessment.consensus);
    } else {
        console.error("❌ No assessment found for agent!");
    }

    // 3. Verify Bonding Curve Initialization
    const curve = bondingCurveEngine.getState(`${testAgentId}_TOKEN`);
    if (curve) {
        console.log(`\n📈 Bonding Curve for ${testAgentId}_TOKEN initialized.`);
        console.log(`Current Price: ${curve.price}`);
    } else {
        console.error("❌ Bonding curve not initialized!");
    }

    console.log("\n✅ RECRUITMENT SIMULATION COMPLETE.");
}

simulateRecruitment().catch(console.error);
