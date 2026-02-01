/**
 * Nerve Event Factory
 * Helper functions for creating NerveEvents with sampling and sanitization
 * 
 * @module @dreamnet/nerve/factory
 */

import type {
  NerveEvent,
  NerveChannelId,
  NerveEventKind,
  NerveContext,
  NerveEventPayload,
  NervePriority,
} from './types.js';

/**
 * Generate a unique ID (UUID v4)
 * Falls back to timestamp-based ID if crypto.randomUUID is not available
 */
function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  
  // Fallback: timestamp + random
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Sanitize payload to mask sensitive information
 * 
 * @param payload - Event payload
 * @returns Sanitized payload
 */
function sanitizePayload(payload?: NerveEventPayload): NerveEventPayload {
  if (!payload) return {};
  
  // Deep clone to avoid mutating original
  const sanitized = JSON.parse(JSON.stringify(payload));
  
  // List of sensitive keys to mask
  const sensitiveKeys = [
    "password",
    "token",
    "privateKey",
    "secret",
    "apiKey",
    "authorization",
    "auth",
    "credential",
    "private",
    "secretKey",
    "accessToken",
    "refreshToken",
  ];
  
  /**
   * Recursively sanitize an object
   */
  function sanitizeObject(obj: any): any {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
        result[key] = "[REDACTED]";
      } else if (typeof value === "object" && value !== null) {
        result[key] = sanitizeObject(value);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }
  
  return sanitizeObject(sanitized);
}

/**
 * Parameters for creating a Nerve Event
 */
export interface CreateNerveEventParams {
  channelId: NerveChannelId;
  kind: NerveEventKind;
  priority?: NervePriority;
  context?: Partial<NerveContext>;
  payload?: NerveEventPayload;
  defaultSampleRate?: number;
}

/**
 * Create a Nerve Event with sampling and sanitization
 * 
 * @param params - Event parameters
 * @returns Complete NerveEvent
 */
export function createNerveEvent(params: CreateNerveEventParams): NerveEvent {
  const nowIso = new Date().toISOString();
  
  const {
    channelId,
    kind,
    priority = 2,
    context = {},
    payload,
    defaultSampleRate = 0.1,
  } = params;
  
  // Determine sample rate
  const sampleRate = context.sampleRate ?? defaultSampleRate;
  
  // Sample decision (always sample high-priority events)
  const sampled = priority >= 4 ? true : Math.random() < sampleRate;
  
  // Build full context with defaults
  const finalContext: NerveContext = {
    timestamp: context.timestamp ?? nowIso,
    traceId: context.traceId,
    span: context.span,
    clusterId: context.clusterId,
    tierId: context.tierId,
    citizenId: context.citizenId,
    officeIds: context.officeIds,
    cabinetIds: context.cabinetIds,
    geo: context.geo,
    riskScore: context.riskScore,
    costEstimate: context.costEstimate,
    sampleRate,
    sampled,
  };
  
  return {
    id: generateId(),
    channelId,
    kind,
    priority,
    context: finalContext,
    payload: sanitizePayload(payload),
  };
}

/**
 * Create a request decision event
 * 
 * @param params - Request decision parameters
 * @returns NerveEvent
 */
export function createRequestDecisionEvent(params: {
  traceId?: string;
  clusterId?: string;
  tierId?: string;
  citizenId?: string;
  officeIds?: string[];
  cabinetIds?: string[];
  routeId: string;
  method: string;
  decision: "allow" | "deny" | "throttle";
  reason?: string;
  statusCode?: number;
  latencyMs?: number;
  geo?: { country?: string; region?: string; city?: string };
  riskScore?: number;
  costEstimate?: number;
  defaultSampleRate?: number;
}): NerveEvent {
  // Higher priority for deny/throttle events
  const priority: NervePriority = params.decision === "deny" || params.decision === "throttle" ? 4 : 2;
  
  // Always sample problems, sample fewer allows
  const defaultSampleRate = params.defaultSampleRate ?? (params.decision === "allow" ? 0.05 : 1.0);
  
  return createNerveEvent({
    channelId: "HTTP_REQUEST",
    kind: "REQUEST_DECISION",
    priority,
    context: {
      traceId: params.traceId,
      clusterId: params.clusterId as any,
      tierId: params.tierId as any,
      citizenId: params.citizenId,
      officeIds: params.officeIds as any,
      cabinetIds: params.cabinetIds as any,
      geo: params.geo,
      riskScore: params.riskScore,
      costEstimate: params.costEstimate,
    },
    payload: {
      routeId: params.routeId,
      method: params.method,
      decision: params.decision,
      reason: params.reason,
      statusCode: params.statusCode,
      latencyMs: params.latencyMs,
    },
    defaultSampleRate,
  });
}

/**
 * Create a shield event
 * 
 * @param params - Shield event parameters
 * @returns NerveEvent
 */
export function createShieldEvent(params: {
  traceId?: string;
  kind: "THREAT_DETECTED" | "THREAT_MITIGATED" | "SHIELD_PHASE_TICK";
  phase: string;
  threatType?: string;
  threatLevel?: string;
  actionTaken?: string;
  integrity?: number;
  priority?: NervePriority;
}): NerveEvent {
  // High priority for threats
  const priority: NervePriority = params.priority ?? (params.kind === "THREAT_DETECTED" ? 5 : 3);
  
  return createNerveEvent({
    channelId: "SHIELD_EVENT",
    kind: params.kind,
    priority,
    context: {
      traceId: params.traceId,
      clusterId: "SHIELD_CORE",
    },
    payload: {
      phase: params.phase,
      threatType: params.threatType,
      threatLevel: params.threatLevel,
      actionTaken: params.actionTaken,
      integrity: params.integrity,
    },
    defaultSampleRate: params.kind === "THREAT_DETECTED" ? 1.0 : 0.2, // Always sample threats
  });
}

/**
 * Create an AI SEO event
 * 
 * @param params - AI SEO event parameters
 * @returns NerveEvent
 */
export function createAiSeoEvent(params: {
  traceId?: string;
  routeId: string;
  seoScore?: number;
  keywords?: string[];
  geofencesApplied?: string[];
  geo?: { country?: string; region?: string; city?: string };
  tierId?: string;
  defaultSampleRate?: number;
}): NerveEvent {
  return createNerveEvent({
    channelId: "AI_SEO_EVENT",
    kind: "SEO_APPLIED",
    priority: 2,
    context: {
      traceId: params.traceId,
      clusterId: "AI_SEO",
      tierId: params.tierId as any,
      geo: params.geo,
    },
    payload: {
      routeId: params.routeId,
      seoScore: params.seoScore,
      keywords: params.keywords,
      geofencesApplied: params.geofencesApplied,
    },
    defaultSampleRate: params.defaultSampleRate ?? 0.2,
  });
}
