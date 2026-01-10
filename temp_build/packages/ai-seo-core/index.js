"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AISEOCore = void 0;
const seoStore_1 = require("./store/seoStore");
const seoScheduler_1 = require("./scheduler/seoScheduler");
const seoOptimizer_1 = require("./logic/seoOptimizer");
const geofencer_1 = require("./logic/geofencer");
const seoInsights_1 = require("./logic/seoInsights");
exports.AISEOCore = {
    // Orchestration
    run(context) {
        return (0, seoScheduler_1.runAISEOCycle)(context);
    },
    status() {
        return seoStore_1.SEOStore.status();
    },
    // SEO Optimizations
    optimizeContent(contentType, contentId, platform, title, description) {
        return (0, seoOptimizer_1.optimizeContent)(contentType, contentId, platform, title, description);
    },
    getOptimization(id) {
        return seoStore_1.SEOStore.getOptimization(id);
    },
    listOptimizations() {
        return seoStore_1.SEOStore.listOptimizations();
    },
    // Keywords
    getKeyword(keyword) {
        return seoStore_1.SEOStore.getKeyword(keyword);
    },
    listKeywords() {
        return seoStore_1.SEOStore.listKeywords();
    },
    getTopKeywords(limit) {
        return seoStore_1.SEOStore.getTopKeywords(limit ?? 20);
    },
    // Geofences
    createGeofence(name, type, options) {
        return (0, geofencer_1.createGeofence)(name, type, options);
    },
    getGeofence(id) {
        return seoStore_1.SEOStore.getGeofence(id);
    },
    listGeofences() {
        return seoStore_1.SEOStore.listGeofences();
    },
    listActiveGeofences() {
        return seoStore_1.SEOStore.listActiveGeofences();
    },
    checkGeofence(location) {
        return (0, geofencer_1.checkGeofence)(location);
    },
    ensureDefaultGeofences() {
        return (0, geofencer_1.ensureDefaultGeofences)();
    },
    // Geofence Rules
    createGeofenceRule(geofenceId, action, options) {
        return (0, geofencer_1.createGeofenceRule)(geofenceId, action, options);
    },
    applyGeofenceRules(geofenceIds, contentType, platform) {
        return (0, geofencer_1.applyGeofenceRules)(geofenceIds, contentType, platform);
    },
    // Insights
    generateInsights() {
        return (0, seoInsights_1.generateSEOInsights)();
    },
    listInsights() {
        return seoStore_1.SEOStore.listInsights();
    },
    listRecentInsights(limit) {
        return seoStore_1.SEOStore.listRecentInsights(limit ?? 20);
    },
};
__exportStar(require("./types"), exports);
__exportStar(require("./logic/autoSEO"), exports);
exports.default = exports.AISEOCore;
