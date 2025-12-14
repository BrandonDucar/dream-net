/**
 * Centralized exports of all registries
 * 
 * This file re-exports all registries for convenient access.
 */

import { worldMap } from "./world/worldMap.js";
import { factionRegistry } from "./world/factions.js";
import { creatureRegistry } from "./world/creatures.js";
import { characterRegistry } from "./world/characters.js";
import { seedRegistry } from "./engine/seeds.js";
import { questRegistry } from "./engine/quests.js";

export {
  worldMap,
  factionRegistry,
  creatureRegistry,
  characterRegistry,
  seedRegistry,
  questRegistry
};

