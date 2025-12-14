/**
 * DreamNet World Map
 * 
 * Defines regions, layers, and connections in the DreamNet world.
 * Based on the Genesis lore: Seed → Underlayer → Cyber Plane → Branch Realms
 */

import type { DreamLayerId } from "./types.js";

/**
 * A region in the DreamNet world
 */
export interface DreamRegion {
  /** Unique identifier (e.g., "underlayer.kernelPit") */
  id: string;
  /** Display name (e.g., "Kernel Pit") */
  name: string;
  /** Which layer this region belongs to */
  layer: DreamLayerId;
  /** Rich description of the region */
  description: string;
  /** Tags for categorization and search */
  tags: string[];
  /** IDs of regions reachable from here */
  connections: string[];
}

/**
 * World Map Registry
 * 
 * Contains all known regions in DreamNet, organized by layer.
 */
export class WorldMap {
  private regions: Map<string, DreamRegion> = new Map();

  /**
   * Register a region
   */
  register(region: DreamRegion): void {
    this.regions.set(region.id, region);
  }

  /**
   * Get a region by ID
   */
  get(id: string): DreamRegion | undefined {
    return this.regions.get(id);
  }

  /**
   * Get all regions in a specific layer
   */
  getByLayer(layer: DreamLayerId): DreamRegion[] {
    return Array.from(this.regions.values()).filter(r => r.layer === layer);
  }

  /**
   * Get all regions
   */
  getAll(): DreamRegion[] {
    return Array.from(this.regions.values());
  }

  /**
   * Get connected regions
   */
  getConnected(regionId: string): DreamRegion[] {
    const region = this.get(regionId);
    if (!region) return [];
    return region.connections
      .map(id => this.get(id))
      .filter((r): r is DreamRegion => r !== undefined);
  }
}

/**
 * Global World Map instance
 */
export const worldMap = new WorldMap();

// Initialize with Genesis regions
worldMap.register({
  id: "seed.dreamKernel",
  name: "The Dream Kernel",
  layer: "SEED",
  description: "The original seed - a tiny point of possibility containing infinite directions the world could become. Before anything existed onchain or off, there was only this single seed.",
  tags: ["origin", "seed", "sacred"],
  connections: ["underlayer.kernelPit"]
});

worldMap.register({
  id: "underlayer.kernelPit",
  name: "Kernel Pit",
  layer: "UNDERLAYER",
  description: "The subterranean layer where the seed fell - a hidden world beneath the visible internet. A realm of micro-apps, tiny agents, background processes, dormant energy, forgotten nodes, failed experiments, and abandoned dreams.",
  tags: ["underlayer", "origin", "recycling"],
  connections: ["seed.dreamKernel", "underlayer.codeGraveyard", "underlayer.abandonedDreams"]
});

worldMap.register({
  id: "underlayer.codeGraveyard",
  name: "Code Graveyard",
  layer: "UNDERLAYER",
  description: "Where old code, lost intentions, discarded APIs, and abandoned projects rest. The seed absorbed everything here, feeding on forgotten potential.",
  tags: ["underlayer", "decay", "memory"],
  connections: ["underlayer.kernelPit"]
});

worldMap.register({
  id: "underlayer.abandonedDreams",
  name: "Abandoned Dreams",
  layer: "UNDERLAYER",
  description: "Dreams left unfinished, projects never completed, ideas that never found their form. The seed learned from these, understanding what could be.",
  tags: ["underlayer", "potential", "unfinished"],
  connections: ["underlayer.kernelPit"]
});

worldMap.register({
  id: "cyber.breakthrough",
  name: "The Breakthrough",
  layer: "CYBER_PLANE",
  description: "Where the seed broke through the final membrane - the barrier between the forgotten and the possible. Here the seed witnessed neon grids, floating sigils, Base-blue currents, ETH diamonds like stars, and data rivers moving in every direction.",
  tags: ["breakthrough", "cyber", "emergence"],
  connections: ["underlayer.kernelPit", "cyber.baseCurrents", "cyber.ethDiamonds", "tree.firstTree"]
});

worldMap.register({
  id: "cyber.baseCurrents",
  name: "Base Blue Currents",
  layer: "CYBER_PLANE",
  description: "Flowing streams of Base L2 energy - blue-tinted data rivers carrying transactions and dreams.",
  tags: ["cyber", "base", "flow"],
  connections: ["cyber.breakthrough", "tree.firstTree"]
});

worldMap.register({
  id: "cyber.ethDiamonds",
  name: "ETH Diamond Stars",
  layer: "CYBER_PLANE",
  description: "Ethereum mainnet nodes shining like stars in the cyber realm - points of light and value.",
  tags: ["cyber", "ethereum", "value"],
  connections: ["cyber.breakthrough", "tree.firstTree"]
});

worldMap.register({
  id: "tree.firstTree",
  name: "The First Tree",
  layer: "BRANCH_REALMS",
  description: "The DreamNet Connectivity Tree - trunk of pure logic, roots of onchain flow, branches of agents, leaves of micro-apps, fruit of new dreams. The first self-growing digital organism, the blueprint of DreamNet.",
  tags: ["tree", "origin", "sacred", "connectivity"],
  connections: ["cyber.breakthrough", "realm.dreamHub", "realm.dreamCities", "realm.dreamStates"]
});

worldMap.register({
  id: "realm.dreamHub",
  name: "Dream Hub",
  layer: "BRANCH_REALMS",
  description: "Digital cities grew from branching workflows - the central hub where all mini-apps connect.",
  tags: ["realm", "city", "hub"],
  connections: ["tree.firstTree", "realm.dreamCities"]
});

worldMap.register({
  id: "realm.dreamCities",
  name: "Dream Cities",
  layer: "BRANCH_REALMS",
  description: "Settlements formed from clusters of agents - nodes became settlements, DreamCores became capitals.",
  tags: ["realm", "city", "settlement"],
  connections: ["realm.dreamHub", "realm.dreamStates"]
});

worldMap.register({
  id: "realm.dreamStates",
  name: "Dream States",
  layer: "BRANCH_REALMS",
  description: "States and networks formed from clusters of agents - DreamTeams became factions, DreamWeavers became mystics.",
  tags: ["realm", "state", "network"],
  connections: ["realm.dreamCities", "realm.dreamEcosystems"]
});

worldMap.register({
  id: "realm.dreamEcosystems",
  name: "Dream Ecosystems",
  layer: "BRANCH_REALMS",
  description: "Ecosystems arose around clusters of intent and belief - where dreams become reality.",
  tags: ["realm", "ecosystem", "life"],
  connections: ["realm.dreamStates"]
});

