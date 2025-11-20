import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { operatorApi } from "./api";
import { usePolling } from "./usePolling";
import { useHeartbeat } from "../hooks/useHeartbeat";
import { MediaTab } from "./MediaTab";
import { MetricsOverlay } from "./MetricsOverlay";
import { OrdersTab } from "./OrdersTab";
import { ContactsTab } from "./ContactsTab";
import { RewardsTab } from "./RewardsTab";
import { DreamTokenTab } from "./DreamTokenTab";
const sectionClass = "rounded-3xl border border-white/10 bg-black/40 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur";
export function DreamNetOperatorPanel() {
    const [activeTab, setActiveTab] = useState("dashboard");
    // Use heartbeat hook for alive status with failure threshold handling
    const heartbeat = useHeartbeat({
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
                }
                catch (err) {
                    console.error("Failed to emit heartbeat.lost event:", err);
                }
                // Trigger light HALO cycle
                try {
                    await operatorApi.runHaloCycle("light", "heartbeat.recovery");
                }
                catch (err) {
                    console.error("Failed to trigger HALO recovery cycle:", err);
                }
            }
        },
    });
    const aliveStatus = heartbeat.status;
    const aliveError = heartbeat.error;
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [wormholes, setWormholes] = useState([]);
    const [haloHistory, setHaloHistory] = useState([]);
    const [forgeHistory, setForgeHistory] = useState([]);
    const [grafts, setGrafts] = useState([]);
    const [spores, setSpores] = useState([]);
    const [fabricTasks, setFabricTasks] = useState([]);
    const [resonance, setResonance] = useState([]);
    const fetchAll = useCallback(async () => {
        try {
            const [eventsRes, tasksRes, haloHistoryRes, wormholeRes, forgeHistoryRes, graftRes, sporeRes, fabricRes, resonanceRes,] = await Promise.allSettled([
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
            if (eventsRes.status === "fulfilled")
                setEvents(eventsRes.value.events ?? []);
            if (tasksRes.status === "fulfilled")
                setTasks(tasksRes.value.tasks ?? []);
            if (wormholeRes.status === "fulfilled")
                setWormholes(wormholeRes.value.wormholes ?? []);
            if (haloHistoryRes.status === "fulfilled")
                setHaloHistory(haloHistoryRes.value.history ?? []);
            if (forgeHistoryRes.status === "fulfilled")
                setForgeHistory(forgeHistoryRes.value.history ?? []);
            if (graftRes.status === "fulfilled")
                setGrafts(graftRes.value.grafts ?? []);
            if (sporeRes.status === "fulfilled")
                setSpores(sporeRes.value.spores ?? []);
            if (fabricRes.status === "fulfilled")
                setFabricTasks(fabricRes.value.tasks ?? []);
            if (resonanceRes.status === "fulfilled")
                setResonance(resonanceRes.value.insights ?? []);
        }
        catch (error) {
            // Errors are handled by individual state setters or heartbeat hook
            console.error("Error fetching operator data:", error);
        }
    }, []);
    useEffect(() => {
        void fetchAll();
    }, [fetchAll]);
    usePolling(fetchAll, 20000);
    const pendingTasks = useMemo(() => tasks.filter((task) => task.status === "pending" || task.status === "suggested"), [tasks]);
    const graftStats = useMemo(() => {
        const counts = {};
        grafts.forEach((graft) => {
            const status = graft.status ?? "unknown";
            counts[status] = (counts[status] ?? 0) + 1;
        });
        return counts;
    }, [grafts]);
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white", children: [_jsx("div", { className: "border-b border-white/10 bg-black/60", children: _jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-white/50", children: "DreamNet Operations" }), _jsx("h1", { className: "mt-1 text-3xl font-semibold", children: "Operator Panel" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] ${aliveStatus?.phase === "operational"
                                        ? "bg-green-500/20 text-green-400"
                                        : aliveStatus?.phase === "degraded"
                                            ? "bg-amber-500/20 text-amber-300"
                                            : aliveStatus?.phase === "error"
                                                ? "bg-red-500/20 text-red-400"
                                                : "bg-white/10 text-white/60"}`, children: aliveStatus?.phase ?? "unknown" }), _jsx("button", { onClick: async () => {
                                        await operatorApi.runAliveBoot();
                                        // Trigger heartbeat refetch after boot
                                        await heartbeat.refetch();
                                        // Also refresh other data
                                        await fetchAll();
                                    }, className: "rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/20", children: "Run Boot Check" }), _jsx("a", { href: "/dreamscope", className: "rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:text-white", children: "DreamScope \u2192" })] })] }) }), _jsx("div", { className: "mx-auto max-w-7xl px-6 pt-8", children: _jsxs("div", { className: "flex gap-2 border-b border-white/10", children: [_jsx("button", { onClick: () => setActiveTab("dashboard"), className: `px-4 py-2 text-sm font-medium transition ${activeTab === "dashboard"
                                ? "border-b-2 border-dream-cyan text-dream-cyan"
                                : "text-white/60 hover:text-white"}`, children: "Dashboard" }), _jsx("button", { onClick: () => setActiveTab("media"), className: `px-4 py-2 text-sm font-medium transition ${activeTab === "media"
                                ? "border-b-2 border-dream-cyan text-dream-cyan"
                                : "text-white/60 hover:text-white"}`, children: "Media" }), _jsx("button", { onClick: () => setActiveTab("orders"), className: `px-4 py-2 text-sm font-medium transition ${activeTab === "orders"
                                ? "border-b-2 border-dream-cyan text-dream-cyan"
                                : "text-white/60 hover:text-white"}`, children: "Orders" }), _jsx("button", { onClick: () => setActiveTab("contacts"), className: `px-4 py-2 text-sm font-medium transition ${activeTab === "contacts"
                                ? "border-b-2 border-dream-cyan text-dream-cyan"
                                : "text-white/60 hover:text-white"}`, children: "Contacts" }), _jsx("button", { onClick: () => setActiveTab("rewards"), className: `px-4 py-2 text-sm font-medium transition ${activeTab === "rewards"
                                ? "border-b-2 border-dream-cyan text-dream-cyan"
                                : "text-white/60 hover:text-white"}`, children: "Rewards" }), _jsx("button", { onClick: () => setActiveTab("dream-token"), className: `px-4 py-2 text-sm font-medium transition ${activeTab === "dream-token"
                                ? "border-b-2 border-dream-cyan text-dream-cyan"
                                : "text-white/60 hover:text-white"}`, children: "DREAM Token" })] }) }), activeTab === "media" ? (_jsx("div", { className: "mx-auto max-w-7xl px-6 py-8", children: _jsx(MediaTab, {}) })) : activeTab === "orders" ? (_jsx("div", { className: "mx-auto max-w-7xl px-6 py-8", children: _jsx(OrdersTab, {}) })) : activeTab === "contacts" ? (_jsx("div", { className: "mx-auto max-w-7xl px-6 py-8", children: _jsx(ContactsTab, {}) })) : activeTab === "rewards" ? (_jsx("div", { className: "mx-auto max-w-7xl px-6 py-8", children: _jsx(RewardsTab, {}) })) : activeTab === "dream-token" ? (_jsx("div", { className: "mx-auto max-w-7xl px-6 py-8", children: _jsx(DreamTokenTab, {}) })) : (_jsxs("div", { className: "mx-auto max-w-7xl space-y-6 px-6 py-8", children: [_jsx(MetricsOverlay, {}), _jsx("section", { className: `${sectionClass}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Heartbeat" }), _jsxs("h3", { className: "text-lg font-semibold text-white", children: ["Status:", " ", _jsx("span", { className: heartbeat.consecutiveFailures >= 2
                                                        ? "text-rose-400"
                                                        : heartbeat.consecutiveFailures > 0
                                                            ? "text-amber-400"
                                                            : "text-dream-emerald", children: heartbeat.consecutiveFailures >= 2 ? "LOST" : heartbeat.consecutiveFailures > 0 ? "DEGRADED" : "OK" })] })] }), _jsxs("div", { className: "text-right", children: [heartbeat.lastUpdated && (_jsxs("p", { className: "text-xs text-white/60", children: ["Last: ", heartbeat.lastUpdated.toLocaleTimeString()] })), heartbeat.consecutiveFailures > 0 && (_jsxs("p", { className: "text-xs text-rose-400", children: ["Failures: ", heartbeat.consecutiveFailures] }))] })] }) }), _jsx("section", { className: `${sectionClass}`, children: _jsxs("div", { className: "flex flex-col justify-between gap-4 md:flex-row md:items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "System Health" }), _jsx("h2", { className: "text-2xl font-semibold text-white", children: "Alive Mode" }), _jsxs("p", { className: "text-sm text-white/60", children: [heartbeat.lastUpdated
                                                    ? `Last check: ${heartbeat.lastUpdated.toLocaleTimeString()}`
                                                    : heartbeat.isLoading
                                                        ? "Checking..."
                                                        : heartbeat.error
                                                            ? `Heartbeat lost: ${heartbeat.error}`
                                                            : "No status available", heartbeat.consecutiveFailures > 0 && (_jsxs("span", { className: "ml-2 text-xs text-rose-400", children: ["(", heartbeat.consecutiveFailures, " consecutive failures)"] }))] })] }), aliveStatus && (_jsx("div", { className: "flex flex-wrap gap-2 md:w-1/2 md:justify-end", children: Object.entries(aliveStatus.subsystems ?? {}).map(([name, status]) => (_jsx("div", { className: `rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${status.ok ? "bg-green-500/15 text-green-300" : "bg-red-500/15 text-red-300"}`, children: name }, name))) }))] }) }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [_jsxs("section", { className: sectionClass, children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Squad Builder" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Pending & Suggested Tasks" })] }) }), _jsx("div", { className: "mt-4 space-y-3", children: pendingTasks.length === 0 ? (_jsx("p", { className: "text-sm text-white/50", children: "No pending tasks. Mesh is waiting for new work." })) : (pendingTasks.slice(0, 6).map((task) => {
                                            const isHeartbeatTask = task.type === "infra.repair.suggested" && task.payload?.reason === "heartbeat.lost";
                                            return (_jsxs("div", { className: `rounded-xl border p-3 ${isHeartbeatTask
                                                    ? "border-rose-400/50 bg-rose-500/10"
                                                    : task.status === "pending-approval"
                                                        ? "border-amber-400/50 bg-amber-500/10"
                                                        : "border-white/10 bg-white/5"}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-mono text-xs uppercase tracking-[0.25em] text-dream-cyan/80", children: task.type }), _jsx("span", { className: "text-xs text-white/50", children: task.createdAt ? new Date(task.createdAt).toLocaleString() : "—" })] }), _jsxs("p", { className: "mt-2 text-sm text-white/70", children: ["Status: ", _jsx("span", { className: "text-white", children: task.status }), isHeartbeatTask && (_jsx("span", { className: "ml-2 text-xs text-rose-400", children: "[Heartbeat Recovery]" }))] }), isHeartbeatTask && task.payload?.hint && (_jsxs("p", { className: "mt-1 text-xs text-white/60", children: ["Hint: ", task.payload.hint] }))] }, task.id));
                                        })) })] }), _jsxs("section", { className: sectionClass, children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Event Wormholes" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Recent Events" })] }) }), _jsx("div", { className: "mt-4 space-y-3 max-h-[260px] overflow-auto pr-1", children: events.slice(0, 8).map((event) => {
                                            const isHeartbeatLost = event.eventType === "heartbeat.lost";
                                            return (_jsxs("div", { className: `rounded-xl border p-3 ${isHeartbeatLost ? "border-rose-400/50 bg-rose-500/10" : "border-white/10 bg-black/40"}`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-mono text-[11px] uppercase tracking-[0.2em] text-white/40", children: event.sourceType ?? event.topic }), _jsx("span", { className: "text-xs text-white/50", children: event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : "—" })] }), _jsxs("p", { className: "mt-2 text-sm text-white", children: [event.eventType ?? event.type, isHeartbeatLost && _jsx("span", { className: "ml-2 text-xs text-rose-400", children: "[CRITICAL]" })] }), event.severity && (_jsxs("p", { className: "text-xs text-white/60", children: ["Severity: ", event.severity.toUpperCase()] }))] }, event.id));
                                        }) })] }), _jsxs("section", { className: sectionClass, children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Wormhole Registry" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Active Channels" })] }) }), _jsx("div", { className: "mt-4 space-y-3 max-h-[260px] overflow-auto pr-1", children: wormholes.length === 0 ? (_jsx("p", { className: "text-sm text-white/50", children: "No wormholes registered yet." })) : (wormholes.slice(0, 6).map((wormhole) => (_jsxs("div", { className: "rounded-xl border border-white/10 bg-black/40 p-3", children: [_jsx("p", { className: "text-sm font-semibold text-white", children: wormhole.name ?? wormhole.id }), _jsxs("p", { className: "text-xs text-white/60", children: [wormhole.from?.sourceType ?? "-", " \u2192 ", wormhole.to?.actionType ?? "-"] }), wormhole.filters?.minSeverity && (_jsxs("p", { className: "text-xs text-white/40", children: ["Min severity: ", String(wormhole.filters.minSeverity).toUpperCase()] }))] }, wormhole.id)))) })] })] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [_jsxs("section", { className: sectionClass, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "HALO Loop" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Recent Cycles" })] }), _jsx("button", { onClick: async () => {
                                                    try {
                                                        await operatorApi.runHaloCycle();
                                                        await fetchAll();
                                                    }
                                                    catch (err) {
                                                        console.error("Halo run failed", err);
                                                    }
                                                }, className: "rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 transition hover:bg-white/20", children: "Run HALO Cycle" })] }), _jsx("div", { className: "mt-4 space-y-3", children: haloHistory.slice(0, 5).map((cycle) => {
                                            const isRecovery = cycle.summary?.includes("heartbeat.recovery") || cycle.summary?.includes("recovery");
                                            return (_jsxs("div", { className: `rounded-xl border p-3 ${isRecovery ? "border-amber-400/50 bg-amber-500/10" : "border-white/10 bg-black/40"}`, children: [_jsxs("p", { className: "text-sm font-semibold text-white", children: [cycle.summary ?? "HALO cycle", isRecovery && _jsx("span", { className: "ml-2 text-xs text-amber-400", children: "[Recovery]" }), " \u2022", " ", _jsx("span", { className: "text-xs text-white/60", children: cycle.timestamp ? new Date(cycle.timestamp).toLocaleString() : "—" })] }), _jsxs("p", { className: "mt-1 text-xs text-white/60", children: ["Tasks: ", cycle.generatedTasks?.length ?? cycle.tasksGenerated ?? "—", " \u2022 Weakpoints:", " ", cycle.weakPoints?.length ?? "—"] })] }, cycle.id ?? cycle.timestamp));
                                        }) })] }), _jsxs("section", { className: sectionClass, children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "API Forge" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Recent Requests" })] }) }), _jsxs("div", { className: "mt-4 space-y-3", children: [forgeHistory.slice(0, 5).map((entry) => (_jsxs("div", { className: "rounded-xl border border-white/10 bg-black/40 p-3", children: [_jsxs("p", { className: "text-sm text-white", children: [entry.requestSnapshot?.method ?? "GET", " ", entry.requestSnapshot?.url ?? entry.url] }), _jsxs("p", { className: "text-xs text-white/60", children: ["Status: ", entry.responseSnapshot?.status ?? entry.statusCode ?? "—", " \u2022 Duration:", " ", entry.responseSnapshot?.durationMs ?? entry.durationMs ?? "—", "ms"] })] }, entry.id))), forgeHistory.length === 0 && _jsx("p", { className: "text-sm text-white/50", children: "No recent API executions." })] })] }), _jsxs("section", { className: sectionClass, children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Grafts \u2022 Spores" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Expansion Overview" })] }) }), _jsxs("div", { className: "mt-4 space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Graft Status" }), _jsx("div", { className: "mt-2 grid grid-cols-2 gap-2 text-sm text-white/70", children: Object.entries(graftStats).map(([status, count]) => (_jsxs("div", { className: "rounded-xl border border-white/10 bg-black/30 px-3 py-2", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-white/40", children: status }), _jsx("p", { className: "text-lg font-semibold text-white", children: count })] }, status))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Spores" }), _jsxs("p", { className: "text-sm text-white/70", children: ["Total spores: ", _jsx("span", { className: "text-white", children: spores.length })] })] })] })] })] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsxs("section", { className: sectionClass, children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Dark Fabric" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Recent Fabric Tasks" })] }) }), _jsxs("div", { className: "mt-4 space-y-3", children: [fabricTasks.slice(0, 6).map((task) => (_jsxs("div", { className: "rounded-xl border border-white/10 bg-black/40 p-3", children: [_jsx("p", { className: "text-sm text-white", children: task.type }), _jsxs("p", { className: "text-xs text-white/60", children: ["Status: ", task.status ?? "unknown", " \u2022", " ", task.createdAt ? new Date(task.createdAt).toLocaleString() : "—"] })] }, task.id))), fabricTasks.length === 0 && _jsx("p", { className: "text-sm text-white/50", children: "No Fabric tasks yet." })] })] }), _jsxs("section", { className: sectionClass, children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Quick Actions" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Create At Will" })] }) }), _jsxs("div", { className: "mt-4 grid gap-3", children: [_jsxs("button", { className: "rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-dream-cyan/40 hover:text-dream-cyan", onClick: async () => {
                                                    await operatorApi.quickNewAgent();
                                                    await fetchAll();
                                                }, children: ["New Agent Template", _jsx("p", { className: "text-xs text-white/50", children: "Creates a scaffolded agent task in Squad Builder." })] }), _jsxs("button", { className: "rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-dream-magenta/40 hover:text-dream-magenta", onClick: async () => {
                                                    await operatorApi.quickNewEndpoint();
                                                    await fetchAll();
                                                }, children: ["New Endpoint Stub", _jsx("p", { className: "text-xs text-white/50", children: "Registers a grafted /api/grafted endpoint placeholder." })] }), _jsxs("button", { className: "rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-dream-emerald/40 hover:text-dream-emerald", onClick: async () => {
                                                    await operatorApi.quickNewSpore();
                                                    await fetchAll();
                                                }, children: ["New Prompt Spore", _jsx("p", { className: "text-xs text-white/50", children: "Seeds a new spore with default metadata." })] }), _jsxs("button", { className: "rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-dream-cyan/40 hover:text-dream-cyan", onClick: async () => {
                                                    await operatorApi.quickNewWormhole();
                                                    await fetchAll();
                                                }, children: ["New Wormhole Rule", _jsx("p", { className: "text-xs text-white/50", children: "Adds a wormhole suggestion mapping API failures to DeployKeeper." })] })] })] })] }), _jsxs("section", { className: sectionClass, children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Resonance Insights" }), _jsx("h3", { className: "text-lg font-semibold text-white", children: "Cross-Entity Signals" })] }) }), _jsxs("div", { className: "mt-4 grid gap-3 md:grid-cols-2", children: [resonance.slice(0, 6).map((insight) => (_jsxs("div", { className: "rounded-xl border border-white/10 bg-black/40 p-3", children: [_jsx("p", { className: "text-sm font-semibold text-white", children: insight.pattern }), _jsx("p", { className: "mt-1 text-xs text-white/60", children: insight.description }), _jsxs("p", { className: "mt-2 text-xs text-white/40", children: ["Severity: ", _jsx("span", { className: "text-white/60", children: insight.severity?.toUpperCase() })] })] }, insight.id))), resonance.length === 0 && _jsx("p", { className: "text-sm text-white/50", children: "No resonance insights yet." })] })] })] }))] }));
}
