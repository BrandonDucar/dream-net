import dotenv from 'dotenv';
import path from 'path';
import { PulseHeart } from '../spine/PulseHeart.js';
import { SynapticBridge } from '../spine/SynapticBridge.js';
import { OrcaStore } from '../../../orca-pack-core/store/orcaStore.js';

// Load environment variables from root
dotenv.config({ path: '.env' });

async function verifySwarm() {
    console.log("🐝 Verifying Swarm Intelligence Connection...");

    // 1. Manually Inject a "Ready to Post" Plan into the Orca Brain
    // This bypasses the random idea generation so we can test the PIPE specifically.
    const now = Date.now();
    const testId = `test-signal-${now}`;

    console.log("🧠 Injecting Neural Thought into Orca Store...");
    OrcaStore.upsertPlan({
        id: testId,
        ideaId: 'manual-override',
        channel: 'discord', // Explicitly target Discord
        status: 'scheduled',
        scheduledAt: now, // Due now
        postedAt: undefined,
        renderedTitle: 'Swarm Verification Signal',
        renderedBody: 'This is a test signal from the Orca Hive Mind via the Synaptic Bridge. 🐋',
        renderedMeta: {},
        createdAt: now,
        updatedAt: now
    });

    // 2. Ignite the Heart (System Pulse)
    console.log("❤️ Igniting PulseHeart...");
    const heart = new PulseHeart(5); // 5 min interval doesn't matter for manual beat

    // We need to access the private 'beat' method or trigger the cycle manually via public means.
    // PulseHeart.start() runs a beat immediately.

    console.log("⏳ Warming up Neural Pathways (Login)...");
    await new Promise(r => setTimeout(r, 5000));

    heart.start();

    // 3. Wait for transmission
    console.log("⏳ Waiting for Synaptic Bridge transmission...");
    await new Promise(r => setTimeout(r, 5000));

    // 4. Check if Plan status changed to 'posted'
    const plan = OrcaStore.listPlans().find(p => p.id === testId);
    if (plan?.status === 'posted') {
        console.log("✅ SUCCESS: Orca Plan marked as POSTED.");
        console.log("   (Check your Discord Channel to see the message!)");
    } else {
        console.error("❌ FAILURE: Orca Plan is still in state:", plan?.status);
    }

    // Stop heart and exit
    heart.stop();
    process.exit(0);
}

verifySwarm().catch(e => {
    console.error(e);
    process.exit(1);
});
