/**
 * Ant Colony Logic
 * Decentralized webhook routing with pheromone trails
 */
import type { PheromoneTrail, WebhookAnt } from "../types";
/**
 * Create a pheromone trail (webhook path)
 */
export declare function createPheromoneTrail(path: string[], successRate?: number, latency?: number): PheromoneTrail;
/**
 * Create an ant (webhook request)
 */
export declare function createAnt(requestId: string, payload: any, destination: string): WebhookAnt;
/**
 * Find best pheromone trail to destination
 */
export declare function findBestTrail(destination: string): PheromoneTrail | null;
/**
 * Follow pheromone trail
 */
export declare function followTrail(antId: string, trailId: string): boolean;
/**
 * Complete ant journey
 */
export declare function completeAnt(antId: string, success: boolean, latency: number): void;
/**
 * Evaporate pheromone trails (decay over time)
 */
export declare function evaporateTrails(): void;
/**
 * Get all pheromone trails
 */
export declare function getPheromoneTrails(): PheromoneTrail[];
/**
 * Get all active ants
 */
export declare function getActiveAnts(): WebhookAnt[];
/**
 * Get stuck ants (timeout)
 */
export declare function getStuckAnts(timeoutMs?: number): WebhookAnt[];
/**
 * Mark ant as stuck
 */
export declare function markAntStuck(antId: string): void;
