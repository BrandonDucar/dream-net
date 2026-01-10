"use strict";
/**
 * Mycelium Network Logic
 * Distributed webhook routing with self-healing paths
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHypha = createHypha;
exports.createMycelium = createMycelium;
exports.findOptimalPath = findOptimalPath;
exports.healHyphae = healHyphae;
exports.findAlternativePath = findAlternativePath;
exports.getHyphae = getHyphae;
exports.getMycelia = getMycelia;
exports.updateHyphaLoad = updateHyphaLoad;
let hyphae = new Map();
let mycelia = new Map();
let hyphaCounter = 0;
let myceliumCounter = 0;
function nextHyphaId() {
    hyphaCounter += 1;
    return `hypha:${Date.now()}:${hyphaCounter}`;
}
function nextMyceliumId() {
    myceliumCounter += 1;
    return `mycelium:${Date.now()}:${myceliumCounter}`;
}
/**
 * Create a hypha (webhook path)
 */
function createHypha(sourceId, targetId, options) {
    const hypha = {
        id: nextHyphaId(),
        sourceId,
        targetId,
        strength: options?.strength || 0.5,
        latency: 0,
        capacity: options?.capacity || 100,
        currentLoad: 0,
        health: 100,
        alternativePaths: [],
        createdAt: Date.now(),
    };
    hyphae.set(hypha.id, hypha);
    return hypha;
}
/**
 * Create a mycelium network (webhook network)
 */
function createMycelium(name, neuronIds, hyphaIds) {
    const mycelium = {
        id: nextMyceliumId(),
        name,
        neurons: neuronIds,
        hyphae: hyphaIds,
        health: 100,
        throughput: 0,
        resilience: calculateResilience(hyphaIds),
        createdAt: Date.now(),
    };
    mycelia.set(mycelium.id, mycelium);
    return mycelium;
}
/**
 * Find optimal path through mycelium network
 */
function findOptimalPath(sourceId, targetId, myceliumId) {
    const relevantHyphae = myceliumId
        ? Array.from(hyphae.values()).filter((h) => mycelia.get(myceliumId)?.hyphae.includes(h.id))
        : Array.from(hyphae.values());
    // Use Dijkstra-like algorithm with strength as weight
    const paths = findPaths(sourceId, targetId, relevantHyphae);
    if (paths.length === 0)
        return null;
    // Sort by combined strength and latency
    paths.sort((a, b) => {
        const aScore = calculatePathScore(a, relevantHyphae);
        const bScore = calculatePathScore(b, relevantHyphae);
        return bScore - aScore; // Higher is better
    });
    return paths[0];
}
/**
 * Find all paths between source and target
 */
function findPaths(sourceId, targetId, hyphae, visited = new Set(), currentPath = []) {
    if (sourceId === targetId) {
        return [currentPath];
    }
    if (visited.has(sourceId)) {
        return [];
    }
    visited.add(sourceId);
    const paths = [];
    const outgoingHyphae = hyphae.filter((h) => h.sourceId === sourceId && h.health > 50);
    for (const hypha of outgoingHyphae) {
        const newPath = [...currentPath, hypha.targetId];
        const subPaths = findPaths(hypha.targetId, targetId, hyphae, new Set(visited), newPath);
        paths.push(...subPaths);
    }
    return paths;
}
/**
 * Calculate path score (strength - latency penalty)
 */
function calculatePathScore(path, hyphae) {
    let score = 0;
    let latency = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const hypha = hyphae.find((h) => h.sourceId === path[i] && h.targetId === path[i + 1]);
        if (hypha) {
            score += hypha.strength;
            latency += hypha.latency;
        }
    }
    // Penalize latency
    return score - latency * 0.001;
}
/**
 * Calculate network resilience (number of alternative paths)
 */
function calculateResilience(hyphaIds) {
    const relevantHyphae = Array.from(hyphae.values()).filter((h) => hyphaIds.includes(h.id));
    // Count alternative paths
    let alternativeCount = 0;
    for (const hypha of relevantHyphae) {
        alternativeCount += hypha.alternativePaths.length;
    }
    return Math.min(100, (alternativeCount / relevantHyphae.length) * 100);
}
/**
 * Heal damaged hyphae (self-healing network)
 */
function healHyphae() {
    for (const hypha of hyphae.values()) {
        if (hypha.health < 100) {
            // Gradually heal
            hypha.health = Math.min(100, hypha.health + 1);
            // Reduce load if healing
            if (hypha.currentLoad > 0) {
                hypha.currentLoad = Math.max(0, hypha.currentLoad - 1);
            }
        }
    }
}
/**
 * Find alternative paths if primary path fails
 */
function findAlternativePath(failedHyphaId, sourceId, targetId) {
    const failedHypha = hyphae.get(failedHyphaId);
    if (!failedHypha)
        return null;
    // Use alternative paths if available
    if (failedHypha.alternativePaths.length > 0) {
        for (const altPathId of failedHypha.alternativePaths) {
            const altPath = hyphae.get(altPathId);
            if (altPath && altPath.health > 50) {
                return [sourceId, altPath.targetId, targetId];
            }
        }
    }
    // Find new path excluding failed hypha
    const allHyphae = Array.from(hyphae.values()).filter((h) => h.id !== failedHyphaId);
    return findOptimalPath(sourceId, targetId);
}
/**
 * Get all hyphae
 */
function getHyphae() {
    return Array.from(hyphae.values());
}
/**
 * Get all mycelia
 */
function getMycelia() {
    return Array.from(mycelia.values());
}
/**
 * Update hypha load
 */
function updateHyphaLoad(hyphaId, load) {
    const hypha = hyphae.get(hyphaId);
    if (hypha) {
        hypha.currentLoad = Math.max(0, Math.min(hypha.capacity, load));
        // Health decreases with overload
        if (hypha.currentLoad > hypha.capacity * 0.9) {
            hypha.health = Math.max(0, hypha.health - 1);
        }
    }
}
