import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
export function DreamTokenTab() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [minting, setMinting] = useState(false);
    const [burning, setBurning] = useState(false);
    const [mintUserId, setMintUserId] = useState("");
    const [mintAmount, setMintAmount] = useState("");
    const [burnUserId, setBurnUserId] = useState("");
    const [burnAmount, setBurnAmount] = useState("");
    const operatorToken = localStorage.getItem("operatorToken") || "";
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [configRes, eventsRes] = await Promise.all([
                fetch(`${API_BASE}/api/dream/config`),
                fetch(`${API_BASE}/api/admin/dream/events`, {
                    headers: {
                        Authorization: `Bearer ${operatorToken}`,
                    },
                }),
            ]);
            if (!configRes.ok || !eventsRes.ok)
                throw new Error("Failed to fetch data");
            const configJson = await configRes.json();
            const eventsJson = await eventsRes.json();
            // Calculate totals
            const mintEvents = eventsJson.events.filter((e) => e.type === "mint");
            const totalIssued = mintEvents.reduce((sum, e) => sum + BigInt(e.amount || "0"), BigInt(0));
            // Get top users (simplified - in production, you'd query all users)
            // For now, we'll just show from events
            const userDreamMap = new Map();
            const userClaimableMap = new Map();
            // This is a simplified approach - in production, you'd query all users
            const topUsersByInternal = [];
            const topUsersByClaimable = [];
            setData({
                config: configJson.config,
                events: eventsJson.events,
                topUsersByInternal,
                topUsersByClaimable,
                totalSimulatedIssued: totalIssued.toString(),
            });
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        void fetchData();
    }, []);
    const handleMint = async () => {
        if (!mintUserId || !mintAmount) {
            setError("User ID and amount required");
            return;
        }
        setMinting(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/admin/dream/mint-simulated`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${operatorToken}`,
                },
                body: JSON.stringify({
                    userId: mintUserId,
                    amount: mintAmount,
                }),
            });
            if (!res.ok)
                throw new Error("Failed to simulate mint");
            await fetchData();
            setMintUserId("");
            setMintAmount("");
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setMinting(false);
        }
    };
    const handleBurn = async () => {
        if (!burnUserId || !burnAmount) {
            setError("User ID and amount required");
            return;
        }
        setBurning(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/admin/dream/burn-simulated`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${operatorToken}`,
                },
                body: JSON.stringify({
                    userId: burnUserId,
                    amount: burnAmount,
                }),
            });
            if (!res.ok)
                throw new Error("Failed to simulate burn");
            await fetchData();
            setBurnUserId("");
            setBurnAmount("");
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setBurning(false);
        }
    };
    if (loading && !data) {
        return (_jsx("div", { className: "p-6", children: _jsx("div", { className: "text-gray-400", children: "Loading DREAM Token data..." }) }));
    }
    if (!data) {
        return null;
    }
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: "DREAM Token" }), error && _jsx("div", { className: "p-3 bg-red-900/50 text-red-200 rounded", children: error }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-4 bg-gray-900 rounded", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Max Supply" }), _jsxs("div", { className: "text-2xl font-bold text-blue-400", children: [parseInt(data.config.maxSupply).toLocaleString(), " ", data.config.symbol] })] }), _jsxs("div", { className: "p-4 bg-gray-900 rounded", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Total Simulated Issued" }), _jsxs("div", { className: "text-2xl font-bold text-green-400", children: [parseInt(data.totalSimulatedIssued || "0").toLocaleString(), " ", data.config.symbol] })] })] }), _jsxs("div", { className: "p-4 bg-gray-900 rounded", children: [_jsx("h3", { className: "font-semibold mb-3", children: "Simulate Mint" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "User ID" }), _jsx("input", { type: "text", value: mintUserId, onChange: (e) => setMintUserId(e.target.value), placeholder: "user-id", className: "w-full px-3 py-2 border rounded bg-black text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Amount" }), _jsx("input", { type: "number", value: mintAmount, onChange: (e) => setMintAmount(e.target.value), placeholder: "1000", className: "w-full px-3 py-2 border rounded bg-black text-white" })] }), _jsx("button", { onClick: handleMint, disabled: minting || !mintUserId || !mintAmount, className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50", children: minting ? "Minting..." : "Simulate Mint" })] })] }), _jsxs("div", { className: "p-4 bg-gray-900 rounded", children: [_jsx("h3", { className: "font-semibold mb-3", children: "Simulate Burn" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "User ID" }), _jsx("input", { type: "text", value: burnUserId, onChange: (e) => setBurnUserId(e.target.value), placeholder: "user-id", className: "w-full px-3 py-2 border rounded bg-black text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Amount" }), _jsx("input", { type: "number", value: burnAmount, onChange: (e) => setBurnAmount(e.target.value), placeholder: "1000", className: "w-full px-3 py-2 border rounded bg-black text-white" })] }), _jsx("button", { onClick: handleBurn, disabled: burning || !burnUserId || !burnAmount, className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50", children: burning ? "Burning..." : "Simulate Burn" })] })] }), _jsxs("div", { className: "p-4 bg-gray-900 rounded", children: [_jsx("h3", { className: "font-semibold mb-3", children: "Token Events" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left p-2", children: "Type" }), _jsx("th", { className: "text-left p-2", children: "User ID" }), _jsx("th", { className: "text-left p-2", children: "Amount" }), _jsx("th", { className: "text-left p-2", children: "Date" })] }) }), _jsx("tbody", { children: data.events.slice(0, 50).map((event) => (_jsxs("tr", { className: "border-b border-gray-800", children: [_jsx("td", { className: "p-2", children: event.type }), _jsx("td", { className: "p-2 text-gray-400", children: event.userId || "—" }), _jsx("td", { className: "p-2", children: parseInt(event.amount || "0").toLocaleString() }), _jsx("td", { className: "p-2 text-gray-400", children: new Date(event.createdAt).toLocaleString() })] }, event.id))) })] }) })] })] }));
}
