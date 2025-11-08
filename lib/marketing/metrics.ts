type HealthSnapshot = {
  status?: string;
  uptime?: string;
  timestamp?: string;
};

type AgentSnapshot = {
  name: string;
  status?: string;
  role?: string;
};

type RunSnapshot = {
  id?: string;
  name?: string;
  startedAt?: string;
  status?: string;
};

type ChangelogEntry = {
  message: string;
  date: string;
};

export type MarketingMetrics = {
  health: HealthSnapshot | null;
  agents: AgentSnapshot[];
  runs: RunSnapshot[];
  changelog: ChangelogEntry[];
};

const FALLBACK: MarketingMetrics = {
  health: {
    status: "operational",
    uptime: "99.99%",
    timestamp: new Date().toISOString(),
  },
  agents: [
    { name: "Atlas Agent Foundry", status: "online", role: "Build orchestration" },
    { name: "Compute Governor", status: "throttle: optimize", role: "Budget control" },
    { name: "DreamForge Ensemble", status: "generating", role: "Creative synthesis" },
  ],
  runs: [
    { id: "chk-001", name: "DreamStar Studio Pilot", startedAt: "2025-11-05T18:20:00Z", status: "complete" },
    { id: "chk-002", name: "DreamSnail Trail Proof", startedAt: "2025-11-06T09:45:00Z", status: "complete" },
  ],
  changelog: [
    { message: "DreamStar module registered & ops plan published", date: "2025-11-08" },
    { message: "DreamSnail privacy spec integrated into ops stack", date: "2025-11-08" },
  ],
};

function resolveBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function safeFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${resolveBaseUrl()}${path}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getMarketingMetrics(): Promise<MarketingMetrics> {
  const [health, agents, runs, changelog] = await Promise.all([
    safeFetch<HealthSnapshot>("/api/health"),
    safeFetch<AgentSnapshot[]>("/api/agents"),
    safeFetch<RunSnapshot[]>("/api/runs/recent"),
    safeFetch<ChangelogEntry[]>("/api/changelog"),
  ]);

  return {
    health: health ?? FALLBACK.health,
    agents: Array.isArray(agents) && agents.length > 0 ? agents.slice(0, 4) : FALLBACK.agents,
    runs: Array.isArray(runs) && runs.length > 0 ? runs.slice(0, 3) : FALLBACK.runs,
    changelog: Array.isArray(changelog) && changelog.length > 0 ? changelog.slice(0, 3) : FALLBACK.changelog,
  };
}
