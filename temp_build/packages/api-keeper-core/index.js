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
exports.APIKeeperCore = void 0;
const apiStore_1 = require("./store/apiStore");
const apiKeeperScheduler_1 = require("./scheduler/apiKeeperScheduler");
const apiDiscoverer_1 = require("./logic/apiDiscoverer");
const keyManager_1 = require("./logic/keyManager");
const apiRouter_1 = require("./logic/apiRouter");
const railGuards_1 = require("./logic/railGuards");
const keyAutoDiscoverer_1 = require("./logic/keyAutoDiscoverer");
exports.APIKeeperCore = {
    // Orchestration
    run(context) {
        return (0, apiKeeperScheduler_1.runAPIKeeperCycle)(context);
    },
    status() {
        return apiStore_1.APIStore.status();
    },
    // API Discovery
    discoverAPIs() {
        return (0, apiDiscoverer_1.discoverAPIs)();
    },
    // Key Auto-Discovery (ZERO-TOUCH - runs automatically)
    autoDiscoverKeys() {
        // This is now called automatically every cycle - no manual calls needed
        return (0, keyAutoDiscoverer_1.autoDiscoverAllKeys)();
    },
    autoDiscoverKeysFromEnv() {
        return (0, keyAutoDiscoverer_1.autoDiscoverKeysFromEnv)();
    },
    // Force immediate discovery (usually not needed - runs automatically)
    forceDiscovery() {
        console.log(`[APIKeeper] 🔍 Force discovery triggered`);
        return (0, keyAutoDiscoverer_1.autoDiscoverAllKeys)();
    },
    searchProviders(category, feature) {
        return (0, apiDiscoverer_1.searchProviders)(category, feature);
    },
    getProvider(id) {
        return apiStore_1.APIStore.getProvider(id);
    },
    listProviders() {
        return apiStore_1.APIStore.listProviders();
    },
    listActiveProviders() {
        return apiStore_1.APIStore.listActiveProviders();
    },
    // Key Management
    registerKey(providerId, key, secret, options) {
        return (0, keyManager_1.registerKey)(providerId, key, secret, options);
    },
    getKey(id) {
        return apiStore_1.APIStore.getKey(id);
    },
    listKeys() {
        return apiStore_1.APIStore.listKeys();
    },
    listKeysForProvider(providerId) {
        return apiStore_1.APIStore.listKeysForProvider(providerId);
    },
    updateKeyStatus(keyId, status, reason) {
        return (0, keyManager_1.updateKeyStatus)(keyId, status, reason);
    },
    recordUsage(keyId, cost) {
        return (0, keyManager_1.recordUsage)(keyId, cost);
    },
    // Request Routing
    routeRequest(request) {
        return (0, apiRouter_1.routeRequest)(request);
    },
    executeRequest(request) {
        // Route the request
        const decision = (0, apiRouter_1.routeRequest)(request);
        if (!decision) {
            request.success = false;
            request.error = "No available provider/key found";
            request.completedAt = Date.now();
            apiStore_1.APIStore.addRequest(request);
            return request;
        }
        // In production, this would actually call the API
        // For now, simulate success
        request.providerUsed = decision.providerId;
        request.keyUsed = decision.keyId;
        request.success = true;
        request.cost = decision.estimatedCost;
        request.latency = Math.random() * 500 + 100; // Simulated latency
        request.completedAt = Date.now();
        // Record usage
        (0, keyManager_1.recordUsage)(decision.keyId, decision.estimatedCost);
        // Store request
        apiStore_1.APIStore.addRequest(request);
        console.log(`[APIKeeper] Executed request via ${decision.providerId} (cost: $${decision.estimatedCost.toFixed(4)})`);
        return request;
    },
    // Rail Guards
    ensureDefaultRailGuards() {
        return (0, railGuards_1.ensureDefaultRailGuards)();
    },
    createRailGuard(name, type, limit, action) {
        return (0, railGuards_1.createRailGuard)(name, type, limit, action);
    },
    checkRailGuards(request) {
        return (0, railGuards_1.checkRailGuards)(request);
    },
    listRailGuards() {
        return apiStore_1.APIStore.listRailGuards();
    },
    listActiveRailGuards() {
        return apiStore_1.APIStore.listActiveRailGuards();
    },
    // Requests
    getRequest(id) {
        return apiStore_1.APIStore.getRequest(id);
    },
    listRequests() {
        return apiStore_1.APIStore.listRequests();
    },
    listRecentRequests(limit) {
        return apiStore_1.APIStore.listRecentRequests(limit ?? 100);
    },
};
__exportStar(require("./types"), exports);
__exportStar(require("./summary"), exports);
exports.default = exports.APIKeeperCore;
