"use strict";
/**
 * Jaggy Core - The Silent Sentinel
 * A digitized cat agent that watches, hunts, and implements webhooks silently
 * Works alone, answers to few, moves silently
 * Base Famous 🐱
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JaggyCore = void 0;
// Hunter
const jaggyHunter_1 = require("./logic/jaggyHunter");
// Sentinel
const jaggySentinel_1 = require("./logic/jaggySentinel");
exports.JaggyCore = {
    // ===== STATUS =====
    status() {
        return (0, jaggySentinel_1.getStatus)();
    },
    // ===== WATCHING =====
    watchEvent: jaggySentinel_1.watchEvent,
    prowlTerritories: jaggySentinel_1.prowlTerritories,
    // ===== HUNTING =====
    huntWebhooks: jaggyHunter_1.huntWebhooks,
    implementDiscovery: jaggyHunter_1.implementDiscovery,
    watchMesh: jaggyHunter_1.watchMesh,
    getActiveHunts: jaggyHunter_1.getActiveHunts,
    // ===== TERRITORIES =====
    createTerritory: jaggyHunter_1.createTerritory,
    getTerritories: jaggyHunter_1.getTerritories,
    // ===== MEMORY =====
    getMemories: jaggyHunter_1.getMemories,
    // ===== ALERTS =====
    getAlerts: jaggySentinel_1.getAlerts,
    // ===== FAME =====
    increaseFame: jaggySentinel_1.increaseFame,
    rest: jaggySentinel_1.rest,
    // ===== INITIALIZE =====
    init() {
        console.log(`🐱 [Jaggy] Initializing...`);
        console.log(`   🥷 Stealth Level: 100/100`);
        console.log(`   🎯 Independence: 100/100`);
        console.log(`   👑 Base Fame: ${(0, jaggySentinel_1.getStatus)().baseFame}/100`);
        console.log(`   🐾 Jaggy is watching... silently`);
        // Create default territories
        (0, jaggyHunter_1.createTerritory)("Mesh Events", "mesh");
        (0, jaggyHunter_1.createTerritory)("API Responses", "api");
        (0, jaggyHunter_1.createTerritory)("Environment", "webhook");
        (0, jaggyHunter_1.createTerritory)("External Services", "external");
        console.log(`   ✅ ${(0, jaggyHunter_1.getTerritories)().length} territories marked`);
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.JaggyCore;
