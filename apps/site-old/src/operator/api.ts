const API_BASE = import.meta.env.VITE_API_URL ?? "";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
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
  return res.json() as Promise<T>;
}

export const operatorApi = {
  getAliveStatus: () => fetchJson<{ status: any }>("/api/alive/status"),
  runAliveBoot: () => fetchJson<{ status: any }>("/api/alive/boot", { method: "POST" }),
  getEvents: () => fetchJson<{ events?: any[] }>("/api/events/recent?limit=50"),
  getWormholes: () => fetchJson<{ wormholes?: any[] }>("/api/wormholes"),
  getSquads: () => fetchJson<{ squads?: any[] }>("/api/squad"),
  getAgents: () => fetchJson<{ agents?: any[] }>("/api/squad/agents"),
  getTasks: () => fetchJson<{ tasks?: any[] }>("/api/squad/tasks"),
  getHaloStatus: () => fetchJson<{ status?: any }>("/api/halo/status"),
  getHaloHistory: () => fetchJson<{ history?: any[] }>("/api/halo/history"),
  getForgeHistory: () => fetchJson<{ history?: any[] }>("/api/forge/history/recent?limit=20"),
  getForgeCollections: () => fetchJson<{ collections?: any[] }>("/api/forge/collections"),
  getGrafts: () => fetchJson<{ grafts?: any[] }>("/api/graft"),
  getSpores: () => fetchJson<{ spores?: any[] }>("/api/spores"),
  getResonanceInsights: () => fetchJson<{ insights?: any[] }>("/api/resonance/insights"),
  getFabricTasks: () => fetchJson<{ tasks?: any[] }>("/api/fabric/tasks"),
  runHaloCycle: (mode?: "light" | "full", reason?: string) =>
    fetchJson<{ ok: boolean; cycle?: any }>("/api/halo/run", {
      method: "POST",
      body: JSON.stringify({ mode, reason }),
    }),
  emitEvent: (event: {
    sourceType: string;
    eventType: string;
    severity: string;
    payload?: any;
  }) =>
    fetchJson<{ ok: boolean; event?: any }>("/api/events/emit", {
      method: "POST",
      body: JSON.stringify(event),
    }),
  quickNewAgent: () =>
    fetchJson<{ ok: boolean; taskId?: string }>("/api/operator/actions/new-agent-template", { method: "POST" }),
  quickNewEndpoint: () =>
    fetchJson<{ ok: boolean; graftId?: string }>("/api/operator/actions/new-endpoint-stub", { method: "POST" }),
  quickNewSpore: () =>
    fetchJson<{ ok: boolean; sporeId?: string }>("/api/operator/actions/new-prompt-spore", { method: "POST" }),
  quickNewWormhole: () =>
    fetchJson<{ ok: boolean; wormholeId?: string }>("/api/operator/actions/new-wormhole", { method: "POST" }),
};

