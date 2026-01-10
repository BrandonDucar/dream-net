// 🐙 OCTOPUS SENTINEL: The Librarian
// Filters incoming memories.
export function runLibrarianCheck(content, metadata) {
    if (!content || content.length < 5)
        return false;
    if (metadata?.spam === true)
        return false;
    return true;
}
export { updateTraitsFromEvent, updateTraitsFromTaskResult, deriveChildMemory, listAllRecords, logSystemMemory, } from './dnaEngine.js';
export { computeResonanceSnapshot, saveResonanceInsights, getRecentInsights } from './resonanceEngine.js';
export { getMemoryRecord, listMemoryRecords } from './dnaStore.js';
export * from './store/VectorStore.js';
export * from './logic/remSleep.js';
export * from './logic/honeycomb.js';
export * from './logic/pulsar.js';
export * from './systems/TriuneMemory.js';
export * from './systems/EpigeneticMemory.js';
export * from './systems/LimbicSystem.js';
export { createDnaRouter } from './router.js';
