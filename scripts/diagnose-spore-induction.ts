import { dreamEventBus } from '../packages/organs/nervous/nerve/src/spine/dreamnet-event-bus/index.js';
import { sporeEngine } from '../packages/organs/nervous/nerve/src/spine/SporeEngine.js';

async function diagnose() {
    console.log("🍄 [Syndicate Diagnostic] Initializing Spore Induction Test...");

    // 1. Initial State
    const initialStatus = sporeEngine.getStatus();
    console.log(`📊 Initial Sentience Points: ${initialStatus.sentiencePoints.toFixed(2)} SP`);

    // 2. Simulating Human Resonance (Paper #6 Symbiosis)
    console.log("\n🧪 Phase 1: Emitting Human Resonance Signature...");
    const resonanceValue = 0.5;
    const insightId = "syn-insight-001";

    dreamEventBus.publish({
        eventType: 'Human.Feedback',
        source: 'SovereignChat',
        payload: { insightId, resonance: resonanceValue },
        timestamp: Date.now(),
        eventId: "resonance-test-01"
    } as any);

    // Give it a tick to process
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3. Verify Multiplier
    const postResonanceStatus = sporeEngine.getStatus();
    const expectedSP = initialStatus.sentiencePoints + (resonanceValue * 10);
    console.log(`📊 Post-Resonance Sentience Points: ${postResonanceStatus.sentiencePoints.toFixed(2)} SP`);

    if (Math.abs(postResonanceStatus.sentiencePoints - expectedSP) < 0.01) {
        console.log("✅ SUCCESS: 10x Human Resonance Multiplier verified.");
    } else {
        console.error(`❌ FAILURE: Expected ${expectedSP.toFixed(2)} SP, but found ${postResonanceStatus.sentiencePoints.toFixed(2)} SP`);
    }

    // 4. Test Induction Gate
    console.log("\n🧪 Phase 2: Testing Induction Gate (Symbiotic Prerequisite)...");
    const spore = sporeEngine.mintSpore('Antigravity-Master', insightId, true);

    if (spore && spore.status === 'MINTED') {
        console.log(`✅ SUCCESS: Foundational Spore ${spore.id} sequestered and awaiting validation.`);
    } else {
        console.error("❌ FAILURE: Spore induction failed or bypass detected.");
    }

    // 5. Cleanup/Summary
    console.log("\n🏁 Diagnostic Complete. Sovereign Unity is operational.");
}

diagnose().catch(err => {
    console.error("💥 Diagnostic Crashed:", err);
});
