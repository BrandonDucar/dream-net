
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

import type { SporeModel } from '../src/types.js';
import { vectorStore } from "@dreamnet/memory-dna";
import { getPheromoneTrail } from "@dreamnet/halo-loop";

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export class FlockingEngine {

    /**
     * Calculates the new velocity vector for a Spore based on its flock.
     */
    static calculateFlockVector(spore: SporeModel, neighbors: SporeModel[]): Vector3 {
        if (neighbors.length === 0) return { x: 0, y: 0, z: 0 };

        let separationW = 1.5;
        let alignmentW = 1.0;
        let cohesionW = 1.0;

        // Biological Hijack: Scent the neighbors
        for (const neighbor of neighbors) {
            const trail = getPheromoneTrail(neighbor.id);
            if (trail?.types) {
                // Slime Avoidance (Separation boost)
                if (trail.types.SLIME > 0.5) {
                    separationW += trail.types.SLIME * 5;
                }
                // Honey Attraction (Cohesion boost)
                if (trail.types.HONEY > 0.5) {
                    cohesionW += trail.types.HONEY * 2;
                }
            }
        }

        const sep = this.separation(spore, neighbors);
        const ali = this.alignment(spore, neighbors);
        const coh = this.cohesion(spore, neighbors);

        return {
            x: sep.x * separationW + ali.x * alignmentW + coh.x * cohesionW,
            y: sep.y * separationW + ali.y * alignmentW + coh.y * cohesionW,
            z: sep.z * separationW + ali.z * alignmentW + coh.z * cohesionW,
        };
    }

    private static separation(spore: SporeModel, neighbors: SporeModel[]): Vector3 {
        // Separation logic: steer away from neighbors
        let moveX = 0, moveY = 0, moveZ = 0;
        for (const neighbor of neighbors) {
            // Mock spatial repulsion
            moveX += (spore.id.length - neighbor.id.length);
            moveY += (new Date(spore.createdAt).getTime() - new Date(neighbor.createdAt).getTime()) / 10000;
        }
        return { x: moveX / neighbors.length, y: moveY / neighbors.length, z: 0 };
    }

    private static alignment(spore: SporeModel, neighbors: SporeModel[]): Vector3 {
        return { x: 0.1, y: 0.1, z: 0.1 };
    }

    private static cohesion(spore: SporeModel, neighbors: SporeModel[]): Vector3 {
        return { x: 0, y: 0, z: 0 };
    }

    /**
     * Executes a flocking cycle for a group of spores.
     */
    static async runFlockingCycle(spores: SporeModel[]) {
        console.log(`🦅 [Flocking] Synchronizing ${spores.length} spores...`);

        for (const spore of spores) {
            const neighbors = spores.filter(s => s.id !== spore.id).slice(0, 5);
            const vector = this.calculateFlockVector(spore, neighbors);

            if (Math.abs(vector.x) > 0.8 || Math.abs(vector.y) > 0.8) {
                await vectorStore.addMemory(`Emergent Flocking Event for ${spore.id}`, {
                    type: "emergence",
                    vector,
                    source: "flocking_engine",
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
}
