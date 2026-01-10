import type { SynapticSpike } from "./types";
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
