import { useState } from "react";
import { DollarSign, Code, Sparkles, CheckCircle, X } from "lucide-react";
import { ethers } from "ethers";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface DreamContributionWidgetProps {
  dreamId: string;
  dreamName: string;
  dreamCreator: string;
  walletAddress: string | null;
  onContribute?: () => void;
  compact?: boolean;
}

type ContributionType = 'sponsor-full' | 'sponsor-partial' | 'tip' | 'skill' | 'service';

export function DreamContributionWidget({
  dreamId,
  dreamName,
  dreamCreator,
  walletAddress,
  onContribute,
  compact = false,
}: DreamContributionWidgetProps) {
  const [showModal, setShowModal] = useState(false);
  const [contributionType, setContributionType] = useState<ContributionType>('tip');
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<'ETH' | 'DREAM' | 'SHEEP'>('DREAM');
  const [skill, setSkill] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [contributing, setContributing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContribute = async () => {
    if (!walletAddress) {
      setError("Please connect your wallet");
      return;
    }

    setContributing(true);
    setError(null);

    try {
      let contributionData: any = {
        dreamId,
        contributor: walletAddress,
        message: message || undefined,
      };

      if (contributionType === 'sponsor-full' || contributionType === 'sponsor-partial' || contributionType === 'tip') {
        if (!amount || parseFloat(amount) <= 0) {
          throw new Error("Please enter a valid amount");
        }

        contributionData.type = 'financial';
        contributionData.amount = amount;
        contributionData.token = token;

        if (token === 'ETH') {
          const provider = new ethers.BrowserProvider(window.ethereum!);
          const signer = await provider.getSigner();
          const tx = await signer.sendTransaction({
            to: dreamCreator,
            value: ethers.parseEther(amount),
          });
          await tx.wait();
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

      const res = await fetch(`${API_BASE}/api/dreams/${dreamId}/contribute`, {
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

      setShowModal(false);
      setAmount("");
      setSkill("");
      setService("");
      setMessage("");
      
      if (onContribute) {
        onContribute();
      }
      
      alert(`Contribution recorded! Thank you for supporting this dream.`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setContributing(false);
    }
  };

  if (compact) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 transition text-sm"
        >
          <Sparkles className="inline-block h-4 w-4 mr-2" />
          Contribute
        </button>
        {showModal && (
          <ContributionModal
            dreamName={dreamName}
            contributionType={contributionType}
            setContributionType={setContributionType}
            amount={amount}
            setAmount={setAmount}
            token={token}
            setToken={setToken}
            skill={skill}
            setSkill={setSkill}
            service={service}
            setService={setService}
            message={message}
            setMessage={setMessage}
            contributing={contributing}
            error={error}
            onClose={() => setShowModal(false)}
            onSubmit={handleContribute}
            walletAddress={walletAddress}
          />
        )}
      </>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-xl border border-purple-500/30 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="h-6 w-6 text-purple-400" />
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Support This Dream
        </h3>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Help this dream evolve by contributing funds, skills, or services.
      </p>
      
      {!walletAddress ? (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm mb-3">Connect your wallet to contribute</p>
          <button
            onClick={() => {
              if (window.ethereum) {
                window.ethereum.request({ method: "eth_requestAccounts" });
              }
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-white transition text-sm"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setContributionType('tip')}
              className={`p-3 rounded-lg border-2 transition ${
                contributionType === 'tip'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <div className="text-2xl mb-1">💸</div>
              <div className="text-xs font-semibold">Tip</div>
            </button>
            <button
              onClick={() => setContributionType('skill')}
              className={`p-3 rounded-lg border-2 transition ${
                contributionType === 'skill'
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs font-semibold">Skill</div>
            </button>
          </div>

          {(contributionType === 'tip' || contributionType === 'sponsor-full' || contributionType === 'sponsor-partial') && (
            <div className="space-y-3 mb-4">
              <div>
                <input
                  type="number"
                  step="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.01"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
                />
              </div>
              <select
                value={token}
                onChange={(e) => setToken(e.target.value as 'ETH' | 'DREAM' | 'SHEEP')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
              >
                <option value="DREAM">DREAM</option>
                <option value="SHEEP">SHEEP</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
          )}

          {contributionType === 'skill' && (
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm mb-4 focus:border-purple-500 focus:outline-none"
            >
              <option value="">Select a skill...</option>
              <option value="coding">💻 Coding</option>
              <option value="design">🎨 Design</option>
              <option value="marketing">📢 Marketing</option>
              <option value="writing">✍️ Writing</option>
              <option value="strategy">🧠 Strategy</option>
              <option value="community">👥 Community</option>
            </select>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-2 mb-4 text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleContribute}
            disabled={contributing || !walletAddress}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {contributing ? "Processing..." : "Contribute"}
          </button>
        </>
      )}
    </div>
  );
}

function ContributionModal({
  dreamName,
  contributionType,
  setContributionType,
  amount,
  setAmount,
  token,
  setToken,
  skill,
  setSkill,
  service,
  setService,
  message,
  setMessage,
  contributing,
  error,
  onClose,
  onSubmit,
  walletAddress,
}: any) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-purple-500/30 max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Contribute to {dreamName}
        </h3>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {['tip', 'sponsor-partial', 'sponsor-full', 'skill', 'service'].map((type) => (
            <button
              key={type}
              onClick={() => setContributionType(type)}
              className={`p-2 rounded-lg border-2 transition text-xs ${
                contributionType === type
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              {type === 'tip' && '💸 Tip'}
              {type === 'sponsor-partial' && '💰 Partial'}
              {type === 'sponsor-full' && '💎 Full'}
              {type === 'skill' && '⚡ Skill'}
              {type === 'service' && '🛠️ Service'}
            </button>
          ))}
        </div>

        {(contributionType === 'tip' || contributionType === 'sponsor-full' || contributionType === 'sponsor-partial') && (
          <div className="space-y-3 mb-4">
            <input
              type="number"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
            />
            <select
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-purple-500 focus:outline-none"
            >
              <option value="DREAM">DREAM</option>
              <option value="SHEEP">SHEEP</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
        )}

        {contributionType === 'skill' && (
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm mb-4 focus:border-purple-500 focus:outline-none"
          >
            <option value="">Select a skill...</option>
            <option value="coding">💻 Coding</option>
            <option value="design">🎨 Design</option>
            <option value="marketing">📢 Marketing</option>
            <option value="writing">✍️ Writing</option>
            <option value="strategy">🧠 Strategy</option>
            <option value="community">👥 Community</option>
          </select>
        )}

        {contributionType === 'service' && (
          <textarea
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Describe the service..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm mb-4 focus:border-purple-500 focus:outline-none resize-none"
          />
        )}

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Optional message..."
          rows={2}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm mb-4 focus:border-purple-500 focus:outline-none resize-none"
        />

        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-2 mb-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={contributing || !walletAddress}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {contributing ? "Processing..." : "Submit Contribution"}
        </button>
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

