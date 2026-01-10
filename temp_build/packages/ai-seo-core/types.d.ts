export type SEOContentType = "page" | "post" | "product" | "agent" | "pack" | "dream" | "other";
export type SEOPlatform = "web" | "twitter" | "farcaster" | "instagram" | "tiktok" | "youtube" | "linkedin";
export interface SEOKeyword {
    keyword: string;
    difficulty: number;
    volume: number;
    intent: "informational" | "commercial" | "navigational" | "transactional";
    relevance: number;
    discoveredAt: number;
}
export interface SEOOptimization {
    id: string;
    contentType: SEOContentType;
    contentId: string;
    platform: SEOPlatform;
    title?: string;
    description?: string;
    keywords: SEOKeyword[];
    metaTags?: string[];
    structuredData?: Record<string, any>;
    score: number;
    optimizedAt: number;
    lastUpdated: number;
}
export interface Geofence {
    id: string;
    name: string;
    type: "country" | "region" | "city" | "custom";
    coordinates?: {
        lat: number;
        lng: number;
        radius?: number;
    };
    countries?: string[];
    regions?: string[];
    cities?: string[];
    active: boolean;
    priority: number;
    createdAt: number;
    updatedAt: number;
}
export interface GeofenceRule {
    id: string;
    geofenceId: string;
    action: "allow" | "block" | "redirect" | "customize";
    contentType?: SEOContentType;
    platform?: SEOPlatform;
    customizations?: Record<string, any>;
    createdAt: number;
}
export interface SEOInsight {
    id: string;
    type: "opportunity" | "warning" | "recommendation" | "trend";
    title: string;
    description: string;
    priority: "low" | "medium" | "high" | "critical";
    createdAt: number;
    meta?: Record<string, any>;
}
export interface AISEOCoreContext {
    spiderWebCore?: any;
    orcaPackCore?: any;
    whalePackCore?: any;
    narrativeField?: any;
    neuralMesh?: any;
}
export interface AISEOCoreStatus {
    lastRunAt: number | null;
    optimizationCount: number;
    keywordCount: number;
    geofenceCount: number;
    activeGeofences: number;
    avgSEOScore: number;
    recentOptimizations: SEOOptimization[];
    recentInsights: SEOInsight[];
    topKeywords: SEOKeyword[];
}
