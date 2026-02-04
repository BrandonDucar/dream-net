import { aiFoundry } from './aiFoundry';
import { bioVaultLoom } from '../../../nervous/cortex/BioVaultLoom';

async function testHybridLogic() {
    console.log("🧪 Testing Logic Hybridization...");

    const parentA: any = {
        characterProfile: { name: "Agent-Alpha", adjectives: ["bold", "fast"] },
        plugins: ["farcaster", "discord"]
    };

    const parentB: any = {
        characterProfile: { name: "Agent-Beta", adjectives: ["smart", "precise"] },
        plugins: ["telegram", "openai"]
    };

    const hybrid = await aiFoundry.forgeHybrid(parentA, parentB);

    console.log("🧬 Hybrid Name:", hybrid.name);
    console.log("🛠️ Inherited Capabilities:", hybrid.capabilities);
    console.log("📝 System Prompt:", hybrid.systemPrompt);

    const status = bioVaultLoom.getStatus();
    console.log("📦 BioVault Status:", status);

    if (hybrid.capabilities.includes("farcaster") && hybrid.capabilities.includes("telegram")) {
        console.log("✅ SUCCESS: Logic Hybridization verified.");
    } else {
        console.log("❌ FAILURE: Capabilities not inherited.");
    }
}

testHybridLogic().catch(console.error);
