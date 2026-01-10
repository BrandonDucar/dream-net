/**
 * Nerve Bus Subscribers
 * Default subscribers for core DreamNet systems
 * 
 * @module @dreamnet/nerve/subscribers
 */

import type { NerveBus } from "./bus";
import type { NerveEvent } from "./types";

// Shield Core risk tracking (optional import)
let updateRiskProfile: ((params: {
  callerId: string;
  tierId: any;
  baseDelta: number;
  isFailure?: boolean;
  isHighRiskTool?: boolean;
  portId?: string;
  toolId?: string;
}) => any) | null = null;

try {
  const riskModule = require("@dreamnet/shield-core/risk");
  updateRiskProfile = riskModule.updateRiskProfile;
} catch (error) {
  // Shield Core risk module not available, continue without risk tracking
}

/**
 * Register Shield Core subscriber
 * Subscribes to SHIELD_EVENT and HTTP_REQUEST channels
 * 
 * @param bus - Nerve bus instance
 */
export function registerShieldCoreSubscriber(bus: NerveBus): void {
  // Subscribe to shield events
  bus.subscribe("SHIELD_EVENT", async (event: NerveEvent) => {
    // TODO: integrate with real Shield Core logic
    console.info(`[shield-core] ${event.kind}`, {
      id: event.id,
      priority: event.priority,
      phase: (event.payload as any).phase,
      threatType: (event.payload as any).threatType,
      threatLevel: (event.payload as any).threatLevel,
      actionTaken: (event.payload as any).actionTaken,
      integrity: (event.payload as any).integrity,
      traceId: event.context.traceId,
      sampled: event.context.sampled,
    });
  });
  
  // Subscribe to HTTP_REQUEST for threat heuristics
  bus.subscribe("HTTP_REQUEST", (event: NerveEvent) => {
    if (event.kind === "REQUEST_DECISION") {
      const payload = event.payload as any;
      if (payload.decision === "deny" || payload.decision === "throttle") {
        // Log potential threats for Shield Core analysis
        if (event.context.riskScore && event.context.riskScore > 50) {
          console.info(`[shield-core] High-risk request detected`, {
            traceId: event.context.traceId,
            routeId: payload.routeId,
            decision: payload.decision,
            riskScore: event.context.riskScore,
            tierId: event.context.tierId,
            priority: event.priority,
          });
        }
      }
    }
  });

  // Risk tracking from all events
  bus.subscribeAll(async (event: NerveEvent) => {
    if (!updateRiskProfile) return; // Risk module not available

    const ctx = event.context;
    const payload: any = event.payload ?? {};
    const callerId = ctx.citizenId || "anonymous";

    if (!callerId || !ctx.tierId) return;

    const isFailure =
      event.kind === "THREAT_DETECTED" ||
      payload.ok === false ||
      payload.decision === "deny" ||
      payload.decision === "throttle" ||
      payload.reason === "TIMEOUT";

    const isHighRiskTool =
      typeof payload.toolId === "string" &&
      ["env.set", "env.delete", "api.rotateKey", "vercel.deploy"].includes(
        payload.toolId
      );

    // baseDelta: small negative for success, positive for failure
    const baseDelta = isFailure ? 0.05 : -0.02;

    const profile = updateRiskProfile({
      callerId,
      tierId: ctx.tierId,
      baseDelta,
      isFailure,
      isHighRiskTool,
      portId: (payload.portId as string | undefined) ?? undefined,
      toolId: (payload.toolId as string | undefined) ?? undefined,
    });

    if (profile.level === "critical") {
      console.warn("[shield-core] Critical risk profile detected", {
        callerId,
        score: profile.score,
        level: profile.level,
        traceId: ctx.traceId,
      });
    }
  });
}

/**
 * Register Jaggy subscriber
 * Subscribes to all events for comprehensive monitoring
 * 
 * @param bus - Nerve bus instance
 */
export function registerJaggySubscriber(bus: NerveBus): void {
  const countsByKind: Record<string, number> = {};
  
  bus.subscribeAll((event: NerveEvent) => {
    const key = event.kind;
    countsByKind[key] = (countsByKind[key] ?? 0) + 1;
    
    // TODO: expose this via metrics endpoint or logger
    
    // Log high-priority events immediately
    if (event.priority >= 4) {
      console.info(`[jaggy] high-priority event`, {
        kind: event.kind,
        channelId: event.channelId,
        priority: event.priority,
        context: {
          traceId: event.context.traceId,
          clusterId: event.context.clusterId,
          tierId: event.context.tierId,
        },
      });
    }
    
    // Log critical events immediately
    if (
      event.kind === "THREAT_DETECTED" ||
      event.kind === "THREAT_MITIGATED" ||
      (event.kind === "REQUEST_DECISION" && (event.payload as any).decision === "deny")
    ) {
      console.info(`[jaggy] Critical event detected`, {
        kind: event.kind,
        channelId: event.channelId,
        priority: event.priority,
        traceId: event.context.traceId,
        clusterId: event.context.clusterId,
      });
    }
  });
}

/**
 * DreamScope event ring buffer
 * Stores last N events for dashboard display
 */
const DREAMSCOPE_RING_BUFFER_SIZE = 200;
const dreamScopeEvents: NerveEvent[] = [];

/**
 * Register DreamScope subscriber
 * Subscribes to HTTP_REQUEST and SHIELD_EVENT channels
 * Stores events in ring buffer for dashboard
 * 
 * @param bus - Nerve bus instance
 * @returns DreamScope interface with getRecentEvents
 */
export function registerDreamScopeSubscriber(bus: NerveBus): {
  getRecentEvents: () => NerveEvent[];
} {
  // Subscribe to HTTP_REQUEST events
  bus.subscribe("HTTP_REQUEST", (event: NerveEvent) => {
    // Add to ring buffer
    dreamScopeEvents.push(event);
    
    // Maintain ring buffer size
    if (dreamScopeEvents.length > DREAMSCOPE_RING_BUFFER_SIZE) {
      dreamScopeEvents.shift();
    }
  });
  
  // Subscribe to SHIELD_EVENT events
  bus.subscribe("SHIELD_EVENT", (event: NerveEvent) => {
    // Add to ring buffer
    dreamScopeEvents.push(event);
    
    // Maintain ring buffer size
    if (dreamScopeEvents.length > DREAMSCOPE_RING_BUFFER_SIZE) {
      dreamScopeEvents.shift();
    }
  });
  
  // Return interface for accessing events
  return {
    getRecentEvents: () => [...dreamScopeEvents],
  };
}

/**
 * Get recent events for DreamScope dashboard
 * 
 * @param limit - Maximum number of events to return
 * @returns Array of recent events
 */
export function getDreamScopeEvents(limit: number = 100): NerveEvent[] {
  return dreamScopeEvents.slice(-limit).reverse();
}

/**
 * Get event metrics for DreamScope dashboard
 * 
 * @returns Event metrics
 */
export function getDreamScopeMetrics(): {
  totalEvents: number;
  eventsByKind: Record<string, number>;
  eventsByChannel: Record<string, number>;
  latestEvent?: NerveEvent;
} {
  const eventsByKind: Record<string, number> = {};
  const eventsByChannel: Record<string, number> = {};
  
  for (const event of dreamScopeEvents) {
    eventsByKind[event.kind] = (eventsByKind[event.kind] || 0) + 1;
    eventsByChannel[event.channelId] = (eventsByChannel[event.channelId] || 0) + 1;
  }
  
  return {
    totalEvents: dreamScopeEvents.length,
    eventsByKind,
    eventsByChannel,
    latestEvent: dreamScopeEvents[dreamScopeEvents.length - 1],
  };
}

