/**
 * Capabilities Map - Types for capabilities mapping in OS linker
 * 
 * Maps capabilities to processes and providers
 */

/**
 * Capability Mapping - Maps a capability to a provider/process
 */
export interface CapabilityMapping {
  /** Capability name */
  capability: string;
  /** Provider/process identifier */
  providerId: string;
  /** Mapping metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Capabilities Map - Maps capabilities to providers
 */
export interface CapabilitiesMap {
  /** Map of capability to provider IDs */
  mappings: Map<string, string[]>;
  /** Map metadata */
  metadata?: Record<string, unknown>;
}

