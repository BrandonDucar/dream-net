"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meshMemory = exports.meshPulse = exports.buildSynapses = exports.NeuralMesh = void 0;
const synapseBuilder_1 = require("./synapseBuilder");
Object.defineProperty(exports, "buildSynapses", { enumerable: true, get: function () { return synapseBuilder_1.buildSynapses; } });
const meshPulse_1 = require("./meshPulse");
Object.defineProperty(exports, "meshPulse", { enumerable: true, get: function () { return meshPulse_1.meshPulse; } });
const meshMemory_1 = require("./meshMemory");
Object.defineProperty(exports, "meshMemory", { enumerable: true, get: function () { return meshMemory_1.meshMemory; } });
/**
 * Neural Mesh (N-Mesh) - Tier II Subsystem
 * Unified nervous system for DreamNet
 * Connects swarm systems, wormholes, routing, governance, and halo-loop
 */
exports.NeuralMesh = {
    /**
     * Link subsystems together via synapses
     */
    link(systems) {
        return (0, synapseBuilder_1.buildSynapses)(systems);
    },
    /**
     * Pulse an event through the mesh (convert to synaptic spike)
     */
    async pulse(event) {
        return (0, meshPulse_1.meshPulse)(event);
    },
    /**
     * Store a memory trace (long-term learning signal)
     */
    remember(trace) {
        return meshMemory_1.meshMemory.store(trace);
    },
    /**
     * Get status of neural mesh
     */
    status() {
        return {
            synapses: synapseBuilder_1.buildSynapses.status(),
            memory: meshMemory_1.meshMemory.status(),
        };
    },
};
exports.default = exports.NeuralMesh;
