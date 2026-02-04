
import { aiFoundry } from '../packages/organs/reproductive/dreamnet-factory/src/aiFoundry.js';
import { aiFactory } from '../packages/organs/reproductive/dreamnet-factory/src/aiFactory.js';

async function testFoundry() {
    console.log("🛠️ [Test] Starting Agent Foundry Test...");

    // 1. Forge two parent mech suits
    const parentA = await aiFoundry.forgeMechSuit("Kitsune-Core", "Cunning Logistical Infiltration", "LIGHT");
    const parentB = await aiFoundry.forgeMechSuit("Kraken-Reach", "Multi-Vector Sensory Scouting", "LIGHT");

    console.log("🧪 [Test] Parents Forged:", parentA.name, parentB.name);

    // 2. Incubate a Hybrid
    const hybridBlueprint = await aiFoundry.forgeHybrid(parentA, parentB);
    console.log("🧬 [Test] Hybrid Blueprint Created:", hybridBlueprint.name);
    console.log("🧬 [Test] Hybrid Lineage:", JSON.stringify(hybridBlueprint.lineage));
    console.log("📜 [Test] Hybrid System Prompt:", hybridBlueprint.systemPrompt);

    // 3. Run Production for the Hybrid
    console.log("🏭 [Test] Running Production for Hybrid...");
    const success = await aiFactory.runProduction(hybridBlueprint);

    if (success) {
        console.log("✅ [Test] Hybrid Agent Produced successfully.");
    } else {
        console.error("❌ [Test] Hybrid Production FAILED.");
    }
}

testFoundry().catch(console.error);
