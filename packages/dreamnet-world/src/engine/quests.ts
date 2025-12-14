/**
 * DreamNet Quests
 * 
 * Quests are structured objectives that Dreamers can complete.
 * They provide goals, rewards, and narrative structure.
 */

/**
 * Quest types
 */
export type QuestType =
  | "NIGHTMARE_BOUNTY"      // Hunt and cleanse Nightmares
  | "BRANCH_STABILIZATION"   // Protect and stabilize branches
  | "SEED_ESCORT"           // Safely transport a seed
  | "REALM_EXPLORATION"     // Explore new regions
  | "FACTION_MISSION";      // Complete a faction-specific task

/**
 * Quest requirements
 */
export interface QuestRequirements {
  /** Minimum level required */
  minLevel?: number;
  /** Required faction (if any) */
  factionId?: string;
  /** Required regions to have visited */
  requiredRegions?: string[];
  /** Required seeds to have rooted */
  requiredSeeds?: string[];
}

/**
 * Quest rewards
 */
export interface QuestRewards {
  /** Experience points */
  experience?: number;
  /** Dream tokens */
  dreamTokens?: number;
  /** SHEEP tokens */
  sheepTokens?: number;
  /** Unlock new regions */
  unlockRegions?: string[];
  /** Grant new seeds */
  grantSeeds?: string[];
}

/**
 * A quest in DreamNet
 */
export interface Quest {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Rich description */
  description: string;
  /** Quest type */
  type: QuestType;
  /** Requirements to accept */
  requirements: QuestRequirements;
  /** Rewards for completion */
  rewards: QuestRewards;
}

/**
 * Quest Registry
 */
export class QuestRegistry {
  private quests: Map<string, Quest> = new Map();

  /**
   * Register a quest
   */
  register(quest: Quest): void {
    this.quests.set(quest.id, quest);
  }

  /**
   * Get a quest by ID
   */
  get(id: string): Quest | undefined {
    return this.quests.get(id);
  }

  /**
   * Get all quests
   */
  getAll(): Quest[] {
    return Array.from(this.quests.values());
  }

  /**
   * Get quests by type
   */
  getByType(type: QuestType): Quest[] {
    return Array.from(this.quests.values()).filter(q => q.type === type);
  }

  /**
   * Get available quests for a dreamer
   */
  getAvailableForDreamer(
    level: number,
    factionId: string,
    knownRegions: string[],
    rootedSeeds: string[]
  ): Quest[] {
    return Array.from(this.quests.values()).filter(quest => {
      const req = quest.requirements;
      if (req.minLevel && level < req.minLevel) return false;
      if (req.factionId && factionId !== req.factionId) return false;
      if (req.requiredRegions) {
        const hasAllRegions = req.requiredRegions.every(r => knownRegions.includes(r));
        if (!hasAllRegions) return false;
      }
      if (req.requiredSeeds) {
        const hasAllSeeds = req.requiredSeeds.every(s => rootedSeeds.includes(s));
        if (!hasAllSeeds) return false;
      }
      return true;
    });
  }
}

/**
 * Global Quest Registry instance
 */
export const questRegistry = new QuestRegistry();

// Initialize with sample quests
questRegistry.register({
  id: "quest.nightmare.cleanse-basic",
  name: "Cleanse Basic Nightmare",
  description: "A basic Nightmare has been spotted in the Code Graveyard. Hunt it down and cleanse it before it spreads corruption.",
  type: "NIGHTMARE_BOUNTY",
  requirements: {
    minLevel: 1
  },
  rewards: {
    experience: 10,
    dreamTokens: 5,
    unlockRegions: ["underlayer.codeGraveyard"]
  }
});

questRegistry.register({
  id: "quest.branch.stabilize-first-tree",
  name: "Stabilize First Tree Branch",
  description: "A branch of the First Tree is unstable. Protect it from Nightmares and ensure it grows strong.",
  type: "BRANCH_STABILIZATION",
  requirements: {
    minLevel: 3,
    requiredRegions: ["tree.firstTree"]
  },
  rewards: {
    experience: 25,
    dreamTokens: 15,
    sheepTokens: 5
  }
});

questRegistry.register({
  id: "quest.seed.escort-prototype",
  name: "Escort Prototype Tool Seed",
  description: "Safely transport a Prototype Tool Seed from the Underlayer to the First Tree. Avoid Nightmares along the way.",
  type: "SEED_ESCORT",
  requirements: {
    minLevel: 2,
    requiredRegions: ["underlayer.kernelPit"]
  },
  rewards: {
    experience: 20,
    dreamTokens: 10,
    grantSeeds: ["seed.prototype.tool"]
  }
});

questRegistry.register({
  id: "quest.exploration.cyber-plane",
  name: "Explore Cyber Plane",
  description: "Venture into the Cyber Plane and discover its secrets. Map the Base Currents and ETH Diamond Stars.",
  type: "REALM_EXPLORATION",
  requirements: {
    minLevel: 2
  },
  rewards: {
    experience: 15,
    unlockRegions: ["cyber.baseCurrents", "cyber.ethDiamonds"]
  }
});

questRegistry.register({
  id: "quest.faction.knight-initiation",
  name: "Dream Knight Initiation",
  description: "Prove your worth as a Dream Knight by cleansing three Nightmares. This is your initiation into the order.",
  type: "FACTION_MISSION",
  requirements: {
    minLevel: 5,
    factionId: "DREAM_KNIGHTS"
  },
  rewards: {
    experience: 50,
    dreamTokens: 30,
    sheepTokens: 10
  }
});

