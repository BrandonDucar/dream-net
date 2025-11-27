/**
 * Salesforce Agentforce Provider - Empty stub for Salesforce agent integration
 * 
 * This will be filled by Antigravity with actual Salesforce integration.
 */

import type { ProviderDescriptor } from "./ProviderDescriptor.js";

/**
 * Salesforce Agentforce Provider stub
 * Empty implementation - Antigravity will fill this
 */
export class SalesforceAgentForceProvider {
  constructor(descriptor: ProviderDescriptor) {
    // Empty constructor - Antigravity will initialize
  }

  /**
   * Initialize provider
   */
  async initialize(): Promise<void> {
    throw new Error("Not implemented - Antigravity will implement");
  }

  /**
   * Execute agent task
   */
  async executeTask(task: unknown): Promise<unknown> {
    throw new Error("Not implemented - Antigravity will implement");
  }
}

