import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../../../contexts/WalletContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const SUBSCRIPTION_HUB_ADDRESS = "0x740f36295D7E474c2E4a26C92Dd116f72eb575A6";
const SUBSCRIPTION_BADGE_ADDRESS = "0x761c047B8b03f41Ce106cDA19CCeCb334a37709c";

// SubscriptionHub ABI (simplified)
const SUBSCRIPTION_HUB_ABI = [
  "function plans(uint256) view returns (uint256 id, address creator, address paymentToken, uint256 price, uint64 interval, uint256 badgeId, string name, string description, string badgeURI, bool active, uint64 createdAt)",
  "function nextPlanId() view returns (uint256)",
  "function createPlan(string calldata name, string calldata description, address paymentToken, uint256 price, uint64 interval, string calldata badgeURI) external returns (uint256 planId)",
  "function subscribe(uint256 planId) payable",
  "function cancelSubscription(uint256 planId)",
  "function subscriptions(uint256, address) view returns (uint64 startedAt, uint64 expiresAt, bool active)",
  "event PlanCreated(uint256 indexed planId, address indexed creator, address paymentToken, uint256 price, uint64 interval, uint256 badgeId, string name, string badgeURI)",
  "event SubscriptionActivated(uint256 indexed planId, address indexed subscriber, uint64 expiresAt)",
];

interface Plan {
  id: number;
  creator: string;
  name: string;
  description: string;
  price: string;
  interval: number;
  badgeId: number;
  active: boolean;
}

export default function CreatorSubscriptions() {
  const { address, isConnected, connect } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [subscribingPlanId, setSubscribingPlanId] = useState<number | null>(null);
  
  // Plan creation form state
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [planInterval, setPlanInterval] = useState("30"); // days
  const [planBadgeURI, setPlanBadgeURI] = useState("");

  // Sync wallet context with local state
  useEffect(() => {
    if (address) {
      setWalletAddress(address);
      fetchPlans();
    }
  }, [address, isConnected]);

  // Fetch plans from contract
  const fetchPlans = async () => {
    if (!walletAddress) return;
    
    setLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
      const hub = new ethers.Contract(SUBSCRIPTION_HUB_ADDRESS, SUBSCRIPTION_HUB_ABI, provider);
      
      const nextId = await hub.nextPlanId();
      const planPromises = [];
      
      // Fetch all plans (up to 20 for now)
      for (let i = 1; i < Math.min(Number(nextId), 21); i++) {
        planPromises.push(
          hub.plans(i).catch(() => null)
        );
      }
      
      const planResults = await Promise.all(planPromises);
      const activePlans = planResults
        .map((plan, index) => {
          if (!plan || !plan.active) return null;
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
        .filter((p): p is Plan => p !== null);
      
      setPlans(activePlans);
      setIsCreator(activePlans.some((p) => p.creator.toLowerCase() === walletAddress.toLowerCase()));
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      setError("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchPlans();
    }
  }, [walletAddress]);

  const handleSubscribe = async (planId: number, price: string) => {
    if (!walletAddress || !window.ethereum) {
      setError("Wallet not connected");
      await connect();
      return;
    }

    setSubscribingPlanId(planId);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const hub = new ethers.Contract(SUBSCRIPTION_HUB_ADDRESS, SUBSCRIPTION_HUB_ABI, signer);
      
      // Estimate gas first
      const gasEstimate = await hub.subscribe.estimateGas(planId, {
        value: ethers.parseEther(price),
      });
      
      const tx = await hub.subscribe(planId, {
        value: ethers.parseEther(price),
        gasLimit: gasEstimate,
      });
      
      // Show transaction hash
      console.log("Subscription transaction:", tx.hash);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Subscription confirmed:", receipt);
      
      // Refresh plans to show updated subscription status
      await fetchPlans();
      
      // Grant agent unlock if subscription is for premium agent
      try {
        await fetch(`${API_BASE}/api/super-spine/subscription`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: walletAddress,
            agentKey: `premium-${planId}`, // Map plan to agent if needed
            period: "monthly",
          }),
        });
      } catch (err) {
        console.warn("Failed to sync subscription with agent unlock:", err);
      }
      
      setError(null);
    } catch (err: any) {
      if (err.code === 4001) {
        setError("Transaction rejected by user");
      } else {
        setError(err.message || "Failed to subscribe");
      }
      console.error("Subscription error:", err);
    } finally {
      setSubscribingPlanId(null);
    }
  };

  const handleCreatePlan = async () => {
    if (!walletAddress || !window.ethereum) {
      setError("Wallet not connected");
      return;
    }

    if (!planName || !planDescription || !planPrice || !planInterval) {
      setError("Please fill in all required fields");
      return;
    }

    setCreatingPlan(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const hub = new ethers.Contract(SUBSCRIPTION_HUB_ADDRESS, SUBSCRIPTION_HUB_ABI, signer);
      
      // Convert days to seconds (minimum 1 day = 86400 seconds)
      const intervalSeconds = BigInt(parseInt(planInterval)) * BigInt(86400);
      const priceWei = ethers.parseEther(planPrice);
      
      // For ETH payments, use zero address (contract handles ETH natively)
      const ethAddress = "0x0000000000000000000000000000000000000000";
      
      // Default badge URI if not provided
      const badgeURI = planBadgeURI || `https://dreamnet.ink/api/badges/${Date.now()}`;
      
      const tx = await hub.createPlan(
        planName,
        planDescription,
        ethAddress, // paymentToken (zero address for ETH)
        priceWei,
        intervalSeconds,
        badgeURI
      );
      
      await tx.wait();
      
      // Reset form
      setPlanName("");
      setPlanDescription("");
      setPlanPrice("");
      setPlanInterval("30");
      setPlanBadgeURI("");
      setShowCreatePlan(false);
      
      // Refresh plans
      await fetchPlans();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreatingPlan(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Creator Subscriptions
          </h1>
          <p className="text-gray-400">Launch on-chain membership tiers with ERC1155 badges</p>
        </div>

        {/* Wallet Connection */}
        {!walletAddress ? (
          <div className="bg-gray-900/50 rounded-xl border border-white/10 p-8 text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to manage subscriptions</p>
            <button
              onClick={connect}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Creator Tools */}
            {walletAddress && (
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/20 rounded-xl border border-purple-500/30 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-2">Creator Dashboard</h2>
                    <p className="text-gray-400 text-sm">Create and manage subscription plans</p>
                  </div>
                  <button
                    onClick={() => setShowCreatePlan(!showCreatePlan)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
                  >
                    {showCreatePlan ? "Cancel" : "Create Plan"}
                  </button>
                </div>
              </div>
            )}

            {/* Create Plan Form */}
            {showCreatePlan && (
              <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Create Subscription Plan</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Plan Name *</label>
                    <input
                      type="text"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      placeholder="e.g., Premium Membership"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description *</label>
                    <textarea
                      value={planDescription}
                      onChange={(e) => setPlanDescription(e.target.value)}
                      placeholder="Describe what subscribers get..."
                      rows={3}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Price (ETH) *</label>
                      <input
                        type="number"
                        step="0.001"
                        value={planPrice}
                        onChange={(e) => setPlanPrice(e.target.value)}
                        placeholder="0.01"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Interval (Days) *</label>
                      <input
                        type="number"
                        min="1"
                        value={planInterval}
                        onChange={(e) => setPlanInterval(e.target.value)}
                        placeholder="30"
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Badge URI (Optional)</label>
                    <input
                      type="text"
                      value={planBadgeURI}
                      onChange={(e) => setPlanBadgeURI(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">Metadata URI for the subscription badge NFT</p>
                  </div>
                  <button
                    onClick={handleCreatePlan}
                    disabled={creatingPlan}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingPlan ? "Creating..." : "Create Plan"}
                  </button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6 text-red-200">
                {error}
              </div>
            )}

            {/* Plans Grid */}
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading subscription plans...</div>
            ) : plans.length === 0 ? (
              <div className="bg-gray-900/50 rounded-xl border border-white/10 p-12 text-center">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">No Subscription Plans Yet</h3>
                <p className="text-gray-400 mb-6">
                  Be the first creator to launch a subscription plan!
                </p>
                {walletAddress && (
                  <button
                    onClick={() => setShowCreatePlan(true)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
                  >
                    Create First Plan
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-gray-900/50 rounded-xl border border-white/10 p-6 hover:border-purple-500/50 transition"
                  >
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                    </div>
                    
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Price:</span>
                        <span className="font-semibold text-purple-400">
                          {parseFloat(plan.price).toFixed(4)} ETH
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Interval:</span>
                        <span className="text-gray-300">
                          {plan.interval >= 86400 * 30
                            ? `${Math.floor(plan.interval / (86400 * 30))} month(s)`
                            : plan.interval >= 86400
                            ? `${Math.floor(plan.interval / 86400)} day(s)`
                            : `${Math.floor(plan.interval / 3600)} hour(s)`}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSubscribe(plan.id, plan.price)}
                      disabled={subscribingPlanId === plan.id}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {subscribingPlanId === plan.id ? "Processing..." : "Subscribe"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Wallet Info */}
            <div className="mt-8 bg-gray-900/50 rounded-xl border border-white/10 p-4 text-center">
              <div className="text-sm text-gray-400 mb-1">Connected Wallet</div>
              <div className="font-mono text-sm text-purple-400">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Declare window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

