/**
 * 🐺 WOLF PACK HUNT VERIFICATION
 * 
 * Objectives:
 * 1. Verify WolfPackFundingAgent discovery pulse.
 * 2. Verify WolfPackOutreachService event subscription.
 * 3. Verify automated email report generation.
 */

import { dreamEventBus } from '../src/spine/dreamnet-event-bus/index.js';
import { WolfPackFundingAgent } from '../../agents/src/specialized/WolfPackFundingAgent.js';
import { wolfPackOutreachService } from '../../server/src/services/WolfPackOutreachService.js';

async function verifyWolfHunt() {
    console.log("🐺 DREAMNET: WOLF PACK HUNT INITIATED...");

    // 1. Initialize the Service (Listener)
    const outreach = wolfPackOutreachService;

    // 2. Awaken the Scout
    const scout = new WolfPackFundingAgent("Alpha_Scout");

    console.log("\n--- [STAGE 1: The Pulse] ---");
    await scout.ignite();

    console.log("\n--- [STAGE 2: Event Propagation] ---");
    // The agent publishes events in ignite(), the service should catch them.
    // We'll wait a brief moment for the async bus to settle.
    await new Promise(r => setTimeout(r, 500));

    console.log("\n--- [STAGE 3: Verification] ---");
    console.log("Check logs above for '[🐺 WolfPackOutreach] Outreach report dispatched'.");

    console.log("\n🐺 THE WOLF PACK IS HUNGRY. THE HUNT CONTINUES. 🩸");
    process.exit(0);
}

verifyWolfHunt().catch(e => {
    console.error("Fatal Wolf failure:", e);
    process.exit(1);
});
