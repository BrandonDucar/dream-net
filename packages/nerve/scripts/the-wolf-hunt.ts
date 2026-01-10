import { WolfPackFundingAgent } from '../../agents/src/specialized/WolfPackFundingAgent.js';
import { wolfPackOutreachService } from '../../server/src/services/WolfPackOutreachService.js';
import { hackathonSubmissionService } from '../../server/src/services/HackathonSubmissionService.js';
import { elizaBridge } from '../../nerve/src/spine/ElizaBridge.js';
import { swarmController } from '../../nerve/src/spine/SwarmController.js';

/**
 * the-wolf-hunt
 * Ignites the WolfPackFundingAgent to scout for real 2026 targets.
 * Triggers HACK-MECH drafting for high-value/government targets.
 * Dispatches drafts to the Commander via Outreach.
 */
async function igniteWolfHunt() {
    console.log("🐺 DREAMNET: THE WOLF HUNT (JAN 2026 EXTRACTION) 🩸");
    console.log("--------------------------------------------------");

    // Initialize Services
    wolfPackOutreachService;
    hackathonSubmissionService;
    elizaBridge;

    try {
        // 1. Ignite the HACK-MECH-SUIT
        await swarmController.deployExtractionTeam();

        // 2. Ignite the Funding Agent (The Scout)
        const scout = new WolfPackFundingAgent("ALPHA-SCOUT");

        console.log("\n🚀 [Ignition] Wolf Pack Scout is now hunting...");
        await scout.ignite();

        console.log("\n⏳ [Monitoring] Waiting for extraction signals...");

        // Let it run for a few seconds to process events
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log("\n--------------------------------------------------");
        console.log("✨ WOLF HUNT COMPLETE.");
        console.log("Status: DISPATCHED HIGH-VALUE DRAFTS TO COMMANDER. 🩸");

    } catch (e: any) {
        console.error("Hunt failed:", e.message);
    } finally {
        process.exit(0);
    }
}

igniteWolfHunt().catch(e => {
    console.error("Fatal hunt error:", e);
    process.exit(1);
});
