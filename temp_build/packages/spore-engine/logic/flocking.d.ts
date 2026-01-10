/**
 * 🦅 BIOMIMETIC FLOCKING (Boids Algorithm)
 *
 * "Individual Agency, Collective Intelligence."
 *
 * Implements the 3 rules of flocking for Spore Agents:
 * 1. Separation: Avoid crowding neighbors.
 * 2. Alignment: Steer towards the average heading of neighbors.
 * 3. Cohesion: Steer towards the average position of neighbors.
 */
import type { SporeEntity } from "../types";
interface Vector3 {
    x: number;
    y: number;
    z: number;
}
export declare class FlockingEngine {
    /**
     * Calculates the new velocity vector for a Spore based on its flock.
     */
    static calculateFlockVector(spore: SporeEntity, neighbors: SporeEntity[]): Vector3;
    private static separation;
    private static alignment;
    private static cohesion;
    /**
     * Executes a flocking cycle for a group of spores.
     */
    static runFlockingCycle(spores: SporeEntity[]): Promise<void>;
}
export {};
