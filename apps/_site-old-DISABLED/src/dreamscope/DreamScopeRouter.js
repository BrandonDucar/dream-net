import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useHeartbeat } from "../hooks/useHeartbeat";
const API_BASE = import.meta.env.VITE_API_URL ?? "";
function formatPercent(value) {
    return `${Math.round(value * 100)}%`;
}
function TraitBadge({ trait }) {
    const value = trait.value;
    let color = "text-white/70";
    if (value >= 0.7)
        color = "text-dream-emerald";
    else if (value <= 0.4)
        color = "text-rose-400";
    return (_jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2", children: [_jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-white/40", children: trait.key }), _jsx("span", { className: `font-mono text-sm ${color}`, children: formatPercent(value) })] }));
}
function MemoryView() {
    const [records, setRecords] = useState({
        agent: [],
        squad: [],
        endpoint: [],
        spore: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [active, setActive] = useState("agent");
    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            setLoading(true);
            try {
                const responses = await Promise.all(["agent", "squad", "endpoint", "spore"].map(async (type) => {
                    const res = await fetch(`${API_BASE}/api/dna/${type}`);
                    if (!res.ok)
                        throw new Error(`Failed to load ${type}`);
                    const body = (await res.json());
                    return [type, body.records];
                }));
                if (!cancelled) {
                    const nextRecords = { agent: [], squad: [], endpoint: [], spore: [] };
                    responses.forEach(([type, list]) => {
                        nextRecords[type] = list;
                    });
                    setRecords(nextRecords);
                }
            }
            catch (err) {
                if (!cancelled)
                    setError(err.message);
            }
            finally {
                if (!cancelled)
                    setLoading(false);
            }
        }
        fetchAll();
        return () => {
            cancelled = true;
        };
    }, []);
    const activeRecords = useMemo(() => records[active] ?? [], [records, active]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex flex-wrap gap-3", children: ["agent", "squad", "endpoint", "spore"].map((type) => (_jsx("button", { onClick: () => setActive(type), className: `rounded-full px-4 py-2 text-sm transition ${active === type ? "bg-dream-cyan/20 text-dream-cyan" : "bg-white/5 text-white/60 hover:text-white"}`, children: type.toUpperCase() }, type))) }), loading ? (_jsx("p", { className: "text-sm text-white/60", children: "Loading Memory DNA\u2026" })) : error ? (_jsx("p", { className: "text-sm text-rose-400", children: error })) : (_jsx("div", { className: "space-y-4", children: activeRecords.length === 0 ? (_jsx("p", { className: "text-sm text-white/50", children: "No memory records for this type yet." })) : (activeRecords.map((record) => (_jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-lg font-semibold text-white", children: record.entityId }), _jsxs("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: ["Updated ", new Date(record.updatedAt).toLocaleString()] })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: record.traits.slice(0, 4).map((trait) => (_jsx(TraitBadge, { trait: trait }, trait.key))) })] }), record.history.length > 0 && (_jsxs("div", { className: "mt-4 space-y-2", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Recent signals" }), _jsx("div", { className: "space-y-1 text-sm text-white/70", children: record.history.slice(0, 3).map((entry) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-mono text-[11px] text-white/40", children: new Date(entry.timestamp).toLocaleString() }), _jsx("span", { children: entry.summary })] }, entry.timestamp))) })] }))] }, record.id)))) }))] }));
}
function severityColor(severity) {
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
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [computing, setComputing] = useState(false);
    const loadInsights = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/resonance/insights`);
            if (!res.ok)
                throw new Error("Failed to load resonance insights");
            const body = (await res.json());
            setInsights(body.insights ?? []);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
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
            if (!res.ok)
                throw new Error("Failed to compute resonance");
            const body = (await res.json());
            setInsights(body.insights ?? []);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setComputing(false);
        }
    };
    if (loading)
        return _jsx("p", { className: "text-sm text-white/60", children: "Loading resonance insights\u2026" });
    if (error)
        return _jsx("p", { className: "text-sm text-rose-400", children: error });
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("button", { onClick: recompute, disabled: computing, className: "rounded-full bg-dream-cyan/20 px-4 py-2 text-sm text-dream-cyan transition hover:bg-dream-cyan/30 disabled:opacity-50", children: computing ? "Recomputing…" : "Recompute Insights" }), _jsx("div", { className: "space-y-4", children: insights.length === 0 ? (_jsx("p", { className: "text-sm text-white/50", children: "No resonance insights recorded yet." })) : (insights.map((insight) => (_jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: insight.pattern }), _jsx("span", { className: `font-mono text-sm ${severityColor(insight.severity)}`, children: insight.severity.toUpperCase() })] }), _jsx("p", { className: "mt-2 text-sm text-white/70", children: insight.description }), insight.suggestedActions.length > 0 && (_jsx("ul", { className: "mt-3 list-disc space-y-1 pl-5 text-sm text-white/60", children: insight.suggestedActions.map((action) => (_jsx("li", { children: action }, action))) })), insight.entityIds && insight.entityIds.length > 0 && (_jsxs("p", { className: "mt-3 text-xs uppercase tracking-[0.3em] text-white/40", children: ["Related: ", insight.entityIds.join(", ")] }))] }, insight.id)))) })] }));
}
function AliveView() {
    const [booting, setBooting] = useState(false);
    // Use heartbeat hook for automatic status updates with failure threshold handling
    const heartbeat = useHeartbeat({
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
                    if (!res.ok)
                        throw new Error("Failed to emit event");
                }
                catch (err) {
                    console.error("Failed to emit heartbeat.lost event:", err);
                }
                // Trigger light HALO cycle
                try {
                    const res = await fetch(`${API_BASE}/api/halo/run`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ mode: "light", reason: "heartbeat.recovery" }),
                    });
                    if (!res.ok)
                        throw new Error("Failed to trigger HALO");
                }
                catch (err) {
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
            if (!res.ok)
                throw new Error("Boot sequence failed");
            // Trigger heartbeat refetch after boot
            await heartbeat.refetch();
        }
        catch (err) {
            // Error will be shown via heartbeat.error
        }
        finally {
            setBooting(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold text-white", children: "Alive Mode Boot" }), _jsx("p", { className: "text-sm text-white/60", children: "Unified health across DreamNet subsystems." })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => heartbeat.refetch(), disabled: heartbeat.isLoading, className: "rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-white/40 hover:text-white disabled:opacity-50", children: heartbeat.isLoading ? "Refreshing..." : "Refresh" }), _jsx("button", { onClick: runBoot, disabled: booting, className: "rounded-full bg-dream-cyan/20 px-4 py-2 text-sm text-dream-cyan transition hover:bg-dream-cyan/30 disabled:opacity-40", children: booting ? "Booting…" : "Run Boot Check" })] })] }), loading ? (_jsx("p", { className: "text-sm text-white/60", children: "Checking subsystems\u2026" })) : error ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-sm text-rose-400", children: ["Heartbeat lost: ", error] }), heartbeat.consecutiveFailures > 0 && (_jsxs("p", { className: "text-xs text-rose-400/70", children: [heartbeat.consecutiveFailures, " consecutive failure", heartbeat.consecutiveFailures > 1 ? "s" : ""] }))] })) : status ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-2xl border border-white/10 bg-white/5 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Current Phase" }), _jsx("p", { className: "text-2xl font-semibold text-white", children: status.phase.toUpperCase() }), _jsx("p", { className: "text-sm text-white/60", children: heartbeat.lastUpdated
                                    ? `Last check: ${heartbeat.lastUpdated.toLocaleTimeString()}`
                                    : `Timestamp: ${new Date(status.timestamp).toLocaleString()}` })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: Object.entries(status.subsystems).map(([name, subsystem]) => (_jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/40 p-4 transition hover:border-white/30", children: [_jsx("p", { className: "text-sm font-semibold text-white capitalize", children: name.replace(/([A-Z])/g, " $1") }), _jsx("p", { className: `mt-2 text-sm font-mono ${subsystem.ok ? "text-dream-emerald" : "text-rose-400"}`, children: subsystem.ok ? "OK" : "ISSUE" }), subsystem.details && _jsx("p", { className: "mt-2 text-xs text-white/50", children: subsystem.details }), subsystem.error && _jsx("p", { className: "mt-2 text-xs text-rose-400", children: subsystem.error })] }, name))) })] })) : null] }));
}
function OverviewView() {
    return (_jsxs("div", { className: "space-y-4 text-white/70", children: [_jsx("h2", { className: "text-2xl font-semibold text-white", children: "DreamScope \u00B7 Collective Intelligence" }), _jsx("p", { children: "Memory DNA captures the traits and lineage of DreamNet's agents, squads, spores, and endpoints. Resonance correlates those memories into high-level insights that guide HALO, Squad Builder, and human operators." }), _jsx("p", { children: "Use the navigation to inspect Memory DNA or Resonance insights. Phase 1 is advisory\u2014no automatic rewrites, just intelligence you can act on." })] }));
}
export function DreamScopeRouter({ path }) {
    const navItems = [
        { href: "/dreamscope", label: "Overview" },
        { href: "/dreamscope/memory", label: "Memory DNA" },
        { href: "/dreamscope/resonance", label: "Resonance" },
        { href: "/dreamscope/alive", label: "Alive Mode" },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-black via-dream-black to-black text-white", children: [_jsx("header", { className: "border-b border-white/10 bg-black/60", children: _jsxs("div", { className: "mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold tracking-[0.3em] text-white/80", children: "DREAMSCOPE" }), _jsx("p", { className: "text-sm text-white/50", children: "Memory DNA \u00B7 Resonance Engine \u00B7 Advisory Intelligence" })] }), _jsxs("nav", { className: "flex flex-wrap gap-2 text-sm", children: [navItems.map((item) => (_jsx("a", { href: item.href, className: `rounded-full px-4 py-2 transition ${path === item.href
                                        ? "bg-dream-cyan/30 text-dream-cyan"
                                        : path.startsWith(item.href) && item.href !== "/dreamscope"
                                            ? "bg-dream-cyan/10 text-dream-cyan/80"
                                            : "bg-white/5 text-white/60 hover:text-white"}`, children: item.label }, item.href))), _jsx("a", { href: "/", className: "rounded-full bg-white/5 px-4 py-2 text-white/60 hover:text-white", children: "\u2190 Back to DreamNet" })] })] }) }), _jsx("main", { className: "mx-auto max-w-6xl px-6 py-10", children: path === "/dreamscope" ? (_jsx(OverviewView, {})) : path.startsWith("/dreamscope/memory") ? (_jsx(MemoryView, {})) : path.startsWith("/dreamscope/resonance") ? (_jsx(ResonanceView, {})) : path.startsWith("/dreamscope/alive") ? (_jsx(AliveView, {})) : (_jsx("p", { className: "text-sm text-white/50", children: "Section not found." })) })] }));
}
