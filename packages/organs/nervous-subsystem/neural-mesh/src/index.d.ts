import { buildSynapses } from './synapseBuilder.js';
import { meshPulse } from './meshPulse.js';
import { meshMemory } from './meshMemory.js';
import type { SynapseConfig, NeuralMeshStatus } from './meshTypes.js';
/**
 * Neural Mesh (N-Mesh) - Tier II Subsystem
 * Unified nervous system for DreamNet
 * Connects swarm systems, wormholes, routing, governance, and halo-loop
 */
export declare const NeuralMesh: {
    /**
     * Link subsystems together via synapses
     */
    link(systems: SynapseConfig): Record<string, any>;
    /**
     * Pulse an event through the mesh (convert to synaptic spike)
     */
    pulse(event: any): Promise<import("./meshTypes.js").SynapticSpike>;
    /**
     * Store a memory trace (long-term learning signal)
     */
    remember(trace: any): void;
    /**
     * Get status of neural mesh
     */
    status(): NeuralMeshStatus;
};
export default NeuralMesh;
export { buildSynapses, meshPulse, meshMemory };
export * from './meshTypes.js';
//# sourceMappingURL=index.d.ts.map