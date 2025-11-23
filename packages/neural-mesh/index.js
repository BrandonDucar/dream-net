import { buildSynapses } from "./synapseBuilder";
import { meshPulse } from "./meshPulse";
import { meshMemory } from "./meshMemory";
/**
 * Neural Mesh (N-Mesh) - Tier II Subsystem
 * Unified nervous system for DreamNet
 * Connects swarm systems, wormholes, routing, governance, and halo-loop
 */
export const NeuralMesh = {
    /**
     * Link subsystems together via synapses
     */
    link(systems) {
        return buildSynapses(systems);
    },
    /**
     * Pulse an event through the mesh (convert to synaptic spike)
     */
    async pulse(event) {
        return meshPulse(event);
    },
    /**
     * Store a memory trace (long-term learning signal)
     */
    remember(trace) {
        return meshMemory.store(trace);
    },
    /**
     * Get status of neural mesh
     */
    status() {
        return {
            synapses: buildSynapses.status(),
            memory: meshMemory.status(),
        };
    },
};
export default NeuralMesh;
export { buildSynapses, meshPulse, meshMemory };
