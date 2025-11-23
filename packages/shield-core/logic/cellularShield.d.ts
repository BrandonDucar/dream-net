import { CellularShield, CellType, ShieldPhase, WormholeShieldSignal } from "../types";
declare const cellularShields: Map<string, CellularShield>;
declare const wormholeSignals: WormholeShieldSignal[];
/**
 * Create cellular shield for a cell
 */
export declare function createCellularShield(cellId: string, cellType: CellType, wormholeId?: string): CellularShield;
/**
 * Get cellular shield for a cell
 */
export declare function getCellularShield(cellId: string): CellularShield | undefined;
/**
 * Update cellular shield integrity
 */
export declare function updateCellularShieldIntegrity(cellId: string, integrity: number): boolean;
/**
 * Propagate shield signal via wormhole
 */
export declare function propagateShieldViaWormhole(signalType: WormholeShieldSignal["signalType"], sourcePhase: ShieldPhase, payload: Record<string, any>, targetCells?: string[]): WormholeShieldSignal;
/**
 * List all cellular shields
 */
export declare function listCellularShields(): CellularShield[];
/**
 * Get cellular shield statistics
 */
export declare function getCellularShieldStats(): {
    totalCells: number;
    wormholeConnected: number;
    avgIntegrity: number;
    totalThreats: number;
    totalBlocked: number;
};
/**
 * Get recent wormhole signals
 */
export declare function getRecentWormholeSignals(limit?: number): WormholeShieldSignal[];
export { cellularShields, wormholeSignals };
