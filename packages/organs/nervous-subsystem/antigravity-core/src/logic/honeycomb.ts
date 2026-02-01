/**
 * Honeycomb Geometry Logic
 * The structural lattice for the DreamNet Brain.
 */
export const HEX_ANGLES = [0, 60, 120, 180, 240, 300];

export interface HexCell {
    q: number; // Axial Q
    r: number; // Axial R
    s: number; // Axial S (Calculated)
    id: string;
}

export function createHex(q: number, r: number): HexCell {
    return { q, r, s: -q - r, id: `${q},${r}` };
}

export function getNeighbors(cell: HexCell): HexCell[] {
    const directions = [
        { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
        { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
    ];
    return directions.map(d => createHex(cell.q + d.q, cell.r + d.r));
}
