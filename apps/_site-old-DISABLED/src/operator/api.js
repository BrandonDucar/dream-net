const API_BASE = import.meta.env.VITE_API_URL ?? "";
async function fetchJson(path, init) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
    }
    return res.json();
}
export const operatorApi = {
    getAliveStatus: () => fetchJson("/api/alive/status"),
    runAliveBoot: () => fetchJson("/api/alive/boot", { method: "POST" }),
    getEvents: () => fetchJson("/api/events/recent?limit=50"),
    getWormholes: () => fetchJson("/api/wormholes"),
    getSquads: () => fetchJson("/api/squad"),
    getAgents: () => fetchJson("/api/squad/agents"),
    getTasks: () => fetchJson("/api/squad/tasks"),
    getHaloStatus: () => fetchJson("/api/halo/status"),
    getHaloHistory: () => fetchJson("/api/halo/history"),
    getForgeHistory: () => fetchJson("/api/forge/history/recent?limit=20"),
    getForgeCollections: () => fetchJson("/api/forge/collections"),
    getGrafts: () => fetchJson("/api/graft"),
    getSpores: () => fetchJson("/api/spores"),
    getResonanceInsights: () => fetchJson("/api/resonance/insights"),
    getFabricTasks: () => fetchJson("/api/fabric/tasks"),
    runHaloCycle: (mode, reason) => fetchJson("/api/halo/run", {
        method: "POST",
        body: JSON.stringify({ mode, reason }),
    }),
    emitEvent: (event) => fetchJson("/api/events/emit", {
        method: "POST",
        body: JSON.stringify(event),
    }),
    quickNewAgent: () => fetchJson("/api/operator/actions/new-agent-template", { method: "POST" }),
    quickNewEndpoint: () => fetchJson("/api/operator/actions/new-endpoint-stub", { method: "POST" }),
    quickNewSpore: () => fetchJson("/api/operator/actions/new-prompt-spore", { method: "POST" }),
    quickNewWormhole: () => fetchJson("/api/operator/actions/new-wormhole", { method: "POST" }),
};
