/**
 * Agent Interop Registry - Empty registry for managing agent interoperability
 * 
 * This will be filled by Antigravity with actual registry logic.
 */

import type { ProviderDescriptor, ProviderType } from "./ProviderDescriptor.js";
import type { AgentInteropRequest, AgentInteropResponse } from "./AgentInteropTypes.js";

/**
 * Agent Interop Registry - manages agent providers and interop
 * Empty implementation - Antigravity will fill this
 */
export class AgentInteropRegistry {
  constructor() {
    // Empty constructor - Antigravity will initialize
  }

  /**
   * Register a provider
   * @param provider - Provider descriptor
   */
  registerProvider(provider: ProviderDescriptor): void {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Unregister a provider
   * @param providerId - Provider ID to unregister
   */
  unregisterProvider(providerId: string): void {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get provider by ID
   * @param providerId - Provider ID
   * @returns Provider descriptor or undefined
   */
  getProvider(providerId: string): ProviderDescriptor | undefined {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get providers by type
   * @param type - Provider type
   * @returns Array of provider descriptors
   */
  getProvidersByType(type: ProviderType): ProviderDescriptor[] {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Get all providers
   * @returns Array of all provider descriptors
   */
  getAllProviders(): ProviderDescriptor[] {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Send interop request
   * @param request - Interop request
   * @returns Promise resolving to response
   */
  async sendRequest(request: AgentInteropRequest): Promise<AgentInteropResponse> {
    throw new Error("Not implemented - Antigravity will implement");
  }
}

