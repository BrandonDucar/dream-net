"use strict";
/**
 * Nerve Event Factory
 * Helper functions for creating NerveEvents with sampling and sanitization
 *
 * @module @dreamnet/nerve/factory
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNerveEvent = createNerveEvent;
exports.createRequestDecisionEvent = createRequestDecisionEvent;
exports.createShieldEvent = createShieldEvent;
exports.createAiSeoEvent = createAiSeoEvent;
/**
 * Generate a unique ID (UUID v4)
 * Falls back to timestamp-based ID if crypto.randomUUID is not available
 */
function generateId() {
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
function sanitizePayload(payload) {
    if (!payload)
        return {};
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
    function sanitizeObject(obj) {
        if (typeof obj !== "object" || obj === null) {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
        }
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            const lowerKey = key.toLowerCase();
            if (sensitiveKeys.some((sk) => lowerKey.includes(sk))) {
                result[key] = "[REDACTED]";
            }
            else if (typeof value === "object" && value !== null) {
                result[key] = sanitizeObject(value);
            }
            else {
                result[key] = value;
            }
        }
        return result;
    }
    return sanitizeObject(sanitized);
}
/**
 * Create a Nerve Event with sampling and sanitization
 *
 * @param params - Event parameters
 * @returns Complete NerveEvent
 */
function createNerveEvent(params) {
    const nowIso = new Date().toISOString();
    const { channelId, kind, priority = 2, context = {}, payload, defaultSampleRate = 0.1, } = params;
    // Determine sample rate
    const sampleRate = context.sampleRate ?? defaultSampleRate;
    // Sample decision (always sample high-priority events)
    const sampled = priority >= 4 ? true : Math.random() < sampleRate;
    // Build full context with defaults
    const finalContext = {
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
function createRequestDecisionEvent(params) {
    // Higher priority for deny/throttle events
    const priority = params.decision === "deny" || params.decision === "throttle" ? 4 : 2;
    // Always sample problems, sample fewer allows
    const defaultSampleRate = params.defaultSampleRate ?? (params.decision === "allow" ? 0.05 : 1.0);
    return createNerveEvent({
        channelId: "HTTP_REQUEST",
        kind: "REQUEST_DECISION",
        priority,
        context: {
            traceId: params.traceId,
            clusterId: params.clusterId,
            tierId: params.tierId,
            citizenId: params.citizenId,
            officeIds: params.officeIds,
            cabinetIds: params.cabinetIds,
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
function createShieldEvent(params) {
    // High priority for threats
    const priority = params.priority ?? (params.kind === "THREAT_DETECTED" ? 5 : 3);
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
function createAiSeoEvent(params) {
    return createNerveEvent({
        channelId: "AI_SEO_EVENT",
        kind: "SEO_APPLIED",
        priority: 2,
        context: {
            traceId: params.traceId,
            clusterId: "AI_SEO",
            tierId: params.tierId,
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
