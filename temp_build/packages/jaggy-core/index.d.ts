/**
 * Jaggy Core - The Silent Sentinel
 * A digitized cat agent that watches, hunts, and implements webhooks silently
 * Works alone, answers to few, moves silently
 * Base Famous 🐱
 */
import type { JaggyStatus } from "./types";
import { huntWebhooks, implementDiscovery, watchMesh, getActiveHunts, getMemories, createTerritory, getTerritories } from "./logic/jaggyHunter";
import { watchEvent, prowlTerritories, getAlerts, increaseFame, rest } from "./logic/jaggySentinel";
export declare const JaggyCore: {
    status(): JaggyStatus;
    watchEvent: typeof watchEvent;
    prowlTerritories: typeof prowlTerritories;
    huntWebhooks: typeof huntWebhooks;
    implementDiscovery: typeof implementDiscovery;
    watchMesh: typeof watchMesh;
    getActiveHunts: typeof getActiveHunts;
    createTerritory: typeof createTerritory;
    getTerritories: typeof getTerritories;
    getMemories: typeof getMemories;
    getAlerts: typeof getAlerts;
    increaseFame: typeof increaseFame;
    rest: typeof rest;
    init(): void;
};
export * from "./types";
export default JaggyCore;
