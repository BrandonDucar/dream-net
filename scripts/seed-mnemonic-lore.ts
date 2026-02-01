import { memoryDNA } from "C:/Users/brand/OneDrive/Documents/GitHub/dream-net/packages/server/src/core/MemoryDNA.ts";

async function seed() {
    console.log("🧠 [Mnemosyne] Seeding first Mnemonic Lore into MemoryDNA...");

    const lore = {
        task: "SITREP: Perovskite Singularity Research",
        context: {
            subject: "Perovskite Solar Cells & AI Agents",
            timeframe: "2024-2025",
            milestones: [
                "Efficiency Record: 34.6%",
                "Solution: Agentic Atomic Simulations for stability"
            ]
        },
        tools: ["WebSearch", "DialecticEngine", "ScholarAgent"],
        outcome: {
            article: "THE PEROVSKITE SINGULARITY",
            status: "SYNTHESIZED"
        },
        agentId: "The Scholar (Thread C)"
    };

    const id = await memoryDNA.recordSuccess(lore);
    console.log(`✅ [Mnemosyne] Lore indexed with ID: ${id}`);
}

seed().catch(console.error);
