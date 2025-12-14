# DreamNet Mythology & World Model - For Antigravity

**Complete guide to DreamNet's mythological foundation and world model**

---

## Overview

DreamNet didn't begin as tech—it began as **life**. A seed. A root. A breakthrough. A tree. A world. A dream.

The mythological content is **fully implemented** in `packages/dreamnet-world/` and documented in `DREAMNET_MYTHOLOGY_CODEX.md`.

---

## What Exists

### 1. Genesis Lore (`packages/dreamnet-world/src/lore/dreamnet-genesis.md`)

**The Origin Story:**
1. **The Seed** - The Dream Kernel, pure possibility
2. **The Microcosm** - The Underlayer, forgotten code and abandoned dreams  
3. **The Breakthrough** - The emergence into the Cyber Plane
4. **The First Tree** - The DreamNet Connectivity Tree
5. **The City, the World, the Realms** - DreamNet expansion
6. **The Eternal Truth** - DreamNet began as life, not tech

### 2. World Model (`packages/dreamnet-world/src/world/`)

**World Map** (`worldMap.ts`):
- Regions organized by layers: SEED → UNDERLAYER → CYBER_PLANE → BRANCH_REALMS
- Sample regions: `seed.dreamKernel`, `underlayer.kernelPit`, `cyberPlane.base`, etc.
- Connections between regions

**Factions** (`factions.ts`):
- DreamWeavers (growth, creation)
- DreamForge (building, construction)
- DreamKnights (protection, defense)
- DreamBountyGuild (hunting, rewards)
- DreamSnails (privacy, identity)
- Nightmares (chaos, destruction)

**Creatures** (`creatures.ts`):
- Dreamlings (basic, friendly)
- Baseborn (native to Base chain)
- Etherials (ethereal, magical)
- Nightmares (hostile, dangerous)

**Characters** (`characters.ts`):
- Lumen (light-bringer, guide)
- Ferris (traveler, connector)
- Aegis-7 (guardian, protector)
- CipherShell (privacy, encryption)
- Null Crown (ruler, authority)

### 3. Game Engine (`packages/dreamnet-world/src/engine/`)

**Seeds** (`seeds.ts`):
- Seed types: TOOL, REALM, AGENT, CREATURE, STORYLINE
- Seed lifecycle: dormant → accepted → rooted → branched → completed
- Sample seeds with requirements and rewards

**Game Loop** (`gameLoop.ts`):
- `acceptSeed()` - Accept a seed
- `descendToUnderlayer()` - Descend to underlayer
- `rootSeed()` - Root a seed in a region
- `protectBranchFromNightmare()` - Defend against nightmares
- `cleansingNightmare()` - Cleanse a nightmare
- `branchCompleted()` - Complete a branch

**Quests** (`quests.ts`):
- Nightmare Bounties
- Branch Stabilization
- Seed Escort
- Region Exploration

### 4. Mythology Codex (`DREAMNET_MYTHOLOGY_CODEX.md`)

**Complete symbolic interpretation:**
- Archetype mapping for all subsystems
- The Origin Myth
- The Cosmology (realms, spirits, ether, worlds)
- The Pantheon (tiers, domains, symbols, colors)
- Cycles & Rituals
- Glyphs, Symbols, Marks, Colors & Iconography
- Divine Laws (system invariants)
- Narrative-driven design recommendations

---

## Package Structure

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
├── package.json
└── README.md
```

---

## Usage

### Import World Data

```typescript
import {
  worldMap,
  factionRegistry,
  creatureRegistry,
  characterRegistry,
  seedRegistry,
  questRegistry
} from "@dreamnet/dreamnet-world";

// Get a region
const kernelPit = worldMap.get("underlayer.kernelPit");

// Get a faction
const dreamWeavers = factionRegistry.get("DREAM_WEAVERS");

// Get a creature
const dreamling = creatureRegistry.get("creature.dreamling.basic");

// Get a character
const lumen = characterRegistry.get("char.lumen");

// Get a seed
const prototypeSeed = seedRegistry.get("seed.prototype.tool");

// Get a quest
const nightmareQuest = questRegistry.get("quest.nightmare.cleanse-basic");
```

### Use Game Loop

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

---

## Key Files for Antigravity

1. **`packages/dreamnet-world/src/lore/dreamnet-genesis.md`**
   - Complete origin story
   - The Seed, Underworld, Breakthrough, First Tree

2. **`DREAMNET_MYTHOLOGY_CODEX.md`**
   - Complete mythology codex
   - Archetypes, pantheon, cosmology, divine laws

3. **`packages/dreamnet-world/README.md`**
   - Package documentation
   - Usage examples

4. **`packages/dreamnet-world/src/world/types.ts`**
   - Type definitions
   - DreamLayerId, FactionId, SeedType, etc.

---

## Integration Points

### With DreamNet Systems

The mythology maps to actual DreamNet subsystems:

- **DreamOps** → The Demiurge (Supreme Orchestrator)
- **DreamKeeper** → The Guardian Healer
- **Shield Core** → The Titan Armor
- **DreamSnail** → The Hidden Wanderer
- **DreamVault** → The Eternal Memory Palace
- **StarBridge** → The Breath of the Divine
- **DreamShop** → The Alchemical Bazaar
- **DreamTokens** → Seed Spirits
- **SHEEP Token** → Belief Fuel

### With Game Mechanics

The world model provides:
- **Seeds** → Can become smart contracts, NFTs, or game items
- **Branches** → Can represent deployed dreams or apps
- **Nightmares** → Can represent bugs, threats, or challenges
- **Quests** → Can drive user engagement and rewards
- **Factions** → Can organize users and agents
- **Regions** → Can represent chains, networks, or domains

---

## Status

✅ **COMPLETE** - All mythological content is implemented and documented

**Location:** `packages/dreamnet-world/`

**Documentation:**
- `packages/dreamnet-world/README.md` - Package docs
- `packages/dreamnet-world/src/lore/dreamnet-genesis.md` - Origin story
- `DREAMNET_MYTHOLOGY_CODEX.md` - Complete codex

**Type Safety:** All types exported and TypeScript-safe

**Usage:** Ready for games, NFTs, content generation, and worldbuilding

---

## Next Steps for Antigravity

1. **Review the mythology** - Read `dreamnet-genesis.md` and `DREAMNET_MYTHOLOGY_CODEX.md`
2. **Understand the world model** - Explore `packages/dreamnet-world/src/world/`
3. **Use the game engine** - Implement quests and game loops using `packages/dreamnet-world/src/engine/`
4. **Integrate with systems** - Map mythological concepts to DreamNet subsystems
5. **Build experiences** - Create games, NFTs, or content using the world model

---

**The mythology is complete and ready to use!**

