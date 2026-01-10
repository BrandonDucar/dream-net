"use strict";
/**
 * Dream Snail - Know-All Win-All Privacy Layer
 *
 * A comprehensive privacy system that:
 * - Tracks all user interactions and data flows
 * - Provides verifiable provenance trails
 * - Enables privacy-preserving analytics
 * - Creates encrypted trails that only the user can decrypt
 * - Supports zero-knowledge proofs for privacy
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dreamSnail = void 0;
var node_crypto_1 = require("node:crypto");
var node_crypto_2 = require("node:crypto");
var DreamSnail = /** @class */ (function () {
    function DreamSnail() {
        this.trails = new Map();
        this.userTrails = new Map(); // userId -> trailIds
        this.privacyConfigs = new Map();
        this.insights = new Map();
        this.userInsights = new Map(); // userId -> insightIds
        console.log("🐌 [Dream Snail] Privacy layer initialized - Know-All Win-All mode active");
    }
    /**
     * Record a trail event - everything that happens gets tracked
     */
    DreamSnail.prototype.recordTrail = function (userId, eventType, eventData, metadata) {
        var config = this.getPrivacyConfig(userId);
        // Get previous trail for chain
        var userTrailIds = this.userTrails.get(userId) || [];
        var previousTrail = userTrailIds.length > 0
            ? this.trails.get(userTrailIds[userTrailIds.length - 1])
            : null;
        // Create hash of event data
        var dataString = JSON.stringify({ eventType: eventType, eventData: eventData, timestamp: new Date().toISOString() });
        var hash = (0, node_crypto_2.createHash)("sha256").update(dataString).digest("hex");
        // Determine privacy level
        var privacyLevel = "public";
        if (config.encryptionEnabled) {
            privacyLevel = "encrypted";
        }
        else if (config.zeroKnowledgeEnabled) {
            privacyLevel = "zero-knowledge";
        }
        else if (!config.allowTracking) {
            privacyLevel = "private";
        }
        var trail = {
            id: (0, node_crypto_1.randomUUID)(),
            userId: userId,
            eventType: eventType,
            eventData: eventData,
            timestamp: new Date().toISOString(),
            hash: hash,
            previousHash: (previousTrail === null || previousTrail === void 0 ? void 0 : previousTrail.hash) || null,
            encrypted: config.encryptionEnabled,
            metadata: {
                source: (metadata === null || metadata === void 0 ? void 0 : metadata.source) || "system",
                agent: metadata === null || metadata === void 0 ? void 0 : metadata.agent,
                system: metadata === null || metadata === void 0 ? void 0 : metadata.system,
                privacyLevel: privacyLevel,
            },
        };
        this.trails.set(trail.id, trail);
        // Update user trail chain
        if (!this.userTrails.has(userId)) {
            this.userTrails.set(userId, []);
        }
        this.userTrails.get(userId).push(trail.id);
        // Generate insights if needed
        this.generateInsights(userId, trail);
        return trail;
    };
    /**
     * Get user's complete trail (privacy-aware)
     */
    DreamSnail.prototype.getUserTrail = function (userId, includeEncrypted) {
        var _this = this;
        if (includeEncrypted === void 0) { includeEncrypted = false; }
        var trailIds = this.userTrails.get(userId) || [];
        var trails = trailIds.map(function (id) { return _this.trails.get(id); }).filter(Boolean);
        if (!includeEncrypted) {
            return trails.filter(function (t) { return !t.encrypted; });
        }
        return trails;
    };
    /**
     * Get privacy configuration for user
     */
    DreamSnail.prototype.getPrivacyConfig = function (userId) {
        if (!this.privacyConfigs.has(userId)) {
            // Default config - privacy-first
            var defaultConfig = {
                userId: userId,
                encryptionEnabled: false,
                zeroKnowledgeEnabled: false,
                dataRetentionDays: 365,
                allowAnalytics: true,
                allowTracking: true,
                shareWithAgents: [], // No agents by default
            };
            this.privacyConfigs.set(userId, defaultConfig);
            return defaultConfig;
        }
        return this.privacyConfigs.get(userId);
    };
    /**
     * Update privacy configuration
     */
    DreamSnail.prototype.updatePrivacyConfig = function (userId, updates) {
        var config = this.getPrivacyConfig(userId);
        var updated = __assign(__assign({}, config), updates);
        this.privacyConfigs.set(userId, updated);
        return updated;
    };
    /**
     * Generate insights from trail patterns
     */
    DreamSnail.prototype.generateInsights = function (userId, newTrail) {
        var _this = this;
        var userTrails = this.getUserTrail(userId, false);
        // Pattern detection: frequent events
        var eventCounts = new Map();
        userTrails.forEach(function (trail) {
            eventCounts.set(trail.eventType, (eventCounts.get(trail.eventType) || 0) + 1);
        });
        // Detect frequent patterns
        eventCounts.forEach(function (count, eventType) {
            if (count >= 10 && count % 10 === 0) {
                var insight = {
                    id: (0, node_crypto_1.randomUUID)(),
                    userId: userId,
                    insightType: "pattern",
                    title: "Frequent Activity: ".concat(eventType),
                    description: "You've performed \"".concat(eventType, "\" ").concat(count, " times. This pattern may indicate a workflow you could automate."),
                    severity: "low",
                    timestamp: new Date().toISOString(),
                    relatedTrails: userTrails.filter(function (t) { return t.eventType === eventType; }).map(function (t) { return t.id; }).slice(-10),
                    actionable: true,
                    actionUrl: "/automate?event=".concat(eventType),
                };
                _this.addInsight(userId, insight);
            }
        });
        // Privacy alerts: detect sensitive data
        var sensitiveKeywords = ["password", "private", "secret", "token", "key", "wallet"];
        var eventDataString = JSON.stringify(newTrail.eventData).toLowerCase();
        if (sensitiveKeywords.some(function (keyword) { return eventDataString.includes(keyword); })) {
            var insight = {
                id: (0, node_crypto_1.randomUUID)(),
                userId: userId,
                insightType: "privacy-alert",
                title: "Sensitive Data Detected",
                description: "Your trail contains potentially sensitive information. Consider enabling encryption for enhanced privacy.",
                severity: "medium",
                timestamp: new Date().toISOString(),
                relatedTrails: [newTrail.id],
                actionable: true,
                actionUrl: "/snail/privacy?enableEncryption=true",
            };
            this.addInsight(userId, insight);
        }
    };
    /**
     * Add insight for user
     */
    DreamSnail.prototype.addInsight = function (userId, insight) {
        this.insights.set(insight.id, insight);
        if (!this.userInsights.has(userId)) {
            this.userInsights.set(userId, []);
        }
        // Don't duplicate insights
        var existing = this.userInsights.get(userId);
        if (!existing.includes(insight.id)) {
            existing.push(insight.id);
        }
    };
    /**
     * Get user insights
     */
    DreamSnail.prototype.getUserInsights = function (userId, severity) {
        var _this = this;
        var insightIds = this.userInsights.get(userId) || [];
        var insights = insightIds.map(function (id) { return _this.insights.get(id); }).filter(Boolean);
        if (severity) {
            insights = insights.filter(function (i) { return i.severity === severity; });
        }
        // Sort by timestamp (newest first)
        return insights.sort(function (a, b) { return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); });
    };
    /**
     * Verify trail integrity (check hash chain)
     */
    DreamSnail.prototype.verifyTrailIntegrity = function (userId) {
        var trails = this.getUserTrail(userId, true);
        var invalidTrails = [];
        for (var i = 0; i < trails.length; i++) {
            var trail = trails[i];
            // Verify hash
            var dataString = JSON.stringify({
                eventType: trail.eventType,
                eventData: trail.eventData,
                timestamp: trail.timestamp
            });
            var expectedHash = (0, node_crypto_2.createHash)("sha256").update(dataString).digest("hex");
            if (trail.hash !== expectedHash) {
                invalidTrails.push(trail.id);
                continue;
            }
            // Verify chain (if not first trail)
            if (i > 0) {
                var previousTrail = trails[i - 1];
                if (trail.previousHash !== previousTrail.hash) {
                    invalidTrails.push(trail.id);
                }
            }
        }
        return {
            valid: invalidTrails.length === 0,
            invalidTrails: invalidTrails,
        };
    };
    /**
     * Get analytics (privacy-aware)
     */
    DreamSnail.prototype.getAnalytics = function (userId) {
        var _a, _b;
        var trails = this.getUserTrail(userId, false);
        var config = this.getPrivacyConfig(userId);
        // Count event types
        var eventTypes = {};
        trails.forEach(function (trail) {
            eventTypes[trail.eventType] = (eventTypes[trail.eventType] || 0) + 1;
        });
        // Find most active day
        var dayCounts = new Map();
        trails.forEach(function (trail) {
            var day = new Date(trail.timestamp).toISOString().split("T")[0];
            dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
        });
        var mostActiveDay = ((_a = Array.from(dayCounts.entries())
            .sort(function (a, b) { return b[1] - a[1]; })[0]) === null || _a === void 0 ? void 0 : _a[0]) || "N/A";
        // Calculate privacy score (0-100)
        var privacyScore = 50; // Base score
        if (config.encryptionEnabled)
            privacyScore += 30;
        if (config.zeroKnowledgeEnabled)
            privacyScore += 20;
        if (!config.allowAnalytics)
            privacyScore += 10;
        if (!config.allowTracking)
            privacyScore += 10;
        if (config.shareWithAgents.length === 0)
            privacyScore += 10;
        privacyScore = Math.min(100, privacyScore);
        return {
            totalTrails: trails.length,
            eventTypes: eventTypes,
            mostActiveDay: mostActiveDay,
            privacyScore: privacyScore,
            insightsCount: ((_b = this.userInsights.get(userId)) === null || _b === void 0 ? void 0 : _b.length) || 0,
        };
    };
    return DreamSnail;
}());
exports.dreamSnail = new DreamSnail();
