import { CellularShield, CellType, ShieldPhase, WormholeShieldSignal } from '../types.js';
import { ShieldStore } from '../store/shieldStore.js';

let cellularShieldCounter = 0;
function nextCellularShieldId() {
  cellularShieldCounter += 1;
  return `cellular:${Date.now()}:${cellularShieldCounter}`;
}

let wormholeSignalCounter = 0;
function nextWormholeSignalId() {
  wormholeSignalCounter += 1;
  return `wormhole-signal:${Date.now()}:${wormholeSignalCounter}`;
}

const cellularShields: Map<string, CellularShield> = new Map();
const wormholeSignals: WormholeShieldSignal[] = [];

/**
 * Create cellular shield for a cell
 */
export function createCellularShield(
  cellId: string,
  cellType: CellType,
  wormholeId?: string
): CellularShield {
  const now = Date.now();
  const cellularLayer = ShieldStore.getLayer("cellular");
  const baseFrequency = cellularLayer?.frequency.frequency || 15000; // Higher frequency for cellular

  const shield: CellularShield = {
    cellId,
    cellType,
    shieldStrength: 1.0,
    frequency: baseFrequency + Math.random() * 100, // Unique frequency per cell
    integrity: 1.0,
    lastUpdate: now,
    threatCount: 0,
    blockedCount: 0,
    wormholeConnected: !!wormholeId,
    wormholeId,
  };

  cellularShields.set(cellId, shield);
  console.log(`[CellularShield] Created shield for cell ${cellId} (${cellType})`);
  return shield;
}

/**
 * Get cellular shield for a cell
 */
export function getCellularShield(cellId: string): CellularShield | undefined {
  return cellularShields.get(cellId);
}

/**
 * Update cellular shield integrity
 */
export function updateCellularShieldIntegrity(cellId: string, integrity: number): boolean {
  const shield = cellularShields.get(cellId);
  if (!shield) return false;

  shield.integrity = Math.max(0, Math.min(1, integrity));
  shield.shieldStrength = shield.integrity; // Sync strength with integrity
  shield.lastUpdate = Date.now();
  cellularShields.set(cellId, shield);
  return true;
}

/**
 * Propagate shield signal via wormhole
 */
export function propagateShieldViaWormhole(
  signalType: WormholeShieldSignal["signalType"],
  sourcePhase: ShieldPhase,
  payload: Record<string, any>,
  targetCells?: string[]
): WormholeShieldSignal {
  const now = Date.now();
  const signal: WormholeShieldSignal = {
    id: nextWormholeSignalId(),
    signalType,
    sourcePhase,
    targetCells,
    payload,
    propagatedAt: now,
    propagationCount: 0,
  };

  // Propagate to all cellular shields
  const cellsToUpdate = targetCells || Array.from(cellularShields.keys());
  
  for (const cellId of cellsToUpdate) {
    const shield = cellularShields.get(cellId);
    if (shield && shield.wormholeConnected) {
      // Update cell based on signal type
      switch (signalType) {
        case "shield-update":
          if (payload.integrity !== undefined) {
            updateCellularShieldIntegrity(cellId, payload.integrity);
          }
          if (payload.frequency !== undefined) {
            shield.frequency = payload.frequency;
          }
          break;
        case "threat-alert":
          shield.threatCount += 1;
          if (payload.blocked) {
            shield.blockedCount += 1;
          }
          break;
        case "frequency-sync":
          shield.frequency = payload.frequency || shield.frequency;
          break;
        case "spike-command":
          // Cell receives spike command
          break;
      }
      shield.lastUpdate = now;
      cellularShields.set(cellId, shield);
      signal.propagationCount += 1;
    }
  }

  wormholeSignals.push(signal);
  if (wormholeSignals.length > 1000) {
    wormholeSignals.shift();
  }

  console.log(`[CellularShield] Propagated ${signalType} signal to ${signal.propagationCount} cells via wormhole`);
  return signal;
}

/**
 * List all cellular shields
 */
export function listCellularShields(): CellularShield[] {
  return Array.from(cellularShields.values());
}

/**
 * Get cellular shield statistics
 */
export function getCellularShieldStats(): {
  totalCells: number;
  wormholeConnected: number;
  avgIntegrity: number;
  totalThreats: number;
  totalBlocked: number;
} {
  const allShields = Array.from(cellularShields.values());
  const wormholeConnected = allShields.filter((s) => s.wormholeConnected).length;
  const avgIntegrity = allShields.length > 0
    ? allShields.reduce((sum, s) => sum + s.integrity, 0) / allShields.length
    : 1.0;
  const totalThreats = allShields.reduce((sum, s) => sum + s.threatCount, 0);
  const totalBlocked = allShields.reduce((sum, s) => sum + s.blockedCount, 0);

  return {
    totalCells: allShields.length,
    wormholeConnected,
    avgIntegrity,
    totalThreats,
    totalBlocked,
  };
}

/**
 * Get recent wormhole signals
 */
export function getRecentWormholeSignals(limit: number = 50): WormholeShieldSignal[] {
  return wormholeSignals.slice(-limit).reverse();
}

export { cellularShields, wormholeSignals };

