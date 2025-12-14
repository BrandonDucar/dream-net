/**
 * DreamNet World Package
 * 
 * Codifies the DreamNet Genesis mythology into structured, queryable code.
 * Provides world data, game mechanics, and lore for games, NFTs, content generation, and worldbuilding.
 * 
 * @package @dreamnet/dreamnet-world
 * @version 1.0.0
 */

// Types
export * from "./world/types.js";

// World Data
export * from "./world/worldMap.js";
export * from "./world/factions.js";
export * from "./world/creatures.js";
export * from "./world/characters.js";

// Engine
export * from "./engine/seeds.js";
export * from "./engine/gameLoop.js";
export * from "./engine/quests.js";

// Re-export registries for convenience
export {
  worldMap,
  factionRegistry,
  creatureRegistry,
  characterRegistry,
  seedRegistry,
  questRegistry
} from "./exports.js";

