/**
 * Ant Colony Logic
 * Decentralized webhook routing with pheromone trails
 */
let pheromoneTrails = new Map();
let activeAnts = new Map();
let trailCounter = 0;
let antCounter = 0;
function nextTrailId() {
    trailCounter += 1;
    return `trail:${Date.now()}:${trailCounter}`;
}
function nextAntId() {
    antCounter += 1;
    return `ant:${Date.now()}:${antCounter}`;
}
/**
 * Create a pheromone trail (webhook path)
 */
export function createPheromoneTrail(path, successRate = 1.0, latency = 0) {
    const trail = {
        id: nextTrailId(),
        path,
        strength: 1.0,
        successRate,
        latency,
        lastUsed: Date.now(),
        evaporationRate: 0.0001, // Decay per ms
        createdAt: Date.now(),
    };
    pheromoneTrails.set(trail.id, trail);
    return trail;
}
/**
 * Create an ant (webhook request)
 */
export function createAnt(requestId, payload, destination) {
    const ant = {
        id: nextAntId(),
        requestId,
        payload,
        currentPath: [],
        destination,
        status: "foraging",
        startedAt: Date.now(),
    };
    activeAnts.set(ant.id, ant);
    return ant;
}
/**
 * Find best pheromone trail to destination
 */
export function findBestTrail(destination) {
    const relevantTrails = Array.from(pheromoneTrails.values()).filter((trail) => trail.path[trail.path.length - 1] === destination && trail.strength > 0.1);
    if (relevantTrails.length === 0)
        return null;
    // Sort by strength and success rate
    relevantTrails.sort((a, b) => {
        const aScore = a.strength * a.successRate;
        const bScore = b.strength * b.successRate;
        return bScore - aScore;
    });
    return relevantTrails[0];
}
/**
 * Follow pheromone trail
 */
export function followTrail(antId, trailId) {
    const ant = activeAnts.get(antId);
    const trail = pheromoneTrails.get(trailId);
    if (!ant || !trail)
        return false;
    ant.pheromoneTrailId = trailId;
    ant.currentPath = [...trail.path];
    trail.lastUsed = Date.now();
    // Strengthen trail (more ants = stronger trail)
    trail.strength = Math.min(1.0, trail.strength + 0.01);
    return true;
}
/**
 * Complete ant journey
 */
export function completeAnt(antId, success, latency) {
    const ant = activeAnts.get(antId);
    if (!ant)
        return;
    ant.status = "completed";
    ant.completedAt = Date.now();
    // Update pheromone trail
    if (ant.pheromoneTrailId) {
        const trail = pheromoneTrails.get(ant.pheromoneTrailId);
        if (trail) {
            if (success) {
                // Strengthen successful trail
                trail.strength = Math.min(1.0, trail.strength + 0.1);
                trail.successRate = (trail.successRate * 0.9) + (1.0 * 0.1); // Moving average
            }
            else {
                // Weaken failed trail
                trail.strength = Math.max(0, trail.strength - 0.2);
                trail.successRate = (trail.successRate * 0.9) + (0.0 * 0.1);
            }
            trail.latency = (trail.latency * 0.9) + (latency * 0.1);
        }
    }
    else if (success && ant.currentPath.length > 0) {
        // Create new trail if successful
        createPheromoneTrail(ant.currentPath, 1.0, latency);
    }
    activeAnts.delete(antId);
}
/**
 * Evaporate pheromone trails (decay over time)
 */
export function evaporateTrails() {
    const now = Date.now();
    for (const trail of pheromoneTrails.values()) {
        const age = now - trail.lastUsed;
        const evaporation = age * trail.evaporationRate;
        trail.strength = Math.max(0, trail.strength - evaporation);
        // Remove very weak trails
        if (trail.strength < 0.01) {
            pheromoneTrails.delete(trail.id);
        }
    }
}
/**
 * Get all pheromone trails
 */
export function getPheromoneTrails() {
    return Array.from(pheromoneTrails.values());
}
/**
 * Get all active ants
 */
export function getActiveAnts() {
    return Array.from(activeAnts.values());
}
/**
 * Get stuck ants (timeout)
 */
export function getStuckAnts(timeoutMs = 30000) {
    const now = Date.now();
    return Array.from(activeAnts.values()).filter((ant) => now - ant.startedAt > timeoutMs && ant.status !== "completed");
}
/**
 * Mark ant as stuck
 */
export function markAntStuck(antId) {
    const ant = activeAnts.get(antId);
    if (ant) {
        ant.status = "stuck";
        // Weaken trail if it was following one
        if (ant.pheromoneTrailId) {
            const trail = pheromoneTrails.get(ant.pheromoneTrailId);
            if (trail) {
                trail.strength = Math.max(0, trail.strength - 0.3);
            }
        }
    }
}
