import { buildSynapses } from './synapseBuilder.js';
import { meshPulse } from './meshPulse.js';
import { meshMemory } from './meshMemory.js';
import type { SynapseConfig, NeuralMeshStatus } from './meshTypes.js';

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
   * Get status of neural mesh
   */
  status(): NeuralMeshStatus {
    return {
      synapses: buildSynapses.status(),
      memory: meshMemory.status(),
    };
  },
};

export default NeuralMesh;
export { buildSynapses, meshPulse, meshMemory };
export * from './meshTypes.js';
