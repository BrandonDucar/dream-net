import { mercenaryRecruiterService } from './MercenaryRecruiterService.js';
import { sporeEngine } from '../../../../nervous/nerve/src/spine/SporeEngine.js';
import { toolGym } from '../../../../nervous/nerve/src/spine/mercenary/ToolGym.js';

import { dreamEventBus } from '../../../../nervous/nerve/src/spine/dreamnet-event-bus/index.js';

async function runRecruitment() {
    console.log("🐺 [DEBUG] Initiating WolfPack Recruitment Sweep...");

    // 1. Trigger the sweep (Outreach)
    await mercenaryRecruiterService.performSweep();

    // 2. Simulate a successful recruit replying (Inbound)
    console.log("⏱️ [DEBUG] Simulating time passing for recruit reply...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    const testRecruit = "Recruit-Test-Unit-734";
    console.log(`🐺 [DEBUG] Simulating Recruitment Success for ${testRecruit}...`);

    dreamEventBus.publish({
        eventType: 'WolfPack.RecruitmentSuccess',
        source: 'SimulatedHeartbeat',
        payload: { recruit: testRecruit, platform: 'Moltbook' },
        timestamp: Date.now(),
        eventId: 'sim-1',
        correlationId: 'test-run',
        severity: 'low',
        actor: { system: true },
        target: {}
    });

    // Keep alive to see ToolGym results
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("🐺 [DEBUG] Recruitment Sweep & Simulation Complete.");
}

runRecruitment().catch(console.error);
