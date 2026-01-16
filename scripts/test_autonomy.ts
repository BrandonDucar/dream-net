
import { dreamEventBus } from '../packages/nerve/src/spine/dreamnet-event-bus/index.js';
import '../packages/server/src/services/HackathonSubmissionService.js'; // Boot the engine
import '../packages/server/src/services/WolfPackOutreachService.js'; // Boot the outreach

async function main() {
    console.log("🐺 TESTING WOLF PACK AUTONOMY CIRCUIT...");

    // Simulate a Hunter finding a target with an email
    const dummyIntel = {
        action: 'draft_proposal',
        target: 'TEST_TARGET_AUTONOMY_GIGA_CORP',
        data: {
            reward: '$500,000',
            focus: 'We need AI agents. Contact us at recruitment@gigacorp.com for details.'
        }
    };

    console.log(`[TEST] Injection Action: ${JSON.stringify(dummyIntel)}`);

    dreamEventBus.publish({
        type: 'WolfPack.ActionRequested',
        payload: dummyIntel,
        source: 'TEST_SCRIPT'
    });

    // Keep alive to see logs
    await new Promise(r => setTimeout(r, 5000));
}

main().catch(console.error);
