import { useEffect, useMemo, useState } from "react";
import { useHeartbeat } from "../hooks/useHeartbeat";

type EntityType = "agent" | "squad" | "endpoint" | "spore";

type Trait = {
  key: string;
  value: number;
  lastUpdated: string;
};

type MemoryRecord = {
  id: string;
  entityType: EntityType;
  entityId: string;
  traits: Trait[];
  history: { timestamp: string; summary: string }[];
  updatedAt: string;
};

type ResonanceInsight = {
  id: string;
  createdAt: string;
  entityType?: EntityType;
  entityIds?: string[];
  pattern: string;
  description: string;
  suggestedActions: string[];
  severity: "low" | "medium" | "high";
};

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function TraitBadge({ trait }: { trait: Trait }) {
  const value = trait.value;
  let color = "text-white/70";
  if (value >= 0.7) color = "text-dream-emerald";
  else if (value <= 0.4) color = "text-rose-400";

  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2">
      <span className="text-xs uppercase tracking-[0.2em] text-white/40">{trait.key}</span>
      <span className={`font-mono text-sm ${color}`}>{formatPercent(value)}</span>
    </div>
  );
}

function MemoryView() {
  const [records, setRecords] = useState<Record<EntityType, MemoryRecord[]>>({
    agent: [],
    squad: [],
    endpoint: [],
    spore: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<EntityType>("agent");

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      setLoading(true);
      try {
        const responses = await Promise.all(
          (["agent", "squad", "endpoint", "spore"] as EntityType[]).map(async (type) => {
            const res = await fetch(`${API_BASE}/api/dna/${type}`);
            if (!res.ok) throw new Error(`Failed to load ${type}`);
            const body = (await res.json()) as { records: MemoryRecord[] };
            return [type, body.records] as const;
          }),
        );
        if (!cancelled) {
          const nextRecords = { agent: [], squad: [], endpoint: [], spore: [] } as Record<
            EntityType,
            MemoryRecord[]
          >;
          responses.forEach(([type, list]) => {
            nextRecords[type] = list;
          });
          setRecords(nextRecords);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeRecords = useMemo(() => records[active] ?? [], [records, active]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {(["agent", "squad", "endpoint", "spore"] as EntityType[]).map((type) => (
          <button
            key={type}
            onClick={() => setActive(type)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              active === type ? "bg-dream-cyan/20 text-dream-cyan" : "bg-white/5 text-white/60 hover:text-white"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-white/60">Loading Memory DNA…</p>
      ) : error ? (
        <p className="text-sm text-rose-400">{error}</p>
      ) : (
        <div className="space-y-4">
          {activeRecords.length === 0 ? (
            <p className="text-sm text-white/50">No memory records for this type yet.</p>
          ) : (
            activeRecords.map((record) => (
              <div key={record.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{record.entityId}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                      Updated {new Date(record.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {record.traits.slice(0, 4).map((trait) => (
                      <TraitBadge key={trait.key} trait={trait} />
                    ))}
                  </div>
                </div>
                {record.history.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Recent signals</p>
                    <div className="space-y-1 text-sm text-white/70">
                      {record.history.slice(0, 3).map((entry) => (
                        <div key={entry.timestamp} className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-white/40">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                          <span>{entry.summary}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function severityColor(severity: ResonanceInsight["severity"]) {
  switch (severity) {
    case "high":
      return "text-rose-400";
    case "medium":
      return "text-amber-300";
    default:
      return "text-dream-emerald";
  }
}

function ResonanceView() {
  const [insights, setInsights] = useState<ResonanceInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [computing, setComputing] = useState(false);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/resonance/insights`);
      if (!res.ok) throw new Error("Failed to load resonance insights");
      const body = (await res.json()) as { insights: ResonanceInsight[] };
      setInsights(body.insights ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const recompute = async () => {
    setComputing(true);
    try {
      const res = await fetch(`${API_BASE}/api/resonance/compute`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to compute resonance");
      const body = (await res.json()) as { insights: ResonanceInsight[] };
      setInsights(body.insights ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setComputing(false);
    }
  };

  if (loading) return <p className="text-sm text-white/60">Loading resonance insights…</p>;
  if (error) return <p className="text-sm text-rose-400">{error}</p>;

  return (
    <div className="space-y-4">
      <button
        onClick={recompute}
        disabled={computing}
        className="rounded-full bg-dream-cyan/20 px-4 py-2 text-sm text-dream-cyan transition hover:bg-dream-cyan/30 disabled:opacity-50"
      >
        {computing ? "Recomputing…" : "Recompute Insights"}
      </button>
      <div className="space-y-4">
        {insights.length === 0 ? (
          <p className="text-sm text-white/50">No resonance insights recorded yet.</p>
        ) : (
          insights.map((insight) => (
            <div key={insight.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{insight.pattern}</h3>
                <span className={`font-mono text-sm ${severityColor(insight.severity)}`}>
                  {insight.severity.toUpperCase()}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/70">{insight.description}</p>
              {insight.suggestedActions.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/60">
                  {insight.suggestedActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              )}
              {insight.entityIds && insight.entityIds.length > 0 && (
                <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/40">
                  Related: {insight.entityIds.join(", ")}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

type AliveStatus = {
  alive: boolean;
  phase: "booting" | "operational" | "degraded" | "error";
  timestamp: string;
  subsystems: Record<
    string,
    {
      ok: boolean;
      details?: string;
      error?: string;
    }
  >;
};

function AliveView() {
  const [booting, setBooting] = useState(false);

  // Use heartbeat hook for automatic status updates with failure threshold handling
  const heartbeat = useHeartbeat<AliveStatus>({
    intervalMs: 10000,
    endpoint: "/api/alive/status",
    maxConsecutiveFailures: 2,
    onFailureThreshold: async (failures, lastUpdated) => {
      if (failures >= 2) {
        // Emit system event
        try {
          const res = await fetch(`${API_BASE}/api/events/emit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sourceType: "system",
              eventType: "heartbeat.lost",
              severity: "critical",
              payload: {
                lastUpdated: lastUpdated?.toISOString() ?? null,
                intervalMs: 10000,
                consecutiveFailures: failures,
              },
            }),
          });
          if (!res.ok) throw new Error("Failed to emit event");
        } catch (err) {
          console.error("Failed to emit heartbeat.lost event:", err);
        }

        // Trigger light HALO cycle
        try {
          const res = await fetch(`${API_BASE}/api/halo/run`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "light", reason: "heartbeat.recovery" }),
          });
          if (!res.ok) throw new Error("Failed to trigger HALO");
        } catch (err) {
          console.error("Failed to trigger HALO recovery cycle:", err);
        }
      }
    },
  });

  const status = heartbeat.status;
  const loading = heartbeat.isLoading;
  const error = heartbeat.error;

  const runBoot = async () => {
    setBooting(true);
    try {
      const res = await fetch(`${API_BASE}/api/alive/boot`, { method: "POST" });
      if (!res.ok) throw new Error("Boot sequence failed");
      // Trigger heartbeat refetch after boot
      await heartbeat.refetch();
    } catch (err) {
      // Error will be shown via heartbeat.error
    } finally {
      setBooting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Alive Mode Boot</h2>
          <p className="text-sm text-white/60">Unified health across DreamNet subsystems.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => heartbeat.refetch()}
            disabled={heartbeat.isLoading}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-white/40 hover:text-white disabled:opacity-50"
          >
            {heartbeat.isLoading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={runBoot}
            disabled={booting}
            className="rounded-full bg-dream-cyan/20 px-4 py-2 text-sm text-dream-cyan transition hover:bg-dream-cyan/30 disabled:opacity-40"
          >
            {booting ? "Booting…" : "Run Boot Check"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-white/60">Checking subsystems…</p>
      ) : error ? (
        <div className="space-y-2">
          <p className="text-sm text-rose-400">Heartbeat lost: {error}</p>
          {heartbeat.consecutiveFailures > 0 && (
            <p className="text-xs text-rose-400/70">
              {heartbeat.consecutiveFailures} consecutive failure{heartbeat.consecutiveFailures > 1 ? "s" : ""}
            </p>
          )}
        </div>
      ) : status ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Current Phase</p>
            <p className="text-2xl font-semibold text-white">{status.phase.toUpperCase()}</p>
            <p className="text-sm text-white/60">
              {heartbeat.lastUpdated
                ? `Last check: ${heartbeat.lastUpdated.toLocaleTimeString()}`
                : `Timestamp: ${new Date(status.timestamp).toLocaleString()}`}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(status.subsystems).map(([name, subsystem]) => (
              <div
                key={name}
                className="rounded-2xl border border-white/10 bg-black/40 p-4 transition hover:border-white/30"
              >
                <p className="text-sm font-semibold text-white capitalize">{name.replace(/([A-Z])/g, " $1")}</p>
                <p className={`mt-2 text-sm font-mono ${subsystem.ok ? "text-dream-emerald" : "text-rose-400"}`}>
                  {subsystem.ok ? "OK" : "ISSUE"}
                </p>
                {subsystem.details && <p className="mt-2 text-xs text-white/50">{subsystem.details}</p>}
                {subsystem.error && <p className="mt-2 text-xs text-rose-400">{subsystem.error}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function OverviewView() {
  return (
    <div className="space-y-4 text-white/70">
      <h2 className="text-2xl font-semibold text-white">DreamScope · Collective Intelligence</h2>
      <p>
        Memory DNA captures the traits and lineage of DreamNet&apos;s agents, squads, spores, and endpoints.
        Resonance correlates those memories into high-level insights that guide HALO, Squad Builder, and human
        operators.
      </p>
      <p>
        Use the navigation to inspect Memory DNA or Resonance insights. Phase 1 is advisory—no automatic rewrites,
        just intelligence you can act on.
      </p>
    </div>
  );
}

export function DreamScopeRouter({ path }: { path: string }) {
  const navItems = [
    { href: "/dreamscope", label: "Overview" },
    { href: "/dreamscope/memory", label: "Memory DNA" },
    { href: "/dreamscope/resonance", label: "Resonance" },
    { href: "/dreamscope/alive", label: "Alive Mode" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-dream-black to-black text-white">
      <header className="border-b border-white/10 bg-black/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-[0.3em] text-white/80">DREAMSCOPE</h1>
            <p className="text-sm text-white/50">Memory DNA · Resonance Engine · Advisory Intelligence</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 transition ${
                  path === item.href
                    ? "bg-dream-cyan/30 text-dream-cyan"
                    : path.startsWith(item.href) && item.href !== "/dreamscope"
                    ? "bg-dream-cyan/10 text-dream-cyan/80"
                    : "bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a href="/" className="rounded-full bg-white/5 px-4 py-2 text-white/60 hover:text-white">
              ← Back to DreamNet
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {path === "/dreamscope" ? (
          <OverviewView />
        ) : path.startsWith("/dreamscope/memory") ? (
          <MemoryView />
        ) : path.startsWith("/dreamscope/resonance") ? (
          <ResonanceView />
        ) : path.startsWith("/dreamscope/alive") ? (
          <AliveView />
        ) : (
          <p className="text-sm text-white/50">Section not found.</p>
        )}
      </main>
    </div>
  );
}


