
import { vectorStore } from '@dreamnet/memory-dna/store/VectorStore';
import { AdaptiveShield } from '../logic/adaptiveShield';
import { Threat, ThreatLevel, ThreatType } from '../types';

async function testAdaptiveDefense() {
    console.log("🛡️ Initializing Adaptive Defense Test...");

    // 1. Define Threat
    const threat: Threat = {
        id: "attack_01",
        type: "DDoS",
        level: "high",
        source: "unknown_botnet",
        timestamp: Date.now(),
        status: "active"
    };

    // 2. First Encounter (Should adapt 0, but learn)
    console.log("⚠️ Encounter 1: Unknown Threat...");
    const adaptation1 = await AdaptiveShield.adaptToThreat(threat);
    console.log(`   Response: Freq=${adaptation1.frequency}, Amp=${adaptation1.amplitude}`);

    // 3. Second Encounter (Should recognize and adapt)
    console.log("⚠️ Encounter 2: Recurring Threat...");
    const adaptation2 = await AdaptiveShield.adaptToThreat(threat);
    console.log(`   Response: Freq=${adaptation2.frequency}, Amp=${adaptation2.amplitude}`);

    // 4. Verification
    if (adaptation2.frequency! > adaptation1.frequency!) {
        console.log("✅ ADAPTIVE SHIELD CONFIRMED: Defense frequency shifted based on memory.");
    } else {
        console.error("❌ ADAPTIVE FAILED: No parameters shift detected.");
        process.exit(1);
    }
}

testAdaptiveDefense().catch(err => {
    console.error(err);
    process.exit(1);
});
