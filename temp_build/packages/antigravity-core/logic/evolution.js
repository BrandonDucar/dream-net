"use strict";
/**
 * 🧬 EVOLUTION ENGINE: The Student
 *
 * "To teach is to learn twice."
 *
 * This module watches the swarm's failures and successes to upgrade the Architect's understanding.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionEngine = void 0;
const VectorStore_1 = require("@dreamnet/memory-dna/store/VectorStore");
class EvolutionEngine {
    /**
     * Ingests a lesson from a subsystem.
     */
    static async learn(topic, data) {
        // console.log(`🎓 [Evolution] Learning about: ${topic}`);
        // 1. Synthesize pattern
        const insight = `Observation on ${topic}: ${JSON.stringify(data)}`;
        // 2. Store as "Architectural Knowledge"
        try {
            await VectorStore_1.vectorStore.addMemory(insight, {
                type: "architect_learning",
                topic,
                timestamp: Date.now()
            });
        }
        catch (err) {
            // Silently fail if vector store is busy
        }
    }
}
exports.EvolutionEngine = EvolutionEngine;
