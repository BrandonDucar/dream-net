/**
 * Dream Snail Core
 * Biomimetic: Privacy layer with verifiable provenance trails
 * Know-All Win-All mode: Tracks everything, user controls privacy
 *
 * TEMPORARY: No-op placeholder to avoid blocking server startup
 * TODO: Implement full DreamSnail privacy core
 */
/**
 * No-op DreamSnailCore placeholder
 * Provides all expected methods but does nothing
 */
class DreamSnailCorePlaceholder {
    recordTrail(_identityId, _eventType, _eventData, _metadata) {
        // No-op: return empty trail
        return {
            id: "placeholder",
            identityId: _identityId,
            eventType: _eventType,
            eventData: _eventData,
            timestamp: new Date().toISOString(),
            hash: "placeholder",
            previousHash: null,
            encrypted: false,
            metadata: {
                source: "system",
                privacyLevel: "public",
                ..._metadata,
            },
        };
    }
    getIdentityTrail(_identityId, _includeEncrypted = false) {
        return [];
    }
    getPrivacyConfig(_identityId) {
        return {
            identityId: _identityId,
            encryptionEnabled: false,
            zeroKnowledgeEnabled: false,
            dataRetentionDays: 365,
            allowAnalytics: true,
            allowTracking: true,
            shareWithAgents: [],
        };
    }
    updatePrivacyConfig(_identityId, _updates) {
        return this.getPrivacyConfig(_identityId);
    }
    getIdentityInsights(_identityId, _severity) {
        return [];
    }
    verifyTrailIntegrity(_identityId) {
        return { valid: true, invalidTrails: [] };
    }
    getAnalytics(_identityId) {
        return {
            totalTrails: 0,
            eventTypes: {},
            mostActiveDay: "N/A",
            privacyScore: 50,
            insightsCount: 0,
        };
    }
    status() {
        return {
            totalTrails: 0,
            totalIdentities: 0,
            privacyScore: 50,
            integrityValid: true,
            lastTrailAt: 0,
        };
    }
}
// Export singleton instance
export const DreamSnailCore = new DreamSnailCorePlaceholder();
// Export types
export * from "./types";
