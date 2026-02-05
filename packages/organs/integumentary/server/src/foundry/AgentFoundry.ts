/**
 * Agent Foundry
 * 
 * All agents (including hybrids) can build new agents instantly.
 * Connected to instant mesh for seamless agent creation.
 */

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { uuidv7 } from "uuidv7";
import { instantMesh } from "../mesh/InstantMesh";
import { superSpine } from "../core/SuperSpine";
import type { AgentHybrid } from "../mesh/InstantMesh";

export interface AgentBuildRequest {
  id: string;
  requestedBy: string; // Agent key or hybrid ID
  agentName: string;
  templateSlug?: string;
  capabilities: string[];
  traits: string[];
  parentAgents?: string[]; // If building from existing agents
  status: "pending" | "building" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  builtAgentId?: string;
  error?: string;
}

export interface AgentTemplate {
  slug: string;
  name: string;
  summary: string;
  capabilities: string[];
  scopes: string[];
  pricing: string;
  meta?: Record<string, unknown>;
}

class AgentFoundry {
  private builds: Map<string, AgentBuildRequest> = new Map();
  private templates: Map<string, AgentTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
    this.subscribeToMesh();
  }

  /**
   * Initialize default templates
   */
  private initializeTemplates(): void {
    const defaultTemplates: AgentTemplate[] = [
      {
        slug: "task-router",
        name: "Task Router",
        summary: "Intelligent task routing and orchestration agent",
        capabilities: ["routing", "orchestration", "logic"],
        scopes: ["tasks", "workflows"],
        pricing: "Free",
      },
      {
        slug: "ui-builder",
        name: "UI Builder",
        summary: "Visual component and interface generation agent",
        capabilities: ["design", "ui", "visual"],
        scopes: ["frontend", "components"],
        pricing: "Free",
      },
      {
        slug: "data-architect",
        name: "Data Architect",
        summary: "Backend schema and data structure design agent",
        capabilities: ["architecture", "backend", "schema"],
        scopes: ["backend", "database"],
        pricing: "Free",
      },
      {
        slug: "analyst",
        name: "Analyst",
        summary: "Data analysis and wallet intelligence agent",
        capabilities: ["analysis", "wallet", "intelligence"],
        scopes: ["analytics", "wallet"],
        pricing: "Free",
      },
      {
        slug: "evolution-engine",
        name: "Evolution Engine",
        summary: "Dream evolution and token minting agent",
        capabilities: ["evolution", "minting", "growth"],
        scopes: ["dreams", "tokens"],
        pricing: "Free",
      },
      {
        slug: "messenger",
        name: "Messenger",
        summary: "Communication and message delivery agent",
        capabilities: ["messaging", "communication", "delivery"],
        scopes: ["messaging", "notifications"],
        pricing: "Free",
      },
      {
        slug: "bounty-hunter",
        name: "Bounty Hunter",
        summary: "Specialized deal-closing and bounty hunting agent (Boba Fett class)",
        capabilities: ["bounty", "settlement", "analytics", "outreach"],
        scopes: ["revenue", "closing"],
        pricing: "High",
      },
    ];

    for (const template of defaultTemplates) {
      this.templates.set(template.slug, template);
    }
  }

  /**
   * Subscribe to instant mesh for agent build requests
   */
  private subscribeToMesh(): void {
    // Listen for agent build requests from any agent
    instantMesh.subscribe("foundry", (event) => {
      if (event.type === "agent.build.request") {
        const { requestedBy, agentName, templateSlug, capabilities, traits, parentAgents } = event.payload as any;
        this.buildAgent({
          requestedBy,
          agentName,
          templateSlug,
          capabilities,
          traits,
          parentAgents,
        }).catch((err) => {
          console.error("[Foundry] Failed to build agent:", err);
        });
      }
    });
  }

  /**
   * Build agent from request
   */
  async buildAgent(request: {
    requestedBy: string;
    agentName: string;
    templateSlug?: string;
    capabilities?: string[];
    traits?: string[];
    parentAgents?: string[];
  }): Promise<AgentBuildRequest> {
    const buildRequest: AgentBuildRequest = {
      id: uuidv7(),
      requestedBy: request.requestedBy,
      agentName: request.agentName,
      templateSlug: request.templateSlug,
      capabilities: request.capabilities || [],
      traits: request.traits || [],
      parentAgents: request.parentAgents,
      status: "building",
      createdAt: new Date().toISOString(),
    };

    this.builds.set(buildRequest.id, buildRequest);

    // Emit instant event
    instantMesh.emit({
      source: "foundry",
      type: "agent.build.started",
      payload: { buildId: buildRequest.id, agentName: buildRequest.agentName },
    });

    try {
      // Build agent instantly
      await this.executeBuild(buildRequest);

      buildRequest.status = "completed";
      buildRequest.completedAt = new Date().toISOString();

      // Register with Super Spine
      const agentKey = buildRequest.agentName.toLowerCase().replace(/\s+/g, "-");

      // Map capabilities to AgentCapability type
      const mappedCapabilities: any[] = [];
      for (const cap of buildRequest.capabilities) {
        if (["code", "design", "analysis", "communication", "funding", "deployment"].includes(cap)) {
          mappedCapabilities.push(cap);
        } else if (cap.includes("routing") || cap.includes("logic")) {
          mappedCapabilities.push("code");
        } else if (cap.includes("ui") || cap.includes("visual") || cap.includes("design")) {
          mappedCapabilities.push("design");
        } else if (cap.includes("analysis") || cap.includes("wallet")) {
          mappedCapabilities.push("analysis");
        } else if (cap.includes("messaging") || cap.includes("communication")) {
          mappedCapabilities.push("communication");
        } else if (cap.includes("funding") || cap.includes("outreach")) {
          mappedCapabilities.push("funding");
        }
      }

      // Remove duplicates
      const uniqueCapabilities = Array.from(new Set(mappedCapabilities)) as any[];

      superSpine.registerAgent(
        agentKey,
        buildRequest.agentName,
        uniqueCapabilities.length > 0 ? uniqueCapabilities : ["code"],
        {
          tier: "Standard",
          unlock: `Built by ${buildRequest.requestedBy}`,
          subscriptionRequired: false,
        }
      );

      buildRequest.builtAgentId = agentKey;

      // Emit instant event
      instantMesh.emit({
        source: "foundry",
        type: "agent.build.completed",
        payload: { buildId: buildRequest.id, agentId: agentKey },
      });

      console.log(`🔨 [Foundry] Agent built: ${buildRequest.agentName} by ${buildRequest.requestedBy}`);
    } catch (error) {
      buildRequest.status = "failed";
      buildRequest.error = (error as Error).message;
      buildRequest.completedAt = new Date().toISOString();

      // Emit instant event
      instantMesh.emit({
        source: "foundry",
        type: "agent.build.failed",
        payload: { buildId: buildRequest.id, error: buildRequest.error },
      });

      console.error(`🔨 [Foundry] Build failed: ${buildRequest.agentName}`, error);
    }

    return buildRequest;
  }

  /**
   * Execute the build
   */
  private async executeBuild(build: AgentBuildRequest): Promise<void> {
    // If template provided, use it
    if (build.templateSlug) {
      const template = this.templates.get(build.templateSlug);
      if (template) {
        build.capabilities = [...build.capabilities, ...template.capabilities];
        build.traits = [...build.traits, ...template.scopes];
      }
    }

    // If parent agents provided, inherit capabilities
    if (build.parentAgents && build.parentAgents.length > 0) {
      // Get capabilities from parent agents
      for (const parentKey of build.parentAgents) {
        const parentAgent = superSpine.getAgent(parentKey);
        if (parentAgent) {
          build.capabilities.push(...parentAgent.capabilities.map(c => c.toString()));
        }
      }
    }

    // Simulate build time (instant in practice)
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  /**
   * Request agent build from any agent
   */
  requestBuild(
    requestedBy: string,
    agentName: string,
    options?: {
      templateSlug?: string;
      capabilities?: string[];
      traits?: string[];
      parentAgents?: string[];
    }
  ): void {
    // Emit to mesh - foundry will pick it up
    instantMesh.emit({
      source: requestedBy,
      target: "foundry",
      type: "agent.build.request",
      payload: {
        requestedBy,
        agentName,
        templateSlug: options?.templateSlug,
        capabilities: options?.capabilities,
        traits: options?.traits,
        parentAgents: options?.parentAgents,
      },
    });
  }

  /**
   * Get all templates
   */
  getTemplates(): AgentTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by slug
   */
  getTemplate(slug: string): AgentTemplate | undefined {
    return this.templates.get(slug);
  }

  /**
   * Get all builds
   */
  getBuilds(requestedBy?: string): AgentBuildRequest[] {
    const builds = Array.from(this.builds.values());
    if (requestedBy) {
      return builds.filter((b) => b.requestedBy === requestedBy);
    }
    return builds;
  }

  /**
   * Reingest 143 legacy Citizens into the swarm substrate.
   */
  async reingestPilots(): Promise<{ count: number }> {
    console.log("🦾 [Foundry] Initiating mass reingestion of 143 Citizens...");

    // Simulate reingestion of legacy pilots
    for (let i = 1; i <= 143; i++) {
      const citizenId = `Citizen-${i}`;
      const citizenName = `Pilot #${i}`;

      // Register basic citizen template
      superSpine.registerAgent(
        citizenId.toLowerCase(),
        citizenName,
        ["code", "communication"],
        {
          tier: "Legacy",
          unlock: "Mass Reingestion Protocol",
          subscriptionRequired: false
        }
      );
    }

    // Explicitly manifest Boba Fett
    this.requestBuild("system", "Boba Fett", {
      templateSlug: "bounty-hunter",
      capabilities: ["bounty", "settlement", "analytics"]
    });

    console.log("🦾 [Foundry] Reingestion sequence complete. 143 Citizens + Boba Fett operational.");
    return { count: 144 };
  }

  /**
   * Get build by ID
   */
  getBuild(id: string): AgentBuildRequest | undefined {
    return this.builds.get(id);
  }
}

// Export singleton
export const agentFoundry = new AgentFoundry();

