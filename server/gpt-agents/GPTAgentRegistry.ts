/**
 * GPT Agent Registry
 * 
 * Registers all Custom GPTs as agents in DreamNet's agent system.
 * This is the foundation that unlocks all GPT features.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { registerAgent, registerCitizen } from "@dreamnet/directory/registry";
import AgentRegistryCore from "@dreamnet/agent-registry-core";
import { CitizenshipStore } from "@dreamnet/dream-state-core/store/citizenshipStore";
import type { DreamPassportTier } from "@dreamnet/dream-state-core/types";
import type { CustomGPT, GPTAgentRegistration, GPTAgentStatus, GPTRegistryStats } from "./types";
import {
  mapCategoryToCluster,
  mapCategoryToKind,
  determineTier,
  determineFlags,
  cleanGPTId,
} from "./mappers";
import type { AgentCapability } from "../core/SuperSpine";

export class GPTAgentRegistry {
  private gpts: CustomGPT[] = [];
  private registrations: Map<string, GPTAgentRegistration> = new Map();

  constructor() {
    this.loadGPTs();
  }

  /**
   * Load GPTs from registry.json
   */
  private loadGPTs(): void {
    try {
      const registryPath = join(process.cwd(), "registry.json");
      if (!existsSync(registryPath)) {
        console.warn(`📚 [GPT Agent Registry] registry.json not found at ${registryPath}`);
        this.gpts = [];
        return;
      }
      const registryData = JSON.parse(readFileSync(registryPath, "utf-8"));
      this.gpts = registryData as CustomGPT[];
      console.log(`📚 [GPT Agent Registry] Loaded ${this.gpts.length} GPTs from registry.json`);
    } catch (error) {
      console.warn("⚠️ [GPT Agent Registry] Failed to load GPT registry:", error instanceof Error ? error.message : error);
      this.gpts = [];
    }
  }

  /**
   * Register a single GPT as an agent
   */
  async registerGPT(gpt: CustomGPT): Promise<GPTAgentRegistration> {
    const gptId = cleanGPTId(gpt.name);
    const agentId = `gpt:${gptId}`;
    const identityId = `agent:${agentId}`;
    const citizenId = `CIT-${agentId}`;

    // Check if already registered
    const existing = this.registrations.get(gptId);
    if (existing && existing.registered) {
      console.log(`ℹ️ [GPT Agent Registry] ${gpt.name} already registered`);
      return existing;
    }

    try {
      const tier = determineTier(gpt) as DreamPassportTier;
      const flags = determineFlags(gpt);
      const clusterId = mapCategoryToCluster(gpt.category);
      const kind = mapCategoryToKind(gpt.category);

      // 1. Register agent in Directory
      registerAgent({
        agentId,
        label: gpt.name,
        clusterId,
        kind,
        description: gpt.purpose || `Custom GPT: ${gpt.name}`,
      });

      // 2. Register in AgentRegistryCore
      AgentRegistryCore.upsertAgentConfig({
        id: agentId,
        name: gpt.name,
        kind,
        subsystem: gpt.category,
        tags: flags,
      });

      // 3. Issue passport
      const passport = CitizenshipStore.issuePassport(identityId, tier, flags);

      // 4. Register as citizen
      registerCitizen({
        citizenId,
        label: `${gpt.name} (GPT Agent)`,
        description: `GPT agent with passport ${passport.id}, tier ${tier}`,
      });

      // 5. Register in SuperSpine (for communication)
      try {
        const { superSpine } = await import("../core/SuperSpine");
        const capabilities = this.getCapabilitiesForGPT(gpt);
        superSpine.registerAgent(agentId, gpt.name, capabilities, {
          category: gpt.category,
          link: gpt.link,
          purpose: gpt.purpose,
          status: gpt.status,
          type: "gpt",
        });
        console.log(`  → Registered in SuperSpine for communication`);
      } catch (error: any) {
        console.warn(`  → SuperSpine registration failed: ${error.message}`);
      }

      const registration: GPTAgentRegistration = {
        gptId,
        agentId,
        identityId,
        citizenId,
        passportId: passport.id,
        tier,
        clusterId,
        kind,
        registered: true,
        registeredAt: new Date().toISOString(),
      };

      this.registrations.set(gptId, registration);

      const clusterInfo = clusterId ? ` [${clusterId}]` : "";
      console.log(
        `✅ [GPT Agent Registry] Registered ${gpt.name} → Agent ${agentId}, Citizen ${citizenId}, Passport ${passport.id}, Tier ${tier}${clusterInfo}`
      );

      return registration;
    } catch (error: any) {
      console.error(`❌ [GPT Agent Registry] Failed to register ${gpt.name}:`, error.message);
      throw error;
    }
  }

  /**
   * Register all GPTs
   * Only registers Active GPTs (filters out Draft status)
   */
  async registerAll(): Promise<{ success: number; failed: number; errors: Array<{ gpt: string; error: string }> }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ gpt: string; error: string }>,
    };

    // Filter for Active GPTs only (match gpt-agent-factory.ts behavior)
    const activeGPTs = this.gpts.filter(gpt => gpt.status === "Active");
    const draftCount = this.gpts.length - activeGPTs.length;

    if (draftCount > 0) {
      console.log(`📊 [GPT Agent Registry] Filtering: ${activeGPTs.length} Active, ${draftCount} Draft (skipped)`);
    }

    for (const gpt of activeGPTs) {
      try {
        await this.registerGPT(gpt);
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          gpt: gpt.name,
          error: error.message,
        });
      }
    }

    console.log(
      `📊 [GPT Agent Registry] Registration complete: ${results.success} succeeded, ${results.failed} failed (${activeGPTs.length} Active GPTs processed)`
    );

    return results;
  }

  /**
   * Get registration status for a GPT
   */
  getStatus(gptIdOrName: string): GPTAgentStatus | null {
    const gpt = this.gpts.find((g) => g.name === gptIdOrName || cleanGPTId(g.name) === gptIdOrName);
    if (!gpt) {
      return null;
    }

    const gptId = cleanGPTId(gpt.name);
    const registration = this.registrations.get(gptId);

    return {
      gpt,
      registration,
      isRegistered: registration?.registered || false,
    };
  }

  /**
   * Get all GPTs
   */
  getAllGPTs(): CustomGPT[] {
    return this.gpts;
  }

  /**
   * Get all registered GPTs
   */
  getRegisteredGPTs(): GPTAgentRegistration[] {
    return Array.from(this.registrations.values()).filter((r) => r.registered);
  }

  /**
   * Get statistics
   */
  getStats(): GPTRegistryStats {
    const stats: GPTRegistryStats = {
      total: this.gpts.length,
      registered: this.registrations.size,
      unregistered: this.gpts.length - this.registrations.size,
      byCategory: {},
      byTier: {},
      byStatus: {},
    };

    for (const gpt of this.gpts) {
      // By category
      stats.byCategory[gpt.category] = (stats.byCategory[gpt.category] || 0) + 1;

      // By status
      stats.byStatus[gpt.status] = (stats.byStatus[gpt.status] || 0) + 1;
    }

    for (const reg of this.registrations.values()) {
      // By tier
      stats.byTier[reg.tier] = (stats.byTier[reg.tier] || 0) + 1;
    }

    return stats;
  }

  /**
   * Record heartbeat from a GPT
   */
  recordHeartbeat(gptId: string): void {
    const gptIdClean = cleanGPTId(gptId);
    const agentId = `gpt:${gptIdClean}`;
    const registration = this.registrations.get(gptIdClean);

    if (!registration) {
      console.warn(`⚠️ [GPT Agent Registry] Heartbeat from unregistered GPT: ${gptId}`);
      return;
    }

    // Record success in AgentRegistryCore
    AgentRegistryCore.recordSuccess(agentId);

    // Update SuperSpine agent status
    try {
      const { superSpine } = require("../core/SuperSpine");
      const agent = superSpine.getAgent(agentId);
      if (agent) {
        agent.lastActiveAt = new Date().toISOString();
        if (agent.status === "offline") {
          agent.status = "idle";
        }
      }
    } catch (error: any) {
      // SuperSpine not available, continue
    }
  }

  /**
   * Get capabilities for a GPT based on its category and purpose
   */
  private getCapabilitiesForGPT(gpt: CustomGPT): AgentCapability[] {
    const capabilities: AgentCapability[] = [];

    // Map category to capabilities
    const categoryCapabilities: Record<string, AgentCapability[]> = {
      "Core": ["code", "analysis", "deployment"],
      "Atlas": ["code", "analysis"],
      "Aegis": ["analysis", "communication"],
      "Travel & Commerce": ["communication", "analysis"],
      "Creative": ["design", "communication"],
      "Commerce": ["analysis", "communication"],
      "Sentinel": ["analysis", "communication"],
      "Experimental": ["code", "analysis"],
      "Automation": ["code", "deployment"],
      "Production": ["code", "deployment"],
      "Compliance & Tokenization": ["analysis", "communication"],
      "Compliance & Analytics": ["analysis"],
      "Compliance & Marketing": ["communication"],
      "DreamOps": ["code", "deployment"],
      "Evolution": ["code", "analysis"],
      "Growth": ["communication", "analysis"],
      "Infra": ["code", "deployment"],
      "Memory": ["analysis"],
      "Security": ["analysis"],
      "Web3": ["code", "analysis"],
      "Luxury Design": ["design"],
    };

    const catCaps = categoryCapabilities[gpt.category] || ["communication"];
    capabilities.push(...catCaps);

    // Add based on purpose keywords
    const purposeLower = gpt.purpose.toLowerCase();
    if (purposeLower.includes("design") || purposeLower.includes("visual")) {
      if (!capabilities.includes("design")) capabilities.push("design");
    }
    if (purposeLower.includes("code") || purposeLower.includes("developer")) {
      if (!capabilities.includes("code")) capabilities.push("code");
    }
    if (purposeLower.includes("funding") || purposeLower.includes("finance")) {
      if (!capabilities.includes("funding")) capabilities.push("funding");
    }
    if (purposeLower.includes("deploy") || purposeLower.includes("infrastructure")) {
      if (!capabilities.includes("deployment")) capabilities.push("deployment");
    }

    // Default to communication if no capabilities found
    if (capabilities.length === 0) {
      capabilities.push("communication");
    }

    return capabilities;
  }
}

// Singleton instance
export const gptAgentRegistry = new GPTAgentRegistry();

