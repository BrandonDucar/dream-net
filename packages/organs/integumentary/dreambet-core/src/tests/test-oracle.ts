
import { vectorStore } from '@dreamnet/memory-dna/store/VectorStore';
import { OracleEngine } from '../logic/oracle.js';

async function testOracle() {
    console.log("🔮 Initializing Oracle Test...");

    // 1. Plant Memories (History)
    console.log("🌱 Planting historical memories...");
    await vectorStore.addMemory("Lakers won against Celtics in 2023 finals by 10 points.", { type: "sports_history" });
    await vectorStore.addMemory("Lakers lineup is currently very strong.", { type: "team_analysis" });

    // 2. Ask Oracle
    console.log("❓ Asking Oracle for prediction...");
    const prediction = await OracleEngine.predict({
        gameType: "Basketball",
        participants: ["Lakers", "Celtics"]
    });

    // 3. Verify
    console.log("📊 Prediction Result:", JSON.stringify(prediction, null, 2));

    if (prediction.outcome === "Lakers" && prediction.confidence > 0.5) {
        console.log("✅ ORACLE VERIFIED: Correctly predicted outcome based on planted memories.");
    } else {
        console.error("❌ ORACLE FAILED: Prediction logic flaw.");
        process.exit(1);
    }
}

testOracle().catch(err => {
    console.error(err);
    process.exit(1);
});
