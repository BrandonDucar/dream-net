/**
 * Agent Interop Registry - In-memory registry for managing agent providers
 * 
 * Phase I implementation: Simple in-memory storage with event emission.
 */

import type { ProviderDescriptor, ProviderType } from "./ProviderDescriptor.js";
import type { AgentInteropRequest, AgentInteropResponse } from "./AgentInteropTypes.js";
import type { DreamEventBus } from "../dreamnet-event-bus/DreamEventBus.js";
import { createEventEnvelope } from "../dreamnet-event-bus/EventEnvelope.js";

/**
 * Agent Interop Registry - Manages agent providers and interop
 * 
 * Phase I: In-memory storage with event emission to Event Bus.
 */
export class AgentInteropRegistry {
  private providers: Map<string, ProviderDescriptor> = new Map();
  private eventBus: DreamEventBus | null = null;

  constructor(eventBus?: DreamEventBus) {
    this.eventBus = eventBus ?? null;
  }

  /**
   * Set the event bus for event emission
   */
  setEventBus(eventBus: DreamEventBus): void {
    this.eventBus = eventBus;
  }

  /**
   * Register a provider
   * @param provider - Provider descriptor
   */
  registerProvider(provider: ProviderDescriptor): void {
    this.providers.set(provider.id, provider);

    // Emit event if event bus is available
    if (this.eventBus) {
      const event = createEventEnvelope({
        type: "Interop.Provider.Registered",
        source: "AgentInteropRegistry",
        payload: {
          providerId: provider.id,
          providerName: provider.name,
          providerType: provider.type,
          capabilities: provider.capabilities ?? [],
        },
      });
      this.eventBus.publish(event);
    }
  }

  /**
   * Unregister a provider
   * @param providerId - Provider ID to unregister
   */
  unregisterProvider(providerId: string): void {
    const provider = this.providers.get(providerId);
    if (provider) {
      this.providers.delete(providerId);

      // Emit event if event bus is available
      if (this.eventBus) {
        const event = createEventEnvelope({
          type: "Interop.Provider.Removed",
          source: "AgentInteropRegistry",
          payload: {
            providerId: provider.id,
            providerName: provider.name,
            providerType: provider.type,
          },
        });
        this.eventBus.publish(event);
      }
    }
  }

  /**
   * Get provider by ID
   * @param providerId - Provider ID
   * @returns Provider descriptor or undefined
   */
  getProvider(providerId: string): ProviderDescriptor | undefined {
    return this.providers.get(providerId);
  }

  /**
   * Get providers by type
   * @param type - Provider type
   * @returns Array of provider descriptors
   */
  getProvidersByType(type: ProviderType): ProviderDescriptor[] {
    const result: ProviderDescriptor[] = [];
    for (const provider of this.providers.values()) {
      if (provider.type === type) {
        result.push(provider);
      }
    }
    return result;
  }

  /**
   * Get all providers
   * @returns Array of all provider descriptors
   */
  getAllProviders(): ProviderDescriptor[] {
    return Array.from(this.providers.values());
  }

  /**
   * Find providers that support a specific capability
   * @param capability - Capability to search for
   * @returns Array of providers that support this capability
   */
  supportsCapability(capability: string): ProviderDescriptor[] {
    const result: ProviderDescriptor[] = [];
    for (const provider of this.providers.values()) {
      const capabilities = provider.capabilities ?? [];
      if (capabilities.includes(capability)) {
        result.push(provider);
      }
    }
    return result;
  }

  /**
   * Send interop request
   * 
   * Phase I: Stub implementation - Antigravity will implement actual request routing.
   * 
   * @param request - Interop request
   * @returns Promise resolving to response
   */
  async sendRequest(request: AgentInteropRequest): Promise<AgentInteropResponse> {
    // Phase I: Stub - Antigravity will implement actual request routing
    throw new Error("Not implemented - Antigravity will implement request routing in Phase II");
  }

  /**
   * Get count of registered providers
   */
  getProviderCount(): number {
    return this.providers.size;
  }
}

