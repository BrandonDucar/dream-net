// Axial Directions (Clockwise from top-left)
const HEX_DIRECTIONS = [
    { q: 0, r: -1, s: 1 }, // Top Left
    { q: 1, r: -1, s: 0 }, // Top Right
    { q: 1, r: 0, s: -1 }, // Right
    { q: 0, r: 1, s: -1 }, // Bottom Right
    { q: -1, r: 1, s: 0 }, // Bottom Left
    { q: -1, r: 0, s: 1 }, // Left
];
/**
 * Calculates the Manhattan distance between two hexes in a grid.
 */
export function getHexDistance(a, b) {
    return (Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs(a.s - b.s)) / 2;
}
/**
 * Returns the 6 coordinate neighbors for a given hex.
 */
export function getHexNeighbors(center) {
    return HEX_DIRECTIONS.map((dir) => ({
        q: center.q + dir.q,
        r: center.r + dir.r,
        s: center.s + dir.s,
    }));
}
/**
 * Generates the Nth coordinate in a spiral path starting from 0,0,0.
 * Used to fill the honeycomb densely from the center outward.
 */
export function getSpiralCoordinate(n) {
    if (n <= 0)
        return { q: 0, r: 0, s: 0 };
    // 1. Find the ring radius
    // Formula: 3*k*(k+1) + 1 is the max index for ring k.
    // Solving for k roughly.
    let radius = 0;
    let count = 1;
    while (count <= n) {
        radius++;
        count += 6 * radius;
    }
    // 2. Walk the ring to find the exact spot
    // Start at radius, move along the ring
    // Backtracking to finding the start of the ring
    const startOfRing = count - 6 * radius;
    let remainingSteps = n - startOfRing;
    // Start position for ring 'radius': (q: -radius, r: 0, s: radius) - actually varies by convention
    // Standard implementation: Start at direction 4 * radius, then iterate directions
    let current = {
        q: HEX_DIRECTIONS[4].q * radius,
        r: HEX_DIRECTIONS[4].r * radius,
        s: HEX_DIRECTIONS[4].s * radius
    };
    // Walk the 6 edges of the ring
    for (let i = 0; i < 6; i++) {
        const dir = HEX_DIRECTIONS[i];
        for (let j = 0; j < radius; j++) {
            if (remainingSteps === 0)
                return current;
            current = {
                q: current.q + dir.q,
                r: current.r + dir.r,
                s: current.s + dir.s,
            };
            remainingSteps--;
        }
    }
    return current;
}
/**
 * Basic equality check for coordinates
 */
export function areHexEqual(a, b) {
    return a.q === b.q && a.r === b.r && a.s === b.s;
}
