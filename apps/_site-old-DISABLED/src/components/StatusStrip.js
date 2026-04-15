import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API_URL ?? "";
export function StatusStrip() {
    const [status, setStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const fetchStatus = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/public/status`);
            if (response.ok) {
                const data = await response.json();
                setStatus(data);
            }
        }
        catch (error) {
            console.error("Failed to fetch status:", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // Every 30 seconds
        return () => clearInterval(interval);
    }, []);
    if (isLoading || !status) {
        return (_jsx("div", { className: "fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 px-6 py-2 text-xs text-white/60", children: "Loading status..." }));
    }
    const getPhaseBadge = () => {
        const phaseColors = {
            operational: { bg: "bg-green-500/20", text: "text-green-400", icon: "✅" },
            degraded: { bg: "bg-amber-500/20", text: "text-amber-300", icon: "⚠️" },
            error: { bg: "bg-red-500/20", text: "text-red-400", icon: "❌" },
            booting: { bg: "bg-blue-500/20", text: "text-blue-400", icon: "🔄" },
        };
        const colors = phaseColors[status.phase] ?? { bg: "bg-white/10", text: "text-white/60", icon: "❓" };
        return (_jsxs("span", { className: `rounded-full px-2 py-1 text-xs ${colors.bg} ${colors.text}`, children: [colors.icon, " ", status.phase] }));
    };
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1)
            return "just now";
        if (diffMins < 60)
            return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24)
            return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };
    return (_jsx("div", { className: "fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 px-6 py-2", children: _jsxs("div", { className: "mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 text-xs text-white/80", children: [getPhaseBadge(), _jsxs("span", { children: ["Uptime: ", status.uptimePercent.toFixed(1), "%"] }), _jsxs("span", { children: ["Media: ", status.mediaPublic] }), _jsxs("span", { children: ["HALO Cycles: ", status.lastHaloCycle] }), _jsxs("span", { children: ["Posts Queued: ", status.postsQueued] }), _jsxs("span", { className: "text-white/40", children: ["Updated ", formatTime(status.timestamp)] })] }) }));
}
