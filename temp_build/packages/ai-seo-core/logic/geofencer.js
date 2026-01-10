"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGeofence = createGeofence;
exports.checkGeofence = checkGeofence;
exports.applyGeofenceRules = applyGeofenceRules;
exports.createGeofenceRule = createGeofenceRule;
exports.ensureDefaultGeofences = ensureDefaultGeofences;
const seoStore_1 = require("../store/seoStore");
let geofenceCounter = 0;
function nextGeofenceId() {
    geofenceCounter += 1;
    return `geofence:${Date.now()}:${geofenceCounter}`;
}
let ruleCounter = 0;
function nextRuleId() {
    ruleCounter += 1;
    return `rule:${Date.now()}:${ruleCounter}`;
}
/**
 * Create a geofence
 */
function createGeofence(name, type, options) {
    const now = Date.now();
    const geofence = {
        id: nextGeofenceId(),
        name,
        type,
        coordinates: options.coordinates,
        countries: options.countries,
        regions: options.regions,
        cities: options.cities,
        active: true,
        priority: options.priority || 0.5,
        createdAt: now,
        updatedAt: now,
    };
    seoStore_1.SEOStore.addGeofence(geofence);
    return geofence;
}
/**
 * Check if location matches geofence
 */
function checkGeofence(location) {
    const activeGeofences = seoStore_1.SEOStore.listActiveGeofences();
    const matches = [];
    for (const geofence of activeGeofences) {
        let matchesGeofence = false;
        // Check country match
        if (geofence.countries && location.country) {
            if (geofence.countries.includes(location.country)) {
                matchesGeofence = true;
            }
        }
        // Check region match
        if (geofence.regions && location.region) {
            if (geofence.regions.includes(location.region)) {
                matchesGeofence = true;
            }
        }
        // Check city match
        if (geofence.cities && location.city) {
            if (geofence.cities.includes(location.city)) {
                matchesGeofence = true;
            }
        }
        // Check coordinate match (if radius provided)
        if (geofence.coordinates && location.coordinates && geofence.coordinates.radius) {
            const distance = calculateDistance(geofence.coordinates.lat, geofence.coordinates.lng, location.coordinates.lat, location.coordinates.lng);
            if (distance <= geofence.coordinates.radius) {
                matchesGeofence = true;
            }
        }
        if (matchesGeofence) {
            matches.push(geofence);
        }
    }
    return matches;
}
/**
 * Apply geofence rules to content
 */
function applyGeofenceRules(geofenceIds, contentType, platform) {
    const applicableRules = [];
    for (const geofenceId of geofenceIds) {
        const rules = seoStore_1.SEOStore.listRulesForGeofence(geofenceId);
        for (const rule of rules) {
            // Check if rule applies to content type/platform
            if (contentType && rule.contentType && rule.contentType !== contentType)
                continue;
            if (platform && rule.platform && rule.platform !== platform)
                continue;
            applicableRules.push(rule);
        }
    }
    return applicableRules;
}
/**
 * Create geofence rule
 */
function createGeofenceRule(geofenceId, action, options) {
    const rule = {
        id: nextRuleId(),
        geofenceId,
        action,
        contentType: options?.contentType,
        platform: options?.platform,
        customizations: options?.customizations,
        createdAt: Date.now(),
    };
    seoStore_1.SEOStore.addGeofenceRule(rule);
    return rule;
}
/**
 * Ensure default geofences
 */
function ensureDefaultGeofences() {
    const existing = seoStore_1.SEOStore.listGeofences();
    if (existing.length > 0)
        return existing;
    const geofences = [
        // US geofence (high priority)
        createGeofence("United States", "country", {
            countries: ["US"],
            priority: 0.9,
        }),
        // Base ecosystem geofence (Base blockchain users)
        createGeofence("Base Ecosystem", "custom", {
            priority: 0.8,
        }),
        // Web3 hubs
        createGeofence("Web3 Hubs", "custom", {
            cities: ["San Francisco", "New York", "London", "Singapore", "Dubai"],
            priority: 0.7,
        }),
    ];
    return geofences;
}
// Helper: Calculate distance between coordinates (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
