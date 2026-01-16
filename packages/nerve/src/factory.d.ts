/**
 * Nerve Event Factory
 * Helper functions for creating NerveEvents with sampling and sanitization
 *
 * @module @dreamnet/nerve/factory
 */
import type { NerveEvent, NerveChannelId, NerveEventKind, NerveContext, NerveEventPayload, NervePriority } from './types.js';
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
export declare function createNerveEvent(params: CreateNerveEventParams): NerveEvent;
/**
 * Create a request decision event
 *
 * @param params - Request decision parameters
 * @returns NerveEvent
 */
export declare function createRequestDecisionEvent(params: {
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
    geo?: {
        country?: string;
        region?: string;
        city?: string;
    };
    riskScore?: number;
    costEstimate?: number;
    defaultSampleRate?: number;
}): NerveEvent;
/**
 * Create a shield event
 *
 * @param params - Shield event parameters
 * @returns NerveEvent
 */
export declare function createShieldEvent(params: {
    traceId?: string;
    kind: "THREAT_DETECTED" | "THREAT_MITIGATED" | "SHIELD_PHASE_TICK";
    phase: string;
    threatType?: string;
    threatLevel?: string;
    actionTaken?: string;
    integrity?: number;
    priority?: NervePriority;
}): NerveEvent;
/**
 * Create an AI SEO event
 *
 * @param params - AI SEO event parameters
 * @returns NerveEvent
 */
export declare function createAiSeoEvent(params: {
    traceId?: string;
    routeId: string;
    seoScore?: number;
    keywords?: string[];
    geofencesApplied?: string[];
    geo?: {
        country?: string;
        region?: string;
        city?: string;
    };
    tierId?: string;
    defaultSampleRate?: number;
}): NerveEvent;
//# sourceMappingURL=factory.d.ts.map