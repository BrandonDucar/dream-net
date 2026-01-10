import type { MemoryRecord, Trait } from "@dreamnet/memory-dna/types";
export interface FusionRequest {
    primaryAgentId: string;
    secondaryAgentId: string;
    fusionType: "temporary" | "permanent";
    durationSeconds?: number;
}
export interface HybridAgentModel {
    id: string;
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
export declare function fuseAgents(agentA: MemoryRecord, agentB: MemoryRecord, fusionType?: "temporary" | "permanent"): Promise<HybridAgentModel>;
