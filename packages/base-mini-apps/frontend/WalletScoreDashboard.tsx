import React, { useState } from 'react';

interface WalletScore {
  score: number;
  risk: number;
  diversity: number;
  engagement: number;
}

export function WalletScoreDashboard() {
  const [walletAddress, setWalletAddress] = useState('');
  const [score, setScore] = useState<WalletScore | null>(null);
  const [loading, setLoading] = useState(false);

  const mockScore: WalletScore = {
    score: 85,
    risk: 15,
    diversity: 72,
    engagement: 90,
  };

  const handleAnalyze = () => {
    if (!walletAddress.trim()) return;
    setLoading(true);
    // TODO: Call /api/wallet-scoring/{address}
    setTimeout(() => {
      setScore(mockScore);
      setLoading(false);
    }, 1000);
  };

  const RadialBar = ({ value, label, color }: { value: number; label: string; color: string }) => {
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`text-${color}-500 transition-all`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{value}</span>
          </div>
        </div>
        <span className="text-xs mt-2 text-gray-400">{label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            📊 Wallet Score Dashboard
          </h1>
          <p className="text-gray-400 mb-6">Analyze wallet scoring metrics</p>

          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter wallet address (0x...)"
                className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || !walletAddress.trim()}
                className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          {score && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <RadialBar value={score.score} label="Score" color="cyan" />
                <RadialBar value={100 - score.risk} label="Safety" color="green" />
                <RadialBar value={score.diversity} label="Diversity" color="purple" />
                <RadialBar value={score.engagement} label="Engagement" color="yellow" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <h3 className="font-semibold mb-2">Overall Score</h3>
                  <div className="text-3xl font-bold text-cyan-400">{score.score}/100</div>
                  <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full transition-all"
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <h3 className="font-semibold mb-2">Risk Level</h3>
                  <div className="text-3xl font-bold text-green-400">{score.risk}%</div>
                  <p className="text-xs text-gray-400 mt-2">Lower is better</p>
                </div>

                <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <h3 className="font-semibold mb-2">Diversity Score</h3>
                  <div className="text-3xl font-bold text-purple-400">{score.diversity}%</div>
                  <p className="text-xs text-gray-400 mt-2">Portfolio diversity</p>
                </div>

                <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <h3 className="font-semibold mb-2">Engagement</h3>
                  <div className="text-3xl font-bold text-yellow-400">{score.engagement}%</div>
                  <p className="text-xs text-gray-400 mt-2">Activity level</p>
                </div>
              </div>
            </div>
          )}

          {!score && !loading && (
            <div className="text-center py-12 text-gray-400">
              <p>Enter a wallet address to analyze</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-400">
              📝 TODO: Connect to /api/wallet-scoring/{'{address}'} for real scoring data
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Integrate with wallet-scoring.ts server module
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

