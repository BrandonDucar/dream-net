export type SEOContentType = "page" | "post" | "product" | "agent" | "pack" | "dream" | "other";

export type SEOPlatform = "web" | "twitter" | "farcaster" | "instagram" | "tiktok" | "youtube" | "linkedin";

export interface SEOKeyword {
  keyword: string;
  difficulty: number;        // 0-1 (how hard to rank)
  volume: number;           // Search volume estimate
  intent: "informational" | "commercial" | "navigational" | "transactional";
  relevance: number;       // 0-1 (how relevant to DreamNet)
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
  score: number;            // 0-100 SEO score
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
    radius?: number;         // km
  };
  countries?: string[];     // ISO country codes
  regions?: string[];        // State/province codes
  cities?: string[];
  active: boolean;
  priority: number;          // 0-1 (higher = more important)
  createdAt: number;
  updatedAt: number;
}

export interface GeofenceRule {
  id: string;
  geofenceId: string;
  action: "allow" | "block" | "redirect" | "customize";
  contentType?: SEOContentType;
  platform?: SEOPlatform;
  customizations?: Record<string, any>;  // Platform-specific customizations
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

