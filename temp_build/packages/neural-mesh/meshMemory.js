"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.meshMemory = void 0;
// Pheromone store integration (optional - will fail gracefully if not available)
let depositPheromone = null;
let buildPath = null;
// Lazy load pheromone store
async function loadPheromoneStore() {
    if (depositPheromone && buildPath)
        return; // Already loaded
    try {
        const pheromoneModule = await Promise.resolve().then(() => __importStar(require("@dreamnet/halo-loop/stores/pheromoneStore")));
        depositPheromone = pheromoneModule.depositPheromone;
        buildPath = pheromoneModule.buildPath;
    }
    catch {
        // Pheromone store not available - continue without it
    }
}
const memoryTraces = [];
const MAX_TRACES = 10000; // Prevent unbounded growth
const DECAY_RATE = 0.001; // Per day
/**
 * Store "memory traces" (long-term learning signals)
 * Integrate with pheromone store when beneficial
 * Provide retrieval + decay mechanism
 */
exports.meshMemory = {
    /**
     * Store a memory trace
     */
    store(trace) {
        const memoryTrace = {
            trace,
            timestamp: Date.now(),
            decay: 1.0, // Full strength initially
            tags: trace.tags || [],
        };
        memoryTraces.push(memoryTrace);
        // Integrate with pheromone store if trace contains routing info
        if (trace.path && trace.success !== undefined) {
            loadPheromoneStore().then(() => {
                if (depositPheromone && buildPath) {
                    try {
                        const path = typeof trace.path === "string"
                            ? trace.path
                            : buildPath(trace.path);
                        depositPheromone(path, trace.success, trace.strength || 0.1);
                    }
                    catch {
                        // Pheromone store might not be available
                    }
                }
            }).catch(() => {
                // Ignore errors
            });
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
    retrieve(options = {}) {
        let results = memoryTraces;
        // Filter by tags
        if (options.tags && options.tags.length > 0) {
            results = results.filter((trace) => options.tags.some((tag) => trace.tags?.includes(tag)));
        }
        // Filter by timestamp
        if (options.since) {
            results = results.filter((trace) => trace.timestamp >= options.since);
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
    status() {
        return {
            count: memoryTraces.length,
            last: memoryTraces[memoryTraces.length - 1],
            oldest: memoryTraces[0],
        };
    },
    /**
     * Clear old traces (manual cleanup)
     */
    clearOld(olderThanDays = 30) {
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
