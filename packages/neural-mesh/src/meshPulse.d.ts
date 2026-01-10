import type { SynapticSpike } from './meshTypes.js';
/**
 * Convert events into "synaptic spikes"
 * Normalize events into a shared schema
 * Emit pulses to the mesh
 */
export declare function meshPulse(event: any): Promise<SynapticSpike>;
/**
 * Batch pulse multiple events
 */
export declare function meshPulseBatch(events: any[]): Promise<SynapticSpike[]>;
//# sourceMappingURL=meshPulse.d.ts.map