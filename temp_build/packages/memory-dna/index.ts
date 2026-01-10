export type { EntityType, MemoryRecord, Trait, ResonanceInsight } from "./types";
// 🐙 OCTOPUS SENTINEL: The Librarian
// Filters incoming memories.
export function runLibrarianCheck(content: string, metadata: any): boolean {
  if (!content || content.length < 5) return false;
  if (metadata?.spam === true) return false;
  return true;
}

export {
  updateTraitsFromEvent,
  updateTraitsFromTaskResult,
  deriveChildMemory,
  listAllRecords,
} from "./dnaEngine";
export { computeResonanceSnapshot, saveResonanceInsights, getRecentInsights } from "./resonanceEngine";
export { getMemoryRecord, listMemoryRecords } from "./dnaStore";
export * from "./store/VectorStore";
export * from "./logic/remSleep";
export * from "./logic/honeycomb";
export * from "./logic/pulsar";
