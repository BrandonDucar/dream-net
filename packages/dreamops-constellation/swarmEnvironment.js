/**
 * Stigmergic Environment
 *
 * Shared environment for indirect agent coordination via shared markers
 * Based on ALife swarm principles (stigmergy)
 */
export class SwarmEnvironment {
    dreamMemory;
    markers = new Map();
    DECAY_INTERVAL = 60000; // 1 minute
    constructor(dreamMemory) {
        this.dreamMemory = dreamMemory;
        this.startDecayLoop();
    }
    /**
     * Place a marker in the environment
     */
    async placeMarker(type, location, value, strength = 1.0, ttl // Time to live in milliseconds
    ) {
        const now = Date.now();
        const marker = {
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
    async placePheromone(location, value, initialStrength = 1.0, decayRate = 0.1 // 10% per minute
    ) {
        const now = Date.now();
        const pheromone = {
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
    async readMarkers(location, type) {
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
    async readPheromones(location, value) {
        const pheromones = await this.readMarkers(location, "pheromone");
        let filtered = pheromones;
        if (value !== undefined) {
            filtered = filtered.filter(p => JSON.stringify(p.value) === JSON.stringify(value));
        }
        // Aggregate by value
        const aggregated = new Map();
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
    async clearMarkers(location, type) {
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
    startDecayLoop() {
        setInterval(() => {
            this.decayPheromones();
        }, this.DECAY_INTERVAL);
    }
    /**
     * Decay pheromone signals
     */
    async decayPheromones() {
        const now = Date.now();
        const toRemove = [];
        for (const marker of this.markers.values()) {
            if (marker.type === "pheromone") {
                const pheromone = marker;
                const lastDecay = new Date(pheromone.lastDecay).getTime();
                const minutesSinceDecay = (now - lastDecay) / 60000;
                // Apply decay
                pheromone.strength = Math.max(0, pheromone.strength - (pheromone.decayRate * minutesSinceDecay));
                pheromone.lastDecay = new Date().toISOString();
                // Remove if strength is too low
                if (pheromone.strength < 0.01) {
                    toRemove.push(pheromone.id);
                }
                else {
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
    getAllMarkers() {
        return Array.from(this.markers.values());
    }
    /**
     * Get markers by type
     */
    getMarkersByType(type) {
        return Array.from(this.markers.values()).filter(m => m.type === type);
    }
}
export default SwarmEnvironment;
