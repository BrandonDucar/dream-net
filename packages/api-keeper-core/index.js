import { APIStore } from "./store/apiStore";
import { runAPIKeeperCycle } from "./scheduler/apiKeeperScheduler";
import { discoverAPIs, searchProviders } from "./logic/apiDiscoverer";
import { registerKey, updateKeyStatus, recordUsage } from "./logic/keyManager";
import { routeRequest } from "./logic/apiRouter";
import { ensureDefaultRailGuards, createRailGuard, checkRailGuards } from "./logic/railGuards";
import { autoDiscoverAllKeys, autoDiscoverKeysFromEnv } from "./logic/keyAutoDiscoverer";
export const APIKeeperCore = {
    // Orchestration
    run(context) {
        return runAPIKeeperCycle(context);
    },
    status() {
        return APIStore.status();
    },
    // API Discovery
    discoverAPIs() {
        return discoverAPIs();
    },
    // Key Auto-Discovery (ZERO-TOUCH - runs automatically)
    autoDiscoverKeys() {
        // This is now called automatically every cycle - no manual calls needed
        return autoDiscoverAllKeys();
    },
    autoDiscoverKeysFromEnv() {
        return autoDiscoverKeysFromEnv();
    },
    // Force immediate discovery (usually not needed - runs automatically)
    forceDiscovery() {
        console.log(`[APIKeeper] 🔍 Force discovery triggered`);
        return autoDiscoverAllKeys();
    },
    searchProviders(category, feature) {
        return searchProviders(category, feature);
    },
    getProvider(id) {
        return APIStore.getProvider(id);
    },
    listProviders() {
        return APIStore.listProviders();
    },
    listActiveProviders() {
        return APIStore.listActiveProviders();
    },
    // Key Management
    registerKey(providerId, key, secret, options) {
        return registerKey(providerId, key, secret, options);
    },
    getKey(id) {
        return APIStore.getKey(id);
    },
    listKeys() {
        return APIStore.listKeys();
    },
    listKeysForProvider(providerId) {
        return APIStore.listKeysForProvider(providerId);
    },
    updateKeyStatus(keyId, status, reason) {
        return updateKeyStatus(keyId, status, reason);
    },
    recordUsage(keyId, cost) {
        return recordUsage(keyId, cost);
    },
    // Request Routing
    routeRequest(request) {
        return routeRequest(request);
    },
    executeRequest(request) {
        // Route the request
        const decision = routeRequest(request);
        if (!decision) {
            request.success = false;
            request.error = "No available provider/key found";
            request.completedAt = Date.now();
            APIStore.addRequest(request);
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
        recordUsage(decision.keyId, decision.estimatedCost);
        // Store request
        APIStore.addRequest(request);
        console.log(`[APIKeeper] Executed request via ${decision.providerId} (cost: $${decision.estimatedCost.toFixed(4)})`);
        return request;
    },
    // Rail Guards
    ensureDefaultRailGuards() {
        return ensureDefaultRailGuards();
    },
    createRailGuard(name, type, limit, action) {
        return createRailGuard(name, type, limit, action);
    },
    checkRailGuards(request) {
        return checkRailGuards(request);
    },
    listRailGuards() {
        return APIStore.listRailGuards();
    },
    listActiveRailGuards() {
        return APIStore.listActiveRailGuards();
    },
    // Requests
    getRequest(id) {
        return APIStore.getRequest(id);
    },
    listRequests() {
        return APIStore.listRequests();
    },
    listRecentRequests(limit) {
        return APIStore.listRecentRequests(limit ?? 100);
    },
};
export * from "./types";
export * from "./summary";
export default APIKeeperCore;
