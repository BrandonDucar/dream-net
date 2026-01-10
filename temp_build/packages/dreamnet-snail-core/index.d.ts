/**
 * Dream Snail Core
 * Biomimetic: Privacy layer with verifiable provenance trails
 * Know-All Win-All mode: Tracks everything, user controls privacy
 *
 * TEMPORARY: No-op placeholder to avoid blocking server startup
 * TODO: Implement full DreamSnail privacy core
 */
import type { SnailTrail, SnailPrivacyConfig, SnailInsight, SnailStatus } from "./types";
/**
 * DreamSnailCore
 * The Privacy & Provenance Engine
 */
declare class DreamSnailCoreImpl {
    /**
     * Records a new trail event with cryptographic linkage
     */
    recordTrail(identityId: string, eventType: string, eventData: Record<string, unknown>, metadata?: Partial<SnailTrail["metadata"]>): SnailTrail;
    getIdentityTrail(identityId: string, includeEncrypted?: boolean): SnailTrail[];
    getPrivacyConfig(identityId: string): SnailPrivacyConfig;
    updatePrivacyConfig(identityId: string, updates: Partial<SnailPrivacyConfig>): SnailPrivacyConfig;
    getIdentityInsights(identityId: string, severity?: SnailInsight["severity"]): SnailInsight[];
    verifyTrailIntegrity(identityId: string): {
        valid: boolean;
        invalidTrails: string[];
    };
    getAnalytics(identityId: string): {
        totalTrails: number;
        eventTypes: {};
        mostActiveDay: string;
        privacyScore: number;
        insightsCount: number;
    };
    status(): SnailStatus;
}
export declare const DreamSnailCore: DreamSnailCoreImpl;
export * from "./types";
