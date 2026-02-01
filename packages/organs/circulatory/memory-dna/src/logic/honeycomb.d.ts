import type { HexCoordinates } from '../types.js';
/**
 * Calculates the Manhattan distance between two hexes in a grid.
 */
export declare function getHexDistance(a: HexCoordinates, b: HexCoordinates): number;
/**
 * Returns the 6 coordinate neighbors for a given hex.
 */
export declare function getHexNeighbors(center: HexCoordinates): HexCoordinates[];
/**
 * Generates the Nth coordinate in a spiral path starting from 0,0,0.
 * Used to fill the honeycomb densely from the center outward.
 */
export declare function getSpiralCoordinate(n: number): HexCoordinates;
/**
 * Basic equality check for coordinates
 */
export declare function areHexEqual(a: HexCoordinates, b: HexCoordinates): boolean;
//# sourceMappingURL=honeycomb.d.ts.map