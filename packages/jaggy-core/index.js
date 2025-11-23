/**
 * Jaggy Core - The Silent Sentinel
 * A digitized cat agent that watches, hunts, and implements webhooks silently
 * Works alone, answers to few, moves silently
 * Base Famous 🐱
 */
// Hunter
import { huntWebhooks, implementDiscovery, watchMesh, getActiveHunts, getMemories, createTerritory, getTerritories, } from "./logic/jaggyHunter";
// Sentinel
import { watchEvent, prowlTerritories, getStatus, getAlerts, increaseFame, rest, } from "./logic/jaggySentinel";
export const JaggyCore = {
    // ===== STATUS =====
    status() {
        return getStatus();
    },
    // ===== WATCHING =====
    watchEvent,
    prowlTerritories,
    // ===== HUNTING =====
    huntWebhooks,
    implementDiscovery,
    watchMesh,
    getActiveHunts,
    // ===== TERRITORIES =====
    createTerritory,
    getTerritories,
    // ===== MEMORY =====
    getMemories,
    // ===== ALERTS =====
    getAlerts,
    // ===== FAME =====
    increaseFame,
    rest,
    // ===== INITIALIZE =====
    init() {
        console.log(`🐱 [Jaggy] Initializing...`);
        console.log(`   🥷 Stealth Level: 100/100`);
        console.log(`   🎯 Independence: 100/100`);
        console.log(`   👑 Base Fame: ${getStatus().baseFame}/100`);
        console.log(`   🐾 Jaggy is watching... silently`);
        // Create default territories
        createTerritory("Mesh Events", "mesh");
        createTerritory("API Responses", "api");
        createTerritory("Environment", "webhook");
        createTerritory("External Services", "external");
        console.log(`   ✅ ${getTerritories().length} territories marked`);
    },
};
export * from "./types";
export default JaggyCore;
