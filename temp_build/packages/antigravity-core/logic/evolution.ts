
/**
 * 🧬 EVOLUTION ENGINE: The Student
 * 
 * "To teach is to learn twice."
 * 
 * This module watches the swarm's failures and successes to upgrade the Architect's understanding.
 */

import { vectorStore } from "@dreamnet/memory-dna/store/VectorStore";

export class EvolutionEngine {

    /**
     * Ingests a lesson from a subsystem.
     */
    static async learn(topic: string, data: any) {
        // console.log(`🎓 [Evolution] Learning about: ${topic}`);

        // 1. Synthesize pattern
        const insight = `Observation on ${topic}: ${JSON.stringify(data)}`;

        // 2. Store as "Architectural Knowledge"
        try {
            await vectorStore.addMemory(insight, {
                type: "architect_learning",
                topic,
                timestamp: Date.now()
            });
        } catch (err) {
            // Silently fail if vector store is busy
        }
    }
}
