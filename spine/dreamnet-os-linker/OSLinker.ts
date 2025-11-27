/**
 * OS Linker - Empty linker implementation for DreamNet OS compatibility
 * 
 * This will be filled by Antigravity with actual OS linker logic.
 */

import type { OSProcessDescriptor } from "./OSProcessDescriptor.js";
import type { RuntimeContext } from "./RuntimeContext.js";
import type { EnvironmentBinding } from "./EnvironmentBindings.js";
import type { CapabilityMapping } from "./CapabilitiesMap.js";

/**
 * OS Linker - Links processes to OS runtime
 * Empty implementation - Antigravity will fill this
 */
export class OSLinker {
  constructor() {
    // Empty constructor - Antigravity will initialize
  }

  /**
   * Register a process
   * @param descriptor - Process descriptor
   */
  registerProcess(descriptor: OSProcessDescriptor): void {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get process by ID
   * @param processId - Process ID
   * @returns Process descriptor or undefined
   */
  getProcess(processId: string): OSProcessDescriptor | undefined {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Bind process to environment
   * @param binding - Environment binding
   */
  bindEnvironment(binding: EnvironmentBinding): void {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Map capability to provider
   * @param mapping - Capability mapping
   */
  mapCapability(mapping: CapabilityMapping): void {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get providers for capability
   * @param capability - Capability name
   * @returns Array of provider IDs
   */
  getProvidersForCapability(capability: string): string[] {
    throw new Error("Not implemented - Antigravity will implement");
  }
}

