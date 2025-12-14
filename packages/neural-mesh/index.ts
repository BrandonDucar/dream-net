import { buildSynapses } from "./synapseBuilder";
import { meshPulse } from "./meshPulse";
import { meshMemory } from "./meshMemory";
import { latentMemoryStore } from "./latentMemory";
import type { SynapseConfig, NeuralMeshStatus } from "./types";
import type { LatentMemory, LatentMetadata } from "./latentMemory";

/**
 * Neural Mesh (N-Mesh) - Tier II Subsystem
 * Unified nervous system for DreamNet
 * Connects swarm systems, wormholes, routing, governance, and halo-loop
 */
export const NeuralMesh = {
  /**
   * Link subsystems together via synapses
   */
  link(systems: SynapseConfig): Record<string, any> {
    return buildSynapses(systems);
  },

  /**
   * Pulse an event through the mesh (convert to synaptic spike)
   */
  async pulse(event: any) {
    return meshPulse(event);
  },

  /**
   * Store a memory trace (long-term learning signal)
   */
  remember(trace: any): void {
    return meshMemory.store(trace);
  },

  /**
   * Store latent representation for agent collaboration
   */
  async storeLatent(
    agentId: string,
    latentRep: number[],
    originalThought: string,
    metadata?: LatentMetadata
  ): Promise<string> {
    return latentMemoryStore.storeLatent(agentId, latentRep, originalThought, metadata);
  },

  /**
   * Retrieve similar latent representations
   */
  async retrieveLatent(
    query: number[] | string,
    limit?: number,
    agentId?: string
  ): Promise<LatentMemory[]> {
    return latentMemoryStore.retrieveLatent(query, limit, agentId);
  },

  /**
   * Get agent's latent history
   */
  async getAgentLatentHistory(
    agentId: string,
    limit?: number
  ): Promise<LatentMemory[]> {
    return latentMemoryStore.getAgentLatentHistory(agentId, limit);
  },

  /**
   * Get status of neural mesh
   */
  status(): NeuralMeshStatus {
    const latentStatus = latentMemoryStore.status();
    return {
      synapses: buildSynapses.status(),
      memory: {
        ...meshMemory.status(),
        latentCount: latentStatus.count,
        latentAgents: Array.from(latentStatus.agents).length,
      },
    };
  },
};

export default NeuralMesh;
export { buildSynapses, meshPulse, meshMemory, latentMemoryStore };
export type { SynapseConfig, NeuralMeshStatus, SynapticSpike, MemoryTrace } from "./types";

