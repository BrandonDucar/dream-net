"use strict";
/**
 * AUTO-SEO Middleware
 * Automatically applies SEO optimization and geofencing to ALL content
 * Zero-touch - works globally for all routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoSEOMiddleware = autoSEOMiddleware;
exports.autoSEORequestMiddleware = autoSEORequestMiddleware;
var ai_seo_core_1 = require("../../packages/ai-seo-core");
var bus_1 = require("../../packages/nerve/src/bus");
var factory_1 = require("../../packages/nerve/src/factory");
/**
 * Middleware that auto-optimizes content before it's saved
 * Detects content creation endpoints and applies SEO automatically
 */
function autoSEOMiddleware(req, res, next) {
    // Only apply to POST/PUT requests (content creation/updates)
    if (req.method !== "POST" && req.method !== "PUT") {
        return next();
    }
    // Detect content type from route
    var path = req.path.toLowerCase();
    var contentType = "post";
    var platform = "web";
    if (path.includes("/dream") || path.includes("/post")) {
        contentType = "post";
    }
    else if (path.includes("/product") || path.includes("/shop")) {
        contentType = "product";
    }
    else if (path.includes("/page")) {
        contentType = "page";
    }
    // Detect platform from headers or path
    if (path.includes("/twitter") || req.headers["x-platform"] === "twitter") {
        platform = "twitter";
    }
    else if (path.includes("/farcaster") || req.headers["x-platform"] === "farcaster") {
        platform = "farcaster";
    }
    else if (path.includes("/instagram") || req.headers["x-platform"] === "instagram") {
        platform = "instagram";
    }
    else if (path.includes("/tiktok") || req.headers["x-platform"] === "tiktok") {
        platform = "tiktok";
    }
    else if (path.includes("/youtube") || req.headers["x-platform"] === "youtube") {
        platform = "youtube";
    }
    else if (path.includes("/linkedin") || req.headers["x-platform"] === "linkedin") {
        platform = "linkedin";
    }
    // Extract user location
    var userLocation = (0, ai_seo_core_1.extractLocationFromRequest)(req);
    // Intercept response to auto-optimize content
    var originalJson = res.json.bind(res);
    res.json = function (body) {
        // Auto-optimize if content was created/updated
        if (body && (body.dream || body.post || body.product || body.content)) {
            var content = body.dream || body.post || body.product || body.content;
            if (content && (content.title || content.name || content.text)) {
                var title = content.title || content.name || content.text || "";
                var description = content.description || content.text || "";
                var contentId = content.id || "content:".concat(Date.now());
                try {
                    // Auto-optimize
                    var optimized = (0, ai_seo_core_1.autoOptimizeContent)(contentType, contentId, title, description, platform, userLocation);
                    // Attach SEO data to response
                    if (!body.seo) {
                        body.seo = {};
                    }
                    body.seo.optimized = {
                        title: optimized.optimizedTitle,
                        description: optimized.optimizedDescription,
                        score: optimized.seoScore,
                        keywords: optimized.keywords,
                        geofences: optimized.geofences,
                        metaTags: optimized.metaTags,
                    };
                    // Update content with optimized values (if not already set)
                    if (content.title && !content.seoOptimizedTitle) {
                        content.seoOptimizedTitle = optimized.optimizedTitle;
                    }
                    if (content.description && !content.seoOptimizedDescription) {
                        content.seoOptimizedDescription = optimized.optimizedDescription;
                    }
                    if (!content.seoKeywords) {
                        content.seoKeywords = optimized.keywords;
                    }
                    if (!content.geofences) {
                        content.geofences = optimized.geofences;
                    }
                    console.log("[AutoSEO] \u2705 Auto-optimized ".concat(contentType, " ").concat(contentId, " (Score: ").concat(optimized.seoScore, "/100)"));
                }
                catch (error) {
                    console.warn("[AutoSEO] \u26A0\uFE0F  Auto-optimization failed:", error);
                    // Don't fail the request if SEO fails
                }
            }
        }
        return originalJson(body);
    };
    next();
}
/**
 * Express middleware that auto-optimizes request body before processing
 */
function autoSEORequestMiddleware(req, res, next) {
    // Apply to ALL POST/PUT requests - auto-detect content
    // This ensures SEO applies to EVERYTHING automatically
    if (req.method !== "POST" && req.method !== "PUT" && req.method !== "PATCH") {
        return next();
    }
    // Auto-detect if this is content creation by checking for common fields
    var hasContentFields = req.body &&
        (req.body.title ||
            req.body.name ||
            req.body.dreamName ||
            req.body.text ||
            req.body.description ||
            req.body.content ||
            req.body.dreamContent ||
            req.body.post ||
            req.body.product);
    if (!hasContentFields) {
        return next();
    }
    // Extract location
    var userLocation = (0, ai_seo_core_1.extractLocationFromRequest)(req);
    // Auto-optimize request body
    if (req.body) {
        var title = req.body.title || req.body.name || req.body.dreamName || "";
        var description = req.body.description || req.body.text || "";
        if (title || description) {
            try {
                // Determine content type
                var contentType = "post";
                if (req.path.includes("/product"))
                    contentType = "product";
                if (req.path.includes("/page"))
                    contentType = "page";
                // Determine platform
                var platform = "web";
                if (req.headers["x-platform"]) {
                    platform = req.headers["x-platform"];
                }
                var contentId = req.body.id || "content:".concat(Date.now());
                // Auto-optimize
                var optimized = (0, ai_seo_core_1.autoOptimizeContent)(contentType, contentId, title, description, platform, userLocation);
                // Attach optimized data to request body
                req.body.seoOptimized = {
                    title: optimized.optimizedTitle,
                    description: optimized.optimizedDescription,
                    score: optimized.seoScore,
                    keywords: optimized.keywords,
                    geofences: optimized.geofences,
                    metaTags: optimized.metaTags,
                };
                // Optionally replace title/description with optimized versions
                // (Can be made configurable)
                if (process.env.AUTO_SEO_REPLACE === "true") {
                    req.body.title = optimized.optimizedTitle;
                    req.body.description = optimized.optimizedDescription;
                }
                // Add SEO metadata
                req.body.seoKeywords = optimized.keywords;
                req.body.geofences = optimized.geofences;
                req.body.seoScore = optimized.seoScore;
                console.log("[AutoSEO] \uD83D\uDD0D Auto-optimized request for ".concat(contentType, " (Score: ").concat(optimized.seoScore, "/100)"));
                // Publish Nerve Event for SEO application
                try {
                    var traceId = req.traceId;
                    var callerIdentity = req.callerIdentity;
                    var nerveEvent = (0, factory_1.createAiSeoEvent)({
                        traceId: traceId,
                        routeId: req.path,
                        seoScore: optimized.seoScore,
                        keywords: optimized.keywords,
                        geofencesApplied: optimized.geofences,
                        geo: userLocation,
                        tierId: callerIdentity === null || callerIdentity === void 0 ? void 0 : callerIdentity.tierId,
                        defaultSampleRate: 0.2,
                    });
                    bus_1.NERVE_BUS.publish(nerveEvent);
                }
                catch (error) {
                    // Don't break request pipeline if Nerve event fails
                    console.error("[AutoSEO] Failed to publish Nerve event:", error);
                }
            }
            catch (error) {
                console.warn("[AutoSEO] \u26A0\uFE0F  Request optimization failed:", error);
                // Continue even if optimization fails
            }
        }
    }
    next();
}
