import React, { useCallback, useEffect, useMemo, useState } from "react";
import { operatorApi } from './api.js';
import { usePolling } from './usePolling.js';
import { useHeartbeat } from '../hooks/useHeartbeat.js';
import { MediaTab } from './MediaTab.js';
import { MetricsOverlay } from './MetricsOverlay.js';
import { OrdersTab } from './OrdersTab.js';
import { ContactsTab } from './ContactsTab.js';
import { RewardsTab } from './RewardsTab.js';
import { DreamTokenTab } from './DreamTokenTab.js';

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

const sectionClass =
  "rounded-3xl border border-white/10 bg-black/40 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur";

type Tab = "dashboard" | "media" | "orders" | "contacts" | "rewards" | "dream-token";

export function DreamNetOperatorPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  
  // Use heartbeat hook for alive status with failure threshold handling
  const heartbeat = useHeartbeat<AliveStatus>({
    intervalMs: 10000,
    endpoint: "/api/alive/status",
    maxConsecutiveFailures: 2,
    onFailureThreshold: async (failures, lastUpdated) => {
      if (failures >= 2) {
        // Emit system event
        try {
          await operatorApi.emitEvent({
            sourceType: "system",
            eventType: "heartbeat.lost",
            severity: "critical",
            payload: {
              lastUpdated: lastUpdated?.toISOString() ?? null,
              intervalMs: 10000,
              consecutiveFailures: failures,
            },
          });
        } catch (err) {
          console.error("Failed to emit heartbeat.lost event:", err);
        }

        // Trigger light HALO cycle
        try {
          await operatorApi.runHaloCycle("light", "heartbeat.recovery");
        } catch (err) {
          console.error("Failed to trigger HALO recovery cycle:", err);
        }
      }
    },
  });

  const aliveStatus = heartbeat.status;
  const aliveError = heartbeat.error;
  const [events, setEvents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [wormholes, setWormholes] = useState<any[]>([]);
  const [haloHistory, setHaloHistory] = useState<any[]>([]);
  const [forgeHistory, setForgeHistory] = useState<any[]>([]);
  const [grafts, setGrafts] = useState<any[]>([]);
  const [spores, setSpores] = useState<any[]>([]);
  const [fabricTasks, setFabricTasks] = useState<any[]>([]);
  const [resonance, setResonance] = useState<any[]>([]);

  const fetchAll = useCallback(async () => {
    try {
      const [
        eventsRes,
        tasksRes,
        haloHistoryRes,
        wormholeRes,
        forgeHistoryRes,
        graftRes,
        sporeRes,
        fabricRes,
        resonanceRes,
      ] = await Promise.allSettled([
        operatorApi.getEvents(),
        operatorApi.getTasks(),
        operatorApi.getHaloHistory(),
        operatorApi.getWormholes(),
        operatorApi.getForgeHistory(),
        operatorApi.getGrafts(),
        operatorApi.getSpores(),
        operatorApi.getFabricTasks(),
        operatorApi.getResonanceInsights(),
      ]);

      // Alive status is handled by heartbeat hook, no need to set it here

      if (eventsRes.status === "fulfilled") setEvents(eventsRes.value.events ?? []);
      if (tasksRes.status === "fulfilled") setTasks(tasksRes.value.tasks ?? []);
      if (wormholeRes.status === "fulfilled") setWormholes(wormholeRes.value.wormholes ?? []);
      if (haloHistoryRes.status === "fulfilled") setHaloHistory(haloHistoryRes.value.history ?? []);
      if (forgeHistoryRes.status === "fulfilled") setForgeHistory(forgeHistoryRes.value.history ?? []);
      if (graftRes.status === "fulfilled") setGrafts(graftRes.value.grafts ?? []);
      if (sporeRes.status === "fulfilled") setSpores(sporeRes.value.spores ?? []);
      if (fabricRes.status === "fulfilled") setFabricTasks(fabricRes.value.tasks ?? []);
      if (resonanceRes.status === "fulfilled") setResonance(resonanceRes.value.insights ?? []);
    } catch (error) {
      // Errors are handled by individual state setters or heartbeat hook
      console.error("Error fetching operator data:", error);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  usePolling(fetchAll, 20000);

  const pendingTasks = useMemo(
    () => tasks.filter((task) => task.status === "pending" || task.status === "suggested"),
    [tasks],
  );

  const graftStats = useMemo(() => {
    const counts: Record<string, number> = {};
    grafts.forEach((graft) => {
      const status = graft.status ?? "unknown";
      counts[status] = (counts[status] ?? 0) + 1;
    });
    return counts;
  }, [grafts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white">
      <div className="border-b border-white/10 bg-black/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">DreamNet Operations</p>
            <h1 className="mt-1 text-3xl font-semibold">Operator Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] ${
                aliveStatus?.phase === "operational"
                  ? "bg-green-500/20 text-green-400"
                  : aliveStatus?.phase === "degraded"
                  ? "bg-amber-500/20 text-amber-300"
                  : aliveStatus?.phase === "error"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-white/10 text-white/60"
              }`}
            >
              {aliveStatus?.phase ?? "unknown"}
            </div>
            <button
              onClick={async () => {
                await operatorApi.runAliveBoot();
                // Trigger heartbeat refetch after boot
                await heartbeat.refetch();
                // Also refresh other data
                await fetchAll();
              }}
              className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/20"
            >
              Run Boot Check
            </button>
            <a
              href="/dreamscope"
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:text-white"
            >
              DreamScope →
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <div className="flex gap-2 border-b border-white/10">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "dashboard"
                ? "border-b-2 border-dream-cyan text-dream-cyan"
                : "text-white/60 hover:text-white"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "media"
                ? "border-b-2 border-dream-cyan text-dream-cyan"
                : "text-white/60 hover:text-white"
            }`}
          >
            Media
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "orders"
                ? "border-b-2 border-dream-cyan text-dream-cyan"
                : "text-white/60 hover:text-white"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "contacts"
                ? "border-b-2 border-dream-cyan text-dream-cyan"
                : "text-white/60 hover:text-white"
            }`}
          >
            Contacts
          </button>
          <button
            onClick={() => setActiveTab("rewards")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "rewards"
                ? "border-b-2 border-dream-cyan text-dream-cyan"
                : "text-white/60 hover:text-white"
            }`}
          >
            Rewards
          </button>
          <button
            onClick={() => setActiveTab("dream-token")}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "dream-token"
                ? "border-b-2 border-dream-cyan text-dream-cyan"
                : "text-white/60 hover:text-white"
            }`}
          >
            DREAM Token
          </button>
        </div>
      </div>

      {activeTab === "media" ? (
        <div className="mx-auto max-w-7xl px-6 py-8">
          <MediaTab />
        </div>
      ) : activeTab === "orders" ? (
        <div className="mx-auto max-w-7xl px-6 py-8">
          <OrdersTab />
        </div>
      ) : activeTab === "contacts" ? (
        <div className="mx-auto max-w-7xl px-6 py-8">
          <ContactsTab />
        </div>
      ) : activeTab === "rewards" ? (
        <div className="mx-auto max-w-7xl px-6 py-8">
          <RewardsTab />
        </div>
      ) : activeTab === "dream-token" ? (
        <div className="mx-auto max-w-7xl px-6 py-8">
          <DreamTokenTab />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
          {/* Metrics Overlay */}
          <MetricsOverlay />

          {/* Heartbeat Widget */}
          <section className={`${sectionClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Heartbeat</p>
              <h3 className="text-lg font-semibold text-white">
                Status:{" "}
                <span
                  className={
                    heartbeat.consecutiveFailures >= 2
                      ? "text-rose-400"
                      : heartbeat.consecutiveFailures > 0
                      ? "text-amber-400"
                      : "text-dream-emerald"
                  }
                >
                  {heartbeat.consecutiveFailures >= 2 ? "LOST" : heartbeat.consecutiveFailures > 0 ? "DEGRADED" : "OK"}
                </span>
              </h3>
            </div>
            <div className="text-right">
              {heartbeat.lastUpdated && (
                <p className="text-xs text-white/60">Last: {heartbeat.lastUpdated.toLocaleTimeString()}</p>
              )}
              {heartbeat.consecutiveFailures > 0 && (
                <p className="text-xs text-rose-400">Failures: {heartbeat.consecutiveFailures}</p>
              )}
            </div>
          </div>
        </section>

        <section className={`${sectionClass}`}>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">System Health</p>
              <h2 className="text-2xl font-semibold text-white">Alive Mode</h2>
              <p className="text-sm text-white/60">
                {heartbeat.lastUpdated
                  ? `Last check: ${heartbeat.lastUpdated.toLocaleTimeString()}`
                  : heartbeat.isLoading
                  ? "Checking..."
                  : heartbeat.error
                  ? `Heartbeat lost: ${heartbeat.error}`
                  : "No status available"}
                {heartbeat.consecutiveFailures > 0 && (
                  <span className="ml-2 text-xs text-rose-400">
                    ({heartbeat.consecutiveFailures} consecutive failures)
                  </span>
                )}
              </p>
            </div>
            {aliveStatus && (
              <div className="flex flex-wrap gap-2 md:w-1/2 md:justify-end">
                {Object.entries(aliveStatus.subsystems ?? {}).map(([name, status]) => (
                  <div
                    key={name}
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                      status.ok ? "bg-green-500/15 text-green-300" : "bg-red-500/15 text-red-300"
                    }`}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className={sectionClass}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Squad Builder</p>
                <h3 className="text-lg font-semibold text-white">Pending & Suggested Tasks</h3>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {pendingTasks.length === 0 ? (
                <p className="text-sm text-white/50">No pending tasks. Mesh is waiting for new work.</p>
              ) : (
                pendingTasks.slice(0, 6).map((task) => {
                  const isHeartbeatTask = task.type === "infra.repair.suggested" && task.payload?.reason === "heartbeat.lost";
                  return (
                    <div
                      key={task.id}
                      className={`rounded-xl border p-3 ${
                        isHeartbeatTask
                          ? "border-rose-400/50 bg-rose-500/10"
                          : task.status === "pending-approval"
                          ? "border-amber-400/50 bg-amber-500/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-dream-cyan/80">
                          {task.type}
                        </span>
                        <span className="text-xs text-white/50">
                          {task.createdAt ? new Date(task.createdAt).toLocaleString() : "—"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white/70">
                        Status: <span className="text-white">{task.status}</span>
                        {isHeartbeatTask && (
                          <span className="ml-2 text-xs text-rose-400">[Heartbeat Recovery]</span>
                        )}
                      </p>
                      {isHeartbeatTask && task.payload?.hint && (
                        <p className="mt-1 text-xs text-white/60">Hint: {task.payload.hint}</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Event Wormholes</p>
                <h3 className="text-lg font-semibold text-white">Recent Events</h3>
              </div>
            </div>
            <div className="mt-4 space-y-3 max-h-[260px] overflow-auto pr-1">
              {events.slice(0, 8).map((event) => {
                const isHeartbeatLost = event.eventType === "heartbeat.lost";
                return (
                  <div
                    key={event.id}
                    className={`rounded-xl border p-3 ${
                      isHeartbeatLost ? "border-rose-400/50 bg-rose-500/10" : "border-white/10 bg-black/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                        {event.sourceType ?? event.topic}
                      </span>
                      <span className="text-xs text-white/50">
                        {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : "—"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white">
                      {event.eventType ?? event.type}
                      {isHeartbeatLost && <span className="ml-2 text-xs text-rose-400">[CRITICAL]</span>}
                    </p>
                    {event.severity && (
                      <p className="text-xs text-white/60">Severity: {event.severity.toUpperCase()}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Wormhole Registry</p>
                <h3 className="text-lg font-semibold text-white">Active Channels</h3>
              </div>
            </div>
            <div className="mt-4 space-y-3 max-h-[260px] overflow-auto pr-1">
              {wormholes.length === 0 ? (
                <p className="text-sm text-white/50">No wormholes registered yet.</p>
              ) : (
                wormholes.slice(0, 6).map((wormhole: any) => (
                  <div key={wormhole.id} className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <p className="text-sm font-semibold text-white">{wormhole.name ?? wormhole.id}</p>
                    <p className="text-xs text-white/60">
                      {wormhole.from?.sourceType ?? "-"} → {wormhole.to?.actionType ?? "-"}
                    </p>
                    {wormhole.filters?.minSeverity && (
                      <p className="text-xs text-white/40">
                        Min severity: {String(wormhole.filters.minSeverity).toUpperCase()}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className={sectionClass}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">HALO Loop</p>
                <h3 className="text-lg font-semibold text-white">Recent Cycles</h3>
              </div>
              <button
                onClick={async () => {
                  try {
                    await operatorApi.runHaloCycle();
                    await fetchAll();
                  } catch (err) {
                    console.error("Halo run failed", err);
                  }
                }}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 transition hover:bg-white/20"
              >
                Run HALO Cycle
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {haloHistory.slice(0, 5).map((cycle: any) => {
                const isRecovery = cycle.summary?.includes("heartbeat.recovery") || cycle.summary?.includes("recovery");
                return (
                  <div
                    key={cycle.id ?? cycle.timestamp}
                    className={`rounded-xl border p-3 ${
                      isRecovery ? "border-amber-400/50 bg-amber-500/10" : "border-white/10 bg-black/40"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">
                      {cycle.summary ?? "HALO cycle"}
                      {isRecovery && <span className="ml-2 text-xs text-amber-400">[Recovery]</span>} •{" "}
                      <span className="text-xs text-white/60">
                        {cycle.timestamp ? new Date(cycle.timestamp).toLocaleString() : "—"}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      Tasks: {cycle.generatedTasks?.length ?? cycle.tasksGenerated ?? "—"} • Weakpoints:{" "}
                      {cycle.weakPoints?.length ?? "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">API Forge</p>
                <h3 className="text-lg font-semibold text-white">Recent Requests</h3>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {forgeHistory.slice(0, 5).map((entry: any) => (
                <div key={entry.id} className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <p className="text-sm text-white">
                    {entry.requestSnapshot?.method ?? "GET"} {entry.requestSnapshot?.url ?? entry.url}
                  </p>
                  <p className="text-xs text-white/60">
                    Status: {entry.responseSnapshot?.status ?? entry.statusCode ?? "—"} • Duration:{" "}
                    {entry.responseSnapshot?.durationMs ?? entry.durationMs ?? "—"}ms
                  </p>
                </div>
              ))}
              {forgeHistory.length === 0 && <p className="text-sm text-white/50">No recent API executions.</p>}
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Grafts • Spores</p>
                <h3 className="text-lg font-semibold text-white">Expansion Overview</h3>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Graft Status</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-white/70">
                  {Object.entries(graftStats).map(([status, count]) => (
                    <div key={status} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">{status}</p>
                      <p className="text-lg font-semibold text-white">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Spores</p>
                <p className="text-sm text-white/70">
                  Total spores: <span className="text-white">{spores.length}</span>
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className={sectionClass}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Dark Fabric</p>
                <h3 className="text-lg font-semibold text-white">Recent Fabric Tasks</h3>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {fabricTasks.slice(0, 6).map((task) => (
                <div key={task.id} className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <p className="text-sm text-white">{task.type}</p>
                  <p className="text-xs text-white/60">
                    Status: {task.status ?? "unknown"} •{" "}
                    {task.createdAt ? new Date(task.createdAt).toLocaleString() : "—"}
                  </p>
                </div>
              ))}
              {fabricTasks.length === 0 && <p className="text-sm text-white/50">No Fabric tasks yet.</p>}
            </div>
          </section>

          <section className={sectionClass}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Quick Actions</p>
                <h3 className="text-lg font-semibold text-white">Create At Will</h3>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <button
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-dream-cyan/40 hover:text-dream-cyan"
                onClick={async () => {
                  await operatorApi.quickNewAgent();
                  await fetchAll();
                }}
              >
                New Agent Template
                <p className="text-xs text-white/50">Creates a scaffolded agent task in Squad Builder.</p>
              </button>
              <button
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-dream-magenta/40 hover:text-dream-magenta"
                onClick={async () => {
                  await operatorApi.quickNewEndpoint();
                  await fetchAll();
                }}
              >
                New Endpoint Stub
                <p className="text-xs text-white/50">Registers a grafted /api/grafted endpoint placeholder.</p>
              </button>
              <button
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-dream-emerald/40 hover:text-dream-emerald"
                onClick={async () => {
                  await operatorApi.quickNewSpore();
                  await fetchAll();
                }}
              >
                New Prompt Spore
                <p className="text-xs text-white/50">Seeds a new spore with default metadata.</p>
              </button>
              <button
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-dream-cyan/40 hover:text-dream-cyan"
                onClick={async () => {
                  await operatorApi.quickNewWormhole();
                  await fetchAll();
                }}
              >
                New Wormhole Rule
                <p className="text-xs text-white/50">Adds a wormhole suggestion mapping API failures to DeployKeeper.</p>
              </button>
            </div>
          </section>
        </div>

        <section className={sectionClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Resonance Insights</p>
              <h3 className="text-lg font-semibold text-white">Cross-Entity Signals</h3>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {resonance.slice(0, 6).map((insight: any) => (
              <div key={insight.id} className="rounded-xl border border-white/10 bg-black/40 p-3">
                <p className="text-sm font-semibold text-white">{insight.pattern}</p>
                <p className="mt-1 text-xs text-white/60">{insight.description}</p>
                <p className="mt-2 text-xs text-white/40">
                  Severity: <span className="text-white/60">{insight.severity?.toUpperCase()}</span>
                </p>
              </div>
            ))}
            {resonance.length === 0 && <p className="text-sm text-white/50">No resonance insights yet.</p>}
          </div>
        </section>
      </div>
      )}
    </div>
  );
}

