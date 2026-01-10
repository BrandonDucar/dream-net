import { APIProvider, APIKey, APIRequest, APIRailGuard, APIKeeperStatus } from '../types.js';
export declare const APIStore: {
    addProvider(provider: APIProvider): APIProvider;
    getProvider(id: string): APIProvider | undefined;
    listProviders(): APIProvider[];
    listActiveProviders(): APIProvider[];
    listProvidersByCategory(category: APIProvider["category"]): APIProvider[];
    updateProvider(id: string, updates: Partial<APIProvider>): boolean;
    addKey(key: APIKey): APIKey;
    getKey(id: string): APIKey | undefined;
    listKeys(): APIKey[];
    listKeysForProvider(providerId: string): APIKey[];
    listActiveKeys(): APIKey[];
    updateKey(id: string, updates: Partial<APIKey>): boolean;
    addRequest(request: APIRequest): APIRequest;
    getRequest(id: string): APIRequest | undefined;
    listRequests(): APIRequest[];
    listRecentRequests(limit?: number): APIRequest[];
    addRailGuard(guard: APIRailGuard): APIRailGuard;
    getRailGuard(id: string): APIRailGuard | undefined;
    listRailGuards(): APIRailGuard[];
    listActiveRailGuards(): APIRailGuard[];
    updateRailGuard(id: string, updates: Partial<APIRailGuard>): boolean;
    setLastRunAt(ts: number | null): void;
    status(): APIKeeperStatus;
};
//# sourceMappingURL=apiStore.d.ts.map