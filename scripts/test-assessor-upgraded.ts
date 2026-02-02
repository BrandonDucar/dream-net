/**
 * Test Script for Upgraded AssessorBotService
 */
import { assessorBotService } from '../packages/organs/integumentary/server/src/services/AssessorBotService.js';
import { dreamEventBus } from '../packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/index.js';

async function main() {
    console.log("🕵️ TESTING ASSESSOR BOT SWARM AUDIT...");

    const testAgentId = 'RECRUIT_X_99';
    const testScore = 92; // High tech grade

    console.log(`\n📣 Signaling Benchmark Completion for ${testAgentId}...`);

    // Simulate benchmark completion event
    dreamEventBus.publish('ToolGym.BenchmarkComplete', {
        agentId: testAgentId,
        score: testScore,
        rank: 'ELITE'
    });

    // Wait for async audit to complete
    console.log("⏳ Awaiting swarm consensus...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    const assessment = assessorBotService.getAssessment(testAgentId);

    if (assessment) {
        console.log(`\n⚖️ [Audit Result] Verdict: ${assessment.verdict}`);
        console.log(`   Final Consensus Score: ${assessment.score.toFixed(2)}`);
        console.log(`   Assessor Notes:`);
        assessment.assessorNotes.forEach(note => console.log(`     - ${note}`));

        if (assessment.verdict === 'APPROVED') {
            console.log("\n✅ [SUCCESS] Recruitment pipeline verified with Quantum & Sage integration.");
        }
    } else {
        console.error("❌ Assessment failed to generate.");
    }
}

main().catch(console.error);
