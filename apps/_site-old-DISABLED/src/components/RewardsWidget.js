import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
export function RewardsWidget({ userId, onLoginReward }) {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [claimingDaily, setClaimingDaily] = useState(false);
    const [claimingWeekly, setClaimingWeekly] = useState(false);
    const fetchBalance = async () => {
        if (!userId)
            return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/rewards/balance?userId=${userId}`);
            if (!res.ok)
                throw new Error("Failed to fetch balance");
            const json = await res.json();
            setBalance(json.balance);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        void fetchBalance();
        // Grant login reward on mount (silently)
        if (userId && onLoginReward) {
            fetch(`${API_BASE}/api/rewards/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                },
            }).catch(() => {
                // Silently fail
            });
        }
    }, [userId]);
    const canClaimDaily = () => {
        if (!balance?.lastDailyClaimAt)
            return true;
        const lastClaim = new Date(balance.lastDailyClaimAt);
        const now = new Date();
        const hoursSince = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
        return hoursSince >= 24;
    };
    const canClaimWeekly = () => {
        if (!balance?.lastWeeklyClaimAt)
            return true;
        const lastClaim = new Date(balance.lastWeeklyClaimAt);
        const now = new Date();
        const daysSince = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince >= 7;
    };
    const handleDailyClaim = async () => {
        if (!userId || !canClaimDaily())
            return;
        setClaimingDaily(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/rewards/daily-claim`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                },
            });
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Failed to claim daily reward");
            }
            const json = await res.json();
            setBalance(json.balance);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setClaimingDaily(false);
        }
    };
    const handleWeeklyClaim = async () => {
        if (!userId || !canClaimWeekly())
            return;
        setClaimingWeekly(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/rewards/weekly-claim`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId,
                },
            });
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Failed to claim weekly reward");
            }
            const json = await res.json();
            setBalance(json.balance);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setClaimingWeekly(false);
        }
    };
    if (loading && !balance) {
        return (_jsx("div", { className: "p-4 bg-gray-900/50 rounded-lg border border-white/10", children: _jsx("div", { className: "text-sm text-gray-400", children: "Loading rewards..." }) }));
    }
    if (!balance) {
        return null;
    }
    return (_jsxs("div", { className: "p-4 bg-gray-900/50 rounded-lg border border-white/10 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Rewards" }), _jsx("button", { onClick: fetchBalance, className: "text-xs text-gray-400 hover:text-white transition", children: "Refresh" })] }), error && (_jsx("div", { className: "p-2 bg-red-900/30 text-red-200 text-xs rounded", children: error })), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "p-3 bg-blue-900/20 rounded border border-blue-500/20", children: [_jsx("div", { className: "text-xs text-blue-300/80 mb-1", children: "DREAM" }), _jsx("div", { className: "text-xl font-bold text-blue-400", children: balance.dream })] }), _jsxs("div", { className: "p-3 bg-yellow-900/20 rounded border border-yellow-500/20", children: [_jsx("div", { className: "text-xs text-yellow-300/80 mb-1", children: "SHEEP" }), _jsx("div", { className: "text-xl font-bold text-yellow-400", children: balance.sheep })] })] }), balance.streakDays && balance.streakDays > 0 && (_jsxs("div", { className: "text-xs text-gray-400", children: ["Streak: ", balance.streakDays, " day", balance.streakDays !== 1 ? "s" : ""] })), _jsxs("div", { className: "space-y-2", children: [_jsx("button", { onClick: handleDailyClaim, disabled: !canClaimDaily() || claimingDaily, className: "w-full px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded text-sm text-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition", children: claimingDaily ? "Claiming..." : canClaimDaily() ? "Claim Daily" : "Daily Claimed" }), _jsx("button", { onClick: handleWeeklyClaim, disabled: !canClaimWeekly() || claimingWeekly, className: "w-full px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded text-sm text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition", children: claimingWeekly ? "Claiming..." : canClaimWeekly() ? "Claim Weekly" : "Weekly Claimed" })] })] }));
}
