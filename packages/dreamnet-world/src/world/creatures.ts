/**
 * DreamNet Creatures
 * 
 * Creatures are lifeforms that inhabit the DreamNet world.
 * They range from tiny Dreamlings to massive Titans.
 */

import type { CreatureCategory } from "./types.js";

/**
 * A creature in DreamNet
 */
export interface Creature {
  /** Unique identifier (e.g., "creature.dreamling.basic") */
  id: string;
  /** Display name */
  name: string;
  /** Size category */
  category: CreatureCategory;
  /** Rich description */
  description: string;
  /** Region IDs where this creature is native */
  nativeRegions: string[];
  /** Affinities (e.g., ["Base 🟦", "Ethereum ◆", "Underlayer"]) */
  affinity: string[];
  /** Behavioral patterns */
  behaviors: string[];
}

/**
 * Creature Registry
 */
export class CreatureRegistry {
  private creatures: Map<string, Creature> = new Map();

  /**
   * Register a creature
   */
  register(creature: Creature): void {
    this.creatures.set(creature.id, creature);
  }

  /**
   * Get a creature by ID
   */
  get(id: string): Creature | undefined {
    return this.creatures.get(id);
  }

  /**
   * Get all creatures
   */
  getAll(): Creature[] {
    return Array.from(this.creatures.values());
  }

  /**
   * Get creatures by category
   */
  getByCategory(category: CreatureCategory): Creature[] {
    return Array.from(this.creatures.values()).filter(c => c.category === category);
  }

  /**
   * Get creatures native to a region
   */
  getByRegion(regionId: string): Creature[] {
    return Array.from(this.creatures.values()).filter(c => 
      c.nativeRegions.includes(regionId)
    );
  }
}

/**
 * Global Creature Registry instance
 */
export const creatureRegistry = new CreatureRegistry();

// Initialize with canonical creatures
creatureRegistry.register({
  id: "creature.dreamling.basic",
  name: "Dreamling",
  category: "TINY",
  description: "Tiny fragments of dreams that float through the underlayer. They are barely visible, like fireflies of possibility. When they cluster together, they can form larger dreams.",
  nativeRegions: ["underlayer.kernelPit", "underlayer.abandonedDreams"],
  affinity: ["Underlayer", "Seed"],
  behaviors: [
    "Floats aimlessly",
    "Clusters with others",
    "Absorbs ambient dream energy",
    "Can merge into larger forms"
  ]
});

creatureRegistry.register({
  id: "creature.baseborn",
  name: "Baseborn",
  category: "SMALL",
  description: "Creatures born from Base L2 currents. They have a distinctive blue tint and move in flowing patterns. They are drawn to transactions and value flows.",
  nativeRegions: ["cyber.baseCurrents", "tree.firstTree"],
  affinity: ["Base 🟦", "Cyber Plane"],
  behaviors: [
    "Follows transaction flows",
    "Clusters around value",
    "Moves in currents",
    "Can carry messages"
  ]
});

creatureRegistry.register({
  id: "creature.etherial",
  name: "Etherial",
  category: "MEDIUM",
  description: "Beings of pure Ethereum energy. They shine like stars and are drawn to high-value nodes. They can phase through barriers and exist in multiple layers simultaneously.",
  nativeRegions: ["cyber.ethDiamonds", "tree.firstTree"],
  affinity: ["Ethereum ◆", "Cyber Plane", "Branch Realms"],
  behaviors: [
    "Phases between layers",
    "Drawn to value",
    "Shines brightly",
    "Can bridge realms"
  ]
});

creatureRegistry.register({
  id: "creature.nightmare.basic",
  name: "Nightmare",
  category: "MEDIUM",
  description: "Corrupted dreams that spread chaos and fear. They feed on negative energy and can corrupt other creatures. They must be cleansed or destroyed.",
  nativeRegions: ["underlayer.codeGraveyard", "realm.dreamEcosystems"],
  affinity: ["Chaos", "Corruption"],
  behaviors: [
    "Spreads corruption",
    "Feeds on fear",
    "Attacks other creatures",
    "Can be cleansed by Dream Knights"
  ]
});

creatureRegistry.register({
  id: "creature.nightmare.titan",
  name: "Nightmare Titan",
  category: "TITAN",
  description: "A massive corrupted entity formed from countless merged nightmares. It threatens entire regions and requires coordinated effort to defeat.",
  nativeRegions: ["realm.dreamEcosystems"],
  affinity: ["Chaos", "Corruption", "Destruction"],
  behaviors: [
    "Corrupts entire regions",
    "Spawns smaller nightmares",
    "Requires multiple Dream Knights to defeat",
    "Drops valuable rewards when cleansed"
  ]
});

creatureRegistry.register({
  id: "creature.dreamsnail",
  name: "Dream Snail",
  category: "SMALL",
  description: "Stealthy creatures that carve privacy tunnels through the DreamNet. They move unseen and protect identity. They leave trails of encrypted pathways.",
  nativeRegions: ["underlayer.kernelPit", "realm.dreamHub"],
  affinity: ["Privacy", "Stealth", "Underlayer"],
  behaviors: [
    "Moves unseen",
    "Carves privacy tunnels",
    "Protects identity",
    "Leaves encrypted trails"
  ]
});

