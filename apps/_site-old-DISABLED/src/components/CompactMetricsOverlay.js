import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMetrics } from "../hooks/useMetrics";
import { Activity, Clock, Zap, Server } from "lucide-react";
export function CompactMetricsOverlay() {
    const { metrics, isLoading } = useMetrics(20000);
    if (isLoading || !metrics) {
        return (_jsx("div", { className: "fixed top-4 right-4 z-50 rounded-xl border border-white/10 bg-black/80 backdrop-blur px-4 py-3 text-xs text-white/60", children: "Loading metrics..." }));
    }
    const phaseColors = {
        operational: "text-green-400",
        degraded: "text-amber-300",
        booting: "text-blue-400",
        error: "text-red-400",
    };
    return (_jsxs("div", { className: "fixed top-4 right-4 z-50 rounded-xl border border-white/10 bg-black/80 backdrop-blur p-4 min-w-[280px]", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-white/40", children: "System Status" }), _jsx("span", { className: `text-xs font-semibold uppercase ${phaseColors[metrics.phase] ?? "text-white/60"}`, children: metrics.phase })] }), _jsxs("div", { className: "space-y-2 text-xs", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 text-white/60", children: [_jsx(Server, { className: "w-3 h-3" }), _jsx("span", { children: "Uptime" })] }), _jsxs("span", { className: "text-white font-mono", children: [metrics.uptimePercent.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 text-white/60", children: [_jsx(Activity, { className: "w-3 h-3" }), _jsx("span", { children: "Latency" })] }), _jsxs("span", { className: "text-white font-mono", children: [metrics.avgHeartbeatMs, "ms"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 text-white/60", children: [_jsx(Zap, { className: "w-3 h-3" }), _jsx("span", { children: "HALO Cycles" })] }), _jsx("span", { className: "text-white font-mono", children: metrics.haloCyclesToday })] }), _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-white/10", children: [_jsxs("div", { className: "flex items-center gap-2 text-white/40", children: [_jsx(Clock, { className: "w-3 h-3" }), _jsx("span", { children: "Updated" })] }), _jsx("span", { className: "text-white/60 font-mono text-[10px]", children: new Date(metrics.timestamp).toLocaleTimeString() })] })] })] }));
}
