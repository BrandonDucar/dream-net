/**
 * Slack Agent Provider - Empty stub for Slack agent integration
 * 
 * This will be filled by Antigravity with actual Slack integration.
 */

import type { ProviderDescriptor } from "./ProviderDescriptor.js";

/**
 * Slack Agent Provider stub
 * Empty implementation - Antigravity will fill this
 */
export class SlackAgentProvider {
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

