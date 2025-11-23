/**
 * Dream Snail Core Types
 * Biomimetic: Privacy layer with verifiable provenance trails
 */
export interface SnailTrail {
    id: string;
    identityId: string;
    eventType: string;
    eventData: Record<string, unknown>;
    timestamp: string;
    hash: string;
    previousHash: string | null;
    encrypted: boolean;
    encryptionKey?: string;
    metadata: {
        source: string;
        agent?: string;
        system?: string;
        clusterId?: string;
        privacyLevel: "public" | "private" | "encrypted" | "zero-knowledge";
    };
}
export interface SnailPrivacyConfig {
    identityId: string;
    encryptionEnabled: boolean;
    zeroKnowledgeEnabled: boolean;
    dataRetentionDays: number;
    allowAnalytics: boolean;
    allowTracking: boolean;
    shareWithAgents: string[];
}
export interface SnailInsight {
    id: string;
    identityId: string;
    insightType: "pattern" | "anomaly" | "recommendation" | "privacy-alert";
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    timestamp: string;
    relatedTrails: string[];
    actionable: boolean;
    actionUrl?: string;
}
export interface SnailStatus {
    totalTrails: number;
    totalIdentities: number;
    privacyScore: number;
    integrityValid: boolean;
    lastTrailAt: number;
}
