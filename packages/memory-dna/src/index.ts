export type { EntityType, MemoryRecord, Trait, ResonanceInsight } from "./types.js";
export {
  updateTraitsFromEvent,
  updateTraitsFromTaskResult,
  deriveChildMemory,
  listAllRecords,
} from "./dnaEngine.js";
export { computeResonanceSnapshot, saveResonanceInsights, getRecentInsights } from "./resonanceEngine.js";
export { getMemoryRecord, listMemoryRecords } from "./dnaStore.js";

/**
 * Librarian Check stub - determines if an event should be persisted to long-term memory.
 */
export function runLibrarianCheck(eventType: string, payload: any): boolean {
  // Prototype: Accept everything except very high-frequency noise
  if (eventType === "system.ping") return false;
  return true;
}

/**
 * Triune Memory System
 * Standardized interface for the 3 tiers of DreamNet memory
 */
export const memorySystem = {
  initialize: async () => {
    console.log("🧠 [MemorySystem] Initializing Triune Memory (Lizard, Mammal, Human)...");
    return true;
  },
  lizard: {
    /**
     * Primitive storage for core architectural patterns and cluster configurations.
     */
    store: async (key: string, data: any, ttl?: number) => {
      // console.log(`🦎 [LizardBrain] Storing ${key} (TTL: ${ttl})...`);
      // Mock implementation
      (memorySystem.lizard as any)._cache = (memorySystem.lizard as any)._cache || new Map();
      (memorySystem.lizard as any)._cache.set(key, data);
    },
    recall: async (key: string) => {
      // console.log(`🦎 [LizardBrain] Recalling ${key}...`);
      return (memorySystem.lizard as any)._cache?.get(key) || null;
    },
    _cache: new Map() as Map<string, any>
  },
  mammal: {
    resonate: async () => {
      console.log("🐎 [MammalBrain] Computing emotional resonance across the swarm...");
    }
  },
  human: {
    plan: async () => {
      console.log("👤 [HumanBrain] Projecting abstract swarm evolution paths...");
    }
  },
  /**
   * Universal memory storage interface
   */
  remember: async (key: string, data: any, context?: string) => {
    // console.log(`🧠 [MemorySystem] Remembering ${key} in context ${context}...`);
    // Fallback: Store in Lizard brain
    await memorySystem.lizard.store(key, { ...data, _context: context });
  }
};

