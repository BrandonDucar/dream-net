export type APICategory = "sms" | "email" | "social" | "ai" | "blockchain" | "payment" | "storage" | "analytics" | "search" | "other";
export type APIProviderStatus = "active" | "inactive" | "deprecated" | "testing";
export type APIKeyStatus = "active" | "expired" | "rate-limited" | "quota-exceeded" | "invalid";
export interface APIPricing {
    freeTier?: {
        requests: number;
        features: string[];
    };
    paidTiers: {
        name: string;
        price: number;
        requests: number;
        pricePerRequest?: number;
        features: string[];
    }[];
    payPerUse?: {
        pricePerRequest: number;
        pricePer1k?: number;
    };
}
export interface APIProvider {
    id: string;
    name: string;
    category: APICategory;
    status: APIProviderStatus;
    description: string;
    website: string;
    documentationUrl: string;
    pricing: APIPricing;
    features: string[];
    supportedRegions?: string[];
    rateLimits?: {
        requestsPerSecond?: number;
        requestsPerMinute?: number;
        requestsPerHour?: number;
        requestsPerDay?: number;
    };
    reliability: number;
    latency: number;
    quality: number;
    discoveredAt: number;
    lastCheckedAt: number;
    meta?: Record<string, any>;
}
export interface APIKey {
    id: string;
    providerId: string;
    name: string;
    key: string;
    secret?: string;
    status: APIKeyStatus;
    usageCount: number;
    usageThisMonth: number;
    quotaLimit?: number;
    quotaUsed?: number;
    costThisMonth: number;
    costTotal: number;
    rateLimitResetAt?: number;
    rateLimitRemaining?: number;
    createdAt: number;
    lastUsedAt: number;
    expiresAt?: number;
    tags?: string[];
    meta?: Record<string, any>;
}
export interface APIRequest {
    id: string;
    category: APICategory;
    operation: string;
    params: Record<string, any>;
    preferredProvider?: string;
    requiredFeatures?: string[];
    maxCost?: number;
    priority: "low" | "medium" | "high" | "critical";
    providerUsed?: string;
    keyUsed?: string;
    success: boolean;
    response?: any;
    error?: string;
    cost?: number;
    latency?: number;
    requestedAt: number;
    completedAt?: number;
}
export interface APIRoutingDecision {
    providerId: string;
    keyId: string;
    reason: string;
    estimatedCost: number;
    confidence: number;
    alternatives?: {
        providerId: string;
        keyId: string;
        estimatedCost: number;
        reason: string;
    }[];
}
export interface APIRailGuard {
    id: string;
    name: string;
    type: "daily-cost" | "monthly-cost" | "rate-limit" | "quota" | "quality" | "custom";
    limit: number;
    current: number;
    action: "block" | "warn" | "route-to-backup" | "throttle";
    enabled: boolean;
    createdAt: number;
    updatedAt: number;
}
export interface APIKeeperContext {
    dreamStateCore?: any;
    spiderWebCore?: any;
    economicEngineCore?: any;
}
export interface APIKeeperStatus {
    lastRunAt: number | null;
    providerCount: number;
    activeProviderCount: number;
    keyCount: number;
    activeKeyCount: number;
    totalRequests: number;
    requestsToday: number;
    costToday: number;
    costThisMonth: number;
    railGuardsActive: number;
    recentRequests: APIRequest[];
    topProviders: {
        providerId: string;
        requestCount: number;
        cost: number;
    }[];
}
