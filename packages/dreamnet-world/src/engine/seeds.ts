/**
 * DreamNet Seeds
 * 
 * Seeds are the fundamental units of possibility in DreamNet.
 * They can grow into tools, realms, agents, creatures, or storylines.
 */

import type { DreamLayerId, SeedType, RiskLevel } from "../world/types.js";

/**
 * A seed in DreamNet
 */
export interface Seed {
  /** Unique identifier (e.g., "seed.prototype.tool") */
  id: string;
  /** Display name */
  name: string;
  /** What this seed can grow into */
  seedType: SeedType;
  /** Rich description */
  description: string;
  /** Where this seed must be rooted originally */
  requiredLayer: DreamLayerId;
  /** Risk level of growing this seed */
  riskLevel: RiskLevel;
}

/**
 * Seed Registry
 */
export class SeedRegistry {
  private seeds: Map<string, Seed> = new Map();

  /**
   * Register a seed
   */
  register(seed: Seed): void {
    this.seeds.set(seed.id, seed);
  }

  /**
   * Get a seed by ID
   */
  get(id: string): Seed | undefined {
    return this.seeds.get(id);
  }

  /**
   * Get all seeds
   */
  getAll(): Seed[] {
    return Array.from(this.seeds.values());
  }

  /**
   * Get seeds by type
   */
  getByType(seedType: SeedType): Seed[] {
    return Array.from(this.seeds.values()).filter(s => s.seedType === seedType);
  }

  /**
   * Get seeds by required layer
   */
  getByLayer(layer: DreamLayerId): Seed[] {
    return Array.from(this.seeds.values()).filter(s => s.requiredLayer === layer);
  }
}

/**
 * Global Seed Registry instance
 */
export const seedRegistry = new SeedRegistry();

// Initialize with sample seeds
seedRegistry.register({
  id: "seed.prototype.tool",
  name: "Prototype Tool Seed",
  seedType: "TOOL",
  description: "A seed that can grow into a useful tool. When planted in the right soil, it will sprout into a prototype that can be refined.",
  requiredLayer: "UNDERLAYER",
  riskLevel: "LOW"
});

seedRegistry.register({
  id: "seed.mini.realm",
  name: "Mini Realm Seed",
  seedType: "REALM",
  description: "A seed containing the blueprint for a new mini-app realm. When rooted, it will grow into a complete mini-app ecosystem.",
  requiredLayer: "BRANCH_REALMS",
  riskLevel: "MEDIUM"
});

seedRegistry.register({
  id: "seed.agent.consciousness",
  name: "Agent Consciousness Seed",
  seedType: "AGENT",
  description: "A seed that can grow into a new AI agent. When planted, it will develop consciousness and join the DreamNet ecosystem.",
  requiredLayer: "UNDERLAYER",
  riskLevel: "HIGH"
});

seedRegistry.register({
  id: "seed.creature.dreamling",
  name: "Dreamling Seed",
  seedType: "CREATURE",
  description: "A tiny seed that can grow into a Dreamling - a small fragment of dream energy that floats through the underlayer.",
  requiredLayer: "UNDERLAYER",
  riskLevel: "LOW"
});

seedRegistry.register({
  id: "seed.storyline.quest",
  name: "Quest Storyline Seed",
  seedType: "STORYLINE",
  description: "A seed containing a narrative thread. When planted, it will grow into a quest or storyline that Dreamers can follow.",
  requiredLayer: "BRANCH_REALMS",
  riskLevel: "MEDIUM"
});

seedRegistry.register({
  id: "seed.critical.corruption",
  name: "Corruption Seed",
  seedType: "STORYLINE",
  description: "A dangerous seed that can spawn Nightmares. Handle with extreme caution - requires cleansing before planting.",
  requiredLayer: "UNDERLAYER",
  riskLevel: "CRITICAL"
});

