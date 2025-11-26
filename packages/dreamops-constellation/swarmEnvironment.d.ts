/**
 * Stigmergic Environment
 *
 * Shared environment for indirect agent coordination via shared markers
 * Based on ALife swarm principles (stigmergy)
 */
import type DreamMemory from "./DreamMemory/index.js";
export interface EnvironmentMarker {
    id: string;
    type: "flag" | "tag" | "status" | "pheromone";
    location: string;
    value: any;
    strength: number;
    createdAt: string;
    expiresAt?: string;
    metadata?: Record<string, any>;
}
export interface PheromoneSignal extends EnvironmentMarker {
    type: "pheromone";
    decayRate: number;
    lastDecay: string;
}
export declare class SwarmEnvironment {
    private dreamMemory;
    private markers;
    private readonly DECAY_INTERVAL;
    constructor(dreamMemory: DreamMemory);
    /**
     * Place a marker in the environment
     */
    placeMarker(type: EnvironmentMarker["type"], location: string, value: any, strength?: number, ttl?: number): Promise<EnvironmentMarker>;
    /**
     * Place a pheromone signal (decays over time)
     */
    placePheromone(location: string, value: any, initialStrength?: number, decayRate?: number): Promise<PheromoneSignal>;
    /**
     * Read markers at a location
     */
    readMarkers(location: string, type?: EnvironmentMarker["type"]): Promise<EnvironmentMarker[]>;
    /**
     * Read pheromone signals at a location (aggregated by value)
     */
    readPheromones(location: string, value?: any): Promise<Array<{
        value: any;
        totalStrength: number;
    }>>;
    /**
     * Clear markers at a location
     */
    clearMarkers(location: string, type?: EnvironmentMarker["type"]): Promise<number>;
    /**
     * Start decay loop for pheromones
     */
    private startDecayLoop;
    /**
     * Decay pheromone signals
     */
    private decayPheromones;
    /**
     * Get all markers
     */
    getAllMarkers(): EnvironmentMarker[];
    /**
     * Get markers by type
     */
    getMarkersByType(type: EnvironmentMarker["type"]): EnvironmentMarker[];
}
export default SwarmEnvironment;
