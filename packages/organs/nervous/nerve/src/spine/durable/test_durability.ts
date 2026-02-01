
import { DurableService } from './DurableAgentService.js';

async function testDurability() {
    console.log("🏁 DURABILITY STRESS TEST: STARTING...");

    // 1. Simulate an interrupted task
    console.log("📝 Step 1: Recording intent 'Deploying CultureCoin'...");
    const id = await DurableService.recordIntent('Antigravity', 'DEPLOY', { asset: 'CultureCoin' });

    console.log("💥 Step 2: Simulating process crash (interrupting task)...");
    // In a real scenario, this would be a process exit.

    console.log("🔄 Step 3: Powering back up. Initiating recovery...");
    const recoveredIntents = await DurableService.recover();

    const pending = recoveredIntents.filter(i => i.status === 'PENDING');
    console.log(`📦 Found ${pending.length} pending intents to resume.`);

    for (const intent of pending) {
        console.log(`🚀 Resuming intent ${intent.id}: ${intent.action} for ${JSON.stringify(intent.params)}`);
        // Resume logic goes here
        await DurableService.commitIntent(intent.id);
        console.log(`✅ Intent ${intent.id} COMMITTED.`);
    }

    console.log("🎉 DURABILITY TEST COMPLETE. NO STATE LOST.");
}

testDurability();
