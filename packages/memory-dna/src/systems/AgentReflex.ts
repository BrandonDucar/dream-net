import { randomUUID } from "node:crypto";
import { memorySystem } from "./TriuneMemory.js";
import { epigenetics } from "./EpigeneticMemory.js";

export interface CognitiveTrace {
    id: string;
    type: 'BUILD' | 'TRADE' | 'TEST' | 'THOUGHT';
    action: string;
    outcome: 'SUCCESS' | 'FAILURE' | 'PENDING';
    error?: string;
    reflection: string;
    tags: string[];
    timestamp: string;
}

class AgentReflexSystem {
    /**
     * Log a new memory trace
     */
    public async inscribe(trace: Omit<CognitiveTrace, 'id' | 'timestamp'>) {
        const fullTrace: CognitiveTrace = {
            id: randomUUID(),
            timestamp: new Date().toISOString(),
            ...trace
        };

        // 1. Store in Mammal Layer (Associative)
        await memorySystem.mammal.store(`TRACE_${fullTrace.id}`, fullTrace);

        // 2. If it's a failure, mark it in Epigenetic Memory (Lizard)
        if (fullTrace.outcome === 'FAILURE') {
            epigenetics.logTrauma(fullTrace.action);
        } else if (fullTrace.outcome === 'SUCCESS') {
            epigenetics.logSuccess(fullTrace.action);
        }

        console.log(`[🧠 Reflex] Trace Inscribed: ${fullTrace.type} - ${fullTrace.outcome}`);
        return fullTrace.id;
    }

    /**
     * Search for past lessons based on keywords
     */
    public async flashback(keyword: string): Promise<CognitiveTrace[]> {
        console.log(`[🧠 Reflex] FLASHBACK: Searching for "${keyword}"...`);
        const results = await memorySystem.mammal.searchByTag(keyword);
        return results as CognitiveTrace[];
    }

    /**
     * Get the state of my recent actions
     */
    public async getRecentReflections(count: number = 3): Promise<string> {
        const recent = await memorySystem.mammal.getRecent(count);
        return recent.map(t => `[${t.type}] ${t.action}: ${t.reflection}`).join('\n');
    }
}

export const agentReflex = new AgentReflexSystem();
