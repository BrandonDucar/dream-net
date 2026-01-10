export interface PheromoneTrail {
    path: string;
    strength: number;
    types: {
        HONEY: number;
        SLIME: number;
        HEAT: number;
        PULSE: number;
    };
    successCount: number;
    failureCount: number;
    lastSuccess: string;
    lastFailure: string;
    avgLatency: number;
    rewardDensity: number;
    currentLoad: number;
    createdAt: string;
    updatedAt: string;
}
/**
 * Deposit pheromone on a successful path
 */
export declare function depositPheromone(path: string, success?: boolean, strength?: number, metadata?: {
    latency?: number;
    reward?: number;
    loadDelta?: number;
}): void;
/**
 * Get pheromone strength for a path
 */
export declare function getPheromoneStrength(path: string): number;
/**
 * Get full pheromone trail for a path
 */
export declare function getPheromoneTrail(path: string): PheromoneTrail | undefined;
/**
 * Get top N paths by strength
 */
export declare function getTopPaths(limit?: number): PheromoneTrail[];
/**
 * Evaporate pheromones (nightly job)
 */
export declare function evaporatePheromones(): number;
/**
 * Build path string from context
 */
export declare function buildPath(context: {
    time?: string;
    region?: string;
    provider?: string;
    agent?: string;
    endpoint?: string;
}): string;
//# sourceMappingURL=pheromoneStore.d.ts.map