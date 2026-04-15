import {
  SEOOptimization,
  SEOKeyword,
  Geofence,
  GeofenceRule,
  SEOInsight,
  AISEOCoreStatus,
} from "../types";

const optimizations: Map<string, SEOOptimization> = new Map();
const keywords: Map<string, SEOKeyword> = new Map();
const geofences: Map<string, Geofence> = new Map();
const geofenceRules: Map<string, GeofenceRule> = new Map();
const insights: SEOInsight[] = [];

let lastRunAt: number | null = null;

export const SEOStore = {
  // Optimizations
  addOptimization(optimization: SEOOptimization): SEOOptimization {
    optimizations.set(optimization.id, optimization);
    return optimization;
  },

  getOptimization(id: string): SEOOptimization | undefined {
    return optimizations.get(id);
  },

  listOptimizations(): SEOOptimization[] {
    return Array.from(optimizations.values());
  },

  // Keywords
  addKeyword(keyword: SEOKeyword): SEOKeyword {
    keywords.set(keyword.keyword.toLowerCase(), keyword);
    return keyword;
  },

  getKeyword(keyword: string): SEOKeyword | undefined {
    return keywords.get(keyword.toLowerCase());
  },

  listKeywords(): SEOKeyword[] {
    return Array.from(keywords.values());
  },

  getTopKeywords(limit: number = 20): SEOKeyword[] {
    return Array.from(keywords.values())
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);
  },

  // Geofences
  addGeofence(geofence: Geofence): Geofence {
    geofences.set(geofence.id, geofence);
    return geofence;
  },

  getGeofence(id: string): Geofence | undefined {
    return geofences.get(id);
  },

  listGeofences(): Geofence[] {
    return Array.from(geofences.values());
  },

  listActiveGeofences(): Geofence[] {
    return Array.from(geofences.values()).filter((g) => g.active);
  },

  // Geofence Rules
  addGeofenceRule(rule: GeofenceRule): GeofenceRule {
    geofenceRules.set(rule.id, rule);
    return rule;
  },

  getGeofenceRule(id: string): GeofenceRule | undefined {
    return geofenceRules.get(id);
  },

  listGeofenceRules(): GeofenceRule[] {
    return Array.from(geofenceRules.values());
  },

  listRulesForGeofence(geofenceId: string): GeofenceRule[] {
    return Array.from(geofenceRules.values()).filter((r) => r.geofenceId === geofenceId);
  },

  // Insights
  addInsight(insight: SEOInsight): SEOInsight {
    insights.push(insight);
    if (insights.length > 1000) {
      insights.shift();
    }
    return insight;
  },

  listInsights(): SEOInsight[] {
    return insights;
  },

  listRecentInsights(limit: number = 20): SEOInsight[] {
    return insights.slice(-limit).reverse();
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): AISEOCoreStatus {
    const allOptimizations = Array.from(optimizations.values());
    const avgSEOScore = allOptimizations.length > 0
      ? allOptimizations.reduce((sum, o) => sum + o.score, 0) / allOptimizations.length
      : 0;

    return {
      lastRunAt,
      optimizationCount: allOptimizations.length,
      keywordCount: keywords.size,
      geofenceCount: geofences.size,
      activeGeofences: this.listActiveGeofences().length,
      avgSEOScore,
      recentOptimizations: allOptimizations.slice(-20).reverse(),
      recentInsights: this.listRecentInsights(20),
      topKeywords: this.getTopKeywords(20),
    };
  },
};

