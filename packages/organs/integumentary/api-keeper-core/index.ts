import {
  APIProvider,
  APIKey,
  APIRequest,
  APIRoutingDecision,
  APIRailGuard,
  APICategory,
  APIKeeperContext,
  APIKeeperStatus,
} from './types.js';
import { APIStore } from './store/apiStore.js';
import { runAPIKeeperCycle } from './scheduler/apiKeeperScheduler.js';
import { discoverAPIs, searchProviders } from './logic/apiDiscoverer.js';
import { registerKey, updateKeyStatus, recordUsage, getBestKey } from './logic/keyManager.js';
import { routeRequest } from './logic/apiRouter.js';
import { ensureDefaultRailGuards, createRailGuard, checkRailGuards } from './logic/railGuards.js';
import { autoDiscoverAllKeys, autoDiscoverKeysFromEnv } from './logic/keyAutoDiscoverer.js';

export const APIKeeperCore = {
  // Orchestration
  run(context: APIKeeperContext): APIKeeperStatus {
    return runAPIKeeperCycle(context);
  },

  status(): APIKeeperStatus {
    return APIStore.status();
  },

  // API Discovery
  discoverAPIs(): APIProvider[] {
    return discoverAPIs();
  },

  // Key Auto-Discovery (ZERO-TOUCH - runs automatically)
  autoDiscoverKeys(): APIKey[] {
    // This is now called automatically every cycle - no manual calls needed
    return autoDiscoverAllKeys();
  },

  autoDiscoverKeysFromEnv(): APIKey[] {
    return autoDiscoverKeysFromEnv();
  },

  // Force immediate discovery (usually not needed - runs automatically)
  forceDiscovery(): APIKey[] {
    console.log(`[APIKeeper] 🔍 Force discovery triggered`);
    return autoDiscoverAllKeys();
  },

  searchProviders(category?: APICategory, feature?: string): APIProvider[] {
    return searchProviders(category, feature);
  },

  getProvider(id: string): APIProvider | undefined {
    return APIStore.getProvider(id);
  },

  listProviders(): APIProvider[] {
    return APIStore.listProviders();
  },

  listActiveProviders(): APIProvider[] {
    return APIStore.listActiveProviders();
  },

  // Key Management
  registerKey(
    providerId: string,
    key: string,
    secret?: string,
    options?: {
      name?: string;
      quotaLimit?: number;
      tags?: string[];
    }
  ): APIKey {
    return registerKey(providerId, key, secret, options);
  },

  getKey(id: string): APIKey | undefined {
    return APIStore.getKey(id);
  },

  listKeys(): APIKey[] {
    return APIStore.listKeys();
  },

  listKeysForProvider(providerId: string): APIKey[] {
    return APIStore.listKeysForProvider(providerId);
  },

  updateKeyStatus(keyId: string, status: APIKey["status"], reason?: string): boolean {
    return updateKeyStatus(keyId, status, reason);
  },

  recordUsage(keyId: string, cost?: number): boolean {
    return recordUsage(keyId, cost);
  },

  // Request Routing
  routeRequest(request: APIRequest): APIRoutingDecision | null {
    return routeRequest(request);
  },

  executeRequest(request: APIRequest): APIRequest {
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
  ensureDefaultRailGuards(): APIRailGuard[] {
    return ensureDefaultRailGuards();
  },

  createRailGuard(
    name: string,
    type: APIRailGuard["type"],
    limit: number,
    action: APIRailGuard["action"]
  ): APIRailGuard {
    return createRailGuard(name, type, limit, action);
  },

  checkRailGuards(request: APIRequest): { allowed: boolean; reason?: string } {
    return checkRailGuards(request);
  },

  listRailGuards(): APIRailGuard[] {
    return APIStore.listRailGuards();
  },

  listActiveRailGuards(): APIRailGuard[] {
    return APIStore.listActiveRailGuards();
  },

  // Requests
  getRequest(id: string): APIRequest | undefined {
    return APIStore.getRequest(id);
  },

  listRequests(): APIRequest[] {
    return APIStore.listRequests();
  },

  listRecentRequests(limit?: number): APIRequest[] {
    return APIStore.listRecentRequests(limit ?? 100);
  },
};

export * from './types.js';
export * from './summary.js';
export default APIKeeperCore;

