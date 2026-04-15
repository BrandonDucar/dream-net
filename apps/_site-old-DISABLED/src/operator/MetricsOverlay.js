import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMetrics } from "../hooks/useMetrics";
import { Activity, Clock, CheckCircle, AlertCircle, Image, Send, Zap, Server } from "lucide-react";
const sectionClass = "rounded-3xl border border-white/10 bg-black/40 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur";
function MetricCard({ title, value, icon, subtitle, color = "cyan" }) {
    const colorClasses = {
        cyan: "border-dream-cyan/30 bg-dream-cyan/10 text-dream-cyan",
        emerald: "border-dream-emerald/30 bg-dream-emerald/10 text-dream-emerald",
        amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
        rose: "border-rose-400/30 bg-rose-400/10 text-rose-300",
        magenta: "border-dream-magenta/30 bg-dream-magenta/10 text-dream-magenta",
    };
    return (_jsx("div", { className: `${sectionClass} border ${colorClasses[color]}`, children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `rounded-xl p-2 ${colorClasses[color]}`, children: icon }), _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: title }), _jsx("p", { className: "text-2xl font-semibold text-white", children: value }), subtitle && _jsx("p", { className: "text-xs text-white/60 mt-1", children: subtitle })] })] }) }) }));
}
function PhaseBadge({ phase }) {
    const phaseColors = {
        operational: { bg: "bg-green-500/20", text: "text-green-400" },
        degraded: { bg: "bg-amber-500/20", text: "text-amber-300" },
        booting: { bg: "bg-blue-500/20", text: "text-blue-400" },
        error: { bg: "bg-red-500/20", text: "text-red-400" },
    };
    const colors = phaseColors[phase] ?? { bg: "bg-white/10", text: "text-white/60" };
    return (_jsx("span", { className: `rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${colors.bg} ${colors.text}`, children: phase }));
}
export function MetricsOverlay() {
    const { metrics, isLoading, error } = useMetrics(20000);
    if (isLoading && !metrics) {
        return (_jsx("div", { className: sectionClass, children: _jsx("p", { className: "text-white/60", children: "Loading metrics..." }) }));
    }
    if (error) {
        return (_jsx("div", { className: sectionClass, children: _jsxs("p", { className: "text-rose-400", children: ["Error loading metrics: ", error] }) }));
    }
    if (!metrics) {
        return null;
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: "Metrics & Insights" }), _jsx("h2", { className: "text-2xl font-semibold text-white", children: "System Overview" })] }), _jsx(PhaseBadge, { phase: metrics.phase })] }), _jsxs("div", { className: "grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4", children: [_jsx(MetricCard, { title: "Uptime", value: `${metrics.uptimePercent.toFixed(1)}%`, icon: _jsx(Server, { className: "w-5 h-5" }), color: "emerald" }), _jsx(MetricCard, { title: "Heartbeat", value: `${metrics.avgHeartbeatMs}ms`, icon: _jsx(Activity, { className: "w-5 h-5" }), subtitle: "Avg latency", color: "cyan" }), _jsx(MetricCard, { title: "HALO Cycles", value: metrics.haloCyclesToday, icon: _jsx(Zap, { className: "w-5 h-5" }), subtitle: "Today", color: "magenta" }), _jsx(MetricCard, { title: "Tasks", value: `${metrics.tasksCompleted} / ${metrics.tasksPending}`, icon: _jsx(CheckCircle, { className: "w-5 h-5" }), subtitle: "Done / Pending", color: metrics.tasksPending > 0 ? "amber" : "emerald" }), _jsx(MetricCard, { title: "Events", value: metrics.events24h, icon: _jsx(AlertCircle, { className: "w-5 h-5" }), subtitle: "Last 24h", color: "cyan" }), _jsx(MetricCard, { title: "Media", value: `${metrics.mediaPublic} / ${metrics.mediaCount}`, icon: _jsx(Image, { className: "w-5 h-5" }), subtitle: "Public / Total", color: "magenta" }), _jsx(MetricCard, { title: "Posts Queued", value: metrics.postsQueued, icon: _jsx(Clock, { className: "w-5 h-5" }), color: "amber" }), _jsx(MetricCard, { title: "Posts Posted", value: metrics.postsPosted, icon: _jsx(Send, { className: "w-5 h-5" }), color: "emerald" })] })] }));
}
