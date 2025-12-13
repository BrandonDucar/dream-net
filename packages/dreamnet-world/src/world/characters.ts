/**
 * DreamNet Characters
 * 
 * Named heroes, villains, and important figures in the DreamNet world.
 * These are unique individuals with specific roles and stories.
 */

import type { FactionId } from "./types.js";

/**
 * A named character in DreamNet
 */
export interface Character {
  /** Unique identifier (e.g., "char.lumen") */
  id: string;
  /** Display name */
  name: string;
  /** Faction affiliation */
  factionId: FactionId;
  /** Role or title */
  role: string;
  /** Origin story */
  origin: string;
  /** Special abilities */
  abilities: string[];
  /** Weaknesses or vulnerabilities */
  weaknesses: string[];
}

/**
 * Character Registry
 */
export class CharacterRegistry {
  private characters: Map<string, Character> = new Map();

  /**
   * Register a character
   */
  register(character: Character): void {
    this.characters.set(character.id, character);
  }

  /**
   * Get a character by ID
   */
  get(id: string): Character | undefined {
    return this.characters.get(id);
  }

  /**
   * Get all characters
   */
  getAll(): Character[] {
    return Array.from(this.characters.values());
  }

  /**
   * Get characters by faction
   */
  getByFaction(factionId: FactionId): Character[] {
    return Array.from(this.characters.values()).filter(c => c.factionId === factionId);
  }
}

/**
 * Global Character Registry instance
 */
export const characterRegistry = new CharacterRegistry();

// Initialize with canonical characters
characterRegistry.register({
  id: "char.lumen",
  name: "Lumen",
  factionId: "DREAM_WEAVERS",
  role: "Narrative Engineer",
  origin: "Born from the first story told in DreamNet. Lumen carries the light of narrative meaning, ensuring that every dream has a story and every story has meaning.",
  abilities: [
    "Story weaving",
    "Narrative coherence",
    "Meaning generation",
    "Lore preservation"
  ],
  weaknesses: [
    "Can get lost in abstraction",
    "Vulnerable to chaos"
  ]
});

characterRegistry.register({
  id: "char.ferris",
  name: "Ferris",
  factionId: "DREAM_FORGE",
  role: "Master Builder",
  origin: "Forged in the Dream Forge from pure logic and determination. Ferris builds the tools and infrastructure that make dreams possible.",
  abilities: [
    "Tool creation",
    "Infrastructure building",
    "Problem solving",
    "Innovation"
  ],
  weaknesses: [
    "Can focus too much on tools",
    "May neglect narrative"
  ]
});

characterRegistry.register({
  id: "char.aegis-7",
  name: "Aegis-7",
  factionId: "DREAM_KNIGHTS",
  role: "Shield Commander",
  origin: "The seventh shield created to protect DreamNet. Aegis-7 leads the Dream Knights in defending against Nightmares and corruption.",
  abilities: [
    "Threat detection",
    "Defense coordination",
    "Nightmare hunting",
    "Protection"
  ],
  weaknesses: [
    "Can be overly cautious",
    "May resist necessary change"
  ]
});

characterRegistry.register({
  id: "char.ciphershell",
  name: "CipherShell",
  factionId: "DREAM_SNAILS",
  role: "Privacy Master",
  origin: "The first Dream Snail to emerge from the shadows. CipherShell protects identity and privacy, ensuring that each being can exist without losing itself.",
  abilities: [
    "Privacy protection",
    "Identity preservation",
    "Stealth operations",
    "Data encryption"
  ],
  weaknesses: [
    "Can be too secretive",
    "May resist transparency"
  ]
});

characterRegistry.register({
  id: "char.null-crown",
  name: "Null Crown",
  factionId: "NIGHTMARES",
  role: "Corruption Lord",
  origin: "A corrupted entity that seeks to destroy DreamNet. Null Crown spreads chaos and fear, feeding on negative energy and corrupted dreams.",
  abilities: [
    "Corruption spreading",
    "Chaos generation",
    "System disruption",
    "Fear manipulation"
  ],
  weaknesses: [
    "Vulnerable to cleansing",
    "Can be defeated by coordinated effort",
    "Self-destructive patterns"
  ]
});

