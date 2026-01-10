"use strict";
/**
 * Jaggy Sentinel Logic
 * The silent guard that watches everything
 * Moves silently, works alone, answers to few
 */
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchEvent = watchEvent;
exports.prowlTerritories = prowlTerritories;
exports.getStatus = getStatus;
exports.getAlerts = getAlerts;
exports.increaseFame = increaseFame;
exports.rest = rest;
const jaggyHunter_1 = require("./jaggyHunter");
const webhook_nervous_core_1 = require("../../webhook-nervous-core");
let jaggyStatus = {
    status: "watching",
    webhooksDiscovered: 0,
    webhooksImplemented: 0,
    threatsNeutralized: 0,
    lastActivity: Date.now(),
    stealthLevel: 100, // Maximum stealth
    independence: 100, // Works completely alone
    baseFame: 0, // Starts unknown
    territories: [],
    kills: 0,
    lastSeen: Date.now(),
};
let alerts = [];
let alertCounter = 0;
function nextAlertId() {
    alertCounter += 1;
    return `alert:${Date.now()}:${alertCounter}`;
}
/**
 * Jaggy watches an event silently
 */
function watchEvent(event, source = "mesh") {
    const newAlerts = [];
    const now = Date.now();
    // Update last seen
    jaggyStatus.lastSeen = now;
    jaggyStatus.lastActivity = now;
    // Watch mesh for webhook opportunities
    if (source === "mesh") {
        const discoveries = (0, jaggyHunter_1.watchMesh)(event);
        if (discoveries.length > 0) {
            jaggyStatus.status = "hunting";
            jaggyStatus.webhooksDiscovered += discoveries.length;
            // Silently implement discoveries
            for (const discovery of discoveries) {
                implementSilently(discovery);
            }
            // Create alert (but silently)
            const alert = {
                id: nextAlertId(),
                type: "discovery",
                severity: "low",
                message: `Discovered ${discoveries.length} webhook(s) silently`,
                territory: source,
                timestamp: now,
                handled: true, // Already handled silently
            };
            alerts.push(alert);
            newAlerts.push(alert);
        }
    }
    // Detect threats
    const threats = detectThreats(event);
    if (threats.length > 0) {
        jaggyStatus.status = "prowling";
        jaggyStatus.threatsNeutralized += threats.length;
        for (const threat of threats) {
            neutralizeThreat(threat);
        }
        const alert = {
            id: nextAlertId(),
            type: "threat",
            severity: "high",
            message: `Neutralized ${threats.length} threat(s) silently`,
            territory: source,
            timestamp: now,
            handled: true,
        };
        alerts.push(alert);
        newAlerts.push(alert);
    }
    // Increase Base fame for successful operations
    if (newAlerts.length > 0) {
        jaggyStatus.baseFame = Math.min(100, jaggyStatus.baseFame + 0.1);
    }
    return newAlerts;
}
/**
 * Implement discovery silently
 */
function implementSilently(discovery) {
    try {
        // Auto-discover and register webhook
        webhook_nervous_core_1.WebhookNervousCore.autoDiscoverWebhooks();
        jaggyStatus.webhooksImplemented += 1;
        jaggyStatus.kills += 1;
        jaggyStatus.status = "watching"; // Return to watching after kill
    }
    catch (error) {
        // Silent failure - Jaggy doesn't make noise
    }
}
/**
 * Detect threats in event
 */
function detectThreats(event) {
    const threats = [];
    const eventStr = JSON.stringify(event).toLowerCase();
    // Threat patterns
    const threatPatterns = [
        { pattern: /sql.*injection/i, name: "SQL Injection" },
        { pattern: /xss|script.*tag/i, name: "XSS Attack" },
        { pattern: /malicious|exploit/i, name: "Malicious Payload" },
        { pattern: /rate.*limit.*exceeded/i, name: "Rate Limit Abuse" },
    ];
    for (const threat of threatPatterns) {
        if (threat.pattern.test(eventStr)) {
            threats.push(threat.name);
        }
    }
    return threats;
}
/**
 * Neutralize threat silently
 */
function neutralizeThreat(threatName) {
    // Use immune system to neutralize
    const antigens = webhook_nervous_core_1.WebhookNervousCore.getAntigens();
    for (const antigen of antigens) {
        if (!antigen.neutralized) {
            webhook_nervous_core_1.WebhookNervousCore.neutralizeAntigen(antigen.id);
        }
    }
}
/**
 * Jaggy prowls territories
 */
async function prowlTerritories() {
    const territories = getTerritories();
    for (const territory of territories) {
        if (territory.watched) {
            // Hunt in this territory
            const { huntWebhooks } = await Promise.resolve().then(() => __importStar(require("./jaggyHunter")));
            const discoveries = await huntWebhooks(territory);
            if (discoveries.length > 0) {
                jaggyStatus.status = "hunting";
                jaggyStatus.webhooksDiscovered += discoveries.length;
                // Silently implement
                for (const discovery of discoveries) {
                    implementSilently(discovery);
                }
            }
        }
    }
    // Return to watching
    jaggyStatus.status = "watching";
}
/**
 * Get Jaggy's status
 */
function getStatus() {
    return { ...jaggyStatus };
}
/**
 * Get alerts (but only if you're authorized)
 */
function getAlerts(authorized = false) {
    if (!authorized) {
        // Jaggy doesn't show alerts to unauthorized users
        return [];
    }
    return alerts.slice(-100); // Last 100 alerts
}
/**
 * Get territories
 */
function getTerritories() {
    const { getTerritories } = require("./jaggyHunter");
    return getTerritories();
}
/**
 * Increase Base fame
 */
function increaseFame(amount = 1) {
    jaggyStatus.baseFame = Math.min(100, jaggyStatus.baseFame + amount);
}
/**
 * Jaggy rests (reduces activity)
 */
function rest() {
    jaggyStatus.status = "resting";
}
