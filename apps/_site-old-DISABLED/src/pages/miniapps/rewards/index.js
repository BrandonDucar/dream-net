import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { RewardsLeaderboard } from "../../../components/RewardsLeaderboard";
import { Achievements } from "../../../components/Achievements";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const DREAM_TOKEN_ADDRESS = "0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77";
// Simple ERC20 ABI (just what we need)
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
];
export default function DreamRewardsHub() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [balance, setBalance] = useState(null);
    const [onchainDream, setOnchainDream] = useState("0");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [claimingDaily, setClaimingDaily] = useState(false);
    const [claimingWeekly, setClaimingWeekly] = useState(false);
    // Connect wallet
    const connectWallet = async () => {
        if (typeof window === "undefined" || !window.ethereum) {
            setError("MetaMask not detected");
            return;
        }
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
                await fetchBalances(accounts[0]);
            }
        }
        catch (err) {
            setError(err.message);
        }
    };
    // Fetch balances
    const fetchBalances = async (address) => {
        setLoading(true);
        try {
            // Internal balance
            const res = await fetch(`${API_BASE}/api/rewards/balance?userId=${address}`);
            if (res.ok) {
                const json = await res.json();
                setBalance(json.balance);
            }
            // On-chain DREAM balance
            const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
            const dreamToken = new ethers.Contract(DREAM_TOKEN_ADDRESS, ERC20_ABI, provider);
            const balance = await dreamToken.balanceOf(address);
            const decimals = await dreamToken.decimals();
            setOnchainDream(ethers.formatUnits(balance, decimals));
        }
        catch (err) {
            console.error("Failed to fetch balances:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (walletAddress) {
            fetchBalances(walletAddress);
            // Refresh every 30 seconds
            const interval = setInterval(() => fetchBalances(walletAddress), 30000);
            return () => clearInterval(interval);
        }
    }, [walletAddress]);
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
        if (!walletAddress || !canClaimDaily())
            return;
        setClaimingDaily(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/rewards/daily-claim`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": walletAddress,
                },
            });
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Failed to claim");
            }
            const json = await res.json();
            setBalance(json.balance);
            // Refresh on-chain balance
            await fetchBalances(walletAddress);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setClaimingDaily(false);
        }
    };
    const handleWeeklyClaim = async () => {
        if (!walletAddress || !canClaimWeekly())
            return;
        setClaimingWeekly(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/rewards/weekly-claim`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": walletAddress,
                },
            });
            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Failed to claim");
            }
            const json = await res.json();
            setBalance(json.balance);
            await fetchBalances(walletAddress);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setClaimingWeekly(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent", children: "DREAM Rewards Hub" }), _jsx("p", { className: "text-gray-400", children: "Claim daily rewards, track streaks, and earn DREAM tokens" })] }), !walletAddress ? (_jsxs("div", { className: "bg-gray-900/50 rounded-xl border border-white/10 p-8 text-center", children: [_jsx("p", { className: "text-gray-400 mb-4", children: "Connect your wallet to start earning DREAM" }), _jsx("button", { onClick: connectWallet, className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition", children: "Connect Wallet" })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl border border-blue-500/30 p-6", children: [_jsx("div", { className: "text-sm text-blue-300/80 mb-2", children: "Internal DREAM" }), _jsx("div", { className: "text-3xl font-bold text-blue-400", children: balance?.dream ?? 0 }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: "Available to claim" })] }), _jsxs("div", { className: "bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl border border-yellow-500/30 p-6", children: [_jsx("div", { className: "text-sm text-yellow-300/80 mb-2", children: "SHEEP" }), _jsx("div", { className: "text-3xl font-bold text-yellow-400", children: balance?.sheep ?? 0 }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: "Soft currency" })] }), _jsxs("div", { className: "bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl border border-green-500/30 p-6", children: [_jsx("div", { className: "text-sm text-green-300/80 mb-2", children: "On-Chain DREAM" }), _jsx("div", { className: "text-3xl font-bold text-green-400", children: parseFloat(onchainDream).toFixed(2) }), _jsx("div", { className: "text-xs text-gray-400 mt-1", children: "On Base mainnet" })] })] }), balance?.streakDays && balance.streakDays > 0 && (_jsx("div", { className: "bg-gray-900/50 rounded-xl border border-white/10 p-6 mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Current Streak" }), _jsxs("div", { className: "text-2xl font-bold", children: ["\uD83D\uDD25 ", balance.streakDays, " day", balance.streakDays !== 1 ? "s" : ""] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Bonus Multiplier" }), _jsxs("div", { className: "text-xl font-semibold text-cyan-400", children: [((balance.streakDays * 0.1) + 1).toFixed(1), "x"] })] })] }) })), error && (_jsx("div", { className: "bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6 text-red-200", children: error })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [_jsxs("button", { onClick: handleDailyClaim, disabled: !canClaimDaily() || claimingDaily || loading, className: `p-6 rounded-xl border transition ${canClaimDaily()
                                        ? "bg-green-600/20 border-green-500/30 hover:bg-green-600/30"
                                        : "bg-gray-900/50 border-gray-700/50 opacity-50 cursor-not-allowed"}`, children: [_jsx("div", { className: "text-lg font-semibold mb-2", children: claimingDaily ? "Claiming..." : canClaimDaily() ? "Claim Daily" : "Daily Claimed" }), _jsx("div", { className: "text-sm text-gray-400", children: canClaimDaily()
                                                ? "Claim your daily DREAM + SHEEP rewards"
                                                : `Next claim: ${balance?.lastDailyClaimAt ? new Date(new Date(balance.lastDailyClaimAt).getTime() + 24 * 60 * 60 * 1000).toLocaleTimeString() : "Soon"}` })] }), _jsxs("button", { onClick: handleWeeklyClaim, disabled: !canClaimWeekly() || claimingWeekly || loading, className: `p-6 rounded-xl border transition ${canClaimWeekly()
                                        ? "bg-purple-600/20 border-purple-500/30 hover:bg-purple-600/30"
                                        : "bg-gray-900/50 border-gray-700/50 opacity-50 cursor-not-allowed"}`, children: [_jsx("div", { className: "text-lg font-semibold mb-2", children: claimingWeekly ? "Claiming..." : canClaimWeekly() ? "Claim Weekly" : "Weekly Claimed" }), _jsx("div", { className: "text-sm text-gray-400", children: canClaimWeekly()
                                                ? "Claim your weekly bonus rewards"
                                                : `Next claim: ${balance?.lastWeeklyClaimAt ? new Date(new Date(balance.lastWeeklyClaimAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : "Soon"}` })] })] }), _jsxs("div", { className: "bg-gray-900/50 rounded-xl border border-white/10 p-4 text-center mb-6", children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Connected Wallet" }), _jsxs("div", { className: "font-mono text-sm text-cyan-400", children: [walletAddress.slice(0, 6), "...", walletAddress.slice(-4)] })] }), _jsx("div", { className: "mb-6", children: _jsx(RewardsLeaderboard, { currentUserId: walletAddress }) }), _jsx("div", { children: _jsx(Achievements, { userId: walletAddress, balance: balance }) })] }))] }) }));
}
