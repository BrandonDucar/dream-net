import { APIProvider, APIKey, APIRequest, APIRoutingDecision, APIRailGuard, APICategory, APIKeeperContext, APIKeeperStatus } from './types.js';
export declare const APIKeeperCore: {
    run(context: APIKeeperContext): APIKeeperStatus;
    status(): APIKeeperStatus;
    discoverAPIs(): APIProvider[];
    autoDiscoverKeys(): APIKey[];
    autoDiscoverKeysFromEnv(): APIKey[];
    forceDiscovery(): APIKey[];
    searchProviders(category?: APICategory, feature?: string): APIProvider[];
    getProvider(id: string): APIProvider | undefined;
    listProviders(): APIProvider[];
    listActiveProviders(): APIProvider[];
    registerKey(providerId: string, key: string, secret?: string, options?: {
        name?: string;
        quotaLimit?: number;
        tags?: string[];
    }): APIKey;
    getKey(id: string): APIKey | undefined;
    listKeys(): APIKey[];
    listKeysForProvider(providerId: string): APIKey[];
    updateKeyStatus(keyId: string, status: APIKey["status"], reason?: string): boolean;
    recordUsage(keyId: string, cost?: number): boolean;
    routeRequest(request: APIRequest): APIRoutingDecision | null;
    executeRequest(request: APIRequest): APIRequest;
    ensureDefaultRailGuards(): APIRailGuard[];
    createRailGuard(name: string, type: APIRailGuard["type"], limit: number, action: APIRailGuard["action"]): APIRailGuard;
    checkRailGuards(request: APIRequest): {
        allowed: boolean;
        reason?: string;
    };
    listRailGuards(): APIRailGuard[];
    listActiveRailGuards(): APIRailGuard[];
    getRequest(id: string): APIRequest | undefined;
    listRequests(): APIRequest[];
    listRecentRequests(limit?: number): APIRequest[];
};
export * from './types.js';
export * from './summary.js';
export default APIKeeperCore;
//# sourceMappingURL=index.d.ts.map