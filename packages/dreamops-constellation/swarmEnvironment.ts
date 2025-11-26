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
  location: string; // Service, agent, or component identifier
  value: any;
  strength: number; // 0-1, for pheromones this decays over time
  createdAt: string;
  expiresAt?: string; // For temporary markers
  metadata?: Record<string, any>;
}

export interface PheromoneSignal extends EnvironmentMarker {
  type: "pheromone";
  decayRate: number; // Per minute
  lastDecay: string;
}

export class SwarmEnvironment {
  private dreamMemory: DreamMemory;
  private markers: Map<string, EnvironmentMarker> = new Map();
  private readonly DECAY_INTERVAL = 60000; // 1 minute

  constructor(dreamMemory: DreamMemory) {
    this.dreamMemory = dreamMemory;
    this.startDecayLoop();
  }

  /**
   * Place a marker in the environment
   */
  async placeMarker(
    type: EnvironmentMarker["type"],
    location: string,
    value: any,
    strength: number = 1.0,
    ttl?: number // Time to live in milliseconds
  ): Promise<EnvironmentMarker> {
    const now = Date.now();
    const marker: EnvironmentMarker = {
      id: `marker-${now}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      location,
      value,
      strength,
      createdAt: new Date().toISOString(),
      expiresAt: ttl ? new Date(now + ttl).toISOString() : undefined,
      metadata: {},
    };

    // Store in DreamMemory
    await this.dreamMemory.store("ops", `marker:${marker.id}`, marker, {
      type: "environment_marker",
      location,
      markerType: type,
    });

    this.markers.set(marker.id, marker);
    return marker;
  }

  /**
   * Place a pheromone signal (decays over time)
   */
  async placePheromone(
    location: string,
    value: any,
    initialStrength: number = 1.0,
    decayRate: number = 0.1 // 10% per minute
  ): Promise<PheromoneSignal> {
    const now = Date.now();
    const pheromone: PheromoneSignal = {
      id: `pheromone-${now}-${Math.random().toString(36).substr(2, 9)}`,
      type: "pheromone",
      location,
      value,
      strength: initialStrength,
      decayRate,
      createdAt: new Date().toISOString(),
      lastDecay: new Date().toISOString(),
      metadata: {},
    };

    await this.dreamMemory.store("ops", `pheromone:${pheromone.id}`, pheromone, {
      type: "pheromone_signal",
      location,
    });

    this.markers.set(pheromone.id, pheromone);
    return pheromone;
  }

  /**
   * Read markers at a location
   */
  async readMarkers(location: string, type?: EnvironmentMarker["type"]): Promise<EnvironmentMarker[]> {
    const allMarkers = Array.from(this.markers.values());
    let filtered = allMarkers.filter(m => m.location === location);

    if (type) {
      filtered = filtered.filter(m => m.type === type);
    }

    // Filter out expired markers
    const now = Date.now();
    return filtered.filter(m => {
      if (m.expiresAt) {
        return new Date(m.expiresAt).getTime() > now;
      }
      return true;
    });
  }

  /**
   * Read pheromone signals at a location (aggregated by value)
   */
  async readPheromones(location: string, value?: any): Promise<Array<{ value: any; totalStrength: number }>> {
    const pheromones = await this.readMarkers(location, "pheromone") as PheromoneSignal[];
    
    let filtered = pheromones;
    if (value !== undefined) {
      filtered = filtered.filter(p => JSON.stringify(p.value) === JSON.stringify(value));
    }

    // Aggregate by value
    const aggregated = new Map<string, number>();
    for (const pheromone of filtered) {
      const key = JSON.stringify(pheromone.value);
      aggregated.set(key, (aggregated.get(key) || 0) + pheromone.strength);
    }

    return Array.from(aggregated.entries()).map(([key, totalStrength]) => ({
      value: JSON.parse(key),
      totalStrength,
    }));
  }

  /**
   * Clear markers at a location
   */
  async clearMarkers(location: string, type?: EnvironmentMarker["type"]): Promise<number> {
    const markers = await this.readMarkers(location, type);
    let cleared = 0;

    for (const marker of markers) {
      this.markers.delete(marker.id);
      // Note: Would remove from DreamMemory in production
      cleared++;
    }

    return cleared;
  }

  /**
   * Start decay loop for pheromones
   */
  private startDecayLoop(): void {
    setInterval(() => {
      this.decayPheromones();
    }, this.DECAY_INTERVAL);
  }

  /**
   * Decay pheromone signals
   */
  private async decayPheromones(): Promise<void> {
    const now = Date.now();
    const toRemove: string[] = [];

    for (const marker of this.markers.values()) {
      if (marker.type === "pheromone") {
        const pheromone = marker as PheromoneSignal;
        const lastDecay = new Date(pheromone.lastDecay).getTime();
        const minutesSinceDecay = (now - lastDecay) / 60000;

        // Apply decay
        pheromone.strength = Math.max(0, pheromone.strength - (pheromone.decayRate * minutesSinceDecay));
        pheromone.lastDecay = new Date().toISOString();

        // Remove if strength is too low
        if (pheromone.strength < 0.01) {
          toRemove.push(pheromone.id);
        } else {
          // Update in DreamMemory
          await this.dreamMemory.store("ops", `pheromone:${pheromone.id}`, pheromone);
        }
      }
    }

    // Remove decayed pheromones
    for (const id of toRemove) {
      this.markers.delete(id);
    }
  }

  /**
   * Get all markers
   */
  getAllMarkers(): EnvironmentMarker[] {
    return Array.from(this.markers.values());
  }

  /**
   * Get markers by type
   */
  getMarkersByType(type: EnvironmentMarker["type"]): EnvironmentMarker[] {
    return Array.from(this.markers.values()).filter(m => m.type === type);
  }
}

export default SwarmEnvironment;

