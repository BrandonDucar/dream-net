# @dreamnet/dreamnet-world

**DreamNet World Model - Codified Mythology & Game Mechanics**

This package codifies the DreamNet Genesis mythology into structured, queryable code. It provides the foundation for games, NFTs, content generation, and worldbuilding.

## Overview

DreamNet didn't begin as tech—it began as life. A seed. A root. A breakthrough. A tree. A world. A dream.

This package makes that mythology actionable by providing:

- **World Map**: Regions, layers, and connections (Seed → Underlayer → Cyber Plane → Branch Realms)
- **Factions**: DreamWeavers, DreamForge, DreamKnights, DreamBountyGuild, DreamSnails, Nightmares
- **Creatures**: Dreamlings, Baseborn, Etherials, Nightmares
- **Characters**: Lumen, Ferris, Aegis-7, CipherShell, Null Crown
- **Seeds**: Seed types and lifecycle (TOOL, REALM, AGENT, CREATURE, STORYLINE)
- **Game Loop**: Core mechanics (acceptSeed, descendToUnderlayer, rootSeed, protectBranch, etc.)
- **Quests**: Structured objectives (Nightmare Bounties, Branch Stabilization, Seed Escort)

## Installation

```bash
pnpm add @dreamnet/dreamnet-world
```

## Usage

### World Map

```typescript
import { worldMap } from "@dreamnet/dreamnet-world";

// Get a region
const kernelPit = worldMap.get("underlayer.kernelPit");

// Get all regions in a layer
const underlayerRegions = worldMap.getByLayer("UNDERLAYER");

// Get connected regions
const connected = worldMap.getConnected("seed.dreamKernel");
```

### Factions

```typescript
import { factionRegistry } from "@dreamnet/dreamnet-world";

// Get a faction
const dreamWeavers = factionRegistry.get("DREAM_WEAVERS");

// Get all factions
const allFactions = factionRegistry.getAll();

// Get factions by alignment
const growthFactions = factionRegistry.getByAlignment("growth");
```

### Creatures

```typescript
import { creatureRegistry } from "@dreamnet/dreamnet-world";

// Get a creature
const dreamling = creatureRegistry.get("creature.dreamling.basic");

// Get creatures by category
const titans = creatureRegistry.getByCategory("TITAN");

// Get creatures native to a region
const underlayerCreatures = creatureRegistry.getByRegion("underlayer.kernelPit");
```

### Characters

```typescript
import { characterRegistry } from "@dreamnet/dreamnet-world";

// Get a character
const lumen = characterRegistry.get("char.lumen");

// Get characters by faction
const dreamWeavers = characterRegistry.getByFaction("DREAM_WEAVERS");
```

### Seeds

```typescript
import { seedRegistry } from "@dreamnet/dreamnet-world";

// Get a seed
const prototypeSeed = seedRegistry.get("seed.prototype.tool");

// Get seeds by type
const toolSeeds = seedRegistry.getByType("TOOL");

// Get seeds by required layer
const underlayerSeeds = seedRegistry.getByLayer("UNDERLAYER");
```

### Game Loop

```typescript
import {
  acceptSeed,
  descendToUnderlayer,
  rootSeed,
  protectBranchFromNightmare,
  cleansingNightmare,
  branchCompleted
} from "@dreamnet/dreamnet-world";

// Accept a seed
const result1 = acceptSeed(dreamer, seed);
// Returns: { state: DreamerState, event: GameEvent }

// Descend to underlayer
const result2 = descendToUnderlayer(dreamer, seed);

// Root a seed
const result3 = rootSeed(dreamer, seed, region);

// Protect a branch
const result4 = protectBranchFromNightmare(dreamer, branchId, nightmareId);

// Cleanse a Nightmare
const result5 = cleansingNightmare(dreamer, nightmareId);

// Complete a branch
const result6 = branchCompleted(dreamer, branchId, seedId);
```

### Quests

```typescript
import { questRegistry } from "@dreamnet/dreamnet-world";

// Get a quest
const nightmareQuest = questRegistry.get("quest.nightmare.cleanse-basic");

// Get available quests for a dreamer
const availableQuests = questRegistry.getAvailableForDreamer(
  dreamer.level,
  dreamer.factionId,
  dreamer.knownRegions,
  dreamer.rootedSeeds
);

// Get quests by type
const bountyQuests = questRegistry.getByType("NIGHTMARE_BOUNTY");
```

## Structure

```
packages/dreamnet-world/
├── src/
│   ├── lore/
│   │   └── dreamnet-genesis.md    # Complete Genesis lore
│   ├── world/
│   │   ├── types.ts               # Core type definitions
│   │   ├── worldMap.ts            # World map and regions
│   │   ├── factions.ts            # Faction registry
│   │   ├── creatures.ts           # Creature registry
│   │   └── characters.ts          # Character registry
│   ├── engine/
│   │   ├── seeds.ts               # Seed registry and lifecycle
│   │   ├── gameLoop.ts            # Core game mechanics
│   │   └── quests.ts              # Quest system
│   └── index.ts                   # Main exports
└── README.md
```

## Genesis Lore

The complete Genesis lore is available in `src/lore/dreamnet-genesis.md`. It tells the story of:

1. **The Seed** - The Dream Kernel, pure possibility
2. **The Microcosm** - The Underlayer, forgotten code and abandoned dreams
3. **The Breakthrough** - The emergence into the Cyber Plane
4. **The First Tree** - The DreamNet Connectivity Tree
5. **The City, the World, the Realms** - DreamNet expansion
6. **The Eternal Truth** - DreamNet began as life, not tech

## Use Cases

- **Games**: Use the game loop and quest system to build interactive experiences
- **NFTs**: Reference canonical world elements (regions, factions, creatures, characters)
- **Content Generation**: AI agents can use world data for consistent narratives
- **Frontends**: Visualize the DreamNet Connectivity Tree and world map
- **Onchain Logic**: Seeds, branches, and bounties as smart contract concepts

## Type Safety

All types are exported and can be imported:

```typescript
import type {
  DreamLayerId,
  FactionId,
  SeedType,
  RiskLevel,
  CreatureCategory,
  Alignment,
  DreamRegion,
  Faction,
  Creature,
  Character,
  Seed,
  DreamerState,
  GameEvent,
  Quest
} from "@dreamnet/dreamnet-world";
```

## License

MIT

## Version

1.0.0

