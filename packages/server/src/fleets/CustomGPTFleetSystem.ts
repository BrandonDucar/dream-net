/**
 * Custom GPT Fleet System
 * 
 * Manages all 30-40 custom GPTs organized by vertical ecosystems:
 * - Atlas Ecosystem
 * - Aegis Ecosystem  
 * - Travel & Commerce Ecosystem
 * - Creative Ecosystem
 * - Commerce Ecosystem
 * - Sentinel Ecosystem
 * - And more...
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export interface CustomGPT {
  name: string;
  link: string | null;
  category: string;
  purpose: string;
  status: "Active" | "Draft";
  date_added: string;
}

export interface GPTFleet {
  id: string;
  category: string;
  name: string;
  description: string;
  gpts: CustomGPT[];
  status: "active" | "standby" | "deployed";
  mission: string | null;
  createdAt: string;
  lastDeployedAt: string | null;
}

class CustomGPTFleetSystem {
  private gpts: CustomGPT[] = [];
  private fleets: Map<string, GPTFleet> = new Map();

  constructor() {
    this.loadGPTs();
    this.initializeFleets();
  }

  /**
   * Load GPTs from registry.json
   */
  private loadGPTs(): void {
    try {
      const registryPath = join(process.cwd(), "registry.json");
      const registryData = JSON.parse(readFileSync(registryPath, "utf-8"));
      this.gpts = registryData as CustomGPT[];
      console.log(`📚 [Custom GPT Fleet] Loaded ${this.gpts.length} custom GPTs`);
    } catch (error) {
      console.error("Failed to load GPT registry:", error);
      this.gpts = [];
    }
  }

  /**
   * Initialize fleets by category
   */
  private initializeFleets(): void {
    // Group GPTs by category
    const gptsByCategory = new Map<string, CustomGPT[]>();
    
    for (const gpt of this.gpts) {
      if (!gptsByCategory.has(gpt.category)) {
        gptsByCategory.set(gpt.category, []);
      }
      gptsByCategory.get(gpt.category)!.push(gpt);
    }

    // Create fleet for each category
    for (const [category, gpts] of gptsByCategory.entries()) {
      const fleet: GPTFleet = {
        id: randomUUID(),
        category: category.toLowerCase().replace(/\s+/g, "-"),
        name: `${category} Fleet`,
        description: this.getCategoryDescription(category),
        gpts: gpts.filter(g => g.status === "Active"),
        status: "active",
        mission: null,
        createdAt: new Date().toISOString(),
        lastDeployedAt: null,
      };

      this.fleets.set(fleet.category, fleet);
      console.log(`🚀 [Custom GPT Fleet] Initialized ${fleet.name} with ${fleet.gpts.length} GPTs`);
    }
  }

  /**
   * Get category description
   */
  private getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
      "Atlas": "AI model training, coordination, and agent building ecosystem",
      "Aegis": "Security, privacy, compliance, and defense ecosystem",
      "Travel & Commerce": "Travel optimization, logistics, and commerce ecosystem",
      "Creative": "Content creation, design, and creative tools ecosystem",
      "Commerce": "Payment, revenue, and business operations ecosystem",
      "Sentinel": "Monitoring, auditing, and network security ecosystem",
      "Core": "Core DreamNet orchestration and control systems",
      "Experimental": "Experimental and cutting-edge research systems",
      "Automation": "Workflow automation and orchestration",
      "Compliance & Tokenization": "Legal compliance and tokenization systems",
      "Growth": "Community growth and SEO systems",
      "Infra": "Infrastructure and system management",
      "Memory": "Memory and data systems",
      "Security": "Security and access control",
      "Production": "Production and deployment systems",
      "Web3": "Web3 and blockchain systems",
      "DreamOps": "Dream operations and management",
      "Evolution": "Evolution and improvement systems",
      "Luxury Design": "Luxury design and creative systems",
      "OmniBridge": "Bridge and integration systems",
    };

    return descriptions[category] || `${category} ecosystem for specialized operations`;
  }

  /**
   * Get all fleets
   */
  getAllFleets(): GPTFleet[] {
    return Array.from(this.fleets.values());
  }

  /**
   * Get fleet by category
   */
  getFleet(category: string): GPTFleet | undefined {
    const normalized = category.toLowerCase().replace(/\s+/g, "-");
    return this.fleets.get(normalized);
  }

  /**
   * Get all GPTs
   */
  getAllGPTs(): CustomGPT[] {
    return this.gpts;
  }

  /**
   * Get GPTs by category
   */
  getGPTsByCategory(category: string): CustomGPT[] {
    return this.gpts.filter(gpt => 
      gpt.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Deploy fleet on mission
   */
  deployFleet(category: string, objective: string): GPTFleet | null {
    const fleet = this.getFleet(category);
    if (!fleet) return null;

    fleet.status = "deployed";
    fleet.mission = objective;
    fleet.lastDeployedAt = new Date().toISOString();

    console.log(`🚀 [Custom GPT Fleet] ${fleet.name} deployed on mission: ${objective}`);
    return fleet;
  }

  /**
   * Get fleet statistics
   */
  getStatistics(): {
    totalGPTs: number;
    activeGPTs: number;
    totalFleets: number;
    fleetsByCategory: Record<string, number>;
  } {
    const activeGPTs = this.gpts.filter(g => g.status === "Active").length;
    const fleetsByCategory: Record<string, number> = {};

    for (const fleet of this.fleets.values()) {
      fleetsByCategory[fleet.category] = fleet.gpts.length;
    }

    return {
      totalGPTs: this.gpts.length,
      activeGPTs,
      totalFleets: this.fleets.size,
      fleetsByCategory,
    };
  }
}

// Export singleton
export const customGPTFleetSystem = new CustomGPTFleetSystem();

