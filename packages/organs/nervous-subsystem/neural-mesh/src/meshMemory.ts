import type { MemoryTrace } from './meshTypes.js';
// Pheromone store integration (optional - will fail gracefully if not available)
let depositPheromone: ((path: string, success: boolean, strength: number) => void) | null = null;
let buildPath: ((context: any) => string) | null = null;

// Lazy load pheromone store
async function loadPheromoneStore() {
  if (depositPheromone && buildPath) return; // Already loaded

  try {
    // Dynamic import with type casting to avoid circular dependency loop during build
    // @ts-ignore
    const haloLoop = await import("@dreamnet/halo-loop");
    const { depositPheromone: deposit, buildPath: build } = haloLoop;
    depositPheromone = deposit;
    buildPath = build;
  } catch {
    // Pheromone store not available - continue without it
  }
}

const memoryTraces: MemoryTrace[] = [];
const MAX_TRACES = 10000; // Prevent unbounded growth
const DECAY_RATE = 0.001; // Per day

/**
 * Store "memory traces" (long-term learning signals)
 * Integrate with pheromone store when beneficial
 * Provide retrieval + decay mechanism
 */
export const meshMemory = {
  /**
   * Store a memory trace
   */
  store(trace: any): void {
    const memoryTrace: MemoryTrace = {
      trace,
      timestamp: Date.now(),
      decay: 1.0, // Full strength initially
      tags: trace.tags || [],
    };

    memoryTraces.push(memoryTrace);

    // Integrate with pheromone store if trace contains routing info
    if (trace.path && trace.success !== undefined) {
      (async () => {
        try {
          await loadPheromoneStore();
          if (depositPheromone && buildPath) {
            const path = typeof trace.path === "string"
              ? trace.path
              : buildPath(trace.path);
            depositPheromone(path, trace.success, trace.strength || 0.1);
          }
        } catch {
          // Pheromone store might not be available
        }
      })();
    }

    // Prune old traces if over limit
    if (memoryTraces.length > MAX_TRACES) {
      // Remove oldest 10%
      const toRemove = Math.floor(MAX_TRACES * 0.1);
      memoryTraces.splice(0, toRemove);
    }
  },

  /**
   * Retrieve memory traces matching criteria
   */
  retrieve(options: {
    tags?: string[];
    since?: number;
    limit?: number;
  } = {}): MemoryTrace[] {
    let results = memoryTraces;

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter((trace) =>
        options.tags!.some((tag) => trace.tags?.includes(tag))
      );
    }

    // Filter by timestamp
    if (options.since) {
      results = results.filter((trace) => trace.timestamp >= options.since!);
    }

    // Apply decay
    const now = Date.now();
    results = results.map((trace) => {
      const ageDays = (now - trace.timestamp) / (1000 * 60 * 60 * 24);
      const decayed = (trace.decay || 1.0) * Math.exp(-DECAY_RATE * ageDays);
      return { ...trace, decay: decayed };
    });

    // Sort by decay (strongest first)
    results.sort((a, b) => (b.decay || 0) - (a.decay || 0));

    // Limit results
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  },

  /**
   * Get memory status
   */
  status(): { count: number; last?: MemoryTrace; oldest?: MemoryTrace } {
    return {
      count: memoryTraces.length,
      last: memoryTraces[memoryTraces.length - 1],
      oldest: memoryTraces[0],
    };
  },

  /**
   * Clear old traces (manual cleanup)
   */
  clearOld(olderThanDays: number = 30): number {
    const cutoff = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
    const initialLength = memoryTraces.length;

    // Remove traces older than cutoff
    for (let i = memoryTraces.length - 1; i >= 0; i--) {
      if (memoryTraces[i].timestamp < cutoff) {
        memoryTraces.splice(i, 1);
      }
    }

    return initialLength - memoryTraces.length;
  },
};

