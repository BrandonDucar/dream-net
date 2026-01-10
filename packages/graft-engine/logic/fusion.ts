import { randomUUID } from "node:crypto";
import type { MemoryRecord, Trait } from "@dreamnet/memory-dna/types";
import { vectorStore } from "@dreamnet/memory-dna/store/VectorStore";

// Type definitions for Fusion
export interface FusionRequest {
    primaryAgentId: string;
    secondaryAgentId: string;
    fusionType: "temporary" | "permanent";
    durationSeconds?: number;
}

export interface HybridAgentModel {
    id: string; // New Hybrid ID
    name: string;
    parentIds: [string, string];
    traits: Trait[];
    fusionType: "temporary" | "permanent";
    expiresAt?: string;
}

/**
 * 🧬 FUSION PROTOCOL (Liquid Intelligence)
 * Merges two agents into a single Hybrid entity.
 */
export async function fuseAgents(
    agentA: MemoryRecord,
    agentB: MemoryRecord,
    fusionType: "temporary" | "permanent" = "temporary"
): Promise<HybridAgentModel> {
    const hybridId = `hybrid-${randomUUID().slice(0, 8)}`;

    // MERGE TRAITS
    // Strategy: Take the MAX of each trait to create a "Super Agent"
    // If a trait only exists in one, keep it.
    const traitMap = new Map<string, number>();

    const allTraits = [...agentA.traits, ...agentB.traits];
    for (const t of allTraits) {
        const current = traitMap.get(t.key) || 0;
        traitMap.set(t.key, Math.max(current, t.value));
    }

    const newTraits: Trait[] = Array.from(traitMap.entries()).map(([key, value]) => ({
        key,
        value,
        lastUpdated: new Date().toISOString(),
    }));

    // Create Hybrid Model
    const hybrid: HybridAgentModel = {
        id: hybridId,
        name: `Hybrid(${agentA.entityId}+${agentB.entityId})`,
        parentIds: [agentA.entityId, agentB.entityId],
        traits: newTraits,
        fusionType,
        expiresAt: fusionType === "temporary"
            ? new Date(Date.now() + 3600 * 1000).toISOString() // Default 1 hour
            : undefined
    };

    // Log Fusion Event to Vector Memory (Holographic Shared State)
    await vectorStore.addMemory(
        `FUSION EVENT: ${agentA.entityId} fused with ${agentB.entityId} to create ${hybrid.name}`,
        { type: "agent_fusion", hybridId, parentIds: hybrid.parentIds, traits: newTraits }
    );

    return hybrid;
}
