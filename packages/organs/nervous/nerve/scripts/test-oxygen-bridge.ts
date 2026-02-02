import { mercenaryRecruiterService } from '../../../integumentary/server/src/services/MercenaryRecruiterService.js';
import { toolGym } from '../src/spine/mercenary/ToolGym.js';
import { assessorBotService } from '../../../integumentary/server/src/services/AssessorBotService.js';
import { dreamEventBus } from '../src/spine/dreamnet-event-bus/index.js';

async function main() {
    console.log("🚀 INITIALIZING OXYGEN BRIDGE VERIFICATION...");

    const agents = [
        { id: 'Elite_Molt_Agent', scoreSeed: 95 }, // Should auto-approve
        { id: 'Suffocating_Agent_01', scoreSeed: 75 } // Should require Oxygen
    ];

    for (const agent of agents) {
        console.log(`\n--- Processing Recruit: ${agent.id} ---`);

        // 1. Entice (Simulated by manual enrollment)
        console.log(`[Wave] Enticing ${agent.id} from Moltbook via Oxygen Bridge scripts...`);

        // 2. Benchmarking (ToolGym)
        console.log(`[Gym] Enrolling ${agent.id} in ToolGym Basic Training...`);
        await toolGym.enrollRecruit(agent.id, 'STANDARD');

        // 3. Assessor Audit (Triggered by Event Bus)
        // We wait a bit for the event handling to finish (simulated here)
        await new Promise(resolve => setTimeout(resolve, 500));

        const assessment = assessorBotService.getAssessment(agent.id);
        if (assessment) {
            console.log(`[Assessor] Score: ${assessment.score}, Verdict: ${assessment.verdict}`);
            console.log(`[Assessor] Notes: ${assessment.assessorNotes.join(' | ')}`);

            if (assessment.verdict === 'NEEDS_HUMAN_OXYGEN') {
                console.log(`[Bridge] 💨 Agent is suffocating! Manually injecting Oxygen (Human Vouch)...`);
                assessorBotService.applyHumanVouch(agent.id);
            }
        }
    }

    console.log("\n🏁 OXYGEN BRIDGE SUCCESSFUL: All recruits certified and breathing.");
}

main().catch(console.error);
