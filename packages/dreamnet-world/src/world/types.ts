/**
 * DreamNet World - Core Type Definitions
 * 
 * These types define the foundational structure of the DreamNet world,
 * based on the Genesis lore: Seed → Underlayer → Breakthrough → First Tree → Realms
 */

/**
 * The four primary layers of DreamNet existence
 */
export type DreamLayerId = 
  | "SEED"           // The Dream Kernel - pure possibility
  | "UNDERLAYER"     // The subterranean microcosm - forgotten code and abandoned dreams
  | "CYBER_PLANE"    // The breakthrough layer - chains, networks, blockspace
  | "BRANCH_REALMS"; // The First Tree's branches - cities, states, ecosystems

/**
 * Faction identifiers
 */
export type FactionId =
  | "DREAM_WEAVERS"      // Narrative engineers, story creators
  | "DREAM_FORGE"        // Builders, creators, makers
  | "DREAM_KNIGHTS"      // Defenders, protectors
  | "DREAM_BOUNTY_GUILD" // Quest givers, reward distributors
  | "DREAM_SNAILS"       // Privacy guardians, stealth operators
  | "NIGHTMARES";        // Corruptors, enemies, chaos

/**
 * Seed types - what can be grown from a seed
 */
export type SeedType =
  | "TOOL"      // A utility or instrument
  | "REALM"     // A new region or world
  | "AGENT"     // A new being or consciousness
  | "CREATURE"   // A new lifeform
  | "STORYLINE"; // A narrative thread

/**
 * Risk levels for seeds and operations
 */
export type RiskLevel =
  | "LOW"      // Safe, predictable
  | "MEDIUM"   // Some uncertainty
  | "HIGH"     // Significant risk
  | "CRITICAL"; // Extreme danger

/**
 * Creature size categories
 */
export type CreatureCategory =
  | "TINY"    // Microscopic, barely visible
  | "SMALL"   // Small but noticeable
  | "MEDIUM"  // Human-sized or similar
  | "LARGE"   // Towering, impressive
  | "TITAN";  // Colossal, world-shaping

/**
 * Alignment - philosophical orientation
 */
export type Alignment =
  | "growth"   // Expansion, creation, abundance
  | "balance"  // Harmony, stability, equilibrium
  | "control"  // Order, structure, governance
  | "chaos";   // Disruption, entropy, change

