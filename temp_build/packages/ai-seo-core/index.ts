import {
  SEOOptimization,
  SEOContentType,
  SEOPlatform,
  SEOKeyword,
  Geofence,
  GeofenceRule,
  SEOInsight,
  AISEOCoreContext,
  AISEOCoreStatus,
} from "./types";
import { SEOStore } from "./store/seoStore";
import { runAISEOCycle } from "./scheduler/seoScheduler";
import { optimizeContent } from "./logic/seoOptimizer";
import { createGeofence, checkGeofence, applyGeofenceRules, createGeofenceRule, ensureDefaultGeofences } from "./logic/geofencer";
import { generateSEOInsights } from "./logic/seoInsights";

export const AISEOCore = {
  // Orchestration
  run(context: AISEOCoreContext): AISEOCoreStatus {
    return runAISEOCycle(context);
  },

  status(): AISEOCoreStatus {
    return SEOStore.status();
  },

  // SEO Optimizations
  optimizeContent(
    contentType: SEOContentType,
    contentId: string,
    platform: SEOPlatform,
    title?: string,
    description?: string
  ): SEOOptimization {
    return optimizeContent(contentType, contentId, platform, title, description);
  },

  getOptimization(id: string): SEOOptimization | undefined {
    return SEOStore.getOptimization(id);
  },

  listOptimizations(): SEOOptimization[] {
    return SEOStore.listOptimizations();
  },

  // Keywords
  getKeyword(keyword: string): SEOKeyword | undefined {
    return SEOStore.getKeyword(keyword);
  },

  listKeywords(): SEOKeyword[] {
    return SEOStore.listKeywords();
  },

  getTopKeywords(limit?: number): SEOKeyword[] {
    return SEOStore.getTopKeywords(limit ?? 20);
  },

  // Geofences
  createGeofence(
    name: string,
    type: Geofence["type"],
    options: {
      coordinates?: { lat: number; lng: number; radius?: number };
      countries?: string[];
      regions?: string[];
      cities?: string[];
      priority?: number;
    }
  ): Geofence {
    return createGeofence(name, type, options);
  },

  getGeofence(id: string): Geofence | undefined {
    return SEOStore.getGeofence(id);
  },

  listGeofences(): Geofence[] {
    return SEOStore.listGeofences();
  },

  listActiveGeofences(): Geofence[] {
    return SEOStore.listActiveGeofences();
  },

  checkGeofence(location: {
    country?: string;
    region?: string;
    city?: string;
    coordinates?: { lat: number; lng: number };
  }): Geofence[] {
    return checkGeofence(location);
  },

  ensureDefaultGeofences(): Geofence[] {
    return ensureDefaultGeofences();
  },

  // Geofence Rules
  createGeofenceRule(
    geofenceId: string,
    action: GeofenceRule["action"],
    options?: {
      contentType?: string;
      platform?: string;
      customizations?: Record<string, any>;
    }
  ): GeofenceRule {
    return createGeofenceRule(geofenceId, action, options);
  },

  applyGeofenceRules(
    geofenceIds: string[],
    contentType?: string,
    platform?: string
  ): GeofenceRule[] {
    return applyGeofenceRules(geofenceIds, contentType, platform);
  },

  // Insights
  generateInsights(): SEOInsight[] {
    return generateSEOInsights();
  },

  listInsights(): SEOInsight[] {
    return SEOStore.listInsights();
  },

  listRecentInsights(limit?: number): SEOInsight[] {
    return SEOStore.listRecentInsights(limit ?? 20);
  },
};

export * from "./types";
export * from "./logic/autoSEO";
export default AISEOCore;

