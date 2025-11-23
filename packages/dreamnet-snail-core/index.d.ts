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
 * No-op DreamSnailCore placeholder
 * Provides all expected methods but does nothing
 */
declare class DreamSnailCorePlaceholder {
    recordTrail(_identityId: string, _eventType: string, _eventData: Record<string, unknown>, _metadata?: Partial<SnailTrail["metadata"]>): SnailTrail;
    getIdentityTrail(_identityId: string, _includeEncrypted?: boolean): SnailTrail[];
    getPrivacyConfig(_identityId: string): SnailPrivacyConfig;
    updatePrivacyConfig(_identityId: string, _updates: Partial<SnailPrivacyConfig>): SnailPrivacyConfig;
    getIdentityInsights(_identityId: string, _severity?: SnailInsight["severity"]): SnailInsight[];
    verifyTrailIntegrity(_identityId: string): {
        valid: boolean;
        invalidTrails: string[];
    };
    getAnalytics(_identityId: string): {
        totalTrails: number;
        eventTypes: Record<string, number>;
        mostActiveDay: string;
        privacyScore: number;
        insightsCount: number;
    };
    status(): SnailStatus;
}
export declare const DreamSnailCore: DreamSnailCorePlaceholder;
export * from "./types";
