const optimizations = new Map();
const keywords = new Map();
const geofences = new Map();
const geofenceRules = new Map();
const insights = [];
let lastRunAt = null;
export const SEOStore = {
    // Optimizations
    addOptimization(optimization) {
        optimizations.set(optimization.id, optimization);
        return optimization;
    },
    getOptimization(id) {
        return optimizations.get(id);
    },
    listOptimizations() {
        return Array.from(optimizations.values());
    },
    // Keywords
    addKeyword(keyword) {
        keywords.set(keyword.keyword.toLowerCase(), keyword);
        return keyword;
    },
    getKeyword(keyword) {
        return keywords.get(keyword.toLowerCase());
    },
    listKeywords() {
        return Array.from(keywords.values());
    },
    getTopKeywords(limit = 20) {
        return Array.from(keywords.values())
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, limit);
    },
    // Geofences
    addGeofence(geofence) {
        geofences.set(geofence.id, geofence);
        return geofence;
    },
    getGeofence(id) {
        return geofences.get(id);
    },
    listGeofences() {
        return Array.from(geofences.values());
    },
    listActiveGeofences() {
        return Array.from(geofences.values()).filter((g) => g.active);
    },
    // Geofence Rules
    addGeofenceRule(rule) {
        geofenceRules.set(rule.id, rule);
        return rule;
    },
    getGeofenceRule(id) {
        return geofenceRules.get(id);
    },
    listGeofenceRules() {
        return Array.from(geofenceRules.values());
    },
    listRulesForGeofence(geofenceId) {
        return Array.from(geofenceRules.values()).filter((r) => r.geofenceId === geofenceId);
    },
    // Insights
    addInsight(insight) {
        insights.push(insight);
        if (insights.length > 1000) {
            insights.shift();
        }
        return insight;
    },
    listInsights() {
        return insights;
    },
    listRecentInsights(limit = 20) {
        return insights.slice(-limit).reverse();
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
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
