/**
 * Nerve Fiber Event Fabric Types
 * Central event bus for DreamNet's nervous system
 *
 * @module @dreamnet/nerve/types
 */
import type { ClusterId, TierId, CitizenId, OfficeId, CabinetId } from "@dreamnet/shared";
/**
 * Nerve Channel ID - Routing channels for events
 */
export type NerveChannelId = "HTTP_REQUEST" | "SHIELD_EVENT" | "AI_SEO_EVENT" | "GEOFENCE_EVENT" | "DREAMSTATE_EVENT" | "DREAMBET_EVENT" | "ZEN_GARDEN_EVENT" | "SYSTEM_METRIC" | "INTEGRATION_EVENT" | "GENERIC" | string;
/**
 * Nerve Event Kind - Type of event
 */
export type NerveEventKind = "REQUEST_DECISION" | "SHIELD_PHASE_TICK" | "THREAT_DETECTED" | "THREAT_MITIGATED" | "SEO_APPLIED" | "GEOFENCE_APPLIED" | "DREAMSTATE_DECISION" | "TREASURY_MOVE" | "BET_PLACED" | "ZEN_SESSION" | "METRIC_SNAPSHOT" | "INTEGRATION_STATUS" | "DEBUG" | string;
/**
 * Nerve Priority - Event priority level (0=lowest, 5=highest)
 */
export type NervePriority = 0 | 1 | 2 | 3 | 4 | 5;
/**
 * Nerve Span - Tracing span for distributed tracing
 */
export interface NerveSpan {
    /** Unique span ID */
    spanId: string;
    /** Parent span ID (for nested spans) */
    parentSpanId?: string;
    /** Span name/operation */
    name?: string;
    /** When span started */
    startedAt: string;
    /** When span ended (if completed) */
    endedAt?: string;
}
/**
 * Nerve Context - Contextual information about the event
 */
export interface NerveContext {
    /** Trace ID for request tracking */
    traceId?: string;
    /** Span information for distributed tracing */
    span?: NerveSpan;
    /** Timestamp of the event */
    timestamp: string;
    /** Cluster ID if applicable */
    clusterId?: ClusterId;
    /** Tier ID if applicable */
    tierId?: TierId;
    /** Citizen ID if applicable */
    citizenId?: CitizenId;
    /** Office IDs if applicable */
    officeIds?: OfficeId[];
    /** Cabinet IDs if applicable */
    cabinetIds?: CabinetId[];
    /** Geographic information */
    geo?: {
        country?: string;
        region?: string;
        city?: string;
    };
    /** Risk score (0-100) */
    riskScore?: number;
    /** Cost estimate (tokens, dollars, etc.) */
    costEstimate?: number;
    /** Sample rate (0-1) */
    sampleRate?: number;
    /** Whether this event was sampled */
    sampled?: boolean;
}
/**
 * Request Decision Payload
 */
export interface RequestDecisionPayload {
    routeId: string;
    method: string;
    decision: "allow" | "deny" | "throttle";
    reason?: string;
    statusCode?: number;
    latencyMs?: number;
}
/**
 * Shield Event Payload
 */
export interface ShieldEventPayload {
    phase: string;
    threatType?: string;
    threatLevel?: string;
    actionTaken?: string;
    integrity?: number;
}
/**
 * AI SEO Payload
 */
export interface AiSeoPayload {
    routeId: string;
    seoScore?: number;
    keywords?: string[];
    geofencesApplied?: string[];
}
/**
 * DreamState Decision Payload
 */
export interface DreamStateDecisionPayload {
    routeId: string;
    decision: "allow" | "deny";
    reason?: string;
    requiredOfficeId?: OfficeId;
    requiredCabinetId?: CabinetId;
}
/**
 * Treasury Move Payload
 */
export interface TreasuryMovePayload {
    from: string;
    to: string;
    amount: number;
    currency: string;
    reason?: string;
}
/**
 * Bet Placed Payload
 */
export interface BetPlacedPayload {
    gameId: string;
    amount: number;
    currency: string;
    odds?: number;
}
/**
 * Zen Session Payload
 */
export interface ZenSessionPayload {
    sessionId: string;
    sessionType: string;
    duration?: number;
    tokensEarned?: number;
}
/**
 * Metric Snapshot Payload
 */
export interface MetricSnapshotPayload {
    metricName: string;
    value: number;
    unit?: string;
    tags?: Record<string, string>;
}
/**
 * Integration Status Payload
 */
export interface IntegrationStatusPayload {
    integrationId: string;
    status: "healthy" | "degraded" | "down";
    message?: string;
}
/**
 * Nerve Event Payload - Union of all payload types
 */
export type NerveEventPayload = RequestDecisionPayload | ShieldEventPayload | AiSeoPayload | DreamStateDecisionPayload | TreasuryMovePayload | BetPlacedPayload | ZenSessionPayload | MetricSnapshotPayload | IntegrationStatusPayload | Record<string, unknown>;
/**
 * Nerve Event Base
 */
export interface NerveEventBase {
    /** Unique event ID (UUID) */
    id: string;
    /** Channel ID for routing */
    channelId: NerveChannelId;
    /** Event kind/type */
    kind: NerveEventKind;
    /** Event priority (0=lowest, 5=highest) */
    priority: NervePriority;
    /** Contextual information */
    context: NerveContext;
}
/**
 * Nerve Event - Complete event with payload
 */
export interface NerveEvent extends NerveEventBase {
    /** Event payload (typed based on kind) */
    payload: NerveEventPayload;
}
//# sourceMappingURL=types.d.ts.map