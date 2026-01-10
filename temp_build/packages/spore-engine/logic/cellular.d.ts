import type { MemoryRecord } from "@dreamnet/memory-dna/types";
export interface HandshakeResult {
    success: boolean;
    sharedVectorCount: number;
    viralTransmission?: boolean;
}
/**
 * NEURAL HANDSHAKE
 * Two spores exchange vector memories and state.
 * This simulates a "synapse" firing between two nodes.
 */
export declare function performNeuralHandshake(sporeA: MemoryRecord, sporeB: MemoryRecord): Promise<HandshakeResult>;
/**
 * BENEFICIAL SWARM ACTIVATION
 * Deploys a self-replicating pattern to a set of spores.
 */
export declare function releaseBeneficialSwarm(seedSporeId: string, swarmType: "security_patch" | "efficiency_boost" | "janitor_swarm"): Promise<{
    status: string;
    vector: "security_patch" | "efficiency_boost" | "janitor_swarm";
}>;
