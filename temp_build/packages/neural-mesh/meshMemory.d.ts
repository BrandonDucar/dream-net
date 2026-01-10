import type { MemoryTrace } from "./types";
/**
 * Store "memory traces" (long-term learning signals)
 * Integrate with pheromone store when beneficial
 * Provide retrieval + decay mechanism
 */
export declare const meshMemory: {
    /**
     * Store a memory trace
     */
    store(trace: any): void;
    /**
     * Retrieve memory traces matching criteria
     */
    retrieve(options?: {
        tags?: string[];
        since?: number;
        limit?: number;
    }): MemoryTrace[];
    /**
     * Get memory status
     */
    status(): {
        count: number;
        last?: MemoryTrace;
        oldest?: MemoryTrace;
    };
    /**
     * Clear old traces (manual cleanup)
     */
    clearOld(olderThanDays?: number): number;
};
