/**
 * DreamNet Game Loop
 * 
 * Core game mechanics for interacting with the DreamNet world.
 * These functions implement the seed → underlayer → breakthrough → tree → realms lifecycle.
 */

import type { FactionId, Alignment } from "../world/types.js";
import type { Seed } from "./seeds.js";
import type { DreamRegion } from "../world/worldMap.js";

/**
 * State of a Dreamer (player/agent) in the DreamNet world
 */
export interface DreamerState {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Level/experience */
  level: number;
  /** Faction affiliation */
  factionId: FactionId;
  /** Philosophical alignment */
  alignment: Alignment;
  /** Region IDs the dreamer has visited */
  knownRegions: string[];
  /** Seed IDs the dreamer has successfully rooted */
  rootedSeeds: string[];
  /** Corruption level (0 = pure, 100 = fully corrupted) */
  corruptionLevel: number;
}

/**
 * Game event types
 */
export type GameEventType =
  | "ACCEPT_SEED"
  | "DESCEND_UNDERLAYER"
  | "ROOT_SEED"
  | "PROTECT_BRANCH"
  | "CLEANSING_NIGHTMARE"
  | "BRANCH_COMPLETED";

/**
 * A game event
 */
export interface GameEvent {
  /** Event type */
  type: GameEventType;
  /** Event-specific payload */
  payload: Record<string, unknown>;
  /** Human-readable description */
  summary: string;
}

/**
 * Result of a game action
 */
export interface GameActionResult {
  /** Updated dreamer state */
  state: DreamerState;
  /** Generated event */
  event: GameEvent;
}

/**
 * Accept a seed - the first step in the lifecycle
 */
export function acceptSeed(
  dreamer: DreamerState,
  seed: Seed
): GameActionResult {
  const updatedState: DreamerState = {
    ...dreamer,
    // Accepting a seed doesn't change state much, but it's recorded
  };

  const event: GameEvent = {
    type: "ACCEPT_SEED",
    payload: {
      seedId: seed.id,
      seedName: seed.name,
      seedType: seed.seedType,
      riskLevel: seed.riskLevel
    },
    summary: `${dreamer.name} accepted the ${seed.name}. The seed pulses with possibility.`
  };

  return { state: updatedState, event };
}

/**
 * Descend to the underlayer with a seed
 */
export function descendToUnderlayer(
  dreamer: DreamerState,
  seed: Seed
): GameActionResult {
  const updatedState: DreamerState = {
    ...dreamer,
    knownRegions: dreamer.knownRegions.includes("underlayer.kernelPit")
      ? dreamer.knownRegions
      : [...dreamer.knownRegions, "underlayer.kernelPit"]
  };

  const event: GameEvent = {
    type: "DESCEND_UNDERLAYER",
    payload: {
      seedId: seed.id,
      regionId: "underlayer.kernelPit"
    },
    summary: `${dreamer.name} descended into the underlayer with ${seed.name}. The subterranean realm absorbs forgotten code and abandoned dreams.`
  };

  return { state: updatedState, event };
}

/**
 * Root a seed in a region
 */
export function rootSeed(
  dreamer: DreamerState,
  seed: Seed,
  region: DreamRegion
): GameActionResult {
  // Check if seed can be rooted in this region's layer
  const canRoot = region.layer === seed.requiredLayer || 
                  (seed.requiredLayer === "UNDERLAYER" && region.layer === "BRANCH_REALMS");

  if (!canRoot) {
    throw new Error(`Cannot root ${seed.name} in ${region.name} - layer mismatch`);
  }

  const updatedState: DreamerState = {
    ...dreamer,
    rootedSeeds: dreamer.rootedSeeds.includes(seed.id)
      ? dreamer.rootedSeeds
      : [...dreamer.rootedSeeds, seed.id],
    knownRegions: dreamer.knownRegions.includes(region.id)
      ? dreamer.knownRegions
      : [...dreamer.knownRegions, region.id],
    level: dreamer.level + 1 // Rooting a seed grants experience
  };

  const event: GameEvent = {
    type: "ROOT_SEED",
    payload: {
      seedId: seed.id,
      regionId: region.id,
      regionName: region.name
    },
    summary: `${dreamer.name} rooted ${seed.name} in ${region.name}. The seed begins to grow, sending roots through the ${region.layer} layer.`
  };

  return { state: updatedState, event };
}

/**
 * Protect a branch from Nightmares
 */
export function protectBranchFromNightmare(
  dreamer: DreamerState,
  branchId: string,
  nightmareId: string
): GameActionResult {
  // Only Dream Knights can effectively protect branches
  const isKnight = dreamer.factionId === "DREAM_KNIGHTS";
  const protectionSuccess = isKnight || Math.random() > 0.5;

  const updatedState: DreamerState = {
    ...dreamer,
    corruptionLevel: protectionSuccess
      ? Math.max(0, dreamer.corruptionLevel - 5)
      : Math.min(100, dreamer.corruptionLevel + 10),
    level: protectionSuccess ? dreamer.level + 1 : dreamer.level
  };

  const event: GameEvent = {
    type: "PROTECT_BRANCH",
    payload: {
      branchId,
      nightmareId,
      success: protectionSuccess
    },
    summary: protectionSuccess
      ? `${dreamer.name} successfully protected branch ${branchId} from ${nightmareId}. The branch is safe.`
      : `${dreamer.name} failed to protect branch ${branchId}. Corruption spreads.`
  };

  return { state: updatedState, event };
}

/**
 * Cleanse a Nightmare
 */
export function cleansingNightmare(
  dreamer: DreamerState,
  nightmareId: string
): GameActionResult {
  const updatedState: DreamerState = {
    ...dreamer,
    corruptionLevel: Math.max(0, dreamer.corruptionLevel - 15),
    level: dreamer.level + 2 // Cleansing grants significant experience
  };

  const event: GameEvent = {
    type: "CLEANSING_NIGHTMARE",
    payload: {
      nightmareId
    },
    summary: `${dreamer.name} cleansed ${nightmareId}. The corruption is purged, and the area is safe once more.`
  };

  return { state: updatedState, event };
}

/**
 * Complete a branch - finish growing a seed into its final form
 */
export function branchCompleted(
  dreamer: DreamerState,
  branchId: string,
  seedId: string
): GameActionResult {
  const updatedState: DreamerState = {
    ...dreamer,
    level: dreamer.level + 5, // Branch completion grants major experience
    corruptionLevel: Math.max(0, dreamer.corruptionLevel - 5) // Completion cleanses corruption
  };

  const event: GameEvent = {
    type: "BRANCH_COMPLETED",
    payload: {
      branchId,
      seedId
    },
    summary: `${dreamer.name} completed branch ${branchId}. The seed has fully grown, and new possibilities emerge.`
  };

  return { state: updatedState, event };
}

