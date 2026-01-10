"use strict";
/**
 * AUTO-SEO: Zero-touch SEO optimization for all content
 * Automatically optimizes ALL content without manual calls
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoOptimizeContent = autoOptimizeContent;
exports.extractLocationFromRequest = extractLocationFromRequest;
exports.autoOptimizeDream = autoOptimizeDream;
exports.autoOptimizeSocialPost = autoOptimizeSocialPost;
exports.autoOptimizeProduct = autoOptimizeProduct;
const index_1 = require("../index");
/**
 * Auto-optimize content based on context
 * This runs automatically - no manual calls needed
 */
function autoOptimizeContent(contentType, contentId, title, description, platform = "web", userLocation) {
    // 1. Auto-optimize with SEO
    const seoOptimization = index_1.AISEOCore.optimizeContent(contentType, contentId, platform, title, description);
    // 2. Auto-apply geofencing if location provided
    let geofences = [];
    if (userLocation) {
        const matchingGeofences = index_1.AISEOCore.checkGeofence(userLocation);
        geofences = matchingGeofences.map((g) => g.id);
        // Apply geofence rules
        if (geofences.length > 0) {
            const rules = index_1.AISEOCore.applyGeofenceRules(geofences, contentType, platform);
            // Apply customizations from rules
            for (const rule of rules) {
                if (rule.action === "customize" && rule.customizations) {
                    // Could customize title/description based on location
                    // For now, just track that geofence matched
                }
            }
        }
    }
    return {
        optimizedTitle: seoOptimization.title,
        optimizedDescription: seoOptimization.description,
        seoScore: seoOptimization.score,
        keywords: seoOptimization.keywords.map((k) => k.keyword),
        geofences,
        metaTags: seoOptimization.metaTags,
    };
}
/**
 * Extract location from request headers/IP
 */
function extractLocationFromRequest(req) {
    const location = {};
    // Check for explicit location headers
    if (req.headers["x-user-country"]) {
        location.country = req.headers["x-user-country"];
    }
    if (req.headers["x-user-region"]) {
        location.region = req.headers["x-user-region"];
    }
    if (req.headers["x-user-city"]) {
        location.city = req.headers["x-user-city"];
    }
    // Check for IP-based location (if available)
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
    if (ip) {
        // In production, would use IP geolocation service
        // For now, return empty (can be enhanced)
    }
    return location;
}
/**
 * Auto-optimize dream content
 */
function autoOptimizeDream(dreamId, title, description, userLocation) {
    return autoOptimizeContent("post", dreamId, title, description, "web", userLocation);
}
/**
 * Auto-optimize social post
 */
function autoOptimizeSocialPost(postId, platform, text, userLocation) {
    return autoOptimizeContent("post", postId, platform, text, text, userLocation);
}
/**
 * Auto-optimize product
 */
function autoOptimizeProduct(productId, name, description, platform = "web", userLocation) {
    return autoOptimizeContent("product", productId, platform, name, description, userLocation);
}
