import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
export function Achievements({ userId, balance }) {
    const [achievements, setAchievements] = useState([]);
    useEffect(() => {
        if (!balance)
            return;
        const allAchievements = [
            {
                id: "first-claim",
                name: "First Steps",
                description: "Claim your first daily reward",
                icon: "🌱",
                unlocked: (balance.dream || 0) > 0,
                progress: balance.dream > 0 ? 1 : 0,
                maxProgress: 1,
            },
            {
                id: "streak-7",
                name: "Week Warrior",
                description: "Maintain a 7-day streak",
                icon: "🔥",
                unlocked: (balance.streakDays || 0) >= 7,
                progress: Math.min(balance.streakDays || 0, 7),
                maxProgress: 7,
            },
            {
                id: "streak-30",
                name: "Month Master",
                description: "Maintain a 30-day streak",
                icon: "💎",
                unlocked: (balance.streakDays || 0) >= 30,
                progress: Math.min(balance.streakDays || 0, 30),
                maxProgress: 30,
            },
            {
                id: "dream-100",
                name: "Century Club",
                description: "Earn 100 DREAM",
                icon: "⭐",
                unlocked: (balance.dream || 0) >= 100,
                progress: Math.min(balance.dream || 0, 100),
                maxProgress: 100,
            },
            {
                id: "dream-1000",
                name: "Thousandaire",
                description: "Earn 1,000 DREAM",
                icon: "🌟",
                unlocked: (balance.dream || 0) >= 1000,
                progress: Math.min(balance.dream || 0, 1000),
                maxProgress: 1000,
            },
            {
                id: "sheep-500",
                name: "Flock Leader",
                description: "Earn 500 SHEEP",
                icon: "🐑",
                unlocked: (balance.sheep || 0) >= 500,
                progress: Math.min(balance.sheep || 0, 500),
                maxProgress: 500,
            },
            {
                id: "weekly-claim",
                name: "Weekly Warrior",
                description: "Claim your first weekly reward",
                icon: "📅",
                unlocked: (balance.weeklyGasClaims || 0) > 0,
                progress: balance.weeklyGasClaims || 0,
                maxProgress: 1,
            },
        ];
        setAchievements(allAchievements);
    }, [balance]);
    const unlockedCount = achievements.filter((a) => a.unlocked).length;
    return (_jsxs("div", { className: "bg-gray-900/50 rounded-xl border border-white/10 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent", children: "Achievements" }), _jsxs("div", { className: "text-sm text-gray-400", children: [unlockedCount, " / ", achievements.length, " unlocked"] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: achievements.map((achievement) => (_jsx("div", { className: `p-4 rounded-lg border transition ${achievement.unlocked
                        ? "bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/50"
                        : "bg-gray-800/30 border-gray-700/50 opacity-60"}`, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "text-3xl", children: achievement.icon }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: `font-semibold ${achievement.unlocked ? "text-white" : "text-gray-400"}`, children: achievement.name }), _jsx("div", { className: "text-sm text-gray-400 mb-2", children: achievement.description }), !achievement.unlocked && (_jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: _jsx("div", { className: "bg-purple-500 h-2 rounded-full transition-all", style: {
                                                width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                                            } }) })), achievement.unlocked && (_jsx("div", { className: "text-xs text-purple-300", children: "\u2713 Unlocked" }))] })] }) }, achievement.id))) })] }));
}
