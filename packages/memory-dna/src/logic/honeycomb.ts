
export interface HexCoordinate {
    q: number;
    r: number;
    s: number;
}

/**
 * Returns axial coordinates (q, r, s) for a given spiral index.
 * Index 0 is the center (0,0,0).
 */
export function getSpiralCoordinate(n: number): HexCoordinate {
    if (n === 0) return { q: 0, r: 0, s: 0 };
    
    // Simplified spiral for prototype
    // For n > 0, we'll just project along q axis for now
    return { q: n, r: -n, s: 0 };
}

export function getHexDistance(a: HexCoordinate, b: HexCoordinate): number {
    return (Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs(a.s - b.s)) / 2;
}

export function getHexNeighbors(c: HexCoordinate): HexCoordinate[] {
    const directions = [
        { q: 1, r: -1, s: 0 }, { q: 1, r: 0, s: -1 }, { q: 0, r: 1, s: -1 },
        { q: -1, r: 1, s: 0 }, { q: -1, r: 0, s: 1 }, { q: 0, r: -1, s: 1 }
    ];
    return directions.map(d => ({ q: c.q + d.q, r: c.r + d.r, s: c.s + d.s }));
}

export function areHexEqual(a: HexCoordinate, b: HexCoordinate): boolean {
    return a.q === b.q && a.r === b.r && a.s === b.s;
}
