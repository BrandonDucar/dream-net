import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  wallet: string;
  score: number;
  rank?: number;
  change?: number;
  magnetism?: number; // IMS Score
}

interface TopDream {
  title: string;
  remixes: number;
  heat: string;
  vaultRevenue: string;
  creator?: string;
  tags?: string[];
  emotion?: string;
  agent?: string;
  actions?: string[];
  magnetism?: number; // IMS Score
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  top_dreams: TopDream[];
  totalRevenue?: string;
  totalRemixes?: number;
  activeCreators?: number;
}

export default function DreamLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'wallets' | 'dreams'>('wallets');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (response.ok) {
          const leaderboardData = await response.json();
          setData(leaderboardData);
        } else {
          // Fallback to sample data for demo
          setData({
            leaderboard: [
              { wallet: "dreamer.eth", score: 912, rank: 1, change: 2 },
              { wallet: "echo.bnb", score: 888, rank: 2, change: -1 },
              { wallet: "starborn.sol", score: 861, rank: 3, change: 1 },
              { wallet: "void.base", score: 823, rank: 4, change: 0 },
              { wallet: "nexus.arb", score: 798, rank: 5, change: 3 }
            ],
            top_dreams: [
              {
                title: "Echo Reboot",
                remixes: 47,
                heat: "🔥🔥",
                vaultRevenue: "312 $SHEEP",
                creator: "dreamer.eth",
                tags: ["💡 Concept", "🚀 Launch"]
              },
              {
                title: "Signal Lost",
                remixes: 33,
                heat: "🔥",
                vaultRevenue: "147 $SHEEP",
                creator: "echo.bnb",
                tags: ["🎭 Drama", "⚡ Energy"]
              },
              {
                title: "Quantum Drift",
                remixes: 28,
                heat: "🔥",
                vaultRevenue: "89 $SHEEP",
                creator: "starborn.sol",
                tags: ["🌌 Cosmic", "🔬 Science"]
              },
              {
                title: "Whispers in Orbit",
                remixes: 22,
                heat: "🔥",
                vaultRevenue: "127 $SHEEP",
                creator: "starborn.sol",
                tags: ["🌟 Hope", "🌌 Cosmic", "💫 Whisper"],
                emotion: "Hope",
                agent: "Petal",
                actions: ["Remix", "Vault Peek", "Whisper"]
              }
            ],
            totalRevenue: "1,374 $SHEEP",
            totalRemixes: 334,
            activeCreators: 48
          });
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankChange = (change: number) => {
    if (change > 0) return <span className="text-green-400">↗ {change}</span>;
    if (change < 0) return <span className="text-red-400">↘ {Math.abs(change)}</span>;
    return <span className="text-gray-400">-</span>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 900) return 'text-yellow-400';
    if (score >= 800) return 'text-orange-400';
    if (score >= 700) return 'text-purple-400';
    return 'text-cyan-400';
  };

  const getHeatIntensity = (heat: string) => {
    const fireCount = (heat.match(/🔥/g) || []).length;
    if (fireCount >= 3) return 'bg-red-900 border-red-600';
    if (fireCount >= 2) return 'bg-orange-900 border-orange-600';
    return 'bg-yellow-900 border-yellow-600';
  };

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-cyan-700 p-6 rounded-xl text-white max-w-6xl mx-auto mt-10">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-zinc-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-zinc-900 border border-red-700 p-6 rounded-xl text-white max-w-6xl mx-auto mt-10">
        <h3 className="text-xl font-bold text-red-400">⚠️ Leaderboard Unavailable</h3>
        <p className="text-zinc-400 mt-2">Unable to load leaderboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-cyan-700 p-6 rounded-xl text-white max-w-6xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-cyan-400">🏆 Dream Network Leaderboard</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setView('wallets')}
            className={`px-4 py-2 rounded text-sm ${view === 'wallets' ? 'bg-cyan-600 text-white' : 'bg-zinc-700 text-zinc-300'
              }`}
          >
            👑 Top Wallets
          </button>
          <button
            onClick={() => setView('dreams')}
            className={`px-4 py-2 rounded text-sm ${view === 'dreams' ? 'bg-cyan-600 text-white' : 'bg-zinc-700 text-zinc-300'
              }`}
          >
            🌟 Top Dreams
          </button>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-800 p-4 rounded border border-cyan-600">
          <div className="text-sm text-cyan-300">Total Revenue</div>
          <div className="text-xl font-bold text-white">{data.totalRevenue || '0 $SHEEP'}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded border border-purple-600">
          <div className="text-sm text-purple-300">Total Remixes</div>
          <div className="text-xl font-bold text-white">{data.totalRemixes || 0}</div>
        </div>
        <div className="bg-zinc-800 p-4 rounded border border-green-600">
          <div className="text-sm text-green-300">Active Creators</div>
          <div className="text-xl font-bold text-white">{data.activeCreators || 0}</div>
        </div>
      </div>

      {view === 'wallets' ? (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-cyan-300 mb-4">Top Performing Wallets</h4>
          {data.leaderboard.map((entry, index) => (
            <div key={entry.wallet} className="bg-zinc-800 p-4 rounded border border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-cyan-400">#{entry.rank || index + 1}</div>
                <div>
                  <div className="font-medium text-white flex items-center gap-2">
                    {entry.wallet}
                    {entry.magnetism !== undefined && entry.magnetism > 5 && (
                      <span className="text-[8px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase animate-pulse">
                        IMS: {Math.round(entry.magnetism)}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-zinc-400">
                    Rank Change: {getRankChange(entry.change || 0)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${getScoreColor(entry.score)}`}>
                  {entry.score}
                </div>
                <div className="text-sm text-zinc-400">Dream Score</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-cyan-300 mb-4">Trending Dreams</h4>
          {data.top_dreams.map((dream, index) => (
            <div key={dream.title} className={`p-4 rounded border ${getHeatIntensity(dream.heat)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-bold text-white">{dream.title}</h5>
                    <span className="text-lg">{dream.heat}</span>
                    {dream.magnetism !== undefined && dream.magnetism > 5 && (
                      <span className="text-[8px] bg-purple-500/10 border border-purple-500/30 text-purple-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase animate-pulse">
                        IMS: {Math.round(dream.magnetism)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
                    <span>by {dream.creator || 'Anonymous'}</span>
                    {dream.agent && (
                      <span className="bg-purple-800 text-purple-100 px-2 py-1 rounded-full text-xs">
                        Agent: {dream.agent}
                      </span>
                    )}
                    {dream.emotion && (
                      <span className="bg-blue-800 text-blue-100 px-2 py-1 rounded-full text-xs">
                        {dream.emotion}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <span className="text-purple-300">🔁 {dream.remixes} remixes</span>
                    <span className="text-green-300">💰 {dream.vaultRevenue}</span>
                  </div>
                  {dream.actions && dream.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {dream.actions.map((action) => (
                        <button
                          key={action}
                          className="text-xs px-2 py-1 rounded bg-cyan-800 text-cyan-100 hover:bg-cyan-700 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                  {dream.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {dream.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-1 rounded-full ${tag.includes('🚀') || tag.includes('Launch')
                            ? 'bg-green-800 text-green-100'
                            : tag.includes('💡') || tag.includes('Concept')
                              ? 'bg-yellow-800 text-yellow-100'
                              : 'bg-purple-700 text-purple-100'
                            }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">#{index + 1}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-zinc-700 text-center">
        <p className="text-sm text-zinc-400">
          Last updated: {new Date().toLocaleString()} • Data refreshes every 5 minutes
        </p>
      </div>
    </div>
  );
}