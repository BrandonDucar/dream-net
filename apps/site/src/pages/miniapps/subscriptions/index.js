import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const SUBSCRIPTION_HUB_ADDRESS = "0x740f36295D7E474c2E4a26C92Dd116f72eb575A6";
const SUBSCRIPTION_BADGE_ADDRESS = "0x761c047B8b03f41Ce106cDA19CCeCb334a37709c";
// SubscriptionHub ABI (simplified)
const SUBSCRIPTION_HUB_ABI = [
    "function plans(uint256) view returns (uint256 id, address creator, address paymentToken, uint256 price, uint64 interval, uint256 badgeId, string name, string description, string badgeURI, bool active, uint64 createdAt)",
    "function nextPlanId() view returns (uint256)",
    "function subscribe(uint256 planId) payable",
    "function cancelSubscription(uint256 planId)",
    "function subscriptions(uint256, address) view returns (uint64 startedAt, uint64 expiresAt, bool active)",
    "event PlanCreated(uint256 indexed planId, address indexed creator, address paymentToken, uint256 price, uint64 interval, uint256 badgeId, string name, string badgeURI)",
    "event SubscriptionActivated(uint256 indexed planId, address indexed subscriber, uint64 expiresAt)",
];
export default function CreatorSubscriptions() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCreator, setIsCreator] = useState(false);
    const [showCreatePlan, setShowCreatePlan] = useState(false);
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
                await fetchPlans();
            }
        }
        catch (err) {
            setError(err.message);
        }
    };
    // Fetch plans from contract
    const fetchPlans = async () => {
        if (!walletAddress)
            return;
        setLoading(true);
        try {
            const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
            const hub = new ethers.Contract(SUBSCRIPTION_HUB_ADDRESS, SUBSCRIPTION_HUB_ABI, provider);
            const nextId = await hub.nextPlanId();
            const planPromises = [];
            // Fetch all plans (up to 20 for now)
            for (let i = 1; i < Math.min(Number(nextId), 21); i++) {
                planPromises.push(hub.plans(i).catch(() => null));
            }
            const planResults = await Promise.all(planPromises);
            const activePlans = planResults
                .map((plan, index) => {
                if (!plan || !plan.active)
                    return null;
                return {
                    id: index + 1,
                    creator: plan.creator,
                    name: plan.name || `Plan ${index + 1}`,
                    description: plan.description || "",
                    price: ethers.formatEther(plan.price || 0),
                    interval: Number(plan.interval || 0),
                    badgeId: Number(plan.badgeId || 0),
                    active: plan.active,
                };
            })
                .filter((p) => p !== null);
            setPlans(activePlans);
            setIsCreator(activePlans.some((p) => p.creator.toLowerCase() === walletAddress.toLowerCase()));
        }
        catch (err) {
            console.error("Failed to fetch plans:", err);
            setError("Failed to load subscription plans");
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (walletAddress) {
            fetchPlans();
        }
    }, [walletAddress]);
    const handleSubscribe = async (planId, price) => {
        if (!walletAddress || !window.ethereum) {
            setError("Wallet not connected");
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const hub = new ethers.Contract(SUBSCRIPTION_HUB_ADDRESS, SUBSCRIPTION_HUB_ABI, signer);
            const tx = await hub.subscribe(planId, {
                value: ethers.parseEther(price),
            });
            await tx.wait();
            await fetchPlans();
            setError(null);
        }
        catch (err) {
            setError(err.message);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent", children: "Creator Subscriptions" }), _jsx("p", { className: "text-gray-400", children: "Launch on-chain membership tiers with ERC1155 badges" })] }), !walletAddress ? (_jsxs("div", { className: "bg-gray-900/50 rounded-xl border border-white/10 p-8 text-center", children: [_jsx("p", { className: "text-gray-400 mb-4", children: "Connect your wallet to manage subscriptions" }), _jsx("button", { onClick: connectWallet, className: "px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition", children: "Connect Wallet" })] })) : (_jsxs(_Fragment, { children: [isCreator && (_jsx("div", { className: "bg-gradient-to-r from-purple-900/30 to-pink-900/20 rounded-xl border border-purple-500/30 p-6 mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold mb-2", children: "Creator Dashboard" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Manage your subscription plans" })] }), _jsx("button", { onClick: () => setShowCreatePlan(true), className: "px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition", children: "Create Plan" })] }) })), error && (_jsx("div", { className: "bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6 text-red-200", children: error })), loading ? (_jsx("div", { className: "text-center py-12 text-gray-400", children: "Loading subscription plans..." })) : plans.length === 0 ? (_jsxs("div", { className: "bg-gray-900/50 rounded-xl border border-white/10 p-12 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83C\uDFA8" }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: "No Subscription Plans Yet" }), _jsx("p", { className: "text-gray-400 mb-6", children: "Be the first creator to launch a subscription plan!" }), walletAddress && (_jsx("button", { onClick: () => setShowCreatePlan(true), className: "px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition", children: "Create First Plan" }))] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: plans.map((plan) => (_jsxs("div", { className: "bg-gray-900/50 rounded-xl border border-white/10 p-6 hover:border-purple-500/50 transition", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h3", { className: "text-xl font-bold mb-2", children: plan.name }), _jsx("p", { className: "text-gray-400 text-sm mb-4", children: plan.description })] }), _jsxs("div", { className: "mb-4 space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-400", children: "Price:" }), _jsxs("span", { className: "font-semibold text-purple-400", children: [parseFloat(plan.price).toFixed(4), " ETH"] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-400", children: "Interval:" }), _jsx("span", { className: "text-gray-300", children: plan.interval >= 86400 * 30
                                                            ? `${Math.floor(plan.interval / (86400 * 30))} month(s)`
                                                            : plan.interval >= 86400
                                                                ? `${Math.floor(plan.interval / 86400)} day(s)`
                                                                : `${Math.floor(plan.interval / 3600)} hour(s)` })] })] }), _jsx("button", { onClick: () => handleSubscribe(plan.id, plan.price), className: "w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition", children: "Subscribe" })] }, plan.id))) })), _jsxs("div", { className: "mt-8 bg-gray-900/50 rounded-xl border border-white/10 p-4 text-center", children: [_jsx("div", { className: "text-sm text-gray-400 mb-1", children: "Connected Wallet" }), _jsxs("div", { className: "font-mono text-sm text-purple-400", children: [walletAddress.slice(0, 6), "...", walletAddress.slice(-4)] })] })] }))] }) }));
}
