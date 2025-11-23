const providers = new Map();
const keys = new Map();
const requests = [];
const railGuards = new Map();
let lastRunAt = null;
export const APIStore = {
    // Providers
    addProvider(provider) {
        providers.set(provider.id, provider);
        return provider;
    },
    getProvider(id) {
        return providers.get(id);
    },
    listProviders() {
        return Array.from(providers.values());
    },
    listActiveProviders() {
        return Array.from(providers.values()).filter((p) => p.status === "active");
    },
    listProvidersByCategory(category) {
        return Array.from(providers.values()).filter((p) => p.category === category);
    },
    updateProvider(id, updates) {
        const provider = providers.get(id);
        if (!provider)
            return false;
        Object.assign(provider, updates);
        providers.set(id, provider);
        return true;
    },
    // Keys
    addKey(key) {
        keys.set(key.id, key);
        return key;
    },
    getKey(id) {
        return keys.get(id);
    },
    listKeys() {
        return Array.from(keys.values());
    },
    listKeysForProvider(providerId) {
        return Array.from(keys.values()).filter((k) => k.providerId === providerId);
    },
    listActiveKeys() {
        return Array.from(keys.values()).filter((k) => k.status === "active");
    },
    updateKey(id, updates) {
        const key = keys.get(id);
        if (!key)
            return false;
        Object.assign(key, updates);
        keys.set(id, key);
        return true;
    },
    // Requests
    addRequest(request) {
        requests.push(request);
        if (requests.length > 10000) {
            requests.shift();
        }
        return request;
    },
    getRequest(id) {
        return requests.find((r) => r.id === id);
    },
    listRequests() {
        return requests;
    },
    listRecentRequests(limit = 100) {
        return requests.slice(-limit).reverse();
    },
    // Rail Guards
    addRailGuard(guard) {
        railGuards.set(guard.id, guard);
        return guard;
    },
    getRailGuard(id) {
        return railGuards.get(id);
    },
    listRailGuards() {
        return Array.from(railGuards.values());
    },
    listActiveRailGuards() {
        return Array.from(railGuards.values()).filter((g) => g.enabled);
    },
    updateRailGuard(id, updates) {
        const guard = railGuards.get(id);
        if (!guard)
            return false;
        Object.assign(guard, updates);
        guard.updatedAt = Date.now();
        railGuards.set(id, guard);
        return true;
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
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
        const providerStats = new Map();
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
