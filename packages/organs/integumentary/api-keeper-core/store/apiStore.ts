import {
  APIProvider,
  APIKey,
  APIRequest,
  APIRailGuard,
  APIKeeperStatus,
} from '../types.js';

const providers: Map<string, APIProvider> = new Map();
const keys: Map<string, APIKey> = new Map();
const requests: APIRequest[] = [];
const railGuards: Map<string, APIRailGuard> = new Map();

let lastRunAt: number | null = null;

export const APIStore = {
  // Providers
  addProvider(provider: APIProvider): APIProvider {
    providers.set(provider.id, provider);
    return provider;
  },

  getProvider(id: string): APIProvider | undefined {
    return providers.get(id);
  },

  listProviders(): APIProvider[] {
    return Array.from(providers.values());
  },

  listActiveProviders(): APIProvider[] {
    return Array.from(providers.values()).filter((p) => p.status === "active");
  },

  listProvidersByCategory(category: APIProvider["category"]): APIProvider[] {
    return Array.from(providers.values()).filter((p) => p.category === category);
  },

  updateProvider(id: string, updates: Partial<APIProvider>): boolean {
    const provider = providers.get(id);
    if (!provider) return false;
    Object.assign(provider, updates);
    providers.set(id, provider);
    return true;
  },

  // Keys
  addKey(key: APIKey): APIKey {
    keys.set(key.id, key);
    return key;
  },

  getKey(id: string): APIKey | undefined {
    return keys.get(id);
  },

  listKeys(): APIKey[] {
    return Array.from(keys.values());
  },

  listKeysForProvider(providerId: string): APIKey[] {
    return Array.from(keys.values()).filter((k) => k.providerId === providerId);
  },

  listActiveKeys(): APIKey[] {
    return Array.from(keys.values()).filter((k) => k.status === "active");
  },

  updateKey(id: string, updates: Partial<APIKey>): boolean {
    const key = keys.get(id);
    if (!key) return false;
    Object.assign(key, updates);
    keys.set(id, key);
    return true;
  },

  // Requests
  addRequest(request: APIRequest): APIRequest {
    requests.push(request);
    if (requests.length > 10000) {
      requests.shift();
    }
    return request;
  },

  getRequest(id: string): APIRequest | undefined {
    return requests.find((r) => r.id === id);
  },

  listRequests(): APIRequest[] {
    return requests;
  },

  listRecentRequests(limit: number = 100): APIRequest[] {
    return requests.slice(-limit).reverse();
  },

  // Rail Guards
  addRailGuard(guard: APIRailGuard): APIRailGuard {
    railGuards.set(guard.id, guard);
    return guard;
  },

  getRailGuard(id: string): APIRailGuard | undefined {
    return railGuards.get(id);
  },

  listRailGuards(): APIRailGuard[] {
    return Array.from(railGuards.values());
  },

  listActiveRailGuards(): APIRailGuard[] {
    return Array.from(railGuards.values()).filter((g) => g.enabled);
  },

  updateRailGuard(id: string, updates: Partial<APIRailGuard>): boolean {
    const guard = railGuards.get(id);
    if (!guard) return false;
    Object.assign(guard, updates);
    guard.updatedAt = Date.now();
    railGuards.set(id, guard);
    return true;
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): APIKeeperStatus {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const requestsToday = requests.filter((r) => r.requestedAt >= todayStart);
    const costToday = requestsToday.reduce((sum, r) => sum + (r.cost || 0), 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    const monthStart = thisMonth.getTime();
    const requestsThisMonth = requests.filter((r) => r.requestedAt >= monthStart);
    const costThisMonth = requestsThisMonth.reduce((sum, r) => sum + (r.cost || 0), 0);

    // Top providers by usage
    const providerStats = new Map<string, { requestCount: number; cost: number }>();
    for (const req of requestsThisMonth) {
      if (req.providerUsed) {
        const stats = providerStats.get(req.providerUsed) || { requestCount: 0, cost: 0 };
        stats.requestCount += 1;
        stats.cost += req.cost || 0;
        providerStats.set(req.providerUsed, stats);
      }
    }

    const topProviders = Array.from(providerStats.entries())
      .map(([providerId, stats]) => ({ providerId, ...stats }))
      .sort((a, b) => b.requestCount - a.requestCount)
      .slice(0, 5);

    return {
      lastRunAt,
      providerCount: providers.size,
      activeProviderCount: this.listActiveProviders().length,
      keyCount: keys.size,
      activeKeyCount: this.listActiveKeys().length,
      totalRequests: requests.length,
      requestsToday: requestsToday.length,
      costToday,
      costThisMonth,
      railGuardsActive: this.listActiveRailGuards().length,
      recentRequests: this.listRecentRequests(20),
      topProviders,
    };
  },
};

