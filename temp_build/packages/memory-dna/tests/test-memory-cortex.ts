
import { vectorStore } from '../store/VectorStore';

// Verification Script for Biomechanical Brain (LanceDB)
async function testCortex() {
    console.log("🧠 initializing Cortex...");

    // 1. Inject Memory
    await vectorStore.addMemory("The Wolf moves at night.", { type: "observation", agent: "WolfPack" });
    await vectorStore.addMemory("The Sentinel watches the wall.", { type: "observation", agent: "Sentinel" });
    await vectorStore.addMemory("Betting odds for the finals are 3:1.", { type: "financial", agent: "DreamBet" });

    // 2. Query Memory
    console.log("🔍 Querying Cortex for 'Wolf'...");
    const results = await vectorStore.query("Wolf", 2);

    console.log("📊 Results:", JSON.stringify(results, null, 2));

    if (results.length > 0 && results[0].text.includes("Wolf")) {
        console.log("✅ CORTEX VERIFIED: Memory writing and retrieval successful.");
    } else {
        console.error("❌ CORTEX FAILED: Could not retrieve memory.");
        process.exit(1);
    }
}

testCortex().catch(console.error);
