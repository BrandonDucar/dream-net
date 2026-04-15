import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
export function RewardsLeaderboard({ currentUserId, type = "dream" }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState(type);
    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/api/rewards/leaderboard?type=${selectedType}&limit=50`);
                if (res.ok) {
                    const json = await res.json();
                    setLeaderboard(json.leaderboard || []);
                }
            }
            catch (err) {
                console.error("Failed to fetch leaderboard:", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, [selectedType]);
    const getRankIcon = (rank) => {
        if (rank === 1)
            return "🥇";
        if (rank === 2)
            return "🥈";
        if (rank === 3)
            return "🥉";
        return `#${rank}`;
    };
    const formatAddress = (address) => {
        if (!address)
            return "—";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };
    return (_jsxs("div", { className: "bg-gray-900/50 rounded-xl border border-white/10 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent", children: "Leaderboard" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setSelectedType("dream"), className: `px-3 py-1 rounded text-sm transition ${selectedType === "dream"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`, children: "DREAM" }), _jsx("button", { onClick: () => setSelectedType("sheep"), className: `px-3 py-1 rounded text-sm transition ${selectedType === "sheep"
                                    ? "bg-yellow-600 text-white"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`, children: "SHEEP" }), _jsx("button", { onClick: () => setSelectedType("streak"), className: `px-3 py-1 rounded text-sm transition ${selectedType === "streak"
                                    ? "bg-orange-600 text-white"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`, children: "Streak" })] })] }), loading ? (_jsx("div", { className: "text-center py-8 text-gray-400", children: "Loading leaderboard..." })) : leaderboard.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-400", children: "No entries yet. Be the first!" })) : (_jsx("div", { className: "space-y-2", children: leaderboard.map((entry) => {
                    const isCurrentUser = currentUserId?.toLowerCase() === entry.userId.toLowerCase();
                    return (_jsx("div", { className: `p-4 rounded-lg border transition ${isCurrentUser
                            ? "bg-cyan-900/30 border-cyan-500/50"
                            : entry.rank <= 3
                                ? "bg-gray-800/50 border-gray-700/50"
                                : "bg-gray-900/30 border-gray-800/50"}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "text-2xl font-bold w-12 text-center", children: getRankIcon(entry.rank) }), _jsxs("div", { children: [_jsxs("div", { className: `font-semibold ${isCurrentUser ? "text-cyan-400" : "text-white"}`, children: [formatAddress(entry.userId), isCurrentUser && _jsx("span", { className: "ml-2 text-xs text-cyan-400", children: "(You)" })] }), entry.streakDays > 0 && (_jsxs("div", { className: "text-xs text-gray-400", children: ["\uD83D\uDD25 ", entry.streakDays, " day streak"] }))] })] }), _jsxs("div", { className: "text-right", children: [selectedType === "dream" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-lg font-bold text-blue-400", children: entry.dream.toLocaleString() }), _jsx("div", { className: "text-xs text-gray-400", children: "DREAM" })] })), selectedType === "sheep" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-lg font-bold text-yellow-400", children: entry.sheep.toLocaleString() }), _jsx("div", { className: "text-xs text-gray-400", children: "SHEEP" })] })), selectedType === "streak" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-lg font-bold text-orange-400", children: entry.streakDays }), _jsx("div", { className: "text-xs text-gray-400", children: "days" })] }))] })] }) }, entry.userId));
                }) }))] }));
}
