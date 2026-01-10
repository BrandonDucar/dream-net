
/**
 * 💤 REM SLEEP (Rapid Eye Movement)
 * 
 * "The Brain Consolidates Wisdom"
 * A scheduler that runs during low-activity periods to summarize 
 * ephemeral memories into persistent "Wisdom" vectors.
 */

import { vectorStore } from '../store/VectorStore';

export class RemSleep {

    /**
     * Triggers a sleep cycle to consolidate memories.
     */
    static async dream() {
        console.log("💤 [REM] Entering dream state...");

        // 1. Fetch recent raw memories (short-term buffer)
        // In a real system, we'd filter by 'unprocessed'. 
        // Here we just grab the last 10 for simulation.
        const recentMemories = await vectorStore.query("recent activity", 10);

        if (recentMemories.length === 0) {
            console.log("💤 [REM] No new memories to process. Waking up.");
            return;
        }

        // 2. Synthesize Wisdom (Simple Simulation)
        // We look for repeated patterns.
        const patterns: Record<string, number> = {};
        recentMemories.forEach(m => {
            const words = m.text.split(' ');
            words.forEach((w: string) => {
                if (w.length > 4) patterns[w] = (patterns[w] || 0) + 1;
            });
        });

        // 3. Store "Wisdom" (High-level concepts)
        const topConcepts = Object.entries(patterns)
            .filter(([_, count]) => count > 1)
            .map(([word]) => word)
            .join(', ');

        if (topConcepts) {
            console.log(`🧠 [REM] Wisdom Synthesized: Concepts [${topConcepts}] are recurring.`);
            await vectorStore.addMemory(`Wisdom: Frequent concepts include ${topConcepts}`, {
                type: 'consolidated_wisdom',
                source: 'rem_cycle',
                timestamp: Date.now()
            });
        }

        console.log("🌅 [REM] Sleep cycle complete. Waking up refreshing.");
    }
}
