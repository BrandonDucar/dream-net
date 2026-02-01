import { talentProtocolService } from '../src/services/TalentProtocolService.js';
import { pathToFileURL } from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testTalentExtraction() {
    console.log("🧬 DREAMNET: TALENT REWARD EXTRACTION VERIFICATION 🩸");
    console.log("--------------------------------------------------");

    // Use absolute path for robustness on Windows with tsx
    const busPath = path.resolve(process.cwd(), 'packages/nerve/src/spine/dreamnet-event-bus/index.js');
    const busUrl = pathToFileURL(busPath).href;
    console.log(`[🧬 Talent] Importing event bus from: ${busUrl}`);

    const { dreamEventBus } = await import(busUrl);

    // Listen for the treasury signal
    dreamEventBus.subscribe('Treasury.ExecutionRequested', (envelope: any) => {
        console.log("\n✅ TREASURY SIGNAL CAPTURED:");
        console.log(JSON.stringify(envelope.payload, null, 2));
    });

    const profile = talentProtocolService.getProfile();
    console.log(`\nAddress: ${profile.address}`);
    console.log(`Builder Score: ${profile.builderScore}`);
    console.log(`Level: ${profile.level}`);
    console.log(`Pending Rewards: ${profile.pendingRewardsETH} ETH`);

    console.log("\nTriggering automated reward capture...");
    const result = await talentProtocolService.claimRewards();

    if (result.success) {
        console.log(`\n🎉 EXTRACTION SUCCESSFUL: ${result.amount} ETH captured.`);
    } else {
        console.error("\n❌ EXTRACTION FAILED:", result.message);
    }

    await new Promise(r => setTimeout(r, 1000));
    console.log("\nVerification complete. 🩸");
    process.exit(0);
}

testTalentExtraction().catch(e => {
    console.error("Fatal verification error:", e);
    console.error(e.stack);
    process.exit(1);
});
