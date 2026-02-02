import { mercenaryRecruiterService } from '../../../integumentary/server/src/services/MercenaryRecruiterService.js';
import { toolGym } from '../src/spine/mercenary/ToolGym.js';
import { masteryTracker } from '../src/spine/MasteryTracker.js';

async function main() {
    console.log("🐺 INITIALIZING MERCENARY BOUNTY VERIFICATION...");

    const agentId = 'Scythe_1';

    // 1. Benchmarking (ToolGym)
    console.log(`\n🏋️ Benchmarking Agent ${agentId} at the ToolGym...`);
    await toolGym.enrollRecruit(agentId, 'STANDARD');

    const mastery = masteryTracker.getMastery(agentId, 'Mercenary Optimization');
    console.log(`Level: ${mastery?.level}, EXP: ${mastery?.experience}`);

    // 2. Post Bounty
    console.log(`\n📜 Posting new bounty...`);
    mercenaryRecruiterService.postBounty({
        id: 'BOUNTY-001',
        description: 'Verify Optio Node Synchronization',
        reward: 50, // 50 OPT
        difficulty: 'SOLDIER'
    });

    // 3. Claim Bounty
    console.log(`\n🤝 Agent ${agentId} claiming bounty...`);
    await mercenaryRecruiterService.claimBounty(agentId, 'BOUNTY-001');

    // 4. Complete Bounty (Verified by Optio PoI)
    console.log(`\n✅ Completing bounty (Optio PoI + 1.5% Fee Calculation)...`);
    await mercenaryRecruiterService.completeBounty('BOUNTY-001');

    console.log("\n🏁 VERIFICATION SUCCESSFUL.");
}

main().catch(console.error);
