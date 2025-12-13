/**
 * Shield Core ↔ Spine Integration
 * 
 * Provides wrapped Shield Core functions that emit events to Spine Event Bus.
 * 
 * Usage:
 * ```typescript
 * import { detectThreatWithSpine, fireSpikeWithSpine, updateRiskWithSpine } from './shield-spine-integration';
 * 
 * // Instead of: detectThreat(type, level, source, target, payload)
 * const threat = await detectThreatWithSpine({ type, level, source, target, payload });
 * ```
 */

import type { ThreatType, ThreatLevel } from "../../packages/shield-core/types";
import type { TierId } from "../../packages/dreamnet-control-core/tierConfig";

/**
 * Detect threat with Spine event emission
 */
export async function detectThreatWithSpine(params: {
  type: ThreatType;
  level: ThreatLevel;
  source?: string;
  target?: string;
  payload?: Record<string, any>;
  correlationId?: string;
}): Promise<any> {
  // Get ShieldCoreWrapper from global
  const wrapper = (global as any).shieldCoreWrapper;
  
  if (!wrapper) {
    // Fallback to direct Shield Core call if wrapper not available
    const { detectThreat } = await import("../../packages/shield-core/logic/threatDetector");
    return detectThreat(params.type, params.level, params.source, params.target, params.payload);
  }
  
  // Use wrapper (emits events to Spine)
  return await wrapper.detectThreat({
    type: params.type,
    level: params.level,
    source: params.source,
    target: params.target,
    payload: params.payload,
    correlationId: params.correlationId,
  });
}

/**
 * Fire spike with Spine event emission
 */
export async function fireSpikeWithSpine(params: {
  name: string;
  type: "counter-attack" | "block" | "rate-limit" | "trace";
  target: string;
  power?: number;
  meta?: Record<string, any>;
  correlationId?: string;
}): Promise<any> {
  // Get ShieldCoreWrapper from global
  const wrapper = (global as any).shieldCoreWrapper;
  
  if (!wrapper) {
    // Fallback to direct Shield Core call if wrapper not available
    const { fireSpike } = await import("../../packages/shield-core/logic/offensiveSpike");
    return fireSpike(params.name, params.type, params.target, params.power ?? 1.0, params.meta);
  }
  
  // Use wrapper (emits events to Spine)
  return await wrapper.fireSpike({
    name: params.name,
    type: params.type,
    target: params.target,
    power: params.power,
    meta: params.meta,
    correlationId: params.correlationId,
  });
}

/**
 * Update risk profile with Spine event emission
 */
export async function updateRiskWithSpine(params: {
  callerId: string;
  tierId: TierId;
  baseDelta: number;
  isFailure?: boolean;
  isHighRiskTool?: boolean;
  portId?: string;
  toolId?: string;
  correlationId?: string;
}): Promise<any> {
  // Get ShieldCoreWrapper from global
  const wrapper = (global as any).shieldCoreWrapper;
  
  if (!wrapper) {
    // Fallback to direct Shield Core call if wrapper not available
    const { updateRiskProfile } = await import("../../packages/shield-core/src/risk");
    return updateRiskProfile({
      callerId: params.callerId,
      tierId: params.tierId,
      baseDelta: params.baseDelta,
      isFailure: params.isFailure,
      isHighRiskTool: params.isHighRiskTool,
      portId: params.portId,
      toolId: params.toolId,
    });
  }
  
  // Use wrapper (emits events to Spine)
  return await wrapper.updateRisk({
    callerId: params.callerId,
    tierId: params.tierId,
    baseDelta: params.baseDelta,
    isFailure: params.isFailure,
    isHighRiskTool: params.isHighRiskTool,
    portId: params.portId,
    toolId: params.toolId,
    correlationId: params.correlationId,
  });
}

/**
 * Get Shield Core Wrapper instance
 */
export function getShieldCoreWrapper(): any {
  return (global as any).shieldCoreWrapper || null;
}

