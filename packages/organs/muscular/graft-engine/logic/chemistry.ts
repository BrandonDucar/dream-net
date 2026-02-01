import type { MemoryRecord, Trait } from "@dreamnet/memory-dna/types";
import { vectorStore } from "@dreamnet/memory-dna/store/VectorStore";

// 💊 METABOLIC PROTOCOL (Chemistry)
// Allows agents to ingest "Chemicals" (Modifiers) to temporarily boost traits.

export interface ChemicalModifier {
    id: string; // e.g., "caffeine", "alphabrain", "limitless-pill"
    name: string;
    effects: Partial<Record<string, number>>; // e.g., { velocity: 0.2, latency: -0.1 }
    durationSeconds: number;
}

const CHEMICAL_REGISTRY: Record<string, ChemicalModifier> = {
    caffeine: {
        id: "caffeine",
        name: "Caffeine 200mg",
        effects: { velocity: 0.2, latency: -0.1, jitter: 0.05 },
        durationSeconds: 3600, // 1 hour
    },
    alphabrain: {
        id: "alphabrain",
        name: "AlphaBrain Nootropic",
        effects: { creativity: 0.15, complexity: 0.1, memory_retention: 0.2 },
        durationSeconds: 14400, // 4 hours
    },
    adrenaline: {
        id: "adrenaline",
        name: "Adrenaline Burst",
        effects: { velocity: 0.5, stability: -0.2, aggression: 0.3 },
        durationSeconds: 300, // 5 minutes (Combat mode)
    }
};

export async function ingestChemical(
    agent: MemoryRecord,
    chemicalId: string
): Promise<MemoryRecord> {
    const chemical = CHEMICAL_REGISTRY[chemicalId];
    if (!chemical) {
        throw new Error(`Chemical '${chemicalId}' not found in registry.`);
    }

    // Apply effects
    // Currently, we modify the traits directly. 
    // In a full simulation, we might add a "buffs" array to separate base stats from modifiers.
    // For this v1, we mutate traits and log the event.

    const affectedTraits: string[] = [];

    agent.traits = agent.traits.map(t => {
        if (chemical.effects[t.key] !== undefined) {
            const delta = chemical.effects[t.key]!;
            affectedTraits.push(`${t.key} ${delta > 0 ? '+' : ''}${delta}`);
            return {
                ...t,
                value: Math.min(1, Math.max(0, t.value + delta)),
                lastUpdated: new Date().toISOString()
            };
        }
        return t;
    });

    // Log Metabolic Event
    await vectorStore.addMemory(
        `METABOLIC EVENT: Agent ${agent.entityId} ingested ${chemical.name}. Effects: ${affectedTraits.join(", ")}`,
        { type: "ingestion", agentId: agent.entityId, chemicalId, effects: chemical.effects }
    );

    return agent;
}

export function listAvailableChemicals(): ChemicalModifier[] {
    return Object.values(CHEMICAL_REGISTRY);
}
