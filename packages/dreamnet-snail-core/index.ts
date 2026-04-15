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
class DreamSnailCorePlaceholder {
  recordTrail(
    _identityId: string,
    _eventType: string,
    _eventData: Record<string, unknown>,
    _metadata?: Partial<SnailTrail["metadata"]>
  ): SnailTrail {
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

  getIdentityTrail(_identityId: string, _includeEncrypted: boolean = false): SnailTrail[] {
    return [];
  }

  getPrivacyConfig(_identityId: string): SnailPrivacyConfig {
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

  updatePrivacyConfig(_identityId: string, _updates: Partial<SnailPrivacyConfig>): SnailPrivacyConfig {
    return this.getPrivacyConfig(_identityId);
  }

  getIdentityInsights(_identityId: string, _severity?: SnailInsight["severity"]): SnailInsight[] {
    return [];
  }

  verifyTrailIntegrity(_identityId: string): { valid: boolean; invalidTrails: string[] } {
    return { valid: true, invalidTrails: [] };
  }

  getAnalytics(_identityId: string): {
    totalTrails: number;
    eventTypes: Record<string, number>;
    mostActiveDay: string;
    privacyScore: number;
    insightsCount: number;
  } {
    return {
      totalTrails: 0,
      eventTypes: {},
      mostActiveDay: "N/A",
      privacyScore: 50,
      insightsCount: 0,
    };
  }

  status(): SnailStatus {
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
