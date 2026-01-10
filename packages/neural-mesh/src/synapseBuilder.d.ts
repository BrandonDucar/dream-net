import type { SynapseConfig, SynapseConnection } from './meshTypes.js';
/**
 * Build synapses connecting swarm systems, wormholes, routing, governance, and halo-loop
 * Creates internal "synapses" linking their event buses together
 */
export declare function buildSynapses(systems: SynapseConfig): Record<string, any>;
export declare namespace buildSynapses {
    var status: () => {
        connections: SynapseConnection[];
        count: number;
    };
    var pulse: (from: string, to: string, event: any) => Promise<void>;
}
//# sourceMappingURL=synapseBuilder.d.ts.map