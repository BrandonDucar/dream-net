import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Heart, DollarSign, Code, Palette, Megaphone, Lightbulb, TrendingUp, Users, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Dream {
  id: string;
  name: string;
  title?: string;
  creator: string;
  description: string;
  image?: string;
  status: string;
  score: number;
  contributors?: Array<{
    wallet: string;
    role: 'Builder' | 'Artist' | 'Coder' | 'Visionary' | 'Promoter';
    joinedAt: string;
  }>;
  blessings?: Array<{
    wallet: string;
    message: string;
    amount: number;
    timestamp: number;
  }>;
  xp: number;
  level: number;
}

interface Contribution {
  id: string;
  dreamId: string;
  contributor: string;
  type: 'financial' | 'skill' | 'service';
  amount?: number;
  token?: 'ETH' | 'DREAM' | 'SHEEP';
  skill?: string;
  service?: string;
  message?: string;
  timestamp: string;
}

type ContributionType = 'sponsor-full' | 'sponsor-partial' | 'tip' | 'skill' | 'service';

export default function DreamContributions() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Contribution form state
  const [contributionType, setContributionType] = useState<ContributionType>('tip');
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<'ETH' | 'DREAM' | 'SHEEP'>('DREAM');
  const [skill, setSkill] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [contributing, setContributing] = useState(false);
  const [showContributionModal, setShowContributionModal] = useState(false);

  useEffect(() => {
    fetchDreams();
  }, []);

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask not detected. Please install MetaMask.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const fetchDreams = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/dreams`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: Dream[] = await res.json();
      // Filter for active dreams that can accept contributions
      const activeDreams = data.filter(d => d.status === 'Live' || d.status === 'Draft');
      setDreams(activeDreams);
    } catch (err) {
      console.error("Failed to fetch dreams:", err);
      setError("Failed to load dreams.");
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async () => {
    if (!walletAddress || !selectedDream) {
      setError("Please connect wallet and select a dream");
      return;
    }

    setContributing(true);
    setError(null);

    try {
      let contributionData: any = {
        dreamId: selectedDream.id,
        contributor: walletAddress,
        message: message || undefined,
      };

      if (contributionType === 'sponsor-full' || contributionType === 'sponsor-partial' || contributionType === 'tip') {
        // Financial contribution
        if (!amount || parseFloat(amount) <= 0) {
          throw new Error("Please enter a valid amount");
        }

        contributionData.type = 'financial';
        contributionData.amount = amount;
        contributionData.token = token;

        // Handle on-chain transaction if needed
        if (token === 'ETH') {
          // Send ETH directly
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const tx = await signer.sendTransaction({
            to: selectedDream.creator, // Send to dream creator
            value: ethers.parseEther(amount),
          });
          await tx.wait();
        } else {
          // For DREAM/SHEEP, would interact with token contracts
          // For now, record the contribution
        }
      } else if (contributionType === 'skill') {
        if (!skill) {
          throw new Error("Please specify your skill");
        }
        contributionData.type = 'skill';
        contributionData.skill = skill;
      } else if (contributionType === 'service') {
        if (!service) {
          throw new Error("Please describe the service you're offering");
        }
        contributionData.type = 'service';
        contributionData.service = service;
      }

      // Record contribution via API
      const res = await fetch(`${API_BASE}/api/dreams/${selectedDream.id}/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": walletAddress,
        },
        body: JSON.stringify(contributionData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to record contribution");
      }

      const result = await res.json();
      
      // Update local state
      await fetchDreams();
      setShowContributionModal(false);
      setAmount("");
      setSkill("");
      setService("");
      setMessage("");
      
      alert(`Contribution recorded! ${result.message || "Thank you for supporting this dream."}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setContributing(false);
    }
  };

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Dream Contributions
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Support dreams as they evolve. Contribute funds, skills, or services to help dreams reach their potential.
          </p>
        </div>

        {/* Wallet Connection */}
        {!walletAddress ? (
          <div className="bg-gray-900/50 rounded-xl border border-white/10 p-8 text-center mb-8">
            <p className="text-gray-400 mb-4">Connect your wallet to contribute to dreams</p>
            <button
              onClick={connectWallet}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="bg-gray-900/50 rounded-xl border border-purple-500/30 p-4 mb-6 text-center">
            <div className="text-sm text-gray-400 mb-1">Connected Wallet</div>
            <div className="font-mono text-sm text-purple-400">
              {formatAddress(walletAddress)}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6 text-red-200">
            {error}
          </div>
        )}

        {/* Dreams Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading dreams...</div>
        ) : dreams.length === 0 ? (
          <div className="bg-gray-900/50 rounded-xl border border-white/10 p-12 text-center">
            <div className="text-5xl mb-4">🌌</div>
            <h3 className="text-xl font-semibold mb-2">No Dreams Available</h3>
            <p className="text-gray-400">Check back later for dreams that need your support!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dreams.map((dream) => (
              <div
                key={dream.id}
                onClick={() => {
                  setSelectedDream(dream);
                  setShowContributionModal(true);
                }}
                className="group bg-gray-900/50 rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all cursor-pointer"
              >
                {/* Image */}
                {dream.image && (
                  <div className="relative h-48 w-full rounded-lg overflow-hidden mb-4">
                    <img
                      src={dream.image}
                      alt={dream.name || dream.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {dream.name || dream.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                  {dream.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{dream.contributors?.length || 0} contributors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>Level {dream.level}</span>
                  </div>
                </div>

                {/* Creator & Status */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="text-xs text-gray-500">
                    by <span className="text-cyan-400 font-mono">{formatAddress(dream.creator)}</span>
                  </div>
                  <div className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                    {dream.status}
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition text-sm">
                  Contribute
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Contribution Modal */}
        {showContributionModal && selectedDream && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setShowContributionModal(false)}
          >
            <div
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-purple-500/30 max-w-2xl w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowContributionModal(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                ✕
              </button>

              <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Contribute to Dream
              </h2>
              <p className="text-gray-400 mb-6">{selectedDream.name || selectedDream.title}</p>

              {/* Contribution Type Selection */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setContributionType('sponsor-full')}
                  className={`p-4 rounded-lg border-2 transition ${
                    contributionType === 'sponsor-full'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <div className="text-2xl mb-2">💎</div>
                  <div className="font-semibold">Full Sponsor</div>
                  <div className="text-xs text-gray-400 mt-1">Complete funding</div>
                </button>
                <button
                  onClick={() => setContributionType('sponsor-partial')}
                  className={`p-4 rounded-lg border-2 transition ${
                    contributionType === 'sponsor-partial'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-semibold">Partial Sponsor</div>
                  <div className="text-xs text-gray-400 mt-1">Significant support</div>
                </button>
                <button
                  onClick={() => setContributionType('tip')}
                  className={`p-4 rounded-lg border-2 transition ${
                    contributionType === 'tip'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <div className="text-2xl mb-2">💸</div>
                  <div className="font-semibold">Tip</div>
                  <div className="text-xs text-gray-400 mt-1">Small contribution</div>
                </button>
                <button
                  onClick={() => setContributionType('skill')}
                  className={`p-4 rounded-lg border-2 transition ${
                    contributionType === 'skill'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-semibold">Offer Skill</div>
                  <div className="text-xs text-gray-400 mt-1">Contribute expertise</div>
                </button>
              </div>

              {/* Financial Contribution Form */}
              {(contributionType === 'sponsor-full' || contributionType === 'sponsor-partial' || contributionType === 'tip') && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Amount</label>
                    <input
                      type="number"
                      step="0.001"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={contributionType === 'tip' ? "0.01" : "1.0"}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Token</label>
                    <select
                      value={token}
                      onChange={(e) => setToken(e.target.value as 'ETH' | 'DREAM' | 'SHEEP')}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="DREAM">DREAM</option>
                      <option value="SHEEP">SHEEP</option>
                      <option value="ETH">ETH</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Skill Contribution Form */}
              {contributionType === 'skill' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Your Skill</label>
                  <select
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select a skill...</option>
                    <option value="coding">💻 Coding/Development</option>
                    <option value="design">🎨 Design/UI/UX</option>
                    <option value="marketing">📢 Marketing/Promotion</option>
                    <option value="writing">✍️ Writing/Content</option>
                    <option value="strategy">🧠 Strategy/Planning</option>
                    <option value="community">👥 Community Building</option>
                    <option value="other">✨ Other</option>
                  </select>
                </div>
              )}

              {/* Service Contribution Form */}
              {contributionType === 'service' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Service Description</label>
                  <textarea
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="Describe the service you're offering (e.g., 'I can help with smart contract development', 'I'll create promotional graphics')"
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>
              )}

              {/* Message (Optional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message to the dream creator..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleContribute}
                disabled={contributing || !walletAddress}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {contributing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Submit Contribution
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

