/**
 * Shield Core Wrapper - Wraps Shield Core functionality with event emission
 * 
 * Phase I: Wraps existing Shield Core functions and emits events.
 * Phase II: Full policy enforcement, advanced threat analysis.
 */

import type { DreamEventBus } from "../dreamnet-event-bus/DreamEventBus.js";
import { createSecurityEvent } from "../dreamnet-event-bus/EventEnvelope.js";
import { generateCorrelationId } from "../utils/correlationId.js";

// Import Shield Core functions (dynamic to avoid circular deps)
import type { Threat, ThreatType, ThreatLevel } from "../../packages/shield-core/types.js";
import type { CallerRiskProfile } from "../../packages/shield-core/src/risk.js";
import type { TierId } from "../../packages/dreamnet-control-core/tierConfig.js";

export interface DetectThreatParams {
  type: ThreatType;
  level: ThreatLevel;
  source?: string;
  target?: string;
  payload?: Record<string, any>;
  correlationId?: string;
}

export interface FireSpikeParams {
  name: string;
  type: "counter-attack" | "block" | "rate-limit" | "trace";
  target: string;
  power?: number;
  meta?: Record<string, any>;
  correlationId?: string;
}

export interface UpdateRiskParams {
  callerId: string;
  tierId: TierId;
  baseDelta: number;
  isFailure?: boolean;
  isHighRiskTool?: boolean;
  portId?: string;
  toolId?: string;
  correlationId?: string;
}

/**
 * Shield Core Wrapper - Wraps Shield Core functionality
 */
export class ShieldCoreWrapper {
  private eventBus: DreamEventBus | null = null;

  constructor(eventBus?: DreamEventBus) {
    this.eventBus = eventBus ?? null;
  }

  /**
   * Set the event bus for event emission
   */
  setEventBus(eventBus: DreamEventBus): void {
    this.eventBus = eventBus;
  }

  /**
   * Detect a threat and emit event
   */
  async detectThreat(params: DetectThreatParams): Promise<Threat & { correlationId: string; emittedEvents: string[] }> {
    const correlationId = params.correlationId ?? generateCorrelationId();
    const emittedEvents: string[] = [];

    // Import and call Shield Core detectThreat
    const { detectThreat: shieldDetectThreat } = await import("../../packages/shield-core/logic/threatDetector.js");
    const threat = shieldDetectThreat(
      params.type,
      params.level,
      params.source,
      params.target,
      params.payload
    );

    // Emit: Security.ThreatDetected
    if (this.eventBus) {
      const event = createSecurityEvent(
        "ThreatDetected",
        "ShieldCoreWrapper",
        {
          threatId: threat.id,
          threatType: threat.type,
          threatLevel: threat.level,
          source: threat.source,
          target: threat.target,
          blocked: threat.blocked,
        },
        correlationId
      );
      this.eventBus.publish(event);
      emittedEvents.push(event.id);
    }

    // Analyze threat
    const { analyzeThreat: shieldAnalyzeThreat } = await import("../../packages/shield-core/logic/threatDetector.js");
    const analysis = shieldAnalyzeThreat(threat);

    // Emit: Security.ThreatAnalyzed
    if (this.eventBus) {
      const event = createSecurityEvent(
        "ThreatAnalyzed",
        "ShieldCoreWrapper",
        {
          threatId: threat.id,
          shouldBlock: analysis.shouldBlock,
          recommendedSpike: analysis.recommendedSpike,
        },
        correlationId
      );
      this.eventBus.publish(event);
      emittedEvents.push(event.id);
    }

    return {
      ...threat,
      correlationId,
      emittedEvents,
    } as Threat & { correlationId: string; emittedEvents: string[] };
  }

  /**
   * Fire an offensive spike and emit event
   */
  async fireSpike(params: FireSpikeParams): Promise<any & { correlationId: string; emittedEvents: string[] }> {
    const correlationId = params.correlationId ?? generateCorrelationId();
    const emittedEvents: string[] = [];

    // Import and call Shield Core fireSpike
    const { fireSpike: shieldFireSpike } = await import("../../packages/shield-core/logic/offensiveSpike.js");
    const spike = shieldFireSpike(
      params.name,
      params.type,
      params.target,
      params.power ?? 1.0,
      params.meta
    );

    // Emit: Security.MitigationApplied
    if (this.eventBus) {
      const event = createSecurityEvent(
        "MitigationApplied",
        "ShieldCoreWrapper",
        {
          spikeId: spike.id,
          spikeName: spike.name,
          spikeType: spike.type,
          target: spike.target,
          power: spike.power,
          success: spike.success,
        },
        correlationId
      );
      this.eventBus.publish(event);
      emittedEvents.push(event.id);
    }

    return {
      ...spike,
      correlationId,
      emittedEvents,
    };
  }

  /**
   * Update risk profile and emit event
   */
  async updateRisk(params: UpdateRiskParams): Promise<CallerRiskProfile & { correlationId: string; emittedEvents: string[] }> {
    const correlationId = params.correlationId ?? generateCorrelationId();
    const emittedEvents: string[] = [];

    // Import and call Shield Core updateRiskProfile
    const { updateRiskProfile: shieldUpdateRisk } = await import("../../packages/shield-core/src/risk.js");
    const riskProfile = shieldUpdateRisk({
      callerId: params.callerId,
      tierId: params.tierId,
      baseDelta: params.baseDelta,
      isFailure: params.isFailure,
      isHighRiskTool: params.isHighRiskTool,
      portId: params.portId,
      toolId: params.toolId,
    });

    // Emit: Security.RiskProfileUpdated
    if (this.eventBus) {
      const event = createSecurityEvent(
        "RiskProfileUpdated",
        "ShieldCoreWrapper",
        {
          callerId: riskProfile.callerId,
          tierId: riskProfile.tierId,
          score: riskProfile.score,
          level: riskProfile.level,
          recentFailures: riskProfile.recentFailures,
          recentHighRiskUses: riskProfile.recentHighRiskUses,
        },
        correlationId
      );
      this.eventBus.publish(event);
      emittedEvents.push(event.id);
    }

    return {
      ...riskProfile,
      correlationId,
      emittedEvents,
    } as CallerRiskProfile & { correlationId: string; emittedEvents: string[] };
  }

  /**
   * Get risk profile
   */
  async getRisk(callerId: string): Promise<CallerRiskProfile | undefined> {
    const { getRiskProfile } = await import("../../packages/shield-core/src/risk.js");
    return getRiskProfile(callerId);
  }

  /**
   * Set kill switch and emit event
   */
  async setKillSwitch(enabled: boolean): Promise<void> {
    const correlationId = generateCorrelationId();

    // Import and call Control Core setGlobalKillSwitch
    const { setGlobalKillSwitch } = await import("../../packages/dreamnet-control-core/controlCoreMiddleware.js");
    setGlobalKillSwitch(enabled);

    // Emit: Security.KillSwitchActivated or Security.KillSwitchDeactivated
    if (this.eventBus) {
      const event = createSecurityEvent(
        enabled ? "KillSwitchActivated" : "KillSwitchDeactivated",
        "ShieldCoreWrapper",
        {
          enabled,
        },
        correlationId
      );
      this.eventBus.publish(event);
    }
  }

  /**
   * Get kill switch status
   */
  async getKillSwitchStatus(): Promise<boolean> {
    const { isGlobalKillSwitchEnabled } = await import("../../packages/dreamnet-control-core/controlCoreMiddleware.js");
    return isGlobalKillSwitchEnabled();
  }

  /**
   * Rotate shield frequencies and emit event
   */
  async rotateFrequencies(): Promise<void> {
    const correlationId = generateCorrelationId();

    // Import and call Shield Core rotateShieldFrequencies
    const { rotateShieldFrequencies } = await import("../../packages/shield-core/logic/shieldRotator.js");
    rotateShieldFrequencies();

    // Emit: Security.FrequencyRotated
    if (this.eventBus) {
      const event = createSecurityEvent(
        "FrequencyRotated",
        "ShieldCoreWrapper",
        {
          timestamp: Date.now(),
        },
        correlationId
      );
      this.eventBus.publish(event);
    }
  }

  /**
   * Get wrapper status
   */
  getStatus(): {
    killSwitchEnabled: boolean;
    activeLayers: number;
    activeThreats: number;
    recentSpikes: number;
    timestamp: number;
  } {
    // Phase I: Return basic status
    // Phase II: Can query Shield Store for actual counts
    return {
      killSwitchEnabled: false, // Will be set by getKillSwitchStatus if needed
      activeLayers: 0, // Phase I: not tracking
      activeThreats: 0, // Phase I: not tracking
      recentSpikes: 0, // Phase I: not tracking
      timestamp: Date.now(),
    };
  }
}

