/**
 * Agent Registry for DreamNet multi-agent system
 * Central registry for all CultureCoiner + MemeEngine agents
 */

import type { Agent, AgentPayload, AgentResult } from "./types";
import { createDreamContext } from "./DreamContext";

class AgentRegistryClass {
  private agents: Map<string, Agent> = new Map();
  private initialized: boolean = false;

  /**
   * Register an agent
   */
  registerAgent(agent: Agent): void {
    if (!agent.name) {
      throw new Error("Agent must have a name");
    }
    this.agents.set(agent.name, agent);
  }

  /**
   * Get an agent by name
   */
  getAgent(name: string): Agent | undefined {
    return this.agents.get(name);
  }

  /**
   * Get all registered agents
   */
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent names
   */
  getAgentNames(): string[] {
    return Array.from(this.agents.keys());
  }

  /**
   * Run an agent with a payload
   */
  async run(
    name: string,
    payload: Omit<AgentPayload, "context">
  ): Promise<AgentResult> {
    const agent = this.getAgent(name);
    if (!agent) {
      return {
        success: false,
        output: null,
        error: `Unknown agent: ${name}`,
        logs: [`Agent '${name}' not found in registry`],
      };
    }

    const context = createDreamContext();
    const payloadWithContext: AgentPayload = {
      ...payload,
      context,
    };

    const startTime = Date.now();
    try {
      const result = await agent.run(payloadWithContext);
      const duration = Date.now() - startTime;

      // Add metadata if not present
      if (!result.metadata) {
        result.metadata = {
          agent: name,
          task: payload.task,
          duration,
          timestamp: startTime,
        };
      }

      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      return {
        success: false,
        output: null,
        error: error?.message || String(error),
        logs: [`Error running agent '${name}': ${error?.message || String(error)}`],
        metadata: {
          agent: name,
          task: payload.task,
          duration,
          timestamp: startTime,
        },
      };
    }
  }

  /**
   * Initialize all agents (lazy import and registration)
   */
  async initAgents(): Promise<void> {
    if (this.initialized) return;

    try {
      // Lazy import all agents
      const { MemeForgeAgent } = await import("../agents/MemeForge/index.js");
      const { RemixEngineAgent } = await import("../agents/RemixEngine/index.js");
      const { CultureScoreAgent } = await import("../agents/CultureScore/index.js");
      const { MemeEngineCoreAgent } = await import("../agents/MemeEngineCore/index.js");
      const { PulseCasterAgent } = await import("../agents/PulseCaster/index.js");
      const { LoreSmithAgent } = await import("../agents/LoreSmith/index.js");
      const { CultureMintAgent } = await import("../agents/CultureMint/index.js");
      const { CultureGuardianAgent } = await import("../agents/CultureGuardian/index.js");
      const { MarketFlowAgent } = await import("../agents/MarketFlow/index.js");
      const { VisionSmithAgent } = await import("../agents/VisionSmith/index.js");
      const { SoundWaveAgent } = await import("../agents/SoundWave/index.js");
      const { CultureOpsAgent } = await import("../agents/CultureOps/index.js");

      // Register all agents
      this.registerAgent(MemeForgeAgent);
      this.registerAgent(RemixEngineAgent);
      this.registerAgent(CultureScoreAgent);
      this.registerAgent(MemeEngineCoreAgent);
      this.registerAgent(PulseCasterAgent);
      this.registerAgent(LoreSmithAgent);
      this.registerAgent(CultureMintAgent);
      this.registerAgent(CultureGuardianAgent);
      this.registerAgent(MarketFlowAgent);
      this.registerAgent(VisionSmithAgent);
      this.registerAgent(SoundWaveAgent);
      this.registerAgent(CultureOpsAgent);

      this.initialized = true;
      console.log(`[AgentRegistry] Initialized ${this.agents.size} agents`);
    } catch (error: any) {
      console.error("[AgentRegistry] Failed to initialize agents:", error);
      throw error;
    }
  }

  /**
   * Check if agents are initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get registry status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      agentCount: this.agents.size,
      agents: this.getAgentNames(),
    };
  }
}

// Export singleton instance
export const AgentRegistry = new AgentRegistryClass();

// Export convenience function
export async function initAgents(): Promise<void> {
  return AgentRegistry.initAgents();
}

