import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
export function RewardsTab() {
    const [userId, setUserId] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [adjusting, setAdjusting] = useState(false);
    const [deltaDream, setDeltaDream] = useState("");
    const [deltaSheep, setDeltaSheep] = useState("");
    const [reason, setReason] = useState("");
    const operatorToken = localStorage.getItem("operatorToken") || "";
    const fetchUserRewards = async () => {
        if (!userId)
            return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/admin/rewards/${userId}`, {
                headers: {
                    Authorization: `Bearer ${operatorToken}`,
                },
            });
            if (!res.ok)
                throw new Error("Failed to fetch rewards");
            const json = await res.json();
            setData(json);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAdjust = async () => {
        if (!userId)
            return;
        if (!deltaDream && !deltaSheep) {
            setError("At least one delta is required");
            return;
        }
        setAdjusting(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/admin/rewards/${userId}/adjust`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${operatorToken}`,
                },
                body: JSON.stringify({
                    deltaDream: deltaDream ? parseInt(deltaDream, 10) : undefined,
                    deltaSheep: deltaSheep ? parseInt(deltaSheep, 10) : undefined,
                    reason,
                }),
            });
            if (!res.ok)
                throw new Error("Failed to adjust balance");
            await fetchUserRewards();
            setDeltaDream("");
            setDeltaSheep("");
            setReason("");
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setAdjusting(false);
        }
    };
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: "User Rewards" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "User ID" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: userId, onChange: (e) => setUserId(e.target.value), placeholder: "Enter user ID", className: "flex-1 px-3 py-2 border rounded bg-black text-white" }), _jsx("button", { onClick: fetchUserRewards, disabled: !userId || loading, className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50", children: loading ? "Loading..." : "Fetch" })] })] }), error && _jsx("div", { className: "p-3 bg-red-900/50 text-red-200 rounded", children: error }), data && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 bg-gray-900 rounded", children: [_jsx("div", { className: "text-sm text-gray-400", children: "DREAM Balance" }), _jsx("div", { className: "text-2xl font-bold text-blue-400", children: data.balance.dream })] }), _jsxs("div", { className: "p-4 bg-gray-900 rounded", children: [_jsx("div", { className: "text-sm text-gray-400", children: "SHEEP Balance" }), _jsx("div", { className: "text-2xl font-bold text-yellow-400", children: data.balance.sheep })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 bg-gray-900 rounded", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Streak Days" }), _jsx("div", { className: "text-xl font-semibold", children: data.balance.streakDays || 0 })] }), _jsxs("div", { className: "p-4 bg-gray-900 rounded", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Last Daily Claim" }), _jsx("div", { className: "text-sm", children: data.balance.lastDailyClaimAt
                                                    ? new Date(data.balance.lastDailyClaimAt).toLocaleString()
                                                    : "Never" })] })] }), _jsxs("div", { className: "p-4 bg-gray-900 rounded", children: [_jsx("h3", { className: "font-semibold mb-3", children: "Adjust Balance" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Delta DREAM" }), _jsx("input", { type: "number", value: deltaDream, onChange: (e) => setDeltaDream(e.target.value), placeholder: "0", className: "w-full px-3 py-2 border rounded bg-black text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Delta SHEEP" }), _jsx("input", { type: "number", value: deltaSheep, onChange: (e) => setDeltaSheep(e.target.value), placeholder: "0", className: "w-full px-3 py-2 border rounded bg-black text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Reason" }), _jsx("input", { type: "text", value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Admin adjustment reason", className: "w-full px-3 py-2 border rounded bg-black text-white" })] }), _jsx("button", { onClick: handleAdjust, disabled: adjusting || (!deltaDream && !deltaSheep), className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50", children: adjusting ? "Adjusting..." : "Adjust Balance" })] })] }), _jsxs("div", { className: "p-4 bg-gray-900 rounded", children: [_jsx("h3", { className: "font-semibold mb-3", children: "Recent Reward Events" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left p-2", children: "Type" }), _jsx("th", { className: "text-left p-2", children: "DREAM" }), _jsx("th", { className: "text-left p-2", children: "SHEEP" }), _jsx("th", { className: "text-left p-2", children: "Date" })] }) }), _jsx("tbody", { children: data.events.map((event) => (_jsxs("tr", { className: "border-b border-gray-800", children: [_jsx("td", { className: "p-2", children: event.type }), _jsxs("td", { className: `p-2 ${event.deltaDream > 0 ? "text-green-400" : event.deltaDream < 0 ? "text-red-400" : ""}`, children: [event.deltaDream > 0 ? "+" : "", event.deltaDream] }), _jsxs("td", { className: `p-2 ${event.deltaSheep > 0 ? "text-green-400" : event.deltaSheep < 0 ? "text-red-400" : ""}`, children: [event.deltaSheep > 0 ? "+" : "", event.deltaSheep] }), _jsx("td", { className: "p-2 text-gray-400", children: new Date(event.createdAt).toLocaleString() })] }, event.id))) })] }) })] })] }))] })] }));
}
