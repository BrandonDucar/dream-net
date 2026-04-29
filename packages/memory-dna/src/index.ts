export type { EntityType, MemoryRecord, Trait, ResonanceInsight } from "./types";
export {
  updateTraitsFromEvent,
  updateTraitsFromTaskResult,
  deriveChildMemory,
  listAllRecords,
} from "./dnaEngine";
export { computeResonanceSnapshot, saveResonanceInsights, getRecentInsights } from "./resonanceEngine";
export { getMemoryRecord, listMemoryRecords } from "./dnaStore";

/**
 * Librarian Check stub - determines if an event should be persisted to long-term memory.
 */
export function runLibrarianCheck(eventType: string, payload: any): boolean {
  // Prototype: Accept everything except very high-frequency noise
  if (eventType === "system.ping") return false;
  return true;
}

