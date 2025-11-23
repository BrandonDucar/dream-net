import { SEOStore } from "./store/seoStore";
import { runAISEOCycle } from "./scheduler/seoScheduler";
import { optimizeContent } from "./logic/seoOptimizer";
import { createGeofence, checkGeofence, applyGeofenceRules, createGeofenceRule, ensureDefaultGeofences } from "./logic/geofencer";
import { generateSEOInsights } from "./logic/seoInsights";
export const AISEOCore = {
    // Orchestration
    run(context) {
        return runAISEOCycle(context);
    },
    status() {
        return SEOStore.status();
    },
    // SEO Optimizations
    optimizeContent(contentType, contentId, platform, title, description) {
        return optimizeContent(contentType, contentId, platform, title, description);
    },
    getOptimization(id) {
        return SEOStore.getOptimization(id);
    },
    listOptimizations() {
        return SEOStore.listOptimizations();
    },
    // Keywords
    getKeyword(keyword) {
        return SEOStore.getKeyword(keyword);
    },
    listKeywords() {
        return SEOStore.listKeywords();
    },
    getTopKeywords(limit) {
        return SEOStore.getTopKeywords(limit ?? 20);
    },
    // Geofences
    createGeofence(name, type, options) {
        return createGeofence(name, type, options);
    },
    getGeofence(id) {
        return SEOStore.getGeofence(id);
    },
    listGeofences() {
        return SEOStore.listGeofences();
    },
    listActiveGeofences() {
        return SEOStore.listActiveGeofences();
    },
    checkGeofence(location) {
        return checkGeofence(location);
    },
    ensureDefaultGeofences() {
        return ensureDefaultGeofences();
    },
    // Geofence Rules
    createGeofenceRule(geofenceId, action, options) {
        return createGeofenceRule(geofenceId, action, options);
    },
    applyGeofenceRules(geofenceIds, contentType, platform) {
        return applyGeofenceRules(geofenceIds, contentType, platform);
    },
    // Insights
    generateInsights() {
        return generateSEOInsights();
    },
    listInsights() {
        return SEOStore.listInsights();
    },
    listRecentInsights(limit) {
        return SEOStore.listRecentInsights(limit ?? 20);
    },
};
export * from "./types";
export * from "./logic/autoSEO";
export default AISEOCore;
