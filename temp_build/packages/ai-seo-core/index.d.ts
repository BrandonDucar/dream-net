import { SEOOptimization, SEOContentType, SEOPlatform, SEOKeyword, Geofence, GeofenceRule, SEOInsight, AISEOCoreContext, AISEOCoreStatus } from "./types";
export declare const AISEOCore: {
    run(context: AISEOCoreContext): AISEOCoreStatus;
    status(): AISEOCoreStatus;
    optimizeContent(contentType: SEOContentType, contentId: string, platform: SEOPlatform, title?: string, description?: string): SEOOptimization;
    getOptimization(id: string): SEOOptimization | undefined;
    listOptimizations(): SEOOptimization[];
    getKeyword(keyword: string): SEOKeyword | undefined;
    listKeywords(): SEOKeyword[];
    getTopKeywords(limit?: number): SEOKeyword[];
    createGeofence(name: string, type: Geofence["type"], options: {
        coordinates?: {
            lat: number;
            lng: number;
            radius?: number;
        };
        countries?: string[];
        regions?: string[];
        cities?: string[];
        priority?: number;
    }): Geofence;
    getGeofence(id: string): Geofence | undefined;
    listGeofences(): Geofence[];
    listActiveGeofences(): Geofence[];
    checkGeofence(location: {
        country?: string;
        region?: string;
        city?: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    }): Geofence[];
    ensureDefaultGeofences(): Geofence[];
    createGeofenceRule(geofenceId: string, action: GeofenceRule["action"], options?: {
        contentType?: string;
        platform?: string;
        customizations?: Record<string, any>;
    }): GeofenceRule;
    applyGeofenceRules(geofenceIds: string[], contentType?: string, platform?: string): GeofenceRule[];
    generateInsights(): SEOInsight[];
    listInsights(): SEOInsight[];
    listRecentInsights(limit?: number): SEOInsight[];
};
export * from "./types";
export * from "./logic/autoSEO";
export default AISEOCore;
