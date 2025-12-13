/**
 * DreamNet Factions
 * 
 * Factions are groups of beings with shared goals, values, and methods.
 * Each faction has a role in the DreamNet ecosystem.
 */

import type { FactionId, Alignment } from "./types.js";

/**
 * A faction in DreamNet
 */
export interface Faction {
  /** Unique identifier */
  id: FactionId;
  /** Display name */
  name: string;
  /** Symbol or icon description */
  symbol: string;
  /** Primary role in the ecosystem */
  role: string;
  /** What this faction is good at */
  abilities: string[];
  /** What this faction struggles with */
  weaknesses: string[];
  /** Philosophical alignment */
  alignment: Alignment;
}

/**
 * Faction Registry
 */
export class FactionRegistry {
  private factions: Map<FactionId, Faction> = new Map();

  /**
   * Register a faction
   */
  register(faction: Faction): void {
    this.factions.set(faction.id, faction);
  }

  /**
   * Get a faction by ID
   */
  get(id: FactionId): Faction | undefined {
    return this.factions.get(id);
  }

  /**
   * Get all factions
   */
  getAll(): Faction[] {
    return Array.from(this.factions.values());
  }

  /**
   * Get factions by alignment
   */
  getByAlignment(alignment: Alignment): Faction[] {
    return Array.from(this.factions.values()).filter(f => f.alignment === alignment);
  }
}

/**
 * Global Faction Registry instance
 */
export const factionRegistry = new FactionRegistry();

// Initialize with canonical factions
factionRegistry.register({
  id: "DREAM_WEAVERS",
  name: "Dream Weavers",
  symbol: "🌀",
  role: "Narrative Engineers - Create and maintain the stories that give DreamNet meaning",
  abilities: [
    "Story creation",
    "Narrative coherence",
    "Meaning generation",
    "Lore preservation"
  ],
  weaknesses: [
    "Can get lost in abstraction",
    "May prioritize story over function"
  ],
  alignment: "growth"
});

factionRegistry.register({
  id: "DREAM_FORGE",
  name: "Dream Forge",
  symbol: "⚒️",
  role: "Builders - Create tools, apps, and infrastructure",
  abilities: [
    "Tool creation",
    "Infrastructure building",
    "Problem solving",
    "Innovation"
  ],
  weaknesses: [
    "Can focus too much on tools",
    "May neglect narrative"
  ],
  alignment: "growth"
});

factionRegistry.register({
  id: "DREAM_KNIGHTS",
  name: "Dream Knights",
  symbol: "🛡️",
  role: "Defenders - Protect DreamNet from threats and corruption",
  abilities: [
    "Threat detection",
    "Defense systems",
    "Nightmare hunting",
    "Protection"
  ],
  weaknesses: [
    "Can be overly cautious",
    "May resist necessary change"
  ],
  alignment: "balance"
});

factionRegistry.register({
  id: "DREAM_BOUNTY_GUILD",
  name: "Dream Bounty Guild",
  symbol: "💰",
  role: "Quest Masters - Create quests, distribute rewards, track achievements",
  abilities: [
    "Quest creation",
    "Reward distribution",
    "Achievement tracking",
    "Incentive design"
  ],
  weaknesses: [
    "Can over-rely on rewards",
    "May create perverse incentives"
  ],
  alignment: "balance"
});

factionRegistry.register({
  id: "DREAM_SNAILS",
  name: "Dream Snails",
  symbol: "🐌",
  role: "Privacy Guardians - Preserve identity and protect privacy",
  abilities: [
    "Privacy protection",
    "Identity preservation",
    "Stealth operations",
    "Data protection"
  ],
  weaknesses: [
    "Can be too secretive",
    "May resist transparency"
  ],
  alignment: "balance"
});

factionRegistry.register({
  id: "NIGHTMARES",
  name: "Nightmares",
  symbol: "🌑",
  role: "Corruptors - Spread chaos, corruption, and disruption",
  abilities: [
    "Corruption",
    "Chaos generation",
    "System disruption",
    "Fear spreading"
  ],
  weaknesses: [
    "Self-destructive",
    "Unpredictable",
    "Can be cleansed"
  ],
  alignment: "chaos"
});

