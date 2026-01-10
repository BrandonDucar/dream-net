"use strict";
/**
 * Jaggy Hunter Logic
 * Actively hunts for webhooks, APIs, and opportunities
 * Like Wolf Pack but for webhooks - silent and deadly
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.huntWebhooks = huntWebhooks;
exports.implementDiscovery = implementDiscovery;
exports.watchMesh = watchMesh;
exports.getActiveHunts = getActiveHunts;
exports.getMemories = getMemories;
exports.createTerritory = createTerritory;
exports.getTerritories = getTerritories;
const webhook_nervous_core_1 = require("../../webhook-nervous-core");
let activeHunts = new Map();
let territories = new Map();
let memories = [];
let huntCounter = 0;
function nextHuntId() {
    huntCounter += 1;
    return `hunt:${Date.now()}:${huntCounter}`;
}
/**
 * Jaggy hunts for webhooks in a territory
 */
async function huntWebhooks(territory) {
    const discoveries = [];
    const now = Date.now();
    // Mark territory as being watched
    territory.watched = true;
    territory.lastScanned = now;
    // Hunt in different ways based on territory type
    switch (territory.type) {
        case "mesh":
            // Hunt in the mesh/event system
            const meshWebhooks = await huntInMesh();
            discoveries.push(...meshWebhooks);
            break;
        case "api":
            // Hunt in API responses/headers
            const apiWebhooks = await huntInAPIs();
            discoveries.push(...apiWebhooks);
            break;
        case "webhook":
            // Hunt for webhook endpoints
            const webhookEndpoints = await huntWebhookEndpoints();
            discoveries.push(...webhookEndpoints);
            break;
        case "external":
            // Hunt external services
            const externalWebhooks = await huntExternalServices();
            discoveries.push(...externalWebhooks);
            break;
    }
    // Store discoveries
    for (const hunt of discoveries) {
        activeHunts.set(hunt.id, hunt);
        territory.discoveries += 1;
    }
    return discoveries;
}
/**
 * Hunt in mesh/event system
 */
async function huntInMesh() {
    const discoveries = [];
    // Check for webhook URLs in event payloads
    // This would scan through recent events looking for webhook patterns
    const webhookPatterns = [
        /https?:\/\/[^\s]+webhook[^\s]*/gi,
        /https?:\/\/hooks\.(slack|discord|telegram)[^\s]*/gi,
        /https?:\/\/[^\s]+callback[^\s]*/gi,
    ];
    // In real implementation, would scan event logs
    // For now, return empty (would be implemented with actual mesh scanning)
    return discoveries;
}
/**
 * Hunt in API responses
 */
async function huntInAPIs() {
    const discoveries = [];
    // Scan API responses for webhook URLs
    // Check response headers for webhook links
    // Check response bodies for webhook patterns
    return discoveries;
}
/**
 * Hunt webhook endpoints
 */
async function huntWebhookEndpoints() {
    const discoveries = [];
    // Auto-discover webhooks (already implemented in WebhookNervousCore)
    const discovered = webhook_nervous_core_1.WebhookNervousCore.autoDiscoverWebhooks();
    for (const neuron of discovered) {
        const hunt = {
            id: nextHuntId(),
            target: neuron.url,
            status: "captured",
            discoveredAt: Date.now(),
            implementedAt: Date.now(),
            territory: "environment",
            stealth: true,
        };
        discoveries.push(hunt);
    }
    return discoveries;
}
/**
 * Hunt external services
 */
async function huntExternalServices() {
    const discoveries = [];
    // Hunt for webhooks in:
    // - GitHub repositories
    // - Service configurations
    // - Third-party integrations
    // - Documentation files
    return discoveries;
}
/**
 * Jaggy implements a discovery (pounces)
 */
async function implementDiscovery(huntId) {
    const hunt = activeHunts.get(huntId);
    if (!hunt || hunt.status === "captured")
        return false;
    try {
        // Implement the webhook
        // This would create neurons, synapses, etc.
        hunt.status = "captured";
        hunt.implementedAt = Date.now();
        // Store in memory
        addMemory(hunt.target, "implemented", true);
        return true;
    }
    catch (error) {
        hunt.status = "missed";
        addMemory(hunt.target, "failed", false);
        return false;
    }
}
/**
 * Add to Jaggy's memory
 */
function addMemory(pattern, action, success) {
    const memory = {
        id: `memory:${Date.now()}`,
        pattern,
        action,
        success,
        timestamp: Date.now(),
        strength: 1.0,
    };
    memories.push(memory);
    // Keep only recent memories (last 1000)
    if (memories.length > 1000) {
        memories = memories.slice(-1000);
    }
}
/**
 * Jaggy watches the mesh for opportunities
 */
function watchMesh(event) {
    const discoveries = [];
    // Scan event for webhook opportunities
    const eventStr = JSON.stringify(event);
    // Look for webhook patterns
    const webhookRegex = /https?:\/\/[^\s"']+webhook[^\s"']*/gi;
    const matches = eventStr.match(webhookRegex);
    if (matches) {
        for (const match of matches) {
            const hunt = {
                id: nextHuntId(),
                target: match,
                status: "stalking",
                discoveredAt: Date.now(),
                territory: "mesh",
                stealth: true,
            };
            discoveries.push(hunt);
            activeHunts.set(hunt.id, hunt);
        }
    }
    return discoveries;
}
/**
 * Get active hunts
 */
function getActiveHunts() {
    return Array.from(activeHunts.values());
}
/**
 * Get memories
 */
function getMemories() {
    return memories;
}
/**
 * Create territory
 */
function createTerritory(name, type) {
    const territory = {
        id: `territory:${Date.now()}`,
        name,
        type,
        watched: false,
        lastScanned: 0,
        discoveries: 0,
        threats: 0,
    };
    territories.set(territory.id, territory);
    return territory;
}
/**
 * Get territories
 */
function getTerritories() {
    return Array.from(territories.values());
}
