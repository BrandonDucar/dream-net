import { randomUUID } from "node:crypto";
import { vectorStore } from "@dreamnet/memory-dna/store/VectorStore";
/**
 * 🧬 FUSION PROTOCOL (Liquid Intelligence)
 * Merges two agents into a single Hybrid entity.
 */
export async function fuseAgents(agentA, agentB, fusionType = "temporary") {
    const hybridId = `hybrid-${randomUUID().slice(0, 8)}`;
    // MERGE TRAITS
    // Strategy: Take the MAX of each trait to create a "Super Agent"
    // If a trait only exists in one, keep it.
    const traitMap = new Map();
    const allTraits = [...agentA.traits, ...agentB.traits];
    for (const t of allTraits) {
        const current = traitMap.get(t.key) || 0;
        traitMap.set(t.key, Math.max(current, t.value));
    }
    const newTraits = Array.from(traitMap.entries()).map(([key, value]) => ({
        key,
        value,
        lastUpdated: new Date().toISOString(),
    }));
    // Create Hybrid Model
    const hybrid = {
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
    await vectorStore.addMemory(`FUSION EVENT: ${agentA.entityId} fused with ${agentB.entityId} to create ${hybrid.name}`, { type: "agent_fusion", hybridId, parentIds: hybrid.parentIds, traits: newTraits });
    return hybrid;
}
//# sourceMappingURL=fusion.js.map